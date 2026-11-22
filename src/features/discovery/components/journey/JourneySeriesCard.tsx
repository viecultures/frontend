import { ArrowRight, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { VIETNAM_34_PROVINCES } from "@/data/vietnamMapData";
import type { JourneySeries } from "../../data/learningJourney";

interface JourneySeriesCardProps {
  series: JourneySeries;
  isEn: boolean;
  isSelected: boolean;
  failedImage: boolean;
  getLocalizedProvinceName: (name: string) => string;
  onImageError: () => void;
  onClick: (element: HTMLButtonElement) => void;
}

export function JourneySeriesCard({
  series,
  isEn,
  isSelected,
  failedImage,
  getLocalizedProvinceName,
  onImageError,
  onClick,
}: JourneySeriesCardProps) {
  const { t } = useTranslation("discovery");
  const province = VIETNAM_34_PROVINCES.find((item) => item.id === series.provinceId);
  const placeName = province
    ? getLocalizedProvinceName(province.name)
    : isEn
      ? "Vietnam"
      : "Việt Nam";

  return (
    <li key={series.id}>
      <button
        type="button"
        className={`journey-series-tile ${isSelected ? "is-selected" : ""}`}
        aria-expanded={isSelected}
        aria-controls="journey-chapter-list"
        onClick={(event) => onClick(event.currentTarget)}
      >
        <div className="journey-series-image">
          {series.imageUrl && !failedImage ? (
            <img src={series.imageUrl} alt="" loading="lazy" onError={onImageError} />
          ) : (
            <BookOpen size={32} aria-hidden="true" />
          )}
        </div>
        <div className="journey-series-copy">
          <span className="discovery-category">
            {placeName} · {t("journey.stories_in_region", {
              count: series.chapters.length,
              defaultValue: isEn
                ? `${series.chapters.length} ${series.chapters.length === 1 ? "story" : "stories"}`
                : `${series.chapters.length} câu chuyện`,
            })}
          </span>
          <h4>{isEn ? series.title : series.titleVi || series.title}</h4>
          <p>{isEn ? series.description : series.descriptionVi || series.description}</p>
          <span className="journey-series-footer">
            {t("journey.explore_chapters")} <ArrowRight size={18} aria-hidden="true" />
          </span>
        </div>
      </button>
    </li>
  );
}
