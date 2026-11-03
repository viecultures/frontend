import { API_BASE_URL } from '@/config/apiConfig';
import { getStoredToken } from '@/utils/auth-storage';

export interface LiveSessionCredentials {
  apiKey: string;
  model?: string;
}

export interface LiveSessionApiResponse {
  success: boolean;
  data?: LiveSessionCredentials;
  message?: string;
  errorCode?: string;
}

let cachedLiveApiKey: string | null = null;

export const getCachedLiveApiKey = (): string | null => cachedLiveApiKey;

export const setCachedLiveApiKey = (key: string | null): void => {
  cachedLiveApiKey = key;
};

export async function fetchLiveSessionCredentials(): Promise<string> {
  const token = getStoredToken();
  if (!token) {
    throw new Error('Vui lòng đăng nhập để sử dụng tính năng Voice Chat hoặc nhập API key trong Cài đặt.');
  }

  const response = await fetch(`${API_BASE_URL}/api/voice/live-session`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const body: LiveSessionApiResponse = await response.json();
  if (!response.ok || !body.success || !body.data?.apiKey) {
    throw new Error(body.message || 'Không thể lấy thông tin phiên thoại từ máy chủ.');
  }

  cachedLiveApiKey = body.data.apiKey;
  return body.data.apiKey;
}
