import { getApiBaseUrl } from '@/config/apiConfig';
import type { AppUser } from '@/utils/auth-storage';
import { isLocalAuthMode } from '@/config/authConfig';
import { localAuthService } from './localAuthService';

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
  accessToken?: string;
  token?: string;
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
  token: string | null;
  user: AppUser;
  expiresIn?: number;
}

async function authenticate(path: string, payload: Record<string, string>): Promise<AuthResult> {
  const baseUrl = getApiBaseUrl();

  const response = await fetch(`${baseUrl}/api/v1/auth/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
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
  const token = authData.accessToken || authData.token;
  const rawUser = authData.user;

  if (typeof token !== 'string' || !token.trim() || typeof rawUser?.email !== 'string' || !rawUser.email.trim()) {
    throw new Error('Phản hồi xác thực từ máy chủ không hợp lệ. Vui lòng thử lại.');
  }

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
}

export const backendAuthService = {
  login(email: string, password: string): Promise<AuthResult> {
    return authenticate('login', { email: email.trim(), password });
  },

  register(email: string, password: string, name: string): Promise<AuthResult> {
    return authenticate('register', { email: email.trim(), password, name: name.trim() });
  },

  loginWithGoogle(idToken: string): Promise<AuthResult> {
    return authenticate('google', { idToken });
  },
};

export const authService = isLocalAuthMode ? localAuthService : backendAuthService;
