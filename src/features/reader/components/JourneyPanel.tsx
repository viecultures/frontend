import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  Headphones,
  Layers,
  Mic,
  Sparkles,
} from 'lucide-react';
import type { ReaderJourneyViewModel, JourneyActivityId, JourneyActivityProgress } from '../lib/readerJourneyViewModel';
import type { LessonStep } from './LessonStepper';
import type { StoryRewardStatusResponse } from '../types/rewardTypes';

export interface JourneyPanelProps {
  journey: ReaderJourneyViewModel;
  activeStep?: LessonStep | null;
  onSelectStep: (step: LessonStep) => void;
  themeMode?: 'paper' | 'dark';
  className?: string;
  rewardStatus?: StoryRewardStatusResponse | null;
  onOpenSealModal?: () => void;
}

const ACTIVITY_ICONS: Record<JourneyActivityId, React.ElementType> = {
  read: BookOpen,
  vocab: Layers,
  dictation: Headphones,
  shadowing: Mic,
  summary: ClipboardList,
};

export const JourneyPanel: React.FC<JourneyPanelProps> = ({
  journey,
  activeStep,
  onSelectStep,
  themeMode = 'paper',
  className = '',
  rewardStatus,
  onOpenSealModal,
}) => {
  const { t } = useTranslation('reader');
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(false);

  const { activities, recommendedNext, completedCount, totalAvailableCount, progressPercent } = journey;

  const getActivityLabel = (id: JourneyActivityId) => {
    switch (id) {
      case 'read':
        return t('journey.read', 'Read');
      case 'vocab':
        return t('journey.vocab', 'Review words');
      case 'dictation':
        return t('journey.dictation', 'Dictation');
      case 'shadowing':
        return t('journey.shadowing', 'Shadowing');
      case 'summary':
        return t('journey.results', 'View results');
    }
  };

  const getStatusBadge = (activity: JourneyActivityProgress) => {
    if (!activity.available) {
      return (
        <span className="reader-journey-badge reader-journey-badge--unavailable">
          {t('journey.status_unavailable', 'Unavailable')}
        </span>
      );
    }
    if (activity.completed) {
      return (
        <span className="reader-journey-badge reader-journey-badge--completed">
          <CheckCircle2 size={12} className="inline mr-1" aria-hidden="true" />
          {t('journey.status_completed', 'Completed')}
        </span>
      );
    }
    if (activity.status === 'in_progress') {
      return (
        <span className="reader-journey-badge reader-journey-badge--in-progress">
          {t('journey.status_in_progress', 'In progress')}
        </span>
      );
    }
    return (
      <span className="reader-journey-badge reader-journey-badge--not-started">
        {t('journey.status_not_started', 'Not started')}
      </span>
    );
  };

  const renderActivityRow = (id: JourneyActivityId) => {
    const activity = activities[id];
    if (!activity) return null;
    const Icon = ACTIVITY_ICONS[id];
    const isCurrent = activeStep === id;

    let progressDescription = '';
    if (id === 'read') {
      progressDescription = activity.completed
        ? t('journey.reading_self_confirmed', 'Self-confirmed by learner')
        : t('journey.reading_not_confirmed', 'Not yet confirmed');
    } else if (id === 'vocab') {
      progressDescription = t('journey.vocab_progress', {
        done: activity.current,
        total: activity.total,
        defaultValue: `${activity.current}/${activity.total} words reviewed`,
      });
    } else if (id === 'dictation') {
      progressDescription = t('journey.dictation_progress', {
        done: activity.current,
        total: activity.total,
        defaultValue: `${activity.current}/${activity.total} passages finished`,
      });
    } else if (id === 'shadowing') {
      progressDescription = t('journey.shadowing_progress', {
        done: activity.current,
        total: activity.total,
        defaultValue: `${activity.current}/${activity.total} passages evaluated`,
      });
    }

    return (
      <div
        key={id}
        className={`reader-journey-item ${isCurrent ? 'is-active' : ''} ${activity.completed ? 'is-completed' : ''} ${!activity.available ? 'is-disabled' : ''}`}
      >
        <button
          type="button"
          disabled={!activity.available}
          onClick={() => onSelectStep(id as LessonStep)}
          className="reader-journey-item-button"
          aria-current={isCurrent ? 'step' : undefined}
          title={!activity.available ? t('journey.unavailable', { activity: getActivityLabel(id) }) : undefined}
        >
          <div className="reader-journey-item-icon" aria-hidden="true">
            <Icon size={17} />
          </div>

          <div className="reader-journey-item-info">
            <div className="reader-journey-item-title-row">
              <div className="flex items-center gap-1.5">
                <span className="reader-journey-item-title">{getActivityLabel(id)}</span>
                {isCurrent && (
                  <span className="reader-journey-badge reader-journey-badge--active">
                    {t('journey.active_badge', 'Active')}
                  </span>
                )}
              </div>
              {getStatusBadge(activity)}
            </div>

            <span className="reader-journey-item-desc">{progressDescription}</span>

            {activity.available && activity.total > 0 && id !== 'read' && (
              <div className="reader-journey-progress-track" aria-hidden="true">
                <div
                  className="reader-journey-progress-fill"
                  style={{ width: `${activity.percent}%` }}
                />
              </div>
            )}
          </div>

          <div className="reader-journey-item-action" aria-hidden="true">
            <ChevronRight size={15} />
          </div>
        </button>
      </div>
    );
  };

  return (
    <aside
      className={`reader-journey-panel ${className}`}
      data-desk-theme={themeMode}
      aria-label={t('journey.panel_title', 'Learning Journey')}
    >
      {/* Header with official turtle mascot and non-mastery factual status */}
      <div className="reader-journey-panel-header">
        <div className="reader-journey-panel-brand">
          <div className="reader-journey-mascot-wrapper">
            <img
              src="/brand/viecultures-mascot-logo.png"
              alt=""
              className="reader-journey-mascot-img"
              width="32"
              height="32"
            />
          </div>
          <div>
            <h2 className="reader-journey-panel-title">
              {t('journey.panel_title', 'Learning Journey')}
            </h2>
            <p className="reader-journey-panel-summary">
              {t('journey.progress_summary', {
                done: completedCount,
                total: totalAvailableCount,
                defaultValue: `${completedCount} of ${totalAvailableCount} completed`,
              })}
            </p>
          </div>
        </div>

        {/* Mobile / Tablet expand & collapse toggle button */}
        <button
          type="button"
          className="reader-journey-mobile-toggle"
          onClick={() => setIsMobileExpanded((prev) => !prev)}
          aria-expanded={isMobileExpanded}
          aria-controls="reader-journey-content"
        >
          <span>{isMobileExpanded ? t('journey.collapse_details', 'Hide details') : t('journey.expand_details', 'Details')}</span>
          {isMobileExpanded ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
        </button>
      </div>

      {/* Overall Progress Meter */}
      <div className="reader-journey-meter" aria-hidden="true">
        <div
          className="reader-journey-meter-bar"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Content Area (Always visible on desktop, toggleable on mobile/tablet) */}
      <div
        id="reader-journey-content"
        className={`reader-journey-content ${isMobileExpanded ? 'is-expanded-mobile' : ''}`}
      >
        {/* Recommended Next Activity Pill */}
        {recommendedNext && recommendedNext !== activeStep && (
          <div className="reader-journey-recommendation">
            <div className="reader-journey-recommendation-content">
              <Sparkles size={13} className="reader-journey-sparkle-icon" aria-hidden="true" />
              <span>
                {t(`journey.suggest_${recommendedNext}`, {
                  defaultValue: `Suggested next: ${getActivityLabel(recommendedNext)}`,
                })}
              </span>
            </div>
            <button
              type="button"
              className="reader-journey-recommend-btn"
              onClick={() => onSelectStep(recommendedNext as LessonStep)}
              aria-label={t(`journey.suggest_${recommendedNext}`, {
                defaultValue: `Go to ${getActivityLabel(recommendedNext)}`,
              })}
            >
              <ChevronRight size={14} aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Core Learning Activities List (Clean, simplified cards without duplicated completion triggers) */}
        <div className="reader-journey-activities-list" role="list">
          {renderActivityRow('read')}
          {renderActivityRow('vocab')}
          {renderActivityRow('dictation')}
          {renderActivityRow('shadowing')}
        </div>

        {/* Cultural Mộc Son Reward Status */}
        {rewardStatus && (
          <div className="reader-journey-reward-status mt-3 pt-3 border-t border-antique-gold/20">
            <div className="flex items-center justify-between text-xs font-serif text-heritage-green mb-1.5">
              <span className="flex items-center gap-1.5 font-semibold">
                <Award size={15} className={rewardStatus.hasStamp ? "text-antique-gold" : rewardStatus.eligibleToClaim ? "text-terracotta animate-bounce" : "text-ink-soft/40"} />
                {t('bilingual.heritage_seal', 'Mộc Son Di Sản')}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-sans font-medium ${
                rewardStatus.hasStamp
                  ? "bg-emerald-100/70 text-emerald-800"
                  : rewardStatus.eligibleToClaim
                  ? "bg-terracotta/15 text-terracotta animate-pulse"
                  : "bg-black/5 text-ink-soft/60"
              }`}>
                {rewardStatus.hasStamp
                  ? t('bilingual.stamp_status_owned', 'Đã nhận')
                  : rewardStatus.eligibleToClaim
                  ? t('bilingual.stamp_status_ready', 'Sẵn sàng nhận')
                  : t('bilingual.stamp_status_unclaimed', 'Chưa đạt')}
              </span>
            </div>
            {onOpenSealModal && (
              <button
                type="button"
                onClick={onOpenSealModal}
                className={`w-full mt-1.5 py-1.5 px-3 rounded-lg text-xs font-sans flex items-center justify-center gap-1.5 transition-colors ${
                  rewardStatus.hasStamp
                    ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                    : rewardStatus.eligibleToClaim
                    ? "text-warm-ivory bg-terracotta hover:bg-terracotta/90 font-semibold shadow-xs"
                    : "text-ink-soft/70 bg-warm-ivory hover:text-ink-soft border border-antique-gold/20"
                }`}
              >
                <Award size={14} />
                {rewardStatus.hasStamp
                  ? t('bilingual.view_stamp_btn', 'Xem Mộc Son')
                  : rewardStatus.eligibleToClaim
                  ? t('bilingual.claim_stamp_btn', 'Đóng Mộc Son Đỏ')
                  : t('bilingual.stamp_seal_btn', 'Xem Mộc Son')}
              </button>
            )}
          </div>
        )}

        {/* Journey Recap Navigation Link */}
        <div className="reader-journey-recap-footer">
          <button
            type="button"
            className={`reader-journey-recap-btn ${activeStep === 'summary' ? 'is-active' : ''}`}
            onClick={() => onSelectStep('summary')}
          >
            <ClipboardList size={16} aria-hidden="true" />
            <div className="reader-journey-recap-btn-text">
              <span className="font-semibold">{t('journey.view_recap', 'View Journey Recap')}</span>
              <span className="text-xs opacity-75">{t('journey.results_anytime', 'Available anytime')}</span>
            </div>
            <ChevronRight size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
};
