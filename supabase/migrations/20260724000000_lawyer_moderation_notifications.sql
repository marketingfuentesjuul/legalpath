-- Migration: Lawyer Profile Moderation (Suspension, Ban, and Reactivation) Notifications
-- Date: 2026-07-24

-- Drop duplicate trigger from old migrations that sends 'abogadoPerfilDesactivado'
DROP TRIGGER IF EXISTS trg_lawyer_suspended ON lawyer_profiles;

CREATE OR REPLACE FUNCTION notify_lawyer_moderation()
RETURNS TRIGGER AS $$
DECLARE
  v_supabase_url TEXT := 'https://wheslluscfpfqyuzywgy.supabase.co';
  v_service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZXNsbHVzY2ZwZnF5dXp5d2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5ODc4NSwiZXhwIjoyMDkwNTc0Nzg1fQ.Mpj-h3p80qNC1ZgEfEMGfFhIbpyq1fkzO9pl0nNAaxY';
  v_template_name TEXT;
  v_subject TEXT;
  v_send_email BOOLEAN := FALSE;
BEGIN
  -- Check if status changed to suspended
  IF NEW.status = 'suspended' AND (OLD.status IS DISTINCT FROM 'suspended') THEN
    v_template_name := 'abogadoPerfilSuspendido';
    v_subject := 'Tu cuenta en LegalPath ha sido suspendida ⚠️';
    v_send_email := TRUE;
  -- Check if status changed to banned
  ELSIF NEW.status = 'banned' AND (OLD.status IS DISTINCT FROM 'banned') THEN
    v_template_name := 'abogadoPerfilBaneado';
    v_subject := 'Tu cuenta en LegalPath ha sido bloqueada permanentemente 🚫';
    v_send_email := TRUE;
  -- Check if status changed to active from suspended
  ELSIF NEW.status = 'active' AND OLD.status = 'suspended' THEN
    v_template_name := 'abogadoPerfilReactivadoSuspension';
    v_subject := 'Tu cuenta en LegalPath ha sido reactivada 🎉';
    v_send_email := TRUE;
  -- Check if status changed to active from banned
  ELSIF NEW.status = 'active' AND OLD.status = 'banned' THEN
    v_template_name := 'abogadoPerfilReactivadoBan';
    v_subject := 'Tu cuenta en LegalPath ha sido restituida 🎉';
    v_send_email := TRUE;
  END IF;

  IF v_send_email THEN
    PERFORM net.http_post(
      url     := v_supabase_url || '/functions/v1/send-email',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || v_service_role_key
      ),
      body    := jsonb_build_object(
        'to',           NEW.email,
        'templateName', v_template_name,
        'subject',      v_subject,
        'variables',    jsonb_build_object(
          'firstName',  COALESCE(NEW.first_name, 'Abogado'),
          'reason',     COALESCE(NEW.suspension_reason, 'Infracción de los términos de la plataforma.')
        )
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger for moderation status changes
DROP TRIGGER IF EXISTS trg_lawyer_moderated ON lawyer_profiles;
CREATE TRIGGER trg_lawyer_moderated
  AFTER UPDATE OF status ON lawyer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_lawyer_moderation();
