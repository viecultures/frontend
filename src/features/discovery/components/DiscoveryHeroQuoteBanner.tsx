import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from '@/components/Link';
import { ArrowRight, BookOpen } from 'lucide-react';

export const DiscoveryHeroQuoteBanner: React.FC = () => {
  const { t } = useTranslation('discovery');

  return (
    <section className="rounded-3xl bg-gradient-to-r from-rice-paper via-warm-ivory to-rice-paper border border-antique-gold/40 p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-antique-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-heritage-green/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10 space-y-3">
        {/* Reading emblem */}
        <div className="w-10 h-10 rounded-2xl bg-heritage-green border border-antique-gold/50 flex items-center justify-center mx-auto shadow-sm">
          <BookOpen className="w-5 h-5 text-antique-gold" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-green">
          {t('hero_quote.quote')}
        </h2>
        <p className="text-sm text-text-body mt-2 leading-relaxed max-w-xl mx-auto font-normal">
          {t('hero_quote.desc')}
        </p>

        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap pt-2">
          <Link
            href="/reader"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm transition-all focus-ring hover:scale-102"
          >
            <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
            <span>{t('hero_quote.btn_bilingual_reader')}</span>
          </Link>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-heritage-green bg-warm-ivory hover:bg-rice-paper border border-antique-gold shadow-sm transition-all focus-ring hover:scale-102"
          >
            <span>{t('hero_quote.btn_back_study_room')}</span>
            <ArrowRight className="w-3.5 h-3.5 text-antique-rich" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DiscoveryHeroQuoteBanner;