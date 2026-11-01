import React, { useMemo } from 'react';
import type { MapProvincesLayerProps } from './types';
import { REGION_PALETTES } from './constants';

const JOURNEY_REGIONS = [
  { key: 'north', label: 'Miền Bắc', x: 220, y: 155 },
  { key: 'central', label: 'Miền Trung', x: 350, y: 570 },
  { key: 'south', label: 'Miền Nam', x: 215, y: 865 },
] as const;

export const MapProvincesLayer: React.FC<MapProvincesLayerProps> = ({
  provinces,
  selectedProvinceId,
  hoveredProvinceId,
  activeRegion,
  onSelectProvince,
  onHoverProvince,
  overviewByRegion = false,
  selectableRegions,
  onSelectRegion,
}) => {
  if (overviewByRegion && activeRegion === 'all') {
    return (
      <g id="layer-regions">
        {JOURNEY_REGIONS.map((region) => {
          const locked = !!selectableRegions && !selectableRegions.includes(region.key);
          return (
            <g key={region.key} data-region={region.key} data-locked={locked}>
              <path
                id={`region-${region.key}`}
                data-region={region.key}
                data-locked={locked}
                d={provinces
                  .filter((province) => province.region === region.key)
                  .map((province) => province.d)
                  .join(' ')}
                fillRule="evenodd"
                role={locked ? 'img' : 'button'}
                tabIndex={locked ? undefined : 0}
                aria-label={locked ? `${region.label}, locked` : `Explore ${region.label}`}
                onClick={(event) => {
                  event.stopPropagation();
                  if (!locked) onSelectRegion?.(region.key);
                }}
                onKeyDown={(event) => {
                  if (!locked && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    onSelectRegion?.(region.key);
                  }
                }}
                className="journey-region-shape"
              />
              <text x={region.x} y={region.y} textAnchor="middle" className="journey-region-map-label">
                {region.label}
                {locked && <tspan x={region.x} dy="33" className="journey-region-map-locked">Locked</tspan>}
              </text>
            </g>
          );
        })}
      </g>
    );
  }

  // In SVG, render selected and hovered province paths last so their glow and thick borders render on top
  const sortedProvinces = useMemo(() => {
    return [...provinces].sort((a, b) => {
      const aSelected = selectedProvinceId === a.id ? 1 : 0;
      const bSelected = selectedProvinceId === b.id ? 1 : 0;
      if (aSelected !== bSelected) return aSelected - bSelected;

      const aHovered = hoveredProvinceId === a.id ? 1 : 0;
      const bHovered = hoveredProvinceId === b.id ? 1 : 0;
      if (aHovered !== bHovered) return aHovered - bHovered;

      return 0;
    });
  }, [provinces, selectedProvinceId, hoveredProvinceId]);

  return (
    <g id="layer-provinces" style={{ filter: 'drop-shadow(0 0 6px rgba(235, 195, 120, 0.45))' }}>
      {sortedProvinces.map((p) => {
        const isSelected = selectedProvinceId === p.id;
        const isHovered = hoveredProvinceId === p.id;

        const isOtherRegion = activeRegion !== 'all' && p.region !== activeRegion;

        const regionKey = (p.region || 'default') as keyof typeof REGION_PALETTES;
        const palette = REGION_PALETTES[regionKey] || REGION_PALETTES.default;

        let currentFill = palette.fill;
        let currentStroke = 'var(--color-warm-ivory)';
        let strokeWidth = '1.0px';
        let dropShadow = 'none';

        if (isSelected) {
          currentFill = palette.fill;
          currentStroke = 'var(--color-antique-bright)';
          strokeWidth = '2.8px';
          dropShadow = 'drop-shadow(0 0 16px color-mix(in srgb, var(--color-antique-rich) 90%, transparent))';
        } else if (isHovered) {
          currentFill = palette.hover;
          currentStroke = 'var(--color-antique-bright)';
          strokeWidth = '2.2px';
          dropShadow = 'drop-shadow(0 0 12px color-mix(in srgb, var(--color-antique-gold) 90%, transparent))';
        }

        let opacityClass = 'opacity-95 hover:opacity-100';
        if (isOtherRegion) {
          opacityClass = 'opacity-20 grayscale-[85%]';
        } else if (isSelected) {
          opacityClass = 'opacity-100';
        }

        return (
          <path
            key={p.id}
            id={`province-${p.id}`}
            data-region={p.region}
            data-selected={isSelected}
            d={p.d}
            fill={currentFill}
            stroke={currentStroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            fillRule="evenodd"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProvince(p);
            }}
            onMouseEnter={() => onHoverProvince(p.id)}
            onMouseLeave={() => onHoverProvince(null)}
            className={`cursor-pointer transition-all duration-300 ${opacityClass}`}
            style={{
              vectorEffect: 'non-scaling-stroke',
              filter: dropShadow,
            }}
          />
        );
      })}
    </g>
  );
};

export default MapProvincesLayer;
