-- Agregar columna approved_at a la tabla cases si no existe
ALTER TABLE cases ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Crear un índice para optimizar la ordenación de los casos aprobados por fecha de aprobación
CREATE INDEX IF NOT EXISTS idx_cases_approved_at_status
  ON cases (approved_at DESC)
  WHERE admin_status = 'aprobado';
