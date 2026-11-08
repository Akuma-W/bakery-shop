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

## 3. Quy trình Thực thi & Phê duyệt Bắt buộc (Mandatory Review & Commit Workflow)

> [!IMPORTANT]
> **Tuyệt đối không tự ý commit code trước khi người dùng review và phê duyệt.**

Mọi task code bắt buộc phải tuân thủ nghiêm ngặt chu trình 3 bước sau:

1. **Bước 1: Trình Kế hoạch & Chờ Duyệt (Pre-Implementation Review)**:
   - Trước khi sửa hoặc viết bất kỳ dòng code nào, Agent phải trình bày:
     - Những gì sẽ làm / sửa đổi.
     - Kỹ thuật / giải pháp kiến trúc sẽ áp dụng.
     - Danh sách file tương ứng sẽ tác động.
   - **Bắt buộc chờ người dùng duyệt kế hoạch** mới được bắt đầu viết code.

2. **Bước 2: Viết Code & Yêu cầu Người dùng Kiểm tra (Post-Implementation Review)**:
   - Sau khi được duyệt, tiến hành viết code theo đúng kế hoạch.
   - Chạy lệnh định dạng mã nguồn `npm run format` ở cuối tiến trình code.
   - Chạy các lệnh kiểm tra thực tế (typecheck, lint, test, build).
   - Lập báo cáo nghiệm thu task tại `docs/reports/milestone-<XX>/task-<X>.<Y>-<name>.md`.
   - Báo cáo kết quả và **yêu cầu người dùng kiểm tra, review code**.
   - **TUYỆT ĐỐI KHÔNG commit code tại bước này.**

3. **Bước 3: Commit sau khi Người dùng Đồng ý (Commit & Handover)**:
   - CHỈ KHI người dùng phản hồi đồng ý/phê duyệt code, Agent mới được phép chạy lệnh commit code lên Git.
   - Sau khi commit thành công, mới tiến hành bước tiếp theo.

---

## 4. Quy tắc Ngôn ngữ & Viết Code (Language & Code Style Rules)

- **Comments & Logging**: Toàn bộ chú thích (comments), docstrings và console log / logger trong code (TypeScript, JavaScript, SQL...) **BẮT BUỘC sử dụng 100% tiếng Anh**.
- **Không dùng Icon / Emoji trong Code**: Tuyệt đối **không sử dụng bất kỳ icon hoặc emoji nào** (ví dụ: 🌱, ✅, ❌, 🎉, 🚀...) trong source code, comments, log messages hay console output. Log phải thuần text chuyên nghiệp.
- **Tiếng Việt chỉ dùng trong Markdown**: Tiếng Việt CHỈ ĐƯỢC PHÉP sử dụng trong các tài liệu Markdown (`docs/`, `*.md`, file báo cáo) và khi trao đổi trực tiếp với người dùng.
- **Comment cho mọi hàm**: Mỗi hàm/method được tạo ra **bắt buộc phải có comment ngắn gọn (bằng tiếng Anh)** đặt ngay phía trên để giải thích mục đích của hàm (chuẩn JSDoc / TSDoc).
- **Import Alias `@/*`**: Luôn sử dụng path alias `@/*` (ví dụ `@/common/...`, `@/database/...`, `@/modules/...`) thay vì các đường dẫn tương đối như `../../`.
- **Tách biệt Type/Interface**: Không định nghĩa trực tiếp các interface/type phức tạp bên trong service/controller. Bắt buộc tách thành thư mục riêng `interfaces/` bên trong mỗi module (ví dụ: `src/modules/<module-name>/interfaces/`).
- **Definite Assignment trong DTO**: Khi khai báo thuộc tính trong DTO class, luôn dùng dấu `!` (ví dụ: `email!: string;`, `password!: string;`) để tương thích với TypeScript strict mode.
- **Định dạng mã nguồn**: Luôn chạy lệnh `npm run format` (ở backend hoặc frontend tương ứng) ở cuối tiến trình code trước khi chạy kiểm tra và nghiệm thu.
- **Định dạng kết thúc file**: Mỗi file mã nguồn hoặc tài liệu chỉ kết thúc bằng đúng 1 dòng trống (1 ký tự newline), tuyệt đối không để 2 dòng trống liên tiếp ở cuối file.
