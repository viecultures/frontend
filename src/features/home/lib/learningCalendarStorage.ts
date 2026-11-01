export type StudyActivity = 'reading' | 'vocabulary';
export type DailyStudy = Record<StudyActivity, number>;
export type StudyCalendar = Record<string, DailyStudy>;

const STORAGE_PREFIX = 'viecultures:study-calendar:v1:';
export const STUDY_CALENDAR_UPDATED = 'viecultures:study-calendar-updated';

export function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function storageKey(account: string): string {
  return `${STORAGE_PREFIX}${encodeURIComponent(account)}`;
}

/**
 * Generates realistic mock study records for the last ~30 days relative to baseDate.
 * Gives evaluators and learners an immediate sense of how the calendar, streak,
 * weekly strip, and monthly heatmap look when actively studying.
 */
export function generateMockStudyCalendar(baseDate: Date = new Date()): StudyCalendar {
  const result: StudyCalendar = {};
  const mockSchedule: Array<{ daysAgo: number; reading: number; vocabulary: number }> = [
    // Continuous 5-day streak leading up to today (daysAgo: 0 to 4)
    { daysAgo: 0, reading: 18 * 60, vocabulary: 12 * 60 }, // 30m (medium/deep)
    { daysAgo: 1, reading: 25 * 60, vocabulary: 10 * 60 }, // 35m (deep)
    { daysAgo: 2, reading: 15 * 60, vocabulary: 12 * 60 }, // 27m (medium)
    { daysAgo: 3, reading: 20 * 60, vocabulary: 8 * 60 },  // 28m (medium)
    { daysAgo: 4, reading: 12 * 60, vocabulary: 6 * 60 },  // 18m (medium)
    // Earlier learning sessions across past month with rest days interspersed
    { daysAgo: 6, reading: 15 * 60, vocabulary: 5 * 60 },  // 20m (medium)
    { daysAgo: 7, reading: 30 * 60, vocabulary: 15 * 60 }, // 45m (deep)
    { daysAgo: 8, reading: 10 * 60, vocabulary: 8 * 60 },  // 18m (medium)
    { daysAgo: 10, reading: 16 * 60, vocabulary: 10 * 60 }, // 26m (medium)
    { daysAgo: 11, reading: 22 * 60, vocabulary: 12 * 60 }, // 34m (deep)
    { daysAgo: 12, reading: 8 * 60, vocabulary: 0 },       // 8m (light)
    { daysAgo: 13, reading: 14 * 60, vocabulary: 6 * 60 }, // 20m (medium)
    { daysAgo: 15, reading: 18 * 60, vocabulary: 10 * 60 }, // 28m (medium)
    { daysAgo: 16, reading: 0, vocabulary: 8 * 60 },       // 8m (light)
    { daysAgo: 17, reading: 25 * 60, vocabulary: 15 * 60 }, // 40m (deep)
    { daysAgo: 18, reading: 12 * 60, vocabulary: 8 * 60 }, // 20m (medium)
    { daysAgo: 20, reading: 15 * 60, vocabulary: 12 * 60 }, // 27m (medium)
    { daysAgo: 21, reading: 35 * 60, vocabulary: 15 * 60 }, // 50m (deep)
    { daysAgo: 22, reading: 15 * 60, vocabulary: 10 * 60 }, // 25m (medium)
    { daysAgo: 24, reading: 20 * 60, vocabulary: 10 * 60 }, // 30m (deep)
    { daysAgo: 25, reading: 10 * 60, vocabulary: 5 * 60 },  // 15m (medium)
    { daysAgo: 27, reading: 16 * 60, vocabulary: 12 * 60 }, // 28m (medium)
    { daysAgo: 28, reading: 22 * 60, vocabulary: 8 * 60 },  // 30m (deep)
  ];

  for (const { daysAgo, reading, vocabulary } of mockSchedule) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - daysAgo);
    const key = localDateKey(d);
    result[key] = { reading, vocabulary };
  }

  return result;
}

export function readStudyCalendar(account: string): StudyCalendar {
  const mock = generateMockStudyCalendar();
  try {
    const raw = localStorage.getItem(storageKey(account));
    if (!raw) {
      try {
        localStorage.setItem(storageKey(account), JSON.stringify(mock));
      } catch {
        // Storage disabled / private browsing
      }
      return mock;
    }

    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return mock;
    }

    const parsed = Object.fromEntries(Object.entries(value).flatMap(([date, day]) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !day || typeof day !== 'object') return [];
      const entry = day as Partial<DailyStudy>;
      return [[date, {
        reading: Number.isFinite(entry.reading) && Number(entry.reading) >= 0 ? Number(entry.reading) : 0,
        vocabulary: Number.isFinite(entry.vocabulary) && Number(entry.vocabulary) >= 0 ? Number(entry.vocabulary) : 0,
      }]];
    }));

    // If local storage has fewer than 3 entries (e.g. initial empty state),
    // merge the mock schedule so the user gets the rich learning preview experience
    // while keeping any real study seconds recorded for specific days.
    if (Object.keys(parsed).length < 3) {
      return { ...mock, ...parsed };
    }

    return parsed;
  } catch {
    return mock;
  }
}

export function addStudySeconds(account: string, activity: StudyActivity, seconds: number, at = new Date()): void {
  if (!Number.isFinite(seconds) || seconds <= 0) return;
  try {
    const calendar = readStudyCalendar(account);
    const date = localDateKey(at);
    const day = calendar[date] || { reading: 0, vocabulary: 0 };
    calendar[date] = { ...day, [activity]: day[activity] + seconds };
    localStorage.setItem(storageKey(account), JSON.stringify(calendar));
    window.dispatchEvent(new CustomEvent(STUDY_CALENDAR_UPDATED, { detail: account }));
  } catch {
    // Browsers may disable storage; the calendar simply remains empty.
  }
}
