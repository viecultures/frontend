import 'i18next';
import type viCommon from '../locales/vi/common.json';
import type viAuth from '../locales/vi/auth.json';
import type viLanding from '../locales/vi/landing.json';
import type viHome from '../locales/vi/home.json';
import type viReader from '../locales/vi/reader.json';
import type viFlashcards from '../locales/vi/flashcards.json';
import type viDiscovery from '../locales/vi/discovery.json';
import type viSubscription from '../locales/vi/subscription.json';
import type viAdmin from '../locales/vi/admin.json';
import type viCommunity from '../locales/vi/community.json';
import type viPlayground from '../locales/vi/playground.json';
import type viProfile from '../locales/vi/profile.json';

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
      subscription: typeof viSubscription;
      admin: typeof viAdmin;
      community: typeof viCommunity;
      playground: typeof viPlayground;
      profile: typeof viProfile;
    };
  }
}
