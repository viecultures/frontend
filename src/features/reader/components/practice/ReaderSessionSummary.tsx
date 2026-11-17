import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Compass,
  Headphones,
  Info,
  Layers,
  Mic,
  RotateCcw,
} from 'lucide-react';
import { getSeriesNavigation } from '@/data/series';
import { PATHS, paths } from '@/routes/paths';
import type { ReaderArticleData } from '../../services/readerApiService';
import type { ReaderSessionState } from '../../services/readerSessionStorage';
import { getReaderJourneyViewModel } from '../../lib/readerJourneyViewModel';
import type { PracticeMode } from '../../lib/readerPractice';

interface Props {
  article: ReaderArticleData;
  level: string;
  session: ReaderSessionState;
  onBackToReading?: () => void;
  onSelectPractice?: (mode: PracticeMode) => void;
}

export const ReaderSessionSummary: React.FC<Props> = ({
  article,
  level,
  session,
  onBackToReading,
  onSelectPractice,
}) => {
  const { t } = useTranslation('reader');
  const journey = getReaderJourneyViewModel(article, session);
  const { activities, completedCount, totalAvailableCount, progressPercent } = journey;

  const nextChapter = getSeriesNavigation(article.id)?.nextChapter;

  return (
    <section
      className="reader-session-summary"
      aria-label={t('journey.recap_title', 'Learning Journey Recap')}
    >
      {/* Header */}
      <div className="reader-summary-header">
        <div className="reader-summary-title-group">
          <span className="reader-summary-kicker">
            {t('journey.recap_title', 'Learning Journey Recap')}
          </span>
          <h2 className="reader-summary-title">
            {article.titleVi || article.titleEn}
          </h2>
          <p className="reader-summary-meta">
            <span>{level}</span>
            <span aria-hidden="true">·</span>
            <span>
              {t('journey.progress_summary', {
                done: completedCount,
                total: totalAvailableCount,
                defaultValue: `${completedCount} of ${totalAvailableCount} activities completed`,
              })} ({progressPercent}%)
            </span>
          </p>
        </div>

        {/* Mascot representation */}
        <div className="reader-summary-mascot" aria-hidden="true">
          <img
            src="/brand/viecultures-mascot-logo.png"
            alt=""
            className="w-12 h-12 rounded-xl object-cover border border-antique-gold/40 shadow-sm"
          />
        </div>
      </div>

      {/* Honest Learning Assurance Alert */}
      <div className="reader-summary-note" role="note">
        <Info size={16} className="shrink-0 text-antique-gold" aria-hidden="true" />
        <p className="text-xs leading-relaxed opacity-90">
          {t(
            'journey.recap_honest_note',
            'Based strictly on your actual session activity. Pronunciation accuracy and long-term mastery are not fabricated.'
          )}
        </p>
      </div>

      {/* Activity Breakdown Cards */}
      <div className="reader-summary-grid">
        {/* 1. Reading */}
        <div className={`reader-summary-card ${activities.read.completed ? 'is-completed' : ''}`}>
          <div className="reader-summary-card-header">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-heritage-green dark:text-antique-gold" aria-hidden="true" />
              <h3 className="font-semibold text-sm">{t('journey.read', 'Read')}</h3>
            </div>
            {activities.read.completed ? (
              <span className="reader-journey-badge reader-journey-badge--completed">
                <CheckCircle2 size={12} className="inline mr-1" aria-hidden="true" />
                {t('journey.status_completed', 'Completed')}
              </span>
            ) : (
              <span className="reader-journey-badge reader-journey-badge--not-started">
                {t('journey.status_not_started', 'Not started')}
              </span>
            )}
          </div>
          <p className="reader-summary-card-desc">
            {session.readCompleted
              ? t('journey.reading_self_confirmed', 'Self-confirmed by learner')
              : t('journey.reading_not_confirmed', 'Not yet confirmed')}
          </p>
          {onBackToReading ? (
            <button
              type="button"
              onClick={onBackToReading}
              className="reader-summary-activity-link"
            >
              <span>{t('journey.read', 'Read')}</span>
              <ChevronRight size={14} aria-hidden="true" />
            </button>
          ) : (
            <Link
              to={paths.reader({ postId: article.id, level })}
              className="reader-summary-activity-link"
            >
              <span>{t('journey.read', 'Read')}</span>
              <ChevronRight size={14} aria-hidden="true" />
            </Link>
          )}
        </div>

        {/* 2. Vocabulary */}
        <div
          className={`reader-summary-card ${
            activities.vocab.completed
              ? 'is-completed'
              : !activities.vocab.available
              ? 'is-unavailable'
              : ''
          }`}
        >
          <div className="reader-summary-card-header">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-heritage-green dark:text-antique-gold" aria-hidden="true" />
              <h3 className="font-semibold text-sm">{t('journey.vocab', 'Review words')}</h3>
            </div>
            {!activities.vocab.available ? (
              <span className="reader-journey-badge reader-journey-badge--unavailable">
                {t('journey.status_unavailable', 'Unavailable')}
              </span>
            ) : activities.vocab.completed ? (
              <span className="reader-journey-badge reader-journey-badge--completed">
                <CheckCircle2 size={12} className="inline mr-1" aria-hidden="true" />
                {t('journey.status_completed', 'Completed')}
              </span>
            ) : (
              <span className="reader-journey-badge reader-journey-badge--in-progress">
                {activities.vocab.current}/{activities.vocab.total}
              </span>
            )}
          </div>
          <p className="reader-summary-card-desc">
            {activities.vocab.available
              ? t('journey.vocab_breakdown', {
                  reviewed: activities.vocab.details?.reviewed ?? 0,
                  total: activities.vocab.total,
                  remembered: activities.vocab.details?.remembered ?? 0,
                  needsReview: activities.vocab.details?.needsReview ?? 0,
                  defaultValue: `${activities.vocab.details?.reviewed ?? 0}/${activities.vocab.total} reviewed · ${activities.vocab.details?.remembered ?? 0} remembered · ${activities.vocab.details?.needsReview ?? 0} need review`,
                })
              : t('journey.unavailable', { activity: t('journey.vocab') })}
          </p>
          {activities.vocab.available && (
            onSelectPractice ? (
              <button
                type="button"
                onClick={() => onSelectPractice('vocab')}
                className="reader-summary-activity-link"
              >
                <span>{t('journey.vocab_activity', 'Review article words')}</span>
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            ) : (
              <Link
                to={paths.reader({ postId: article.id, level, mode: 'practice', practice: 'dictation' })}
                className="reader-summary-activity-link"
              >
                <span>{t('journey.vocab_activity', 'Review article words')}</span>
                <ChevronRight size={14} aria-hidden="true" />
              </Link>
            )
          )}
        </div>

        {/* 3. Dictation */}
        <div
          className={`reader-summary-card ${
            activities.dictation.completed
              ? 'is-completed'
              : !activities.dictation.available
              ? 'is-unavailable'
              : ''
          }`}
        >
          <div className="reader-summary-card-header">
            <div className="flex items-center gap-2">
              <Headphones size={18} className="text-heritage-green dark:text-antique-gold" aria-hidden="true" />
              <h3 className="font-semibold text-sm">{t('journey.dictation', 'Dictation')}</h3>
            </div>
            {!activities.dictation.available ? (
              <span className="reader-journey-badge reader-journey-badge--unavailable">
                {t('journey.status_unavailable', 'Unavailable')}
              </span>
            ) : activities.dictation.completed ? (
              <span className="reader-journey-badge reader-journey-badge--completed">
                <CheckCircle2 size={12} className="inline mr-1" aria-hidden="true" />
                {t('journey.status_completed', 'Completed')}
              </span>
            ) : (
              <span className="reader-journey-badge reader-journey-badge--in-progress">
                {activities.dictation.current}/{activities.dictation.total}
              </span>
            )}
          </div>
          <p className="reader-summary-card-desc">
            {activities.dictation.available
              ? t('journey.dictation_breakdown', {
                  finished: activities.dictation.details?.finished ?? 0,
                  total: activities.dictation.total,
                  self: activities.dictation.details?.selfCompleted ?? 0,
                  hinted: activities.dictation.details?.hinted ?? 0,
                  revealed: activities.dictation.details?.answerRevealed ?? 0,
                  defaultValue: `${activities.dictation.details?.finished ?? 0}/${activities.dictation.total} passages finished (${activities.dictation.details?.selfCompleted ?? 0} self, ${activities.dictation.details?.hinted ?? 0} hinted, ${activities.dictation.details?.answerRevealed ?? 0} revealed)`,
                })
              : t('journey.unavailable', { activity: t('journey.dictation') })}
          </p>
          {activities.dictation.available && (
            onSelectPractice ? (
              <button
                type="button"
                onClick={() => onSelectPractice('dictation')}
                className="reader-summary-activity-link"
              >
                <span>{t('journey.dictation_activity', 'Practice dictation')}</span>
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            ) : (
              <Link
                to={paths.reader({ postId: article.id, level, mode: 'practice', practice: 'dictation' })}
                className="reader-summary-activity-link"
              >
                <span>{t('journey.dictation_activity', 'Practice dictation')}</span>
                <ChevronRight size={14} aria-hidden="true" />
              </Link>
            )
          )}
        </div>

        {/* 4. Shadowing */}
        <div
          className={`reader-summary-card ${
            activities.shadowing.completed
              ? 'is-completed'
              : !activities.shadowing.available
              ? 'is-unavailable'
              : ''
          }`}
        >
          <div className="reader-summary-card-header">
            <div className="flex items-center gap-2">
              <Mic size={18} className="text-heritage-green dark:text-antique-gold" aria-hidden="true" />
              <h3 className="font-semibold text-sm">{t('journey.shadowing', 'Shadowing')}</h3>
            </div>
            {!activities.shadowing.available ? (
              <span className="reader-journey-badge reader-journey-badge--unavailable">
                {t('journey.status_unavailable', 'Unavailable')}
              </span>
            ) : activities.shadowing.completed ? (
              <span className="reader-journey-badge reader-journey-badge--completed">
                <CheckCircle2 size={12} className="inline mr-1" aria-hidden="true" />
                {t('journey.status_completed', 'Completed')}
              </span>
            ) : (
              <span className="reader-journey-badge reader-journey-badge--in-progress">
                {activities.shadowing.current}/{activities.shadowing.total}
              </span>
            )}
          </div>
          <p className="reader-summary-card-desc">
            {activities.shadowing.available ? (
              <>
                <span>
                  {t('journey.shadowing_breakdown', {
                    evaluated: activities.shadowing.details?.evaluated ?? 0,
                    total: activities.shadowing.total,
                    satisfied: activities.shadowing.details?.satisfied ?? 0,
                    needsWork: activities.shadowing.details?.needsWork ?? 0,
                    defaultValue: `${activities.shadowing.details?.evaluated ?? 0}/${activities.shadowing.total} passages evaluated (${activities.shadowing.details?.satisfied ?? 0} satisfied, ${activities.shadowing.details?.needsWork ?? 0} need practice)`,
                  })}
                </span>
                <span className="block mt-1 text-xs opacity-80">
                  {t('journey.shadowing_recorded_stat', {
                    recorded: activities.shadowing.details?.recorded ?? 0,
                    total: activities.shadowing.total,
                    defaultValue: `${activities.shadowing.details?.recorded ?? 0}/${activities.shadowing.total} passages recorded`,
                  })}
                </span>
              </>
            ) : (
              t('journey.unavailable', { activity: t('journey.shadowing') })
            )}
          </p>
          {activities.shadowing.available && (
            onSelectPractice ? (
              <button
                type="button"
                onClick={() => onSelectPractice('shadowing')}
                className="reader-summary-activity-link"
              >
                <span>{t('journey.shadowing_activity', 'Practice shadowing')}</span>
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            ) : (
              <Link
                to={paths.reader({ postId: article.id, level, mode: 'practice', practice: 'shadowing' })}
                className="reader-summary-activity-link"
              >
                <span>{t('journey.shadowing_activity', 'Practice shadowing')}</span>
                <ChevronRight size={14} aria-hidden="true" />
              </Link>
            )
          )}
        </div>
      </div>

      {/* Shadowing RAM audio take notice */}
      {activities.shadowing.available && (
        <p className="reader-summary-audio-notice">
          {t(
            'journey.recap_audio_notice',
            'Audio takes are kept in session memory only and reset upon page reload; your self-evaluations remain saved.'
          )}
        </p>
      )}

      {/* Global Navigation Actions */}
      <div className="reader-session-summary-actions">
        {onBackToReading ? (
          <button type="button" onClick={onBackToReading} className="reader-journey-continue">
            <RotateCcw size={17} aria-hidden="true" />
            <span>{t('toolbar.back_to_reading', 'Back to reading')}</span>
          </button>
        ) : (
          <Link to={paths.reader({ postId: article.id, level })}>
            <RotateCcw size={17} aria-hidden="true" />
            <span>{t('toolbar.back_to_reading', 'Back to reading')}</span>
          </Link>
        )}

        {nextChapter && (
          <Link to={paths.reader({ postId: nextChapter.id, level })}>
            <BookOpen size={17} aria-hidden="true" />
            <span>{t('series_nav.read_next', 'Read next story')}</span>
          </Link>
        )}

        <Link to={PATHS.discovery}>
          <Compass size={17} aria-hidden="true" />
          <span>{t('toolbar.back_to_discovery', 'Back to Discovery')}</span>
        </Link>
      </div>
    </section>
  );
};
export default ReaderSessionSummary;
