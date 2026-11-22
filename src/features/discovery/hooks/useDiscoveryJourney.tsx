import { useTranslation } from "react-i18next";
import { useEffect, useLayoutEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { VIETNAM_34_PROVINCES } from "@/data/vietnamMapData";
import { toEnglishPlaceName } from "@/utils/vietnamMapUtils";
import type { RegionKey } from "@/utils/useVietnamMap";
import { getAllSavedVocabularies } from "@/services/learning/learningStorage";
import type { FirstRegion } from "@/services/learning/firstRegionChoice";
import { type JourneySeries } from "../data/learningJourney";
import { useJourneyArticles } from "../hooks/useJourneyArticles";
import { useJourneySeries } from "../hooks/useJourneySeries";
import { useJourneyPopover } from "../hooks/useJourneyPopover";
import { useJourneySpotlight } from "../hooks/useJourneySpotlight";
import { type JourneyChapterSelection } from "../components/journey/JourneyChapterPopover";
import { JourneySeriesCard } from "../components/journey/JourneySeriesCard";
import { JourneySpotlightCard } from "../components/journey/JourneySpotlightCard";
import { JOURNEY_REGIONS } from "../components/journey/regions";

export function useDiscoveryJourney() {
  const { t, i18n } = useTranslation("discovery");
  const isEn = i18n.language === "en";
  const mapPanelRef = useRef<HTMLElement>(null);
  const [mapPanelHeight, setMapPanelHeight] = useState<number | null>(null);
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
  const region = JOURNEY_REGIONS.find((item) => item.id === selectedRegion);

  const getRegionName = (item: (typeof JOURNEY_REGIONS)[number]) =>
    t(item.nameKey, item.fallbackName);

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

  const {
    popover: hoverPopover,
    setPopover: setHoverPopover,
    popoverRef,
    togglePopover: toggleSeriesChapters,
    closePopover: closeSeriesChapters,
  } = useJourneyPopover();
  const [selectedChapter, setSelectedChapter] =
    useState<JourneyChapterSelection | null>(null);
  const skillDialogRef = useRef<HTMLDialogElement>(null);

  const {
    unlockedPlaces,
    upcomingSeries,
    availableSeries,
    isJourneysLoading,
    availableLibraryRef,
    upcomingLibraryRef,
    totalAvailablePages,
    totalAvailableCount,
    safeAvailablePage,
    pagedAvailableSeries,
    totalUpcomingPages,
    safeUpcomingPage,
    pagedUpcomingSeries,
    handleAvailablePageChange,
    handleUpcomingPageChange,
    unlockPlace,
  } = useJourneySeries({
    firstRegion,
    selectedProvince,
    isEn,
    getLocalizedProvinceName,
    reduceMotion,
    closeSeriesChapters: () => closeSeriesChapters(),
  });

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



  // Top journey series keys to exclude from "Other Readings" section below (avoid duplicate articles shown on top roadmap)
  const topJourneyKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const s of availableSeries) {
      if (s.id) keys.add(s.id.toLowerCase().trim());
      for (const c of s.chapters || []) {
        if (c.id) keys.add(c.id.toLowerCase().trim());
      }
    }
    return keys;
  }, [availableSeries]);

  const {
    articlesPageSize,
    setArticlesPageSize,
    searchQuery,
    setSearchQuery,
    selectedTopic,
    setSelectedTopic,
    selectedCefr,
    setSelectedCefr,
    articlesLibraryRef,
    isArticlesLoading,
    articlesError,
    setArticlesRetryTrigger,
    bookmarks,
    toggleBookmark,
    totalArticlesItems,
    totalArticlesPages,
    safeArticlesPage,
    pagedArticles,
    handleArticlesPageChange,
  } = useJourneyArticles({ isEn, selectedProvince, topJourneyKeys, reduceMotion });

  const {
    activeSlideIndex,
    setActiveSlideIndex,
    setCarouselHovered,
    setCarouselFocused,
    hasOwnSeries,
    nominatedSlides,
    currentSlide,
    handlePreviousSlide: handlePrevSlide,
    handleNextSlide,
    handleCardKeyDown,
  } = useJourneySpotlight({
    availableSeries,
    selectedProvince,
    firstRegion,
    selectedRegion,
    pageVisible,
    reduceMotion,
  });

  function selectRegion(nextRegion: RegionKey) {
    if (nextRegion !== "all" && nextRegion !== "north") return;
    closeSeriesChapters();
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
    closeSeriesChapters();
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



  function chooseChapter(
    chapter: JourneySeries["chapters"][number],
    series: JourneySeries,
  ) {
    setHoverPopover(null);
    setSelectedChapter({
      id: chapter.id,
      title: chapter.title,
      seriesTitle: series.title,
      level: chapter.preferredLevel || 'Level 2',
    });
  }

  function renderNominatedSeriesCard(series: JourneySeries, isUnlocked: boolean) {
    return (
      <JourneySpotlightCard
        series={series}
        isUnlocked={isUnlocked}
        isEn={isEn}
        failedImage={!!failedImages[series.id]}
        getLocalizedProvinceName={getLocalizedProvinceName}
        onImageError={() => setFailedImages((previous) => ({ ...previous, [series.id]: true }))}
        onStartReading={chooseChapter}
        onUnlock={unlockPlace}
      />
    );
  }

  function renderSeriesCard(series: JourneySeries) {
    return (
      <JourneySeriesCard
        key={series.id}
        series={series}
        isEn={isEn}
        isSelected={hoverPopover?.series.id === series.id}
        failedImage={!!failedImages[series.id]}
        getLocalizedProvinceName={getLocalizedProvinceName}
        onImageError={() => setFailedImages((previous) => ({ ...previous, [series.id]: true }))}
        onClick={(element) => toggleSeriesChapters(series, element)}
      />
    );
  }

  return {
    t, isEn, mapPanelRef, mapPanelHeight, selectedRegion, region, getRegionName,
    selectedProvince, getLocalizedProvinceName, selectRegion, selectPlace,
    savedWordCount, nominatedSlides, currentSlide, activeSlideIndex, hasOwnSeries,
    unlockedPlaces, renderNominatedSeriesCard, setActiveSlideIndex, handlePrevSlide,
    handleNextSlide, handleCardKeyDown, setCarouselHovered, setCarouselFocused,
    availableLibraryRef, upcomingLibraryRef, pagedAvailableSeries, pagedUpcomingSeries,
    upcomingSeries, isJourneysLoading, totalAvailableCount, safeAvailablePage,
    totalAvailablePages, safeUpcomingPage, totalUpcomingPages, renderSeriesCard,
    handleAvailablePageChange, handleUpcomingPageChange, failedImages, setFailedImages,
    articlesLibraryRef, totalArticlesItems, searchQuery, setSearchQuery,
    articlesPageSize, setArticlesPageSize, selectedTopic, setSelectedTopic,
    selectedCefr, setSelectedCefr, isArticlesLoading, pagedArticles, bookmarks,
    toggleBookmark, articlesError, setArticlesRetryTrigger, safeArticlesPage,
    totalArticlesPages, handleArticlesPageChange, setParams, hoverPopover, popoverRef,
    closeSeriesChapters, chooseChapter, skillDialogRef, selectedChapter,
    setSelectedChapter,
  };
}
