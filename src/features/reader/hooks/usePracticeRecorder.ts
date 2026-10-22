import { useCallback, useEffect, useRef, useState } from 'react';
import { SentenceRecorder, type RecorderPhase, type CapturedAudio } from '@/features/playground/lib/shadowing-recorder';
import { MAX_SESSION_BYTES } from '@/features/playground/lib/shadowing-lesson';
import { practiceMessage } from '@/features/playground/components/shadowing/practice-copy';

export function usePracticeRecorder(active: boolean) {
  const controller = useRef<SentenceRecorder | null>(null);
  const [phase, setPhase] = useState<RecorderPhase>('idle');
  const [error, setError] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [takes, setTakes] = useState<Record<string, CapturedAudio>>({});

  useEffect(() => {
    const recorder = new SentenceRecorder({ phase: setPhase, error: message => setError(practiceMessage(message)) });
    controller.current = recorder;
    return () => { recorder.cancel(); controller.current = null; };
  }, []);

  const cancel = useCallback(() => { controller.current?.cancel(); }, []);
  useEffect(() => { if (!active) cancel(); }, [active, cancel]);
  useEffect(() => {
    const onHidden = () => { if (document.hidden) cancel(); };
    document.addEventListener('visibilitychange', onHidden);
    return () => document.removeEventListener('visibilitychange', onHidden);
  }, [cancel]);
  useEffect(() => {
    if (phase !== 'recording') return;
    const start = performance.now();
    const interval = setInterval(() => setElapsed((performance.now() - start) / 1000), 100);
    return () => clearInterval(interval);
  }, [phase]);

  const start = (segmentId: string) => {
    if (!active || phase !== 'idle') return;
    setError(''); setElapsed(0);
    const used = Object.entries(takes).reduce((total, [id, take]) => total + (id === segmentId ? 0 : take.blob.size), 0);
    const budget = MAX_SESSION_BYTES - used;
    if (budget <= 0) { setError('Session storage is full. Delete a recording before continuing.'); return; }
    void controller.current?.start(async () => 0, take => setTakes(previous => ({ ...previous, [segmentId]: take })), budget);
  };

  const remove = (id: string) => setTakes(previous => {
    const next = { ...previous }; delete next[id]; return next;
  });
  return { phase, busy: phase !== 'idle', error, elapsed, takes, start, stop: () => controller.current?.stop(), cancel, remove };
}
