-- 1. Create a helper function with SECURITY DEFINER to bypass RLS on proposals table
CREATE OR REPLACE FUNCTION is_case_lawyer(p_case_id UUID, p_lawyer_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM proposals
    WHERE case_id = p_case_id 
      AND lawyer_id = p_lawyer_id 
      AND status = 'aceptada'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the recursive SELECT policy
DROP POLICY IF EXISTS cases_select ON cases;

-- 3. Create the corrected SELECT policy using the helper function
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
          status = 'en_progreso'::case_status 
          AND is_case_lawyer(id, auth.uid())
        )
      )
    )
  );
