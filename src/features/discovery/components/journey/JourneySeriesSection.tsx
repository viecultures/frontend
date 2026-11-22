import type { ReactNode, RefObject } from "react";
import { useTranslation } from "react-i18next";
import { JourneyUpcomingCard } from "./JourneyUpcomingCard";
import { DiscoveryPagination } from "../DiscoveryPagination";
import type { JourneySeries } from "../../data/learningJourney";

export interface UpcomingJourneySeries {
  id: string;
  title: string;
  place: string;
  imageUrl: string;
  description: string;
}

interface JourneySeriesSectionProps {
  availableRef: RefObject<HTMLDivElement | null>;
  upcomingRef: RefObject<HTMLDivElement | null>;
  pagedAvailableSeries: JourneySeries[];
  pagedUpcomingSeries: UpcomingJourneySeries[];
  upcomingCount: number;
  isLoading: boolean;
  isEn: boolean;
  totalAvailableCount: number;
  currentAvailablePage: number;
  totalAvailablePages: number;
  currentUpcomingPage: number;
  totalUpcomingPages: number;
  renderSeriesCard: (series: JourneySeries) => ReactNode;
  onAvailablePageChange: (page: number) => void;
  onUpcomingPageChange: (page: number) => void;
  failedImages: Record<string, boolean>;
  onImageError: (id: string) => void;
}

const SERIES_PAGE_SIZE = 6;

export function JourneySeriesSection({
  availableRef,
  upcomingRef,
  pagedAvailableSeries,
  pagedUpcomingSeries,
  upcomingCount,
  isLoading,
  isEn,
  totalAvailableCount,
  currentAvailablePage,
  totalAvailablePages,
  currentUpcomingPage,
  totalUpcomingPages,
  renderSeriesCard,
  onAvailablePageChange,
  onUpcomingPageChange,
  failedImages,
  onImageError,
}: JourneySeriesSectionProps) {
  const { t } = useTranslation("discovery");

  return (
    <>
      <div ref={availableRef} className="journey-library-group" id="journey-available-series">
        <div className="journey-library-section-heading">
          <h2>{t("journey.available_series")}</h2>
          <span>{t("journey.series_count", { count: totalAvailableCount })}</span>
        </div>
        {isLoading ? (
          <div className="journey-series-grid opacity-60 transition-opacity duration-200">
            {pagedAvailableSeries.map(renderSeriesCard)}
          </div>
        ) : (
          <ul className="journey-series-grid">{pagedAvailableSeries.map(renderSeriesCard)}</ul>
        )}
        {!isLoading && totalAvailableCount === 0 && (
          <div className="journey-empty-region">
            <p>{t("journey.no_published_series")}</p>
          </div>
        )}
        <DiscoveryPagination
          currentPage={currentAvailablePage}
          totalPages={totalAvailablePages}
          totalItems={totalAvailableCount}
          itemsPerPage={SERIES_PAGE_SIZE}
          onPageChange={onAvailablePageChange}
          ariaLabel={t("journey.pagination_available_aria", {
            defaultValue: isEn ? "Available series pagination" : "Phân trang chuỗi bài hiện có",
          })}
          itemLabel={isEn ? "series" : "chuỗi bài"}
          showSinglePage={true}
        />
      </div>

      {upcomingCount > 0 && (
        <div ref={upcomingRef} className="journey-library-group" id="journey-upcoming-series">
          <div className="journey-library-section-heading">
            <h2>{t("journey.upcoming_series")}</h2>
            <span>{t("journey.series_count", { count: upcomingCount })}</span>
          </div>
          <ul className="journey-series-grid">
            {pagedUpcomingSeries.map((series) => (
              <JourneyUpcomingCard
                key={series.id}
                series={series}
                failedImage={!!failedImages[series.id]}
                onImageError={() => onImageError(series.id)}
              />
            ))}
          </ul>
          <DiscoveryPagination
            currentPage={currentUpcomingPage}
            totalPages={totalUpcomingPages}
            totalItems={upcomingCount}
            itemsPerPage={SERIES_PAGE_SIZE}
            onPageChange={onUpcomingPageChange}
            ariaLabel={t("journey.pagination_upcoming_aria", {
              defaultValue: isEn ? "Upcoming series pagination" : "Phân trang chuỗi bài sắp ra mắt",
            })}
            itemLabel={isEn ? "upcoming series" : "chuỗi bài sắp ra mắt"}
            showSinglePage={true}
          />
        </div>
      )}
    </>
  );
}
