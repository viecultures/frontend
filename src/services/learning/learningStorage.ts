import type { ReaderArticleData } from '@/features/reader/services/readerApiService';
import type { VocabItem } from '@/data/readerData';

const PREFIX = 'viecultures_learning_v1:';

export const PERSONAL_DECK_ID = 'personal-deck';
export const PERSONAL_DECK_LEVEL = 'Level 1';

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
  const result = writeLearningValue('saved-vocabulary:' + articleKey(id, level), words);
  if (result && typeof window !== 'undefined') {
    window.dispatchEvent(new Event('vie_vocab_updated'));
  }
  return result;
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

export function getAllSavedVocabularies(): VocabItem[] {
  try {
    const map = new Map<string, VocabItem>();
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (!key?.startsWith(PREFIX + 'saved-vocabulary:')) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const items = JSON.parse(raw) as VocabItem[];
      if (Array.isArray(items)) {
        items.forEach((item) => {
          if (item?.word && !map.has(item.word.toLowerCase())) {
            map.set(item.word.toLowerCase(), item);
          }
        });
      }
    }
    return Array.from(map.values());
  } catch {
    return [];
  }
}

export function savePersonalWord(input: {
  word: string;
  viMeaning: string;
  contextSentence?: string;
  pos?: string;
}): boolean {
  try {
    const existingWords = readSavedVocabulary(PERSONAL_DECK_ID, PERSONAL_DECK_LEVEL);
    const normalizedWord = input.word.trim();
    const existingIndex = existingWords.findIndex(
      (item) => item.word.toLowerCase() === normalizedWord.toLowerCase()
    );

    const newItem: VocabItem = {
      id: existingIndex >= 0 ? existingWords[existingIndex].id : `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      word: normalizedWord,
      pos: input.pos || 'n.',
      ipa: '',
      viMeaning: input.viMeaning.trim(),
      enDefinition: input.viMeaning.trim(),
      contextSentence: input.contextSentence?.trim() || '',
    };

    let nextWords: VocabItem[];
    if (existingIndex >= 0) {
      nextWords = [...existingWords];
      nextWords[existingIndex] = newItem;
    } else {
      nextWords = [newItem, ...existingWords];
    }

    const personalArticle: ReaderArticleData = {
      id: PERSONAL_DECK_ID,
      titleEn: 'My Personal Words',
      titleVi: 'Sổ từ cá nhân của tôi',
      topic: 'Personal',
      level: PERSONAL_DECK_LEVEL,
      vocabularies: nextWords,
      vocabMap: Object.fromEntries(nextWords.map((w) => [w.word.toLowerCase(), w])),
      paragraphs: [],
      summary: 'Sổ tay lưu trữ các từ vựng do bạn tự thêm thủ công.',
    };

    cacheArticle(personalArticle, PERSONAL_DECK_LEVEL);
    return saveVocabulary(PERSONAL_DECK_ID, PERSONAL_DECK_LEVEL, nextWords);
  } catch (error) {
    console.error('Failed to save personal word:', error);
    return false;
  }
}
