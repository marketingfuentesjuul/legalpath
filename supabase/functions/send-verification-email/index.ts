import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'npm:resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
const FROM_EMAIL = 'hola@legalpath.cl'  // cambiar por dominio real

serve(async (req) => {
  try {
    const { lawyer_id, status, rejection_reason, email } = await req.json()

    if (!email || !status) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
    }

    let subject = ''
    let html = ''

    if (status === 'approved') {
      subject = '¡Tu perfil ha sido aprobado en LegalPath!'
      html = `
        <h2>¡Bienvenido a LegalPath!</h2>
        <p>Tu perfil ha sido revisado y aprobado por nuestro equipo.</p>
        <p>A partir de ahora puedes acceder a tu dashboard, comprar tokens y postularte a casos disponibles.</p>
        <a href="https://legalpath.cl/dashboard" 
           style="background:#EE6C4D;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px;">
          Acceder al Dashboard
        </a>
        <p style="margin-top:24px;color:#666;font-size:14px;">
          Si tienes dudas, responde este correo y te ayudamos.
        </p>
      `
    } else if (status === 'rejected') {
      subject = 'Actualización sobre tu solicitud en LegalPath'
      html = `
        <h2>Actualización de tu perfil</h2>
        <p>Hemos revisado tu solicitud y por el momento no podemos aprobar tu perfil.</p>
        ${rejection_reason ? `<p><strong>Motivo:</strong> ${rejection_reason}</p>` : ''}
        <p>Puedes corregir la información y volver a enviar tu solicitud desde tu perfil.</p>
        <a href="https://legalpath.cl/perfil" 
           style="background:#EE6C4D;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px;">
          Actualizar mi perfil
        </a>
        <p style="margin-top:24px;color:#666;font-size:14px;">
          Si crees que esto es un error, responde este correo.
        </p>
      `
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })

  } catch (error) {
    console.error('Error sending verification email:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
