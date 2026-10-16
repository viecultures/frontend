import { useEffect, useRef, useState } from 'react';
import type { Flashcard } from '@/data/flashcardsData';
import { readReviewSession, saveReviewSession } from '@/features/learning/lib/learningStorage';
import { createReviewSession, rateCard, restoreReviewSession, type CardRating, type ReviewSession } from '../lib/reviewSession';

export function useReviewSession(cards: Flashcard[], key: string, onComplete: () => void) {
  const [session, setSession] = useState(() => restoreReviewSession(readReviewSession(key), cards));
  const current = useRef(session);
  const [canSave, setCanSave] = useState(true);
  const update = (change: (value: ReviewSession) => ReviewSession) => {
    const next = change(current.current);
    current.current = next;
    setCanSave(saveReviewSession(key, next));
    setSession(next);
  };
  const answer = (id: string, rating: CardRating) => update(value =>
    value.order[value.currentIndex] !== id ? value : rateCard(value, id, rating));
  // The reward ledger also guards reloads, remounts and React Strict Mode effects.
  useEffect(() => { if (session.complete) onComplete(); }, [session.complete, onComplete]);
  return { session, update, answer, canSave, restart: () => update(() => createReviewSession(cards)) };
}
