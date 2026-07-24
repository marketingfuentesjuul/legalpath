-- Migration: Lawyer Profile Deletion Flow
-- Date: 2026-07-23

-- 1. Eliminar por completo los triggers de anonimización para mantener los datos de los usuarios intactos
DROP TRIGGER IF EXISTS trg_anonymize_lawyer ON lawyer_profiles;
DROP TRIGGER IF EXISTS trg_anonymize_client ON client_profiles;

-- 2. Modificar la función de notificación para usar los datos reales del registro (NEW) y ejecutarse AFTER UPDATE
CREATE OR REPLACE FUNCTION notify_lawyer_profile_deleted()
RETURNS TRIGGER AS $$
DECLARE
  v_supabase_url TEXT := 'https://wheslluscfpfqyuzywgy.supabase.co';
  v_service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZXNsbHVzY2ZwZnF5dXp5d2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5ODc4NSwiZXhwIjoyMDkwNTc0Nzg1fQ.Mpj-h3p80qNC1ZgEfEMGfFhIbpyq1fkzO9pl0nNAaxY';
BEGIN
  -- Verificar si el estado cambió a 'deleted' y antes no lo estaba
  IF NEW.status = 'deleted' AND (OLD.status IS DISTINCT FROM 'deleted') THEN
    PERFORM net.http_post(
      url     := v_supabase_url || '/functions/v1/send-email',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || v_service_role_key
      ),
      body    := jsonb_build_object(
        'to',           NEW.email, -- Enviamos al correo real del abogado que ahora se mantiene
        'templateName', 'abogadoPerfilEliminado',
        'subject',      'Tu perfil en LegalPath',
        'variables',    jsonb_build_object(
          'firstName',  COALESCE(NEW.first_name, 'Abogado')
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recrear el trigger para ejecutarse AFTER UPDATE en la tabla lawyer_profiles
DROP TRIGGER IF EXISTS trg_lawyer_deleted ON lawyer_profiles;
CREATE TRIGGER trg_lawyer_deleted
  AFTER UPDATE OF status ON lawyer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_lawyer_profile_deleted();
