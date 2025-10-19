# 🚀 Quick Start Guide

## 5 Phút Để Bắt Đầu

### Bước 1: Chuẩn Bị Supabase (2 phút)

1. Truy cập [supabase.com](https://supabase.com) và đăng nhập
2. Tạo project mới
3. Vào SQL Editor
4. Sao chép toàn bộ nội dung từ `supabase_schema.sql`
5. Chạy SQL (Ctrl+Enter)
6. Vào Settings > API để lấy:
   - Project URL
   - Anon Key (public)

### Bước 2: Cấu Hình Ứng Dụng (1 phút)

```bash
cd bl-novels-app
cp .env.example .env.local
```

Chỉnh sửa `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Bước 3: Chạy Ứng Dụng (2 phút)

```bash
npm install
npm run dev
```

Truy cập: http://localhost:5173

## 📝 Thêm Dữ Liệu

### Thêm Tác Giả:
1. Vào Supabase > Table Editor
2. Chọn bảng `authors`
3. Click "Insert row"
4. Nhập tên tác giả

### Thêm Tác Phẩm:
1. Chọn bảng `works`
2. Click "Insert row"
3. Nhập:
   - title: Tên tác phẩm
   - author_id: ID tác giả
   - summary: Tóm tắt
   - status: ongoing/completed/hiatus

### Thêm Thẻ:
1. Chọn bảng `work_tags`
2. Click "Insert row"
3. Nhập:
   - work_id: ID tác phẩm
   - tag_name: Tên thẻ

## 🌐 Deploy lên GitHub Pages

### Bước 1: Tạo Repository
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/bl-novels-app.git
git push -u origin main
```

### Bước 2: Cấu Hình GitHub
1. Vào Settings > Pages
2. Chọn "Deploy from a branch"
3. Chọn branch `gh-pages`

### Bước 3: Deploy
```bash
npm run build
npx gh-pages -d dist
```

Ứng dụng sẽ có tại: `https://your-username.github.io/bl-novels-app/`

## 🎨 Tùy Chỉnh Nhanh

### Thay Đổi Tiêu Đề:
File: `bl-novels-app/src/App.jsx`
```jsx
<h1>Tên Ứng Dụng Của Bạn</h1>
```

### Thay Đổi Màu Sắc:
File: `bl-novels-app/src/App.css`
```css
.app-header h1 {
  color: #your-color;
}
```

### Thay Đổi Font:
File: `bl-novels-app/src/index.css`
```css
:root {
  font-family: 'Your Font', sans-serif;
}
```

## 🐛 Troubleshooting

### Lỗi: "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### Lỗi: "Supabase connection failed"
- Kiểm tra `.env.local` có đúng URL và Key không
- Kiểm tra CORS trong Supabase Settings

### Ứng dụng không tải dữ liệu
- Mở DevTools (F12)
- Xem Console tab có lỗi gì
- Kiểm tra Network tab

### Trang trắng khi deploy
- Kiểm tra `base` trong `vite.config.js`
- Xóa cache browser (Ctrl+Shift+Delete)

## 📚 Tài Liệu Đầy Đủ

- `README.md` - Giới thiệu dự án
- `SETUP.md` - Hướng dẫn cài đặt chi tiết
- `DEPLOYMENT.md` - Hướng dẫn deploy
- `PROJECT_SUMMARY.md` - Tóm tắt dự án

## 💡 Tips

1. **Phát triển nhanh**: Vite có HMR, thay đổi code sẽ tự động reload
2. **Debug**: Sử dụng React DevTools extension
3. **Performance**: Kiểm tra Network tab để xem tốc độ tải
4. **Mobile test**: Dùng DevTools > Toggle device toolbar (Ctrl+Shift+M)

## 🎯 Tiếp Theo

1. ✅ Cấu hình Supabase
2. ✅ Chạy dev server
3. ✅ Thêm dữ liệu test
4. ✅ Tùy chỉnh giao diện
5. ✅ Deploy lên GitHub Pages

---

## 🎉 NEW: Account System Optimization (v2.0.0)

### What's New:
- ✅ Reader and Translator user types
- ✅ Account upgrade workflow
- ✅ Admin approval system
- ✅ Story classification system
- ✅ Enhanced admin dashboard

### Quick Test (5 minutes):

**1. Register as Reader:**
- Go to 👤 Độc Giả tab
- Click "Chưa có tài khoản? Đăng Ký"
- Fill in: email, username, password
- Click Đăng Ký

**2. Request Upgrade:**
- Login with reader account
- Click "⬆️ Nâng Cấp Tài Khoản"
- Fill in platform info
- Click "Gửi Yêu Cầu"

**3. Admin Approval:**
- Go to ⚙️ Admin tab
- Password: `duongmkqn1D`
- Click "⬆️ Yêu Cầu Nâng Cấp"
- Click "Chi Tiết" on request
- Click "✓ Phê Duyệt"

### Documentation:
- `ACCOUNT_SYSTEM_IMPLEMENTATION.md` - Full guide
- `TESTING_GUIDE.md` - 10 test cases
- `DEPLOYMENT_CHECKLIST.md` - Deployment steps
- `FINAL_SUMMARY.md` - Complete summary

---

**Chúc bạn thành công!** 🎉

