import { LESSONS_DATA, type Lesson } from "./discoveryData";
import { VIETNAM_LANDMARKS } from "./landmarksData";
import { VOCAB_DATABASE } from "./readerData";

export interface Flashcard {
  id: string;
  word: string;
  pos: string;
  ipa: string;
  contextEn: string;
  viMeaning: string;
  viDefinition: string;
  options?: string[];
  correctIndex?: number;
}

export interface DeckData {
  words: string[];
  cards: Flashcard[];
}

export const DECK_WORDS: Record<string, DeckData> = {
  // ── 1. CỐ ĐÔ HUẾ ──────────────────────────────────────────────────────────
  "imperial-hue": {
    words: ["architectural", "citadel", "craftsmanship", "imperial", "preservation"],
    cards: [
      {
        id: "hue-1",
        word: "architectural",
        pos: "adj",
        ipa: "/ˌɑːrkɪˈtektʃərəl/",
        contextEn: "The Imperial City of Hue represents an extraordinary architectural accomplishment.",
        viMeaning: "Thuộc về kiến trúc",
        viDefinition: "Liên quan đến thiết kế và xây dựng các công trình cung điện, di tích.",
        options: ["Thuộc về kiến trúc", "Thuộc về lịch sử phong kiến", "Phong cảnh tự nhiên", "Chạm khắc gỗ"],
        correctIndex: 0,
      },
      {
        id: "hue-2",
        word: "citadel",
        pos: "noun",
        ipa: "/ˈsɪt.ə.del/",
        contextEn: "The ancient citadel is enclosed by massive stone walls.",
        viMeaning: "Thành trì, kinh thành cổ",
        viDefinition: "Tòa thành kiên cố bảo vệ trung tâm quyền lực triều đình phong kiến.",
        options: ["Thành trì, kinh thành cổ", "Khu chợ sầm uất", "Làng nghề thủ công", "Bến thuyền sông"],
        correctIndex: 0,
      },
      {
        id: "hue-3",
        word: "craftsmanship",
        pos: "noun",
        ipa: "/ˈkræftsmən.ʃɪp/",
        contextEn: "Carved wooden pillars showcase the breathtaking craftsmanship of Nguyen artisans.",
        viMeaning: "Tay nghề thủ công tinh xảo",
        viDefinition: "Kỹ năng khéo léo bậc thầy trong sáng tạo nghệ thuật thủ công.",
        options: ["Kỹ thuật chế tạo", "Tay nghề thủ công tinh xảo", "Tranh vẽ dân gian", "Âm nhạc triều đình"],
        correctIndex: 1,
      },
    ],
  },

  // ── 2. PHỞ HÀ NỘI ────────────────────────────────────────────────────────
  "pho-hanoi-history": {
    words: ["aromatic broth", "simmer", "star anise", "culinary heritage", "condiment"],
    cards: [
      {
        id: "pho-1",
        word: "aromatic broth",
        pos: "noun phrase",
        ipa: "/ˌær.əˈmæt.ɪk brɑːθ/",
        contextEn: "The soul of Hanoi pho lies in its fragrant, crystal-clear aromatic broth.",
        viMeaning: "Nước dùng thơm ngát",
        viDefinition: "Nước súp đậm đà ninh từ xương bò và thảo mộc tự nhiên nhiều giờ liền.",
        options: ["Nước dùng thơm ngát", "Bánh phở tươi", "Thịt bò tái lăn", "Gia vị chanh ớt"],
        correctIndex: 0,
      },
      {
        id: "pho-2",
        word: "simmer",
        pos: "verb",
        ipa: "/ˈsɪm.ɚ/",
        contextEn: "Beef marrow bones simmer gently over charcoal embers for over ten hours.",
        viMeaning: "Ninh liu riu, hầm nhỏ lửa",
        viDefinition: "Nấu nước dùng ở nhiệt độ sôi nhẹ liên tục để chiết xuất vị ngọt thanh.",
        options: ["Ninh liu riu, hầm nhỏ lửa", "Đun sôi bùng", "Xào lăn nhanh", "Hấp cách thủy"],
        correctIndex: 0,
      },
      {
        id: "pho-3",
        word: "star anise",
        pos: "noun",
        ipa: "/ˌstɑːr ˈæn.ɪs/",
        contextEn: "Charred ginger, cinnamon quills, and star anise infuse the soup with depth.",
        viMeaning: "Hoa hồi, quả đại hồi",
        viDefinition: "Gia vị thảo mộc hình ngôi sao mang lại hương thơm đặc trưng của nước phở.",
        options: ["Hoa hồi, quả đại hồi", "Thảo quả khô", "Quế thanh", "Đinh hương"],
        correctIndex: 0,
      },
      {
        id: "pho-4",
        word: "culinary heritage",
        pos: "noun phrase",
        ipa: "/ˈkʌl.ə.ner.i ˈher.ɪ.t̬ɪdʒ/",
        contextEn: "Pho is universally celebrated as the crown jewel of Vietnamese culinary heritage.",
        viMeaning: "Di sản ẩm thực",
        viDefinition: "Giá trị tinh hoa ăn uống truyền thống lưu truyền qua nhiều thế hệ.",
        options: ["Di sản ẩm thực", "Nghệ thuật trình diễn", "Lễ hội dân gian", "Văn hóa trà đạo"],
        correctIndex: 0,
      },
    ],
  },
  "pho-hanoi": {
    words: ["aromatic broth", "simmer", "star anise", "culinary heritage", "condiment"],
    cards: [
      {
        id: "pho-alias-1",
        word: "aromatic broth",
        pos: "noun phrase",
        ipa: "/ˌær.əˈmæt.ɪk brɑːθ/",
        contextEn: "The soul of Hanoi pho lies in its fragrant, crystal-clear aromatic broth.",
        viMeaning: "Nước dùng thơm ngát",
        viDefinition: "Nước súp đậm đà ninh từ xương bò và thảo mộc tự nhiên nhiều giờ liền.",
        options: ["Nước dùng thơm ngát", "Bánh phở tươi", "Thịt bò tái lăn", "Gia vị chanh ớt"],
        correctIndex: 0,
      },
      {
        id: "pho-alias-2",
        word: "simmer",
        pos: "verb",
        ipa: "/ˈsɪm.ɚ/",
        contextEn: "Beef marrow bones simmer gently over charcoal embers for over ten hours.",
        viMeaning: "Ninh liu riu, hầm nhỏ lửa",
        viDefinition: "Nấu nước dùng ở nhiệt độ sôi nhẹ liên tục để chiết xuất vị ngọt thanh.",
        options: ["Ninh liu riu, hầm nhỏ lửa", "Đun sôi bùng", "Xào lăn nhanh", "Hấp cách thủy"],
        correctIndex: 0,
      },
    ],
  },

  // ── 3. VỊNH HẠ LONG ──────────────────────────────────────────────────────
  "ha-long-bay": {
    words: ["limestone karsts", "descending dragon", "emerald waters", "sublime seascape"],
    cards: [
      {
        id: "hl-1",
        word: "limestone karsts",
        pos: "noun phrase",
        ipa: "/ˈlaɪm.stoʊn kɑːrst/",
        contextEn: "Thousands of towering limestone karsts rise dramatically from the Gulf of Tonkin.",
        viMeaning: "Các đảo đá vôi dạng karst kỳ vĩ",
        viDefinition: "Dạng địa hình vách đá dựng đứng bào mòn qua hàng triệu năm kiến tạo địa chất.",
        options: ["Các đảo đá vôi dạng karst kỳ vĩ", "Vách đá cát đỏ", "Rạn san hô ngầm", "Đồi cát biển"],
        correctIndex: 0,
      },
      {
        id: "hl-2",
        word: "descending dragon",
        pos: "noun phrase",
        ipa: "/dɪˈsen.dɪŋ ˈdræɡ.ən/",
        contextEn: "Ha Long translates poetically to the Bay of Descending Dragons.",
        viMeaning: "Rồng hạ phàm, rồng đáp xuống biển",
        viDefinition: "Hình tượng truyền thuyết linh thiêng trong dân gian che chở non sông bờ cõi.",
        options: ["Rồng hạ phàm, rồng đáp xuống biển", "Phượng hoàng bay lên", "Kỳ lân xuất hiện", "Rùa vàng nổi lên"],
        correctIndex: 0,
      },
      {
        id: "hl-3",
        word: "emerald waters",
        pos: "noun phrase",
        ipa: "/ˈem.ər.əld ˈwɑː.t̬ɚz/",
        contextEn: "Cruising across emerald waters reveals hidden grottoes and floating fishing villages.",
        viMeaning: "Làn nước xanh ngọc bích",
        viDefinition: "Màu nước biển xanh trong vắt màu ngọc bích đặc trưng của vịnh biển kín gió.",
        options: ["Làn nước xanh ngọc bích", "Nước lũ đục ngầu", "Sóng bạc đầu biển động", "Dòng nước xoáy"],
        correctIndex: 0,
      },
    ],
  },

  // ── 4. TẾT NGUYÊN ĐÁN ───────────────────────────────────────────────────
  "tet-holiday": {
    words: ["sacred", "family reunion", "agricultural civilization", "give way to", "prosperity"],
    cards: [
      {
        id: "tet-1",
        word: "sacred",
        pos: "adj",
        ipa: "/ˈseɪ.krɪd/",
        contextEn: "Tết is celebrated as the most important and sacred holiday in Vietnamese culture.",
        viMeaning: "Thiêng liêng, trang trọng bậc nhất",
        viDefinition: "Mang ý nghĩa tâm linh và văn hóa sâu đậm nhất trong năm.",
        options: ["Thiêng liêng, trang trọng bậc nhất", "Vui vẻ nhộn nhịp", "Mới mẻ hiện đại", "Bình thường giản dị"],
        correctIndex: 0,
      },
      {
        id: "tet-2",
        word: "family reunion",
        pos: "noun phrase",
        ipa: "/ˈfæm.əl.i ˌriːˈjuː.njən/",
        contextEn: "Tết stands above all for warm family reunions and profound ancestor veneration.",
        viMeaning: "Sự đoàn viên, sum họp gia đình",
        viDefinition: "Dịp con cháu xa gần tụ hội về bên mái ấm cha mẹ tổ tiên.",
        options: ["Sự đoàn viên, sum họp gia đình", "Buổi họp lớp thường niên", "Chuyến dã ngoại cuối tuần", "Hội chợ thương mại"],
        correctIndex: 0,
      },
      {
        id: "tet-3",
        word: "agricultural civilization",
        pos: "noun phrase",
        ipa: "/ˌæɡ.rəˈkʌl.tʃər.əl ˌsɪv.əl.aɪˈzeɪ.ʃən/",
        contextEn: "Tết originates deeply from East Asian wet-rice agricultural civilization.",
        viMeaning: "Nền văn minh nông nghiệp lúa nước",
        viDefinition: "Nếp sống và tập tục gắn liền chặt chẽ với chu kỳ mùa màng thời tiết.",
        options: ["Nền văn minh nông nghiệp lúa nước", "Văn minh công nghiệp", "Xã hội du mục", "Thời kỳ săn bắt"],
        correctIndex: 0,
      },
    ],
  },
  "tet-festivities": {
    words: ["sacred", "family reunion", "agricultural civilization", "give way to", "prosperity"],
    cards: [
      {
        id: "tet-fest-1",
        word: "sacred",
        pos: "adj",
        ipa: "/ˈseɪ.krɪd/",
        contextEn: "Tết is celebrated as the most important and sacred holiday in Vietnamese culture.",
        viMeaning: "Thiêng liêng, trang trọng bậc nhất",
        viDefinition: "Mang ý nghĩa tâm linh và văn hóa sâu đậm nhất trong năm.",
        options: ["Thiêng liêng, trang trọng bậc nhất", "Vui vẻ nhộn nhịp", "Mới mẻ hiện đại", "Bình thường giản dị"],
        correctIndex: 0,
      },
    ],
  },

  // ── 5. CÀ PHÊ TRỨNG ─────────────────────────────────────────────────────
  "egg-coffee": {
    words: ["whisked egg yolk", "creamy foam", "condensed milk", "culinary innovation"],
    cards: [
      {
        id: "ec-1",
        word: "whisked egg yolk",
        pos: "noun phrase",
        ipa: "/wɪskt eɡ joʊk/",
        contextEn: "Fresh egg yolks are thoroughly whisked until they form a golden airy cream.",
        viMeaning: "Lòng đỏ trứng đánh bông",
        viDefinition: "Nguyên liệu then chốt tạo nên lớp kem bồng bềnh béo mịn của cà phê trứng.",
        options: ["Lòng đỏ trứng đánh bông", "Lòng trắng trứng luộc", "Sữa tươi đánh đá", "Bọt cà phê đen"],
        correctIndex: 0,
      },
      {
        id: "ec-2",
        word: "culinary innovation",
        pos: "noun phrase",
        ipa: "/ˈkʌl.ə.ner.i ˌɪn.əˈveɪ.ʃən/",
        contextEn: "Hanoi egg coffee was an ingenious culinary innovation during milk shortages.",
        viMeaning: "Sáng tạo ẩm thực đột phá",
        viDefinition: "Cách giải quyết sáng tạo độc đáo biến khó khăn thành một kiệt tác hương vị.",
        options: ["Sáng tạo ẩm thực đột phá", "Quy trình chế biến nhà máy", "Công thức gia truyền cũ", "Món ăn nhập khẩu"],
        correctIndex: 0,
      },
    ],
  },

  // ── 6. TRANH ĐÔNG HỒ ────────────────────────────────────────────────────
  "dong-ho-paintings": {
    words: ["woodblock print", "natural pigments", "scallop shell paper", "craftsmanship"],
    cards: [
      {
        id: "dh-1",
        word: "woodblock print",
        pos: "noun phrase",
        ipa: "/ˈwʊd.blɑːk prɪnt/",
        contextEn: "Dong Ho folk art relies on hand-carved woodblock prints on Dó paper.",
        viMeaning: "Tranh khắc gỗ dân gian",
        viDefinition: "Kỹ thuật in tranh thủ công sử dụng các bản gỗ khắc tỉ mỉ từng lớp màu.",
        options: ["Tranh khắc gỗ dân gian", "Tranh sơn dầu hiện đại", "Tranh thêu tay", "Tranh dán giấy"],
        correctIndex: 0,
      },
      {
        id: "dh-2",
        word: "natural pigments",
        pos: "noun phrase",
        ipa: "/ˈnætʃ.ɚ.əl ˈpɪɡ.mənts/",
        contextEn: "Dong Ho artisans create colors entirely from natural pigments like charcoal and gardenia.",
        viMeaning: "Màu sắc tự nhiên từ cây cỏ đất đá",
        viDefinition: "Màu sắc chiết xuất từ than hoa xoan, gỉ đồng, hoa dành dành và sỏi điệp.",
        options: ["Màu sắc tự nhiên từ cây cỏ đất đá", "Phẩm màu hóa chất", "Mực in công nghiệp", "Sơn tổng hợp"],
        correctIndex: 0,
      },
    ],
  },

  // ── 7. BÁNH MÌ SÀI GÒN ──────────────────────────────────────────────────
  "saigon-banh-mi": {
    words: ["culinary", "baguette", "fusion", "staple", "crusty"],
    cards: [
      {
        id: "bm-1",
        word: "culinary",
        pos: "adj",
        ipa: "/ˈkʌl.ə.ner.i/",
        contextEn: "Saigon bánh mì transformed into a global culinary icon of street food.",
        viMeaning: "Thuộc về ẩm thực",
        viDefinition: "Liên quan đến bếp nướng, công thức nấu và nghệ thuật ăn uống.",
        options: ["Thuộc về ẩm thực", "Thuộc về thời trang", "Kỹ thuật sản xuất", "Nghệ thuật trình diễn"],
        correctIndex: 0,
      },
      {
        id: "bm-2",
        word: "baguette",
        pos: "noun",
        ipa: "/bæɡˈet/",
        contextEn: "Vietnamese bakers adapted the French baguette into a light, crispy local bread.",
        viMeaning: "Bánh mì Pháp",
        viDefinition: "Ổ bánh mì dài giòn vỏ nguyên bản từ ẩm thực nước Pháp.",
        options: ["Bánh mì Pháp", "Bánh nướng bơ", "Bánh quy giòn", "Bánh ngọt sô-cô-la"],
        correctIndex: 0,
      },
    ],
  },

  // ── 8. PHỐ CỔ HỘI AN ────────────────────────────────────────────────────
  "hoi-an-lanterns": {
    words: ["lantern", "tranquil", "cobblestone", "vibrant", "silk"],
    cards: [
      {
        id: "ha-1",
        word: "lantern",
        pos: "noun",
        ipa: "/ˈlæn.tɚn/",
        contextEn: "Bright silk lanterns illuminate the ancient wooden streets of Hoi An.",
        viMeaning: "Đèn lồng lụa",
        viDefinition: "Đèn trang trí làm từ khung tre bọc lụa rực rỡ màu sắc.",
        options: ["Đèn lồng lụa", "Đèn dầu cổ", "Hoa đăng sông", "Nến sinh nhật"],
        correctIndex: 0,
      },
    ],
  },
};

/**
 * Resolve Lesson metadata for any deckId (supporting lessons, landmarks, and tet-holiday)
 */
export function resolveLessonForDeck(deckId: string): Lesson {
  const normalize = (s: string) => s.toLowerCase().trim().replace(/[-_\s]+/g, '');
  const normTarget = normalize(deckId || 'imperial-hue');

  // 1. Check in LESSONS_DATA
  const found = LESSONS_DATA.find((l) => normalize(l.id) === normTarget);
  if (found) return found;

  // 2. Check in VIETNAM_LANDMARKS
  const landmark = VIETNAM_LANDMARKS.find((lm) => normalize(lm.id) === normTarget);
  if (landmark) {
    const categoryViMap: Record<string, string> = {
      Heritage: 'Di sản văn hóa',
      Cuisine: 'Ẩm thực truyền thống',
      Crafts: 'Làng nghề thủ công',
      Nature: 'Thiên nhiên kỳ vĩ',
      Folklore: 'Phong tục & Lễ hội',
    };

    return {
      id: landmark.id,
      title: landmark.title,
      vietnameseTitle: landmark.titleVi,
      category: landmark.category,
      categoryVi: categoryViMap[landmark.category] || 'Di sản văn hóa',
      cefrLevel: (landmark.level as any) || 'Level 2',
      availableLevels: ['Level 1', 'Level 2', 'Level 3'],
      levelDetails: {
        'Level 1': { readTime: landmark.readTime, vocabCount: landmark.vocabHighlights.length },
        'Level 2': { readTime: landmark.readTime, vocabCount: landmark.vocabHighlights.length },
        'Level 3': { readTime: landmark.readTime, vocabCount: landmark.vocabHighlights.length },
      },
      readTime: landmark.readTime,
      vocabCount: landmark.vocabHighlights.length,
      summary: landmark.subtitle,
      gradient: 'from-amber-600 via-emerald-800 to-heritage-green',
      iconSymbol: 'MapPin',
      imageUrl: landmark.image,
      dateAdded: '2026-10-14',
    };
  }

  // 3. Fallback for tet-holiday
  if (normTarget === 'tetholiday' || normTarget === 'tetfestivities') {
    return {
      id: 'tet-holiday',
      title: 'Tết Nguyên Đán: Sacred Beginnings',
      vietnameseTitle: 'Tết Nguyên Đán: Nét Đẹp Thiêng Liêng',
      category: 'Folklore',
      categoryVi: 'Phong tục & Lễ hội',
      cefrLevel: 'Level 2',
      availableLevels: ['Level 1', 'Level 2', 'Level 3'],
      levelDetails: {
        'Level 1': { readTime: '4 phút', vocabCount: 8 },
        'Level 2': { readTime: '5 phút', vocabCount: 8 },
        'Level 3': { readTime: '6 phút', vocabCount: 8 },
      },
      readTime: '5 phút',
      vocabCount: 8,
      summary: 'Tết Nguyên Đán là dịp lễ thiêng liêng nhất của dân tộc Việt Nam.',
      gradient: 'from-rose-600 via-amber-700 to-heritage-green',
      iconSymbol: 'Sparkles',
      imageUrl: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=1200&q=80',
      dateAdded: '2026-10-14',
    };
  }

  return LESSONS_DATA[0];
}

/**
 * Resolve cards array for any deckId
 */
export function resolveDeckCards(deckId: string): Flashcard[] {
  const normalize = (s: string) => s.toLowerCase().trim().replace(/[-_\s]+/g, '');
  const normTarget = normalize(deckId || 'imperial-hue');

  // Direct match in DECK_WORDS
  for (const [key, deck] of Object.entries(DECK_WORDS)) {
    if (normalize(key) === normTarget && deck.cards.length > 0) {
      return deck.cards;
    }
  }

  // Match in VOCAB_DATABASE if tet
  if (normTarget === 'tetholiday' || normTarget === 'tetfestivities') {
    return Object.values(VOCAB_DATABASE).slice(0, 5).map((v, i) => ({
      id: `tet-card-${i}`,
      word: v.word,
      pos: v.pos,
      ipa: v.ipa,
      contextEn: v.contextSentence,
      viMeaning: v.viMeaning,
      viDefinition: v.enDefinition || v.viMeaning,
      options: [v.viMeaning, 'Văn hóa ẩm thực', 'Lễ hội truyền thống', 'Phong cảnh thiên nhiên'],
      correctIndex: 0,
    }));
  }

  // Fallback to getDeckCards on resolved lesson
  const lesson = resolveLessonForDeck(deckId);
  return getDeckCards(lesson);
}

export const getDeckData = (lesson: Lesson): DeckData => {
  if (DECK_WORDS[lesson.id]) {
    return DECK_WORDS[lesson.id];
  }
  return {
    words: [lesson.id.split("-")[0], "heritage", "tradition", "culture"],
    cards: [
      {
        id: `${lesson.id}-1`,
        word: lesson.id.replace(/-/g, " "),
        pos: "noun/concept",
        ipa: "/ˈher.ɪ.t̬ɪdʒ/",
        contextEn: lesson.summary,
        viMeaning: lesson.vietnameseTitle,
        viDefinition: `Chủ đề từ vựng di sản văn hóa: ${lesson.vietnameseTitle}`,
        options: [lesson.vietnameseTitle, "Văn hóa ẩm thực", "Nghệ thuật dân gian", "Kiến trúc cổ"],
        correctIndex: 0,
      },
      {
        id: `${lesson.id}-2`,
        word: "heritage",
        pos: "noun",
        ipa: "/ˈher.ɪ.t̬ɪdʒ/",
        contextEn: "Preserving intangible heritage is vital for cultural identity.",
        viMeaning: "Di sản văn hóa",
        viDefinition: "Giá trị văn hóa quý báu kế thừa từ thế hệ trước.",
        options: ["Di sản văn hóa", "Phát triển đô thị", "Thương mại dịch vụ", "Giao thông công cộng"],
        correctIndex: 0,
      },
    ],
  };
};

export const getDeckCards = (lesson: Lesson): Flashcard[] => {
  return getDeckData(lesson).cards;
};
