import { getLessonStatsForLevel, type Lesson, type LevelType } from '@/data/discoveryData';
import type { CatalogLesson } from '@/features/reader/services/readerApiService';
import { ENGLISH_EDITORIAL, LOCAL_EDITORIAL, TOPIC_LABELS } from './editorial';

export type DiscoveryLesson = Lesson & { postIds?: Partial<Record<LevelType, string>> };
export const LEVEL_LABELS: Record<LevelType, string> = {
  'Level 1': 'Cơ bản', 'Level 2': 'Trung cấp', 'Level 3': 'Nâng cao',
};
export interface DiscoveryFilters {
  query: string;
  topic: string;
  level: string;
  duration: string;
  sort: string;
  saved: boolean;
  province: string;
}
export const DEFAULT_FILTERS: DiscoveryFilters = {
  query: '', topic: 'All', level: 'All', duration: 'All', sort: 'recommended', saved: false, province: '',
};
export const normalizeSearch = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase();

/** Catalog entries replace local versions without losing their geographical association. */
export function mergeCatalog(local: Lesson[], remote: CatalogLesson[], map: (item: CatalogLesson) => Lesson): DiscoveryLesson[] {
  const entries = new Map<string, DiscoveryLesson>(local.map(item => [item.id, item]));
  for (const item of remote) {
    const previous = entries.get(item.id);
    const mapped = map(item);
    const availableLevels = item.availableLevels?.length ? item.availableLevels : [item.primaryLevel || 'Level 2'];
    entries.set(item.id, {
      ...previous, ...mapped,
      provinceId: previous?.provinceId,
      availableLevels,
      cefrLevel: availableLevels.includes(mapped.cefrLevel) ? mapped.cefrLevel : availableLevels[0],
      postIds: Object.fromEntries(Object.entries(item.levelDetails || {}).map(([level, detail]) => [level, detail.postId])),
    });
  }
  return [...entries.values()];
}

export function activeLevel(lesson: DiscoveryLesson, level: string): LevelType {
  return lesson.availableLevels.includes(level as LevelType) ? level as LevelType : lesson.cefrLevel;
}

export function filterCatalog(catalog: DiscoveryLesson[], filters: DiscoveryFilters, bookmarks: Record<string, boolean>): DiscoveryLesson[] {
  const query = normalizeSearch(filters.query.trim());
  const result = catalog.filter(lesson => {
    const minutes = parseInt(getLessonStatsForLevel(lesson, activeLevel(lesson, filters.level)).readTime, 10);
    const localCopy = !lesson.isFromDatabase ? LOCAL_EDITORIAL[lesson.id] : undefined;
    const englishCopy = !lesson.isFromDatabase ? ENGLISH_EDITORIAL[lesson.id] : undefined;
    return (!query || normalizeSearch(`${lesson.title} ${lesson.vietnameseTitle} ${lesson.summary} ${lesson.categoryVi} ${localCopy?.title || ''} ${localCopy?.description || ''} ${englishCopy?.title || ''} ${englishCopy?.description || ''} ${TOPIC_LABELS[lesson.category]}`).includes(query))
      && (filters.topic === 'All' || lesson.category === filters.topic)
      && (filters.level === 'All' || lesson.availableLevels.includes(filters.level as LevelType))
      && (filters.duration === 'All' || (filters.duration === 'short' ? minutes <= 5 : filters.duration === 'medium' ? minutes > 5 && minutes <= 10 : minutes > 10))
      && (!filters.saved || bookmarks[lesson.id])
      && (!filters.province || lesson.provinceId === filters.province);
  });
  return result.sort((a, b) => {
    if (filters.sort.startsWith('time')) {
      const time = (item: DiscoveryLesson) => parseInt(getLessonStatsForLevel(item, activeLevel(item, filters.level)).readTime, 10) || 0;
      return filters.sort === 'time_asc' ? time(a) - time(b) : time(b) - time(a);
    }
    if (filters.sort === 'recommended') {
      const imagePriority = Number(Boolean(LOCAL_EDITORIAL[b.id]?.image || b.imageUrl)) - Number(Boolean(LOCAL_EDITORIAL[a.id]?.image || a.imageUrl));
      if (imagePriority) return imagePriority;
    }
    return b.dateAdded.localeCompare(a.dateAdded);
  });
}

/** Three distinct stories; supporting stories favour different topics. */
export function selectEditorial(catalog: DiscoveryLesson[]): DiscoveryLesson[] {
  const lead = catalog.find(item => item.featured) || catalog[0];
  if (!lead) return [];
  const selected = [lead];
  for (let index = 0; index < 2; index++) {
    const next = catalog.find(item => !selected.includes(item) && !selected.some(story => story.category === item.category))
      || catalog.find(item => !selected.includes(item));
    if (next) selected.push(next);
  }
  return selected;
}

export const readBookmarkState = (value: unknown): Record<string, boolean> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([, saved]) => saved === true));
};
