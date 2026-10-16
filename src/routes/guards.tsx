import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getStoredUser, getStoredToken, getUserRole } from '@/utils/auth-storage';
import { PATHS } from './paths';

interface GuardProps {
  children: React.ReactElement;
}

/**
 * Ensures the user is logged in. If not, redirects to /login with redirect parameter.
 */
export const RequireAuth: React.FC<GuardProps> = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = !!getStoredUser() || !!getStoredToken();

  if (!isLoggedIn) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${PATHS.login}?redirect=${redirect}`} replace />;
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

  if (!isLoggedIn) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${PATHS.login}?redirect=${redirect}`} replace />;
  }

  const userRole = getUserRole()?.toUpperCase() || '';
  const targetRole = role.toUpperCase();
  const hasRole =
    userRole === targetRole ||
    userRole === `ROLE_${targetRole}` ||
    (targetRole.startsWith('ROLE_') && userRole === targetRole.replace('ROLE_', ''));

  if (!hasRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

/**
 * Restricts access to guest users only. If logged in, redirects to /home.
 */
export const GuestOnly: React.FC<GuardProps> = ({ children }) => {
  const isLoggedIn = !!getStoredUser() || !!getStoredToken();

  if (isLoggedIn) {
    return <Navigate to={PATHS.home} replace />;
  }

  return children;
};
