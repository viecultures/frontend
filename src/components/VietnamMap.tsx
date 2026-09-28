import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import {
  VIETNAM_ISLANDS,
  VIETNAM_34_PROVINCES,
  type ProvinceMapItem,
} from '@/data/vietnamMapData';
import { VIETNAM_LANDMARKS } from '@/data/landmarksData';
import { getProvinceSpecialty } from '@/utils/vietnamMapUtils';
import { useVietnamMap, type RegionKey } from '@/utils/useVietnamMap';

export interface VietnamMapProps {
  selectedProvinceId?: string | null;
  onSelectProvince?: (province: ProvinceMapItem | null) => void;
  className?: string;
  showControls?: boolean;
  showRegionTabs?: boolean;
  showPoiPins?: boolean;
}

export const REGION_TABS: { key: RegionKey; label: string; count: string; colorClass: string }[] = [
  { key: 'all', label: 'Tất Cả', count: '34 Tỉnh', colorClass: 'bg-[#2563EB] text-white shadow-blue-500/40' },
  { key: 'north', label: 'Miền Bắc', count: '15 Tỉnh', colorClass: 'bg-[#DC2626] text-white shadow-red-500/40' },
  { key: 'central', label: 'Miền Trung', count: '11 Tỉnh', colorClass: 'bg-[#D97706] text-white shadow-amber-500/40' },
  { key: 'south', label: 'Miền Nam', count: '8 Tỉnh', colorClass: 'bg-[#059669] text-white shadow-emerald-500/40' },
];

export const VietnamMap: React.FC<VietnamMapProps> = ({
  selectedProvinceId,
  onSelectProvince,
  className = '',
  showControls = true,
  showRegionTabs = true,
  showPoiPins = true,
}) => {
  const {
    containerRef,
    activeRegion,
    setActiveRegion,
    currentViewBox,
    selectedProvinceId: activeId,
    hoveredProvince,
    setHoveredId,
    selectProvince,
    resetToAll,
    zoomScale,
    zoomIn,
    zoomOut,
    resetZoom,
    isDragging,
    transformStyle,
    containerProps,
  } = useVietnamMap({
    defaultSelectedId: selectedProvinceId,
    onSelectProvince,
  });

  const effectiveSelectedId = selectedProvinceId !== undefined ? selectedProvinceId : activeId;

  return (
    <div
      ref={containerRef}
      {...containerProps}
      onClick={() => resetToAll()}
      className={`relative flex flex-col items-center justify-between overflow-hidden select-none w-full h-full ${zoomScale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''
        } ${className}`}
    >
      {/* 1. Region Tabs Bar Header */}
      {showRegionTabs && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full z-30 flex items-center justify-center p-2 bg-heritage-forest/90 border-b border-antique-gold/30 backdrop-blur-md shrink-0"
        >
          <div className="flex items-center gap-1.5 bg-heritage-forest border border-antique-gold/40 p-1 rounded-2xl shadow-lg">
            {REGION_TABS.map((tab) => {
              const isActive = activeRegion === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveRegion(tab.key);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 focus-ring-dark ${isActive
                    ? `${tab.colorClass} shadow-md scale-102`
                    : 'text-[#FBF7EE]/70 hover:text-[#FBF7EE] hover:bg-white/10'
                    }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[9.5px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-antique-bright'
                      }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Tooltip on Hover with Cultural Highlights */}
      {hoveredProvince && (() => {
        const specialty = getProvinceSpecialty(hoveredProvince.id);
        return (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-in fade-in zoom-in duration-150 max-w-xs sm:max-w-sm text-center">
            <div className="px-4 py-2.5 rounded-2xl bg-heritage-forest/95 border border-antique-gold/60 text-warm-ivory text-xs font-bold shadow-2xl flex flex-col items-center gap-1.5 backdrop-blur-md">
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${hoveredProvince.region === 'north'
                    ? 'bg-rose-500'
                    : hoveredProvince.region === 'central'
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                    } animate-pulse`}
                />
                <span className="text-sm font-bold flex items-center gap-1">
                  <span>{specialty?.icon || '📍'}</span>
                  <span>{hoveredProvince.name}</span>
                </span>
                <span className="text-[10px] text-antique-rich font-medium">
                  ({hoveredProvince.regionName})
                </span>
                {specialty?.heritageType && (
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-antique-gold/20 text-antique-bright border border-antique-gold/40">
                    {specialty.heritageType}
                  </span>
                )}
              </div>
              {specialty?.highlight && (
                <div className="text-[11px] text-warm-ivory/90 font-normal leading-tight px-1">
                  {specialty.highlight}
                </div>
              )}
              {hoveredProvince.mergeInfo && (
                <span className="text-[9.5px] text-white/50 font-normal">
                  {hoveredProvince.mergeInfo}
                </span>
              )}
            </div>
          </div>
        );
      })()}

      {/* 3. Floating Zoom & Control Buttons Toolbar */}
      {showControls && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-4 right-4 z-20 flex flex-col items-center gap-1.5 bg-heritage-forest/90 border border-antique-gold/40 p-1.5 rounded-2xl shadow-xl backdrop-blur-md"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              zoomIn();
            }}
            className="p-2 rounded-xl text-warm-ivory hover:bg-white/10 hover:text-antique-rich transition-colors cursor-pointer focus-ring-dark"
            title="Phóng to (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              zoomOut();
            }}
            className="p-2 rounded-xl text-warm-ivory hover:bg-white/10 hover:text-antique-rich transition-colors cursor-pointer focus-ring-dark"
            title="Thu nhỏ (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          {(zoomScale > 1 || activeRegion !== 'all' || effectiveSelectedId !== null) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetZoom();
              }}
              className="p-2 rounded-xl text-antique-rich hover:bg-white/10 transition-colors cursor-pointer focus-ring-dark"
              title="Đặt lại toàn bộ bản đồ (Toàn Quốc)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* 4. Vector Map SVG with Dynamic ViewBox & Project Color Scheme */}
      <div style={transformStyle} className="w-full flex-1 min-h-0 flex items-center justify-center relative p-2">
        <svg
          viewBox={currentViewBox}
          className="w-full h-full max-h-full filter drop-shadow-[0_14px_40px_rgba(0,0,0,0.7)] overflow-visible transition-all duration-500 ease-out"
        >
          {/* Backdrop Rect to catch clicks outside provinces */}
          <rect
            x="-500"
            y="-500"
            width="2000"
            height="2500"
            fill="transparent"
            onClick={(e) => {
              e.stopPropagation();
              resetToAll();
            }}
          />

          {/* Layer 1: 34 Vector Provinces (Project Theme Palette) */}
          <g id="layer-provinces">
            {VIETNAM_34_PROVINCES.map((p) => {
              const isSelected = effectiveSelectedId === p.id;
              const isHovered = hoveredProvince?.id === p.id;
              const isDimmed = activeRegion !== 'all' && p.region !== activeRegion;

              // Project Color Palette (Heritage Forest & Gold Theme)
              let fillStyle = '#991B1B'; // Miền Bắc - Deep Burgundy Red
              let hoverStyle = '#DC2626';
              let selectedStyle = '#EF4444';
              let strokeColor = '#FCA5A5';

              if (p.region === 'central') {
                fillStyle = '#B45309'; // Miền Trung - Bronze Amber
                hoverStyle = '#D97706';
                selectedStyle = '#F59E0B';
                strokeColor = '#FDE68A';
              } else if (p.region === 'south') {
                fillStyle = '#047857'; // Miền Nam - Deep Jade Emerald
                hoverStyle = '#059669';
                selectedStyle = '#10B981';
                strokeColor = '#A7F3D0';
              }

              let currentFill = fillStyle;
              let currentStroke = strokeColor;
              let strokeWidth = '1.2px';
              let dropShadow = 'none';

              if (isSelected) {
                currentFill = selectedStyle;
                currentStroke = '#FFFFFF';
                strokeWidth = '2.5px';
                dropShadow = 'drop-shadow(0 0 16px rgba(255,255,255,0.95))';
              } else if (isHovered) {
                currentFill = hoverStyle;
                currentStroke = '#FFFFFF';
                strokeWidth = '2px';
                dropShadow = 'drop-shadow(0 0 12px rgba(253,230,138,0.9))';
              }

              return (
                <path
                  key={p.id}
                  id={`p-${p.id}`}
                  d={p.d}
                  fill={currentFill}
                  stroke={currentStroke}
                  strokeWidth={strokeWidth}
                  fillRule="evenodd"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectProvince(p);
                  }}
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`cursor-pointer transition-all duration-200 ${isDimmed ? 'opacity-20 grayscale-[80%]' : 'opacity-95 hover:opacity-100'
                    }`}
                  style={{
                    vectorEffect: 'non-scaling-stroke',
                    filter: dropShadow,
                  }}
                />
              );
            })}
          </g>

          {/* Layer 2: Maritime Sovereignty (Hoàng Sa & Trường Sa) */}
          <g id="layer-sea" className="pointer-events-none select-none">
            <text x="365" y="285" fill="#FCE5B5" fontSize="9" fontWeight="700" letterSpacing="2px" textAnchor="middle" opacity="0.65">
              VỊNH BẮC BỘ
            </text>
            <text x="580" y="660" fill="#FCE5B5" fontSize="13" fontWeight="700" letterSpacing="5px" textAnchor="middle" opacity="0.75">
              BIỂN ĐÔNG
            </text>

            {VIETNAM_ISLANDS.map((island) => (
              <g key={island.id}>
                {island.points.map((pt, idx) => (
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

          {/* Layer 3: Province Name Overlay Labels */}
          <g id="layer-labels" className="pointer-events-none select-none">
            {VIETNAM_34_PROVINCES.map((p) => {
              const isSelected = effectiveSelectedId === p.id;
              const isHovered = hoveredProvince?.id === p.id;
              const isDimmed = activeRegion !== 'all' && p.region !== activeRegion;

              return (
                <text
                  key={`lbl-${p.id}`}
                  x={p.cx}
                  y={p.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-[8.5px] sm:text-[9.5px] font-bold transition-all duration-200 ${isDimmed ? 'opacity-15' : 'opacity-100'
                    } ${isSelected
                      ? 'fill-[#FFFFFF] font-black text-[11px]'
                      : isHovered
                        ? 'fill-[#FCE5B5] font-bold text-[10px]'
                        : 'fill-[#FFFDF8]'
                    }`}
                  style={{
                    paintOrder: 'stroke',
                    stroke: '#0D1C18',
                    strokeWidth: '2.5px',
                    strokeLinejoin: 'round',
                  }}
                >
                  {p.name}
                </text>
              );
            })}
          </g>

          {/* Layer 4: POI Landmark Pins & Pulsing Dots Layer */}
          {showPoiPins && (
            <g id="layer-poi">
              {VIETNAM_LANDMARKS.map((lm) => {
                const p = VIETNAM_34_PROVINCES.find((prov) => prov.id === lm.provinceId);
                if (!p) return null;

                const isSelected = effectiveSelectedId === p.id;
                const isDimmed = activeRegion !== 'all' && p.region !== activeRegion;

                const x = p.cx;
                const y = p.cy;

                return (
                  <g
                    key={`poi-${lm.id}`}
                    transform={`translate(${x}, ${y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectProvince(p);
                    }}
                    className={`cursor-pointer transition-opacity duration-300 ${isDimmed ? 'opacity-25 grayscale-[70%]' : 'opacity-100'
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
          )}
        </svg>
      </div>
    </div>
  );
};

export default VietnamMap;
