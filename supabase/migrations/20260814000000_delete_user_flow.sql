-- Migration: Complete Delete User Flow
-- Date: 2026-08-14

CREATE OR REPLACE FUNCTION delete_current_user()
RETURNS void AS $$
DECLARE
  v_uid UUID;
  v_email TEXT;
  v_first_name TEXT;
  v_role TEXT;
  v_supabase_url TEXT;
  v_service_role_key TEXT;
BEGIN
  -- Get the current authenticated user's ID
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- 1. Get user info before deleting (so we can send notification email)
  SELECT email, (raw_user_meta_data->>'first_name')::TEXT, (raw_user_meta_data->>'role')::TEXT
  INTO v_email, v_first_name, v_role
  FROM auth.users
  WHERE id = v_uid;

  -- 2. Load DB settings for Supabase HTTP requests
  v_supabase_url := current_setting('app.supabase_url', true);
  v_service_role_key := current_setting('app.service_role_key', true);

  -- 3. Send email notification if settings are present and email is available
  IF v_email IS NOT NULL AND v_supabase_url IS NOT NULL AND v_service_role_key IS NOT NULL THEN
    IF v_role = 'lawyer' THEN
      PERFORM net.http_post(
        url     := v_supabase_url || '/functions/v1/send-email',
        headers := jsonb_build_object(
          'Content-Type',  'application/json',
          'Authorization', 'Bearer ' || v_service_role_key
        ),
        body    := jsonb_build_object(
          'to',           v_email,
          'templateName', 'abogadoPerfilEliminado',
          'subject',      'Tu perfil en LegalPath',
          'variables',    jsonb_build_object(
            'firstName',  COALESCE(v_first_name, 'Abogado')
          )
        )
      );
    END IF;
  END IF;

  -- 4. Delete references with RESTRICT constraints to avoid foreign key violations
  DELETE FROM public.payments WHERE lawyer_id = v_uid;
  DELETE FROM public.token_ledger WHERE lawyer_id = v_uid;

  -- 5. Delete user from auth.users (cascades to profiles, cases, proposals, etc.)
  DELETE FROM auth.users WHERE id = v_uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
