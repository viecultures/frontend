import React, { useState, useMemo } from 'react';
import { VietnamMap } from '@/components/map/VietnamMap';
import type { ProvinceMapItem } from '@/data/vietnamMapData';
import { HERITAGE_SITES } from '@/data/vietnamCultureData';
import type { CulturalHeritageSite } from '@/types/sampleTypes';
import { paths } from '@/routes/paths';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { MapWatercolorArtwork } from './MapWatercolorArtwork';
import { MapJourneyPanel } from './MapJourneyPanel';
import type { RegionKey } from '@/utils/useVietnamMap';

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

const FEATURED_PINS: LocationStoryPin[] = [
  {
    id: 'hagiang',
    name: 'Hà Giang',
    englishTitle: 'Cascading Rice Terraces of the Northwest',
    region: 'north',
    provinceId: 'tuyen-quang',
    provinceName: 'Hà Giang',
    anchorX: 235,
    anchorY: 115,
    pillX: 305,
    pillY: 115,
    pillWidth: 92,
    cefrLevel: 'Level 2',
  },
  {
    id: 'hanoi',
    name: 'Hà Nội',
    englishTitle: 'The 36 Guild Streets & Ca Trù Ballads',
    region: 'north',
    provinceId: 'ha-noi',
    provinceName: 'Hà Nội',
    anchorX: 250,
    anchorY: 208,
    pillX: 315,
    pillY: 208,
    pillWidth: 84,
    storyId: 'pho',
    cefrLevel: 'Level 3',
  },
  {
    id: 'hue',
    name: 'Huế',
    englishTitle: 'Imperial Citadel & Royal Court Architecture',
    region: 'central',
    provinceId: 'hue',
    provinceName: 'Thừa Thiên Huế',
    anchorX: 355,
    anchorY: 493,
    pillX: 418,
    pillY: 493,
    pillWidth: 72,
    cefrLevel: 'Level 3',
  },
  {
    id: 'danang',
    name: 'Đà Nẵng',
    englishTitle: 'Hoi An Lantern Festival & Coastal Heritage',
    region: 'central',
    provinceId: 'da-nang',
    provinceName: 'Đà Nẵng',
    anchorX: 384,
    anchorY: 541,
    pillX: 450,
    pillY: 541,
    pillWidth: 92,
    cefrLevel: 'Level 2',
  },
  {
    id: 'dalat',
    name: 'Đà Lạt',
    englishTitle: 'Mist-Shrouded Pine Highlands & Gong Culture',
    region: 'south',
    provinceId: 'lam-dong',
    provinceName: 'Đà Lạt',
    anchorX: 385,
    anchorY: 776,
    pillX: 448,
    pillY: 776,
    pillWidth: 84,
    cefrLevel: 'Level 2',
  },
  {
    id: 'saigon',
    name: 'TP. Hồ Chí Minh',
    englishTitle: 'The Story of Saigon Banh Mi & Urban Heritage',
    region: 'south',
    provinceId: 'ho-chi-minh',
    provinceName: 'TP. Hồ Chí Minh',
    anchorX: 308,
    anchorY: 823,
    pillX: 385,
    pillY: 835,
    pillWidth: 136,
    cefrLevel: 'Level 2',
  },
];

export const VietnamHeritageMapSection: React.FC = () => {
  const go = useAppNavigate();
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('north');
  const [selectedPinId, setSelectedPinId] = useState<string>('hanoi');

  const activePin = useMemo(() => {
    return FEATURED_PINS.find((p) => p.id === selectedPinId) || FEATURED_PINS[1];
  }, [selectedPinId]);

  const activeSite: CulturalHeritageSite = useMemo(() => {
    const foundSite = HERITAGE_SITES.find(
      (s) => s.id === activePin.id || s.province.toLowerCase().includes(activePin.provinceName.toLowerCase())
    );

    if (foundSite) return foundSite;

    return {
      id: activePin.id,
      name: activePin.name,
      englishTitle: activePin.englishTitle,
      region: activePin.region === 'north' ? 'Bắc Bộ' : activePin.region === 'central' ? 'Trung Bộ' : 'Nam Bộ',
      category: 'Di sản UNESCO',
      province: activePin.provinceName,
      x: activePin.anchorX,
      y: activePin.anchorY,
      established: 'Di sản truyền thống',
      unescoStatus: 'Di sản văn hóa tiêu biểu',
      cefrLevel: activePin.cefrLevel,
      culturalInsight: '',
      presentationSnippet: '',
      vocabularyList: [],
    };
  }, [activePin]);

  const handleSelectRegion = (region: RegionKey) => {
    if (region !== 'north') return;
    setSelectedRegion(region);
    const firstPinInRegion = FEATURED_PINS.find((p) => p.region === region);
    if (firstPinInRegion) {
      setSelectedPinId(firstPinInRegion.id);
    }
  };

  const handleSelectPin = (pin: LocationStoryPin) => {
    if (!pin.storyId) return;
    setSelectedPinId(pin.id);
    setSelectedRegion(pin.region);
    go(paths.reader({ story: pin.storyId }));
  };

  return (
    <section
      id="ban-do-di-san"
      className="landing-section relative py-10 sm:py-14 lg:py-16 px-4 sm:px-8 lg:px-12 bg-[#FAF7F0] text-ink transition-colors duration-300 overflow-hidden scroll-mt-24"
      aria-labelledby="heritage-map-title"
    >
      {/* 1. Panoramic Watercolor Artwork Background */}
      <MapWatercolorArtwork />

      <div className="relative z-10 w-full max-w-[1380px] mx-auto min-h-[520px] lg:min-h-[580px] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Clean Editorial Headline & Subtitle          */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[310px] xl:w-[330px] shrink-0 flex flex-col justify-center py-2 z-10">
          <h2
            id="heritage-map-title"
            className="font-serif text-3xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-bold text-[#1A3B32] leading-[1.22] tracking-tight m-0"
          >
            <span className="whitespace-nowrap">Khám phá bài đọc</span>
            <br />
            <span className="text-[#C08B3E] italic font-serif whitespace-nowrap">theo vùng miền</span>
          </h2>

          <p className="text-sm sm:text-base text-[#4A5550] leading-relaxed max-w-sm mt-4 font-normal">
            Bắt đầu với bài đọc Hà Nội; các địa điểm khác đang được chuẩn bị.
          </p>

          <div className="w-14 h-[2px] bg-[#C08B3E] mt-5" aria-hidden="true" />
        </div>

        {/* ========================================================= */}
        {/* CENTER COLUMN: Compact, Balanced Vietnam Vector Map       */}
        {/* ========================================================= */}
        <div className="w-full lg:flex-1 flex items-center justify-center relative min-h-[480px] sm:min-h-[520px] lg:min-h-[560px]">
          <div className="w-full h-full max-w-[420px] lg:max-w-[440px] flex items-center justify-center">
            <VietnamMap
              activeRegion="all"
              customViewBox="10 -20 600 1060"
              selectedProvinceId={activePin.provinceId}
              onSelectProvince={(prov: ProvinceMapItem | null) => {
                if (!prov) return;
                const matchingPin = FEATURED_PINS.find(
                  (pin) => pin.provinceId === prov.id || prov.name.includes(pin.name)
                );
                if (matchingPin?.storyId) {
                  handleSelectPin(matchingPin);
                }
              }}
              showControls={false}
              showRegionTabs={false}
              showPoiPins={false}
              showSeaLayer={false}
              showLabels={false}
            >
              {/* SVG Overlay: 6 Featured Pill Markers + Central & South Lock Nodes + Maritime Islands */}
              <g id="layer-featured-pill-markers">
                {/* Quần đảo Hoàng Sa */}
                <g id="qd-hoang-sa">
                  <circle cx="488" cy="445" r="4.2" fill="#2B6B7A" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.95" />
                  <circle cx="504" cy="452" r="3.6" fill="#2B6B7A" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.95" />
                  <circle cx="480" cy="462" r="3.6" fill="#2B6B7A" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.95" />
                  <circle cx="496" cy="472" r="3.2" fill="#2B6B7A" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.95" />
                  <circle cx="512" cy="458" r="3.0" fill="#2B6B7A" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.95" />
                  <circle cx="500" cy="436" r="2.8" fill="#2B6B7A" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.95" />
                  <text
                    x="524"
                    y="452"
                    fill="#1A3B32"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="var(--font-sans)"
                  >
                    Hoàng Sa
                  </text>
                  <text
                    x="524"
                    y="468"
                    fill="#3F5A50"
                    fontSize="9.5"
                    fontWeight="600"
                    fontFamily="var(--font-sans)"
                  >
                    (Việt Nam)
                  </text>
                </g>

                {/* Quần đảo Trường Sa */}
                <g id="qd-truong-sa">
                  <circle cx="495" cy="718" r="4.2" fill="#2B6B7A" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.95" />
                  <circle cx="515" cy="708" r="3.6" fill="#2B6B7A" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.95" />
                  <circle cx="528" cy="728" r="3.8" fill="#2B6B7A" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.95" />
                  <circle cx="502" cy="742" r="3.2" fill="#2B6B7A" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.95" />
                  <circle cx="536" cy="716" r="3.0" fill="#2B6B7A" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.95" />
                  <circle cx="518" cy="758" r="3.0" fill="#2B6B7A" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.95" />
                  <circle cx="485" cy="734" r="2.8" fill="#2B6B7A" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.95" />
                  <text
                    x="526"
                    y="768"
                    fill="#1A3B32"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="var(--font-sans)"
                  >
                    Trường Sa
                  </text>
                  <text
                    x="526"
                    y="784"
                    fill="#3F5A50"
                    fontSize="9.5"
                    fontWeight="600"
                    fontFamily="var(--font-sans)"
                  >
                    (Việt Nam)
                  </text>
                </g>

                {/* Central Region Lock Badge: Placed inside Central Vietnam */}
                <g
                  transform="translate(320, 510)"
                  className="select-none"
                  role="img"
                  aria-label="Miền Trung sắp mở"
                >
                  <circle
                    r="16"
                    fill="#FFFFFF"
                    filter="drop-shadow(0 2px 6px rgba(0,0,0,0.22))"
                    className="transition-transform group-hover:scale-110"
                  />
                  <path
                    d="M -4.5 -1 L -4.5 -4.5 C -4.5 -7 -2.2 -9 0 -9 C 2.2 -9 4.5 -7 4.5 -4.5 L 4.5 -1 M -5.5 -1 L 5.5 -1 L 5.5 6.5 L -5.5 6.5 Z"
                    fill="#1C382F"
                    stroke="#1C382F"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                  <circle cx="0" cy="2.5" r="1" fill="#FFFFFF" />
                </g>

                {/* South Region Lock Badge: Placed inside Southern Vietnam */}
                <g
                  transform="translate(265, 840)"
                  className="select-none"
                  role="img"
                  aria-label="Miền Nam sắp mở"
                >
                  <circle
                    r="16"
                    fill="#FFFFFF"
                    filter="drop-shadow(0 2px 6px rgba(0,0,0,0.22))"
                    className="transition-transform group-hover:scale-110"
                  />
                  <path
                    d="M -4.5 -1 L -4.5 -4.5 C -4.5 -7 -2.2 -9 0 -9 C 2.2 -9 4.5 -7 4.5 -4.5 L 4.5 -1 M -5.5 -1 L 5.5 -1 L 5.5 6.5 L -5.5 6.5 Z"
                    fill="#1C382F"
                    stroke="#1C382F"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                  <circle cx="0" cy="2.5" r="1" fill="#FFFFFF" />
                </g>

                {/* 6 Featured Location Story Pills with True Geographic Anchor Dots */}
                {FEATURED_PINS.map((pin) => {
                  const isSelected = selectedPinId === pin.id;
                  const halfWidth = pin.pillWidth / 2;

                  return (
                    <g
                      key={pin.id}
                      onClick={pin.storyId ? (e) => {
                        e.stopPropagation();
                        handleSelectPin(pin);
                      } : undefined}
                      onKeyDown={(e) => {
                        if (pin.storyId && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          handleSelectPin(pin);
                        }
                      }}
                      tabIndex={pin.storyId ? 0 : undefined}
                      role={pin.storyId ? 'button' : 'img'}
                      aria-pressed={pin.storyId ? isSelected : undefined}
                      aria-label={pin.storyId ? `Đọc bài tại ${pin.name}` : `${pin.name}: bài đọc đang chuẩn bị`}
                      className={pin.storyId ? 'cursor-pointer group select-none focus:outline-none' : 'select-none opacity-75'}
                    >
                      {/* Connecting Stem Line */}
                      <line
                        x1={pin.anchorX}
                        y1={pin.anchorY}
                        x2={pin.pillX - halfWidth + 10}
                        y2={pin.pillY}
                        stroke="#FFFFFF"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        opacity="0.9"
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
                        {/* Pill Background */}
                        <rect
                          x={-halfWidth}
                          y="-14"
                          width={pin.pillWidth}
                          height="28"
                          rx="14"
                          fill="#FFFFFF"
                          filter="drop-shadow(0 2px 5px rgba(0,0,0,0.18))"
                          className={`transition-all duration-200 group-hover:scale-105 ${
                            isSelected ? 'ring-2 ring-[#C08B3E]' : ''
                          }`}
                        />

                        {/* Inner Dark Dot on Left of Pill */}
                        <circle
                          cx={-halfWidth + 12}
                          cy="0"
                          r="4"
                          fill="#1C382F"
                        />

                        {/* Pill Name Label */}
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
            </VietnamMap>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: White Learning Journey Card                 */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 flex justify-end z-10">
          <MapJourneyPanel
            selectedRegion={selectedRegion}
            onSelectRegion={handleSelectRegion}
            selectedSite={activeSite}
          />
        </div>
      </div>
    </section>
  );
};

export default VietnamHeritageMapSection;
