import { useCallback, useEffect, useRef, useState } from 'react';
import { MASCOT_CELEBRATION_DURATION, MASCOT_SLEEP_DELAY, resolveMascotState } from '../lib/mascot-state';

interface ImmersiveMascotOptions {
  active: boolean;
  speaking: boolean;
  busy: boolean;
}

export function useImmersiveMascot({ active, speaking, busy }: ImmersiveMascotOptions) {
  const [visible, setVisible] = useState(() => document.visibilityState !== 'hidden');
  const [sleeping, setSleeping] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const lastActivity = useRef(Date.now());
  const celebrationEnd = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const enabled = active && visible;

  const wake = useCallback(() => {
    const now = Date.now();
    // Pointer events can fire much faster than display frames. Activity needs only a timestamp.
    if (now - lastActivity.current < 250) return;
    lastActivity.current = now;
    setSleeping(false);
  }, []);

  const celebrate = useCallback(() => {
    if (!enabled) return;
    lastActivity.current = Date.now();
    setSleeping(false);
    setCelebrating(true);
    clearTimeout(celebrationEnd.current);
    celebrationEnd.current = setTimeout(() => setCelebrating(false), MASCOT_CELEBRATION_DURATION);
  }, [enabled]);

  useEffect(() => {
    const update = () => setVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    setSleeping(false);
    lastActivity.current = Date.now();
  }, [enabled, speaking, busy, celebrating]);

  useEffect(() => {
    if (!enabled || speaking || busy || celebrating || sleeping) return;
    let timer: ReturnType<typeof setTimeout>;
    const check = () => {
      const remaining = MASCOT_SLEEP_DELAY - (Date.now() - lastActivity.current);
      if (remaining <= 0) setSleeping(true);
      else timer = setTimeout(check, remaining);
    };
    timer = setTimeout(check, MASCOT_SLEEP_DELAY);
    return () => clearTimeout(timer);
  }, [enabled, speaking, busy, celebrating, sleeping]);

  useEffect(() => {
    if (!enabled) {
      clearTimeout(celebrationEnd.current);
      setCelebrating(false);
    }
    return () => clearTimeout(celebrationEnd.current);
  }, [enabled]);

  return {
    state: resolveMascotState({ active: enabled, speaking, busy, celebrating, sleeping }),
    enabled,
    wake,
    celebrate,
  };
}
