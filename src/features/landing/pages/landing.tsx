import React from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { ThemeProvider } from '@/context/ThemeContext';
import { LandingHeader } from '../components/LandingHeader';
import { LandingHeroBanner } from '../components/LandingHeroBanner';
import { CoverflowArticlesSection } from '../components/CoverflowArticlesSection';
import { HeritageMethodologySection } from '../components/HeritageMethodologySection';
import { LandingPlansSection } from '../components/LandingPlansSection';
import { ContactSection } from '../components/ContactSection';
import { AiSpeakingRoomSection } from '../components/AiSpeakingRoomSection';
import '../landing.css';
import { useAppNavigate } from '@/routes/useAppNavigate';
import VietnamHeritageMapSection from '../components/VietnamHeritageMapSection';

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
    const sectionIds = [
      'hero',
      'featured-articles',
      'methodology',
      'flashcard-demo',
      'ban-do-di-san',
      'ai-speaking-room',
      'plans',
      'contact',
    ];
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
            if (id === 'flashcard-demo') {
              navTarget = 'methodology';
            } else if (id === 'ai-speaking-room') {
              navTarget = 'ban-do-di-san';
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
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.001 });
  const canAnimate = !reducedMotion;

  return (
    <ThemeProvider>
      <div className="landing-page w-full min-h-screen font-sans antialiased selection:bg-sky-mist selection:text-heritage-green flex flex-col justify-between">
        {canAnimate && (
          <motion.div
            className="landing-scroll-progress"
            style={{ scaleX: progress }}
            aria-hidden="true"
          />
        )}
        {/* Site Header */}
        <LandingHeader
          onScrollToSegment={scrollToSegment}
          activeSegment={activeSegment}
        />

        {/* Semantic Main Element */}
        <main className="landing-content w-full overflow-x-hidden flex-1">
          <div id="hero"><LandingHeroBanner /></div>

          <CoverflowArticlesSection />

          <HeritageMethodologySection
            onNavigate={handleNavigate}
            onPreviewFlashcards={() => scrollToSegment('flashcard-demo')}
          />


          <VietnamHeritageMapSection />

          <AiSpeakingRoomSection />

          <LandingPlansSection onNavigate={handleNavigate} />

          <ContactSection />
        </main>

      </div>
    </ThemeProvider>
  );
};

export default LandingPage;
