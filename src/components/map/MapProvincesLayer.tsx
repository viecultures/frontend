import React from 'react';
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
    return <g id="layer-regions">
      {JOURNEY_REGIONS.map(region => {
        const locked = !!selectableRegions && !selectableRegions.includes(region.key);
        return <g key={region.key} data-region={region.key} data-locked={locked}>
          <path
            id={`region-${region.key}`}
            data-region={region.key}
            data-locked={locked}
            d={provinces.filter(province => province.region === region.key).map(province => province.d).join(' ')}
            fillRule="evenodd"
            role={locked ? 'img' : 'button'}
            tabIndex={locked ? undefined : 0}
            aria-label={locked ? `${region.label}, locked` : `Explore ${region.label}`}
            onClick={event => { event.stopPropagation(); if (!locked) onSelectRegion?.(region.key); }}
            onKeyDown={event => { if (!locked && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onSelectRegion?.(region.key); } }}
            className="journey-region-shape"
          />
          <text x={region.x} y={region.y} textAnchor="middle" className="journey-region-map-label">
            {region.label}
            {locked && <tspan x={region.x} dy="33" className="journey-region-map-locked">Locked</tspan>}
          </text>
        </g>;
      })}
    </g>;
  }

  return (
    <g id="layer-provinces">
      {provinces.map((p) => {
        const isSelected = selectedProvinceId === p.id;
        const isHovered = hoveredProvinceId === p.id;
        const hasFocus = selectedProvinceId !== null;

        const isOtherRegion = activeRegion !== 'all' && p.region !== activeRegion;
        const isOtherInFocus = hasFocus && !isSelected;

        const regionKey = (p.region || 'default') as keyof typeof REGION_PALETTES;
        const palette = REGION_PALETTES[regionKey] || REGION_PALETTES.default;

        let currentFill = palette.fill;
        let currentStroke = palette.stroke;
        let strokeWidth = '1.2px';
        let dropShadow = 'none';

        if (isSelected) {
          currentFill = palette.selected;
          currentStroke = 'var(--color-warm-ivory)';
          strokeWidth = '2.5px';
          dropShadow = 'drop-shadow(0 0 16px color-mix(in srgb, var(--color-antique-rich) 85%, transparent))';
        } else if (isHovered) {
          currentFill = palette.hover;
          currentStroke = 'var(--color-warm-ivory)';
          strokeWidth = '2px';
          dropShadow = 'drop-shadow(0 0 12px color-mix(in srgb, var(--color-antique-gold) 85%, transparent))';
        }

        let opacityClass = 'opacity-95 hover:opacity-100';
        if (isOtherRegion) {
          opacityClass = 'opacity-15 grayscale-[90%]';
        } else if (isOtherInFocus) {
          opacityClass = 'opacity-65 hover:opacity-100';
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
