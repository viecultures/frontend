import type { DictationState } from '../../playground/hooks/useLetterRevealDictation';

export interface DictationSessionData {
  articleId: string;
  level: string;
  lastPassageIndex: number;
  records: Record<number, DictationState>;
  speed: number;
  repeat: boolean;
}

const STORAGE_PREFIX = 'vc_dictation_session_v1_';

export function getSessionStorageKey(articleId: string, level: string): string {
  return `${STORAGE_PREFIX}${articleId}_${level.replace(/\s+/g, '_')}`;
}

export function loadDictationSession(articleId: string, level: string): DictationSessionData | null {
  try {
    const raw = localStorage.getItem(getSessionStorageKey(articleId, level));
    if (!raw) return null;
    return JSON.parse(raw) as DictationSessionData;
  } catch {
    return null;
  }
}

export function saveDictationSession(session: DictationSessionData): void {
  try {
    localStorage.setItem(
      getSessionStorageKey(session.articleId, session.level),
      JSON.stringify(session)
    );
  } catch {
    // Ignore storage quota or disabled localStorage
  }
}

export function clearDictationSession(articleId: string, level: string): void {
  try {
    localStorage.removeItem(getSessionStorageKey(articleId, level));
  } catch {
    // Ignore
  }
}
