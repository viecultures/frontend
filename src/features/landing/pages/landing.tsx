import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { LandingHeader } from '../components/LandingHeader';
import { LandingHeroBanner } from '../components/LandingHeroBanner';
import { CoverflowArticlesSection } from '../components/CoverflowArticlesSection';
import { FourTopicsSection } from '../components/FourTopicsSection';
import { VietnamHeritageMapSection } from '../components/VietnamHeritageMapSection';
import { HeritageMethodologySection } from '../components/HeritageMethodologySection';
import { InteractiveFlashcardDemoSection } from '../components/InteractiveFlashcardDemoSection';
import { LandingFaqSection } from '../components/LandingFaqSection';
import { ContactSection } from '../components/ContactSection';

interface LandingPageProps {
  onNavigate?: (view: string) => void;
  onOpenDocs?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [activeSegment, setActiveSegment] = React.useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'hero';
  });

  const scrollToSegment = (elementId: string) => {
    setActiveSegment(elementId);
    if (elementId === 'hero') {
      window.history.pushState(null, '', window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    window.history.pushState(null, '', `#${elementId}`);
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle deep-linking from initial URL hash & popstate
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const target = hash || 'hero';
      setActiveSegment(target);
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', handleHashChange);

    // Initial hash scroll
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
      setActiveSegment(initialHash);
      setTimeout(() => {
        const el = document.getElementById(initialHash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }

    return () => {
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // IntersectionObserver to auto-sync active navbar item as user scrolls
  React.useEffect(() => {
    const sectionIds = ['hero', 'featured-articles', 'topics', 'ban-do-di-san', 'methodology', 'interactive-demo', 'trusted-community', 'faq', 'contact'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            const id = entry.target.id;
            // Map sub-sections to closest navbar item if needed
            let navTarget = id;
            if (id === 'methodology' || id === 'interactive-demo' || id === 'flashcard-demo') {
              navTarget = 'ban-do-di-san';
            }
            setActiveSegment(navTarget);
          }
        });
      },
      {
        root: null,
        rootMargin: '-10% 0px -50% 0px',
        threshold: [0.3],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
          activeSegment={activeSegment}
        />

        <main className="w-full overflow-x-hidden">
          {/* 1. Hero Banner Section (Full Screen Size with Text Layer Overlay) */}
          <div id="hero">
            <LandingHeroBanner
              onNavigate={handleNavigate}
              onScrollToDemo={() => scrollToSegment('interactive-demo')}
            />
          </div>

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

          {/* 7. Interactive Flashcard & Spaced Repetition Preview */}
          <div id="flashcard-demo">
            <InteractiveFlashcardDemoSection onNavigate={handleNavigate} />
          </div>

          {/* 8. Frequently Asked Questions Section */}
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
