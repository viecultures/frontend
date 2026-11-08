import React, { useEffect, useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Compass, Lock } from 'lucide-react';
import { VietnamMap } from '@/components/map/VietnamMap';
import { VIETNAM_3_REGIONS } from '@/data/vietnam3RegionsGameData';
import type { ProvinceMapItem } from '@/data/vietnamMapData';
import type { RegionKey } from '@/utils/useVietnamMap';

export interface LocationStoryPin {
  id: string;
  name: string;
  englishTitle: string;
  region: Exclude<RegionKey, 'all'>;
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

export interface LandingVietnamMapProps {
  activeRegion?: RegionKey;
  lockedRegions?: string[];
  selectedProvinceId?: string | null;
  featuredPins?: LocationStoryPin[];
  selectedPinId?: string | null;
  onSelectRegion?: (region: Exclude<RegionKey, 'all'>) => void;
  onSelectProvince?: (province: ProvinceMapItem) => void;
  onSelectPin?: (pin: LocationStoryPin) => void;
  onResetView?: () => void;
  className?: string;
  showCompass?: boolean;
}

const REGION_KEYS: Exclude<RegionKey, 'all'>[] = ['north', 'central', 'south'];

export const LandingVietnamMap: React.FC<LandingVietnamMapProps> = ({
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
  const { t, i18n } = useTranslation('landing');
  const shadowFilterId = useId();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [shakingRegion, setShakingRegion] = useState<string | null>(null);
  const isDetailMode = activeRegion !== 'all';
  const selectableRegions = useMemo(
    () => REGION_KEYS.filter(region => !lockedRegions.includes(region)),
    [lockedRegions],
  );

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    if (!shakingRegion) return;
    const timer = window.setTimeout(() => setShakingRegion(null), 500);
    return () => window.clearTimeout(timer);
  }, [shakingRegion]);

  const handleRegionClick = (region: Exclude<RegionKey, 'all'>) => {
    if (lockedRegions.includes(region)) {
      const regionName = t(`map_section.region_${region}`);
      setShakingRegion(region);
      setToastMessage(t('map_section.locked_toast', { name: regionName }));
      return;
    }
    onSelectRegion?.(region);
  };

  return (
    <div className={`landing-vietnam-map relative h-full w-full rounded-2xl bg-[#E5F4F1] ${showCompass ? '' : 'landing-vietnam-map--no-compass'} ${className}`}>
      {toastMessage && (
        <div role="status" aria-live="polite" className="absolute left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#1C382F] px-4 py-2 text-xs font-semibold text-[#FAF7F0] shadow-xl">
          <Lock className="h-3.5 w-3.5 shrink-0 text-[#E5C48C]" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {isDetailMode && (
        <button
          type="button"
          onClick={onResetView}
          className="absolute left-3 top-3 z-30 flex items-center gap-1.5 rounded-full border border-[#CBDAD6]/60 bg-[#FAF7F0]/90 px-3 py-1.5 text-xs font-semibold text-[#1C382F] shadow-md backdrop-blur-sm hover:bg-[#FAF7F0]"
          aria-label={t('map_section.reset_view', 'Xem toàn cảnh')}
        >
          <Compass className="h-3.5 w-3.5 text-[#265946]" aria-hidden="true" />
          {t('map_section.reset_view', 'Xem toàn cảnh')}
        </button>
      )}

      <VietnamMap
        className="landing-vietnam-map-canvas"
        activeRegion={activeRegion}
        selectedProvinceId={selectedProvinceId ?? null}
        onSelectRegion={region => {
          if (region !== 'all') handleRegionClick(region);
        }}
        onSelectProvince={province => {
          if (province?.region === activeRegion) onSelectProvince?.(province);
        }}
        overviewByRegion
        selectableRegions={selectableRegions}
        showRegionTabs={false}
        showControls={false}
        showPoiPins={false}
        showTooltip={false}
        showLabels={isDetailMode}
        labelLanguage={i18n.language.startsWith('en') ? 'en' : 'vi'}
        enableZoomPan={false}
        showRegionLabels={false}
      >
        <defs>
          <filter id={shadowFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.22" />
          </filter>
        </defs>

        {!isDetailMode && lockedRegions.map(regionId => {
          const region = VIETNAM_3_REGIONS.find(item => item.id === regionId);
          if (!region) return null;
          const activate = () => handleRegionClick(region.id);
          return (
            <g key={region.id}>
              <path
                d={region.d}
                fill="transparent"
                pointerEvents="fill"
                role="button"
                tabIndex={0}
                aria-label={`${region.name}, ${t('map_section.locked', 'locked')}`}
                onClick={event => { event.stopPropagation(); activate(); }}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    activate();
                  }
                }}
              />
              <g
                transform={`translate(${region.center[0]}, ${region.center[1] + 28})`}
                className={shakingRegion === region.id ? 'animate-bounce' : ''}
                pointerEvents="none"
                aria-hidden="true"
              >
                <circle r="15" fill="#FFFFFF" filter={`url(#${shadowFilterId})`} />
                <Lock x="-8" y="-8" width="16" height="16" color="#1C382F" />
                <text y="24" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1C382F">{t('map_section.locked', 'Locked')}</text>
              </g>
            </g>
          );
        })}

        {featuredPins
          .filter(pin => !isDetailMode || pin.region === activeRegion)
          .map(pin => {
            const selected = selectedPinId === pin.id;
            const halfWidth = pin.pillWidth / 2;
            const activate = () => onSelectPin?.(pin);
            return (
              <g
                key={pin.id}
                role={pin.storyId ? 'button' : 'img'}
                tabIndex={pin.storyId ? 0 : undefined}
                aria-label={pin.storyId
                  ? t('map_section.read_story_from', { name: pin.name })
                  : t('map_section.coming_soon', { name: pin.name })}
                aria-pressed={pin.storyId ? selected : undefined}
                className={pin.storyId ? 'cursor-pointer' : 'opacity-75'}
                onClick={pin.storyId ? event => { event.stopPropagation(); activate(); } : undefined}
                onKeyDown={pin.storyId ? event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    activate();
                  }
                } : undefined}
              >
                <line
                  x1={pin.anchorX} y1={pin.anchorY}
                  x2={pin.pillX - halfWidth + 10} y2={pin.pillY}
                  stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round"
                />
                <circle cx={pin.anchorX} cy={pin.anchorY} r="4" fill="#1C382F" stroke="#FFFFFF" strokeWidth="1.5" />
                <g transform={`translate(${pin.pillX}, ${pin.pillY})`}>
                  <rect
                    x={-halfWidth} y="-14" width={pin.pillWidth} height="28" rx="14"
                    fill="#FFFFFF" stroke={selected ? '#C08B3E' : 'none'} strokeWidth={selected ? 2 : 0}
                    filter={`url(#${shadowFilterId})`}
                  />
                  <circle cx={-halfWidth + 12} cy="0" r="4" fill="#1C382F" />
                  <text x={-halfWidth + 23} y="4" fill="#1C382F" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)">
                    {pin.name}
                  </text>
                </g>
              </g>
            );
          })}
      </VietnamMap>
    </div>
  );
};

export default LandingVietnamMap;
