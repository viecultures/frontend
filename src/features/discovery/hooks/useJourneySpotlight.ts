import { useEffect, useMemo, useState } from "react";
import type { JourneySeries } from "../data/learningJourney";
import type { RegionKey } from "@/utils/useVietnamMap";
import { VIETNAM_34_PROVINCES } from "@/data/vietnamMapData";

type SelectedProvince = (typeof VIETNAM_34_PROVINCES)[number] | undefined;

interface UseJourneySpotlightOptions {
  availableSeries: JourneySeries[];
  selectedProvince: SelectedProvince;
  firstRegion: RegionKey;
  selectedRegion: RegionKey;
  pageVisible: boolean;
  reduceMotion: boolean;
}

export function useJourneySpotlight({
  availableSeries,
  selectedProvince,
  firstRegion,
  selectedRegion,
  pageVisible,
  reduceMotion,
}: UseJourneySpotlightOptions) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [carouselHovered, setCarouselHovered] = useState(false);
  const [carouselFocused, setCarouselFocused] = useState(false);

  const hasOwnSeries = selectedProvince
    ? availableSeries.some((series) => series.provinceId === selectedProvince.id)
    : true;

  const nominatedSlides = useMemo(() => {
    if (selectedProvince && hasOwnSeries) {
      return availableSeries.filter((series) => series.provinceId === selectedProvince.id);
    }
    if (firstRegion !== "north") {
      return availableSeries.filter((series) => series.region === firstRegion);
    }
    const northernSeries = availableSeries.filter(
      (series) =>
        series.region === "north" ||
        ["ha-noi", "hung-yen", "ninh-binh"].includes(series.provinceId),
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
      const indexA = preferredOrder.indexOf(a.id);
      const indexB = preferredOrder.indexOf(b.id);
      return (indexA !== -1 ? indexA : 99) - (indexB !== -1 ? indexB : 99);
    });
  }, [selectedProvince, hasOwnSeries, firstRegion, availableSeries]);

  useEffect(() => {
    setActiveSlideIndex(0);
    setCarouselFocused(false);
    setCarouselHovered(false);
  }, [selectedProvince?.id, selectedRegion]);

  useEffect(() => {
    if (
      nominatedSlides.length <= 1 ||
      carouselHovered ||
      carouselFocused ||
      !pageVisible ||
      reduceMotion
    ) {
      return;
    }
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

  const handlePreviousSlide = () => {
    setActiveSlideIndex(
      (previous) => (previous - 1 + nominatedSlides.length) % nominatedSlides.length,
    );
  };
  const handleNextSlide = () => {
    setActiveSlideIndex((previous) => (previous + 1) % nominatedSlides.length);
  };
  const handleCardKeyDown = (event: React.KeyboardEvent) => {
    if (nominatedSlides.length <= 1) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handlePreviousSlide();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      handleNextSlide();
    }
  };

  return {
    activeSlideIndex,
    setActiveSlideIndex,
    carouselHovered,
    setCarouselHovered,
    carouselFocused,
    setCarouselFocused,
    hasOwnSeries,
    nominatedSlides,
    currentSlide,
    handlePreviousSlide,
    handleNextSlide,
    handleCardKeyDown,
  };
}
