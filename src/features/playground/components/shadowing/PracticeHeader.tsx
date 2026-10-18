import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import Link from '@/components/Link';
import { PATHS } from '@/routes/paths';

interface Props {
  title: string;
  tab: 'shadowing' | 'dictation';
  disabled: boolean;
  onTab(tab: 'shadowing' | 'dictation'): void;
  onSettings(): void;
}
export function PracticeHeader({ title, tab, disabled, onTab, onSettings }: Props) {
  return <header className="sh-header">
    <div className="sh-header-title"><Link href={PATHS.home} className="sh-back" aria-label="Back to study room"><ArrowLeft size={16} /></Link><div><span className="sh-eyebrow">Listening practice</span><h2 title={title}>{title}</h2></div></div>
    <div className="sh-tabs" role="tablist" aria-label="Practice mode" onKeyDown={event => {
      if (disabled || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button')];
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : tab === 'dictation' ? 1 : 0;
      onTab(next === 0 ? 'dictation' : 'shadowing'); buttons[next].focus();
    }}>
      <button type="button" className="sh-btn" role="tab" tabIndex={tab === 'dictation' ? 0 : -1} aria-selected={tab === 'dictation'} aria-controls="practice-panel" disabled={disabled} onClick={() => onTab('dictation')}>Dictation</button>
      <button type="button" className="sh-btn" role="tab" tabIndex={tab === 'shadowing' ? 0 : -1} aria-selected={tab === 'shadowing'} aria-controls="practice-panel" disabled={disabled} onClick={() => onTab('shadowing')}>Shadowing</button>
    </div>
    <button type="button" className="sh-btn sh-settings-trigger" onClick={onSettings} disabled={disabled} aria-label="Practice settings"><SlidersHorizontal size={16} /><span>Settings</span></button>
  </header>;
}
