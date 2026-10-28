# 🥖 Bakery Web — E-commerce Platform

Nền tảng thương mại điện tử chuyên biệt cho một cửa hàng bánh ngọt, bánh mì thủ công (artisan bread), đồ uống và phụ kiện tiệc/sinh nhật.

Hệ thống được thiết kế theo mô hình phân tách độc lập 2 thư mục **`frontend`** và **`backend`**, quản lý bằng **thuần npm**, hỗ trợ thanh toán **PayOS VietQR Sandbox** và **Hệ thống Thông báo chuông báo động đơn mới**.

---

## 🏗️ Cấu trúc Thư mục

```text
bakery-shop/
├── backend/                  # Ứng dụng NestJS REST API + Prisma + PostgreSQL (Độc lập)
│   ├── prisma/               # Prisma Schema & Database Migrations
│   ├── src/
│   │   ├── common/           # HttpExceptionFilter, Guards, Decorators
│   │   ├── database/         # PrismaService, PrismaModule
│   │   └── modules/
│   │       └── health/       # Health check API & DB connectivity
│   └── package.json
│
├── frontend/                 # Ứng dụng Next.js 15 App Router + TailwindCSS (Độc lập)
│   ├── src/
│   │   ├── app/              # Layouts, Pages, Global Styles
│   │   ├── components/       # UI Components
│   │   └── types/            # TypeScript interfaces
│   └── package.json
│
├── docs/                     # Tài liệu thiết kế & quy tắc kỹ thuật
│   ├── AI_WORKFLOW.md        # Nguyên tắc kỹ thuật & quy trình AI
│   ├── PRODUCT.md            # Đặc tả sản phẩm & chân dung người dùng
│   ├── ARCHITECTURE.md       # Thiết kế kiến trúc kỹ thuật chi tiết
│   └── IMPLEMENTATION_PLAN.md# Kế hoạch triển khai chia nhỏ 12 Milestones
│
├── docker-compose.yml        # Dịch vụ PostgreSQL 16 Alpine cục bộ
├── .env.example              # Biến môi trường mẫu cho Docker & Database
├── package.json              # Root npm scripts tiện ích
└── README.md
```

---

## ⚡ Yêu cầu Môi trường (Prerequisites)

- **Node.js**: `v20.x` hoặc `v22.x` trở lên (Khuyến nghị LTS)
- **npm**: `v10.x` trở lên
- **Docker & Docker Compose**: Để chạy cơ sở dữ liệu PostgreSQL cục bộ

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy Nhanh

### Bước 1: Sao chép file cấu hình môi trường

```bash
# Tạo file môi trường cho root (database)
cp .env.example .env

# Tạo file môi trường cho backend
cp backend/.env.example backend/.env

# Tạo file môi trường cho frontend
cp frontend/.env.example frontend/.env
```

### Bước 2: Khởi động Cơ sở Dữ liệu PostgreSQL

Khởi chạy container PostgreSQL 16 qua Docker Compose:

```bash
npm run docker:db:up
```

*Lưu ý: Để dừng container khi không dùng nữa:*

```bash
npm run docker:db:down
```

### Bước 3: Cài đặt Dependencies

Cài đặt các gói phụ thuộc độc lập cho từng thư mục:

```bash
# Cài đặt công cụ tiện ích ở root (concurrently)
npm install

# Cài đặt dependencies cho backend
cd backend && npm install && cd ..

# Cài đặt dependencies cho frontend
cd frontend && npm install && cd ..
```

### Bước 4: Tạo Prisma Client

```bash
npm --prefix backend run prisma:generate
```

### Bước 5: Khởi động Ứng dụng ở Chế độ Phát triển (Dev Mode)

Bạn có thể chạy đồng thời cả hai ứng dụng chỉ với một lệnh tại thư mục gốc:

```bash
npm run dev
```

Hoặc chạy riêng biệt từng ứng dụng trên từng terminal:

```bash
# Chạy riêng Backend API (cổng 3001)
npm run dev:backend

# Chạy riêng Frontend Web (cổng 3000)
npm run dev:frontend
```

---

## 🌐 Danh sách Đường dẫn Kiểm tra (Access URLs)

| Ứng dụng / Dịch vụ | URL | Mô tả |
| :--- | :--- | :--- |
| **Frontend Web** | [http://localhost:3000](http://localhost:3000) | Giao diện cửa hàng bánh Next.js |
| **Backend REST API** | [http://localhost:3001/api/v1](http://localhost:3001/api/v1) | Endpoint gốc của API |
| **Swagger API Docs** | [http://localhost:3001/api/docs](http://localhost:3001/api/docs) | Tài liệu trực quan OpenAPI / Swagger |
| **Health Check Endpoint** | [http://localhost:3001/api/v1/health](http://localhost:3001/api/v1/health) | Kiểm tra trạng thái API & kết nối Database |
| **PostgreSQL Database** | `localhost:5432` | User: `postgres`, Password: `postgres`, DB: `bakery_db` |

---

## 🛠️ Danh sách Lệnh Root npm Scripts

| Lệnh | Ý nghĩa |
| :--- | :--- |
| `npm run dev` | Chạy song song cả Backend (port 3001) và Frontend (port 3000) qua `concurrently` |
| `npm run dev:backend` | Chạy dev server cho Backend NestJS |
| `npm run dev:frontend` | Chạy dev server cho Frontend Next.js |
| `npm run build` | Build production cho cả Backend và Frontend |
| `npm run build:backend` | Build ứng dụng Backend NestJS |
| `npm run build:frontend` | Build ứng dụng Frontend Next.js |
| `npm run lint` | Kiểm tra cú pháp và định dạng mã nguồn (ESLint + Prettier) |
| `npm run typecheck` | Kiểm tra tính nhất quán kiểu dữ liệu TypeScript (`tsc --noEmit`) |
| `npm run test` | Chạy unit tests cho Backend và Frontend |
| `npm run docker:db:up` | Bật container PostgreSQL 16 trong nền |
| `npm run docker:db:down` | Dừng và tắt container PostgreSQL |

---

## 🔒 Quy chuẩn Kỹ thuật

- **Mã lỗi chuẩn hóa**: Mọi response lỗi đều theo chuẩn:

  ```json
  {
    "success": false,
    "statusCode": 400,
    "errorCode": "ERROR_CODE",
    "message": "Chi tiết lỗi",
    "errors": null,
    "timestamp": "2026-10-29T00:00:00.000Z",
    "path": "/api/v1/health"
  }
  ```

- **Validation**: Tự động lọc và chuyển đổi dữ liệu thông qua NestJS `ValidationPipe`.
- **CORS**: Đã cấu hình cho phép Frontend (`http://localhost:3000`) gọi API và gửi cookies an toàn.
