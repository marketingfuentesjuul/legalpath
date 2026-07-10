-- 1. Agregar columnas de control a la tabla cases para deduplicación y tracking
ALTER TABLE cases
  ADD COLUMN IF NOT EXISTS survey_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_reminder_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reminder_count INTEGER DEFAULT 0;

-- 2. Trigger para cliente-recepcion-caso
CREATE OR REPLACE FUNCTION notify_client_case_received()
RETURNS TRIGGER AS $$
DECLARE
  v_supabase_url TEXT := 'https://wheslluscfpfqyuzywgy.supabase.co';
  v_service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZXNsbHVzY2ZwZnF5dXp5d2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5ODc4NSwiZXhwIjoyMDkwNTc0Nzg1fQ.Mpj-h3p80qNC1ZgEfEMGfFhIbpyq1fkzO9pl0nNAaxY';
  v_first_name TEXT;
BEGIN
  SELECT first_name INTO v_first_name
  FROM client_profiles
  WHERE id = NEW.user_id;

  PERFORM net.http_post(
    url     := v_supabase_url || '/functions/v1/send-email',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || v_service_role_key
    ),
    body    := jsonb_build_object(
      'to',           NEW.client_email,
      'templateName', 'clienteRecepcionCaso',
      'variables',    jsonb_build_object(
        'firstName',  COALESCE(v_first_name, 'Cliente'),
        'caseTitle',  NEW.title
      )
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_case_created ON cases;
CREATE TRIGGER trg_case_created
  AFTER INSERT ON cases
  FOR EACH ROW
  EXECUTE FUNCTION notify_client_case_received();

-- 3. Trigger para cliente-caso-aprobado / cliente-caso-rechazado
CREATE OR REPLACE FUNCTION notify_client_case_moderation()
RETURNS TRIGGER AS $$
DECLARE
  v_supabase_url TEXT := 'https://wheslluscfpfqyuzywgy.supabase.co';
  v_service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZXNsbHVzY2ZwZnF5dXp5d2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5ODc4NSwiZXhwIjoyMDkwNTc0Nzg1fQ.Mpj-h3p80qNC1ZgEfEMGfFhIbpyq1fkzO9pl0nNAaxY';
  v_first_name TEXT;
  v_template_name TEXT;
  v_subject TEXT;
BEGIN
  IF OLD.admin_status IS DISTINCT FROM NEW.admin_status THEN
    IF NEW.admin_status = 'aprobado' THEN
      v_template_name := 'clienteCasoAprobado';
      v_subject := '¡Tu caso ha sido aprobado! 🎉';
    ELSIF NEW.admin_status = 'rechazado' THEN
      v_template_name := 'clienteCasoRechazado';
      v_subject := 'Actualización sobre tu caso en LegalPath';
    ELSE
      RETURN NEW;
    END IF;

    SELECT first_name INTO v_first_name
    FROM client_profiles
    WHERE id = NEW.user_id;

    PERFORM net.http_post(
      url     := v_supabase_url || '/functions/v1/send-email',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || v_service_role_key
      ),
      body    := jsonb_build_object(
        'to',           NEW.client_email,
        'templateName', v_template_name,
        'subject',      v_subject,
        'variables',    jsonb_build_object(
          'firstName',  COALESCE(v_first_name, 'Cliente'),
          'caseTitle',  NEW.title,
          'caseId',     NEW.id
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_case_moderated ON cases;
CREATE TRIGGER trg_case_moderated
  AFTER UPDATE OF admin_status ON cases
  FOR EACH ROW
  EXECUTE FUNCTION notify_client_case_moderation();

-- 4. Trigger para cliente-nueva-propuesta
CREATE OR REPLACE FUNCTION notify_client_new_proposal()
RETURNS TRIGGER AS $$
DECLARE
  v_supabase_url TEXT := 'https://wheslluscfpfqyuzywgy.supabase.co';
  v_service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZXNsbHVzY2ZwZnF5dXp5d2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5ODc4NSwiZXhwIjoyMDkwNTc0Nzg1fQ.Mpj-h3p80qNC1ZgEfEMGfFhIbpyq1fkzO9pl0nNAaxY';
  v_client_email TEXT;
  v_client_name TEXT;
  v_case_title TEXT;
  v_lawyer_name TEXT;
BEGIN
  SELECT c.client_email, cp.first_name, c.title
  INTO v_client_email, v_client_name, v_case_title
  FROM cases c
  JOIN client_profiles cp ON c.user_id = cp.id
  WHERE c.id = NEW.case_id;

  SELECT first_name INTO v_lawyer_name
  FROM lawyer_profiles
  WHERE id = NEW.lawyer_id;

  PERFORM net.http_post(
    url     := v_supabase_url || '/functions/v1/send-email',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || v_service_role_key
    ),
    body    := jsonb_build_object(
      'to',           v_client_email,
      'templateName', 'clienteNuevaPropuesta',
      'variables',    jsonb_build_object(
        'firstName',  COALESCE(v_client_name, 'Cliente'),
        'lawyerName', COALESCE(v_lawyer_name, 'Abogado'),
        'caseTitle',  v_case_title,
        'caseId',     NEW.case_id
      )
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_proposal_created ON proposals;
CREATE TRIGGER trg_proposal_created
  AFTER INSERT ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION notify_client_new_proposal();

-- 5. Trigger para cliente-propuesta-aceptada y abogado-propuesta-aceptada
CREATE OR REPLACE FUNCTION notify_proposal_accepted()
RETURNS TRIGGER AS $$
DECLARE
  v_supabase_url TEXT := 'https://wheslluscfpfqyuzywgy.supabase.co';
  v_service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZXNsbHVzY2ZwZnF5dXp5d2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5ODc4NSwiZXhwIjoyMDkwNTc0Nzg1fQ.Mpj-h3p80qNC1ZgEfEMGfFhIbpyq1fkzO9pl0nNAaxY';
  v_client_email TEXT;
  v_client_name TEXT;
  v_lawyer_email TEXT;
  v_lawyer_name TEXT;
  v_case_title TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'aceptada' THEN
    SELECT c.client_email, cp.first_name, c.title
    INTO v_client_email, v_client_name, v_case_title
    FROM cases c
    JOIN client_profiles cp ON c.user_id = cp.id
    WHERE c.id = NEW.case_id;

    SELECT email, first_name INTO v_lawyer_email, v_lawyer_name
    FROM lawyer_profiles
    WHERE id = NEW.lawyer_id;

    -- Correo al Cliente
    PERFORM net.http_post(
      url     := v_supabase_url || '/functions/v1/send-email',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || v_service_role_key
      ),
      body    := jsonb_build_object(
        'to',           v_client_email,
        'templateName', 'clientePropuestaAceptada',
        'variables',    jsonb_build_object(
          'firstName',  COALESCE(v_client_name, 'Cliente'),
          'lawyerName', COALESCE(v_lawyer_name, 'Abogado'),
          'caseTitle',  v_case_title,
          'caseId',     NEW.case_id
        )
      )
    );

    -- Correo al Abogado
    PERFORM net.http_post(
      url     := v_supabase_url || '/functions/v1/send-email',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || v_service_role_key
      ),
      body    := jsonb_build_object(
        'to',           v_lawyer_email,
        'templateName', 'abogadoPropuestaAceptada',
        'variables',    jsonb_build_object(
          'firstName',  COALESCE(v_lawyer_name, 'Abogado'),
          'clientName', COALESCE(v_client_name, 'Cliente'),
          'caseTitle',  v_case_title,
          'caseId',     NEW.case_id
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_proposal_accepted ON proposals;
CREATE TRIGGER trg_proposal_accepted
  AFTER UPDATE OF status ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION notify_proposal_accepted();

-- 6. Trigger para abogado-caso-cerrado
CREATE OR REPLACE FUNCTION notify_lawyer_case_closed()
RETURNS TRIGGER AS $$
DECLARE
  v_supabase_url TEXT := 'https://wheslluscfpfqyuzywgy.supabase.co';
  v_service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZXNsbHVzY2ZwZnF5dXp5d2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5ODc4NSwiZXhwIjoyMDkwNTc0Nzg1fQ.Mpj-h3p80qNC1ZgEfEMGfFhIbpyq1fkzO9pl0nNAaxY';
  v_lawyer_email TEXT;
  v_lawyer_name TEXT;
  v_client_name TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'cerrado' THEN
    SELECT lp.email, lp.first_name, cp.first_name
    INTO v_lawyer_email, v_lawyer_name, v_client_name
    FROM proposals p
    JOIN lawyer_profiles lp ON p.lawyer_id = lp.id
    JOIN client_profiles cp ON NEW.user_id = cp.id
    WHERE p.case_id = NEW.id AND p.status = 'aceptada'
    LIMIT 1;

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
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_case_closed ON cases;
CREATE TRIGGER trg_case_closed
  AFTER UPDATE OF status ON cases
  FOR EACH ROW
  EXECUTE FUNCTION notify_lawyer_case_closed();

-- 7. Trigger para abogado-compra-tokens
CREATE OR REPLACE FUNCTION notify_lawyer_token_purchase()
RETURNS TRIGGER AS $$
DECLARE
  v_supabase_url TEXT := 'https://wheslluscfpfqyuzywgy.supabase.co';
  v_service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZXNsbHVzY2ZwZnF5dXp5d2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5ODc4NSwiZXhwIjoyMDkwNTc0Nzg1fQ.Mpj-h3p80qNC1ZgEfEMGfFhIbpyq1fkzO9pl0nNAaxY';
  v_email TEXT;
  v_first_name TEXT;
  v_last_name TEXT;
  v_amount_clp TEXT;
  v_pkg_name TEXT;
  v_provider TEXT;
BEGIN
  IF NEW.transaction_type = 'purchase' THEN
    SELECT email, first_name, last_name_paternal 
    INTO v_email, v_first_name, v_last_name
    FROM lawyer_profiles 
    WHERE id = NEW.lawyer_id;

    SELECT p.provider, p.amount 
    INTO v_provider, v_amount_clp
    FROM payments p
    WHERE p.id = NEW.reference_id;

    v_pkg_name := COALESCE(split_part(NEW.note, ' (', 1), 'Paquete de Tokens');

    PERFORM net.http_post(
      url     := v_supabase_url || '/functions/v1/send-email',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || v_service_role_key
      ),
      body    := jsonb_build_object(
        'to',           v_email,
        'templateName', 'compraTokens',
        'variables',    jsonb_build_object(
          'firstName',   COALESCE(v_first_name, 'Abogado'),
          'lastName',    COALESCE(v_last_name, ''),
          'email',       v_email,
          'pkgName',     v_pkg_name,
          'tokensCount', NEW.amount,
          'amountClp',   '$' || to_char(v_amount_clp::numeric, 'FM999G999G999'),
          'provider',    COALESCE(v_provider, 'pago')
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_token_purchase ON token_ledger;
CREATE TRIGGER trg_token_purchase
  AFTER INSERT ON token_ledger
  FOR EACH ROW
  EXECUTE FUNCTION notify_lawyer_token_purchase();

-- 8. Trigger para cliente-bienvenida
CREATE OR REPLACE FUNCTION notify_client_welcome()
RETURNS TRIGGER AS $$
DECLARE
  v_supabase_url TEXT := 'https://wheslluscfpfqyuzywgy.supabase.co';
  v_service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZXNsbHVzY2ZwZnF5dXp5d2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5ODc4NSwiZXhwIjoyMDkwNTc0Nzg1fQ.Mpj-h3p80qNC1ZgEfEMGfFhIbpyq1fkzO9pl0nNAaxY';
BEGIN
  PERFORM net.http_post(
    url     := v_supabase_url || '/functions/v1/send-email',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || v_service_role_key
    ),
    body    := jsonb_build_object(
      'to',           NEW.email,
      'templateName', 'clienteBienvenida',
      'variables',    jsonb_build_object(
        'firstName',  COALESCE(NEW.first_name, 'Cliente')
      )
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_client_registered ON client_profiles;
CREATE TRIGGER trg_client_registered
  AFTER INSERT ON client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_client_welcome();

-- 9. Trigger para bienvenida-abogado
CREATE OR REPLACE FUNCTION notify_lawyer_welcome()
RETURNS TRIGGER AS $$
DECLARE
  v_supabase_url TEXT := 'https://wheslluscfpfqyuzywgy.supabase.co';
  v_service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZXNsbHVzY2ZwZnF5dXp5d2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5ODc4NSwiZXhwIjoyMDkwNTc0Nzg1fQ.Mpj-h3p80qNC1ZgEfEMGfFhIbpyq1fkzO9pl0nNAaxY';
BEGIN
  PERFORM net.http_post(
    url     := v_supabase_url || '/functions/v1/send-email',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || v_service_role_key
    ),
    body    := jsonb_build_object(
      'to',           NEW.email,
      'templateName', 'bienvenidaAbogado',
      'variables',    jsonb_build_object(
        'firstName',  COALESCE(NEW.first_name, 'Abogado'),
        'lastName',   COALESCE(NEW.last_name_paternal, ''),
        'email',      NEW.email
      )
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_lawyer_registered ON lawyer_profiles;
CREATE TRIGGER trg_lawyer_registered
  AFTER INSERT ON lawyer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_lawyer_welcome();

-- 10. Trigger para abogado-postulacion-revision / abogado-perfil-aprobado / rechazo-abogado
CREATE OR REPLACE FUNCTION notify_lawyer_verification_change()
RETURNS TRIGGER AS $$
DECLARE
  v_supabase_url TEXT := 'https://wheslluscfpfqyuzywgy.supabase.co';
  v_service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZXNsbHVzY2ZwZnF5dXp5d2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5ODc4NSwiZXhwIjoyMDkwNTc0Nzg1fQ.Mpj-h3p80qNC1ZgEfEMGfFhIbpyq1fkzO9pl0nNAaxY';
  v_template_name TEXT;
  v_subject TEXT;
BEGIN
  IF OLD.verification_status IS DISTINCT FROM NEW.verification_status THEN
    IF NEW.verification_status = 'approved' THEN
      v_template_name := 'aprobacionAbogado';
      v_subject := '¡Tu perfil ha sido aprobado en LegalPath! 🎉';
    ELSIF NEW.verification_status = 'rejected' THEN
      v_template_name := 'rechazoAbogado';
      v_subject := 'Actualización de tu perfil en LegalPath';
    ELSIF NEW.verification_status = 'pending' THEN
      v_template_name := 'abogadoPostulacionRevision';
      v_subject := 'Recibimos tus antecedentes 📄';
    ELSE
      RETURN NEW;
    END IF;

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
          'lastName',   COALESCE(NEW.last_name_paternal, ''),
          'email',      NEW.email,
          'rejectionReason', COALESCE(NEW.rejection_reason, 'Por favor revisa tu documentación.')
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_lawyer_verification_status_change ON lawyer_profiles;
CREATE TRIGGER on_lawyer_verification_status_change
  AFTER UPDATE OF verification_status ON lawyer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_lawyer_verification_change();

-- 11. Trigger para bloqueos/suspensiones (abogado-perfil-desactivado y cliente-cuenta-desactivada)
CREATE OR REPLACE FUNCTION notify_profile_deactivated()
RETURNS TRIGGER AS $$
DECLARE
  v_supabase_url TEXT := 'https://wheslluscfpfqyuzywgy.supabase.co';
  v_service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZXNsbHVzY2ZwZnF5dXp5d2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5ODc4NSwiZXhwIjoyMDkwNTc0Nzg1fQ.Mpj-h3p80qNC1ZgEfEMGfFhIbpyq1fkzO9pl0nNAaxY';
  v_template_name TEXT;
  v_subject TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'suspended' THEN
    IF TG_TABLE_NAME = 'lawyer_profiles' THEN
      v_template_name := 'abogadoPerfilDesactivado';
      v_subject := 'Tu cuenta ha sido desactivada temporalmente';
    ELSE
      v_template_name := 'clienteCuentaDesactivada';
      v_subject := 'Tu cuenta ha sido desactivada temporalmente';
    END IF;

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
          'firstName',  COALESCE(NEW.first_name, 'Usuario'),
          'reason',     COALESCE(NEW.suspension_reason, 'Incumplimiento de términos y condiciones.')
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_lawyer_suspended ON lawyer_profiles;
CREATE TRIGGER trg_lawyer_suspended
  AFTER UPDATE OF status ON lawyer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_profile_deactivated();

DROP TRIGGER IF EXISTS trg_client_suspended ON client_profiles;
CREATE TRIGGER trg_client_suspended
  AFTER UPDATE OF status ON client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_profile_deactivated();

-- 12. Trigger para admin-nuevo-abogado (cuando el estado de verificación pasa a pending)
CREATE OR REPLACE FUNCTION notify_admin_new_abogado()
RETURNS TRIGGER AS $$
DECLARE
  v_supabase_url TEXT := 'https://wheslluscfpfqyuzywgy.supabase.co';
  v_service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZXNsbHVzY2ZwZnF5dXp5d2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5ODc4NSwiZXhwIjoyMDkwNTc0Nzg1fQ.Mpj-h3p80qNC1ZgEfEMGfFhIbpyq1fkzO9pl0nNAaxY';
BEGIN
  IF OLD.verification_status IS DISTINCT FROM NEW.verification_status AND NEW.verification_status = 'pending' THEN
    PERFORM net.http_post(
      url     := v_supabase_url || '/functions/v1/send-email',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || v_service_role_key
      ),
      body    := jsonb_build_object(
        'to',           'admin@legalpath.cl',
        'templateName', 'adminNuevoAbogado',
        'variables',    jsonb_build_object(
          'lawyerName',  COALESCE(NEW.first_name || ' ' || NEW.last_name_paternal, 'Abogado'),
          'lawyerRut',   COALESCE(NEW.rut_personal, 'No indicado'),
          'lawyerEmail', NEW.email,
          'lawyerId',    NEW.id
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_lawyer_needs_admin_review ON lawyer_profiles;
CREATE TRIGGER trg_lawyer_needs_admin_review
  AFTER UPDATE OF verification_status ON lawyer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_new_abogado();

-- 13. Trigger para admin-nuevo-caso
CREATE OR REPLACE FUNCTION notify_admin_new_caso()
RETURNS TRIGGER AS $$
DECLARE
  v_supabase_url TEXT := 'https://wheslluscfpfqyuzywgy.supabase.co';
  v_service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZXNsbHVzY2ZwZnF5dXp5d2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5ODc4NSwiZXhwIjoyMDkwNTc0Nzg1fQ.Mpj-h3p80qNC1ZgEfEMGfFhIbpyq1fkzO9pl0nNAaxY';
BEGIN
  PERFORM net.http_post(
    url     := v_supabase_url || '/functions/v1/send-email',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || v_service_role_key
    ),
    body    := jsonb_build_object(
      'to',           'admin@legalpath.cl',
      'templateName', 'adminNuevoCaso',
      'variables',    jsonb_build_object(
        'caseTitle',    NEW.title,
        'caseId',       NEW.id,
        'caseCategory', COALESCE(NEW.category, 'General'),
        'caseUrgency',  COALESCE(NEW.urgency, 'Normal')
      )
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_case_created_admin ON cases;
CREATE TRIGGER trg_case_created_admin
  AFTER INSERT ON cases
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_new_caso();

-- 14. Programación de pg_cron para cliente-encuesta-cierre (delay 24 horas)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Eliminar job previo si existe para evitar duplicados en redeploys
SELECT cron.unschedule('send-survey-after-closure') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'send-survey-after-closure');

-- Programar job cada hora
SELECT cron.schedule(
  'send-survey-after-closure',
  '0 * * * *', -- Ejecutar cada hora (al minuto 0)
  $$
  WITH sent_cases AS (
    UPDATE cases
    SET survey_sent_at = NOW()
    WHERE status = 'cerrado'
      AND closed_at <= NOW() - INTERVAL '24 hours'
      AND survey_sent_at IS NULL
    RETURNING id, title, client_email, user_id
  )
  SELECT 
    net.http_post(
      url     := 'https://wheslluscfpfqyuzywgy.supabase.co/functions/v1/send-email',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZXNsbHVzY2ZwZnF5dXp5d2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5ODc4NSwiZXhwIjoyMDkwNTc0Nzg1fQ.Mpj-h3p80qNC1ZgEfEMGfFhIbpyq1fkzO9pl0nNAaxY"}'::jsonb,
      body    := jsonb_build_object(
        'to',           s.client_email,
        'templateName', 'clienteEncuestaCierre',
        'variables',    jsonb_build_object(
          'firstName',  COALESCE(cp.first_name, 'Cliente'),
          'caseTitle',  s.title
        )
      )
    )
  FROM sent_cases s
  JOIN client_profiles cp ON s.user_id = cp.id;
  $$
);

-- 15. Programación de pg_cron para cliente-recordatorio-propuestas (semanal para casos activos sin interacción)
SELECT cron.unschedule('send-weekly-reminder-inactive-cases') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'send-weekly-reminder-inactive-cases');

SELECT cron.schedule(
  'send-weekly-reminder-inactive-cases',
  '0 9 * * 1', -- Ejecutar todos los lunes a las 09:00 AM
  $$
  WITH cases_needing_reminder AS (
    UPDATE cases
    SET 
      last_reminder_sent_at = NOW(),
      reminder_count = reminder_count + 1
    WHERE status = 'activo'
      AND admin_status = 'aprobado'
      AND EXISTS (SELECT 1 FROM proposals WHERE case_id = cases.id)
      AND NOT EXISTS (SELECT 1 FROM proposals WHERE case_id = cases.id AND status = 'aceptada')
      AND (last_reminder_sent_at IS NULL OR last_reminder_sent_at <= NOW() - INTERVAL '7 days')
    RETURNING id, title, client_email, user_id
  )
  SELECT 
    net.http_post(
      url     := 'https://wheslluscfpfqyuzywgy.supabase.co/functions/v1/send-email',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZXNsbHVzY2ZwZnF5dXp5d2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5ODc4NSwiZXhwIjoyMDkwNTc0Nzg1fQ.Mpj-h3p80qNC1ZgEfEMGfFhIbpyq1fkzO9pl0nNAaxY"}'::jsonb,
      body    := jsonb_build_object(
        'to',           r.client_email,
        'templateName', 'clienteRecordatorioPropuestas',
        'variables',    jsonb_build_object(
          'firstName',  COALESCE(cp.first_name, 'Cliente'),
          'caseTitle',  r.title,
          'caseId',     r.id
        )
      )
    )
  FROM cases_needing_reminder r
  JOIN client_profiles cp ON r.user_id = cp.id;
  $$
);


