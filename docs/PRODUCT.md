# Bakery Web — Tài liệu Đặc tả Sản phẩm (Product Requirements Document)

> **Dự án**: Bakery Web (E-commerce MVP cho Tiệm bánh Đơn)  
> **Phiên bản**: 1.1.0 (Cập nhật kiến trúc độc lập frontend/backend, PayOS Sandbox & Hệ thống Thông báo)  
> **Vai trò**: Senior Software Architect & Tech Lead  
> **Trạng thái**: Đã cập nhật theo yêu cầu Review của Khách hàng  

---

## 1. Tổng quan Sản phẩm & Tầm nhìn (Product Overview)

### 1.1. Bối cảnh & Mục tiêu

Dự án **Bakery Web** là nền tảng thương mại điện tử dành riêng cho một cửa hàng bánh ngọt, bánh mì thủ công (artisan bread), đồ uống đi kèm và phụ kiện tiệc/sinh nhật (nến, thiệp, hộp quà).

Mục tiêu chính:

1. **Trải nghiệm khách hàng mượt mà**: Dễ dàng xem menu bánh tươi trong ngày, tìm kiếm/lọc sản phẩm, tùy chọn nhận tại cửa hàng (Pickup) hoặc giao tận nơi (Delivery), áp mã giảm giá và theo dõi trạng thái đơn hàng.
2. **Quản trị vận hành tinh gọn & Thông báo kịp thời**: Chủ cửa hàng (Store Owner) có thể quản lý sản phẩm, giá bán, tình trạng còn/hết hàng nhanh chóng, cấu hình coupon khuyến mãi, tiếp nhận đơn và nhận **chuông thông báo đơn mới** tức thì để thợ bánh chuẩn bị kịp thời.
3. **Thanh toán VietQR tiện lợi với PayOS Sandbox**: Cung cấp trải nghiệm thanh toán chuẩn ngân hàng số Việt Nam qua cổng PayOS Sandbox.
4. **Chi phí tối thiểu (Zero-to-Low Cost)**: Kiến trúc hệ thống phân tách độc lập 2 thư mục `frontend` và `backend`, tối ưu hóa để vận hành trên các gói Free-tier (Vercel, Render/Railway, Supabase/Neon PostgreSQL).

---

## 2. Chân dung Người dùng (User Personas)

| Persona | Vai trò | Mục tiêu & Hành vi chính |
| :--- | :--- | :--- |
| **Khách vãng lai (Guest)** | Người dùng chưa đăng nhập | - Xem danh mục bánh, tìm kiếm, lọc theo giá/loại bánh.<br>- Xem chi tiết bánh, thành phần, cảnh báo dị ứng.<br>- Thêm bánh vào giỏ hàng tạm thời.<br>- Chuyển hướng đăng nhập/đăng ký khi bắt đầu Checkout. |
| **Khách hàng (Customer)** | Khách hàng có tài khoản | - Đăng ký, đăng nhập an toàn.<br>- Lưu trữ và quản lý sổ địa chỉ giao hàng.<br>- Chọn hình thức nhận bánh: **Giao hàng tận nơi** hoặc **Nhận tại cửa hàng**.<br>- Chọn khung giờ nhận bánh (Pickup slot / Delivery time).<br>- Nhập mã giảm giá (Coupon).<br>- Thanh toán COD hoặc quét mã VietQR qua **PayOS Sandbox**.<br>- **Nhận thông báo hệ thống**: Xác nhận đặt đơn thành công, cập nhật từng bước làm/giao bánh.<br>- Xem lịch sử đơn hàng và theo dõi tiến độ đơn. |
| **Chủ cửa hàng (Store Owner / Admin)** | Người vận hành tiệm | - Quản lý danh mục bánh, đồ uống, phụ kiện.<br>- Cập nhật nhanh trạng thái Còn hàng / Hết hàng (Toggle In-Stock).<br>- Tạo và quản lý mã giảm giá (Coupon).<br>- **Nhận thông báo hệ thống có âm thanh chuông báo (Audio Alert) khi có đơn mới**.<br>- Tiếp nhận đơn hàng mới, cập nhật trạng thái đơn (Xác nhận -> Đang làm bánh -> Sẵn sàng -> Hoàn tất/Đã hủy).<br>- Xem thống kê doanh thu và đơn hàng cơ bản. |

---

## 3. Phạm vi Tính năng Chi tiết (Functional Requirements)

### 3.1. Quản lý Tài khoản & Phân quyền (Auth & Users)

- **Đăng ký tài khoản (Register)**: Họ tên, Email, Số điện thoại, Mật khẩu (yêu cầu độ phức tạp tối thiểu 8 ký tự, có chữ và số).
- **Đăng nhập (Login)**: Xác thực bằng Email và Mật khẩu. Trả về Access Token và Refresh Token an toàn.
- **Quản lý Hồ sơ (Profile)**: Cập nhật họ tên, số điện thoại, đổi mật khẩu.
- **Sổ địa chỉ (Address Book)**: Khách hàng có thể lưu nhiều địa chỉ nhận hàng (Tên người nhận, SĐT, Địa chỉ chi tiết, Phường/Xã, Quận/Huyện, Tỉnh/Thành, Đánh dấu địa chỉ mặc định).
- **Phân quyền (RBAC)**:
  - `CUSTOMER`: Quyền người mua hàng thông thường.
  - `OWNER`: Toàn quyền quản trị sản phẩm, danh mục, coupon, xem toàn bộ đơn hàng và nhận thông báo vận hành.

### 3.2. Danh mục & Khám phá Sản phẩm (Product Catalog)

- **Cấu trúc phân loại**:
  - Danh mục chính: *Bánh ngọt (Pastry/Cakes), Bánh mì thủ công (Artisan Bread), Bánh lạnh (Mousse/Tiramisu), Đồ uống (Coffee/Tea), Phụ kiện tiệc (Candles/Cards)*.
- **Thuộc tính sản phẩm bánh**:
  - Tên bánh, Slug URL thân thiện SEO.
  - Giá bán gốc, Giá khuyến mãi (nếu có).
  - Tồn kho khả dụng (Stock quantity).
  - Bật/Tắt trạng thái mở bán (`isActive`).
  - Danh sách hình ảnh sản phẩm.
  - Mô tả chi tiết: Hương vị, kích cỡ (cm/gram), hướng dẫn bảo quản (VD: *Ngon nhất trong ngày, bảo quản mát 2-4°C trong 48h*).
  - Cảnh báo dị ứng (Allergens): *Trứng, Sữa, Gluten, Đậu phộng, Quả hạch*.
  - Thời gian chuẩn bị dự kiến (`prepTimeMinutes`): Hữu ích cho các loại bánh làm theo yêu cầu.
- **Tìm kiếm & Bộ lọc**:
  - Tìm kiếm full-text theo tên sản phẩm và mô tả.
  - Lọc theo Danh mục (Category), Khoảng giá (Price range), Tình trạng còn hàng (In Stock only).
  - Sắp xếp: *Mới nhất, Giá tăng dần, Giá giảm dần, Bán chạy nhất*.

### 3.3. Giỏ hàng & Khuyến mãi (Cart & Coupons)

- **Giỏ hàng (Cart)**:
  - Thêm sản phẩm, điều chỉnh số lượng, xóa từng món, làm trống giỏ hàng.
  - Đồng bộ giỏ hàng phía Client (Zustand + LocalStorage) với cơ chế kiểm tra giá và tồn kho thực tế từ Server trước khi chuyển sang bước Đặt hàng.
- **Hệ thống Mã giảm giá (Coupons)**:
  - Loại giảm giá:
    - `PERCENTAGE`: Giảm theo % giá trị đơn hàng (kèm trần giảm tối đa `maxDiscountAmount`).
    - `FIXED_AMOUNT`: Giảm số tiền cố định (VD: 20,000đ, 50,000đ).
  - Điều kiện áp dụng:
    - Giá trị đơn hàng tối thiểu (`minOrderValue`).
    - Thời hạn hiệu lực (`startDate` -> `endDate`).
    - Giới hạn tổng số lượt sử dụng toàn hệ thống (`usageLimit`).
    - Giới hạn số lần sử dụng cho mỗi khách hàng (`userLimit` - mặc định 1 lần/khách).
    - Trạng thái kích hoạt (`isActive`).

### 3.4. Đặt hàng & Vận chuyển (Checkout & Fulfillment)

- **Hình thức nhận hàng (Fulfillment Types)**:
  1. **Giao hàng tận nơi (Delivery)**:
     - Chọn địa chỉ từ sổ địa chỉ hoặc nhập địa chỉ mới.
     - Số điện thoại liên hệ người nhận, ghi chú cho tài xế.
     - Phí giao hàng: Đồng giá cho MVP (Flat rate, VD: 25,000đ) hoặc miễn phí cho đơn từ 300,000đ.
  2. **Nhận tại cửa hàng (Pickup)**:
     - Không tính phí giao hàng.
     - Khách hàng chọn ngày và khung giờ nhận bánh (Pickup Time Slot, VD: *Hôm nay 14:00 - 15:00*).
     - Tên và số điện thoại người đến nhận bánh.
- **Tính toán tiền thanh toán (Server-side Calculation)**:
  - $\text{Tạm tính (Subtotal)} = \sum (\text{Giá sản phẩm} \times \text{Số lượng})$
  - $\text{Giảm giá (Discount)} = \text{Tính toán từ Coupon hợp lệ}$
  - $\text{Phí giao hàng (Shipping Fee)} = \text{0 (nếu Pickup) hoặc Flat rate (nếu Delivery)}$
  - $\text{Tổng thanh toán (Total)} = \text{Subtotal} - \text{Discount} + \text{Shipping Fee}$
  - *Quy tắc bất di bất dịch: Toàn bộ công thức được tính toán nghiêm ngặt tại Backend. Không nhận tổng tiền từ Client.*

### 3.5. Phương thức Thanh toán (Payments)

- **Thanh toán khi nhận hàng (COD - Cash on Delivery)**:
  - Áp dụng cho cả đơn Delivery (trả tiền cho shipper) và Pickup (trả tại quầy).
  - Trạng thái thanh toán khởi tạo: `PENDING`. Đơn chuyển thẳng sang `CONFIRMED` để tiệm bắt đầu chuẩn bị.
- **Cổng thanh toán PayOS Sandbox (VietQR Online)**:
  - Tích hợp **PayOS Sandbox**: Tạo link thanh toán kèm mã **VietQR** chuẩn ngân hàng Việt Nam.
  - Khách hàng quét mã QR hoặc bấm chuyển khoản mô phỏng trên môi trường sandbox.
  - PayOS gửi Webhook thông báo kết quả giao dịch về Backend.
  - Xử lý bất đồng bộ, xác minh chữ ký HMAC-SHA256 (`signature` / checksum) và đảm bảo tính bất biến (Idempotency).

### 3.6. Hệ thống Thông báo (System Notifications) — *Yêu cầu Bổ sung*

Hệ thống cung cấp chuông thông báo (Notification Center) và biểu tượng Badge trên thanh tiêu đề cho cả Khách hàng và Chủ tiệm:

#### A. Thông báo dành cho Khách hàng (Customer Notifications)

1. **Thông báo trạng thái đặt hàng (Order Placed)**:
   - Gửi ngay khi khách hoàn tất tạo đơn (kèm mã đơn hàng `BKR-YYYYMMDD-XXXX` và hình thức nhận bánh).
2. **Thông báo cập nhật tiến độ đơn hàng (Order Status Updates)**:
   - *Xác nhận thanh toán thành công* (khi PayOS báo webhook `PAID`).
   - *Bếp bắt đầu làm bánh* (khi chủ tiệm chuyển sang `PREPARING`).
   - *Bánh đã sẵn sàng tại quầy* (khi đơn Pickup chuyển sang `READY_FOR_PICKUP`).
   - *Bánh đang được giao* (khi đơn Delivery chuyển sang `OUT_FOR_DELIVERY`).
   - *Đơn hàng hoàn tất* (khi chuyển sang `COMPLETED`).
   - *Đơn hàng bị hủy* (nếu đơn quá hạn hoặc bị hủy).
3. **Trải nghiệm UI Khách hàng**:
   - Biểu tượng Chuông thông báo trên Header kèm số lượng thông báo chưa đọc.
   - Bấm vào thông báo sẽ điều hướng trực tiếp đến trang chi tiết đơn hàng `/orders/[id]`.

#### B. Thông báo dành cho Chủ tiệm bánh (Store Owner Notifications)

1. **Thông báo Đơn hàng mới đến (New Order Alert)**:
   - Gửi tức thì khi có đơn COD mới hoặc đơn PayOS thanh toán thành công.
   - **Âm thanh chuông báo (Audio Alert "Ting ting")**: Phát âm thanh thông báo trên màn hình quản trị Admin để thợ bánh trong bếp nghe thấy và tiếp nhận đơn ngay lập tức.
   - Hiển thị nội dung tóm tắt: *Mã đơn, Số lượng bánh, Hình thức (Giao hàng / Lấy lúc mấy giờ), Tổng tiền*.
2. **Thông báo Cập nhật trạng thái đơn (Order Events)**:
   - Khách hàng bấm hủy đơn hợp lệ (khi tiệm chưa bấm làm bánh).
   - Đơn thanh toán online quá 15 phút bị hết hạn tự động.
3. **Trải nghiệm UI Chủ tiệm**:
   - Icon chuông quản trị trên Admin Header.
   - Danh sách đơn hàng tự động đánh dấu nổi bật đơn mới chưa xử lý.

### 3.7. Bảng điều khiển Quản trị (Admin Backoffice)

- **Quản lý Sản phẩm & Danh mục**:
  - Thêm, sửa, ẩn (`isActive = false`) sản phẩm bánh.
  - Cập nhật nhanh số lượng tồn kho hoặc bật/tắt hết hàng chỉ bằng 1 nút gạt (Toggle Switch).
  - Tải lên ảnh bánh.
- **Quản lý Khuyến mãi**:
  - Tạo mới mã coupon, cấu hình ngày bắt đầu/kết thúc, giới hạn lượt dùng, theo dõi số lượt đã sử dụng.
- **Báo cáo tóm tắt (MVP Dashboard)**:
  - Số lượng đơn mới cần chuẩn bị trong ngày.
  - Doanh thu theo ngày/tháng.
  - Thống kê sản phẩm bán chạy nhất.

---

## 4. Vòng đời Đơn hàng & Thanh toán (State Machine)

```
[ PENDING_PAYMENT ] ──(PayOS Webhook thành công / Đơn COD)──> [ CONFIRMED ]
         │                                                            │
         │ (Hết hạn 15p / Khách hủy)                                  │ (Tiệm bấm: Bắt đầu làm bánh)
         ▼                                                            ▼
   [ CANCELLED ]                                                [ PREPARING ]
         ▲                                                            │
         │                                                            │ (Làm bánh xong)
         │ (Hủy trước khi làm bánh)                                   ▼
         │                                                  [ READY_FOR_PICKUP ] (nếu Pickup)
         │                                                  hoặc [ OUT_FOR_DELIVERY ] (nếu Delivery)
         │                                                            │
         │                                                            │ (Giao/Nhận thành công)
         │                                                            ▼
         └─────────────────────────────────────────────────────> [ COMPLETED ]
```

---

## 5. Tiêu chí Thành công của MVP (Success Criteria)

- [ ] Khách hàng duyệt sản phẩm $\rightarrow$ đặt hàng $\rightarrow$ nhận thông báo đặt đơn thành công dưới 2 phút.
- [ ] Chủ tiệm nhận thông báo và âm thanh chuông báo ngay khi có đơn mới đến.
- [ ] Thanh toán PayOS Sandbox quét mã VietQR hoạt động trơn tru, webhook cập nhật đơn và gửi thông báo tức thì.
- [ ] Tồn kho bánh tươi được trừ nguyên tử, tuyệt đối không bị bán quá tồn kho (Zero Overselling).
- [ ] Hai ứng dụng `frontend` và `backend` độc lập hoàn toàn, dễ dàng kiểm thử và triển khai riêng rẽ trên môi trường miễn phí.
