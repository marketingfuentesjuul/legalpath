import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // NOTE: El envío de correos de verificación (pendiente, aprobado, rechazado) ahora es gestionado
  // de manera centralizada por el trigger de base de datos 'on_lawyer_verification_status_change'
  // en la tabla 'lawyer_profiles'.
  // Esta Edge Function ha sido deprecada para evitar correos duplicados de clientes/frontend desactualizados,
  // y simplemente retorna éxito.
  try {
    return new Response(JSON.stringify({ success: true, message: 'Handled by DB trigger' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in send-verification-email no-op:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})


