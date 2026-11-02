---
name: task-reporting
description: >-
  Tự động tạo hoặc cập nhật file báo cáo chuẩn hóa cho từng task hoặc milestone sau khi hoàn thành công việc trong dự án Bakery Shop. Kích hoạt kỹ năng này mỗi khi kết thúc một task nghiệp vụ hoặc khi người dùng yêu cầu báo cáo tiến độ.
---

# Kỹ năng Báo cáo Tiến độ Task (Task Reporting Skill)

Kỹ năng này hướng dẫn Agent tạo file báo cáo nghiệm thu kỹ thuật chuẩn mực cho từng task trong dự án Bakery Shop, lưu trữ tại thư mục `docs/reports/`.

---

## 1. Khi nào kích hoạt kỹ năng này?
- Ngay sau khi hoàn thành code và chạy xong các lệnh kiểm thử (test/typecheck/build/migration) cho một task cụ thể thuộc lộ trình trong `docs/IMPLEMENTATION_PLAN.md`.
- Khi người dùng yêu cầu kiểm tra, rà soát tiến độ hoặc xuất báo cáo task vừa làm xong.

---

## 2. Quy trình Thực hiện (5 Bước Chuẩn hóa)

### Bước 1: Xác định Mã Task & Milestone
1. Tra cứu `docs/IMPLEMENTATION_PLAN.md` để lấy thông tin:
   - Mã Task: Ví dụ `Task 2.1`, `Task 2.2`, `Task 3.1`...
   - Tên Milestone: Ví dụ `Milestone 02: Database & Prisma Schema`
   - Tiêu chí nghiệm thu (Acceptance Criteria) của task đó.

### Bước 2: Thu thập Danh sách File Tác động
1. Chạy lệnh kiểm tra `git status` hoặc `git diff --name-status` để liệt kê chính xác các file tạo mới, sửa đổi hoặc xóa bỏ.
2. Tóm tắt vai trò của từng file bị thay đổi.

### Bước 3: Chạy Kiểm tra Thực tế & Ghi nhận Log
1. Chạy các lệnh kiểm tra tương ứng với phạm vi task:
   - Backend: `npm --prefix backend run typecheck`, `npm --prefix backend run test`
   - Frontend: `npm --prefix frontend run typecheck`, `npm --prefix frontend run build`
   - Database: `npm --prefix backend run prisma:generate`, migration, seed...
2. Ghi nhận output thực tế (exit code 0, số bài test pass, thời gian chạy).

### Bước 4: Viết File Báo cáo
1. Tạo file mới theo đường dẫn: `docs/reports/milestone-<XX>/task-<X>.<Y>-<slug-ten-task>.md`
   *(Nếu là báo cáo tổng kết milestone thì đặt tên: `docs/reports/milestone-<XX>/summary-milestone-<XX>.md`)*
2. Điền đầy đủ các mục theo mẫu chuẩn tại [docs/reports/TEMPLATE.md](../../../docs/reports/TEMPLATE.md).

### Bước 5: Bàn giao & Thông báo tới Người dùng
1. Dẫn link markdown file báo cáo vừa tạo (ví dụ `[Báo cáo Task 2.1](file:///docs/reports/milestone-02/task-2.1-prisma-schema.md)`).
2. Tóm tắt 1 câu về kết quả và nêu rõ bước kế tiếp cần xin ý kiến hoặc triển khai.
