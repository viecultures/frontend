export interface PlaygroundScreenConfig {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  status: 'Alpha' | 'Beta' | 'Lab Concept' | 'Interactive Prototype';
  iconName: string;
  description: string;
}

export const PLAYGROUND_SCREENS: PlaygroundScreenConfig[] = [
  {
    id: 'dictation-shadowing',
    number: '01',
    title: 'Video Dictation & Shadowing Hub',
    subtitle: 'Luyện Nghe Chép Chính Tả & Shadowing Đồng Bộ Video (Backend: localhost:8080)',
    category: 'Video & Acoustics Engine',
    status: 'Interactive Prototype',
    iconName: 'Headphones',
    description: 'Khung video iframe bên trái kết hợp bảng bài làm chép chính tả, thu âm shadowing và kết nối API localhost:8080.'
  },
  {
    id: 'vietnam-map-ai',
    number: '02',
    title: 'Vietnam Map AI & Cultural Assistant',
    subtitle: 'Trợ Lý AI Tương Tác Bản Đồ 34 Tỉnh & Khám Phá Di Sản (Gemini Live)',
    category: 'Multimodal AI & GIS Map',
    status: 'Interactive Prototype',
    iconName: 'Compass',
    description: 'Đàm thoại giọng nói & văn bản thời gian thực cùng Sứ Giả AI, tự động đồng bộ vị trí, lộ trình và tra cứu hồ sơ di sản 34 tỉnh thành.'
  },
  {
    id: 'ai-scribe-editor',
    number: '03',
    title: 'AI Heritage Scribe & Essay Reviewer',
    subtitle: 'Trợ Lý AI Thẩm Định & Trau Chuốt Văn Phong Di Sản',
    category: 'AI Editorial & NLP',
    status: 'Beta',
    iconName: 'Feather',
    description: 'Chấm điểm độ thuần văn hóa, gợi ý từ vựng di sản học thuật và kiểm tra sắc thái biểu đạt tự động.'
  },
  {
    id: 'regional-dialects',
    number: '04',
    title: '3-Region Dialect & Tone Explorer',
    subtitle: 'Khám Phá Sóng Âm & Ma Trận Phương Ngữ Bắc - Trung - Nam',
    category: 'Linguistics & Regional',
    status: 'Alpha',
    iconName: 'Radio',
    description: 'So sánh đường biểu diễn thanh điệu, phương ngữ vùng miền và biến thể từ vựng văn hóa dân gian.'
  },
  {
    id: 'heritage-speed-duel',
    number: '05',
    title: 'Heritage Speed-Run Duel Arena',
    subtitle: 'Đấu Trường Di Sản Thử Thách Phản Xạ & Từ Vựng Tốc Độ',
    category: 'Gamification & Arena',
    status: 'Lab Concept',
    iconName: 'Zap',
    description: 'Chế độ thi đấu 60 giây dồn dập, combo chuỗi điểm nhân đôi và tích lũy huy hiệu Sứ Giả Văn Hóa.'
  }
];
