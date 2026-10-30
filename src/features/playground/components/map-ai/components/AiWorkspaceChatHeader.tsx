import { BookOpen, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ProficiencyLevel } from '@/data/lessonAgentCatalog';
import type { CulturalTutorMode } from '../lib/state';

interface AiWorkspaceChatHeaderProps {
  title: string;
  mode: CulturalTutorMode;
  level: ProficiencyLevel;
  busy: boolean;
  connected: boolean;
  onModeChange: (mode: CulturalTutorMode) => void;
  onLevelChange: (level: ProficiencyLevel) => void;
}

export function AiWorkspaceChatHeader({ title, mode, level, busy, connected, onModeChange, onLevelChange }: AiWorkspaceChatHeaderProps) {
  const { t } = useTranslation('playground');
  return (
    <header className="ai-workspace-chat-header">
      <div className="ai-workspace-topic"><span className="ai-workspace-topic-icon">{mode === 'free-conversation' ? <MessageCircle size={18} /> : <BookOpen size={18} />}</span><h2 title={title}>{title}</h2></div>
      <div className="ai-workspace-chat-options">
        <div className="ai-workspace-mode" role="group" aria-label={t('playground.chat_header.mode_aria')}>
          <button type="button" disabled={connected || busy} aria-pressed={mode === 'free-conversation'} onClick={() => onModeChange('free-conversation')}>{t('playground.chat_header.free_talk')}</button>
          <button type="button" disabled={connected || busy} aria-pressed={mode === 'guided-lesson'} onClick={() => onModeChange('guided-lesson')}>{t('playground.chat_header.story_practice')}</button>
        </div>
        <div className="level-quick-switch" role="group" aria-label={t('playground.chat_header.level_aria')}>{(['Level 1', 'Level 2', 'Level 3'] as const).map(value => (
          <button key={value} type="button" disabled={busy} aria-pressed={level === value} aria-label={value} title={value} onClick={() => onLevelChange(value)}>{value.replace('Level ', 'L')}</button>
        ))}</div>
      </div>
    </header>
  );
}
