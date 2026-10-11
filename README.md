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
* **Backend Target:** Spring Boot 3 REST API (`http://localhost:8080`)

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
VITE_API_BASE_URL=http://localhost:8080
```

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
