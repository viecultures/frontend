import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { LandingHeader } from '../components/LandingHeader';
import { LandingHeroBanner } from '../components/LandingHeroBanner';
import { CoverflowArticlesSection } from '../components/CoverflowArticlesSection';
import { FourTopicsSection } from '../components/FourTopicsSection';
import { VietnamHeritageMapSection } from '../components/VietnamHeritageMapSection';
import { HeritageMethodologySection } from '../components/HeritageMethodologySection';
import { InteractiveReaderDemoSection } from '../components/InteractiveReaderDemoSection';
import { InteractiveFlashcardDemoSection } from '../components/InteractiveFlashcardDemoSection';
import { LandingFaqSection } from '../components/LandingFaqSection';
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

          {/* 4. Interactive 34-Province Vietnam Heritage Map & 3-Region Corridor */}
          <div id="ban-do-di-san">
            <VietnamHeritageMapSection />
          </div>

          {/* 5. 4-Pillars Heritage Methodology */}
          <div id="methodology">
            <HeritageMethodologySection onNavigate={handleNavigate} />
          </div>

          {/* 6. Interactive Reader Demo Section (Value-Add Feature Preview) */}
          {/* <div id="interactive-demo">
            <InteractiveReaderDemoSection onNavigate={handleNavigate} />
          </div> */}

          {/* 7. Interactive Flashcard & Spaced Repetition Preview */}
          <div id="flashcard-demo">
            <InteractiveFlashcardDemoSection onNavigate={handleNavigate} />
          </div>

          {/* 8. Trusted Section (User Feedback, Testimonials & Cultural Ambassador Community)
          <div id="trusted-community">
            <AmbassadorCommunitySection />
          </div> */}

          {/* 9. Frequently Asked Questions Section */}
          <div id="faq">
            <LandingFaqSection />
          </div>

          {/* 10. Contact Section */}
          <div id="contact">
            <ContactSection />
          </div>

        </main>
      </div>
    </ThemeProvider>
  );
};

export default LandingPage;
