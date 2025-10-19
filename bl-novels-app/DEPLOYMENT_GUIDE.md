# Deployment Guide

## 🚀 Quick Start

### 1. Run Database Migration

**IMPORTANT**: You must run the database migration before deploying the updated code.

#### Using Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Open `bl-novels-app/migrations/complete_migration.sql`
6. Copy and paste the entire content
7. Click **Run** (or press Ctrl+Enter)
8. Wait for "Migration completed successfully!" message

### 2. Test Locally

```bash
cd bl-novels-app
npm run dev
```

Visit http://localhost:5173 and test:
- ✅ Story upload form has chapter count and status fields
- ✅ Story modals show translation platform and links
- ✅ Admin dashboard is accessible with admin account
- ✅ All modals display properly without blur

### 3. Deploy to Production

#### Option A: GitHub Pages (Recommended)

```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npx gh-pages -d dist

# Your site will be available at:
# https://YOUR_USERNAME.github.io/bl-novels-app/
```

#### Option B: Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click **Import Project**
4. Select your repository
5. Configure:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: (copy from `.env.local`)
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy**

#### Option C: Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click **Add new site** → **Import an existing project**
4. Select your repository
5. Configure:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Environment Variables: (copy from `.env.local`)
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy site**

## 📋 Pre-Deployment Checklist

### Database
- [ ] Migration script executed successfully
- [ ] Verified new columns exist in `works` table
- [ ] Verified new columns exist in `story_upload_requests` table
- [ ] Checked indexes are created

### Code
- [ ] All dependencies installed (`npm install`)
- [ ] No TypeScript/ESLint errors
- [ ] Build completes successfully (`npm run build`)
- [ ] Environment variables configured

### Testing
- [ ] Story upload form works with new fields
- [ ] Story modals display all information
- [ ] Translation links are clickable
- [ ] Admin dashboard accessible
- [ ] Theme switching works
- [ ] Mobile responsive

## 🔧 Configuration

### Environment Variables

Create or update `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

### Supabase Configuration

Ensure these tables exist:
- `works`
- `authors`
- `genres`
- `work_tags`
- `story_upload_requests`
- `upload_tags`
- `user_accounts`

## 🐛 Troubleshooting

### Issue: "Column does not exist" error

**Solution**: Run the migration script in Supabase SQL Editor

```sql
-- Check if columns exist
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'works';
```

### Issue: Admin dashboard redirects to main page

**Solution**: 
1. Open browser console (F12)
2. Check the debug output
3. Verify your user role is 'admin' in the database:

```sql
SELECT email, role FROM user_accounts WHERE email = 'your@email.com';
```

4. If role is not 'admin', update it:

```sql
UPDATE user_accounts SET role = 'admin' WHERE email = 'your@email.com';
```

### Issue: Modals show "N/A" for genre

**Solution**: Ensure genres are properly linked in the database

```sql
-- Check if genre exists
SELECT * FROM genres;

-- Update work with genre
UPDATE works SET main_genre_id = (SELECT id FROM genres WHERE name = 'Đam Mỹ' LIMIT 1) WHERE id = YOUR_WORK_ID;
```

### Issue: Translation links not showing

**Solution**: Add translation data to works

```sql
-- Add translation info to a work
UPDATE works 
SET 
  translator_name = 'Translator Name',
  translation_platform = 'Wattpad',
  translation_url = 'https://wattpad.com/story/...'
WHERE id = YOUR_WORK_ID;
```

## 📊 Verification Queries

Run these in Supabase SQL Editor to verify everything is working:

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

-- Count works with translation info
SELECT 
  COUNT(*) as total_works,
  COUNT(translator_name) as with_translator,
  COUNT(translation_platform) as with_platform,
  COUNT(translation_url) as with_url
FROM works;

-- Check admin users
SELECT email, username, role FROM user_accounts WHERE role = 'admin';
```

## 🔄 Rollback Plan

If you need to rollback the changes:

```sql
-- Remove new columns from works
ALTER TABLE works DROP COLUMN IF EXISTS translator_name;
ALTER TABLE works DROP COLUMN IF EXISTS translation_platform;
ALTER TABLE works DROP COLUMN IF EXISTS translation_url;

-- Remove new columns from story_upload_requests
ALTER TABLE story_upload_requests DROP COLUMN IF EXISTS chapter_count;
ALTER TABLE story_upload_requests DROP COLUMN IF EXISTS story_status;
```

Then redeploy the previous version of the code.

## 📞 Support

If you encounter issues:
1. Check the browser console for errors (F12)
2. Check Supabase logs in the dashboard
3. Verify environment variables are set correctly
4. Ensure database migration was successful
5. Test in incognito mode to rule out cache issues

## 🎉 Post-Deployment

After successful deployment:
1. Test all features thoroughly
2. Monitor error logs
3. Gather user feedback
4. Plan next iteration of improvements

---

**Last Updated**: 2025-10-19  
**Version**: 2.0.0

