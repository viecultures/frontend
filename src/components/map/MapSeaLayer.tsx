import React from 'react';
import type { MapSeaLayerProps } from './types';

export const MapSeaLayer: React.FC<MapSeaLayerProps> = ({
  islands,
  className = '',
}) => {
  return (
    <g id="layer-sea" className={`pointer-events-none select-none ${className}`}>
      {/* Vịnh Bắc Bộ watermark */}
      <text
        x="365"
        y="285"
        fill="#FCE5B5"
        fontSize="9"
        fontWeight="700"
        letterSpacing="2px"
        textAnchor="middle"
        opacity="0.65"
      >
        VỊNH BẮC BỘ
      </text>

      {/* Biển Đông watermark */}
      <text
        x="580"
        y="660"
        fill="#FCE5B5"
        fontSize="13"
        fontWeight="700"
        letterSpacing="5px"
        textAnchor="middle"
        opacity="0.75"
      >
        BIỂN ĐÔNG
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
              fill="#F59E0B"
              className="opacity-95 animate-pulse"
            />
          ))}
          <line
            x1={island.x}
            y1={island.y}
            x2={island.x}
            y2={island.y + 24}
            stroke="#F59E0B"
            strokeWidth="1.2"
            strokeDasharray="2,2"
            className="opacity-75"
          />
          <rect
            x={island.x - 45}
            y={island.y + 24}
            width={90}
            height={20}
            rx={4}
            fill="#0D1C18"
            stroke="#F59E0B"
            strokeWidth="1"
          />
          <text
            x={island.x}
            y={island.y + 37}
            textAnchor="middle"
            fill="#FCE5B5"
            fontSize="8.5"
            fontWeight="700"
          >
            {island.code}
          </text>
        </g>
      ))}
    </g>
  );
};

export default MapSeaLayer;
