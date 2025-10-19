# 👨‍💼 Admin Guide - Translator Management System

## 📋 Table of Contents
1. [Admin Login](#admin-login)
2. [Translator Registration Process](#translator-registration-process)
3. [Approving Translator Requests](#approving-translator-requests)
4. [Managing Story Submissions](#managing-story-submissions)
5. [Status Workflow](#status-workflow)
6. [Troubleshooting](#troubleshooting)

---

## 🔐 Admin Login

### Admin Credentials
- **Username**: Admin Dashboard
- **Password**: `duongmkqn1D`

### How to Access Admin Panel
1. Open the application at `http://localhost:5173/`
2. Click on the **⚙️ Admin** tab at the top
3. Enter the admin password: `duongmkqn1D`
4. Click **Đăng Nhập** (Login)
5. You will see the admin dashboard with all submissions

---

## 👥 Translator Registration Process

### How Translators Register

#### Step 1: Access Translator Dashboard
1. Translators go to the **✍️ Dịch Giả** tab
2. They see the translator login/registration form

#### Step 2: Register New Account
Translators fill in:
- **Email**: Their email address (must be unique)
- **Username**: Their username (must be unique)
- **Password**: Their password (stored securely)

#### Step 3: Submit Registration
1. Click **Đăng Ký** (Register) button
2. Account is created in the `translator_accounts` table
3. They can now login with their credentials

#### Step 4: Login
1. Enter their email and password
2. Click **Đăng Nhập** (Login)
3. They access their translator dashboard

### Database Structure for Translators

**Table: `translator_accounts`**
```
- id: Unique identifier
- email: Translator's email (UNIQUE)
- username: Translator's username (UNIQUE)
- password_hash: Encrypted password
- translator_id: Link to translators table
- is_active: Account status (true/false)
- is_verified: Email verification status
- verification_token: For email verification
- created_at: Registration date
- updated_at: Last update date
```

---

## 📤 Approving Translator Requests

### Step 1: View All Submissions
1. Login to Admin Dashboard with password: `duongmkqn1D`
2. You see a table with all story submissions
3. Each row shows:
   - **Title**: Story title
   - **Author**: Author name
   - **Translator**: Who submitted it
   - **Status**: Current status
   - **Date**: Submission date

### Step 2: Filter by Status
Use the **Status Filter** dropdown to view:
- **All**: All submissions
- **Incoming**: New submissions (not reviewed)
- **Process**: Under review
- **Completed**: Approved and added to system
- **Rejected**: Not approved

### Step 3: Review Submission Details
1. Click **Chi Tiết** (Details) button on any submission
2. A modal opens showing:
   - Story title
   - Author name
   - Summary
   - Background/Description
   - Main genre
   - Translator name
   - Source URL (if provided)
   - Source platform
   - Admin notes
   - Current status

### Step 4: Change Status
1. In the details modal, select a new status from dropdown:
   - **Incoming**: Initial state
   - **Process**: Currently reviewing
   - **Completed**: Approved
   - **Rejected**: Not approved

2. Add a reason (optional but recommended):
   - "Approved for publication"
   - "Needs more information"
   - "Quality issues"
   - etc.

3. Click **Cập Nhật Trạng Thái** (Update Status)

### Step 5: Approve and Add Story
1. When ready to approve, click **Phê Duyệt & Thêm Truyện** (Approve & Add Story)
2. The system automatically:
   - Creates the author (if not exists)
   - Creates the work/story
   - Sets status to "Completed"
   - Notifies the translator

---

## 📚 Managing Story Submissions

### Submission Table Columns

| Column | Description |
|--------|-------------|
| **Title** | Story title |
| **Author** | Author name |
| **Translator** | Translator username |
| **Status** | Current status (badge) |
| **Date** | Submission date |
| **Actions** | Details & Approve buttons |

### Status Badges

- 🟡 **Incoming** (Yellow): New submission, not reviewed
- 🔵 **Process** (Blue): Under review
- 🟢 **Completed** (Green): Approved and added
- 🔴 **Rejected** (Red): Not approved

### Workflow Example

```
Translator Submits Story
        ↓
Status: Incoming (Yellow)
        ↓
Admin Reviews Details
        ↓
Admin Changes to: Process (Blue)
        ↓
Admin Adds Reason: "Reviewing quality"
        ↓
Admin Approves & Adds Story
        ↓
Status: Completed (Green)
        ↓
Story appears in Search/Works tabs
```

---

## 🔄 Status Workflow

### Status Meanings

#### 1. **Incoming** 🟡
- New submission from translator
- Not yet reviewed
- Action: Review and decide

#### 2. **Process** 🔵
- Currently being reviewed
- Admin is checking quality
- Action: Continue review or approve

#### 3. **Completed** 🟢
- Approved and added to system
- Story is now available
- Action: Monitor for issues

#### 4. **Rejected** 🔴
- Not approved
- Story not added to system
- Action: Notify translator of reason

### Status Change Audit Trail

Every status change is recorded in `story_status_history` table:
- Old status
- New status
- Reason for change
- Change timestamp
- Admin who made change

---

## 📊 Database Tables

### `story_import_requests`
Stores all story submissions:
```
- id: Unique ID
- title: Story title
- author_name: Author name
- summary: Story summary
- background: Story background
- main_genre: Primary genre
- translator_id: Translator who submitted
- status: Current status
- source_url: Original source URL
- source_platform: Platform (Wattpad, etc.)
- notes: Admin notes
- created_at: Submission date
- updated_at: Last update
```

### `story_status_history`
Audit trail of all status changes:
```
- id: Unique ID
- story_import_id: Link to submission
- old_status: Previous status
- new_status: New status
- reason: Reason for change
- admin_id: Admin who made change
- created_at: Change timestamp
```

### `translator_accounts`
Translator user accounts:
```
- id: Unique ID
- email: Email address
- username: Username
- password_hash: Encrypted password
- translator_id: Link to translators table
- is_active: Account active status
- is_verified: Email verified status
- created_at: Registration date
- updated_at: Last update
```

---

## 🎯 Best Practices

### For Approving Stories
1. ✅ Always review the summary and background
2. ✅ Check the author name for duplicates
3. ✅ Verify the genre is appropriate
4. ✅ Add a reason when changing status
5. ✅ Approve only high-quality submissions

### For Managing Translators
1. ✅ Monitor translator activity
2. ✅ Provide feedback on rejections
3. ✅ Encourage quality submissions
4. ✅ Keep audit trail updated
5. ✅ Respond to translator inquiries

### For System Maintenance
1. ✅ Regularly review pending submissions
2. ✅ Archive old completed submissions
3. ✅ Monitor for duplicate stories
4. ✅ Check for spam submissions
5. ✅ Update admin password regularly

---

## 🔧 Troubleshooting

### Issue: Admin password not working
**Solution**: 
- Verify password is exactly: `duongmkqn1D`
- Check for extra spaces
- Ensure Caps Lock is off

### Issue: Can't see submissions
**Solution**:
- Ensure Supabase is connected
- Check internet connection
- Verify database tables exist
- Try refreshing the page

### Issue: Can't approve story
**Solution**:
- Ensure all required fields are filled
- Check if author already exists
- Verify translator account is active
- Check database permissions

### Issue: Status change not saving
**Solution**:
- Check internet connection
- Verify Supabase connection
- Try again after a few seconds
- Check browser console for errors

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the database schema in `supabase_schema.sql`
3. Check browser console for error messages
4. Verify Supabase credentials in `.env.local`

---

## 🔐 Security Notes

⚠️ **Important**: 
- Admin password should be changed regularly
- Use strong passwords for translator accounts
- Enable email verification in production
- Implement proper authentication (not just password)
- Use HTTPS in production
- Implement rate limiting for login attempts
- Add two-factor authentication for admin

---

**Admin Dashboard Ready!** 🚀

You can now manage translators and approve story submissions!

