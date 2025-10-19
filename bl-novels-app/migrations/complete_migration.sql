-- Complete Migration Script
-- Date: 2025-10-19
-- Description: Adds all missing fields to support the updated form and display requirements

-- ============================================
-- 1. Add translation information to works table
-- ============================================

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
    COMMENT ON COLUMN works.translator_name IS 'Primary translator name for easy access';
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
    COMMENT ON COLUMN works.translation_platform IS 'Primary platform (Wattpad, WordPress, etc.)';
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
    COMMENT ON COLUMN works.translation_url IS 'Primary translation URL';
  END IF;
END $$;

-- Add chapter_count column to works table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'works'
    AND column_name = 'chapter_count'
  ) THEN
    ALTER TABLE works
    ADD COLUMN chapter_count INT DEFAULT 0;
    COMMENT ON COLUMN works.chapter_count IS 'Number of chapters available in the story';
  END IF;
END $$;

-- ============================================
-- 2. Add chapter_count and story_status to story_upload_requests table
-- ============================================

-- Add chapter_count column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'story_upload_requests' 
    AND column_name = 'chapter_count'
  ) THEN
    ALTER TABLE story_upload_requests 
    ADD COLUMN chapter_count INT DEFAULT 0;
    COMMENT ON COLUMN story_upload_requests.chapter_count IS 'Number of chapters available in the story';
  END IF;
END $$;

-- Add story_status column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'story_upload_requests' 
    AND column_name = 'story_status'
  ) THEN
    ALTER TABLE story_upload_requests 
    ADD COLUMN story_status VARCHAR(50) DEFAULT 'ongoing';
    COMMENT ON COLUMN story_upload_requests.story_status IS 'Status of the story: ongoing, completed, paused';
  END IF;
END $$;

-- ============================================
-- 3. Create indexes for better query performance
-- ============================================

-- Index on works.translator_name for faster searches
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'works' 
    AND indexname = 'idx_works_translator_name'
  ) THEN
    CREATE INDEX idx_works_translator_name ON works(translator_name);
  END IF;
END $$;

-- Index on works.translation_platform for filtering
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'works' 
    AND indexname = 'idx_works_translation_platform'
  ) THEN
    CREATE INDEX idx_works_translation_platform ON works(translation_platform);
  END IF;
END $$;

-- Index on story_upload_requests.story_status for filtering
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'story_upload_requests' 
    AND indexname = 'idx_story_upload_requests_story_status'
  ) THEN
    CREATE INDEX idx_story_upload_requests_story_status ON story_upload_requests(story_status);
  END IF;
END $$;

-- ============================================
-- 4. Verify table structures
-- ============================================

-- Display works table structure
SELECT 
  column_name, 
  data_type, 
  character_maximum_length,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'works'
ORDER BY ordinal_position;

-- Display story_upload_requests table structure
SELECT 
  column_name, 
  data_type, 
  character_maximum_length,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'story_upload_requests'
ORDER BY ordinal_position;

-- ============================================
-- 5. Sample data verification queries
-- ============================================

-- Count works with translation information
SELECT 
  COUNT(*) as total_works,
  COUNT(translator_name) as works_with_translator,
  COUNT(translation_platform) as works_with_platform,
  COUNT(translation_url) as works_with_url
FROM works;

-- Count story upload requests by status
SELECT 
  story_status,
  COUNT(*) as count
FROM story_upload_requests
GROUP BY story_status
ORDER BY count DESC;

-- Migration completed successfully
SELECT 'Migration completed successfully!' as status;

