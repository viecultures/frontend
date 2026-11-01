/**
 * Spaced Repetition System (SRS) Engine inspired by Anki's SM-2 Algorithm.
 * Tailored for Vietnamese Cultural Heritage English Learning.
 */

export type AnkiRating = 'again' | 'hard' | 'good' | 'easy';
export type CardSRSStatus = 'new' | 'learning' | 'review' | 'mastered';

export interface CardSRSState {
  vocabId: string;
  word: string;
  reps: number;
  lapses: number;
  interval: number; // in days (0 = relearn / today)
  easeFactor: number; // default 2.5, min 1.3
  dueDate: string; // ISO date string
  lastReviewedAt?: string;
  lastRating?: AnkiRating;
  status: CardSRSStatus;
}

export interface RatingIntervalInfo {
  rating: AnkiRating;
  shortcut: string;
  labelVi: string;
  labelEn: string;
  intervalTextVi: string;
  intervalTextEn: string;
  descriptionVi: string;
  descriptionEn: string;
}

const STORAGE_KEY = 'viecultures_srs_records';
const DEFAULT_EASE = 2.5;
const MIN_EASE = 1.3;

/**
 * Calculates the next SRS interval and state based on Anki's SM-2 parameters.
 */
export function calculateNextSRS(
  current: CardSRSState | undefined,
  vocabId: string,
  word: string,
  rating: AnkiRating
): {
  nextState: CardSRSState;
  repeatInSession: boolean;
  nextIntervalText: string;
} {
  const now = new Date();
  const ease = current?.easeFactor ?? DEFAULT_EASE;
  const reps = current?.reps ?? 0;
  const lapses = current?.lapses ?? 0;
  const interval = current?.interval ?? 0;

  let nextInterval = 0;
  let nextEase = ease;
  let nextReps = reps;
  let nextLapses = lapses;
  let nextStatus: CardSRSStatus = 'learning';
  let repeatInSession = false;
  let nextIntervalText = '< 1m';

  switch (rating) {
    case 'again': {
      // Lapse: Reset learning interval, keep in current review queue
      nextReps = 0;
      nextLapses = lapses + 1;
      nextInterval = 0;
      nextEase = Math.max(MIN_EASE, Number((ease - 0.2).toFixed(2)));
      nextStatus = 'learning';
      repeatInSession = true;
      nextIntervalText = '< 1m';
      break;
    }
    case 'hard': {
      // Recalled with effort: small increment or same session reinforcement
      nextEase = Math.max(MIN_EASE, Number((ease - 0.15).toFixed(2)));
      if (reps === 0) {
        nextInterval = 1;
        nextStatus = 'learning';
        nextIntervalText = '1d';
      } else {
        nextInterval = Math.max(1, Math.round(interval * 1.2));
        nextStatus = 'review';
        nextIntervalText = `${nextInterval}d`;
      }
      nextReps = reps + 1;
      repeatInSession = false;
      break;
    }
    case 'good': {
      // Standard successful recall
      if (reps === 0) {
        nextInterval = 1;
        nextStatus = 'review';
        nextIntervalText = '1d';
      } else if (reps === 1) {
        nextInterval = 3;
        nextStatus = 'review';
        nextIntervalText = '3d';
      } else {
        nextInterval = Math.max(interval + 1, Math.round(interval * ease));
        nextStatus = nextInterval >= 21 ? 'mastered' : 'review';
        nextIntervalText = `${nextInterval}d`;
      }
      nextReps = reps + 1;
      repeatInSession = false;
      break;
    }
    case 'easy': {
      // Instant effortless recall: interval bonus and ease boost
      nextEase = Number((ease + 0.15).toFixed(2));
      if (reps === 0) {
        nextInterval = 4;
        nextStatus = 'mastered';
        nextIntervalText = '4d';
      } else if (reps === 1) {
        nextInterval = 6;
        nextStatus = 'mastered';
        nextIntervalText = '6d';
      } else {
        nextInterval = Math.max(interval + 2, Math.round(interval * ease * 1.3));
        nextStatus = 'mastered';
        nextIntervalText = `${nextInterval}d`;
      }
      nextReps = reps + 1;
      repeatInSession = false;
      break;
    }
  }

  const dueDate = new Date(now.getTime() + nextInterval * 24 * 60 * 60 * 1000).toISOString();

  const nextState: CardSRSState = {
    vocabId,
    word,
    reps: nextReps,
    lapses: nextLapses,
    interval: nextInterval,
    easeFactor: nextEase,
    dueDate,
    lastReviewedAt: now.toISOString(),
    lastRating: rating,
    status: nextStatus,
  };

  return { nextState, repeatInSession, nextIntervalText };
}

/**
 * Pre-computes the display intervals for the 4 Anki rating buttons.
 */
export function getRatingIntervals(current?: CardSRSState): Record<AnkiRating, RatingIntervalInfo> {
  const reps = current?.reps ?? 0;
  const interval = current?.interval ?? 0;
  const ease = current?.easeFactor ?? DEFAULT_EASE;

  // Compute preview intervals
  let hardText = '1d';
  let goodText = '3d';
  let easyText = '6d';

  if (reps === 0) {
    hardText = '12h';
    goodText = '1d';
    easyText = '4d';
  } else if (reps === 1) {
    hardText = '1d';
    goodText = '3d';
    easyText = '6d';
  } else {
    const hardDays = Math.max(1, Math.round(interval * 1.2));
    const goodDays = Math.max(interval + 1, Math.round(interval * ease));
    const easyDays = Math.max(interval + 2, Math.round(interval * ease * 1.3));
    hardText = `${hardDays}d`;
    goodText = `${goodDays}d`;
    easyText = `${easyDays}d`;
  }

  return {
    again: {
      rating: 'again',
      shortcut: '1',
      labelVi: 'Quên',
      labelEn: 'Again',
      intervalTextVi: '< 1 phút',
      intervalTextEn: '< 1m',
      descriptionVi: 'Ôn lại ngay trong phiên này',
      descriptionEn: 'Repeat soon in this session',
    },
    hard: {
      rating: 'hard',
      shortcut: '2',
      labelVi: 'Khó',
      labelEn: 'Hard',
      intervalTextVi: hardText,
      intervalTextEn: hardText,
      descriptionVi: 'Nhớ ngập ngừng, cần ôn sớm',
      descriptionEn: 'Hesitant recall, review soon',
    },
    good: {
      rating: 'good',
      shortcut: '3',
      labelVi: 'Tốt',
      labelEn: 'Good',
      intervalTextVi: goodText,
      intervalTextEn: goodText,
      descriptionVi: 'Nhớ vừa sức, giãn cách chuẩn',
      descriptionEn: 'Standard interval progression',
    },
    easy: {
      rating: 'easy',
      shortcut: '4',
      labelVi: 'Dễ',
      labelEn: 'Easy',
      intervalTextVi: easyText,
      intervalTextEn: easyText,
      descriptionVi: 'Nhớ chắc ngay lập tức',
      descriptionEn: 'Instant effortless recall',
    },
  };
}

/**
 * Storage helpers
 */
export function getAllSRSStates(): Record<string, CardSRSState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, CardSRSState>) : {};
  } catch {
    return {};
  }
}

export function saveSRSState(state: CardSRSState): void {
  if (typeof window === 'undefined') return;
  try {
    const all = getAllSRSStates();
    all[state.vocabId || state.word.toLowerCase()] = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.warn('[srsEngine] Could not persist SRS state:', e);
  }
}

export function getSRSState(vocabIdOrWord: string): CardSRSState | null {
  const all = getAllSRSStates();
  return all[vocabIdOrWord] || all[vocabIdOrWord.toLowerCase()] || null;
}
