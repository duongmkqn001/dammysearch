# ⚡ Quick Fix - SQL Column Error

## Error
```
ERROR: 42703: column "genre_id" does not exist
```

## Fix (2 Steps)

### Step 1: Get Latest Schema
- Open: `supabase_schema_safe.sql` (root directory)
- This file has been updated with correct column names

### Step 2: Run in Supabase
1. Copy all content from `supabase_schema_safe.sql`
2. Go to Supabase SQL Editor
3. Paste the content
4. Click Run
5. Done! ✅

---

## What Was Fixed

| Column | Old | New |
|--------|-----|-----|
| works.genre_id | ❌ | ✅ main_genre_id |
| translation_platforms.url | ❌ | ✅ url_pattern |
| translations.translated_url | ❌ | ✅ translation_url |

---

## Need More Help?

- **Detailed Fix:** See `docs/SQL_ERROR_FIX.md`
- **Setup Guide:** See `docs/SQL_SETUP_GUIDE.md`
- **Getting Started:** See `docs/GETTING_STARTED_CHECKLIST.md`

---

**Status:** ✅ Fixed!

