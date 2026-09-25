export interface ParagraphSentence {
  id: string;
  en: string;
  vi: string;
  audioStart: number;
  audioEnd: number;
  vocab?: { word: string; ipa: string; pos: string; vi: string; contextNote: string }[];
}

export interface CulturalArticle {
  id: string;
  title: string;
  titleVi: string;
  category: "History" | "Heritage" | "Culinary Arts" | "Traditional Arts";
  cefr: "A2" | "B1" | "B2" | "C1";
  readTimeMinutes: number;
  hasAudio: boolean;
  coverImage: string;
  summary: string;
  author: string;
  paragraphs: {
    id: string;
    sentences: ParagraphSentence[];
  }[];
}

export interface Flashcard {
  id: string;
  word: string;
  ipa: string;
  pos: string;
  vi: string;
  enSentence: string;
  viSentence: string;
  articleSource: string;
  nextReviewDate: string;
  intervalDays: number;
  easeFactor: number;
  reviewsCount: number;
}

export interface CommunityEssay {
  id: string;
  authorName: string;
  avatar: string;
  title: string;
  excerpt: string;
  category: string;
  likes: number;
  audioNoteDuration?: string;
  badge: string;
  date: string;
}

export const SAMPLE_ARTICLES: CulturalArticle[] = [
  {
    id: "pho-culture-hanoi",
    title: "The Culinary Soul of Hanoi: The Heritage of Phở",
    titleVi: "Hồn Thực Khách Hà Thành: Di Sản Phở Việt",
    category: "Culinary Arts",
    cefr: "B1",
    readTimeMinutes: 6,
    hasAudio: true,
    coverImage: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
    summary: "Explore how a humble bowl of beef noodle soup evolved into Vietnam's globally recognized national symbol of warmth, balance, and culinary mastery.",
    author: "Nguyen Van Minh",
    paragraphs: [
      {
        id: "p1",
        sentences: [
          {
            id: "s1",
            en: "Phở is far more than a comforting breakfast dish; it is a living symbol of Vietnamese culinary history and identity.",
            vi: "Phở không chỉ đơn thuần là một món ăn sáng ấm lòng; đó là một biểu tượng sống động của lịch sử và bản sắc ẩm thực Việt Nam.",
            audioStart: 0,
            audioEnd: 6.5,
            vocab: [
              { word: "comforting", ipa: "/ˈkʌm.fə.tɪŋ/", pos: "adj", vi: "mang lại cảm giác ấm áp, an ủi", contextNote: "Refers to food that satisfies emotional needs." },
              { word: "identity", ipa: "/aɪˈden.tə.ti/", pos: "noun", vi: "bản sắc, nhận dạng", contextNote: "Cultural characteristics defining a nation." }
            ]
          },
          {
            id: "s2",
            en: "Emerging in the early 20th century in Northern Vietnam, it blends indigenous rice noodles with French-influenced beef broth techniques.",
            vi: "Xuất hiện vào đầu thế kỷ 20 tại miền Bắc Việt Nam, phở kết hợp sợi bánh gạo bản địa với kỹ thuật ninh nước dùng bò ảnh hưởng từ Pháp.",
            audioStart: 6.5,
            audioEnd: 14.0,
            vocab: [
              { word: "indigenous", ipa: "/ɪnˈdɪdʒ.ɪ.nəs/", pos: "adj", vi: "bản địa, bản xứ", contextNote: "Originating naturally in a particular region." },
              { word: "broth", ipa: "/brɒθ/", pos: "noun", vi: "nước dùng, nước lèo", contextNote: "Clear soup made by boiling meat or bones." }
            ]
          }
        ]
      },
      {
        id: "p2",
        sentences: [
          {
            id: "s3",
            en: "The secret to an authentic Hanoi Phở lies in its clear, aromatic broth simmered for hours with star anise, cinnamon, and ginger.",
            vi: "Bí quyết của một bát Phở Hà Nội chuẩn vị nằm ở nước dùng trong, thơm lừng được ninh nhiều giờ cùng hoa hồi, quế và gừng nướng.",
            audioStart: 14.0,
            audioEnd: 22.0,
            vocab: [
              { word: "simmered", ipa: "/ˈsɪm.əd/", pos: "verb (past)", vi: "ninh nhừ với lửa nhỏ", contextNote: "Cooked gently just below boiling point." },
              { word: "star anise", ipa: "/ˈstɑːr ˌæn.ɪs/", pos: "noun", vi: "hoa hồi / đại hồi", contextNote: "A star-shaped spice crucial for Phở fragrance." }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "ao-dai-elegance",
    title: "Áo Dài: The Thread of Grace and National Pride",
    titleVi: "Áo Dài: Sợi Chỉ Thướt Tha Và Tự Hào Dân Tộc",
    category: "Heritage",
    cefr: "B2",
    readTimeMinutes: 8,
    hasAudio: true,
    coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    summary: "Trace the century-long evolution of Vietnam's national dress—from ancient royal garments to modern haute couture that celebrates feminine grace.",
    author: "Tran Thi Mai",
    paragraphs: [
      {
        id: "p1",
        sentences: [
          {
            id: "s1",
            en: "The Áo Dài embodies both modesty and understated elegance, hugging the body gently while allowing fluid grace with every step.",
            vi: "Áo Dài thể hiện cả sự kín đáo lẫn vẻ thanh lịch tinh tế, ôm nhẹ thân hình trong khi vẫn tạo nên nét thướt tha uyển chuyển qua từng bước đi.",
            audioStart: 0,
            audioEnd: 7.2,
            vocab: [
              { word: "embodies", ipa: "/ɪmˈbɒd.iz/", pos: "verb", vi: "thể hiện, hiện thân", contextNote: "To represent an idea or quality in a visible form." },
              { word: "understated", ipa: "/ˌʌn.dəˈsteɪ.tɪd/", pos: "adj", vi: "tinh tế, không phô trương", contextNote: "Attractive in a quiet and subtle way." }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "bronze-drum-dong-son",
    title: "Echoes of Eternity: Dong Son Bronze Drums",
    titleVi: "Tiếng Vọng Ngàn Năm: Trống Đồng Đông Sơn",
    category: "History",
    cefr: "C1",
    readTimeMinutes: 10,
    hasAudio: true,
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    summary: "Discover the intricate cosmological engravings and advanced metallurgical techniques of the ancient Lac Viet civilization.",
    author: "Dr. Le Quoc Tuan",
    paragraphs: [
      {
        id: "p1",
        sentences: [
          {
            id: "s1",
            en: "The Dong Son bronze drums stand as monumental masterworks of Southeast Asian prehistory, encapsulating ritual solar cosmology.",
            vi: "Trống đồng Đông Sơn đứng vị thế là kiệt tác vĩ đại của thời tiền sử Đông Nam Á, đúc kết vũ trụ luận mặt trời thần thánh.",
            audioStart: 0,
            audioEnd: 8.0,
            vocab: [
              { word: "encapsulating", ipa: "/ɪnˈkæp.sjə.leɪ.tɪŋ/", pos: "verb", vi: "đúc kết, tóm lược", contextNote: "Expressing the essential features of something succinctly." }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "water-puppet-art",
    title: "Dancing on Water: The Magic of Water Puppetry",
    titleVi: "Múa Trên Làn Nước: Phép Thuật Múa Rối Nước",
    category: "Traditional Arts",
    cefr: "A2",
    readTimeMinutes: 5,
    hasAudio: true,
    coverImage: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
    summary: "Unveil the secret submerged bamboo rods and folk humor behind Northern Vietnam's unique 1,000-year-old theatrical tradition.",
    author: "Pham Hoang Nam",
    paragraphs: [
      {
        id: "p1",
        sentences: [
          {
            id: "s1",
            en: "Water puppetry was invented by rice farmers in the Red River Delta during seasonal floods.",
            vi: "Múa rối nước được sáng tạo bởi nông dân trồng lúa tại Đồng bằng Sông Hồng vào những mùa lũ lụt.",
            audioStart: 0,
            audioEnd: 6.0,
            vocab: [
              { word: "invented", ipa: "/ɪnˈventɪd/", pos: "verb", vi: "sáng tạo, phát minh", contextNote: "Created for the first time." }
            ]
          }
        ]
      }
    ]
  }
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: "fc-1",
    word: "Indigenous",
    ipa: "/ɪnˈdɪdʒ.ɪ.nəs/",
    pos: "adjective",
    vi: "Bản địa, thuộc về gốc rễ nơi sản sinh",
    enSentence: "It blends indigenous rice noodles with French-influenced beef broth.",
    viSentence: "Nó kết hợp sợi bánh gạo bản địa với nước dùng ninh theo kiểu Pháp.",
    articleSource: "The Culinary Soul of Hanoi",
    nextReviewDate: "Today",
    intervalDays: 1,
    easeFactor: 2.5,
    reviewsCount: 3
  },
  {
    id: "fc-2",
    word: "Embodies",
    ipa: "/ɪmˈbɒd.iz/",
    pos: "verb",
    vi: "Hiện thân, thể hiện trọn vẹn bản chất",
    enSentence: "The Áo Dài embodies both modesty and understated elegance.",
    viSentence: "Áo Dài là hiện thân của sự kín đáo và vẻ thanh lịch tinh tế.",
    articleSource: "Áo Dài: Thread of Grace",
    nextReviewDate: "Tomorrow",
    intervalDays: 2,
    easeFactor: 2.4,
    reviewsCount: 4
  },
  {
    id: "fc-3",
    word: "Simmered",
    ipa: "/ˈsɪm.əd/",
    pos: "verb",
    vi: "Ninh nhỏ lửa trong thời gian dài",
    enSentence: "Clear broth simmered for hours with star anise and cinnamon.",
    viSentence: "Nước dùng trong được ninh nhỏ lửa hàng giờ liền với hoa hồi và quế.",
    articleSource: "The Culinary Soul of Hanoi",
    nextReviewDate: "In 3 days",
    intervalDays: 4,
    easeFactor: 2.6,
    reviewsCount: 5
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityEssay[] = [
  {
    id: "post-1",
    authorName: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    title: "My First Bowl of Authentic Hanoi Phở in the Old Quarter",
    excerpt: "Sitting on a tiny blue plastic stool at 6 AM, holding a steaming bowl infused with star anise... I finally understood what Vietnamese 'harmony of flavors' meant.",
    category: "Culinary Reflection",
    likes: 42,
    audioNoteDuration: "01:15",
    badge: "B2 Ambassador",
    date: "2 days ago"
  },
  {
    id: "post-2",
    authorName: "Kenji Sato",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    title: "Comparative Study: Japanese Kimono and Vietnamese Áo Dài",
    excerpt: "While Kimono emphasizes structured formality, Áo Dài celebrates fluid movement and lightness. Here is my bilingual essay breakdown.",
    category: "Cultural Essay Contest",
    likes: 89,
    badge: "C1 Scholar",
    date: "4 days ago"
  }
];
