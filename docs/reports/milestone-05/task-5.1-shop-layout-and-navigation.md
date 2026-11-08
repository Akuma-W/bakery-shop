# Báo cáo Hoàn thành Task: 5.1 — Xây dựng Layout Tiệm Bánh & Responsive Navigation (Windie Cake)

> **Milestone**: Milestone 05: Giao diện Cửa hàng (Storefront UI - Next.js)  
> **Thời gian hoàn thành**: 2026-11-09 02:04:00 (GMT+7)  
> **Trạng thái**: HOÀN THÀNH  
> **Người thực hiện**: AI Coding Assistant / Tech Lead  

---

## 1. Mục tiêu của Task (Goal & Scope)

- Xây dựng bộ khung giao diện tổng thể (Storefront Layout) cho khách hàng của tiệm bánh **Windie Cake** với phong cách ấm cúng, sang trọng (Warm Artisan Bakery Palette: kem bơ, nâu nướng, caramel).
- Thiết kế chuẩn **Mobile-First & Fully Responsive** (tối ưu từ điện thoại di động 375px đến màn hình máy tính 1440px).
- Thiết kế biểu tượng thương hiệu **Logo Windie Cake** dưới dạng Inline Vector SVG sắc nét 100%, khắc họa chữ **W** cách điệu nghệ thuật kết hợp bông lúa mì vàng óng.
- Triển khai **Header điều hướng thông minh**:
  - Thanh thông báo ưu đãi (Free shipping từ 200.000₫, hotline `1900 6868`, giờ mở cửa).
  - Nút chuyển đổi đa ngôn ngữ tức thì (🇻🇳 Tiếng Việt / 🇬🇧 English) không cần reload trang.
  - Thanh tìm kiếm nhanh hỗ trợ điều hướng trang danh mục sản phẩm.
  - Cụm nút thao tác: Tài khoản khách hàng và Nút Giỏ hàng với Badge số lượng động.
  - Mobile Sheet Menu trượt cạnh bên cho điện thoại.
- Triển khai **Mini-cart Drawer (Giỏ hàng trượt ngang)** dựa trên Shadcn Sheet:
  - Trượt mượt mà từ cạnh phải màn hình khi bấm nút Giỏ hàng hoặc khi bấm thêm bánh.
  - Hiển thị danh sách bánh, ảnh đại diện, bộ tăng/giảm số lượng (+/-), nút xóa món.
  - Thanh tiến trình trực quan tính khoảng cách đạt điều kiện Miễn phí giao hàng (`FREE_SHIPPING_THRESHOLD = 200.000₫`).
  - Nút chuyển nhanh tới trang thanh toán (`/checkout`) và xem giỏ hàng (`/cart`).
- Triển khai **Footer chân trang chuyên nghiệp**:
  - Thông tin tiệm bánh Windie Cake, địa chỉ, hotline, giờ mở cửa.
  - Menu liên kết danh mục bánh, chính sách giao hàng, đổi trả và bảo mật.
  - Form đăng ký nhận tin khuyến mãi qua email và các biểu tượng thanh toán (VietQR, PayOS, COD).
- Xây dựng **Tầng Service và Fallback Mock thông minh**:
  - Tách biệt 100% việc gọi API khỏi các file TSX qua `src/services/`.
  - Chỉ fallback sang Mock Data khi API backend báo lỗi mạng/server. Nếu backend trả về kết quả thành công (kể cả mảng rỗng), UI vẫn hiển thị đúng dữ liệu backend.
- Quản lý trạng thái giỏ hàng toàn cục bằng **Zustand** kết hợp middleware `persist` lưu `localStorage`.
- Khắc phục triệt để lỗi TypeScript side-effect CSS import (`declarations.d.ts`) và cảnh báo CSS unknownAtRules trong IDE (`.vscode/settings.json`).

---

## 2. Các File Thay đổi / Tạo mới (Impacted Files)

| Loại thao tác | Đường dẫn File | Mục đích |
| :--- | :--- | :--- |
| `Cập nhật` | `AGENTS.md` | Bổ sung quy tắc ưu tiên thiết kế UI bằng Shadcn/ui thay vì hardcode |
| `Tạo mới` | `.vscode/settings.json` | Cấu hình IDE bỏ qua cảnh báo `@tailwind unknownAtRules` |
| `Cập nhật` | `frontend/package.json` | Cài đặt `zustand`, `class-variance-authority`, `tailwindcss-animate`, `@base-ui/react`, bổ sung script `"format"` |
| `Tạo mới` | `frontend/components.json` | Cấu hình Shadcn/ui cho dự án Frontend |
| `Tạo mới` | `frontend/src/types/declarations.d.ts` | Khai báo ambient module `declare module '*.css'` dập tắt lỗi side-effect CSS import |
| `Tạo mới` | `frontend/src/constants/SITE_CONFIG.ts` | Hằng số cấu hình thương hiệu Windie Cake, địa chỉ, hotline, freeship |
| `Tạo mới` | `frontend/src/constants/API_ENDPOINTS.ts` | Hằng số đường dẫn backend API |
| `Tạo mới` | `frontend/src/constants/STORAGE_KEYS.ts` | Hằng số key lưu trữ localStorage |
| `Tạo mới` | `frontend/src/constants/APP_ROUTES.ts` | Hằng số URL routes của ứng dụng |
| `Tạo mới` | `frontend/src/constants/index.ts` | Barrel export cho thư mục constants |
| `Tạo mới` | `frontend/src/types/category.ts` | TypeScript interface cho Category |
| `Tạo mới` | `frontend/src/types/product.ts` | TypeScript interface cho Product và Filter |
| `Tạo mới` | `frontend/src/types/cart.ts` | TypeScript interface cho CartItem và CartItemInput |
| `Tạo mới` | `frontend/src/locales/vi.json` | Bộ từ điển Tiếng Việt chuẩn xác cho tiệm bánh |
| `Tạo mới` | `frontend/src/locales/en.json` | Bộ từ điển Tiếng Anh quốc tế |
| `Tạo mới` | `frontend/src/locales/i18n-context.tsx` | React Context và hook `useTranslation()` đa ngôn ngữ |
| `Tạo mới` | `frontend/src/mocks/categories.mock.ts` | Dữ liệu mock 4 danh mục bánh đặc trưng |
| `Tạo mới` | `frontend/src/mocks/products.mock.ts` | Dữ liệu mock 6 loại bánh tươi thượng hạng |
| `Tạo mới` | `frontend/src/mocks/index.ts` | Barrel export cho thư mục mocks |
| `Tạo mới` | `frontend/src/services/api-client.ts` | HTTP Client chuẩn hóa với timeout và Error handling |
| `Tạo mới` | `frontend/src/services/categories.service.ts` | Service lấy danh mục với cơ chế fallback mock thông minh |
| `Tạo mới` | `frontend/src/services/products.service.ts` | Service lấy sản phẩm với cơ chế fallback mock thông minh |
| `Tạo mới` | `frontend/src/services/index.ts` | Barrel export cho thư mục services |
| `Tạo mới` | `frontend/src/stores/cart.store.ts` | Zustand store quản lý giỏ hàng và mở/đóng Cart Drawer |
| `Tạo mới` | `frontend/src/lib/utils.ts` | Tiện ích `cn` gộp Tailwind class và hàm `formatCurrency` |
| `Tạo mới` | `frontend/src/components/common/logo.tsx` | Logo vector SVG chữ W cách điệu hoàng gia của Windie Cake |
| `Tạo mới` | `frontend/src/components/ui/button.tsx` | Shadcn Button primitive (chuẩn text-sm, không dùng text-xs) |
| `Tạo mới` | `frontend/src/components/ui/badge.tsx` | Shadcn Badge primitive |
| `Tạo mới` | `frontend/src/components/ui/input.tsx` | Shadcn Input primitive (chuẩn text-sm) |
| `Tạo mới` | `frontend/src/components/ui/separator.tsx` | Shadcn Separator primitive |
| `Tạo mới` | `frontend/src/components/ui/sheet.tsx` | Shadcn Sheet primitive cho slide-over drawer |
| `Tạo mới` | `frontend/src/components/layout/shop-header.tsx` | Header navigation: Logo, Search, Menu, Language, Cart |
| `Tạo mới` | `frontend/src/components/layout/shop-footer.tsx` | Footer đầy đủ thông tin, chính sách và form newsletter |
| `Tạo mới` | `frontend/src/features/cart/cart-drawer.tsx` | Mini-cart Drawer trượt mượt mà kèm thanh freeship |
| `Tạo mới` | `frontend/src/app/(shop)/layout.tsx` | Layout bọc các trang mua sắm với Header, Footer, Drawer |
| `Tạo mới` | `frontend/src/app/(shop)/page.tsx` | Trang chủ tiệm bánh Windie Cake |
| `Cập nhật` | `frontend/src/app/globals.css` | Thiết lập biến màu warm bakery chuẩn cho shadcn và Tailwind |
| `Xóa bỏ` | `frontend/src/app/page.tsx` | Xóa file root page cũ để chuyển quyền điều phối sang `(shop)/page.tsx` |

---

## 3. Chi tiết Triển khai Kỹ thuật (Technical Implementation)

- **Logo Chữ W Thương hiệu Windie Cake**:
  - Thiết kế thủ công qua component SVG vector `<Logo />`.
  - Tích hợp biểu tượng chữ **W** cách điệu với đường nét uốn lượn như sóng bánh nướng và điểm xuyết bông lúa mì vàng óng.
  - Hỗ trợ prop `variant="light" | "dark"`: Ở Footer nền tối (`variant="dark"`), chữ tự động đổi sang màu trắng sáng và vàng kim nổi bật, tránh bị chìm vào nền.
  - Đảm bảo 100% độ sắc nét trên mọi loại màn hình, không tạo HTTP request ngoài, không gây CLS (Cumulative Layout Shift).
- **Thiết kế UI với Shadcn/ui & Radix Primitives**:
  - Thêm các component UI qua CLI `npx shadcn add` (`button`, `badge`, `input`, `sheet`, `separator`).
  - Tuân thủ quy định: Toàn bộ `Button` và `Input` đều sử dụng cỡ chữ `text-sm`, không dùng `text-xs`.
- **Tối ưu Hóa Hình ảnh Next.js & Sửa Lỗi Preload Warning**:
  - Thẻ `Image` sử dụng `fill` đi kèm với thẻ cha có `relative`, kích thước chiều cao rõ ràng và `aspect-[4/3]` (như danh mục nổi bật `min-h-[200px]`, hero showcase `min-h-[360px]`).
  - Loại bỏ warning preload do `priority` không khớp URL tối ưu của Next.js.
- **Tối ưu Giao diện Mobile & Responsive**:
  - Card Best Seller được tinh chỉnh responsive: hiển thị gọn gàng, không bị tràn màn hình trên thiết bị di động (`< 640px`) và trôi mượt mà ở góc trái trên desktop.
  - Cụm Trust Badges được bố trí khoa học trên mobile dạng hàng đơn, tránh hiện tượng co cụm 3 cột gây vỡ dòng trên màn hình hẹp (375px).
- **Hệ thống Đa ngôn ngữ (i18n) Toàn diện 100%**:
  - Toàn bộ nội dung trang chủ, danh mục, thanh điều hướng, giỏ hàng và footer đều được gắn mã hóa từ khóa đa ngôn ngữ thông qua `t(...)`.
  - Hỗ trợ chuyển đổi song ngữ Tiếng Việt 🇻🇳 và Tiếng Anh 🇬🇧 tức thì.
- **Hệ thống Quản lý Trạng thái Zustand**:
  - `useCartStore` quản lý mượt mà: thêm, tăng, giảm số lượng, xóa bánh, tính tổng tiền và thanh tiến trình miễn phí giao hàng.
  - Tự động đồng bộ với `localStorage` qua middleware `persist` với khóa `windie_cake_cart`.
- **Tầng Service & Cơ chế Fallback Mock Chuẩn xác**:
  - Component TSX không chứa logic gọi fetch trực tiếp.
  - Service gọi API backend qua `apiClient`. Khi backend trả về kết quả thành công (kể cả mảng rỗng `items: []`), service trả về dữ liệu thật của backend.
  - Chỉ khi bắt gặp ngoại lệ lỗi mạng (mất kết nối, backend chưa bật, timeout), service mới tự động chuyển sang `PRODUCTS_MOCK` / `CATEGORIES_MOCK` để đảm bảo UI hoạt động liên tục.
- **Hệ thống Đa ngôn ngữ (i18n)**:
  - Cung cấp `I18nProvider` và hook `useTranslation()` hỗ trợ dịch theo key lồng nhau (`t('nav.home')`).
  - Lưu trạng thái ngôn ngữ lựa chọn vào `localStorage` (`windie_cake_locale`), chuyển đổi tức thì không cần reload trang.
- **Khắc phục Cảnh báo CSS & Lỗi Type Declaration**:
  - Thêm `.vscode/settings.json` với `"css.lint.unknownAtRules": "ignore"` triệt tiêu toàn bộ warning `@tailwind` trong IDE.
  - Thêm `src/types/declarations.d.ts` với `declare module '*.css'` dập tắt lỗi side-effect CSS import trong `layout.tsx`.

---

## 4. Lệnh Kiểm tra & Kết quả Thực tế (Verification & Real Results)

> [!NOTE]
> Toàn bộ kết quả dưới đây đều được chạy và trích xuất thực tế từ terminal dự án.

### 4.1. Lệnh kiểm tra kiểu dữ liệu (Typecheck)

- **Lệnh thực thi**: `npm run typecheck --prefix frontend`
- **Kết quả**:

```text
> bakery-web@1.0.0 typecheck
> tsc --noEmit
(Hoàn tất không có bất kỳ lỗi TypeScript nào, exit code 0)
```

### 4.2. Lệnh kiểm tra Linting (ESLint)

- **Lệnh thực thi**: `npm run lint --prefix frontend`
- **Kết quả**:

```text
> bakery-web@1.0.0 lint
> next lint

✔ No ESLint warnings or errors
```

### 4.3. Lệnh kiểm tra Định dạng Code (Prettier Format)

- **Lệnh thực thi**: `npm run format --prefix frontend`
- **Kết quả**:

```text
> bakery-web@1.0.0 format
> prettier --write "src/**/*.{ts,tsx,css}"
(Toàn bộ 32 files mã nguồn frontend đều được format chuẩn xác)
```

### 4.4. Lệnh kiểm tra Build Production Next.js

- **Lệnh thực thi**: `npm run build --prefix frontend`
- **Kết quả**:

```text
> bakery-web@1.0.0 build
> next build

   ▲ Next.js 15.1.3
   - Environments: .env

   Creating an optimized production build ...
 ✓ Compiled successfully
   Linting and checking validity of types ...
   Collecting page data ...
   Generating static pages (0/4) ...
   Generating static pages (1/4) 
   Generating static pages (2/4) 
   Generating static pages (3/4) 
 ✓ Generating static pages (4/4)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                              Size     First Load JS
┌ ○ /                                    6.59 kB         133 kB
└ ○ /_not-found                          979 B           106 kB
+ First Load JS shared by all            105 kB
  ├ chunks/4bd1b696-492cbd844d101a59.js  52.9 kB
  ├ chunks/517-dd91c989f0a490c9.js       50.5 kB
  └ other shared chunks (total)          1.98 kB

○  (Static)  prerendered as static content
(Build production thành công, exit code 0)
```

---

## 5. Đánh giá Tiêu chí Nghiệm thu (Acceptance Criteria Checklist)

- [x] Logo thương hiệu Windie Cake với chữ W cách điệu dạng SVG vector -> Đạt.
- [x] Header điều hướng thông minh, responsive trên điện thoại (375px) và máy tính (1440px) -> Đạt.
- [x] Tích hợp bộ chuyển đổi đa ngôn ngữ Tiếng Việt 🇻🇳 / Tiếng Anh 🇬🇧 tức thì -> Đạt.
- [x] Mini-cart Drawer trượt ngang dựa trên Shadcn Sheet kèm thanh tiến trình freeship -> Đạt.
- [x] Footer chân trang đầy đủ thông tin liên hệ, danh mục, chính sách và newsletter -> Đạt.
- [x] Tách biệt hoàn toàn việc gọi API qua tầng Service trong `src/services/` -> Đạt.
- [x] Cơ chế Fallback Mock chỉ kích hoạt khi backend lỗi mạng/server -> Đạt.
- [x] Toàn bộ file hằng số/config đặt tên `UPPER_SNAKE_CASE` trong `src/constants/` -> Đạt.
- [x] Quản lý giỏ hàng bằng Zustand đồng bộ `localStorage` -> Đạt.
- [x] Triệt tiêu lỗi CSS warning `@tailwind` và lỗi TypeScript side-effect CSS import -> Đạt.
- [x] `tsc --noEmit`, `next lint`, và `next build` pass 100% không lỗi -> Đạt.
- [x] Mỗi file kết thúc bằng đúng 1 dòng trống duy nhất -> Đạt.

---

## 6. Rủi ro & Bàn giao cho Task Kế tiếp (Next Steps & Handover)

- **Rủi ro hiện tại**: Không có. Giao diện khung Storefront hoạt động ổn định, tải trang nhanh và tối ưu SEO.
- **Bước tiếp theo**: Báo cáo chi tiết cho người dùng theo quy trình Bước 2, giải đáp các thắc mắc kiến trúc (SWR vs Zustand), và chờ người dùng phê duyệt trước khi commit code lên Git.
