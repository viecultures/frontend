import { useTranslation } from 'react-i18next';
import { Mic, Square, Volume2 } from 'lucide-react';
import type { usePracticeRecorder } from '../../hooks/usePracticeRecorder';
import type { PracticeSegment } from '../../lib/readerPractice';
import { PracticeRecording } from './PracticeRecording';

interface PracticeShadowingProps {
  segment: PracticeSegment;
  recorder: ReturnType<typeof usePracticeRecorder>;
  onListen: () => void;
  onStopSample: () => void;
  total: number;
}

export function PracticeShadowing({ segment, recorder, onListen, onStopSample, total }: PracticeShadowingProps) {
  const { t } = useTranslation('reader');
  const take = recorder.takes[segment.id];
  const recorded = Object.keys(recorder.takes).length;
  return <section className="rp-activity" aria-label={t('shadowing_tab.activity_aria', 'Shadowing activity')}>
    <h2>{t('shadowing_tab.title', 'Repeat this passage')}</h2>
    <p>{t('shadowing_tab.description', 'Listen, then record yourself reading the passage.')}</p>
    <progress aria-label={t('shadowing_tab.progress_aria', 'Passages recorded')} value={recorded} max={total} /><small>{t('shadowing_tab.recorded_progress', { completed: recorded, total, defaultValue: `${recorded} of ${total} passages recorded` })}</small>
    <blockquote className="rp-shadowing-target">{segment.text}</blockquote>
    <button type="button" disabled={recorder.busy} onClick={onListen}><Volume2 size={16} /> {t('shadowing_tab.listen_sample', 'Listen to sample')}</button>
    {recorder.phase === 'recording'
      ? <button type="button" className="rp-primary rp-recording-active" onClick={recorder.stop}><Square size={16} /> {t('shadowing_tab.stop_recording', { seconds: recorder.elapsed.toFixed(1), defaultValue: `Stop recording · ${recorder.elapsed.toFixed(1)}s` })}</button>
      : <button type="button" className="rp-primary" disabled={recorder.busy} onClick={() => { onStopSample(); recorder.start(segment.id); }}><Mic size={16} />{take ? t('shadowing_tab.record_again', 'Record again') : t('shadowing_tab.record_voice', 'Record my voice')}</button>}
    {recorder.busy && recorder.phase !== 'recording' && <p role="status">{recorder.phase === 'requesting' ? t('shadowing_tab.opening_mic', 'Opening microphone…') : recorder.phase === 'arming' ? t('shadowing_tab.preparing_rec', 'Preparing recording…') : t('shadowing_tab.finishing_rec', 'Finishing recording…')}</p>}
    {recorder.busy && <button type="button" className="rp-text-button" onClick={recorder.cancel}>{t('shadowing_tab.cancel_rec', 'Cancel recording')}</button>}
    {recorder.error && <p role="alert" className="rp-error">{recorder.error}</p>}
    {take && !recorder.busy && <PracticeRecording take={take} onPlay={onStopSample} onDelete={() => recorder.remove(segment.id)} />}
    <p className="rp-session-note">{t('shadowing_tab.session_note', 'Recordings stay on this page for this session.')}</p>
  </section>;
}
