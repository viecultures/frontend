// Catalog Lesson Interface
export interface Lesson {
  id: string;
  title: string;
  vietnameseTitle: string;
  category: "Heritage" | "Cuisine" | "Crafts" | "Nature" | "Folklore";
  categoryVi: string;
  cefrLevel: "A2" | "B1" | "B2" | "C1";
  readTime: string;
  vocabCount: number;
  summary: string;
  gradient: string;
  iconSymbol: string;
  featured?: boolean;
  dateAdded: string;
}

// Mock Dataset of Vietnamese Cultural Stories
export const LESSONS_DATA: Lesson[] = [
  {
    id: "imperial-hue",
    title: "Exploring Imperial Hue Architecture Through B1 English",
    vietnameseTitle: "Khám Phá Kiến Trúc Cung Đình Huế Qua Tiếng Anh B1",
    category: "Heritage",
    categoryVi: "Lịch Sử & Di Sản",
    cefrLevel: "B1",
    readTime: "8 phút đọc",
    vocabCount: 12,
    summary:
      "Discover the citadel gates, royal tombs, and court cuisine of the Nguyen Dynasty while building academic vocabulary in historical architecture and conservation.",
    gradient: "from-[#1E4B43] via-[#2A665B] to-[#163D37]",
    iconSymbol: "🏛️",
    featured: true,
    dateAdded: "2026-03-15",
  },
  {
    id: "saigon-banh-mi",
    title: "The Story of Saigon Bánh Mì",
    vietnameseTitle: "Hành Trình Bánh Mì Sài Gòn Ra Thế Giới",
    category: "Cuisine",
    categoryVi: "Ẩm Thực & Cà Phê",
    cefrLevel: "B1",
    readTime: "5 phút đọc",
    vocabCount: 8,
    summary:
      "From French baguette to global culinary icon: trace the history behind Vietnam's favorite street food and learn key culinary descriptive adjectives.",
    gradient: "from-[#D9B76A]/90 via-[#C59B48] to-[#9E7728]",
    iconSymbol: "🥖",
    dateAdded: "2026-03-10",
  },
  {
    id: "hoi-an-lanterns",
    title: "Hội An Lantern Festival Traditions",
    vietnameseTitle: "Truyền Thống Đèn Lồng Phố Cổ Hội An",
    category: "Heritage",
    categoryVi: "Lịch Sử & Di Sản",
    cefrLevel: "B1",
    readTime: "7 phút đọc",
    vocabCount: 10,
    summary:
      "Understand full moon rituals, silk craftsmanship, and ancient wooden architecture along the Thu Bồn River using rich descriptive storytelling.",
    gradient: "from-[#E8B7B2]/90 via-[#D69690] to-[#B86E67]",
    iconSymbol: "🏮",
    dateAdded: "2026-03-12",
  },
  {
    id: "bat-trang-pottery",
    title: "Bát Tràng Pottery & Ceramic Arts",
    vietnameseTitle: "Nghệ Thuật Gốm Sứ Làng Cổ Bát Tràng",
    category: "Crafts",
    categoryVi: "Nghệ Thuật & Làng Nghề",
    cefrLevel: "B2",
    readTime: "6 phút đọc",
    vocabCount: 9,
    summary:
      "Explore 700 years of ceramic craftsmanship in a traditional village on the Red River delta while learning terminology for artisan techniques.",
    gradient: "from-[#6E9FA1] via-[#528385] to-[#3B6668]",
    iconSymbol: "🏺",
    dateAdded: "2026-03-08",
  },
  {
    id: "mu-cang-chai",
    title: "Terraced Fields of Mù Cang Chải",
    vietnameseTitle: "Ruộng Bậc Thang Mù Cang Chải Mùa Lúa Chín",
    category: "Nature",
    categoryVi: "Danh Thắng Thiên Nhiên",
    cefrLevel: "B1",
    readTime: "5 phút đọc",
    vocabCount: 7,
    summary:
      "Journey through the golden harvest season in northern highlands and discover the ecological wisdom of ethnic minority communities.",
    gradient: "from-[#2A665B] via-[#4A887C] to-[#1E4B43]",
    iconSymbol: "🌾",
    dateAdded: "2026-03-05",
  },
  {
    id: "egg-coffee",
    title: "Vietnamese Egg Coffee Legacy",
    vietnameseTitle: "Huyền Thoại Cà Phê Trứng Hà Nội",
    category: "Cuisine",
    categoryVi: "Ẩm Thực & Cà Phê",
    cefrLevel: "B2",
    readTime: "4 phút đọc",
    vocabCount: 6,
    summary:
      "How wartime necessity birthed a world-renowned coffee innovation in 1946 Old Quarter Hanoi. Practice narrative tenses and passive voice.",
    gradient: "from-[#C59B48] via-[#A87E2D] to-[#78571B]",
    iconSymbol: "☕",
    dateAdded: "2026-03-14",
  },
  {
    id: "water-puppetry",
    title: "Water Puppetry & Village Legends",
    vietnameseTitle: "Múa Rối Nước & Truyền Thuyết Làng Quê",
    category: "Folklore",
    categoryVi: "Lễ Hội & Tín Ngưỡng",
    cefrLevel: "B1",
    readTime: "8 phút đọc",
    vocabCount: 11,
    summary:
      "Step into the flooded rice paddies of Northern Vietnam to discover a unique thousand-year-old performing art and folk mythology.",
    gradient: "from-[#9FCED8] via-[#75B2C0] to-[#488E9E]",
    iconSymbol: "🎭",
    dateAdded: "2026-03-01",
  },
  {
    id: "sword-lake-legend",
    title: "The Legend of Sword Lake & Golden Turtle",
    vietnameseTitle: "Sự Tích Hoàn Kiếm & Rùa Vàng",
    category: "Folklore",
    categoryVi: "Lễ Hội & Tín Ngưỡng",
    cefrLevel: "A2",
    readTime: "4 phút đọc",
    vocabCount: 5,
    summary:
      "Revisit King Le Loi's mythical sword and the sacred turtle of Hanoi in accessible A2 English tailored for foundational learners.",
    gradient: "from-[#E8B7B2] via-[#C88A84] to-[#995852]",
    iconSymbol: "🐢",
    dateAdded: "2026-02-28",
  },
  {
    id: "ao-dai-weaving",
    title: "The Art of Vietnamese Áo Dài Silk Weaving",
    vietnameseTitle: "Nghệ Thuật Dệt Lụa & Áo Dài Truyền Thống",
    category: "Crafts",
    categoryVi: "Nghệ Thuật & Làng Nghề",
    cefrLevel: "B2",
    readTime: "7 phút đọc",
    vocabCount: 10,
    summary:
      "Trace the evolution of the national garment from Royal court attire to modern high fashion, exploring textile and design terminology.",
    gradient: "from-[#D9B76A] via-[#B89240] to-[#806120]",
    iconSymbol: "👘",
    dateAdded: "2026-03-03",
  },
  {
    id: "trang-an-caves",
    title: "Tràng An Landscape Complex & Cave Secrets",
    vietnameseTitle: "Quần Thể Danh Thắng Tràng An & Bí Ẩn Hang Động",
    category: "Nature",
    categoryVi: "Danh Thắng Thiên Nhiên",
    cefrLevel: "C1",
    readTime: "9 phút đọc",
    vocabCount: 14,
    summary:
      "Explore UNESCO dual heritage karst mountains, ancient temples, and subterranean rivers using advanced C1 academic vocabulary.",
    gradient: "from-[#1E4B43] via-[#336F64] to-[#143630]",
    iconSymbol: "⛰️",
    dateAdded: "2026-03-16",
  },
  {
    id: "son-doong-expedition",
    title: "Sơn Đoòng: Expedition Into the World's Largest Cave",
    vietnameseTitle: "Sơn Đoòng: Hành Trình Thám Hiểm Hang Động Lớn Nhất Thế Giới",
    category: "Nature",
    categoryVi: "Danh Thắng Thiên Nhiên",
    cefrLevel: "C1",
    readTime: "10 phút đọc",
    vocabCount: 16,
    summary:
      "Descend into Phong Nha-Kẻ Bàng's underground jungle ecosystem, giant stalagmites, and subterranean clouds with C1 geological terms.",
    gradient: "from-[#1B3B36] via-[#2A5C54] to-[#0F2623]",
    iconSymbol: "🦇",
    dateAdded: "2026-03-18",
  },
  {
    id: "vietnamese-tea-culture",
    title: "The Mindful Art of Vietnamese Lotus Tea",
    vietnameseTitle: "Nghệ Thuật Thưởng Trà Sen Tây Hồ Tinh Tế",
    category: "Cuisine",
    categoryVi: "Ẩm Thực & Cà Phê",
    cefrLevel: "B1",
    readTime: "6 phút đọc",
    vocabCount: 8,
    summary:
      "Discover the delicate scenting ritual of West Lake lotus tea and mindfulness traditions passed down through generations in Hanoi.",
    gradient: "from-[#88A870] via-[#5D8045] to-[#395325]",
    iconSymbol: "🫖",
    dateAdded: "2026-03-17",
  },
  {
    id: "tet-festivities",
    title: "Tết Nguyên Đán: Traditions & Spring Rituals",
    vietnameseTitle: "Tết Nguyên Đán: Phong Tục & Nghi Lễ Mùa Xuân",
    category: "Folklore",
    categoryVi: "Lễ Hội & Tín Ngưỡng",
    cefrLevel: "B1",
    readTime: "8 phút đọc",
    vocabCount: 12,
    summary:
      "Uncover ancestor veneration, peach blossoms, lucky money envelope customs, and family reunion feasts in traditional lunar new year.",
    gradient: "from-[#C93B3B] via-[#9E2B2B] to-[#691818]",
    iconSymbol: "🧧",
    dateAdded: "2026-03-19",
  },
  {
    id: "dong-ho-paintings",
    title: "Đông Hồ Folk Woodblock Paintings",
    vietnameseTitle: "Tranh Dân Gian Đông Hồ Dùng Màu Tự Nhiên",
    category: "Crafts",
    categoryVi: "Nghệ Thuật & Làng Nghề",
    cefrLevel: "A2",
    readTime: "5 phút đọc",
    vocabCount: 7,
    summary:
      "Discover natural mineral pigments, seashell paper (giấy điệp), and rustic folk humor depicted in historic Bac Ninh woodcut prints.",
    gradient: "from-[#C57B48] via-[#A85F2D] to-[#783E1B]",
    iconSymbol: "🎨",
    dateAdded: "2026-03-20",
  },
  {
    id: "ha-long-bay",
    title: "Ha Long Bay: Myths of the Descending Dragon",
    vietnameseTitle: "Vịnh Hạ Long: Truyền Thuyết Rồng Đáp Xuống Biển",
    category: "Nature",
    categoryVi: "Danh Thắng Thiên Nhiên",
    cefrLevel: "B2",
    readTime: "7 phút đọc",
    vocabCount: 10,
    summary:
      "Sail between thousands of limestone islets, emerald sea waters, and ancient fishing villages while mastering natural geographic terms.",
    gradient: "from-[#2A665B] via-[#488E9E] to-[#1E4B43]",
    iconSymbol: "🐉",
    dateAdded: "2026-03-21",
  },
  {
    id: "pho-hanoi-history",
    title: "Hanoi Phở: The Soul of Vietnamese Culinary Heritage",
    vietnameseTitle: "Phở Hà Nội: Linh Hồn Ẩm Thực Đất Kinh Kỳ",
    category: "Cuisine",
    categoryVi: "Ẩm Thực & Cà Phê",
    cefrLevel: "B1",
    readTime: "6 phút đọc",
    vocabCount: 9,
    summary:
      "Trace the century-old origin of beef broth infusion, star anise spices, and artisanal rice noodles in traditional street food stalls.",
    gradient: "from-[#C59B48] via-[#8C6422] to-[#5C3F11]",
    iconSymbol: "🍜",
    dateAdded: "2026-03-22",
  },
  {
    id: "my-son-sanctuary",
    title: "Mỹ Sơn Sanctuary: Ancient Champa Kingdom Brick Temples",
    vietnameseTitle: "Thánh Địa Mỹ Sơn: Ngôi Đền Gạch Cổ Vương Quốc Chăm Pa",
    category: "Heritage",
    categoryVi: "Lịch Sử & Di Sản",
    cefrLevel: "B2",
    readTime: "8 phút đọc",
    vocabCount: 12,
    summary:
      "Uncover the mystery of mortarless brick construction techniques and Hindu iconography nestled in Quang Nam valley.",
    gradient: "from-[#8B4513] via-[#A0522D] to-[#5A2A0C]",
    iconSymbol: "🛕",
    dateAdded: "2026-03-23",
  },
  {
    id: "floating-markets-mekong",
    title: "Cái Răng Floating Market & River Life in Mekong Delta",
    vietnameseTitle: "Chợ Nổi Cái Răng & Nhịp Sống Sông Nước Miền Tây",
    category: "Nature",
    categoryVi: "Danh Thắng Thiên Nhiên",
    cefrLevel: "B1",
    readTime: "6 phút đọc",
    vocabCount: 8,
    summary:
      "Experience early morning boat trading, bamboo sample poles (cây bẹo), and tropical fruit orchards along the Mekong tributaries.",
    gradient: "from-[#3B7A57] via-[#2E5A44] to-[#18392B]",
    iconSymbol: "🚣",
    dateAdded: "2026-03-24",
  },
  {
    id: "quan-ho-singing",
    title: "Bắc Ninh Quan Họ Folk Singing Traditions",
    vietnameseTitle: "Dân Ca Quan Họ Bắc Ninh & Tình Người Đất Kinh Bắc",
    category: "Folklore",
    categoryVi: "Lễ Hội & Tín Ngưỡng",
    cefrLevel: "B1",
    readTime: "7 phút đọc",
    vocabCount: 10,
    summary:
      "Discover antiphonal vocal duets, nón quai thao hats, and cultural hospitality of traditional village singing festivals.",
    gradient: "from-[#7A4B7A] via-[#5C325C] to-[#3B1C3B]",
    iconSymbol: "🎶",
    dateAdded: "2026-03-25",
  },
  {
    id: "non-la-culture",
    title: "Nón Lá: The Symbolic Craft of Vietnamese Conical Hats",
    vietnameseTitle: "Nón Lá: Biểu Tượng Duyên Dáng Của Làng Nghề Việt",
    category: "Crafts",
    categoryVi: "Nghệ Thuật & Làng Nghề",
    cefrLevel: "A2",
    readTime: "5 phút đọc",
    vocabCount: 6,
    summary:
      "Explore dried palm leaf selection, bamboo stitching, and poetic poem-hats (nón bài thơ) from traditional villages in Hue.",
    gradient: "from-[#A89F68] via-[#7D7545] to-[#4F4A28]",
    iconSymbol: "👒",
    dateAdded: "2026-03-26",
  },
  {
    id: "gong-culture-tay-nguyen",
    title: "The Sacred Space of Gong Culture in Central Highlands",
    vietnameseTitle: "Không Gian Văn Hóa Cồng Chiêng Tây Nguyên Sacred",
    category: "Heritage",
    categoryVi: "Lịch Sử & Di Sản",
    cefrLevel: "B2",
    readTime: "9 phút đọc",
    vocabCount: 13,
    summary:
      "Immerse yourself in UNESCO intangible heritage, communal stilt houses, and spiritual musical rituals of ethnic minorities.",
    gradient: "from-[#8C3A2B] via-[#66281D] to-[#42160F]",
    iconSymbol: "🥁",
    dateAdded: "2026-03-27",
  },
  {
    id: "nem-ran-spring-rolls",
    title: "Nem Rán: The Crispy Tradition of Vietnamese Spring Rolls",
    vietnameseTitle: "Nem Rán Truyền Thống: Món Ăn Không Thể Thiếu Ngày Tết",
    category: "Cuisine",
    categoryVi: "Ẩm Thực & Cà Phê",
    cefrLevel: "A2",
    readTime: "4 phút đọc",
    vocabCount: 5,
    summary:
      "Learn culinary vocabulary for minced pork, wood ear mushrooms, rice paper wrapping, and golden deep-frying techniques.",
    gradient: "from-[#B87D2B] via-[#875817] to-[#57360A]",
    iconSymbol: "🥟",
    dateAdded: "2026-03-28",
  },
];

// Helper to get CEFR Badge Styles
export const getCefrBadgeStyle = (level: string) => {
  switch (level) {
    case "A2":
      return "bg-emerald-600/90 text-emerald-50 border-emerald-400/40";
    case "B1":
      return "bg-cyan-700/90 text-cyan-50 border-cyan-400/40";
    case "B2":
      return "bg-[#D9B76A] text-[#1E4B43] border-[#B89240]";
    case "C1":
      return "bg-rose-700/90 text-rose-50 border-rose-400/40";
    default:
      return "bg-slate-700 text-slate-100 border-slate-500/40";
  }
};

// Topic Options with Icons
export const TOPIC_OPTIONS = [
  { label: "Tất cả bài học", value: "All", icon: "📚" },
  { label: "Lịch sử & Di sản", value: "Heritage", icon: "🏛️" },
  { label: "Ẩm thực & Cà phê", value: "Cuisine", icon: "🥖" },
  { label: "Nghệ thuật & Làng nghề", value: "Crafts", icon: "🏺" },
  { label: "Danh thắng Thiên nhiên", value: "Nature", icon: "🌾" },
  { label: "Lễ hội & Tín ngưỡng", value: "Folklore", icon: "🎭" },
];

// CEFR Levels
export const CEFR_LEVELS = ["All", "A2", "B1", "B2", "C1"];

// Quick Search Tags
export const QUICK_SEARCH_TAGS = [
  { label: "Huế", query: "Huế" },
  { label: "Bánh Mì", query: "Bánh Mì" },
  { label: "Gốm Sứ", query: "Gốm" },
  { label: "Cà Phê", query: "Cà Phê" },
  { label: "Áo Dài", query: "Áo Dài" },
  { label: "Trà Sen", query: "Trà" },
  { label: "Sơn Đoòng", query: "Sơn Đoòng" },
  { label: "Tết", query: "Tết" },
  { label: "Đông Hồ", query: "Đông Hồ" },
];
