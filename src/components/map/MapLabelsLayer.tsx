import React from 'react';
import type { MapLabelsLayerProps } from './types';
import { toEnglishPlaceName } from '@/utils/vietnamMapUtils';

// Major anchor hubs displayed when activeRegion === 'all' at default zoom scale (< 1.45).
const MAJOR_ANCHOR_PROVINCES = new Set([
  // North
  'ha-noi',
  'hai-phong',
  'quang-ninh',
  'dien-bien',
  'lao-cai',
  'cao-bang',
  'son-la',
  // Central
  'thanh-hoa',
  'nghe-an',
  'hue',
  'da-nang',
  'quang-ngai',
  'dak-lak',
  'khanh-hoa',
  'lam-dong',
  // South
  'ho-chi-minh',
  'dong-nai',
  'can-tho',
  'an-giang',
  'ca-mau',
]);

export const MapLabelsLayer: React.FC<MapLabelsLayerProps> = ({
  provinces,
  selectedProvinceId,
  hoveredProvinceId,
  activeRegion,
  zoomScale = 1,
  labelLanguage = 'vi',
}) => {
  const isNationalOverview = activeRegion === 'all';
  const isZoomedIn = zoomScale >= 1.45;

  return (
    <g id="layer-labels" className="pointer-events-none select-none">
      {provinces.map((p) => {
        const isSelected = selectedProvinceId === p.id;
        const isHovered = hoveredProvinceId === p.id;

        // Region check: In regional view, hide provinces of other regions
        if (!isNationalOverview && p.region !== activeRegion) {
          return null;
        }

        // Level of Detail (LOD) check:
        if (isNationalOverview && !isZoomedIn && !MAJOR_ANCHOR_PROVINCES.has(p.id) && !isHovered && !isSelected) {
          return null;
        }

        let labelClass = 'fill-white text-[10.5px] sm:text-[11.5px] font-extrabold opacity-100';
        let strokeWidth = '1.4px';

        if (isSelected) {
          labelClass = 'fill-antique-bright text-[12.5px] sm:text-[13.5px] font-black opacity-100';
          strokeWidth = '2.2px';
        } else if (isHovered) {
          labelClass = 'fill-antique-bright text-[11.5px] sm:text-[12.5px] font-extrabold opacity-100';
          strokeWidth = '1.8px';
        }

        return (
          <text
            key={`label-${p.id}`}
            x={p.cx}
            y={p.cy}
            textAnchor="middle"
            dominantBaseline="middle"
            className={`transition-all duration-200 tracking-wide ${labelClass}`}
            style={{
              paintOrder: 'stroke fill',
              stroke: 'var(--color-heritage-forest)',
              strokeWidth,
              strokeLinejoin: 'round',
              filter: 'drop-shadow(0 1px 2px rgba(10, 30, 24, 0.85))',
            }}
          >
            {labelLanguage === 'en' ? toEnglishPlaceName(p.name) : p.name}
          </text>
        );
      })}
    </g>
  );
};

export default MapLabelsLayer;
