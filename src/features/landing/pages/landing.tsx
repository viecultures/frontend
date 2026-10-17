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
import { LandingPhotoCredits } from '../components/LandingPhotoCredits';
import '../landing.css';
import { useAppNavigate } from '@/routes/useAppNavigate';

interface LandingPageProps {
  onOpenDocs?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = () => {
  const [activeSegment, setActiveSegment] = React.useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'hero';
  });

  const scrollToSegment = (elementId: string) => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    setActiveSegment(elementId);
    if (elementId === 'hero') {
      window.history.pushState(null, '', window.location.pathname);
      window.scrollTo({ top: 0, behavior });
      return;
    }

    window.history.pushState(null, '', `#${elementId}`);
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior });
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
    const sectionIds = ['hero', 'featured-articles', 'topics', 'ban-do-di-san', 'methodology', 'flashcard-demo', 'faq', 'contact'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            // Map sub-sections to closest navbar item if needed
            let navTarget = id;
            if (id === 'ban-do-di-san' || id === 'flashcard-demo' || id === 'faq') {
              navTarget = 'methodology';
            }
            setActiveSegment(navTarget);
          }
        });
      },
      {
        root: null,
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleNavigate = useAppNavigate();

  return (
    <ThemeProvider>
      <div className="landing-page w-full min-h-screen font-sans antialiased selection:bg-sky-mist selection:text-heritage-green">
        {/* Site Header */}
        <LandingHeader
          onNavigate={handleNavigate}
          onScrollToSegment={scrollToSegment}
          activeSegment={activeSegment}
        />

        <div className="landing-content w-full overflow-x-hidden">
          <div id="hero">
            <LandingHeroBanner
              onNavigate={handleNavigate}
              onScrollToDemo={() => scrollToSegment('flashcard-demo')}
            />
          </div>

          <div id="featured-articles">
            <CoverflowArticlesSection onNavigate={handleNavigate} />
          </div>

          <div id="topics">
            <FourTopicsSection onNavigate={handleNavigate} />
          </div>

          <div>
            <VietnamHeritageMapSection />
          </div>

          <div id="methodology">
            <HeritageMethodologySection onNavigate={handleNavigate} onPreviewFlashcards={() => scrollToSegment('flashcard-demo')} />
          </div>

          <div>
            <InteractiveFlashcardDemoSection onNavigate={handleNavigate} />
          </div>

          <div>
            <LandingFaqSection />
          </div>

          <div>
            <ContactSection />
          </div>

        </div>
        <LandingPhotoCredits />
      </div>
    </ThemeProvider>
  );
};

export default LandingPage;
