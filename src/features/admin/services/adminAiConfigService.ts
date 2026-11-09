import type {
  AiServiceConfigDto,
  CreateAiKeyPayload,
  UpdateAiKeyPayload,
  AiCostMetricsDto,
  AiUsageLogPageResponse,
  TestAiKeyResult,
  TestAiKeyPayload,
  SystemAiSettingsDto,
  UpdateSystemAiSettingsPayload,
  AiPromptConfigDto,
  UpdateAiPromptPayload,
} from '../types/adminAiTypes';
import { getStoredToken } from '@/utils/auth-storage';
import { API_BASE_URL } from '@/config/apiConfig';

interface ApiResponseEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
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

export const adminAiConfigService = {
  /**
   * Lấy danh sách toàn bộ cấu hình API Key AI trong hệ thống
   */
  async getKeys(): Promise<AiServiceConfigDto[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/ai-configs/keys`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể tải danh sách API Key (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<AiServiceConfigDto[]> = await res.json();
      return Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? (json as unknown as AiServiceConfigDto[]) : []);
    } catch (error) {
      console.error('[adminAiConfigService] Lỗi khi lấy danh sách Key:', error);
      throw error;
    }
  },

  /**
   * Thêm một API Key AI mới vào nhóm xoay vòng
   */
  async createKey(payload: CreateAiKeyPayload): Promise<AiServiceConfigDto> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/ai-configs/keys`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể tạo API Key (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<AiServiceConfigDto> = await res.json();
      return json?.data ?? (json as unknown as AiServiceConfigDto);
    } catch (error) {
      console.error('[adminAiConfigService] Lỗi khi tạo API Key:', error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin API Key (nhãn, mức ưu tiên, trạng thái kích hoạt)
   */
  async updateKey(id: string, payload: UpdateAiKeyPayload): Promise<AiServiceConfigDto> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/ai-configs/keys/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể cập nhật API Key (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<AiServiceConfigDto> = await res.json();
      return json?.data ?? (json as unknown as AiServiceConfigDto);
    } catch (error) {
      console.error('[adminAiConfigService] Lỗi khi cập nhật API Key:', error);
      throw error;
    }
  },

  /**
   * Xóa vĩnh viễn cấu hình API Key khỏi hệ thống
   */
  async deleteKey(id: string): Promise<void> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/ai-configs/keys/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể xóa API Key (HTTP ${res.status})`);
      }
    } catch (error) {
      console.error('[adminAiConfigService] Lỗi khi xóa API Key:', error);
      throw error;
    }
  },

  /**
   * Chuyển đổi trạng thái Bật / Tắt hoạt động của API Key
   */
  async toggleKey(id: string): Promise<AiServiceConfigDto> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/ai-configs/keys/${encodeURIComponent(id)}/toggle`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể bật/tắt API Key (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<AiServiceConfigDto> = await res.json();
      return json?.data ?? (json as unknown as AiServiceConfigDto);
    } catch (error) {
      console.error('[adminAiConfigService] Lỗi khi toggle API Key:', error);
      throw error;
    }
  },

  /**
   * Kiểm tra khả năng kết nối và đo độ trễ của API Key
   */
  async testKey(payload: TestAiKeyPayload): Promise<TestAiKeyResult> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/ai-configs/keys/test`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return {
          success: false,
          message: err.message || `Kiểm tra thất bại (HTTP ${res.status})`,
        };
      }

      const json: ApiResponseEnvelope<TestAiKeyResult> = await res.json();
      const result = json?.data ?? (json as unknown as TestAiKeyResult);
      return {
        success: Boolean(result?.success),
        message: result?.message || (result?.success ? 'Kết nối thành công!' : 'Kiểm tra không thành công.'),
        latencyMs: result?.latencyMs,
      };
    } catch (error) {
      console.error('[adminAiConfigService] Lỗi khi kiểm tra API Key:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi mạng khi kiểm tra kết nối',
      };
    }
  },

  /**
   * Lấy báo cáo tổng hợp chi phí và mức tiêu thụ tài nguyên AI
   */
  async getMetrics(): Promise<AiCostMetricsDto> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/ai-configs/metrics`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể tải dữ liệu chi phí AI (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<AiCostMetricsDto> = await res.json();
      const data = json?.data ?? (json as unknown as AiCostMetricsDto);

      return {
        totalEstimatedCostUsd: Number(data?.totalEstimatedCostUsd ?? 0),
        totalCalls: Number(data?.totalCalls ?? 0),
        todayCostUsd: Number(data?.todayCostUsd ?? 0),
        breakdownByService: Array.isArray(data?.breakdownByService)
          ? data.breakdownByService
          : [],
        recentDailyCosts: Array.isArray(data?.recentDailyCosts)
          ? data.recentDailyCosts
          : [],
      };
    } catch (error) {
      console.error('[adminAiConfigService] Lỗi khi tải chi phí AI:', error);
      throw error;
    }
  },

  /**
   * Lấy lịch sử log các lượt gọi AI có phân trang
   */
  async getLogs(page = 0, size = 10): Promise<AiUsageLogPageResponse> {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/admin/ai-configs/logs?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể tải lịch sử sử dụng AI (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<AiUsageLogPageResponse> = await res.json();
      const data = json?.data ?? (json as unknown as AiUsageLogPageResponse);

      return {
        content: Array.isArray(data?.content) ? data.content : [],
        totalElements: Number(data?.totalElements ?? 0),
        totalPages: Number(data?.totalPages ?? 0),
        size: Number(data?.size ?? size),
        number: Number(data?.number ?? page),
      };
    } catch (error) {
      console.error('[adminAiConfigService] Lỗi khi tải log sử dụng AI:', error);
      throw error;
    }
  },

  /**
   * Lấy cấu hình System AI Settings (active Gemini models, Azure region, options)
   */
  async getSettings(): Promise<SystemAiSettingsDto> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/ai-configs/settings`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể tải cấu hình AI settings (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<SystemAiSettingsDto> = await res.json();
      return json.data;
    } catch (error) {
      console.error('[adminAiConfigService] Lỗi khi tải AI settings:', error);
      throw error;
    }
  },

  /**
   * Cập nhật System AI Settings (active Gemini models, Azure region, tts provider)
   */
  async updateSettings(payload: UpdateSystemAiSettingsPayload): Promise<SystemAiSettingsDto> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/ai-configs/settings`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể cập nhật AI settings (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<SystemAiSettingsDto> = await res.json();
      return json.data;
    } catch (error) {
      console.error('[adminAiConfigService] Lỗi khi cập nhật AI settings:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách toàn bộ cấu hình Prompt hệ thống
   */
  async getPrompts(): Promise<AiPromptConfigDto[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/ai-configs/prompts`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể tải danh sách Prompts (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<AiPromptConfigDto[]> = await res.json();
      return Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? (json as unknown as AiPromptConfigDto[]) : []);
    } catch (error) {
      console.error('[adminAiConfigService] Lỗi khi lấy danh sách Prompts:', error);
      throw error;
    }
  },

  /**
   * Cập nhật nội dung Prompt hệ thống theo key
   */
  async updatePrompt(key: string, payload: UpdateAiPromptPayload): Promise<AiPromptConfigDto> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/ai-configs/prompts/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể cập nhật Prompt (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<AiPromptConfigDto> = await res.json();
      return json?.data ?? (json as unknown as AiPromptConfigDto);
    } catch (error) {
      console.error('[adminAiConfigService] Lỗi khi cập nhật Prompt:', error);
      throw error;
    }
  },

  /**
   * Khôi phục Prompt hệ thống về giá trị mặc định của hệ thống
   */
  async resetPrompt(key: string): Promise<AiPromptConfigDto> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/ai-configs/prompts/${encodeURIComponent(key)}/reset`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể khôi phục Prompt (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<AiPromptConfigDto> = await res.json();
      return json?.data ?? (json as unknown as AiPromptConfigDto);
    } catch (error) {
      console.error('[adminAiConfigService] Lỗi khi khôi phục Prompt:', error);
      throw error;
    }
  },
};
