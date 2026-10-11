# 🏗️ Cấu Trúc Dự Án Frontend & Hướng Dẫn Cho AI Agent (PROJECT_STRUCTURE.md)

> **Mục đích tệp này:** Cung cấp bản đồ kiến trúc toàn diện và quy tắc điều hướng nhanh cho các AI Coding Agents (Antigravity, Gemini, Cursor, Claude...) khi mở phiên làm việc mới, giúp định vị chính xác vị trí code cần sửa mà không phải scan toàn bộ dự án.

---

## 1. Đánh Giá Kiến Trúc: Tách Phân Hệ `admin` và `user`

### 💡 Tại sao việc tách `admin` và `user` là rất cần thiết?
1. **Phân định rõ ranh giới nghiệp vụ (Separation of Concerns):**
   * Phân hệ **`user`** (Học viên): Tập trung vào trải nghiệm học tập, giao diện cảm xúc (Warm Heritage), gamification, luyện đọc song ngữ, audio player, flashcards, tương tác cộng đồng.
   * Phân hệ **`admin`** (Quản trị viên/Biên tập viên): Tập trung vào CRUD dữ liệu, bảng biểu thống kê, form nhập liệu phức tạp (TSV importer, audio timestamping, kiểm duyệt bài viết).
2. **Tránh phình to `App.tsx` và Navbar:**
   * User có Navbar, Footer, Gamification header riêng.
   * Admin cần Dashboard sidebar/header, Breadcrumbs, Table actions riêng biệt.
3. **Tối ưu Code-splitting & Security (Lazy Loading & Route Guard):**
   * Code Admin nặng (trình soạn thảo, bảng biểu lớn) có thể được tách bundle qua `React.lazy()` để không làm chậm thời gian tải trang của học viên trên di động.
   * Dễ dàng bọc Route Guard kiểm tra quyền `Role: ADMIN` mà không ảnh hưởng luồng của User.

---

## 2. Sơ Đồ Cây Thư Mục Đề Xuất (Target Directory Architecture)

```
frontend/src/
├── App.tsx                     # Định tuyến chính (React Router) & Shell ứng dụng
├── main.tsx                    # Entry point React 19 + Vite
├── index.css                   # Master Tailwind v4 theme + Design tokens (Heritage Palette)
│
├── features/                   # TỔ CHỨC THEO PHÂN HỆ VAI TRÒ
│   │
│   ├── admin/                  # 🔴 PHÂN HỆ QUẢN TRỊ VIÊN (ADMIN CMS)
│   │   ├── components/         # UI Admin: PostFormModal, Table, StatCards, TSVParser...
│   │   ├── pages/              # Trang Admin: AdminPage (Dashboard quản trị bài đọc)
│   │   ├── services/           # API Admin: postAdminService.ts (CRUD /api/posts, TSV helpers)
│   │   └── types/              # Kiểu dữ liệu đặc thù Admin: adminTypes.ts
│   │
│   └── user/                   # 🟢 PHÂN HỆ HỌC VIÊN (LEARNER PORTAL)
│       ├── auth/               # Đăng nhập, đăng ký, xác thực
│       ├── landing/            # Trang giới thiệu (Landing Page, Hero banner, Demo)
│       ├── home/               # Phòng học cá nhân (Dashboard, streak, nhiệm vụ)
│       ├── discovery/          # Khám phá văn hóa & Bản đồ di sản 63 tỉnh thành
│       ├── reader/             # Đọc song ngữ 1:1 & Shadowing AI
│       ├── flashcards/         # Tra từ điển & Ôn tập thẻ nhớ (Spaced Repetition)
│       ├── community/          # Bài viết cảm nghĩ UGC & Thử thách tuần
│       └── playground/         # Phòng luyện Dictation & Shadowing theo câu
│
├── components/                 # 🟡 REUSABLE SHARED UI COMPONENTS (DÙNG CHUNG)
│   ├── Navbar.tsx              # Thanh điều hướng chính
│   ├── Footer.tsx              # Chân trang văn hóa
│   ├── BrandLogo.tsx           # Logo thương hiệu VieCultures
│   ├── ProfileDropdown.tsx     # Menu tài khoản & chuyển đổi nhanh Admin
│   ├── SettingsModal.tsx       # Cài đặt âm thanh, font chữ, chủ đề
│   └── pwa/                    # PWA Install banner
│
├── types/                      # 🔵 CORE SYSTEM TYPES (Kiểu dữ liệu hệ thống)
│   ├── index.ts                # Lesson, VocabItem, ParagraphPair, UserReflection...
│   └── sampleTypes.ts          # Mẫu dữ liệu giả lập
│
├── services/ hoặc utils/       # 🟣 UTILITIES & HELPER SERVICES
│   ├── speechUtils.ts          # Web Speech API (Phát âm & Nhận diện giọng nói)
│   ├── vietnamMapUtils.ts      # Xử lý tọa độ & dữ liệu bản đồ Việt Nam
│   └── useVietnamMap.ts        # Hook điều khiển tương tác bản đồ
│
└── lib/
    ├── cn.ts                   # clsx + tailwind-merge helper
    └── sample-data.ts          # Mock data fallback
```

---

## 3. Bảng Tra Cứu Nhanh Cho AI Agent (Agent Fast Index)

Khi nhận yêu cầu từ người dùng, Agent hãy tra cứu ngay bảng này để mở đúng tệp:

| Bạn muốn làm gì? | Vị trí file cần xem / sửa |
| :--- | :--- |
| **Quản trị bài viết, sửa form đăng bài, import TSV** | `src/features/admin/pages/AdminPage.tsx`<br>`src/features/admin/components/PostFormModal.tsx` |
| **Sửa API gọi Backend cho Admin** | `src/features/admin/services/postAdminService.ts` |
| **Đổi kiểu dữ liệu bài đăng / cặp đoạn / từ vựng** | `src/features/admin/types/adminTypes.ts` và `src/types/index.ts` |
| **Sửa màn hình Đọc bài song ngữ & Shadowing** | `src/features/reader/pages/reader.tsx`<br>`src/features/reader/components/` |
| **Sửa phòng luyện nghe chép (Dictation / AI Map)** | `src/features/playground/pages/playground.tsx`<br>`src/features/playground/services/dictationService.ts` |
| **Sửa trang Khám phá & Bản đồ di sản** | `src/features/discovery/pages/discovery.tsx` |
| **Sửa trang Phòng học cá nhân / Gamification** | `src/features/home/pages/home.tsx` |
| **Sửa Kho từ vựng & Flashcards** | `src/features/flashcards/pages/dictionary.tsx`<br>`src/features/flashcards/pages/flashcard-study.tsx` |
| **Sửa Header, Navbar hoặc Profile menu** | `src/components/Navbar.tsx`<br>`src/components/ProfileDropdown.tsx` |
| **Định tuyến các trang (Router)** | `src/App.tsx` |
| **Đổi màu sắc, Tokens, Font chữ Heritage** | `src/index.css` |

---

## 4. Quy Ước Thiết Kế & Code Style (Design Tokens & Rules)

* **Design Concept:** *Warm Heritage Editorial & Cultural Storytelling* (Di sản ấm áp & Nghệ thuật kể chuyện văn hóa).
* **Màu sắc cốt lõi:**
  * Giấy dó ấm: `#FBF7EE` (`--color-warm-ivory`), Nền phụ `#F6EEDC` (`--color-rice-paper`).
  * Xanh di sản: `#1E4B43` (`--color-heritage-green`), Xanh rừng sâu `#122A22` (`--color-heritage-forest`).
  * Vàng hoàng cung: `#D9B76A` (`--color-antique-gold`), Vàng sáng `#FCE5B5` (`--color-antique-bright`).
* **Font chữ:**
  * Serif Tiêu đề: `'Playfair Display', Georgia, serif` (`font-heading`)
  * Sans-serif nội dung: `'Be Vietnam Pro', sans-serif` (`font-sans`)
* **Quy tắc TypeScript:**
  * Dự án bật `verbatimModuleSyntax: true` trong `tsconfig.json`. Mọi import interface/type **bắt buộc dùng**:
    ```ts
    import type { MyType } from './types';
    ```
* **Kết nối Backend Spring Boot:**
  * Cổng mặc định: `http://localhost:8080` (Cấu hình qua `VITE_API_BASE_URL`).
  * Endpoint bài đọc: `/api/posts` (hỗ trợ lọc theo `topic`, `region`, `topicGroup`, `level`, `query`).
