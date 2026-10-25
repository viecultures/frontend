import React from 'react';
import { X } from 'lucide-react';
import type { CompanionLanguage } from '@/types/companion';
import { ForestSpirit } from './ForestSpirit';
import { CompanionSettingsMenu } from './CompanionSettingsMenu';

interface CompanionChatHeaderProps {
  lessonTitle?: string;
  language: CompanionLanguage;
  onLanguageChange: (lang: CompanionLanguage) => void;
  onClearHistory: () => Promise<void>;
  remainingTurns: number | null;
  onResetSize?: () => void;
  onClose: () => void;
  isLoggedIn?: boolean;
}

const LANGUAGE_BADGE: Record<CompanionLanguage, string> = {
  en: 'EN',
  vi: 'VI',
  bilingual: 'EN + VI',
};

/** Painted sky + rolling hills banner with the forest spirit host. */
const MeadowBackdrop: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-[#a9d8ec] via-[#cfe9f1] to-[#eaf4e2]" />
    <div className="vc-cloud-slide absolute top-2 left-0 h-4 w-14 rounded-full bg-white/80 blur-[1px]" />
    <div className="vc-cloud-slide absolute top-6 left-0 h-3 w-10 rounded-full bg-white/70 blur-[1px] [animation-delay:-14s] [animation-duration:36s]" />
    <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-9 w-full">
      <path d="M0 40 C60 18 120 22 180 34 C240 46 300 20 400 28 L400 60 L0 60 Z" fill="#b9d79a" />
      <path d="M0 50 C80 36 150 44 220 50 C290 56 340 40 400 44 L400 60 L0 60 Z" fill="#9cc47c" />
    </svg>
  </div>
);

export const CompanionChatHeader: React.FC<CompanionChatHeaderProps> = ({
  lessonTitle,
  language,
  onLanguageChange,
  onClearHistory,
  remainingTurns,
  onResetSize,
  onClose,
  isLoggedIn = true,
}) => (
  <div className="relative shrink-0 border-b-2 border-[#8a9a6f]">
    <MeadowBackdrop />
    <div className="relative flex items-center gap-2.5 px-3.5 pt-3 pb-4">
      <span className="vc-spirit-bob flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#8a9a6f] bg-[#fffaf0]/90 shadow-[0_3px_0_-1px_#c9d6b0]">
        <ForestSpirit className="h-9 w-9" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h2 className="truncate font-serif text-[16px] font-bold italic leading-tight text-[#2f4a2c]">
            Cultural Companion
          </h2>
          <span className="shrink-0 rounded-full bg-white/70 px-1.5 py-px text-[9px] font-bold tracking-wider text-[#5d8a45]">
            {LANGUAGE_BADGE[language]}
          </span>
        </div>
        <p className="flex items-center gap-1 truncate text-[11px] text-[#4a6a44]">
          <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#5d8a45]" />
          <span className="truncate">{lessonTitle ? `Exploring: ${lessonTitle}` : 'Ask me about Vietnamese culture'}</span>
        </p>
      </div>
      <CompanionSettingsMenu
        language={language}
        onLanguageChange={onLanguageChange}
        onClearHistory={onClearHistory}
        remainingTurns={remainingTurns}
        onResetSize={onResetSize}
        isLoggedIn={isLoggedIn}
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close chat"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/40 text-[#3e5a3a] transition-colors hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a9a6f]"
      >
        <X className="h-4 w-4" strokeWidth={2.4} />
      </button>
    </div>
  </div>
);
