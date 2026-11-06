import { LESSONS_DATA, type Lesson } from './discoveryData';
import { ALL_SERIES_ARTICLES } from './series/seriesRegistry';

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

export interface SampleDeckMeta {
  id: string;
  titleEn: string;
  titleVi: string;
  category: 'Heritage' | 'Cuisine' | 'Crafts' | 'Nature' | 'Folklore';
  categoryVi: string;
  level: string;
  cardCount: number;
  readTime: string;
  imageUrl: string;
  summary: string;
}

const toCards = (articleId: string): Flashcard[] => {
  const article = ALL_SERIES_ARTICLES.find(item => item.id === articleId);
  return (article?.vocabularies ?? []).map(item => ({
    id: item.id,
    word: item.word,
    pos: item.pos,
    ipa: item.ipa,
    contextEn: item.contextSentence,
    viMeaning: item.viMeaning,
    viDefinition: item.enDefinition || item.viMeaning,
  }));
};

export const DECK_WORDS: Record<string, DeckData> = Object.fromEntries(
  ALL_SERIES_ARTICLES.map(article => {
    const cards = toCards(article.id);
    return [article.id, { cards, words: cards.map(card => card.word) }];
  }),
);

export const SAMPLE_STUDY_DECKS: SampleDeckMeta[] = LESSONS_DATA.map(lesson => ({
  id: lesson.id,
  titleEn: lesson.title,
  titleVi: lesson.vietnameseTitle,
  category: lesson.category,
  categoryVi: lesson.categoryVi,
  level: lesson.cefrLevel,
  cardCount: toCards(lesson.id).length,
  readTime: lesson.readTime,
  imageUrl: lesson.imageUrl || '',
  summary: lesson.summary,
}));

export function resolveLessonForDeck(deckId: string): Lesson | null {
  return LESSONS_DATA.find(lesson => lesson.id === deckId) || null;
}

export function resolveDeckCards(deckId: string): Flashcard[] {
  return DECK_WORDS[deckId]?.cards || [];
}

export const getDeckData = (lesson: Lesson): DeckData =>
  DECK_WORDS[lesson.id] || { cards: [], words: [] };

export const getDeckCards = (lesson: Lesson): Flashcard[] => getDeckData(lesson).cards;
