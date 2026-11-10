import { useState, useEffect, useMemo, useRef } from "react";
import { X, Volume2, ArrowRight, Loader2 } from "lucide-react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import type { Lesson } from "@/data/discoveryData";
import { getDeckData } from "@/data/flashcardsData";
import { readerApiService } from "@/features/reader/services/readerApiService";

interface DictionaryInspectorModalProps {
  lesson: Lesson | null;
  onClose: () => void;
  onPlayAudio: (word: string) => void;
  onGoToStudy: (lessonId: string) => void;
}

interface PreviewCardItem {
  id: string;
  word: string;
  ipa?: string;
  pos?: string;
  viMeaning: string;
  viDefinition?: string;
  contextSentence?: string;
  audioUrl?: string;
}

export function DictionaryInspectorModal({
  lesson,
  onClose,
  onPlayAudio,
  onGoToStudy,
}: DictionaryInspectorModalProps) {
  const { t, i18n } = useTranslation('flashcards');
  const isVi = i18n.language === 'vi';
  const displayTitle = lesson
    ? isVi
      ? (lesson.vietnameseTitle || lesson.title)
      : (lesson.title || lesson.vietnameseTitle)
    : '';
  const [lazyCards, setLazyCards] = useState<PreviewCardItem[]>([]);
  const [isLoadingVocabs, setIsLoadingVocabs] = useState<boolean>(false);
  const vocabCacheRef = useRef<Map<string, PreviewCardItem[]>>(new Map());

  const hasDirectVocabs = Boolean(
    lesson && (
      (lesson.dbVocabularies && lesson.dbVocabularies.length > 0) ||
      getDeckData(lesson).cards.length > 0
    )
  );

  useEffect(() => {
    if (!lesson) {
      setLazyCards([]);
      setIsLoadingVocabs(false);
      return;
    }

    if (hasDirectVocabs) {
      setIsLoadingVocabs(false);
      return;
    }

    if (vocabCacheRef.current.has(lesson.id)) {
      setLazyCards(vocabCacheRef.current.get(lesson.id)!);
      setIsLoadingVocabs(false);
      return;
    }

    let isSubscribed = true;
    const controller = new AbortController();

    async function fetchVocabs() {
      setIsLoadingVocabs(true);
      try {
        const post = await readerApiService.getPostById(lesson!.id, controller.signal);
        if (!isSubscribed) return;

        if (post && post.vocabularies && Array.isArray(post.vocabularies) && post.vocabularies.length > 0) {
          const mappedCards: PreviewCardItem[] = post.vocabularies.map((v, idx) => ({
            id: v.id || `${lesson!.id}-db-${idx}`,
            word: v.word,
            ipa: v.ipa || '',
            pos: v.pos || (v.word.includes(' ') ? 'phrase' : 'word'),
            viMeaning: v.viMeaning,
            viDefinition: v.usageNote || v.viMeaning,
            contextSentence: v.contextSentence || '',
            audioUrl: v.audioUrl,
          }));

          vocabCacheRef.current.set(lesson!.id, mappedCards);
          setLazyCards(mappedCards);
        } else {
          setLazyCards([]);
        }
      } catch (err: unknown) {
        if (!isSubscribed) return;
        if ((err as Error)?.name !== 'AbortError') {
          console.warn('[DictionaryInspectorModal] Không thể tải chi tiết từ vựng bài học:', err);
        }
        setLazyCards([]);
      } finally {
        if (isSubscribed) {
          setIsLoadingVocabs(false);
        }
      }
    }

    fetchVocabs();

    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, [lesson, hasDirectVocabs]);

  const previewCards: PreviewCardItem[] = useMemo(() => {
    if (!lesson) return [];

    if (lesson.dbVocabularies && lesson.dbVocabularies.length > 0) {
      return lesson.dbVocabularies.map((v, idx) => ({
        id: v.id || `${lesson.id}-db-${idx}`,
        word: v.word,
        ipa: v.ipa || '',
        pos: v.pos || (v.word.includes(' ') ? 'phrase' : 'word'),
        viMeaning: v.viMeaning,
        viDefinition: v.usageNote || v.viMeaning,
        contextSentence: v.contextSentence || '',
        audioUrl: v.audioUrl,
      }));
    }

    const mockDeck = getDeckData(lesson);
    if (mockDeck.cards.length > 0) {
      return mockDeck.cards.map((card) => ({
        id: card.id,
        word: card.word,
        ipa: card.ipa,
        pos: card.pos,
        viMeaning: card.viMeaning,
        viDefinition: card.viDefinition,
        contextSentence: card.contextEn,
      }));
    }

    return lazyCards;
  }, [lesson, lazyCards]);

  if (!lesson) return null;

  const handleAudio = (card: PreviewCardItem) => {
    if (card.audioUrl) {
      const audio = new Audio(card.audioUrl);
      audio.play().catch(() => onPlayAudio(card.word));
    } else {
      onPlayAudio(card.word);
    }
  };

  return (
    <Dialog open={!!lesson} onClose={onClose} className="dictionary-dialog fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <DialogPanel className="dictionary-dialog-panel w-full max-w-2xl bg-surface rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[85dvh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-bold uppercase bg-[#ECFDF5] text-[#059669] px-2.5 py-0.5 rounded-full">
              {t(`categories.${lesson.category}`, lesson.categoryVi || lesson.category)}
            </span>
            <DialogTitle className="font-serif text-xl font-bold text-ink mt-1">
              {t('inspector.title', { title: displayTitle, defaultValue: `Vocabulary preview: ${displayTitle}` })}
            </DialogTitle>
          </div>
          <button
            onClick={onClose}
            aria-label={t('inspector.close_aria', 'Close vocabulary preview')}
            className="p-2.5 rounded-full hover:bg-surface-muted text-ink-soft cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {isLoadingVocabs ? (
            <div className="space-y-3" role="status" aria-busy="true">
              <div className="flex items-center justify-center gap-2 py-3 text-ink-soft text-xs font-medium bg-surface-muted rounded-2xl border border-line">
                <Loader2 className="w-4 h-4 animate-spin text-antique-gold shrink-0" aria-hidden="true" />
                <span>{t('inspector.loading_words', 'Đang tải danh sách từ vựng chi tiết...')}</span>
              </div>
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-surface-muted border border-line space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-28 rounded-md vocab-shimmer" />
                    <div className="h-4 w-16 rounded-md vocab-shimmer" />
                    <div className="h-4 w-12 rounded-md vocab-shimmer" />
                  </div>
                  <div className="h-4 w-3/4 rounded-md vocab-shimmer" />
                  <div className="h-3 w-1/2 rounded-md vocab-shimmer" />
                </div>
              ))}
            </div>
          ) : previewCards.length === 0 ? (
            <div className="p-6 text-center text-ink-soft bg-surface-muted rounded-2xl border border-line" role="status">
              <p>{t('inspector.no_words', 'Chưa có từ vựng nào trong danh sách xem trước.')}</p>
            </div>
          ) : (
            previewCards.map((card, idx) => (
              <div
                key={card.id}
                className="p-4 rounded-2xl bg-surface-muted border border-line flex items-start justify-between gap-4"
              >
                <div className="dictionary-preview-copy space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="dictionary-preview-word font-bold text-sm text-ink">
                      {idx + 1}. {card.word}
                    </span>
                    {card.ipa && (
                      <span className="text-xs font-mono text-ink-faint">
                        {card.ipa}
                      </span>
                    )}
                    {card.pos && (
                      <span className="text-[10px] font-bold bg-surface-sunken text-ink px-2 py-0.5 rounded">
                        {card.pos}
                      </span>
                    )}
                  </div>
                  {card.viMeaning && (
                    <div className="text-xs font-bold text-ink">
                      {t('inspector.meaning_label', { meaning: card.viMeaning, defaultValue: `Meaning: ${card.viMeaning}` })}
                    </div>
                  )}
                  {card.viDefinition && card.viDefinition !== card.viMeaning && (
                    <div className="text-xs text-ink-soft">
                      {t('inspector.definition_label', { definition: card.viDefinition, defaultValue: `Definition: ${card.viDefinition}` })}
                    </div>
                  )}
                  {card.contextSentence && (
                    <div className="text-xs italic text-ink-faint">
                      "{card.contextSentence}"
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleAudio(card)}
                  className="p-2.5 rounded-full bg-heritage-green text-white hover:bg-heritage-dark cursor-pointer shrink-0 shadow-xs"
                  title={t('inspector.play_audio', 'Play pronunciation')}
                  aria-label={t('inspector.pronounce_word', { word: card.word, defaultValue: `Pronounce ${card.word}` })}
                >
                  <Volume2 className="w-4 h-4 text-antique-gold" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            onClick={() => {
              const lid = lesson.id;
              onClose();
              onGoToStudy(lid);
            }}
            className="px-6 py-2.5 rounded-full bg-heritage-green text-white text-xs font-bold hover:bg-heritage-dark cursor-pointer shadow-xs inline-flex items-center gap-1.5"
          >
            <span>{t('inspector.btn_study_these', 'Study these cards')}</span>
            <ArrowRight className="w-4 h-4 text-antique-gold" />
          </button>
        </div>
      </DialogPanel>
    </Dialog>
  );
}
