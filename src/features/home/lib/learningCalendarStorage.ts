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

export function readStudyCalendar(account: string): StudyCalendar {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey(account)) || '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).flatMap(([date, day]) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !day || typeof day !== 'object') return [];
      const entry = day as Partial<DailyStudy>;
      return [[date, {
        reading: Number.isFinite(entry.reading) && Number(entry.reading) >= 0 ? Number(entry.reading) : 0,
        vocabulary: Number.isFinite(entry.vocabulary) && Number(entry.vocabulary) >= 0 ? Number(entry.vocabulary) : 0,
      }]];
    }));
  } catch {
    return {};
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
