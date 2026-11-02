import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export type SupportedLang = 'vi' | 'en';

export interface LanguageSwitcherProps {
  className?: string;
  variant?: 'compact' | 'standard' | 'menu';
}

export const resolveLocalizedPath = (
  pathname: string,
  targetLang: SupportedLang,
  search: string = '',
  hash: string = ''
): string => {
  let targetPathname = pathname;

  if (pathname === '/vi' || pathname.startsWith('/vi/')) {
    targetPathname = pathname.replace(/^\/vi(?=\/|$)/, `/${targetLang}`);
  } else if (pathname === '/en' || pathname.startsWith('/en/')) {
    targetPathname = pathname.replace(/^\/en(?=\/|$)/, `/${targetLang}`);
  } else {
    if (!pathname || pathname === '/') {
      targetPathname = `/${targetLang}`;
    } else {
      const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
      targetPathname = `/${targetLang}${normalizedPath}`;
    }
  }

  return `${targetPathname}${search}${hash}`;
};

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'standard',
}) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const currentLang = useMemo<SupportedLang>(() => {
    const { pathname } = location;
    if (pathname === '/en' || pathname.startsWith('/en/')) {
      return 'en';
    }
    if (pathname === '/vi' || pathname.startsWith('/vi/')) {
      return 'vi';
    }
    const detectedLang = i18n?.language?.toLowerCase() || '';
    if (detectedLang.startsWith('en')) {
      return 'en';
    }
    return 'vi';
  }, [location.pathname, i18n.language]);

  useEffect(() => {
    try {
      if (document.documentElement.lang !== currentLang) {
        document.documentElement.lang = currentLang;
      }
    } catch (error) {
      console.error('[LanguageSwitcher] Failed to sync documentElement.lang:', error);
    }
  }, [currentLang]);

  const handleLanguageChange = (targetLang: SupportedLang) => {
    if (currentLang === targetLang) {
      return;
    }

    try {
      const newPath = resolveLocalizedPath(
        location.pathname,
        targetLang,
        location.search,
        location.hash
      );

      if (i18n && typeof i18n.changeLanguage === 'function') {
        i18n.changeLanguage(targetLang).catch((error: unknown) => {
          console.error('[LanguageSwitcher] i18n.changeLanguage failed:', error);
        });
      }

      document.documentElement.lang = targetLang;
      localStorage.setItem('viecultures_auth_language', targetLang);

      navigate(newPath);
    } catch (error) {
      console.error('[LanguageSwitcher] Language switch encountered error:', error);
    }
  };

  const isCompact = variant === 'compact';

  return (
    <div
      role="group"
      aria-label="Language selector / Chọn ngôn ngữ"
      className={`inline-flex items-center rounded-lg border border-[#D5CDBD] bg-white/65 backdrop-blur-sm p-[2.5px] gap-0.5 select-none shadow-xs ${className}`}
    >
      <button
        type="button"
        onClick={() => handleLanguageChange('vi')}
        aria-label="Chuyển sang Tiếng Việt"
        aria-pressed={currentLang === 'vi'}
        className={`border-0 rounded-[5px] font-bold tracking-wide cursor-pointer transition-all duration-160 ${
          isCompact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-[11.5px]'
        } ${
          currentLang === 'vi'
            ? 'bg-[#DFB76C] text-[#19382B] shadow-xs'
            : 'bg-transparent text-[#52665F] hover:text-[#19382B]'
        }`}
      >
        VI
      </button>

      <button
        type="button"
        onClick={() => handleLanguageChange('en')}
        aria-label="Switch to English"
        aria-pressed={currentLang === 'en'}
        className={`border-0 rounded-[5px] font-bold tracking-wide cursor-pointer transition-all duration-160 ${
          isCompact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-[11.5px]'
        } ${
          currentLang === 'en'
            ? 'bg-[#DFB76C] text-[#19382B] shadow-xs'
            : 'bg-transparent text-[#52665F] hover:text-[#19382B]'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
