-- 1. Agregar campos a lawyer_profiles
ALTER TABLE lawyer_profiles
  -- Motivo de rechazo (se llena solo cuando verification_status = 'rejected')
  ADD COLUMN rejection_reason TEXT,

  -- Qué administrador tomó la decisión de aprobar o rechazar
  ADD COLUMN reviewed_by UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,

  -- Cuándo se tomó la decisión
  ADD COLUMN reviewed_at TIMESTAMPTZ,

  -- Cuándo el abogado envió sus documentos y marcó su perfil como listo para revisar
  -- Este campo lo actualiza el abogado desde su vista de onboarding
  ADD COLUMN submitted_for_review_at TIMESTAMPTZ,

  -- Notas internas del administrador (no visibles para el abogado)
  ADD COLUMN admin_notes TEXT;

-- 2. Índices de performance para la cola de verificación
-- Para la cola principal: abogados pendientes ordenados por antigüedad
CREATE INDEX idx_lawyer_verification_status_date 
  ON lawyer_profiles (verification_status, created_at ASC);

-- Para búsquedas por admin reviewer (historial de lo que revisó cada admin)
CREATE INDEX idx_lawyer_reviewed_by 
  ON lawyer_profiles (reviewed_by) 
  WHERE reviewed_by IS NOT NULL;

-- 3. Trigger para notificación de cambio de estado
CREATE OR REPLACE FUNCTION notify_lawyer_verification_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo actuar si el verification_status realmente cambió
  IF OLD.verification_status IS DISTINCT FROM NEW.verification_status THEN
    
    -- Solo enviar email si el nuevo estado es una decisión final
    IF NEW.verification_status IN ('approved', 'rejected') THEN
      
      -- Llamar a la Edge Function de manera asíncrona usando pg_net
      -- (asegurarse de que la extensión pg_net esté habilitada en Supabase)
      PERFORM net.http_post(
        url     := current_setting('app.supabase_url') || '/functions/v1/send-verification-email',
        headers := jsonb_build_object(
          'Content-Type',  'application/json',
          'Authorization', 'Bearer ' || current_setting('app.service_role_key')
        ),
        body    := jsonb_build_object(
          'lawyer_id',        NEW.id,
          'status',           NEW.verification_status,
          'rejection_reason', NEW.rejection_reason,
          'email',            NEW.email
        )
      );

    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Asignar el trigger a la tabla
CREATE TRIGGER on_lawyer_verification_status_change
  AFTER UPDATE OF verification_status ON lawyer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_lawyer_verification_change();

-- 5. Actualizar política RLS de lawyer_profiles
-- Eliminar política anterior si existe
DROP POLICY IF EXISTS "lawyer_profiles_update" ON lawyer_profiles;

-- Admin puede actualizar cualquier campo incluyendo verification_status y campos nuevos
CREATE POLICY "lawyer_profiles_update_admin" ON lawyer_profiles
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- El propio abogado puede actualizar sus datos personales y submitted_for_review_at
-- pero NO puede cambiar verification_status, reviewed_by, reviewed_at, admin_notes
CREATE POLICY "lawyer_profiles_update_own" ON lawyer_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Prevenir que el abogado se auto-apruebe o cambie campos de revisión
    AND verification_status = OLD.verification_status
    AND reviewed_by IS NOT DISTINCT FROM OLD.reviewed_by
    AND reviewed_at IS NOT DISTINCT FROM OLD.reviewed_at
  );

-- 6. Actualizar política RLS de documents
-- Los abogados pueden ver sus propios documentos de verificación (sin importar su estado)
CREATE POLICY "documents_select_own_lawyer" ON documents
  FOR SELECT
  USING (
    auth.uid() = uploaded_by
    AND EXISTS (
      SELECT 1 FROM lawyer_profiles WHERE id = auth.uid()
    )
  );

-- Los admins pueden ver todos los documentos (incluyendo documentos de verificación)
CREATE POLICY "documents_select_admin" ON documents
  FOR SELECT
  USING (is_admin());

-- 7. Función helper para el onboarding del abogado
CREATE OR REPLACE FUNCTION submit_lawyer_for_review()
RETURNS void AS $$
BEGIN
  -- Solo puede hacer esto el propio abogado y si está en estado 'pending'
  IF NOT EXISTS (
    SELECT 1 FROM lawyer_profiles
    WHERE id = auth.uid()
    AND verification_status = 'pending'
  ) THEN
    RAISE EXCEPTION 'No autorizado o perfil ya enviado a revisión';
  END IF;

  UPDATE lawyer_profiles
  SET
    verification_status      = 'in_review',
    submitted_for_review_at  = NOW()
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
