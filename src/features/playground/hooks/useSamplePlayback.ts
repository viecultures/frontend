import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { ShadowingPlayer } from '../types/shadowing';

export function useSamplePlayback(playerRef: RefObject<ShadowingPlayer | null>, active: boolean, rate: number, loop: boolean, autoPause: boolean) {
  const rangeRef = useRef<{ start: number; end: number; entered: boolean; deadline: number } | null>(null);
  const optionsRef = useRef({ rate, loop, autoPause }); optionsRef.current = { rate, loop, autoPause };
  const stop = useCallback(() => {
    // A sample cleanup must never pause a recorder/replay that now owns playback.
    const ownedPlayback = rangeRef.current !== null;
    rangeRef.current = null;
    if (ownedPlayback) playerRef.current?.pauseVideo();
  }, [playerRef]);
  const play = useCallback((start: number, end: number) => {
    const player = playerRef.current;
    if (!active || !player || !Number.isFinite(start) || !(end > start)) return;
    rangeRef.current = { start, end, entered: false, deadline: performance.now() + 15000 };
    player.setPlaybackRate(optionsRef.current.rate); player.unMute(); player.seekTo(start, true); player.playVideo();
  }, [active, playerRef]);
  useEffect(() => {
    if (!active) { stop(); return; }
    const timer = setInterval(() => {
      const range = rangeRef.current, player = playerRef.current;
      if (!range || !player) return;
      const time = player.getCurrentTime();
      if (!range.entered) {
        if (player.getPlayerState() === 1 && time >= range.start - 0.15 && time < range.end) range.entered = true;
        else { if (performance.now() > range.deadline) stop(); return; }
      }
      if (time >= range.end - 0.025) {
        if (optionsRef.current.loop) play(range.start, range.end);
        else if (optionsRef.current.autoPause) stop();
        else rangeRef.current = null;
      }
    }, 50);
    return () => { clearInterval(timer); stop(); };
  }, [active, playerRef, play, stop]);
  return { play, stop };
}
