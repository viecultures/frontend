import React from 'react';
import type { MapSeaLayerProps } from './types';

export const MapSeaLayer: React.FC<MapSeaLayerProps> = ({
  islands,
  className = '',
  labelLanguage = 'vi',
}) => {
  const isEn = labelLanguage === 'en';

  return (
    <g id="layer-sea" className={`pointer-events-none select-none ${className}`}>
      {/* 1. Classical Nautical Compass Rose (Hoa Tiêu Hàng Hải Cổ Điển) */}
      <g id="nautical-compass" transform="translate(710, 155)" opacity="0.85">
        {/* Outer Azimuth Rings */}
        <circle
          cx="0"
          cy="0"
          r="32"
          fill="none"
          stroke="var(--color-antique-gold)"
          strokeWidth="0.8"
          strokeDasharray="2,2"
          opacity="0.4"
        />
        <circle
          cx="0"
          cy="0"
          r="26"
          fill="none"
          stroke="var(--color-antique-gold)"
          strokeWidth="1.0"
          opacity="0.6"
        />
        <circle
          cx="0"
          cy="0"
          r="19"
          fill="none"
          stroke="var(--color-antique-gold)"
          strokeWidth="0.7"
          opacity="0.4"
        />

        {/* Diagonal Rays (NE, NW, SE, SW) */}
        <path d="M0 0 L15 -15 L3 -3 Z" fill="var(--color-antique-gold)" opacity="0.6" />
        <path d="M0 0 L-15 -15 L-3 -3 Z" fill="var(--color-heritage-forest)" opacity="0.5" />
        <path d="M0 0 L15 15 L3 3 Z" fill="var(--color-heritage-forest)" opacity="0.5" />
        <path d="M0 0 L-15 15 L-3 3 Z" fill="var(--color-antique-gold)" opacity="0.6" />

        {/* Cardinal Rays (North, South, East, West) */}
        {/* North Arrow Pointer (Prominent) */}
        <polygon points="0,-26 4,-6 0,0" fill="var(--color-antique-rich)" />
        <polygon points="0,-26 -4,-6 0,0" fill="var(--color-heritage-forest)" />
        {/* South Arrow */}
        <polygon points="0,22 -3.5,5 0,0" fill="var(--color-antique-gold)" opacity="0.75" />
        <polygon points="0,22 3.5,5 0,0" fill="var(--color-heritage-forest)" opacity="0.6" />
        {/* East Arrow */}
        <polygon points="22,0 5,3.5 0,0" fill="var(--color-antique-gold)" opacity="0.75" />
        <polygon points="22,0 5,-3.5 0,0" fill="var(--color-heritage-forest)" opacity="0.6" />
        {/* West Arrow */}
        <polygon points="-22,0 -5,-3.5 0,0" fill="var(--color-antique-gold)" opacity="0.75" />
        <polygon points="-22,0 -5,3.5 0,0" fill="var(--color-heritage-forest)" opacity="0.6" />

        {/* Compass Center Core */}
        <circle cx="0" cy="0" r="3.2" fill="var(--color-antique-bright)" />
        <circle cx="0" cy="0" r="1.5" fill="var(--color-heritage-forest)" />

        {/* North Indicator "N" */}
        <text
          x="0"
          y="-31"
          textAnchor="middle"
          fill="var(--color-antique-rich)"
          fontSize="9.5"
          fontWeight="800"
          fontFamily="var(--font-serif)"
        >
          N
        </text>
      </g>

      {/* 2. Watermark: Vịnh Bắc Bộ (Gulf of Tonkin) */}
      <g id="watermark-tonkin" opacity="0.5">
        <text
          x="350"
          y="278"
          fill="var(--color-sky-mist)"
          fontSize="11"
          fontFamily="var(--font-serif)"
          fontStyle="italic"
          fontWeight="700"
          letterSpacing="4px"
          textAnchor="middle"
        >
          {isEn ? 'GULF OF TONKIN' : 'VỊNH BẮC BỘ'}
        </text>
        <path
          d="M305 286 C325 284, 345 288, 365 285 C380 283, 395 287, 400 286"
          fill="none"
          stroke="var(--color-sky-mist)"
          strokeWidth="0.8"
          opacity="0.35"
        />
      </g>

      {/* 3. Watermark: Biển Đông (East Sea) */}
      <g id="watermark-east-sea">
        {/* Bathymetric contour curve representing the continental shelf */}
        <path
          d="M480 340 C530 460, 560 620, 540 760 C520 860, 480 940, 420 1000"
          fill="none"
          stroke="var(--color-sky-mist)"
          strokeWidth="1.2"
          strokeDasharray="4,8"
          opacity="0.25"
        />
        <text
          x="585"
          y="638"
          fill="var(--color-sky-mist)"
          fontSize="18"
          fontFamily="var(--font-serif)"
          fontWeight="700"
          letterSpacing="8px"
          textAnchor="middle"
          opacity="0.65"
        >
          BIỂN ĐÔNG
        </text>
        <text
          x="585"
          y="660"
          fill="var(--color-sky-mist)"
          fontSize="11"
          fontFamily="var(--font-serif)"
          fontStyle="italic"
          fontWeight="600"
          letterSpacing="5px"
          textAnchor="middle"
          opacity="0.45"
        >
          EAST SEA
        </text>
      </g>

      {/* 4. Watermark: Vịnh Thái Lan (Gulf of Thailand) */}
      <g id="watermark-thailand-gulf" opacity="0.45">
        <text
          x="105"
          y="995"
          fill="var(--color-sky-mist)"
          fontSize="10"
          fontFamily="var(--font-serif)"
          fontStyle="italic"
          fontWeight="700"
          letterSpacing="3px"
          textAnchor="middle"
        >
          {isEn ? 'GULF OF THAILAND' : 'VỊNH THÁI LAN'}
        </text>
      </g>

      {/* 5. Côn Đảo & Phú Quốc Subtle Watermark Labels */}
      <g id="offshore-island-labels" opacity="0.75">
        <text
          x="142"
          y="900"
          fill="var(--color-heritage-forest)"
          fontSize="8"
          fontFamily="var(--font-sans)"
          fontWeight="700"
          textAnchor="middle"
        >
          Đ. Phú Quốc
        </text>
        <text
          x="368"
          y="995"
          fill="var(--color-heritage-forest)"
          fontSize="8"
          fontFamily="var(--font-sans)"
          fontWeight="700"
          textAnchor="middle"
        >
          QĐ. Côn Đảo
        </text>
      </g>

      {/* 6. Quần đảo Hoàng Sa & Trường Sa (Maritime Sovereignty) */}
      {islands.map((island) => {
        const isHoangSa = island.id === 'hoang-sa';
        const labelLine1 = isEn
          ? isHoangSa
            ? 'HOANG SA ARCHIPELAGO'
            : 'TRUONG SA ARCHIPELAGO'
          : isHoangSa
          ? 'QUẦN ĐẢO HOÀNG SA'
          : 'QUẦN ĐẢO TRƯỜNG SA';
        const labelLine2 = isEn ? '(VIETNAM)' : '(VIỆT NAM)';

        // Position coordinates for badge
        const badgeWidth = 154;
        const badgeHeight = 33;
        const badgeX = isHoangSa ? island.x - badgeWidth / 2 : island.x - badgeWidth / 2 - 10;
        const badgeY = isHoangSa ? island.y + 36 : island.y + 44;

        return (
          <g key={island.id} id={`sovereignty-${island.id}`}>
            {/* Concentric Oceanic Wave Rings around main island */}
            <circle
              cx={island.points[0]?.cx ?? island.x}
              cy={island.points[0]?.cy ?? island.y}
              r="14"
              fill="none"
              stroke="var(--color-antique-gold)"
              strokeWidth="0.8"
              strokeDasharray="2,3"
              opacity="0.45"
            />
            <circle
              cx={island.points[0]?.cx ?? island.x}
              cy={island.points[0]?.cy ?? island.y}
              r="22"
              fill="none"
              stroke="var(--color-antique-gold)"
              strokeWidth="0.6"
              strokeDasharray="2,4"
              opacity="0.3"
            />

            {/* Individual Reefs & Atoll Dots */}
            {island.points.map((pt: { cx: number; cy: number; r: number }, idx: number) => (
              <g key={idx}>
                {/* Glow ring */}
                <circle
                  cx={pt.cx}
                  cy={pt.cy}
                  r={pt.r + 2.5}
                  fill="none"
                  stroke="var(--color-antique-bright)"
                  strokeWidth="0.8"
                  opacity="0.5"
                />
                {/* Core Island Dot */}
                <circle
                  cx={pt.cx}
                  cy={pt.cy}
                  r={pt.r}
                  fill="var(--color-antique-rich)"
                  stroke="var(--color-heritage-forest)"
                  strokeWidth="1.2"
                  className={idx === 0 ? 'animate-pulse' : undefined}
                />
              </g>
            ))}

            {/* Connecting Dotted Line from Reefs to Badge */}
            <line
              x1={island.x}
              y1={island.y + 8}
              x2={island.x}
              y2={badgeY}
              stroke="var(--color-antique-gold)"
              strokeWidth="1.2"
              strokeDasharray="3,3"
              opacity="0.75"
            />

            {/* Prestigious National Sovereignty Badge */}
            <g transform={`translate(${badgeX}, ${badgeY})`}>
              {/* Drop Shadow Backing */}
              <rect
                x="0"
                y="0"
                width={badgeWidth}
                height={badgeHeight}
                rx="7"
                fill="var(--color-heritage-forest)"
                stroke="var(--color-antique-gold)"
                strokeWidth="1.4"
                className="drop-shadow-md"
              />
              {/* Inner Inset Border */}
              <rect
                x="2"
                y="2"
                width={badgeWidth - 4}
                height={badgeHeight - 4}
                rx="5"
                fill="none"
                stroke="var(--color-antique-gold)"
                strokeWidth="0.6"
                strokeDasharray="3,2"
                opacity="0.65"
              />

              {/* Gold Star Icon ★ */}
              <text
                x="14"
                y="19"
                textAnchor="middle"
                fill="var(--color-antique-bright)"
                fontSize="11"
              >
                ★
              </text>

              {/* Line 1: Archipelago Name */}
              <text
                x={badgeWidth / 2 + 5}
                y="14"
                textAnchor="middle"
                fill="var(--color-antique-bright)"
                fontSize="8.8"
                fontWeight="800"
                fontFamily="var(--font-sans)"
                letterSpacing="0.4px"
              >
                {labelLine1}
              </text>

              {/* Line 2: Sovereignty Confirmation */}
              <text
                x={badgeWidth / 2 + 5}
                y="26"
                textAnchor="middle"
                fill="var(--color-warm-ivory)"
                fontSize="7.5"
                fontWeight="700"
                fontFamily="var(--font-sans)"
                letterSpacing="1px"
                opacity="0.9"
              >
                {labelLine2}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
};

export default MapSeaLayer;
