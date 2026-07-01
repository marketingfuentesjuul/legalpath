-- Migration to support real payments and token packages integration

-- 1. Rename tokens_amount to tokens in token_packages if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name='token_packages' AND column_name='tokens_amount'
  ) THEN
    ALTER TABLE token_packages RENAME COLUMN tokens_amount TO tokens;
  END IF;
END $$;

-- 2. Clean and repopulate token_packages
TRUNCATE token_packages CASCADE;

INSERT INTO token_packages (name, tokens, price_clp, is_active) VALUES
  ('Starter',     5,   4990, true),
  ('Pro',        15,  11990, true),
  ('Enterprise', 40,  27990, true);

-- 3. Update payments table structure
-- Rename stripe_payment_intent_id to provider_payment_id if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name='payments' AND column_name='stripe_payment_intent_id'
  ) THEN
    ALTER TABLE payments RENAME COLUMN stripe_payment_intent_id TO provider_payment_id;
  END IF;
END $$;

-- Rename token_package_id to package_id if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name='payments' AND column_name='token_package_id'
  ) THEN
    ALTER TABLE payments RENAME COLUMN token_package_id TO package_id;
  END IF;
END $$;

-- Add provider if it doesn't exist
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS provider TEXT
    CHECK (provider IN ('flow', 'mercadopago'))
    NOT NULL DEFAULT 'flow';

-- Add unique constraint for idempotency
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_provider_payment_id
  ON payments (provider_payment_id);

-- 4. Verification RLS on payments
DROP POLICY IF EXISTS "payments_select_own" ON payments;
CREATE POLICY "payments_select_own" ON payments
  FOR SELECT TO authenticated USING (lawyer_id = auth.uid());
