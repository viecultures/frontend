export interface GeminiVoice {
  id: "puck" | "charon" | "kore" | "aoede" | "fenrir";
  name: string;
  geminiVoice: string;
  gender: "Male" | "Female";
  accent: "US" | "UK";
  flag: string;
  toneDesc: string;
  description: string;
  fullAudioUrl: string;
  sentenceAudioUrl: string;
}

export const GEMINI_VOICES: GeminiVoice[] = [
  {
    id: "puck",
    name: "Puck",
    geminiVoice: "Puck",
    gender: "Male",
    accent: "US",
    flag: "🇺🇸",
    toneDesc: "Trầm ấm, đĩnh đạc (Mặc định)",
    description: "Giọng Nam chuẩn Mỹ từ Google Gemini, âm sắc tự nhiên, nhịp điệu sư phạm rõ ràng, phù hợp nhất cho Shadowing và nghe hiểu.",
    fullAudioUrl: "/audio/puck/tet_renewal_full.wav",
    sentenceAudioUrl: "/audio/puck/sentence_1.wav",
  },
  {
    id: "charon",
    name: "Charon",
    geminiVoice: "Charon",
    gender: "Male",
    accent: "UK",
    flag: "🇬🇧",
    toneDesc: "Học thuật, điềm đạm",
    description: "Giọng Nam phong cách học thuật từ Google Gemini, âm trầm sâu lắng, truyền tải cảm xúc văn chương và bài giảng lịch sử.",
    fullAudioUrl: "/audio/charon/tet_renewal_full.wav",
    sentenceAudioUrl: "/audio/charon/sentence_1.wav",
  },
  {
    id: "kore",
    name: "Kore",
    geminiVoice: "Kore",
    gender: "Female",
    accent: "US",
    flag: "🇺🇸",
    toneDesc: "Nhẹ nhàng, truyền cảm",
    description: "Giọng Nữ chuẩn Mỹ từ Google Gemini, trong trẻo, tự nhiên, nhả chữ tinh tế và cuốn hút.",
    fullAudioUrl: "/audio/kore/tet_renewal_full.wav",
    sentenceAudioUrl: "/audio/kore/sentence_1.wav",
  },
  {
    id: "aoede",
    name: "Aoede",
    geminiVoice: "Aoede",
    gender: "Female",
    accent: "UK",
    flag: "🇬🇧",
    toneDesc: "Quý phái, thanh lịch",
    description: "Giọng Nữ chuẩn Anh từ Google Gemini, thanh thoát, phong cách kể chuyện tao nhã và truyền cảm.",
    fullAudioUrl: "/audio/aoede/tet_renewal_full.wav",
    sentenceAudioUrl: "/audio/aoede/sentence_1.wav",
  },
  {
    id: "fenrir",
    name: "Fenrir",
    geminiVoice: "Fenrir",
    gender: "Male",
    accent: "US",
    flag: "🇺🇸",
    toneDesc: "Rõ âm, dứt khoát",
    description: "Giọng Nam chuẩn Mỹ từ Google Gemini, âm lượng dày, phát âm dứt khoát, phong cách bản tin phóng sự.",
    fullAudioUrl: "/audio/fenrir/tet_renewal_full.wav",
    sentenceAudioUrl: "/audio/fenrir/sentence_1.wav",
  },
];
