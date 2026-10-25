import { PHO_SERIES_ARTICLES, getSeriesArticle } from '@/data/series';
import type { ReaderArticleData } from '../services/readerApiService';

export { PHO_SERIES_ARTICLES };

export function getPhoSeriesArticle(id: string): ReaderArticleData | null {
  return getSeriesArticle(id);
}
