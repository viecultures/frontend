import React, { useState, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, Compass } from 'lucide-react';
import {
  VIETNAM_VIEWBOXES,
  VIETNAM_3_REGIONS,
  VIETNAM_34_PROVINCES,
  NEIGHBORING_COUNTRIES,
  VIETNAM_ISLANDS_CATALOG,
  type ProvinceMapItem,
  type RegionItem,
} from '@/data/vietnam3RegionsGameData';

export interface LocationStoryPin {
  id: string;
  name: string;
  englishTitle: string;
  region: 'north' | 'central' | 'south';
  provinceId: string;
  provinceName: string;
  anchorX: number;
  anchorY: number;
  pillX: number;
  pillY: number;
  pillWidth: number;
  storyId?: string;
  cefrLevel: 'Level 1' | 'Level 2' | 'Level 3' | 'B1' | 'B2' | 'C1';
}

export interface Vietnam3RegionsLandingMapProps {
  activeRegion?: 'all' | 'north' | 'central' | 'south';
  lockedRegions?: string[];
  selectedProvinceId?: string | null;
  featuredPins?: LocationStoryPin[];
  selectedPinId?: string | null;
  onSelectRegion?: (regionId: 'north' | 'central' | 'south') => void;
  onSelectProvince?: (province: ProvinceMapItem) => void;
  onSelectPin?: (pin: LocationStoryPin) => void;
  onResetView?: () => void;
  className?: string;
  showCompass?: boolean;
}

export const Vietnam3RegionsLandingMap: React.FC<Vietnam3RegionsLandingMapProps> = ({
  activeRegion = 'all',
  lockedRegions = ['central', 'south'],
  selectedProvinceId,
  featuredPins = [],
  selectedPinId,
  onSelectRegion,
  onSelectProvince,
  onSelectPin,
  onResetView,
  className = '',
  showCompass = true,
}) => {
  const { t } = useTranslation('landing');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [shakingRegion, setShakingRegion] = useState<string | null>(null);
  const [hoveredProvinceId, setHoveredProvinceId] = useState<string | null>(null);

  // SVG unique filter IDs
  const shadowFilterId = useId();

  // Mode: overview vs detail
  const isDetailMode = activeRegion !== 'all';
  const currentViewBox = isDetailMode
    ? VIETNAM_VIEWBOXES[activeRegion] || VIETNAM_VIEWBOXES.all
    : VIETNAM_VIEWBOXES.all;

  const handleRegionClick = (regionId: 'north' | 'central' | 'south') => {
    if (lockedRegions.includes(regionId)) {
      setShakingRegion(regionId);
      const regionName =
        regionId === 'central'
          ? t('map_section.region_central', 'Miền Trung')
          : t('map_section.region_south', 'Miền Nam');
      setToastMessage(t('map_section.locked_toast', { name: regionName }));
      setTimeout(() => setShakingRegion(null), 500);
      setTimeout(() => setToastMessage(null), 2600);
    } else {
      if (onSelectRegion) onSelectRegion(regionId);
    }
  };

  const handleReset = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (onResetView) {
      onResetView();
    }
  };

  // Region colors configuration
  const getRegionFill = (reg: RegionItem) => {
    const isLocked = lockedRegions.includes(reg.id);
    if (reg.id === 'north') {
      return activeRegion === 'north' ? '#1A4736' : '#265946';
    }
    if (reg.id === 'central') {
      return isLocked ? '#E5C48C' : '#C08B3E';
    }
    // South
    return isLocked ? '#A2B9AE' : '#265946';
  };

  // Province colors configuration in detail mode
  const getProvinceFill = (prov: ProvinceMapItem) => {
    const isSelected = selectedProvinceId === prov.id;
    const isHovered = hoveredProvinceId === prov.id;
    const isInsideActiveRegion = prov.region === activeRegion;

    if (!isInsideActiveRegion) {
      return '#CBDAD6';
    }

    if (isSelected) {
      return '#C08B3E';
    }

    if (isHovered) {
      return '#2F6D56';
    }

    if (prov.region === 'north') return '#265946';
    if (prov.region === 'central') return '#9C7A3C';
    return '#2D6B57';
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none bg-[#E5F4F1] rounded-2xl ${className}`}
    >
      {/* Toast Notification (SVG Icon Only) */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#1C382F] text-[#FAF7F0] px-4 py-2 rounded-full text-xs font-semibold shadow-xl z-50 flex items-center gap-2 animate-bounce transition-all duration-300"
        >
          <Lock className="w-3.5 h-3.5 text-[#E5C48C] shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Control: Reset View to Overview */}
      {isDetailMode && (
        <div className="absolute top-3 left-3 z-30">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F0]/90 hover:bg-[#FAF7F0] text-[#1C382F] text-xs font-semibold shadow-md backdrop-blur-sm border border-[#CBDAD6]/60 transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label={t('map_section.reset_view', 'Xem toàn cảnh')}
          >
            <Compass className="w-3.5 h-3.5 text-[#265946]" aria-hidden="true" />
            <span>{t('map_section.reset_view', 'Xem toàn cảnh')}</span>
          </button>
        </div>
      )}

      {/* SVG Canvas with Dynamic ViewBox Transition */}
      <svg
        viewBox={currentViewBox}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full max-h-full object-contain transition-[viewBox] duration-700 ease-in-out cursor-default"
      >
        <defs>
          <filter id={shadowFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* LAYER 0: Ocean Background & Watermarks */}
        <g id="layer-ocean">
          <text
            x="640"
            y="580"
            fill="#1B6872"
            opacity="0.55"
            fontSize="20"
            fontStyle="italic"
            fontWeight="800"
            letterSpacing="5px"
            pointerEvents="none"
          >
            {t('map_section.east_sea', 'BIỂN ĐÔNG')}
          </text>
          <text
            x="440"
            y="230"
            fill="#1B6872"
            opacity="0.5"
            fontSize="12"
            fontStyle="italic"
            fontWeight="700"
            letterSpacing="3px"
            pointerEvents="none"
          >
            {t('map_section.gulf_of_tonkin', 'VỊNH BẮC BỘ')}
          </text>
          <text
            x="180"
            y="850"
            fill="#1B6872"
            opacity="0.5"
            fontSize="11"
            fontStyle="italic"
            fontWeight="700"
            letterSpacing="2px"
            pointerEvents="none"
          >
            {t('map_section.gulf_of_thailand', 'VỊNH THÁI LAN')}
          </text>

          {/* Nautical Compass Rose */}
          {showCompass && !isDetailMode && (
            <g id="compass" transform="translate(860, 110) scale(0.9)" opacity="0.75" pointerEvents="none">
              <circle cx="0" cy="0" r="28" fill="none" stroke="#C2D5D8" strokeWidth="0.8" strokeDasharray="2,2" />
              <polygon points="0,-24 4,-6 0,0" fill="#1C382F" />
              <polygon points="0,-24 -4,-6 0,0" fill="#265946" />
              <polygon points="0,20 -3,5 0,0" fill="#C2D5D8" />
              <polygon points="0,20 3,5 0,0" fill="#265946" />
              <polygon points="20,0 5,3 0,0" fill="#C2D5D8" />
              <polygon points="-20,0 -5,-3 0,0" fill="#C2D5D8" />
              <circle cx="0" cy="0" r="3" fill="#E5C48C" />
              <text x="0" y="-28" textAnchor="middle" fontSize="9" fontWeight="800" fill="#1C382F">
                N
              </text>
            </g>
          )}
        </g>

        {/* LAYER 1: Neighboring Countries (Visual only) */}
        <g id="layer-neighbors" pointerEvents="none">
          <path d={NEIGHBORING_COUNTRIES.china} fill="#F3EFE8" stroke="#CBDAD6" strokeWidth="0.9" />
          <path d={NEIGHBORING_COUNTRIES.laos} fill="#F3EFE8" stroke="#CBDAD6" strokeWidth="0.9" />
          <path d={NEIGHBORING_COUNTRIES.cambodia} fill="#F3EFE8" stroke="#CBDAD6" strokeWidth="0.9" />
          <path d={NEIGHBORING_COUNTRIES.thailand} fill="#F3EFE8" stroke="#CBDAD6" strokeWidth="0.9" />
        </g>

        {/* LAYER 2: Main Shapes (Overview 3 Regions vs Detail 34 Provinces) */}
        {!isDetailMode ? (
          /* CẤP ĐỘ 1: OVERVIEW - 3 Miền lớn nguyên khối */
          <g id="layer-3-regions">
            {VIETNAM_3_REGIONS.map((reg) => {
              const fillColor = getRegionFill(reg);
              const isLocked = lockedRegions.includes(reg.id);

              return (
                <path
                  key={reg.id}
                  id={`reg-${reg.id}`}
                  d={reg.d}
                  fill={fillColor}
                  stroke="#FAF7F0"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                  className={`transition-colors duration-200 ${
                    isLocked ? 'cursor-pointer hover:brightness-95' : 'cursor-pointer hover:brightness-105'
                  }`}
                  onClick={() => handleRegionClick(reg.id)}
                />
              );
            })}
          </g>
        ) : (
          /* CẤP ĐỘ 2: DETAIL - 34 Tỉnh thành con */
          <g id="layer-provinces-detail">
            {VIETNAM_34_PROVINCES.map((prov) => {
              const isInsideActiveRegion = prov.region === activeRegion;
              const isSelected = selectedProvinceId === prov.id;
              const fillColor = getProvinceFill(prov);

              return (
                <path
                  key={prov.id}
                  id={`prov-${prov.id}`}
                  d={prov.d}
                  fill={fillColor}
                  stroke="#FAF7F0"
                  strokeWidth={isSelected ? '2' : isInsideActiveRegion ? '1.2' : '0.6'}
                  strokeLinejoin="round"
                  opacity={isInsideActiveRegion ? 1 : 0.35}
                  className={`transition-all duration-200 ${
                    isInsideActiveRegion ? 'cursor-pointer hover:brightness-110' : 'pointer-events-none'
                  }`}
                  onMouseEnter={() => isInsideActiveRegion && setHoveredProvinceId(prov.id)}
                  onMouseLeave={() => setHoveredProvinceId(null)}
                  onClick={() => {
                    if (isInsideActiveRegion && onSelectProvince) {
                      onSelectProvince(prov);
                    }
                  }}
                />
              );
            })}
          </g>
        )}

        {/* LAYER 3: Islands & Reefs (WGS84 Standards) */}
        <g id="layer-islands" pointerEvents="none">
          {VIETNAM_ISLANDS_CATALOG.map((isl) => {
            if (isl.geometry_d) {
              return (
                <path
                  key={isl.id}
                  d={isl.geometry_d}
                  fill="#265946"
                  stroke="#FAF7F0"
                  strokeWidth="0.8"
                />
              );
            }
            if (isl.id === 'ts-thuyen-chai') {
              return (
                <ellipse
                  key={isl.id}
                  cx={isl.x}
                  cy={isl.y}
                  rx={11}
                  ry={2.6}
                  transform={`rotate(-35 ${isl.x} ${isl.y})`}
                  fill="#D8EFEA"
                  stroke="#265946"
                  strokeWidth="1.1"
                  strokeDasharray="2.5,1.2"
                />
              );
            }
            if (isl.type === 'island') {
              return (
                <g key={isl.id}>
                  <circle cx={isl.x} cy={isl.y} r={3.2} fill="#265946" stroke="#FAF7F0" strokeWidth="0.8" />
                  <circle cx={isl.x} cy={isl.y} r={4.6} fill="none" stroke="rgba(38,89,70,0.25)" strokeWidth="1" />
                </g>
              );
            }
            if (isl.type === 'reef') {
              const rot = isl.x ? ((isl.x * 7) % 60) - 30 : 0;
              return (
                <ellipse
                  key={isl.id}
                  cx={isl.x}
                  cy={isl.y}
                  rx={3.6}
                  ry={2.4}
                  transform={`rotate(${rot} ${isl.x} ${isl.y})`}
                  fill="#D8EFEA"
                  stroke="#265946"
                  strokeWidth="1.1"
                  strokeDasharray="2.5,1.2"
                />
              );
            }
            return (
              <circle
                key={isl.id}
                cx={isl.x}
                cy={isl.y}
                r={2.2}
                fill="#3F7A68"
              />
            );
          })}
        </g>

        {/* LAYER 4: Overlays, Labels & Story Pins */}
        <g id="layer-overlays">
          {/* Overview Region Labels */}
          {!isDetailMode &&
            VIETNAM_3_REGIONS.map((reg) => (
              <text
                key={`txt-${reg.id}`}
                x={reg.center[0]}
                y={reg.center[1]}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="16"
                fontWeight="800"
                pointerEvents="none"
                filter={`url(#${shadowFilterId})`}
              >
                {reg.name.toUpperCase()}
              </text>
            ))}

          {/* Detail Mode Province Labels (Active Region Only) */}
          {isDetailMode &&
            VIETNAM_34_PROVINCES.filter((p) => p.region === activeRegion).map((prov) => (
              <text
                key={`prov-txt-${prov.id}`}
                x={prov.cx}
                y={prov.cy}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize={activeRegion === 'central' ? '9' : '10'}
                fontWeight="700"
                pointerEvents="none"
                filter={`url(#${shadowFilterId})`}
              >
                {prov.name}
              </text>
            ))}

          {/* Archipelagos Sovereignty Labels */}
          <g id="labels-archipelagos" pointerEvents="none">
            <text x="622" y="522" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#1C382F">
              {t('map_section.paracel_name', 'Hoàng Sa')}
            </text>
            <text x="622" y="534" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#3F7A68">
              (Đà Nẵng - {t('map_section.vietnam_claim', '(Việt Nam)').replace(/[()]/g, '')})
            </text>

            <text x="690" y="942" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#1C382F">
              {t('map_section.spratly_name', 'Trường Sa')}
            </text>
            <text x="690" y="954" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#3F7A68">
              (Khánh Hoà - {t('map_section.vietnam_claim', '(Việt Nam)').replace(/[()]/g, '')})
            </text>
          </g>

          {/* Padlock Badges on Locked Regions (Overview Only) */}
          {!isDetailMode &&
            lockedRegions.map((lReg) => {
              const reg = VIETNAM_3_REGIONS.find((r) => r.id === lReg);
              if (!reg) return null;
              const isShaking = shakingRegion === lReg;

              return (
                <g
                  key={`lock-${lReg}`}
                  transform={`translate(${reg.center[0]}, ${reg.center[1] + 28})`}
                  className={`cursor-pointer group ${isShaking ? 'animate-bounce' : ''}`}
                  onClick={() => handleRegionClick(lReg as 'central' | 'south')}
                  role="button"
                  tabIndex={0}
                  aria-label={`${reg.name} đang bị khóa`}
                >
                  <circle
                    r="15"
                    fill="#FFFFFF"
                    filter={`url(#${shadowFilterId})`}
                    className="transition-transform group-hover:scale-110"
                  />
                  <g transform="translate(-7, -10)">
                    <rect x="2" y="6" width="10" height="8" rx="1.5" fill="#1C382F" />
                    <path
                      d="M 4 6 L 4 4 C 4 2.5 5 1.5 7 1.5 C 9 1.5 10 2.5 10 4 L 10 6"
                      fill="none"
                      stroke="#1C382F"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <circle cx="7" cy="10" r="0.9" fill="#FFFFFF" />
                  </g>
                  <text
                    x="0"
                    y="24"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill="#1C382F"
                  >
                    Locked
                  </text>
                </g>
              );
            })}

          {/* Inshore Island Labels */}
          {!isDetailMode && (
            <g pointerEvents="none" fontSize="9.5" fontWeight="700" fill="#1A3B32">
              <text x="212" y="792" textAnchor="middle">
                Đ. Phú Quốc
              </text>
              <text x="350" y="878" textAnchor="middle">
                Côn Đảo
              </text>
              <text x="440" y="280" textAnchor="start">
                Đ. Cát Bà
              </text>
              <text x="465" y="250" textAnchor="start">
                Đ. Bạch Long Vĩ
              </text>
              <text x="430" y="380" textAnchor="start">
                Đ. Cồn Cỏ
              </text>
              <text x="495" y="468" textAnchor="start">
                Đ. Lý Sơn
              </text>
              <text x="485" y="720" textAnchor="start">
                Đ. Phú Quý
              </text>
            </g>
          )}

          {/* 6 Featured Story Pins with Geographic Anchor Dots */}
          {featuredPins
            .filter((pin) => !isDetailMode || pin.region === activeRegion)
            .map((pin) => {
              const isSelected = selectedPinId === pin.id;
              const halfWidth = pin.pillWidth / 2;

              return (
                <g
                  key={pin.id}
                  onClick={
                    pin.storyId
                      ? (e) => {
                          e.stopPropagation();
                          onSelectPin?.(pin);
                        }
                      : undefined
                  }
                  tabIndex={pin.storyId ? 0 : undefined}
                  role={pin.storyId ? 'button' : 'img'}
                  aria-pressed={pin.storyId ? isSelected : undefined}
                  aria-label={
                    pin.storyId
                      ? t('map_section.read_story_from', { name: pin.name })
                      : t('map_section.coming_soon', { name: pin.name })
                  }
                  className={
                    pin.storyId
                      ? 'cursor-pointer group select-none focus:outline-none'
                      : 'select-none opacity-75'
                  }
                >
                  {/* Stem Line */}
                  <line
                    x1={pin.anchorX}
                    y1={pin.anchorY}
                    x2={pin.pillX - halfWidth + 10}
                    y2={pin.pillY}
                    stroke="#FFFFFF"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    opacity="0.95"
                  />

                  {/* Anchor Dot on Province */}
                  <circle
                    cx={pin.anchorX}
                    cy={pin.anchorY}
                    r="4"
                    fill="#1C382F"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />

                  {/* Location Pill Capsule */}
                  <g transform={`translate(${pin.pillX}, ${pin.pillY})`}>
                    <rect
                      x={-halfWidth}
                      y="-14"
                      width={pin.pillWidth}
                      height="28"
                      rx="14"
                      fill="#FFFFFF"
                      filter={`url(#${shadowFilterId})`}
                      className={`transition-all duration-200 group-hover:scale-105 ${
                        isSelected ? 'stroke-[#C08B3E] stroke-2' : ''
                      }`}
                    />
                    <circle cx={-halfWidth + 12} cy="0" r="4" fill="#1C382F" />
                    <text
                      x={-halfWidth + 23}
                      y="4"
                      fill="#1C382F"
                      fontSize="12"
                      fontWeight="700"
                      fontFamily="var(--font-sans)"
                      letterSpacing="0.2px"
                    >
                      {pin.name}
                    </text>
                  </g>
                </g>
              );
            })}
        </g>
      </svg>
    </div>
  );
};

export default Vietnam3RegionsLandingMap;
