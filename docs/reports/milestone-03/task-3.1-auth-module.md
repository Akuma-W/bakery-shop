# Báo cáo Hoàn thành Task: Task 3.1 — Xây dựng Module Xác thực (Auth Module) & Băm Mật khẩu An toàn

> **Milestone**: Milestone 03: Module Xác thực (Auth) & Quản lý Người dùng  
> **Thời gian hoàn thành**: 2026-11-03 02:06:40 (GMT+7)  
> **Trạng thái**: ✅ HOÀN THÀNH  
> **Người thực hiện**: AI Coding Assistant / Tech Lead  

---

## 1. Mục tiêu của Task (Goal & Scope)
- Xây dựng hoàn chỉnh Module Xác thực (`AuthModule`) cho backend NestJS.
- Triển khai API Đăng ký khách hàng (`POST /api/v1/auth/register`) với băm mật khẩu `bcrypt` an toàn (12 salt rounds).
- Triển khai API Đăng nhập (`POST /api/v1/auth/login`) xác thực thông tin và cấp cặp token.
- Triển khai cơ chế Dual Token: Access Token (15 phút) cấp qua header và Refresh Token (7 ngày) lưu trong **HttpOnly, Secure Cookie**.
- Triển khai API Xoay vòng Refresh Token (`POST /api/v1/auth/refresh`) và Đăng xuất (`POST /api/v1/auth/logout`) xóa cookie.
- Triển khai API Lấy thông tin tài khoản hiện tại (`GET /api/v1/auth/me`) bảo vệ bởi `JwtAuthGuard`.
- Tuân thủ 100% quy tắc: Comments và logs bằng tiếng Anh, không icon/emoji trong mã nguồn.

---

## 2. Các File Thay đổi / Tạo mới (Impacted Files)

| Loại thao tác | Đường dẫn File | Mục đích |
| :--- | :--- | :--- |
| `Tạo mới` | `backend/src/common/decorators/current-user.decorator.ts` | Custom decorator `@CurrentUser()` trích xuất user từ request |
| `Tạo mới` | `backend/src/common/decorators/roles.decorator.ts` | Custom decorator `@Roles(Role.OWNER)` gán metadata quyền hạn |
| `Tạo mới` | `backend/src/common/guards/jwt-auth.guard.ts` | Guard xác thực Access Token JWT từ header hoặc cookie |
| `Tạo mới` | `backend/src/common/guards/roles.guard.ts` | Guard kiểm tra vai trò người dùng (RBAC) |
| `Tạo mới` | `backend/src/modules/auth/dto/register.dto.ts` | DTO validate email, password (min 8 chars), fullName, phone VN |
| `Tạo mới` | `backend/src/modules/auth/dto/login.dto.ts` | DTO validate email và password đăng nhập |
| `Tạo mới` | `backend/src/modules/auth/strategies/jwt.strategy.ts` | Passport Strategy giải mã và kiểm tra JWT token |
| `Tạo mới` | `backend/src/modules/auth/auth.service.ts` | Logic băm bcrypt, tạo JWT, xác thực, xoay vòng token |
| `Tạo mới` | `backend/src/modules/auth/auth.controller.ts` | Controller quản trị các endpoints `/auth/*` và quản lý cookie |
| `Tạo mới` | `backend/src/modules/auth/auth.module.ts` | Đăng ký Passport, JwtModule và xuất AuthService |
| `Tạo mới` | `backend/src/modules/auth/auth.service.spec.ts` | Unit tests kiểm thử đầy đủ các kịch bản của AuthService |
| `Cập nhật` | `backend/src/main.ts` | Đăng ký middleware `cookieParser()` đọc cookie từ client |
| `Cập nhật` | `backend/src/app.module.ts` | Đăng ký nạp `AuthModule` vào hệ thống NestJS |
| `Cập nhật` | `backend/package.json` | Cài đặt `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `cookie-parser` |

---

## 3. Chi tiết Triển khai Kỹ thuật (Technical Implementation)

1. **Bảo mật Mật khẩu**:
   - Dùng `bcrypt.hash(password, 12)` khi đăng ký và `bcrypt.compare()` khi đăng nhập.
   - Hàm `sanitizeUser()` đảm bảo trường `passwordHash` bị loại bỏ hoàn toàn trước khi trả dữ liệu về phía client.
2. **Cơ chế Dual-Token & Lưu trữ Cookie**:
   - Access Token: Ký bằng `JWT_ACCESS_SECRET`, thời hạn 15 phút, chứa `{ sub, email, role }`.
   - Refresh Token: Ký bằng `JWT_REFRESH_SECRET`, thời hạn 7 ngày, đặt trong cookie với các cờ bảo vệ:
     - `httpOnly: true` (chống XSS script đọc trộm).
     - `secure: process.env.NODE_ENV === 'production'`.
     - `sameSite: 'lax'`.
     - `path: '/api/v1/auth'`.
3. **Validation & Regex**:
   - Kiểm tra số điện thoại Việt Nam hợp lệ: `/(84|0[3|5|7|8|9])+([0-9]{8})\b/`.
   - Mật khẩu tối thiểu 8 ký tự.

---

## 4. Lệnh Kiểm tra & Kết quả Thực tế (Verification & Real Results)

### 4.1. Kiểm tra Kiểu dữ liệu TypeScript
- **Lệnh thực thi**: `npm --prefix backend run typecheck`
- **Kết quả thực tế**:
```text
> bakery-api@1.0.0 typecheck
> tsc --noEmit
(Exit code: 0 - 0 errors)
```

### 4.2. Kiểm tra Unit Test (Jest)
- **Lệnh thực thi**: `npm --prefix backend run test`
- **Kết quả thực tế**:
```text
> bakery-api@1.0.0 test
> jest

PASS src/modules/health/health.controller.spec.ts (10.389 s)
PASS src/modules/auth/auth.service.spec.ts (16.515 s)

Test Suites: 2 passed, 2 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        18.737 s
Ran all test suites.
```

### 4.3. Kiểm tra Build Ứng dụng
- **Lệnh thực thi**: `npm --prefix backend run build`
- **Kết quả thực tế**:
```text
> bakery-api@1.0.0 build
> nest build
(Exit code: 0 - Build succeeded)
```

---

## 5. Đánh giá Tiêu chí Nghiệm thu
- [x] Đăng ký tài khoản khách hàng thành công, tự động mã hóa mật khẩu bcrypt 12 rounds.
- [x] Từ chối đăng ký nếu email đã tồn tại (`ConflictException` - HTTP 409).
- [x] Đăng nhập thành công trả về User info (đã lược bỏ `passwordHash`) và Access Token.
- [x] Đăng nhập sai email/mật khẩu trả về mã HTTP 401 Unauthorized (`AUTH_INVALID_CREDENTIALS`).
- [x] Refresh Token được cấu hình lưu an toàn trong HttpOnly Cookie.
- [x] Endpoint `GET /api/v1/auth/me` được bảo vệ bằng `JwtAuthGuard`.
- [x] 100% mã nguồn tuân thủ: Comments và logging bằng tiếng Anh, không icon.

---

## 6. Rủi ro & Bàn giao Bước Tiếp theo
- **Trạng thái**: Task 3.1 đã hoàn thành và sẵn sàng cho môi trường phát triển.
- **Task tiếp theo**: **Task 3.2 — Refresh Token Rotation & Phân quyền RBAC Guard** (viết unit test chuyên sâu cho `RolesGuard` và hoàn thiện kiểm thử phân quyền route quản trị tiệm bánh).
