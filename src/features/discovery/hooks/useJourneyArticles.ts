import { useEffect, useMemo, useRef, useState } from "react";
import type { Lesson } from "@/data/discoveryData";
import { LESSONS_DATA } from "@/data/discoveryData";
import { readerApiService } from "@/features/reader/services/readerApiService";
import {
  readLearningValue,
  writeLearningValue,
} from "@/services/learning/learningStorage";
import { VIETNAM_34_PROVINCES } from "@/data/vietnamMapData";

type SelectedProvince = (typeof VIETNAM_34_PROVINCES)[number] | undefined;

interface UseJourneyArticlesOptions {
  isEn: boolean;
  selectedProvince: SelectedProvince;
  topJourneyKeys: Set<string>;
  reduceMotion: boolean;
}

export function useJourneyArticles({
  isEn,
  selectedProvince,
  topJourneyKeys,
  reduceMotion,
}: UseJourneyArticlesOptions) {
  const [articlesPage, setArticlesPage] = useState(1);
  const [articlesPageSize, setArticlesPageSize] = useState(9);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedCefr, setSelectedCefr] = useState("All");
  const articlesLibraryRef = useRef<HTMLDivElement>(null);
  const [serverCatalog, setServerCatalog] = useState<{
    items: Lesson[];
    totalElements: number;
    totalPages: number;
  } | null>(null);
  const [isArticlesLoading, setIsArticlesLoading] = useState(false);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const [articlesRetryTrigger, setArticlesRetryTrigger] = useState(0);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(() =>
    readLearningValue<Record<string, boolean>>("discovery:bookmarks") || {},
  );

  const toggleBookmark = (id: string) => {
    setBookmarks((previous) => {
      const next = { ...previous, [id]: !previous[id] };
      writeLearningValue("discovery:bookmarks", next);
      return next;
    });
  };

  useEffect(() => {
    let active = true;
    setIsArticlesLoading(true);
    setArticlesError(null);

    const isSearching = searchQuery.trim().length > 0;
    const timer = setTimeout(() => {
      readerApiService
        .getCatalog({
          page: articlesPage - 1,
          size: articlesPageSize,
          topic: selectedTopic !== "All" ? selectedTopic : undefined,
          level: selectedCefr !== "All" ? selectedCefr : undefined,
          query: searchQuery.trim() || undefined,
          region: selectedProvince?.name || undefined,
          standalone: true,
        })
        .then((catalogData) => {
          if (!active) return;
          if (catalogData && Array.isArray(catalogData.items)) {
            const mapped = catalogData.items.map(
              readerApiService.mapCatalogLessonToDiscoveryLesson,
            );
            setServerCatalog({
              items: mapped,
              totalElements: catalogData.totalElements,
              totalPages: Math.max(1, catalogData.totalPages),
            });
            setArticlesError(null);
          } else {
            setServerCatalog(null);
            if (!LESSONS_DATA || LESSONS_DATA.length === 0) {
              setArticlesError(
                isEn
                  ? "Unable to load reading stories. Please check your internet connection."
                  : "Không thể tải danh sách bài đọc. Vui lòng kiểm tra kết nối mạng.",
              );
            }
          }
        })
        .catch((err: unknown) => {
          if (!active) return;
          console.warn("Could not load catalog lessons for discovery:", err);
          setServerCatalog(null);
          if (!LESSONS_DATA || LESSONS_DATA.length === 0) {
            setArticlesError(
              isEn
                ? "Unable to load reading stories. Please check your internet connection."
                : "Không thể tải danh sách bài đọc. Vui lòng kiểm tra kết nối mạng.",
            );
          }
        })
        .finally(() => {
          if (active) setIsArticlesLoading(false);
        });
    }, isSearching ? 250 : 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [
    articlesPage,
    articlesPageSize,
    searchQuery,
    selectedTopic,
    selectedCefr,
    selectedProvince,
    articlesRetryTrigger,
    isEn,
  ]);

  useEffect(() => {
    setArticlesPage(1);
  }, [searchQuery, selectedTopic, selectedCefr, selectedProvince, articlesPageSize]);

  const fallbackStandaloneLessons = useMemo(() => {
    return LESSONS_DATA.filter((lesson) => {
      const journeyId = (
        "journeyId" in lesson ? ((lesson as { journeyId?: string }).journeyId || "") : ""
      ).toLowerCase().trim();
      if (journeyId && topJourneyKeys.has(journeyId)) return false;

      const id = (lesson.id || "").toLowerCase().trim();
      if (topJourneyKeys.has(id)) return false;
      for (const key of topJourneyKeys) {
        if (id.startsWith(key + "-") || id === key) return false;
      }
      return true;
    });
  }, [topJourneyKeys]);

  const fallbackFilteredArticles = useMemo(() => {
    let list = fallbackStandaloneLessons;

    if (selectedProvince) {
      const provinceMatches = list.filter((lesson) => lesson.provinceId === selectedProvince.id);
      if (provinceMatches.length > 0) list = provinceMatches;
    }
    if (selectedTopic !== "All") list = list.filter((lesson) => lesson.category === selectedTopic);
    if (selectedCefr !== "All") {
      list = list.filter((lesson) =>
        lesson.availableLevels
          ? lesson.availableLevels.includes(selectedCefr as "Level 1" | "Level 2" | "Level 3")
          : true,
      );
    }
    if (searchQuery.trim()) {
      const query = searchQuery
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/gi, "d")
        .toLowerCase()
        .trim();
      list = list.filter((lesson) => {
        const combined = `${lesson.title || ""} ${lesson.vietnameseTitle || ""} ${lesson.summary || ""} ${lesson.category || ""} ${lesson.categoryVi || ""}`
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/gi, "d")
          .toLowerCase();
        return combined.includes(query);
      });
    }
    return list;
  }, [fallbackStandaloneLessons, selectedProvince, selectedTopic, selectedCefr, searchQuery]);

  const isUsingServerData = serverCatalog !== null;
  const totalArticlesItems = isUsingServerData
    ? serverCatalog.totalElements
    : fallbackFilteredArticles.length;
  const totalArticlesPages = Math.max(
    1,
    isUsingServerData
      ? serverCatalog.totalPages
      : Math.ceil(fallbackFilteredArticles.length / articlesPageSize),
  );
  const safeArticlesPage = Math.min(articlesPage, totalArticlesPages);
  const pagedArticles = useMemo(() => {
    if (serverCatalog) return serverCatalog.items;
    const startIndex = (safeArticlesPage - 1) * articlesPageSize;
    return fallbackFilteredArticles.slice(startIndex, startIndex + articlesPageSize);
  }, [serverCatalog, fallbackFilteredArticles, safeArticlesPage, articlesPageSize]);

  const handleArticlesPageChange = (page: number) => {
    setArticlesPage(page);
    if (articlesLibraryRef.current) {
      const rect = articlesLibraryRef.current.getBoundingClientRect();
      if (rect.top < -60) {
        const targetY = window.scrollY + rect.top - 80;
        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: reduceMotion ? "instant" : "smooth",
        });
      }
    }
  };

  return {
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
  };
}
