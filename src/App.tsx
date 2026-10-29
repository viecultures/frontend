import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import { isLocalAuthMode } from '@/config/authConfig';

import { SettingsModal } from './components/SettingsModal';
import { PwaInstallBanner } from './components/pwa';

// Layouts
import { AppLayout } from '@/layouts/AppLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { FocusLayout } from '@/layouts/FocusLayout';
import { StudyLayout } from '@/layouts/StudyLayout';
import { LanguageRouteLayout } from '@/layouts/LanguageRouteLayout';

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
const FlashcardsPage = React.lazy(() => import('@/features/flashcards/pages/FlashcardsPage'));
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
import { PATHS, getLocalizedPath } from '@/routes/paths';
import { CompanionChatDrawer, CompanionFloatingButton } from '@/features/companion';

// Helper to strip leading slash for child routes under /:lang
const toRel = (path: string): string => path.replace(/^\//, '');

// Redirect legacy /bilingual-reader or /loop routes to canonical /reader while preserving search query and lang
const RedirectToReader: React.FC<{ defaultParams?: string }> = ({ defaultParams = '' }) => {
  const location = useLocation();
  const { lang = 'vi' } = useParams<{ lang: string }>();
  const search = location.search || defaultParams;
  return <Navigate to={`/${lang}${PATHS.reader}${search}`} replace />;
};

// Redirect alias routes within localized prefix
const RedirectWithLang: React.FC<{ to: string }> = ({ to }) => {
  const { lang = 'vi' } = useParams<{ lang: string }>();
  const cleanTarget = to.startsWith('/') ? to : `/${to}`;
  return <Navigate to={`/${lang}${cleanTarget}`} replace />;
};

// Backward-compatibility fallback: un-prefixed URLs (e.g. /login) redirect to /vi/login
const UnprefixedFallbackRedirect: React.FC = () => {
  const location = useLocation();
  if (/^\/(vi|en)(\/|$)/.test(location.pathname)) {
    return <NotFoundPage />;
  }
  const cleanPath = location.pathname.startsWith('/') ? location.pathname : `/${location.pathname}`;
  return <Navigate to={`/vi${cleanPath}${location.search}${location.hash}`} replace />;
};

export const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isCompanionOpen, setIsCompanionOpen] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const currentLessonId = searchParams.get('id') || searchParams.get('lessonId') || searchParams.get('story') || searchParams.get('article') || searchParams.get('postId') || undefined;

  const normalizedPath =
    location.pathname.length > 1 && location.pathname.endsWith('/')
      ? location.pathname.slice(0, -1)
      : location.pathname;

  const pathWithoutLang = normalizedPath.replace(/^\/(vi|en)(\/|$)/, '/');

  const isLandingOrLogin =
    pathWithoutLang === PATHS.landing ||
    pathWithoutLang === PATHS.landingConcept ||
    pathWithoutLang === '/landing' ||
    pathWithoutLang === PATHS.login;

  useEffect(() => {
    if (isLandingOrLogin && isCompanionOpen) {
      setIsCompanionOpen(false);
    }
  }, [isLandingOrLogin, isCompanionOpen]);

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
      navigate(getLocalizedPath(PATHS.home), { replace: true });
    }
  };

  const handleLogout = () => {
    clearAuthStorage();
    setIsLoggedIn(false);
    setUser(null);
    navigate(getLocalizedPath(PATHS.landing), { replace: true });
  };

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
            {/* Root URL redirect to /vi */}
            <Route path="/" element={<Navigate to="/vi" replace />} />

            {/* Localized routes tree with :lang prefix */}
            <Route path="/:lang" element={<LanguageRouteLayout />}>
              {/* 1. Public Landing Layout */}
              <Route element={<PublicLayout />}>
                <Route index element={<LandingPage />} />
                <Route path={toRel(PATHS.landingConcept)} element={<FoodLandingPage />} />
                <Route path="landing" element={<RedirectWithLang to={PATHS.landing} />} />
              </Route>

              {/* 2. Standard App Layout (Navbar + Outlet + Footer) */}
              <Route element={<AppLayout isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />}>
                <Route path={toRel(PATHS.discovery)} element={<DiscoveryPage />} />
                <Route path={toRel(PATHS.dictionary)} element={<DictionaryPage />} />
                <Route path="flashcard-library" element={<RedirectWithLang to={PATHS.dictionary} />} />

                <Route path={toRel(PATHS.community)} element={<CommunityPage />} />
                <Route path="community-1" element={<RedirectWithLang to={PATHS.community} />} />
                <Route path={toRel(PATHS.communityContest)} element={<CommunityContestPage />} />
                <Route path="community-2" element={<RedirectWithLang to={PATHS.communityContest} />} />

                <Route path={toRel(PATHS.pricing)} element={<PricingPage />} />
                <Route path="subscription" element={<RedirectWithLang to={PATHS.pricing} />} />
                <Route path="upgrade" element={<RedirectWithLang to={PATHS.pricing} />} />

                {/* Auth Protected: Checkout */}
                <Route
                  path={toRel(PATHS.checkout)}
                  element={
                    <RequireAuth>
                      <CheckoutPage />
                    </RequireAuth>
                  }
                />
                <Route path="checkout" element={<RedirectWithLang to={PATHS.checkout} />} />

                {/* Auth Protected: User Profile & Cultural Passport */}
                <Route
                  path={toRel(PATHS.profile)}
                  element={
                    <RequireAuth>
                      <ProfilePage />
                    </RequireAuth>
                  }
                />
                <Route path="account" element={<RedirectWithLang to={PATHS.profile} />} />
                <Route path="passport" element={<RedirectWithLang to={`${PATHS.profile}?tab=passport`} />} />
                <Route path="achievements" element={<RedirectWithLang to={`${PATHS.profile}?tab=badges`} />} />

                {/* Role Protected: Admin CMS */}
                <Route
                  path={toRel(PATHS.admin)}
                  element={
                    <RequireRole role="ADMIN">
                      <AdminPage />
                    </RequireRole>
                  }
                />
                <Route
                  path={`${toRel(PATHS.admin)}/*`}
                  element={
                    <RequireRole role="ADMIN">
                      <AdminPage />
                    </RequireRole>
                  }
                />
                <Route path="admin/posts" element={<RedirectWithLang to={PATHS.admin} />} />

                {DesignSystemPage && <Route path="design-system" element={<DesignSystemPage />} />}

                {/* 404 Not Found Page within App shell */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* 3. Study Layout (Navbar + Outlet, no Footer) */}
              <Route element={<StudyLayout isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />}>
                <Route path={toRel(PATHS.flashcardStudy)} element={<FlashcardsPage />} />
                <Route path="flashcards" element={<FlashcardsPage />} />
                <Route path="flashcard-study-page" element={<FlashcardsPage />} />
              </Route>

              {/* 4. Focus Full-screen Layout (No Navbar, No Footer) */}
              <Route element={<FocusLayout />}>
                {/* Guest Only: Login */}
                <Route
                  path={toRel(PATHS.login)}
                  element={
                    <GuestOnly>
                      <LoginPage onLoginSuccess={handleLoginSuccess} />
                    </GuestOnly>
                  }
                />

                {/* Auth Protected: Home Dashboard */}
                <Route
                  path={toRel(PATHS.home)}
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
                <Route path={toRel(PATHS.reader)} element={<ReaderPage />} />
                <Route path="bilingual-reader" element={<RedirectToReader />} />
                <Route path="extensive-reader" element={<RedirectToReader defaultParams="?mode=practice" />} />
                <Route path="learning-loop" element={<RedirectToReader />} />
                <Route path="loop" element={<RedirectToReader />} />

                <Route path={toRel(PATHS.playground)} element={<PlaygroundPage />} />
                <Route path={toRel(PATHS.aiWorkspace)} element={<AiWorkspacePage />} />
                <Route path="mascot-demo" element={<MascotDemoPage />} />
              </Route>
            </Route>

            {/* Fallback for un-prefixed routes (e.g. legacy /login -> /vi/login) */}
            <Route path="*" element={<UnprefixedFallbackRedirect />} />
          </Routes>
        </React.Suspense>

        {/* Global Modals & Banners */}
        <SettingsModal />
        <PwaInstallBanner />

        {/* AI Cultural Companion Floating Drawer & Launcher */}
        {!isLandingOrLogin && !pathWithoutLang.startsWith(PATHS.aiWorkspace) && (
          <>
            <CompanionFloatingButton
              isOpen={isCompanionOpen}
              onClick={() => setIsCompanionOpen((prev) => !prev)}
            />
            <CompanionChatDrawer
              isOpen={isCompanionOpen}
              onClose={() => setIsCompanionOpen(false)}
              lessonId={currentLessonId}
            />
          </>
        )}
      </div>
  );

  return content;
};

export default App;
