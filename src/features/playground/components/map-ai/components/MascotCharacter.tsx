/**
 * MascotCharacter
 *
 * Dedicated Cultural Mascot component anchored at the bottom-left of VietnamMapImmersiveScreen.
 * Uses official mascot artwork from assets (mascot.png).
 * - Sits firmly at the bottom-left of the left column.
 * - Dynamic audio-reactive foot glow when AI speaks.
 * - Supports custom element override via `customSvg` prop.
 */

import React from 'react';
import mascotPng from '@/assets/mascot.png';

export interface MascotCharacterProps {
  customSvg?: React.ReactNode;
  className?: string;
  isPlaying?: boolean;
}

export const MascotCharacter: React.FC<MascotCharacterProps> = ({
  customSvg,
  className = '',
  isPlaying = false,
}) => {
  return (
    <div
      className={`relative select-none pointer-events-none flex items-end justify-start ${className}`}
      style={{ minHeight: '260px' }}
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
        /* Official Mascot Artwork from assets/mascot.png */
        <img
          src={mascotPng}
          alt="VieCultures AI Mascot"
          className="relative z-10 w-56 sm:w-64 md:w-72 h-auto max-h-[330px] object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.65)]"
          draggable={false}
          loading="eager"
        />
      )}
    </div>
  );
};

export default MascotCharacter;
