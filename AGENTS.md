# Bakery Shop — Agent Workspace Guidelines & Rules

Tài liệu này định nghĩa các quy tắc bắt buộc áp dụng cho mọi AI Agent và Developer làm việc trong dự án Bakery Shop.

---

## 1. Nguyên tắc Báo cáo Hoàn thành Task (BẮT BUỘC)

> [!IMPORTANT]
> **Quy tắc Báo cáo Nghiệm thu (Task Completion Report)**:
> Mỗi khi hoàn thành bất kỳ task nào (dù lớn hay nhỏ theo `docs/IMPLEMENTATION_PLAN.md` hoặc theo yêu cầu trực tiếp của người dùng), Agent **BẮT BUỘC** phải tạo một file báo cáo nghiệm thu Markdown đặt trong thư mục `docs/reports/`.
>
> Tuyệt đối không chỉ thông báo miệng bằng văn bản chat mà không lưu vết báo cáo vào dự án.

### 1.1. Vị trí & Quy ước đặt tên file báo cáo

- Thư mục lưu trữ: `docs/reports/milestone-<XX>/`
- Quy ước đặt tên: `task-<X>.<Y>-<ten-task-slug>.md`
  - Ví dụ: `docs/reports/milestone-02/task-2.1-prisma-schema.md`
  - Ví dụ: `docs/reports/milestone-02/task-2.2-database-migration-and-seeding.md`
  - Với báo cáo tổng kết cả Milestone: `docs/reports/milestone-<XX>/summary-milestone-<XX>.md`

### 1.2. Nội dung bắt buộc trong mỗi file báo cáo

Mỗi file báo cáo phải tuân thủ đúng cấu trúc chuẩn tại [TEMPLATE.md](file:///c:/Users/tuanp/Workspace/Project/Web/bakery-shop/docs/reports/TEMPLATE.md) gồm:

1. **Thông tin chung (Metadata)**: Task ID, Tên task, Milestone, Thời gian hoàn thành, Trạng thái.
2. **Mục tiêu của Task (Goal & Scope)**: Nêu rõ yêu cầu cần giải quyết.
3. **Danh sách file bị tác động (Impacted Files)**: File tạo mới, file cập nhật, file xóa (nếu có).
4. **Chi tiết triển khai kỹ thuật (Technical Implementation)**: Giải thích ngắn gọn cách thiết kế, module, logic đã viết.
5. **Lệnh kiểm tra thực tế & Kết quả nghiệm thu (Verification & Real Execution)**:
   - Liệt kê lệnh đã chạy (ví dụ `npm run typecheck`, `npm run test`, `npx prisma validate`, ...).
   - Trích xuất log thật chứng minh thành công (pass/exit code 0).
   - **Tuyệt đối không bịa đặt hoặc khẳng định test đã pass nếu chưa chạy thật.**
6. **Rủi ro & Bàn giao bước tiếp theo (Handover & Next Steps)**: Chỉ rõ bước kế tiếp cần làm.

---

## 2. Quy tắc Kiến trúc & Công nghệ

- **Monorepo thuần npm**: Không dùng Turborepo, lerna, yarn hay pnpm. Điều phối ứng dụng con bằng flag `--prefix frontend` và `--prefix backend`.
- **Phân tách độc lập (Decoupled)**: `frontend/` và `backend/` độc lập hoàn toàn về `package.json`, `tsconfig.json` và dependencies.
- **Tiền tệ & Tính toán**: Toàn bộ số tiền (giá bánh, giảm giá, phí ship, tổng tiền) phải dùng kiểu `Decimal(12, 2)` trong Database và NestJS. Không dùng floating point.
- **Bảo mật**:
  - Không tin tưởng giá trị tính toán hay trạng thái gửi từ client.
  - Luôn mã hóa mật khẩu bằng `bcrypt` (tối thiểu salt 10-12 rounds).
  - Không lưu thông tin thẻ ngân hàng. Sử dụng PayOS Sandbox với chữ ký checksum an toàn.

---

## 3. Quy trình Thực thi (Workflow)

1. Kiểm tra hiện trạng trước khi sửa file.
2. Nêu rõ kế hoạch trước khi thực hiện các thay đổi lớn.
3. Chạy lệnh kiểm tra thực tế (typecheck, lint, test, build).
4. Tạo file báo cáo task tại `docs/reports/milestone-<XX>/task-<X>.<Y>-<name>.md`.
5. Báo cáo kết quả và dẫn link file báo cáo cho người dùng.

---

## 4. Quy tắc Ngôn ngữ & Viết Code (Language & Code Style Rules)

- **Comments & Logging**: Toàn bộ chú thích (comments), docstrings và console log / logger trong code (TypeScript, JavaScript, SQL...) **BẮT BUỘC sử dụng 100% tiếng Anh**.
- **Không dùng Icon / Emoji trong Code**: Tuyệt đối **không sử dụng bất kỳ icon hoặc emoji nào** (ví dụ: 🌱, ✅, ❌, 🎉, 🚀...) trong source code, comments, log messages hay console output. Log phải thuần text chuyên nghiệp.
- **Tiếng Việt chỉ dùng trong Markdown**: Tiếng Việt CHỈ ĐƯỢC PHÉP sử dụng trong các tài liệu Markdown (`docs/`, `*.md`, file báo cáo) và khi trao đổi trực tiếp với người dùng.
