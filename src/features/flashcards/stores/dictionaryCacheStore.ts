import { create } from 'zustand';
import type { Lesson } from '@/data/discoveryData';

const CACHE_TTL_MS = 2 * 60 * 1000;

export interface CatalogCacheEntry {
  lessons: Lesson[];
  totalElements: number;
  totalPages: number;
  topicCounts: Record<string, number>;
  fetchedAt: number;
}

interface DictionaryCacheState {
  catalogByKey: Record<string, CatalogCacheEntry>;
  scrollPositions: Record<string, number>;

  getCatalogEntry: (key: string) => CatalogCacheEntry | null;
  setCatalogEntry: (key: string, entry: Omit<CatalogCacheEntry, 'fetchedAt'>) => void;
  saveScrollPosition: (routeKey: string, y: number) => void;
  consumeScrollPosition: (routeKey: string) => number | null;
}

export const useDictionaryCacheStore = create<DictionaryCacheState>((set, get) => ({
  catalogByKey: {},
  scrollPositions: {},

  getCatalogEntry: (key) => {
    const entry = get().catalogByKey[key];
    if (!entry) return null;
    if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) return null;
    return entry;
  },

  setCatalogEntry: (key, entry) => {
    set((state) => ({
      catalogByKey: {
        ...state.catalogByKey,
        [key]: { ...entry, fetchedAt: Date.now() },
      },
    }));
  },

  saveScrollPosition: (routeKey, y) => {
    set((state) => ({
      scrollPositions: { ...state.scrollPositions, [routeKey]: y },
    }));
  },

  consumeScrollPosition: (routeKey) => {
    const y = get().scrollPositions[routeKey];
    if (typeof y !== 'number') return null;
    set((state) => {
      const next = { ...state.scrollPositions };
      delete next[routeKey];
      return { scrollPositions: next };
    });
    return y;
  },
}));
