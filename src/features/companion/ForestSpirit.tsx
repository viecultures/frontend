import React from 'react';

interface ForestSpiritProps {
  className?: string;
}

/** Companion avatar: uses the project brand mascot logo (same asset as the header BrandLogo). */
export const ForestSpirit: React.FC<ForestSpiritProps> = ({ className = 'h-14 w-14' }) => (
  <img
    src="/brand/viecultures-mascot-logo.png"
    alt=""
    aria-hidden="true"
    draggable={false}
    className={`${className} rounded-full object-cover select-none`}
  />
);
