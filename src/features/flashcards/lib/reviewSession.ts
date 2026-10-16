import type { Flashcard } from '@/data/flashcardsData';
import type { PlayerMode } from '../components/FlashcardModeTabs';

export type CardRating = 'mastered' | 'review';
export interface ReviewSession {
  signature: string;
  order: string[];
  currentIndex: number;
  ratings: Record<string, CardRating>;
  mode: PlayerMode;
  complete: boolean;
}

const signatureFor = (cards: Flashcard[]) => JSON.stringify(cards.map(card => [card.id, card.word, card.viMeaning]));
const isRated = (ratings: Record<string, CardRating>, id: string) => Object.hasOwn(ratings, id) && (ratings[id] === 'mastered' || ratings[id] === 'review');

export function createReviewSession(cards: Flashcard[]): ReviewSession {
  return { signature: signatureFor(cards), order: cards.map(card => card.id), currentIndex: 0, ratings: {}, mode: 'flip', complete: false };
}

export function restoreReviewSession(value: unknown, cards: Flashcard[]): ReviewSession {
  const initial = createReviewSession(cards);
  if (!value || typeof value !== 'object') return initial;
  const saved = value as Partial<ReviewSession>;
  if (saved.signature !== initial.signature || !Array.isArray(saved.order) ||
      saved.order.length !== cards.length || new Set(saved.order).size !== cards.length ||
      !saved.order.every(id => initial.order.includes(id))) return initial;
  const ratings: Record<string, CardRating> = {};
  for (const id of initial.order) {
    const rating = saved.ratings?.[id];
    if (rating === 'mastered' || rating === 'review') ratings[id] = rating;
  }
  return {
    ...initial, order: saved.order, ratings,
    mode: saved.mode === 'mc' || saved.mode === 'spelling' ? saved.mode : 'flip',
    currentIndex: Number.isInteger(saved.currentIndex) && saved.currentIndex! >= 0 && saved.currentIndex! < cards.length ? saved.currentIndex! : 0,
    complete: cards.length > 0 && cards.every(card => isRated(ratings, card.id)),
  };
}

export function rateCard(session: ReviewSession, id: string, rating: CardRating): ReviewSession {
  if (session.complete || !session.order.includes(id)) return session;
  const ratings = { ...session.ratings, [id]: rating };
  const complete = session.order.length > 0 && session.order.every(cardId => isRated(ratings, cardId));
  let currentIndex = session.currentIndex;
  if (!complete) {
    for (let step = 1; step <= session.order.length; step++) {
      const next = (session.currentIndex + step) % session.order.length;
      if (!isRated(ratings, session.order[next])) { currentIndex = next; break; }
    }
  }
  return { ...session, ratings, currentIndex, complete };
}
