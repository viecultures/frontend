import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { getActiveView } from './layout-helpers';
import type { AppUser } from '@/utils/auth-storage';

interface LayoutProps {
  isLoggedIn?: boolean;
  user?: AppUser | null;
  onLogout?: () => void;
}

export const StudyLayout: React.FC<LayoutProps> = ({ isLoggedIn = false, user, onLogout }) => {
  const location = useLocation();
  const navigate = useAppNavigate();
  const activeView = getActiveView(location.pathname);

  return (
    <>
      <Navbar
        activeView={activeView}
        isLoggedIn={isLoggedIn}
        user={user}
        onNavigateToSection={(to) => navigate(to)}
        onLogout={onLogout}
      />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </>
  );
};

export default StudyLayout;
