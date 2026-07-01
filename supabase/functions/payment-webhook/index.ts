// supabase/functions/payment-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
  const url = new URL(req.url)
  const provider = url.searchParams.get('provider')

  try {
    if (provider === 'flow') {
      return await handleFlowWebhook(req)
    } else if (provider === 'mercadopago') {
      return await handleMercadoPagoWebhook(req)
    } else {
      return new Response('Unknown provider', { status: 400 })
    }
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response('Internal error', { status: 500 })
  }
})

// ── FLOW ─────────────────────────────────────────────────────────────────────

async function handleFlowWebhook(req: Request): Promise<Response> {
  const body = await req.formData()
  const token = body.get('token') as string
  if (!token) return new Response('Missing token', { status: 400 })

  const apiKey    = Deno.env.get('FLOW_API_KEY')!
  const secretKey = Deno.env.get('FLOW_SECRET_KEY')!
  const flowUrl   = Deno.env.get('FLOW_API_URL')!

  // Verificar el pago con la API de Flow
  const params = new URLSearchParams({ apiKey, token })
  const signature = await hmacSha256(secretKey, `apiKey${apiKey}token${token}`)
  params.set('s', signature)

  const response = await fetch(`${flowUrl}/payment/getStatus?${params}`)
  const payment = await response.json()

  // Status 2 = pagado en Flow
  if (payment.status !== 2) {
    return new Response('Payment not confirmed', { status: 200 })
  }

  await creditTokens({
    providerPaymentId: payment.flowOrder.toString(),
    provider: 'flow',
    amountClp: payment.amount,
    commerceOrder: payment.commerceOrder,
  })

  return new Response('OK', { status: 200 })
}

// ── MERCADOPAGO ───────────────────────────────────────────────────────────────

async function handleMercadoPagoWebhook(req: Request): Promise<Response> {
  const body = await req.json()

  if (body.type !== 'payment') {
    return new Response('Not a payment event', { status: 200 })
  }

  const paymentId = body.data?.id
  if (!paymentId) return new Response('Missing payment id', { status: 400 })

  const accessToken = Deno.env.get('MP_ACCESS_TOKEN')!
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  const payment = await response.json()

  if (payment.status !== 'approved') {
    return new Response('Payment not approved', { status: 200 })
  }

  await creditTokens({
    providerPaymentId: paymentId.toString(),
    provider: 'mercadopago',
    amountClp: Math.round(payment.transaction_amount),
    commerceOrder: payment.external_reference,
  })

  return new Response('OK', { status: 200 })
}

// ── ACREDITACIÓN DE TOKENS (lógica compartida) ────────────────────────────────

async function creditTokens({
  providerPaymentId, provider, amountClp, commerceOrder
}: {
  providerPaymentId: string
  provider: string
  amountClp: number
  commerceOrder: string
}) {
  // commerceOrder formato: "LAWYER_UUID:PACKAGE_UUID"
  const [lawyerId, packageId] = commerceOrder.split(':')

  // IDEMPOTENCIA — no procesar el mismo pago dos veces
  const { data: existing } = await supabase
    .from('payments')
    .select('id')
    .eq('provider_payment_id', providerPaymentId)
    .maybeSingle()

  if (existing) {
    console.log(`Payment ${providerPaymentId} already processed. Skipping.`)
    return
  }

  // Obtener datos del paquete (tokens)
  const { data: pkg, error: pkgError } = await supabase
    .from('token_packages')
    .select('id, name, tokens')
    .eq('id', packageId)
    .single()

  if (pkgError || !pkg) {
    throw new Error(`Package ${packageId} not found`)
  }

  // 1. Registrar el pago
  const { data: paymentRecord, error: paymentError } = await supabase
    .from('payments')
    .insert({
      lawyer_id: lawyerId,
      package_id: packageId,
      amount: amountClp,
      provider,
      provider_payment_id: providerPaymentId,
      status: 'succeeded', // En la DB anterior es 'succeeded' o 'completed', let's use 'succeeded' as in the mock and user checks.
      tokens_granted: pkg.tokens
    })
    .select('id')
    .single()

  if (paymentError) throw paymentError

  // 2. Acreditar tokens en el ledger
  const { error: ledgerError } = await supabase
    .from('token_ledger')
    .insert({
      lawyer_id: lawyerId,
      amount: pkg.tokens,                       // positivo = crédito
      transaction_type: 'purchase',
      reference_id: paymentRecord!.id,
      reference_type: 'payments',
      note: `Compra paquete ${pkg.name} (${pkg.tokens} tokens)`,
    })

  if (ledgerError) throw ledgerError

  console.log(`✅ Credited ${pkg.tokens} tokens to lawyer ${lawyerId} via ${provider}`)
}

// ── UTILIDAD HMAC-SHA256 ─────────────────────────────────────────────────────

async function hmacSha256(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
