import { API_BASE_URL } from '@/config/apiConfig';
import { JOURNEY_SERIES, type JourneySeries } from '@/data/series';

export interface BackendChapterSummary {
  id: string;
  chapterOrder: number;
  titleEn: string;
  titleVi?: string;
  summary?: string;
  readTime?: string;
  level?: string;
  imageUrl?: string;
}

export interface BackendJourneyResponse {
  id: string;
  titleEn: string;
  titleVi: string;
  theme: string;
  provinceId: string;
  region: string;
  description?: string;
  imageUrl?: string;
  status: string;
  scheduledPublishAt?: string;
  createdAt?: string;
  chapters?: BackendChapterSummary[];
}

export interface JourneyFilterQuery {
  region?: string;
  provinceId?: string;
  theme?: string;
  status?: string;
}

export function mapBackendJourneyToSeries(item: BackendJourneyResponse): JourneySeries {
  return {
    id: item.id,
    title: item.titleEn,
    titleVi: item.titleVi,
    theme: (item.theme === 'places' || item.theme === 'cuisine' ? item.theme : 'cuisine') as 'cuisine' | 'places',
    provinceId: item.provinceId,
    region: item.region,
    description: item.description || '',
    imageUrl: item.imageUrl || '',
    status: item.status || 'published',
    scheduledPublishAt: item.scheduledPublishAt,
    chapters: (item.chapters || []).map(ch => ({
      id: ch.id,
      title: ch.titleEn,
      titleVi: ch.titleVi,
      summary: ch.summary || '',
      summaryVi: ch.titleVi || '',
      order: ch.chapterOrder,
      readTime: ch.readTime || '5 min',
      preferredLevel: ch.level === 'A1' || ch.level === 'A2' ? 'Level 1' : ch.level === 'C1' || ch.level === 'C2' ? 'Level 3' : 'Level 2',
    })),
  };
}

export const journeyApiService = {
  async getJourneys(params?: JourneyFilterQuery): Promise<JourneySeries[]> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.region) searchParams.append('region', params.region);
    if (params?.provinceId) searchParams.append('provinceId', params.provinceId);
    if (params?.theme) searchParams.append('theme', params.theme);

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/api/journeys${queryString ? `?${queryString}` : ''}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        console.warn(`[journeyApiService] Failed to fetch journeys (HTTP ${res.status}), using mock fallback.`);
        return JOURNEY_SERIES;
      }

      const data: BackendJourneyResponse[] = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        return JOURNEY_SERIES;
      }

      return data.map(mapBackendJourneyToSeries);
    } catch (error) {
      console.warn('[journeyApiService] Error fetching journeys from backend, falling back to mock data:', error);
      return JOURNEY_SERIES;
    }
  },

  async getJourneyById(id: string): Promise<JourneySeries | null> {
    const url = `${API_BASE_URL}/api/journeys/${encodeURIComponent(id)}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const fallback = JOURNEY_SERIES.find(s => s.id === id);
        return fallback || null;
      }

      const data: BackendJourneyResponse = await res.json();
      return mapBackendJourneyToSeries(data);
    } catch (error) {
      console.warn(`[journeyApiService] Error fetching journey ${id}, checking mock fallback:`, error);
      const fallback = JOURNEY_SERIES.find(s => s.id === id);
      return fallback || null;
    }
  },
};
