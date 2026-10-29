import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import type { CapturedAudio } from '@/features/playground/lib/shadowing-recorder';

interface PracticeRecordingProps {
  take: CapturedAudio;
  onDelete: () => void;
  onPlay: () => void;
}

export function PracticeRecording({ take, onDelete, onPlay }: PracticeRecordingProps) {
  const { t } = useTranslation('reader');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const playerRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const next = URL.createObjectURL(take.blob);
    setUrl(next); setError('');
    const player = playerRef.current;
    return () => { player?.pause(); URL.revokeObjectURL(next); };
  }, [take.blob]);
  return <div className="rp-recording">
    <div className="rp-between"><h3>{t('shadowing_tab.your_recording', 'Your recording')}</h3><span>{take.duration.toFixed(1)}s</span></div>
    <audio ref={playerRef} controls src={url || undefined} aria-label={t('shadowing_tab.recording_aria', 'Your shadowing recording')} onPlay={onPlay} onError={() => setError(t('shadowing_tab.recording_error', 'This recording could not play. Try recording again.'))} />
    {error && <p role="alert" className="rp-error">{error}</p>}
    <button type="button" className="rp-text-button" onClick={onDelete}><Trash2 size={15} /> {t('shadowing_tab.delete_recording', 'Delete recording')}</button>
  </div>;
}
