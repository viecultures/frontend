# 🇻🇳 VieCultures Frontend (Web Application)

> **Học Tiếng Anh qua Văn Hóa & Bản Sắc Việt**  
> *"Gom từng từ nhỏ, hiểu một Việt Nam lớn (Small words, wonderful worlds)"*

Nền tảng học tiếng Anh song ngữ kết hợp khám phá văn hóa, phong tục, ẩm thực và di sản 63 tỉnh thành Việt Nam, tích hợp công nghệ AI Shadowing, Dictation theo câu và hệ thống thẻ ghi nhớ thông minh.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

* **Core:** React 19, TypeScript 5.7, Vite 6
* **Styling & Theme:** Tailwind CSS v4 (Cấu hình bảng màu di sản *Warm Heritage Editorial*)
* **Animations:** Motion (Framer Motion v12)
* **Icons:** Lucide React
* **Routing:** React Router DOM v7
* **Audio & Speech:** Web Speech API, HTML5 Audio Player với mốc thời gian (Timestamps)
* **Backend Target:** repo `backend`, Spring Boot 3 REST API (`http://localhost:8080`)

---

## 🏛️ Hai Phân Hệ Chính (Core Subsystems)

### 1. Phân Hệ Học Viên (Learner Portal)
* **Khám Phá Di Sản (`/discovery`):** Bản đồ số tương tác 63 tỉnh thành, lọc bài học theo vùng miền và danh mục văn hóa.
* **Đọc Song Ngữ & Shadowing (`/bilingual-reader`):** Bố cục cặp đoạn 1:1 đối xứng (Anh - Việt), phát âm thanh AI theo từng câu để luyện nhại giọng.
* **Luyện Nghe Chép Chính Tả (`/playground`):** Daily Dictation theo ngữ cảnh video & câu văn, so sánh ký tự thời gian thực.
* **Kho Từ Vựng & Flashcards (`/dictionary`, `/flashcard-study`):** Lật thẻ từ vựng chủ động (Active Recall) gắn liền với câu ngữ cảnh gốc.
* **Cộng Đồng Văn Hóa (`/community`):** Không gian tự do viết bài cảm nghĩ (UGC) và tham gia thử thách văn hóa hàng tuần.

### 2. Phân Hệ Quản Trị Viên (Admin CMS - `/admin`)
* **Dashboard Thống Kê:** Quản lý toàn bộ bài học văn hóa, số lượt đọc, thống kê theo vùng miền và cấp độ CEFR (`A1 – C2`).
* **Trình Soạn Thảo Đa Năng (`PostFormModal`):**
  * Thiết lập Cụm chủ đề (`topicGroup`), Tiêu đề song ngữ, Vùng miền (`region`), Cấp độ CEFR.
  * Tự động bóc tách khối văn bản thành các cặp đoạn đối xứng 1:1 (`ParagraphPair[]`).
  * Quản lý từ vựng học thuật ngữ cảnh (`VocabItem[]`) kèm công cụ Fast Paste.
* **⚡ TSV Fast Loader:** Bóc tách và nạp tự động dữ liệu từ file bảng tính TSV biên soạn sẵn chỉ với 1 cú click.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Thử (Getting Started)

### 1. Yêu Cầu Môi Trường
* Node.js: `>= 18.x` (khuyến nghị 20+)
* Trình quản lý gói: `npm` hoặc `pnpm`

### 2. Cài Đặt Thư Viện
```bash
cd frontend
npm install
```

### 3. Cấu Hình Biến Môi Trường (`.env`)
Tạo file `.env` tại thư mục gốc `frontend/` (nếu chưa có):
```env
VITE_PORT=5174
VITE_API_BASE_URL=http://localhost:8080
VITE_BACKEND_PORT=8080
VITE_AUTH_MODE=local
VITE_GOOGLE_CLIENT_ID=<cùng GOOGLE_CLIENT_ID trong backend/.env>
```

Backend chính là repo `backend` (`D:\GitHub\backend`), có API đăng nhập, hồ sơ, bài viết, từ vựng, voice và transcript. Đặt file `.env` của team tại thư mục backend với `PORT=8080`, rồi chạy `mvn spring-boot:run` tại đó. Cấu hình database, JWT và các khóa bí mật chỉ nằm ở backend; frontend chỉ cần Google Client ID công khai cùng giá trị với backend. Không dùng repo `viecultures_be` làm API chung cho frontend này.

Đăng nhập hiện mặc định chạy dùng thử trên trình duyệt (`VITE_AUTH_MODE=local`): nhập email hợp lệ và mật khẩu bất kỳ từ 6 ký tự; mật khẩu không được lưu hoặc gửi đi. Hai nút Google/Facebook đăng nhập ngay với hồ sơ `Thien Luan` có quyền `ROLE_ADMIN` để vào `/admin`, không mở OAuth và không gọi backend. Đăng ký và đăng nhập email tạo hồ sơ học viên. “Ghi nhớ đăng nhập” lưu phiên qua lần mở trình duyệt; bỏ chọn để chỉ lưu trong tab hiện tại. OTP và đồng bộ hồ sơ xác thực tạm tắt. Đây là phiên dùng thử, không cấp quyền API backend.

Để nối lại xác thực backend, đặt `VITE_AUTH_MODE=backend` rồi khởi động lại Vite và đăng nhập lại. Form email/mật khẩu sẽ gọi `/api/v1/auth/login` hoặc `/api/v1/auth/register`; hồ sơ gọi `/api/v1/auth/me` với JWT. Đăng nhập Google cần cấu hình các JavaScript origin của frontend trong Google Cloud Console. Các API tính năng khác vẫn dùng cấu hình backend hiện tại. Khi đổi `PORT` của backend, cập nhật hai biến API frontend tương ứng và khởi động lại Vite.

### 4. Khởi Chạy Môi Trường Phát Triển (Dev Server)
```bash
npm run dev
```
Truy cập ứng dụng tại: **`http://localhost:5174`**  
Truy cập trang Quản trị tại: **`http://localhost:5174/#/admin`** hoặc **`http://localhost:5174/admin`**

### 5. Kiểm Tra Biên Dịch (Build Production)
```bash
npm run build
```

---

## 🧭 Hướng Dẫn Cho AI Agent & Lập Trình Viên Mới

Để hiểu chi tiết cấu trúc thư mục, quy tắc phân tách module `admin` và `user`, cùng bảng tra cứu file nhanh, vui lòng đọc:

👉 **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**

---

## 📜 Tài Liệu Thiết Kế & Nghiệp Vụ

Tất cả tài liệu phân tích nghiệp vụ, quy tắc tính điểm, từ điển dữ liệu hệ thống (Data Dictionary) và sơ đồ thực thể quan hệ (ERD) được lưu trữ tại thư mục:

👉 **[document/](../document/)**
