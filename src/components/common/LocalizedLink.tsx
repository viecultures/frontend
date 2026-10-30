import React from 'react';
import { Link as RouterLink, type LinkProps, useParams, useLocation } from 'react-router-dom';
import { getLocalizedPath, resolveLanguage } from '@/routes/paths';
import i18n from '@/lib/i18n';

export interface LocalizedLinkProps extends LinkProps {
  /** Optional language override ('vi' | 'en') */
  targetLang?: string;
}

/**
 * A drop-in replacement for React Router's Link that automatically
 * preserves or injects the active language prefix (/:lang) into URLs.
 */
export const LocalizedLink = React.forwardRef<HTMLAnchorElement, LocalizedLinkProps>(
  ({ to, targetLang, ...rest }, ref) => {
    const { lang: paramLang } = useParams<{ lang?: string }>();
    const location = useLocation();

    const currentLang = resolveLanguage(
      targetLang ||
      paramLang ||
      location.pathname.match(/^\/(vi|en)(\/|$)/)?.[1] ||
      i18n?.language
    );

    const resolvedTo = React.useMemo(() => {
      if (typeof to === 'string') {
        if (/^https?:\/\//i.test(to) || to.startsWith('mailto:') || to.startsWith('tel:')) {
          return to;
        }
        return getLocalizedPath(to, currentLang);
      }
      if (to && typeof to === 'object' && 'pathname' in to && typeof to.pathname === 'string') {
        return {
          ...to,
          pathname: getLocalizedPath(to.pathname, currentLang),
        };
      }
      return to;
    }, [to, currentLang]);

    return <RouterLink ref={ref} to={resolvedTo} {...rest} />;
  }
);

LocalizedLink.displayName = 'LocalizedLink';
export default LocalizedLink;

