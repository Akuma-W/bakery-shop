# Báo cáo Tổng kết Nghiệm thu Milestone 04: Danh mục & Quản lý Sản phẩm Bánh (Backend API)

> **Milestone**: Milestone 04 — Danh mục & Quản lý Sản phẩm Bánh (Backend API)  
> **Thời gian hoàn thành**: 2026-11-09 00:52:00 (GMT+7)  
> **Trạng thái**: HOÀN THÀNH 100%  
> **Người thực hiện**: AI Coding Assistant / Tech Lead  

---

## 1. Tổng kết Phạm vi Hoàn thành

Milestone 04 đã xây dựng trọn vẹn toàn bộ các tính năng cốt lõi cho việc quản lý danh mục, sản phẩm bánh và upload hình ảnh phục vụ hệ thống Bakery Shop:

1. **Task 4.1: API Danh mục Bánh (Categories Module)**:
   - Xây dựng tiện ích chuẩn hóa `slugify.util.ts` hỗ trợ chuyển đổi tiếng Việt có dấu sang URL slug chuẩn SEO.
   - Triển khai `CategoriesModule`, `CategoriesService`, `CategoriesController` với đầy đủ CRUD danh mục.
   - Phân quyền RBAC chặt chẽ: Khách hàng chỉ xem danh mục hoạt động (`GET /categories`), trong khi Chủ tiệm (`Role.OWNER`) có toàn quyền tạo, sửa, xóa và sắp xếp thứ tự hiển thị.
   - Ràng buộc an toàn: Chặn xóa danh mục nếu đang chứa sản phẩm bánh liên kết.
   - Khắc phục triệt để lỗi runtime `cookie-parser` bằng việc cấu hình `"esModuleInterop": true` trong `backend/tsconfig.json`.

2. **Task 4.2: API Sản phẩm Bánh (Products Module: CRUD, Lọc, Tìm kiếm & Toggle Tồn kho Nhanh)**:
   - Xây dựng hệ thống quản lý sản phẩm hoàn chỉnh với tìm kiếm từ khóa không phân biệt hoa/thường, bộ lọc đa tiêu chí (danh mục, khoảng giá, còn hàng, nổi bật) và phân trang.
   - Tuyệt đối tuân thủ quy tắc xử lý tiền tệ: sử dụng `Prisma.Decimal` từ DTO đến Database PostgreSQL, không dùng số thực nổi (floating point).
   - API xem chi tiết bánh theo slug (`GET /api/v1/products/:slug`) hiển thị đầy đủ thông tin dị ứng (`allergens`) và thời gian chuẩn bị (`prepTimeMinutes`).
   - Cung cấp 2 API vận hành nhanh tại quầy cho Chủ tiệm: `PATCH /products/:id/stock` (cập nhật nhanh số lượng kho) và `PATCH /products/:id/toggle` (bật/tắt mở bán nhanh khi hết bánh trong ngày).
   - Cơ chế bảo vệ toàn vẹn: Chặn xóa sản phẩm nếu đã có trong lịch sử đơn hàng (`OrderItem`).

3. **Task 4.3: Service Tải ảnh Bánh (Uploads Module - Tích hợp Cloudinary CDN)**:
   - Kết nối trực tiếp với dịch vụ Cloudinary CDN qua Native Stream Upload (`Readable.from(file.buffer)`), loại bỏ hoàn toàn việc lưu trữ file tạm trên đĩa máy chủ.
   - Tự động tổ chức ảnh bánh vào thư mục riêng `bakery-shop/products` trên Cloudinary, không gây xung đột với các upload preset hay dự án khác trên cùng tài khoản.
   - Kiểm soát dung lượng file nghiêm ngặt: giới hạn tối đa 5MB.
   - Kiểm tra kép MIME type (`image/jpeg`, `image/png`, `image/webp`) và phần mở rộng file (`.jpg`, `.jpeg`, `.png`, `.webp`) ngăn chặn mã độc.
   - Phân quyền thao tác an toàn: Chỉ Chủ tiệm (`Role.OWNER`) mới có thể tải ảnh lên (`POST /api/v1/uploads/image`) hoặc xóa ảnh trên Cloudinary (`DELETE /api/v1/uploads/:publicId`).
   - Chuẩn hóa biến môi trường Cloudinary trong `backend/.env.example`.

---

## 2. Danh sách Báo cáo Chi tiết Thành phần

- [Task 4.1 — API Danh mục Bánh (Categories Module)](file:///c:/Users/tuanp/Workspace/Project/Web/bakery-shop/docs/reports/milestone-04/task-4.1-categories-module.md)
- [Task 4.2 — API Sản phẩm: CRUD, Lọc, Tìm kiếm & Toggle Tồn kho Nhanh](file:///c:/Users/tuanp/Workspace/Project/Web/bakery-shop/docs/reports/milestone-04/task-4.2-products-module.md)
- [Task 4.3 — Service Tải ảnh Bánh (Uploads Module - Tích hợp Cloudinary)](file:///c:/Users/tuanp/Workspace/Project/Web/bakery-shop/docs/reports/milestone-04/task-4.3-uploads-module.md)

---

## 3. Tổng hợp Kết quả Kiểm tra Thực tế (Verification Summary)

| Hạng mục kiểm tra | Lệnh thực thi | Kết quả thực tế | Trạng thái |
| :--- | :--- | :--- | :--- |
| **TypeScript Typecheck** | `npm run typecheck --prefix backend` | `tsc --noEmit` hoàn tất không có lỗi (exit code 0) | Đạt |
| **Unit Test Suites** | `npm test --prefix backend` | **10/10 suites passed, 91/91 tests passed** (Jest) | Đạt |
| **Build Production** | `npm run build --prefix backend` | `nest build` thành công xuất sắc (exit code 0) | Đạt |
| **Quy chuẩn Code & File EOF** | Kiểm tra tự động | 100% tiếng Anh cho comment/log, 0 icon/emoji, đúng 1 dòng trống cuối file | Đạt |

---

## 4. Kế hoạch Bàn giao cho Milestone Tiếp theo

- **Milestone kế tiếp**: **Milestone 05 — Giao diện Cửa hàng (Storefront UI - Next.js App Router)**.
  - **Task 5.1**: Trang chủ (Homepage) Bakery Shop: Banner Hero, danh mục nổi bật, danh sách bánh bán chạy, badge còn hàng/hết hàng.
  - **Task 5.2**: Trang Danh mục & Danh sách Bánh (Catalog Page): Bộ lọc danh mục, khoảng giá, ô tìm kiếm từ khóa, phân trang và sắp xếp.
  - **Task 5.3**: Trang Chi tiết Bánh (Product Detail Page): Hình ảnh lớn Cloudinary, thông tin dị ứng (`allergens`), thời gian chuẩn bị (`prepTimeMinutes`), bộ chọn số lượng và nút thêm vào giỏ hàng.
