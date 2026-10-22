import React from 'react';
import { ArrowUpRight, Landmark, UtensilsCrossed, Palette, Sparkles } from 'lucide-react';
import { PATHS } from '@/routes/paths';

const TOPICS = [
  { title: 'History & heritage', kicker: 'ROOTS & LEGACY', description: 'Echoes of the past, stories that live on.', image: '/images/landing/hue-citadel.jpg', icon: Landmark },
  { title: 'Food & coffee', kicker: 'FLAVOR & TRADITION', description: 'A familiar taste. So much more to discover.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', icon: UtensilsCrossed },
  { title: 'Arts & craft villages', kicker: 'MADE BY HAND', description: 'Cultural heritage shaped by Vietnamese hands.', image: '/images/landing/bat-trang.jpg', icon: Palette },
  { title: 'Festivals & daily life', kicker: 'LIVING CULTURE', description: 'Discover the traditions that connect generations.', image: '/images/landing/hoi-an-lanterns.jpg', icon: Sparkles },
];

interface FourTopicsSectionProps {
  onNavigate?: (view: string) => void;
}

export const FourTopicsSection: React.FC<FourTopicsSectionProps> = ({ onNavigate }) => {
  const explore = () => {
    onNavigate?.(PATHS.discovery);
  };

  return (
    <section className="landing-topics landing-section" aria-labelledby="landing-topics-title">
      <div className="landing-container">
        <div className="landing-section-heading">
          <div><span className="landing-eyebrow">02 / FIND YOUR WAY IN</span><h2 id="landing-topics-title">Vietnam, explored through <em>its many stories.</em></h2></div>
          <p className="landing-topics-intro">From familiar favorites to traditions you may be discovering for the first time. Where would you like to begin?</p>
        </div>
        <div className="landing-topic-grid">
          {TOPICS.map(({ title, kicker, description, image, icon: Icon }, index) => (
            <button key={title} type="button" className="landing-topic-card" onClick={explore} aria-label={'Explore topic: ' + title}>
              <div className="landing-topic-image"><img src={image} alt="" loading="lazy" width={600} height={720} /><span className="landing-topic-number">0{index + 1}</span><span className="landing-topic-icon"><Icon size={20} aria-hidden="true" /></span></div>
              <div className="landing-topic-body"><span>{kicker}</span><h3>{title}</h3><p>{description}</p><ArrowUpRight size={19} aria-hidden="true" /></div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FourTopicsSection;
