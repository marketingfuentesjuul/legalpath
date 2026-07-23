-- Migration: Add SELECT policy to documents table for the assigned lawyer
DROP POLICY IF EXISTS "documents_select_assigned_lawyer" ON documents;

CREATE POLICY "documents_select_assigned_lawyer" ON documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM proposals
      WHERE proposals.case_id = documents.case_id
      AND proposals.lawyer_id = auth.uid()
      AND proposals.status = 'aceptada'
    )
  );
