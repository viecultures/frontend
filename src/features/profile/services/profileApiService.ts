import { getStoredToken, getStoredUser, setStoredUser, type AppUser } from '@/utils/auth-storage';
import type { UserProfileData } from '../types';
import { API_BASE_URL } from '@/config/apiConfig';
import { isLocalAuthMode } from '@/config/authConfig';

export interface BackendUserInfo {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: string;
  authProvider?: string;
  englishLevel?: string;
  createdAt?: string;
}

export interface BackendApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  timestamp?: string;
}

export const profileApiService = {
  /**
   * Truy xuất hồ sơ tài khoản từ endpoint Spring Boot: GET /api/v1/auth/me
   * Nếu server offline hoặc token không có/hết hạn -> trả về null để client dùng LocalStorage mượt mà.
   */
  async fetchCurrentUser(): Promise<BackendUserInfo | null> {
    if (isLocalAuthMode) return null;
    const token = getStoredToken();
    if (!token) {
      return null;
    }

    try {
      const endpoints = [
        `${API_BASE_URL}/api/v1/auth/me`,
        `${API_BASE_URL}/api/auth/me`,
      ];

      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const result: BackendApiResponse<BackendUserInfo> = await response.json();
            if (result && result.success && result.data) {
              // Đồng bộ ngược lại vào auth storage
              const currentStored = getStoredUser();
              const updatedUser: AppUser = {
                name: result.data.name || currentStored?.name || 'Học Viên',
                email: result.data.email || currentStored?.email || '',
                avatar: result.data.avatarUrl || currentStored?.avatar || 'NL',
                role: result.data.role || currentStored?.role,
              };
              setStoredUser(updatedUser);
              return result.data;
            }
          }
        } catch {
          // Endpoint này không phản hồi, thử endpoint tiếp theo
        }
      }

      return null;
    } catch (err) {
      console.warn('[profileApiService] Không thể kết nối tới server auth:', err);
      return null;
    }
  },

  /**
   * Ánh xạ thông tin từ Backend User sang định dạng UserProfileData của giao diện Profile.
   */
  mapBackendUserToProfile(backendUser: BackendUserInfo, currentProfile: UserProfileData): UserProfileData {
    let cefrLabel = currentProfile.targetCefr;
    if (backendUser.englishLevel) {
      cefrLabel = `${backendUser.englishLevel} - Mục tiêu học tập`;
    }

    let joinedYearMonth = currentProfile.joinedAt;
    if (backendUser.createdAt) {
      const date = new Date(backendUser.createdAt);
      if (!isNaN(date.getTime())) {
        joinedYearMonth = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      }
    }

    return {
      ...currentProfile,
      id: backendUser.id || currentProfile.id,
      name: backendUser.name || currentProfile.name,
      email: backendUser.email || currentProfile.email,
      avatar: backendUser.avatarUrl || currentProfile.avatar,
      currentLevel: backendUser.englishLevel ? `Level ${backendUser.englishLevel}` : currentProfile.currentLevel,
      targetCefr: cefrLabel,
      joinedAt: joinedYearMonth,
    };
  },
};
