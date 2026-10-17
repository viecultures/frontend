import { getApiBaseUrl } from '@/config/apiConfig';
import type { AppUser } from '@/utils/auth-storage';

export interface BackendUserInfo {
  id?: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role?: string;
  authProvider?: string;
  englishLevel?: string;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;
  user: BackendUserInfo;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
  timestamp?: string;
}

export interface AuthResult {
  token: string;
  user: AppUser;
  expiresIn?: number;
}

export const authService = {
  /**
   * Đăng nhập hoặc đăng ký Just-In-Time bằng Google ID Token
   */
  async loginWithGoogle(idToken: string): Promise<AuthResult> {
    const baseUrl = getApiBaseUrl() || (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');

    const response = await fetch(`${baseUrl}/api/v1/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    const envelope: ApiResponse<AuthResponse> = await response.json().catch(() => ({
      success: false,
      message: 'Không thể giải mã phản hồi từ máy chủ.',
    } as ApiResponse<AuthResponse>));

    if (!response.ok || !envelope.success || !envelope.data) {
      const errorMsg = envelope.message || `Lỗi xác thực máy chủ (HTTP ${response.status})`;
      throw new Error(errorMsg);
    }

    const authData = envelope.data;
    const token = authData.accessToken;
    const rawUser = authData.user;

    const mappedUser: AppUser = {
      name: rawUser.name || rawUser.email.split('@')[0] || 'Người học VieCultures',
      email: rawUser.email,
      avatar: rawUser.avatarUrl,
      role: rawUser.role || 'ROLE_USER',
    };

    return {
      token,
      user: mappedUser,
      expiresIn: authData.expiresIn,
    };
  },
};
