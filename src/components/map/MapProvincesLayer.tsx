import React from 'react';
import type { MapProvincesLayerProps } from './types';
import { REGION_PALETTES } from './constants';

export const MapProvincesLayer: React.FC<MapProvincesLayerProps> = ({
  provinces,
  selectedProvinceId,
  hoveredProvinceId,
  activeRegion,
  onSelectProvince,
  onHoverProvince,
}) => {
  return (
    <g id="layer-provinces">
      {provinces.map((p) => {
        const isSelected = selectedProvinceId === p.id;
        const isHovered = hoveredProvinceId === p.id;
        const isDimmed = activeRegion !== 'all' && p.region !== activeRegion;

        const regionKey = (p.region || 'default') as keyof typeof REGION_PALETTES;
        const palette = REGION_PALETTES[regionKey] || REGION_PALETTES.default;

        let currentFill = palette.fill;
        let currentStroke = palette.stroke;
        let strokeWidth = '1.2px';
        let dropShadow = 'none';

        if (isSelected) {
          currentFill = palette.selected;
          currentStroke = '#FFFFFF';
          strokeWidth = '2.5px';
          dropShadow = 'drop-shadow(0 0 16px rgba(255,255,255,0.95))';
        } else if (isHovered) {
          currentFill = palette.hover;
          currentStroke = '#FFFFFF';
          strokeWidth = '2px';
          dropShadow = 'drop-shadow(0 0 12px rgba(253,230,138,0.9))';
        }

        return (
          <path
            key={p.id}
            id={`province-${p.id}`}
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
            className={`cursor-pointer transition-all duration-200 ${
              isDimmed ? 'opacity-20 grayscale-[80%]' : 'opacity-95 hover:opacity-100'
            }`}
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
