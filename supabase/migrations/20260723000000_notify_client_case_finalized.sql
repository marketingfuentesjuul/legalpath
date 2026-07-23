-- 1. Actualizar la función notify_lawyer_case_closed para que notifique tanto al abogado como al cliente
CREATE OR REPLACE FUNCTION notify_lawyer_case_closed()
RETURNS TRIGGER AS $$
DECLARE
  v_supabase_url TEXT := 'https://wheslluscfpfqyuzywgy.supabase.co';
  v_service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZXNsbHVzY2ZwZnF5dXp5d2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5ODc4NSwiZXhwIjoyMDkwNTc0Nzg1fQ.Mpj-h3p80qNC1ZgEfEMGfFhIbpyq1fkzO9pl0nNAaxY';
  v_lawyer_email TEXT;
  v_lawyer_name TEXT;
  v_lawyer_fullname TEXT;
  v_client_name TEXT;
  v_client_email TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'finalizado' THEN
    -- Obtener datos del abogado asignado y del cliente
    SELECT 
      lp.email, 
      lp.first_name, 
      TRIM(COALESCE(lp.first_name, '') || ' ' || COALESCE(lp.last_name, '')),
      cp.first_name, 
      NEW.client_email
    INTO 
      v_lawyer_email, 
      v_lawyer_name, 
      v_lawyer_fullname,
      v_client_name, 
      v_client_email
    FROM proposals p
    JOIN lawyer_profiles lp ON p.lawyer_id = lp.id
    JOIN client_profiles cp ON NEW.user_id = cp.id
    WHERE p.case_id = NEW.id AND p.status = 'aceptada'
    LIMIT 1;

    -- Enviar correo al Abogado
    IF v_lawyer_email IS NOT NULL THEN
      PERFORM net.http_post(
        url     := v_supabase_url || '/functions/v1/send-email',
        headers := jsonb_build_object(
          'Content-Type',  'application/json',
          'Authorization', 'Bearer ' || v_service_role_key
        ),
        body    := jsonb_build_object(
          'to',           v_lawyer_email,
          'templateName', 'abogadoCasoCerrado',
          'variables',    jsonb_build_object(
            'firstName',  COALESCE(v_lawyer_name, 'Abogado'),
            'clientName', COALESCE(v_client_name, 'Cliente'),
            'caseTitle',  NEW.title
          )
        )
      );
    END IF;

    -- Enviar correo al Cliente notificando la finalización por el abogado
    IF v_client_email IS NOT NULL THEN
      PERFORM net.http_post(
        url     := v_supabase_url || '/functions/v1/send-email',
        headers := jsonb_build_object(
          'Content-Type',  'application/json',
          'Authorization', 'Bearer ' || v_service_role_key
        ),
        body    := jsonb_build_object(
          'to',           v_client_email,
          'templateName', 'clienteCasoFinalizado',
          'variables',    jsonb_build_object(
            'firstName',  COALESCE(v_client_name, 'Cliente'),
            'caseTitle',  NEW.title,
            'lawyerName', COALESCE(v_lawyer_fullname, 'su abogado')
          )
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrear el trigger para asegurar que esté enlazado correctamente
DROP TRIGGER IF EXISTS trg_case_closed ON cases;
CREATE TRIGGER trg_case_closed
  AFTER UPDATE OF status ON cases
  FOR EACH ROW
  EXECUTE FUNCTION notify_lawyer_case_closed();

-- 2. Modificar la política RLS cases_select para incluir casos finalizados
DROP POLICY IF EXISTS cases_select ON cases;

CREATE POLICY cases_select ON cases
  FOR SELECT
  USING (
    (auth.uid() = user_id)
    OR is_admin()
    OR (
      is_verified_lawyer() 
      AND (
        (status = 'activo'::case_status AND admin_status = 'aprobado'::admin_status)
        OR (
          status IN ('en_progreso'::case_status, 'finalizado'::case_status)
          AND is_case_lawyer(id, auth.uid())
        )
      )
    )
  );
