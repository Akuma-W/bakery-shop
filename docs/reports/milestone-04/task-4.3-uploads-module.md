# Báo cáo Hoàn thành Task: 4.3 — Service Tải ảnh Bánh (Uploads Module - Tích hợp Cloudinary)

> **Milestone**: Milestone 04: Danh mục & Quản lý Sản phẩm Bánh (Backend API)  
> **Thời gian hoàn thành**: 2026-11-09 00:51:00 (GMT+7)  
> **Trạng thái**: HOÀN THÀNH  
> **Người thực hiện**: AI Coding Assistant / Tech Lead  

---

## 1. Mục tiêu của Task (Goal & Scope)

- Xây dựng module `Uploads` phục vụ việc tải và quản lý hình ảnh sản phẩm bánh và danh mục trực tiếp lên dịch vụ Cloudinary CDN.
- Không lưu trữ file tạm ra ổ đĩa máy chủ (zero-disk overhead), tối ưu hóa hiệu năng bằng Native Stream Pipe (`Readable.from(file.buffer)`).
- Tự động gom nhóm toàn bộ ảnh của hệ thống vào thư mục riêng `bakery-shop/products` trên Cloudinary, không gây xung đột với các dự án/upload preset khác trong cùng tài khoản.
- Kiểm soát dung lượng file tải lên nghiêm ngặt: giới hạn tối đa 5MB (`5 * 1024 * 1024` bytes).
- Kiểm tra tính hợp lệ của định dạng ảnh: chỉ chấp nhận JPEG (`image/jpeg`), PNG (`image/png`), và WebP (`image/webp`) qua cả MIME type và phần mở rộng file (`.jpg`, `.jpeg`, `.png`, `.webp`).
- Phân quyền an toàn: chỉ Chủ tiệm (`Role.OWNER`) mới có quyền tải ảnh lên (`POST /api/v1/uploads/image`) hoặc xóa ảnh trên Cloudinary (`DELETE /api/v1/uploads/:publicId`).
- Chuẩn hóa cấu hình biến môi trường (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER`) trong `backend/.env.example`.

---

## 2. Các File Thay đổi / Tạo mới (Impacted Files)

| Loại thao tác | Đường dẫn File | Mục đích |
| :--- | :--- | :--- |
| `Cập nhật` | `backend/package.json` | Cài đặt thư viện chính thức `cloudinary` và `@types/multer` |
| `Cập nhật` | `backend/.env.example` | Cấu hình các biến môi trường Cloudinary (`CLOUD_NAME`, `API_KEY`, `API_SECRET`, `FOLDER`) |
| `Cập nhật` | `backend/tsconfig.json` | Khai báo `"multer"` vào `"types"` phục vụ Multer typing |
| `Tạo mới` | `backend/src/modules/uploads/interfaces/upload.interface.ts` | Interface `UploadedFileResponse` bổ sung `publicId` và `url` (Cloudinary `secure_url`) |
| `Tạo mới` | `backend/src/modules/uploads/interfaces/index.ts` | Barrel export cho thư mục interfaces |
| `Tạo mới` | `backend/src/modules/uploads/uploads.service.ts` | Service cấu hình Cloudinary SDK, stream binary buffer, kiểm tra 5MB/định dạng và xóa ảnh |
| `Tạo mới` | `backend/src/modules/uploads/uploads.service.spec.ts` | Bộ 8 unit tests kiểm thử mock Cloudinary uploader (thành công, lỗi mạng, vượt 5MB, thiếu keys, xóa ảnh) |
| `Tạo mới` | `backend/src/modules/uploads/uploads.controller.ts` | REST Controller với `POST /uploads/image` và `DELETE /uploads/:publicId` được bảo vệ bởi `@Roles(Role.OWNER)` |
| `Tạo mới` | `backend/src/modules/uploads/uploads.controller.spec.ts` | Bộ 3 unit tests cho `UploadsController` |
| `Tạo mới` | `backend/src/modules/uploads/uploads.module.ts` | NestJS Module kết nối controller & service |
| `Cập nhật` | `backend/src/app.module.ts` | Đăng ký `UploadsModule` vào `AppModule` |

---

## 3. Chi tiết Triển khai Kỹ thuật (Technical Implementation)

- **Native Stream Upload lên Cloudinary**:
  - Không ghi file ra đĩa cục bộ, sử dụng luồng dữ liệu `Readable.from(file.buffer)` pipe trực tiếp vào `cloudinary.v2.uploader.upload_stream`.
  - Cấu hình upload options: `{ folder: 'bakery-shop/products', resource_type: 'image' }`.
  - Trả về đối tượng `UploadedFileResponse` chứa đường dẫn CDN an toàn (`secure_url`), mã định danh `publicId`, tên file gốc, định dạng và kích thước.
- **Bảo mật & Giới hạn Chặt chẽ**:
  - **Giới hạn 5MB**: Chặn cả ở mức NestJS Interceptor (`FileInterceptor('file', { limits: { fileSize: 5MB } })`) lẫn kiểm tra logic trong Service (`file.size > this.maxFileSize`).
  - **Chặn Định dạng Độc hại**: Kiểm tra kép cả MIME type (`allowedMimeTypes`) và file extension (`allowedExtensions`), từ chối file độc hại giả danh ảnh.
  - **Kiểm tra Cấu hình Môi trường**: Ném `InternalServerErrorException` nếu thiếu bất kỳ khóa Cloudinary nào trong file `.env`.
  - **Kiểm soát Phân quyền (RBAC)**: Toàn bộ thao tác tải và xóa ảnh yêu cầu `@UseGuards(JwtAuthGuard, RolesGuard)` và metadata `@Roles(Role.OWNER)`. Khách hàng hoặc tài khoản thường không thể can thiệp.
- **Tuân thủ Quy chuẩn Dự án**:
  - Tách riêng thư mục `interfaces/` cho kiểu dữ liệu trả về `UploadedFileResponse`.
  - 100% comment, docstring JSDoc và log bằng tiếng Anh, không icon/emoji.
  - Sử dụng path alias `@/*` cho toàn bộ import nội bộ.
  - Mỗi file kết thúc bằng đúng 1 dòng trống (`\n`).

---

## 4. Lệnh Kiểm tra & Kết quả Thực tế (Verification & Real Results)

> [!NOTE]
> Toàn bộ kết quả dưới đây đều được chạy và trích xuất thực tế từ terminal dự án.

### 4.1. Lệnh kiểm tra kiểu dữ liệu (Typecheck)

- **Lệnh thực thi**: `npm run typecheck --prefix backend`
- **Kết quả**:

```text
> bakery-api@1.0.0 typecheck
> tsc --noEmit
(Hoàn tất không có bất kỳ lỗi TypeScript nào, exit code 0)
```

### 4.2. Lệnh kiểm tra đơn vị tự động (Unit Tests cho Uploads Module)

- **Lệnh thực thi**: `npm test --prefix backend -- uploads`
- **Kết quả**:

```text
> bakery-api@1.0.0 test
> jest uploads

PASS src/modules/uploads/uploads.service.spec.ts (11.824 s)
PASS src/modules/uploads/uploads.controller.spec.ts (13.878 s)

Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        15.478 s, estimated 27 s
Ran all test suites matching /uploads/i.
```

### 4.3. Lệnh kiểm tra toàn bộ Unit Test Suite Backend

- **Lệnh thực thi**: `npm test --prefix backend`
- **Kết quả**:

```text
> bakery-api@1.0.0 test
> jest

PASS src/modules/categories/categories.service.spec.ts (17.581 s)
PASS src/modules/health/health.controller.spec.ts (17.777 s)
PASS src/modules/users/users.service.spec.ts (17.834 s)
PASS src/modules/auth/auth.service.spec.ts (18.476 s)
PASS src/modules/categories/categories.controller.spec.ts (19.665 s)
PASS src/common/guards/roles.guard.spec.ts
PASS src/modules/products/products.controller.spec.ts (19.782 s)
PASS src/modules/uploads/uploads.service.spec.ts
PASS src/modules/uploads/uploads.controller.spec.ts (19.875 s)
PASS src/modules/products/products.service.spec.ts

Test Suites: 10 passed, 10 total
Tests:       91 passed, 91 total
Snapshots:   0 total
Time:        22.481 s, estimated 32 s
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

- [x] Tích hợp trực tiếp Cloudinary SDK, tải ảnh không qua lưu trữ đĩa cục bộ -> Đạt.
- [x] Tự động tổ chức ảnh vào thư mục riêng `bakery-shop/products` -> Đạt.
- [x] Giới hạn kích thước file upload tối đa 5MB -> Đạt.
- [x] Chỉ cho phép các định dạng ảnh hợp lệ (JPEG, PNG, WebP) -> Đạt.
- [x] Chỉ Chủ tiệm (`Role.OWNER`) mới có quyền tải hoặc xóa ảnh -> Đạt.
- [x] Cấu hình đầy đủ trong `backend/.env.example` -> Đạt.
- [x] Toàn bộ 91 unit tests trên 10 test suites pass 100% -> Đạt.
- [x] `tsc --noEmit` và `nest build` hoàn tất không lỗi -> Đạt.
- [x] Toàn bộ file mã nguồn và cấu hình kết thúc bằng đúng 1 dòng trống duy nhất -> Đạt.

---

## 6. Rủi ro & Bàn giao cho Task Kế tiếp (Next Steps & Handover)

- **Rủi ro hiện tại**: Không có. Module Uploads đã kết nối Cloudinary hoàn chỉnh, tốc độ tải ảnh CDN tối ưu cho ứng dụng Next.js.
- **Bước tiếp theo**: Cập nhật báo cáo tổng kết Milestone 04 (`summary-milestone-04.md`), xin phê duyệt nghiệm thu từ người dùng trước khi commit code lên Git.
