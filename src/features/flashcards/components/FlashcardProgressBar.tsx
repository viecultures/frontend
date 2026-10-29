import { useTranslation } from "react-i18next";

interface FlashcardProgressBarProps {
  currentIndex: number;
  totalCards: number;
  isComplete?: boolean;
  reviewedCount?: number;
}

export function FlashcardProgressBar({ currentIndex, totalCards, isComplete = false, reviewedCount = currentIndex }: FlashcardProgressBarProps) {
  const { t } = useTranslation('flashcards');
  const completed = Math.min(totalCards, Math.max(0, reviewedCount));
  const percentage = totalCards > 0 ? Math.round(completed / totalCards * 100) : 0;

  return (
    <div className="vocab-study-progress">
      <div>
        <span>
          {isComplete
            ? t('progress_bar.complete', 'Deck complete')
            : t('progress_bar.card_of', { current: Math.min(currentIndex + 1, totalCards), total: totalCards, defaultValue: `Card ${Math.min(currentIndex + 1, totalCards)} / ${totalCards}` })}
        </span>
        <span>{t('progress_bar.percent_complete', { percent: percentage, defaultValue: `${percentage}% complete` })}</span>
      </div>
      <div
        className="vocab-progress-track"
        role="progressbar"
        aria-label={t('progress_bar.aria_label', 'Review progress')}
        aria-valuemin={0}
        aria-valuemax={totalCards}
        aria-valuenow={completed}
      >
        <div style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
