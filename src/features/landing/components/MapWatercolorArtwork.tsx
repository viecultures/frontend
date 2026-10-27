import React from 'react';

/**
 * Authentic Vietnamese watercolor landscape background for the heritage map section:
 * - Misty sage mountain ridges, rising golden dawn sun, and flying cranes.
 * - East Sea watercolor bay with islands.
 * - Slender bamboo shoots in the bottom-left corner.
 * - Warm ivory paper texture tone matching the VieCultures heritage aesthetic.
 */
export const MapWatercolorArtwork: React.FC = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      <img
        src="/images/landing/vietnam-map-bg.png"
        alt=""
        className="w-full h-full object-cover object-bottom pointer-events-none select-none"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

export default MapWatercolorArtwork;
