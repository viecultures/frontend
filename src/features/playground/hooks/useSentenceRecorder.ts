import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { SentenceRecorder } from '../lib/shadowing-recorder';
import type { RecorderPhase } from '../lib/shadowing-recorder';
import { MAX_SESSION_BYTES, sentenceSignature, totalTakeBytes } from '../lib/shadowing-lesson';
import type { ShadowingPlayer, ShadowingSentence, ShadowingTake, ShadowingTakes } from '../types/shadowing';

interface Options {
  playerRef: RefObject<ShadowingPlayer | null>;
  active: boolean;
  onTake(take: ShadowingTake): void;
}

export function useSentenceRecorder({ playerRef, active, onTake }: Options) {
  const [phase, setPhase] = useState<RecorderPhase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const controllerRef = useRef<SentenceRecorder | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const restoreRef = useRef<(() => void) | null>(null);
  const targetRef = useRef<ShadowingSentence | null>(null);
  const onTakeRef = useRef(onTake); onTakeRef.current = onTake;

  const restore = useCallback(() => { restoreRef.current?.(); restoreRef.current = null; targetRef.current = null; }, []);
  const cancel = useCallback(() => { abortRef.current?.abort(); controllerRef.current?.cancel(); restore(); }, [restore]);

  useEffect(() => {
    const controller = new SentenceRecorder({ phase: setPhase, error: setError });
    controllerRef.current = controller;
    return () => { abortRef.current?.abort(); controller.cancel(); controllerRef.current = null; restore(); };
  }, [restore]);
  useEffect(() => { if (!active) cancel(); }, [active, cancel]);
  useEffect(() => {
    if (phase === 'idle') restore();
    if (phase !== 'recording') return;
    const started = performance.now(); let previousTime = playerRef.current?.getCurrentTime() ?? 0; let previousTick = started;
    const timer = setInterval(() => {
      const player = playerRef.current, target = targetRef.current;
      if (!player || !target) { cancel(); return; }
      const time = player.getCurrentTime(), now = performance.now();
      setElapsed((now - started) / 1000);
      if (time >= target.start + target.duration - 0.025) { controllerRef.current?.stop(); return; }
      if (player.getPlayerState() !== 1 || player.getPlaybackRate() !== 1 || time < previousTime - 0.2 || time - previousTime > (now - previousTick) / 1000 + 0.5) {
        cancel(); setError('Video đã dừng, tải đệm hoặc bị tua khi thu. Hãy thu lại; bản trước vẫn còn.'); return;
      }
      previousTime = time; previousTick = now;
    }, 50);
    return () => clearInterval(timer);
  }, [phase, playerRef, cancel, restore]);

  const start = useCallback((sentence: ShadowingSentence, takes: ShadowingTakes) => {
    const player = playerRef.current, controller = controllerRef.current;
    if (!active || !player || !controller || phase !== 'idle') return;
    const budget = MAX_SESSION_BYTES - totalTakeBytes(takes);
    if (budget <= 0) { setError('Bộ nhớ phiên đã đầy. Xóa bớt bản thu trước khi thu tiếp.'); return; }
    setError(null); setElapsed(0); targetRef.current = sentence;
    const volume = player.getVolume(), muted = player.isMuted(), rate = player.getPlaybackRate();
    restoreRef.current = () => { if (playerRef.current === player) { player.pauseVideo(); player.setVolume(volume); player.setPlaybackRate(rate); if (muted) player.mute(); else player.unMute(); } };
    const abort = new AbortController(); abortRef.current = abort;
    void controller.start(() => new Promise<number>((resolve, reject) => {
      player.pauseVideo(); player.setPlaybackRate(1); player.mute();
      player.seekTo(sentence.start, true); player.playVideo();
      const deadline = performance.now() + 12000;
      const poll = setInterval(() => {
        const time = player.getCurrentTime();
        if (performance.now() > deadline) { cleanup(); reject(new Error('Video chưa chạy đúng mốc câu. Bấm Play trên video rồi thử lại.')); }
        else if (player.getPlayerState() === 1 && time >= sentence.start - 0.1 && time < sentence.start + Math.min(0.5, sentence.duration / 2)) {
          cleanup(); resolve(Math.max(sentence.start, time));
        }
      }, 30);
      const onAbort = () => { cleanup(); reject(new Error('Đã hủy thu.')); };
      function cleanup() { clearInterval(poll); abort.signal.removeEventListener('abort', onAbort); }
      abort.signal.addEventListener('abort', onAbort, { once: true });
    }), audio => onTakeRef.current({ sentenceId: sentence.id, ...audio, mimeType: audio.blob.type, signature: sentenceSignature(sentence), validity: 'valid' }), budget);
  }, [active, phase, playerRef]);

  return { phase, busy: phase !== 'idle', elapsed, error, start, stop: () => controllerRef.current?.stop(), cancel };
}
