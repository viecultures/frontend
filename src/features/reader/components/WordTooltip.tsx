import React, { useState, useEffect, useRef, useContext } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, Bookmark, Check, X, BookOpen, ShieldAlert } from 'lucide-react';
import type { VocabItem } from '@/data/readerData';
import { maskProfanity } from '@/utils/dictionary-service';
import { SavedVocabularyContext } from '../hooks/useSavedVocabulary';
import { persistVocabProgress } from '@/features/flashcards/services/vocabProgressService';

export interface WordTooltipProps {
  isOpen: boolean;
  vocab: VocabItem | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  themeMode?: 'paper' | 'dark';
  onSave?: (savedVocab: VocabItem) => void;
}

/**
 * WordTooltip: Interactive vocabulary inspection tooltip in the bilingual reader.
 * Enforces Context-First rule: 1-Click save guarantees exact `context_sentence` attachment.
 */
export const WordTooltip: React.FC<WordTooltipProps> = ({
  isOpen,
  vocab,
  position,
  onClose,
  themeMode = 'paper',
  onSave,
}) => {
  const [legacySaved, setIsSaved] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const savedVocabulary = useContext(SavedVocabularyContext);
  const popupRef = useRef<HTMLDivElement>(null);
  const isLight = themeMode === 'paper';

  const isSaved = savedVocabulary
    ? savedVocabulary.words.some(
        (word) => word.id === vocab?.id || word.word.toLowerCase() === vocab?.word.toLowerCase()
      )
    : legacySaved;

  // Sync saved status with localStorage fallback
  useEffect(() => {
    if (vocab && !vocab.isProfane) {
      try {
        const saved = JSON.parse(localStorage.getItem('vie_saved_vocab') || '[]');
        const exists = saved.some(
          (item: VocabItem) =>
            item.id === vocab.id || item.word.toLowerCase() === vocab.word.toLowerCase()
        );
        setIsSaved(exists);
      } catch {
        setIsSaved(false);
      }
    }
  }, [vocab]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !vocab || !position || typeof document === 'undefined') {
    return null;
  }

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (vocab.isProfane) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(vocab.word);
      utterance.rate = 0.9;
      utterance.lang = 'en-US';
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  /**
   * 1-Click Save with guaranteed context sentence extraction
   */
  const handleToggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (vocab.isProfane) return;

    // Ensure context_sentence is strictly attached (Invariant: Never learn words in isolation)
    const contextSentence =
      vocab.contextSentence && vocab.contextSentence.trim().length > 0
        ? vocab.contextSentence.trim()
        : `"${vocab.word}" used in reading article context.`;

    const itemToSave: VocabItem = {
      ...vocab,
      contextSentence,
    };

    // 1. Context Provider save
    if (savedVocabulary) {
      savedVocabulary.toggle(itemToSave);
    }

    // 2. Local storage sync
    try {
      const saved: VocabItem[] = JSON.parse(localStorage.getItem('vie_saved_vocab') || '[]');
      let next: VocabItem[];
      if (isSaved) {
        next = saved.filter(
          (item) => item.id !== vocab.id && item.word.toLowerCase() !== vocab.word.toLowerCase()
        );
        setIsSaved(false);
      } else {
        next = [itemToSave, ...saved.filter((item) => item.id !== vocab.id)];
        setIsSaved(true);
      }
      localStorage.setItem('vie_saved_vocab', JSON.stringify(next));
    } catch {
      setIsSaved(!isSaved);
    }

    // 3. Persist to API with offline fallback
    void persistVocabProgress({
      vocabId: itemToSave.id || itemToSave.word.toLowerCase(),
      word: itemToSave.word,
      status: isSaved ? 'learning' : 'mastered',
      reviewCount: 1,
      contextSentence: itemToSave.contextSentence,
    });

    onSave?.(itemToSave);
  };

  // Clamped viewport position calculation
  const popupWidth = 340;
  const popupHeight = 280;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = position.x - popupWidth / 2;
  if (left < 16) left = 16;
  if (left + popupWidth > viewportWidth - 16) left = viewportWidth - popupWidth - 16;

  let top = position.y + 16;
  if (top + popupHeight > viewportHeight - 16) {
    top = Math.max(16, position.y - popupHeight - 16);
  }

  const isPhrase = vocab.word.trim().split(/\s+/).length > 1;

  return createPortal(
    <div
      ref={popupRef}
      style={{ top: `${top}px`, left: `${left}px`, width: `${popupWidth}px` }}
      role="dialog"
      aria-modal="true"
      aria-label={`Vocabulary tooltip: ${vocab.word}`}
      className={`word-tooltip in-place-dictionary-popup fixed z-[9999] p-4 rounded-2xl shadow-2xl border backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 ${
        isLight
          ? 'bg-warm-ivory/98 text-heritage-green border-antique-gold/60 shadow-[0_16px_45px_color-mix(in_srgb,_var(--color-heritage-green)_20%,_transparent)]'
          : 'bg-[#141C1A]/98 text-warm-ivory border-antique-gold/80 shadow-[0_16px_50px_rgba(0,0,0,0.8)]'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-antique-gold/25">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-sans font-bold text-base sm:text-lg leading-tight truncate text-current">
                {vocab.isProfane ? '*****' : vocab.word}
              </h3>
              {!vocab.isProfane && (
                <button
                  type="button"
                  onClick={handlePlayAudio}
                  title="Play pronunciation"
                  aria-label={`Pronounce ${vocab.word}`}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-antique-gold text-heritage-green'
                      : 'hover:bg-antique-gold/20 text-antique-gold'
                  }`}
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {!vocab.isProfane && vocab.ipa && vocab.ipa !== '/-/' && (
                <span className="font-mono text-xs text-antique-gold font-semibold">
                  {vocab.ipa}
                </span>
              )}
              <span
                className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                  vocab.isProfane
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                    : 'bg-heritage-green/10 dark:bg-white/10 text-heritage-green dark:text-sky-mist'
                }`}
              >
                {vocab.pos}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-current/60 hover:text-current hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
          title="Close definition"
          aria-label="Close definition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body: Meaning and Context Sentence */}
      <div className="py-2.5 space-y-2 text-xs">
        {vocab.isProfane ? (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Sensitive language</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">{vocab.viMeaning}</p>
            <p className="text-[10px] opacity-75 italic leading-tight">{vocab.enDefinition}</p>
          </div>
        ) : (
          <>
            {/* Vietnamese Translation */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] dark:text-[#6EE7B7] block">
                Vietnamese meaning:
              </span>
              <p className="font-medium mt-0.5 leading-relaxed text-current">{vocab.viMeaning}</p>
            </div>

            {/* English Definition */}
            {vocab.enDefinition && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-green dark:text-antique-gold block">
                  English Definition:
                </span>
                <p className="opacity-90 italic mt-0.5 leading-relaxed">{vocab.enDefinition}</p>
              </div>
            )}

            {/* Context Sentence (Context-First Rule) */}
            {vocab.contextSentence && (
              <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-antique-gold/20">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-antique-gold flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Article context:
                </span>
                <p className="text-[11px] opacity-90 mt-1 line-clamp-3 leading-normal italic font-serif">
                  "{maskProfanity(vocab.contextSentence)}"
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* 1-Click Save with Context Action */}
      <div className="pt-2 border-t border-antique-gold/25 flex items-center justify-between gap-2">
        {vocab.isProfane ? (
          <div className="w-full py-1.5 px-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center text-[11px] font-medium opacity-60">
            Saving sensitive language is unavailable
          </div>
        ) : (
          <button
            type="button"
            onClick={handleToggleSave}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              isSaved
                ? 'bg-[#059669] text-white hover:bg-[#047857]'
                : isLight
                ? 'bg-heritage-green text-warm-ivory hover:bg-heritage-dark'
                : 'bg-antique-gold text-heritage-green hover:bg-[#c9a657]'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved to vocabulary</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isPhrase ? 'Save phrase with context' : 'Save word with context'}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

export default WordTooltip;
