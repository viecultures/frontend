import { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ReaderModal } from './components/ReaderModal';
import { FlashcardModal } from './components/FlashcardModal';
import { ReflectionsModal } from './components/ReflectionsModal';
import { ProjectSpecsDrawer } from './components/ProjectSpecsDrawer';
import { Footer } from './components/Footer';

import DiscoveryPage from './pages/DiscoveryPage';
import CommunityPage from './pages/CommunityPage';
import CommunityContestPage from './pages/CommunityContestPage';
import FlashcardStudyPage from './pages/FlashcardStudyPage';
import BilingualReaderPage from './pages/BilingualReaderPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import LandingPage1 from './pages/LandingPage1';
import LandingPage2 from './pages/LandingPage2';
import LandingPage3 from './pages/LandingPage3';

import { MOCK_LESSONS } from './data/mockData';
import type { Lesson, Category, CEFRLevel } from './types';

export function App() {
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [activeReaderLesson, setActiveReaderLesson] = useState<Lesson | null>(null);
  const [activeFlashcardLesson, setActiveFlashcardLesson] = useState<Lesson | null>(null);
  const [activeReflectionsLesson, setActiveReflectionsLesson] = useState<Lesson | null>(null);
  const [isReflectionsOpen, setIsReflectionsOpen] = useState<boolean>(false);
  const [isSpecsDrawerOpen, setIsSpecsDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleAppNavigate = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveView(customEvent.detail);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('app-navigate', handleAppNavigate);
    return () => {
      window.removeEventListener('app-navigate', handleAppNavigate);
    };
  }, []);

  const handleNavigate = (view: string) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredLessons = useMemo(() => {
    return MOCK_LESSONS.filter((lesson) => {
      const matchesCategory =
        selectedCategory === 'all' || lesson.category === selectedCategory;
      const matchesLevel =
        selectedLevel === 'all' || lesson.level === selectedLevel;
      const matchesSearch =
        searchQuery === '' ||
        lesson.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.titleVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.summary.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesLevel && matchesSearch;
    });
  }, [selectedCategory, selectedLevel, searchQuery]);

  const featuredLesson = useMemo(() => {
    return MOCK_LESSONS.find((l) => l.featured) || MOCK_LESSONS[0];
  }, []);

  return (
    <div className="min-h-screen bg-[#0D1C18] text-[#FFFDF8] flex flex-col font-sans selection:bg-[#FCE5B5] selection:text-[#122A22]">
      
      {/* Navbar Hide on Login Page for immersive experience */}
      {activeView !== 'login' && (
        <Navbar
          activeView={activeView}
          onOpenDocs={() => setIsSpecsDrawerOpen(true)}
          onNavigateToSection={handleNavigate}
        />
      )}

      {/* View Switcher */}
      {activeView === 'home' && <HomePage onNavigate={handleNavigate} />}
      {activeView === 'login' && (
        <LoginPage
          onLoginSuccess={() => handleNavigate('home')}
          onNavigate={handleNavigate}
        />
      )}
      {activeView === 'discovery' && <DiscoveryPage />}
      {activeView === 'community-1' && <CommunityPage />}
      {activeView === 'community-2' && <CommunityContestPage />}
      {activeView === 'flashcard-study' && <FlashcardStudyPage />}
      {activeView === 'bilingual-reader' && <BilingualReaderPage />}
      
      {activeView === 'landing' && (
        <LandingPage1
          featuredLesson={featuredLesson}
          filteredLessons={filteredLessons}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onStartReading={setActiveReaderLesson}
          onStartFlashcard={setActiveFlashcardLesson}
          onOpenSpecs={() => setIsSpecsDrawerOpen(true)}
          onNavigate={handleNavigate}
        />
      )}

      {activeView === 'landing-2' && (
        <LandingPage2
          onNavigate={handleNavigate}
          onOpenDocs={() => setIsSpecsDrawerOpen(true)}
        />
      )}

      {activeView === 'landing-3' && (
        <LandingPage3
          onNavigate={handleNavigate}
          onOpenDocs={() => setIsSpecsDrawerOpen(true)}
        />
      )}

      {/* Footer */}
      <Footer />

      {/* MODAL 1: Paragraph Pairing Bilingual Reader */}
      {activeReaderLesson && (
        <ReaderModal
          lesson={activeReaderLesson}
          onClose={() => setActiveReaderLesson(null)}
          onOpenFlashcards={(l) => {
            setActiveReaderLesson(null);
            setActiveFlashcardLesson(l);
          }}
          onOpenReflections={(l) => {
            setActiveReaderLesson(null);
            setActiveReflectionsLesson(l);
            setIsReflectionsOpen(true);
          }}
        />
      )}

      {/* MODAL 2: 3D Flashcards with Spaced Repetition */}
      {activeFlashcardLesson && (
        <FlashcardModal
          lesson={activeFlashcardLesson}
          onClose={() => setActiveFlashcardLesson(null)}
          onOpenReflections={(l) => {
            setActiveFlashcardLesson(null);
            setActiveReflectionsLesson(l);
            setIsReflectionsOpen(true);
          }}
        />
      )}

      {/* MODAL 3: Reflections UGC Community */}
      {isReflectionsOpen && (
        <ReflectionsModal
          lesson={activeReflectionsLesson || undefined}
          onClose={() => {
            setIsReflectionsOpen(false);
            setActiveReflectionsLesson(null);
          }}
        />
      )}

      {/* DRAWER: Project Specs & Design System Documentation */}
      <ProjectSpecsDrawer
        isOpen={isSpecsDrawerOpen}
        onClose={() => setIsSpecsDrawerOpen(false)}
      />

    </div>
  );
}

export default App;
