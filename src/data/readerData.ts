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
  "sacred": {
    id: "sacred",
    word: "sacred",
    pos: "adj",
    ipa: "/ˈseɪ.krɪd/",
    viMeaning: "Thiêng liêng, mang ý nghĩa tâm linh trang trọng bậc nhất.",
    contextSentence: "Tết Nguyên Đán, often called simply Tết, is described as the most important and sacred holiday in Vietnamese culture.",
  },
  "passage": {
    id: "passage",
    word: "passage from one year to the next",
    pos: "phrase",
    ipa: "/ˈpæs.ɪdʒ/",
    viMeaning: "Sự chuyển giao giữa năm cũ và năm mới.",
    contextSentence: "It marks the passage from the old year to the new one, but its meaning goes further.",
  },
  "family-reunion": {
    id: "family-reunion",
    word: "family reunion",
    pos: "noun phrase",
    ipa: "/ˈfæm.əl.i ˌriːˈjuː.njən/",
    viMeaning: "Sự đoàn viên, sum họp gia đình.",
    contextSentence: "According to the article, Tết stands for family reunion, respect for ancestors, and hope for a better future.",
  },
  "agricultural-civilization": {
    id: "agricultural-civilization",
    word: "agricultural civilization",
    pos: "noun phrase",
    ipa: "/ˌæɡ.rəˈkʌl.tʃər.əl ˌsɪv.əl.aɪˈzeɪ.ʃən/",
    viMeaning: "Nền văn minh nông nghiệp lúa nước lâu đời.",
    contextSentence: "The article traces Tết back to the ancient agricultural civilization of East Asia, where the cycle of the seasons played a central role in daily life.",
  },
  "give-way-to": {
    id: "give-way-to",
    word: "give way to",
    pos: "v. phrase",
    ipa: "/ɡɪv weɪ tuː/",
    viMeaning: "Nhường chỗ cho, nhường bước cho một giai đoạn mới.",
    contextSentence: "Tết takes place when winter gives way to spring and plants begin to grow again, which symbolizes a new beginning.",
  },
  "symbolize": {
    id: "symbolize",
    word: "symbolize / stand for",
    pos: "verb",
    ipa: "/ˈsɪm.bə.laɪz/",
    viMeaning: "Tượng trưng cho, biểu trưng cho một ý nghĩa sâu xa.",
    contextSentence: "...plants begin to grow again, which symbolizes a new beginning.",
  },
  "folk-legend": {
    id: "folk-legend",
    word: "folk legend",
    pos: "noun phrase",
    ipa: "/foʊk ˈledʒ.ənd/",
    viMeaning: "Truyền thuyết dân gian, truyện tích cổ truyền miệng.",
    contextSentence: "A folk legend also says that the festival is a time for descendants to remember their ancestors and pray for a good harvest.",
  },
  "ancestor-worship": {
    id: "ancestor-worship",
    word: "ancestor worship",
    pos: "noun phrase",
    ipa: "/ˈæn.ses.tər ˈwɜːr.ʃɪp/",
    viMeaning: "Cúng gia tiên, nghi lễ thờ cúng tổ tiên.",
    contextSentence: "During the holiday, families hold ancestor worship ceremonies, exchange New Year wishes, give lì xì to children, and visit pagodas.",
  },
  "absorb-influences": {
    id: "absorb-influences",
    word: "absorb influences",
    pos: "v. phrase",
    ipa: "/əbˈzɔːrb ˈɪn.flu.əns.ɪz/",
    viMeaning: "Tiếp nhận, hấp thu những ảnh hưởng văn hóa.",
    contextSentence: "Over time, Tết absorbed influences from Chinese culture during the period of Chinese rule, yet it kept its own identity.",
  },
  "core-values": {
    id: "core-values",
    word: "core values",
    pos: "noun phrase",
    ipa: "/kɔːr ˈvæl.juːz/",
    viMeaning: "Những giá trị cốt lõi, nền tảng tinh thần không thể mai một.",
    contextSentence: "...the article argues that the core values of togetherness, gratitude, and hope remain the soul of the holiday.",
  },
  "prosperity": {
    id: "prosperity",
    word: "prosperity",
    pos: "noun",
    ipa: "/prɑːˈsper.ə.t̬i/",
    viMeaning: "Sự sung túc, thịnh vượng và an khang phát đạt.",
    contextSentence: "...and thịt kho tàu with duck eggs represents fullness and prosperity.",
  },
  "atmosphere": {
    id: "atmosphere",
    word: "atmosphere",
    pos: "noun",
    ipa: "/ˈæt.məs.fɪr/",
    viMeaning: "Bầu không khí, phong vị và cảm quan ngày lễ.",
    contextSentence: "Finally, the atmosphere of Tết differs from region to region.",
  },
  "differ-from-region-to-region": {
    id: "differ-from-region-to-region",
    word: "differ from region to region",
    pos: "phrase",
    ipa: "/ˈdɪf.ɚ frəm ˈriː.dʒən tuː ˈriː.dʒən/",
    viMeaning: "Khác nhau giữa các vùng miền (Bắc - Trung - Nam).",
    contextSentence: "Finally, the atmosphere of Tết differs from region to region.",
  },
  "li-xi": {
    id: "li-xi",
    word: "lì xì",
    pos: "noun",
    ipa: "/lì xì/ (lucky money)",
    viMeaning: "Tiền mừng tuổi đầu năm đựng trong phong bao đỏ may mắn.",
    contextSentence: "...exchange New Year wishes, give lì xì to children, and visit pagodas.",
  },
  "five-fruit-tray": {
    id: "five-fruit-tray",
    word: "five-fruit tray (mâm ngũ quả)",
    pos: "noun phrase",
    ipa: "/faɪv fruːt treɪ/",
    viMeaning: "Mâm ngũ quả ngày Tết biểu trưng cho ngũ hành và mong cầu an lành.",
    contextSentence: "Before Tết, people clean their houses, prepare a five-fruit tray, and wrap bánh chưng or bánh tét together.",
  },
  "dua-hanh": {
    id: "dua-hanh",
    word: "dưa hành",
    pos: "noun",
    ipa: "/dưa hành/ (pickled onions)",
    viMeaning: "Món dưa hành muối chua ăn kèm giúp cân bằng vị béo ngày Tết.",
    contextSentence: "Dưa hành balances rich, protein-heavy dishes, and thịt kho tàu with duck eggs represents fullness and prosperity.",
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
    question: "1. According to the article, what is the historical origin of Tết traced back to?",
    options: [
      {
        value: "A",
        label: "A. The ancient agricultural civilization of East Asia, where seasonal cycles played a central role.",
      },
      {
        value: "B",
        label: "B. A modern commercial campaign developed in urban centres during the 20th century.",
      },
      {
        value: "C",
        label: "C. Western calendar celebrations introduced through international trading ports.",
      },
    ],
    correctValue: "A",
  },
  {
    id: "q2",
    question: "2. What cultural and spiritual meaning do dishes like bánh chưng, bánh tét, and thịt kho tàu represent?",
    options: [
      {
        value: "A",
        label: "A. Bánh chưng & bánh tét symbolize earth and sky expressing gratitude to ancestors, while thịt kho tàu represents fullness and prosperity.",
      },
      {
        value: "B",
        label: "B. They are purely fast-food snacks prepared strictly for children during spring festivals.",
      },
      {
        value: "C",
        label: "C. They are modern western imports introduced to replace ancient ancestral worship traditions.",
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
      { key: "A", text: "The ancient agricultural civilization of East Asia, tied to seasonal cycles." },
      { key: "B", text: "Modern entertainment trends created during the industrial era." },
      { key: "C", text: "A royal decree solely observed by imperial court officials." },
    ],
    correctKey: "A",
  },
  {
    id: "q2",
    num: "2",
    options: [
      { key: "A", text: "Symbols of earth and sky expressing deep gratitude to ancestors." },
      { key: "B", text: "Casual quick meals with no historical or spiritual significance." },
      { key: "C", text: "Decorations meant only to be displayed without consumption." },
    ],
    correctKey: "A",
  },
  {
    id: "q3",
    num: "3",
    options: [
      { key: "A", text: "Lively and open, with mai flowers, red watermelons, flower markets, and folk games." },
      { key: "B", text: "Cold, solemn with peach blossoms and quiet nostalgic contemplation only." },
      { key: "C", text: "Celebrated strictly indoors without any flowers, dishes, or gatherings." },
    ],
    correctKey: "A",
  },
  {
    id: "q4",
    num: "4",
    options: [
      { key: "A", text: "Togetherness, gratitude, and hope for a better future." },
      { key: "B", text: "Commercial shopping competition and expensive gift exchanges." },
      { key: "C", text: "Strict adherence to ancient rules with no regional variations." },
    ],
    correctKey: "A",
  },
];
