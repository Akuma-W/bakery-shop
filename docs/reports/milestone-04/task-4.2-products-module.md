# Báo cáo Hoàn thành Task: 4.2 — API Sản phẩm: CRUD, Lọc, Tìm kiếm & Toggle Tồn kho Nhanh

> **Milestone**: Milestone 04: Danh mục & Quản lý Sản phẩm Bánh (Backend API)  
> **Thời gian hoàn thành**: 2026-11-08 23:18:00 (GMT+7)  
> **Trạng thái**: HOÀN THÀNH  
> **Người thực hiện**: AI Coding Assistant / Tech Lead  

---

## 1. Mục tiêu của Task (Goal & Scope)

- Xây dựng module `Products` quản lý toàn diện vòng đời sản phẩm bánh cho hệ thống Bakery Shop.
- Cung cấp API xem danh sách bánh công khai với bộ lọc đa tiêu chí (từ khóa `search`, danh mục `categorySlug`/`categoryId`, khoảng giá `minPrice` - `maxPrice`, tình trạng còn hàng `inStockOnly`, nổi bật `isFeatured`) kèm phân trang (`page`, `limit`).
- Cung cấp API xem chi tiết bánh theo URL slug (`GET /api/v1/products/:slug`) bao gồm thông tin dị ứng (`allergens`), thời gian chuẩn bị (`prepTimeMinutes`), và thông tin danh mục.
- Cung cấp API CRUD bánh cho Chủ tiệm (`Role.OWNER`): tạo mới (`POST`), chỉnh sửa (`PUT`), và xóa (`DELETE`).
- Cung cấp 2 API thao tác vận hành nhanh tại quầy cho Chủ tiệm:
  - `PATCH /api/v1/products/:id/stock`: Cập nhật nhanh số lượng bánh trong kho.
  - `PATCH /api/v1/products/:id/toggle`: Nút gạt bật/tắt mở bán nhanh khi hết bánh trong ngày.

---

## 2. Các File Thay đổi / Tạo mới (Impacted Files)

| Loại thao tác | Đường dẫn File | Mục đích |
| :--- | :--- | :--- |
| `Tạo mới` | `backend/src/modules/products/interfaces/product.interface.ts` | Khai báo interface `ProductResponse` và `PaginatedProductsResponse` |
| `Tạo mới` | `backend/src/modules/products/interfaces/index.ts` | Barrel export cho thư mục interfaces |
| `Tạo mới` | `backend/src/modules/products/dto/create-product.dto.ts` | DTO tạo sản phẩm với validation đầy đủ và definite assignment `!` |
| `Tạo mới` | `backend/src/modules/products/dto/update-product.dto.ts` | DTO cập nhật sản phẩm kế thừa `PartialType` |
| `Tạo mới` | `backend/src/modules/products/dto/filter-product.dto.ts` | DTO lọc sản phẩm đa tiêu chí với phân trang và sắp xếp |
| `Tạo mới` | `backend/src/modules/products/dto/update-stock.dto.ts` | DTO cập nhật nhanh số lượng tồn kho |
| `Tạo mới` | `backend/src/modules/products/products.service.ts` | Service xử lý logic tìm kiếm, lọc, phân trang, chuyển đổi Decimal và toggle kho |
| `Tạo mới` | `backend/src/modules/products/products.service.spec.ts` | Bộ 13 unit tests cho `ProductsService` |
| `Tạo mới` | `backend/src/modules/products/products.controller.ts` | REST Controller định tuyến API và kiểm soát quyền `@Roles(Role.OWNER)` |
| `Tạo mới` | `backend/src/modules/products/products.controller.spec.ts` | Bộ 9 unit tests cho `ProductsController` |
| `Tạo mới` | `backend/src/modules/products/products.module.ts` | NestJS Module kết nối controller & service |
| `Cập nhật` | `backend/src/app.module.ts` | Đăng ký `ProductsModule` vào `AppModule` |

---

## 3. Chi tiết Triển khai Kỹ thuật (Technical Implementation)

- **Xử lý Tiền tệ Decimal an toàn**:
  - DTO nhận `price` và `originalPrice` dạng `number` và validate với `@Min(0)`.
  - Service chuyển đổi sang `Prisma.Decimal` trước khi lưu vào PostgreSQL, bảo đảm tuân thủ quy tắc kiến trúc không dùng floating point cho tiền tệ.
- **Tối ưu hóa Lọc & Tìm kiếm**:
  - Xây dựng điều kiện `Prisma.ProductWhereInput` động: tìm kiếm không phân biệt chữ hoa/thường (`mode: 'insensitive'`) trên cả `name` và `description`, kết hợp lọc theo `category.slug`, khoảng giá `gte` / `lte`, và tình trạng `stock > 0`.
  - Sử dụng `prisma.$transaction([count, findMany])` để đếm tổng số bản ghi và truy vấn dữ liệu theo phân trang song song hiệu quả.
- **Cơ chế Phân quyền (RBAC)**:
  - Các route đọc (`GET /products`, `GET /products/:slug`) hoàn toàn công khai cho khách hàng.
  - Các route quản trị (`POST`, `PUT`, `PATCH /stock`, `PATCH /toggle`, `DELETE`) được bảo vệ nghiêm ngặt bởi `@UseGuards(JwtAuthGuard, RolesGuard)` và metadata `@Roles(Role.OWNER)`.
- **Ràng buộc Toàn vẹn Dữ liệu**:
  - Tự động sinh `slug` chuẩn SEO từ tên tiếng Việt thông qua `slugify.util.ts`.
  - Kiểm tra sự tồn tại của `categoryId` trước khi lưu sản phẩm.
  - Chặn xóa sản phẩm nếu đã có lịch sử trong `OrderItem` (`count > 0`), ném ngoại lệ `BadRequestException`.
- **Quy chuẩn Code**:
  - Tách riêng thư mục `interfaces/` cho các kiểu dữ liệu.
  - Sử dụng definite assignment assertion `!` cho thuộc tính DTO.
  - 100% comment, docstring JSDoc và log bằng tiếng Anh, không icon/emoji.
  - Import sử dụng path alias `@/*`.
  - Mỗi file kết thúc bằng đúng 1 dòng trống duy nhất.

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

### 4.2. Lệnh kiểm tra đơn vị tự động (Unit Tests cho Products Module)

- **Lệnh thực thi**: `npm test --prefix backend -- products`
- **Kết quả**:

```text
> bakery-api@1.0.0 test
> jest products

PASS src/modules/products/products.service.spec.ts (8.494 s)
PASS src/modules/products/products.controller.spec.ts (9.844 s)

Test Suites: 2 passed, 2 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        11.364 s
Ran all test suites matching /products/i.
```

### 4.3. Lệnh kiểm tra toàn bộ Unit Test Suite Backend

- **Lệnh thực thi**: `npm test --prefix backend`
- **Kết quả**:

```text
> bakery-api@1.0.0 test
> jest

PASS src/common/guards/roles.guard.spec.ts (16.033 s)
PASS src/modules/users/users.service.spec.ts (16.652 s)
PASS src/modules/health/health.controller.spec.ts (16.64 s)
PASS src/modules/auth/auth.service.spec.ts (17.384 s)
PASS src/modules/categories/categories.service.spec.ts (17.354 s)
PASS src/modules/products/products.controller.spec.ts (18.493 s)
PASS src/modules/categories/categories.controller.spec.ts (18.946 s)
PASS src/modules/products/products.service.spec.ts

Test Suites: 8 passed, 8 total
Tests:       79 passed, 79 total
Snapshots:   0 total
Time:        21.72 s, estimated 28 s
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

---

## 5. Đánh giá Tiêu chí Nghiệm thu (Acceptance Criteria Checklist)

- [x] Lọc và tìm kiếm bánh trả về kết quả chính xác kèm thông tin phân trang -> Đạt.
- [x] Khách xem được danh sách và chi tiết bánh (`GET /products`, `GET /products/:slug`) không cần đăng nhập -> Đạt.
- [x] Chỉ Owner mới có quyền tạo (`POST`), sửa (`PUT`), cập nhật kho (`PATCH /stock`), gạt mở bán (`PATCH /toggle`), và xóa (`DELETE`) -> Đạt.
- [x] Tự động sinh `slug` chuẩn SEO từ tên tiếng Việt -> Đạt.
- [x] Chặn xóa bánh đã có trong lịch sử đơn hàng (`orderItems > 0`) -> Đạt.
- [x] Toàn bộ 79 unit tests trên cả 8 test suites pass 100% -> Đạt.
- [x] `tsc --noEmit` và `nest build` hoàn tất không lỗi -> Đạt.
- [x] Toàn bộ file kết thúc bằng đúng 1 dòng trống -> Đạt.

---

## 6. Rủi ro & Bàn giao cho Task Kế tiếp (Next Steps & Handover)

- **Rủi ro hiện tại**: Không có. Module Sản phẩm hoạt động ổn định và sẵn sàng tiếp nhận ảnh tải lên từ module upload.
- **Task tiếp theo cần thực hiện**: **Task 4.3: Service Tải ảnh Bánh (Uploads Module)** theo `docs/IMPLEMENTATION_PLAN.md`.
