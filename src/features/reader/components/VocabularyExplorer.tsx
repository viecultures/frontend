import React, { useState, useContext, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Layers,
  Volume2,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Search,
} from 'lucide-react';
import type { VocabItem } from '@/data/readerData';
import { SavedVocabularyContext } from '../hooks/useSavedVocabulary';
import { getVocabImageUrl } from '../data/vocabImageManifest';
import type { ReaderSessionState } from '../services/readerSessionStorage';

export interface VocabularyExplorerProps {
  vocabularies: VocabItem[];
  themeMode?: 'paper' | 'dark';
  session: ReaderSessionState;
  onStartReview: () => void;
  onBackToReading: () => void;
  activeTab?: 'explore' | 'review';
  onSelectTab?: (tab: 'explore' | 'review') => void;
  articleTitle?: string;
}

export const VocabularyExplorer: React.FC<VocabularyExplorerProps> = ({
  vocabularies,
  themeMode = 'paper',
  session,
  onStartReview,
  onBackToReading,
  activeTab = 'explore',
  onSelectTab,
  articleTitle,
}) => {
  const { t } = useTranslation('reader');
  const isDark = themeMode === 'dark';
  const savedVocabulary = useContext(SavedVocabularyContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPos, setSelectedPos] = useState<string>('all');
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  // Deriving reviewed/remembered/needsReview stats from session
  const totalCount = vocabularies.length;
  const reviewedSet = useMemo(() => new Set(session.vocab?.reviewedIds ?? []), [session.vocab?.reviewedIds]);
  const rememberedSet = useMemo(() => new Set(session.vocab?.rememberedIds ?? []), [session.vocab?.rememberedIds]);
  const reviewLaterSet = useMemo(() => new Set(session.vocab?.reviewLaterIds ?? []), [session.vocab?.reviewLaterIds]);

  const reviewedCount = useMemo(() => {
    return vocabularies.filter((v) => reviewedSet.has(v.id)).length;
  }, [vocabularies, reviewedSet]);

  // Unique parts of speech for filtering
  const posList = useMemo(() => {
    const set = new Set<string>();
    vocabularies.forEach((v) => {
      if (v.pos) set.add(v.pos.trim().toLowerCase());
    });
    return Array.from(set);
  }, [vocabularies]);

  // Filtered vocabulary list
  const filteredVocabs = useMemo(() => {
    return vocabularies.filter((item) => {
      if (selectedPos !== 'all' && item.pos?.toLowerCase() !== selectedPos) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.word.toLowerCase().includes(q) ||
        item.viMeaning.toLowerCase().includes(q) ||
        (item.enDefinition && item.enDefinition.toLowerCase().includes(q))
      );
    });
  }, [vocabularies, selectedPos, searchQuery]);

  // Audio pronunciation player
  const playSpeechSynthesis = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onend = () => setPlayingWord(null);
      utterance.onerror = () => setPlayingWord(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setPlayingWord(null);
    }
  }, []);

  const handlePlayAudio = useCallback(
    (item: VocabItem) => {
      if (item.isProfane) return;
      setPlayingWord(item.word);

      if (item.audioUrl && /^https?:\/\//i.test(item.audioUrl)) {
        const audio = new Audio(item.audioUrl);
        audio.onended = () => setPlayingWord(null);
        audio.onerror = () => playSpeechSynthesis(item.word);
        audio.play().catch(() => playSpeechSynthesis(item.word));
        return;
      }

      playSpeechSynthesis(item.word);
    },
    [playSpeechSynthesis]
  );

  const isWordSaved = (item: VocabItem) => {
    return (
      savedVocabulary?.words.some(
        (w) => w.id === item.id || w.word.toLowerCase() === item.word.toLowerCase()
      ) ?? false
    );
  };

  const handleToggleSave = (item: VocabItem) => {
    savedVocabulary?.toggle(item);
  };

  return (
    <div className="vc-vocab-explorer space-y-6" data-practice-theme={themeMode}>
      {/* Top Navigation Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToReading}
          className="rp-back-link inline-flex items-center gap-2 text-xs font-semibold text-heritage-green dark:text-antique-gold hover:underline cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{t('vocab_explorer.back_to_reading', 'Quay lại bài đọc')}</span>
        </button>

        {articleTitle && (
          <span className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-xs sm:max-w-md">
            {articleTitle}
          </span>
        )}
      </div>

      {/* Sub-navigation Tabs: Explore vs Quick Review */}
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-antique-gold/25 pb-3">
        <div className="inline-flex rounded-xl p-1 bg-stone-200/60 dark:bg-stone-800/60 border border-antique-gold/20" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'explore'}
            onClick={() => onSelectTab?.('explore')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-heritage-green text-warm-ivory shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-heritage-green dark:hover:text-antique-gold'
            }`}
          >
            <BookOpen size={15} />
            <span>
              {t('vocab_explorer.tab_explore', {
                count: totalCount,
                defaultValue: `Khám phá từ vựng (${totalCount})`,
              })}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'review'}
            onClick={() => onSelectTab?.('review')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'review'
                ? 'bg-heritage-green text-warm-ivory shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-heritage-green dark:hover:text-antique-gold'
            }`}
          >
            <Layers size={15} />
            <span>
              {t('vocab_explorer.tab_review', {
                reviewed: reviewedCount,
                total: totalCount,
                defaultValue: `Ôn tập Flashcards (${reviewedCount}/${totalCount})`,
              })}
            </span>
          </button>
        </div>

        {/* Direct Action to Quick Review */}
        <button
          type="button"
          onClick={onStartReview}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-antique-gold text-heritage-green hover:bg-antique-gold/90 transition-all shadow-xs cursor-pointer"
        >
          <Layers size={15} />
          <span>{t('vocab_explorer.start_review', 'Bắt đầu ôn tập Flashcard')}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Explorer Header & Search/Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-heritage-green dark:text-antique-gold">
              {t('vocab_explorer.title', 'Khám phá từ vựng')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-0.5">
              {t('vocab_explorer.subtitle', 'Tìm hiểu ngữ cảnh văn hóa, cách phát âm và ý nghĩa của các từ vựng trong bài')}
            </p>
          </div>

          {/* Progress Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-antique-gold/40 bg-rice-paper dark:bg-stone-900/60 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-antique-gold animate-pulse" />
            <span className="text-stone-700 dark:text-stone-300">
              {t('journey.vocab_progress', {
                done: reviewedCount,
                total: totalCount,
                defaultValue: `${reviewedCount}/${totalCount} từ đã ôn`,
              })}
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('vocab_explorer.search_placeholder', 'Tìm kiếm từ vựng hoặc nghĩa...')}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-antique-gold/30 bg-rice-paper dark:bg-stone-900/40 text-xs sm:text-sm text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:border-antique-gold"
            />
          </div>

          {/* POS Chips */}
          {posList.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedPos('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedPos === 'all'
                    ? 'bg-heritage-green text-warm-ivory'
                    : 'bg-stone-200/70 dark:bg-stone-800/70 text-stone-600 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
                }`}
              >
                {t('vocab_explorer.filter_all', 'Tất cả')} ({vocabularies.length})
              </button>
              {posList.map((pos) => {
                const count = vocabularies.filter((v) => v.pos?.toLowerCase() === pos).length;
                return (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setSelectedPos(pos)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap uppercase font-mono transition-colors cursor-pointer ${
                      selectedPos === pos
                        ? 'bg-heritage-green text-warm-ivory'
                        : 'bg-stone-200/70 dark:bg-stone-800/70 text-stone-600 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
                    }`}
                  >
                    {pos} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      {filteredVocabs.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-antique-gold/40 text-stone-500">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-antique-gold opacity-60" />
          <p className="text-xs sm:text-sm">{t('vocab_explorer.empty_vocab', 'Không tìm thấy từ vựng phù hợp.')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredVocabs.map((item) => {
            const imageUrl = getVocabImageUrl(item.id, item.word);
            const isSaved = isWordSaved(item);
            const isRemembered = rememberedSet.has(item.id);
            const isReviewLater = reviewLaterSet.has(item.id);
            const isPlaying = playingWord === item.word;

            return (
              <article
                key={item.id}
                className={`relative flex flex-col justify-between rounded-2xl p-4 sm:p-5 border transition-all duration-200 shadow-xs ${
                  isDark
                    ? 'bg-[#141C1A] border-antique-gold/30 hover:border-antique-gold'
                    : 'bg-rice-paper border-antique-gold/40 hover:border-antique-gold hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Row: Word, POS badge, Controls */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <h3 className="font-sans text-xl sm:text-2xl font-bold text-heritage-green dark:text-antique-gold leading-tight break-words">
                        {item.word}
                      </h3>
                      {item.pos && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-heritage-green/10 text-heritage-green dark:bg-antique-gold/15 dark:text-antique-gold">
                          {item.pos}
                        </span>
                      )}
                    </div>

                    {/* Action Controls: Pronounce & Save */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(item)}
                        title={t('vocab_explorer.listen_pronunciation', 'Nghe phát âm')}
                        aria-label={t('vocab_explorer.listen_pronunciation', 'Nghe phát âm')}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          isPlaying
                            ? 'bg-antique-gold text-heritage-green'
                            : 'text-antique-gold hover:bg-antique-gold/20'
                        }`}
                      >
                        <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                      </button>

                      {savedVocabulary && (
                        <button
                          type="button"
                          onClick={() => handleToggleSave(item)}
                          title={isSaved ? t('vocab_explorer.saved_word', 'Đã lưu vào sổ từ') : t('vocab_explorer.save_word', 'Lưu từ vựng')}
                          aria-label={isSaved ? t('vocab_explorer.saved_word', 'Đã lưu vào sổ từ') : t('vocab_explorer.save_word', 'Lưu từ vựng')}
                          aria-pressed={isSaved}
                          className="p-2 rounded-xl text-heritage-green dark:text-antique-gold hover:bg-antique-gold/20 transition-colors cursor-pointer"
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 fill-current text-heritage-green dark:text-antique-gold" />
                          ) : (
                            <Bookmark className="w-4 h-4 text-stone-400 hover:text-heritage-green dark:hover:text-antique-gold" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* IPA Transcription if available */}
                  {item.ipa && (
                    <div className="text-xs font-mono text-stone-500 dark:text-stone-400 italic mb-2">
                      {item.ipa}
                    </div>
                  )}

                  {/* Optional Curated Illustration - Only rendered when asset exists */}
                  {imageUrl && (
                    <div className="w-full h-36 rounded-xl overflow-hidden my-2.5 border border-antique-gold/25 bg-black/5">
                      <img
                        src={imageUrl}
                        alt={item.word}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Vietnamese Meaning */}
                  <div className="text-sm font-bold text-heritage-green dark:text-warm-ivory mb-1">
                    {item.viMeaning}
                  </div>

                  {/* English Definition if present */}
                  {item.enDefinition && item.enDefinition !== item.contextSentence && (
                    <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 mb-2 leading-relaxed">
                      {item.enDefinition}
                    </p>
                  )}

                  {/* Original Story Context Example */}
                  {item.contextSentence && (
                    <blockquote className="p-2.5 rounded-xl bg-warm-ivory/60 dark:bg-stone-900/60 border border-antique-gold/20 text-xs italic text-stone-700 dark:text-stone-300 mt-2 leading-relaxed">
                      &ldquo;{item.contextSentence}&rdquo;
                    </blockquote>
                  )}
                </div>

                {/* Footer Evaluation Tag from Flashcard Practice */}
                <div className="mt-3 pt-2.5 border-t border-antique-gold/15 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400 dark:text-stone-500 text-[10px]">
                    ID: {item.id}
                  </span>

                  {isRemembered ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('quick_flashcards.remembered_btn', 'Đã nhớ')}</span>
                    </span>
                  ) : isReviewLater ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{t('quick_flashcards.review_again_btn', 'Cần ôn lại')}</span>
                    </span>
                  ) : (
                    <span className="text-stone-400 dark:text-stone-500">
                      {t('vocab_explorer.unreviewed', 'Chưa ôn Flashcard')}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Bottom CTA to trigger Flashcards */}
      {filteredVocabs.length > 0 && (
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={onStartReview}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm bg-heritage-green text-warm-ivory hover:bg-heritage-green/90 transition-all shadow-md cursor-pointer"
          >
            <Layers size={17} />
            <span>{t('vocab_explorer.start_review', 'Bắt đầu ôn tập Flashcard')}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default VocabularyExplorer;
