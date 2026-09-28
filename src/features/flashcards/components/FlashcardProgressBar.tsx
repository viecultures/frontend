interface FlashcardProgressBarProps {
  currentIndex: number;
  totalCards: number;
}

export function FlashcardProgressBar({
  currentIndex,
  totalCards,
}: FlashcardProgressBarProps) {
  const percentage = Math.round(
    ((currentIndex + 1) / Math.max(1, totalCards)) * 100
  );

  return (
    <div className="flex items-center gap-3 text-xs font-bold text-[#1E4B43]">
      <span className="shrink-0 font-serif text-sm">
        Thẻ <span className="font-extrabold text-[#1E4B43]">{currentIndex + 1}</span>{" "}
        <span className="text-[#6E7E79]/70 font-normal">/ {totalCards}</span>
      </span>
      <div className="flex-1 bg-[#F6EEDC] h-3 rounded-full relative flex items-center border border-[#D9B76A]/30 overflow-hidden">
        <div
          className="bg-[#D9B76A] h-full rounded-full transition-all duration-300 relative flex items-center justify-end"
          style={{
            width: `${Math.max(2, ((currentIndex + 1) / Math.max(1, totalCards)) * 100)}%`,
          }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-[#D9B76A] border-2 border-white shadow-xs absolute -right-1.5 shrink-0" />
        </div>
      </div>
      <span className="shrink-0 text-[#92400E] font-bold text-xs">
        {percentage}%
      </span>
    </div>
  );
}
