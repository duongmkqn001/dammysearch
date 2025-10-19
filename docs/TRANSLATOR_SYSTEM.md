# 📝 Hệ Thống Dịch Giả & Quản Lý Truyện

## Tổng Quan

Hệ thống này cho phép các dịch giả đăng ký tài khoản, gửi truyện mới, và theo dõi trạng thái của các bài gửi. Admin có thể quản lý, phê duyệt, và thay đổi trạng thái của các truyện.

## 🔐 Tài Khoản Dịch Giả

### Đăng Ký Tài Khoản

1. Vào tab **✍️ Dịch Giả**
2. Chọn **Đăng Ký**
3. Nhập thông tin:
   - **Tên Người Dùng**: Tên duy nhất để đăng nhập
   - **Email**: Địa chỉ email hợp lệ
   - **Mật Khẩu**: Mật khẩu bảo mật
4. Click **Đăng Ký**

### Đăng Nhập

1. Vào tab **✍️ Dịch Giả**
2. Nhập **Email** và **Mật Khẩu**
3. Click **Đăng Nhập**

## 📤 Gửi Truyện Mới

### Quy Trình Gửi

1. Đăng nhập vào tài khoản dịch giả
2. Click tab **➕ Gửi Truyện Mới**
3. Điền thông tin truyện:
   - **Tên Truyện**: Tên chính xác của truyện
   - **Tác Giả**: Tên tác giả gốc
   - **Thể Loại**: Thể loại chính (BL, Ngôn Tình, v.v.)
   - **Tóm Tắt**: Mô tả ngắn về nội dung
   - **Nền Tảng**: Nơi truyện được đăng (Wattpad, Web, v.v.)
   - **Liên Kết Nguồn**: URL của truyện gốc
4. Click **Gửi Truyện**

### Thông Tin Cần Thiết

- **Tên Truyện**: Phải chính xác với tên gốc
- **Tác Giả**: Tên tác giả gốc (không phải dịch giả)
- **Tóm Tắt**: Ít nhất 50 ký tự, mô tả nội dung chính
- **Liên Kết**: Phải là URL hợp lệ

## 📊 Theo Dõi Bài Gửi

### Xem Danh Sách Bài Gửi

1. Đăng nhập vào tài khoản dịch giả
2. Click tab **📤 Bài Gửi Của Tôi**
3. Xem danh sách tất cả bài gửi của bạn

### Trạng Thái Bài Gửi

| Trạng Thái | Mô Tả |
|-----------|-------|
| 🔴 Chờ xử lý | Bài gửi vừa được gửi, chờ admin xem xét |
| 🔵 Đang xử lý | Admin đang kiểm tra và xử lý bài gửi |
| 🟢 Hoàn thành | Truyện đã được thêm vào hệ thống |
| ⚫ Từ chối | Bài gửi không đáp ứng tiêu chí |

## ⚙️ Bảng Điều Khiển Admin

### Đăng Nhập Admin

1. Vào tab **⚙️ Admin**
2. Nhập **Mật Khẩu Admin**: `admin123` (mặc định)
3. Click **Đăng Nhập**

**Lưu ý**: Trong production, thay đổi mật khẩu admin và sử dụng xác thực an toàn hơn.

### Quản Lý Bài Gửi

#### Xem Danh Sách

- Bảng hiển thị tất cả bài gửi
- Lọc theo trạng thái: Tất cả, Chờ xử lý, Đang xử lý, Hoàn thành, Từ chối
- Xem thông tin: Tên truyện, Tác giả, Dịch giả, Trạng thái, Ngày gửi

#### Xem Chi Tiết Bài Gửi

1. Click nút **Chi Tiết** trên bài gửi
2. Xem toàn bộ thông tin:
   - Tên truyện, Tác giả, Thể loại
   - Nền tảng, Liên kết nguồn
   - Tóm tắt, Nền tảng truyện

#### Thay Đổi Trạng Thái

1. Mở chi tiết bài gửi
2. Chọn trạng thái mới từ dropdown:
   - Chờ xử lý
   - Đang xử lý
   - Hoàn thành
   - Từ chối
3. (Tùy chọn) Nhập lý do thay đổi
4. Trạng thái sẽ được cập nhật ngay lập tức

#### Phê Duyệt & Thêm Vào Hệ Thống

1. Mở chi tiết bài gửi có trạng thái **Đang xử lý**
2. Click nút **✓ Phê Duyệt & Thêm Vào Hệ Thống**
3. Hệ thống sẽ:
   - Tìm hoặc tạo tác giả
   - Tạo tác phẩm mới
   - Cập nhật trạng thái thành **Hoàn thành**

## 📋 Cơ Sở Dữ Liệu

### Bảng Mới

#### translator_accounts
- `id`: ID duy nhất
- `email`: Email dịch giả
- `username`: Tên đăng nhập
- `password_hash`: Mật khẩu mã hóa
- `translator_id`: Liên kết đến bảng translators
- `is_active`: Trạng thái hoạt động
- `is_verified`: Xác minh email
- `created_at`: Ngày tạo
- `updated_at`: Ngày cập nhật

#### story_import_requests
- `id`: ID duy nhất
- `title`: Tên truyện
- `author_name`: Tên tác giả
- `summary`: Tóm tắt
- `background`: Nền tảng truyện
- `main_genre`: Thể loại chính
- `translator_id`: ID dịch giả gửi
- `status`: Trạng thái (incoming, process, completed, rejected)
- `source_url`: Liên kết nguồn
- `source_platform`: Nền tảng (Wattpad, Web, v.v.)
- `notes`: Ghi chú
- `created_at`: Ngày gửi
- `updated_at`: Ngày cập nhật

#### story_status_history
- `id`: ID duy nhất
- `story_import_id`: ID bài gửi
- `old_status`: Trạng thái cũ
- `new_status`: Trạng thái mới
- `changed_by`: ID admin thay đổi
- `reason`: Lý do thay đổi
- `created_at`: Ngày thay đổi

## 🔒 Bảo Mật

### Khuyến Nghị

1. **Thay Đổi Mật Khẩu Admin**
   - Mở file `AdminDashboard.jsx`
   - Tìm `ADMIN_PASSWORD = 'admin123'`
   - Thay đổi thành mật khẩu mạnh

2. **Mã Hóa Mật Khẩu**
   - Hiện tại sử dụng Base64 (không an toàn)
   - Trong production, sử dụng bcrypt hoặc argon2

3. **Xác Thực Email**
   - Thêm xác minh email khi đăng ký
   - Gửi email xác nhận

4. **RLS Policies**
   - Cấu hình Row Level Security trong Supabase
   - Chỉ cho phép dịch giả xem bài gửi của họ

## 📈 Quy Trình Phê Duyệt

```
Dịch Giả Gửi Truyện
        ↓
Trạng Thái: Chờ xử lý
        ↓
Admin Xem Xét
        ↓
Admin Thay Đổi Thành: Đang xử lý
        ↓
Admin Kiểm Tra Chi Tiết
        ↓
Admin Phê Duyệt
        ↓
Truyện Được Thêm Vào Hệ Thống
        ↓
Trạng Thái: Hoàn thành
```

## 🐛 Troubleshooting

### Không Thể Đăng Ký
- Kiểm tra email đã được sử dụng chưa
- Kiểm tra username đã được sử dụng chưa
- Đảm bảo mật khẩu có ít nhất 6 ký tự

### Không Thể Đăng Nhập
- Kiểm tra email và mật khẩu chính xác
- Kiểm tra tài khoản đã được kích hoạt chưa

### Không Thể Gửi Truyện
- Kiểm tra tất cả trường bắt buộc đã điền
- Kiểm tra liên kết URL hợp lệ
- Kiểm tra kết nối Supabase

### Admin Không Thể Phê Duyệt
- Kiểm tra trạng thái bài gửi là "Đang xử lý"
- Kiểm tra kết nối Supabase
- Kiểm tra quyền admin

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra console (F12) để xem lỗi
2. Kiểm tra kết nối Supabase
3. Kiểm tra biến môi trường `.env.local`
4. Tạo issue trên GitHub

---

**Hệ thống dịch giả đã sẵn sàng sử dụng!** ✨

