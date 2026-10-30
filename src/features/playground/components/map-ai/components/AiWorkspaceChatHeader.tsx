import React from 'react';
import { BookOpen, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ProficiencyLevel } from '@/data/lessonAgentCatalog';
import type { CulturalTutorMode } from '../lib/state';
import { ForestSpirit } from '@/features/companion/ForestSpirit';

interface AiWorkspaceChatHeaderProps {
  title: string;
  mode: CulturalTutorMode;
  level: ProficiencyLevel;
  busy: boolean;
  connected: boolean;
  onModeChange: (mode: CulturalTutorMode) => void;
  onLevelChange: (level: ProficiencyLevel) => void;
}

const MeadowBackdrop: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-[#a9d8ec] via-[#cfe9f1] to-[#eaf4e2]" />
    <div className="vc-cloud-slide absolute top-1 left-0 h-3 w-12 rounded-full bg-white/80 blur-[1px]" />
    <div className="vc-cloud-slide absolute top-3 left-0 h-2.5 w-8 rounded-full bg-white/70 blur-[1px] [animation-delay:-12s] [animation-duration:32s]" />
    <svg viewBox="0 0 400 45" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-7 w-full">
      <path d="M0 25 C60 12 120 15 180 22 C240 30 300 14 400 18 L400 45 L0 45 Z" fill="#b9d79a" />
      <path d="M0 32 C80 22 150 28 220 32 C290 36 340 25 400 28 L400 45 L0 45 Z" fill="#9cc47c" />
    </svg>
  </div>
);

export function AiWorkspaceChatHeader({ title, mode, level, busy, connected, onModeChange, onLevelChange }: AiWorkspaceChatHeaderProps) {
  const { t } = useTranslation('playground');
  return (
    <header className="relative flex-shrink-0 border-b-2 border-[#8a9a6f] bg-[#fffaf0] overflow-hidden">
      <MeadowBackdrop />
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-2.5 px-4 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="vc-spirit-bob flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#8a9a6f] bg-[#fffaf0]/95 shadow-[0_2px_0_-1px_#c9d6b0]">
            <ForestSpirit className="h-7 w-7" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="truncate font-serif text-[15px] font-bold italic leading-tight text-[#2f4a2c]" title={title}>
                {title}
              </h2>
            </div>
            <p className="flex items-center gap-1 truncate text-[11px] text-[#4a6a44]">
              <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#5d8a45]" />
              <span className="truncate">
                {mode === 'open-conversation' ? t('playground.chat_header.free_talk') : t('playground.chat_header.story_practice')}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-1 p-1 rounded-full border border-[#8a9a6f] bg-[#fffaf0]/90 shadow-[0_2px_0_-1px_#c9d6b0]" role="group" aria-label={t('playground.chat_header.mode_aria')}>
            <button
              type="button"
              disabled={connected || busy}
              aria-pressed={mode === 'free-conversation'}
              onClick={() => onModeChange('free-conversation')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                mode === 'free-conversation'
                  ? 'bg-[#5d8a45] text-[#fffaf0] shadow-[0_2px_0_-1px_#3e5a3a]'
                  : 'text-[#3e5a3a] hover:bg-[#e4f2df]'
              }`}
            >
              <BookOpen size={13} />
              <span>{t('playground.chat_header.story_practice')}</span>
            </button>
            <button
              type="button"
              disabled={connected || busy}
              aria-pressed={mode === 'open-conversation'}
              onClick={() => onModeChange('open-conversation')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                mode === 'open-conversation'
                  ? 'bg-[#5d8a45] text-[#fffaf0] shadow-[0_2px_0_-1px_#3e5a3a]'
                  : 'text-[#3e5a3a] hover:bg-[#e4f2df]'
              }`}
            >
              <MessageCircle size={13} />
              <span>{t('playground.chat_header.free_talk')}</span>
            </button>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-full border border-[#8a9a6f] bg-[#fffaf0]/90 shadow-[0_2px_0_-1px_#c9d6b0]" role="group" aria-label={t('playground.chat_header.level_aria')}>
            {(['Level 1', 'Level 2', 'Level 3'] as const).map(value => (
              <button
                key={value}
                type="button"
                disabled={busy}
                aria-pressed={level === value}
                aria-label={value}
                title={value}
                onClick={() => onLevelChange(value)}
                className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-colors ${
                  level === value
                    ? 'bg-[#3e5a3a] text-[#fffaf0]'
                    : 'text-[#3e5a3a] hover:bg-[#e4f2df]'
                }`}
              >
                {value.replace('Level ', 'L')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
