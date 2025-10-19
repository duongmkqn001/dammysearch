# ✅ Getting Started Checklist

Complete these steps to get the BL Novels app running!

---

## 📋 Pre-Setup (5 minutes)

- [ ] Read `SETUP_INSTRUCTIONS.md` (in root directory)
- [ ] Read `docs/00_START_HERE.md` (master index)
- [ ] Verify you have Supabase account
- [ ] Verify you have Node.js installed

---

## 🗄️ Database Setup (10 minutes)

### Step 1: Prepare SQL
- [ ] Open `supabase_schema_safe.sql` (in root directory)
- [ ] Copy all content (Ctrl+A, Ctrl+C)

### Step 2: Run in Supabase
- [ ] Go to https://app.supabase.com
- [ ] Select your project
- [ ] Click "SQL Editor" in left sidebar
- [ ] Click "New Query"
- [ ] Paste SQL code (Ctrl+V)
- [ ] Click "Run" button
- [ ] Wait for "Query executed successfully"
- [ ] Verify no errors appear

### Step 3: Verify Tables
- [ ] Go to "Table Editor" in Supabase
- [ ] Verify these tables exist:
  - [ ] authors
  - [ ] genres
  - [ ] works
  - [ ] chapters
  - [ ] work_tags
  - [ ] translators
  - [ ] translation_platforms
  - [ ] translator_accounts
  - [ ] translations
  - [ ] story_import_requests
  - [ ] story_status_history
  - [ ] user_accounts (NEW)
  - [ ] account_upgrade_requests (NEW)
  - [ ] story_classifications (NEW)
  - [ ] story_classifications_mapping (NEW)
  - [ ] story_upload_requests (NEW)

---

## 🚀 Application Setup (5 minutes)

### Step 1: Install Dependencies
- [ ] Open terminal
- [ ] Navigate to `bl-novels-app` folder
- [ ] Run: `npm install`
- [ ] Wait for completion

### Step 2: Start Dev Server
- [ ] Run: `npm run dev`
- [ ] Wait for "VITE ready in XXX ms"
- [ ] Note the local URL (usually http://localhost:5173/)

### Step 3: Open Application
- [ ] Open browser
- [ ] Go to http://localhost:5173/
- [ ] Verify page loads without errors
- [ ] Check browser console (F12) for errors

---

## 🧪 Feature Testing (15 minutes)

### Authentication
- [ ] Click "🔐 Tài Khoản" tab
- [ ] Register as Reader
  - [ ] Enter email
  - [ ] Enter username
  - [ ] Enter password
  - [ ] Click Register
  - [ ] Verify success message
- [ ] Logout
- [ ] Login with same credentials
  - [ ] Verify login works
  - [ ] Verify user info displays
- [ ] Refresh page
  - [ ] Verify session persists
- [ ] Open new tab
  - [ ] Go to http://localhost:5173/
  - [ ] Verify still logged in (session persists)

### Reader Dashboard
- [ ] Click "👤 Độc Giả" tab (should appear when logged in)
- [ ] Verify three tabs appear:
  - [ ] 👤 Hồ Sơ (Profile)
  - [ ] 📤 Tải Lên Truyện (Upload Story)
  - [ ] ⬆️ Nâng Cấp Tài Khoản (Upgrade Account)
- [ ] Click "📤 Tải Lên Truyện" tab
- [ ] Verify upload form appears with fields:
  - [ ] Story Title
  - [ ] Author Name
  - [ ] Genre
  - [ ] Summary
  - [ ] Background
  - [ ] Source Platform
  - [ ] Source URL

### Admin Dashboard
- [ ] Logout
- [ ] Login as Admin (if available)
  - [ ] Email: admin@example.com
  - [ ] Password: admin123
- [ ] Verify "⚙️ Admin" tab appears
- [ ] Click Admin tab
- [ ] Verify three tabs appear:
  - [ ] 📤 Yêu Cầu Gửi Truyện (Submissions)
  - [ ] 📚 Tải Lên Truyện Từ Độc Giả (Story Uploads)
  - [ ] ⬆️ Yêu Cầu Nâng Cấp (Upgrade Requests)

### Search Features
- [ ] Click "🔍 Tìm Kiếm" tab
- [ ] Verify search form appears
- [ ] Click "▶ Tìm Kiếm Nâng Cao" button
- [ ] Verify advanced search panel opens with:
  - [ ] Tag filtering section
  - [ ] Genre filtering dropdown
  - [ ] Status filtering dropdown
  - [ ] Apply Filters button
  - [ ] Clear Filters button
- [ ] Try searching by title
- [ ] Try filtering by tags
- [ ] Try filtering by genre
- [ ] Try filtering by status

---

## 📚 Documentation Review (10 minutes)

- [ ] Read `docs/00_START_HERE.md` (master index)
- [ ] Read `docs/QUICK_REFERENCE_NEW_FEATURES.md` (features)
- [ ] Read `docs/QUICK_START.md` (quick start)
- [ ] Bookmark `docs/` folder for future reference

---

## 🔧 Troubleshooting (if needed)

### SQL Error
- [ ] Check `docs/SQL_SETUP_GUIDE.md`
- [ ] Verify using `supabase_schema_safe.sql`
- [ ] Check Supabase console for errors

### App Won't Start
- [ ] Check `docs/QUICK_START.md`
- [ ] Verify Node.js installed: `node --version`
- [ ] Verify npm installed: `npm --version`
- [ ] Delete `node_modules` and run `npm install` again

### Features Not Working
- [ ] Check browser console (F12)
- [ ] Check terminal for errors
- [ ] Verify database tables exist
- [ ] Check `docs/QUICK_REFERENCE_NEW_FEATURES.md`

### Can't Find Documentation
- [ ] Start with `docs/00_START_HERE.md`
- [ ] Use Ctrl+F to search
- [ ] Check `docs/ERROR_FIX_SUMMARY.md`

---

## ✅ Final Verification

- [ ] Database setup complete (no SQL errors)
- [ ] Application running (http://localhost:5173/)
- [ ] Can register and login
- [ ] Session persists across tabs
- [ ] Admin dashboard hidden from non-admin users
- [ ] Story upload form appears for readers
- [ ] Advanced search works with filters
- [ ] No errors in browser console
- [ ] No errors in terminal

---

## 🎉 Success!

If all checkboxes are checked, you're ready to go!

### Next Steps
1. Explore the application
2. Test all features
3. Read the documentation
4. Deploy when ready

### Need Help?
- Check `docs/00_START_HERE.md`
- Check `docs/QUICK_REFERENCE_NEW_FEATURES.md`
- Check `docs/ERROR_FIX_SUMMARY.md`

---

## 📞 Support Resources

| Issue | Solution |
|-------|----------|
| SQL Error | `docs/SQL_SETUP_GUIDE.md` |
| App Won't Start | `docs/QUICK_START.md` |
| Feature Question | `docs/QUICK_REFERENCE_NEW_FEATURES.md` |
| Deployment Help | `docs/DEPLOYMENT.md` |
| Testing Help | `docs/TESTING_GUIDE.md` |

---

**Status:** ✅ Ready to Use!
**Last Updated:** 2025-10-19

