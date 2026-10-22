import React from 'react';
import { ArrowUpRight, BookOpen, Compass, Layers, MessageCircle } from 'lucide-react';
import { PATHS, paths } from '@/routes/paths';

const STEPS = [
  { title: 'Choose a topic', description: 'A dish, a heritage site, or a story that feels familiar.', action: 'Explore stories', icon: Compass, view: PATHS.discovery },
  { title: 'Read & listen', description: 'Compare both languages, listen sentence by sentence, and save words to remember.', action: 'Read the Hue story', icon: BookOpen, view: paths.reader({ story: 'imperial-hue' }) },
  { title: 'Review saved words', description: 'Flip a card, recall its meaning, and choose what to review again.', action: 'Try a short review', icon: Layers, view: null },
  { title: 'Put it into practice', description: 'Share your thoughts, ask questions, or try a scenario with AI.', action: 'Try the AI companion', icon: MessageCircle, view: PATHS.playground },
];

interface HeritageMethodologySectionProps {
  onNavigate?: (view: string) => void;
  onPreviewFlashcards?: () => void;
}

export const HeritageMethodologySection: React.FC<HeritageMethodologySectionProps> = ({ onNavigate, onPreviewFlashcards }) => {
  const chooseStep = (view: string | null) => {
    if (view === null) {
      if (onPreviewFlashcards) onPreviewFlashcards();
      else document.getElementById('flashcard-demo')?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
      return;
    }
    onNavigate?.(view);
  };

  return (
    <section className="landing-journey landing-section" aria-labelledby="landing-journey-title">
      <div className="landing-container">
        <div className="landing-section-heading">
          <div>
            <span className="landing-eyebrow">03 / LEARN AT YOUR OWN PACE</span>
            <h2 id="landing-journey-title">One story can become <em>a lasting habit.</em></h2>
          </div>
        </div>
        <p className="landing-section-description">Start with what sparks your curiosity. Understand a story, remember a few words, and put them to use.</p>
        <ol className="landing-journey-grid">
          {STEPS.map(({ title, description, action, icon: Icon, view }, index) => (
            <li key={title} className="landing-journey-step">
              <div className="landing-journey-step-top">
                <span className="landing-journey-number">0{index + 1}</span>
                <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div className="landing-journey-step-copy">
                <h3>{title}{index === 3 && <span className="landing-journey-optional">Optional</span>}</h3>
                <p>{description}</p>
                <button type="button" className="landing-text-link" onClick={() => chooseStep(view)}>{action}<ArrowUpRight size={16} aria-hidden="true" /></button>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HeritageMethodologySection;
