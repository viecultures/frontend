import React, { useState } from 'react';
import {
  Headphones,
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Trophy,
  Lightbulb,
} from 'lucide-react';
import { READER_DICTATION_ITEMS, type DictationItem } from '../data/learningLoopData';

interface ReaderDictationSectionProps {
  themeMode?: 'paper' | 'dark';
  onDictationSuccess?: (completedCount: number) => void;
  items?: DictationItem[];
}

export const ReaderDictationSection: React.FC<ReaderDictationSectionProps> = ({
  themeMode = 'paper',
  onDictationSuccess,
  items = READER_DICTATION_ITEMS,
}) => {
  const isDark = themeMode === 'dark';
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, 'correct' | 'wrong' | null>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [correctIds, setCorrectIds] = useState<Set<string>>(new Set());

  const currentItem = items[currentIndex] || items[0];

  const playAudio = (spd = playbackSpeed) => {
    if ('speechSynthesis' in window && currentItem) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(currentItem.audioPromptText);
      u.lang = 'en-US';
      u.rate = spd;
      window.speechSynthesis.speak(u);
    }
  };

  const handleCheck = () => {
    if (!currentItem) return;
    const typed = (userInputs[currentItem.id] || '').trim().toLowerCase();
    const target = currentItem.missingWord.toLowerCase();

    if (typed === target) {
      setFeedbacks((prev) => ({ ...prev, [currentItem.id]: 'correct' }));
      const nextCorrect = new Set(correctIds).add(currentItem.id);
      setCorrectIds(nextCorrect);
      if (onDictationSuccess) {
        onDictationSuccess(nextCorrect.size);
      }
    } else {
      setFeedbacks((prev) => ({ ...prev, [currentItem.id]: 'wrong' }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCheck();
    }
  };

  const parts = currentItem?.sentenceTemplateEn ? currentItem.sentenceTemplateEn.split('{blank}') : [];
  const currentFeedback = feedbacks[currentItem?.id];
  const isInputCorrect = currentFeedback === 'correct';

  const containerBgClass = isDark
    ? 'bg-[#1E2925] text-warm-ivory border-antique-gold/30 shadow-xl'
    : 'bg-warm-ivory text-ink-soft border-heritage-green/12 shadow-xl';

  const innerCardBgClass = isDark
    ? 'bg-[#141C1A] border-antique-gold/20'
    : 'bg-rice-paper border-heritage-green/15';

  return (
    <div data-practice-theme={themeMode} className={`reader-practice-surface reader-practice-card reader-study-component reader-dictation-component rounded-3xl p-6 sm:p-10 transition-colors duration-300 border space-y-6 ${containerBgClass}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-antique-gold/25">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-antique-gold">
              Dictation
            </span>
          </div>
          <h2 className={`font-sans text-2xl font-bold ${isDark ? 'text-warm-ivory' : 'text-heritage-green'}`}>
            Listen and fill in the missing word
          </h2>
          <p className="text-xs sm:text-sm opacity-80 mt-1 leading-relaxed">
            Listen to the sentence, then type the missing word. Adjust the speed whenever you need.
          </p>
        </div>

        {/* Progress pill */}
        <div className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border ${isDark ? 'bg-[#18211E] border-antique-gold/30' : 'bg-white border-antique-gold/40'} shadow-xs`}>
          <Trophy className="w-4 h-4 text-antique-gold" />
          <span className="text-xs font-bold">
            Correct: {correctIds.size}/{items.length}
          </span>
        </div>
      </div>

      {/* Main Interactive Exercise Area */}
      <div className={`rounded-2xl p-6 sm:p-8 border space-y-6 ${innerCardBgClass}`}>
        {/* Speed Controls & Audio Play Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => playAudio()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-heritage-green hover:bg-heritage-dark text-white text-xs font-bold shadow-md transition-all cursor-pointer border border-antique-gold/50"
            >
              <Volume2 className="w-4 h-4 text-antique-gold" />
              <span>Play sentence</span>
            </button>
            <span className="text-xs opacity-60 italic">(Read aloud)</span>
          </div>

          {/* Speed Selector Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold mr-1 opacity-75">Speed:</span>
            {[0.5, 0.8, 1.0].map((spd) => (
              <button
                key={spd}
                aria-pressed={playbackSpeed === spd}
                type="button"
                onClick={() => {
                  setPlaybackSpeed(spd);
                  playAudio(spd);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  playbackSpeed === spd
                    ? 'bg-antique-gold text-heritage-green border-antique-gold shadow-xs'
                    : isDark
                    ? 'bg-[#1E2925] text-stone-300 border-antique-gold/20 hover:bg-[#2A3934]'
                    : 'bg-warm-ivory text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Fill in the blank sentence */}
        <div className="reader-dictation-sentence p-4 sm:p-6 rounded-2xl bg-white/80 dark:bg-black/20 border border-antique-gold/30 space-y-4">
          <div className="text-base sm:text-lg font-sans leading-loose tracking-wide">
            {parts[0]}
            <span className="inline-block mx-1">
              <input
                type="text"
                value={userInputs[currentItem?.id] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setUserInputs((prev) => ({ ...prev, [currentItem?.id]: val }));
                  if (currentFeedback) {
                    setFeedbacks((prev) => ({ ...prev, [currentItem?.id]: null }));
                  }
                }}
                onKeyDown={handleKeyDown}
                aria-label="Missing word"
                data-feedback={currentFeedback || undefined}
                placeholder="Missing word…"
                disabled={isInputCorrect}
                className={`w-36 sm:w-44 px-3 py-1 text-center font-bold text-sm sm:text-base rounded-lg border-2 transition-all outline-none ${
                  isInputCorrect
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : currentFeedback === 'wrong'
                    ? 'border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 animate-shake'
                    : isDark
                    ? 'border-antique-gold/60 bg-[#141C1A] text-warm-ivory focus:border-antique-gold'
                    : 'border-heritage-green/50 bg-white text-heritage-green focus:border-heritage-green'
                }`}
              />
            </span>
            {parts[1]}
          </div>

          {/* Vietnamese Translation Guide */}
          <div className="pt-3 border-t border-antique-gold/20 text-xs sm:text-sm italic opacity-85">
            <strong>Vietnamese translation:</strong> {currentItem?.viTranslation}
          </div>
        </div>

        {/* Feedback alert & Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {!isInputCorrect && (
              <button
                type="button"
                onClick={handleCheck}
                className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-heritage-green hover:bg-heritage-dark shadow-sm transition-all border border-antique-gold cursor-pointer"
              >
                Check answer
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowHints((prev) => ({ ...prev, [currentItem?.id]: !prev[currentItem?.id] }))}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isDark ? 'border-antique-gold/30 hover:bg-white/5' : 'border-stone-300 hover:bg-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-antique-gold" />
              <span>{showHints[currentItem?.id] ? 'Hide hint' : 'Show hint'}</span>
            </button>
          </div>

          {/* Status Message */}
          {currentFeedback === 'correct' && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Correct! You found the missing word.</span>
            </div>
          )}

          {currentFeedback === 'wrong' && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 text-xs font-bold">
              <XCircle className="w-4 h-4" />
              <span>Not quite. Try listening again at 0.8x.</span>
            </div>
          )}

          {/* Navigation Between Sentences */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="p-2 rounded-xl border border-antique-gold/30 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              title="Previous sentence"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold px-2">
              {currentIndex + 1} / {items.length}
            </span>
            <button
              type="button"
              disabled={currentIndex + 1 >= items.length}
              onClick={() => setCurrentIndex((prev) => Math.min(items.length - 1, prev + 1))}
              className="p-2 rounded-xl border border-antique-gold/30 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              title="Next sentence"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hint Box */}
        {showHints[currentItem?.id] && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span><strong>Hint:</strong> {currentItem?.hint}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReaderDictationSection;
