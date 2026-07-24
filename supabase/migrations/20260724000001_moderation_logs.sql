-- Migration: Moderation Logs System
-- Date: 2026-07-24

-- 1. Crear tabla de logs de moderación
CREATE TABLE IF NOT EXISTS public.moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL,
  profile_type VARCHAR(50) NOT NULL CHECK (profile_type IN ('lawyer', 'client')),
  action VARCHAR(50) NOT NULL CHECK (action IN ('suspended', 'banned', 'reactivated')),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL
);

-- 2. Habilitar RLS
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas para administradores
DROP POLICY IF EXISTS "Admins can do everything on moderation_logs" ON public.moderation_logs;
CREATE POLICY "Admins can do everything on moderation_logs" ON public.moderation_logs
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 4. Crear función de trigger para registrar la moderación de forma automática
CREATE OR REPLACE FUNCTION log_profile_moderation()
RETURNS TRIGGER AS $$
DECLARE
  v_action VARCHAR(50);
  v_reason TEXT;
  v_by UUID;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    IF NEW.status = 'suspended' THEN
      v_action := 'suspended';
      v_reason := NEW.suspension_reason;
      v_by := NEW.suspended_by;
    ELSIF NEW.status = 'banned' THEN
      v_action := 'banned';
      v_reason := NEW.suspension_reason;
      v_by := NEW.suspended_by;
    ELSIF NEW.status = 'active' AND (OLD.status = 'suspended' OR OLD.status = 'banned') THEN
      v_action := 'reactivated';
      v_reason := 'Cuenta reactivada por la administración.';
      v_by := NEW.suspended_by;
    ELSE
      RETURN NEW;
    END IF;

    INSERT INTO public.moderation_logs (profile_id, profile_type, action, reason, created_at, created_by)
    VALUES (
      NEW.id,
      CASE WHEN TG_TABLE_NAME = 'lawyer_profiles' THEN 'lawyer' ELSE 'client' END,
      v_action,
      v_reason,
      NOW(),
      v_by
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Crear los triggers correspondientes
DROP TRIGGER IF EXISTS trg_log_lawyer_moderation ON public.lawyer_profiles;
CREATE TRIGGER trg_log_lawyer_moderation
  AFTER UPDATE OF status ON public.lawyer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION log_profile_moderation();

DROP TRIGGER IF EXISTS trg_log_client_moderation ON public.client_profiles;
CREATE TRIGGER trg_log_client_moderation
  AFTER UPDATE OF status ON public.client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION log_profile_moderation();
