import type { LearningJourneyItem, LearningJourneyPayload } from '../types/adminTypes';
import { API_BASE_URL } from '@/config/apiConfig';
import { getStoredToken } from '@/utils/auth-storage';

const getAuthHeaders = (): Record<string, string> => {
  const token = getStoredToken();
  if (!token) throw new Error('Vui lòng đăng nhập trước khi thao tác hành trình học.');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
};

const getOptionalAuthHeaders = (): Record<string, string> => {
  const token = getStoredToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export interface JourneyFilterParams {
  region?: string;
  provinceId?: string;
  theme?: string;
  status?: string;
  query?: string;
}

export const journeyAdminService = {
  async getJourneys(params?: JourneyFilterParams): Promise<LearningJourneyItem[]> {
    const searchParams = new URLSearchParams();
    if (params?.region) searchParams.append('region', params.region);
    if (params?.provinceId) searchParams.append('provinceId', params.provinceId);
    if (params?.theme) searchParams.append('theme', params.theme);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.query) searchParams.append('query', params.query);

    const url = `${API_BASE_URL}/api/journeys${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const res = await fetch(url, {
      headers: getOptionalAuthHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Không thể tải danh sách hành trình học (HTTP ${res.status})`);
    }
    return res.json();
  },

  async getJourneyById(id: string): Promise<LearningJourneyItem> {
    const res = await fetch(`${API_BASE_URL}/api/journeys/${encodeURIComponent(id)}`, {
      headers: getOptionalAuthHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Không tìm thấy hành trình học ID: ${id}`);
    }
    return res.json();
  },

  async createJourney(payload: LearningJourneyPayload): Promise<LearningJourneyItem> {
    const res = await fetch(`${API_BASE_URL}/api/journeys`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Lỗi khi tạo hành trình học (HTTP ${res.status})`);
    }
    return res.json();
  },

  async updateJourney(id: string, payload: LearningJourneyPayload): Promise<LearningJourneyItem> {
    const res = await fetch(`${API_BASE_URL}/api/journeys/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Lỗi khi cập nhật hành trình học (HTTP ${res.status})`);
    }
    return res.json();
  },

  async deleteJourney(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE_URL}/api/journeys/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Lỗi khi xóa hành trình học ID: ${id}`);
    }
    return res.json();
  },
};
