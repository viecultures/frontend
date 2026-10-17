import type { ReaderArticleData } from '@/features/reader/services/readerApiService';
import type { VocabItem } from '@/data/readerData';

const PREFIX = 'viecultures_learning_v1:';

export interface LearningSessionRecord {
  deckId: string;
  totalCards: number;
  completedCards: number;
  masteredCards: number;
  reviewLaterCards: number;
  updatedAt?: number;
  [key: string]: unknown;
}

export function readLearningValue<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(PREFIX + key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export function writeLearningValue(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const articleKey = (id: string, level: string) => JSON.stringify([id, level]);

export function cacheArticle(article: ReaderArticleData, level: string) {
  return writeLearningValue('article:' + articleKey(article.id, level), article);
}

export function getCachedArticle(id: string, level: string) {
  const article = readLearningValue<ReaderArticleData>('article:' + articleKey(id, level));
  return article?.id === id && Array.isArray(article.vocabularies) ? article : null;
}

export function readSavedVocabulary(id: string, level: string): VocabItem[] {
  const value = readLearningValue<VocabItem[]>('saved-vocabulary:' + articleKey(id, level));
  return Array.isArray(value)
    ? value.filter(
        (word) =>
          word &&
          typeof word.id === 'string' &&
          typeof word.word === 'string' &&
          typeof word.viMeaning === 'string'
      )
    : [];
}

export function saveVocabulary(id: string, level: string, words: VocabItem[]) {
  return writeLearningValue('saved-vocabulary:' + articleKey(id, level), words);
}

export function readReviewSession(key: string): LearningSessionRecord | null {
  return readLearningValue<LearningSessionRecord>('session:' + key);
}

export function saveReviewSession(key: string, session: LearningSessionRecord | unknown) {
  return writeLearningValue('session:' + key, session);
}

export function listSavedArticles(): Array<{ article: ReaderArticleData; level: string; count: number }> {
  try {
    const result: Array<{ article: ReaderArticleData; level: string; count: number }> = [];
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (!key?.startsWith(PREFIX + 'article:')) continue;
      const [id, level] = JSON.parse(key.slice((PREFIX + 'article:').length)) as [string, string];
      const article = getCachedArticle(id, level);
      if (!article) continue;
      result.push({
        article,
        level,
        count: readSavedVocabulary(id, level).length,
      });
    }
    return result;
  } catch {
    return [];
  }
}
