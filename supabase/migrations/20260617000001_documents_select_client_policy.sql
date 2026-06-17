-- Migration: Add SELECT policy to documents table for clients/owners
DROP POLICY IF EXISTS "documents_select_own" ON documents;

CREATE POLICY "documents_select_own" ON documents
  FOR SELECT
  USING (
    auth.uid() = uploaded_by
    OR EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = documents.case_id
      AND cases.user_id = auth.uid()
    )
  );
