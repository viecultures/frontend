import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrandLogo } from './BrandLogo';
import { PATHS } from '@/routes/paths';
import { useAppNavigate } from '@/routes/useAppNavigate';

export const Footer: React.FC = () => {
  const { t } = useTranslation('common');
  const handleNav = useAppNavigate();

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-heritage-dark text-warm-ivory border-t border-antique-gold/30 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" theme="dark" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
            <p className="text-xs sm:text-sm text-warm-ivory/80 leading-relaxed max-w-sm font-normal">
              {t('footer.tagline', 'Learn English through the stories, places and traditions of Vietnam.')}
            </p>
          </div>

          {/* Col 1: Navigation */}
          <div className="space-y-3">
            <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-antique-gold">
              {t('footer.navigation_title', 'Navigation')}
            </h4>
            <ul className="space-y-2 text-xs text-warm-ivory/80 font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav(PATHS.home)}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  {t('footer.home', 'Home')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav(PATHS.discovery)}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  {t('footer.discover_stories', 'Discover stories')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav(PATHS.reader)}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  {t('footer.read', 'Read')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav(PATHS.dictionary)}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  {t('footer.vocabulary', 'Vocabulary')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav(PATHS.community)}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  {t('footer.community', 'Community')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav(PATHS.playground)}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  {t('footer.practice', 'Practice')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Topics */}
          <div className="space-y-3">
            <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-antique-gold">
              {t('footer.topics_title', 'Topics')}
            </h4>
            <ul className="space-y-2 text-xs text-warm-ivory/80 font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo('topics')}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  {t('footer.history_heritage', 'History & Heritage')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo('topics')}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  {t('footer.cuisine_coffee', 'Cuisine & Coffee')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo('topics')}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  {t('footer.arts_craft', 'Arts & Craft Villages')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo('topics')}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  {t('footer.festivals_beliefs', 'Festivals & Beliefs')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Legal */}
          <div className="space-y-3">
            <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-antique-gold">
              {t('footer.contact_legal_title', 'Contact & Legal')}
            </h4>
            <ul className="space-y-2 text-xs text-warm-ivory/80 font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo('contact')}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  {t('footer.contact_support', 'Contact Support')}
                </button>
              </li>
              <li>
                <span>
                  {t('footer.privacy', 'Privacy Policy')}
                </span>
              </li>
              <li>
                <span>
                  {t('footer.terms', 'Terms of Service')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 border-t border-antique-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-warm-ivory/60 font-medium">
          <p>{t('footer.copyright', '© 2026 VieCultures • VN Culture Reader. All rights reserved.')}</p>
          <p>{t('footer.slogan', 'Engrave words, Preserve cultures.')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
