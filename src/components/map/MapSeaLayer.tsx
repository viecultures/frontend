import React from 'react';
import type { MapSeaLayerProps } from './types';

export const MapSeaLayer: React.FC<MapSeaLayerProps> = ({
  islands,
  className = '',
  labelLanguage = 'vi',
}) => {
  return (
    <g id="layer-sea" className={`pointer-events-none select-none ${className}`}>
      {/* Vịnh Bắc Bộ watermark */}
      <text
        x="365"
        y="285"
        fill="var(--color-sky-mist)"
        fontSize="9.5"
        fontWeight="700"
        letterSpacing="3px"
        textAnchor="middle"
        opacity="0.4"
      >
        GULF OF TONKIN
      </text>

      {/* Biển Đông watermark */}
      <text
        x="580"
        y="660"
        fill="var(--color-sky-mist)"
        fontSize="13"
        fontWeight="700"
        letterSpacing="6px"
        textAnchor="middle"
        opacity="0.45"
      >
        EAST SEA
      </text>

      {/* Hoàng Sa & Trường Sa Islands */}
      {islands.map((island) => (
        <g key={island.id}>
          {island.points.map((pt: { cx: number; cy: number; r: number }, idx: number) => (
            <circle
              key={idx}
              cx={pt.cx}
              cy={pt.cy}
              r={pt.r}
              fill="var(--color-antique-rich)"
              className="opacity-95 animate-pulse"
            />
          ))}
          <line
            x1={island.x}
            y1={island.y}
            x2={island.x}
            y2={island.y + 24}
            stroke="var(--color-antique-gold)"
            strokeWidth="1.2"
            strokeDasharray="2,2"
            className="opacity-80"
          />
          <rect
            x={island.x - 45}
            y={island.y + 24}
            width={90}
            height={20}
            rx={4}
            fill="var(--color-heritage-forest)"
            stroke="var(--color-antique-gold)"
            strokeWidth="1"
          />
          <text
            x={island.x}
            y={island.y + 37}
            textAnchor="middle"
            fill="var(--color-antique-bright)"
            fontSize="8.5"
            fontWeight="700"
          >
            {labelLanguage === 'en' ? (island.id === 'hoang-sa' ? 'HOANG SA (VIETNAM)' : 'TRUONG SA (VIETNAM)') : island.code}
          </text>
        </g>
      ))}
    </g>
  );
};

export default MapSeaLayer;
