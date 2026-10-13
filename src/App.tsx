import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { SettingsModal } from './components/SettingsModal';
import { PwaInstallBanner } from './components/pwa';

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

import type { Lesson } from '@/types';

export const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const defaultUser = { name: 'Ninh Thiên Luân', email: 'luanninh@viecultures.com', avatar: 'NL' };
  const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(defaultUser);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setUser(defaultUser);
    navigate('/home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  // Map path to active view name for Navbar and component compatibility
  const getActiveView = (pathname: string): string => {
    switch (pathname) {
      case '/':
      case '/landing':
        return 'landing';
      case '/login':
        return 'login';
      case '/home':
        return 'home';
      case '/discovery':
        return 'discovery';
      case '/bilingual-reader':
      case '/extensive-reader':
      case '/reader':
        return 'bilingual-reader';
      case '/dictionary':
      case '/flashcard-library':
        return 'dictionary';
      case '/flashcard-study':
        return 'flashcard-study';
      case '/community':
      case '/community-1':
        return 'community';
      case '/community-2':
      case '/community-contest':
        return 'community-contest';
      case '/playground':
        return 'playground';
      case '/admin':
      case '/admin/posts':
        return 'admin';
      default:
        return 'landing';
    }
  };

  const activeView = getActiveView(location.pathname);

  const handleNavigate = (view: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    switch (view) {
      case 'landing':
      case 'landing-1':
      case 'landing-2':
      case 'landing-3':
        navigate('/');
        break;
      case 'login':
        navigate('/login');
        break;
      case 'home':
        navigate('/home');
        break;
      case 'discovery':
        navigate('/discovery');
        break;
      case 'bilingual-reader':
        navigate('/bilingual-reader');
        break;
      case 'dictionary':
      case 'flashcard-library':
        navigate('/dictionary');
        break;
      case 'flashcard-study':
        navigate('/flashcard-study');
        break;
      case 'community':
      case 'community-1':
        navigate('/community');
        break;
      case 'community-2':
      case 'community-contest':
        navigate('/community-2');
        break;
      case 'playground':
        navigate('/playground');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        if (view.startsWith('/')) {
          navigate(view);
        } else {
          navigate('/');
        }
        break;
    }
  };

  useEffect(() => {
    const handleAppNavigate = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        handleNavigate(customEvent.detail);
      }
    };

    window.addEventListener('app-navigate', handleAppNavigate);
    window.addEventListener('app:navigate', handleAppNavigate);
    return () => {
      window.removeEventListener('app-navigate', handleAppNavigate);
      window.removeEventListener('app:navigate', handleAppNavigate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF7EE] dark:bg-[#0b1a17] text-[#3F5550] dark:text-[#FBF7EE] flex flex-col font-sans vn-pattern-bg">
      {/* Navbar shown across application views (hidden on landing page, login, home dashboard, reader page, and standalone playground) */}
      {activeView !== 'landing' && activeView !== 'login' && activeView !== 'home' && activeView !== 'bilingual-reader' && activeView !== 'playground' && (
        <Navbar
          activeView={activeView}
          isLoggedIn={isLoggedIn}
          user={user}
          onNavigateToSection={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content Area / React Router Routes */}
      <main className="flex-1 w-full">

        <React.Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#1E4B43]/20 border-t-[#1E4B43] rounded-full animate-spin" />
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage
                  onNavigate={handleNavigate}
                />
              }
            />
            <Route
              path="/landing"
              element={<Navigate to="/" replace />}
            />
            <Route
              path="/login"
              element={
                <LoginPage
                  onLoginSuccess={handleLoginSuccess}
                  onNavigate={handleNavigate}
                />
              }
            />
            <Route
              path="/home"
              element={
                <HomePage
                  onNavigate={handleNavigate}
                  isLoggedIn={isLoggedIn}
                  user={user}
                  onLogout={handleLogout}
                />
              }
            />
            <Route
              path="/discovery"
              element={<DiscoveryPage />}
            />
            <Route
              path="/reader"
              element={<ReaderPage />}
            />
            <Route
              path="/bilingual-reader"
              element={<ReaderPage />}
            />
            <Route
              path="/extensive-reader"
              element={<Navigate to="/bilingual-reader?mode=extensive" replace />}
            />
            <Route
              path="/dictionary"
              element={<DictionaryPage />}
            />
            <Route
              path="/flashcard-library"
              element={<Navigate to="/dictionary" replace />}
            />
            <Route
              path="/flashcard-study"
              element={<FlashcardStudyPage />}
            />
            <Route
              path="/community"
              element={<CommunityPage />}
            />
            <Route
              path="/community-1"
              element={<Navigate to="/community" replace />}
            />
            <Route
              path="/community-2"
              element={<CommunityContestPage />}
            />
            <Route
              path="/community-contest"
              element={<Navigate to="/community-2" replace />}
            />
            <Route
              path="/playground"
              element={<PlaygroundPage />}
            />
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </React.Suspense>
      </main >

      {/* Footer (hidden on login, home dashboard, reader page, and playground) */}
      {activeView !== 'login' && activeView !== 'home' && activeView !== 'bilingual-reader' && activeView !== 'playground' && <Footer />}

      {/* GLOBAL SETTINGS MODAL */}
      <SettingsModal />

      {/* PWA MOBILE INSTALL BANNER */}
      <PwaInstallBanner />
    </div >
  );
};

export default App;
