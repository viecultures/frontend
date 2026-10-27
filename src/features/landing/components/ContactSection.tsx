import React, { useState } from 'react';
import { Send, CheckCircle2, Mail, User, MessageSquare, Building, Loader2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('general');
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
      setEmailError('Please enter a valid email address (e.g. name@example.com).');
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
            Contact the VieCultures team
          </h2>

          <p className="text-xs sm:text-sm text-ink-soft max-w-md mx-auto font-normal leading-relaxed">
            Have a question about bilingual learning, heritage partnerships, or feedback? We’d love to hear from you.
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
            <h3 className="font-serif text-xl font-bold text-ink">Thanks for reaching out!</h3>
            <p className="text-xs sm:text-sm text-ink-soft max-w-sm leading-relaxed">
              We received your message and will respond to your email within one business day.
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
              Send another message
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
                  <span>Full name</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="e.g. Alex Nguyen"
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
                  <span>Email address</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'contact-email-error' : undefined}
                  placeholder="name@example.com"
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
                <span>Topic</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-medium">
                {[
                  { key: 'general', label: 'Learner Inquiry' },
                  { key: 'partnership', label: 'Content Partner' },
                  { key: 'enterprise', label: 'School / Team' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTopic(item.key)}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer focus-ring ${
                      topic === item.key
                        ? 'bg-action text-surface border-action font-semibold shadow-xs'
                        : 'bg-surface-feature text-ink-soft border-line hover:text-ink'
                    }`}
                  >
                    {item.label}
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
                <span>Message</span>
              </label>
              <textarea
                id="contact-message"
                required
                rows={3}
                placeholder="Share your questions, thoughts, or suggestions..."
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
                  <span>Sending message...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>Send Message</span>
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
