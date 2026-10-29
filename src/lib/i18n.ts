import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import viCommon from '../locales/vi/common.json';
import enCommon from '../locales/en/common.json';
import viAuth from '../locales/vi/auth.json';
import enAuth from '../locales/en/auth.json';
import viLanding from '../locales/vi/landing.json';
import enLanding from '../locales/en/landing.json';

export const SUPPORTED_LANGS = ['vi', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGS)[number];

export const resources = {
  vi: {
    common: viCommon,
    auth: viAuth,
    landing: viLanding,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    landing: enLanding,
  },
} as const;

const getInitialLanguage = (): SupportedLanguage => {
  try {
    const authLang = localStorage.getItem('viecultures_auth_language');
    if (authLang === 'vi' || authLang === 'en') {
      return authLang;
    }
    const saved = localStorage.getItem('viecultures_app_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.language === 'vi' || parsed.language === 'en') {
        return parsed.language;
      }
    }
  } catch (error) {
    console.error('[i18n] Failed to resolve initial language from storage:', error);
  }
  return 'vi';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'vi',
    defaultNS: 'common',
    ns: ['common', 'auth', 'landing'],
    interpolation: {
      escapeValue: false,
    },
  })
  .catch((error: unknown) => {
    console.error('[i18n] Initialization error:', error);
  });

export default i18n;
