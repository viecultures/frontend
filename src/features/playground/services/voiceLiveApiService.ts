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
    const msg = 'Vui lòng đăng nhập để sử dụng tính năng Voice Chat hoặc nhập API key trong Cài đặt.';
    console.warn('[voiceLiveApiService] fetchLiveSessionCredentials: Chưa đăng nhập, không có auth token');
    throw new Error(msg);
  }

  try {
    console.log('[voiceLiveApiService] Đang gọi GET /api/voice/live-session...');
    const response = await fetch(`${API_BASE_URL}/api/voice/live-session`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const body: LiveSessionApiResponse = await response.json();
    if (!response.ok || !body.success || !body.data?.apiKey) {
      const errorMsg = body.message || `Lỗi máy chủ (${response.status}): Không thể lấy thông tin phiên thoại.`;
      console.error('[voiceLiveApiService] fetchLiveSessionCredentials thất bại:', {
        status: response.status,
        success: body.success,
        errorCode: body.errorCode,
        message: body.message,
      });
      throw new Error(errorMsg);
    }

    console.log('[voiceLiveApiService] fetchLiveSessionCredentials thành công, đã nhận Gemini key');
    cachedLiveApiKey = body.data.apiKey;
    return body.data.apiKey;
  } catch (err) {
    console.error('[voiceLiveApiService] Lỗi ngoại lệ khi fetchLiveSessionCredentials:', err);
    throw err;
  }
}
