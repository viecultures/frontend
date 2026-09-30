import React from 'react';
import { ArrowRight, Landmark, UtensilsCrossed, Palette, Sparkles, BookOpen } from 'lucide-react';

interface TopicPillar {
  pillarNumber: string;
  title: string;
  vietnameseTitle: string;
  categoryKey: string;
  description: string;
  imageUrl: string;
  articleCount: number;
  vocabTerms: number;
  icon: React.ReactNode;
}

const TOPIC_PILLARS: TopicPillar[] = [
  {
    pillarNumber: 'Pillar 01',
    title: 'History & Heritage',
    vietnameseTitle: 'Lịch Sử & Di Sản',
    categoryKey: 'Heritage',
    description: 'Dynastic history, UNESCO world heritage sites, ancient citadels, and independence milestones.',
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&q=80',
    articleCount: 45,
    vocabTerms: 320,
    icon: <Landmark className="w-4 h-4 text-antique-gold" />,
  },
  {
    pillarNumber: 'Pillar 02',
    title: 'Cuisine & Coffee',
    vietnameseTitle: 'Ẩm Thực & Cà Phê',
    categoryKey: 'Cuisine',
    description: 'Regional dishes, street food stories, egg coffee origin, and culinary vocabulary in context.',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    articleCount: 38,
    vocabTerms: 280,
    icon: <UtensilsCrossed className="w-4 h-4 text-antique-gold" />,
  },
  {
    pillarNumber: 'Pillar 03',
    title: 'Arts & Craft Villages',
    vietnameseTitle: 'Nghệ Thuật & Làng Nghề',
    categoryKey: 'Crafts',
    description: 'Traditional silk weaving, lacquerware, ceramics, water puppetry, and folk music history.',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    articleCount: 32,
    vocabTerms: 240,
    icon: <Palette className="w-4 h-4 text-antique-gold" />,
  },
  {
    pillarNumber: 'Pillar 04',
    title: 'Festivals & Beliefs',
    vietnameseTitle: 'Lễ Hội & Phong Tục',
    categoryKey: 'Folklore',
    description: 'Tet holiday traditions, Mid-Autumn full moon folklore, ancestral customs, and village rituals.',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80',
    articleCount: 29,
    vocabTerms: 210,
    icon: <Sparkles className="w-4 h-4 text-antique-gold" />,
  },
];

interface FourTopicsSectionProps {
  onNavigate?: (view: string) => void;
}

export const FourTopicsSection: React.FC<FourTopicsSectionProps> = ({ onNavigate }) => {
  const handleTopicClick = (_categoryKey: string) => {
    if (onNavigate) {
      onNavigate('discovery');
    } else {
      window.dispatchEvent(new CustomEvent('app:navigate', { detail: 'discovery' }));
    }
  };

  return (
    <section id="topics" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rice-paper text-heritage-green border border-antique-gold/40 text-xs font-bold shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
            <span className="uppercase tracking-widest text-[11px] font-extrabold">
              Content Curriculum
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-main tracking-tight">
            The 4 Core Topics <span className="italic text-antique-gold font-serif">(Pillars)</span>
          </h2>

          <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto font-normal leading-relaxed">
            Structured reading pathways designed to expand vocabulary across major cultural domains.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOPIC_PILLARS.map((pillar) => (
            <div
              key={pillar.pillarNumber}
              onClick={() => handleTopicClick(pillar.categoryKey)}
              className="group bg-white rounded-3xl border border-line overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-400 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Image Placeholder / Artwork Header */}
                <div className="relative h-56 w-full bg-heritage-dark overflow-hidden">
                  <img
                    src={pillar.imageUrl}
                    alt={pillar.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Top Pillar Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider text-heritage-forest shadow-md border border-line">
                    {pillar.pillarNumber}
                  </div>

                  {/* Bottom Stats Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-warm-ivory font-medium">
                    <span>{pillar.articleCount} bài đọc</span>
                    <span className="text-antique-bright font-mono font-bold">{pillar.vocabTerms}+ từ vựng</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-mountain-teal">
                    {pillar.icon}
                    <span>{pillar.vietnameseTitle}</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-text-main group-hover:text-heritage-green transition-colors leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-6 pt-0">
                <div className="pt-3 border-t border-line flex items-center justify-between text-xs font-bold text-heritage-green group-hover:text-mountain-teal transition-colors">
                  <span>Khám phá lộ trình</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FourTopicsSection;
