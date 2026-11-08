import { useTranslation } from "react-i18next";
import { useEffect, useLayoutEffect, useState, useRef, useMemo } from "react";
import type { CSSProperties } from "react";
import { useSearchParams } from "react-router-dom";
import { LocalizedLink as Link } from "@/components/common/LocalizedLink";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BookMarked,
  Bot,
  ChevronLeft,
  ChevronRight,
  Compass,
  Flame,
  Headphones,
  LockKeyhole,
  MapPin,
  Mic2,
  X,
} from "lucide-react";
import { VietnamMap } from "@/components/map/VietnamMap";
import { Button } from "@/components/ui/button";
import { VIETNAM_34_PROVINCES } from "@/data/vietnamMapData";
import { toEnglishPlaceName } from "@/utils/vietnamMapUtils";
import type { RegionKey } from "@/utils/useVietnamMap";
import { paths } from "@/routes/paths";
import {
  getAllSavedVocabularies,
  readLearningValue,
  writeLearningValue,
} from "@/services/learning/learningStorage";
import type { FirstRegion } from "@/services/learning/firstRegionChoice";
import { JOURNEY_SERIES, type JourneySeries } from "../data/learningJourney";
import { journeyApiService } from "../services/journeyApiService";
import { getPublicCuisineSeries, toPublicJourney } from '@/features/reader/services/publicCuisineService';
import { DiscoveryPagination } from "./DiscoveryPagination";

const SERIES_PAGE_SIZE = 6;

const REGIONS = [
  {
    id: "north",
    nameKey: "journey.region_north",
    fallbackName: "Northern Vietnam",
    number: "1",
    image: "/images/discovery/region-north-ho-guom.png",
    descriptionKey: "journey.region_north_description",
  },
  {
    id: "central",
    nameKey: "journey.region_central",
    fallbackName: "Central Vietnam",
    number: "2",
    image: "/images/discovery/region-central-hoi-an.png",
    descriptionKey: "journey.region_central_description",
  },
  {
    id: "south",
    nameKey: "journey.region_south",
    fallbackName: "Southern Vietnam",
    number: "3",
    image: "/images/discovery/region-south-floating-market.png",
    descriptionKey: "journey.region_south_description",
  },
] as const;
interface HoverPopoverState {
  series: JourneySeries;
  x: number;
  y: number;
  pinned?: boolean;
}

interface SelectedChapter {
  id: string;
  title: string;
  seriesTitle: string;
  level: 'Level 1' | 'Level 2' | 'Level 3';
}

export function DiscoveryJourney() {
  const { t, i18n } = useTranslation("discovery");
  const isEn = i18n.language === "en";
  const mapPanelRef = useRef<HTMLElement>(null);
  const [mapPanelHeight, setMapPanelHeight] = useState<number | null>(null);
  const [carouselHovered, setCarouselHovered] = useState(false);
  const [carouselFocused, setCarouselFocused] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [reduceMotion, setReduceMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [params, setParams] = useSearchParams();
  const firstRegion: FirstRegion = "north";
  const requestedPlace = VIETNAM_34_PROVINCES.find(
    (province) => province.id === params.get("place"),
  );
  const selectedProvince =
    requestedPlace?.region === firstRegion ? requestedPlace : undefined;
  const selectedPlace = selectedProvince?.id || "";
  const selectedRegion: RegionKey = selectedProvince
    ? "north"
    : params.get("region") === "north"
      ? "north"
      : "all";
  const region = REGIONS.find((item) => item.id === selectedRegion);

  const getRegionName = (item: (typeof REGIONS)[number]) =>
    t(item.nameKey, item.fallbackName);

  const staticUpcomingPreviews: Array<{ id: string; title: string; place: string; imageUrl: string; description: string }> = [];

  const getLocalizedProvinceName = (pName: string) => {
    return isEn ? toEnglishPlaceName(pName) : pName;
  };

  useEffect(() => {
    const regionParam = params.get("region");
    const placeParam = params.get("place");
    const isPlaceInvalid = placeParam && requestedPlace?.region !== "north";
    const isRegionInvalid =
      regionParam && regionParam !== "north" && regionParam !== "all";
    if (!isPlaceInvalid && !isRegionInvalid) return;
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (isRegionInvalid) next.delete("region");
        if (isPlaceInvalid) next.delete("place");
        return next;
      },
      { replace: true },
    );
  }, [params, requestedPlace, setParams]);

  const [unlockedPlaces, setUnlockedPlaces] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        JOURNEY_SERIES.map((series) => [
          series.provinceId,
          readLearningValue<boolean>(
            `journey:unlocked:${series.provinceId}`,
          ) === true,
        ]),
      ),
  );
  const [allJourneys, setAllJourneys] = useState<JourneySeries[]>(JOURNEY_SERIES);

  useEffect(() => {
    let active = true;
    Promise.all([
      journeyApiService.getJourneys({ status: 'published' }),
      getPublicCuisineSeries().catch(() => []),
    ]).then(([journeys, publicCuisine]) => {
      if (!active) return;
      const publicMap = new Map(publicCuisine.map(series => [series.id, toPublicJourney(series)]));
      const merged = journeys.map(journey => publicMap.get(journey.id) || journey);
      for (const [id, journey] of publicMap) {
        if (!merged.some(j => j.id === id)) {
          merged.push(journey);
        }
      }
      setAllJourneys(merged);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    setUnlockedPlaces((previous) => {
      const next = { ...previous };
      for (const series of allJourneys) {
        if (next[series.provinceId] === undefined) {
          next[series.provinceId] = readLearningValue<boolean>(
            `journey:unlocked:${series.provinceId}`,
          ) === true;
        }
      }
      return next;
    });
  }, [allJourneys]);

  const upcomingSeries = useMemo(() => {
    const dynamicUpcoming = allJourneys
      .filter((series) => series.status === "upcoming" || series.status === "scheduled")
      .map((series) => {
        const province = VIETNAM_34_PROVINCES.find((item) => item.id === series.provinceId);
        return {
          id: series.id,
          title: isEn ? series.title : series.titleVi || series.title,
          place: province ? getLocalizedProvinceName(province.name) : isEn ? "Vietnam" : "Việt Nam",
          imageUrl: series.imageUrl,
          description: series.description,
        };
      });
    return [...dynamicUpcoming, ...staticUpcomingPreviews.filter(
      (preview) => !dynamicUpcoming.some((series) => series.id === preview.id),
    )];
  }, [allJourneys, isEn, staticUpcomingPreviews]);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [savedWordCount, setSavedWordCount] = useState(() => getAllSavedVocabularies().length);

  useEffect(() => {
    const refreshSavedWords = () => setSavedWordCount(getAllSavedVocabularies().length);
    window.addEventListener("vie_vocab_updated", refreshSavedWords);
    window.addEventListener("storage", refreshSavedWords);
    window.addEventListener("focus", refreshSavedWords);
    return () => {
      window.removeEventListener("vie_vocab_updated", refreshSavedWords);
      window.removeEventListener("storage", refreshSavedWords);
      window.removeEventListener("focus", refreshSavedWords);
    };
  }, []);

  // Floating Chapter Popover State
  const [hoverPopover, setHoverPopover] = useState<HoverPopoverState | null>(
    null,
  );
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seriesTriggerRef = useRef<HTMLElement | null>(null);
  const [selectedChapter, setSelectedChapter] =
    useState<SelectedChapter | null>(null);
  const skillDialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const panel = mapPanelRef.current;
    if (!panel) return;

    const updateHeight = () =>
      setMapPanelHeight(panel.getBoundingClientRect().height);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const updateVisibility = () => setPageVisible(!document.hidden);
    const updateMotionPreference = () =>
      setReduceMotion(motionPreference.matches);
    document.addEventListener("visibilitychange", updateVisibility);
    motionPreference.addEventListener("change", updateMotionPreference);
    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
      motionPreference.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    const dialog = skillDialogRef.current;
    if (!dialog) return;
    if (selectedChapter && !dialog.open) dialog.showModal();
    if (!selectedChapter && dialog.open) dialog.close();
  }, [selectedChapter]);

  useEffect(() => {
    if (hoverPopover?.pinned)
      document
        .querySelector<HTMLButtonElement>(".journey-hover-chapter-link")
        ?.focus();
  }, [hoverPopover?.pinned, hoverPopover?.series.id]);

  const availableSeries = allJourneys.filter((series) =>
    (!series.status || series.status === "published") &&
    VIETNAM_34_PROVINCES.some(
      (province) =>
        province.id === series.provinceId && province.region === firstRegion,
    ),
  );

  // Library Pagination State (6 series per page)
  const [availablePage, setAvailablePage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const availableLibraryRef = useRef<HTMLDivElement>(null);
  const upcomingLibraryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAvailablePage(1);
  }, [firstRegion, selectedProvince]);

  const totalAvailablePages = Math.max(
    1,
    Math.ceil(availableSeries.length / SERIES_PAGE_SIZE),
  );
  const safeAvailablePage = Math.min(availablePage, totalAvailablePages);
  const pagedAvailableSeries = useMemo(() => {
    const startIndex = (safeAvailablePage - 1) * SERIES_PAGE_SIZE;
    return availableSeries.slice(startIndex, startIndex + SERIES_PAGE_SIZE);
  }, [availableSeries, safeAvailablePage]);

  const totalUpcomingPages = Math.max(
    1,
    Math.ceil(upcomingSeries.length / SERIES_PAGE_SIZE),
  );
  const safeUpcomingPage = Math.min(upcomingPage, totalUpcomingPages);
  const pagedUpcomingSeries = useMemo(() => {
    const startIndex = (safeUpcomingPage - 1) * SERIES_PAGE_SIZE;
    return upcomingSeries.slice(startIndex, startIndex + SERIES_PAGE_SIZE);
  }, [upcomingSeries, safeUpcomingPage]);

  const handleAvailablePageChange = (page: number) => {
    setAvailablePage(page);
    availableLibraryRef.current?.scrollIntoView({
      behavior: reduceMotion ? "instant" : "smooth",
      block: "nearest",
    });
  };

  const handleUpcomingPageChange = (page: number) => {
    setUpcomingPage(page);
    upcomingLibraryRef.current?.scrollIntoView({
      behavior: reduceMotion ? "instant" : "smooth",
      block: "nearest",
    });
  };

  // Nominated Series Slider State
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const hasOwnSeries = selectedProvince
    ? availableSeries.some((s) => s.provinceId === selectedProvince.id)
    : true;

  const nominatedSlides = useMemo(() => {
    if (selectedProvince && hasOwnSeries) {
      return availableSeries.filter((s) => s.provinceId === selectedProvince.id);
    }
    if (firstRegion !== "north")
      return availableSeries.filter((s) => s.region === firstRegion);
    // Default regional nominated series for Northern Vietnam:
    const northernSeries = availableSeries.filter(
      (s) =>
        s.region === "north" ||
        ["ha-noi", "hung-yen", "ninh-binh"].includes(s.provinceId),
    );
    const preferredOrder = [
      "pho",
      "banh-cay-thai-binh",
      "cha-ca-la-vong",
      "bun-cha",
      "com-chay-ninh-binh",
      "ca-kho-vu-dai",
    ];
    return [...northernSeries].sort((a, b) => {
      const idxA = preferredOrder.indexOf(a.id);
      const idxB = preferredOrder.indexOf(b.id);
      return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
    });
  }, [selectedProvince, hasOwnSeries, firstRegion, availableSeries]);

  useEffect(() => {
    setActiveSlideIndex(0);
    setCarouselFocused(false);
    setCarouselHovered(false);
  }, [selectedPlace, selectedRegion]);

  useEffect(() => {
    if (
      nominatedSlides.length <= 1 ||
      carouselHovered ||
      carouselFocused ||
      !pageVisible ||
      reduceMotion
    )
      return;
    const timeout = window.setTimeout(() => {
      setActiveSlideIndex((index) => (index + 1) % nominatedSlides.length);
    }, 3000);
    return () => window.clearTimeout(timeout);
  }, [
    activeSlideIndex,
    nominatedSlides.length,
    carouselHovered,
    carouselFocused,
    pageVisible,
    reduceMotion,
  ]);

  const currentSlide = nominatedSlides[activeSlideIndex] || nominatedSlides[0];

  function handlePrevSlide() {
    setActiveSlideIndex(
      (prev) => (prev - 1 + nominatedSlides.length) % nominatedSlides.length,
    );
  }

  function handleNextSlide() {
    setActiveSlideIndex((prev) => (prev + 1) % nominatedSlides.length);
  }

  function handleCardKeyDown(e: React.KeyboardEvent) {
    if (nominatedSlides.length <= 1) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNextSlide();
    }
  }

  function selectRegion(nextRegion: RegionKey) {
    if (nextRegion !== "all" && nextRegion !== "north") return;
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      next.delete("place");
      if (nextRegion === "all") {
        next.delete("region");
      } else {
        next.set("region", nextRegion);
      }
      return next;
    });
  }

  function selectPlace(id: string) {
    const province = VIETNAM_34_PROVINCES.find(
      (item) => item.id === id && item.region === "north",
    );
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (province) {
        next.set("region", "north");
        next.set("place", province.id);
      } else {
        next.delete("place");
      }
      return next;
    });
  }

  function unlockPlace(provinceId: string) {
    setUnlockedPlaces((previous) => ({ ...previous, [provinceId]: true }));
    writeLearningValue(`journey:unlocked:${provinceId}`, true);
  }

  function clearHideTimeout() {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }

  function calculatePopoverPosition(clientX: number, clientY: number) {
    const popoverWidth = 360;
    const popoverHeight = 290;
    const margin = 16;
    const offset = 14;

    let x = clientX + offset;
    if (x + popoverWidth > window.innerWidth - margin) {
      x = Math.max(margin, clientX - popoverWidth - offset);
    }

    let y = clientY - 40;
    if (y + popoverHeight > window.innerHeight - margin) {
      y = Math.max(margin, window.innerHeight - popoverHeight - margin);
    }
    if (y < margin) {
      y = margin;
    }

    return { x, y };
  }

  function handleSeriesMouseEnter(series: JourneySeries, e: React.MouseEvent) {
    clearHideTimeout();
    const { x, y } = calculatePopoverPosition(e.clientX, e.clientY);
    setHoverPopover((current) =>
      current?.pinned ? current : { series, x, y },
    );
  }

  function handleSeriesMouseMove(series: JourneySeries, e: React.MouseEvent) {
    clearHideTimeout();
    setHoverPopover((current) => {
      if (current?.pinned || (current && current.series.id === series.id)) {
        return current;
      }
      const { x, y } = calculatePopoverPosition(e.clientX, e.clientY);
      return { series, x, y };
    });
  }

  function handleSeriesMouseLeave() {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      setHoverPopover((current) => (current?.pinned ? current : null));
    }, 280);
  }

  function handlePopoverMouseEnter() {
    clearHideTimeout();
  }

  function handlePopoverMouseLeave() {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      setHoverPopover((current) => (current?.pinned ? current : null));
    }, 180);
  }

  function openSeriesChapters(series: JourneySeries, element: HTMLElement) {
    clearHideTimeout();
    seriesTriggerRef.current = element;
    const rect = element.getBoundingClientRect();
    const { x, y } = calculatePopoverPosition(rect.right, rect.top + 40);
    setHoverPopover({ series, x, y, pinned: true });
  }

  function closeSeriesChapters() {
    const wasPinned = hoverPopover?.pinned;
    setHoverPopover(null);
    if (wasPinned) seriesTriggerRef.current?.focus();
  }

  function chooseChapter(
    chapter: JourneySeries["chapters"][number],
    series: JourneySeries,
  ) {
    clearHideTimeout();
    setHoverPopover(null);
    setSelectedChapter({
      id: chapter.id,
      title: chapter.title,
      seriesTitle: series.title,
      level: chapter.preferredLevel || 'Level 2',
    });
  }

  function renderNominatedSeriesCard(
    series: JourneySeries,
    isUnlocked: boolean,
  ) {
    const province = VIETNAM_34_PROVINCES.find(
      (item) => item.id === series.provinceId,
    );
    const placeName = province
      ? getLocalizedProvinceName(province.name)
      : isEn
        ? "Hanoi"
        : "Hà Nội";
    const firstChapter = series.chapters[0];

    return (
      <article
        className={`journey-spotlight-card ${isUnlocked ? "is-unlocked" : "is-locked"}`}
      >
        <div className="journey-spotlight-image">
          {series.imageUrl && !failedImages[series.id] ? (
            <img
              src={series.imageUrl}
              alt={series.title}
              loading="lazy"
              onError={() =>
                setFailedImages((previous) => ({
                  ...previous,
                  [series.id]: true,
                }))
              }
            />
          ) : (
            <BookOpen size={40} aria-hidden="true" />
          )}
          <span className="journey-spotlight-badge">
            <MapPin size={13} aria-hidden="true" />
            {t("journey.featured_series").toUpperCase()}
          </span>
        </div>
        <div className="journey-spotlight-content">
          <span className="discovery-category">
            {placeName} ·{" "}
            {t("journey.stories_in_region", {
              count: series.chapters.length,
              defaultValue: `${series.chapters.length} câu chuyện`,
            })}{" "}
            · B1
          </span>
          <h3>{series.title}</h3>
          <p>{series.description}</p>
          <div className="journey-spotlight-footer">
            {isUnlocked ? (
              <button
                type="button"
                onClick={() =>
                  firstChapter && chooseChapter(firstChapter, series)
                }
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
                onClick={() => unlockPlace(series.provinceId)}
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

  function renderSeriesCard(series: JourneySeries) {
    const province = VIETNAM_34_PROVINCES.find(
      (item) => item.id === series.provinceId,
    );
    const placeName = province
      ? getLocalizedProvinceName(province.name)
      : isEn
        ? "Vietnam"
        : "Việt Nam";

    return (
      <li
        key={series.id}
        onMouseEnter={(e) => handleSeriesMouseEnter(series, e)}
        onMouseMove={(e) => handleSeriesMouseMove(series, e)}
        onMouseLeave={handleSeriesMouseLeave}
      >
        <button
          type="button"
          className="journey-series-tile"
          aria-expanded={
            hoverPopover?.series.id === series.id && !!hoverPopover.pinned
          }
          aria-controls="journey-chapter-list"
          onClick={(event) => openSeriesChapters(series, event.currentTarget)}
        >
          <div className="journey-series-image">
            {series.imageUrl && !failedImages[series.id] ? (
              <img
                src={series.imageUrl}
                alt=""
                loading="lazy"
                onError={() =>
                  setFailedImages((previous) => ({
                    ...previous,
                    [series.id]: true,
                  }))
                }
              />
            ) : (
              <BookOpen size={32} aria-hidden="true" />
            )}
          </div>
          <div className="journey-series-copy">
            <span className="discovery-category">
              {placeName} ·{" "}
              {t("journey.stories_in_region", {
                count: series.chapters.length,
                defaultValue: `${series.chapters.length} câu chuyện`,
              })}
            </span>
            <h4>{isEn ? series.title : (series.titleVi || series.title)}</h4>
            <p>{series.description}</p>
            <span className="journey-series-footer">
              {t("journey.explore_chapters")}{" "}
              <ArrowRight size={18} aria-hidden="true" />
            </span>
          </div>
        </button>
      </li>
    );
  }

  return (
    <div className="journey-page">
      <header className="journey-hero">
        <div className="journey-hero-content">
          <h1>{t("journey.title")}</h1>
          <p>{t("journey.lead")}</p>
        </div>
      </header>

      <div
        className="journey-layout"
        style={
          {
            "--journey-panel-height":
              mapPanelHeight === null ? "auto" : `${mapPanelHeight}px`,
          } as CSSProperties
        }
      >
        <section
          ref={mapPanelRef}
          className="journey-map-panel"
          aria-label={t("journey.title")}
        >
          <div className="journey-map-heading">
            <div>
              {region && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => selectRegion("all")}
                >
                  <ArrowLeft size={17} /> {t("journey.all_regions")}
                </Button>
              )}
              <span>
                {region
                  ? `${region.number} / ${getRegionName(region).toUpperCase()}`
                  : t("journey.explore_three_regions")}
              </span>
            </div>
            <strong>
              {region ? t("journey.choose_place") : t("journey.choose_region")}
            </strong>
          </div>
          <div
            className="journey-map"
            data-map-level={region ? "provinces" : "regions"}
          >
            <VietnamMap
              activeRegion={selectedRegion}
              customViewBox={selectedRegion === "all" ? "100 30 790 920" : undefined}
              fillSeaBackground={selectedRegion === "all"}
              overviewByRegion={!region}
              selectableRegions={["north"]}
              labelLanguage={isEn ? "en" : "vi"}
              selectedProvinceId={selectedPlace || null}
              onSelectRegion={selectRegion}
              onSelectProvince={(province) => {
                if (province) selectPlace(province.id);
              }}
              showRegionTabs={false}
              showPoiPins={false}
              showTooltip={false}
              showLabels={!!region}
              showControls={!!region}
            />
          </div>
          {selectedProvince && (
            <div className="journey-selected-place">
              <MapPin size={18} />
              <span>{getLocalizedProvinceName(selectedProvince.name)}</span>
              <button type="button" onClick={() => selectPlace("")}>
                {t("journey.clear_place")}
              </button>
            </div>
          )}
        </section>

        <aside
          className={`journey-rail ${region ? "journey-rail--featured" : "journey-rail--regions"}`}
          aria-label={t(region ? "journey.featured_series" : "journey.explore_vietnam")}
          aria-live={region ? "off" : "polite"}
          onFocus={() => setCarouselFocused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setCarouselFocused(false);
          }}
        >
          {!region ? (
            <>
              <h2>{t("journey.explore_vietnam")}</h2>
              <p className="journey-rail-intro">
                {t("journey.choose_first_intro")}
              </p>
              <div className="journey-region-list">
                {REGIONS.map((item) => {
                  const isOpen = item.id === "north";
                  const regionName = getRegionName(item);
                  const stepContent = (
                    <>
                      <span className="journey-region-number">
                        {item.number}
                      </span>
                      <img className="journey-region-photo" src={item.image} alt="" loading="lazy" />
                      <span className="journey-region-copy">
                        <strong>{regionName}</strong>
                        <small className="journey-region-status">
                          {isOpen ? (
                            <BookOpen size={14} aria-hidden="true" />
                          ) : (
                            <LockKeyhole size={14} aria-hidden="true" />
                          )}
                          {isOpen
                            ? t("journey.your_first_region")
                            : t("journey.locked")}
                        </small>
                        {item.id === "north" && (
                          <small className="journey-region-recommended">
                            {t("journey.recommended")}
                          </small>
                        )}
                        <span className="journey-region-description">{t(item.descriptionKey)}</span>
                      </span>
                      {isOpen && (
                        <ArrowRight
                          className="journey-region-arrow"
                          size={18}
                          aria-hidden="true"
                        />
                      )}
                    </>
                  );
                  return isOpen ? (
                    <button
                      key={item.id}
                      type="button"
                      className={`journey-region-step journey-region-step--open ${selectedRegion === item.id ? "is-selected" : ""}`}
                      aria-pressed={selectedRegion === item.id}
                      onClick={() => selectRegion(item.id)}
                    >
                      {stepContent}
                    </button>
                  ) : (
                    <div
                      key={item.id}
                      className="journey-region-step journey-region-step--locked"
                      aria-label={`${regionName}, ${t("journey.locked")}`}
                    >
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
          ) : (
            <>
              <div className="journey-rail-header">
                <div className="journey-rail-title-group">
                  <span className="journey-eyebrow">
                    {selectedProvince
                      ? getLocalizedProvinceName(
                          selectedProvince.name,
                        ).toUpperCase()
                      : getRegionName(region).toUpperCase()}
                  </span>
                  <h2>{t("journey.featured_series")}</h2>
                </div>
                {nominatedSlides.length > 1 && (
                  <div
                    className="journey-slider-controls"
                    aria-label={t("journey.featured_series")}
                  >
                    <button
                      type="button"
                      className="journey-slider-arrow"
                      onClick={handlePrevSlide}
                      aria-label={t("journey.previous_series")}
                    >
                      <ChevronLeft size={18} aria-hidden="true" />
                    </button>
                    <span className="journey-slider-counter">
                      {t("journey.series_counter", {
                        current: activeSlideIndex + 1,
                        total: nominatedSlides.length,
                      })}
                    </span>
                    <button
                      type="button"
                      className="journey-slider-arrow"
                      onClick={handleNextSlide}
                      aria-label={t("journey.next_series")}
                    >
                      <ChevronRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>

              {selectedProvince && !hasOwnSeries && (
                <div className="journey-place-notice" role="status">
                  <Compass
                    size={14}
                    className="journey-place-notice-icon"
                    aria-hidden="true"
                  />
                  <span>
                    {t("journey.no_dedicated_series", {
                      placeName: getLocalizedProvinceName(
                        selectedProvince.name,
                      ),
                    })}
                    {firstRegion === "north"
                      ? t("journey.showing_featured_north")
                      : ""}
                  </span>
                </div>
              )}

              {!currentSlide && (
                <div className="journey-empty-region" role="status">
                  <p>
                    {t("journey.stories_on_the_way", {
                      regionName: getRegionName(region),
                    })}
                  </p>
                </div>
              )}

              {currentSlide && (
                <div
                  tabIndex={0}
                  onKeyDown={handleCardKeyDown}
                  aria-label={`${t("journey.featured_series")}: ${currentSlide.title}`}
                  className="journey-spotlight-slider-wrapper"
                  onMouseEnter={() => setCarouselHovered(true)}
                  onMouseLeave={() => setCarouselHovered(false)}
                >
                  {renderNominatedSeriesCard(
                    currentSlide,
                    !!unlockedPlaces[currentSlide.provinceId],
                  )}

                  {nominatedSlides.length > 1 && (
                    <div
                      className="journey-slider-dots"
                      role="group"
                      aria-label={t("journey.featured_series")}
                    >
                      {nominatedSlides.map((s, idx) => (
                        <button
                          key={s.id}
                          type="button"
                          aria-label={`${idx + 1}: ${s.title}`}
                          aria-current={
                            idx === activeSlideIndex ? "true" : undefined
                          }
                          className={`journey-slider-dot ${idx === activeSlideIndex ? "is-active" : ""}`}
                          onClick={() => setActiveSlideIndex(idx)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </aside>
      </div>

      <section
        className="journey-library"
        aria-label={t("journey.available_series")}
      >
        <div
          ref={availableLibraryRef}
          className="journey-library-group"
          id="journey-available-series"
        >
          <div className="journey-library-section-heading">
            <h2>{t("journey.available_series")}</h2>
            <span>
              {t("journey.series_count", { count: availableSeries.length })}
            </span>
          </div>
          <ul className="journey-series-grid">
            {pagedAvailableSeries.map(renderSeriesCard)}
          </ul>
          {availableSeries.length === 0 && (
            <div className="journey-empty-region">
              <p>
                {firstRegion
                  ? t("journey.no_published_series")
                  : t("journey.choose_first_to_see")}
              </p>
            </div>
          )}
          <DiscoveryPagination
            currentPage={safeAvailablePage}
            totalPages={totalAvailablePages}
            totalItems={availableSeries.length}
            itemsPerPage={SERIES_PAGE_SIZE}
            onPageChange={handleAvailablePageChange}
            ariaLabel={t("journey.pagination_available_aria", {
              defaultValue: isEn
                ? "Available series pagination"
                : "Phân trang chuỗi bài hiện có",
            })}
            itemLabel={isEn ? "series" : "chuỗi bài"}
            showSinglePage={true}
          />
        </div>
        {upcomingSeries.length > 0 && <div
          ref={upcomingLibraryRef}
          className="journey-library-group"
          id="journey-upcoming-series"
        >
          <div className="journey-library-section-heading">
            <h2>{t("journey.upcoming_series")}</h2>
            <span>
              {t("journey.series_count", { count: upcomingSeries.length })}
            </span>
          </div>
          <ul className="journey-series-grid">
            {pagedUpcomingSeries.map((series) => (
              <li key={series.id}>
                <article className="journey-series-tile is-locked is-upcoming">
                  <div className="journey-series-image">
                    {series.imageUrl && !failedImages[series.id] ? (
                      <img
                        src={series.imageUrl}
                        alt=""
                        loading="lazy"
                        onError={() =>
                          setFailedImages((previous) => ({
                            ...previous,
                            [series.id]: true,
                          }))
                        }
                      />
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
                      {t("journey.coming_soon")}{" "}
                      <LockKeyhole size={17} aria-hidden="true" />
                    </span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
          <DiscoveryPagination
            currentPage={safeUpcomingPage}
            totalPages={totalUpcomingPages}
            totalItems={upcomingSeries.length}
            itemsPerPage={SERIES_PAGE_SIZE}
            onPageChange={handleUpcomingPageChange}
            ariaLabel={t("journey.pagination_upcoming_aria", {
              defaultValue: isEn
                ? "Upcoming series pagination"
                : "Phân trang chuỗi bài sắp ra mắt",
            })}
            itemLabel={isEn ? "upcoming series" : "chuỗi bài sắp ra mắt"}
            showSinglePage={true}
          />
        </div>}
      </section>

      {/* Floating chapter popover for hovered series */}
      {hoverPopover && (
        <div
          id="journey-chapter-list"
          className="journey-hover-popover"
          style={{
            left: `${hoverPopover.x}px`,
            top: `${hoverPopover.y}px`,
          }}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
          onKeyDown={(event) => {
            if (event.key === "Escape") closeSeriesChapters();
          }}
          role="region"
          aria-label={`${t("journey.explore_chapters")}: ${hoverPopover.series.title}`}
        >
          <div className="journey-hover-popover-header">
            <div>
              <span className="journey-hover-popover-tag">
                {getLocalizedProvinceName(
                  VIETNAM_34_PROVINCES.find(
                    (p) => p.id === hoverPopover.series.provinceId,
                  )?.name || (isEn ? "Hanoi" : "Hà Nội"),
                )}{" "}
                ·{" "}
                {t("journey.chapters_count", {
                  count: hoverPopover.series.chapters.length,
                })}
              </span>
              <h4>{isEn ? hoverPopover.series.title : (hoverPopover.series.titleVi || hoverPopover.series.title)}</h4>
            </div>
            <button
              type="button"
              className="journey-hover-close"
              aria-label={t("journey.close_chapter_list")}
              onClick={closeSeriesChapters}
            >
              <X size={16} />
            </button>
          </div>

          <ul className="journey-hover-chapter-list">
            {hoverPopover.series.chapters.length > 0 ? (
              hoverPopover.series.chapters.map((chapter) => (
              <li key={chapter.id}>
                <button
                  type="button"
                  className="journey-hover-chapter-link"
                  onClick={() => chooseChapter(chapter, hoverPopover.series)}
                >
                  <span className="journey-hover-chapter-num">
                    {String(chapter.order).padStart(2, "0")}
                  </span>
                  <div className="journey-hover-chapter-info">
                    <strong>{isEn ? (chapter.title || chapter.titleVi) : (chapter.titleVi || chapter.title)}</strong>
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
                {t('journey.stories_on_the_way', { regionName: getLocalizedProvinceName(VIETNAM_34_PROVINCES.find(p => p.id === hoverPopover.series.provinceId)?.name || 'Việt Nam') })}
              </li>
            )}
          </ul>
        </div>
      )}

      <dialog
        ref={skillDialogRef}
        className="journey-skill-dialog"
        aria-labelledby="journey-skill-title"
        onClose={() => setSelectedChapter(null)}
      >
        {selectedChapter && (
          <>
            <div className="journey-skill-header">
              <div>
                <span className="journey-eyebrow">
                  {selectedChapter.seriesTitle}
                </span>
                <h2 id="journey-skill-title">{selectedChapter.title}</h2>
                <p>{t("journey.dialog_question")}</p>
              </div>
              <button
                type="button"
                className="journey-skill-close"
                aria-label={t("journey.dialog_close")}
                onClick={() => setSelectedChapter(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="journey-skill-options">
              <Link
                to={paths.reader({
                  story: selectedChapter.id,
                  level: selectedChapter.level,
                })}
              >
                <BookOpen size={24} aria-hidden="true" />
                <span>
                  <strong>{t("journey.skill_reading_title")}</strong>
                  <small>{t("journey.skill_reading_desc")}</small>
                </span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                to={paths.reader({
                  story: selectedChapter.id,
                  level: selectedChapter.level,
                  mode: "practice",
                  practice: "dictation",
                })}
              >
                <Headphones size={24} aria-hidden="true" />
                <span>
                  <strong>{t("journey.skill_listening_title")}</strong>
                  <small>{t("journey.skill_listening_desc")}</small>
                </span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <div
                className="journey-skill-speaking"
                aria-label={t("journey.skill_speaking_heading")}
              >
                <h3>{t("journey.skill_speaking_heading")}</h3>
                <p>{t("journey.skill_speaking_prompt")}</p>
                <Link
                  to={paths.reader({
                    story: selectedChapter.id,
                    level: selectedChapter.level,
                    mode: "practice",
                    practice: "shadowing",
                  })}
                >
                  <Mic2 size={24} aria-hidden="true" />
                  <span>
                    <strong>{t("journey.skill_shadowing_title")}</strong>
                    <small>{t("journey.skill_shadowing_desc")}</small>
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link
                  to={paths.aiWorkspace({
                    story: selectedChapter.id,
                    level: selectedChapter.level,
                  })}
                >
                  <Bot size={24} aria-hidden="true" />
                  <span>
                    <strong>{t("journey.skill_ai_title")}</strong>
                    <small>{t("journey.skill_ai_desc")}</small>
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
