# 📚 Thư Viện Tiểu Thuyết BL Trung Quốc

Một ứng dụng web hiện đại để tổng hợp, quản lý và tìm kiếm các tiểu thuyết BL Trung Quốc được dịch sang Tiếng Việt.

## ✨ Tính Năng

- 🔍 **Tìm Kiếm Nâng Cao**: Tìm kiếm tác phẩm theo tên, tác giả hoặc thẻ
- 👥 **Danh Sách Tác Giả**: Xem danh sách tác giả và các tác phẩm của họ
- 📚 **Tất Cả Tác Phẩm**: Xem toàn bộ danh sách tác phẩm với bộ lọc và sắp xếp
- 📱 **Responsive Design**: Tối ưu hóa hoàn toàn cho điện thoại di động
- ⚡ **Hiệu Suất Cao**: Xây dựng với Vite và React để tải nhanh
- 🎨 **Giao Diện Đẹp**: Thiết kế hiện đại với gradient và animation mượt mà
- 🌐 **Dễ Deploy**: Có thể deploy lên GitHub Pages hoặc bất kỳ host tĩnh nào

## 🛠️ Công Nghệ

- **Frontend**: React 18 + Vite
- **Database**: Supabase (PostgreSQL)
- **Styling**: CSS3 với animations
- **Deployment**: GitHub Pages / Vercel / Netlify

## 📋 Yêu Cầu

- Node.js 16+
- npm hoặc yarn
- Tài khoản Supabase (miễn phí)

## 🚀 Bắt Đầu Nhanh

### 1. Clone Repository
```bash
git clone https://github.com/your-username/bl-novels-app.git
cd bl-novels-app
```

### 2. Cài Đặt Dependencies
```bash
npm install
```

### 3. Cấu Hình Supabase
- Tạo tài khoản tại [supabase.com](https://supabase.com)
- Tạo project mới
- Chạy SQL schema từ file `../supabase_schema.sql`
- Sao chép URL và Anon Key

### 4. Tạo File .env.local
```bash
cp .env.example .env.local
```

Chỉnh sửa `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Chạy Development Server
```bash
npm run dev
```

Truy cập `http://localhost:5173`

## 📦 Build & Deploy

### Build cho Production
```bash
npm run build
```

### Deploy lên GitHub Pages
Xem [DEPLOYMENT.md](./DEPLOYMENT.md) để hướng dẫn chi tiết.

## 📁 Cấu Trúc Dự Án

```
bl-novels-app/
├── src/
│   ├── components/
│   │   ├── SearchTab.jsx
│   │   ├── AuthorListTab.jsx
│   │   └── WorksListTab.jsx
│   ├── styles/
│   │   ├── SearchTab.css
│   │   ├── AuthorListTab.css
│   │   ├── WorksListTab.css
│   │   └── animations.css
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── supabaseClient.js
├── .env.example
├── vite.config.js
├── SETUP.md
├── DEPLOYMENT.md
└── package.json
```

## 🗄️ Database Schema

Xem `../supabase_schema.sql` để biết chi tiết cấu trúc cơ sở dữ liệu.

**Các bảng chính:**
- `authors` - Thông tin tác giả
- `works` - Thông tin tác phẩm
- `chapters` - Các chương
- `translations` - Bản dịch
- `genres` - Thể loại
- `work_tags` - Thẻ tác phẩm
- `translators` - Dịch giả/biên tập viên
- `translation_platforms` - Nền tảng dịch

## 🎨 Tùy Chỉnh

### Thay Đổi Màu Sắc
Chỉnh sửa các biến màu trong `src/App.css`:
```css
--primary-color: #667eea;
--secondary-color: #764ba2;
```

### Thêm Tính Năng Mới
1. Tạo component mới trong `src/components/`
2. Tạo CSS tương ứng trong `src/styles/`
3. Import vào `App.jsx`

## 📱 Tối Ưu Hóa Mobile

- Responsive grid layout
- Touch-friendly buttons (min 44x44px)
- Optimized font sizes
- Smooth animations
- Reduced motion support

## 🔒 Bảo Mật

- Không commit `.env.local`
- Sử dụng GitHub Secrets cho production
- Kiểm tra Supabase RLS policies
- Validate input trên client và server

## 📝 License

MIT

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Vui lòng tạo pull request.

## 📧 Liên Hệ

Nếu có câu hỏi, vui lòng tạo issue trên GitHub.
