# Cấu Trúc Dự Án Frontend & Bản Đồ Kiến Trúc (PROJECT_STRUCTURE.md)

> **Mục đích:** Cung cấp bản đồ kiến trúc toàn diện và định hướng điều hướng cho AI Coding Agents và các nhà phát triển khi tham gia phát triển dự án VieCultures Frontend.

---

## 1. Nguyên Tắc Tổ Chức Mã Nguồn

1. **Flat Feature-First Architecture**:
   Các tính năng độc lập được tổ chức thành các thư mục con trực tiếp dưới `src/features/`. Mỗi feature đóng gói UI, components, hooks, services và kiểu dữ liệu riêng nếu cần.
2. **Decoupled Service Layer**:
   Các logic lưu trữ, tích hợp API, tính điểm thưởng gamification dùng chung cho nhiều tính năng được tách vào `src/services/` (ví dụ: `src/services/learning/`), không để phụ thuộc chéo vòng tròn giữa các feature.
3. **Reusable Shared Components**:
   Các thành phần giao diện toàn cục (Navbar, Footer, BrandLogo, Bản đồ SVG dùng chung) đặt tại `src/components/`.
4. **Strict UI Iconography**:
   100% sử dụng icon vector chuẩn từ `lucide-react`. Tuyệt đối không dùng emoji thô trong các nút bấm, badge hay UI control.

---

## 2. Sơ Đồ Cây Thư Mục Thực Tế

```
frontend/src/
├── App.tsx                     # Shell điều hướng React Router
├── main.tsx                    # Entry point React 19 + Vite
├── index.css                   # Tailwind v4 theme + Design tokens (Heritage Palette)
│
├── features/                   # CÁC TÍNH NĂNG ĐỘC LẬP (FEATURE MODULES)
│   ├── admin/                  # Phân hệ quản trị (CMS biên soạn bài đọc, TSV import, preview)
│   ├── auth/                   # Đăng nhập, đăng ký, modal xác thực
│   ├── community/              # Cộng đồng, bài viết phản hồi & thử thách tuần
│   ├── discovery/              # Khám phá văn hóa & Carousel bản đồ 63 tỉnh thành
│   ├── flashcards/             # Thẻ nhớ ôn tập, Spaced Repetition (SRS), từ điển
│   ├── home/                   # Trang chủ học viên: phòng học cá nhân, nhiệm vụ, tiến độ
│   ├── landing/                # Trang giới thiệu (Landing Page, Hero video, demo tương tác)
│   ├── playground/             # Sân chơi thử nghiệm: Dictation video & Map AI Sandbox
│   │   └── components/map-ai/  # Bản đồ AI tương tác Live API đa phương thức
│   ├── reader/                 # Bài đọc song ngữ Anh - Việt, tra từ tại chỗ, nghe chép chính tả
│   └── subscription/           # Gói hội viên Pro, thanh toán & đối chiếu quyền lợi
│
├── components/                 # UI COMPONENTS DÙNG CHUNG (SHARED UI)
│   ├── Navbar.tsx              # Thanh điều hướng ứng dụng
│   ├── Footer.tsx              # Chân trang di sản văn hóa
│   ├── BrandLogo.tsx           # Logo thương hiệu VieCultures
│   ├── ProfileDropdown.tsx     # Menu tài khoản học viên
│   ├── SettingsModal.tsx       # Cài đặt âm thanh, font chữ, theme
│   ├── map/                    # Trình vẽ bản đồ SVG Việt Nam dùng chung (VietnamMap, MapPoiLayer)
│   └── pwa/                    # Banner hỗ trợ Progressive Web App
│
├── services/                   # DỊCH VỤ DÙNG CHUNG HỆ THỐNG
│   └── learning/               # Tầng lưu trữ học tập & Gamification ledger
│       ├── learningStorage.ts  # Quản lý lưu trữ từ vựng, bài đọc, session SRS
│       └── rewardLedger.ts     # Tính toán & trao thưởng XP/Coin chống gian lận
│
├── context/                    # REACT CONTEXTS TOÀN CỤC
│   ├── GamificationContext.tsx # Quản lý XP, Coins, Streak, Badges, Level
│   └── ThemeContext.tsx        # Chế độ giao diện (Paper / Dark)
│
├── data/                       # DỮ LIỆU TĨNH & TỪ ĐIỂN CHUẨN HÓA
│   ├── flashcardsData.ts       # Bộ thẻ nhớ văn hóa theo chủ đề
│   ├── landmarksData.ts        # Danh mục danh lam thắng cảnh & di sản
│   ├── readerData.ts           # Kho từ vựng & bài đọc chuẩn
│   ├── vietnamCultureData.ts   # Tọa độ, SVG paths các địa danh lịch sử
│   └── vietnamMapData.ts       # Dữ liệu 63 tỉnh thành Việt Nam
│
├── routes/                     # QUẢN LÝ ĐƯỜNG DẪN & ROUTING
│   ├── paths.ts                # Khai báo hằng số PATHS tập trung
│   └── useAppNavigate.ts       # Hook điều hướng có type-safety
│
├── types/                      # ĐỊNH NGHĨA KIỂU DỮ LIỆU CHUNG (SYSTEM TYPES)
└── utils/                      # CÁC HÀM TIỆN ÍCH DÙNG CHUNG
    ├── auth-storage.ts         # Lưu trữ session người dùng cục bộ
    ├── dictionary-service.ts   # Tra từ điển & lọc từ nhạy cảm
    ├── speechUtils.ts          # Tiện ích phát âm Web Speech API chuẩn
    └── vietnamMapProjection.ts # Chuyển đổi tọa độ GPS sang SVG
```

---

## 3. Quy Ước Bổ Sung & Kiểm Thử

- **Test Suite**:
  - `npm run test:learning`: Kiểm thử thuật toán học tập, SRS, và tầng lưu trữ (`src/services/learning/`).
  - `npm run test:map-ai`: Kiểm thử tương tác âm thanh, Live API, bản đồ và mascot (`src/features/playground/components/map-ai/lib/`).
- **Build**:
  - `npm run build`: Thực hiện `tsc -b && vite build` để đảm bảo không lỗi kiểu hoặc import đứt gãy.
