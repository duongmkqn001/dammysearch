# Database Migrations

This folder contains SQL migration scripts to update the database schema.

## How to Run Migrations

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the content of `complete_migration.sql`
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Run the migration
supabase db push
```

### Option 3: Using psql (PostgreSQL CLI)

```bash
psql -h YOUR_SUPABASE_HOST -U postgres -d postgres -f complete_migration.sql
```

## Migration Files

### complete_migration.sql
**Date:** 2025-10-19  
**Description:** Complete migration script that adds all missing fields

**Changes:**
1. Adds `translator_name`, `translation_platform`, and `translation_url` to `works` table
2. Adds `chapter_count` and `story_status` to `story_upload_requests` table
3. Creates indexes for better query performance
4. Includes verification queries to check the migration status

### Individual Migration Files

- **add_translation_info_to_works.sql** - Adds translation fields to works table
- **add_chapter_count_and_story_status.sql** - Adds chapter count and story status to upload requests

## Verification

After running the migration, you can verify the changes by running these queries:

```sql
-- Check works table structure
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'works'
ORDER BY ordinal_position;

-- Check story_upload_requests table structure
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'story_upload_requests'
ORDER BY ordinal_position;
```

## Rollback

If you need to rollback the changes:

```sql
-- Remove columns from works table
ALTER TABLE works DROP COLUMN IF EXISTS translator_name;
ALTER TABLE works DROP COLUMN IF EXISTS translation_platform;
ALTER TABLE works DROP COLUMN IF EXISTS translation_url;

-- Remove columns from story_upload_requests table
ALTER TABLE story_upload_requests DROP COLUMN IF EXISTS chapter_count;
ALTER TABLE story_upload_requests DROP COLUMN IF EXISTS story_status;

-- Drop indexes
DROP INDEX IF EXISTS idx_works_translator_name;
DROP INDEX IF EXISTS idx_works_translation_platform;
DROP INDEX IF EXISTS idx_story_upload_requests_story_status;
```

## Notes

- All migrations use `IF NOT EXISTS` checks to prevent errors if run multiple times
- Migrations are idempotent - safe to run multiple times
- Always backup your database before running migrations in production
- Test migrations in a development environment first

## Support

If you encounter any issues:
1. Check the Supabase logs in the dashboard
2. Verify your database connection
3. Ensure you have the necessary permissions
4. Check for any conflicting column names or constraints

