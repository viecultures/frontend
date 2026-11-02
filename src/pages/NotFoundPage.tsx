import React from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Compass, Home, BookOpen, ArrowLeft, LogIn, Sparkles } from 'lucide-react';
import { PATHS, getLocalizedPath, resolveLanguage } from '@/routes/paths';
import { getStoredUser, getStoredToken } from '@/utils/auth-storage';
import i18n from '@/lib/i18n';

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { lang: paramLang } = useParams<{ lang?: string }>();

  const currentLang = resolveLanguage(
    paramLang ||
    location.pathname.match(/^\/(vi|en)(\/|$)/)?.[1] ||
    i18n?.language
  );

  const isLoggedIn = !!getStoredUser() || !!getStoredToken();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(getLocalizedPath(PATHS.landing, currentLang));
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="relative w-full max-w-2xl bg-surface-raised dark:bg-[#1A2E2B] border border-antique-gold/30 dark:border-antique-gold/25 rounded-3xl p-7 sm:p-12 text-center shadow-xl backdrop-blur-sm overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 bg-antique-gold/15 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 -left-20 w-64 h-64 bg-heritage-green/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center">
          {/* Heritage Emblem with Dual Concentric Rings */}
          <div className="relative mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-heritage-green/10 dark:bg-antique-gold/15 border-2 border-antique-gold/40 flex items-center justify-center shadow-inner">
              <Compass
                className="w-10 h-10 sm:w-12 sm:h-12 text-heritage-green dark:text-antique-bright animate-[spin_24s_linear_infinite]"
                aria-hidden="true"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-heritage-green text-warm-ivory flex items-center justify-center shadow-sm border border-antique-gold/50">
              <Sparkles size={13} className="text-antique-gold" aria-hidden="true" />
            </div>
          </div>

          {/* Kicker badge */}
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-heritage-green/10 text-heritage-green dark:bg-antique-gold/15 dark:text-antique-bright border border-antique-gold/30 mb-4">
            {t('errors.not_found.badge', 'Lỗi 404 · Lạc bước hành trình')}
          </span>

          {/* Main Title */}
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-heritage-dark dark:text-warm-ivory tracking-tight max-w-lg leading-tight">
            {t('errors.not_found.title', 'Trang Không Tồn Tại')}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-ink-soft dark:text-warm-ivory/80 max-w-lg mt-4 leading-relaxed font-sans">
            {t(
              'errors.not_found.desc',
              'Con đường bạn vừa tìm có thể đã đổi hướng hoặc chưa được mở trên bản đồ di sản VieCultures. Hãy để chúng tôi dẫn bạn trở lại hành trình.'
            )}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 w-full max-w-md">
            {isLoggedIn ? (
              <Link
                to={getLocalizedPath(PATHS.home, currentLang)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-heritage-green text-warm-ivory hover:bg-heritage-dark shadow-sm transition-all focus-ring active:scale-95 flex-1 min-w-[160px]"
              >
                <Home className="w-4 h-4 text-antique-bright" aria-hidden="true" />
                <span>{t('errors.not_found.btn_home', 'Về phòng học')}</span>
              </Link>
            ) : (
              <Link
                to={getLocalizedPath(PATHS.landing, currentLang)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-heritage-green text-warm-ivory hover:bg-heritage-dark shadow-sm transition-all focus-ring active:scale-95 flex-1 min-w-[160px]"
              >
                <Home className="w-4 h-4 text-antique-bright" aria-hidden="true" />
                <span>{t('errors.not_found.btn_landing', 'Về trang chủ')}</span>
              </Link>
            )}

            <Link
              to={getLocalizedPath(PATHS.discovery, currentLang)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-surface border border-antique-gold/60 text-ink dark:text-warm-ivory hover:bg-surface-muted shadow-sm transition-all focus-ring active:scale-95 flex-1 min-w-[160px]"
            >
              <BookOpen className="w-4 h-4 text-antique-rich dark:text-antique-gold" aria-hidden="true" />
              <span>{t('errors.not_found.btn_explore', 'Khám phá di sản')}</span>
            </Link>

            {!isLoggedIn && (
              <Link
                to={`${getLocalizedPath(PATHS.login, currentLang)}?redirect=${encodeURIComponent(getLocalizedPath(PATHS.home, currentLang))}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-heritage-green dark:text-antique-bright hover:bg-heritage-green/10 transition-colors"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>{t('errors.not_found.btn_login', 'Đăng nhập')}</span>
              </Link>
            )}
          </div>

          {/* Back Button */}
          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex items-center gap-1.5 mt-6 text-xs font-medium text-ink-muted hover:text-ink dark:text-warm-ivory/60 dark:hover:text-warm-ivory transition-colors focus-ring rounded-lg px-3 py-1"
          >
            <ArrowLeft size={13} aria-hidden="true" />
            <span>{t('errors.not_found.btn_back', 'Quay lại trang trước')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
