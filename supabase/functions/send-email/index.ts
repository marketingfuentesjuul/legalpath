import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { sendEmail } from '../_shared/email.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://legalpath.cl',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Esta función solo debe ser invocada server-to-server (triggers de base de datos,
  // otras Edge Functions) usando la Service Role Key. Nunca debe ser llamable desde
  // el navegador de un visitante con la clave anon pública.
  const authHeader = req.headers.get('Authorization') || ''
  const providedToken = authHeader.replace('Bearer ', '')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  if (providedToken !== serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const { to, subject, templateName, variables } = await req.json()

    if (!to || !templateName || !variables) {
      return new Response(JSON.stringify({ error: 'Missing fields (to, templateName, variables)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Truncate proposal message if it's too long
    if (templateName === 'clienteNuevaPropuesta' && typeof variables.proposalMessage === 'string') {
      const msg = variables.proposalMessage.trim();
      const maxChars = 300;
      if (msg.length > maxChars) {
        const truncated = msg.substring(0, maxChars);
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > maxChars * 0.8) {
          variables.proposalMessage = truncated.substring(0, lastSpace).trim() + '...';
        } else {
          variables.proposalMessage = truncated.trim() + '...';
        }
      } else {
        variables.proposalMessage = msg;
      }
    }

    // Default subjects if not provided
    let finalSubject = subject
    if (!finalSubject) {
      if (templateName === 'aprobacionAbogado') finalSubject = '¡Tu perfil ha sido aprobado en LegalPath! 🎉'
      else if (templateName === 'rechazoAbogado') finalSubject = 'Actualización de tu perfil en LegalPath'
      else if (templateName === 'abogadoPostulacionRevision') finalSubject = 'Recibimos tus antecedentes 📄'
      else if (templateName === 'bienvenidaAbogado') finalSubject = '¡Bienvenido a LegalPath! 🚀'
      else if (templateName === 'clienteBienvenida') finalSubject = 'Tu camino legal comienza aquí 🚀'
      else if (templateName === 'clienteRecepcionCaso') finalSubject = 'Tu caso está en evaluación 📄'
      else if (templateName === 'clienteCasoAprobado') finalSubject = '¡Tu caso ha sido aprobado! 🎉'
      else if (templateName === 'clienteCasoRechazado') finalSubject = 'Actualización sobre tu caso en LegalPath'
      else if (templateName === 'clienteNuevaPropuesta') finalSubject = 'Recibiste una nueva propuesta 💼'
      else if (templateName === 'clientePropuestaAceptada') finalSubject = '¡Propuesta aceptada con éxito! 🤝'
      else if (templateName === 'clienteCasoFinalizado') finalSubject = 'Tu caso ha sido finalizado ⚖️'
      else if (templateName === 'abogadoPropuestaAceptada') finalSubject = '¡Tu propuesta fue aceptada! 🎉'
      else if (templateName === 'abogadoCasoCerrado') finalSubject = 'El caso ha sido finalizado ⚖️'
      else if (templateName === 'abogadoCasoFinalizado') finalSubject = '¡Has finalizado el caso con éxito! 🎉'
      else if (templateName === 'abogadoPerfilEliminado') finalSubject = 'Tu perfil en LegalPath'
      else if (templateName === 'abogadoPerfilSuspendido') finalSubject = 'Tu cuenta en LegalPath ha sido suspendida ⚠️'
      else if (templateName === 'abogadoPerfilBaneado') finalSubject = 'Tu cuenta en LegalPath ha sido bloqueada permanentemente 🚫'
      else if (templateName === 'abogadoPerfilReactivadoSuspension') finalSubject = 'Tu cuenta en LegalPath ha sido reactivada 🎉'
      else if (templateName === 'abogadoPerfilReactivadoBan') finalSubject = 'Tu cuenta en LegalPath ha sido restituida 🎉'
      else if (templateName === 'compraTokens') finalSubject = '¡Gracias por tu compra! 💳'
      else if (templateName === 'adminNuevoAbogado') finalSubject = '[ADMIN] Validación de abogado pendiente ⚖️'
      else if (templateName === 'adminNuevoCaso') finalSubject = '[ADMIN] Nuevo caso pendiente de moderación 📝'
      else finalSubject = 'Notificación de LegalPath'
    }

    await sendEmail({
      to,
      subject: finalSubject,
      templateName,
      variables,
    })

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
