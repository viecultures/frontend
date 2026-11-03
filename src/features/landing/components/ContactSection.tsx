import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ContactSection: React.FC = () => {
  const { t } = useTranslation('landing');
  const bugReportHref = `mailto:viecultures@gmail.com?subject=${encodeURIComponent(t('contact_section.email_subject'))}`;

  return (
    <section id="contact" className="landing-section border-t border-line bg-surface-feature px-4 py-8 sm:px-6 sm:py-12 lg:px-8" aria-labelledby="contact-heading">
      <div className="landing-container mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        <div className="max-w-2xl">
          <p className="landing-series-kicker">{t('contact_section.eyebrow')}</p>
          <h2 id="contact-heading" className="font-serif text-3xl font-bold leading-tight text-heritage-forest sm:text-4xl">{t('contact_section.title')}</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-ink-soft">{t('contact_section.subtitle')}</p>
        </div>
        <div className="w-full rounded-3xl border border-line bg-surface p-7 shadow-sm sm:p-9">
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-surface-feature text-accent-ink"><MessageCircle size={25} aria-hidden="true" /></div>
          <h3 className="text-xl font-bold text-ink">{t('contact_section.feedback_title')}</h3>
          <p className="mt-3 text-sm leading-7 text-ink-soft">{t('contact_section.feedback_description')}</p>
          <a href={bugReportHref} className="focus-ring mx-auto mt-6 flex w-fit items-center gap-2 rounded-xl bg-heritage-forest px-5 py-3 text-sm font-semibold text-warm-ivory transition-colors hover:bg-heritage-dark">
            <Mail size={18} aria-hidden="true" />{t('contact_section.report_button')}
          </a>
          <p className="mt-4 text-sm text-ink-soft">{t('contact_section.email_label')}{' '}<a href={bugReportHref} className="font-semibold text-action underline underline-offset-4 focus-ring">viecultures@gmail.com</a></p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
