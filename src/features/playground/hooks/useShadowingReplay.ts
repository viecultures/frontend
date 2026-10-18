import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { replayRange, takeAtTime } from '../lib/shadowing-lesson';
import type { ReplayScope, ShadowingLesson, ShadowingPlayer, ShadowingTakes } from '../types/shadowing';

export function useShadowingReplay(playerRef: RefObject<ShadowingPlayer | null>, active: boolean) {
  const [scope, setScope] = useState<ReplayScope | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sourceVolume, setSourceVolume] = useState(20);
  const [voiceVolume, setVoiceVolume] = useState(100);
  const stopRef = useRef<(() => void) | null>(null);
  const pauseRef = useRef<(() => void) | null>(null);
  const volumeRef = useRef<{ source(value: number): void; voice(value: number): void } | null>(null);
  const stop = useCallback(() => { stopRef.current?.(); stopRef.current = null; pauseRef.current = null; volumeRef.current = null; setScope(null); setStatus(''); }, []);
  useEffect(() => { if (!active) stop(); }, [active, stop]);
  useEffect(() => { const hidden = () => { if (document.hidden) stop(); }; document.addEventListener('visibilitychange', hidden); return () => { document.removeEventListener('visibilitychange', hidden); stop(); }; }, [stop]);

  const start = useCallback((lesson: ShadowingLesson, takes: ShadowingTakes, nextScope: ReplayScope) => {
    stop();
    const player = playerRef.current;
    if (!active || !player) return;
    const range = replayRange(lesson, nextScope);
    const audio = new Audio(); audio.preload = 'auto'; audio.volume = voiceVolume / 100;
    const previous = { volume: player.getVolume(), muted: player.isMuted(), rate: player.getPlaybackRate() };
    let disposed = false, url: string | null = null, takeId: string | null = null, requestedPlay = false, audioGeneration = 0;
    let enteredRange = false, lastTime = range.start;
    const deadline = performance.now() + 15000;
    const pauseAudio = () => { ++audioGeneration; audio.pause(); requestedPlay = false; };
    const unloadAudio = () => {
      pauseAudio(); audio.removeAttribute('src'); audio.load(); takeId = null;
      if (url) URL.revokeObjectURL(url); url = null;
    };
    const fail = (message: string) => { if (disposed) return; stop(); setError(message); };
    const playAudio = () => {
      if (requestedPlay || disposed) return;
      requestedPlay = true;
      const generation = ++audioGeneration;
      void audio.play().catch(() => {
        // pause()/load() intentionally abort pending play promises. Only the
        // current play request can report an actual playback failure.
        if (!disposed && generation === audioGeneration) fail('Không phát được bản thu. Bấm nghe lại để cho phép phát âm thanh.');
      });
    };
    audio.onerror = () => fail('Trình duyệt không phát được định dạng bản thu này. Hãy thu lại bằng trình duyệt hỗ trợ.');
    const tick = () => {
      if (disposed) return;
      const time = player.getCurrentTime(), state = player.getPlayerState();
      if (!enteredRange) {
        if (state === 1 && time >= range.start - 0.15 && time < range.end && Math.abs(time - range.start) < 1) enteredRange = true;
        else { if (performance.now() > deadline) fail('Video chưa phát đúng đoạn. Bấm Play trên video rồi nghe lại.'); return; }
      }
      if (time >= range.end - 0.025 || state === 0) { stop(); return; }
      if (state === -1) { fail('Video không còn sẵn sàng. Kiểm tra player rồi nghe lại.'); return; }
      if (time < range.start - 0.25) { fail('Đã tua ra ngoài phần đang nghe. Chọn nghe lại phần hoặc toàn video.'); return; }
      setStatus(state === 1 ? 'Đang phát' : state === 3 ? 'Đang tải video…' : 'Tạm dừng');
      if (state !== 1) { pauseAudio(); lastTime = time; return; }
      const current = takeAtTime(lesson, takes, range, time);
      if (!current) { if (takeId) unloadAudio(); lastTime = time; return; }
      if (takeId !== current.take.sentenceId) {
        unloadAudio(); url = URL.createObjectURL(current.take.blob); audio.src = url; takeId = current.take.sentenceId;
        audio.load();
      }
      if (audio.readyState < 1) return;
      const drift = Math.abs(audio.currentTime - current.offset);
      if (drift > 0.25 || Math.abs(time - lastTime) > 0.5 || !requestedPlay) audio.currentTime = current.offset;
      if (audio.paused && !audio.ended) playAudio();
      lastTime = time;
    };
    const timer = setInterval(tick, 50);
    stopRef.current = () => {
      disposed = true; clearInterval(timer); unloadAudio(); audio.onerror = null;
      if (playerRef.current === player) { player.pauseVideo(); player.setVolume(previous.volume); player.setPlaybackRate(previous.rate); if (previous.muted) player.mute(); else player.unMute(); }
    };
    pauseRef.current = () => { if (player.getPlayerState() === 1) { pauseAudio(); player.pauseVideo(); } else player.playVideo(); };
    // Store setters on audio/controller refs instead of restarting replay when sliders change.
    volumeRef.current = { source: value => player.setVolume(value), voice: value => { audio.volume = value / 100; } };
    setError(null); setScope(nextScope); setStatus('Đang chuẩn bị…');
    player.setPlaybackRate(1); player.unMute(); player.setVolume(sourceVolume); player.seekTo(range.start, true); player.playVideo();
  }, [active, playerRef, sourceVolume, voiceVolume, stop]);
  return { scope, status, error, sourceVolume, voiceVolume, start, stop, togglePause: () => pauseRef.current?.(),
    setSourceVolume: (value: number) => { setSourceVolume(value); if (stopRef.current) volumeRef.current?.source(value); },
    setVoiceVolume: (value: number) => { setVoiceVolume(value); if (stopRef.current) volumeRef.current?.voice(value); } };
}
