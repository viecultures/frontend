import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  Sparkles,
  Volume2,
  VolumeX,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  FileText,
} from 'lucide-react';
import type { AdminVocabItem, VocabFormData } from '../types/adminVocabTypes';
import { vocabAdminService } from '../services/vocabAdminService';
import { postAdminService } from '../services/postAdminService';

interface VocabFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedItem: AdminVocabItem) => void;
  initialData?: AdminVocabItem | null;
}

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

const POS_OPTIONS = [
  { value: 'noun', label: 'Danh từ (Noun)' },
  { value: 'verb', label: 'Động từ (Verb)' },
  { value: 'adjective', label: 'Tính từ (Adjective)' },
  { value: 'adverb', label: 'Phó từ / Trạng từ (Adverb)' },
  { value: 'phrase', label: 'Cụm từ / Thành ngữ (Phrase)' },
  { value: 'idiom', label: 'Quán ngữ dân gian (Idiom)' },
  { value: 'preposition', label: 'Giới từ (Preposition)' },
  { value: 'conjunction', label: 'Liên từ (Conjunction)' },
  { value: 'interjection', label: 'Thán từ (Interjection)' },
];

export const VocabFormModal: React.FC<VocabFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const isEdit = Boolean(initialData?.id);

  // Form states
  const [word, setWord] = useState('');
  const [pos, setPos] = useState('noun');
  const [ipa, setIpa] = useState('');
  const [viMeaning, setViMeaning] = useState('');
  const [enDefinition, setEnDefinition] = useState('');
  const [contextSentence, setContextSentence] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [level, setLevel] = useState<string>('B1');
  const [postId, setPostId] = useState<string>('');
  const [usageNote, setUsageNote] = useState<string>('');

  // Post options state
  const [postOptions, setPostOptions] = useState<Array<{ id: string; titleEn: string; titleVi: string }>>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false);

  // UI / Action states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  // Field validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Audio player ref
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Load post options for dropdown selection
  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;
    setIsLoadingPosts(true);

    postAdminService
      .getPosts()
      .then((res) => {
        if (!isCancelled && Array.isArray(res)) {
          setPostOptions(
            res.map((p) => ({
              id: p.id,
              titleEn: p.titleEn,
              titleVi: p.titleVi,
            }))
          );
        }
      })
      .catch((err: unknown) => {
        console.warn('Lỗi khi tải danh sách bài viết trong biểu mẫu từ vựng:', err);
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingPosts(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [isOpen]);

  // Populate data when opening modal or editing
  useEffect(() => {
    if (initialData) {
      setWord(initialData.word || '');
      setPos(initialData.pos || 'noun');
      setIpa(initialData.ipa || '');
      setViMeaning(initialData.viMeaning || '');
      setEnDefinition(initialData.enDefinition || '');
      setContextSentence(initialData.contextSentence || '');
      setAudioUrl(initialData.audioUrl || '');
      setLevel(initialData.level || 'B1');
      setPostId(initialData.postId || '');
      setUsageNote(initialData.usageNote || '');
    } else {
      setWord('');
      setPos('noun');
      setIpa('');
      setViMeaning('');
      setEnDefinition('');
      setContextSentence('');
      setAudioUrl('');
      setLevel('B1');
      setPostId('');
      setUsageNote('');
    }
    setErrorMessage(null);
    setAiSuccessMessage(null);
    setValidationErrors({});

    // Cleanup audio on modal close or unmount
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, [initialData, isOpen]);

  // Audio Preview Test
  const handleTestAudio = () => {
    if (!audioUrl.trim()) return;

    if (isPlayingAudio && currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsPlayingAudio(false);
      return;
    }

    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      const audio = new Audio(audioUrl.trim());
      currentAudioRef.current = audio;
      setIsPlayingAudio(true);

      audio.onended = () => {
        setIsPlayingAudio(false);
      };
      audio.onerror = () => {
        setIsPlayingAudio(false);
        setErrorMessage('Không thể phát tệp âm thanh này. Vui lòng kiểm tra lại đường dẫn audio.');
      };

      audio.play().catch((err: unknown) => {
        setIsPlayingAudio(false);
        console.warn('Lỗi phát âm thanh:', err);
        setErrorMessage('Trình duyệt đã chặn phát âm thanh tự động hoặc URL không hợp lệ.');
      });
    } catch {
      setIsPlayingAudio(false);
      setErrorMessage('Không thể khởi tạo trình phát âm thanh.');
    }
  };

  // AI Auto-enrich / Lookup
  const handleAiAutoFill = async () => {
    const trimmedWord = word.trim();
    if (!trimmedWord) {
      setValidationErrors((prev) => ({ ...prev, word: 'Vui lòng nhập từ tiếng Anh trước khi gọi AI gợi ý.' }));
      return;
    }

    setIsAiLoading(true);
    setErrorMessage(null);
    setAiSuccessMessage(null);

    try {
      const enriched = await vocabAdminService.lookupWordAI(trimmedWord, contextSentence.trim());

      if (enriched.pos) setPos(enriched.pos.toLowerCase());
      if (enriched.ipa) setIpa(enriched.ipa);
      if (enriched.viMeaning) setViMeaning(enriched.viMeaning);
      if (enriched.enDefinition) setEnDefinition(enriched.enDefinition);
      if (enriched.contextSentence && !contextSentence.trim()) {
        setContextSentence(enriched.contextSentence);
      }
      if (enriched.audioUrl) setAudioUrl(enriched.audioUrl);
      if (enriched.level) setLevel(enriched.level.toUpperCase());
      if (enriched.usageNote && !usageNote.trim()) {
        setUsageNote(enriched.usageNote);
      }

      setAiSuccessMessage(`Đã điền tự động dữ liệu từ vựng cho "${trimmedWord}" thành công.`);
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next.word;
        delete next.viMeaning;
        return next;
      });
    } catch (err: unknown) {
      console.error('Lỗi khi tra cứu AI:', err);
      setErrorMessage(
        (err instanceof Error ? err.message : '') ||
          'Không thể kết nối đến dịch vụ từ điển AI. Bạn có thể tự nhập thông tin thủ công.'
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // Validate form
  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!word.trim()) {
      errors.word = 'Từ tiếng Anh là trường bắt buộc.';
    }
    if (!viMeaning.trim()) {
      errors.viMeaning = 'Nghĩa tiếng Việt là trường bắt buộc.';
    }
    if (!pos.trim()) {
      errors.pos = 'Vui lòng chọn loại từ.';
    }
    if (!level.trim()) {
      errors.level = 'Vui lòng chọn cấp độ CEFR.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload: VocabFormData = {
      word: word.trim(),
      pos: pos.trim().toLowerCase(),
      ipa: ipa.trim(),
      viMeaning: viMeaning.trim(),
      enDefinition: enDefinition.trim(),
      contextSentence: contextSentence.trim(),
      audioUrl: audioUrl.trim(),
      level: level.trim().toUpperCase(),
      postId: postId.trim() ? postId.trim() : undefined,
      usageNote: usageNote.trim() ? usageNote.trim() : undefined,
    };

    try {
      let saved: AdminVocabItem;
      if (isEdit && initialData?.id) {
        saved = await vocabAdminService.updateVocabulary(initialData.id, payload);
      } else {
        saved = await vocabAdminService.createVocabulary(payload);
      }
      onSuccess(saved);
      onClose();
    } catch (err: unknown) {
      console.error('Lỗi lưu từ vựng:', err);
      setErrorMessage(
        (err instanceof Error ? err.message : '') || 'Không thể lưu từ vựng vào hệ thống.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="vocab-modal-title"
          className="relative w-full max-w-2xl bg-rice-paper dark:bg-heritage-dark border border-antique-gold/40 rounded-3xl shadow-2xl overflow-hidden my-8 z-10"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-antique-gold/20 flex items-center justify-between bg-warm-ivory/80 dark:bg-heritage-forest/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-antique-gold/20 text-heritage-green dark:text-antique-bright border border-antique-gold/40 flex items-center justify-center shadow-xs">
                <BookOpen aria-hidden="true" className="w-5 h-5" />
              </div>
              <div>
                <h3
                  id="vocab-modal-title"
                  className="font-heading font-bold text-lg text-heritage-green dark:text-antique-bright"
                >
                  {isEdit ? 'Chỉnh sửa từ vựng di sản' : 'Thêm từ vựng mới vào kho lưu trữ'}
                </h3>
                <p className="text-xs text-text-muted">
                  Quản lý từ vựng văn hóa, liên kết bài viết, phiên âm quốc tế IPA và ví dụ thực tế.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-text-muted hover:text-text-body hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Đóng biểu mẫu"
            >
              <X aria-hidden="true" className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
            {/* Banner Thông báo Lỗi */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs font-semibold text-red-800 dark:text-red-200 flex items-start gap-2.5">
                <AlertCircle aria-hidden="true" className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Banner Thông báo Thành công từ AI */}
            {aiSuccessMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{aiSuccessMessage}</span>
              </div>
            )}

            {/* Hàng 1: Từ vựng & Nút AI Tự động điền */}
            <div className="space-y-1.5">
              <label
                htmlFor="vocab-word-input"
                className="block text-xs font-bold text-heritage-green dark:text-antique-bright uppercase tracking-wider"
              >
                Từ tiếng Anh (Word) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    id="vocab-word-input"
                    type="text"
                    value={word}
                    onChange={(e) => {
                      setWord(e.target.value);
                      if (validationErrors.word) {
                        setValidationErrors((prev) => {
                          const next = { ...prev };
                          delete next.word;
                          return next;
                        });
                      }
                    }}
                    placeholder="Ví dụ: serendipity, terracotta, conical hat..."
                    className={`w-full px-4 py-2.5 rounded-xl border bg-warm-ivory/60 dark:bg-white/5 text-sm font-semibold text-text-body dark:text-warm-ivory focus:outline-none focus:ring-2 transition-colors ${
                      validationErrors.word
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-antique-gold/30 focus:ring-antique-gold'
                    }`}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAiAutoFill}
                  disabled={isAiLoading || !word.trim()}
                  className="px-4 py-2.5 rounded-xl bg-antique-gold/25 hover:bg-antique-gold/40 text-heritage-green dark:text-antique-bright text-xs font-bold border border-antique-gold/50 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs shrink-0"
                  title="Tự động tra cứu ngữ nghĩa, phiên âm và âm thanh bằng trợ lý AI"
                >
                  <Sparkles
                    aria-hidden="true"
                    className={`w-4 h-4 text-antique-gold ${isAiLoading ? 'animate-spin' : ''}`}
                  />
                  <span>{isAiLoading ? 'Đang tra cứu AI...' : 'AI Điền tự động'}</span>
                </button>
              </div>
              {validationErrors.word && (
                <p className="text-[11px] font-medium text-red-600 dark:text-red-400">
                  {validationErrors.word}
                </p>
              )}
            </div>

            {/* Hàng 2: Bài viết liên kết (Post Selection) */}
            <div className="space-y-1.5">
              <label
                htmlFor="vocab-post-select"
                className="block text-xs font-bold text-text-secondary uppercase tracking-wider"
              >
                Bài viết liên kết (Reading Post)
              </label>
              <div className="relative">
                <select
                  id="vocab-post-select"
                  value={postId}
                  onChange={(e) => setPostId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/60 dark:bg-white/5 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold cursor-pointer"
                >
                  <option value="">-- Chung / Không gán bài viết cụ thể --</option>
                  {postOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.titleEn} {p.titleVi ? `(${p.titleVi})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-text-muted">
                {isLoadingPosts
                  ? 'Đang tải danh sách bài viết...'
                  : 'Liên kết từ vựng này với một bài đọc cụ thể để xuất hiện trong ngăn kéo từ vựng của bài.'}
              </p>
            </div>

            {/* Hàng 3: Loại từ, Phiên âm IPA, Cấp độ CEFR */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Loại từ (POS) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="vocab-pos-select"
                  className="block text-xs font-bold text-text-secondary uppercase tracking-wider"
                >
                  Loại từ (POS) <span className="text-red-500">*</span>
                </label>
                <select
                  id="vocab-pos-select"
                  value={pos}
                  onChange={(e) => setPos(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/60 dark:bg-white/5 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold cursor-pointer"
                >
                  {POS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phiên âm IPA */}
              <div className="space-y-1.5">
                <label
                  htmlFor="vocab-ipa-input"
                  className="block text-xs font-bold text-text-secondary uppercase tracking-wider"
                >
                  Phiên âm IPA
                </label>
                <input
                  id="vocab-ipa-input"
                  type="text"
                  value={ipa}
                  onChange={(e) => setIpa(e.target.value)}
                  placeholder="/ˈkɒn.ɪ.kəl hæt/"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/60 dark:bg-white/5 text-xs font-mono text-heritage-green dark:text-antique-bright focus:outline-none focus:ring-2 focus:ring-antique-gold"
                />
              </div>

              {/* Cấp độ CEFR */}
              <div className="space-y-1.5">
                <label
                  htmlFor="vocab-level-select"
                  className="block text-xs font-bold text-text-secondary uppercase tracking-wider"
                >
                  Cấp độ CEFR <span className="text-red-500">*</span>
                </label>
                <select
                  id="vocab-level-select"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/60 dark:bg-white/5 text-xs font-bold text-text-body dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold cursor-pointer"
                >
                  {CEFR_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      Cấp độ {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hàng 4: Nghĩa tiếng Việt */}
            <div className="space-y-1.5">
              <label
                htmlFor="vocab-vimeaning-input"
                className="block text-xs font-bold text-heritage-green dark:text-antique-bright uppercase tracking-wider"
              >
                Nghĩa tiếng Việt (Vietnamese Meaning) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="vocab-vimeaning-input"
                rows={2}
                value={viMeaning}
                onChange={(e) => {
                  setViMeaning(e.target.value);
                  if (validationErrors.viMeaning) {
                    setValidationErrors((prev) => {
                      const next = { ...prev };
                      delete next.viMeaning;
                      return next;
                    });
                  }
                }}
                placeholder="Ví dụ: Nón lá - vật phẩm biểu tượng thanh tao gắn liền với văn hóa truyền thống Việt Nam."
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-warm-ivory/60 dark:bg-white/5 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:ring-2 transition-colors ${
                  validationErrors.viMeaning
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-antique-gold/30 focus:ring-antique-gold'
                }`}
              />
              {validationErrors.viMeaning && (
                <p className="text-[11px] font-medium text-red-600 dark:text-red-400">
                  {validationErrors.viMeaning}
                </p>
              )}
            </div>

            {/* Hàng 5: Định nghĩa tiếng Anh */}
            <div className="space-y-1.5">
              <label
                htmlFor="vocab-endef-input"
                className="block text-xs font-bold text-text-secondary uppercase tracking-wider"
              >
                Định nghĩa tiếng Anh (English Definition)
              </label>
              <textarea
                id="vocab-endef-input"
                rows={2}
                value={enDefinition}
                onChange={(e) => setEnDefinition(e.target.value)}
                placeholder="Ví dụ: A traditional conical hat worn throughout Vietnam to protect against sun and rain."
                className="w-full px-3.5 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/60 dark:bg-white/5 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold"
              />
            </div>

            {/* Hàng 6: Câu ngữ cảnh văn hóa */}
            <div className="space-y-1.5">
              <label
                htmlFor="vocab-context-input"
                className="block text-xs font-bold text-text-secondary uppercase tracking-wider"
              >
                Câu ngữ cảnh văn hóa (Context Sentence / Example)
              </label>
              <textarea
                id="vocab-context-input"
                rows={2}
                value={contextSentence}
                onChange={(e) => setContextSentence(e.target.value)}
                placeholder="Ví dụ: Across Hue and Hanoi, the conical hat remains a graceful symbol of everyday heritage."
                className="w-full px-3.5 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/60 dark:bg-white/5 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold"
              />
            </div>

            {/* Hàng 7: Ghi chú cách dùng / Lưu ý văn hóa */}
            <div className="space-y-1.5">
              <label
                htmlFor="vocab-usage-note"
                className="block text-xs font-bold text-text-secondary uppercase tracking-wider"
              >
                Ghi chú cách dùng & Lưu ý văn hóa (Usage Note)
              </label>
              <textarea
                id="vocab-usage-note"
                rows={2}
                value={usageNote}
                onChange={(e) => setUsageNote(e.target.value)}
                placeholder="Ví dụ: Thường được kết hợp với áo dài trong các dịp lễ hội truyền thống hoặc miêu tả vẻ đẹp đời thường..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/60 dark:bg-white/5 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold"
              />
            </div>

            {/* Hàng 8: URL âm thanh phát âm & Nút Nghe thử */}
            <div className="space-y-1.5">
              <label
                htmlFor="vocab-audio-input"
                className="block text-xs font-bold text-text-secondary uppercase tracking-wider"
              >
                Đường dẫn tệp âm thanh (Audio Pronunciation URL)
              </label>
              <div className="flex gap-2">
                <input
                  id="vocab-audio-input"
                  type="url"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="https://api.dictionaryapi.dev/media/pronunciations/en/...mp3"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/60 dark:bg-white/5 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold"
                />

                <button
                  type="button"
                  onClick={handleTestAudio}
                  disabled={!audioUrl.trim()}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    !audioUrl.trim()
                      ? 'opacity-40 cursor-not-allowed bg-stone-100 dark:bg-stone-800 text-stone-400 border-stone-300'
                      : isPlayingAudio
                      ? 'bg-amber-100 text-amber-800 border-amber-400 dark:bg-amber-900/40 dark:text-amber-200'
                      : 'bg-warm-ivory hover:bg-antique-gold/20 text-heritage-green dark:text-antique-bright border-antique-gold/40'
                  }`}
                  title={audioUrl.trim() ? 'Nghe thử phát âm' : 'Chưa có URL âm thanh'}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX aria-hidden="true" className="w-4 h-4 animate-pulse text-amber-600" />
                      <span>Dừng</span>
                    </>
                  ) : (
                    <>
                      <Volume2 aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                      <span>Nghe thử</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-antique-gold/20 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl border border-antique-gold/30 text-xs font-bold text-text-body dark:text-warm-ivory hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-heritage-green text-warm-ivory font-bold text-xs hover:bg-heritage-forest shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw aria-hidden="true" className="w-4 h-4 animate-spin text-antique-gold" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <span>{isEdit ? 'Lưu thay đổi' : 'Tạo từ vựng'}</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VocabFormModal;
