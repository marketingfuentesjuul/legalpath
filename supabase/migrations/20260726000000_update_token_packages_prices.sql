-- Migration to update token_packages table to the 4 official token packages

DO $$
BEGIN
  -- Mark any existing legacy packages as inactive or remove if no FK constraint
  UPDATE token_packages SET is_active = false;
END $$;

-- Insert or update the 4 active packages
INSERT INTO token_packages (name, tokens, price_clp, is_active) VALUES
  ('Pack Base', 12, 14990, true),
  ('Pack Core', 25, 27990, true),
  ('Pack Plus', 40, 39990, true),
  ('Pack Apex', 60, 54990, true);
