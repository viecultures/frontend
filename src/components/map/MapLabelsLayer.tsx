import React from 'react';
import type { MapLabelsLayerProps } from './types';

export const MapLabelsLayer: React.FC<MapLabelsLayerProps> = ({
  provinces,
  selectedProvinceId,
  hoveredProvinceId,
  activeRegion,
}) => {
  return (
    <g id="layer-labels" className="pointer-events-none select-none">
      {provinces.map((p) => {
        const isSelected = selectedProvinceId === p.id;
        const isHovered = hoveredProvinceId === p.id;
        const isDimmed = activeRegion !== 'all' && p.region !== activeRegion;

        return (
          <text
            key={`label-${p.id}`}
            x={p.cx}
            y={p.cy}
            textAnchor="middle"
            dominantBaseline="middle"
            className={`text-[8.5px] sm:text-[9.5px] font-bold transition-all duration-200 ${
              isDimmed ? 'opacity-15' : 'opacity-100'
            } ${
              isSelected
                ? 'fill-white font-black text-[11px]'
                : isHovered
                ? 'fill-antique-bright font-bold text-[10px]'
                : 'fill-warm-ivory'
            }`}
            style={{
              paintOrder: 'stroke',
              stroke: '#122A22',
              strokeWidth: '2.5px',
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
