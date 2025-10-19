# Deployment Guide - GitHub Pages

## Chuẩn Bị

### 1. Tạo Repository trên GitHub
- Tạo một repository mới trên GitHub (ví dụ: `bl-novels-app`)
- Clone repository về máy tính

### 2. Cấu Hình Vite cho GitHub Pages
Chỉnh sửa file `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/bl-novels-app/', // Thay 'bl-novels-app' bằng tên repository của bạn
})
```

### 3. Cấu Hình Supabase cho Production
- Tạo file `.env.production` với thông tin Supabase production:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Build cho Production

```bash
npm run build
```

Lệnh này sẽ tạo thư mục `dist` chứa các file tĩnh đã được tối ưu hóa.

## Deploy lên GitHub Pages

### Cách 1: Sử dụng GitHub Actions (Tự động)

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Sau đó, thêm GitHub Secrets:
1. Vào Settings > Secrets and variables > Actions
2. Thêm `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`

### Cách 2: Deploy Thủ Công

```bash
# Build ứng dụng
npm run build

# Cài đặt gh-pages
npm install --save-dev gh-pages

# Deploy
npx gh-pages -d dist
```

## Cấu Hình GitHub Pages

1. Vào Settings > Pages
2. Chọn "Deploy from a branch"
3. Chọn branch `gh-pages` và folder `/ (root)`
4. Lưu cấu hình

## Truy Cập Ứng Dụng

Ứng dụng sẽ được deploy tại:
```
https://your-username.github.io/bl-novels-app/
```

## Troubleshooting

### Ứng dụng không tải được
- Kiểm tra `base` trong `vite.config.js` khớp với tên repository
- Xóa cache browser (Ctrl+Shift+Delete)

### Supabase không kết nối
- Kiểm tra biến môi trường trong `.env.production`
- Đảm bảo CORS được cấu hình đúng trong Supabase

### Trang trắng
- Mở DevTools (F12) để xem lỗi console
- Kiểm tra Network tab để xem các request

## Cập Nhật Ứng Dụng

Mỗi khi bạn push code lên branch `main`, GitHub Actions sẽ tự động build và deploy.

```bash
git add .
git commit -m "Update features"
git push origin main
```

## Tối Ưu Hóa Performance

1. **Minification**: Vite tự động minify code
2. **Code Splitting**: React Router tự động split code
3. **Caching**: GitHub Pages tự động cache static files
4. **CDN**: GitHub Pages sử dụng CDN toàn cầu

## Bảo Mật

- Không commit `.env.local` hoặc `.env.production`
- Sử dụng GitHub Secrets cho các biến nhạy cảm
- Kiểm tra Supabase RLS policies

