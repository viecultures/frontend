import React from 'react';
import { NEIGHBORING_COUNTRIES } from '@/data/vietnam3RegionsGameData';

export interface MapNeighborsLayerProps {
  className?: string;
}

export const MapNeighborsLayer: React.FC<MapNeighborsLayerProps> = ({ className = '' }) => {
  return (
    <g id="layer-neighbors" className={`pointer-events-none select-none ${className}`}>
      {/* China */}
      <path
        id="neighbor-china"
        d={NEIGHBORING_COUNTRIES.china}
        fill="#F3EFE8"
        stroke="#CBDAD6"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      {/* Laos */}
      <path
        id="neighbor-laos"
        d={NEIGHBORING_COUNTRIES.laos}
        fill="#F3EFE8"
        stroke="#CBDAD6"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      {/* Cambodia */}
      <path
        id="neighbor-cambodia"
        d={NEIGHBORING_COUNTRIES.cambodia}
        fill="#F3EFE8"
        stroke="#CBDAD6"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      {/* Thailand */}
      <path
        id="neighbor-thailand"
        d={NEIGHBORING_COUNTRIES.thailand}
        fill="#F3EFE8"
        stroke="#CBDAD6"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </g>
  );
};

export default MapNeighborsLayer;
