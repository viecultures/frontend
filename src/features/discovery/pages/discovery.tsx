import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { LESSONS_DATA, TOPIC_OPTIONS } from '@/data/discoveryData';
import { Button } from '@/components/ui/button';
import { readerApiService, type CatalogLesson } from '@/features/reader/services/readerApiService';
import { readLearningValue, writeLearningValue } from '@/services/learning/learningStorage';
import { EditorialStory } from '../components/EditorialStory';
import { DiscoveryJourney } from '../components/DiscoveryJourney';
import { DEFAULT_FILTERS, filterCatalog, mergeCatalog, readBookmarkState, selectEditorial, type DiscoveryFilters } from '../lib/catalog';
import { TOPIC_LABELS } from '../lib/editorial';
import '../discovery.css';
import '../journey.css';

const PAGE_SIZE = 6;

export default function DiscoveryPage() {
  const { t } = useTranslation('discovery');
  const [params, setParams] = useSearchParams();
  const journey = params.get('view') !== 'stories';
  const [filters, setFilters] = useState<DiscoveryFilters>(DEFAULT_FILTERS);
  const [advanced, setAdvanced] = useState(false);
  const [page, setPage] = useState(1);
  const [remote, setRemote] = useState<CatalogLesson[]>([]);
  const [catalogState, setCatalogState] = useState<'loading' | 'ready' | 'offline'>('loading');
  const [retry, setRetry] = useState(0);
  const [bookmarks, setBookmarks] = useState(() => readBookmarkState(readLearningValue('discovery-bookmarks')));
  const [saveMessage, setSaveMessage] = useState('');
  const resultsHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    setCatalogState('loading');
    const request = async () => {
      const first = await readerApiService.getCatalog({ size: 100 });
      if (!first) throw new Error('Catalog unavailable');
      const items = [...first.items];
      for (let index = 1; active && index < first.totalPages; index++) {
        const next = await readerApiService.getCatalog({ page: index, size: 100 });
        if (!next) throw new Error('Incomplete catalog');
        items.push(...next.items);
      }
      return items;
    };
    Promise.race([request(), new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('Catalog timed out')), 8000);
    })]).then(items => {
      if (active) { setRemote(items); setCatalogState('ready'); }
    }).catch(() => { if (active) setCatalogState('offline'); }).finally(() => clearTimeout(timer));
    return () => { active = false; clearTimeout(timer); };
  }, [retry]);

  const catalog = useMemo(() => mergeCatalog(LESSONS_DATA, remote, readerApiService.mapCatalogLessonToDiscoveryLesson), [remote]);
  const effectiveFilters = useMemo(() => ({ ...filters, province: '' }), [filters]);
  const filtered = useMemo(() => filterCatalog(catalog, effectiveFilters, bookmarks), [catalog, effectiveFilters, bookmarks]);
  const hasFilters = effectiveFilters.query.trim() !== '' || effectiveFilters.topic !== 'All' || effectiveFilters.level !== 'All'
    || effectiveFilters.duration !== 'All' || effectiveFilters.saved || effectiveFilters.sort !== 'recommended';
  const editorial = useMemo(() => !hasFilters ? selectEditorial(filtered) : [], [filtered, hasFilters]);
  const remaining = filtered.filter(item => !editorial.some(story => story.id === item.id));
  const pageCount = Math.max(1, Math.ceil(remaining.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = remaining.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateFilter<K extends keyof DiscoveryFilters>(key: K, value: DiscoveryFilters[K]) {
    setFilters(previous => ({ ...previous, [key]: value }));
    setPage(1);
  }
  function resetFilters() { setFilters(DEFAULT_FILTERS); setPage(1); }
  function showJourney() {
    setParams(previous => {
      const next = new URLSearchParams(previous);
      next.delete('view');
      return next;
    });
    setPage(1);
  }
  function toggleBookmark(id: string) {
    const next = { ...bookmarks, [id]: !bookmarks[id] };
    if (writeLearningValue('discovery-bookmarks', next)) {
      setBookmarks(next);
      setSaveMessage(next[id] ? t('page.story_saved') : t('page.story_unsaved'));
    } else {
      setSaveMessage(t('page.storage_error'));
    }
  }
  function changePage(next: number) {
    setPage(next);
    resultsHeading.current?.focus({ preventScroll: true });
    resultsHeading.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  const storyProps = { onSave: toggleBookmark };
  const extraCount = Number(filters.duration !== 'All') + Number(filters.saved) + Number(filters.sort !== 'recommended');

  if (journey) return <DiscoveryJourney onBrowseStories={() => setParams(previous => {
    const next = new URLSearchParams(previous);
    next.set('view', 'stories');
    next.delete('place');
    return next;
  })} />;

  return (
    <div className="discovery-editorial">
      <header className="discovery-header">
        <div>
          <h1>{t('page.title')}</h1>
          <p>{t('page.lead')}</p>
        </div>
        <div className="discovery-modes" role="group" aria-label={t('journey.explore_by')}>
          <button type="button" onClick={showJourney}>{t('page.tab_journey')}</button>
          <button type="button" aria-pressed="true">{t('page.tab_stories')}</button>
        </div>
      </header>
      <section className="discovery-filters" aria-label={t('page.filters_button')}>
        <div className="discovery-filter-row">
          <div className="discovery-search">
            <Search size={19} aria-hidden="true" />
            <input
              type="search"
              aria-label={t('page.search_aria')}
              placeholder={t('page.search_placeholder')}
              value={filters.query}
              onChange={event => updateFilter('query', event.target.value)}
            />
            {filters.query && (
              <button
                type="button"
                aria-label={t('page.clear_search')}
                onClick={() => updateFilter('query', '')}
              >
                <X size={18} />
              </button>
            )}
          </div>
          <label className="discovery-topic">
            <span className="sr-only">{t('page.topic_label')}</span>
            <select
              aria-label={t('page.topic_label')}
              value={filters.topic}
              onChange={event => updateFilter('topic', event.target.value)}
            >
              {TOPIC_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.value === 'All' ? t('page.all_topics') : (t(`editorial.topics.${option.value}`, { defaultValue: TOPIC_LABELS[option.value] }))}
                </option>
              ))}
            </select>
          </label>
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={advanced}
            aria-controls="discovery-advanced"
            onClick={() => setAdvanced(!advanced)}
          >
            <SlidersHorizontal size={18} />
            {t('page.filters_button')}{extraCount > 0 ? ` (${extraCount})` : ''}
          </Button>
        </div>
        {advanced && (
          <div id="discovery-advanced" className="discovery-advanced">
            <label>
              {t('page.reading_time')}
              <select value={filters.duration} onChange={event => updateFilter('duration', event.target.value)}>
                <option value="All">{t('page.duration_all')}</option>
                <option value="short">{t('page.duration_short')}</option>
                <option value="medium">{t('page.duration_medium')}</option>
                <option value="long">{t('page.duration_long')}</option>
              </select>
            </label>
            <label>
              {t('page.sort_by')}
              <select value={filters.sort} onChange={event => updateFilter('sort', event.target.value)}>
                <option value="recommended">{t('page.sort_recommended')}</option>
                <option value="recent">{t('page.sort_recent')}</option>
                <option value="time_asc">{t('page.sort_time_asc')}</option>
                <option value="time_desc">{t('page.sort_time_desc')}</option>
              </select>
            </label>
            <label className="discovery-saved-filter">
              <input type="checkbox" checked={filters.saved} onChange={event => updateFilter('saved', event.target.checked)} />
              {t('page.saved_only')}
            </label>
          </div>
        )}
        {hasFilters && (
          <div className="discovery-filter-summary">
            <span>
              {t('page.filter_summary', {
                count: filtered.length,
                storyLabel: filtered.length === 1 ? 'story' : 'stories',
              })}
              {filters.saved ? t('page.filter_summary_saved') : ''}
              {filters.duration !== 'All' ? ` · ${
                filters.duration === 'short'
                  ? t('page.duration_short')
                  : filters.duration === 'medium'
                  ? t('page.duration_medium')
                  : t('page.duration_long')
              }` : ''}
            </span>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              {t('page.clear_filters')}
            </Button>
          </div>
        )}
      </section>
      <div className="discovery-content">
        <div className="discovery-stories">
          {currentPage === 1 && editorial.length > 0 && (
            <section className="discovery-feature" aria-label={t('page.featured_heading')}>
              <h2 className="sr-only">{t('page.featured_heading')}</h2>
              <EditorialStory {...storyProps} lesson={editorial[0]} variant="lead" saved={!!bookmarks[editorial[0].id]} />
              <div className="discovery-supporting">
                {editorial.slice(1).map(lesson => (
                  <EditorialStory key={lesson.id} {...storyProps} lesson={lesson} variant="support" saved={!!bookmarks[lesson.id]} />
                ))}
              </div>
            </section>
          )}
          <section aria-labelledby="discovery-results-heading">
            <div className="discovery-section-heading">
              <h2 id="discovery-results-heading" ref={resultsHeading} tabIndex={-1}>
                {hasFilters ? t('page.results_heading') : t('page.explore_heading')}
              </h2>
              <span aria-live="polite">
                {t('page.stories_count', { count: remaining.length })}
              </span>
            </div>
            {visible.length > 0 ? (
              <div className="discovery-story-grid">
                {visible.map(lesson => (
                  <EditorialStory key={lesson.id} {...storyProps} lesson={lesson} saved={!!bookmarks[lesson.id]} />
                ))}
              </div>
            ) : (
              <div className="discovery-empty">
                <h3>{filters.saved ? t('page.empty_saved_title') : t('page.empty_title')}</h3>
                <p>{filters.saved ? t('page.empty_saved_desc') : t('page.empty_desc')}</p>
                <Button variant="outline" onClick={resetFilters}>
                  {t('page.view_all_stories')}
                </Button>
              </div>
            )}
            {pageCount > 1 && (
              <nav className="discovery-pagination" aria-label={t('page.pagination_aria')}>
                <Button variant="ghost" size="sm" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
                  <ArrowLeft size={18} />
                  {t('page.pagination_prev')}
                </Button>
                <span aria-live="polite">{currentPage} / {pageCount}</span>
                <Button variant="ghost" size="sm" disabled={currentPage === pageCount} onClick={() => changePage(currentPage + 1)}>
                  {t('page.pagination_next')}
                  <ArrowRight size={18} />
                </Button>
              </nav>
            )}
          </section>
        </div>
      </div>
      <div className="discovery-catalog-status" role="status">
        {catalogState === 'loading' ? (
          t('page.status_updating')
        ) : catalogState === 'offline' ? (
          <>
            <span>{t('page.status_offline')}</span>
            <Button variant="ghost" size="sm" onClick={() => setRetry(value => value + 1)}>
              {t('page.retry')}
            </Button>
          </>
        ) : null}
      </div>
      <p className="sr-only" role="status">{saveMessage}</p>
    </div>
  );
}