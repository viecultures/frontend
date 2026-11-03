import type { ApiResponseEnvelope } from '../types/adminTypes';
import { getStoredToken } from '@/utils/auth-storage';
import { API_BASE_URL } from '@/config/apiConfig';

export interface AdminOverviewStats {
  totalUsers: number;
  activeLearnersWeek: number;
  totalPosts: number;
  publishedPosts: number;
  totalReads: number;
  avgReadsPerPost: number;
  cefrCoverage: Record<string, number>;
  regionCoverage: Record<string, number>;
  systemStatus: string;
}

export const adminOverviewService = {
  /**
   * Lấy dữ liệu thống kê tổng quan hệ thống từ backend GET /api/v1/admin/overview
   */
  async getOverview(): Promise<AdminOverviewStats> {
    const token = getStoredToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/admin/overview`, {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Lỗi tải thống kê tổng quan (HTTP ${res.status})`);
    }

    const json: ApiResponseEnvelope<AdminOverviewStats> = await res.json();
    return json.data;
  },
};
