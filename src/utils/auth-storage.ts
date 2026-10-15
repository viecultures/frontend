// Helper to manage demo user authentication and pro subscription status in localStorage

export interface AppUser {
  name: string;
  email: string;
  avatar?: string;
  isPro?: boolean;
}

const AUTH_USER_KEY = 'vie_current_user';
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
