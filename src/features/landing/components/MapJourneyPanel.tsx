import React from 'react';
import { BookOpen, Lock } from 'lucide-react';
import type { RegionKey } from '@/utils/useVietnamMap';
import type { CulturalHeritageSite } from '@/types/sampleTypes';
import { VIETNAM_34_PROVINCES } from '@/data/vietnamMapData';
import type { FirstRegion } from '@/services/learning/firstRegionChoice';

export interface MapJourneyRegionItem {
  id: 'north' | 'central' | 'south';
  number: string;
  name: string;
  englishName: string;
  storyCount: number;
  featuredPlaces: string;
  fillColor: string;
  borderColor: string;
}

const JOURNEY_REGIONS: MapJourneyRegionItem[] = [
  {
    id: 'north',
    number: '01',
    name: 'North',
    englishName: 'Northern Vietnam',
    storyCount: 6,
    featuredPlaces: 'Hà Nội • Hà Giang',
    fillColor: '#235C4A',
    borderColor: '#235C4A',
  },
  {
    id: 'central',
    number: '02',
    name: 'Central',
    englishName: 'Central Vietnam',
    storyCount: 5,
    featuredPlaces: 'Huế • Đà Nẵng',
    fillColor: '#C98A33',
    borderColor: '#C98A33',
  },
  {
    id: 'south',
    number: '03',
    name: 'South',
    englishName: 'Southern Vietnam',
    storyCount: 4,
    featuredPlaces: 'Đà Lạt • TP. Hồ Chí Minh',
    fillColor: '#518894',
    borderColor: '#518894',
  },
];

const REGION_MAINLAND_VIEWBOXES: Record<'north' | 'central' | 'south', string> = {
  north: '42 54 348 219',
  central: '144 226 329 560',
  south: '119 740 320 235',
};

interface MapJourneyPanelProps {
  selectedRegion: RegionKey;
  firstRegion: FirstRegion | null;
  onSelectRegion: (region: RegionKey) => void;
  onChangeFirstRegion: () => void;
  onOpenJourney: () => void;
  selectedSite: CulturalHeritageSite | null;
  isPlayingAudio?: boolean;
  onToggleAudio?: (text: string) => void;
  onOpenReader?: (storyId: string) => void;
}

export const MapJourneyPanel: React.FC<MapJourneyPanelProps> = ({
  selectedRegion,
  firstRegion,
  onSelectRegion,
  onChangeFirstRegion,
  onOpenJourney,
}) => {
  return (
    <div className="w-full sm:w-[340px] lg:w-[350px] bg-white rounded-3xl border border-[#EBE5D8] p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] space-y-4">
      {/* 1. Card Header: Strictly Single Line */}
      <div className="pb-0.5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6E7B75] whitespace-nowrap m-0">
          LEARNING JOURNEY BY REGION
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{firstRegion ? 'Your first region is open. Explore it in the reading journey.' : 'Choose your first region. Northern Vietnam is recommended.'}</p>
        {firstRegion && <button type="button" onClick={onChangeFirstRegion} className="mt-2 text-sm font-semibold text-action underline underline-offset-4">Change first region</button>}
      </div>

      {/* 2. 3-Step Timeline matching Cultural-Geographic Classification */}
      <div className="space-y-2 relative">
        {JOURNEY_REGIONS.map((region, index) => {
          const isSelected = selectedRegion === region.id;
          const isAvailable = !firstRegion || region.id === firstRegion;
          const provs = VIETNAM_34_PROVINCES.filter((p) => p.region === region.id);
          const mainlandViewBox = REGION_MAINLAND_VIEWBOXES[region.id];

          return (
            <div key={region.id} className="relative">
              {/* Connecting vertical timeline line */}
              {index < JOURNEY_REGIONS.length - 1 && (
                <div
                  className={`absolute left-[20px] top-[48px] h-9 w-[1.5px] z-0 ${
                    index === 0
                      ? 'bg-[#C5DDD2]'
                      : 'border-l-[1.5px] border-dashed border-[#D5DDD8]'
                  }`}
                  aria-hidden="true"
                />
              )}

              <button
                type="button"
                onClick={() => onSelectRegion(region.id)}
                disabled={!isAvailable}
                className={`w-full relative z-10 rounded-2xl p-3.5 transition-all duration-200 text-left flex items-start gap-3 ${isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'} ${
                  isSelected
                    ? 'border-2 border-[#235C4A] bg-[#F4F9F6] shadow-sm'
                    : 'border border-[#EBE5D8] bg-white hover:border-[#C5DDD2]'
                }`}
              >
                {/* 1. Number circle node (01, 02, 03) */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-mono text-xs font-bold transition-colors ${
                    isSelected
                      ? 'border-2 border-[#235C4A] bg-white text-[#235C4A]'
                      : 'border border-[#D5DDD8] bg-white text-[#8C9B94]'
                  }`}
                >
                  {region.number}
                </div>

                {/* 2. Mini Geographic Silhouette */}
                <div className="w-10 h-10 shrink-0 flex items-center justify-center p-0.5">
                  <svg
                    viewBox={mainlandViewBox}
                    preserveAspectRatio="xMidYMid meet"
                    className="w-full h-full object-contain"
                    aria-hidden="true"
                  >
                    {provs.map((p) => (
                      <path
                        key={p.id}
                        d={p.d}
                        fill={region.fillColor}
                        stroke="#FFFFFF"
                        strokeWidth="1.2"
                      />
                    ))}
                  </svg>
                </div>

                {/* 3. Title & Badge & Subtext */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base font-bold text-[#1A3B32] whitespace-nowrap shrink-0">
                      {region.name}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0 ${
                        isSelected
                          ? 'bg-[#E2EDE6] text-[#235C4A]'
                          : 'bg-[#EEF1EF] text-[#7A8A83]'
                      }`}
                    >
                      {isAvailable ? (
                        <>
                          <BookOpen className="w-2.5 h-2.5 text-[#205343]" aria-hidden="true" />
                          <span>{firstRegion ? 'Open now' : 'Choose first'}</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-2.5 h-2.5 text-[#7A8A83]" aria-hidden="true" />
                          <span>Locked</span>
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-[#71807A] whitespace-nowrap font-medium mt-1">
                    {region.featuredPlaces}
                  </p>
                  {region.id === 'north' && <p className="mt-1 text-xs font-semibold text-accent-ink">Recommended</p>}
                </div>
              </button>
            </div>
          );
        })}
      </div>
      {firstRegion && <button type="button" onClick={onOpenJourney} className="landing-button landing-button-primary w-full">Explore {JOURNEY_REGIONS.find(region => region.id === firstRegion)?.name} <BookOpen size={16} aria-hidden="true" /></button>}
    </div>
  );
};

export default MapJourneyPanel;
