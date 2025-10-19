# Bug Fix Guide

## Issues Identified from Screenshots

Based on your screenshots, here are the issues and their fixes:

### ❌ Issue 1: Tags Not Showing
**Problem**: The tags in the description (Tình hữu độc chung, trời sinh một cặp, etc.) are not linked to the work_tags table.

**Solution**: The tags need to be added to the `work_tags` table in the database.

### ❌ Issue 2: Genre Showing "N/A"
**Problem**: The genre (Thể Loại) shows as "N/A" instead of the actual genre.

**Solution**: The work needs to have a proper `main_genre_id` that references an existing genre in the `genres` table.

### ❌ Issue 3: No Translation Link
**Problem**: Missing translation URL link.

**Solution**: The work needs to have `translation_url` and `translation_platform` fields populated.

### ❌ Issue 4: Missing Chapter Count
**Problem**: Number of chapters not displayed in popup.

**Solution**: The work needs to have `chapter_count` field populated, and the UI has been updated to display it.

---

## 🔧 Step-by-Step Fix Instructions

### Step 1: Run Database Migration

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the content from: `bl-novels-app/migrations/complete_migration.sql`
5. Click **Run**
6. Wait for success message

This will add the missing columns:
- `works.chapter_count`
- `works.translator_name`
- `works.translation_platform`
- `works.translation_url`

### Step 2: Add Sample Data (For Testing)

1. In Supabase **SQL Editor**, create another **New Query**
2. Copy and paste the content from: `bl-novels-app/migrations/add_sample_data.sql`
3. Click **Run**

This will:
- Add sample authors and genres
- Update "Vùng Cấm Hoa Hồng" with complete information
- Add proper tags to the work
- Add more sample works for testing

### Step 3: Fix Your Existing Data

If you have existing works that need to be fixed, run these queries in Supabase SQL Editor:

#### A. Check Current Data

```sql
-- See what data exists
SELECT 
  w.id,
  w.title,
  a.name as author,
  g.name as genre,
  w.main_genre_id,
  w.status,
  w.chapter_count,
  w.translator_name
FROM works w
LEFT JOIN authors a ON w.author_id = a.id
LEFT JOIN genres g ON w.main_genre_id = g.id;
```

#### B. Fix Genre (if showing N/A)

```sql
-- First, check if genre exists
SELECT * FROM genres;

-- If no genres exist, add them
INSERT INTO genres (name, description) VALUES
  ('Đam Mỹ', 'Thể loại tình cảm nam-nam'),
  ('Cổ Trang', 'Bối cảnh thời cổ đại'),
  ('Hiện Đại', 'Bối cảnh thời hiện đại')
ON CONFLICT (name) DO NOTHING;

-- Update work to link to genre
UPDATE works 
SET main_genre_id = (SELECT id FROM genres WHERE name = 'Đam Mỹ' LIMIT 1)
WHERE title = 'Vùng Cấm Hoa Hồng';
```

#### C. Add Tags

```sql
-- Get the work ID first
SELECT id, title FROM works WHERE title LIKE '%Vùng Cấm%';

-- Replace WORK_ID_HERE with the actual ID from above query
DELETE FROM work_tags WHERE work_id = WORK_ID_HERE;

INSERT INTO work_tags (work_id, tag_name) VALUES
  (WORK_ID_HERE, 'Tình hữu độc chung'),
  (WORK_ID_HERE, 'Trời sinh một cặp'),
  (WORK_ID_HERE, 'Con cưng của trời'),
  (WORK_ID_HERE, 'Ngọt ngào'),
  (WORK_ID_HERE, 'Trường thành'),
  (WORK_ID_HERE, 'ABO');
```

#### D. Add Translation Information

```sql
-- Replace WORK_ID_HERE with your work ID
UPDATE works 
SET 
  chapter_count = 45,
  translator_name = 'Your Translator Name',
  translation_platform = 'Wattpad',
  translation_url = 'https://www.wattpad.com/story/your-story-url'
WHERE id = WORK_ID_HERE;
```

### Step 4: Verify the Fixes

Run this query to verify everything is set up correctly:

```sql
-- Comprehensive check
SELECT 
  w.id,
  w.title,
  a.name as author,
  g.name as genre,
  w.status,
  w.chapter_count,
  w.translator_name,
  w.translation_platform,
  w.translation_url,
  (SELECT STRING_AGG(tag_name, ', ') FROM work_tags WHERE work_id = w.id) as tags
FROM works w
LEFT JOIN authors a ON w.author_id = a.id
LEFT JOIN genres g ON w.main_genre_id = g.id
WHERE w.title = 'Vùng Cấm Hoa Hồng';
```

Expected output should show:
- ✅ Author name (not NULL)
- ✅ Genre name (not NULL)
- ✅ Chapter count (> 0)
- ✅ Translator name (not NULL)
- ✅ Translation platform (not NULL)
- ✅ Translation URL (not NULL)
- ✅ Tags (comma-separated list)

### Step 5: Test in the Application

1. Refresh your browser at http://localhost:5173
2. Go to **📚 Tất Cả Tác Phẩm** (All Works) tab
3. Click on "Vùng Cấm Hoa Hồng"
4. Verify the modal shows:
   - ✅ Author: Thiên Phi
   - ✅ Genre: Đam Mỹ (not N/A)
   - ✅ Status: 🔄 Đang Cập Nhật
   - ✅ Chapter Count: 45 chương
   - ✅ Tags: All 6 tags displayed
   - ✅ Background section
   - ✅ Summary section
   - ✅ Translator name
   - ✅ Platform with icon (📱 Wattpad)
   - ✅ Clickable translation link

---

## 🎯 Quick Fix for "Vùng Cấm Hoa Hồng"

If you just want to quickly fix the specific work shown in your screenshot, run this single query:

```sql
-- Complete fix for Vùng Cấm Hoa Hồng
DO $$
DECLARE
  author_id_var BIGINT;
  genre_id_var BIGINT;
  work_id_var BIGINT;
BEGIN
  -- Ensure author exists
  INSERT INTO authors (name) VALUES ('Thiên Phi') 
  ON CONFLICT (name) DO NOTHING;
  SELECT id INTO author_id_var FROM authors WHERE name = 'Thiên Phi';
  
  -- Ensure genre exists
  INSERT INTO genres (name) VALUES ('Đam Mỹ') 
  ON CONFLICT (name) DO NOTHING;
  SELECT id INTO genre_id_var FROM genres WHERE name = 'Đam Mỹ';
  
  -- Get work ID
  SELECT id INTO work_id_var FROM works WHERE title = 'Vùng Cấm Hoa Hồng' LIMIT 1;
  
  -- Update work
  UPDATE works 
  SET 
    author_id = author_id_var,
    main_genre_id = genre_id_var,
    chapter_count = 45,
    translator_name = 'Translator Name',
    translation_platform = 'Wattpad',
    translation_url = 'https://www.wattpad.com/story/example'
  WHERE id = work_id_var;
  
  -- Clear old tags and add new ones
  DELETE FROM work_tags WHERE work_id = work_id_var;
  INSERT INTO work_tags (work_id, tag_name) VALUES
    (work_id_var, 'Tình hữu độc chung'),
    (work_id_var, 'Trời sinh một cặp'),
    (work_id_var, 'Con cưng của trời'),
    (work_id_var, 'Ngọt ngào'),
    (work_id_var, 'Trường thành'),
    (work_id_var, 'ABO');
    
  RAISE NOTICE 'Fixed work ID: %', work_id_var;
END $$;
```

---

## 📝 Summary of Code Changes

The following files have been updated to support the new features:

### Components Updated:
- ✅ `src/components/WorksListTab.jsx` - Added chapter count display
- ✅ `src/components/SearchTab.jsx` - Added chapter count display
- ✅ `src/components/AuthorListTab.jsx` - Added chapter count display

### Database Schema Updated:
- ✅ `supabase_schema.sql` - Added chapter_count to works table
- ✅ `migrations/complete_migration.sql` - Migration script updated

### New Files Created:
- ✅ `migrations/add_sample_data.sql` - Sample data for testing
- ✅ `BUGFIX_GUIDE.md` - This guide

---

## ⚠️ Important Notes

1. **Always run migrations first** before testing the UI
2. **Genres must exist** in the genres table before assigning to works
3. **Authors must exist** in the authors table before assigning to works
4. **Tags are separate records** in the work_tags table, not stored in the work description
5. **Translation info is optional** but recommended for better user experience

---

## 🆘 Troubleshooting

### Genre still shows N/A
- Check if `main_genre_id` is set: `SELECT main_genre_id FROM works WHERE title = 'Your Title'`
- Check if genre exists: `SELECT * FROM genres WHERE id = YOUR_GENRE_ID`
- Make sure the foreign key relationship is correct

### Tags not showing
- Check if tags exist: `SELECT * FROM work_tags WHERE work_id = YOUR_WORK_ID`
- Make sure work_id matches the actual work ID
- Check browser console for any JavaScript errors

### Translation link not showing
- Check if fields are populated: `SELECT translation_url, translation_platform FROM works WHERE id = YOUR_WORK_ID`
- Make sure the URL is valid and starts with http:// or https://

---

**Last Updated**: 2025-10-19

