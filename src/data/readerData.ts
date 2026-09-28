// Vocabulary Item Schema
export interface VocabItem {
  id: string;
  word: string;
  pos: string;
  ipa: string;
  viMeaning: string;
  contextSentence: string;
}

export const VOCAB_DATABASE: Record<string, VocabItem> = {
  "well-read": {
    id: "well-read",
    word: "well-read",
    pos: "adj",
    ipa: "/ˌwel ˈred/",
    viMeaning: "Đọc nhiều, am hiểu sâu rộng qua sách báo và tri thức.",
    contextSentence: "There’s a kind of person who’s so well-read...",
  },
  "frighteningly-articulate": {
    id: "frighteningly-articulate",
    word: "frighteningly articulate",
    pos: "phrase",
    ipa: "/ˈfraɪ.tən.ɪŋ.li ɑːrˈtɪk.jə.lət/",
    viMeaning: "Ăn nói sắc sảo, diễn đạt ý tưởng vô cùng lưu loát và thuyết phục.",
    contextSentence: "...so frighteningly articulate, so mentally juicy...",
  },
  "annotating-a-book": {
    id: "annotating-a-book",
    word: "annotating a book",
    pos: "v. phrase",
    ipa: "/ˈæn.ə.teɪt.ɪŋ/",
    viMeaning: "Ghi chú, đúc kết suy nghĩ trực tiếp vào lề trang sách khi đang đọc.",
    contextSentence: "They listen to podcasts at 1.5x speed while annotating a book.",
  },
  "epistemic-frameworks": {
    id: "epistemic-frameworks",
    word: "epistemic frameworks",
    pos: "noun phrase",
    ipa: "/ˌep.əˈstee.mɪk ˈfreɪm.wɜːrk/",
    viMeaning: "Khung nhận thức luận / Hệ thống cấu trúc lý thuyết tri thức.",
    contextSentence: "They drop phrases like 'epistemic frameworks'...",
  },
  "indecent-pleasure": {
    id: "indecent-pleasure",
    word: "indecent pleasure",
    pos: "noun phrase",
    ipa: "/ɪnˈdiː.sənt ˈpleʒ.ər/",
    viMeaning: "Niềm vui mãnh liệt, trần trụi và thuần túy khi dung nạp kiến thức.",
    contextSentence: "...for the sheer, indecent pleasure of being disgustingly educated.",
  },
};

export interface QuizOption {
  value: string;
  label: string;
}

export interface ReaderQuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctValue: string;
}

export const READER_QUIZ_QUESTIONS: ReaderQuizQuestion[] = [
  {
    id: "q1",
    question: "1. According to the article, what is the core secret to becoming \"disgustingly educated\"?",
    options: [
      {
        value: "A",
        label: "A. Memorizing 50 new vocabulary words every single morning for social media clout.",
      },
      {
        value: "B",
        label: "B. Cultivating a deep, genuine curiosity and annotations for the sheer pleasure of learning.",
      },
      {
        value: "C",
        label: "C. Listening to podcasts at 3.0x speed without taking any notes or reflection.",
      },
    ],
    correctValue: "B",
  },
  {
    id: "q2",
    question: "2. What does the highlighted term \"frighteningly articulate\" mean in context?",
    options: [
      {
        value: "A",
        label: "A. Có khả năng diễn đạt ý tưởng vô cùng sắc sảo, lưu loát và thuyết phục.",
      },
      {
        value: "B",
        label: "B. Nói chuyện quá nhanh khiến người nghe bị sợ hãi và ngợp.",
      },
    ],
    correctValue: "A",
  },
];

export interface RecommendedArticle {
  id: string;
  category: string;
  level: string;
  title: string;
  description: string;
  readTime: string;
  vocabCount: number;
  link: string;
}

export const RECOMMENDED_ARTICLES: RecommendedArticle[] = [
  {
    id: "banh-mi",
    category: "Cuisine",
    level: "B1",
    title: "The Story of Saigon Bánh Mì",
    description: "From French baguette to global culinary icon: the history behind Vietnam's favorite street food.",
    readTime: "5 min read",
    vocabCount: 8,
    link: "/bilingual-reader",
  },
  {
    id: "hoi-an",
    category: "Heritage",
    level: "B1",
    title: "Hội An Lantern Festival Traditions",
    description: "Understanding full moon rituals, silk craftsmanship, and ancient wooden architecture along the Thu Bồn river.",
    readTime: "7 min read",
    vocabCount: 10,
    link: "/bilingual-reader",
  },
  {
    id: "bat-trang",
    category: "Crafts",
    level: "B2",
    title: "Bát Tràng Pottery & Ceramic Arts",
    description: "700 years of ceramic heritage in a traditional craft village on the Red River delta.",
    readTime: "6 min read",
    vocabCount: 9,
    link: "/bilingual-reader",
  },
];

export interface ExtensiveQuestionOption {
  key: string;
  text: string;
}

export interface ExtensiveQuestion {
  id: string;
  num: string;
  options: ExtensiveQuestionOption[];
  correctKey: string;
}

export const EXTENSIVE_QUESTIONS: ExtensiveQuestion[] = [
  {
    id: "q1",
    num: "1",
    options: [
      { key: "A", text: "Memorizing 50 new vocabulary words every morning for social media clout." },
      { key: "B", text: "Cultivating a deep, genuine curiosity for the sheer pleasure of learning." },
      { key: "C", text: "Listening to podcasts at 3.0x speed without taking any notes or reflection." },
    ],
    correctKey: "B",
  },
  {
    id: "q2",
    num: "2",
    options: [
      { key: "A", text: "Diễn đạt ý tưởng vô cùng sắc sảo, lưu loát và thuyết phục." },
      { key: "B", text: "Nói chuyện quá nhanh khiến người nghe bị sợ hãi và ngợp." },
      { key: "C", text: "Thường xuyên tranh cãi gay gắt với người đối diện." },
    ],
    correctKey: "A",
  },
  {
    id: "q3",
    num: "3",
    options: [
      { key: "A", text: "Khung nhận thức luận / Hệ thống cấu trúc lý thuyết tri thức." },
      { key: "B", text: "Kỹ thuật đọc lướt nhanh không cần suy nghĩ." },
      { key: "C", text: "Một ứng dụng quản lý công việc hàng ngày." },
    ],
    correctKey: "A",
  },
  {
    id: "q4",
    num: "4",
    options: [
      { key: "A", text: "To gain social status and instagram aesthetics." },
      { key: "B", text: "For the authentic, intrinsic pleasure of being disgustingly educated." },
      { key: "C", text: "To pass a standardized academic examination." },
    ],
    correctKey: "B",
  },
];

export interface ReaderParagraph {
  id: string;
  index: number;
  audioUrl: string;
  enText: string;
  viText: string;
  // Specific vocab token highlights
  vocabIds?: string[];
}

export const ARTICLE_BILINGUAL_DATA: {
  titleEn: string;
  titleVi: string;
  subtitleEn: string;
  subtitleVi: string;
  fullAudioUrl: string;
  paragraphs: ReaderParagraph[];
} = {
  titleEn: "How to be disgustingly educated",
  titleVi: "Làm thế nào để trở nên cực kỳ uyên bác",
  subtitleEn: "A chaotic guide to becoming the most interesting person in the room",
  subtitleVi: "Hướng dẫn đầy ngẫu hứng để trở thành người thú vị nhất trong phòng",
  fullAudioUrl: "/audio/ryan/disgustingly_educated_full.mp3",
  paragraphs: [
    {
      id: "p1",
      index: 0,
      audioUrl: "/audio/ryan/sentence_1.mp3",
      enText: "Hello my love,",
      viText: "Chào tình yêu của em,",
    },
    {
      id: "p2",
      index: 1,
      audioUrl: "/audio/ryan/sentence_2.mp3",
      enText: "There’s a kind of person who’s so well-read, so frighteningly articulate, so mentally juicy that you want to both date them and punch them in the throat.",
      viText: "Có một kiểu người đọc nhiều đến thế, ăn nói sắc sảo đến đáng sợ, và có một bộ óc đầy chất xám đến vậy, khiến anh vừa muốn hẹn hò lại vừa muốn đấm vào họng họ.",
      vocabIds: ["well-read", "frighteningly-articulate"],
    },
    {
      id: "p3",
      index: 2,
      audioUrl: "/audio/ryan/sentence_3.mp3",
      enText: "You know the type.",
      viText: "Anh biết kiểu người đó mà.",
    },
    {
      id: "p4",
      index: 3,
      audioUrl: "/audio/ryan/sentence_4.mp3",
      enText: "They quote Baldwin mid-conversation.",
      viText: "Họ trích dẫn Baldwin giữa cuộc trò chuyện.",
    },
    {
      id: "p5",
      index: 4,
      audioUrl: "/audio/ryan/sentence_5.mp3",
      enText: "They listen to podcasts at 1.5x speed while annotating a book.",
      viText: "Họ nghe podcast ở tốc độ 1.5x trong khi đang ghi chú một cuốn sách.",
      vocabIds: ["annotating-a-book"],
    },
    {
      id: "p6",
      index: 5,
      audioUrl: "/audio/ryan/sentence_6.mp3",
      enText: "They drop phrases like “epistemic frameworks” and somehow make it work.",
      viText: "Họ buông những cụm từ như “khung nhận thức luận” và bằng cách nào đó vẫn khiến nó nghe thật hợp lý.",
      vocabIds: ["epistemic-frameworks"],
    },
    {
      id: "p7",
      index: 6,
      audioUrl: "/audio/ryan/sentence_7.mp3",
      enText: "This is your guide to becoming that person. Not for clout. Not for Instagram aesthetics. But for the sheer, indecent pleasure of being disgustingly educated.",
      viText: "Đây là hướng dẫn để anh trở thành người đó. Không phải để gây chú ý. Không phải để sống ảo trên Instagram. Mà vì niềm vui thuần túy, trần trụi khi được uyên bác đến đáng ghét.",
      vocabIds: ["indecent-pleasure"],
    },
  ],
};

export interface AIVoiceConfig {
  id: string;
  name: string;
  gender: "Female" | "Male";
  genderLabel: string;
  accent: string;
  flag: string;
  edgeVoice: string;
  toneDesc: string;
  description: string;
}

export const AVAILABLE_VOICES: AIVoiceConfig[] = [
  {
    id: "ryan",
    name: "Ryan",
    gender: "Male",
    genderLabel: "Nam Anh",
    accent: "en-GB",
    flag: "🇬🇧",
    edgeVoice: "en-GB-RyanNeural",
    toneDesc: "Học thuật, điềm đạm (Mặc định)",
    description: "Giọng Nam Anh phong cách học thuật, truyền tải cảm xúc văn chương và bình luận sâu sắc.",
  },
  {
    id: "jenny",
    name: "Jenny",
    gender: "Female",
    genderLabel: "Nữ Mỹ",
    accent: "en-US",
    flag: "🇺🇸",
    edgeVoice: "en-US-JennyNeural",
    toneDesc: "Ấm áp, chuẩn giáo dục",
    description: "Giọng Nữ chuẩn Mỹ, phát âm rõ ràng, nhịp điệu sư phạm tự nhiên, rất thích hợp luyện nghe Shadowing.",
  },
  {
    id: "guy",
    name: "Guy",
    gender: "Male",
    genderLabel: "Nam Mỹ",
    accent: "en-US",
    flag: "🇺🇸",
    edgeVoice: "en-US-GuyNeural",
    toneDesc: "Trầm ấm, nam tính",
    description: "Giọng Nam chuẩn Mỹ, âm sắc dày, độ cộng hưởng tốt, phong cách phóng sự văn hóa sâu lắng.",
  },
  {
    id: "sonia",
    name: "Sonia",
    gender: "Female",
    genderLabel: "Nữ Anh",
    accent: "en-GB",
    flag: "🇬🇧",
    edgeVoice: "en-GB-SoniaNeural",
    toneDesc: "Quý phái, sắc sảo",
    description: "Giọng Nữ chuẩn Received Pronunciation (Anh - Anh), thanh thoát, sang trọng và chuẩn mực.",
  },
];

export function getVoiceAudioUrl(voiceId: string, type: "full" | "sentence", sentenceIndex?: number): string {
  if (type === "full") {
    return `/audio/${voiceId}/disgustingly_educated_full.mp3`;
  }
  const idx = (sentenceIndex ?? 0) + 1;
  return `/audio/${voiceId}/sentence_${idx}.mp3`;
}




