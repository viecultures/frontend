import { ArrowRight, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { RefObject } from "react";
import { VIETNAM_34_PROVINCES } from "@/data/vietnamMapData";
import type { JourneySeries } from "../../data/learningJourney";

export interface JourneyChapterSelection {
  id: string;
  title: string;
  seriesTitle: string;
  level: "Level 1" | "Level 2" | "Level 3";
}

interface JourneyChapterPopoverProps {
  series: JourneySeries;
  popoverRef: RefObject<HTMLDivElement | null>;
  x: number;
  y: number;
  isEn: boolean;
  getLocalizedProvinceName: (name: string) => string;
  onClose: (restoreFocus?: boolean) => void;
  onChooseChapter: (
    chapter: JourneySeries["chapters"][number],
    series: JourneySeries,
  ) => void;
}

export function JourneyChapterPopover({
  series,
  popoverRef,
  x,
  y,
  isEn,
  getLocalizedProvinceName,
  onClose,
  onChooseChapter,
}: JourneyChapterPopoverProps) {
  const { t } = useTranslation("discovery");
  const placeName = getLocalizedProvinceName(
    VIETNAM_34_PROVINCES.find((province) => province.id === series.provinceId)?.name ||
      (isEn ? "Hanoi" : "Hà Nội"),
  );

  return (
    <div
      ref={popoverRef}
      id="journey-chapter-list"
      className="journey-hover-popover"
      style={{ left: `${x}px`, top: `${y}px` }}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose(true);
      }}
      role="region"
      aria-label={`${t("journey.explore_chapters")}: ${series.title}`}
    >
      <div className="journey-hover-popover-header">
        <div>
          <span className="journey-hover-popover-tag">
            {placeName} · {t("journey.chapters_count", { count: series.chapters.length })}
          </span>
          <h4>{isEn ? series.title : series.titleVi || series.title}</h4>
        </div>
        <button
          type="button"
          className="journey-hover-close"
          aria-label={t("journey.close_chapter_list")}
          onClick={() => onClose(true)}
        >
          <X size={16} />
        </button>
      </div>
      <ul className="journey-hover-chapter-list">
        {series.chapters.length > 0 ? (
          series.chapters.map((chapter) => (
            <li key={chapter.id}>
              <button
                type="button"
                className="journey-hover-chapter-link"
                onClick={() => onChooseChapter(chapter, series)}
              >
                <span className="journey-hover-chapter-num">
                  {String(chapter.order).padStart(2, "0")}
                </span>
                <div className="journey-hover-chapter-info">
                  <strong>
                    {isEn ? chapter.title || chapter.titleVi : chapter.titleVi || chapter.title}
                  </strong>
                  <small>
                    {chapter.readTime
                      ? isEn
                        ? chapter.readTime.replace("phút đọc", "min read")
                        : chapter.readTime
                      : isEn
                        ? "3 min read"
                        : "3 phút đọc"}
                  </small>
                </div>
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-xs text-text-muted italic">
            {t("journey.stories_on_the_way", { regionName: placeName })}
          </li>
        )}
      </ul>
    </div>
  );
}
