import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { sendEmail } from '../_shared/email.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  try {
    const { lawyer_id, status, rejection_reason, email } = await req.json()

    if (!email || !status || !lawyer_id) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
    }

    // Obtener los datos del perfil del abogado para personalizar el correo
    const { data: profile, error: profileError } = await supabase
      .from('lawyer_profiles')
      .select('first_name, last_name_paternal')
      .eq('id', lawyer_id)
      .maybeSingle()

    if (profileError) {
      console.warn('Error fetching lawyer profile:', profileError)
    }

    const firstName = profile?.first_name || 'Abogado'
    const lastName = profile?.last_name_paternal || ''

    let subject = ''
    let templateName = ''
    let variables: Record<string, string | number> = {
      firstName,
      lastName,
      email,
    }

    if (status === 'approved') {
      subject = '¡Tu perfil ha sido aprobado en LegalPath!'
      templateName = 'aprobacionAbogado'
    } else if (status === 'rejected') {
      subject = 'Actualización sobre tu solicitud en LegalPath'
      templateName = 'rechazoAbogado'
      variables.rejectionReason = rejection_reason || 'No se especificó un motivo. Por favor revisa tus documentos.'
    } else if (status === 'pending' || status === 'submitted') {
      subject = 'Recibimos tus antecedentes 📄'
      templateName = 'abogadoPostulacionRevision'
    } else {
      return new Response(JSON.stringify({ error: 'Invalid status' }), { status: 400 })
    }

    await sendEmail({
      to: email,
      subject,
      templateName,
      variables,
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })

  } catch (error) {
    console.error('Error sending verification email:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
