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
  const take = recorder.takes[segment.id];
  const recorded = Object.keys(recorder.takes).length;
  return <section className="rp-activity" aria-label="Shadowing activity">
    <p className="rp-eyebrow">Listen · Record · Compare</p><h2>Make the passage your own</h2>
    <p>Listen for the rhythm, then read the highlighted words aloud. Play your recording and compare it with the sample.</p>
    <progress aria-label="Passages recorded" value={recorded} max={total} /><small>{recorded} of {total} passages recorded</small>
    <blockquote className="rp-shadowing-target">{segment.text}</blockquote>
    <button type="button" disabled={recorder.busy} onClick={onListen}><Volume2 size={16} /> Listen to sample</button>
    {recorder.phase === 'recording'
      ? <button type="button" className="rp-primary rp-recording-active" onClick={recorder.stop}><Square size={16} /> Stop recording · {recorder.elapsed.toFixed(1)}s</button>
      : <button type="button" className="rp-primary" disabled={recorder.busy} onClick={() => { onStopSample(); recorder.start(segment.id); }}><Mic size={16} />{take ? 'Record again' : 'Record my voice'}</button>}
    {recorder.busy && recorder.phase !== 'recording' && <p role="status">{recorder.phase === 'requesting' ? 'Opening microphone…' : recorder.phase === 'arming' ? 'Preparing recording…' : 'Finishing recording…'}</p>}
    {recorder.busy && <button type="button" className="rp-text-button" onClick={recorder.cancel}>Cancel recording</button>}
    {recorder.error && <p role="alert" className="rp-error">{recorder.error}</p>}
    {take && !recorder.busy && <PracticeRecording take={take} onPlay={onStopSample} onDelete={() => recorder.remove(segment.id)} />}
    <p className="rp-session-note">Use headphones for the sample. Recordings stay in this page session; each take can last up to 60 seconds.</p>
  </section>;
}
