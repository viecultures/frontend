import 'i18next';
import type viCommon from '../locales/vi/common.json';
import type viAuth from '../locales/vi/auth.json';
import type viLanding from '../locales/vi/landing.json';
import type viHome from '../locales/vi/home.json';
import type viReader from '../locales/vi/reader.json';
import type viFlashcards from '../locales/vi/flashcards.json';
import type viDiscovery from '../locales/vi/discovery.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof viCommon;
      auth: typeof viAuth;
      landing: typeof viLanding;
      home: typeof viHome;
      reader: typeof viReader;
      flashcards: typeof viFlashcards;
      discovery: typeof viDiscovery;
    };
  }
}
