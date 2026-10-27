import { MessageSquareText } from 'lucide-react';

interface AiWorkspaceWelcomeProps {
  hasReading: boolean;
  actions: { text: string; label: string }[];
  busy: boolean;
  onChoose: (text: string) => void;
}

export function AiWorkspaceWelcome({ hasReading, actions, busy, onChoose }: AiWorkspaceWelcomeProps) {
  return (
    <section className="empty-state ai-workspace-welcome" aria-label="Start a conversation">
      <div className="ai-workspace-welcome-title"><span><MessageSquareText size={20} /></span><h2>{hasReading ? 'Put your reading into words.' : 'Let’s talk about Vietnam.'}</h2></div>
      <p>Start speaking or choose a prompt.</p>
      <div className="ai-workspace-starters">
        {actions.map(action => <button type="button" key={action.text} disabled={busy} onClick={() => onChoose(action.text)}><MessageSquareText size={15} /><span>{action.label}</span></button>)}
      </div>
      <small>Maps and stories open here when you ask.</small>
    </section>
  );
}
