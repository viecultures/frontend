import React from 'react';

interface CompanionFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const CompanionFloatingButton: React.FC<CompanionFloatingButtonProps> = ({
  onClick,
  isOpen,
}) => {
  if (isOpen) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open Cultural AI Companion"
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full pl-1.5 pr-5 py-1.5 bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 text-amber-50 border border-amber-500/60 shadow-[0_10px_30px_-8px_rgba(120,53,15,0.65)] hover:shadow-[0_16px_40px_-10px_rgba(120,53,15,0.8)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping [animation-duration:2.4s]"
        />
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border-2 border-amber-50/80 shadow-inner font-serif text-sm font-black italic tracking-tight text-amber-950 transition-transform duration-500 group-hover:rotate-[360deg]">
          AI
        </span>
      </span>
      <span className="flex flex-col items-start leading-tight text-left">
        <span className="font-serif text-[15px] font-bold tracking-wide">AI Companion</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-amber-200/80">Hỏi về văn hóa</span>
      </span>
    </button>
  );
};
