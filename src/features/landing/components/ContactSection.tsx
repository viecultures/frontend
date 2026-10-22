import React, { useState } from 'react';
import { Send, CheckCircle2, Mail, User, MessageSquare, Sparkles, Building, HelpCircle } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('general');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && message.trim()) {
      setIsSubmitted(true);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-surface border-t border-line"
    >
      <div className="max-w-3xl mx-auto rounded-3xl border-2 border-border-dark p-8 sm:p-12 bg-white shadow-2xl space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rice-paper text-heritage-green border border-antique-gold/40 text-xs font-bold shadow-xs">
            <Mail className="w-3.5 h-3.5 text-antique-gold" />
            <span className="uppercase tracking-widest text-[11px] font-extrabold">
              GET IN TOUCH
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-main tracking-tight">
            Contact the VieCultures team
          </h2>

          <p className="text-xs sm:text-sm text-text-muted max-w-lg mx-auto font-normal leading-relaxed">
            Have a question about learning, a heritage content partnership idea, or feedback about the platform?
          </p>
        </div>

        {/* Contact Form */}
        {isSubmitted ? (
          <div className="p-8 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-emerald-900 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in zoom-in-95 duration-200 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            <h3 className="font-serif text-xl font-bold">Thanks for reaching out!</h3>
            <p className="text-xs sm:text-sm text-emerald-800 max-w-md leading-relaxed">
              The VieCultures team received your message from <strong className="text-emerald-950">{email}</strong>. We’ll get back to you within one business day.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setName('');
                setEmail('');
                setMessage('');
              }}
              className="mt-3 px-5 py-2 rounded-xl bg-emerald-700 text-warm-ivory text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer shadow-xs"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="text-xs font-bold uppercase tracking-wider text-text-main flex items-center gap-1.5 mb-2"
                >
                  <User className="w-3.5 h-3.5 text-antique-gold" />
                  <span>Full name</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="e.g. Alex Nguyen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-line bg-surface text-sm text-text-main placeholder-text-muted/60 focus:bg-white focus:outline-none focus-ring shadow-xs transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="text-xs font-bold uppercase tracking-wider text-text-main flex items-center gap-1.5 mb-2"
                >
                  <Mail className="w-3.5 h-3.5 text-antique-gold" />
                  <span>Email address</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-line bg-surface text-sm text-text-main placeholder-text-muted/60 focus:bg-white focus:outline-none focus-ring shadow-xs transition-colors"
                />
              </div>
            </div>

            {/* Inquiry Category Switcher */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-main flex items-center gap-1.5 mb-2">
                <Building className="w-3.5 h-3.5 text-antique-gold" />
                <span>What are you contacting us about?</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold">
                {[
                  { key: 'general', label: 'Individual learner' },
                  { key: 'partnership', label: 'Heritage content partnership' },
                  { key: 'enterprise', label: 'School or business' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTopic(item.key)}
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                      topic === item.key
                        ? 'bg-heritage-green text-warm-ivory border-heritage-green font-bold shadow-xs'
                        : 'bg-surface text-text-muted border-line hover:text-text-main hover:bg-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="text-xs font-bold uppercase tracking-wider text-text-main flex items-center gap-1.5 mb-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-antique-gold" />
                <span>Your message</span>
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                placeholder="Share your question, idea, or feedback..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-line bg-surface text-sm text-text-main placeholder-text-muted/60 focus:bg-white focus:outline-none focus-ring shadow-xs transition-colors resize-y"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-antique-bright via-antique-rich to-antique-gold text-heritage-forest font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg hover:brightness-105 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer focus-ring"
            >
              <Send className="w-4 h-4 text-heritage-forest" />
              <span>Send your message</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
