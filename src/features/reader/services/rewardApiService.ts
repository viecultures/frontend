import { getApiBaseUrl } from '@/config/apiConfig';
import { getStoredToken } from '@/utils/auth-storage';
import type {
  ApiResponse,
  ReadConfirmationResponse,
  StoryRewardStatusResponse,
  StampClaimResponse,
  StoryStampDto,
  FoodJourneyProgressDto,
  FoodStickerAwardDto,
} from '../types/rewardTypes';

export class RewardApiError extends Error {
  statusCode: number;
  errorCode?: string;

  constructor(message: string, statusCode: number, errorCode?: string) {
    super(message);
    this.name = 'RewardApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

async function requestWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const token = getStoredToken();

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  const envelope: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    message: `Không thể đọc phản hồi từ máy chủ (HTTP ${response.status})`,
  } as ApiResponse<T>));

  if (!response.ok || !envelope.success) {
    const message = envelope.message || `Lỗi máy chủ phần thưởng (HTTP ${response.status})`;
    throw new RewardApiError(message, response.status, envelope.errorCode);
  }

  return envelope.data;
}

export const rewardApiService = {
  /**
   * 1. Xác nhận đọc bài viết đầu tiên cho Canonical Story (POST /api/v1/reader/confirm-read)
   */
  async confirmRead(articleId: string, signal?: AbortSignal): Promise<ReadConfirmationResponse> {
    return requestWithAuth<ReadConfirmationResponse>('/api/v1/reader/confirm-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ articleId: articleId.trim() }),
      signal,
    });
  },

  /**
   * 2. Nhận Mộc Son v2 cho câu chuyện đã đọc (POST /api/v1/rewards/stories/{storyId}/claim)
   */
  async claimStoryStamp(storyId: string, signal?: AbortSignal): Promise<StampClaimResponse> {
    return requestWithAuth<StampClaimResponse>(
      `/api/v1/rewards/stories/${encodeURIComponent(storyId.trim())}/claim`,
      {
        method: 'POST',
        signal,
      }
    );
  },

  /**
   * 3. Lấy trạng thái phần thưởng của câu chuyện (GET /api/v1/rewards/stories/{storyId}/status)
   * Cho phép gọi public hoặc authenticated.
   */
  async getStoryRewardStatus(storyId: string, signal?: AbortSignal): Promise<StoryRewardStatusResponse> {
    return requestWithAuth<StoryRewardStatusResponse>(
      `/api/v1/rewards/stories/${encodeURIComponent(storyId.trim())}/status`,
      {
        method: 'GET',
        signal,
      }
    );
  },

  /**
   * 4. Lấy danh sách Mộc Son đã nhận của người dùng (GET /api/v1/rewards/stamps)
   */
  async getUserStamps(signal?: AbortSignal): Promise<StoryStampDto[]> {
    return requestWithAuth<StoryStampDto[]>('/api/v1/rewards/stamps', {
      method: 'GET',
      signal,
    });
  },

  /**
   * 5. Lấy tiến trình hành trình ẩm thực của người dùng (GET /api/v1/rewards/foods)
   */
  async getUserFoodProgress(signal?: AbortSignal): Promise<FoodJourneyProgressDto[]> {
    return requestWithAuth<FoodJourneyProgressDto[]>('/api/v1/rewards/foods', {
      method: 'GET',
      signal,
    });
  },

  /**
   * 6. Đối soát & cấp bù Tem Món Ăn nếu đã đủ Mộc Son (POST /api/v1/rewards/foods/{foodId}/reconcile)
   */
  async reconcileFoodSticker(foodId: string, signal?: AbortSignal): Promise<FoodStickerAwardDto> {
    return requestWithAuth<FoodStickerAwardDto>(
      `/api/v1/rewards/foods/${encodeURIComponent(foodId.trim())}/reconcile`,
      {
        method: 'POST',
        signal,
      }
    );
  },
};
