import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getStoredUser, getStoredToken, getUserRole } from '@/utils/auth-storage';
import { PATHS, getLocalizedPath, resolveLanguage } from './paths';

interface GuardProps {
  children: React.ReactElement;
}

const getCurrentLanguage = (pathname: string) => {
  const match = pathname.match(/^\/(vi|en)(\/|$)/);
  return resolveLanguage(match ? match[1] : undefined);
};

/**
 * Ensures the user is logged in. If not, redirects to localized /login with redirect parameter.
 */
export const RequireAuth: React.FC<GuardProps> = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = !!getStoredUser() || !!getStoredToken();

  if (!isLoggedIn) {
    const lang = getCurrentLanguage(location.pathname);
    const localizedCurrentPath = getLocalizedPath(location.pathname, lang);
    const redirect = encodeURIComponent(localizedCurrentPath + location.search);
    const loginTarget = getLocalizedPath(PATHS.login, lang);
    return <Navigate to={`${loginTarget}?redirect=${redirect}`} replace />;
  }

  return children;
};

interface RequireRoleProps extends GuardProps {
  role: string;
  redirectTo?: string;
}

/**
 * Ensures the user possesses the specified role from JWT / user profile.
 */
export const RequireRole: React.FC<RequireRoleProps> = ({
  role,
  redirectTo = PATHS.home,
  children,
}) => {
  const location = useLocation();
  const isLoggedIn = !!getStoredUser() || !!getStoredToken();
  const lang = getCurrentLanguage(location.pathname);

  if (!isLoggedIn) {
    const localizedCurrentPath = getLocalizedPath(location.pathname, lang);
    const redirect = encodeURIComponent(localizedCurrentPath + location.search);
    const loginTarget = getLocalizedPath(PATHS.login, lang);
    return <Navigate to={`${loginTarget}?redirect=${redirect}`} replace />;
  }

  const userRole = getUserRole()?.toUpperCase() || '';
  const targetRole = role.toUpperCase();
  const hasRole =
    userRole === targetRole ||
    userRole === `ROLE_${targetRole}` ||
    (targetRole.startsWith('ROLE_') && userRole === targetRole.replace('ROLE_', ''));

  if (!hasRole) {
    return <Navigate to={getLocalizedPath(redirectTo, lang)} replace />;
  }

  return children;
};

/**
 * Restricts access to guests, preserving a local return URL after authentication.
 */
export const GuestOnly: React.FC<GuardProps> = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = !!getStoredUser() || !!getStoredToken();
  const lang = getCurrentLanguage(location.pathname);

  if (isLoggedIn) {
    const rawRedirect = new URLSearchParams(location.search).get('redirect');
    const redirect = rawRedirect ? decodeURIComponent(rawRedirect) : null;
    const isSafeInternal = Boolean(
      redirect &&
      redirect.startsWith('/') &&
      !redirect.startsWith('//') &&
      !redirect.includes('/login')
    );
    const destination: string = isSafeInternal && redirect
      ? redirect
      : getLocalizedPath(PATHS.home, lang);
    return <Navigate to={destination} replace />;
  }

  return children;
};
