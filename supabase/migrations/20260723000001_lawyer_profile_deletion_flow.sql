-- Migration: Lawyer Profile Deletion Flow
-- Date: 2026-07-23

-- 1. Corregir la función anonymize_profile para usar columnas reales existentes en lawyer_profiles y client_profiles
CREATE OR REPLACE FUNCTION anonymize_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'deleted' AND (OLD.status IS DISTINCT FROM 'deleted') THEN
    NEW.first_name := 'Usuario';
    NEW.email := 'deleted_' || substr(NEW.id::text, 1, 8) || '@legalpath.cl';
    NEW.deleted_at := NOW();
    
    -- Limpieza para lawyer_profiles
    IF TG_TABLE_NAME = 'lawyer_profiles' THEN
      NEW.last_name := 'Eliminado';
      NEW.last_name_paternal := 'Eliminado';
      NEW.last_name_maternal := NULL;
      NEW.rut_personal := NULL;
      NEW.rut_pjud := NULL;
      NEW.avatar_url := NULL;
      NEW.specialties := NULL;
      NEW.region := NULL;
      NEW.city := NULL;
      NEW.colegio_id := NULL;
      NEW.rejection_reason := NULL;
      NEW.admin_notes := NULL;
      
    -- Limpieza para client_profiles
    ELSIF TG_TABLE_NAME = 'client_profiles' THEN
      NEW.last_name := 'Eliminado';
      NEW.last_name_paternal := 'Eliminado';
      NEW.last_name_maternal := NULL;
      NEW.avatar_url := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger para notificar al abogado cuando su perfil profesional es eliminado
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
        'to',           OLD.email, -- Enviamos al correo original antes de ser anonimizado
        'templateName', 'abogadoPerfilEliminado',
        'subject',      'Tu perfil en LegalPath',
        'variables',    jsonb_build_object(
          'firstName',  COALESCE(OLD.first_name, 'Abogado')
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrear el trigger en la tabla lawyer_profiles
DROP TRIGGER IF EXISTS trg_lawyer_deleted ON lawyer_profiles;
CREATE TRIGGER trg_lawyer_deleted
  BEFORE UPDATE OF status ON lawyer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_lawyer_profile_deleted();

