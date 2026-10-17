/**
 * MascotCharacter
 *
 * Dedicated Cultural Mascot component anchored at the bottom-left of VietnamMapImmersiveScreen.
 * Uses the shared animated owl, driven by immersive audio and activity.
 * - Sits firmly at the bottom-left of the left column.
 * - Dynamic audio-reactive foot glow when AI speaks.
 * - Supports custom element override via `customSvg` prop.
 */

import React from 'react';
import { OwlMascot } from '@/components/mascot/OwlMascot';
import type { OwlState } from '@/components/mascot/OwlMascot';

export interface MascotCharacterProps {
  customSvg?: React.ReactNode;
  className?: string;
  isPlaying?: boolean;
  state?: OwlState;
  active?: boolean;
  onWake?: () => void;
}

export const MascotCharacter: React.FC<MascotCharacterProps> = ({
  customSvg,
  className = '',
  isPlaying = false,
  state = isPlaying ? 'talking' : 'idle',
  active = true,
  onWake = () => {},
}) => {
  return (
    <div
      className={`relative select-none pointer-events-none flex items-end justify-start ${className}`}
      style={{ minHeight: '180px' }}
    >
      {/* Dynamic ambient foot glow when AI speaks */}
      <div
        className={`absolute bottom-0 left-28 -translate-x-1/2 w-48 h-12 rounded-full blur-2xl transition-all duration-700 ${
          isPlaying ? 'bg-[#98DC6E]/40 scale-125' : 'bg-black/50 scale-100'
        }`}
      />

      {/* ============================================================ */}
      {/* USER CUSTOMIZATION SLOT: If you pass customSvg, it renders here */}
      {/* ============================================================ */}
      {customSvg ? (
        <div className="relative z-10 w-full h-full flex items-end justify-start drop-shadow-2xl">
          {customSvg}
        </div>
      ) : (
        <div className="immersive-mascot pointer-events-auto relative z-10 drop-shadow-[0_16px_32px_rgba(0,0,0,0.65)]">
          <OwlMascot state={state} size={280} active={active} onWake={onWake} />
        </div>
      )}
    </div>
  );
};

export default MascotCharacter;
