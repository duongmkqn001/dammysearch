# 🚀 Quick Reference Guide

## 📱 Application Tabs

| Tab | Icon | Purpose |
|-----|------|---------|
| **Search** | 🔍 | Search for stories by title |
| **Authors** | 👥 | Browse all authors |
| **Works** | 📚 | View all stories |
| **Translator** | ✍️ | Register & submit stories |
| **Admin** | ⚙️ | Manage submissions |

---

## 🔐 Admin Access

**Tab**: ⚙️ Admin  
**Password**: `duongmkqn1D`  
**URL**: http://localhost:5173/

---

## 👥 Translator Workflow

### 1. Register
- Tab: ✍️ Dịch Giả
- Click: **Đăng Ký** (Register)
- Enter: Email, Username, Password

### 2. Login
- Enter: Email & Password
- Click: **Đăng Nhập** (Login)

### 3. Submit Story
- Click: **➕ Gửi Truyện Mới** (Submit New Story)
- Fill: Title, Author, Summary, Background, Genre
- Click: **Gửi** (Submit)

### 4. Track Status
- View: **📤 Bài Gửi Của Tôi** (My Submissions)
- Status: Incoming → Process → Completed

---

## 👨‍💼 Admin Workflow

### 1. Login
- Tab: ⚙️ Admin
- Password: `duongmkqn1D`
- Click: **Đăng Nhập** (Login)

### 2. View Submissions
- See table with all submissions
- Filter by status (All, Incoming, Process, Completed, Rejected)

### 3. Review Details
- Click: **Chi Tiết** (Details)
- Read: Story information
- See: Translator details

### 4. Change Status
- Select: New status
- Add: Reason (optional)
- Click: **Cập Nhật Trạng Thái** (Update Status)

### 5. Approve Story
- Click: **Phê Duyệt & Thêm Truyện** (Approve & Add Story)
- System creates: Author & Work
- Status: Completed

---

## 📊 Status Meanings

| Status | Color | Meaning |
|--------|-------|---------|
| Incoming | 🟡 | New, not reviewed |
| Process | 🔵 | Under review |
| Completed | 🟢 | Approved |
| Rejected | 🔴 | Not approved |

---

## 🗄️ Database Tables

### translator_accounts
- Email (unique)
- Username (unique)
- Password (hashed)
- Account status

### story_import_requests
- Title, Author, Summary
- Status (incoming, process, completed, rejected)
- Translator ID
- Source info

### story_status_history
- Old status → New status
- Reason for change
- Timestamp

---

## 🔧 Environment Variables

**File**: `bl-novels-app/.env.local`

```
VITE_SUPABASE_URL=https://hkflizcmxtzmmdawiopq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `.env.local` | Supabase credentials |
| `AdminDashboard.jsx` | Admin interface |
| `TranslatorDashboard.jsx` | Translator interface |
| `ADMIN_GUIDE.md` | Admin documentation |
| `TRANSLATOR_SYSTEM.md` | Translator guide |

---

## 🎯 Common Tasks

### Register New Translator
1. Go to ✍️ Dịch Giả tab
2. Click Đăng Ký
3. Enter email, username, password
4. Click Đăng Ký

### Submit a Story
1. Login to translator account
2. Click ➕ Gửi Truyện Mới
3. Fill story details
4. Click Gửi

### Approve a Story
1. Login to admin (password: duongmkqn1D)
2. Find submission in table
3. Click Chi Tiết
4. Click Phê Duyệt & Thêm Truyện

### Change Submission Status
1. Login to admin
2. Click Chi Tiết on submission
3. Select new status
4. Add reason
5. Click Cập Nhật Trạng Thái

---

## 🚀 Start Commands

```bash
# Start dev server
cd bl-novels-app
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| **App** | http://localhost:5173/ |
| **Supabase** | https://hkflizcmxtzmmdawiopq.supabase.co |

---

## 📞 Troubleshooting

### Admin password not working
- Check: `duongmkqn1D` (exact spelling)
- No spaces before/after
- Caps Lock off

### Can't see submissions
- Check internet connection
- Verify Supabase is connected
- Refresh page
- Check browser console

### Story not appearing after approval
- Wait a few seconds
- Refresh page
- Check Search tab
- Check Works tab

---

## 💡 Tips

✅ Always add a reason when changing status  
✅ Review story details before approving  
✅ Check for duplicate authors  
✅ Monitor translator activity  
✅ Keep audit trail updated  

---

## 🔐 Security

⚠️ Change admin password regularly  
⚠️ Use strong translator passwords  
⚠️ Enable email verification (production)  
⚠️ Use HTTPS (production)  
⚠️ Implement 2FA (production)  

---

**Last Updated**: 2025-10-19  
**Status**: ✅ Ready to Use

