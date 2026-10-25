import React, { useState } from 'react';
import { companionKeyframes } from './companionTheme';
import { ForestSpirit } from './ForestSpirit';

interface CompanionFloatingButtonProps {
  /** Toggles the chat window (opens when closed, collapses when open). */
  onClick: () => void;
  isOpen: boolean;
}

const Sparkle: React.FC<{ className: string; fill: string }> = ({ className, fill }) => (
  <svg viewBox="0 0 10 10" className={className} aria-hidden="true">
    <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill={fill} />
  </svg>
);

const INTRO_SEEN_KEY = 'vc-companion-intro-seen';

const readIntroSeen = (): boolean => {
  try {
    return window.localStorage.getItem(INTRO_SEEN_KEY) === '1';
  } catch (err) {
    console.error('[CompanionFloatingButton] Failed to read intro flag:', err);
    return false;
  }
};

export const CompanionFloatingButton: React.FC<CompanionFloatingButtonProps> = ({
  onClick,
  isOpen,
}) => {
  const [showIntro, setShowIntro] = useState<boolean>(() => !readIntroSeen());

  const handleClick = () => {
    if (showIntro) {
      setShowIntro(false);
      try {
        window.localStorage.setItem(INTRO_SEEN_KEY, '1');
      } catch (err) {
        console.error('[CompanionFloatingButton] Failed to persist intro flag:', err);
      }
    }
    onClick();
  };

  return (
  <>
    <style>{companionKeyframes}</style>
    <button
      type="button"
      onClick={handleClick}
      aria-label={isOpen ? 'Collapse Cultural AI Companion' : 'Open Cultural AI Companion'}
      aria-expanded={isOpen}
      className="group fixed bottom-6 right-6 z-40 flex items-end gap-1 rounded-3xl bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/60 focus-visible:ring-offset-4"
    >
      {!isOpen && showIntro && (
        <span className="vc-bubble-in relative mb-3 hidden sm:block">
        <span className="vc-cloud-drift block">
          <span className="relative block rounded-[22px] border-2 border-[#8a9a6f] bg-[#fffaf0] px-4 py-2 shadow-[0_6px_0_-1px_#c9d6b0,0_12px_24px_-10px_rgba(70,90,60,0.45)] transition-transform duration-300 group-hover:-translate-y-0.5">
            <span className="block font-serif text-[15px] font-bold italic leading-tight text-[#3e5a3a]">
              AI Companion
            </span>
            <span className="block text-[11px] leading-tight text-[#7a8a66]">Ask me about Vietnamese culture</span>
            <span
              aria-hidden="true"
              className="absolute -right-[7px] bottom-3 h-3 w-3 rotate-45 border-r-2 border-t-2 border-[#8a9a6f] bg-[#fffaf0]"
            />
          </span>
        </span>
        </span>
      )}

      <span className={`${isOpen ? '' : 'vc-spirit-bob'} relative flex h-[72px] w-[72px] items-center justify-center`}>
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-[#3e5a3a]/20 blur-[3px]"
        />
        <span
          className={`relative flex items-center justify-center rounded-full border-2 border-[#8a9a6f] bg-gradient-to-b from-[#bfe3f0] via-[#e4f2df] to-[#b9d79a] shadow-[inset_0_-6px_0_rgba(90,130,70,0.25)] transition-all duration-300 group-hover:scale-105 ${
            isOpen ? 'h-14 w-14' : 'h-[68px] w-[68px]'
          }`}
        >
          <ForestSpirit className={isOpen ? 'h-[52px] w-[52px]' : 'h-16 w-16'} />
        </span>
        {!isOpen && (
          <>
            <Sparkle className="vc-sparkle absolute -left-1 top-1 h-3 w-3" fill="#f6d77a" />
            <Sparkle className="vc-sparkle absolute -right-0.5 top-0 h-2 w-2 [animation-delay:1.3s]" fill="#ffffff" />
          </>
        )}
      </span>
    </button>
  </>
  );
};
