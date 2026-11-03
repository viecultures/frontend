import type {
  SubscriptionPlanItem,
  SubscriptionTransactionItem,
  SubscriptionMetricsStats,
  SubscriptionTierCode,
} from '../types/adminSubscriptionTypes';
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
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const adminSubscriptionService = {
  /**
   * Lấy các chỉ số KPI vận hành & doanh thu gói đăng ký từ cơ sở dữ liệu
   */
  async getMetrics(): Promise<SubscriptionMetricsStats> {
    try {
      const url = `${API_BASE_URL}/api/v1/admin/subscriptions/metrics`;
      const res = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể tải dữ liệu chỉ số (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<SubscriptionMetricsStats> = await res.json();
      const data = json.data;

      // Defensive fallback đảm bảo không null
      return {
        totalRevenueVnd: data?.totalRevenueVnd ?? 0,
        pendingCount: data?.pendingCount ?? 0,
        activeSubscribers: data?.activeSubscribers ?? 0,
        approvalRatePercent: data?.approvalRatePercent ?? 100,
        tierDistribution: data?.tierDistribution ?? {
          FREE: 0,
          STARTER: 0,
          PRO: 0,
          LIFETIME: 0,
        },
      };
    } catch (error) {
      console.error('[adminSubscriptionService.getMetrics] Lỗi khi tải chỉ số metrics:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách giao dịch chuyển khoản thực tế có tìm kiếm và bộ lọc
   */
  async getTransactions(
    statusFilter?: string,
    searchQuery?: string
  ): Promise<SubscriptionTransactionItem[]> {
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'ALL') {
        params.append('status', statusFilter);
      }
      if (searchQuery && searchQuery.trim() !== '') {
        params.append('query', searchQuery.trim());
      }

      const queryString = params.toString();
      const url = `${API_BASE_URL}/api/v1/admin/subscriptions/transactions${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể tải danh sách giao dịch (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<SubscriptionTransactionItem[]> = await res.json();
      return Array.isArray(json.data) ? json.data : [];
    } catch (error) {
      console.error('[adminSubscriptionService.getTransactions] Lỗi khi tải danh sách giao dịch:', error);
      throw error;
    }
  },

  /**
   * Duyệt đơn giao dịch chuyển khoản thủ công
   */
  async approveTransaction(id: string, note?: string): Promise<SubscriptionTransactionItem> {
    try {
      const url = `${API_BASE_URL}/api/v1/admin/subscriptions/transactions/${encodeURIComponent(id)}/approve`;
      const res = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ note: note?.trim() || '' }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể duyệt đơn giao dịch (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<SubscriptionTransactionItem> = await res.json();
      return json.data;
    } catch (error) {
      console.error(`[adminSubscriptionService.approveTransaction] Lỗi khi duyệt đơn ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Từ chối đơn giao dịch chuyển khoản kèm lý do
   */
  async rejectTransaction(id: string, reason: string): Promise<SubscriptionTransactionItem> {
    try {
      const url = `${API_BASE_URL}/api/v1/admin/subscriptions/transactions/${encodeURIComponent(id)}/reject`;
      const res = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason: reason.trim() }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể từ chối giao dịch (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<SubscriptionTransactionItem> = await res.json();
      return json.data;
    } catch (error) {
      console.error(`[adminSubscriptionService.rejectTransaction] Lỗi khi từ chối đơn ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Lấy danh sách toàn bộ các gói cước đăng ký từ cơ sở dữ liệu
   */
  async getPlans(): Promise<SubscriptionPlanItem[]> {
    try {
      const url = `${API_BASE_URL}/api/v1/admin/subscriptions/plans`;
      const res = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể tải danh sách gói cước (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<SubscriptionPlanItem[]> = await res.json();
      return Array.isArray(json.data) ? json.data : [];
    } catch (error) {
      console.error('[adminSubscriptionService.getPlans] Lỗi khi tải danh sách gói cước:', error);
      throw error;
    }
  },

  /**
   * Tạo mới hoặc cập nhật thông tin gói cước
   */
  async savePlan(plan: SubscriptionPlanItem): Promise<SubscriptionPlanItem> {
    try {
      const url = `${API_BASE_URL}/api/v1/admin/subscriptions/plans`;
      const res = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(plan),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể lưu thông tin gói cước (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<SubscriptionPlanItem> = await res.json();
      return json.data;
    } catch (error) {
      console.error('[adminSubscriptionService.savePlan] Lỗi khi lưu gói cước:', error);
      throw error;
    }
  },

  /**
   * Chuyển đổi trạng thái kích hoạt của gói cước
   */
  async togglePlanStatus(id: string): Promise<SubscriptionPlanItem> {
    try {
      const url = `${API_BASE_URL}/api/v1/admin/subscriptions/plans/${encodeURIComponent(id)}/toggle-status`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Không thể chuyển đổi trạng thái gói cước (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<SubscriptionPlanItem> = await res.json();
      return json.data;
    } catch (error) {
      console.error(`[adminSubscriptionService.togglePlanStatus] Lỗi khi đổi trạng thái gói ID ${id}:`, error);
      throw error;
    }
  },
};
