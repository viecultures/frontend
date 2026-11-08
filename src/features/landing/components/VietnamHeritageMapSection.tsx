import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HERITAGE_SITES } from '@/data/vietnamCultureData';
import type { CulturalHeritageSite } from '@/types/sampleTypes';
import { PATHS, paths, withQuery } from '@/routes/paths';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { MapJourneyPanel } from './MapJourneyPanel';
import type { RegionKey } from '@/utils/useVietnamMap';
import { readFirstRegionChoice, saveFirstRegionChoice, type FirstRegion } from '@/services/learning/firstRegionChoice';
import { LandingVietnamMap, type LocationStoryPin } from './LandingVietnamMap';
import type { ProvinceMapItem } from '@/data/vietnamMapData';

const FEATURED_PINS: LocationStoryPin[] = [
  {
    id: 'hagiang',
    name: 'Hà Giang',
    englishTitle: 'Cascading Rice Terraces of the Northwest',
    region: 'north',
    provinceId: 'tuyen-quang',
    provinceName: 'Hà Giang',
    anchorX: 266,
    anchorY: 102,
    pillX: 336,
    pillY: 102,
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
    anchorX: 310,
    anchorY: 200,
    pillX: 380,
    pillY: 200,
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
    anchorX: 399,
    anchorY: 444,
    pillX: 468,
    pillY: 444,
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
    anchorX: 431,
    anchorY: 465,
    pillX: 500,
    pillY: 465,
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
    anchorX: 442,
    anchorY: 681,
    pillX: 512,
    pillY: 681,
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
    anchorX: 351,
    anchorY: 741,
    pillX: 425,
    pillY: 751,
    pillWidth: 136,
    cefrLevel: 'Level 2',
  },
];

export const VietnamHeritageMapSection: React.FC = () => {
  const { t } = useTranslation('landing');
  const go = useAppNavigate();
  const [firstRegion, setFirstRegion] = useState<FirstRegion | null>(readFirstRegionChoice);
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>(() => readFirstRegionChoice() || 'all');
  const [selectedPinId, setSelectedPinId] = useState<string>(() => FEATURED_PINS.find(pin => pin.region === readFirstRegionChoice())?.id || 'hanoi');

  const activePin = useMemo(() => {
    return FEATURED_PINS.find((p) => p.id === selectedPinId) || FEATURED_PINS[1];
  }, [selectedPinId]);

  const activeSite: CulturalHeritageSite = useMemo(() => {
    const foundSite = HERITAGE_SITES.find(
      (s) => s.id === activePin.id || s.province.toLowerCase().includes(activePin.provinceName.toLowerCase())
    );

    if (foundSite) return foundSite;

    const regionType: 'Bắc Bộ' | 'Trung Bộ' | 'Nam Bộ' =
      activePin.region === 'north'
        ? 'Bắc Bộ'
        : activePin.region === 'central'
        ? 'Trung Bộ'
        : 'Nam Bộ';

    return {
      id: activePin.id,
      name: activePin.name,
      englishTitle: activePin.englishTitle,
      region: regionType,
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
    if (region === 'all' || (firstRegion && region !== firstRegion)) return;
    setFirstRegion(region);
    saveFirstRegionChoice(region);
    setSelectedRegion(region);
    const firstPinInRegion = FEATURED_PINS.find((p) => p.region === region);
    if (firstPinInRegion) {
      setSelectedPinId(firstPinInRegion.id);
    }
  };

  const handleChangeFirstRegion = () => {
    setFirstRegion(null);
    saveFirstRegionChoice(null);
    setSelectedRegion('all');
  };

  const handleSelectPin = (pin: LocationStoryPin) => {
    setSelectedPinId(pin.id);
    setSelectedRegion(pin.region);
    if (pin.storyId) {
      go(paths.reader({ story: pin.storyId }));
    }
  };

  // Compute locked regions for gamified onboarding
  const lockedRegions = useMemo(() => {
    const allThree: ('north' | 'central' | 'south')[] = ['north', 'central', 'south'];
    const unlocked = firstRegion || 'north';
    return allThree.filter((r) => r !== unlocked);
  }, [firstRegion]);

  return (
    <section
      id="ban-do-di-san"
      className="landing-section relative py-5 sm:py-7 lg:py-8 px-4 sm:px-8 lg:px-12 bg-[#FAF7F0] text-ink transition-colors duration-300 overflow-hidden scroll-mt-24"
      aria-labelledby="heritage-map-title"
    >
      <div className="relative z-10 w-full max-w-[1380px] mx-auto min-h-[520px] lg:min-h-[580px] flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-6">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Clean Editorial Headline & Subtitle          */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[310px] xl:w-[330px] shrink-0 flex flex-col pt-2 lg:pt-8 z-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#C08B3E] mb-3 block">
            {t('navigation.heritage_map', 'Bản đồ di sản')}
          </span>

          <h2
            id="heritage-map-title"
            className="font-serif text-3xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-bold text-[#1A3B32] leading-[1.22] tracking-tight m-0"
          >
            <span className="whitespace-nowrap">{t('map_section.headline_part1')}</span>
            <br />
            <span className="text-[#C08B3E] italic font-serif whitespace-nowrap">{t('map_section.headline_part2')}</span>
          </h2>

          <p className="text-sm sm:text-base text-[#4A5550] leading-relaxed max-w-sm mt-4 font-normal">
            {t('map_section.subtitle')}
          </p>

          <div className="w-14 h-[2px] bg-[#C08B3E] mt-5" aria-hidden="true" />
        </div>

        {/* ========================================================= */}
        {/* CENTER COLUMN: Pure Vector 3-Regions & 34 Provinces Map  */}
        {/* ========================================================= */}
        <div className="w-full lg:flex-1 flex items-center justify-center relative min-h-[480px] sm:min-h-[520px] lg:min-h-[580px]">
          <div className="w-full h-full max-w-[560px] xl:max-w-[620px] aspect-square flex items-center justify-center shadow-lg rounded-2xl overflow-hidden border border-[#CBDAD6]/40">
            <LandingVietnamMap
              activeRegion={selectedRegion}
              lockedRegions={lockedRegions}
              selectedProvinceId={firstRegion ? activePin.provinceId : null}
              featuredPins={FEATURED_PINS}
              selectedPinId={firstRegion ? selectedPinId : null}
              onSelectRegion={(reg) => handleSelectRegion(reg)}
              onSelectProvince={(prov: ProvinceMapItem) => {
                const matchingPin = FEATURED_PINS.find(
                  (pin) => pin.provinceId === prov.id || prov.name.includes(pin.name)
                );
                if (matchingPin) {
                  handleSelectPin(matchingPin);
                }
              }}
              onSelectPin={handleSelectPin}
              onResetView={handleChangeFirstRegion}
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: White Learning Journey Card                 */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 flex justify-end lg:pt-2 z-10">
          <MapJourneyPanel
            selectedRegion={selectedRegion}
            firstRegion={firstRegion}
            onSelectRegion={handleSelectRegion}
            onChangeFirstRegion={handleChangeFirstRegion}
            onOpenJourney={() => go(withQuery(PATHS.discovery, { region: firstRegion }))}
            selectedSite={activeSite}
          />
        </div>
      </div>
    </section>
  );
};

export default VietnamHeritageMapSection;
