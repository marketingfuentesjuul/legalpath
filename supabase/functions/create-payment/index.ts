// supabase/functions/create-payment/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // Verificar que el usuario está autenticado
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return new Response('Unauthorized', { status: 401 })

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (authError || !user) return new Response('Unauthorized', { status: 401 })

    const { packageId, provider } = await req.json()
    // provider: 'flow' | 'mercadopago'

    if (!packageId || !provider) {
      return new Response('Missing packageId or provider', { status: 400 })
    }

    // Obtener datos del paquete (utilizando la columna tokens corregida)
    const { data: pkg, error: pkgError } = await supabase
      .from('token_packages')
      .select('id, name, tokens, price_clp')
      .eq('id', packageId)
      .eq('is_active', true)
      .single()

    if (pkgError || !pkg) {
      return new Response('Package not found', { status: 404 })
    }

    // El commerceOrder identifica la compra en el webhook
    // Formato: "LAWYER_UUID:PACKAGE_UUID"
    const commerceOrder = `${user.id}:${pkg.id}`
    const appUrl = Deno.env.get('APP_URL')!
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!

    let checkoutUrl: string

    if (provider === 'flow') {
      checkoutUrl = await createFlowPayment({
        commerceOrder,
        amount: pkg.price_clp,
        subject: `LegalPath — Paquete ${pkg.name} (${pkg.tokens} tokens)`,
        urlReturn: `${appUrl}/dashboard/tokens/confirmacion`,
        urlConfirmation: `${supabaseUrl}/functions/v1/payment-webhook?provider=flow`,
      })
    } else if (provider === 'mercadopago') {
      checkoutUrl = await createMercadoPagoPayment({
        commerceOrder,
        amount: pkg.price_clp,
        description: `LegalPath — Paquete ${pkg.name} (${pkg.tokens} tokens)`,
        successUrl: `${appUrl}/dashboard/tokens/confirmacion`,
        failureUrl: `${appUrl}/dashboard/tokens/error`,
      })
    } else {
      return new Response('Invalid provider', { status: 400 })
    }

    return new Response(
      JSON.stringify({ checkoutUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('create-payment error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// ── FLOW ─────────────────────────────────────────────────────────────────────

async function createFlowPayment({
  commerceOrder, amount, subject, urlReturn, urlConfirmation
}: {
  commerceOrder: string
  amount: number
  subject: string
  urlReturn: string
  urlConfirmation: string
}): Promise<string> {
  const apiKey    = Deno.env.get('FLOW_API_KEY')!
  const secretKey = Deno.env.get('FLOW_SECRET_KEY')!
  const flowUrl   = Deno.env.get('FLOW_API_URL')!

  const params: Record<string, string> = {
    apiKey,
    commerceOrder,
    subject,
    amount: amount.toString(),
    email: '',
    urlReturn,
    urlConfirmation,
    paymentMethod: '9',  // todos los métodos disponibles
  }

  // Firma HMAC-SHA256 requerida por Flow
  const sortedKeys = Object.keys(params).sort()
  const toSign = sortedKeys.map(k => `${k}${params[k]}`).join('')
  params['s'] = await hmacSha256(secretKey, toSign)

  const response = await fetch(`${flowUrl}/payment/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params),
  })

  const data = await response.json()
  if (!data.url || !data.token) {
    throw new Error(`Flow create payment failed: ${JSON.stringify(data)}`)
  }

  return `${data.url}?token=${data.token}`
}

// ── MERCADOPAGO ───────────────────────────────────────────────────────────────

async function createMercadoPagoPayment({
  commerceOrder, amount, description, successUrl, failureUrl
}: {
  commerceOrder: string
  amount: number
  description: string
  successUrl: string
  failureUrl: string
}): Promise<string> {
  const accessToken = Deno.env.get('MP_ACCESS_TOKEN')!

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [{
        title: description,
        quantity: 1,
        unit_price: amount,
        currency_id: 'CLP',
      }],
      external_reference: commerceOrder,
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: successUrl,
      },
      auto_return: 'approved',
    }),
  })

  const data = await response.json()
  if (!data.init_point) {
    throw new Error(`MercadoPago create preference failed: ${JSON.stringify(data)}`)
  }

  return data.init_point
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
