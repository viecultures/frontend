export interface DictationItem {
  id: string;
  audioPromptText: string;
  sentenceTemplateEn: string;
  missingWord: string;
  hint: string;
  viTranslation: string;
}

export interface QuickFlashcardItem {
  id: string;
  word: string;
  pos: string;
  ipa: string;
  viMeaning: string;
  contextSentence: string;
  culturalFact: string;
}

export interface AiQuickPrompt {
  labelEn: string;
  labelVi: string;
  responseEn: string;
}

export const READER_DICTATION_ITEMS: DictationItem[] = [
  {
    id: 'd1',
    audioPromptText: 'Bánh Chưng is wrapped in green dong leaves, representing gratitude to Heaven and Earth.',
    sentenceTemplateEn: 'Bánh Chưng is wrapped in green {blank} leaves, representing gratitude to Heaven and Earth.',
    missingWord: 'dong',
    hint: 'Tên loại lá rừng xanh mướt dùng để gói bánh Chưng (bắt đầu bằng chữ "d")',
    viTranslation: 'Bánh Chưng được gói bằng lá dong xanh mướt, tượng trưng cho lòng biết ơn Trời Đất.',
  },
  {
    id: 'd2',
    audioPromptText: 'Tết marks the passage from the old year to the new one, embodying family reunion.',
    sentenceTemplateEn: 'Tết marks the passage from the old year to the new one, embodying family {blank}.',
    missingWord: 'reunion',
    hint: 'Từ vựng tiếng Anh nghĩa là "sự đoàn tụ, sum họp" (bắt đầu bằng "r-e...")',
    viTranslation: 'Tết đánh dấu sự chuyển giao năm cũ sang năm mới, kết tinh ý nghĩa sum họp gia đình.',
  },
  {
    id: 'd3',
    audioPromptText: 'In Vietnamese culture, Tết is described as the most important and sacred holiday.',
    sentenceTemplateEn: 'In Vietnamese culture, Tết is described as the most important and {blank} holiday.',
    missingWord: 'sacred',
    hint: 'Tính từ mang nghĩa "thiêng liêng, trang trọng" (bắt đầu bằng "s-a...")',
    viTranslation: 'Trong văn hóa Việt, Tết được xem là ngày lễ quan trọng và thiêng liêng bậc nhất.',
  },
];

export const READER_DEFAULT_FLASHCARDS: QuickFlashcardItem[] = [
  {
    id: 'fc-1',
    word: 'sacred',
    pos: 'adj',
    ipa: '/ˈseɪ.krɪd/',
    viMeaning: 'Thiêng liêng, trang trọng mang tính tâm linh',
    contextSentence: 'Tết is considered the most sacred occasion of the year.',
    culturalFact: 'Nghi thức thắp nén hương thơm đêm Giao thừa kết nối con cháu với cội nguồn tổ tiên.',
  },
  {
    id: 'fc-2',
    word: 'family reunion',
    pos: 'noun phrase',
    ipa: '/ˈfæm.əl.i ˌriːˈjuː.njən/',
    viMeaning: 'Sum họp gia đình, đoàn viên',
    contextSentence: 'The New Year Eve dinner is the ultimate family reunion moment.',
    culturalFact: 'Bữa cơm Tất niên quy tụ đầy đủ các thế hệ cùng chia sẻ niềm vui sau một năm vất vả.',
  },
  {
    id: 'fc-3',
    word: 'ancestral worship',
    pos: 'noun phrase',
    ipa: '/ænˈses.trəl ˈwɜːr.ʃɪp/',
    viMeaning: 'Tục thờ cúng tổ tiên, kính nhớ gia tiên',
    contextSentence: 'Ancestral worship shows heartfelt gratitude to our forebears.',
    culturalFact: 'Tập tục phản ánh đạo lý truyền thống "Uống nước nhớ nguồn" của người Việt.',
  },
  {
    id: 'fc-4',
    word: 'agricultural civilization',
    pos: 'noun phrase',
    ipa: '/ˌæɡ.rəˈkʌl.tʃər.əl ˌsɪv.əl.aɪˈzeɪ.ʃən/',
    viMeaning: 'Nền văn minh nông nghiệp lúa nước',
    contextSentence: 'Our spring festivals stem from a rich agricultural civilization.',
    culturalFact: 'Lịch âm cổ truyền được sáng tạo dựa trên quy luật tuần hoàn của mùa màng và tuần trăng.',
  },
];

export const READER_AI_QUICK_PROMPTS: AiQuickPrompt[] = [
  {
    labelEn: 'Why is the square shape of Bánh Chưng culturally significant?',
    labelVi: 'Tại sao bánh Chưng hình vuông lại mang ý nghĩa văn hóa sâu sắc?',
    responseEn: `In ancient Vietnamese cosmology, Bánh Chưng represents the Earth (symbolized by the square), while Bánh Giầy represents the Sky (symbolized by the round shape). Wrapped in green leaves with rice, green beans, and pork inside, Bánh Chưng encapsulates the fertile gifts of agriculture and pays tribute to King Hùng's heritage.`,
  },
  {
    labelEn: 'How do Northern and Southern Tết traditions differ?',
    labelVi: 'Phong tục Tết miền Bắc và miền Nam khác nhau ở những điểm nào?',
    responseEn: `While both regions cherish reunion, their aesthetic symbols differ: The North embraces pink peach blossoms (hoa đào) and pairs rich boiled chicken with pickled onions (dưa hành). The South welcomes warm sunshine with bright yellow apricot blossoms (hoa mai) and serves braised pork with eggs (thịt kho tàu) representing fullness and harmony.`,
  },
  {
    labelEn: 'What is the etiquette when offering New Year wishes (Chúc Tết)?',
    labelVi: 'Nghi thức chúc Tết và lì xì đầu năm cần chú ý điều gì?',
    responseEn: `Traditionally, the first day is dedicated to fathers and paternal relatives ('Mùng Một Tết Cha'), the second to mothers ('Mùng Hai Tết Mẹ'), and the third to revered teachers ('Mùng Ba Tết Thầy'). Wishes are given with two hands alongside red envelopes (lì xì) signifying sincere wishes for health, longevity, and scholastic success.`,
  },
];

export const READER_NEXT_LESSON_INFO = {
  id: 'hue-court-music',
  titleEn: 'Nhã Nhạc: The Celestial Echoes of Huế Royal Court',
  titleVi: 'Nhã Nhạc Cung Đình Huế: Âm Vang Di Sản Ngàn Năm',
  region: 'Miền Trung • Thừa Thiên Huế',
  category: 'Di sản phi vật thể thế giới UNESCO',
  readTime: '4 phút đọc',
  coverImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
  summaryVi: 'Tìm hiểu dàn nhạc cung đình thời Nguyễn, hệ thống nhạc cụ gõ độc đáo và giá trị nghệ thuật tao nhã được UNESCO vinh danh.',
};
