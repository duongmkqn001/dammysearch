# 🏷️ Tags Feature Guide - Story Upload with Tags

## ✨ What's New

You can now add **tags** to your story uploads! Tags help categorize and organize stories for better searchability.

---

## 📝 How to Use Tags

### Step 1: Upload a Story
1. Go to **👤 Độc Giả** (Reader Dashboard)
2. Click **📤 Tải Lên Truyện** (Upload Story)
3. Fill in the story details:
   - Tiêu đề truyện (Story Title) *
   - Tên tác giả (Author Name) *
   - Thể loại chính (Main Genre)
   - Tóm tắt (Summary)
   - Bối cảnh (Background)
   - Nền tảng nguồn (Source Platform)
   - URL nguồn (Source URL)

### Step 2: Add Tags
4. Find the **Thẻ (Tags)** field
5. Enter tags separated by **commas** (,)
6. Example: `Đam Mỹ, Hiện Đại, Hành Động, Lãng Mạn`

### Step 3: Submit
7. Click **Tải Lên Truyện** (Upload Story)
8. Your story will be submitted with tags for admin approval

---

## 🏷️ Tag Examples

### Common Tags
- **Genre Tags:** Đam Mỹ, Ngôn Tình, Hành Động, Phiêu Lưu, Kinh Dị
- **Setting Tags:** Hiện Đại, Cổ Đại, Tương Lai, Dị Thế
- **Mood Tags:** Lãng Mạn, Hài Hước, Buồn, Kịch Tính
- **Content Tags:** Có Nội Dung 18+, Gia Đình, Học Đường

### Example Combinations
```
Đam Mỹ, Hiện Đại, Hành Động
Ngôn Tình, Cổ Đại, Lãng Mạn
Hài Hước, Học Đường, Tình Bạn
```

---

## 📋 Tag Rules

✅ **Do's:**
- Separate tags with commas (,)
- Use clear, descriptive tags
- Use 2-10 tags per story
- Use consistent tag names
- Trim whitespace (spaces are removed automatically)

❌ **Don'ts:**
- Don't use special characters (except spaces)
- Don't use very long tag names
- Don't duplicate tags
- Don't use numbers only

---

## 👀 View Your Tags

### In Upload History
1. Go to **👤 Độc Giả** (Reader Dashboard)
2. Click **📋 Lịch Sử Tải Lên** (Upload History)
3. Your tags appear as **pink badges** under each story
4. Example display:
   ```
   📚 Story Title
   ✅ Phê duyệt
   
   Tác giả: Author Name
   Thể loại: Main Genre
   Thẻ: [Đam Mỹ] [Hiện Đại] [Hành Động]
   Ngày tải lên: 19/10/2025
   ```

---

## 🔍 How Tags Help

### For Readers
- Find stories by tags in advanced search
- Filter by multiple tags
- Discover similar stories

### For Admins
- Better story organization
- Easier categorization
- Improved search functionality

### For Translators
- Identify stories by genre/mood
- Find stories to work on
- Better story management

---

## 💾 Database Structure

### New Table: `upload_tags`
```sql
CREATE TABLE upload_tags (
  id BIGSERIAL PRIMARY KEY,
  upload_id BIGINT NOT NULL,           -- Links to story_upload_requests
  tag_name VARCHAR(100) NOT NULL,      -- The tag text
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes
- `idx_upload_tags_upload_id` - Fast lookup by upload
- `idx_upload_tags_tag_name` - Fast lookup by tag name

---

## 🚀 Implementation Details

### Frontend (React)
- **Component:** `StoryUploadTab.jsx`
- **Features:**
  - Tags input field with comma-separated parsing
  - Tag display in upload history
  - Visual tag badges with pink gradient

### Backend (Supabase)
- **Table:** `upload_tags`
- **Operations:**
  - Insert tags when story is uploaded
  - Fetch tags when viewing upload history
  - Delete tags when story is deleted (CASCADE)

### Parsing Logic
```javascript
// Input: "Đam Mỹ, Hiện Đại, Hành Động"
// Process:
// 1. Split by comma: ["Đam Mỹ", " Hiện Đại", " Hành Động"]
// 2. Trim whitespace: ["Đam Mỹ", "Hiện Đại", "Hành Động"]
// 3. Filter empty: ["Đam Mỹ", "Hiện Đại", "Hành Động"]
// 4. Store in database
```

---

## 🔧 Setup Instructions

### Step 1: Update Database
1. Open `supabase_schema_safe.sql`
2. Look for `upload_tags` table (NEW)
3. Run the entire schema in Supabase SQL Editor
4. Verify `upload_tags` table is created

### Step 2: Verify Table
```sql
-- Check if upload_tags table exists
SELECT * FROM information_schema.tables 
WHERE table_name = 'upload_tags';

-- Should return: upload_tags table ✅
```

### Step 3: Test Feature
1. Run `npm run dev` in `bl-novels-app/`
2. Go to Reader Dashboard
3. Upload a story with tags
4. Check upload history to see tags

---

## 📊 Tag Statistics

### What's Tracked
- Total tags per story
- Tag frequency (most used tags)
- Tag combinations
- Tag creation date

### Future Features
- Tag suggestions based on story content
- Tag cloud visualization
- Tag-based recommendations
- Tag management for admins

---

## ❓ FAQ

### Q: Can I edit tags after uploading?
A: Not yet. You can delete and re-upload with new tags.

### Q: How many tags can I add?
A: No limit, but 2-10 is recommended.

### Q: Are tags case-sensitive?
A: No, tags are stored as-is but treated case-insensitively in searches.

### Q: Can I use special characters in tags?
A: Only letters, numbers, and spaces are recommended.

### Q: What if I make a typo in a tag?
A: You can delete the upload and re-upload with correct tags.

---

## 🎯 Next Steps

1. ✅ Update database with `supabase_schema_safe.sql`
2. ✅ Test the tags feature
3. ✅ Upload stories with tags
4. ✅ View tags in upload history
5. ✅ Use tags in advanced search (coming soon)

---

## 📞 Support

**Issues with tags?**
- Check that `upload_tags` table exists in Supabase
- Verify tags are being saved (check database)
- Check browser console for errors (F12)

**Want to customize tags?**
- Edit `StoryUploadTab.jsx` to change tag input format
- Edit `StoryUploadTab.css` to change tag styling
- Edit database schema to add tag validation

---

**Status:** ✅ Tags Feature Ready to Use!

**Date:** 2025-10-19

