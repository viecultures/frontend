import React from 'react';
import { useTranslation } from 'react-i18next';

export const LandingConversionSection: React.FC = () => {
  const { t } = useTranslation('landing');

  return (
    <aside className="landing-pricing-notice" aria-label={t('conversion.badge')}>
      <div>
        <p className="landing-pricing-notice-label">{t('conversion.badge')}</p>
        <p className="landing-pricing-notice-title">{t('conversion.title')}</p>
        <p className="landing-pricing-notice-description">{t('conversion.subtitle')}</p>
      </div>
    </aside>
  );
};

export default LandingConversionSection;
