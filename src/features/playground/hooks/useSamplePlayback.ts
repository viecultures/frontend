import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { ShadowingPlayer } from '../types/shadowing';
import { SamplePlayback } from '../lib/sample-playback';

export function useSamplePlayback(playerRef: RefObject<ShadowingPlayer | null>, active: boolean, rate: number, loop: boolean, autoPause: boolean) {
  const optionsRef = useRef({ rate, loop, autoPause }); optionsRef.current = { rate, loop, autoPause };
  const controller = useRef<SamplePlayback | null>(null);
  if (!controller.current) controller.current = new SamplePlayback(() => playerRef.current, () => optionsRef.current);
  const stop = useCallback(() => { controller.current?.stop(); }, []);
  const play = useCallback((start: number, end: number) => {
    if (active) controller.current?.play(start, end);
  }, [active]);
  useEffect(() => {
    if (!active) { stop(); return; }
    const timer = setInterval(() => controller.current?.tick(), 25);
    return () => { clearInterval(timer); stop(); };
  }, [active, stop]);
  return { play, stop };
}
