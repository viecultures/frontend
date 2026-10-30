import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate, Navigate, Outlet } from 'react-router-dom';
import i18n, { SUPPORTED_LANGS, type SupportedLanguage } from '@/lib/i18n';
import { PATHS } from '@/routes/paths';

const isValidLanguage = (lang?: string): lang is SupportedLanguage => {
  return typeof lang === 'string' && (SUPPORTED_LANGS as readonly string[]).includes(lang);
};

export const LanguageRouteLayout: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // If lang parameter is not valid ('vi' | 'en'), redirect to /vi + remaining path
  if (!isValidLanguage(lang)) {
    const isIsoLangCode =
      typeof lang === 'string' &&
      /^[a-z]{2}(-[A-Z]{2})?$/i.test(lang) &&
      !Object.values(PATHS).includes(`/${lang}` as any);

    let cleanPath = location.pathname;
    if (isIsoLangCode && lang && cleanPath.startsWith(`/${lang}`)) {
      cleanPath = cleanPath.slice(lang.length + 1);
    }
    const normalized = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    const redirectTarget = `/vi${normalized === '/' ? '' : normalized}${location.search}${location.hash}`;
    return <Navigate to={redirectTarget} replace />;
  }

  // When lang is valid, synchronize i18n, document.documentElement.lang, and SEO tags
  useEffect(() => {
    try {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang).catch((error: unknown) => {
          console.error('[LanguageRouteLayout] Failed to switch language:', error);
        });
      }
    } catch (error) {
      console.error('[LanguageRouteLayout] Unexpected error invoking i18n.changeLanguage:', error);
    }

    try {
      document.documentElement.lang = lang;
    } catch (error) {
      console.error('[LanguageRouteLayout] Failed to update document.documentElement.lang:', error);
    }

    try {
      const origin = window.location.origin;
      const pathname = location.pathname;
      const search = location.search;
      const canonicalHref = `${origin}${pathname}${search}`;

      const pathWithoutLang = pathname.replace(/^\/(vi|en)(\/|$)/, '/');
      const cleanPath = pathWithoutLang.startsWith('/') ? pathWithoutLang : `/${pathWithoutLang}`;
      const suffix = `${cleanPath === '/' ? '' : cleanPath}${search}`;
      const viHref = `${origin}/vi${suffix}`;
      const enHref = `${origin}/en${suffix}`;

      const updateOrCreateLink = (rel: string, href: string, hreflang?: string) => {
        let selector = `link[rel="${rel}"]`;
        if (hreflang) {
          selector += `[hreflang="${hreflang}"]`;
        }
        let element = document.querySelector<HTMLLinkElement>(selector);
        if (!element) {
          element = document.createElement('link');
          element.rel = rel;
          if (hreflang) {
            element.hreflang = hreflang;
          }
          document.head.appendChild(element);
        }
        element.href = href;
      };

      updateOrCreateLink('canonical', canonicalHref);
      updateOrCreateLink('alternate', viHref, 'vi');
      updateOrCreateLink('alternate', enHref, 'en');
      updateOrCreateLink('alternate', viHref, 'x-default');
    } catch (error) {
      console.error('[LanguageRouteLayout] Failed to sync SEO hreflang tags:', error);
    }
  }, [lang, location.pathname, location.search, navigate]);

  return <Outlet />;
};

export default LanguageRouteLayout;
