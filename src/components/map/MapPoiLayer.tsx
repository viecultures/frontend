import React from 'react';
import type { MapPoiLayerProps } from './types';

export const MapPoiLayer: React.FC<MapPoiLayerProps> = ({
  landmarks,
  provinces,
  selectedProvinceId,
  hoveredProvinceId,
  activeRegion,
  onSelectLandmarkProvince,
  onHoverLandmarkProvince,
}) => {
  const [hoveredPoiId, setHoveredPoiId] = React.useState<string | null>(null);

  // Group landmarks by province to automatically distribute multiple POIs
  const provincePoiMap = React.useMemo(() => {
    const map = new Map<string, typeof landmarks>();
    for (const lm of landmarks) {
      const list = map.get(lm.provinceId) || [];
      list.push(lm);
      map.set(lm.provinceId, list);
    }
    return map;
  }, [landmarks]);

  return (
    <g id="layer-poi">
      {landmarks.map((lm) => {
        const p = provinces.find((prov) => prov.id === lm.provinceId);
        if (!p) return null;

        const siblings = provincePoiMap.get(lm.provinceId) || [lm];
        const siblingIndex = siblings.findIndex((s) => s.id === lm.id);
        const totalSiblings = siblings.length;

        // Calculate exact X and Y coordinates
        let x = p.cx;
        let y = p.cy;

        if (lm.offset) {
          x += lm.offset.dx;
          y += lm.offset.dy;
        } else if (totalSiblings > 1) {
          // Automatic radial fan-out distribution with compact radius
          const radius = 8;
          const angle = (2 * Math.PI * siblingIndex) / totalSiblings - Math.PI / 2;
          x += Math.round(radius * Math.cos(angle));
          y += Math.round(radius * Math.sin(angle));
        }

        const isProvinceSelected = selectedProvinceId === p.id;
        const isProvinceHovered = hoveredProvinceId === p.id;
        const isPoiHovered = hoveredPoiId === lm.id;
        const isDimmed = activeRegion !== 'all' && p.region !== activeRegion;

        // Reveal badge if this specific POI is hovered, or if province is selected/hovered
        const isVisible = isPoiHovered || (isProvinceSelected && totalSiblings === 1);
        const isHighlighted = isPoiHovered || isProvinceSelected;

        // Dynamic badge width calculation based on landmark name length (compact & elegant)
        const badgeWidth = Math.max(68, lm.name.length * 5.2 + 18);
        const halfWidth = badgeWidth / 2;

        return (
          <g
            key={`poi-${lm.id}`}
            transform={`translate(${x}, ${y})`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectLandmarkProvince(p);
            }}
            onMouseEnter={() => {
              setHoveredPoiId(lm.id);
              onHoverLandmarkProvince?.(p.id);
            }}
            onMouseLeave={() => {
              setHoveredPoiId(null);
              onHoverLandmarkProvince?.(null);
            }}
            className={`cursor-pointer transition-opacity duration-300 ${
              isDimmed ? 'opacity-25 grayscale-[70%]' : 'opacity-100'
            }`}
          >
            {/* Animated Radar Pulsing Aura Ring */}
            <circle
              cx="0"
              cy="0"
              r={isHighlighted ? 7.5 : isProvinceHovered ? 6 : 4.2}
              fill={isHighlighted ? '#F5D280' : '#D9B76A'}
              opacity={isHighlighted ? 0.55 : isProvinceHovered ? 0.45 : 0.3}
              className="animate-ping"
            />

            {/* Outer Solid Glowing Circle */}
            <circle
              cx="0"
              cy="0"
              r={isHighlighted ? 3.8 : isProvinceHovered ? 3.2 : 2.4}
              fill={isHighlighted ? '#F5D280' : isProvinceHovered ? '#FCE5B5' : '#D9B76A'}
              stroke="#122A22"
              strokeWidth={isHighlighted || isProvinceHovered ? '1.0' : '0.8'}
              className="drop-shadow-sm"
            />

            {/* Inner Core Accent Circle */}
            <circle
              cx="0"
              cy="0"
              r={isHighlighted ? 1.6 : isProvinceHovered ? 1.3 : 1.0}
              fill="#122A22"
            />

            {/* Floating POI Tag Badge - Only displayed when hovered */}
            {isVisible && (
              <g transform="translate(0, -12)" className="animate-in fade-in zoom-in duration-150">
                <rect
                  x={-halfWidth}
                  y="-6.5"
                  width={badgeWidth}
                  height="13"
                  rx="6.5"
                  fill={isPoiHovered ? '#F5D280' : '#122A22'}
                  stroke={isPoiHovered ? '#FFFFFF' : '#D9B76A'}
                  strokeWidth={isPoiHovered ? '1.0' : '0.8'}
                  opacity="0.95"
                  className="drop-shadow-md"
                />
                {/* Scalable Mini Map Pin SVG */}
                <path
                  d="M3.2 1.2C2.1 1.2 1.2 2.1 1.2 3.2c0 1.5 2 3.6 2 3.6s2-2.1 2-3.6c0-1.1-.9-2-2-2zm0 2.6c-.35 0-.64-.29-.64-.64s.29-.64.64-.64.64.29.64.64-.29.64-.64.64z"
                  transform={`translate(${-halfWidth + 4}, -4.2)`}
                  fill={isPoiHovered ? '#122A22' : '#D9B76A'}
                />
                <text
                  x={4}
                  y="0.8"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isPoiHovered ? '#122A22' : '#FCE5B5'}
                  fontSize="6.8"
                  fontWeight="800"
                  letterSpacing="0.1px"
                >
                  {lm.name}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

export default MapPoiLayer;
