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


