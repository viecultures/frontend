import { BookOpen, LockKeyhole } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { UpcomingJourneySeries } from "./JourneySeriesSection";

interface JourneyUpcomingCardProps {
  series: UpcomingJourneySeries;
  failedImage: boolean;
  onImageError: () => void;
}

export function JourneyUpcomingCard({ series, failedImage, onImageError }: JourneyUpcomingCardProps) {
  const { t } = useTranslation("discovery");

  return (
    <li>
      <article className="journey-series-tile is-locked is-upcoming">
        <div className="journey-series-image">
          {series.imageUrl && !failedImage ? (
            <img src={series.imageUrl} alt="" loading="lazy" onError={onImageError} />
          ) : (
            <BookOpen size={32} aria-hidden="true" />
          )}
          <span className="journey-series-lock">
            <LockKeyhole size={17} /> {t("journey.coming_soon")}
          </span>
        </div>
        <div className="journey-series-copy">
          <span className="discovery-category">{series.place}</span>
          <h4>{series.title}</h4>
          <p>{series.description}</p>
          <span className="journey-series-footer">
            {t("journey.coming_soon")} <LockKeyhole size={17} aria-hidden="true" />
          </span>
        </div>
      </article>
    </li>
  );
}
