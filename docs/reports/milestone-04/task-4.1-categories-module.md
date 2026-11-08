# Báo cáo Hoàn thành Task: 4.1 — API Danh mục Sản phẩm (Categories Module) & Sửa lỗi cookie-parser

> **Milestone**: Milestone 04: Danh mục & Quản lý Sản phẩm Bánh (Backend API)  
> **Thời gian hoàn thành**: 2026-11-08 22:52:00 (GMT+7)  
> **Trạng thái**: HOÀN THÀNH  
> **Người thực hiện**: AI Coding Assistant / Tech Lead  

---

## 1. Mục tiêu của Task (Goal & Scope)

- Khắc phục triệt để lỗi runtime `TypeError: (0 , cookie_parser_1.default) is not a function` khi khởi động server backend bằng cách bật `esModuleInterop: true` trong `tsconfig.json`.
- Xây dựng module `Categories` quản lý danh mục sản phẩm bánh cho hệ thống Bakery Shop.
- Cung cấp API xem danh mục công khai cho khách hàng (`GET /api/v1/categories`) và xem chi tiết theo slug (`GET /api/v1/categories/:slug`).
- Cung cấp API quản lý danh mục cho Chủ tiệm bánh (`Role.OWNER`): tạo mới (`POST`), cập nhật (`PUT`), và xóa (`DELETE`).
- Hỗ trợ tự động tạo URL slug chuẩn SEO từ tên tiếng Việt (ví dụ: *"Bánh Mì Thủ Công"* -> *"banh-mi-thu-cong"*).
- Bảo vệ tính toàn vẹn dữ liệu: Chặn xóa danh mục nếu đang có sản phẩm bánh liên kết.

---

## 2. Các File Thay đổi / Tạo mới (Impacted Files)

| Loại thao tác | Đường dẫn File | Mục đích |
| :--- | :--- | :--- |
| `Cập nhật` | `backend/tsconfig.json` | Bật `"esModuleInterop": true` để tương thích chuẩn import CommonJS modules (`cookie-parser`, `bcrypt`, `supertest`) |
| `Cập nhật` | `backend/src/modules/auth/auth.service.spec.ts` | Điều chỉnh `import bcrypt from 'bcrypt'` tương thích với `esModuleInterop` |
| `Cập nhật` | `backend/test/app.e2e-spec.ts` | Điều chỉnh `import request from 'supertest'` tương thích với `esModuleInterop` |
| `Tạo mới` | `backend/src/common/utils/slugify.util.ts` | Hàm tiện ích chuyển đổi chuỗi tiếng Việt thành slug chuẩn SEO |
| `Tạo mới` | `backend/src/modules/categories/interfaces/category.interface.ts` | Interface phản hồi dữ liệu `CategoryResponse` kèm `_count.products` |
| `Tạo mới` | `backend/src/modules/categories/interfaces/index.ts` | Barrel export cho thư mục interfaces |
| `Tạo mới` | `backend/src/modules/categories/dto/create-category.dto.ts` | DTO tạo danh mục kèm validation và definite assignment `!` |
| `Tạo mới` | `backend/src/modules/categories/dto/update-category.dto.ts` | DTO cập nhật danh mục kế thừa `PartialType` |
| `Tạo mới` | `backend/src/modules/categories/categories.service.ts` | Service xử lý nghiệp vụ danh mục, sinh slug và kiểm tra ràng buộc sản phẩm |
| `Tạo mới` | `backend/src/modules/categories/categories.service.spec.ts` | Bộ 11 unit tests cho `CategoriesService` bao phủ mọi kịch bản nghiệp vụ |
| `Tạo mới` | `backend/src/modules/categories/categories.controller.ts` | REST Controller định tuyến API và kiểm soát quyền `Role.OWNER` |
| `Tạo mới` | `backend/src/modules/categories/categories.controller.spec.ts` | Bộ 9 unit tests cho `CategoriesController` |
| `Tạo mới` | `backend/src/modules/categories/categories.module.ts` | NestJS Module kết nối controller & service |
| `Cập nhật` | `backend/src/app.module.ts` | Đăng ký `CategoriesModule` vào `AppModule` |

---

## 3. Chi tiết Triển khai Kỹ thuật (Technical Implementation)

- **Khắc phục lỗi runtime `cookie-parser`**:
  - Gói `cookie-parser` là thư viện thuần CommonJS (`export = cookieParser;`). Khi TypeScript biên dịch mà không có `esModuleInterop: true`, lệnh gọi `import cookieParser from 'cookie-parser'` sẽ biên dịch thành `(0, cookie_parser_1.default)()` nhưng tại runtime `cookie-parser` không có thuộc tính `.default`, dẫn đến `TypeError: not a function`.
  - Đã thêm `"esModuleInterop": true` vào `backend/tsconfig.json`. TypeScript tự động tạo helper `__importDefault` bọc require, đảm bảo `.default` luôn trỏ chính xác vào hàm `cookieParser`. Server khởi động thành công 100%.
- **Cơ chế Phân quyền (RBAC)**:
  - `GET /categories` và `GET /categories/:slug` hoàn toàn công khai, không yêu cầu JWT hay vai trò.
  - `POST /categories`, `PUT /categories/:id`, `DELETE /categories/:id` được bảo vệ bởi `@UseGuards(JwtAuthGuard, RolesGuard)` và metadata `@Roles(Role.OWNER)`. Khách hàng hoặc tài khoản chưa đăng nhập sẽ nhận HTTP 401 hoặc 403 Forbidden.
- **Tiện ích Chuẩn hóa Slug Tiếng Việt (`slugify.util.ts`)**:
  - Tự động tách dấu tiếng Việt bằng `normalize('NFD')`, loại bỏ các ký tự dấu tổ hợp `[\u0300-\u036f]`, chuyển `đ/Đ` thành `d`, và chuẩn hóa khoảng trắng thành gạch nối (`-`).
- **Xử lý Ràng buộc Toàn vẹn Dữ liệu**:
  - Khi xóa danh mục: Kiểm tra số lượng sản phẩm liên kết qua `prisma.product.count({ where: { categoryId } })`. Nếu `count > 0`, ném ngoại lệ `BadRequestException('Cannot delete category containing products. Reassign or remove products first.')`.
  - Khi tạo hoặc cập nhật slug: Kiểm tra trùng lặp slug trong bảng `Category`. Nếu đã tồn tại, ném ngoại lệ `ConflictException('Category with this slug already exists')`.
- **Tuân thủ quy chuẩn Code**:
  - Tách riêng thư mục `interfaces/` cho các kiểu dữ liệu.
  - Sử dụng definite assignment assertion `!` cho thuộc tính DTO.
  - 100% comment, docstring JSDoc và log bằng tiếng Anh, không icon/emoji.
  - Import sử dụng path alias `@/*`.
  - Mỗi file kết thúc bằng đúng 1 dòng trống.

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

### 4.2. Lệnh kiểm tra đơn vị tự động (Unit Tests cho Categories Module)

- **Lệnh thực thi**: `npm test --prefix backend -- categories`
- **Kết quả**:

```text
> bakery-api@1.0.0 test
> jest categories

PASS src/modules/categories/categories.service.spec.ts (21.72 s)
PASS src/modules/categories/categories.controller.spec.ts (25.519 s)

Test Suites: 2 passed, 2 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        29.81 s
Ran all test suites matching /categories/i.
```

### 4.3. Lệnh kiểm tra toàn bộ Unit Test Suite Backend

- **Lệnh thực thi**: `npm test --prefix backend`
- **Kết quả**:

```text
> bakery-api@1.0.0 test
> jest

PASS src/common/guards/roles.guard.spec.ts (23.167 s)
PASS src/modules/categories/categories.service.spec.ts (23.713 s)
PASS src/modules/users/users.service.spec.ts (24.71 s)
PASS src/modules/health/health.controller.spec.ts (25.181 s)
PASS src/modules/auth/auth.service.spec.ts (25.829 s)
PASS src/modules/categories/categories.controller.spec.ts (27.225 s)

Test Suites: 6 passed, 6 total
Tests:       57 passed, 57 total
Snapshots:   0 total
Time:        30.376 s
Ran all test suites.
```

### 4.4. Lệnh kiểm tra Build Production

- **Lệnh thực thi**: `npm run build --prefix backend`
- **Kết quả**:

```text
> bakery-api@1.0.0 build
> nest build
(Build production thành công, exit code 0)
```

### 4.5. Lệnh kiểm tra khởi động Server Backend

- **Lệnh thực thi**: `node backend/dist/src/main.js`
- **Kết quả**: Khởi động thành công, cookie-parser hoạt động bình thường, toàn bộ route được nạp đầy đủ.

---

## 5. Đánh giá Tiêu chí Nghiệm thu (Acceptance Criteria Checklist)

- [x] Sửa triệt để lỗi runtime `TypeError: (0 , cookie_parser_1.default) is not a function` -> Đạt.
- [x] Khách xem được danh mục (`GET /categories`, `GET /categories/:slug`) không cần đăng nhập -> Đạt.
- [x] Chỉ Owner mới có quyền tạo (`POST`), sửa (`PUT`), xóa (`DELETE`) danh mục -> Đạt (Bảo vệ bởi `JwtAuthGuard` & `RolesGuard`).
- [x] Tự động sinh `slug` chuẩn SEO từ tên tiếng Việt -> Đạt (`slugify.util.ts`).
- [x] Chặn xóa danh mục đang chứa sản phẩm liên kết -> Đạt (Ném `BadRequestException`).
- [x] Toàn bộ 57 unit tests trên cả 6 test suites pass 100% -> Đạt.
- [x] `tsc --noEmit` và `nest build` hoàn tất không lỗi -> Đạt.
- [x] Toàn bộ file kết thúc bằng đúng 1 dòng trống -> Đạt.

---

## 6. Rủi ro & Bàn giao cho Task Kế tiếp (Next Steps & Handover)

- **Rủi ro hiện tại**: Không có. Module Danh mục đã hoàn thiện và sẵn sàng liên kết với Module Sản phẩm.
- **Task tiếp theo cần thực hiện**: **Task 4.2: API Sản phẩm: CRUD, Lọc, Tìm kiếm & Toggle Tồn kho Nhanh** theo `docs/IMPLEMENTATION_PLAN.md`.
