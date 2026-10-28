# Bakery Web — Kế hoạch Triển khai Chi tiết (Implementation Plan)

> **Dự án**: Bakery Web (E-commerce MVP cho Tiệm bánh Đơn)  
> **Phiên bản**: 1.1.0 (Kiến trúc phân tách độc lập `frontend` / `backend`, Thuần npm, PayOS Sandbox & Hệ thống Thông báo)  
> **Vai trò**: Senior Software Architect & Tech Lead  
> **Trạng thái**: Đã cập nhật theo yêu cầu Review của Khách hàng  

---

## 1. Nguyên tắc Thực thi (Execution Principles)

Tuân thủ nghiêm ngặt theo `docs/AI_WORKFLOW.md` và các điều chỉnh mới từ khách hàng:

1. **Thuần npm, không dùng Turborepo**: Quản trị hai ứng dụng độc lập thông qua npm scripts có cờ `--prefix`.
2. **Độc lập tuyệt đối**: Thư mục `frontend/` và `backend/` tự quản lý mã nguồn, dependencies và kiểu dữ liệu riêng biệt.
3. **Thanh toán chuẩn Việt Nam**: Tích hợp mã VietQR động qua PayOS Sandbox.
4. **Đồng bộ thông tin thời gian thực**: Xây dựng đầy đủ tính năng thông báo trạng thái đơn hàng cho khách hàng và chuông báo động đơn mới (Audio Alert) cho chủ tiệm.
5. **Một tác vụ tại một thời điểm**: Triển khai tuần tự, nghiệm thu bằng lệnh kiểm tra thực tế trước khi chuyển sang task kế tiếp.

---

## 2. Lộ trình Triển khai Tổng thể (Milestones Roadmap)

```mermaid
gantt
    title Bakery Web MVP Implementation Roadmap (Pure npm & Decoupled)
    dateFormat  X
    axisFormat %d
    
    section Khởi tạo
    M1: Thiết lập 2 Thư mục Độc lập (Pure npm) :active, m1, 0, 3
    M2: Database Prisma & Bảng Notification   :m2, 3, 5
    
    section Core Backend
    M3: Auth & Sổ Địa chỉ Nhận hàng           :m3, 5, 8
    M4: Catalog Bánh & Danh mục Backend       :m4, 8, 11
    
    section Storefront Web
    M5: Giao diện Storefront (Catalog & Lọc)   :m5, 11, 14
    M6: Giỏ hàng & Động cơ Coupon             :m6, 14, 17
    
    section Orders & Payments
    M7: Đặt hàng & Trừ kho Nguyên tử          :m7, 17, 21
    M8: Tích hợp PayOS Sandbox & Webhook       :m8, 21, 24
    M9: Giao diện Checkout & Theo dõi Đơn      :m9, 24, 27
    
    section Thông báo & Admin
    M10: Hệ thống Thông báo (Khách & Chủ tiệm):m10, 27, 30
    M11: Cổng Quản trị Admin Bếp & Bán hàng    :m11, 30, 33
    M12: Kiểm thử, Tối ưu & Triển khai CI/CD   :m12, 33, 36
```

---

## 3. Chi tiết Từng Milestone & Tác vụ Cụ thể (Detailed Tasks)

---

### MILESTONE 1: Thiết lập Dự án Phân tách Độc lập (Thuần npm)

#### Task 1.1: Khởi tạo Root npm Scripts

- **Mục tiêu**: Tạo `package.json` gốc với các npm scripts tiện lợi để điều phối 2 thư mục `frontend/` và `backend/`.
- **Giả định**: Node.js v20+ và npm v10+ đã cài sẵn trên máy phát triển.
- **File liên quan**:
  - `package.json` (root)
  - `.gitignore`
- **Kế hoạch thực hiện**:
  1. Khởi tạo `package.json` gốc chứa các scripts: `"dev:backend"`, `"dev:frontend"`, `"build:backend"`, `"build:frontend"`, `"test:backend"`, `"test:frontend"`.
  2. Cập nhật `.gitignore` để bỏ qua `node_modules/`, `.next/`, `dist/`, `.env` ở cả hai thư mục con.
- **Tiêu chí nghiệm thu**:
  - [ ] Không chứa file cấu hình của Turborepo (`turbo.json`).
  - [ ] Lệnh npm hoạt động bình thường không báo lỗi cú pháp.
- **Lệnh xác minh**:

  ```bash
  npm run --help
  ```

---

#### Task 1.2: Khởi tạo Backend NestJS Độc lập (`backend/`)

- **Mục tiêu**: Dựng ứng dụng NestJS 10+ với cấu trúc module chuẩn, TypeScript strict mode, Global Validation Pipe và Global Exception Filter.
- **Giả định**: `backend/` có `package.json` và `tsconfig.json` riêng biệt, không phụ thuộc ra ngoài.
- **File liên quan**:
  - `backend/package.json`
  - `backend/tsconfig.json`
  - `backend/src/main.ts`
  - `backend/src/app.module.ts`
  - `backend/src/common/filters/http-exception.filter.ts`
- **Kế hoạch thực hiện**:
  1. Tạo project NestJS trong `backend/`.
  2. Cấu hình CORS cho phép `frontend` kết nối.
  3. Cài đặt các gói cơ bản: `@nestjs/common`, `@nestjs/core`, `@nestjs/config`, `class-validator`, `class-transformer`.
  4. Tạo endpoint kiểm tra sức khỏe `GET /api/v1/health`.
- **Tiêu chí nghiệm thu**:
  - [ ] Backend khởi động thành công trên cổng `3001` (hoặc cổng cấu hình).
  - [ ] Endpoint `/api/v1/health` trả về status 200 OK.
- **Lệnh xác minh**:

  ```bash
  npm --prefix backend run build
  npm --prefix backend run start:dev
  ```

---

#### Task 1.3: Khởi tạo Frontend Next.js Độc lập (`frontend/`)

- **Mục tiêu**: Dựng ứng dụng Next.js 15+ App Router với TypeScript và TailwindCSS, tối ưu hóa giao diện tiệm bánh.
- **Giả định**: `frontend/` hoàn toàn tự chủ, quản lý `package.json` và `tsconfig.json` độc lập.
- **File liên quan**:
  - `frontend/package.json`
  - `frontend/tsconfig.json`
  - `frontend/src/app/layout.tsx`
  - `frontend/src/app/page.tsx`
  - `frontend/tailwind.config.ts`
- **Kế hoạch thực hiện**:
  1. Khởi tạo Next.js với App Router và TailwindCSS trong thư mục `frontend/`.
  2. Cấu hình Path Alias `@/*` trỏ tới `frontend/src/*`.
  3. Tạo giao diện trang chủ cơ bản (chào đón đến với Tiệm Bánh Bakery Web).
- **Tiêu chí nghiệm thu**:
  - [ ] Frontend build và chạy thành công trên cổng `3000`.
- **Lệnh xác minh**:

  ```bash
  npm --prefix frontend run build
  npm --prefix frontend run dev
  ```

---

### MILESTONE 2: Cơ sở Dữ liệu, Prisma Schema & Bảng Notification

#### Task 2.1: Cấu hình Prisma Schema trong `backend/`

- **Mục tiêu**: Định nghĩa toàn bộ cấu trúc bảng cơ sở dữ liệu quan hệ PostgreSQL trong `backend/prisma/schema.prisma` bao gồm bảng `Notification`.
- **File liên quan**:
  - `backend/prisma/schema.prisma`
  - `backend/src/database/prisma.service.ts`
  - `backend/src/database/prisma.module.ts`
- **Kế hoạch thực hiện**:
  1. Định nghĩa các Model: `User`, `Address`, `Category`, `Product`, `Coupon`, `CouponUsage`, `Order`, `OrderItem`, `PaymentTransaction`, và `Notification`.
  2. Tạo service kết nối `PrismaService` xử lý lifecycle kết nối và ngắt kết nối an toàn.
  3. Đăng ký `PrismaModule` là `@Global()` trong NestJS.
- **Tiêu chí nghiệm thu**:
  - [ ] `npx prisma validate` trong `backend/` hợp lệ 100%.
  - [ ] `npx prisma generate` sinh mã Prisma Client TypeScript thành công.
- **Lệnh xác minh**:

  ```bash
  npm --prefix backend run prisma:generate
  ```

---

#### Task 2.2: Migration Ban đầu & Nạp Dữ liệu Mẫu (Seeding)

- **Mục tiêu**: Chạy migration tạo bảng trên PostgreSQL và viết script seed dữ liệu khởi tạo.
- **File liên quan**:
  - `backend/prisma/migrations/`
  - `backend/prisma/seed.ts`
- **Kế hoạch thực hiện**:
  1. Chạy `prisma migrate dev --name init_bakery_database`.
  2. Viết file `seed.ts` nạp:
     - 1 tài khoản Chủ tiệm (`owner@bakery.local`).
     - 4 danh mục: Bánh mì thủ công, Bánh ngọt, Bánh lạnh, Đồ uống.
     - 8 sản phẩm bánh thực tế kèm giá, tồn kho, thành phần dị ứng, thời gian nướng.
     - 2 mã coupon test: `BANHMOI20` (Giảm 20%), `FREESHIP` (Giảm 25k).
- **Tiêu chí nghiệm thu**:
  - [ ] Script nạp dữ liệu chạy trơn tru, không phát sinh lỗi trùng lặp.
- **Lệnh xác minh**:

  ```bash
  npm --prefix backend run prisma:seed
  ```

---

### MILESTONE 3: Module Xác thực (Auth) & Quản lý Người dùng

#### Task 3.1: Đăng ký, Đăng nhập & Băm Mật khẩu An toàn

- **Mục tiêu**: Xây dựng API đăng ký và đăng nhập cho khách hàng, băm mật khẩu bằng Argon2id hoặc bcrypt.
- **File liên quan**:
  - `backend/src/modules/auth/auth.controller.ts`
  - `backend/src/modules/auth/auth.service.ts`
  - `backend/src/modules/auth/dto/register.dto.ts`
  - `backend/src/modules/auth/dto/login.dto.ts`
- **Kế hoạch thực hiện**:
  1. Validate email, số điện thoại VN, mật khẩu độ dài tối thiểu 8 ký tự.
  2. Băm mật khẩu an toàn trước khi lưu cơ sở dữ liệu.
  3. Cấp cặp Access Token (15 phút) và Refresh Token (7 ngày) qua HttpOnly Cookie.
- **Tiêu chí nghiệm thu**:
  - [ ] Đăng ký trả về thông tin user (đã lược bỏ `passwordHash`).
  - [ ] Đăng nhập sai trả về HTTP 401 kèm mã `AUTH_INVALID_CREDENTIALS`.
- **Lệnh xác minh**:

  ```bash
  npm --prefix backend run test -- auth.service.spec.ts
  ```

---

#### Task 3.2: Refresh Token Rotation & Phân quyền RBAC Guard

- **Mục tiêu**: Xây dựng Guard kiểm tra quyền `Role.OWNER` vs `Role.CUSTOMER` và cơ chế xoay vòng Refresh Token.
- **File liên quan**:
  - `backend/src/common/guards/jwt-auth.guard.ts`
  - `backend/src/common/guards/roles.guard.ts`
  - `backend/src/common/decorators/roles.decorator.ts`
  - `backend/src/modules/auth/strategies/jwt.strategy.ts`
- **Kế hoạch thực hiện**:
  1. Viết `RolesGuard` đối soát `@Roles(Role.OWNER)`.
  2. Viết endpoint `POST /api/v1/auth/refresh` xoay vòng token mới, thu hồi token cũ.
- **Tiêu chí nghiệm thu**:
  - [ ] Tài khoản khách thông thường bị chặn với mã lỗi 403 khi vào route admin.
- **Lệnh xác minh**:

  ```bash
  npm --prefix backend run test -- roles.guard.spec.ts
  ```

---

#### Task 3.3: Quản lý Sổ Địa chỉ Nhận hàng (Address Book)

- **Mục tiêu**: Khách hàng thêm, sửa, xóa và chọn địa chỉ giao hàng mặc định.
- **File liên quan**:
  - `backend/src/modules/users/users.controller.ts`
  - `backend/src/modules/users/users.service.ts`
- **Kế hoạch thực hiện**:
  1. API `GET /api/v1/users/addresses`, `POST /api/v1/users/addresses`, `DELETE /api/v1/users/addresses/:id`.
  2. Đảm bảo tính cô lập: Khách hàng chỉ truy cập được địa chỉ do mình tạo.
- **Tiêu chí nghiệm thu**:
  - [ ] Khách thêm được địa chỉ và không xóa được địa chỉ của người khác.
- **Lệnh xác minh**:

  ```bash
  npm --prefix backend run test -- users.service.spec.ts
  ```

---

### MILESTONE 4: Danh mục & Quản lý Sản phẩm Bánh (Backend API)

#### Task 4.1: API Danh mục Sản phẩm (Categories Module)

- **Mục tiêu**: Cung cấp API xem danh mục cho khách và CRUD danh mục cho chủ tiệm bánh.
- **File liên quan**:
  - `backend/src/modules/categories/categories.controller.ts`
  - `backend/src/modules/categories/categories.service.ts`
- **Kế hoạch thực hiện**:
  1. `GET /api/v1/categories`: Công khai.
  2. `POST`, `PUT`, `DELETE`: Yêu cầu quyền `Role.OWNER`.
  3. Tự động sinh `slug` từ tên danh mục tiếng Việt.
- **Tiêu chí nghiệm thu**:
  - [ ] Khách xem được danh mục; chỉ Owner mới có quyền tạo/sửa.
- **Lệnh xác minh**:

  ```bash
  npm --prefix backend run test -- categories.controller.spec.ts
  ```

---

#### Task 4.2: API Sản phẩm: CRUD, Lọc, Tìm kiếm & Toggle Tồn kho Nhanh

- **Mục tiêu**: API quản lý sản phẩm bánh với đầy đủ bộ lọc (danh mục, khoảng giá, tình trạng còn hàng, từ khóa) và phân trang.
- **File liên quan**:
  - `backend/src/modules/products/products.controller.ts`
  - `backend/src/modules/products/products.service.ts`
- **Kế hoạch thực hiện**:
  1. `GET /api/v1/products`: Hỗ trợ lọc theo `search`, `categorySlug`, `minPrice`, `maxPrice`, `inStockOnly`, `page`, `limit`.
  2. `GET /api/v1/products/:slug`: Xem chi tiết bánh.
  3. `PATCH /api/v1/products/:id/stock`: Cập nhật số lượng tồn kho.
  4. `PATCH /api/v1/products/:id/toggle`: Nút gạt bật/tắt mở bán nhanh cho chủ tiệm.
- **Tiêu chí nghiệm thu**:
  - [ ] Lọc và tìm kiếm bánh trả về kết quả chính xác kèm thông tin phân trang.
- **Lệnh xác minh**:

  ```bash
  npm --prefix backend run test -- products.service.spec.ts
  ```

---

#### Task 4.3: Service Tải ảnh Bánh (Uploads Module)

- **Mục tiêu**: Tiếp nhận file ảnh bánh từ chủ tiệm và tải lên Cloudinary / Cloud Storage.
- **File liên quan**:
  - `backend/src/modules/uploads/uploads.controller.ts`
  - `backend/src/modules/uploads/uploads.service.ts`
- **Kế hoạch thực hiện**:
  1. Giới hạn dung lượng tối đa 5MB, định dạng ảnh (`jpeg`, `png`, `webp`).
  2. Trả về URL ảnh công khai.
- **Tiêu chí nghiệm thu**:
  - [ ] File quá 5MB bị từ chối với mã lỗi 400.
- **Lệnh xác minh**:

  ```bash
  npm --prefix backend run test -- uploads.service.spec.ts
  ```

---

### MILESTONE 5: Giao diện Cửa hàng (Storefront UI - Next.js)

#### Task 5.1: Xây dựng Layout Tiệm Bánh & Responsive Navigation

- **Mục tiêu**: Xây dựng bộ khung giao diện khách hàng ấm cúng, sang trọng, chuẩn Mobile-first.
- **File liên quan**:
  - `frontend/src/app/(shop)/layout.tsx`
  - `frontend/src/components/layouts/shop-header.tsx`
  - `frontend/src/components/layouts/shop-footer.tsx`
  - `frontend/src/components/shop/cart-drawer.tsx`
- **Kế hoạch thực hiện**:
  1. Header gồm: Logo, Thanh tìm kiếm, Menu danh mục bánh, Chuông thông báo, Nút giỏ hàng, Nút tài khoản.
  2. Mini-cart Drawer trượt ngang mượt mà khi khách bấm giỏ hàng.
- **Tiêu chí nghiệm thu**:
  - [ ] Hiển thị đẹp mắt trên cả điện thoại (375px) và máy tính (1440px).
- **Lệnh xác minh**:

  ```bash
  npm --prefix frontend run lint
  npm --prefix frontend run build
  ```

---

#### Task 5.2: Trang chủ Tiệm Bánh & Khám phá Bánh Tươi

- **Mục tiêu**: Hiển thị Banner giới thiệu, Danh mục bánh đặc trưng, Danh sách bánh mới ra lò hôm nay.
- **File liên quan**:
  - `frontend/src/app/(shop)/page.tsx`
  - `frontend/src/components/shop/product-card.tsx`
- **Kế hoạch thực hiện**:
  1. Thẻ sản phẩm `ProductCard`: Ảnh bánh sắc nét, tên, giá bán, nhãn hết hàng nếu `stock = 0`, nút thêm nhanh vào giỏ.
- **Tiêu chí nghiệm thu**:
  - [ ] Trang chủ tải mượt mà dưới 1.5 giây.
- **Lệnh xác minh**:

  ```bash
  npm --prefix frontend run build
  ```

---

#### Task 5.3: Trang Danh mục Bánh & Trang Chi tiết Sản phẩm

- **Mục tiêu**: Cho phép khách tìm kiếm, lọc theo giá/danh mục và xem chi tiết thành phần, cảnh báo dị ứng của từng loại bánh.
- **File liên quan**:
  - `frontend/src/app/(shop)/products/page.tsx`
  - `frontend/src/app/(shop)/products/[slug]/page.tsx`
- **Kế hoạch thực hiện**:
  1. Đồng bộ bộ lọc với Search Params trên URL.
  2. Trang chi tiết hiển thị cảnh báo dị ứng (*Trứng, Sữa, Gluten*), hướng dẫn bảo quản mát.
- **Tiêu chí nghiệm thu**:
  - [ ] Khách không thể bấm chọn số lượng vượt quá số bánh còn trong kho.
- **Lệnh xác minh**:

  ```bash
  npm --prefix frontend run build
  ```

---

### MILESTONE 6: Giỏ hàng (Cart) & Động cơ Khuyến mãi (Coupons)

#### Task 6.1: Store Giỏ hàng Phía Client (Zustand + LocalStorage)

- **Mục tiêu**: Quản lý giỏ hàng phía client độc lập trong `frontend/src/stores/cart-store.ts`.
- **File liên quan**:
  - `frontend/src/stores/cart-store.ts`
  - `frontend/src/hooks/use-cart.ts`
- **Kế hoạch thực hiện**:
  1. Định nghĩa `CartItem` (id, productId, name, price, image, quantity, maxStock).
  2. Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`.
- **Tiêu chí nghiệm thu**:
  - [ ] F5 tải lại trang giỏ hàng vẫn giữ nguyên các món đã chọn.
- **Lệnh xác minh**:

  ```bash
  npm --prefix frontend run test
  ```

---

#### Task 6.2: Module Khuyến mãi Backend (Coupons Validation)

- **Mục tiêu**: Backend kiểm tra tính hợp lệ và tính toán số tiền giảm giá chính xác.
- **File liên quan**:
  - `backend/src/modules/coupons/coupons.controller.ts`
  - `backend/src/modules/coupons/coupons.service.ts`
- **Kế hoạch thực hiện**:
  1. `POST /api/v1/coupons/validate`: Kiểm tra ngày hiệu lực, giá trị tối thiểu, hạn mức dùng.
  2. Tính mức giảm (% có trần tối đa hoặc số tiền cố định).
- **Tiêu chí nghiệm thu**:
  - [ ] Mã % không bao giờ giảm vượt quá trần `maxDiscountAmount`.
- **Lệnh xác minh**:

  ```bash
  npm --prefix backend run test -- coupons.service.spec.ts
  ```

---

#### Task 6.3: Tích hợp Áp dụng Mã Giảm giá trên UI Giỏ hàng

- **Mục tiêu**: Khách hàng nhập mã coupon và thấy số tiền giảm tạm tính ngay lập tức.
- **File liên quan**:
  - `frontend/src/components/shop/coupon-form.tsx`
  - `frontend/src/app/(shop)/cart/page.tsx`
- **Kế hoạch thực hiện**:
  1. Nhập mã coupon, gọi API validate.
  2. Hiển thị thông báo chi tiết nếu đơn hàng chưa đủ điều kiện tối thiểu.
- **Tiêu chí nghiệm thu**:
  - [ ] Hiển thị rõ số tiền được giảm và tổng thanh toán mới.
- **Lệnh xác minh**:

  ```bash
  npm --prefix frontend run build
  ```

---

### MILESTONE 7: Đặt hàng & Xử lý Transaction Tồn kho Đồng thời (Backend)

#### Task 7.1: API Tạo Đơn hàng với Prisma Interactive Transaction

- **Mục tiêu**: Xử lý tạo đơn hàng an toàn tuyệt đối: trừ tồn kho nguyên tử bằng Row Guard, ghi nhận coupon, tạo bản ghi Order.
- **File liên quan**:
  - `backend/src/modules/orders/orders.controller.ts`
  - `backend/src/modules/orders/orders.service.ts`
- **Kế hoạch thực hiện**:
  1. Mở `prisma.$transaction`:
     - Lấy giá gốc từ DB.
     - Trừ kho nguyên tử: `UPDATE "Product" SET stock = stock - qty WHERE stock >= qty`.
     - Nếu thất bại $\rightarrow$ Throw `INSUFFICIENT_STOCK`.
     - Tăng lượt dùng coupon nếu có mã.
     - Tạo `Order` (Sinh mã `BKR-YYYYMMDD-XXXX`) và `OrderItem`.
- **Tiêu chí nghiệm thu**:
  - [ ] Trừ đúng số lượng tồn kho trong database.
  - [ ] Hết hàng lập tức rollback toàn bộ đơn hàng.
- **Lệnh xác minh**:

  ```bash
  npm --prefix backend run test -- orders.service.spec.ts
  ```

---

#### Task 7.2: Kiểm thử Race Condition Đồng thời (Concurrency Test)

- **Mục tiêu**: Viết integration test mô phỏng 5 request đồng thời mua chiếc bánh cuối cùng để đảm bảo hệ thống không bao giờ bị bán quá tồn kho (Zero Overselling).
- **File liên quan**:
  - `backend/test/orders-concurrency.e2e-spec.ts`
- **Kế hoạch thực hiện**:
  1. Chuẩn bị 1 bánh có `stock = 1`.
  2. Bắn 5 request song song qua `Promise.all`.
  3. Xác minh: Đúng 1 request thành công 201; 4 request còn lại nhận 400 `INSUFFICIENT_STOCK`. Tồn kho còn lại đúng bằng 0.
- **Tiêu chí nghiệm thu**:
  - [ ] Test chạy xanh 100%, chứng minh không bị overselling.
- **Lệnh xác minh**:

  ```bash
  npm --prefix backend run test:e2e -- orders-concurrency.e2e-spec.ts
  ```

---

#### Task 7.3: State Machine & Hủy đơn Hoàn kho

- **Mục tiêu**: Quản lý chuyển đổi trạng thái đơn hàng và cơ chế hoàn kho khi khách hủy đơn.
- **File liên quan**:
  - `backend/src/modules/orders/orders-state.service.ts`
- **Kế hoạch thực hiện**:
  1. Khách hàng chỉ được phép hủy khi đơn ở `PENDING_PAYMENT` hoặc `CONFIRMED`.
  2. Khi hủy: Hoàn trả số lượng bánh về lại bảng `Product`.
  3. Chủ tiệm chuyển đơn theo tiến độ: `CONFIRMED` $\rightarrow$ `PREPARING` $\rightarrow$ `READY_FOR_PICKUP` / `OUT_FOR_DELIVERY` $\rightarrow$ `COMPLETED`.
- **Tiêu chí nghiệm thu**:
  - [ ] Tiệm đã bấm `PREPARING` thì khách không thể bấm hủy đơn.
- **Lệnh xác minh**:

  ```bash
  npm --prefix backend run test -- orders-state.service.spec.ts
  ```

---

### MILESTONE 8: Cổng Thanh toán PayOS Sandbox (VietQR Online)

#### Task 8.1: Tích hợp Tạo Link Thanh toán VietQR PayOS

- **Mục tiêu**: Gọi API PayOS Sandbox tạo link thanh toán VietQR động và lưu bản ghi `PaymentTransaction`.
- **File liên quan**:
  - `backend/src/modules/payments/payos.service.ts`
  - `backend/src/modules/payments/payments.controller.ts`
- **Kế hoạch thực hiện**:
  1. API `POST /api/v1/payments/payos/create-link`: Nhận `orderId`.
  2. Gọi sang PayOS API `createPaymentLink` với thông tin đơn hàng, số tiền, URL trả về web.
  3. Trả về `checkoutUrl` và mã QR cho frontend điều hướng.
- **Tiêu chí nghiệm thu**:
  - [ ] Sinh được link thanh toán PayOS Sandbox hợp lệ.
- **Lệnh xác minh**:

  ```bash
  npm --prefix backend run test -- payos.service.spec.ts
  ```

---

#### Task 8.2: Xử lý PayOS Webhook với Xác minh Chữ ký Checksum & Idempotency

- **Mục tiêu**: Tiếp nhận webhook bất đồng bộ từ PayOS Sandbox, xác thực chữ ký HMAC-SHA256, chuyển trạng thái đơn sang `CONFIRMED` và kích hoạt thông báo.
- **File liên quan**:
  - `backend/src/modules/payments/payos-webhook.controller.ts`
- **Kế hoạch thực hiện**:
  1. Nhận webhook từ PayOS.
  2. Xác minh checksum bằng `PAYOS_CHECKSUM_KEY`.
  3. Kiểm tra tính bất biến (Idempotency): Nếu đơn đã `PAID`, trả về ngay HTTP 200 bỏ qua.
  4. Nếu chưa: Cập nhật `PaymentTransaction = PAID`, `Order.paymentStatus = PAID`, `Order.orderStatus = CONFIRMED`.
- **Tiêu chí nghiệm thu**:
  - [ ] Checksum sai lệch bị từ chối 400.
  - [ ] Bắn trùng webhook 3 lần vẫn cập nhật chính xác, không sinh lỗi.
- **Lệnh xác minh**:

  ```bash
  npm --prefix backend run test -- payos-webhook.spec.ts
  ```

---

#### Task 8.3: Tác vụ Hủy Đơn Treo Quá Hạn 15 Phút

- **Mục tiêu**: Tự động giải phóng tồn kho cho các đơn hàng thanh toán PayOS bị treo quá 15 phút chưa quét mã.
- **File liên quan**:
  - `backend/src/modules/payments/payment-timeout.service.ts`
- **Kế hoạch thực hiện**:
  1. Quét các đơn `ONLINE_GATEWAY` ở `PENDING_PAYMENT` có thời gian tạo quá 15 phút.
  2. Đổi sang `CANCELLED` và hoàn tồn kho cho tiệm.
- **Tiêu chí nghiệm thu**:
  - [ ] Đơn quá hạn 15 phút tự động hủy và bánh được trả lại kho.
- **Lệnh xác minh**:

  ```bash
  npm --prefix backend run test -- payment-timeout.service.spec.ts
  ```

---

### MILESTONE 9: Giao diện Đặt hàng & Theo dõi Đơn (Customer Web UI)

#### Task 9.1: Màn hình Checkout (Giao hàng tận nơi vs Nhận tại tiệm)

- **Mục tiêu**: Màn hình thanh toán đầy đủ các lựa chọn nhận hàng và thanh toán COD hoặc VietQR PayOS.
- **File liên quan**:
  - `frontend/src/app/(shop)/checkout/page.tsx`
  - `frontend/src/components/shop/fulfillment-tabs.tsx`
- **Kế hoạch thực hiện**:
  1. Tab "Giao hàng tận nơi": Chọn địa chỉ từ sổ địa chỉ lưu sẵn.
  2. Tab "Nhận tại cửa hàng": Chọn ngày và khung giờ nhận bánh (Pickup slot).
  3. Chọn phương thức: COD hoặc Quét mã VietQR PayOS.
- **Tiêu chí nghiệm thu**:
  - [ ] Thanh toán PayOS điều hướng mượt mà sang trang quét mã VietQR sandbox.
- **Lệnh xác minh**:

  ```bash
  npm --prefix frontend run build
  ```

---

#### Task 9.2: Trang Chi tiết & Timeline Theo dõi Đơn hàng

- **Mục tiêu**: Hiển thị Timeline 5 bước trực quan về tiến độ làm bánh của tiệm.
- **File liên quan**:
  - `frontend/src/app/(shop)/orders/[id]/page.tsx`
  - `frontend/src/components/shop/order-status-timeline.tsx`
- **Kế hoạch thực hiện**:
  1. Timeline: *Đặt hàng $\rightarrow$ Xác nhận $\rightarrow$ Đang làm bánh $\rightarrow$ Đang giao / Chờ lấy $\rightarrow$ Hoàn tất*.
  2. Hiển thị nút "Hủy đơn hàng" khi đơn chưa bắt đầu làm bánh.
- **Tiêu chí nghiệm thu**:
  - [ ] Trạng thái trên Timeline khớp chính xác với trạng thái thực tế từ backend.
- **Lệnh xác minh**:

  ```bash
  npm --prefix frontend run build
  ```

---

#### Task 9.3: Trang Lịch sử Đơn hàng của Khách

- **Mục tiêu**: Khách hàng xem lại danh sách toàn bộ các đơn hàng đã đặt tại tiệm bánh.
- **File liên quan**:
  - `frontend/src/app/(shop)/orders/page.tsx`
- **Kế hoạch thực hiện**:
  1. Hiển thị thẻ đơn hàng phân trang, sắp xếp đơn mới nhất lên đầu.
- **Tiêu chí nghiệm thu**:
  - [ ] Tải danh sách đơn nhanh chóng và chỉ hiển thị đơn của tài khoản đang đăng nhập.
- **Lệnh xác minh**:

  ```bash
  npm --prefix frontend run build
  ```

---

### MILESTONE 10: Hệ thống Thông báo (Khách hàng & Chủ tiệm) — *Mới Bổ sung*

#### Task 10.1: Module Thông báo Backend (Notifications Module)

- **Mục tiêu**: Xây dựng service lưu trữ và truy vấn thông báo cho Khách hàng và Chủ tiệm.
- **File liên quan**:
  - `backend/src/modules/notifications/notifications.controller.ts`
  - `backend/src/modules/notifications/notifications.service.ts`
- **Kế hoạch thực hiện**:
  1. `POST` tạo thông báo tự động khi:
     - Khách đặt đơn mới $\rightarrow$ Báo cho Khách ("Đặt đơn thành công") + Báo cho toàn bộ Chủ tiệm `OWNER` ("Đơn hàng mới đến!").
     - PayOS báo thanh toán thành công $\rightarrow$ Báo cho Khách.
     - Chủ tiệm đổi trạng thái đơn $\rightarrow$ Báo cho Khách.
     - Khách hủy đơn $\rightarrow$ Báo cho Chủ tiệm.
  2. `GET /api/v1/notifications`: Lấy danh sách thông báo phân trang của user.
  3. `GET /api/v1/notifications/unread-count`: Đếm nhanh số thông báo chưa đọc.
  4. `PATCH /api/v1/notifications/:id/read` & `PATCH /api/v1/notifications/read-all`.
- **Tiêu chí nghiệm thu**:
  - [ ] Khách tạo đơn COD $\rightarrow$ Có 1 thông báo vào hộp thư của khách và 1 thông báo vào hộp thư của chủ tiệm.
  - [ ] Đếm số thông báo chưa đọc trả về chính xác.
- **Lệnh xác minh**:

  ```bash
  npm --prefix backend run test -- notifications.service.spec.ts
  ```

---

#### Task 10.2: Component Chuông Thông báo (Notification Bell) Phía Khách hàng

- **Mục tiêu**: Hiển thị icon chuông trên Header của trang mua bánh, có badge đỏ đếm số thông báo chưa đọc và popover xem danh sách thông báo.
- **File liên quan**:
  - `frontend/src/components/layouts/notification-bell.tsx`
  - `frontend/src/hooks/use-notifications.ts`
- **Kế hoạch thực hiện**:
  1. Hook `useNotifications`: Polling định kỳ mỗi 30 giây để lấy số thông báo mới.
  2. Bấm vào icon chuông mở Popover danh sách thông báo.
  3. Click vào từng thông báo: Đánh dấu đã đọc và chuyển trang ngay tới `/orders/[id]`.
- **Tiêu chí nghiệm thu**:
  - [ ] Badge đỏ hiển thị đúng số lượng thông báo chưa đọc.
  - [ ] Click thông báo mở đúng đơn hàng tương ứng.
- **Lệnh xác minh**:

  ```bash
  npm --prefix frontend run build
  ```

---

#### Task 10.3: Chuông Thông báo & Âm thanh Báo động Đơn mới cho Chủ tiệm (Admin Audio Alert)

- **Mục tiêu**: Giúp chủ tiệm bánh trong bếp nghe thấy chuông báo ("Ting ting") ngay khi có đơn hàng mới đến, không bị trễ nải đơn của khách.
- **File liên quan**:
  - `frontend/src/components/admin/admin-notification-bell.tsx`
  - `frontend/public/audio/new-order-chime.mp3`
  - `frontend/src/hooks/use-admin-order-alert.ts`
- **Kế hoạch thực hiện**:
  1. Tích hợp file âm thanh chuông báo vào thư mục `frontend/public/audio/`.
  2. Hook polling mỗi 15 giây kiểm tra thông báo mới loại `NEW_ORDER_ALERT`.
  3. Khi phát hiện đơn mới: Tự động kích hoạt phát âm thanh chuông báo và hiển thị thông báo nổi (Toast alert).
- **Tiêu chí nghiệm thu**:
  - [ ] Khi có đơn mới xuất hiện, trang Admin phát âm thanh chuông báo rõ ràng.
- **Lệnh xác minh**:

  ```bash
  npm --prefix frontend run build
  ```

---

### MILESTONE 11: Cổng Quản trị cho Chủ Tiệm (Store Owner Admin Portal)

#### Task 11.1: Layout Quản trị & Bảo vệ Quyền Admin

- **Mục tiêu**: Xây dựng layout `/admin` có Sidebar quản trị, kiểm tra nghiêm ngặt quyền `Role.OWNER`.
- **File liên quan**:
  - `frontend/src/app/(admin)/layout.tsx`
  - `frontend/src/components/layouts/admin-sidebar.tsx`
- **Kế hoạch thực hiện**:
  1. Sidebar gồm: Dashboard, Quản lý Đơn hàng, Quản lý Bánh, Quản lý Danh mục, Quản lý Coupon.
  2. Chặn người dùng không phải Owner truy cập.
- **Tiêu chí nghiệm thu**:
  - [ ] Khách hàng thường truy cập `/admin` bị chặn và chuyển hướng an toàn.
- **Lệnh xác minh**:

  ```bash
  npm --prefix frontend run build
  ```

---

#### Task 11.2: Màn hình Quản lý Đơn hàng & Điều phối Bếp (Admin Orders Management)

- **Mục tiêu**: Bảng quản lý đơn hàng theo các tab trạng thái, hiển thị rõ giờ khách hẹn lấy bánh, các nút bấm chuyển trạng thái làm bánh nhanh.
- **File liên quan**:
  - `frontend/src/app/(admin)/admin/orders/page.tsx`
  - `frontend/src/app/(admin)/admin/orders/[id]/page.tsx`
- **Kế hoạch thực hiện**:
  1. Các tab: *Đơn mới cần làm, Đang làm bánh, Chờ khách lấy / Đang giao, Hoàn tất, Đã hủy*.
  2. Nút bấm thao tác nhanh: "Bắt đầu làm bánh", "Đã xong - Chờ lấy / Bàn giao shipper", "Hoàn tất đơn".
- **Tiêu chí nghiệm thu**:
  - [ ] Chủ tiệm bấm chuyển trạng thái thành công $\rightarrow$ Khách hàng nhận được thông báo tương ứng.
- **Lệnh xác minh**:

  ```bash
  npm --prefix frontend run build
  ```

---

#### Task 11.3: Quản lý Bánh, Toggle Còn/Hết Hàng & Quản lý Coupon

- **Mục tiêu**: Bảng quản lý menu bánh có nút gạt toggle còn/hết hàng nhanh, form thêm bánh mới và form tạo coupon.
- **File liên quan**:
  - `frontend/src/app/(admin)/admin/products/page.tsx`
  - `frontend/src/app/(admin)/admin/coupons/page.tsx`
- **Kế hoạch thực hiện**:
  1. Bấm nút gạt Toggle Switch trên bảng sản phẩm: Cập nhật ngay trạng thái mở bán.
  2. Form tạo coupon mới (mã, % hoặc tiền, ngày bắt đầu/kết thúc).
- **Tiêu chí nghiệm thu**:
  - [ ] Gạt hết hàng trên admin $\rightarrow$ Trang ngoài khách hàng thấy ngay trạng thái "Hết hàng".
- **Lệnh xác minh**:

  ```bash
  npm --prefix frontend run build
  ```

---

### MILESTONE 12: Kiểm thử Toàn diện, Tối ưu & Triển khai CI/CD

#### Task 12.1: E2E Test Luồng Đặt hàng & Nhận Thông báo (Playwright)

- **Mục tiêu**: Kiểm thử tự động trọn vẹn kịch bản: Khách duyệt bánh $\rightarrow$ Đặt đơn $\rightarrow$ Nhận thông báo $\rightarrow$ Chủ tiệm nhận chuông báo và duyệt đơn.
- **File liên quan**:
  - `frontend/e2e/order-notification-flow.spec.ts`
- **Kế hoạch thực hiện**:
  1. Viết kịch bản Playwright kiểm thử trên trình duyệt giả lập.
- **Tiêu chí nghiệm thu**:
  - [ ] Kịch bản E2E chạy xanh 100%.
- **Lệnh xác minh**:

  ```bash
  npm --prefix frontend run test:e2e
  ```

---

#### Task 12.2: Thiết lập Pipeline CI/CD với GitHub Actions (Thuần npm)

- **Mục tiêu**: Tự động kiểm tra lint, typecheck, unit tests và build cho cả `backend/` và `frontend/` trên mỗi Pull Request.
- **File liên quan**:
  - `.github/workflows/ci.yml`
- **Kế hoạch thực hiện**:
  1. Cấu hình GitHub Actions chạy 2 job độc lập:
     - Job `backend`: `npm --prefix backend run lint && npm --prefix backend run test && npm --prefix backend run build`.
     - Job `frontend`: `npm --prefix frontend run lint && npm --prefix frontend run test && npm --prefix frontend run build`.
- **Tiêu chí nghiệm thu**:
  - [ ] CI pipeline chạy xanh trên GitHub.
- **Lệnh xác minh**:

  ```bash
  npm run lint
  npm run build:backend
  npm run build:frontend
  ```

---

#### Task 12.3: Hướng dẫn Triển khai Miễn phí Lên Vercel & Render

- **Mục tiêu**: Soạn tài liệu hướng dẫn triển khai độc lập: Frontend lên Vercel (`Root: frontend`), Backend lên Render (`Root: backend`), Database lên Supabase/Neon.
- **File liên quan**:
  - `docs/DEPLOYMENT_GUIDE.md`
- **Tiêu chí nghiệm thu**:
  - [ ] Hai ứng dụng deploy độc lập không phụ thuộc nhau, sẵn sàng phục vụ khách hàng.
- **Lệnh xác minh**:

  ```bash
  npm run build:backend
  npm run build:frontend
  ```

---

## 4. Bảng Theo dõi Tiến độ Triển khai (Execution Tracker)

| Milestone | Tác vụ | Trạng thái | Người phụ trách |
| :--- | :--- | :--- | :--- |
| **M1: Khởi tạo Độc lập** | 1.1 Root npm Scripts (Thuần npm) | ⏳ Chờ phê duyệt | Senior Architect |
| | 1.2 Khởi tạo `backend/` NestJS Độc lập | ⏳ Chờ phê duyệt | Backend Lead |
| | 1.3 Khởi tạo `frontend/` Next.js Độc lập | ⏳ Chờ phê duyệt | Frontend Lead |
| **M2: Database Setup** | 2.1 Prisma Schema & Bảng Notification | ⏳ Chờ phê duyệt | Backend Lead |
| | 2.2 Migrations & Seeding Dữ liệu Bánh | ⏳ Chờ phê duyệt | Backend Lead |
| **M3: Auth & Users** | 3.1 Đăng ký, Đăng nhập & Băm mật khẩu | ⏳ Chờ phê duyệt | Backend Lead |
| | 3.2 Refresh Token Rotation & RBAC Guard | ⏳ Chờ phê duyệt | Backend Lead |
| | 3.3 Sổ địa chỉ nhận hàng | ⏳ Chờ phê duyệt | Backend Lead |
| **M4: Catalog API** | 4.1 Danh mục Sản phẩm API | ⏳ Chờ phê duyệt | Backend Lead |
| | 4.2 Sản phẩm CRUD, Lọc & Toggle Stock | ⏳ Chờ phê duyệt | Backend Lead |
| | 4.3 Tải ảnh Cloudinary | ⏳ Chờ phê duyệt | Backend Lead |
| **M5: Storefront UI** | 5.1 Layout & Navigation Responsive | ⏳ Chờ phê duyệt | Frontend Lead |
| | 5.2 Trang chủ & Bánh nổi bật | ⏳ Chờ phê duyệt | Frontend Lead |
| | 5.3 Catalog Lọc sản phẩm & Chi tiết bánh | ⏳ Chờ phê duyệt | Frontend Lead |
| **M6: Cart & Coupons** | 6.1 Zustand Cart Store phía Client | ⏳ Chờ phê duyệt | Frontend Lead |
| | 6.2 Coupon Engine Validation Backend | ⏳ Chờ phê duyệt | Backend Lead |
| | 6.3 Tích hợp Coupon UI | ⏳ Chờ phê duyệt | Frontend Lead |
| **M7: Order Concurrency** | 7.1 Đặt hàng với Prisma Interactive Tx | ⏳ Chờ phê duyệt | Tech Lead |
| | 7.2 Concurrency Race Condition Tests | ⏳ Chờ phê duyệt | Tech Lead |
| | 7.3 State Machine & Hủy đơn Hoàn kho | ⏳ Chờ phê duyệt | Tech Lead |
| **M8: PayOS Sandbox** | 8.1 Tạo Link Thanh toán VietQR PayOS | ⏳ Chờ phê duyệt | Backend Lead |
| | 8.2 Webhook Checksum & Idempotency | ⏳ Chờ phê duyệt | Tech Lead |
| | 8.3 Auto Timeout Quá hạn 15 phút | ⏳ Chờ phê duyệt | Backend Lead |
| **M9: Checkout UI** | 9.1 Màn hình Checkout (Pickup/Delivery) | ⏳ Chờ phê duyệt | Frontend Lead |
| | 9.2 Timeline Theo dõi đơn thời gian thực | ⏳ Chờ phê duyệt | Frontend Lead |
| | 9.3 Lịch sử đơn hàng | ⏳ Chờ phê duyệt | Frontend Lead |
| **M10: Notifications** | 10.1 Backend Notification Service & APIs | ⏳ Chờ phê duyệt | Backend Lead |
| | 10.2 Chuông thông báo Khách hàng UI | ⏳ Chờ phê duyệt | Frontend Lead |
| | 10.3 Chuông báo & Âm thanh Đơn mới Admin | ⏳ Chờ phê duyệt | Frontend Lead |
| **M11: Admin Portal** | 11.1 Layout & RBAC Guard Admin | ⏳ Chờ phê duyệt | Frontend Lead |
| | 11.2 Quản lý Đơn hàng & Tiến độ Bếp | ⏳ Chờ phê duyệt | Fullstack Dev |
| | 11.3 Quản lý Menu, Toggle Stock & Coupon | ⏳ Chờ phê duyệt | Fullstack Dev |
| **M12: Testing & Deploy** | 12.1 E2E Testing với Playwright | ⏳ Chờ phê duyệt | QA / Tech Lead |
| | 12.2 CI/CD GitHub Actions (Thuần npm) | ⏳ Chờ phê duyệt | DevOps Lead |
| | 12.3 Deployment Guide Vercel & Render | ⏳ Chờ phê duyệt | Senior Architect |
