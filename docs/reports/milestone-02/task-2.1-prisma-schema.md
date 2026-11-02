# Báo cáo Hoàn thành Task: Task 2.1 — Cấu hình Prisma Schema & Migration Cơ sở Dữ liệu

> **Milestone**: Milestone 02: Cơ sở Dữ liệu, Prisma Schema & Bảng Notification  
> **Thời gian hoàn thành**: 2026-11-03 00:23:17 (GMT+7)  
> **Trạng thái**: ✅ HOÀN THÀNH  
> **Người thực hiện**: AI Coding Assistant / Tech Lead  

---

## 1. Mục tiêu của Task (Goal & Scope)

- Triển khai toàn bộ các mô hình dữ liệu quan hệ (Models & Enums) đã thiết kế trong `backend/prisma/schema.prisma` vào cơ sở dữ liệu PostgreSQL thực tế (`bakery_db`) đang chạy trên Docker container `bakery-shop-postgres`.
- Tạo migration ban đầu `init_bakery_database` và đồng bộ Prisma Client TypeScript.

---

## 2. Các File Thay đổi / Tạo mới (Impacted Files)

| Loại thao tác | Đường dẫn File | Mục đích |
| :--- | :--- | :--- |
| `Tạo mới` | `backend/prisma/migrations/20261102172315_init_bakery_database/migration.sql` | Chứa các câu lệnh DDL SQL tạo bảng, enum, khóa chính, khóa ngoại, indexes |
| `Tạo mới` | `backend/prisma/migrations/migration_lock.toml` | Khóa phiên bản database engine của Prisma |
| `Đồng bộ` | `backend/node_modules/@prisma/client` | Sinh Prisma Client TypeScript phiên bản 6.19.3 |

---

## 3. Chi tiết Triển khai Kỹ thuật (Technical Implementation)

- **Tập hợp Enums**: `Role` (`CUSTOMER`, `OWNER`), `FulfillmentType` (`DELIVERY`, `PICKUP`), `OrderStatus` (7 trạng thái), `PaymentMethod` (`COD`, `ONLINE_GATEWAY`), `PaymentStatus` (5 trạng thái), `DiscountType` (`PERCENTAGE`, `FIXED_AMOUNT`), `NotificationType` (5 loại sự kiện).
- **Tập hợp Tables**: `User`, `Notification`, `Address`, `Category`, `Product`, `Coupon`, `CouponUsage`, `Order`, `OrderItem`, `PaymentTransaction`.
- **Ràng buộc an toàn**:
  - Dùng `Decimal(12, 2)` cho toàn bộ các trường tài chính.
  - Khóa duy nhất composite `@@unique([couponId, userId, orderId])` chống lạm dụng mã giảm giá.
  - Các chỉ mục tối ưu tìm kiếm: `@@index([slug])`, `@@index([email])`, `@@index([userId, isRead])`, `@@index([orderStatus])`.

---

## 4. Lệnh Kiểm tra & Kết quả Thực tế (Verification & Real Results)

### 4.1. Thực thi Migration Database

- **Lệnh thực thi**: `npm --prefix backend run prisma:migrate -- --name init_bakery_database`
- **Kết quả thực tế**:

```text
> bakery-api@1.0.0 prisma:migrate
> prisma migrate dev --name init_bakery_database

Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "bakery_db", schema "public" at "localhost:5432"

Applying migration `20261102172315_init_bakery_database`

The following migration(s) have been created and applied from new schema changes:

prisma\migrations/
  └─ 20261102172315_init_bakery_database/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v6.19.3) to .\node_modules\@prisma\client in 383ms
```

### 4.2. Kiểm tra Kiểu dữ liệu TypeScript Backend

- **Lệnh thực thi**: `npm --prefix backend run typecheck`
- **Kết quả thực tế**:

```text
> bakery-api@1.0.0 typecheck
> tsc --noEmit
(Exit code: 0 - 0 errors)
```

---

## 5. Đánh giá Tiêu chí Nghiệm thu (Acceptance Criteria Checklist)

- [x] Chạy migration thành công trên PostgreSQL Docker không phát sinh lỗi.
- [x] Toàn bộ 10 bảng và 7 enum được tạo lập chuẩn xác với khóa ngoại và ràng buộc index.
- [x] Prisma Client được sinh mã TypeScript tự động và vượt qua kiểm tra `tsc --noEmit`.

---

## 6. Rủi ro & Bàn giao cho Bước Tiếp theo (Next Steps & Handover)

- **Bước tiếp theo (Bước 2)**: Viết script `backend/prisma/seed.ts` để nạp tài khoản Chủ tiệm (`admin123@gmail.com`), Khách hàng mẫu, danh mục bánh, sản phẩm và coupon vào cơ sở dữ liệu.
