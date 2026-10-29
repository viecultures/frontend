import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
interface Props {
  open: boolean; onClose(): void; theme: 'paper' | 'dark'; onTheme(theme: 'paper' | 'dark'): void;
  rate: number; onRate(rate: number): void; loop: boolean; onLoop(value: boolean): void;
  autoPause: boolean; onAutoPause(value: boolean): void; hasLesson: boolean; disabled: boolean;
  onSource(): void; onEdit(): void; onReload(): void;
}
export function PracticeSettings({ open, onClose, theme, onTheme, rate, onRate, loop, onLoop, autoPause, onAutoPause, hasLesson, disabled, onSource, onEdit, onReload }: Props) {
  const { t } = useTranslation('playground');
  const run = (action: () => void) => { onClose(); action(); };
  return <Dialog open={open} onClose={onClose} className="sh-dialog">
    <DialogBackdrop className="sh-dialog-backdrop" />
    <div className="sh-sheet-position"><DialogPanel className="sh-overlay-theme sh-settings-panel" data-theme={theme}>
      <div className="sh-row sh-between"><DialogTitle>{t('playground.shadowing.settings.title')}</DialogTitle><button className="sh-icon" onClick={onClose} aria-label={t('playground.shadowing.settings.close_aria')}><X size={18} /></button></div>
      <div className="sh-settings-fields">
        <label>{t('playground.shadowing.settings.speed_label')}<select className="sh-input" aria-label={t('playground.shadowing.settings.speed_label')} value={rate} disabled={disabled} onChange={event => onRate(Number(event.target.value))}>{[0.75,1,1.25].map(value => <option key={value} value={value}>{value}x</option>)}</select></label>
        <label className="sh-row"><input type="checkbox" checked={loop} disabled={disabled} onChange={event => onLoop(event.target.checked)} /> {t('playground.shadowing.settings.repeat_sample')}</label>
        <label className="sh-row"><input type="checkbox" checked={autoPause} disabled={disabled} onChange={event => onAutoPause(event.target.checked)} /> {t('playground.shadowing.settings.auto_pause')}</label>
        <div><p>{t('playground.shadowing.settings.appearance')}</p><div className="sh-row"><button className="sh-btn" aria-pressed={theme === 'paper'} onClick={() => onTheme('paper')}>{t('playground.shadowing.settings.theme_paper')}</button><button className="sh-btn" aria-pressed={theme === 'dark'} onClick={() => onTheme('dark')}>{t('playground.shadowing.settings.theme_dark')}</button></div></div>
      </div>
      <div className="sh-settings-fields sh-settings-source"><h3>{t('playground.shadowing.settings.video_and_transcript')}</h3>
        <button className="sh-btn" disabled={disabled} onClick={() => run(onSource)}>{hasLesson ? t('playground.shadowing.settings.change_video') : t('playground.shadowing.settings.open_video')}</button>
        <button className="sh-btn" disabled={disabled || !hasLesson} onClick={() => run(onEdit)}>{t('playground.shadowing.settings.edit_transcript')}</button>
        <button className="sh-btn" disabled={disabled || !hasLesson} onClick={() => run(onReload)}>{t('playground.shadowing.settings.reload_transcript')}</button>
      </div>
      <p className="sh-session-note">{t('playground.shadowing.settings.session_note')}</p>
    </DialogPanel></div>
  </Dialog>;
}
