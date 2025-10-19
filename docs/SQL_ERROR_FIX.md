# 🔧 SQL Error Fix - Column Does Not Exist

## Error Message
```
ERROR:  42703: column "genre_id" does not exist
```

## What Was Wrong ❌

The `supabase_schema_safe.sql` had incorrect column names:
- Used `genre_id` instead of `main_genre_id`
- Used `url` instead of `url_pattern`
- Used `translated_url` instead of `translation_url`

## What's Fixed ✅

Updated `supabase_schema_safe.sql` now uses correct column names:
- ✅ `main_genre_id` (for works table)
- ✅ `url_pattern` (for translation_platforms table)
- ✅ `translation_url` (for translations table)

## How to Fix

### Step 1: Get Latest Schema
- Download the latest `supabase_schema_safe.sql` from root directory
- Make sure it's the newest version

### Step 2: Clear Old Errors (Optional)
If you want to start fresh, run this in Supabase SQL Editor:

```sql
-- Drop all tables in reverse order
DROP TABLE IF EXISTS story_classifications_mapping CASCADE;
DROP TABLE IF EXISTS story_classifications CASCADE;
DROP TABLE IF EXISTS account_upgrade_requests CASCADE;
DROP TABLE IF EXISTS story_upload_requests CASCADE;
DROP TABLE IF EXISTS story_status_history CASCADE;
DROP TABLE IF EXISTS story_import_requests CASCADE;
DROP TABLE IF EXISTS translator_accounts CASCADE;
DROP TABLE IF EXISTS user_accounts CASCADE;
DROP TABLE IF EXISTS translations CASCADE;
DROP TABLE IF EXISTS translation_platforms CASCADE;
DROP TABLE IF EXISTS chapters CASCADE;
DROP TABLE IF EXISTS work_tags CASCADE;
DROP TABLE IF EXISTS works CASCADE;
DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS translators CASCADE;
```

### Step 3: Run Fixed Schema
1. Open `supabase_schema_safe.sql`
2. Copy all content
3. Paste into Supabase SQL Editor
4. Click Run
5. Done! ✅

## Correct Column Names

### works table
```sql
CREATE TABLE works (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_id BIGINT NOT NULL,
  summary TEXT,
  background TEXT,
  main_genre_id BIGINT,  -- ✅ CORRECT (not genre_id)
  status VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### translation_platforms table
```sql
CREATE TABLE translation_platforms (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  url_pattern VARCHAR(255),  -- ✅ CORRECT (not url)
  created_at TIMESTAMP
);
```

### translations table
```sql
CREATE TABLE translations (
  id BIGSERIAL PRIMARY KEY,
  chapter_id BIGINT NOT NULL,
  translator_id BIGINT,
  platform_id BIGINT NOT NULL,
  translation_url VARCHAR(500),  -- ✅ CORRECT (not translated_url)
  translated_content TEXT,
  language VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Correct Indexes

```sql
-- ✅ CORRECT indexes
CREATE INDEX IF NOT EXISTS idx_works_author_id ON works(author_id);
CREATE INDEX IF NOT EXISTS idx_works_main_genre_id ON works(main_genre_id);
CREATE INDEX IF NOT EXISTS idx_chapters_work_id ON chapters(work_id);
CREATE INDEX IF NOT EXISTS idx_work_tags_work_id ON work_tags(work_id);
CREATE INDEX IF NOT EXISTS idx_translations_chapter_id ON translations(chapter_id);
CREATE INDEX IF NOT EXISTS idx_translations_platform_id ON translations(platform_id);
CREATE INDEX IF NOT EXISTS idx_translations_translator_id ON translations(translator_id);
```

## Verification

After running the schema, verify these columns exist:

### Check works table
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'works';
```
Should show: `main_genre_id` ✅

### Check translation_platforms table
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'translation_platforms';
```
Should show: `url_pattern` ✅

### Check translations table
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'translations';
```
Should show: `translation_url` ✅

## Summary

| Column | Old (Wrong) | New (Correct) |
|--------|-----------|---------------|
| works.genre_id | ❌ genre_id | ✅ main_genre_id |
| translation_platforms.url | ❌ url | ✅ url_pattern |
| translations.translated_url | ❌ translated_url | ✅ translation_url |

---

**Status:** ✅ Fixed and Ready to Use!

