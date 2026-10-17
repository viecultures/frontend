import type {
  AdminUserItem,
  AdminUserFilterParams,
  PaginatedResponse,
  ApiResponseEnvelope,
} from '../types/adminTypes';
import { getStoredToken } from '@/utils/auth-storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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

export const adminUserService = {
  /**
   * Lấy danh sách người dùng có phân trang, lọc theo role, trạng thái và tìm kiếm
   */
  async getUsers(params?: AdminUserFilterParams): Promise<PaginatedResponse<AdminUserItem>> {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.append('query', params.query);
    if (params?.role) searchParams.append('role', params.role);
    if (params?.enabled !== undefined && params?.enabled !== '') {
      searchParams.append('enabled', String(params.enabled));
    }
    if (params?.page !== undefined) searchParams.append('page', String(params.page));
    if (params?.size !== undefined) searchParams.append('size', String(params.size));

    const url = `${API_BASE_URL}/api/v1/admin/users${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Không thể tải danh sách người dùng (HTTP ${res.status})`);
    }

    const json: ApiResponseEnvelope<PaginatedResponse<AdminUserItem>> = await res.json();
    return json.data;
  },

  /**
   * Lấy chi tiết thông tin một người dùng theo ID
   */
  async getUserById(id: string): Promise<AdminUserItem> {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/users/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Không tìm thấy người dùng ID: ${id}`);
    }

    const json: ApiResponseEnvelope<AdminUserItem> = await res.json();
    return json.data;
  },

  /**
   * Cập nhật trạng thái người dùng (Kích hoạt / Tạm khóa)
   */
  async updateUserStatus(id: string, enabled: boolean): Promise<AdminUserItem> {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/users/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ enabled }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Lỗi khi cập nhật trạng thái người dùng (HTTP ${res.status})`);
    }

    const json: ApiResponseEnvelope<AdminUserItem> = await res.json();
    return json.data;
  },

  /**
   * Cập nhật vai trò / phân quyền người dùng
   */
  async updateUserRole(id: string, role: string): Promise<AdminUserItem> {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Lỗi khi cập nhật vai trò người dùng (HTTP ${res.status})`);
    }

    const json: ApiResponseEnvelope<AdminUserItem> = await res.json();
    return json.data;
  },
};
