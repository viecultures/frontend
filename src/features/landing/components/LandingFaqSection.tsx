import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, BookOpen, Brain, Mic, ShieldCheck } from 'lucide-react';

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
      'Instead of relying on unfamiliar Western reading passages, VieCultures combines 100% Vietnamese cultural heritage material—from food and craft villages to history and traditions—with internationally aligned English content across Levels 1–3. Learners build English fluency and learn useful word combinations to confidently share Vietnamese culture with the world.',
    category: 'Our approach',
    icon: <BookOpen className="w-4 h-4 text-antique-gold" />,
  },
  {
    id: 'faq-2',
    question: 'How do bilingual reading and one-tap word lookup work?',
    answer:
      'Each VieCultures story is carefully prepared in both Vietnamese and English. Tap any underlined word to see its pronunciation (IPA), part of speech, Vietnamese definition, and an example sentence, or hear native-style AI pronunciation at different speeds (0.75x–1.5x).',
    category: 'Reading',
    icon: <Sparkles className="w-4 h-4 text-antique-gold" />,
  },
  {
    id: 'faq-3',
    question: 'How does spaced repetition (SRS) help you remember words?',
    answer:
      'VieCultures uses an adaptation of the SM-2 algorithm, similar to Anki. After each card, rate how well you remembered the word (“Review again,” “Hard,” “Remembered,” or “Easy”). The system schedules the next review—from 10 minutes to several days later—using the forgetting curve to help move vocabulary into long-term memory without excessive repetition.',
    category: 'Memory',
    icon: <Brain className="w-4 h-4 text-antique-gold" />,
  },
  {
    id: 'faq-4',
    question: 'How does listening and repeating help with pronunciation and intonation?',
    answer:
      'AI-generated native-speaker audio lets you listen to each sentence and repeat at your preferred speed. Focus on word stress, sentence intonation, and connected speech to speak English more naturally and fluently.',
    category: 'Pronunciation',
    icon: <Mic className="w-4 h-4 text-antique-gold" />,
  },
  {
    id: 'faq-5',
    question: 'What is Safe Reflections, and why doesn’t it mark every mistake?',
    answer:
      'Safe Reflections is a community space where learners can write about heritage stories without the pressure of having every grammar mistake marked. We believe confidence and genuine curiosity help learners share Vietnamese culture in their own way.',
    category: 'Community',
    icon: <ShieldCheck className="w-4 h-4 text-antique-gold" />,
  },
  {
    id: 'faq-6',
    question: 'Can I start learning with VieCultures for free?',
    answer:
      'Yes. You can explore featured stories, look up words, listen to pronunciation, and try the core review deck for free. Create an account to save your learning progress.',
    category: 'Getting started',
    icon: <Sparkles className="w-4 h-4 text-antique-gold" />,
  },
];

export const LandingFaqSection: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const handleToggle = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-surface border-t border-line">
      <div className="max-w-4xl mx-auto space-y-12 sm:space-y-14">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rice-paper text-heritage-green border border-antique-gold/40 text-xs font-bold shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-antique-gold" />
            <span className="uppercase tracking-widest text-[11px] font-extrabold">
              FREQUENTLY ASKED QUESTIONS
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-main tracking-tight leading-tight">
            Your questions, <br className="hidden sm:inline" />
            <span className="italic text-antique-gold font-serif">answered.</span>
          </h2>

          <p className="text-xs sm:text-sm text-text-muted max-w-lg mx-auto font-normal leading-relaxed">
            Learn how VieCultures helps you study English through the stories and heritage of Vietnam.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-heritage-green/60 shadow-md ring-2 ring-antique-gold/20'
                    : 'bg-white/80 border-line hover:border-antique-gold/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus-ring"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="p-2 rounded-xl bg-rice-paper shrink-0">
                      {faq.icon}
                    </span>
                    <span className="font-serif text-base sm:text-lg font-bold text-text-main">
                      {faq.question}
                    </span>
                  </div>

                  <span className="p-1 rounded-full text-heritage-green shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-antique-gold" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-text-body leading-relaxed border-t border-line/40 animate-in fade-in duration-200">
                    <p className="pl-12 font-normal text-text-muted">
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
