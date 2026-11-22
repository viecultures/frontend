import { ArrowRight, BookOpen, LockKeyhole, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { VIETNAM_34_PROVINCES } from "@/data/vietnamMapData";
import type { JourneySeries } from "../../data/learningJourney";

interface JourneySpotlightCardProps {
  series: JourneySeries;
  isUnlocked: boolean;
  isEn: boolean;
  failedImage: boolean;
  getLocalizedProvinceName: (name: string) => string;
  onImageError: () => void;
  onStartReading: (chapter: JourneySeries["chapters"][number], series: JourneySeries) => void;
  onUnlock: (provinceId: string) => void;
}

export function JourneySpotlightCard({
  series,
  isUnlocked,
  isEn,
  failedImage,
  getLocalizedProvinceName,
  onImageError,
  onStartReading,
  onUnlock,
}: JourneySpotlightCardProps) {
  const { t } = useTranslation("discovery");
  const province = VIETNAM_34_PROVINCES.find((item) => item.id === series.provinceId);
  const placeName = province
    ? getLocalizedProvinceName(province.name)
    : isEn
      ? "Hanoi"
      : "Hà Nội";
  const firstChapter = series.chapters[0];

  return (
    <article className={`journey-spotlight-card ${isUnlocked ? "is-unlocked" : "is-locked"}`}>
      <div className="journey-spotlight-image">
        {series.imageUrl && !failedImage ? (
          <img src={series.imageUrl} alt={series.title} loading="lazy" onError={onImageError} />
        ) : (
          <BookOpen size={40} aria-hidden="true" />
        )}
        <span className="journey-spotlight-badge">
          <MapPin size={13} aria-hidden="true" /> {t("journey.featured_series").toUpperCase()}
        </span>
      </div>
      <div className="journey-spotlight-content">
        <span className="discovery-category">
          {placeName} · {t("journey.stories_in_region", {
            count: series.chapters.length,
            defaultValue: isEn
              ? `${series.chapters.length} ${series.chapters.length === 1 ? "story" : "stories"}`
              : `${series.chapters.length} câu chuyện`,
          })} · B1
        </span>
        <h3>{isEn ? series.title : series.titleVi || series.title}</h3>
        <p>{isEn ? series.description : series.descriptionVi || series.description}</p>
        <div className="journey-spotlight-footer">
          {isUnlocked ? (
            <button
              type="button"
              onClick={() => firstChapter && onStartReading(firstChapter, series)}
              className="journey-spotlight-action"
            >
              <BookOpen size={16} aria-hidden="true" />
              <span>{t("journey.start_reading_ch1")}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <Button
              type="button"
              className="journey-spotlight-action"
              onClick={() => onUnlock(series.provinceId)}
            >
              <LockKeyhole size={16} aria-hidden="true" />
              <span>{t("journey.unlock_place", { placeName })}</span>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
