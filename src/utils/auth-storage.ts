// Helper to manage demo user authentication and pro subscription status in localStorage

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
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: AppUser | null) => {
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
  window.dispatchEvent(new CustomEvent('auth:change'));
};

export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setStoredToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
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
  return user?.role || null;
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
  localStorage.setItem(PRO_STATUS_KEY, isPro ? 'true' : 'false');
  window.dispatchEvent(new CustomEvent('subscription:change', { detail: { isPro } }));
};
