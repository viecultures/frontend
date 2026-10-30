import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { useSettings } from '@/context/SettingsContext';
import { getActiveView } from './layout-helpers';
import type { AppUser } from '@/utils/auth-storage';

interface LayoutProps {
  isLoggedIn?: boolean;
  user?: AppUser | null;
  onLogout?: () => void;
}

export const AppLayout: React.FC<LayoutProps> = ({ isLoggedIn = false, user, onLogout }) => {
  const location = useLocation();
  const navigate = useAppNavigate();
  const activeView = getActiveView(location.pathname);
  const { openSettings } = useSettings();

  return (
    <>
      <Navbar
        activeView={activeView}
        isLoggedIn={isLoggedIn}
        user={user}
        onNavigateToSection={(to) => navigate(to)}
        onLogout={onLogout}
        onOpenSettings={openSettings}
      />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default AppLayout;
