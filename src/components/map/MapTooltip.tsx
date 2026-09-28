import React from 'react';
import type { MapTooltipProps } from './types';

export const MapTooltip: React.FC<MapTooltipProps> = ({
  province,
  specialty,
  className = '',
}) => {
  if (!province) return null;

  return (
    <div
      className={`absolute top-14 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-in fade-in zoom-in duration-150 max-w-xs sm:max-w-sm text-center ${className}`}
    >
      <div className="px-4 py-2.5 rounded-2xl bg-heritage-forest/95 border border-antique-gold/60 text-warm-ivory text-xs font-bold shadow-2xl flex flex-col items-center gap-1.5 backdrop-blur-md">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              province.region === 'north'
                ? 'bg-rose-500'
                : province.region === 'central'
                ? 'bg-amber-400'
                : 'bg-emerald-400'
            } animate-pulse`}
          />
          <span className="text-sm font-bold flex items-center gap-1">
            <span>{specialty?.icon || '📍'}</span>
            <span>{province.name}</span>
          </span>
          <span className="text-[10px] text-antique-rich font-medium">
            ({province.regionName})
          </span>
          {specialty?.heritageType && (
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-antique-gold/20 text-antique-bright border border-antique-gold/40">
              {specialty.heritageType}
            </span>
          )}
        </div>
        {specialty?.highlight && (
          <div className="text-[11px] text-warm-ivory/90 font-normal leading-tight px-1">
            {specialty.highlight}
          </div>
        )}
        {province.mergeInfo && (
          <span className="text-[9.5px] text-white/50 font-normal">
            {province.mergeInfo}
          </span>
        )}
      </div>
    </div>
  );
};

export default MapTooltip;
