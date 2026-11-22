import { useEffect, useMemo, useRef, useState } from "react";
import { VIETNAM_34_PROVINCES } from "@/data/vietnamMapData";
import type { RegionKey } from "@/utils/useVietnamMap";
import {
  readLearningValue,
  writeLearningValue,
} from "@/services/learning/learningStorage";
import { JOURNEY_SERIES, type JourneySeries } from "../data/learningJourney";
import { journeyApiService } from "../services/journeyApiService";
import {
  getPublicCuisineSeries,
  toPublicJourney,
} from "@/features/reader/services/publicCuisineService";

const SERIES_PAGE_SIZE = 6;

type SelectedProvince = (typeof VIETNAM_34_PROVINCES)[number] | undefined;

interface UseJourneySeriesOptions {
  firstRegion: RegionKey;
  selectedProvince: SelectedProvince;
  isEn: boolean;
  getLocalizedProvinceName: (name: string) => string;
  reduceMotion: boolean;
  closeSeriesChapters: () => void;
}

export function useJourneySeries({
  firstRegion,
  selectedProvince,
  isEn,
  getLocalizedProvinceName,
  reduceMotion,
  closeSeriesChapters,
}: UseJourneySeriesOptions) {
  const [unlockedPlaces, setUnlockedPlaces] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        JOURNEY_SERIES.map((series) => [
          series.provinceId,
          readLearningValue<boolean>(`journey:unlocked:${series.provinceId}`) === true,
        ]),
      ),
  );
  const [allJourneys, setAllJourneys] = useState<JourneySeries[]>(JOURNEY_SERIES);

  useEffect(() => {
    let active = true;
    Promise.all([
      journeyApiService.getJourneys(),
      getPublicCuisineSeries().catch(() => []),
    ]).then(([backendJourneys, publicCuisine]) => {
      if (!active) return;
      const backendMap = new Map((backendJourneys || []).map((journey) => [journey.id, journey]));
      const publicMap = new Map(publicCuisine.map((series) => [series.id, toPublicJourney(series)]));
      const merged: JourneySeries[] = [];
      const handledIds = new Set<string>();

      for (const [id, dbJourney] of backendMap) {
        handledIds.add(id);
        if (dbJourney.status === "draft" || dbJourney.status === "archived") continue;
        const mock = publicMap.get(id);
        if (mock && (!dbJourney.chapters || dbJourney.chapters.length === 0)) {
          merged.push({
            ...mock,
            ...dbJourney,
            descriptionVi: dbJourney.descriptionVi || mock.descriptionVi,
            chapters: mock.chapters,
          });
        } else {
          merged.push({
            ...dbJourney,
            descriptionVi: dbJourney.descriptionVi || mock?.descriptionVi,
          });
        }
      }

      for (const [id, mockJourney] of publicMap) {
        if (
          !handledIds.has(id) &&
          mockJourney.status !== "draft" &&
          mockJourney.status !== "archived"
        ) {
          merged.push(mockJourney);
        }
      }
      setAllJourneys(merged);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setUnlockedPlaces((previous) => {
      const next = { ...previous };
      for (const series of allJourneys) {
        if (next[series.provinceId] === undefined) {
          next[series.provinceId] =
            readLearningValue<boolean>(`journey:unlocked:${series.provinceId}`) === true;
        }
      }
      return next;
    });
  }, [allJourneys]);

  const staticUpcomingPreviews: Array<{
    id: string;
    title: string;
    place: string;
    imageUrl: string;
    description: string;
  }> = [];

  const upcomingSeries = useMemo(() => {
    const dynamicUpcoming = allJourneys
      .filter((series) => series.status === "upcoming" || series.status === "scheduled")
      .map((series) => {
        const province = VIETNAM_34_PROVINCES.find((item) => item.id === series.provinceId);
        return {
          id: series.id,
          title: isEn ? series.title : series.titleVi || series.title,
          place: province
            ? getLocalizedProvinceName(province.name)
            : isEn
              ? "Vietnam"
              : "Việt Nam",
          imageUrl: series.imageUrl,
          description: isEn ? series.description : series.descriptionVi || series.description,
        };
      });
    return [
      ...dynamicUpcoming,
      ...staticUpcomingPreviews.filter(
        (preview) => !dynamicUpcoming.some((series) => series.id === preview.id),
      ),
    ];
  }, [allJourneys, isEn, getLocalizedProvinceName, staticUpcomingPreviews]);

  const availableSeries = allJourneys.filter(
    (series) =>
      (!series.status || series.status === "published") &&
      VIETNAM_34_PROVINCES.some(
        (province) => province.id === series.provinceId && province.region === firstRegion,
      ),
  );

  const [availablePage, setAvailablePage] = useState(1);
  const [serverPagedJourneys, setServerPagedJourneys] = useState<{
    items: JourneySeries[];
    totalElements: number;
    totalPages: number;
  } | null>(null);
  const [isJourneysLoading, setIsJourneysLoading] = useState(false);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const availableLibraryRef = useRef<HTMLDivElement>(null);
  const upcomingLibraryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAvailablePage(1);
  }, [firstRegion, selectedProvince]);

  useEffect(() => {
    let active = true;
    setIsJourneysLoading(true);
    journeyApiService
      .getPagedJourneys({
        page: availablePage - 1,
        size: SERIES_PAGE_SIZE,
        region: selectedProvince ? undefined : firstRegion,
        provinceId: selectedProvince ? selectedProvince.id : undefined,
        status: "published",
      })
      .then((pagedData) => {
        if (!active) return;
        if (pagedData && Array.isArray(pagedData.items)) {
          setServerPagedJourneys({
            items: pagedData.items,
            totalElements: pagedData.totalElements,
            totalPages: Math.max(1, pagedData.totalPages),
          });
        }
      })
      .catch((error) => {
        console.warn("[DiscoveryJourney] Error loading paged journeys:", error);
      })
      .finally(() => {
        if (active) setIsJourneysLoading(false);
      });
    return () => {
      active = false;
    };
  }, [availablePage, selectedProvince, firstRegion]);

  const totalAvailablePages = serverPagedJourneys
    ? serverPagedJourneys.totalPages
    : Math.max(1, Math.ceil(availableSeries.length / SERIES_PAGE_SIZE));
  const totalAvailableCount = serverPagedJourneys
    ? serverPagedJourneys.totalElements
    : availableSeries.length;
  const safeAvailablePage = Math.min(availablePage, totalAvailablePages);
  const pagedAvailableSeries = useMemo(() => {
    if (serverPagedJourneys) return serverPagedJourneys.items;
    const startIndex = (safeAvailablePage - 1) * SERIES_PAGE_SIZE;
    return availableSeries.slice(startIndex, startIndex + SERIES_PAGE_SIZE);
  }, [serverPagedJourneys, availableSeries, safeAvailablePage]);
  const totalUpcomingPages = Math.max(1, Math.ceil(upcomingSeries.length / SERIES_PAGE_SIZE));
  const safeUpcomingPage = Math.min(upcomingPage, totalUpcomingPages);
  const pagedUpcomingSeries = useMemo(() => {
    const startIndex = (safeUpcomingPage - 1) * SERIES_PAGE_SIZE;
    return upcomingSeries.slice(startIndex, startIndex + SERIES_PAGE_SIZE);
  }, [upcomingSeries, safeUpcomingPage]);

  const handleAvailablePageChange = (page: number) => {
    closeSeriesChapters();
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

  const unlockPlace = (provinceId: string) => {
    setUnlockedPlaces((previous) => ({ ...previous, [provinceId]: true }));
    writeLearningValue(`journey:unlocked:${provinceId}`, true);
  };

  return {
    unlockedPlaces,
    allJourneys,
    upcomingSeries,
    availableSeries,
    availablePage,
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
  };
}
