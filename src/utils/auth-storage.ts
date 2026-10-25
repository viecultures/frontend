// Authentication and subscription storage shared by the app shell and feature pages.

export interface AppUser {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  isPro?: boolean;
}

export interface JwtClaims {
  sub?: string;
  userId?: string | number;
  role?: string;
  roles?: string[] | string;
  name?: string;
  exp?: number;
  [key: string]: unknown;
}

const AUTH_USER_KEY = 'vie_current_user';
const AUTH_TOKEN_KEY = 'vie_auth_token';
const PRO_STATUS_KEY = 'vie_user_is_pro';

export const getStoredUser = (): AppUser | null => {
  try {
    const raw = globalThis.sessionStorage?.getItem(AUTH_USER_KEY) || localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const removeAuthStorage = () => {
  try {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(PRO_STATUS_KEY);
    
    // Xóa các key JWT / token / auth dự phòng hoặc legacy
    const knownAuthKeys = [
      'token',
      'jwt',
      'authToken',
      'accessToken',
      'access_token',
      'vie_token',
      'vie_jwt',
      'user',
      'currentUser',
      'auth',
      'viecultures_user_profile',
    ];
    knownAuthKeys.forEach((key) => localStorage.removeItem(key));

    [AUTH_USER_KEY, AUTH_TOKEN_KEY, PRO_STATUS_KEY, ...knownAuthKeys]
      .forEach((key) => sessionStorage.removeItem(key));
  } catch (err) {
    console.error('[auth-storage] Lỗi khi dọn dẹp bộ nhớ xác thực:', err);
  }
};

export const clearAuthStorage = () => {
  removeAuthStorage();
  window.dispatchEvent(new CustomEvent('auth:change'));
};

export const setAuthSession = (user: AppUser, token: string | null, rememberMe: boolean) => {
  removeAuthStorage();
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  if (token) storage.setItem(AUTH_TOKEN_KEY, token);
  window.dispatchEvent(new CustomEvent('auth:change'));
};

export const setStoredUser = (user: AppUser | null) => {
  if (user) {
    const storage = sessionStorage.getItem(AUTH_USER_KEY) ? sessionStorage : localStorage;
    storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
  }
  window.dispatchEvent(new CustomEvent('auth:change'));
};

export const getStoredToken = (): string | null => {
  try {
    return globalThis.sessionStorage?.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem('token') || localStorage.getItem('jwt');
  } catch {
    return null;
  }
};

export const setStoredToken = (token: string | null) => {
  if (token) {
    const storage = sessionStorage.getItem(AUTH_USER_KEY) ? sessionStorage : localStorage;
    storage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('jwt');
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  }
  window.dispatchEvent(new CustomEvent('auth:change'));
};

/**
 * Safely parse JWT payload without external library.
 */
export const parseJwt = (token: string): JwtClaims | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/**
 * Get active user's role from JWT claim or stored user profile.
 */
export const getUserRole = (): string | null => {
  const token = getStoredToken();
  if (token) {
    const claims = parseJwt(token);
    if (claims?.role) return claims.role;
    if (typeof claims?.roles === 'string') return claims.roles;
    if (Array.isArray(claims?.roles) && claims.roles.length > 0) return claims.roles[0];
  }
  const user = getStoredUser();
  if (user) {
    return user.role || 'ROLE_USER';
  }
  return null;
};

/**
 * Check if the current user has the ADMIN role.
 */
export const isAdminUser = (): boolean => {
  const role = getUserRole();
  if (!role) return false;
  const upper = role.toUpperCase();
  return upper === 'ADMIN' || upper === 'ROLE_ADMIN';
};

export const getIsProUser = (): boolean => {
  try {
    const val = localStorage.getItem(PRO_STATUS_KEY);
    return val === 'true';
  } catch {
    return false;
  }
};

export const setIsProUser = (isPro: boolean) => {
  try {
    localStorage.setItem(PRO_STATUS_KEY, isPro ? 'true' : 'false');
    const user = getStoredUser();
    if (user) {
      const updated = { ...user, isPro };
      const storage = globalThis.sessionStorage?.getItem(AUTH_USER_KEY) ? sessionStorage : localStorage;
      storage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
    }
    if (isPro) {
      resetAiDailyTurns();
    }
  } catch (err) {
    console.error('[auth-storage] Error setting Pro status:', err);
  }
  globalThis.window?.dispatchEvent(new CustomEvent('subscription:change', { detail: { isPro } }));
  globalThis.window?.dispatchEvent(new CustomEvent('auth:change'));
};

const AI_TURNS_KEY_PREFIX = 'vie_ai_turns_';
export const FREE_DAILY_AI_TURNS_LIMIT = 3;

export const getTodayKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getAiDailyTurnsUsed = (): number => {
  try {
    const key = `${AI_TURNS_KEY_PREFIX}${getTodayKey()}`;
    const raw = localStorage.getItem(key);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
};

export const incrementAiDailyTurns = (): number => {
  try {
    const key = `${AI_TURNS_KEY_PREFIX}${getTodayKey()}`;
    const current = getAiDailyTurnsUsed();
    const updated = current + 1;
    localStorage.setItem(key, String(updated));
    globalThis.window?.dispatchEvent(new CustomEvent('ai:quota:change', { detail: { used: updated } }));
    return updated;
  } catch {
    return 0;
  }
};

export const getAiRemainingTurns = (): number => {
  if (getIsProUser()) return Infinity;
  return Math.max(0, FREE_DAILY_AI_TURNS_LIMIT - getAiDailyTurnsUsed());
};

export const canSendAiTurn = (): boolean => {
  if (getIsProUser()) return true;
  return getAiDailyTurnsUsed() < FREE_DAILY_AI_TURNS_LIMIT;
};

export const resetAiDailyTurns = () => {
  try {
    const key = `${AI_TURNS_KEY_PREFIX}${getTodayKey()}`;
    localStorage.removeItem(key);
    globalThis.window?.dispatchEvent(new CustomEvent('ai:quota:change', { detail: { used: 0 } }));
  } catch {
    // no-op
  }
};
