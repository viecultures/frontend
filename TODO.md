# 📋 VieCultures Frontend — Backlog & Roadmap (TODO)

## 📌 1. Điều Hướng & Mobile UX (Priority: High)
- [ ] **Mobile Drawer Navigation (`Navbar.tsx`)**: Bổ sung Hamburger slide-over drawer hoặc Bottom Navigation Bar cho màn hình nhỏ (`< lg`) để người dùng dễ dàng chuyển qua lại giữa các phòng chức năng:
  - 🏠 Phòng Học (`home`)
  - 🧭 Khám Phá Di Sản (`discovery`)
  - 📖 Đọc Song Ngữ (`bilingual-reader`)
  - 🎴 Kho Từ Vựng Flashcard (`dictionary` / `flashcard-study`)
  - 👥 Cộng Đồng Học Viên (`community` / `community-contest`)
- [ ] **Dark Mode Switcher Toggle**: Thêm nút bật/tắt nhanh giao diện Dark Mode (theme Cung đình đêm `heritage-forest` & `antique-gold`) trên Navbar hoặc trong `ProfileDropdown`.

---

## 📌 2. Trải Nghiệm Đọc & Học Từ Vựng (Reader Feature)
- [ ] **Audio Shadowing Bar Tương Tác (`audio-shadowing-bar.tsx`)**:
  - Thêm bộ điều khiển tốc độ đọc audio (0.75x, 1.0x, 1.25x).
  - Thêm hiệu ứng sóng âm thanh (sound waveform animation) khi phát audio.
- [ ] **Drawer Giải Nghĩa & Lưu Từ Vựng Chuyên Sâu**:
  - Khi click vào từ vựng có gạch chân thư pháp (`.ink-underline`), mở Drawer hiển thị phiên âm IPA, audio phát âm bản xứ, câu ví dụ văn cảnh và nút *"Lưu vào Flashcard SRS"*.
- [ ] **Quiz Celebration & Reward Modal**:
  - Thêm hiệu ứng pháo hoa / confetti khi nộp bài trắc nghiệm cuối bài đọc song ngữ.
  - Tích lũy Xu Văn Hóa (💎 Cultural Coins) và điểm kinh nghiệm (XP) vào tài khoản.

---

## 📌 3. Thẻ Ghi Nhớ & Học Thông Minh (Flashcard & SRS)
- [x] **Hiệu Ứng Lật Thẻ 3D & Phím Tắt Học (`flashcard-study.tsx`)**:
  - Animation lật thẻ 3D mượt mà theo trục Y (`perspective: 1200px`, `transform-style: preserve-3d`).
  - Hỗ trợ phím tắt bàn phím: `Space` (lật thẻ), `1/2` (Cần ôn lại / Đã thuộc từ này), mũi tên `←/→` chuyển thẻ, và `Enter` nộp đáp án gõ từ.
- [x] **Tra Cứu Từ Điển Di Sản (`dictionary.tsx`)**:
  - Bộ lọc từ vựng theo chủ đề: *Lịch sử & Di sản, Ẩm thực & Cà phê, Nghệ thuật & Làng nghề, Danh thắng Thiên nhiên, Lễ hội & Tín ngưỡng*.
  - Modal tra cứu chi tiết từ điển (`DictionaryInspectorModal.tsx`) kèm phiên âm IPA, giải nghĩa và phát âm giọng bản xứ.
  - 100% Tailwind design system tokens, loại bỏ toàn bộ hex còn sót.

---

## 📌 4. Cộng Đồng & Thử Thách Tuần (Community & Contest)
- [ ] **Contest Hub Hoàn Thiện (`community-contest.tsx`)**:
  - Đồng hồ đếm ngược hạn chót nộp bài tuần (Countdown Timer).
  - Bảng xếp hạng Sứ Giả Văn Hóa tuần (Leaderboard).
  - Tích hợp nộp bài dự thi có đính kèm ảnh và chấm điểm ứng dụng từ vựng.
- [ ] **Modal Xem Chi Tiết Bài Viết Cảm Nhận**:
  - Phóng to ảnh chụp di sản của thành viên.
  - Danh sách từ vựng di sản được highlight trong bài viết.
  - Khung gửi bình luận tương tác và thả tim.

---

## 📌 5. Bản Đồ Di Sản & Khám Phá (Map Spotlight & Discovery)
- [ ] **Tương Tác Bản Đồ ➔ Tự Động Lọc Bài Đọc**:
  - Click vào tỉnh trên SVG Map (vd: *Thừa Thiên Huế*, *Bắc Ninh*, *Sa Pa*) ➔ tự động cuộn xuống danh mục và áp dụng bộ lọc bài học tương ứng.
- [ ] **Bộ Lọc Vùng Miền (Bắc - Trung - Nam)**:
  - Kết nối tabs vùng miền trực tiếp với Bản đồ để zoom mượt mà vào khu vực đã chọn.

---

## 📌 6. Tối Ưu Hiệu Năng & Code Quality (Performance & A11y)
- [ ] **Làm sạch dứt điểm các mã màu hex còn sót lại** trong các component phụ.
- [ ] **Tối Ưu Lazy Loading & Blur Placeholder**:
  - Áp dụng placeholder mờ cho các ảnh di sản dung lượng lớn để nâng cao trải nghiệm tải trang.
