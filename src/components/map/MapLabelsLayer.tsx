import React from 'react';
import type { MapLabelsLayerProps } from './types';

// Major anchor hubs displayed when activeRegion === 'all' at default zoom scale (< 1.45).
// Smaller delta provinces (Bắc Ninh, Hưng Yên, Hà Nam, Ninh Bình, v.v.) are omitted at national scale
// to prevent label collisions in dense delta areas, and become visible when zooming in or switching to regional views.
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
}) => {
  const hasFocus = selectedProvinceId !== null;
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
        // In national overview, filter out non-anchor provinces unless user zoomed in, hovers, or selects
        if (isNationalOverview && !isZoomedIn && !MAJOR_ANCHOR_PROVINCES.has(p.id) && !isHovered && !isSelected) {
          return null;
        }

        let labelClass = 'fill-warm-ivory text-[8.5px] sm:text-[9.5px] font-bold opacity-100';
        let strokeWidth = '2.5px';

        if (isSelected) {
          labelClass = 'fill-white font-black text-[11px] sm:text-[12px] opacity-100';
          strokeWidth = '3.5px';
        } else if (isHovered) {
          labelClass = 'fill-antique-bright font-bold text-[10px] opacity-100';
          strokeWidth = '2.8px';
        } else if (hasFocus) {
          // Keep other provinces in region softly dimmed so user can easily browse and click next
          labelClass = 'fill-warm-ivory/75 text-[8px] sm:text-[9px] font-semibold opacity-40';
          strokeWidth = '2.0px';
        }

        return (
          <text
            key={`label-${p.id}`}
            x={p.cx}
            y={p.cy}
            textAnchor="middle"
            dominantBaseline="middle"
            className={`transition-all duration-300 ${labelClass}`}
            style={{
              paintOrder: 'stroke',
              stroke: 'var(--color-heritage-forest)',
              strokeWidth,
              strokeLinejoin: 'round',
            }}
          >
            {p.name}
          </text>
        );
      })}
    </g>
  );
};

export default MapLabelsLayer;
