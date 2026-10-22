import { useCallback, useEffect, useRef, useState } from 'react';
import type { PracticeSegment } from '../lib/readerPractice';

/** Play a real article range when aligned; otherwise read only the selected text. */
export function usePracticeAudio(audioUrl: string | undefined, active: boolean) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const generation = useRef(0);
  const repeatRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const [speed, setSpeed] = useState(1);
  const [repeat, setRepeat] = useState(false);
  repeatRef.current = repeat;

  const stop = useCallback(() => {
    generation.current++;
    if (audio.current) {
      audio.current.pause();
      audio.current.ontimeupdate = null;
      audio.current.onended = null;
      audio.current.onerror = null;
      audio.current.onloadedmetadata = null;
      audio.current = null;
    }
    window.speechSynthesis?.cancel();
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!active) stop();
    return stop;
  }, [active, audioUrl, stop]);

  const play = useCallback((segment: PracticeSegment) => {
    stop();
    if (!active) return;
    const request = generation.current;
    setError('');
    setPlaying(true);
    const fail = () => {
      if (request !== generation.current) return;
      stop();
      setError('The sample could not play. Check your audio settings and try again.');
    };
    if (audioUrl && segment.audioRange) {
      const player = new Audio(audioUrl);
      audio.current = player;
      player.playbackRate = speed;
      const finish = () => {
        if (request !== generation.current) return;
        if (repeatRef.current) {
          player.currentTime = segment.audioRange!.start;
          void player.play().catch(fail);
        } else stop();
      };
      player.ontimeupdate = () => { if (player.currentTime >= segment.audioRange!.end) finish(); };
      player.onended = finish;
      player.onerror = fail;
      const startPlayback = () => {
        if (request !== generation.current) return;
        if (!Number.isFinite(player.duration) || segment.audioRange!.start >= player.duration || segment.audioRange!.end > player.duration + 0.1) {
          stop();
          setError('Audio timing does not match this recording. Try another passage.');
          return;
        }
        player.currentTime = segment.audioRange!.start;
        void player.play().catch(fail);
      };
      player.onloadedmetadata = startPlayback;
      if (player.readyState >= 1) startPlayback();
    } else if ('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
      const speak = () => {
        if (request !== generation.current) return;
        const utterance = new SpeechSynthesisUtterance(segment.text);
        utterance.lang = 'en-US';
        utterance.rate = speed;
        utterance.onend = () => { if (request === generation.current) { if (repeatRef.current) speak(); else stop(); } };
        utterance.onerror = fail;
        window.speechSynthesis.speak(utterance);
      };
      speak();
    } else {
      stop();
      setError('Speech playback is unavailable in this browser. You can still read and record your voice.');
    }
  }, [active, audioUrl, speed, stop]);

  return { playing, error, speed, setSpeed, repeat, setRepeat, play, stop };
}
