import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ForestSpirit } from '@/features/companion/ForestSpirit';

interface AiWorkspaceWelcomeProps {
  hasReading: boolean;
  openTopic?: boolean;
  actions: { text: string; label: string }[];
  busy: boolean;
  onChoose: (text: string) => void;
}

export function AiWorkspaceWelcome({ hasReading, openTopic, actions, busy, onChoose }: AiWorkspaceWelcomeProps) {
  const { t } = useTranslation('playground');
  return (
    <section className="empty-state ai-workspace-welcome mx-auto max-w-lg p-6 text-center" aria-label="Start a conversation">
      <div className="flex flex-col items-center justify-center gap-3">
        <span className="vc-spirit-bob flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#8a9a6f] bg-[#fffaf0] shadow-[0_4px_0_-1px_#c9d6b0]">
          <ForestSpirit className="h-12 w-12" />
        </span>
        <h2 className="font-serif text-xl font-bold italic text-[#2f4a2c]">
          {openTopic
            ? t('playground.workspace.welcome_title_free_talk')
            : hasReading
              ? t('playground.workspace.welcome_title_reading')
              : t('playground.workspace.welcome_title_default')}
        </h2>
      </div>

      <p className="mt-2 text-sm text-[#4a6a44] leading-relaxed">
        {t('playground.workspace.welcome_prompt')}
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {actions.map(action => (
          <button
            type="button"
            key={action.text}
            disabled={busy}
            onClick={() => onChoose(action.text)}
            className="flex items-center gap-1.5 rounded-full border border-[#8a9a6f] bg-[#fffaf0] px-3.5 py-2 text-xs font-medium text-[#2f4a2c] shadow-[0_2px_0_-1px_#c9d6b0] transition-all hover:bg-[#5d8a45] hover:text-[#fffaf0] hover:shadow-[0_2px_0_-1px_#3e5a3a] disabled:opacity-50"
          >
            <Sparkles size={13} className="shrink-0 text-[#7fae5b]" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      <small className="mt-4 block text-xs text-[#7a8a66]">
        {t(openTopic ? 'playground.workspace.welcome_hint_free_talk' : 'playground.workspace.welcome_hint')}
      </small>
    </section>
  );
}
