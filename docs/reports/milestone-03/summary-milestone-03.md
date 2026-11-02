# Báo cáo Tổng kết Nghiệm thu Milestone 03: Xác thực Người dùng, RBAC & Sổ Địa chỉ

> **Milestone**: Milestone 03 — Xác thực Người dùng & Phân quyền RBAC (Auth Module)  
> **Thời gian hoàn thành**: 2026-11-03 04:05:00 (GMT+7)  
> **Trạng thái**: HOÀN THÀNH 100%  
> **Người thực hiện**: AI Coding Assistant / Tech Lead  

---

## 1. Tổng kết Phạm vi Hoàn thành

Milestone 3 đã hoàn thành toàn bộ các yêu cầu xác thực, phân quyền và quản lý tài khoản người dùng cho Bakery Web:

1. **Task 3.1: Module Xác thực (Auth Module) & JWT Strategy**:
   - Cài đặt và cấu hình `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt` (12 rounds) và `cookie-parser`.
   - Chiến lược xác thực kép: Access Token (15 phút) và Refresh Token (7 ngày) lưu trong HttpOnly Cookie an toàn.
   - Các API: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`.
   - Chuẩn hóa kiến trúc: Tách thư mục `interfaces/`, định nghĩa DTO với definite assignment `!`, sử dụng path alias `@/*`.
2. **Task 3.2: Refresh Token Rotation & Phân quyền RBAC Guard**:
   - Xây dựng `RolesGuard` và `@Roles(...)` đối soát vai trò `Role.OWNER` vs `Role.CUSTOMER`.
   - Kiểm thử toàn diện 8 kịch bản phân quyền qua `roles.guard.spec.ts`.
   - Bổ sung endpoint kiểm tra quyền quản trị viên `@Get('admin/check')`.
3. **Task 3.3: Quản lý Sổ Địa chỉ Nhận hàng (Address Book)**:
   - Xây dựng `UsersModule`, `UsersService`, `UsersController` quản lý sổ địa chỉ giao hàng (`/users/addresses`).
   - Xử lý địa chỉ mặc định trong transaction, tự động thăng hạng địa chỉ khi xóa địa chỉ mặc định.
   - Đảm bảo tính cô lập dữ liệu tuyệt đối giữa các tài khoản người dùng, bao phủ bởi 16 unit tests trong `users.service.spec.ts`.
   - Sửa triệt để cảnh báo deprecation `baseUrl` trong `tsconfig.json`.

---

## 2. Danh sách Báo cáo Chi tiết Thành phần

- [Task 3.1 — Module Xác thực & JWT Strategy](file:///c:/Users/tuanp/Workspace/Project/Web/bakery-shop/docs/reports/milestone-03/task-3.1-auth-module.md)
- [Task 3.2 — Refresh Token Rotation & Phân quyền RBAC Guard](file:///c:/Users/tuanp/Workspace/Project/Web/bakery-shop/docs/reports/milestone-03/task-3.2-rbac-and-refresh-token.md)
- [Task 3.3 — Quản lý Sổ Địa chỉ Nhận hàng (Address Book)](file:///c:/Users/tuanp/Workspace/Project/Web/bakery-shop/docs/reports/milestone-03/task-3.3-address-book.md)

---

## 3. Tổng hợp Kết quả Kiểm tra Thực tế (Verification Summary)

| Hạng mục kiểm tra | Lệnh thực thi | Kết quả thực tế | Trạng thái |
| :--- | :--- | :--- | :--- |
| **TypeScript Typecheck** | `npm --prefix backend run typecheck` | `tsc --noEmit` exit code 0 (0 error) | Đạt |
| **Unit Test Suites** | `npm --prefix backend run test` | 4/4 suites passed, 37/37 tests passed (Jest) | Đạt |
| **E2E Test Suite** | `npm --prefix backend run test:e2e` | 1/1 passed | Đạt |
| **Build Production** | `npm --prefix backend run build` | `nest build` thành công, exit code 0 | Đạt |

---

## 4. Kế hoạch Bàn giao cho Milestone Tiếp theo

- **Milestone kế tiếp**: **Milestone 04 — Danh mục & Quản lý Sản phẩm Bánh (Backend API)**.
  - **Task 4.1**: API Danh mục Sản phẩm (Categories Module: CRUD danh mục, phân trang, slug).
  - **Task 4.2**: API Quản lý Bánh (Products CRUD, phân trang, lọc theo danh mục, cảnh báo hết hàng, kiểm tra dị ứng allergens).
  - **Task 4.3**: Quản lý Tồn kho & Đổi trạng thái hiển thị Sản phẩm.
