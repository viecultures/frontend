import React from 'react';
import type { MapPoiLayerProps } from './types';

export const MapPoiLayer: React.FC<MapPoiLayerProps> = ({
  landmarks,
  provinces,
  selectedProvinceId,
  activeRegion,
  onSelectLandmarkProvince,
}) => {
  return (
    <g id="layer-poi">
      {landmarks.map((lm) => {
        const p = provinces.find((prov) => prov.id === lm.provinceId);
        if (!p) return null;

        const isSelected = selectedProvinceId === p.id;
        const isDimmed = activeRegion !== 'all' && p.region !== activeRegion;

        const x = p.cx;
        const y = p.cy;

        return (
          <g
            key={`poi-${lm.id}`}
            transform={`translate(${x}, ${y})`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectLandmarkProvince(p);
            }}
            className={`cursor-pointer transition-opacity duration-300 ${
              isDimmed ? 'opacity-25 grayscale-[70%]' : 'opacity-100'
            }`}
          >
            {/* Animated Radar Pulsing Aura Ring */}
            <circle
              cx="0"
              cy="0"
              r={isSelected ? 16 : 10}
              fill={isSelected ? '#F5D280' : '#FCE5B5'}
              opacity={isSelected ? 0.6 : 0.45}
              className="animate-ping"
            />

            {/* Outer Solid Glowing Circle */}
            <circle
              cx="0"
              cy="0"
              r={isSelected ? 9 : 6}
              fill={isSelected ? '#F5D280' : '#FCE5B5'}
              stroke="#0D1C18"
              strokeWidth={isSelected ? '2.5' : '1.8'}
              className="drop-shadow-md"
            />

            {/* Inner Core Accent Circle */}
            <circle
              cx="0"
              cy="0"
              r={isSelected ? 4 : 2.5}
              fill={isSelected ? '#0D1C18' : '#122A22'}
            />

            {/* Floating POI Tag Badge */}
            <g transform="translate(0, -18)">
              <rect
                x="-45"
                y="-9"
                width="90"
                height="18"
                rx="9"
                fill={isSelected ? '#F5D280' : '#0D1C18'}
                stroke={isSelected ? '#FFFFFF' : '#D9B76A'}
                strokeWidth={isSelected ? '1.5' : '1'}
                opacity="0.95"
                className="drop-shadow-lg"
              />
              <text
                x="0"
                y="1"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isSelected ? '#122A22' : '#FCE5B5'}
                fontSize="8.5"
                fontWeight="800"
                letterSpacing="0.2px"
              >
                📍 {lm.name}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
};

export default MapPoiLayer;
