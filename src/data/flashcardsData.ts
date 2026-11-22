import { LESSONS_DATA, type Lesson } from './discoveryData';

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

// Minimal offline / test fixture for pho-hanoi-history to preserve unit test stability
const FALLBACK_TEST_PHO_CARDS: Flashcard[] = [
  {
    id: 'pho-vocab-1',
    word: 'broth',
    pos: 'noun',
    ipa: '/brɒθ/',
    contextEn: 'The broth is simmered for many hours with charred onions and beef bones.',
    viMeaning: 'Nước dùng',
    viDefinition: 'Soup base made by simmering bones and meat',
  },
  {
    id: 'pho-vocab-2',
    word: 'star anise',
    pos: 'noun',
    ipa: '/stɑːr ˈæn.ɪs/',
    contextEn: 'Star anise gives pho its distinct warming aroma.',
    viMeaning: 'Hoa hồi',
    viDefinition: 'A star-shaped spice essential to Vietnamese broth',
  },
  {
    id: 'pho-vocab-3',
    word: 'simmer',
    pos: 'verb',
    ipa: '/ˈsɪm.ər/',
    contextEn: 'The beef stock should simmer gently over low heat.',
    viMeaning: 'Ninh nhỏ lửa',
    viDefinition: 'To cook gently just below boiling point',
  },
];

export const DECK_WORDS: Record<string, DeckData> = {
  'pho-hanoi-history': {
    cards: FALLBACK_TEST_PHO_CARDS,
    words: FALLBACK_TEST_PHO_CARDS.map(c => c.word),
  },
};

export const SAMPLE_STUDY_DECKS: SampleDeckMeta[] = [];

export function resolveLessonForDeck(deckId: string): Lesson | null {
  return LESSONS_DATA.find(lesson => lesson.id === deckId) || null;
}

export function resolveDeckCards(deckId: string): Flashcard[] {
  return DECK_WORDS[deckId]?.cards || [];
}

export const getDeckData = (lesson: Lesson): DeckData =>
  DECK_WORDS[lesson.id] || { cards: [], words: [] };

export const getDeckCards = (lesson: Lesson): Flashcard[] => getDeckData(lesson).cards;
