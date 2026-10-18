import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';
interface Props {
  open: boolean; onClose(): void; theme: 'paper' | 'dark'; onTheme(theme: 'paper' | 'dark'): void;
  rate: number; onRate(rate: number): void; loop: boolean; onLoop(value: boolean): void;
  autoPause: boolean; onAutoPause(value: boolean): void; hasLesson: boolean; disabled: boolean;
  onSource(): void; onEdit(): void; onReload(): void;
}
export function PracticeSettings({ open, onClose, theme, onTheme, rate, onRate, loop, onLoop, autoPause, onAutoPause, hasLesson, disabled, onSource, onEdit, onReload }: Props) {
  const run = (action: () => void) => { onClose(); action(); };
  return <Dialog open={open} onClose={onClose} className="sh-dialog">
    <DialogBackdrop className="sh-dialog-backdrop" />
    <div className="sh-sheet-position"><DialogPanel className="sh-overlay-theme sh-settings-panel" data-theme={theme}>
      <div className="sh-row sh-between"><DialogTitle>Practice settings</DialogTitle><button className="sh-icon" onClick={onClose} aria-label="Close practice settings"><X size={18} /></button></div>
      <div className="sh-settings-fields">
        <label>Listening speed<select className="sh-input" aria-label="Listening speed" value={rate} disabled={disabled} onChange={event => onRate(Number(event.target.value))}>{[0.75,1,1.25].map(value => <option key={value} value={value}>{value}x</option>)}</select></label>
        <label className="sh-row"><input type="checkbox" checked={loop} disabled={disabled} onChange={event => onLoop(event.target.checked)} /> Repeat sample sentence</label>
        <label className="sh-row"><input type="checkbox" checked={autoPause} disabled={disabled} onChange={event => onAutoPause(event.target.checked)} /> Pause after each sentence</label>
        <div><p>Appearance</p><div className="sh-row"><button className="sh-btn" aria-pressed={theme === 'paper'} onClick={() => onTheme('paper')}>Paper</button><button className="sh-btn" aria-pressed={theme === 'dark'} onClick={() => onTheme('dark')}>Dark</button></div></div>
      </div>
      <div className="sh-settings-fields sh-settings-source"><h3>Video and transcript</h3>
        <button className="sh-btn" disabled={disabled} onClick={() => run(onSource)}>{hasLesson ? 'Change video' : 'Open a video'}</button>
        <button className="sh-btn" disabled={disabled || !hasLesson} onClick={() => run(onEdit)}>Edit transcript and parts</button>
        <button className="sh-btn" disabled={disabled || !hasLesson} onClick={() => run(onReload)}>Reload transcript</button>
      </div>
      <p className="sh-session-note">Recordings are kept for this session. Reloading or leaving this page will clear them.</p>
    </DialogPanel></div>
  </Dialog>;
}
