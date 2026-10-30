import { useTranslation } from 'react-i18next';
import { useEffect, useLayoutEffect, useState, useRef, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  ChevronLeft,
  ChevronRight,
  Compass,
  Headphones,
  LockKeyhole,
  MapPin,
  Mic2,
  X,
} from 'lucide-react';
import { VietnamMap } from '@/components/map/VietnamMap';
import { Button } from '@/components/ui/button';
import { VIETNAM_34_PROVINCES, VIETNAM_REGION_VIEWBOXES } from '@/data/vietnamMapData';
import { toEnglishPlaceName } from '@/utils/vietnamMapUtils';
import type { RegionKey } from '@/utils/useVietnamMap';
import { paths } from '@/routes/paths';
import { readLearningValue, writeLearningValue } from '@/services/learning/learningStorage';
import { readFirstRegionChoice, saveFirstRegionChoice, type FirstRegion } from '@/services/learning/firstRegionChoice';
import { JOURNEY_SERIES, type JourneySeries } from '../data/learningJourney';

const REGIONS = [
  { id: 'north', nameKey: 'journey.region_north', fallbackName: 'Northern Vietnam', number: "1" },
  { id: 'central', nameKey: 'journey.region_central', fallbackName: 'Central Vietnam', number: "2" },
  { id: 'south', nameKey: 'journey.region_south', fallbackName: 'Southern Vietnam', number: "3" },
] as const;
const REGION_SHAPES = Object.fromEntries(
  REGIONS.map(region => [region.id, VIETNAM_34_PROVINCES.filter(province => province.region === region.id).map(province => province.d).join(' ')]),
) as Record<(typeof REGIONS)[number]['id'], string>;

interface DiscoveryJourneyProps {
  onBrowseStories: () => void;
}

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
}

export function DiscoveryJourney({ onBrowseStories }: DiscoveryJourneyProps) {
  const { t, i18n } = useTranslation('discovery');
  const isEn = i18n.language === 'en';
  const mapPanelRef = useRef<HTMLElement>(null);
  const [mapPanelHeight, setMapPanelHeight] = useState<number | null>(null);
  const [carouselHovered, setCarouselHovered] = useState(false);
  const [carouselFocused, setCarouselFocused] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [params, setParams] = useSearchParams();
  const [firstRegion, setFirstRegion] = useState<FirstRegion | null>(readFirstRegionChoice);
  const requestedPlace = VIETNAM_34_PROVINCES.find(province => province.id === params.get('place'));
  const selectedProvince = requestedPlace?.region === firstRegion ? requestedPlace : undefined;
  const selectedPlace = selectedProvince?.id || '';
  const selectedRegion: RegionKey = selectedProvince ? selectedProvince.region : params.get('region') === firstRegion ? firstRegion || 'all' : 'all';
  const region = REGIONS.find(item => item.id === selectedRegion);

  const getRegionName = (item: (typeof REGIONS)[number]) => t(item.nameKey, item.fallbackName);

  const upcomingSeries = [
    {
      id: 'central-preview',
      title: t('journey.region_central'),
      place: isEn ? 'Hue' : 'Huế',
      imageUrl: '/images/landing/hue-citadel.webp',
      description: isEn
        ? 'New reading series are being prepared for Central Vietnam.'
        : 'Các chuỗi bài đọc mới đang được biên soạn cho khu vực Miền Trung.',
    },
    {
      id: 'south-preview',
      title: t('journey.region_south'),
      place: isEn ? 'Ho Chi Minh City' : 'TP. Hồ Chí Minh',
      imageUrl: '/images/landing/banh-mi.webp',
      description: isEn
        ? 'New reading series are being prepared for Southern Vietnam.'
        : 'Các chuỗi bài đọc mới đang được biên soạn cho khu vực Miền Nam.',
    },
  ];

  const getLocalizedProvinceName = (pName: string) => {
    return isEn ? toEnglishPlaceName(pName) : pName;
  };

  useEffect(() => {
    const regionParam = params.get('region');
    const placeParam = params.get('place');
    if ((!regionParam || regionParam === firstRegion) && (!placeParam || requestedPlace?.region === firstRegion)) return;
    setParams(previous => {
      const next = new URLSearchParams(previous);
      next.delete('region');
      next.delete('place');
      return next;
    }, { replace: true });
  }, [firstRegion, params, requestedPlace, setParams]);

  const [unlockedPlaces, setUnlockedPlaces] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(JOURNEY_SERIES.map(series => [
      series.provinceId,
      readLearningValue<boolean>(`journey:unlocked:${series.provinceId}`) === true,
    ])));
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Floating Chapter Popover State
  const [hoverPopover, setHoverPopover] = useState<HoverPopoverState | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seriesTriggerRef = useRef<HTMLElement | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<SelectedChapter | null>(null);
  const skillDialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const panel = mapPanelRef.current;
    if (!panel) return;

    const updateHeight = () => setMapPanelHeight(panel.getBoundingClientRect().height);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateVisibility = () => setPageVisible(!document.hidden);
    const updateMotionPreference = () => setReduceMotion(motionPreference.matches);
    document.addEventListener('visibilitychange', updateVisibility);
    motionPreference.addEventListener('change', updateMotionPreference);
    return () => {
      document.removeEventListener('visibilitychange', updateVisibility);
      motionPreference.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    const dialog = skillDialogRef.current;
    if (!dialog) return;
    if (selectedChapter && !dialog.open) dialog.showModal();
    if (!selectedChapter && dialog.open) dialog.close();
  }, [selectedChapter]);

  useEffect(() => {
    if (hoverPopover?.pinned) document.querySelector<HTMLButtonElement>('.journey-hover-chapter-link')?.focus();
  }, [hoverPopover?.pinned, hoverPopover?.series.id]);

  const availableSeries = JOURNEY_SERIES.filter(series =>
    VIETNAM_34_PROVINCES.some(province => province.id === series.provinceId && province.region === firstRegion));

  // Nominated Series Slider State
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const hasOwnSeries = selectedProvince
    ? JOURNEY_SERIES.some(s => s.provinceId === selectedProvince.id)
    : true;

  const nominatedSlides = useMemo(() => {
    if (selectedProvince && hasOwnSeries) {
      return JOURNEY_SERIES.filter(s => s.provinceId === selectedProvince.id);
    }
    if (firstRegion !== 'north') return JOURNEY_SERIES.filter(s => s.region === firstRegion);
    // Default regional nominated series for Northern Vietnam:
    const northernSeries = JOURNEY_SERIES.filter(s =>
      s.region === 'north' || ['ha-noi', 'hung-yen', 'ninh-binh'].includes(s.provinceId)
    );
    const preferredOrder = [
      'pho',
      'banh-cay-thai-binh',
      'cha-ca-la-vong',
      'bun-cha',
      'com-chay-ninh-binh',
      'ca-kho-vu-dai',
    ];
    return [...northernSeries].sort((a, b) => {
      const idxA = preferredOrder.indexOf(a.id);
      const idxB = preferredOrder.indexOf(b.id);
      return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
    });
  }, [selectedProvince, hasOwnSeries, firstRegion]);

  useEffect(() => {
    setActiveSlideIndex(0);
    setCarouselFocused(false);
    setCarouselHovered(false);
  }, [selectedPlace, selectedRegion]);

  useEffect(() => {
    if (nominatedSlides.length <= 1 || carouselHovered || carouselFocused || !pageVisible || reduceMotion) return;
    const timeout = window.setTimeout(() => {
      setActiveSlideIndex(index => (index + 1) % nominatedSlides.length);
    }, 3000);
    return () => window.clearTimeout(timeout);
  }, [activeSlideIndex, nominatedSlides.length, carouselHovered, carouselFocused, pageVisible, reduceMotion]);

  const currentSlide = nominatedSlides[activeSlideIndex] || nominatedSlides[0];

  function handlePrevSlide() {
    setActiveSlideIndex(prev => (prev - 1 + nominatedSlides.length) % nominatedSlides.length);
  }

  function handleNextSlide() {
    setActiveSlideIndex(prev => (prev + 1) % nominatedSlides.length);
  }

  function handleCardKeyDown(e: React.KeyboardEvent) {
    if (nominatedSlides.length <= 1) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNextSlide();
    }
  }

  function selectRegion(nextRegion: RegionKey) {
    if (nextRegion !== 'all' && !REGIONS.some(item => item.id === nextRegion)) return;
    if (nextRegion !== 'all' && firstRegion && nextRegion !== firstRegion) return;
    if (nextRegion !== 'all' && !firstRegion) {
      setFirstRegion(nextRegion as FirstRegion);
      saveFirstRegionChoice(nextRegion as FirstRegion);
    }
    setParams(previous => {
      const next = new URLSearchParams(previous);
      next.delete('place');
      if (nextRegion === 'all') next.delete('region'); else next.set('region', nextRegion);
      return next;
    });
  }

  function selectPlace(id: string) {
    const province = VIETNAM_34_PROVINCES.find(item => item.id === id && item.region === firstRegion);
    setParams(previous => {
      const next = new URLSearchParams(previous);
      if (province) {
        next.set('region', province.region);
        next.set('place', province.id);
      } else {
        next.delete('place');
      }
      return next;
    });
  }

  function changeFirstRegion() {
    setFirstRegion(null);
    saveFirstRegionChoice(null);
    setParams(previous => {
      const next = new URLSearchParams(previous);
      next.delete('region');
      next.delete('place');
      return next;
    });
  }

  function unlockPlace(provinceId: string) {
    setUnlockedPlaces(previous => ({ ...previous, [provinceId]: true }));
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
    setHoverPopover(current => current?.pinned ? current : { series, x, y });
  }

  function handleSeriesMouseMove(series: JourneySeries, e: React.MouseEvent) {
    clearHideTimeout();
    setHoverPopover(current => {
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
      setHoverPopover(current => current?.pinned ? current : null);
    }, 280);
  }

  function handlePopoverMouseEnter() {
    clearHideTimeout();
  }

  function handlePopoverMouseLeave() {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      setHoverPopover(current => current?.pinned ? current : null);
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

  function chooseChapter(chapter: JourneySeries['chapters'][number], series: JourneySeries) {
    clearHideTimeout();
    setHoverPopover(null);
    setSelectedChapter({ id: chapter.id, title: chapter.title, seriesTitle: series.title });
  }

  function renderNominatedSeriesCard(series: JourneySeries, isUnlocked: boolean) {
    const province = VIETNAM_34_PROVINCES.find(item => item.id === series.provinceId);
    const placeName = province ? getLocalizedProvinceName(province.name) : (isEn ? 'Hanoi' : 'Hà Nội');
    const firstChapter = series.chapters[0];

    return (
      <article className={`journey-spotlight-card ${isUnlocked ? 'is-unlocked' : 'is-locked'}`}>
        <div className="journey-spotlight-image">
          {series.imageUrl && !failedImages[series.id] ? (
            <img
              src={series.imageUrl}
              alt={series.title}
              loading="lazy"
              onError={() => setFailedImages(previous => ({ ...previous, [series.id]: true }))}
            />
          ) : (
            <BookOpen size={40} aria-hidden="true" />
          )}
          <span className="journey-spotlight-badge">
            <MapPin size={13} aria-hidden="true" />
            {t('journey.featured_series').toUpperCase()}
          </span>
        </div>
        <div className="journey-spotlight-content">
          <span className="discovery-category">
            {placeName} · {t('journey.stories_in_region', { count: series.chapters.length, defaultValue: `${series.chapters.length} câu chuyện` })} · B1
          </span>
          <h3>{series.title}</h3>
          <p>{series.description}</p>
          <div className="journey-spotlight-footer">
            {isUnlocked ? (
              <button
                type="button"
                onClick={() => firstChapter && chooseChapter(firstChapter, series)}
                className="journey-spotlight-action"
              >
                <BookOpen size={16} aria-hidden="true" />
                <span>{t('journey.start_reading_ch1')}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            ) : (
              <Button
                type="button"
                className="journey-spotlight-action"
                onClick={() => unlockPlace(series.provinceId)}
              >
                <LockKeyhole size={16} aria-hidden="true" />
                <span>{t('journey.unlock_place', { placeName })}</span>
              </Button>
            )}
          </div>
        </div>
      </article>
    );
  }

  function renderSeriesCard(series: JourneySeries) {
    const province = VIETNAM_34_PROVINCES.find(item => item.id === series.provinceId);
    const placeName = province ? getLocalizedProvinceName(province.name) : (isEn ? 'Vietnam' : 'Việt Nam');

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
          aria-expanded={hoverPopover?.series.id === series.id && !!hoverPopover.pinned}
          aria-controls="journey-chapter-list"
          onClick={event => openSeriesChapters(series, event.currentTarget)}
        >
          <div className="journey-series-image">
            {series.imageUrl && !failedImages[series.id] ? (
              <img
                src={series.imageUrl}
                alt=""
                loading="lazy"
                onError={() => setFailedImages(previous => ({ ...previous, [series.id]: true }))}
              />
            ) : (
              <BookOpen size={32} aria-hidden="true" />
            )}
          </div>
          <div className="journey-series-copy">
            <span className="discovery-category">
              {placeName} · {t('journey.stories_in_region', { count: series.chapters.length, defaultValue: `${series.chapters.length} câu chuyện` })}
            </span>
            <h4>{series.title}</h4>
            <p>{series.description}</p>
            <span className="journey-series-footer">
              {t('journey.explore_chapters')} <ArrowRight size={18} aria-hidden="true" />
            </span>
          </div>
        </button>
      </li>
    );
  }

  return (
    <div className="journey-page">
      <header className="journey-hero">
        <div>
          <h1>{t('journey.title')}</h1>
          <p>{t('journey.lead')}</p>
        </div>
        <div className="discovery-modes" role="group" aria-label={t('journey.explore_by')}>
          <button type="button" aria-pressed="true">{t('journey.tab_journey')}</button>
          <button type="button" onClick={onBrowseStories}>{t('journey.tab_stories')}</button>
        </div>
      </header>

      <div
        className="journey-layout"
        style={{ '--journey-panel-height': mapPanelHeight === null ? 'auto' : `${mapPanelHeight}px` } as CSSProperties}
      >
        <section ref={mapPanelRef} className="journey-map-panel" aria-label={t('journey.title')}>
          <div className="journey-map-heading">
            <div>
              {region && (
                <Button type="button" variant="ghost" size="sm" onClick={() => selectRegion('all')}>
                  <ArrowLeft size={17} /> {t('journey.all_regions')}
                </Button>
              )}
              <span>{region ? `${region.number} / ${getRegionName(region).toUpperCase()}` : t('journey.explore_three_regions')}</span>
            </div>
            <strong>{region ? t('journey.choose_place') : t('journey.choose_region')}</strong>
          </div>
          <div className="journey-map" data-map-level={region ? 'provinces' : 'regions'}>
            <VietnamMap
              activeRegion={selectedRegion}
              overviewByRegion
              selectableRegions={firstRegion ? [firstRegion] : ['north', 'central', 'south']}
              labelLanguage={isEn ? 'en' : 'vi'}
              selectedProvinceId={selectedPlace || null}
              onSelectRegion={selectRegion}
              onSelectProvince={province => { if (province) selectPlace(province.id); }}
              showRegionTabs={false}
              showPoiPins={false}
              showTooltip={false}
              showLabels={!!region}
              showControls={!!region}
            />
          </div>
          {region && selectedProvince && (
            <div className="journey-selected-place">
              <MapPin size={18} />
              <span>{getLocalizedProvinceName(selectedProvince.name)}</span>
              <button type="button" onClick={() => selectPlace('')}>{t('journey.clear_place')}</button>
            </div>
          )}
        </section>

        <aside
          className={`journey-rail ${region ? 'journey-rail--featured' : 'journey-rail--regions'}`}
          aria-label={t('journey.featured_series')}
          aria-live={region ? 'off' : 'polite'}
          onFocus={() => setCarouselFocused(true)}
          onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setCarouselFocused(false); }}
        >
          {!region ? (
            <>
              <h2>{t('journey.explore_vietnam')}</h2>
              <p className="journey-rail-intro">
                {firstRegion
                  ? t('journey.first_region_intro', {
                      regionName: REGIONS.find(item => item.id === firstRegion)
                        ? getRegionName(REGIONS.find(item => item.id === firstRegion)!)
                        : '',
                    })
                  : t('journey.choose_first_intro')}
              </p>
              {firstRegion && (
                <button type="button" className="journey-change-region" onClick={changeFirstRegion}>
                  {t('journey.change_first_region')}
                </button>
              )}
              <div className="journey-region-list">
                {REGIONS.map(item => {
                  const isOpen = !firstRegion || item.id === firstRegion;
                  const regionName = getRegionName(item);
                  const content = (
                    <>
                      <span className="journey-region-number">{item.number}</span>
                      <svg className="journey-region-thumbnail" viewBox={VIETNAM_REGION_VIEWBOXES[item.id].viewBox} aria-hidden="true" focusable="false">
                        <path d={REGION_SHAPES[item.id]} fillRule="evenodd" />
                      </svg>
                      <span className="journey-region-copy">
                        <strong>{regionName}</strong>
                        <small className="journey-region-status">
                          {isOpen ? <BookOpen size={14} aria-hidden="true" /> : <LockKeyhole size={14} aria-hidden="true" />}
                          {firstRegion === item.id ? t('journey.your_first_region') : isOpen ? t('journey.choose_first') : t('journey.locked')}
                        </small>
                        {item.id === 'north' && <small className="journey-region-recommended">{t('journey.recommended')}</small>}
                      </span>
                      {isOpen && <ArrowRight className="journey-region-arrow" size={18} aria-hidden="true" />}
                    </>
                  );
                  return isOpen ? (
                    <button key={item.id} type="button" className="journey-region-step journey-region-step--open" onClick={() => selectRegion(item.id)}>{content}</button>
                  ) : (
                    <div key={item.id} className="journey-region-step journey-region-step--locked" aria-label={`${regionName}, ${t('journey.locked')}`}>{content}</div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="journey-rail-header">
                <div className="journey-rail-title-group">
                  <span className="journey-eyebrow">
                    {selectedProvince ? getLocalizedProvinceName(selectedProvince.name).toUpperCase() : getRegionName(region).toUpperCase()}
                  </span>
                  <h2>{t('journey.featured_series')}</h2>
                </div>
                {nominatedSlides.length > 1 && (
                  <div className="journey-slider-controls" aria-label={t('journey.featured_series')}>
                    <button
                      type="button"
                      className="journey-slider-arrow"
                      onClick={handlePrevSlide}
                      aria-label={t('journey.previous_series')}
                    >
                      <ChevronLeft size={18} aria-hidden="true" />
                    </button>
                    <span className="journey-slider-counter">
                      {t('journey.series_counter', { current: activeSlideIndex + 1, total: nominatedSlides.length })}
                    </span>
                    <button
                      type="button"
                      className="journey-slider-arrow"
                      onClick={handleNextSlide}
                      aria-label={t('journey.next_series')}
                    >
                      <ChevronRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>

              {selectedProvince && !hasOwnSeries && (
                <div className="journey-place-notice" role="status">
                  <Compass size={14} className="journey-place-notice-icon" aria-hidden="true" />
                  <span>
                    {t('journey.no_dedicated_series', { placeName: getLocalizedProvinceName(selectedProvince.name) })}
                    {firstRegion === 'north' ? t('journey.showing_featured_north') : ''}
                  </span>
                </div>
              )}

              {!currentSlide && (
                <div className="journey-empty-region" role="status">
                  <p>{t('journey.stories_on_the_way', { regionName: getRegionName(region) })}</p>
                  <button type="button" onClick={onBrowseStories}>
                    {t('journey.browse_available_stories')} <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              )}

              {currentSlide && (
                <div
                  tabIndex={0}
                  onKeyDown={handleCardKeyDown}
                  aria-label={`${t('journey.featured_series')}: ${currentSlide.title}`}
                  className="journey-spotlight-slider-wrapper"
                  onMouseEnter={() => setCarouselHovered(true)}
                  onMouseLeave={() => setCarouselHovered(false)}
                >
                  {renderNominatedSeriesCard(currentSlide, !!unlockedPlaces[currentSlide.provinceId])}

                  {nominatedSlides.length > 1 && (
                    <div className="journey-slider-dots" role="group" aria-label={t('journey.featured_series')}>
                      {nominatedSlides.map((s, idx) => (
                        <button
                          key={s.id}
                          type="button"
                          aria-label={`${idx + 1}: ${s.title}`}
                          aria-current={idx === activeSlideIndex ? 'true' : undefined}
                          className={`journey-slider-dot ${idx === activeSlideIndex ? 'is-active' : ''}`}
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

      <section className="journey-library" aria-label={t('journey.available_series')}>
        <div className="journey-library-group">
          <div className="journey-library-section-heading">
            <h2>{t('journey.available_series')}</h2>
            <span>{t('journey.series_count', { count: availableSeries.length })}</span>
          </div>
          <ul className="journey-series-grid">
            {availableSeries.map(renderSeriesCard)}
          </ul>
          {availableSeries.length === 0 && (
            <div className="journey-empty-region">
              <p>{firstRegion ? t('journey.no_published_series') : t('journey.choose_first_to_see')}</p>
              <button type="button" onClick={onBrowseStories}>
                {t('journey.browse_available_stories')} <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
        <div className="journey-library-group">
          <div className="journey-library-section-heading">
            <h2>{t('journey.upcoming_series')}</h2>
            <span>{t('journey.series_count', { count: upcomingSeries.length })}</span>
          </div>
          <ul className="journey-series-grid">
            {upcomingSeries.map(series => (
              <li key={series.id}>
                <article className="journey-series-tile is-locked is-upcoming">
                  <div className="journey-series-image">
                    <img src={series.imageUrl} alt="" loading="lazy" />
                    <span className="journey-series-lock">
                      <LockKeyhole size={17} /> {t('journey.coming_soon')}
                    </span>
                  </div>
                  <div className="journey-series-copy">
                    <span className="discovery-category">{series.place}</span>
                    <h4>{series.title}</h4>
                    <p>{series.description}</p>
                    <span className="journey-series-footer">
                      {t('journey.coming_soon')} <LockKeyhole size={17} aria-hidden="true" />
                    </span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
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
          onKeyDown={event => { if (event.key === 'Escape') closeSeriesChapters(); }}
          role="region"
          aria-label={`${t('journey.explore_chapters')}: ${hoverPopover.series.title}`}
        >
          <div className="journey-hover-popover-header">
            <div>
              <span className="journey-hover-popover-tag">
                {getLocalizedProvinceName(
                  VIETNAM_34_PROVINCES.find(p => p.id === hoverPopover.series.provinceId)?.name || (isEn ? 'Hanoi' : 'Hà Nội')
                )} · {t('journey.chapters_count', { count: hoverPopover.series.chapters.length })}
              </span>
              <h4>{hoverPopover.series.title}</h4>
            </div>
            <button
              type="button"
              className="journey-hover-close"
              aria-label={t('journey.close_chapter_list')}
              onClick={closeSeriesChapters}
            >
              <X size={16} />
            </button>
          </div>

          <ul className="journey-hover-chapter-list">
            {hoverPopover.series.chapters.map(chapter => (
              <li key={chapter.id}>
                <button
                  type="button"
                  className="journey-hover-chapter-link"
                  onClick={() => chooseChapter(chapter, hoverPopover.series)}
                >
                  <span className="journey-hover-chapter-num">
                    {String(chapter.order).padStart(2, '0')}
                  </span>
                  <div className="journey-hover-chapter-info">
                    <strong>{chapter.title}</strong>
                    <small>
                      {chapter.readTime
                        ? isEn
                          ? chapter.readTime.replace('phút đọc', 'min read')
                          : chapter.readTime
                        : isEn ? '3 min read' : '3 phút đọc'}
                    </small>
                  </div>
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              </li>
            ))}
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
                <span className="journey-eyebrow">{selectedChapter.seriesTitle}</span>
                <h2 id="journey-skill-title">{selectedChapter.title}</h2>
                <p>{t('journey.dialog_question')}</p>
              </div>
              <button
                type="button"
                className="journey-skill-close"
                aria-label={t('journey.dialog_close')}
                onClick={() => setSelectedChapter(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="journey-skill-options">
              <Link to={paths.reader({ story: selectedChapter.id, level: 'Level 2' })}>
                <BookOpen size={24} aria-hidden="true" />
                <span>
                  <strong>{t('journey.skill_reading_title')}</strong>
                  <small>{t('journey.skill_reading_desc')}</small>
                </span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link to={paths.reader({ story: selectedChapter.id, level: 'Level 2', mode: 'practice', practice: 'dictation' })}>
                <Headphones size={24} aria-hidden="true" />
                <span>
                  <strong>{t('journey.skill_listening_title')}</strong>
                  <small>{t('journey.skill_listening_desc')}</small>
                </span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <div className="journey-skill-speaking" aria-label={t('journey.skill_speaking_heading')}>
                <h3>{t('journey.skill_speaking_heading')}</h3>
                <p>{t('journey.skill_speaking_prompt')}</p>
                <Link to={paths.reader({ story: selectedChapter.id, level: 'Level 2', mode: 'practice', practice: 'shadowing' })}>
                  <Mic2 size={24} aria-hidden="true" />
                  <span>
                    <strong>{t('journey.skill_shadowing_title')}</strong>
                    <small>{t('journey.skill_shadowing_desc')}</small>
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link to={paths.aiWorkspace({ story: selectedChapter.id, level: 'Level 2' })}>
                  <Bot size={24} aria-hidden="true" />
                  <span>
                    <strong>{t('journey.skill_ai_title')}</strong>
                    <small>{t('journey.skill_ai_desc')}</small>
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