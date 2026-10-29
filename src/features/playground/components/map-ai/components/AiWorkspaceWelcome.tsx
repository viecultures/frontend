import { MessageSquareText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AiWorkspaceWelcomeProps {
  hasReading: boolean;
  actions: { text: string; label: string }[];
  busy: boolean;
  onChoose: (text: string) => void;
}

export function AiWorkspaceWelcome({ hasReading, actions, busy, onChoose }: AiWorkspaceWelcomeProps) {
  const { t } = useTranslation('playground');
  return (
    <section className="empty-state ai-workspace-welcome" aria-label="Start a conversation">
      <div className="ai-workspace-welcome-title">
        <span><MessageSquareText size={20} /></span>
        <h2>{hasReading ? t('playground.workspace.welcome_title_reading') : t('playground.workspace.welcome_title_default')}</h2>
      </div>
      <p>{t('playground.workspace.welcome_prompt')}</p>
      <div className="ai-workspace-starters">
        {actions.map(action => (
          <button type="button" key={action.text} disabled={busy} onClick={() => onChoose(action.text)}>
            <MessageSquareText size={15} />
            <span>{action.label}</span>
          </button>
        ))}
      </div>
      <small>{t('playground.workspace.welcome_hint')}</small>
    </section>
  );
}
