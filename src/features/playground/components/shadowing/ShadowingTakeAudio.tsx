import { useEffect, useRef, useState } from 'react';
import type { ShadowingTake } from '../../types/shadowing';

interface Props { take: ShadowingTake; active: boolean; stopToken: number; onPlay(): void }
export function ShadowingTakeAudio({ take, active, stopToken, onPlay }: Props) {
  const [url, setUrl] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => { if (!active) audioRef.current?.pause(); }, [active]);
  useEffect(() => { audioRef.current?.pause(); }, [stopToken]);
  useEffect(() => {
    const url = URL.createObjectURL(take.blob); setUrl(url);
    const audio = audioRef.current;
    return () => { audio?.pause(); audio?.removeAttribute('src'); audio?.load(); URL.revokeObjectURL(url); };
  }, [take.blob]);
  return <audio ref={audioRef} aria-label="Bản thu câu đang chọn" src={url || undefined} onPlay={onPlay} controls className="w-full h-10" />;
}
