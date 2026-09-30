import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { LandingHeader } from '../components/LandingHeader';
import { LandingHeroBanner } from '../components/LandingHeroBanner';
import { CoverflowArticlesSection } from '../components/CoverflowArticlesSection';
import { FourTopicsSection } from '../components/FourTopicsSection';
import { InteractiveReaderDemoSection } from '../components/InteractiveReaderDemoSection';
import { InteractiveFlashcardDemoSection } from '../components/InteractiveFlashcardDemoSection';
import { AmbassadorCommunitySection } from '../components/AmbassadorCommunitySection';
import { ContactSection } from '../components/ContactSection';

interface LandingPageProps {
  onNavigate?: (view: string) => void;
  onOpenDocs?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const scrollToSegment = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigate = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      window.dispatchEvent(new CustomEvent('app:navigate', { detail: view }));
    }
  };

  return (
    <ThemeProvider>
      <div className="w-full min-h-screen bg-surface text-heritage-green font-sans antialiased selection:bg-sky-mist selection:text-heritage-green transition-colors duration-300">
        {/* Site Header */}
        <LandingHeader
          onNavigate={handleNavigate}
          onScrollToSegment={scrollToSegment}
        />

        <main className="w-full overflow-x-hidden">
          {/* 1. Hero Banner Section (Full Screen Size with Text Layer Overlay) */}
          <LandingHeroBanner
            onNavigate={handleNavigate}
            onScrollToDemo={() => scrollToSegment('interactive-demo')}
          />

          {/* 2. Top Articles Section (3D Coverflow Slider with Auto-Advance Every 3 Seconds) */}
          <div id="featured-articles">
            <CoverflowArticlesSection onNavigate={handleNavigate} />
          </div>

          {/* 3. Topics Section (The 4 Core Topics Pillars) */}
          <div id="topics">
            <FourTopicsSection onNavigate={handleNavigate} />
          </div>

          {/* 4. Interactive Reader Demo Section (Value-Add Feature Preview) */}
          <div id="interactive-demo">
            <InteractiveReaderDemoSection onNavigate={handleNavigate} />
          </div>

          {/* 5. Interactive Flashcard & Spaced Repetition Preview */}
          <div id="flashcard-demo">
            <InteractiveFlashcardDemoSection onNavigate={handleNavigate} />
          </div>

          {/* 6. Trusted Section (User Feedback, Testimonials & Cultural Ambassador Community) */}
          <div id="trusted-community">
            <AmbassadorCommunitySection />
          </div>

          {/* 7. Contact Section */}
          <div id="contact">
            <ContactSection />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default LandingPage;
