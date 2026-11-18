import React from 'react';
import { Lock } from 'lucide-react';

export interface HeritageStickerFrameProps {
  isUnlocked: boolean;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  lockedProgressPercent?: number | null;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

const sizeClasses = {
  sm: 'w-24 h-24',
  md: 'w-36 h-36 sm:w-40 sm:h-40',
  lg: 'w-48 h-48 sm:w-56 sm:h-56',
};

/**
 * Reusable Heritage Sticker Frame Component.
 * Encapsulates the traditional Vietnamese scalloped border, antique gold accents,
 * and locked/unlocked visual layering independently of the food artwork and UI text.
 */
export const HeritageStickerFrame: React.FC<HeritageStickerFrameProps> = ({
  isUnlocked,
  children,
  size = 'md',
  lockedProgressPercent,
  className = '',
  onClick,
  ariaLabel,
}) => {
  const isInteractive = Boolean(onClick && isUnlocked);

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      aria-label={ariaLabel}
      className={`relative ${sizeClasses[size]} rounded-3xl p-2.5 transition-all duration-300 select-none ${
        isUnlocked
          ? 'bg-gradient-to-b from-warm-ivory via-amber-50/60 to-warm-ivory border-2 border-antique-gold shadow-md hover:shadow-xl'
          : 'bg-stone-100/80 dark:bg-stone-900/40 border-2 border-dashed border-stone-300/80 dark:border-stone-700/80 opacity-90'
      } ${
        isInteractive
          ? 'cursor-pointer hover:scale-103 motion-reduce:hover:scale-100 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-antique-gold'
          : 'cursor-default'
      } ${className}`}
    >
      {/* ── Outer Decorative Heritage Corners (Dong Son Tooth Pattern) ──── */}
      <svg
        className={`absolute -top-1.5 -left-1.5 w-4 h-4 pointer-events-none transition-colors ${
          isUnlocked ? 'text-antique-gold' : 'text-stone-300 dark:text-stone-700'
        }`}
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M0 0 L8 0 L0 8 Z" />
        <circle cx="3" cy="3" r="1" fill="white" />
      </svg>
      <svg
        className={`absolute -top-1.5 -right-1.5 w-4 h-4 pointer-events-none transition-colors ${
          isUnlocked ? 'text-antique-gold' : 'text-stone-300 dark:text-stone-700'
        }`}
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16 0 L8 0 L16 8 Z" />
        <circle cx="13" cy="3" r="1" fill="white" />
      </svg>
      <svg
        className={`absolute -bottom-1.5 -left-1.5 w-4 h-4 pointer-events-none transition-colors ${
          isUnlocked ? 'text-antique-gold' : 'text-stone-300 dark:text-stone-700'
        }`}
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M0 16 L8 16 L0 8 Z" />
        <circle cx="3" cy="13" r="1" fill="white" />
      </svg>
      <svg
        className={`absolute -bottom-1.5 -right-1.5 w-4 h-4 pointer-events-none transition-colors ${
          isUnlocked ? 'text-antique-gold' : 'text-stone-300 dark:text-stone-700'
        }`}
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16 16 L8 16 L16 8 Z" />
        <circle cx="13" cy="13" r="1" fill="white" />
      </svg>

      {/* ── Inner Dashed Stamp Border ───────────────────────────────────── */}
      <div
        className={`w-full h-full rounded-2xl border p-1.5 flex items-center justify-center overflow-hidden relative ${
          isUnlocked
            ? 'border-dashed border-antique-gold/70 bg-stone-50/50'
            : 'border-dashed border-stone-300 dark:border-stone-700 bg-stone-100/40 dark:bg-stone-800/20'
        }`}
      >
        {/* Child Food Illustration (with responsive aspect ratio & fit) */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
          {children}
        </div>

        {/* ── Locked State Mask & Indicator ─────────────────────────────── */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/40 backdrop-blur-[1px] rounded-xl text-warm-ivory space-y-1">
            <div className="p-2 rounded-full bg-stone-900/70 border border-white/20 shadow-xs">
              <Lock size={size === 'sm' ? 14 : size === 'lg' ? 22 : 18} className="text-antique-gold" />
            </div>
            {typeof lockedProgressPercent === 'number' && (
              <span className="text-[10px] font-sans font-bold tracking-wider uppercase text-stone-200">
                {lockedProgressPercent}%
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
