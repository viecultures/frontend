import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

import { SettingsModal } from './components/SettingsModal';
import { PwaInstallBanner } from './components/pwa';

// Layouts
import { AppLayout } from '@/layouts/AppLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { FocusLayout } from '@/layouts/FocusLayout';
import { StudyLayout } from '@/layouts/StudyLayout';

// Route Guards
import { RequireAuth, RequireRole, GuestOnly } from '@/routes/guards';

// Primary Entry Pages
import LandingPage from '@/features/landing/pages/landing';
import LoginPage from '@/features/auth/pages/login';

// Lazy-loaded Feature Pages (Bundle Optimization)
const HomePage = React.lazy(() => import('@/features/home/pages/home'));
const DiscoveryPage = React.lazy(() => import('@/features/discovery/pages/discovery'));
const ReaderPage = React.lazy(() => import('@/features/reader/pages/reader'));
const DictionaryPage = React.lazy(() => import('@/features/flashcards/pages/dictionary'));
const FlashcardStudyPage = React.lazy(() => import('@/features/flashcards/pages/flashcard-study'));
const CommunityPage = React.lazy(() => import('@/features/community/pages/community'));
const CommunityContestPage = React.lazy(() => import('@/features/community/pages/community-contest'));
const PlaygroundPage = React.lazy(() => import('@/features/playground/pages/playground'));
const AdminPage = React.lazy(() => import('@/features/admin/pages/AdminPage'));
const PricingPage = React.lazy(() => import('@/features/subscription/pages/PricingPage'));
const CheckoutPage = React.lazy(() => import('@/features/subscription/pages/CheckoutPage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

import { getStoredUser, setStoredUser, setStoredToken, type AppUser } from '@/utils/auth-storage';
import { PATHS } from '@/routes/paths';

// Redirect legacy /bilingual-reader or /loop routes to canonical /reader while preserving search query
const RedirectToReader: React.FC<{ defaultParams?: string }> = ({ defaultParams = '' }) => {
  const location = useLocation();
  const search = location.search || defaultParams;
  return <Navigate to={`${PATHS.reader}${search}`} replace />;
};

export const App: React.FC = () => {
  const navigate = useNavigate();

  const defaultUser: AppUser = { name: 'Ninh Thiên Luân', email: 'luanninh@viecultures.com', avatar: 'NL' };
  const [user, setUser] = useState<AppUser | null>(() => getStoredUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getStoredUser());

  useEffect(() => {
    const handleAuthChange = () => {
      const stored = getStoredUser();
      setUser(stored);
      setIsLoggedIn(!!stored);
    };
    window.addEventListener('auth:change', handleAuthChange);
    return () => window.removeEventListener('auth:change', handleAuthChange);
  }, []);

  const handleLoginSuccess = (customUserData?: { email?: string; name?: string }) => {
    const activeUser: AppUser = customUserData
      ? {
          name: customUserData.name || customUserData.email?.split('@')[0] || defaultUser.name,
          email: customUserData.email || defaultUser.email,
          avatar: (customUserData.name || customUserData.email || 'NL').substring(0, 2).toUpperCase(),
        }
      : defaultUser;
    setIsLoggedIn(true);
    setUser(activeUser);
    setStoredUser(activeUser);

    // Return to previous target URL if available
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect');
    if (redirectUrl && redirectUrl.startsWith('/') && !redirectUrl.startsWith('//')) {
      navigate(redirectUrl, { replace: true });
    } else {
      navigate(PATHS.home, { replace: true });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setStoredUser(null);
    setStoredToken(null);
    navigate(PATHS.landing);
  };

  return (
    <div className="min-h-screen bg-[#FBF7EE] dark:bg-[#0b1a17] text-[#3F5550] dark:text-[#FBF7EE] flex flex-col font-sans vn-pattern-bg">
      {/* Main Content Area with Route-driven Layouts */}
      <React.Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#1E4B43]/20 border-t-[#1E4B43] rounded-full animate-spin" />
          </div>
        }
      >
        <Routes>
          {/* 1. Public Landing Layout */}
          <Route element={<PublicLayout />}>
            <Route path={PATHS.landing} element={<LandingPage />} />
            <Route path="/landing" element={<Navigate to={PATHS.landing} replace />} />
          </Route>

          {/* 2. Standard App Layout (Navbar + Outlet + Footer) */}
          <Route element={<AppLayout isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />}>
            <Route path={PATHS.discovery} element={<DiscoveryPage />} />
            <Route path={PATHS.dictionary} element={<DictionaryPage />} />
            <Route path="/flashcard-library" element={<Navigate to={PATHS.dictionary} replace />} />

            <Route path={PATHS.community} element={<CommunityPage />} />
            <Route path="/community-1" element={<Navigate to={PATHS.community} replace />} />
            <Route path={PATHS.communityContest} element={<CommunityContestPage />} />
            <Route path="/community-2" element={<Navigate to={PATHS.communityContest} replace />} />

            <Route path={PATHS.pricing} element={<PricingPage />} />
            <Route path="/subscription" element={<Navigate to={PATHS.pricing} replace />} />
            <Route path="/upgrade" element={<Navigate to={PATHS.pricing} replace />} />

            {/* Auth Protected: Checkout */}
            <Route
              path={PATHS.checkout}
              element={
                <RequireAuth>
                  <CheckoutPage />
                </RequireAuth>
              }
            />
            <Route path="/checkout" element={<Navigate to={PATHS.checkout} replace />} />

            {/* Role Protected: Admin CMS */}
            <Route
              path={PATHS.admin}
              element={
                <RequireRole role="ADMIN">
                  <AdminPage />
                </RequireRole>
              }
            />
            <Route path="/admin/posts" element={<Navigate to={PATHS.admin} replace />} />

            {/* 404 Not Found Page within App shell */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* 3. Study Layout (Navbar + Outlet, no Footer) */}
          <Route element={<StudyLayout isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />}>
            <Route path={PATHS.flashcardStudy} element={<FlashcardStudyPage />} />
            <Route path="/flashcards" element={<Navigate to={PATHS.flashcardStudy} replace />} />
            <Route path="/flashcard-study-page" element={<Navigate to={PATHS.flashcardStudy} replace />} />
          </Route>

          {/* 4. Focus Full-screen Layout (No Navbar, No Footer) */}
          <Route element={<FocusLayout />}>
            {/* Guest Only: Login */}
            <Route
              path={PATHS.login}
              element={
                <GuestOnly>
                  <LoginPage onLoginSuccess={handleLoginSuccess} />
                </GuestOnly>
              }
            />

            {/* Auth Protected: Home Dashboard */}
            <Route
              path={PATHS.home}
              element={
                <RequireAuth>
                  <HomePage
                    isLoggedIn={isLoggedIn}
                    user={user}
                    onLogout={handleLogout}
                  />
                </RequireAuth>
              }
            />

            {/* Reader & Playground Workspaces */}
            <Route path={PATHS.reader} element={<ReaderPage />} />
            <Route path="/bilingual-reader" element={<RedirectToReader />} />
            <Route path="/extensive-reader" element={<RedirectToReader defaultParams="?mode=extensive" />} />
            <Route path="/learning-loop" element={<RedirectToReader />} />
            <Route path="/loop" element={<RedirectToReader />} />

            <Route path={PATHS.playground} element={<PlaygroundPage />} />
          </Route>
        </Routes>
      </React.Suspense>

      {/* Global Modals & Banners */}
      <SettingsModal />
      <PwaInstallBanner />
    </div>
  );
};

export default App;
