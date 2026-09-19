export type CEFRLevel = 'A2' | 'B1' | 'B2' | 'C1';

export type Category = 
  | 'all'
  | 'van-hoa'       // Nếp sống & văn hóa
  | 'truyen-thuyet'  // Truyền thuyết
  | 'am-thuc'       // Ẩm thực
  | 'le-hoi'        // Lễ hội & sắc màu
  // Legacy aliases
  | 'heritage'
  | 'cuisine'
  | 'landscapes'
  | 'festivals'
  | 'traditions';

export interface VocabItem {
  id: string;
  word: string;
  ipa: string;
  pos: string; // Part of speech (noun, verb, adj, etc.)
  vietnameseMeaning: string;
  contextSentence: string;
  highlightedWordInContext: string;
  audioExample?: string;
  level: CEFRLevel;
  usageNote?: string;
}

export interface ParagraphPair {
  id: number;
  english: string;
  vietnamese: string;
  highlightWords?: string[]; // words to highlight
}

export interface Lesson {
  id: string;
  titleEn: string;
  titleVi: string;
  category: Category;
  categoryNameVi: string;
  level: CEFRLevel;
  readTime: string;
  imageUrl: string;
  summary: string;
  paragraphs: ParagraphPair[];
  vocabularies: VocabItem[];
  featured?: boolean;
  totalReads?: number;
  likes?: number;
}

export interface UserReflection {
  id: string;
  lessonId: string;
  lessonTitle: string;
  authorName: string;
  authorAvatar: string;
  authorLevel: CEFRLevel;
  content: string;
  usedVocab: string[];
  createdAt: string;
  likes: number;
  userLiked?: boolean;
}
