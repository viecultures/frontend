import { useEffect } from 'react';
import { PATHS } from '@/routes/paths';
import { addStudySeconds, type StudyActivity } from '../lib/learningCalendarStorage';

const TICK_MS = 15_000;
const IDLE_MS = 5 * 60_000;

export function useStudyActivityTracking(path: string, account: string): void {
  const activity: StudyActivity | null = path === PATHS.reader
    ? 'reading'
    : path === PATHS.flashcardStudy || path === '/flashcards' || path === '/flashcard-study-page'
      ? 'vocabulary'
      : null;

  useEffect(() => {
    if (!activity) return;
    let lastInteraction = Date.now();
    let lastTick = Date.now();

    const markInteraction = () => { lastInteraction = Date.now(); };
    const flush = (allowHidden = false) => {
      const now = Date.now();
      const elapsed = now - lastTick;
      lastTick = now;
      if ((!allowHidden && document.visibilityState !== 'visible') || now - lastInteraction >= IDLE_MS) return;
      // A delayed background timer must never count the whole delay.
      const seconds = Math.min(elapsed, TICK_MS) / 1000;
      if (seconds > 0) addStudySeconds(account, activity, seconds, new Date(now));
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flush(true);
      lastTick = Date.now();
      if (document.visibilityState === 'visible') markInteraction();
    };
    const onPageHide = () => flush();
    const timer = window.setInterval(flush, TICK_MS);
    window.addEventListener('pointerdown', markInteraction);
    window.addEventListener('keydown', markInteraction);
    window.addEventListener('scroll', markInteraction, true);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      flush();
      window.clearInterval(timer);
      window.removeEventListener('pointerdown', markInteraction);
      window.removeEventListener('keydown', markInteraction);
      window.removeEventListener('scroll', markInteraction, true);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [activity, account]);
}
