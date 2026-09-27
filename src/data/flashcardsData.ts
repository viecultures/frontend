import { type Lesson } from "./discoveryData";

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
        ipa: "/ˈheritage.culture/",
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
