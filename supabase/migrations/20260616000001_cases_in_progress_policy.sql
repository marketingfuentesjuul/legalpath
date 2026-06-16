-- Drop the existing SELECT policy on cases
DROP POLICY IF EXISTS cases_select ON cases;

-- Create the updated SELECT policy on cases
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
          AND EXISTS (
            SELECT 1 FROM proposals 
            WHERE proposals.id = cases.accepted_proposal_id 
              AND proposals.lawyer_id = auth.uid()
          )
        )
      )
    )
  );
