import { useCallback } from 'react';
import { useNavigate, useLocation, useParams, type NavigateOptions } from 'react-router-dom';
import i18n from '@/lib/i18n';
import { getLocalizedPath, resolveLanguage } from './paths';

/**
 * Standard in-app navigation: scroll to top, then navigate to a path.
 * Automatically resolves and preserves current language prefix (/vi or /en).
 * Always pass a value from PATHS / paths.* (see ./paths.ts) — never a "view name".
 */
export const useAppNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang: paramLang } = useParams<{ lang?: string }>();

  return useCallback(
    (to: string | number, options?: NavigateOptions) => {
      try {
        if (typeof to === 'number') {
          navigate(to);
          return;
        }

        if (/^https?:\/\//i.test(to)) {
          window.location.href = to;
          return;
        }

        const match = location.pathname.match(/^\/(vi|en)(\/|$)/);
        const currentLang = resolveLanguage(
          paramLang || (match ? match[1] : undefined) || i18n?.language
        );
        const targetPath = getLocalizedPath(to, currentLang);

        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(targetPath, options);
      } catch (error) {
        console.error('[useAppNavigate] Navigation failed:', error);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(to, options);
      }
    },
    [navigate, location.pathname, paramLang],
  );
};
