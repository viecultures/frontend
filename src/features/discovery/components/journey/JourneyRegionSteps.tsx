import { ArrowRight, BookOpen, Flame, LockKeyhole, BookMarked } from "lucide-react";
import { useTranslation } from "react-i18next";
import { JOURNEY_REGIONS } from "./regions";

interface JourneyRegionStepsProps {
  savedWordCount: number;
  onSelectRegion: (region: "north") => void;
}

export function JourneyRegionSteps({
  savedWordCount,
  onSelectRegion,
}: JourneyRegionStepsProps) {
  const { t } = useTranslation("discovery");

  return (
    <>
      <h2>{t("journey.explore_vietnam")}</h2>
      <p className="journey-rail-intro">{t("journey.choose_first_intro")}</p>
      <div className="journey-region-list">
        {JOURNEY_REGIONS.map((item) => {
          const isOpen = item.id === "north";
          const regionName = t(item.nameKey, item.fallbackName);
          const stepContent = (
            <>
              <span className="journey-region-number">{item.number}</span>
              <img className="journey-region-photo" src={item.image} alt="" loading="lazy" />
              <span className="journey-region-copy">
                <strong>{regionName}</strong>
                <small className="journey-region-status">
                  {isOpen ? <BookOpen size={14} aria-hidden="true" /> : <LockKeyhole size={14} aria-hidden="true" />}
                  {isOpen ? t("journey.your_first_region") : t("journey.locked")}
                </small>
                {item.id === "north" && <small className="journey-region-recommended">{t("journey.recommended")}</small>}
                <span className="journey-region-description">{t(item.descriptionKey)}</span>
              </span>
              {isOpen && <ArrowRight className="journey-region-arrow" size={18} aria-hidden="true" />}
            </>
          );
          return isOpen ? (
            <button
              key={item.id}
              type="button"
              className="journey-region-step journey-region-step--open"
              aria-pressed={false}
              onClick={() => onSelectRegion("north")}
            >
              {stepContent}
            </button>
          ) : (
            <div key={item.id} className="journey-region-step journey-region-step--locked" aria-label={`${regionName}, ${t("journey.locked")}`}>
              {stepContent}
            </div>
          );
        })}
      </div>
      <div className="journey-learning-stats" role="group" aria-label={t("journey.learning_stats")}>
        <div className="journey-learning-stat">
          <Flame size={24} aria-hidden="true" />
          <span className="journey-learning-stat-value">—</span>
          <span>{t("journey.streak_days")}</span>
          <small>{t("journey.no_data")}</small>
        </div>
        <div className="journey-learning-stat">
          <BookOpen size={24} aria-hidden="true" />
          <span className="journey-learning-stat-value">—</span>
          <span>{t("journey.completed_readings")}</span>
          <small>{t("journey.no_data")}</small>
        </div>
        <div className="journey-learning-stat">
          <BookMarked size={24} aria-hidden="true" />
          <span className="journey-learning-stat-value">{savedWordCount}</span>
          <span>{t("journey.saved_words")}</span>
        </div>
      </div>
    </>
  );
}
