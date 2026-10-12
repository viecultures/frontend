import React from 'react';
import type { MapPoiLayerProps } from './types';
import { geoToSvg } from '@/utils/vietnamMapUtils';

const CATEGORY_COLORS: Record<string, { stroke: string; dot: string; ping: string }> = {
  Heritage: { stroke: '#D9B76A', dot: '#F5D280', ping: '#F5D280' },
  Nature: { stroke: '#10B981', dot: '#34D399', ping: '#34D399' },
  Cuisine: { stroke: '#F59E0B', dot: '#FBBF24', ping: '#FBBF24' },
  Crafts: { stroke: '#8B5CF6', dot: '#A78BFA', ping: '#A78BFA' },
  Folklore: { stroke: '#EC4899', dot: '#F472B6', ping: '#F472B6' },
};

export const MapPoiLayer: React.FC<MapPoiLayerProps> = ({
  landmarks,
  provinces,
  selectedProvinceId,
  hoveredProvinceId,
  activeRegion,
  onSelectLandmarkProvince,
  onHoverLandmarkProvince,
  onSelectLandmark,
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

        // Calculate exact X and Y coordinates (GPS calibrated projection takes precedence)
        let x = p.cx;
        let y = p.cy;

        if (lm.coordinates) {
          const projected = geoToSvg(lm.coordinates.lat, lm.coordinates.lng);
          x = projected.x;
          y = projected.y;
        } else if (lm.pinCoordinates) {
          x = lm.pinCoordinates.x;
          y = lm.pinCoordinates.y;
        }

        if (lm.offset) {
          x += lm.offset.dx;
          y += lm.offset.dy;
        } else if (totalSiblings > 1 && !lm.coordinates) {
          // Automatic radial fan-out distribution with compact radius
          const radius = 8;
          const angle = (2 * Math.PI * siblingIndex) / totalSiblings - Math.PI / 2;
          x += Math.round(radius * Math.cos(angle));
          y += Math.round(radius * Math.sin(angle));
        }

        const isProvinceSelected = selectedProvinceId === p.id;
        const isProvinceHovered = hoveredProvinceId === p.id;
        const isPoiHovered = hoveredPoiId === lm.id;
        const hasFocus = selectedProvinceId !== null;

        // Region check: In regional view, hide POIs from other regions or national items
        if (activeRegion !== 'all' && (lm.isNational || p.region !== activeRegion)) {
          return null;
        }

        const isDimmedOther = hasFocus && !isProvinceSelected;
        const catColor = CATEGORY_COLORS[lm.category] || CATEGORY_COLORS.Heritage;

        // Reveal badge if this specific POI is hovered, or if province is selected
        const isVisible = isPoiHovered || (isProvinceSelected && (totalSiblings === 1 || isPoiHovered));
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
              onSelectLandmark?.(lm, p);
              onSelectLandmarkProvince(p);
            }}
            onMouseEnter={() => {
              setHoveredPoiId(lm.id);
            }}
            onMouseLeave={() => {
              setHoveredPoiId(null);
            }}
            className={`cursor-pointer transition-opacity duration-200 ${
              isDimmedOther ? 'opacity-65 hover:opacity-100' : 'opacity-100'
            }`}
          >
            {/* Stable Invisible Hitbox to guarantee 100% jitter-free hover */}
            <circle cx="0" cy="0" r="12" fill="transparent" />

            {/* Animated Radar Pulsing Aura Ring - strictly on highlighted/active POI, pointer-events-none */}
            {isHighlighted && (
              <circle
                cx="0"
                cy="0"
                r={7.5}
                fill={catColor.ping}
                opacity={0.55}
                className="animate-ping pointer-events-none"
              />
            )}

            {/* Outer Solid Glowing Circle */}
            <circle
              cx="0"
              cy="0"
              r={isHighlighted ? 4.0 : isPoiHovered ? 3.4 : 2.5}
              fill={isHighlighted || isPoiHovered ? catColor.dot : catColor.stroke}
              stroke="#122A22"
              strokeWidth={isHighlighted || isPoiHovered ? '1.0' : '0.8'}
              className="drop-shadow-sm pointer-events-none"
            />

            {/* Inner Core Accent Circle */}
            <circle
              cx="0"
              cy="0"
              r={isHighlighted ? 1.6 : 1.1}
              fill="#122A22"
              className="pointer-events-none"
            />

            {/* Floating POI Tag Badge - strictly pointer-events-none */}
            {isVisible && (
              <g
                transform="translate(0, -12)"
                className="pointer-events-none animate-in fade-in zoom-in duration-150"
              >
                <rect
                  x={-halfWidth}
                  y="-6.5"
                  width={badgeWidth}
                  height="13"
                  rx="6.5"
                  fill={isPoiHovered ? catColor.stroke : '#122A22'}
                  stroke={isPoiHovered ? '#FFFFFF' : catColor.stroke}
                  strokeWidth={isPoiHovered ? '1.0' : '0.8'}
                  opacity="0.95"
                  className="drop-shadow-md"
                />
                {/* Scalable Mini Map Pin SVG */}
                <path
                  d="M3.2 1.2C2.1 1.2 1.2 2.1 1.2 3.2c0 1.5 2 3.6 2 3.6s2-2.1 2-3.6c0-1.1-.9-2-2-2zm0 2.6c-.35 0-.64-.29-.64-.64s.29-.64.64-.64.64.29.64.64-.29.64-.64.64z"
                  transform={`translate(${-halfWidth + 4}, -4.2)`}
                  fill={isPoiHovered ? '#122A22' : catColor.dot}
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
