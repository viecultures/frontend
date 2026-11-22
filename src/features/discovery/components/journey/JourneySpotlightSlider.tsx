import type { KeyboardEvent, ReactNode } from "react";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { JourneySeries } from "../../data/learningJourney";

interface JourneySpotlightSliderProps {
  selectedProvinceName?: string;
  featuredRegionName: string;
  nominatedSlides: JourneySeries[];
  currentSlide?: JourneySeries;
  activeSlideIndex: number;
  hasOwnSeries: boolean;
  unlockedPlaces: Record<string, boolean>;
  renderSpotlightCard: (series: JourneySeries, isUnlocked: boolean) => ReactNode;
  onSetActiveSlideIndex: (index: number) => void;
  onPreviousSlide: () => void;
  onNextSlide: () => void;
  onCardKeyDown: (event: KeyboardEvent) => void;
  onHoverChange: (hovered: boolean) => void;
}

export function JourneySpotlightSlider({
  selectedProvinceName,
  featuredRegionName,
  nominatedSlides,
  currentSlide,
  activeSlideIndex,
  hasOwnSeries,
  unlockedPlaces,
  renderSpotlightCard,
  onSetActiveSlideIndex,
  onPreviousSlide,
  onNextSlide,
  onCardKeyDown,
  onHoverChange,
}: JourneySpotlightSliderProps) {
  const { t } = useTranslation("discovery");

  return (
    <>
      <div className="journey-rail-header">
        <div className="journey-rail-title-group">
          <span className="journey-eyebrow">{selectedProvinceName?.toUpperCase() || featuredRegionName.toUpperCase()}</span>
          <h2>{t("journey.featured_series")}</h2>
        </div>
        {nominatedSlides.length > 1 && (
          <div className="journey-slider-controls" aria-label={t("journey.featured_series")}>
            <button type="button" className="journey-slider-arrow" onClick={onPreviousSlide} aria-label={t("journey.previous_series")}>
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <span className="journey-slider-counter">{t("journey.series_counter", { current: activeSlideIndex + 1, total: nominatedSlides.length })}</span>
            <button type="button" className="journey-slider-arrow" onClick={onNextSlide} aria-label={t("journey.next_series")}>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      {selectedProvinceName && !hasOwnSeries && (
        <div className="journey-place-notice" role="status">
          <Compass size={14} className="journey-place-notice-icon" aria-hidden="true" />
          <span>
            {t("journey.no_dedicated_series", { placeName: selectedProvinceName })}
            {t("journey.showing_featured_north")}
          </span>
        </div>
      )}
      {!currentSlide && (
        <div className="journey-empty-region" role="status">
          <p>{t("journey.stories_on_the_way", { regionName: featuredRegionName })}</p>
        </div>
      )}
      {currentSlide && (
        <div
          tabIndex={0}
          onKeyDown={onCardKeyDown}
          aria-label={`${t("journey.featured_series")}: ${currentSlide.title}`}
          className="journey-spotlight-slider-wrapper"
          onMouseEnter={() => onHoverChange(true)}
          onMouseLeave={() => onHoverChange(false)}
        >
          {renderSpotlightCard(currentSlide, !!unlockedPlaces[currentSlide.provinceId])}
          {nominatedSlides.length > 1 && (
            <div className="journey-slider-dots" role="group" aria-label={t("journey.featured_series")}>
              {nominatedSlides.map((series, index) => (
                <button
                  key={series.id}
                  type="button"
                  aria-label={`${index + 1}: ${series.title}`}
                  aria-current={index === activeSlideIndex ? "true" : undefined}
                  className={`journey-slider-dot ${index === activeSlideIndex ? "is-active" : ""}`}
                  onClick={() => onSetActiveSlideIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
