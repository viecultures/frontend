import 'i18next';
import type viCommon from '../locales/vi/common.json';
import type viAuth from '../locales/vi/auth.json';
import type viLanding from '../locales/vi/landing.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof viCommon;
      auth: typeof viAuth;
      landing: typeof viLanding;
    };
  }
}
