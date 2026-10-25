import type { ReaderArticleData } from '@/features/reader/services/readerApiService';

export type SeriesTheme = 'cuisine' | 'places' | 'crafts' | 'festivals' | 'history';
export type SeriesRegion = 'north' | 'central' | 'south';
export type SeriesStatus = 'published' | 'draft' | 'upcoming';

export interface SeriesChapterMeta {
  id: string;
  order: number;
  titleEn: string;
  titleVi: string;
  summary: string;
  summaryVi: string;
  readTime: string;
  cefrLevel?: string;
}

export interface SeriesMetadata {
  id: string;
  title: string;
  titleVi: string;
  theme: SeriesTheme;
  provinceId: string;
  region: SeriesRegion;
  description: string;
  imageUrl: string;
  status: SeriesStatus;
  chapters: SeriesChapterMeta[];
}

export interface ArticleSeries {
  metadata: SeriesMetadata;
  articles: ReaderArticleData[];
}

export interface SeriesNavigationInfo {
  series: SeriesMetadata;
  chapterIndex: number;
  currentChapter: SeriesChapterMeta;
  previousChapter: SeriesChapterMeta | null;
  nextChapter: SeriesChapterMeta | null;
  totalChapters: number;
}
