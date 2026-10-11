import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { SettingsModal } from './components/SettingsModal';

// Feature Pages
import LandingPage from '@/features/landing/pages/landing';
import LoginPage from '@/features/auth/pages/login';
import HomePage from '@/features/home/pages/home';
import DiscoveryPage from '@/features/discovery/pages/discovery';
import ReaderPage from '@/features/reader/pages/reader';
import DictionaryPage from '@/features/flashcards/pages/dictionary';
import FlashcardStudyPage from '@/features/flashcards/pages/flashcard-study';
import CommunityPage from '@/features/community/pages/community';
import CommunityContestPage from '@/features/community/pages/community-contest';
import PlaygroundPage from '@/features/playground/pages/playground';

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
    return () => {
      window.removeEventListener('app-navigate', handleAppNavigate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF7EE] dark:bg-[#0b1a17] text-[#3F5550] dark:text-[#FBF7EE] flex flex-col font-sans vn-pattern-bg">
      {/* Navbar shown across application views (hidden on landing page, login, home dashboard, reader page, flashcard layout, and standalone playground) */}
      {activeView !== 'landing' && activeView !== 'login' && activeView !== 'home' && activeView !== 'bilingual-reader' && activeView !== 'dictionary' && activeView !== 'flashcard-study' && activeView !== 'playground' && (
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
      </main>

      {/* Footer (hidden on login, home dashboard, reader page, and playground) */}
      {activeView !== 'login' && activeView !== 'home' && activeView !== 'bilingual-reader' && activeView !== 'playground' && <Footer />}

      {/* GLOBAL SETTINGS MODAL */}
      <SettingsModal />
    </div>
  );
};

export default App;
