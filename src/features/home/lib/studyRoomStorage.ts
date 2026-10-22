import { readLearningValue, writeLearningValue } from '@/services/learning/learningStorage';

export interface ReadingBookmark {
  id: string;
  level: string;
  title: string;
  image: string;
  topic: string;
  position: number;
  updatedAt: number;
}

export interface StudyTask {
  id: string;
  label: string;
  completed: boolean;
}

export function readingHistoryKey(account: string) {
  return `study-room:${account}:reading-history`;
}

export function readReadingHistory(account: string): ReadingBookmark[] {
  const value = readLearningValue<unknown>(readingHistoryKey(account));
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is ReadingBookmark => Boolean(item) &&
    typeof item.id === 'string' && typeof item.title === 'string' &&
    ['Level 1', 'Level 2', 'Level 3'].includes(item.level) &&
    typeof item.image === 'string' && typeof item.topic === 'string' &&
    Number.isFinite(item.position) && item.position >= 0 && item.position <= 1 &&
    Number.isFinite(item.updatedAt))
    .sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 12);
}

export function saveReadingBookmark(account: string, bookmark: ReadingBookmark) {
  const previous = readReadingHistory(account).filter(item => item.id !== bookmark.id || item.level !== bookmark.level);
  return writeLearningValue(readingHistoryKey(account), [bookmark, ...previous].slice(0, 12));
}

export function readStudyTasks(account: string): StudyTask[] {
  const value = readLearningValue<unknown>(`study-room:${account}:tasks`);
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is StudyTask => Boolean(item) && typeof item.id === 'string' &&
    typeof item.label === 'string' && typeof item.completed === 'boolean');
}

export function saveStudyTasks(account: string, tasks: StudyTask[]) {
  return writeLearningValue(`study-room:${account}:tasks`, tasks);
}
