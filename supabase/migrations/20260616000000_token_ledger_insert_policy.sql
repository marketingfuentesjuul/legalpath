-- Migration: Add INSERT policy to token_ledger table
-- This allows authenticated and verified lawyers to deduct their own tokens (e.g. for proposals or viewing cases)
-- but prevents them from granting themselves tokens (amount must be negative).

DROP POLICY IF EXISTS token_ledger_insert_own ON token_ledger;

CREATE POLICY token_ledger_insert_own ON token_ledger
  FOR INSERT
  TO public
  WITH CHECK (
    auth.uid() = lawyer_id
    AND is_verified_lawyer()
    AND amount < 0
  );
