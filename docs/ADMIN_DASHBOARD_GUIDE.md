# ⚙️ Admin Dashboard - Private Access Guide

## 🔐 Admin Dashboard Overview

The Admin Dashboard is a **private, restricted area** for administrators only. It provides complete control over the application.

---

## 🔑 Access Control

### Admin Authentication
- **Role Required:** `admin`
- **Access Level:** Full system access
- **Session Persistence:** Stored in localStorage
- **Auto-logout:** On browser close (optional)

### How Admin Access Works
```javascript
// Admin check in App.jsx
{isAdmin() && (
  <button onClick={() => setActiveTab('admin')}>⚙️ Admin</button>
)}

// Only admins see the admin tab
// Non-admins cannot access even with direct URL
```

---

## 🚀 Accessing Admin Dashboard

### Step 1: Admin Login
1. Go to application URL
2. Click **🔐 Tài Khoản** (Account)
3. Click **Đăng Nhập** (Login)
4. Enter admin credentials:
   - Email: `admin@example.com`
   - Password: `your-secure-password`
5. Click **Đăng Nhập** (Login)

### Step 2: Access Admin Tab
1. After login, you'll see **⚙️ Admin** tab
2. Click **⚙️ Admin**
3. Admin Dashboard opens

### Step 3: Admin Dashboard URL
```
Direct URL: https://your-domain.com/#/admin
Local Dev: http://localhost:5173/#/admin
```

---

## 📊 Admin Dashboard Features

### 1️⃣ Story Upload Requests Tab
**Purpose:** Review and approve/reject story uploads

**Features:**
- View all pending story uploads
- See story details:
  - Title
  - Author name
  - Genre
  - Summary
  - Background
  - Tags
  - Source platform & URL
- Approve story upload
- Reject with notes
- View upload history

**Actions:**
```
For each upload:
- ✅ Phê Duyệt (Approve) - Create work in database
- ❌ Từ Chối (Reject) - Add rejection notes
- 📝 Xem Chi Tiết (View Details) - Full story info
```

### 2️⃣ Translator Submissions Tab
**Purpose:** Review translator submissions

**Features:**
- View all translator submissions
- See submission details:
  - Translator name
  - Story title
  - Chapter number
  - Translation platform
  - Translation URL
  - Status
- Approve submission
- Reject with notes
- View submission history

**Actions:**
```
For each submission:
- ✅ Phê Duyệt (Approve) - Publish translation
- ❌ Từ Chối (Reject) - Add rejection notes
- 📝 Xem Chi Tiết (View Details) - Full submission info
```

### 3️⃣ User Management Tab
**Purpose:** Manage user accounts

**Features:**
- View all users
- See user details:
  - Email
  - User type (Reader/Translator)
  - Account status
  - Created date
- Upgrade user to translator
- Deactivate user account
- View user activity

**Actions:**
```
For each user:
- ⬆️ Nâng Cấp (Upgrade) - Make translator
- 🔒 Khóa (Lock) - Deactivate account
- 📊 Xem Hoạt Động (View Activity) - User history
```

### 4️⃣ Statistics Tab
**Purpose:** View application statistics

**Features:**
- Total users count
- Total stories count
- Total translations count
- Pending approvals count
- Recent activity
- Popular tags
- Genre distribution

**Metrics:**
```
📊 Statistics Dashboard
├── 👥 Users: 150
├── 📚 Stories: 500
├── 🌐 Translations: 1200
├── ⏳ Pending: 25
├── 🏷️ Popular Tags: [Đam Mỹ, Hiện Đại, ...]
└── 📈 Activity: Last 7 days
```

---

## 🔒 Security Features

### Password Protection
- Admin credentials stored securely
- Base64 encoding (upgrade to bcrypt in production)
- Session stored in localStorage
- Auto-logout on browser close

### Access Control
- Role-based access (RBAC)
- Admin-only tab visibility
- URL protection (non-admins redirected)
- Session validation

### Audit Trail
- All admin actions logged
- Approval/rejection history
- User activity tracking
- Change timestamps

---

## 📋 Admin Workflows

### Approving Story Upload
```
1. Go to Admin Dashboard
2. Click "Yêu Cầu Tải Lên Truyện" (Upload Requests)
3. Review story details
4. Click "✅ Phê Duyệt" (Approve)
5. Story is created in database
6. Tags are created in work_tags table
7. Reader is notified
```

### Rejecting Story Upload
```
1. Go to Admin Dashboard
2. Click "Yêu Cầu Tải Lên Truyện" (Upload Requests)
3. Review story details
4. Click "❌ Từ Chối" (Reject)
5. Enter rejection reason
6. Click "Gửi"
7. Reader sees rejection notes
```

### Upgrading User to Translator
```
1. Go to Admin Dashboard
2. Click "Quản Lý Người Dùng" (User Management)
3. Find user to upgrade
4. Click "⬆️ Nâng Cấp" (Upgrade)
5. Confirm upgrade
6. User becomes translator
7. User can now submit translations
```

---

## 🗄️ Database Operations

### Story Approval Process
```sql
-- When admin approves story upload:
1. Create author (if not exists)
2. Create work from upload_request
3. Create work_tags from upload_tags
4. Update story_upload_requests status to 'approved'
5. Create work_status_history entry
```

### User Upgrade Process
```sql
-- When admin upgrades user:
1. Update user_accounts role to 'translator'
2. Create translator entry
3. Create translator_accounts entry
4. Log action in audit trail
```

---

## 📊 Admin Dashboard Statistics

### Key Metrics
| Metric | Purpose |
|--------|---------|
| Total Users | Monitor user growth |
| Total Stories | Track content volume |
| Pending Approvals | Identify bottlenecks |
| Popular Tags | Understand user interests |
| Genre Distribution | See content trends |

### Reports
- Daily activity report
- Weekly approval metrics
- Monthly user growth
- Quarterly performance review

---

## 🔧 Admin Configuration

### Admin Credentials
```env
VITE_ADMIN_EMAIL=admin@example.com
VITE_ADMIN_PASSWORD=your-secure-password
```

### Admin Role
```javascript
// In database
user_accounts table:
- role: 'admin'
- user_type: 'admin'
```

### Admin Permissions
```javascript
// Admin can:
- View all stories
- Approve/reject uploads
- Manage users
- View statistics
- Access audit logs
```

---

## 🚨 Important Notes

### Security Best Practices
- ✅ Use strong admin password
- ✅ Change password regularly
- ✅ Don't share admin credentials
- ✅ Logout after use
- ✅ Monitor admin activity

### Backup & Recovery
- Regular database backups
- Backup admin credentials
- Recovery procedures documented
- Disaster recovery plan

### Monitoring
- Monitor admin actions
- Track approval times
- Monitor system performance
- Alert on suspicious activity

---

## 📞 Admin Support

### Common Issues
**Q: Can't access admin dashboard?**
A: Verify admin role in database, check credentials

**Q: Approval taking too long?**
A: Check pending queue, prioritize urgent items

**Q: User upgrade not working?**
A: Verify user exists, check database permissions

**Q: Statistics not updating?**
A: Refresh page, check database connection

---

## 🎯 Admin Responsibilities

### Daily Tasks
- [ ] Review pending story uploads
- [ ] Review translator submissions
- [ ] Respond to user requests
- [ ] Monitor system health

### Weekly Tasks
- [ ] Review user activity
- [ ] Check statistics
- [ ] Backup database
- [ ] Review error logs

### Monthly Tasks
- [ ] Generate reports
- [ ] Update documentation
- [ ] Security audit
- [ ] Performance review

---

## 🔐 Private Dashboard Access

### Direct Links
```
Production: https://your-domain.com/#/admin
Development: http://localhost:5173/#/admin
```

### Access Requirements
- Admin account created
- Admin role assigned
- Valid credentials
- Active session

### Session Management
- Session stored in localStorage
- Persists across page refresh
- Clears on logout
- Auto-logout on browser close (optional)

---

**Status:** ✅ Admin Dashboard Ready

**Date:** 2025-10-19
**Version:** 1.0

