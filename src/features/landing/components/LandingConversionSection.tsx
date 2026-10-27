import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { PATHS } from '@/routes/paths';

interface LandingConversionSectionProps {
  onNavigate?: (view: string) => void;
}

export const LandingConversionSection: React.FC<LandingConversionSectionProps> = ({ onNavigate }) => {
  return (
    <section
      id="conversion-cta"
      className="landing-section py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-surface-feature border-t border-line"
      aria-labelledby="conversion-heading"
    >
      <div className="landing-container max-w-4xl text-center space-y-6">

        <h2
          id="conversion-heading"
          className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-heritage-forest leading-tight tracking-tight"
        >
          Discover Vietnam. Learn English Naturally
        </h2>

        <p className="text-sm sm:text-base text-ink-soft max-w-xl mx-auto leading-relaxed">
          Explore authentic Vietnamese stories, practice with synchronized audio, and remember meaningful vocabulary through living culture.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            type="button"
            className="landing-button landing-button-primary min-h-[48px] px-7 py-3 rounded-xl text-sm font-semibold shadow-md focus-ring cursor-pointer"
            onClick={() => onNavigate?.(PATHS.login)}
          >
            <span>Start Learning</span>
            <ArrowRight size={17} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="landing-button min-h-[48px] px-6 py-3 rounded-xl text-sm font-semibold border border-line bg-surface hover:bg-surface-muted text-ink shadow-xs focus-ring cursor-pointer transition-colors"
            onClick={() => onNavigate?.(PATHS.discovery)}
          >
            <Compass size={17} className="text-antique-gold" aria-hidden="true" />
            <span>Explore Stories</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default LandingConversionSection;
