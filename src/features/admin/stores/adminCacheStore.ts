import { create } from 'zustand';
import type {
  ReadingPostItem,
  AdminUserItem,
  LearningJourneyItem,
  PaginatedResponse,
} from '../types/adminTypes';
import type { AdminVocabItem, PageResponse } from '../types/adminVocabTypes';
import type { AdminOverviewStats } from '../services/adminOverviewService';

const DEFAULT_CACHE_TTL_MS = 2 * 60 * 1000; // 2 phút

interface TimedEntry<T> {
  data: T;
  fetchedAt: number;
}

function getValidEntry<T>(
  map: Record<string, TimedEntry<T>>,
  key: string,
  ttlMs = DEFAULT_CACHE_TTL_MS
): T | null {
  const entry = map[key];
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > ttlMs) return null;
  return entry.data;
}

function setEntry<T>(
  map: Record<string, TimedEntry<T>>,
  key: string,
  data: T
): Record<string, TimedEntry<T>> {
  return { ...map, [key]: { data, fetchedAt: Date.now() } };
}

/**
 * Safely resolve `location.state.returnTo` (prevents open redirects).
 */
export function resolveReturnTo(locationState: unknown, fallback: string): string {
  const raw = (locationState as { returnTo?: unknown } | null)?.returnTo;
  if (typeof raw === 'string' && raw.startsWith('/') && !raw.startsWith('//')) {
    return raw;
  }
  return fallback;
}

interface AdminCacheState {
  postsByKey: Record<string, TimedEntry<ReadingPostItem[]>>;
  usersByKey: Record<string, TimedEntry<PaginatedResponse<AdminUserItem>>>;
  journeysByKey: Record<string, TimedEntry<LearningJourneyItem[]>>;
  vocabsByKey: Record<string, TimedEntry<PageResponse<AdminVocabItem>>>;
  genericByKey: Record<string, TimedEntry<unknown>>;
  overviewCache: TimedEntry<AdminOverviewStats> | null;
  totalUsersCount: number | null;
  scrollPositions: Record<string, number>;

  getCachedPosts: (key: string, ttlMs?: number) => ReadingPostItem[] | null;
  setCachedPosts: (key: string, items: ReadingPostItem[]) => void;
  removePostFromCache: (postId: string) => void;
  invalidatePosts: () => void;

  getCachedUsers: (key: string, ttlMs?: number) => PaginatedResponse<AdminUserItem> | null;
  setCachedUsers: (key: string, data: PaginatedResponse<AdminUserItem>) => void;
  invalidateUsers: () => void;

  getCachedJourneys: (key: string, ttlMs?: number) => LearningJourneyItem[] | null;
  setCachedJourneys: (key: string, items: LearningJourneyItem[]) => void;
  invalidateJourneys: () => void;

  getCachedVocabs: (key: string, ttlMs?: number) => PageResponse<AdminVocabItem> | null;
  setCachedVocabs: (key: string, data: PageResponse<AdminVocabItem>) => void;
  invalidateVocabs: () => void;

  getCachedTabData: <T>(key: string, ttlMs?: number) => T | null;
  setCachedTabData: <T>(key: string, data: T) => void;
  invalidateTabData: (prefix: string) => void;

  getCachedOverview: (ttlMs?: number) => AdminOverviewStats | null;
  setCachedOverview: (data: AdminOverviewStats) => void;

  setTotalUsersCount: (count: number) => void;

  saveScrollPosition: (routeKey: string, y: number) => void;
  consumeScrollPosition: (routeKey: string) => number | null;
}

export const useAdminCacheStore = create<AdminCacheState>((set, get) => ({
  postsByKey: {},
  usersByKey: {},
  journeysByKey: {},
  vocabsByKey: {},
  genericByKey: {},
  overviewCache: null,
  totalUsersCount: null,
  scrollPositions: {},

  getCachedPosts: (key, ttlMs) => getValidEntry(get().postsByKey, key, ttlMs),
  setCachedPosts: (key, items) => set((s) => ({ postsByKey: setEntry(s.postsByKey, key, items) })),
  removePostFromCache: (postId) => {
    set((state) => {
      const next: Record<string, TimedEntry<ReadingPostItem[]>> = {};
      for (const [k, entry] of Object.entries(state.postsByKey)) {
        next[k] = { ...entry, data: entry.data.filter((p) => p.id !== postId) };
      }
      return { postsByKey: next, overviewCache: null };
    });
  },
  invalidatePosts: () => set({ postsByKey: {}, overviewCache: null }),

  getCachedUsers: (key, ttlMs) => getValidEntry(get().usersByKey, key, ttlMs),
  setCachedUsers: (key, data) => set((s) => ({ usersByKey: setEntry(s.usersByKey, key, data) })),
  invalidateUsers: () => set({ usersByKey: {} }),

  getCachedJourneys: (key, ttlMs) => getValidEntry(get().journeysByKey, key, ttlMs),
  setCachedJourneys: (key, items) =>
    set((s) => ({ journeysByKey: setEntry(s.journeysByKey, key, items) })),
  invalidateJourneys: () => set({ journeysByKey: {} }),

  getCachedVocabs: (key, ttlMs) => getValidEntry(get().vocabsByKey, key, ttlMs),
  setCachedVocabs: (key, data) => set((s) => ({ vocabsByKey: setEntry(s.vocabsByKey, key, data) })),
  invalidateVocabs: () => set({ vocabsByKey: {} }),

  getCachedTabData: <T,>(key: string, ttlMs?: number) =>
    getValidEntry(get().genericByKey as Record<string, TimedEntry<T>>, key, ttlMs),
  setCachedTabData: <T,>(key: string, data: T) =>
    set((s) => ({ genericByKey: setEntry(s.genericByKey, key, data) })),
  invalidateTabData: (prefix: string) =>
    set((s) => {
      const next: Record<string, TimedEntry<unknown>> = {};
      for (const [k, v] of Object.entries(s.genericByKey)) {
        if (!k.startsWith(prefix)) next[k] = v;
      }
      return { genericByKey: next };
    }),

  getCachedOverview: (ttlMs = DEFAULT_CACHE_TTL_MS) => {
    const entry = get().overviewCache;
    if (!entry) return null;
    if (Date.now() - entry.fetchedAt > ttlMs) return null;
    return entry.data;
  },
  setCachedOverview: (data) => set({ overviewCache: { data, fetchedAt: Date.now() } }),

  setTotalUsersCount: (count) => set({ totalUsersCount: count }),

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
