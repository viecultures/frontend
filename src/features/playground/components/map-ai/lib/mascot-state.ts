import type { OwlState } from '@/components/mascot/OwlMascot';

export const MASCOT_SLEEP_DELAY = 30_000;
export const MASCOT_CELEBRATION_DURATION = 2_400;

interface MascotSignals {
  active: boolean;
  speaking: boolean;
  busy: boolean;
  celebrating: boolean;
  sleeping: boolean;
}

export function resolveMascotState(signals: MascotSignals): OwlState {
  if (!signals.active) return 'idle';
  if (signals.speaking) return 'talking';
  if (signals.busy) return 'idle';
  if (signals.celebrating) return 'celebrating';
  if (signals.sleeping) return 'sleeping';
  return 'idle';
}
