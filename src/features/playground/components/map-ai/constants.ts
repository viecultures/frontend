import type { VoiceOption } from './types';

export const AVAILABLE_VOICES: VoiceOption[] = [
  { id: 'zephyr', name: 'Zephyr (Khuyên dùng)', gender: 'Nữ', tone: 'Trong trẻo, tươi vui', description: 'Giọng nữ thanh thoát, phù hợp giới thiệu danh lam thắng cảnh', pitch: 1.1, rate: 1.0 },
  { id: 'puck', name: 'Puck', gender: 'Nam', tone: 'Năng động, nhiệt huyết', description: 'Giọng nam hào hứng, dẫn dắt tour du lịch sôi nổi', pitch: 1.0, rate: 1.05 },
  { id: 'charon', name: 'Charon', gender: 'Nam', tone: 'Trầm ấm, truyền cảm', description: 'Giọng nam ấm áp, kể chuyện lịch sử & di tích cổ kính', pitch: 0.85, rate: 0.95 },
  { id: 'kore', name: 'Kore', gender: 'Nữ', tone: 'Trang nhã, học thuật', description: 'Giọng nữ chuẩn mực, thuyết minh di sản UNESCO', pitch: 1.0, rate: 0.98 },
  { id: 'aoede', name: 'Aoede', gender: 'Nữ', tone: 'Dịu dàng, nhã nhặn', description: 'Âm sắc ngọt ngào đậm chất thơ miền Cố đô', pitch: 1.05, rate: 0.95 },
  { id: 'fenrir', name: 'Fenrir', gender: 'Nam', tone: 'Mạnh mẽ, dứt khoát', description: 'Giọng nam trầm vang, khí thế hào hùng', pitch: 0.8, rate: 1.0 },
  { id: 'leda', name: 'Leda', gender: 'Nữ', tone: 'Trẻ trung, hiện đại', description: 'Tự nhiên, phong cách năng động thời đại mới', pitch: 1.15, rate: 1.0 },
  { id: 'orus', name: 'Orus', gender: 'Nam', tone: 'Chững chạc, uy nghiêm', description: 'Thích hợp cho các bài phân tích địa chính & văn hóa', pitch: 0.9, rate: 0.95 },
];

export const AVAILABLE_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Phản hồi siêu tốc & Giọng nói mượt' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', desc: 'Lập luận di sản văn hóa sâu sắc' },
];

export const PERSONA_OPTIONS = [
  { id: 'heritage_guide', title: 'Sứ Giả Văn Hóa Việt (Mặc định)', desc: 'Thân thiện, uyên bác, lồng ghép từ vựng di sản song ngữ' },
  { id: 'culinary_expert', title: 'Chuyên Gia Ẩm Thực & Đặc Sản', desc: 'Tập trung hương vị, món ăn gia truyền 3 miền' },
  { id: 'itinerary_planner', title: 'Chuyên Viên Thiết Kế Lộ Trình', desc: 'Tối ưu lịch trình tham quan từng ngày theo tỉnh thành' },
];
