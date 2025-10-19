-- Migration: Add chapter_count and story_status to story_upload_requests table
-- Date: 2025-10-19

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
  END IF;
END $$;

-- Add comment to columns
COMMENT ON COLUMN story_upload_requests.chapter_count IS 'Number of chapters available in the story';
COMMENT ON COLUMN story_upload_requests.story_status IS 'Status of the story: ongoing, completed, paused';

