import React from 'react';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { getLocalizedPath, resolveLanguage } from '@/routes/paths';
import { useParams, useLocation } from 'react-router-dom';
import i18n from '@/lib/i18n';

interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href?: string;
  to?: string;
  children?: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ href, to, children, onClick, className, ...props }) => {
  const navigate = useAppNavigate();
  const { lang: paramLang } = useParams<{ lang?: string }>();
  const location = useLocation();

  const currentLang = resolveLanguage(
    paramLang ||
    location.pathname.match(/^\/(vi|en)(\/|$)/)?.[1] ||
    i18n?.language
  );

  const rawTarget = to || href || '';
  const resolvedHref = React.useMemo(() => {
    if (rawTarget.startsWith('/') && !/^https?:\/\//i.test(rawTarget)) {
      return getLocalizedPath(rawTarget, currentLang);
    }
    return rawTarget;
  }, [rawTarget, currentLang]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (rawTarget.startsWith('#')) {
      const el = document.getElementById(rawTarget.slice(1));
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (rawTarget.startsWith('/') || rawTarget === '') {
      e.preventDefault();
      navigate(rawTarget || '/');
    }
  };

  return (
    <a href={resolvedHref} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};

export default Link;
