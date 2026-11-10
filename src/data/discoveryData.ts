import type { Level } from '@/types';
import type { VocabItemDto } from '@/features/admin/types/adminTypes';
import { ALL_SERIES } from './series';

// Catalog Lesson Interface
export type LevelType = 'Level 1' | 'Level 2' | 'Level 3';

export interface LevelDetail {
  readTime: string;
  vocabCount: number;
  wordCount?: number;
  summary?: string;
  summaryVi?: string;
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
  summaryVi?: string;
  gradient: string;
  iconSymbol: string;
  imageUrl?: string;
  featured?: boolean;
  isFromDatabase?: boolean;
  journeyId?: string;
  isStandalone?: boolean;
  dateAdded: string;
  provinceId?: string;
  isNational?: boolean;
  dbVocabularies?: VocabItemDto[];
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


function getCategoryForTheme(theme: string): "Heritage" | "Cuisine" | "Crafts" | "Nature" | "Folklore" {
  switch (theme) {
    case 'cuisine': return 'Cuisine';
    case 'places':
    case 'history': return 'Heritage';
    case 'crafts': return 'Crafts';
    case 'festivals': return 'Folklore';
    default: return 'Cuisine';
  }
}

const CATEGORY_VI_MAP: Record<string, string> = {
  Heritage: 'Lịch Sử & Di Sản',
  Cuisine: 'Ẩm Thực & Cà Phê',
  Crafts: 'Nghệ Thuật & Làng Nghề',
  Nature: 'Danh Thắng Thiên Nhiên',
  Folklore: 'Lễ Hội & Tín Ngưỡng',
};

export const SERIES_LESSONS: Lesson[] = ALL_SERIES.flatMap((series, sIdx) => {
  const category = getCategoryForTheme(series.metadata.theme);
  const categoryVi = CATEGORY_VI_MAP[category];

  return series.articles.map((article, idx) => {
    const chapterMeta = series.metadata.chapters[idx];
    const summary = article.summary || chapterMeta?.summary || article.summaryVi || '';
    const summaryVi = article.summaryVi || chapterMeta?.summaryVi || summary;

    return {
      id: article.id,
      title: article.titleEn,
      vietnameseTitle: article.titleVi,
      category,
      categoryVi,
      cefrLevel: 'Level 2' as LevelType,
      availableLevels: ['Level 1', 'Level 2', 'Level 3'] as LevelType[],
      levelDetails: {
        'Level 1': {
          readTime: '3 phút đọc',
          vocabCount: Math.min(6, article.vocabularies?.length || 6),
          summary,
          summaryVi,
        },
        'Level 2': {
          readTime: article.readTime || '3 phút đọc',
          vocabCount: article.vocabularies?.length || 10,
          summary,
          summaryVi,
        },
        'Level 3': {
          readTime: '5 phút đọc',
          vocabCount: Math.min(14, (article.vocabularies?.length || 10) + 4),
          summary,
          summaryVi,
        },
      },
      readTime: article.readTime || '3 phút đọc',
      vocabCount: article.vocabularies?.length || 10,
      summary,
      summaryVi,
      gradient: category === 'Cuisine'
        ? 'from-amber-700 via-amber-800 to-amber-950'
        : 'from-heritage-green via-teal-800 to-emerald-950',
      iconSymbol: category === 'Cuisine' ? 'UtensilsCrossed' : 'Landmark',
      imageUrl: article.imageUrl || series.metadata.imageUrl,
      dateAdded: `2026-04-${String(25 - Math.min(15, sIdx)).padStart(2, '0')}`,
      provinceId: series.metadata.provinceId,
      isNational: series.metadata.provinceId === 'ha-noi',
    };
  });
});

export const LESSONS_DATA: Lesson[] = SERIES_LESSONS;

// Helper to get Level Badge Styles (Unified Heritage Green Color)
export const getCefrBadgeStyle = (_level?: string) => {
  return "bg-heritage-green text-warm-ivory border-heritage-green/30";
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
  { label: "Phở", query: "Phở" },
  { label: "Bún chả", query: "Bún chả" },
  { label: "Chả cá", query: "Chả cá" },
  { label: "Cá kho", query: "Cá kho" },
  { label: "Cơm cháy", query: "Cơm cháy" },
  { label: "Bánh cáy", query: "Bánh cáy" },
];
