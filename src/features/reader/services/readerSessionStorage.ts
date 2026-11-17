export type ShadowingEvaluation = 'satisfied' | 'needs_work';
import type { DictationState } from '@/features/playground/hooks/useLetterRevealDictation';
import { loadDictationSession } from './dictationSessionStorage';

export interface ReaderSessionState {
  articleId: string;
  level: string;
  readCompleted: boolean;
  vocab: { reviewedIds: string[]; rememberedIds: string[]; reviewLaterIds: string[] };
  dictation: { total: number; passageRecords: Record<number, DictationState> };
  shadowing: { recordedSegmentIds: string[]; selfEvaluations: Record<string, ShadowingEvaluation> };
  updatedAt: number;
}

const PREFIX = 'reader_session_';

export function readerSessionKey(articleId: string, level: string): string {
  return `${PREFIX}${encodeURIComponent(articleId)}_${encodeURIComponent(level)}`;
}

export function emptyReaderSession(articleId: string, level: string): ReaderSessionState {
  return {
    articleId,
    level,
    readCompleted: false,
    vocab: { reviewedIds: [], rememberedIds: [], reviewLaterIds: [] },
    dictation: { total: 0, passageRecords: loadDictationSession(articleId, level)?.records || {} },
    shadowing: { recordedSegmentIds: [], selfEvaluations: {} },
    updatedAt: Date.now(),
  };
}

export function loadReaderSession(articleId: string, level: string): ReaderSessionState {
  const initial = emptyReaderSession(articleId, level);
  try {
    const raw = localStorage.getItem(readerSessionKey(articleId, level));
    if (!raw) return initial;
    const parsed = JSON.parse(raw) as Partial<ReaderSessionState>;
    if (parsed.articleId !== articleId || parsed.level !== level) return initial;
    return {
      ...initial,
      readCompleted: parsed.readCompleted === true,
      vocab: {
        reviewedIds: Array.isArray(parsed.vocab?.reviewedIds) ? parsed.vocab.reviewedIds : [],
        rememberedIds: Array.isArray(parsed.vocab?.rememberedIds) ? parsed.vocab.rememberedIds : [],
        reviewLaterIds: Array.isArray(parsed.vocab?.reviewLaterIds) ? parsed.vocab.reviewLaterIds : [],
      },
      dictation: {
        total: typeof parsed.dictation?.total === 'number' ? parsed.dictation.total : 0,
        passageRecords: parsed.dictation?.passageRecords || initial.dictation.passageRecords,
      },
      shadowing: {
        recordedSegmentIds: Array.isArray(parsed.shadowing?.recordedSegmentIds) ? parsed.shadowing.recordedSegmentIds : [],
        selfEvaluations: parsed.shadowing?.selfEvaluations || {},
      },
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : initial.updatedAt,
    };
  } catch {
    return initial;
  }
}

export function saveReaderSession(session: ReaderSessionState): boolean {
  try {
    localStorage.setItem(readerSessionKey(session.articleId, session.level), JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}
