// supabase/functions/payment-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { sendEmail } from '../_shared/email.ts'

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
  // Obtener lawyerId y packageId desde el commerceOrder
  let lawyerId: string
  let packageId: string

  // Si contiene un dos puntos (":"), es el formato antiguo (para compatibilidad)
  if (commerceOrder.includes(':')) {
    const parts = commerceOrder.split(':')
    lawyerId = parts[0]
    packageId = parts[1]
  } else {
    // Es el formato nuevo (ID de la fila de pagos)
    const { data: paymentRecord, error: selectError } = await supabase
      .from('payments')
      .select('lawyer_id, package_id')
      .eq('id', commerceOrder)
      .maybeSingle()

    if (selectError || !paymentRecord) {
      console.error(`Payment record with transaction ID ${commerceOrder} not found.`)
      return
    }
    lawyerId = paymentRecord.lawyer_id
    packageId = paymentRecord.package_id
  }

  // IDEMPOTENCIA — no procesar el mismo pago dos veces
  const { data: existing } = await supabase
    .from('payments')
    .select('id, status')
    .eq('provider_payment_id', providerPaymentId)
    .maybeSingle()

  if (existing && existing.status === 'succeeded') {
    console.log(`Payment ${providerPaymentId} already processed as succeeded. Skipping.`)
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

  // 1. Registrar o actualizar el pago
  if (!commerceOrder.includes(':')) {
    // Formato nuevo: actualizar fila existente
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'succeeded',
        provider_payment_id: providerPaymentId,
        tokens_granted: pkg.tokens,
        amount: amountClp // update with confirmed amount
      })
      .eq('id', commerceOrder)

    if (updateError) throw updateError
  } else {
    // Formato antiguo: crear nueva fila en pagos
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        lawyer_id: lawyerId,
        package_id: packageId,
        amount: amountClp,
        provider,
        provider_payment_id: providerPaymentId,
        status: 'succeeded',
        tokens_granted: pkg.tokens
      })

    if (paymentError) throw paymentError
  }

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

  // 3. Enviar correo de confirmación de compra
  try {
    const { data: profile } = await supabase
      .from('lawyer_profiles')
      .select('first_name, last_name_paternal, email')
      .eq('id', lawyerId)
      .maybeSingle()

    if (profile && profile.email) {
      await sendEmail({
        to: profile.email,
        subject: `Confirmación de compra: ${pkg.name} — LegalPath`,
        templateName: 'compraTokens',
        variables: {
          firstName: profile.first_name || 'Abogado',
          lastName: profile.last_name_paternal || '',
          email: profile.email,
          pkgName: pkg.name,
          tokensCount: pkg.tokens,
          amountClp: amountClp,
          provider: provider === 'mercadopago' ? 'Mercado Pago' : 'Flow'
        }
      })
      console.log(`✉️ Purchase confirmation email sent to ${profile.email}`)
    } else {
      console.warn(`Could not send purchase confirmation: profile or email not found for lawyer ${lawyerId}`)
    }
  } catch (emailErr) {
    console.error('Error sending purchase confirmation email:', emailErr)
  }
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
