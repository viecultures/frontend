import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BrandLogo } from './BrandLogo';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { getPublishedSeries } from '@/data/series';
import { PATHS, paths } from '@/routes/paths';

const foodSeries = getPublishedSeries()
  .filter((series) => series.theme === 'cuisine' && series.chapters.length > 0);
const storyLibraryPath = PATHS.discovery;

const footerLinkClass =
  'inline-flex min-h-11 items-center gap-2 py-2 text-sm leading-snug text-warm-ivory/85 transition-colors hover:text-antique-bright focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-antique-bright';

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const isVietnamese = i18n.resolvedLanguage?.startsWith('vi') ?? i18n.language.startsWith('vi');
  return (
    <footer className="w-full border-t border-antique-gold/25 bg-heritage-dark font-sans text-warm-ivory">
      <div className="mx-auto max-w-7xl px-5 pb-8 sm:px-8 lg:px-10">
        <div className="grid gap-10 py-11 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-14 lg:py-14">
          <div className="max-w-sm sm:col-span-2 lg:col-span-1">
            <Link
              to={PATHS.landing}
              aria-label={t('footer.brand_home')}
              className="inline-flex min-h-11 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-antique-bright"
            >
              <BrandLogo size="md" theme="dark" />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-warm-ivory/80">
              {t('footer.tagline')}
            </p>
          </div>

          <nav aria-label={t('footer.food_title')}>
            <h3 className="mb-3 text-sm font-bold text-antique-bright">{t('footer.food_title')}</h3>
            <ul className="space-y-0.5">
              {foodSeries.slice(0, 3).map((series) => (
                <li key={series.id}>
                  <Link to={paths.reader({ story: series.chapters[0].id })} className={footerLinkClass}>
                    {isVietnamese ? series.titleVi : series.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to={storyLibraryPath} className={footerLinkClass}>
                  {t('footer.all_stories')}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label={t('footer.learning_title')}>
            <h3 className="mb-3 text-sm font-bold text-antique-bright">{t('footer.learning_title')}</h3>
            <ul className="space-y-0.5">
              <li><Link to={storyLibraryPath} className={footerLinkClass}>{t('footer.reading_library')}</Link></li>
              <li><Link to={PATHS.dictionary} className={footerLinkClass}>{t('footer.vocabulary')}</Link></li>
              <li><Link to={PATHS.playground} className={footerLinkClass}>{t('footer.practice')}</Link></li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-warm-ivory/20 pt-6 text-xs text-warm-ivory/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VieCultures. {t('footer.rights_reserved')}</p>
          <p>{t('footer.slogan')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
