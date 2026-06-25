-- Migration: Auto Confirm Emails
-- Date: 2026-06-25

CREATE OR REPLACE FUNCTION public.handle_auto_confirm_auth_users()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto confirm on insert
  IF TG_OP = 'INSERT' THEN
    NEW.email_confirmed_at := COALESCE(NEW.email_confirmed_at, NOW());
    NEW.confirmed_at := COALESCE(NEW.confirmed_at, NOW());
  END IF;

  -- Auto confirm and swap email on update when email is being changed (via updateUser)
  IF TG_OP = 'UPDATE' THEN
    IF NEW.email_change IS NOT NULL AND NEW.email_change <> '' THEN
      NEW.email := NEW.email_change;
      NEW.email_change := NULL;
      NEW.email_confirmed_at := NOW();
      NEW.confirmed_at := NOW();
    END IF;

    IF NEW.email IS NOT NULL AND NEW.email_confirmed_at IS NULL THEN
      NEW.email_confirmed_at := NOW();
      NEW.confirmed_at := NOW();
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_auto_confirm_auth_users ON auth.users;
CREATE TRIGGER trg_auto_confirm_auth_users
  BEFORE INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auto_confirm_auth_users();
