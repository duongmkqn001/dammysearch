# 🧪 Testing Guide - Account System Optimization

## Prerequisites

1. ✅ Updated database schema (run `supabase_schema.sql`)
2. ✅ Application running (`npm run dev`)
3. ✅ Browser console open (F12)

---

## 🧪 Test Cases

### Test 1: Reader Registration

**Steps**:
1. Go to **👤 Độc Giả** tab
2. Click **"Chưa có tài khoản? Đăng Ký"**
3. Fill in:
   - Email: `reader@example.com`
   - Username: `reader_user`
   - Password: `password123`
4. Click **Đăng Ký**

**Expected Result**:
- ✅ Success message: "Đăng ký thành công! Vui lòng đăng nhập."
- ✅ Form clears
- ✅ Can login with new credentials

**Verify in Database**:
```sql
SELECT * FROM user_accounts WHERE email = 'reader@example.com';
-- Should show: user_type='reader', role='user'
```

---

### Test 2: Reader Login

**Steps**:
1. Go to **👤 Độc Giả** tab
2. Enter credentials from Test 1
3. Click **Đăng Nhập**

**Expected Result**:
- ✅ Login successful
- ✅ Redirected to profile tab
- ✅ Shows user info: Email, Username, Account Type, Role

---

### Test 3: Request Account Upgrade

**Steps**:
1. Login as reader (from Test 2)
2. Click **⬆️ Nâng Cấp Tài Khoản** tab
3. Fill in:
   - Platform: `Wattpad`
   - Link: `https://www.wattpad.com/user/myprofile`
   - Image URL (optional): `https://example.com/proof.jpg`
4. Click **Gửi Yêu Cầu**

**Expected Result**:
- ✅ Success message: "Yêu cầu nâng cấp đã được gửi!"
- ✅ Form clears
- ✅ Request appears in history

**Verify in Database**:
```sql
SELECT * FROM account_upgrade_requests 
WHERE user_account_id = (SELECT id FROM user_accounts WHERE email = 'reader@example.com');
-- Should show: status='pending'
```

---

### Test 4: Admin Login

**Steps**:
1. Go to **⚙️ Admin** tab
2. Enter password: `duongmkqn1D`
3. Click **Đăng Nhập**

**Expected Result**:
- ✅ Login successful
- ✅ Shows admin dashboard
- ✅ Two tabs visible: "📤 Yêu Cầu Gửi Truyện" and "⬆️ Yêu Cầu Nâng Cấp"

---

### Test 5: Admin Reviews Upgrade Request

**Steps**:
1. Login as admin (from Test 4)
2. Click **⬆️ Yêu Cầu Nâng Cấp** tab
3. Should see the request from Test 3
4. Click **Chi Tiết** button

**Expected Result**:
- ✅ Modal opens showing:
  - Platform: Wattpad
  - Link: https://www.wattpad.com/user/myprofile
  - Status: Chờ xử lý
  - Proof image link (if provided)

---

### Test 6: Admin Approves Upgrade Request

**Steps**:
1. In the modal from Test 5
2. (Optional) Add notes in "Ghi Chú Admin" field
3. Click **✓ Phê Duyệt** button

**Expected Result**:
- ✅ Success message: "Yêu cầu đã được phê duyệt!"
- ✅ Modal closes
- ✅ Request status changes to "Phê duyệt"

**Verify in Database**:
```sql
SELECT * FROM account_upgrade_requests 
WHERE user_account_id = (SELECT id FROM user_accounts WHERE email = 'reader@example.com');
-- Should show: status='approved'

SELECT * FROM user_accounts WHERE email = 'reader@example.com';
-- Should show: role='translator', user_type='translator'
```

---

### Test 7: Admin Rejects Upgrade Request

**Steps**:
1. Create another upgrade request (Test 3 with different email)
2. Login as admin
3. Go to **⬆️ Yêu Cầu Nâng Cấp** tab
4. Click **Chi Tiết** on the new request
5. Add notes: "Platform not verified"
6. Click **✗ Từ Chối** button

**Expected Result**:
- ✅ Success message: "Yêu cầu đã được từ chối!"
- ✅ Modal closes
- ✅ Request status changes to "Từ chối"
- ✅ User role remains 'user'

---

### Test 8: Filter Upgrade Requests

**Steps**:
1. Login as admin
2. Go to **⬆️ Yêu Cầu Nâng Cấp** tab
3. Click filter dropdown
4. Select **"Phê duyệt"**

**Expected Result**:
- ✅ Table shows only approved requests
- ✅ Can filter by: pending, approved, rejected, all

---

### Test 9: Story Submission (Translator)

**Steps**:
1. Go to **✍️ Dịch Giả** tab
2. Register/Login as translator
3. Click **➕ Gửi Truyện Mới**
4. Fill in story details:
   - Title: "Test Story"
   - Author: "Test Author"
   - Summary: "Test summary"
   - Background: "Test background"
   - Genre: "BL"
   - Platform: "Wattpad"
   - Link: "https://..."
5. Click **Gửi Truyện**

**Expected Result**:
- ✅ Success message: "Gửi truyện thành công!"
- ✅ Form clears
- ✅ Submission appears in "📤 Bài Gửi Của Tôi"

---

### Test 10: Admin Reviews Story Submission

**Steps**:
1. Login as admin
2. Go to **📤 Yêu Cầu Gửi Truyện** tab
3. Should see submission from Test 9
4. Click **Chi Tiết**

**Expected Result**:
- ✅ Modal shows story details
- ✅ Can change status
- ✅ Can add notes
- ✅ Can approve and add to system

---

## 🔍 Verification Checklist

### Database Verification:
```sql
-- Check user_accounts table
SELECT COUNT(*) FROM user_accounts;

-- Check account_upgrade_requests table
SELECT COUNT(*) FROM account_upgrade_requests;

-- Check story_classifications table
SELECT COUNT(*) FROM story_classifications;

-- Check story_classifications_mapping table
SELECT COUNT(*) FROM story_classifications_mapping;

-- Check indexes
SELECT * FROM pg_indexes WHERE tablename IN ('user_accounts', 'account_upgrade_requests', 'story_classifications');
```

### Application Verification:
- ✅ Reader tab appears in navigation
- ✅ Reader can register and login
- ✅ Reader can request upgrade
- ✅ Admin can view upgrade requests
- ✅ Admin can approve/reject
- ✅ User role changes after approval
- ✅ No console errors

---

## 🐛 Troubleshooting

### Issue: "Table does not exist"
**Solution**: Run the updated `supabase_schema.sql` in Supabase console

### Issue: "Foreign key constraint failed"
**Solution**: Ensure parent records exist before inserting

### Issue: "Cannot read property of undefined"
**Solution**: Check browser console for specific error, verify data exists

### Issue: Admin tab not showing upgrades
**Solution**: 
1. Verify `account_upgrade_requests` table exists
2. Check if any requests exist in database
3. Refresh page

---

## 📊 Test Results Template

```
Test Case: [Name]
Status: [PASS/FAIL]
Date: [Date]
Notes: [Any issues or observations]

Database State:
- user_accounts: [count]
- account_upgrade_requests: [count]
- story_classifications: [count]

Issues Found:
- [Issue 1]
- [Issue 2]

Recommendations:
- [Recommendation 1]
- [Recommendation 2]
```

---

## ✅ Sign-Off Checklist

- [ ] All 10 test cases passed
- [ ] Database tables verified
- [ ] No console errors
- [ ] All workflows functional
- [ ] UI responsive on mobile
- [ ] Admin features working
- [ ] User data persists
- [ ] Ready for production

---

## 📞 Support

If tests fail:
1. Check browser console (F12)
2. Check Supabase logs
3. Verify database schema
4. Review component code
5. Check network requests

---

**Testing Guide Complete!** ✅

Follow these tests to verify the account system optimization is working correctly.

