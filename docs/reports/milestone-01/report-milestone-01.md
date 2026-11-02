# Báo cáo Nghiệm thu Milestone 01: Thiết lập Nền tảng Monorepo Độc lập (Pure npm)

> **Milestone**: Milestone 01 — Thiết lập Dự án Phân tách Độc lập  
> **Thời gian hoàn thành**: 2026-10-29 01:05:00 (GMT+7)  
> **Trạng thái**: ✅ HOÀN THÀNH  
> **Người thực hiện**: AI Coding Assistant / Tech Lead  
> **Commit tham chiếu**: `71f88cb` (*feat(scaffold): initialize monorepo with nextjs frontend, nestjs backend, and docker postgres*)

---

## 1. Mục tiêu của Milestone (Goal & Scope)

- Khởi tạo kiến trúc monorepo phân tách hoàn toàn giữa `frontend/` và `backend/`, không dùng thư mục dùng chung (`shared/`).
- Sử dụng thuần npm (`--prefix`) để điều phối, không dùng Turborepo theo yêu cầu của khách hàng.
- Khởi tạo ứng dụng backend NestJS 10+ với TypeScript, Swagger, Global Filters, Prisma Module, endpoint `/api/v1/health`.
- Khởi tạo ứng dụng frontend Next.js 15+ App Router với Tailwind CSS và TypeScript strict.
- Cấu hình PostgreSQL 16 qua Docker Compose phục vụ phát triển local.

---

## 2. Các File Đã Tạo & Cấu hình (Impacted Files)

| Thư mục | File | Vai trò |
| :--- | :--- | :--- |
| `Root` | `package.json`, `package-lock.json` | Khởi tạo npm scripts điều phối monorepo (`dev`, `build`, `lint`, `typecheck`, `test`, `docker:db:*`) |
| `Root` | `docker-compose.yml`, `.env`, `.env.example` | Cấu hình container PostgreSQL 16 Alpine (`bakery-shop-postgres`) cổng 5432 |
| `Root` | `.gitignore`, `README.md`, `LICENSE` | Quy tắc loại trừ file rác, tài liệu hướng dẫn chạy dự án, MIT License |
| `backend/` | `package.json`, `tsconfig.json`, `nest-cli.json` | Cấu hình độc lập cho ứng dụng backend NestJS |
| `backend/src/` | `main.ts`, `app.module.ts` | Entry point API, cấu hình prefix `/api/v1`, CORS, Swagger `/api/docs` |
| `backend/src/` | `common/filters/http-exception.filter.ts` | Global Exception Filter chuẩn hóa cấu trúc lỗi JSON |
| `backend/src/` | `database/prisma.service.ts`, `prisma.module.ts` | Global Prisma Service quản lý vòng đời kết nối DB |
| `backend/src/` | `modules/health/*` | Healthcheck endpoint (`GET /api/v1/health`) kiểm tra API và kết nối Database |
| `frontend/` | `package.json`, `tsconfig.json`, `next.config.ts` | Cấu hình độc lập cho ứng dụng Next.js 15 App Router |
| `frontend/src/` | `app/layout.tsx`, `app/page.tsx`, `app/globals.css` | Giao diện chào đón Bakery Web với Tailwind CSS |
| `docs/` | `ARCHITECTURE.md`, `PRODUCT.md`, `IMPLEMENTATION_PLAN.md` | Bộ tài liệu kiến trúc, nghiệp vụ và lộ trình triển khai |

---

## 3. Chi tiết Triển khai Kỹ thuật (Technical Implementation)

1. **Kiến trúc Decoupled**:
   - `frontend` và `backend` sở hữu toàn bộ dependencies, scripts và cấu hình tsconfig riêng biệt, có thể build và deploy độc lập.
2. **Global Exception Handling**:
   - Bắt mọi lỗi HTTP và ngoại lệ chưa kiểm soát, định dạng phản hồi chuẩn:

     ```json
     {
       "statusCode": 400,
       "timestamp": "2026-10-29T...",
       "path": "/api/v1/...",
       "message": "Chi tiết lỗi",
       "error": "Bad Request"
     }
     ```

3. **Healthcheck Endpoint**:
   - Endpoint `/api/v1/health` kiểm tra đồng thời trạng thái service API (uptime) và ping truy vấn `SELECT 1` tới PostgreSQL qua Prisma.

---

## 4. Lệnh Kiểm tra & Kết quả Thực tế (Verification & Real Results)

### 4.1. Kiểm tra Typecheck Backend

- **Lệnh**: `npm --prefix backend run typecheck`
- **Kết quả**:

```text
> bakery-api@1.0.0 typecheck
> tsc --noEmit
(Exit code: 0 - 0 errors)
```

### 4.2. Kiểm tra Unit Test Backend

- **Lệnh**: `npm --prefix backend run test`
- **Kết quả**:

```text
PASS src/modules/health/health.controller.spec.ts
  HealthController
    √ should be defined (11 ms)
    √ should return 200 when system is healthy (3 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        21.001 s
```

### 4.3. Kiểm tra Typecheck Frontend

- **Lệnh**: `npm --prefix frontend run typecheck`
- **Kết quả**:

```text
> bakery-web@1.0.0 typecheck
> tsc --noEmit
(Exit code: 0 - 0 errors)
```

### 4.4. Kiểm tra Docker Compose PostgreSQL

- **Lệnh**: `docker ps`
- **Kết quả**:

```text
CONTAINER ID   IMAGE                COMMAND                  STATUS                    PORTS
0ea6989de7f4   postgres:16-alpine   "docker-entrypoint.s…"   Up (healthy)              0.0.0.0:5432->5432/tcp   bakery-shop-postgres
```

---

## 5. Đánh giá Tiêu chí Nghiệm thu

- [x] Backend NestJS khởi chạy và build thành công với TypeScript strict.
- [x] Frontend Next.js khởi chạy và build thành công với App Router & Tailwind CSS.
- [x] Container PostgreSQL khởi động và healthy qua Docker Compose.
- [x] Swagger docs sẵn sàng tại `/api/docs`.
- [x] Endpoint `/api/v1/health` hoạt động ổn định.

---

## 6. Bàn giao cho Milestone Tiếp theo

- **Milestone tiếp theo**: Milestone 02 — Cơ sở dữ liệu, Prisma Schema, Migration và Seeding tài khoản mẫu.
- **Trạng thái**: Sẵn sàng triển khai Task 2.1 và Task 2.2.
