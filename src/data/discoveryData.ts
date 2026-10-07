import type { Level } from '@/types';

// Catalog Lesson Interface
export type LevelType = 'Level 1' | 'Level 2' | 'Level 3';

export interface LevelDetail {
  readTime: string;
  vocabCount: number;
  wordCount?: number;
  summary?: string;
}

export interface Lesson {
  id: string;
  title: string;
  vietnameseTitle: string;
  category: "Heritage" | "Cuisine" | "Crafts" | "Nature" | "Folklore";
  categoryVi: string;
  cefrLevel: LevelType;
  availableLevels: LevelType[];
  levelDetails: Record<LevelType, LevelDetail>;
  readTime: string;
  vocabCount: number;
  summary: string;
  gradient: string;
  iconSymbol: string;
  imageUrl?: string;
  featured?: boolean;
  dateAdded: string;
}

export const DEFAULT_AVAILABLE_LEVELS: LevelType[] = ['Level 1', 'Level 2', 'Level 3'];

// Helper to get Level-specific stats
export function getLessonStatsForLevel(lesson: Lesson, level?: string): {
  readTime: string;
  vocabCount: number;
  cefrLevel: LevelType;
} {
  const targetLevel: LevelType =
    level && level !== 'All' && ['Level 1', 'Level 2', 'Level 3'].includes(level)
      ? (level as LevelType)
      : lesson.cefrLevel || 'Level 2';

  const detail = lesson.levelDetails?.[targetLevel];
  if (detail) {
    return {
      readTime: detail.readTime,
      vocabCount: detail.vocabCount,
      cefrLevel: targetLevel,
    };
  }

  if (targetLevel === 'Level 1') {
    return { readTime: '4 phút đọc', vocabCount: 6, cefrLevel: 'Level 1' };
  }
  if (targetLevel === 'Level 3') {
    return { readTime: '10 phút đọc', vocabCount: 14, cefrLevel: 'Level 3' };
  }
  return { readTime: lesson.readTime, vocabCount: lesson.vocabCount, cefrLevel: 'Level 2' };
}

// Mock Dataset of Vietnamese Cultural Stories with Full 3-Level Support
export const LESSONS_DATA: Lesson[] = [
  {
    id: "nem-ran-spring-rolls",
    title: "Nem Rán: The Crispy Tradition of Vietnamese Spring Rolls",
    vietnameseTitle: "Nem Rán Truyền Thống: Món Ăn Không Thể Thiếu Ngày Tết",
    category: "Cuisine",
    categoryVi: "Ẩm Thực & Cà Phê",
    cefrLevel: "Level 1",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '4 phút đọc', vocabCount: 5, summary: 'Learn culinary vocabulary for minced pork, wood ear mushrooms, rice paper wrapping, and golden deep-frying techniques.' },
      'Level 2': { readTime: '6 phút đọc', vocabCount: 8, summary: 'Explore family kitchen traditions, wood ear mushrooms, dipping fish sauce, and Tet banquet customs.' },
      'Level 3': { readTime: '9 phút đọc', vocabCount: 12, summary: 'Analyze regional distinctions (Nem Ran vs Cha Gio), rice paper hydration science, and celebratory dining.' },
    },
    readTime: "4 phút đọc",
    vocabCount: 5,
    summary:
      "Learn culinary vocabulary for minced pork, wood ear mushrooms, rice paper wrapping, and golden deep-frying techniques.",
    gradient: "from-[#B87D2B] via-[#875817] to-[#57360A]",
    iconSymbol: "UtensilsCrossed",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-28",
  },
  {
    id: "gong-culture-tay-nguyen",
    title: "The Sacred Space of Gong Culture in Central Highlands",
    vietnameseTitle: "Không Gian Văn Hóa Cồng Chiêng Tây Nguyên Sacred",
    category: "Heritage",
    categoryVi: "Lịch Sử & Di Sản",
    cefrLevel: "Level 2",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '5 phút đọc', vocabCount: 7, summary: 'Hear metallic gong rhythms resonating around evening campfires in highland stilt houses.' },
      'Level 2': { readTime: '9 phút đọc', vocabCount: 13, summary: 'Immerse yourself in UNESCO intangible heritage, communal stilt houses, and spiritual musical rituals of ethnic minorities.' },
      'Level 3': { readTime: '12 phút đọc', vocabCount: 16, summary: 'Investigate Bronze acoustic properties, matriarchal village organization, and animist ritual cosmology.' },
    },
    readTime: "9 phút đọc",
    vocabCount: 13,
    summary:
      "Immerse yourself in UNESCO intangible heritage, communal stilt houses, and spiritual musical rituals of ethnic minorities.",
    gradient: "from-[#8C3A2B] via-[#66281D] to-[#42160F]",
    iconSymbol: "Landmark",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-27",
  },
  {
    id: "non-la-culture",
    title: "Nón Lá: The Symbolic Craft of Vietnamese Conical Hats",
    vietnameseTitle: "Nón Lá: Biểu Tượng Duyên Dáng Của Làng Nghề Việt",
    category: "Crafts",
    categoryVi: "Nghệ Thuật & Làng Nghề",
    cefrLevel: "Level 1",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '5 phút đọc', vocabCount: 6, summary: 'Explore dried palm leaf selection, bamboo stitching, and poetic poem-hats (nón bài thơ) from traditional villages in Hue.' },
      'Level 2': { readTime: '7 phút đọc', vocabCount: 9, summary: 'Discover delicate craftsmanship, bamboo split needles, and cultural poetry woven between palm layers.' },
      'Level 3': { readTime: '10 phút đọc', vocabCount: 13, summary: 'Study botanical drying chemistry, regional hat typology (nón chóp, quai thao), and cultural identity.' },
    },
    readTime: "5 phút đọc",
    vocabCount: 6,
    summary:
      "Explore dried palm leaf selection, bamboo stitching, and poetic poem-hats (nón bài thơ) from traditional villages in Hue.",
    gradient: "from-[#A89F68] via-[#7D7545] to-[#4F4A28]",
    iconSymbol: "Palette",
    imageUrl: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-26",
  },
  {
    id: "quan-ho-singing",
    title: "Bắc Ninh Quan Họ Folk Singing Traditions",
    vietnameseTitle: "Dân Ca Quan Họ Bắc Ninh & Tình Người Đất Kinh Bắc",
    category: "Folklore",
    categoryVi: "Lễ Hội & Tín Ngưỡng",
    cefrLevel: "Level 2",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '4 phút đọc', vocabCount: 6, summary: 'Learn musical words: sweet singing voices, traditional scarves, and hospitable greetings.' },
      'Level 2': { readTime: '7 phút đọc', vocabCount: 10, summary: 'Discover antiphonal vocal duets, nón quai thao hats, and cultural hospitality of traditional village singing festivals.' },
      'Level 3': { readTime: '10 phút đọc', vocabCount: 15, summary: 'Examine ethnomusicological vocal ornamentation, kinship village pacts, and UNESCO preservation.' },
    },
    readTime: "7 phút đọc",
    vocabCount: 10,
    summary:
      "Discover antiphonal vocal duets, nón quai thao hats, and cultural hospitality of traditional village singing festivals.",
    gradient: "from-[#7A4B7A] via-[#5C325C] to-[#3B1C3B]",
    iconSymbol: "Sparkles",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-25",
  },
  {
    id: "floating-markets-mekong",
    title: "Cái Răng Floating Market & River Life in Mekong Delta",
    vietnameseTitle: "Chợ Nổi Cái Răng & Nhịp Sống Sông Nước Miền Tây",
    category: "Nature",
    categoryVi: "Danh Thắng Thiên Nhiên",
    cefrLevel: "Level 2",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '4 phút đọc', vocabCount: 5, summary: 'Learn words for wooden boats, sweet pineapples, watermelons, and morning waves.' },
      'Level 2': { readTime: '6 phút đọc', vocabCount: 8, summary: 'Experience early morning boat trading, bamboo sample poles (cây bẹo), and tropical fruit orchards along the Mekong tributaries.' },
      'Level 3': { readTime: '9 phút đọc', vocabCount: 13, summary: 'Examine delta fluvial transport networks, climate vulnerability, and commercial modernization.' },
    },
    readTime: "6 phút đọc",
    vocabCount: 8,
    summary:
      "Experience early morning boat trading, bamboo sample poles (cây bẹo), and tropical fruit orchards along the Mekong tributaries.",
    gradient: "from-[#3B7A57] via-[#2E5A44] to-[#18392B]",
    iconSymbol: "Mountain",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-24",
  },
  {
    id: "my-son-sanctuary",
    title: "Mỹ Sơn Sanctuary: Ancient Champa Kingdom Brick Temples",
    vietnameseTitle: "Thánh Địa Mỹ Sơn: Ngôi Đền Gạch Cổ Vương Quốc Chăm Pa",
    category: "Heritage",
    categoryVi: "Lịch Sử & Di Sản",
    cefrLevel: "Level 2",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '4 phút đọc', vocabCount: 6, summary: 'Discover mysterious red brick towers and stone sculptures hidden in a peaceful valley.' },
      'Level 2': { readTime: '8 phút đọc', vocabCount: 12, summary: 'Uncover the mystery of mortarless brick construction techniques and Hindu iconography nestled in Quang Nam valley.' },
      'Level 3': { readTime: '11 phút đọc', vocabCount: 16, summary: 'Evaluate Champa epigraphy, Shaivite temple architecture, and post-war archaeological restoration.' },
    },
    readTime: "8 phút đọc",
    vocabCount: 12,
    summary:
      "Uncover the mystery of mortarless brick construction techniques and Hindu iconography nestled in Quang Nam valley.",
    gradient: "from-[#8B4513] via-[#A0522D] to-[#5A2A0C]",
    iconSymbol: "Landmark",
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-23",
  },
  {
    id: "pho-hanoi-history",
    title: "Hanoi Phở: The Soul of Vietnamese Culinary Heritage",
    vietnameseTitle: "Phở Hà Nội: Linh Hồn Ẩm Thực Đất Kinh Kỳ",
    category: "Cuisine",
    categoryVi: "Ẩm Thực & Cà Phê",
    cefrLevel: "Level 2",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '3 phút đọc', vocabCount: 5, summary: 'Learn words for clear steaming broth, tender beef slices, fresh noodles, and lime.' },
      'Level 2': { readTime: '6 phút đọc', vocabCount: 9, summary: 'Trace the century-old origin of beef broth infusion, star anise spices, and artisanal rice noodles in traditional street food stalls.' },
      'Level 3': { readTime: '9 phút đọc', vocabCount: 14, summary: 'Analyze culinary linguistics (gánh phở), urban food evolution, and national brand diplomacy.' },
    },
    readTime: "6 phút đọc",
    vocabCount: 9,
    summary:
      "Trace the century-old origin of beef broth infusion, star anise spices, and artisanal rice noodles in traditional street food stalls.",
    gradient: "from-[#C59B48] via-[#8C6422] to-[#5C3F11]",
    iconSymbol: "UtensilsCrossed",
    imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-22",
  },
  {
    id: "ha-long-bay",
    title: "Ha Long Bay: Myths of the Descending Dragon",
    vietnameseTitle: "Vịnh Hạ Long: Truyền Thuyết Rồng Đáp Xuống Biển",
    category: "Nature",
    categoryVi: "Danh Thắng Thiên Nhiên",
    cefrLevel: "Level 2",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '4 phút đọc', vocabCount: 6, summary: 'Vocabulary for green islands, floating fishing houses, emerald water, and sea caves.' },
      'Level 2': { readTime: '7 phút đọc', vocabCount: 10, summary: 'Sail between thousands of limestone islets, emerald sea waters, and ancient fishing villages while mastering natural geographic terms.' },
      'Level 3': { readTime: '10 phút đọc', vocabCount: 15, summary: 'Study drowned fengcong karst systems, biodiversity sanctuaries, and sustainable tourism policy.' },
    },
    readTime: "7 phút đọc",
    vocabCount: 10,
    summary:
      "Sail between thousands of limestone islets, emerald sea waters, and ancient fishing villages while mastering natural geographic terms.",
    gradient: "from-[#2A665B] via-[#488E9E] to-[#1E4B43]",
    iconSymbol: "Mountain",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-21",
  },
  {
    id: "dong-ho-paintings",
    title: "Đông Hồ Folk Woodblock Paintings",
    vietnameseTitle: "Tranh Dân Gian Đông Hồ Dùng Màu Tự Nhiên",
    category: "Crafts",
    categoryVi: "Nghệ Thuật & Làng Nghề",
    cefrLevel: "Level 1",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '5 phút đọc', vocabCount: 7, summary: 'Discover natural mineral pigments, seashell paper (giấy điệp), and rustic folk humor depicted in historic Bac Ninh woodcut prints.' },
      'Level 2': { readTime: '7 phút đọc', vocabCount: 10, summary: 'Learn how craft masters carve woodblocks depicting fat pigs, brave roosters, and wedding mice.' },
      'Level 3': { readTime: '10 phút đọc', vocabCount: 14, summary: 'Critique folk agrarian satire, woodcut printing philology, and craft revival initiatives.' },
    },
    readTime: "5 phút đọc",
    vocabCount: 7,
    summary:
      "Discover natural mineral pigments, seashell paper (giấy điệp), and rustic folk humor depicted in historic Bac Ninh woodcut prints.",
    gradient: "from-[#C57B48] via-[#A85F2D] to-[#783E1B]",
    iconSymbol: "Palette",
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-20",
  },
  {
    id: "tet-festivities",
    title: "Tết Nguyên Đán: Traditions & Spring Rituals",
    vietnameseTitle: "Tết Nguyên Đán: Phong Tục & Nghi Lễ Mùa Xuân",
    category: "Folklore",
    categoryVi: "Lễ Hội & Tín Ngưỡng",
    cefrLevel: "Level 2",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '4 phút đọc', vocabCount: 6, summary: 'Learn holiday words: red envelopes, sticky rice cake (bánh chưng), and family reunions.' },
      'Level 2': { readTime: '8 phút đọc', vocabCount: 12, summary: 'Uncover ancestor veneration, peach blossoms, lucky money envelope customs, and family reunion feasts in traditional lunar new year.' },
      'Level 3': { readTime: '11 phút đọc', vocabCount: 16, summary: 'Evaluate East Asian agricultural solar calendars, cosmological renewals, and ritual syncretism.' },
    },
    readTime: "8 phút đọc",
    vocabCount: 12,
    summary:
      "Uncover ancestor veneration, peach blossoms, lucky money envelope customs, and family reunion feasts in traditional lunar new year.",
    gradient: "from-[#C93B3B] via-[#9E2B2B] to-[#691818]",
    iconSymbol: "Sparkles",
    imageUrl: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-19",
  },
  {
    id: "son-doong-expedition",
    title: "Sơn Đoòng: Expedition Into the World's Largest Cave",
    vietnameseTitle: "Sơn Đoòng: Hành Trình Thám Hiểm Hang Động Lớn Nhất Thế Giới",
    category: "Nature",
    categoryVi: "Danh Thắng Thiên Nhiên",
    cefrLevel: "Level 3",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '5 phút đọc', vocabCount: 7, summary: 'Learn words for giant underground rooms, subterranean rivers, and ancient fossils.' },
      'Level 2': { readTime: '8 phút đọc', vocabCount: 11, summary: 'Trek with cave experts through primeval doline jungles and climb the Great Wall of Vietnam.' },
      'Level 3': { readTime: '10 phút đọc', vocabCount: 16, summary: 'Descend into Phong Nha-Kẻ Bàng underground jungle ecosystem, giant stalagmites, and subterranean clouds with Level 3 geological terms.' },
    },
    readTime: "10 phút đọc",
    vocabCount: 16,
    summary:
      "Descend into Phong Nha-Kẻ Bàng's underground jungle ecosystem, giant stalagmites, and subterranean clouds with Level 3 geological terms.",
    gradient: "from-[#1B3B36] via-[#2A5C54] to-[#0F2623]",
    iconSymbol: "Mountain",
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-18",
  },
  {
    id: "vietnamese-tea-culture",
    title: "The Mindful Art of Vietnamese Lotus Tea",
    vietnameseTitle: "Nghệ Thuật Thưởng Trà Sen Tây Hồ Tinh Tế",
    category: "Cuisine",
    categoryVi: "Ẩm Thực & Cà Phê",
    cefrLevel: "Level 2",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '3 phút đọc', vocabCount: 5, summary: 'Simple vocabulary for picking morning lotus blossoms, tea leaves, and gentle aroma.' },
      'Level 2': { readTime: '6 phút đọc', vocabCount: 8, summary: 'Discover the delicate scenting ritual of West Lake lotus tea and mindfulness traditions passed down through generations in Hanoi.' },
      'Level 3': { readTime: '9 phút đọc', vocabCount: 13, summary: 'Study botanical infusion chemistry, scholar-gentleman tea philosophies, and artisanal economics.' },
    },
    readTime: "6 phút đọc",
    vocabCount: 8,
    summary:
      "Discover the delicate scenting ritual of West Lake lotus tea and mindfulness traditions passed down through generations in Hanoi.",
    gradient: "from-[#88A870] via-[#5D8045] to-[#395325]",
    iconSymbol: "UtensilsCrossed",
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-17",
  },
  {
    id: "trang-an-caves",
    title: "Tràng An Landscape Complex & Cave Secrets",
    vietnameseTitle: "Quần Thể Danh Thắng Tràng An & Bí Ẩn Hang Động",
    category: "Nature",
    categoryVi: "Danh Thắng Thiên Nhiên",
    cefrLevel: "Level 3",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '4 phút đọc', vocabCount: 6, summary: 'Enjoy gentle boat rides under low cave ceilings and towering green limestone cliffs.' },
      'Level 2': { readTime: '7 phút đọc', vocabCount: 10, summary: 'Discover prehistoric human settlements, karst hydrology, and ancient Tran dynasty temples.' },
      'Level 3': { readTime: '9 phút đọc', vocabCount: 14, summary: 'Explore UNESCO dual heritage karst mountains, ancient temples, and subterranean rivers using advanced Level 3 academic vocabulary.' },
    },
    readTime: "9 phút đọc",
    vocabCount: 14,
    summary:
      "Explore UNESCO dual heritage karst mountains, ancient temples, and subterranean rivers using advanced Level 3 academic vocabulary.",
    gradient: "from-[#1E4B43] via-[#336F64] to-[#143630]",
    iconSymbol: "Mountain",
    imageUrl: "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-16",
  },
  {
    id: "imperial-hue",
    title: "Exploring Imperial Hue Architecture",
    vietnameseTitle: "Khám Phá Kiến Trúc Cung Đình Huế",
    category: "Heritage",
    categoryVi: "Lịch Sử & Di Sản",
    cefrLevel: "Level 2",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '4 phút đọc', vocabCount: 6, summary: 'Learn basic words about the ancient royal citadel, dragons, and palace gates of Hue.' },
      'Level 2': { readTime: '8 phút đọc', vocabCount: 12, summary: 'Discover the citadel gates, royal tombs, and court cuisine of the Nguyen Dynasty while building academic vocabulary in historical architecture and conservation.' },
      'Level 3': { readTime: '11 phút đọc', vocabCount: 16, summary: 'Deep-dive into Nguyen Dynasty geomancy, restoration ethics, and intangible court music heritage.' },
    },
    readTime: "8 phút đọc",
    vocabCount: 12,
    summary:
      "Discover the citadel gates, royal tombs, and court cuisine of the Nguyen Dynasty while building academic vocabulary in historical architecture and conservation.",
    gradient: "from-[#1E4B43] via-[#2A665B] to-[#163D37]",
    iconSymbol: "Landmark",
    imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
    featured: true,
    dateAdded: "2026-03-15",
  },
  {
    id: "egg-coffee",
    title: "Vietnamese Egg Coffee Legacy",
    vietnameseTitle: "Huyền Thoại Cà Phê Trứng Hà Nội",
    category: "Cuisine",
    categoryVi: "Ẩm Thực & Cà Phê",
    cefrLevel: "Level 2",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '3 phút đọc', vocabCount: 5, summary: 'Learn simple verbs and nouns to describe fluffy whipped egg yolks and dark coffee.' },
      'Level 2': { readTime: '4 phút đọc', vocabCount: 6, summary: 'How wartime necessity birthed a world-renowned coffee innovation in 1946 Old Quarter Hanoi. Practice narrative tenses and passive voice.' },
      'Level 3': { readTime: '8 phút đọc', vocabCount: 11, summary: 'Analyze culinary adaptation during French colonial embargoes and Hanoi cafe sociology.' },
    },
    readTime: "4 phút đọc",
    vocabCount: 6,
    summary:
      "How wartime necessity birthed a world-renowned coffee innovation in 1946 Old Quarter Hanoi. Practice narrative tenses and passive voice.",
    gradient: "from-[#C59B48] via-[#A87E2D] to-[#78571B]",
    iconSymbol: "UtensilsCrossed",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-14",
  },
  {
    id: "hoi-an-lanterns",
    title: "Hội An Lantern Festival Traditions",
    vietnameseTitle: "Truyền Thống Đèn Lồng Phố Cổ Hội An",
    category: "Heritage",
    categoryVi: "Lịch Sử & Di Sản",
    cefrLevel: "Level 2",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '4 phút đọc', vocabCount: 6, summary: 'Explore colorful silk lanterns glowing along the quiet old river in Hoi An.' },
      'Level 2': { readTime: '7 phút đọc', vocabCount: 10, summary: 'Understand full moon rituals, silk craftsmanship, and ancient wooden architecture along the Thu Bồn River using rich descriptive storytelling.' },
      'Level 3': { readTime: '10 phút đọc', vocabCount: 15, summary: 'Critique maritime trading post history, Sino-Japanese architectural syncretism, and living conservation.' },
    },
    readTime: "7 phút đọc",
    vocabCount: 10,
    summary:
      "Understand full moon rituals, silk craftsmanship, and ancient wooden architecture along the Thu Bồn River using rich descriptive storytelling.",
    gradient: "from-[#E8B7B2]/90 via-[#D69690] to-[#B86E67]",
    iconSymbol: "Flame",
    imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-12",
  },
  {
    id: "saigon-banh-mi",
    title: "The Story of Saigon Bánh Mì",
    vietnameseTitle: "Hành Trình Bánh Mì Sài Gòn Ra Thế Giới",
    category: "Cuisine",
    categoryVi: "Ẩm Thực & Cà Phê",
    cefrLevel: "Level 2",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '3 phút đọc', vocabCount: 5, summary: 'Learn food words: crispy crust, pate, pickled carrots, and cilantro in Saigon street food.' },
      'Level 2': { readTime: '5 phút đọc', vocabCount: 8, summary: 'From French baguette to global culinary icon: trace the history behind Vietnam favorite street food and learn key culinary descriptive adjectives.' },
      'Level 3': { readTime: '9 phút đọc', vocabCount: 13, summary: 'Analyze culinary fusion, post-colonial gastronomy, and the global diaspora of Vietnamese cuisine.' },
    },
    readTime: "5 phút đọc",
    vocabCount: 8,
    summary:
      "From French baguette to global culinary icon: trace the history behind Vietnam's favorite street food and learn key culinary descriptive adjectives.",
    gradient: "from-[#D9B76A]/90 via-[#C59B48] to-[#9E7728]",
    iconSymbol: "UtensilsCrossed",
    imageUrl: "https://images.unsplash.com/photo-1626804475297-41608e074eb1?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-10",
  },
  {
    id: "bat-trang-pottery",
    title: "Bát Tràng Pottery & Ceramic Arts",
    vietnameseTitle: "Nghệ Thuật Gốm Sứ Làng Cổ Bát Tràng",
    category: "Crafts",
    categoryVi: "Nghệ Thuật & Làng Nghề",
    cefrLevel: "Level 2",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '4 phút đọc', vocabCount: 5, summary: 'Learn basic words for clay, pottery wheels, kilns, and decorative ceramic painting.' },
      'Level 2': { readTime: '6 phút đọc', vocabCount: 9, summary: 'Explore 700 years of ceramic craftsmanship in a traditional village on the Red River delta while learning terminology for artisan techniques.' },
      'Level 3': { readTime: '9 phút đọc', vocabCount: 14, summary: 'Examine chemical glaze compositions, guild socioeconomics, and export porcelain archaeology.' },
    },
    readTime: "6 phút đọc",
    vocabCount: 9,
    summary:
      "Explore 700 years of ceramic craftsmanship in a traditional village on the Red River delta while learning terminology for artisan techniques.",
    gradient: "from-[#6E9FA1] via-[#528385] to-[#3B6668]",
    iconSymbol: "Palette",
    imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-08",
  },
  {
    id: "mu-cang-chai",
    title: "Terraced Fields of Mù Cang Chải",
    vietnameseTitle: "Ruộng Bậc Thang Mù Cang Chải Mùa Lúa Chín",
    category: "Nature",
    categoryVi: "Danh Thắng Thiên Nhiên",
    cefrLevel: "Level 2",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '3 phút đọc', vocabCount: 5, summary: 'Simple English describing golden rice hills, clear streams, and friendly mountain farmers.' },
      'Level 2': { readTime: '5 phút đọc', vocabCount: 7, summary: 'Journey through the golden harvest season in northern highlands and discover the ecological wisdom of ethnic minority communities.' },
      'Level 3': { readTime: '8 phút đọc', vocabCount: 12, summary: 'Study indigenous hydrological engineering, steep-slope agriculture, and cultural geography.' },
    },
    readTime: "5 phút đọc",
    vocabCount: 7,
    summary:
      "Journey through the golden harvest season in northern highlands and discover the ecological wisdom of ethnic minority communities.",
    gradient: "from-[#2A665B] via-[#4A887C] to-[#1E4B43]",
    iconSymbol: "Mountain",
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-05",
  },
  {
    id: "ao-dai-weaving",
    title: "The Art of Vietnamese Áo Dài Silk Weaving",
    vietnameseTitle: "Nghệ Thuật Dệt Lụa & Áo Dài Truyền Thống",
    category: "Crafts",
    categoryVi: "Nghệ Thuật & Làng Nghề",
    cefrLevel: "Level 2",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '4 phút đọc', vocabCount: 6, summary: 'Learn clothes vocabulary: silk scarves, long tunics, bright dyes, and elegant festivals.' },
      'Level 2': { readTime: '7 phút đọc', vocabCount: 10, summary: 'Trace the evolution of the national garment from Royal court attire to modern high fashion, exploring textile and design terminology.' },
      'Level 3': { readTime: '10 phút đọc', vocabCount: 15, summary: 'Analyze silhouette transitions (Le Mur style), silk loom botany, and female sartorial empowerment.' },
    },
    readTime: "7 phút đọc",
    vocabCount: 10,
    summary:
      "Trace the evolution of the national garment from Royal court attire to modern high fashion, exploring textile and design terminology.",
    gradient: "from-[#D9B76A] via-[#B89240] to-[#806120]",
    iconSymbol: "Palette",
    imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-03",
  },
  {
    id: "water-puppetry",
    title: "Water Puppetry & Village Legends",
    vietnameseTitle: "Múa Rối Nước & Truyền Thuyết Làng Quê",
    category: "Folklore",
    categoryVi: "Lễ Hội & Tín Ngưỡng",
    cefrLevel: "Level 2",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '4 phút đọc', vocabCount: 6, summary: 'Meet Uncle Teu and funny wooden puppets dancing over liquid village stages.' },
      'Level 2': { readTime: '8 phút đọc', vocabCount: 11, summary: 'Step into the flooded rice paddies of Northern Vietnam to discover a unique thousand-year-old performing art and folk mythology.' },
      'Level 3': { readTime: '11 phút đọc', vocabCount: 15, summary: 'Investigate bamboo rod mechanics, submerged stagecraft, and Red River hydraulic folklore.' },
    },
    readTime: "8 phút đọc",
    vocabCount: 11,
    summary:
      "Step into the flooded rice paddies of Northern Vietnam to discover a unique thousand-year-old performing art and folk mythology.",
    gradient: "from-[#9FCED8] via-[#75B2C0] to-[#488E9E]",
    iconSymbol: "Sparkles",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-03-01",
  },
  {
    id: "sword-lake-legend",
    title: "The Legend of Sword Lake & Golden Turtle",
    vietnameseTitle: "Sự Tích Hoàn Kiếm & Rùa Vàng",
    category: "Folklore",
    categoryVi: "Lễ Hội & Tín Ngưỡng",
    cefrLevel: "Level 1",
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime: '4 phút đọc', vocabCount: 5, summary: 'Revisit King Le Loi mythical sword and the sacred turtle in easy foundational English.' },
      'Level 2': { readTime: '7 phút đọc', vocabCount: 9, summary: 'Examine the historical resistance against Ming invaders and Hanoi civic symbolism.' },
      'Level 3': { readTime: '10 phút đọc', vocabCount: 14, summary: 'Deconstruct nationalist historiography, mythical legitimacy, and Hoan Kiem aquatic biology.' },
    },
    readTime: "4 phút đọc",
    vocabCount: 5,
    summary:
      "Revisit King Le Loi's mythical sword and the sacred turtle of Hanoi in accessible Level 1 English tailored for foundational learners.",
    gradient: "from-[#E8B7B2] via-[#C88A84] to-[#995852]",
    iconSymbol: "Sparkles",
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    dateAdded: "2026-02-28",
  },
];

// Helper to get Level Badge Styles
export const getCefrBadgeStyle = (level: string) => {
  switch (level) {
    case "Level 1":
    case "A2":
      return "bg-emerald-600/90 text-emerald-50 border-emerald-400/40";
    case "Level 2":
    case "B1":
    case "B2":
      return "bg-cyan-700/90 text-cyan-50 border-cyan-400/40";
    case "Level 3":
    case "C1":
      return "bg-rose-700/90 text-rose-50 border-rose-400/40";
    default:
      return "bg-slate-700 text-slate-100 border-slate-500/40";
  }
};

// Topic Options with Semantic Icon Identifiers
export const TOPIC_OPTIONS = [
  { label: "Tất cả bài học", value: "All", icon: "all" },
  { label: "Lịch sử & Di sản", value: "Heritage", icon: "heritage" },
  { label: "Ẩm thực & Cà phê", value: "Cuisine", icon: "cuisine" },
  { label: "Nghệ thuật & Làng nghề", value: "Crafts", icon: "crafts" },
  { label: "Danh thắng Thiên nhiên", value: "Nature", icon: "nature" },
  { label: "Lễ hội & Tín ngưỡng", value: "Folklore", icon: "folklore" },
];

// Level Options
export const CEFR_LEVELS = ["All", "Level 1", "Level 2", "Level 3"];
export const LEVEL_OPTIONS = CEFR_LEVELS;

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
