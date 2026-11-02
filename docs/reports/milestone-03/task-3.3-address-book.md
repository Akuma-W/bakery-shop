# Báo cáo Hoàn thành Task: 3.3 — Quản lý Sổ Địa chỉ Nhận hàng (Address Book) & Sửa cảnh báo tsconfig

> **Milestone**: Milestone 03: Xác thực Người dùng & Phân quyền RBAC (Auth Module)  
> **Thời gian hoàn thành**: 2026-11-03 03:35:00 (GMT+7)  
> **Trạng thái**: HOÀN THÀNH  
> **Người thực hiện**: AI Coding Assistant / Tech Lead  

---

## 1. Mục tiêu của Task (Goal & Scope)

- Sửa triệt để cảnh báo deprecation của `baseUrl` trong `backend/tsconfig.json` khi nâng cấp/tương thích với TypeScript hiện đại.
- Xây dựng module `Users` quản lý Sổ địa chỉ nhận hàng (`Address`) cho khách hàng:
  - Xem danh sách địa chỉ nhận hàng cá nhân (`GET /api/v1/users/addresses`).
  - Xem chi tiết một địa chỉ (`GET /api/v1/users/addresses/:id`).
  - Thêm mới địa chỉ nhận hàng (`POST /api/v1/users/addresses`).
  - Cập nhật địa chỉ nhận hàng (`PUT /api/v1/users/addresses/:id`).
  - Đặt một địa chỉ làm địa chỉ mặc định (`PATCH /api/v1/users/addresses/:id/default`).
  - Xóa địa chỉ nhận hàng (`DELETE /api/v1/users/addresses/:id`).
- Đảm bảo tính cô lập dữ liệu tuyệt đối: Khách hàng chỉ truy cập, chỉnh sửa hoặc xóa địa chỉ do chính mình tạo (xác thực qua JWT `@CurrentUser('id')`), không thể can thiệp dữ liệu của người khác.

---

## 2. Các File Thay đổi / Tạo mới (Impacted Files)

| Loại thao tác | Đường dẫn File | Mục đích |
| :--- | :--- | :--- |
| `Cập nhật` | `backend/tsconfig.json` | Loại bỏ option `baseUrl` lỗi thời, cấu hình `paths: { "@/*": ["./src/*"] }` chuẩn TypeScript hiện đại |
| `Tạo mới` | `backend/src/modules/users/interfaces/address.interface.ts` | Khai báo interface dữ liệu `AddressResponse` |
| `Tạo mới` | `backend/src/modules/users/interfaces/index.ts` | Barrel export cho thư mục interfaces |
| `Tạo mới` | `backend/src/modules/users/dto/create-address.dto.ts` | DTO thêm mới địa chỉ với validation đầy đủ và definite assignment `!` |
| `Tạo mới` | `backend/src/modules/users/dto/update-address.dto.ts` | DTO cập nhật địa chỉ kế thừa `PartialType(CreateAddressDto)` |
| `Tạo mới` | `backend/src/modules/users/users.service.ts` | Service xử lý logic nghiệp vụ, transaction và phân quyền dữ liệu địa chỉ |
| `Tạo mới` | `backend/src/modules/users/users.service.spec.ts` | Bộ kiểm thử đơn vị với 16 test cases kiểm tra nghiệp vụ và cô lập dữ liệu |
| `Tạo mới` | `backend/src/modules/users/users.controller.ts` | REST Controller định tuyến `/users/addresses` bảo vệ bởi `JwtAuthGuard` |
| `Tạo mới` | `backend/src/modules/users/users.module.ts` | Module khai báo controller, service và export `UsersService` |
| `Cập nhật` | `backend/src/app.module.ts` | Đăng ký `UsersModule` vào `AppModule` |

---

## 3. Chi tiết Triển khai Kỹ thuật (Technical Implementation)

- **Sửa cảnh báo TypeScript 7.0 deprecation**:
  - Loại bỏ `"baseUrl": "./"` khỏi `backend/tsconfig.json`.
  - Điều chỉnh đường dẫn alias sang `"paths": { "@/*": ["./src/*"] }` để TypeScript tự động phân giải tương đối từ vị trí file `tsconfig.json`.
- **Thiết kế & Nghiệp vụ Sổ địa chỉ (UsersService)**:
  - Tự động đặt `isDefault: true` nếu đây là địa chỉ đầu tiên của người dùng.
  - Khi một địa chỉ được tạo mới hoặc cập nhật với `isDefault: true`, sử dụng Prisma `$transaction` để đồng thời chuyển toàn bộ địa chỉ khác của người dùng đó về `isDefault: false`.
  - Khi xóa địa chỉ mặc định, tự động tìm và thăng hạng địa chỉ kế tiếp gần nhất làm mặc định (trong transaction) để tài khoản luôn có một địa chỉ giao hàng ưu tiên.
- **Bảo mật & Cô lập Dữ liệu**:
  - Tất cả các thao tác `find`, `update`, `delete` đều kiểm tra `address.userId === currentUserId`. Nếu không khớp hoặc không tìm thấy, lập tức ném ngoại lệ `NotFoundException('Address not found')`, ngăn chặn hoàn toàn việc rò rỉ dữ liệu hoặc can thiệp chéo tài khoản.
- **Quy chuẩn Code**:
  - Tách thư mục `interfaces/` độc lập.
  - Sử dụng definite assignment assertion `!` cho thuộc tính DTO.
  - 100% comment, docstring JSDoc và log bằng tiếng Anh, không icon/emoji.
  - Import sử dụng path alias `@/*`.

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

### 4.2. Lệnh kiểm tra đơn vị tự động (Unit Test cho `UsersService`)

- **Lệnh thực thi**: `npm test --prefix backend -- users.service.spec.ts`
- **Kết quả**:

```text
> bakery-api@1.0.0 test
> jest users.service.spec.ts

PASS src/modules/users/users.service.spec.ts (10.115 s)
  UsersService
    √ should be defined (18 ms)
    getAddresses
      √ should return list of addresses for the authenticated user (6 ms)
    getAddressById
      √ should return address if it exists and belongs to the user (3 ms)
      √ should throw NotFoundException if address does not exist (24 ms)
      √ should throw NotFoundException if address belongs to another user (isolation guarantee) (5 ms)
    createAddress
      √ should automatically set isDefault to true if this is the user first address (6 ms)
      √ should create address as non-default if user already has addresses and isDefault is false (2 ms)
      √ should reset previous default addresses when creating a new address with isDefault true (3 ms)
    updateAddress
      √ should update address fields when owner requests (6 ms)
      √ should throw NotFoundException when updating an address belonging to another user (4 ms)
      √ should reset other defaults in a transaction if updated to isDefault true (3 ms)
    setDefaultAddress
      √ should mark address as default in transaction and unset previous defaults (2 ms)
      √ should throw NotFoundException if address belongs to another user (5 ms)
    deleteAddress
      √ should delete address directly if not default (3 ms)
      √ should delete address in transaction and promote remaining address to default if deleted was default (3 ms)
      √ should throw NotFoundException when deleting address of another user (3 ms)

Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        10.537 s
Ran all test suites matching /users.service.spec.ts/i.
```

### 4.3. Lệnh kiểm tra toàn bộ Unit Test suite

- **Lệnh thực thi**: `npm test --prefix backend`
- **Kết quả**:

```text
> bakery-api@1.0.0 test
> jest

PASS src/modules/users/users.service.spec.ts (14.523 s)
PASS src/common/guards/roles.guard.spec.ts (18.216 s)
PASS src/modules/health/health.controller.spec.ts (19.096 s)
PASS src/modules/auth/auth.service.spec.ts (19.674 s)

Test Suites: 4 passed, 4 total
Tests:       37 passed, 37 total
Snapshots:   0 total
Time:        21.838 s
Ran all test suites.
```

### 4.4. Lệnh kiểm tra Build

- **Lệnh thực thi**: `npm run build --prefix backend`
- **Kết quả**:

```text
> bakery-api@1.0.0 build
> nest build
(Build production thành công, exit code 0)
```

---

## 5. Đánh giá Tiêu chí Nghiệm thu (Acceptance Criteria Checklist)

- [x] Lỗi cảnh báo `baseUrl` trong `tsconfig.json` được loại bỏ hoàn toàn, không còn cảnh báo TypeScript 7.0 -> Đạt.
- [x] Khách hàng thêm được địa chỉ và không xóa/sửa/xem được địa chỉ của người khác -> Đạt (16 test cases trong `users.service.spec.ts` pass 100%).
- [x] Toàn bộ 37 unit tests trên cả 4 test suites pass 100% -> Đạt.
- [x] `tsc --noEmit` và `nest build` hoàn tất không lỗi -> Đạt.

---

## 6. Rủi ro & Bàn giao cho Task Kế tiếp (Next Steps & Handover)

- **Rủi ro hiện tại**: Không có. Module Users và Address Book đã hoàn thành đầy đủ, hoàn tất toàn bộ Milestone 3.
- **Task tiếp theo cần thực hiện**: **Milestone 04: Danh mục & Quản lý Sản phẩm Bánh (Backend API)**, bắt đầu với **Task 4.1: API Danh mục Sản phẩm (Categories Module)** theo `docs/IMPLEMENTATION_PLAN.md`.
