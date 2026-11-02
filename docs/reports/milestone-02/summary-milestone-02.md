# Báo cáo Tổng kết Nghiệm thu Milestone 02: Cơ sở Dữ liệu, Prisma 7 & Seeding Dữ liệu Mẫu

> **Milestone**: Milestone 02 — Cơ sở Dữ liệu, Prisma Schema & Bảng Notification  
> **Thời gian hoàn thành**: 2026-11-03 01:05:00 (GMT+7)  
> **Trạng thái**: ✅ HOÀN THÀNH 100%  
> **Người thực hiện**: AI Coding Assistant / Tech Lead  

---

## 1. Tổng kết Phạm vi Hoàn thành
Milestone 2 đã hoàn thành toàn bộ các yêu cầu thiết kế dữ liệu, nâng cấp công nghệ và nạp dữ liệu mẫu khởi tạo cho dự án Bakery Web:

1. **Prisma Schema & Nâng cấp Prisma 7**:
   - Chuyển đổi và nâng cấp thành công lên **Prisma 7.10.1** với file cấu hình hiện đại `backend/prisma.config.ts`.
   - Sử dụng chuẩn Driver Adapter `@prisma/adapter-pg` cùng `pg` Connection Pool trong `PrismaService`.
   - Định nghĩa 10 Models và 7 Enums đáp ứng đầy đủ yêu cầu nghiệp vụ tiệm bánh đơn lẻ (sản phẩm, giá Decimal, tồn kho, thành phần dị ứng, coupon, đơn hàng, thanh toán PayOS và thông báo hai chiều).
2. **Database Migration**:
   - Migration `20261102172315_init_bakery_database` đã được áp dụng thành công lên cơ sở dữ liệu PostgreSQL thực tế trong Docker container `bakery-shop-postgres`.
3. **Seeding Dữ liệu Khởi tạo**:
   - Tài khoản Chủ tiệm (`admin123@gmail.com` - `Trần Tuấn Phong` - `Admin123@`).
   - Tài khoản Khách hàng (`customer@gmail.com` - `Nguyễn Văn An` - `Customer123@`).
   - 4 Danh mục bánh: Bánh mì thủ công, Bánh ngọt & Pastry, Bánh kem & Lạnh, Đồ uống & Cà phê.
   - 8 Sản phẩm thực tế có giá, ảnh, mô tả, tồn kho và thành phần dị ứng.
   - 2 Mã giảm giá: `BANHMOI20` (giảm 20%) và `FREESHIP` (giảm 25.000 VNĐ).

---

## 2. Danh sách Báo cáo Chi tiết Thành phần
- [Task 2.1 — Cấu hình Prisma Schema & Migration Cơ sở Dữ liệu](file:///c:/Users/tuanp/Workspace/Project/Web/bakery-shop/docs/reports/milestone-02/task-2.1-prisma-schema.md)
- [Task 2.1 (Phụ lục) — Nâng cấp Prisma 7, Cấu hình prisma.config.ts & Driver Adapter](file:///c:/Users/tuanp/Workspace/Project/Web/bakery-shop/docs/reports/milestone-02/task-2.1-prisma-7-upgrade.md)
- [Task 2.2 — Nạp Dữ liệu Khởi tạo (Database Seeding)](file:///c:/Users/tuanp/Workspace/Project/Web/bakery-shop/docs/reports/milestone-02/task-2.2-database-seeding.md)

---

## 3. Tổng hợp Kết quả Kiểm tra Thực tế (Verification Summary)

| Hạng mục kiểm tra | Lệnh thực thi | Kết quả thực tế | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Prisma Generation** | `npm --prefix backend run prisma:generate` | Sinh Client v7.10.1 (175ms) | ✅ Đạt |
| **Prisma Migration** | `npm --prefix backend run prisma:migrate` | 100% In sync, không phát sinh lỗi | ✅ Đạt |
| **Prisma Seeding** | `npm --prefix backend run prisma:seed` | Tạo 2 users, 4 cats, 8 prods, 2 coupons | ✅ Đạt |
| **TypeScript Typecheck** | `npm --prefix backend run typecheck` | `tsc --noEmit` exit code 0 (0 error) | ✅ Đạt |
| **Unit Test Backend** | `npm --prefix backend run test` | 2/2 tests pass (Jest) | ✅ Đạt |

---

## 4. Kế hoạch Bàn giao cho Milestone Tiếp theo
- **Milestone kế tiếp**: **Milestone 03 — Module Xác thực (Auth) & Quản lý Người dùng**.
  - **Task 3.1**: Xây dựng API Đăng ký (`/auth/register`), Đăng nhập (`/auth/login`) với JWT Token (Access Token 15 phút, Refresh Token 7 ngày đặt trong HttpOnly Cookie).
  - **Task 3.2**: Xây dựng cơ chế Refresh Token Rotation và RBAC Guard (`RolesGuard`) phân quyền `Role.OWNER` vs `Role.CUSTOMER`.
  - **Task 3.3**: Xây dựng API Quản lý Sổ địa chỉ giao hàng (`AddressBook`: thêm, sửa, xóa, chọn mặc định).

