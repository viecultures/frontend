import type { ApiResponseEnvelope } from '../types/adminTypes';
import { getStoredToken } from '@/utils/auth-storage';
import { API_BASE_URL } from '@/config/apiConfig';

export interface GoogleAnalyticsSummary {
  activeUsers: number;
  sessions: number;
  screenPageViews: number;
  averageSessionDuration: number;
}

export interface GoogleAnalyticsTimelinePoint {
  date: string;
  activeUsers: number;
  sessions: number;
  screenPageViews: number;
}

export interface GoogleAnalyticsTopPage {
  pagePath: string;
  pageTitle: string;
  screenPageViews: number;
}

export interface GoogleAnalyticsTrafficSource {
  source: string;
  medium: string;
  sessions: number;
  activeUsers: number;
}

export interface GoogleAnalyticsData {
  propertyId: string;
  summary: GoogleAnalyticsSummary;
  timeline: GoogleAnalyticsTimelinePoint[];
  topPages: GoogleAnalyticsTopPage[];
  trafficSources: GoogleAnalyticsTrafficSource[];
  dateRange?: string;
  liveData?: boolean;
  statusMessage?: string;
}

export interface GoogleSearchConsoleSummary {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GoogleSearchConsoleTimelinePoint {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GoogleSearchConsoleQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GoogleSearchConsolePage {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GoogleSearchConsoleDevice {
  device: string;
  clicks: number;
  impressions: number;
}

export interface GoogleSearchConsoleData {
  siteUrl: string;
  summary: GoogleSearchConsoleSummary;
  timeline: GoogleSearchConsoleTimelinePoint[];
  topQueries: GoogleSearchConsoleQuery[];
  topPages: GoogleSearchConsolePage[];
  devices: GoogleSearchConsoleDevice[];
  startDate?: string;
  endDate?: string;
  liveData?: boolean;
  statusMessage?: string;
}

export type AnalyticsRange = '7d' | '30d' | '90d';
export type SearchConsoleRange = '7d' | '28d' | '90d';

const getAuthHeaders = (): Record<string, string> => {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const adminGoogleService = {
  /**
   * Gọi trực tiếp API backend: GET /api/v1/admin/google/analytics?range=...
   * Kết nối luồng dữ liệu Google Analytics 4 thực tế.
   */
  async getAnalytics(range: AnalyticsRange = '30d'): Promise<GoogleAnalyticsData> {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/google/analytics?range=${range}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Lỗi khi tải dữ liệu Google Analytics 4 từ backend (HTTP ${res.status})`);
    }

    const json: ApiResponseEnvelope<GoogleAnalyticsData> = await res.json();
    if (!json || !json.data) {
      throw new Error('Dữ liệu phản hồi từ Google Analytics API không hợp lệ.');
    }

    return json.data;
  },

  /**
   * Gọi trực tiếp API backend: GET /api/v1/admin/google/search-console?range=...
   * Kết nối luồng dữ liệu Google Search Console thực tế.
   */
  async getSearchConsole(range: SearchConsoleRange = '28d'): Promise<GoogleSearchConsoleData> {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/google/search-console?range=${range}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Lỗi khi tải dữ liệu Google Search Console từ backend (HTTP ${res.status})`);
    }

    const json: ApiResponseEnvelope<GoogleSearchConsoleData> = await res.json();
    if (!json || !json.data) {
      throw new Error('Dữ liệu phản hồi từ Google Search Console API không hợp lệ.');
    }

    return json.data;
  },
};
