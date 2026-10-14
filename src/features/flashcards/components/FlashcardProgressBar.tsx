interface FlashcardProgressBarProps {
  currentIndex: number;
  totalCards: number;
  isComplete?: boolean;
}

export function FlashcardProgressBar({ currentIndex, totalCards, isComplete = false }: FlashcardProgressBarProps) {
  const completed = Math.min(totalCards, Math.max(0, currentIndex));
  const percentage = totalCards > 0 ? Math.round(completed / totalCards * 100) : 0;
  return (
    <div className="vocab-study-progress">
      <div><span>{isComplete ? "Hoàn thành bộ thẻ" : `Thẻ ${Math.min(currentIndex + 1, totalCards)} / ${totalCards}`}</span><span>{percentage}% hoàn thành</span></div>
      <div className="vocab-progress-track" role="progressbar" aria-label="Tiến độ ôn tập" aria-valuemin={0} aria-valuemax={totalCards} aria-valuenow={completed}><div style={{ width: `${percentage}%` }} /></div>
    </div>
  );
}
