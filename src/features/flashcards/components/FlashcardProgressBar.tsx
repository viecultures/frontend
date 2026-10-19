interface FlashcardProgressBarProps {
  currentIndex: number;
  totalCards: number;
  isComplete?: boolean;
  reviewedCount?: number;
}

export function FlashcardProgressBar({ currentIndex, totalCards, isComplete = false, reviewedCount = currentIndex }: FlashcardProgressBarProps) {
  const completed = Math.min(totalCards, Math.max(0, reviewedCount));
  const percentage = totalCards > 0 ? Math.round(completed / totalCards * 100) : 0;
  return (
    <div className="vocab-study-progress">
      <div><span>{isComplete ? "Deck complete" : `Card ${Math.min(currentIndex + 1, totalCards)} / ${totalCards}`}</span><span>{percentage}% complete</span></div>
      <div className="vocab-progress-track" role="progressbar" aria-label="Review progress" aria-valuemin={0} aria-valuemax={totalCards} aria-valuenow={completed}><div style={{ width: `${percentage}%` }} /></div>
    </div>
  );
}
