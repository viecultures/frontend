import React, { useId } from 'react';

interface ForestSpiritProps {
  className?: string;
}

/** Little forest spirit (kodama-like) drawn as an inline illustration. */
export const ForestSpirit: React.FC<ForestSpiritProps> = ({
  className = 'h-14 w-14 drop-shadow-[0_4px_6px_rgba(60,80,50,0.35)]',
}) => {
  const gradientId = `vc-spirit-body-${useId().replace(/:/g, '')}`;

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={gradientId} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#eef3e2" />
          <stop offset="100%" stopColor="#cfdcb8" />
        </radialGradient>
      </defs>
      <g className="vc-leaf">
        <path d="M32 12 C30 6 33 2 38 1 C38 6 36 10 32 12 Z" fill="#7fae5b" stroke="#4f7a3a" strokeWidth="1" />
        <path d="M33 11 L36 4" stroke="#4f7a3a" strokeWidth="0.8" strokeLinecap="round" />
      </g>
      <path
        d="M32 11 C47 11 54 22 54 36 C54 50 45 58 32 58 C19 58 10 50 10 36 C10 22 17 11 32 11 Z"
        fill={`url(#${gradientId})`}
        stroke="#6b7f57"
        strokeWidth="1.4"
      />
      <ellipse cx="22" cy="41" rx="4" ry="2.4" fill="#f5b9a6" opacity="0.7" />
      <ellipse cx="42" cy="41" rx="4" ry="2.4" fill="#f5b9a6" opacity="0.7" />
      <ellipse className="vc-spirit-eye" cx="25" cy="34" rx="3" ry="4" fill="#2f3a2a" />
      <ellipse className="vc-spirit-eye" cx="39" cy="34" rx="3" ry="4" fill="#2f3a2a" />
      <circle cx="26" cy="32.5" r="1" fill="#ffffff" />
      <circle cx="40" cy="32.5" r="1" fill="#ffffff" />
      <path d="M29 43 Q32 46 35 43" fill="none" stroke="#2f3a2a" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
};
