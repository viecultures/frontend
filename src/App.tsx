import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { isLocalAuthMode } from '@/config/authConfig';

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
const FoodLandingPage = React.lazy(() => import('@/features/landing/pages/FoodLandingPage'));
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
const AiWorkspacePage = React.lazy(() => import('@/features/playground/pages/ai-workspace'));
const AdminPage = React.lazy(() => import('@/features/admin/pages/AdminPage'));
const PricingPage = React.lazy(() => import('@/features/subscription/pages/PricingPage'));
const CheckoutPage = React.lazy(() => import('@/features/subscription/pages/CheckoutPage'));
const ProfilePage = React.lazy(() => import('@/features/profile/pages/ProfilePage'));
const MascotDemoPage = React.lazy(() => import('@/features/mascot-demo/MascotDemoPage').then(module => ({ default: module.MascotDemoPage })));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));
const DesignSystemPage = import.meta.env.DEV
  ? React.lazy(() => import('@/pages/DesignSystemPage'))
  : null;
import { getStoredUser, setStoredUser, getStoredToken, clearAuthStorage, type AppUser } from '@/utils/auth-storage';
import { PATHS } from '@/routes/paths';
import { CompanionChatDrawer, CompanionFloatingButton } from '@/features/companion';

// Redirect legacy /bilingual-reader or /loop routes to canonical /reader while preserving search query
const RedirectToReader: React.FC<{ defaultParams?: string }> = ({ defaultParams = '' }) => {
  const location = useLocation();
  const search = location.search || defaultParams;
  return <Navigate to={`${PATHS.reader}${search}`} replace />;
};

export const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isCompanionOpen, setIsCompanionOpen] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const currentLessonId = searchParams.get('id') || searchParams.get('lessonId') || undefined;

  const [user, setUser] = useState<AppUser | null>(() => getStoredUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getStoredUser() || !!getStoredToken());

  useEffect(() => {
    const handleAuthChange = () => {
      const stored = getStoredUser();
      const token = getStoredToken();
      setUser(stored);
      setIsLoggedIn(!!stored || !!token);
    };
    window.addEventListener('auth:change', handleAuthChange);
    return () => window.removeEventListener('auth:change', handleAuthChange);
  }, []);

  const handleLoginSuccess = (activeUser: AppUser) => {
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
    clearAuthStorage();
    setIsLoggedIn(false);
    setUser(null);
    navigate(PATHS.landing, { replace: true });
  };

  const googleClientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  const content = (
      <div className="min-h-screen bg-surface text-ink-soft flex flex-col font-sans">
        {/* Main Content Area with Route-driven Layouts */}
        <React.Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-heritage-green/20 border-t-heritage-green rounded-full animate-spin" />
            </div>
          }
        >
          <Routes>
            {DesignSystemPage && <Route path="/design-system" element={<DesignSystemPage />} />}
            {/* 1. Public Landing Layout */}
            <Route element={<PublicLayout />}>
              <Route path={PATHS.landing} element={<LandingPage />} />
              <Route path={PATHS.landingConcept} element={<FoodLandingPage />} />
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

              {/* Auth Protected: User Profile & Cultural Passport */}
              <Route
                path={PATHS.profile}
                element={
                  <RequireAuth>
                    <ProfilePage />
                  </RequireAuth>
                }
              />
              <Route path="/account" element={<Navigate to={PATHS.profile} replace />} />
              <Route path="/passport" element={<Navigate to={`${PATHS.profile}?tab=passport`} replace />} />
              <Route path="/achievements" element={<Navigate to={`${PATHS.profile}?tab=badges`} replace />} />

              {/* Role Protected: Admin CMS */}
              <Route
                path={PATHS.admin}
                element={
                  <RequireRole role="ADMIN">
                    <AdminPage />
                  </RequireRole>
                }
              />
              <Route
                path={`${PATHS.admin}/*`}
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
              <Route path="/extensive-reader" element={<RedirectToReader defaultParams="?mode=practice" />} />
              <Route path="/learning-loop" element={<RedirectToReader />} />
              <Route path="/loop" element={<RedirectToReader />} />

              <Route path={PATHS.playground} element={<PlaygroundPage />} />
              <Route path={PATHS.aiWorkspace} element={<AiWorkspacePage />} />
              <Route path="/mascot-demo" element={<MascotDemoPage />} />
            </Route>
          </Routes>
        </React.Suspense>

        {/* Global Modals & Banners */}
        <SettingsModal />
        <PwaInstallBanner />

        {/* AI Cultural Companion Floating Drawer & Launcher */}
        <CompanionFloatingButton
          isOpen={isCompanionOpen}
          onClick={() => setIsCompanionOpen((prev) => !prev)}
        />
        <CompanionChatDrawer
          isOpen={isCompanionOpen}
          onClose={() => setIsCompanionOpen(false)}
          lessonId={currentLessonId}
        />
      </div>
  );

  return isLocalAuthMode ? content : (
    <GoogleOAuthProvider clientId={googleClientId} locale="vi">{content}</GoogleOAuthProvider>
  );
};

export default App;
