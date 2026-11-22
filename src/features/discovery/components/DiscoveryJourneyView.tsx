import type { CSSProperties } from "react";
import { JourneyHero } from "./journey/JourneyHero";
import { JourneyMapPanel } from "./journey/JourneyMapPanel";
import { JourneyChapterPopover } from "./journey/JourneyChapterPopover";
import { JourneySkillDialog } from "./journey/JourneySkillDialog";
import { JourneySeriesSection } from "./journey/JourneySeriesSection";
import { JourneyArticlesSection } from "./journey/JourneyArticlesSection";
import { JourneyRail } from "./journey/JourneyRail";
import type { useDiscoveryJourney } from "../hooks/useDiscoveryJourney";

type DiscoveryJourneyViewProps = ReturnType<typeof useDiscoveryJourney>;

export function DiscoveryJourneyView(props: DiscoveryJourneyViewProps) {
  const {
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
  } = props;
  return (
    <div className="journey-page">
      <JourneyHero title={t("journey.title")} lead={t("journey.lead")} />

      <div
        className="journey-layout"
        style={
          {
            "--journey-panel-height":
              mapPanelHeight === null ? "auto" : `${mapPanelHeight}px`,
          } as CSSProperties
        }
      >
        <JourneyMapPanel
          panelRef={mapPanelRef}
          title={t("journey.title")}
          selectedRegion={selectedRegion}
          regionName={region ? getRegionName(region) : undefined}
          regionNumber={region?.number}
          selectedProvince={selectedProvince}
          isEn={isEn}
          getLocalizedProvinceName={getLocalizedProvinceName}
          labels={{
            allRegions: t("journey.all_regions"),
            exploreThreeRegions: t("journey.explore_three_regions"),
            choosePlace: t("journey.choose_place"),
            chooseRegion: t("journey.choose_region"),
            clearPlace: t("journey.clear_place"),
          }}
          onSelectRegion={selectRegion}
          onSelectPlace={selectPlace}
        />

        <JourneyRail
          selectedRegion={selectedRegion}
          selectedProvinceName={selectedProvince ? getLocalizedProvinceName(selectedProvince.name) : undefined}
          featuredRegionName={region ? getRegionName(region) : ""}
          savedWordCount={savedWordCount}
          nominatedSlides={nominatedSlides}
          currentSlide={currentSlide}
          activeSlideIndex={activeSlideIndex}
          hasOwnSeries={hasOwnSeries}
          unlockedPlaces={unlockedPlaces}
          renderSpotlightCard={renderNominatedSeriesCard}
          onSelectRegion={selectRegion}
          onSetActiveSlideIndex={setActiveSlideIndex}
          onPreviousSlide={handlePrevSlide}
          onNextSlide={handleNextSlide}
          onCardKeyDown={handleCardKeyDown}
          onHoverChange={setCarouselHovered}
          onFocusChange={setCarouselFocused}
        />
      </div>

      <section
        className="journey-library"
        aria-label={t("journey.available_series")}
      >
        <JourneySeriesSection
          availableRef={availableLibraryRef}
          upcomingRef={upcomingLibraryRef}
          pagedAvailableSeries={pagedAvailableSeries}
          pagedUpcomingSeries={pagedUpcomingSeries}
          upcomingCount={upcomingSeries.length}
          isLoading={isJourneysLoading}
          isEn={isEn}
          totalAvailableCount={totalAvailableCount}
          currentAvailablePage={safeAvailablePage}
          totalAvailablePages={totalAvailablePages}
          currentUpcomingPage={safeUpcomingPage}
          totalUpcomingPages={totalUpcomingPages}
          renderSeriesCard={renderSeriesCard}
          onAvailablePageChange={handleAvailablePageChange}
          onUpcomingPageChange={handleUpcomingPageChange}
          failedImages={failedImages}
          onImageError={(id) => setFailedImages((previous) => ({ ...previous, [id]: true }))}
        />

        <JourneyArticlesSection
          articlesRef={articlesLibraryRef}
          selectedProvince={selectedProvince}
          getLocalizedProvinceName={getLocalizedProvinceName}
          isEn={isEn}
          totalItems={totalArticlesItems}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          pageSize={articlesPageSize}
          setPageSize={setArticlesPageSize}
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
          selectedCefr={selectedCefr}
          setSelectedCefr={setSelectedCefr}
          isLoading={isArticlesLoading}
          lessons={pagedArticles}
          bookmarks={bookmarks}
          onToggleBookmark={toggleBookmark}
          onResetAllFilters={() => {
            setSearchQuery("");
            setSelectedTopic("All");
            setSelectedCefr("All");
            if (selectedProvince) {
              setParams((previous) => {
                const next = new URLSearchParams(previous);
                next.delete("place");
                return next;
              });
            }
          }}
          errorMessage={articlesError}
          onRetry={() => setArticlesRetryTrigger((previous) => previous + 1)}
          currentPage={safeArticlesPage}
          totalPages={totalArticlesPages}
          onPageChange={handleArticlesPageChange}
        />
      </section>

      {hoverPopover && (
        <JourneyChapterPopover
          series={hoverPopover.series}
          popoverRef={popoverRef}
          x={hoverPopover.x}
          y={hoverPopover.y}
          isEn={isEn}
          getLocalizedProvinceName={getLocalizedProvinceName}
          onClose={closeSeriesChapters}
          onChooseChapter={chooseChapter}
        />
      )}

      <JourneySkillDialog
        dialogRef={skillDialogRef}
        chapter={selectedChapter}
        onClose={() => setSelectedChapter(null)}
      />
    </div>
  );
}
