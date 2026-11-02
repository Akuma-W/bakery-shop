# Báo cáo Hoàn thành Task: Task 2.2 — Nạp Dữ liệu Khởi tạo (Database Seeding)

> **Milestone**: Milestone 02: Cơ sở Dữ liệu, Prisma Schema & Bảng Notification  
> **Thời gian hoàn thành**: 2026-11-03 01:04:14 (GMT+7)  
> **Trạng thái**: ✅ HOÀN THÀNH  
> **Người thực hiện**: AI Coding Assistant / Tech Lead  

---

## 1. Mục tiêu của Task (Goal & Scope)
- Xây dựng script seeding `backend/prisma/seed.ts` sử dụng chuẩn Prisma 7 và Driver Adapter `@prisma/adapter-pg`.
- Tạo tài khoản Chủ tiệm (`admin123@gmail.com`) với mật khẩu băm bcrypt 12 rounds và role `OWNER`.
- Tạo tài khoản Khách hàng mẫu (`customer@gmail.com`) với role `CUSTOMER` và 1 địa chỉ nhận hàng mặc định.
- Nạp 4 danh mục bánh thực tế và 8 sản phẩm bánh/đồ uống kèm đầy đủ thông số (giá Decimal, tồn kho, thành phần dị ứng, thời gian chuẩn bị).
- Nạp 2 mã coupon khuyến mãi mẫu (`BANHMOI20` giảm 20% và `FREESHIP` giảm 25.000 VNĐ).
- Đảm bảo tính Idempotent (chạy lặp lại nhiều lần không sinh lỗi duplicate).

---

## 2. Các File Thay đổi / Tạo mới (Impacted Files)

| Loại thao tác | Đường dẫn File | Mục đích |
| :--- | :--- | :--- |
| `Tạo mới` | `backend/prisma/seed.ts` | Kịch bản nạp dữ liệu mẫu an toàn với bcrypt và upsert |

---

## 3. Chi tiết Triển khai Kỹ thuật (Technical Implementation)
- **Băm mật khẩu**:
  - Dùng thư viện `bcrypt` với 12 salt rounds để mã hóa mật khẩu `Admin123@` và `Customer123@`.
  - Tuyệt đối không lưu plaintext password vào database.
- **Tính Idempotent**:
  - Sử dụng hàm `prisma.model.upsert()` dựa trên các trường Unique (`email` của User, `slug` của Category và Product, `code` của Coupon).
- **Tập dữ liệu nạp vào**:
  1. **Chủ tiệm (Owner)**: `Trần Tuấn Phong` (`admin123@gmail.com`), Role: `OWNER`.
  2. **Khách hàng (Customer)**: `Nguyễn Văn An` (`customer@gmail.com`), Role: `CUSTOMER`.
  3. **Địa chỉ mặc định**: 123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh.
  4. **4 Danh mục**: Bánh mì thủ công, Bánh ngọt & Pastry, Bánh kem & Lạnh, Đồ uống & Cà phê.
  5. **8 Sản phẩm**: Sourdough, Brioche hoa cúc, Croissant bơ Pháp, Pain au Chocolat, Tiramisu cổ điển, Mousse việt quất, Cold Brew muối biển, Trà đào cam sả.
  6. **2 Mã giảm giá**: `BANHMOI20` (20%, min 100k, max 50k), `FREESHIP` (25k cố định, min 150k).

---

## 4. Lệnh Kiểm tra & Kết quả Thực tế (Verification & Real Results)

### 4.1. Thực thi Lệnh Seed
- **Lệnh thực thi**: `npm --prefix backend run prisma:seed`
- **Kết quả thực tế**:
```text
> bakery-api@1.0.0 prisma:seed
> prisma db seed

Loaded Prisma config from prisma.config.ts.

Running seed command `ts-node prisma/seed.ts` ...
🌱 Bắt đầu nạp dữ liệu mẫu (Seeding Bakery Shop)...
✅ Đã tạo tài khoản Chủ tiệm: Trần Tuấn Phong (admin123@gmail.com)
✅ Đã tạo tài khoản Khách hàng: Nguyễn Văn An (customer@gmail.com)
✅ Đã tạo 4 danh mục bánh.
✅ Đã nạp 8 sản phẩm bánh & đồ uống.
✅ Đã tạo 2 mã coupon khuyến mãi.
🎉 Hoàn tất nạp dữ liệu mẫu thành công!
The seed command has been executed.
```

### 4.2. Kiểm tra Đối soát Dữ liệu Thực tế trong Database
- **Kết quả truy vấn trực tiếp từ PostgreSQL**:
```json
{
  "users": [
    {
      "email": "admin123@gmail.com",
      "fullName": "Trần Tuấn Phong",
      "role": "OWNER"
    },
    {
      "email": "customer@gmail.com",
      "fullName": "Nguyễn Văn An",
      "role": "CUSTOMER"
    }
  ],
  "categoriesCount": 4,
  "productsCount": 8,
  "couponsCount": 2,
  "addressesCount": 1
}
```

---

## 5. Đánh giá Tiêu chí Nghiệm thu
- [x] Tài khoản Chủ tiệm `Trần Tuấn Phong` (`admin123@gmail.com`) được tạo chính xác với mật khẩu mã hóa an toàn.
- [x] Tài khoản Khách hàng và địa chỉ mẫu được tạo đầy đủ.
- [x] Danh mục, sản phẩm và coupon mẫu được tạo thành công với giá chuẩn kiểu `Decimal(12, 2)`.
- [x] Lệnh seed chạy mượt mà, không gặp lỗi concurrency hay ràng buộc dữ liệu.

---

## 6. Rủi ro & Bàn giao Bước Tiếp theo
- **Trạng thái**: Toàn bộ **Milestone 2 đã hoàn thành 100%**.
- **Bước tiếp theo**: Chuyển sang **Milestone 3 — Auth Module & Quản lý Người dùng Backend** (Đăng ký, Đăng nhập, cấp JWT HttpOnly Cookie, Refresh Token rotation và Guards phân quyền RBAC).
