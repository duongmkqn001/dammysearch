-- Migration: Add translation information to works table
-- Date: 2025-10-19

-- Add translator_name column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'works' 
    AND column_name = 'translator_name'
  ) THEN
    ALTER TABLE works 
    ADD COLUMN translator_name VARCHAR(255);
  END IF;
END $$;

-- Add translation_platform column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'works' 
    AND column_name = 'translation_platform'
  ) THEN
    ALTER TABLE works 
    ADD COLUMN translation_platform VARCHAR(100);
  END IF;
END $$;

-- Add translation_url column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'works' 
    AND column_name = 'translation_url'
  ) THEN
    ALTER TABLE works 
    ADD COLUMN translation_url VARCHAR(500);
  END IF;
END $$;

-- Add comments to columns
COMMENT ON COLUMN works.translator_name IS 'Primary translator name for easy access';
COMMENT ON COLUMN works.translation_platform IS 'Primary platform (Wattpad, WordPress, etc.)';
COMMENT ON COLUMN works.translation_url IS 'Primary translation URL';

