import { API_BASE_URL } from '@/config/apiConfig';
import { getStoredToken } from '@/utils/auth-storage';
import type { ApiResponseEnvelope } from '../types/adminTypes';

export interface ActivityLogItemDto {
  id: string;
  userId?: string | null;
  userEmail?: string | null;
  anonymousSessionId?: string | null;
  eventType: string;
  eventCategory: string;
  path?: string | null;
  payload?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export interface ActivityLogPageResponse {
  content: ActivityLogItemDto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface TopMetricItemDto {
  key: string;
  label: string;
  count: number;
}

export interface ActivityStatsSummaryDto {
  totalLogs: number;
  categoryCounts: Record<string, number>;
  eventTypeCounts: Record<string, number>;
  topReadPosts: TopMetricItemDto[];
  topLookedUpWords: TopMetricItemDto[];
}

export interface ActivityLogFilterParams {
  eventType?: string;
  eventCategory?: string;
  userId?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}

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

export const adminActivityLogService = {
  /**
   * Lấy danh sách nhật ký hành vi phân trang và lọc
   * GET /api/v1/admin/activity-logs
   */
  async getLogs(params?: ActivityLogFilterParams): Promise<ActivityLogPageResponse> {
    const query = new URLSearchParams();
    if (params?.eventType) query.append('eventType', params.eventType);
    if (params?.eventCategory) query.append('eventCategory', params.eventCategory);
    if (params?.userId) query.append('userId', params.userId);
    if (params?.search) query.append('search', params.search);
    if (params?.fromDate) query.append('fromDate', params.fromDate);
    if (params?.toDate) query.append('toDate', params.toDate);
    if (params?.page !== undefined) query.append('page', String(params.page));
    if (params?.size !== undefined) query.append('size', String(params.size));
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.direction) query.append('direction', params.direction);

    const queryString = query.toString();
    const url = `${API_BASE_URL}/api/v1/admin/activity-logs${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Lỗi tải nhật ký hoạt động (HTTP ${res.status})`);
    }

    const envelope: ApiResponseEnvelope<ActivityLogPageResponse> = await res.json();
    return envelope.data;
  },

  /**
   * Lấy thống kê tổng quan nhật ký hoạt động
   * GET /api/v1/admin/activity-logs/stats
   */
  async getStatsSummary(): Promise<ActivityStatsSummaryDto> {
    const url = `${API_BASE_URL}/api/v1/admin/activity-logs/stats`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Lỗi tải thống kê nhật ký hoạt động (HTTP ${res.status})`);
    }

    const envelope: ApiResponseEnvelope<ActivityStatsSummaryDto> = await res.json();
    return envelope.data;
  },
};
