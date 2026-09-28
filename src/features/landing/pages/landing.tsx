import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { LandingHeader } from '../components/LandingHeader';
import { LandingHeroBanner } from '../components/LandingHeroBanner';
import { HeritageMethodologySection } from '../components/HeritageMethodologySection';
import { VietnamHeritageMapSection } from '../components/VietnamHeritageMapSection';
import { CuratedStoriesSection } from '../components/CuratedStoriesSection';
import { LearningMethodSection } from '../components/LearningMethodSection';
import { RoadmapHeritageSection } from '../components/RoadmapHeritageSection';

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
        {/* 1. Header Navigation Bar */}
        <LandingHeader
          onNavigate={handleNavigate}
          onScrollToSegment={scrollToSegment}
        />

        <main className="w-full overflow-x-hidden">
          {/* 2. Hero Video Banner Section */}
          <LandingHeroBanner
            onScrollToExplore={() => scrollToSegment('lo-trinh-hoc')}
          />

          {/* 3. Heritage Immersion Methodology */}
          <div id="lo-trinh-hoc">
            <HeritageMethodologySection onNavigate={handleNavigate} />
          </div>

          {/* 4. Interactive Vietnam S-shaped Map & Heritage Vocabulary */}
          <div id="ban-do-di-san">
            <VietnamHeritageMapSection />
          </div>

          {/* 5. Curated Stories Magazine Showcase */}
          <div id="tap-chi-di-san">
            <CuratedStoriesSection onNavigate={handleNavigate} />
          </div>

          {/* 6. Learning Method & 4-Stage Pathway */}
          <LearningMethodSection />

          {/* 7. Roadmap & VIP Newsletter Enrollment */}
          <div id="cam-nhan-hoc-vien">
            <RoadmapHeritageSection />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default LandingPage;
