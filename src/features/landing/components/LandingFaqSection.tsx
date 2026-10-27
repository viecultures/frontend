import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Book, Translate, ArrowRepeat, Mic, ShieldCheck, CheckCircle } from 'react-bootstrap-icons';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How is VieCultures different from traditional English learning apps?',
    answer:
      'Instead of generic Western texts, VieCultures anchors lessons to authentic Vietnamese heritage — food, craft villages, history, and customs. Learners build vocabulary to express Vietnamese identity naturally on global stages.',
    category: 'Our approach',
    icon: <Book className="w-4 h-4 text-antique-gold" aria-hidden="true" />,
  },
  {
    id: 'faq-2',
    question: 'How do bilingual reading and one-tap word lookup work?',
    answer:
      'Every story has aligned parallel sentences in Vietnamese and English. Tap any word to view its IPA pronunciation, part of speech, Vietnamese definition, and context sentence, with variable audio speeds (0.75x–1.5x).',
    category: 'Reading',
    icon: <Translate className="w-4 h-4 text-antique-gold" aria-hidden="true" />,
  },
  {
    id: 'faq-3',
    question: 'How does spaced repetition (SRS) help you remember words?',
    answer:
      'VieCultures adapts the proven SM-2 algorithm. Rate your recall after each card to schedule reviews at optimal memory intervals, converting short-term recognition into lasting active recall.',
    category: 'Memory',
    icon: <ArrowRepeat className="w-4 h-4 text-antique-gold" aria-hidden="true" />,
  },
  {
    id: 'faq-4',
    question: 'How does synchronized audio shadowing improve pronunciation?',
    answer:
      'Synchronized native-speaker recordings let you shadow phrase by phrase. Focus on natural sentence stress, intonation, and connected speech to speak English with authentic rhythm.',
    category: 'Pronunciation',
    icon: <Mic className="w-4 h-4 text-antique-gold" aria-hidden="true" />,
  },
  {
    id: 'faq-5',
    question: 'What is Safe Reflections?',
    answer:
      'Safe Reflections is a supportive space where learners write reflections about cultural stories without anxiety over constant red marks. Encouragement and genuine expression come first.',
    category: 'Community',
    icon: <ShieldCheck className="w-4 h-4 text-antique-gold" aria-hidden="true" />,
  },
  {
    id: 'faq-6',
    question: 'Can I start learning with VieCultures for free?',
    answer:
      'Yes. Featured stories, bilingual reader, vocabulary lookups, and the core review deck are free to explore. Create an account to save your learning history and streaks.',
    category: 'Getting started',
    icon: <CheckCircle className="w-4 h-4 text-antique-gold" aria-hidden="true" />,
  },
];

export const LandingFaqSection: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const handleToggle = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section
      id="faq"
      className="landing-section py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-surface-feature/30 border-t border-line"
      aria-labelledby="faq-title"
    >
      <div className="landing-container max-w-4xl space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 id="faq-title" className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight leading-tight">
            Your questions, <span className="italic text-accent-ink font-serif">answered</span>
          </h2>

          <p className="text-xs sm:text-sm text-ink-soft max-w-lg mx-auto font-normal leading-relaxed">
            Everything you need to know about learning English through Vietnamese cultural heritage.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            const btnId = `faq-btn-${faq.id}`;
            const panelId = `faq-panel-${faq.id}`;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-surface ${
                  isOpen
                    ? 'border-heritage-green/60 shadow-md ring-1 ring-antique-gold/30'
                    : 'border-line hover:border-antique-gold/40 shadow-xs'
                }`}
              >
                <button
                  id={btnId}
                  type="button"
                  onClick={() => handleToggle(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus-ring"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="p-2 rounded-xl bg-surface-feature border border-line shrink-0">
                      {faq.icon}
                    </span>
                    <span className="font-serif text-base sm:text-lg font-bold text-ink">
                      {faq.question}
                    </span>
                  </div>

                  <span className="p-1 rounded-full text-ink shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-accent-ink" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-ink-soft" aria-hidden="true" />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-ink-soft leading-relaxed border-t border-line/50"
                  >
                    <p className="pl-11 font-normal text-ink-soft">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingFaqSection;
