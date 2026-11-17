import type { ReaderArticleData } from '../services/readerApiService';
import type { ReaderSessionState, ShadowingEvaluation } from '../services/readerSessionStorage';
import { buildPracticeSegments } from './readerPractice';

export type JourneyActivityId = 'read' | 'vocab' | 'dictation' | 'shadowing' | 'summary';

export type JourneyActivityStatus = 'not_started' | 'in_progress' | 'completed';

export interface VocabJourneyDetails {
  reviewed: number;
  remembered: number;
  needsReview: number;
  unreviewed: number;
}

export interface DictationJourneyDetails {
  selfCompleted: number;
  hinted: number;
  answerRevealed: number;
  finished: number;
}

export interface ShadowingJourneyDetails {
  recorded: number;
  evaluated: number;
  satisfied: number;
  needsWork: number;
}

export interface JourneyActivityProgress<TDetails = unknown> {
  id: JourneyActivityId;
  available: boolean;
  status: JourneyActivityStatus;
  completed: boolean;
  current: number;
  total: number;
  percent: number;
  details?: TDetails;
}

export interface ReaderJourneyViewModel {
  activities: {
    read: JourneyActivityProgress;
    vocab: JourneyActivityProgress<VocabJourneyDetails>;
    dictation: JourneyActivityProgress<DictationJourneyDetails>;
    shadowing: JourneyActivityProgress<ShadowingJourneyDetails>;
    summary: JourneyActivityProgress;
  };
  recommendedNext: JourneyActivityId | null;
  completedCount: number;
  totalAvailableCount: number;
  progressPercent: number;
}

/**
 * Pure adapter deriving learning journey display states from actual article and session data.
 * Does not mutate or duplicate session state.
 */
export function getReaderJourneyViewModel(
  article: ReaderArticleData | null,
  session: ReaderSessionState
): ReaderJourneyViewModel {
  // 1. Reading Activity
  const hasReadingContent = Boolean(
    article && (
      (article.paragraphs && article.paragraphs.length > 0) ||
      article.summary ||
      article.titleEn
    )
  );
  const readCompleted = Boolean(session.readCompleted);
  const readProgress: JourneyActivityProgress = {
    id: 'read',
    available: hasReadingContent,
    status: readCompleted ? 'completed' : 'not_started',
    completed: readCompleted,
    current: readCompleted ? 1 : 0,
    total: 1,
    percent: readCompleted ? 100 : 0,
  };

  // 2. Vocabulary Activity
  const vocabularies = article?.vocabularies ?? [];
  const vocabTotal = vocabularies.length;
  const vocabAvailable = vocabTotal > 0;
  const vocabIdSet = new Set(vocabularies.map((v) => v.id));

  const validReviewedIds = (session.vocab?.reviewedIds ?? []).filter((id) => vocabIdSet.has(id));
  const validRememberedIds = (session.vocab?.rememberedIds ?? []).filter((id) => vocabIdSet.has(id));
  const validReviewLaterIds = (session.vocab?.reviewLaterIds ?? []).filter((id) => vocabIdSet.has(id));

  const reviewedCount = new Set(validReviewedIds).size;
  const rememberedCount = new Set(validRememberedIds).size;
  const needsReviewCount = new Set(validReviewLaterIds).size;
  const unreviewedCount = Math.max(0, vocabTotal - reviewedCount);

  const vocabCompleted = vocabAvailable && reviewedCount >= vocabTotal;
  const vocabStatus: JourneyActivityStatus = !vocabAvailable
    ? 'not_started'
    : vocabCompleted
    ? 'completed'
    : reviewedCount > 0
    ? 'in_progress'
    : 'not_started';

  const vocabProgress: JourneyActivityProgress<VocabJourneyDetails> = {
    id: 'vocab',
    available: vocabAvailable,
    status: vocabStatus,
    completed: vocabCompleted,
    current: reviewedCount,
    total: vocabTotal,
    percent: vocabTotal > 0 ? Math.min(100, Math.round((reviewedCount / vocabTotal) * 100)) : 0,
    details: {
      reviewed: reviewedCount,
      remembered: rememberedCount,
      needsReview: needsReviewCount,
      unreviewed: unreviewedCount,
    },
  };

  // 3. Dictation Activity
  const segments = article ? buildPracticeSegments(article) : [];
  const segmentsTotal = segments.length;
  const dictationAvailable = segmentsTotal > 0;
  const passageRecords = session.dictation?.passageRecords ?? {};

  const dictationStatuses = segments.map((_, idx) => passageRecords[idx]?.status);
  const selfCompletedCount = dictationStatuses.filter((s) => s === 'completed-self').length;
  const hintedCount = dictationStatuses.filter((s) => s === 'completed-hinted').length;
  const answerRevealedCount = dictationStatuses.filter((s) => s === 'answer-revealed').length;
  const dictationFinishedCount = selfCompletedCount + hintedCount + answerRevealedCount;

  const dictationCompleted = dictationAvailable && dictationFinishedCount >= segmentsTotal;
  const dictationStatus: JourneyActivityStatus = !dictationAvailable
    ? 'not_started'
    : dictationCompleted
    ? 'completed'
    : dictationFinishedCount > 0
    ? 'in_progress'
    : 'not_started';

  const dictationProgress: JourneyActivityProgress<DictationJourneyDetails> = {
    id: 'dictation',
    available: dictationAvailable,
    status: dictationStatus,
    completed: dictationCompleted,
    current: dictationFinishedCount,
    total: segmentsTotal,
    percent: segmentsTotal > 0 ? Math.min(100, Math.round((dictationFinishedCount / segmentsTotal) * 100)) : 0,
    details: {
      selfCompleted: selfCompletedCount,
      hinted: hintedCount,
      answerRevealed: answerRevealedCount,
      finished: dictationFinishedCount,
    },
  };

  // 4. Shadowing Activity
  const shadowingAvailable = segmentsTotal > 0;
  const segmentIdSet = new Set(segments.map((s) => s.id));

  const validRecordedIds = (session.shadowing?.recordedSegmentIds ?? []).filter((id) => segmentIdSet.has(id));
  const recordedCount = new Set(validRecordedIds).size;

  const selfEvaluations = (session.shadowing?.selfEvaluations ?? {}) as Record<string, ShadowingEvaluation>;
  const validEvaluations = Object.entries(selfEvaluations).filter(([id]) => segmentIdSet.has(id));
  const satisfiedCount = validEvaluations.filter(([, val]) => val === 'satisfied').length;
  const needsWorkCount = validEvaluations.filter(([, val]) => val === 'needs_work').length;
  const evaluatedCount = satisfiedCount + needsWorkCount;

  const shadowingCompleted = shadowingAvailable && evaluatedCount >= segmentsTotal;
  const shadowingStatus: JourneyActivityStatus = !shadowingAvailable
    ? 'not_started'
    : shadowingCompleted
    ? 'completed'
    : (evaluatedCount > 0 || recordedCount > 0)
    ? 'in_progress'
    : 'not_started';

  const shadowingProgress: JourneyActivityProgress<ShadowingJourneyDetails> = {
    id: 'shadowing',
    available: shadowingAvailable,
    status: shadowingStatus,
    completed: shadowingCompleted,
    current: evaluatedCount,
    total: segmentsTotal,
    percent: segmentsTotal > 0 ? Math.min(100, Math.round((evaluatedCount / segmentsTotal) * 100)) : 0,
    details: {
      recorded: recordedCount,
      evaluated: evaluatedCount,
      satisfied: satisfiedCount,
      needsWork: needsWorkCount,
    },
  };

  // Overall available core activities calculation
  const coreActivities: JourneyActivityProgress[] = [
    readProgress,
    vocabProgress,
    dictationProgress,
    shadowingProgress,
  ];
  const availableCore = coreActivities.filter((a) => a.available);
  const totalAvailableCount = availableCore.length;
  const completedCore = availableCore.filter((a) => a.completed);
  const completedCount = completedCore.length;
  const progressPercent =
    totalAvailableCount > 0 ? Math.round((completedCount / totalAvailableCount) * 100) : 0;

  // 5. Summary / Recap Activity (accessible anytime)
  const allCoreDone = totalAvailableCount > 0 && completedCount === totalAvailableCount;
  const summaryProgress: JourneyActivityProgress = {
    id: 'summary',
    available: true,
    status: allCoreDone ? 'completed' : completedCount > 0 ? 'in_progress' : 'not_started',
    completed: allCoreDone,
    current: completedCount,
    total: totalAvailableCount,
    percent: progressPercent,
  };

  // Recommended Next Activity
  // Progression suggestion: read -> vocab -> dictation -> shadowing -> summary
  let recommendedNext: JourneyActivityId | null = null;
  if (readProgress.available && !readProgress.completed) {
    recommendedNext = 'read';
  } else if (vocabProgress.available && !vocabProgress.completed) {
    recommendedNext = 'vocab';
  } else if (dictationProgress.available && !dictationProgress.completed) {
    recommendedNext = 'dictation';
  } else if (shadowingProgress.available && !shadowingProgress.completed) {
    recommendedNext = 'shadowing';
  } else if (totalAvailableCount > 0) {
    recommendedNext = 'summary';
  }

  return {
    activities: {
      read: readProgress,
      vocab: vocabProgress,
      dictation: dictationProgress,
      shadowing: shadowingProgress,
      summary: summaryProgress,
    },
    recommendedNext,
    completedCount,
    totalAvailableCount,
    progressPercent,
  };
}
