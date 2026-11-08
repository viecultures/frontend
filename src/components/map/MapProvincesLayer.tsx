import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MapProvincesLayerProps } from './types';
import { REGION_PALETTES } from './constants';

const JOURNEY_REGIONS = [
  { key: 'north', labelKey: 'map.north', x: 310, y: 200 },
  { key: 'central', labelKey: 'map.central', x: 430, y: 460 },
  { key: 'south', labelKey: 'map.south', x: 370, y: 740 },
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
  labelLanguage = 'vi',
  showRegionLabels = true,
}) => {
  const { t } = useTranslation('common');
  // Keep the hook order stable when switching between overview and province views.
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

  if (overviewByRegion && activeRegion === 'all') {
    return (
      <g id="layer-regions">
        {JOURNEY_REGIONS.map((region) => {
          const locked = !!selectableRegions && !selectableRegions.includes(region.key);
          const regionLabel = t(region.labelKey, { lng: labelLanguage });
          const lockedLabel = t('map.locked', { lng: labelLanguage });
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
                aria-label={locked ? `${regionLabel}, ${lockedLabel}` : t('map.explore_region', { region: regionLabel, lng: labelLanguage })}
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
              {showRegionLabels && (
                <text x={region.x} y={region.y} textAnchor="middle" className="journey-region-map-label">
                  {regionLabel}
                  {locked && <tspan x={region.x} dy="22" className="journey-region-map-locked">{lockedLabel}</tspan>}
                </text>
              )}
            </g>
          );
        })}
      </g>
    );
  }

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
