import type { ReaderArticleData } from '@/features/reader/services/readerApiService';
import type { ArticleSeries, SeriesMetadata, SeriesNavigationInfo } from './types';
import { PHO_SERIES } from './mock/phoSeries';
import { BUN_CHA_SERIES } from './mock/bunChaSeries';
import { CHA_CA_SERIES } from './mock/chaCaSeries';
import { CA_KHO_VU_DAI_SERIES } from './mock/caKhoVuDaiSeries';
import { COM_CHAY_SERIES } from './mock/comChaySeries';
import { BANH_CAY_SERIES } from './mock/banhCaySeries';
import { HUE_SERIES } from './mock/hueCitadelSeries';
import { SAIGON_BANH_MI_SERIES } from './mock/saigonBanhMiSeries';

/**
 * Master Registry of all Article Series (Mock Data Hub)
 */
export const ALL_SERIES: ArticleSeries[] = [
  PHO_SERIES,
  BUN_CHA_SERIES,
  CHA_CA_SERIES,
  CA_KHO_VU_DAI_SERIES,
  COM_CHAY_SERIES,
  BANH_CAY_SERIES,
  HUE_SERIES,
  SAIGON_BANH_MI_SERIES,
];

export const ALL_SERIES_METADATA: SeriesMetadata[] = ALL_SERIES.map(series => series.metadata);

export const ALL_SERIES_ARTICLES: ReaderArticleData[] = ALL_SERIES.flatMap(series => series.articles);

/**
 * Retrieve series by ID (e.g. 'pho', 'hue-citadel', 'saigon-banh-mi')
 */
export function getSeriesById(id: string): ArticleSeries | undefined {
  return ALL_SERIES.find(series => series.metadata.id === id);
}

/**
 * Retrieve metadata of published series (ready for learners)
 */
export function getPublishedSeries(): SeriesMetadata[] {
  return ALL_SERIES_METADATA.filter(series => series.status === 'published');
}

/**
 * Retrieve series by Vietnamese province identifier
 */
export function getSeriesByProvince(provinceId: string): SeriesMetadata[] {
  return ALL_SERIES_METADATA.filter(series => series.provinceId === provinceId);
}

/**
 * Retrieve series by geographical region (north, central, south)
 */
export function getSeriesByRegion(region: 'north' | 'central' | 'south'): SeriesMetadata[] {
  return ALL_SERIES_METADATA.filter(series => series.region === region);
}

/**
 * Retrieve full Reader article data by chapter ID
 */
export function getSeriesArticle(articleId: string): ReaderArticleData | null {
  if (!articleId) return null;
  return ALL_SERIES_ARTICLES.find(article => article.id === articleId) || null;
}

/**
 * Retrieve navigation information (series title, previous/next links) for Reader
 */
export function getSeriesNavigation(articleId: string): SeriesNavigationInfo | null {
  if (!articleId) return null;

  for (const series of ALL_SERIES) {
    const chapterIndex = series.metadata.chapters.findIndex(chap => chap.id === articleId);
    if (chapterIndex >= 0) {
      const currentChapter = series.metadata.chapters[chapterIndex];
      const previousChapter = series.metadata.chapters[chapterIndex - 1] || null;
      const nextChapter = series.metadata.chapters[chapterIndex + 1] || null;

      return {
        series: series.metadata,
        chapterIndex,
        currentChapter,
        previousChapter,
        nextChapter,
        totalChapters: series.metadata.chapters.length,
      };
    }
  }

  return null;
}
