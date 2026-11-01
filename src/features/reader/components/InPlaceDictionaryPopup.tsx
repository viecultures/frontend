import React, { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { SavedVocabularyContext } from '../hooks/useSavedVocabulary';
import { createPortal } from "react-dom";
import { Volume2, Bookmark, Check, X, BookOpen, ShieldAlert } from "lucide-react";
import type { VocabItem } from "@/data/readerData";
import { maskProfanity } from "@/utils/dictionary-service";

interface InPlaceDictionaryPopupProps {
  isOpen: boolean;
  vocab: VocabItem | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  themeMode?: "paper" | "dark";
}

export const InPlaceDictionaryPopup: React.FC<InPlaceDictionaryPopupProps> = ({
  isOpen,
  vocab,
  position,
  onClose,
  themeMode = "paper",
}) => {
  const { t } = useTranslation('reader');
  const [legacySaved, setIsSaved] = useState(false);
  const savedVocabulary = useContext(SavedVocabularyContext);
  const isSaved = savedVocabulary ? savedVocabulary.words.some(word => word.id === vocab?.id || word.word.toLowerCase() === vocab?.word.toLowerCase()) : legacySaved;
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [showVietnamese, setShowVietnamese] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const isLight = themeMode === "paper";
  const hasDictionaryAudio = Boolean(vocab?.audioUrl && /^https?:\/\//i.test(vocab.audioUrl));
  const hasBrowserVoice = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const ipa = vocab?.ipa?.trim() || '';
  const hasIpa = Boolean(ipa && ipa !== '/-/' && ipa !== '/.../' && ipa.toLowerCase() !== `/${vocab?.word.toLowerCase()}/`);

  useEffect(() => {
    setShowVietnamese(false);
  }, [isOpen, vocab?.id, vocab?.word]);

  // Check if word is already saved in localStorage
  useEffect(() => {
    if (vocab && !vocab.isProfane) {
      try {
        const saved = JSON.parse(localStorage.getItem("vie_saved_vocab") || "[]");
        const exists = saved.some((item: VocabItem) => item.id === vocab.id || item.word.toLowerCase() === vocab.word.toLowerCase());
        setIsSaved(exists);
      } catch (e) {
        setIsSaved(false);
      }
    }
  }, [vocab]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !vocab || !position) return null;
  if (typeof document === "undefined") return null;

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (vocab.isProfane) return;
    setAudioError(false);
    if (hasDictionaryAudio && vocab.audioUrl) {
      const audio = new Audio(vocab.audioUrl);
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => { setIsPlayingAudio(false); setAudioError(true); };
      setIsPlayingAudio(true);
      void audio.play().catch(() => { setIsPlayingAudio(false); setAudioError(true); });
      return;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(vocab.word);
      utterance.rate = 0.9;
      utterance.lang = "en-US";
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (vocab.isProfane) return;
    if (savedVocabulary) { savedVocabulary.toggle(vocab); return; }
    try {
      const saved: VocabItem[] = JSON.parse(localStorage.getItem("vie_saved_vocab") || "[]");
      if (isSaved) {
        const next = saved.filter((item) => item.id !== vocab.id && item.word.toLowerCase() !== vocab.word.toLowerCase());
        localStorage.setItem("vie_saved_vocab", JSON.stringify(next));
        setIsSaved(false);
      } else {
        const next = [vocab, ...saved.filter((item) => item.id !== vocab.id)];
        localStorage.setItem("vie_saved_vocab", JSON.stringify(next));
        setIsSaved(true);
      }
    } catch (e) {
      setIsSaved(!isSaved);
    }
  };

  // Clamped position calculation
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const popupWidth = Math.min(340, viewportWidth - 32);
  const popupHeight = showVietnamese ? 360 : 300;

  let left = position.x - popupWidth / 2;
  if (left < 16) left = 16;
  if (left + popupWidth > viewportWidth - 16) left = viewportWidth - popupWidth - 16;

  let top = position.y + 16;
  // If popup would overflow bottom, show above target
  if (top + popupHeight > viewportHeight - 16) {
    top = Math.max(16, position.y - popupHeight - 16);
  }
  top = Math.min(top, Math.max(16, viewportHeight - Math.min(popupHeight, viewportHeight - 32) - 16));

  const isPhrase = vocab.word.trim().split(/\s+/).length > 1;

  return createPortal(
    <div
      ref={popupRef}
      style={{ top: `${top}px`, left: `${left}px`, width: `${popupWidth}px`, maxHeight: 'calc(100dvh - 32px)' }}
      className={`in-place-dictionary-popup fixed z-[9999] overflow-y-auto p-4 rounded-2xl shadow-2xl border backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 ${
        isLight
          ? "bg-warm-ivory/98 text-heritage-green border-antique-gold/60 shadow-[0_16px_45px_color-mix(in_srgb,_var(--color-heritage-green)_20%,_transparent)]"
          : "bg-[#141C1A]/98 text-warm-ivory border-antique-gold/80 shadow-[0_16px_50px_rgba(0,0,0,0.8)]"
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
              {!vocab.isProfane && (hasDictionaryAudio || hasBrowserVoice) && (
                <button
                  onClick={handlePlayAudio}
                  title={hasDictionaryAudio ? t('dictionary.listen_dictionary_audio', 'Nghe âm thanh từ điển') : t('dictionary.listen_browser_speech', 'Nghe giọng đọc máy của trình duyệt')}
                  aria-label={hasDictionaryAudio ? t('dictionary.listen_dictionary_audio', 'Nghe âm thanh từ điển') : t('dictionary.listen_browser_speech', 'Nghe giọng đọc máy của trình duyệt')}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    isPlayingAudio
                      ? "bg-antique-gold text-heritage-green"
                      : "hover:bg-antique-gold/20 text-antique-gold"
                  }`}
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "animate-pulse" : ""}`} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {!vocab.isProfane && hasIpa && (
                <span className="font-mono text-xs text-antique-gold font-semibold">
                  {vocab.ipa}
                </span>
              )}
              {!vocab.isProfane && !hasIpa && <span className="text-xs opacity-70">{t('dictionary.no_ipa', 'Chưa có IPA')}</span>}
              {!vocab.isProfane && !hasDictionaryAudio && <span className="text-[10px] opacity-70">{hasBrowserVoice ? t('dictionary.machine_voice', 'Giọng máy') : t('dictionary.no_audio', 'Chưa có âm thanh')}</span>}
              <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                vocab.isProfane
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                  : "bg-heritage-green/10 dark:bg-white/10 text-heritage-green dark:text-sky-mist"
              }`}>
                {vocab.pos}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-current/60 hover:text-current hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
          title={t('dictionary.close_definition', 'Close definition')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {audioError && <p role="status" className="pt-1 text-xs text-red-600">{t('dictionary.audio_error', 'Không phát được âm thanh từ điển.')}</p>}

      {/* Meanings */}
      <div className="py-2.5 space-y-2 text-xs">
        {vocab.isProfane ? (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>{t('dictionary.sensitive_language', 'Sensitive language')}</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              {vocab.viMeaning}
            </p>
            <p className="text-[10px] opacity-75 italic leading-tight">
              {vocab.enDefinition}
            </p>
          </div>
        ) : (
          <>
            {/* English Definition */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-green dark:text-antique-gold block">
                {t('dictionary.english_definition', 'English definition:')}
              </span>
              <p className="opacity-90 mt-0.5 leading-relaxed" lang="en">
                {vocab.enDefinition || t('dictionary.no_english_definition', 'English definition is not available yet.')}
              </p>
            </div>

            <div>
              <button type="button" onClick={() => setShowVietnamese(value => !value)} aria-expanded={showVietnamese}
                className="text-[11px] font-semibold text-[#059669] dark:text-[#6EE7B7] hover:underline cursor-pointer">
                {showVietnamese ? t('dictionary.hide_vietnamese', 'Hide Vietnamese') : t('dictionary.show_vietnamese', 'Show Vietnamese')}
              </button>
              {showVietnamese && (
                <div className="mt-1" lang="vi">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] dark:text-[#6EE7B7] block">
                    {t('dictionary.vietnamese_meaning', 'Vietnamese meaning:')}
                  </span>
                  <p className="font-medium mt-0.5 leading-relaxed text-current">{vocab.viMeaning}</p>
                </div>
              )}
            </div>

            {/* Ngữ Cảnh Bài Đọc */}
            {vocab.contextSentence && (
              <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-antique-gold/15">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-antique-gold flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {t('dictionary.article_context', 'Article context:')}
                </span>
                <p className="text-[11px] opacity-80 mt-1 line-clamp-2 leading-normal">
                  "{maskProfanity(vocab.contextSentence)}"
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Action: + LƯU TỪ / Disabled for Profanity */}
      <div className="pt-2 border-t border-antique-gold/25 flex items-center justify-between gap-2">
        {vocab.isProfane ? (
          <div className="w-full py-1.5 px-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center text-[11px] font-medium opacity-60">
            {t('dictionary.sensitive_unavailable', 'Saving sensitive language is unavailable')}
          </div>
        ) : (
          <button
            onClick={handleToggleSave}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              isSaved
                ? "bg-[#059669] text-white hover:bg-[#047857]"
                : isLight
                ? "bg-heritage-green text-warm-ivory hover:bg-heritage-dark"
                : "bg-antique-gold text-heritage-green hover:bg-[#c9a657]"
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t('dictionary.saved_to_vocab', 'Saved to vocabulary')}</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isPhrase ? t('dictionary.save_phrase', 'Save phrase with context') : t('dictionary.save_word', 'Save word with context')}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

export default InPlaceDictionaryPopup;
