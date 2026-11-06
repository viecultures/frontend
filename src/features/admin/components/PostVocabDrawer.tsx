import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Volume2,
  VolumeX,
  Edit3,
  Search,
  ExternalLink,
  BookOpen,
  Sparkles,
  AlertCircle,
  Loader2,
  Bookmark,
  RefreshCw,
} from 'lucide-react';
import type { ReadingPostItem, VocabItemDto, CefrLevel } from '../types/adminTypes';
import { postAdminService } from '../services/postAdminService';

export interface PostVocabDrawerProps {
  isOpen: boolean;
  post: ReadingPostItem | null;
  onClose: () => void;
  onNavigateToVocabTab?: (word: string, postId?: string) => void;
  onEditPost?: (post: ReadingPostItem) => void;
}

/**
 * Helper to determine badge styling for CEFR levels
 */
function getCefrBadgeClass(level?: string): string {
  switch ((level || '').toUpperCase()) {
    case 'A1':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
    case 'A2':
      return 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800';
    case 'B1':
      return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800';
    case 'B2':
      return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
    case 'C1':
      return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800';
    case 'C2':
      return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800';
    default:
      return 'bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700';
  }
}

/**
 * Normalize and format part of speech badge
 */
function formatPosLabel(pos?: string): string {
  if (!pos) return '';
  const p = pos.trim().toLowerCase();
  if (p === 'noun' || p === 'danh từ' || p === 'n.') return 'noun';
  if (p === 'verb' || p === 'động từ' || p === 'v.') return 'verb';
  if (p === 'adjective' || p === 'tính từ' || p === 'adj.' || p === 'adj') return 'adj';
  if (p === 'adverb' || p === 'trạng từ' || p === 'phó từ' || p === 'adv.' || p === 'adv') return 'adv';
  if (p === 'phrase' || p === 'cụm từ' || p === 'idiom') return 'phrase';
  return pos;
}

/**
 * Highlight target word occurrences inside context sentence
 */
function renderHighlightedSentence(sentence: string, targetWord: string): React.ReactNode {
  if (!sentence) return null;
  if (!targetWord || !targetWord.trim()) return <span>{sentence}</span>;

  const escaped = targetWord.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(\\b${escaped}\\b|${escaped})`, 'gi');
  const parts = sentence.split(regex);

  return (
    <span>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === targetWord.trim().toLowerCase();
        return isMatch ? (
          <mark
            key={index}
            className="bg-antique-gold/25 text-heritage-dark dark:text-antique-bright font-semibold px-1 py-0.5 rounded underline decoration-antique-gold/60"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </span>
  );
}

export const PostVocabDrawer: React.FC<PostVocabDrawerProps> = ({
  isOpen,
  post,
  onClose,
  onNavigateToVocabTab,
  onEditPost,
}) => {
  const [currentPost, setCurrentPost] = useState<ReadingPostItem | null>(post);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [filterKeyword, setFilterKeyword] = useState<string>('');
  const [playingWordKey, setPlayingWordKey] = useState<string | null>(null);
  const [loadingAudioKey, setLoadingAudioKey] = useState<string | null>(null);
  const [audioErrorMessage, setAudioErrorMessage] = useState<string | null>(null);

  const audioInstanceRef = useRef<HTMLAudioElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Stop any active audio and speech synthesis
  const stopAudio = useCallback(() => {
    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
      audioInstanceRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingWordKey(null);
    setLoadingAudioKey(null);
  }, []);

  // Cleanup on close or unmount
  useEffect(() => {
    if (!isOpen) {
      stopAudio();
      setFilterKeyword('');
      setAudioErrorMessage(null);
      setFetchError(null);
    }
  }, [isOpen, stopAudio]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  // Handle ESC keyboard shortcut & scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Tự động tải chi tiết bài viết nếu post có ID nhưng mảng vocabularies chưa có hoặc rỗng
  useEffect(() => {
    setCurrentPost(post);
    setFetchError(null);

    if (!isOpen || !post?.id) {
      setIsLoadingDetails(false);
      return;
    }

    if (!post.vocabularies || post.vocabularies.length === 0) {
      let isCancelled = false;
      setIsLoadingDetails(true);

      postAdminService
        .getPostById(post.id)
        .then((fullPost) => {
          if (!isCancelled && fullPost) {
            setCurrentPost(fullPost);
          }
        })
        .catch((err: unknown) => {
          if (!isCancelled) {
            console.warn('Lỗi tải chi tiết từ vựng bài viết:', err);
            setFetchError(
              (err instanceof Error ? err.message : '') ||
                'Không thể tải thêm chi tiết từ vựng từ máy chủ. Vui lòng thử lại.'
            );
          }
        })
        .finally(() => {
          if (!isCancelled) {
            setIsLoadingDetails(false);
          }
        });

      return () => {
        isCancelled = true;
      };
    } else {
      setIsLoadingDetails(false);
    }
  }, [isOpen, post]);

  // Retry fetching post details
  const handleRetryFetch = () => {
    if (!post?.id) return;
    setIsLoadingDetails(true);
    setFetchError(null);

    postAdminService
      .getPostById(post.id)
      .then((fullPost) => {
        if (fullPost) {
          setCurrentPost(fullPost);
        }
      })
      .catch((err: unknown) => {
        console.warn('Lỗi tải lại chi tiết bài viết:', err);
        setFetchError(
          (err instanceof Error ? err.message : '') ||
            'Không thể tải chi tiết từ vựng từ máy chủ. Vui lòng thử lại.'
        );
      })
      .finally(() => {
        setIsLoadingDetails(false);
      });
  };

  // Vocabularies list resolution from current post
  const vocabularies: VocabItemDto[] = useMemo(() => {
    if (!currentPost || !Array.isArray(currentPost.vocabularies)) return [];
    return currentPost.vocabularies;
  }, [currentPost]);

  // Filtered vocabularies
  const filteredVocabularies = useMemo(() => {
    const query = filterKeyword.trim().toLowerCase();
    if (!query) return vocabularies;

    return vocabularies.filter((v) => {
      const matchWord = v.word.toLowerCase().includes(query);
      const matchMeaning = v.viMeaning.toLowerCase().includes(query);
      const matchPos = (v.pos || '').toLowerCase().includes(query);
      const matchContext = (v.contextSentence || '').toLowerCase().includes(query);
      return matchWord || matchMeaning || matchPos || matchContext;
    });
  }, [vocabularies, filterKeyword]);

  // Fallback to Web Speech Synthesis API
  const playWebSpeech = useCallback((wordText: string, wordKey: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setLoadingAudioKey(null);
      setPlayingWordKey(null);
      setAudioErrorMessage(`Trình duyệt không hỗ trợ phát âm từ "${wordText}".`);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;

      utterance.onstart = () => {
        setLoadingAudioKey(null);
        setPlayingWordKey(wordKey);
        setAudioErrorMessage(null);
      };

      utterance.onend = () => {
        setPlayingWordKey(null);
      };

      utterance.onerror = () => {
        setPlayingWordKey(null);
        setLoadingAudioKey(null);
        setAudioErrorMessage(`Lỗi phát âm từ "${wordText}".`);
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      setPlayingWordKey(null);
      setLoadingAudioKey(null);
      setAudioErrorMessage(`Không thể phát âm từ "${wordText}".`);
    }
  }, []);

  // Play pronunciation handler (supports audioUrl and Web Speech API fallback)
  const handlePlayPronunciation = (vocab: VocabItemDto, index: number) => {
    const wordKey = vocab.id || `${vocab.word}-${index}`;

    // If currently playing this word, stop it
    if (playingWordKey === wordKey) {
      stopAudio();
      return;
    }

    // Stop existing audio playback
    stopAudio();
    setAudioErrorMessage(null);

    // If audioUrl exists, attempt audio element playback
    if (vocab.audioUrl && vocab.audioUrl.trim()) {
      setLoadingAudioKey(wordKey);
      try {
        const audio = new Audio(vocab.audioUrl);
        audioInstanceRef.current = audio;

        audio.oncanplay = () => {
          setLoadingAudioKey(null);
        };

        audio.onplay = () => {
          setLoadingAudioKey(null);
          setPlayingWordKey(wordKey);
        };

        audio.onended = () => {
          setPlayingWordKey(null);
          audioInstanceRef.current = null;
        };

        audio.onerror = () => {
          audioInstanceRef.current = null;
          // Fallback to Web Speech API when audioUrl fails
          playWebSpeech(vocab.word, wordKey);
        };

        audio.play().catch(() => {
          audioInstanceRef.current = null;
          playWebSpeech(vocab.word, wordKey);
        });
      } catch {
        playWebSpeech(vocab.word, wordKey);
      }
    } else {
      // Direct Web Speech API playback
      setLoadingAudioKey(wordKey);
      playWebSpeech(vocab.word, wordKey);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Ngăn kéo danh sách từ vựng trọng tâm"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-heritage-forest/65 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Slide-over Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-xl md:max-w-2xl bg-warm-ivory dark:bg-heritage-forest border-l border-antique-gold/30 shadow-2xl flex flex-col h-full focus:outline-hidden"
              tabIndex={-1}
            >
              {/* ── Header ────────────────────────────────────────── */}
              <header className="p-4 sm:p-5 bg-heritage-green text-warm-ivory border-b border-antique-gold/30 shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-antique-gold/20 text-warm-ivory border border-antique-gold/40">
                        <Bookmark aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                        <span>Từ vựng trọng tâm</span>
                      </span>

                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-warm-ivory border border-white/20">
                        {isLoadingDetails ? (
                          <span className="inline-flex items-center gap-1">
                            <Loader2 aria-hidden="true" className="w-3 h-3 animate-spin" />
                            Đang tải...
                          </span>
                        ) : (
                          `${vocabularies.length} từ`
                        )}
                      </span>

                      {currentPost?.level && (
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-extrabold uppercase border ${getCefrBadgeClass(
                            currentPost.level
                          )}`}
                        >
                          CEFR {currentPost.level}
                        </span>
                      )}
                    </div>

                    <h2 className="font-heading font-bold text-lg sm:text-xl text-warm-ivory truncate">
                      {currentPost?.titleEn || 'Chi tiết bài đọc'}
                    </h2>
                    {currentPost?.titleVi && (
                      <p className="text-xs sm:text-sm text-warm-ivory/80 italic truncate">
                        {currentPost.titleVi}
                      </p>
                    )}
                  </div>

                  {/* Actions in Header */}
                  <div className="flex items-center gap-2 shrink-0">
                    {onEditPost && currentPost && (
                      <button
                        type="button"
                        onClick={() => onEditPost(currentPost)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-antique-gold/20 hover:bg-antique-gold/30 text-warm-ivory border border-antique-gold/40 hover:border-antique-gold transition-colors focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:outline-hidden cursor-pointer"
                        title="Chỉnh sửa bài viết và toàn bộ từ vựng"
                      >
                        <Edit3 aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                        <span className="hidden sm:inline">Sửa bài viết</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Đóng ngăn kéo từ vựng"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-warm-ivory border border-white/10 hover:border-white/20 transition-colors focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:outline-hidden cursor-pointer"
                    >
                      <X aria-hidden="true" className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Search Bar inside Drawer */}
                {!isLoadingDetails && vocabularies.length > 2 && (
                  <div className="mt-4 relative">
                    <Search
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-ivory/60 pointer-events-none"
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={filterKeyword}
                      onChange={(e) => setFilterKeyword(e.target.value)}
                      placeholder="Tìm từ vựng, từ loại, nghĩa tiếng Việt..."
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/10 border border-white/20 text-xs sm:text-sm text-warm-ivory placeholder-warm-ivory/50 focus:outline-hidden focus:ring-2 focus:ring-antique-gold focus:bg-white/15 transition-all"
                    />
                    {filterKeyword && (
                      <button
                        type="button"
                        onClick={() => setFilterKeyword('')}
                        aria-label="Xóa từ khóa tìm kiếm"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-warm-ivory/60 hover:text-warm-ivory p-0.5 rounded cursor-pointer"
                      >
                        <X aria-hidden="true" className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </header>

              {/* ── Audio Error Alert Banner ─────────────────────── */}
              {audioErrorMessage && (
                <div
                  role="alert"
                  className="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/60 border-b border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between gap-2 shrink-0 animate-fadeIn"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle aria-hidden="true" className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{audioErrorMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAudioErrorMessage(null)}
                    aria-label="Ẩn thông báo lỗi âm thanh"
                    className="text-rose-600 hover:text-rose-800 dark:text-rose-400 p-1 rounded cursor-pointer"
                  >
                    <X aria-hidden="true" className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* ── Main Content / Cards List (5-State Handled) ─────── */}
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-rice-paper/30 dark:bg-heritage-dark/30 space-y-4">
                {/* 1. Loading State */}
                {isLoadingDetails ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-antique-gold/20">
                      <div className="h-4 w-40 bg-antique-gold/20 rounded-md animate-pulse" />
                      <div className="h-4 w-16 bg-antique-gold/20 rounded-md animate-pulse" />
                    </div>
                    {[...Array(4)].map((_, idx) => (
                      <div
                        key={`drawer-skeleton-${idx}`}
                        className="p-4 sm:p-5 rounded-2xl bg-warm-ivory dark:bg-heritage-dark border border-antique-gold/20 space-y-3 animate-pulse"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-28 bg-antique-gold/30 rounded-md" />
                            <div className="h-4 w-12 bg-antique-gold/20 rounded-full" />
                            <div className="h-4 w-16 bg-antique-gold/15 rounded-md" />
                          </div>
                          <div className="h-8 w-8 bg-antique-gold/20 rounded-xl" />
                        </div>
                        <div className="h-4 w-3/4 bg-antique-gold/15 rounded-md" />
                        <div className="h-12 w-full bg-antique-gold/10 rounded-xl" />
                      </div>
                    ))}
                  </div>
                ) : fetchError && vocabularies.length === 0 ? (
                  /* 2. Error State */
                  <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-3xl bg-warm-ivory dark:bg-heritage-dark border border-rose-300 dark:border-rose-900 shadow-xs">
                    <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 flex items-center justify-center mb-4 shadow-xs">
                      <AlertCircle aria-hidden="true" className="w-7 h-7" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-rose-800 dark:text-rose-200">
                      Lỗi tải danh sách từ vựng
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-text-muted dark:text-warm-ivory/70 max-w-sm">
                      {fetchError}
                    </p>
                    <div className="mt-5 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleRetryFetch}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer"
                      >
                        <RefreshCw aria-hidden="true" className="w-3.5 h-3.5" />
                        <span>Thử lại</span>
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-xs font-bold border border-antique-gold/30 text-text-body dark:text-warm-ivory hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                ) : vocabularies.length === 0 ? (
                  /* 3. Empty State: No Vocabularies in Post */
                  <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-3xl bg-warm-ivory dark:bg-heritage-dark border border-dashed border-antique-gold/40">
                    <div className="w-16 h-16 rounded-2xl bg-antique-gold/15 border border-antique-gold/30 flex items-center justify-center mb-4 text-heritage-green dark:text-antique-gold shadow-xs">
                      <BookOpen aria-hidden="true" className="w-8 h-8" />
                    </div>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-heritage-dark dark:text-warm-ivory">
                      Chưa có từ vựng trọng tâm
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-text-muted dark:text-warm-ivory/70 max-w-sm">
                      Bài đọc này hiện chưa có danh sách từ vựng trọng tâm. Bạn có thể mở trình sửa bài để thêm từ vựng mới hoặc sinh tự động bằng AI.
                    </p>
                    {onEditPost && currentPost && (
                      <button
                        type="button"
                        onClick={() => onEditPost(currentPost)}
                        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-heritage-green hover:bg-heritage-dark text-warm-ivory border border-antique-gold/40 shadow-xs hover:shadow-md transition-all focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:outline-hidden cursor-pointer"
                      >
                        <Sparkles aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                        <span>Thêm từ vựng cho bài viết này</span>
                      </button>
                    )}
                  </div>
                ) : filteredVocabularies.length === 0 ? (
                  /* 4. Empty State: Search filter yielded no results */
                  <div className="py-12 text-center rounded-2xl bg-warm-ivory dark:bg-heritage-dark border border-antique-gold/20 p-6">
                    <Search aria-hidden="true" className="w-8 h-8 mx-auto text-text-muted/60 mb-2" />
                    <p className="text-sm font-semibold text-heritage-dark dark:text-warm-ivory">
                      Không tìm thấy từ vựng khớp với "{filterKeyword}"
                    </p>
                    <p className="text-xs text-text-muted dark:text-warm-ivory/60 mt-1">
                      Thử tìm bằng từ tiếng Anh, từ loại hoặc nghĩa tiếng Việt khác.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFilterKeyword('')}
                      className="mt-4 px-3 py-1.5 rounded-lg text-xs font-bold text-heritage-green dark:text-antique-gold bg-antique-gold/15 hover:bg-antique-gold/25 transition-colors cursor-pointer"
                    >
                      Xóa bộ lọc tìm kiếm
                    </button>
                  </div>
                ) : (
                  /* 5. Default State: List of Vocabulary Cards */
                  <div className="space-y-3.5">
                    {filteredVocabularies.map((vocab, index) => {
                      const wordKey = vocab.id || `${vocab.word}-${index}`;
                      const isPlaying = playingWordKey === wordKey;
                      const isLoading = loadingAudioKey === wordKey;
                      const formattedPos = formatPosLabel(vocab.pos);

                      return (
                        <article
                          key={wordKey}
                          className="group relative p-4 sm:p-5 rounded-2xl bg-warm-ivory dark:bg-heritage-dark border border-antique-gold/25 hover:border-antique-gold/50 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col gap-3"
                        >
                          {/* Card Top: Word, Badges, Pronounce & Lookup */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-baseline flex-wrap gap-2.5">
                              {/* Word */}
                              <h4 className="font-serif font-bold text-lg sm:text-xl text-heritage-forest dark:text-warm-ivory tracking-wide">
                                {vocab.word}
                              </h4>

                              {/* Part of Speech */}
                              {formattedPos && (
                                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase bg-heritage-green/10 text-heritage-green dark:bg-antique-gold/15 dark:text-antique-bright border border-heritage-green/20 dark:border-antique-gold/30">
                                  {formattedPos}
                                </span>
                              )}

                              {/* IPA Pronunciation */}
                              {vocab.ipa && (
                                <span className="font-mono text-xs text-text-muted dark:text-warm-ivory/70">
                                  /{vocab.ipa.replace(/^\/|\/$/g, '')}/
                                </span>
                              )}

                              {/* CEFR Level */}
                              {vocab.level && (
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${getCefrBadgeClass(
                                    vocab.level as CefrLevel
                                  )}`}
                                >
                                  {vocab.level}
                                </span>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {/* Audio Pronunciation Button */}
                              <button
                                type="button"
                                onClick={() => handlePlayPronunciation(vocab, index)}
                                disabled={isLoading}
                                aria-label={`Phát âm từ ${vocab.word}`}
                                className={`p-2 rounded-xl border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:outline-hidden ${
                                  isPlaying
                                    ? 'bg-antique-gold text-heritage-forest border-antique-gold shadow-xs'
                                    : 'bg-warm-ivory dark:bg-white/5 border-antique-gold/30 hover:border-antique-gold text-heritage-green dark:text-antique-gold hover:bg-antique-gold/15'
                                }`}
                                title={
                                  vocab.audioUrl
                                    ? 'Phát âm thanh mẫu'
                                    : 'Phát âm chuẩn qua Web Speech'
                                }
                              >
                                {isLoading ? (
                                  <Loader2
                                    aria-hidden="true"
                                    className="w-4 h-4 animate-spin text-inherit"
                                  />
                                ) : isPlaying ? (
                                  <VolumeX aria-hidden="true" className="w-4 h-4" />
                                ) : (
                                  <Volume2 aria-hidden="true" className="w-4 h-4" />
                                )}
                              </button>

                              {/* Navigate to Vocab Tab Button */}
                              {onNavigateToVocabTab && (
                                <button
                                  type="button"
                                  onClick={() => onNavigateToVocabTab(vocab.word, currentPost?.id)}
                                  aria-label={`Tra cứu từ ${vocab.word} trong kho từ vựng`}
                                  className="p-2 rounded-xl bg-warm-ivory dark:bg-white/5 border border-antique-gold/30 hover:border-antique-gold text-text-muted hover:text-heritage-green dark:hover:text-antique-bright hover:bg-antique-gold/10 transition-colors focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:outline-hidden cursor-pointer"
                                  title="Tra cứu trong kho từ vựng quản trị"
                                >
                                  <ExternalLink aria-hidden="true" className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Vietnamese Meaning */}
                          <div className="text-sm font-medium text-heritage-dark dark:text-warm-ivory">
                            <span className="text-xs font-bold uppercase tracking-wider text-antique-gold dark:text-antique-bright mr-1.5">
                              Nghĩa:
                            </span>
                            <span>{vocab.viMeaning}</span>
                          </div>

                          {/* Context Sentence */}
                          {vocab.contextSentence && (
                            <div className="p-3 rounded-xl bg-rice-paper/50 dark:bg-white/5 border border-antique-gold/20 text-xs sm:text-sm text-heritage-forest/90 dark:text-warm-ivory/90 italic leading-relaxed">
                              {renderHighlightedSentence(vocab.contextSentence, vocab.word)}
                            </div>
                          )}

                          {/* Usage Note */}
                          {vocab.usageNote && (
                            <div className="flex items-start gap-1.5 text-xs text-text-muted dark:text-warm-ivory/70 pt-0.5">
                              <span className="font-semibold text-heritage-green dark:text-antique-gold shrink-0">
                                Lưu ý:
                              </span>
                              <span className="leading-normal">{vocab.usageNote}</span>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </main>

              {/* ── Footer ────────────────────────────────────────── */}
              <footer className="p-3.5 sm:p-4 bg-warm-ivory dark:bg-heritage-forest border-t border-antique-gold/25 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted dark:text-warm-ivory/60">
                    Hiển thị <strong className="text-heritage-dark dark:text-warm-ivory">{filteredVocabularies.length}</strong> / {vocabularies.length} từ vựng
                  </span>
                  {currentPost?.id && onNavigateToVocabTab && vocabularies.length > 0 && (
                    <button
                      type="button"
                      onClick={() => onNavigateToVocabTab('', currentPost.id)}
                      className="text-[11px] font-semibold text-heritage-green dark:text-antique-bright hover:underline cursor-pointer"
                      title="Xem toàn bộ từ của bài này trong tab Quản lý từ vựng"
                    >
                      (Xem trong kho)
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {onEditPost && currentPost && (
                    <button
                      type="button"
                      onClick={() => onEditPost(currentPost)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-heritage-green dark:text-antique-bright bg-antique-gold/15 hover:bg-antique-gold/25 border border-antique-gold/40 transition-colors cursor-pointer"
                    >
                      Sửa danh sách từ
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-heritage-green hover:bg-heritage-dark text-warm-ivory transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:outline-hidden"
                  >
                    Đóng
                  </button>
                </div>
              </footer>
            </motion.aside>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PostVocabDrawer;
