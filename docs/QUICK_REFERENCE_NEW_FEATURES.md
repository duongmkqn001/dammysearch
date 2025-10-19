# Quick Reference: New Features

## 🔐 Authentication System

### Login/Registration
- **Location:** "🔐 Tài Khoản" tab in main navigation
- **User Types:** Reader or Translator
- **Session:** Persists across all tabs
- **Storage:** Saved in localStorage

### User Profile
- Shows when logged in
- Displays: Email, Username, Account Type, Role
- Logout button available

---

## 👤 Reader Dashboard

### Tabs Available (when logged in)
1. **👤 Hồ Sơ** - User profile and upgrade history
2. **📤 Tải Lên Truyện** - Upload stories
3. **⬆️ Nâng Cấp Tài Khoản** - Request translator upgrade

### Story Upload Feature
- **Upload Form Fields:**
  - Story Title (required)
  - Author Name (required)
  - Genre
  - Summary
  - Background
  - Source Platform
  - Source URL

- **Status Tracking:**
  - Pending: Waiting for admin review
  - Approved: Story accepted
  - Rejected: Story declined with admin notes

- **Admin Notes:** Visible in upload history

---

## ⚙️ Admin Dashboard

### Access
- Only visible to admin users
- Requires admin role in database

### Tabs Available
1. **📤 Yêu Cầu Gửi Truyện** - Translator submissions
2. **📚 Tải Lên Truyện Từ Độc Giả** - Reader uploads
3. **⬆️ Yêu Cầu Nâng Cấp** - Account upgrade requests

### Story Upload Management
- **View:** All reader story uploads
- **Filter:** By status (pending, approved, rejected)
- **Actions:**
  - View full details
  - Add admin notes
  - Approve or reject
  - Track submission date

---

## 🔍 Advanced Search

### Basic Search
- Search by title or author
- Quick search bar in main interface

### Advanced Search Panel
- **Toggle:** Click "▶ Tìm Kiếm Nâng Cao" button
- **Features:**
  - Tag filtering (multiple selection)
  - Genre filtering
  - Status filtering
  - Combined filters

### Tag Selection
- Click tags to select/deselect
- Selected tags highlighted in pink
- Multiple tags can be selected (OR logic)

### Filters
- **Genre:** Dropdown with all available genres
- **Status:** 
  - Ongoing (Đang tiến hành)
  - Completed (Hoàn thành)
  - Hiatus (Tạm dừng)

### Results
- Shows result count
- Displays tags on each story card
- Responsive grid layout

---

## 🔄 Session Persistence

### How It Works
- User login stored in localStorage
- Session persists across:
  - Tab switches
  - Page refreshes
  - Browser navigation
  - Multiple tabs

### Logout
- Click logout in account profile
- Clears localStorage
- Redirects to search tab

---

## 📊 Database Tables

### user_accounts
- Stores all user information
- Fields: email, username, password_hash, user_type, role, is_active

### story_upload_requests
- Tracks reader story uploads
- Fields: title, author_name, summary, status, admin_notes

### account_upgrade_requests
- Tracks translator upgrade requests
- Fields: platform_name, platform_link, status, admin_notes

---

## 🎨 UI/UX Features

### Color Scheme
- Primary: Pink (#E91E63)
- Secondary: Cyan (#00BCD4)
- Backgrounds: Light pastels

### Animations
- Smooth transitions
- Hover effects on buttons
- Slide-in animations for modals

### Responsive Design
- Mobile-friendly
- Tablet-optimized
- Desktop-enhanced

---

## ⚡ Performance

### Optimizations
- Lazy loading of tags and genres
- Client-side tag filtering
- Efficient database queries
- HMR (Hot Module Replacement) for development

---

## 🐛 Troubleshooting

### Session Lost
- Check browser localStorage
- Verify user_accounts table in database
- Check browser console for errors

### Admin Tab Not Showing
- Verify user role is 'admin' in database
- Check user_type field
- Refresh browser

### Search Not Working
- Verify work_tags table has data
- Check genres table
- Ensure works table is populated

### Story Upload Failed
- Check user is logged in
- Verify story_upload_requests table exists
- Check database permissions

---

## 📝 Notes

- All passwords are Base64 encoded (upgrade to bcrypt in production)
- Admin notes are optional
- Multiple tags can be selected for filtering
- Search results update in real-time
- All timestamps in UTC

---

## 🚀 Ready to Use!

The application is now fully functional with all new features implemented and ready for testing!

