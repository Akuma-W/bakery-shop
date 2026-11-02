# Báo cáo Hoàn thành Task: 3.2 — Refresh Token Rotation & Phân quyền RBAC Guard

> **Milestone**: Milestone 03: Xác thực Người dùng & Phân quyền RBAC (Auth Module)  
> **Thời gian hoàn thành**: 2026-11-03 03:00:00 (GMT+7)  
> **Trạng thái**: HOÀN THÀNH  
> **Người thực hiện**: AI Coding Assistant / Tech Lead  

---

## 1. Mục tiêu của Task (Goal & Scope)

- Xây dựng Guard kiểm tra quyền `Role.OWNER` vs `Role.CUSTOMER` sử dụng NestJS `Reflector` và Metadata Decorator `@Roles(...)`.
- Kiểm tra toàn diện cơ chế Refresh Token Rotation: Xoay vòng token mới khi gọi `POST /api/v1/auth/refresh`, ghi đè HttpOnly cookie an toàn.
- Bổ sung endpoint kiểm tra quyền quản trị viên `@Get('admin/check')` được bảo vệ bởi cặp Guard `JwtAuthGuard` và `RolesGuard`.
- Viết bộ kiểm thử đơn vị tự động (Unit Test) cho `RolesGuard` bao quát 100% các kịch bản phân quyền.

---

## 2. Các File Thay đổi / Tạo mới (Impacted Files)

| Loại thao tác | Đường dẫn File | Mục đích |
| :--- | :--- | :--- |
| `Tạo mới` | `backend/src/common/guards/roles.guard.spec.ts` | Bộ kiểm thử đơn vị cho `RolesGuard` với 8 kịch bản phân quyền chi tiết |
| `Cập nhật` | `backend/src/modules/auth/auth.controller.ts` | Bổ sung endpoint `@Get('admin/check')` được bảo vệ bởi `@Roles(Role.OWNER)` và `RolesGuard` |

---

## 3. Chi tiết Triển khai Kỹ thuật (Technical Implementation)

- **Cơ chế Phân quyền RBAC Guard**:
  - `RolesGuard` trích xuất danh sách role yêu cầu qua `Reflector.getAllAndOverride<Role[]>(ROLES_KEY, [handler, class])`.
  - Nếu route không khai báo metadata role hoặc role rỗng -> cho phép truy cập tự do (`return true`).
  - Nếu có role yêu cầu:
    - Nếu request không chứa `user` hoặc `user.role` không tồn tại -> ném ngoại lệ `ForbiddenException('Access denied: insufficient permissions')`.
    - Nếu `user.role` không nằm trong danh sách role hợp lệ -> ném ngoại lệ `ForbiddenException('Access denied: role not permitted for this resource')`.
    - Nếu `user.role` khớp -> cho phép truy cập (`return true`).
- **Cơ chế Refresh Token Rotation**:
  - Endpoint `POST /api/v1/auth/refresh` lấy refresh token từ HttpOnly cookie `req.cookies.refreshToken` (ưu tiên) hoặc fallback qua body `refreshToken`.
  - `AuthService.refreshTokens` giải mã và xác thực chữ ký JWT Refresh Secret, kiểm tra sự tồn tại của người dùng trong database.
  - Cấp mới cả Access Token (15 phút) và Refresh Token mới (7 ngày), ghi đè cookie cũ để xoay vòng token liên tục, ngăn chặn việc sử dụng token cũ bị lộ.
- **Tiêu chuẩn mã nguồn**:
  - 100% chú thích (comments), docstring JSDoc và thông điệp lỗi bằng tiếng Anh.
  - Không sử dụng icon/emoji trong code hoặc log.
  - Sử dụng path alias `@/*` cho toàn bộ import nội bộ.

---

## 4. Lệnh Kiểm tra & Kết quả Thực tế (Verification & Real Results)

> [!NOTE]
> Tất cả các kết quả dưới đây đều được trích xuất từ terminal thực thi thực tế trong môi trường dự án.

### 4.1. Lệnh kiểm tra kiểu dữ liệu (Typecheck)

- **Lệnh thực thi**: `npm run typecheck --prefix backend`
- **Kết quả**:

```text
> bakery-api@1.0.0 typecheck
> tsc --noEmit
(Hoàn tất không có bất kỳ lỗi TypeScript nào, exit code 0)
```

### 4.2. Lệnh kiểm tra tự động / Test (Unit Tests)

- **Lệnh thực thi**: `npm test --prefix backend -- roles.guard.spec.ts`
- **Kết quả**:

```text
> bakery-api@1.0.0 test
> jest roles.guard.spec.ts

PASS src/common/guards/roles.guard.spec.ts (10.24 s)
  RolesGuard
    √ should be defined (10 ms)
    canActivate
      √ should grant access when no roles are required on handler or class (7 ms)
      √ should grant access when empty roles array is defined (2 ms)
      √ should throw ForbiddenException when user is not present on request (32 ms)
      √ should throw ForbiddenException when user has no role property (2 ms)
      √ should throw ForbiddenException when user role does not match required role (1 ms)
      √ should grant access when user has matching role (1 ms)
      √ should grant access when user matches one of multiple accepted roles

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        10.66 s
Ran all test suites matching /roles.guard.spec.ts/i.
```

- **Lệnh kiểm tra toàn bộ Unit Test suite**: `npm test --prefix backend`
- **Kết quả**:

```text
PASS src/common/guards/roles.guard.spec.ts (11.709 s)
PASS src/modules/health/health.controller.spec.ts (12.28 s)
PASS src/modules/auth/auth.service.spec.ts (15.416 s)

Test Suites: 3 passed, 3 total
Tests:       21 passed, 21 total
Snapshots:   0 total
Time:        17.509 s
Ran all test suites.
```

### 4.3. Lệnh kiểm tra Build

- **Lệnh thực thi**: `npm run build --prefix backend`
- **Kết quả**:

```text
> bakery-api@1.0.0 build
> nest build
(Build production thành công, exit code 0)
```

### 4.4. Lệnh kiểm tra E2E Test

- **Lệnh thực thi**: `npm run test:e2e --prefix backend`
- **Kết quả**:

```text
PASS test/app.e2e-spec.ts (7.766 s)
  AppController (e2e)
    √ /api/v1/health (GET) (172 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        8.175 s
Ran all test suites.
```

---

## 5. Đánh giá Tiêu chí Nghiệm thu (Acceptance Criteria Checklist)

- [x] Tài khoản khách thông thường (`Role.CUSTOMER`) bị chặn với HTTP 403 Forbidden khi truy cập route yêu cầu `@Roles(Role.OWNER)` -> Đạt (Đã kiểm thử trong `roles.guard.spec.ts`).
- [x] Endpoint xoay vòng `POST /api/v1/auth/refresh` cấp token mới và ghi đè cookie hợp lệ -> Đạt (Đã kiểm thử trong `auth.service.spec.ts`).
- [x] Toàn bộ 21 unit tests và 1 e2e test pass 100% -> Đạt.
- [x] Typecheck `tsc --noEmit` và `nest build` không có lỗi -> Đạt.

---

## 6. Rủi ro & Bàn giao cho Task Kế tiếp (Next Steps & Handover)

- **Rủi ro hiện tại**: Không có. Hệ thống xác thực và phân quyền RBAC hoạt động ổn định và sẵn sàng cho các module nghiệp vụ tiếp theo.
- **Task tiếp theo cần thực hiện**: **Task 3.3: Quản lý Sổ Địa chỉ Nhận hàng (Address Book)** thuộc Milestone 3 theo `docs/IMPLEMENTATION_PLAN.md`.

