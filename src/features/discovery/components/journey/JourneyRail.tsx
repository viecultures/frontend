import { useTranslation } from "react-i18next";
import type { JourneySeries } from "../../data/learningJourney";
import type { RegionKey } from "@/utils/useVietnamMap";
import { JourneyRegionSteps } from "./JourneyRegionSteps";
import { JourneySpotlightSlider } from "./JourneySpotlightSlider";

interface JourneyRailProps {
  selectedRegion: RegionKey;
  selectedProvinceName?: string;
  featuredRegionName: string;
  savedWordCount: number;
  nominatedSlides: JourneySeries[];
  currentSlide?: JourneySeries;
  activeSlideIndex: number;
  hasOwnSeries: boolean;
  unlockedPlaces: Record<string, boolean>;
  renderSpotlightCard: (series: JourneySeries, isUnlocked: boolean) => React.ReactNode;
  onSelectRegion: (region: RegionKey) => void;
  onSetActiveSlideIndex: (index: number) => void;
  onPreviousSlide: () => void;
  onNextSlide: () => void;
  onCardKeyDown: (event: React.KeyboardEvent) => void;
  onHoverChange: (hovered: boolean) => void;
  onFocusChange: (focused: boolean) => void;
}

export function JourneyRail({
  selectedRegion,
  selectedProvinceName,
  featuredRegionName,
  savedWordCount,
  nominatedSlides,
  currentSlide,
  activeSlideIndex,
  hasOwnSeries,
  unlockedPlaces,
  renderSpotlightCard,
  onSelectRegion,
  onSetActiveSlideIndex,
  onPreviousSlide,
  onNextSlide,
  onCardKeyDown,
  onHoverChange,
  onFocusChange,
}: JourneyRailProps) {
  const { t } = useTranslation("discovery");
  const isRegionSelected = selectedRegion !== "all";

  return (
    <aside
      className={`journey-rail ${isRegionSelected ? "journey-rail--featured" : "journey-rail--regions"}`}
      aria-label={t(isRegionSelected ? "journey.featured_series" : "journey.explore_vietnam")}
      aria-live={isRegionSelected ? "off" : "polite"}
      onFocus={() => onFocusChange(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onFocusChange(false);
      }}
    >
      {!isRegionSelected ? (
        <JourneyRegionSteps
          savedWordCount={savedWordCount}
          onSelectRegion={onSelectRegion}
        />
      ) : (
        <JourneySpotlightSlider
          selectedProvinceName={selectedProvinceName}
          featuredRegionName={featuredRegionName}
          nominatedSlides={nominatedSlides}
          currentSlide={currentSlide}
          activeSlideIndex={activeSlideIndex}
          hasOwnSeries={hasOwnSeries}
          unlockedPlaces={unlockedPlaces}
          renderSpotlightCard={renderSpotlightCard}
          onSetActiveSlideIndex={onSetActiveSlideIndex}
          onPreviousSlide={onPreviousSlide}
          onNextSlide={onNextSlide}
          onCardKeyDown={onCardKeyDown}
          onHoverChange={onHoverChange}
        />
      )}
    </aside>
  );
}
