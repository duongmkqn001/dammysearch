# Thư Viện Tiểu Thuyết BL Trung Quốc - Setup Guide

## Giới Thiệu
Ứng dụng web để tổng hợp và quản lý các tiểu thuyết BL Trung Quốc được dịch sang Tiếng Việt.

## Tính Năng
- 🔍 **Tìm Kiếm**: Tìm kiếm tác phẩm theo tên, tác giả hoặc thẻ
- 👥 **Danh Sách Tác Giả**: Xem danh sách tác giả và các tác phẩm của họ
- 📚 **Tất Cả Tác Phẩm**: Xem toàn bộ danh sách tác phẩm với bộ lọc
- 📱 **Responsive Design**: Tối ưu hóa cho điện thoại di động

## Yêu Cầu
- Node.js 16+
- npm hoặc yarn
- Tài khoản Supabase

## Cài Đặt

### 1. Clone Repository
```bash
git clone <repository-url>
cd bl-novels-app
```

### 2. Cài Đặt Dependencies
```bash
npm install
```

### 3. Cấu Hình Supabase
- Tạo tài khoản tại [supabase.com](https://supabase.com)
- Tạo một project mới
- Chạy SQL schema từ file `supabase_schema.sql` trong Supabase SQL Editor
- Sao chép URL và Anon Key từ Supabase

### 4. Tạo File .env.local
Sao chép từ `.env.example` và điền thông tin Supabase:
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

Ứng dụng sẽ chạy tại `http://localhost:5173`

## Build cho Production
```bash
npm run build
```

## Deploy lên GitHub Pages
1. Cập nhật `vite.config.js` với base path của repository
2. Chạy `npm run build`
3. Push thư mục `dist` lên GitHub Pages

## Cấu Trúc Dự Án
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
│   │   └── WorksListTab.css
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── supabaseClient.js
├── .env.example
├── vite.config.js
└── package.json
```

## Database Schema
Xem `supabase_schema.sql` để biết chi tiết về cấu trúc cơ sở dữ liệu.

Các bảng chính:
- `authors` - Thông tin tác giả
- `works` - Thông tin tác phẩm
- `chapters` - Các chương của tác phẩm
- `translations` - Bản dịch các chương
- `genres` - Thể loại
- `work_tags` - Thẻ của tác phẩm
- `translators` - Thông tin dịch giả/biên tập viên
- `translation_platforms` - Nền tảng dịch (Wattpad, Web, v.v.)

## Hỗ Trợ
Nếu gặp vấn đề, vui lòng tạo issue trên GitHub.

