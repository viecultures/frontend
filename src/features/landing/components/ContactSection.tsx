import React, { useState } from 'react';
import { Send, CheckCircle2, Mail, User, MessageSquare, Building, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ContactSection: React.FC = () => {
  const { t } = useTranslation('landing');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<'general' | 'partnership' | 'enterprise'>('general');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (val: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError && validateEmail(val)) {
      setEmailError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError(t('contact_section.email_invalid_error'));
      return;
    }

    setEmailError('');
    setIsSubmitting(true);

    // Simulate safe API submission and prevent duplicate submits
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <section
      id="contact"
      className="landing-section py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-surface border-t border-line"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-2xl mx-auto rounded-3xl border border-line p-6 sm:p-10 bg-surface shadow-lg space-y-6">
        {/* Section Header */}
        <div className="text-center space-y-2.5">
          <h2 id="contact-heading" className="font-serif text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            {t('contact_section.title')}
          </h2>

          <p className="text-xs sm:text-sm text-ink-soft max-w-md mx-auto font-normal leading-relaxed">
            {t('contact_section.subtitle')}
          </p>
        </div>

        {/* Contact Form / Confirmation */}
        {isSubmitted ? (
          <div
            className="p-6 sm:p-8 rounded-2xl bg-surface-feature border border-line text-ink flex flex-col items-center justify-center text-center space-y-3"
            role="status"
          >
            <div className="w-12 h-12 rounded-full bg-action/10 text-action flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
            </div>
            <h3 className="font-serif text-xl font-bold text-ink">{t('contact_section.success_title')}</h3>
            <p className="text-xs sm:text-sm text-ink-soft max-w-sm leading-relaxed">
              {t('contact_section.success_desc')}
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setName('');
                setEmail('');
                setMessage('');
              }}
              className="mt-2 px-5 py-2.5 rounded-xl bg-action text-surface text-xs font-semibold hover:bg-action-hover transition-colors cursor-pointer shadow-xs focus-ring"
            >
              {t('contact_section.send_another')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5 mb-1.5"
                >
                  <User className="w-3.5 h-3.5 text-antique-gold" aria-hidden="true" />
                  <span>{t('contact_section.name_label')}</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder={t('contact_section.name_placeholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-feature text-xs sm:text-sm text-ink placeholder:text-ink-soft/60 focus:bg-surface focus:outline-none focus-ring shadow-xs transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5 mb-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-antique-gold" aria-hidden="true" />
                  <span>{t('contact_section.email_label')}</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'contact-email-error' : undefined}
                  placeholder={t('contact_section.email_placeholder')}
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-surface-feature text-xs sm:text-sm text-ink placeholder:text-ink-soft/60 focus:bg-surface focus:outline-none focus-ring shadow-xs transition-colors ${
                    emailError ? 'border-red-500' : 'border-line'
                  }`}
                />
                {emailError && (
                  <p id="contact-email-error" className="text-xs text-red-600 mt-1" role="alert">
                    {emailError}
                  </p>
                )}
              </div>
            </div>

            {/* Topic Switcher */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5 mb-1.5">
                <Building className="w-3.5 h-3.5 text-antique-gold" aria-hidden="true" />
                <span>{t('contact_section.topic_label')}</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-medium">
                {(['general', 'partnership', 'enterprise'] as const).map((topicKey) => (
                  <button
                    key={topicKey}
                    type="button"
                    onClick={() => setTopic(topicKey)}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer focus-ring ${
                      topic === topicKey
                        ? 'bg-action text-surface border-action font-semibold shadow-xs'
                        : 'bg-surface-feature text-ink-soft border-line hover:text-ink'
                    }`}
                  >
                    {t(`contact_section.topics.${topicKey}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Area */}
            <div>
              <label
                htmlFor="contact-message"
                className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5 mb-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-antique-gold" aria-hidden="true" />
                <span>{t('contact_section.message_label')}</span>
              </label>
              <textarea
                id="contact-message"
                required
                rows={3}
                placeholder={t('contact_section.message_placeholder')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-feature text-xs sm:text-sm text-ink placeholder:text-ink-soft/60 focus:bg-surface focus:outline-none focus-ring shadow-xs transition-colors resize-y"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !email.trim() || !message.trim()}
              className="w-full py-3.5 px-5 rounded-xl bg-action hover:bg-action-hover text-surface font-semibold text-xs sm:text-sm transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer focus-ring"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>{t('contact_section.btn_sending')}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>{t('contact_section.btn_send')}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
