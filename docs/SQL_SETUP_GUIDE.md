# SQL Setup Guide - Safe Schema

## Problems Solved ✅

### Error 1: "relation already exists"
**Error:** `SQL ERROR: 42P07: relation "authors" already exists`
**Cause:** Original schema used `CREATE TABLE` which fails if tables exist
**Solution:** Use `supabase_schema_safe.sql` with `CREATE TABLE IF NOT EXISTS`

### Error 2: "column does not exist"
**Error:** `SQL ERROR: 42703: column "genre_id" does not exist`
**Cause:** Schema had wrong column names (genre_id instead of main_genre_id)
**Solution:** Fixed schema now uses correct column names matching your database

---

## How to Use the Safe Schema

### Step 1: Open Supabase SQL Editor
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Copy the Safe Schema
1. Open `supabase_schema_safe.sql` from the root directory
2. Copy all the SQL code

### Step 3: Paste and Execute
1. Paste the SQL code into the Supabase SQL Editor
2. Click **Run** button (or press Ctrl+Enter)
3. Wait for completion

### Step 4: Verify Success
- You should see: "Query executed successfully"
- No errors about existing tables
- All tables created or verified

---

## What the Safe Schema Does

### ✅ Safe Operations
- Uses `CREATE TABLE IF NOT EXISTS` for all tables
- Won't error if tables already exist
- Won't overwrite existing data
- Creates missing tables only

### ✅ Tables Created/Verified
1. **authors** - Story authors
2. **genres** - Story genres
3. **works** - Story works
4. **chapters** - Story chapters
5. **work_tags** - Story tags
6. **translators** - Translator profiles
7. **translation_platforms** - Translation platforms
8. **translator_accounts** - Translator accounts
9. **translations** - Translations
10. **story_import_requests** - Story import requests
11. **story_status_history** - Status history
12. **user_accounts** - User accounts (NEW)
13. **account_upgrade_requests** - Upgrade requests (NEW)
14. **story_classifications** - Story classifications (NEW)
15. **story_classifications_mapping** - Classification mapping (NEW)
16. **story_upload_requests** - Story uploads (NEW)

### ✅ Indexes Created
- Performance indexes for all foreign keys
- Search indexes for common queries
- Status and type indexes

---

## If You Still Get Errors

### Error: "relation already exists"
- This shouldn't happen with the safe schema
- If it does, the table already exists (which is fine)
- You can safely ignore it

### Error: "column does not exist" (e.g., genre_id)
- Make sure you're using the LATEST `supabase_schema_safe.sql`
- The schema has been corrected to use:
  - `main_genre_id` (not `genre_id`)
  - `url_pattern` (not `url`)
  - `translation_url` (not `translated_url`)
- Download the latest version and try again

### Error: "foreign key constraint fails"
- Make sure you run the entire script
- Don't run individual statements
- Run the complete script from top to bottom
- Check that all referenced tables exist first

### Error: "permission denied"
- Check your Supabase user role
- Make sure you're using the correct project
- Verify your API key has write permissions

---

## Alternative: Drop and Recreate (Clean Slate)

If you want to start completely fresh:

```sql
-- WARNING: This will DELETE ALL DATA!
-- Only use if you want to reset everything

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

-- Then run supabase_schema_safe.sql
```

---

## File Locations

- **Safe Schema:** `supabase_schema_safe.sql` (root directory)
- **Original Schema:** `supabase_schema.sql` (root directory)
- **Documentation:** `docs/` folder

---

## Next Steps

1. ✅ Run `supabase_schema_safe.sql` in Supabase
2. ✅ Verify all tables created
3. ✅ Test the application
4. ✅ Add sample data if needed

---

## Support

If you encounter any issues:
1. Check the error message carefully
2. Verify table names in Supabase
3. Check foreign key relationships
4. Review the safe schema file
5. Try running the script again

---

**Status:** ✅ Ready to use!

