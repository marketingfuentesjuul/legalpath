-- Migration: Account Lifecycle and Moderation System
-- Date: 2026-06-22

-- 1. Agregar columnas de estado y moderación a lawyer_profiles
ALTER TABLE lawyer_profiles
  ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'deleted', 'suspended', 'banned')),
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS suspended_by UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS suspension_reason TEXT;

-- 2. Agregar columnas de estado y moderación a client_profiles
ALTER TABLE client_profiles
  ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'deleted', 'suspended', 'banned')),
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS suspended_by UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS suspension_reason TEXT;

-- 3. Crear función de anonimización para perfiles eliminados
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
      NEW.phone := NULL;
      NEW.rut := NULL;
      NEW.avatar_url := NULL;
      NEW.specialties := NULL;
      NEW.region := NULL;
      NEW.experience_years := NULL;
      NEW.bio := NULL;
      NEW.rejection_reason := NULL;
      NEW.admin_notes := NULL;
      
    -- Limpieza para client_profiles
    ELSIF TG_TABLE_NAME = 'client_profiles' THEN
      NEW.last_name_paternal := 'Eliminado';
      NEW.phone := NULL;
      NEW.avatar_url := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Triggers de anonimización
DROP TRIGGER IF EXISTS trg_anonymize_lawyer ON lawyer_profiles;
CREATE TRIGGER trg_anonymize_lawyer
  BEFORE UPDATE OF status ON lawyer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION anonymize_profile();

DROP TRIGGER IF EXISTS trg_anonymize_client ON client_profiles;
CREATE TRIGGER trg_anonymize_client
  BEFORE UPDATE OF status ON client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION anonymize_profile();

-- 5. Actualizar políticas de RLS para excluir perfiles no activos en búsquedas públicas
-- Nota: Solo los administradores o el propio usuario pueden ver perfiles suspendidos, baneados o eliminados.

DROP POLICY IF EXISTS "lawyer_profiles_select_active" ON lawyer_profiles;
CREATE POLICY "lawyer_profiles_select_active" ON lawyer_profiles
  FOR SELECT
  USING (
    status = 'active'
    OR auth.uid() = id
    OR is_admin()
  );

DROP POLICY IF EXISTS "client_profiles_select_active" ON client_profiles;
CREATE POLICY "client_profiles_select_active" ON client_profiles
  FOR SELECT
  USING (
    status = 'active'
    OR auth.uid() = id
    OR is_admin()
  );
