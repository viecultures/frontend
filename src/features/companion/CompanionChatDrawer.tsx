import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { SendHorizontal, LayoutGrid } from 'lucide-react';
import { companionService } from '@/services/companionService';
import type {
  CompanionChatMessage,
  CompanionLanguage,
  ReferencedLesson,
} from '@/types/companion';
import { getStoredUser, getIsProUser, type AppUser } from '@/utils/auth-storage';
import { PATHS, paths } from '@/routes/paths';
import { CompanionQuickPrompts } from './CompanionQuickPrompts';
import { CompanionChatHeader } from './CompanionChatHeader';
import { CompanionMessageBubble } from './CompanionMessageBubble';
import { ForestSpirit } from './ForestSpirit';
import { companionKeyframes } from './companionTheme';
import { useResizableWindow, type WindowSize } from './useResizableWindow';
import { useMediaQuery } from './useMediaQuery';
import { useCompanionArticleContext } from './useCompanionArticleContext';
import { useReaderHandoff } from '@/features/playground/lib/reader-handoff';
import { CompanionLearningTools } from './CompanionLearningTools';

interface CompanionChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId?: string;
  lessonTitle?: string;
}

const DEFAULT_WINDOW_SIZE: WindowSize = { width: 380, height: 560 };
const MIN_WINDOW_SIZE: WindowSize = { width: 320, height: 420 };
/** Launcher sits at bottom-6 (24px) and is 72px tall; window floats 12px above it. */
const WINDOW_BOTTOM_OFFSET = 108;
const LANGUAGE_STORAGE_KEY = 'vc-companion-language';

const readStoredLanguage = (): CompanionLanguage => {
  try {
    const raw = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (raw === 'vi' || raw === 'en' || raw === 'bilingual') return raw;
  } catch (err) {
    console.error('[CompanionChatDrawer] Failed to read stored language:', err);
  }
  return 'bilingual';
};

export const CompanionChatDrawer: React.FC<CompanionChatDrawerProps> = ({
  isOpen,
  onClose,
  lessonId,
  lessonTitle,
}) => {
  const { t } = useTranslation('playground');
  const navigate = useAppNavigate();
  const location = useLocation();

  const articleContext = useCompanionArticleContext((s) => s.context);
  const effectiveLessonId = articleContext?.articleId || lessonId;
  const effectiveLessonTitle = articleContext?.articleTitle || lessonTitle;
  const [viewMode, setViewMode] = useState<'chat' | 'tools'>('chat');

  const [user, setUser] = useState<AppUser | null>(() => getStoredUser());
  const [isPro, setIsPro] = useState<boolean>(() => getIsProUser());

  const [messages, setMessages] = useState<CompanionChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const [referencedLessons, setReferencedLessons] = useState<ReferencedLesson[]>([]);
  const [remainingTurns, setRemainingTurns] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<CompanionLanguage>(readStoredLanguage);
  const [translatingIndex, setTranslatingIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isMobile = useMediaQuery('(max-width: 639px)');
  const { size, isResizing, onResizeHandlePointerDown, resetSize } = useResizableWindow({
    storageKey: 'vc-companion-window-size',
    defaultSize: DEFAULT_WINDOW_SIZE,
    minSize: MIN_WINDOW_SIZE,
    maxWidthRatio: 0.9,
    maxHeightRatio: 0.85,
    bottomOffset: WINDOW_BOTTOM_OFFSET,
  });

  // Track auth & subscription state changes
  useEffect(() => {
    const handleAuthChange = () => {
      const activeUser = getStoredUser();
      setUser(activeUser);
      setIsPro(getIsProUser());
      if (!activeUser) {
        setMessages([]);
        setRemainingTurns(null);
      }
    };
    window.addEventListener('auth:change', handleAuthChange);
    window.addEventListener('subscription:change', handleAuthChange);
    return () => {
      window.removeEventListener('auth:change', handleAuthChange);
      window.removeEventListener('subscription:change', handleAuthChange);
    };
  }, []);

  const handleLanguageChange = (lang: CompanionLanguage) => {
    setSelectedLanguage(lang);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (err) {
      console.error('[CompanionChatDrawer] Failed to persist language:', err);
    }
  };

  // Auto-grow the input up to ~5 lines
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [inputMessage]);

  const getInitialGreeting = useCallback((): string => {
    if (effectiveLessonTitle) {
      return t('playground.companion.drawer.initial_greeting_lesson', {
        title: effectiveLessonTitle,
      });
    }
    return t('playground.companion.drawer.initial_greeting_default');
  }, [effectiveLessonTitle, t]);

  const getDefaultPrompts = useCallback((): string[] => {
    if (articleContext?.articleTitle) {
      return [
        t('playground.companion.drawer.prompt_understand', { title: articleContext.articleTitle }),
        t('playground.companion.drawer.prompt_express', { title: articleContext.articleTitle }),
        t('playground.companion.drawer.prompt_vocab'),
      ];
    }
    return lessonTitle
      ? [
          t('playground.companion.drawer.prompt_lesson_significance'),
          t('playground.companion.drawer.prompt_lesson_phrases'),
        ]
      : [
          t('playground.companion.drawer.prompt_pho'),
          t('playground.companion.drawer.prompt_festivals'),
        ];
  }, [articleContext?.articleTitle, lessonTitle, t]);

  const handleExpandToWorkspace = () => {
    if (articleContext?.articleId) {
      useReaderHandoff.getState().enterFromReader(
        {
          articleId: articleContext.articleId,
          title: articleContext.articleTitle || t('playground.companion.drawer.your_story'),
          level: articleContext.level || 'Level 2',
          summary: articleContext.articleSummary,
          vocabulary: (articleContext.vocabulary || []).map((v) => ({
            word: v.word,
            viMeaning: v.viMeaning,
            contextSentence: v.contextSentence || '',
          })),
          readerUrl: articleContext.readerUrl || (window.location.pathname + window.location.search),
        },
        inputMessage
      );
      navigate(paths.aiWorkspace({ story: articleContext.articleId, level: articleContext.level }));
      onClose();
    } else {
      navigate(PATHS.aiWorkspace);
      onClose();
    }
  };

  // Load chat history and quota when drawer opens
  useEffect(() => {
    if (!isOpen) return;

    if (!user) {
      setMessages([
        {
          id: 'guest-intro',
          role: 'assistant',
          content: t('playground.companion.drawer.guest_intro'),
          timestamp: Date.now(),
        },
      ]);
      setSuggestedPrompts([]);
      setRemainingTurns(null);
      return;
    }

    let isSubscribed = true;

    const loadHistoryAndQuota = async () => {
      setIsHistoryLoading(true);
      setError(null);
      try {
        const [history, quota] = await Promise.allSettled([
          companionService.getChatHistory(effectiveLessonId),
          companionService.getQuota(),
        ]);

        if (!isSubscribed) return;

        if (quota.status === 'fulfilled') {
          setRemainingTurns(quota.value.remainingTurns);
          setIsPro(quota.value.isPro);
        }

        if (history.status === 'fulfilled' && history.value && history.value.length > 0) {
          setMessages(history.value);
        } else {
          const initialMsgs: CompanionChatMessage[] = [
            {
              id: `msg-${Date.now()}`,
              role: 'assistant',
              content: getInitialGreeting(),
              timestamp: Date.now(),
            },
          ];
          setMessages(initialMsgs);
          await companionService.saveChatHistory(initialMsgs, effectiveLessonId);
        }
        setSuggestedPrompts(getDefaultPrompts());
      } catch (err) {
        console.error('[CompanionChatDrawer] Failed to load history or quota:', err);
        setError(t('playground.companion.drawer.err_load_history'));
      } finally {
        if (isSubscribed) {
          setIsHistoryLoading(false);
        }
      }
    };

    loadHistoryAndQuota();

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, user, effectiveLessonId, getInitialGreeting, getDefaultPrompts, t]);

  // Synchronize history updates from external events (e.g. from AI Workspace)
  useEffect(() => {
    const handleHistoryUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ lessonId?: string }>;
      const updatedLessonId = customEvent.detail?.lessonId;
      if (!updatedLessonId || updatedLessonId === effectiveLessonId) {
        companionService
          .getChatHistory(effectiveLessonId)
          .then((history) => {
            if (history && history.length > 0) {
              setMessages(history);
            }
          })
          .catch((err) => {
            console.error('[CompanionChatDrawer] Failed to reload synced history:', err);
          });
      }
    };
    window.addEventListener('companion:history-updated', handleHistoryUpdated);
    return () => {
      window.removeEventListener('companion:history-updated', handleHistoryUpdated);
    };
  }, [effectiveLessonId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (viewMode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isHistoryLoading, viewMode]);

  const isLimitReached = !isPro && remainingTurns !== null && remainingTurns <= 0;

  const handleSend = async (messageText?: string) => {
    if (!user) {
      const redirectPath = location.pathname + location.search;
      navigate(paths.login({ redirect: redirectPath }));
      return;
    }

    if (isLimitReached) {
      navigate(PATHS.pricing);
      return;
    }

    const textToSend = (messageText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    setError(null);
    setInputMessage('');

    const userMessage: CompanionChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const response = await companionService.sendMessage({
        lessonId: effectiveLessonId,
        message: textToSend,
        history: messages,
        language: selectedLanguage,
      });

      const assistantMessage: CompanionChatMessage = {
        id: `msg-${Date.now()}-reply`,
        role: 'assistant',
        content: response.reply,
        timestamp: Date.now(),
      };

      const updatedHistory = [...newHistory, assistantMessage];
      setMessages(updatedHistory);
      setSuggestedPrompts(response.suggestedPrompts || []);
      setReferencedLessons(response.referencedLessons || []);
      setRemainingTurns(response.remainingDailyTurns);

      await companionService.saveChatHistory(updatedHistory, effectiveLessonId);
      window.dispatchEvent(
        new CustomEvent('companion:history-updated', { detail: { lessonId: effectiveLessonId } })
      );
    } catch (err) {
      console.error('[CompanionChatDrawer] Failed to get response:', err);
      const errMessage = err instanceof Error ? err.message : 'Failed to reach AI companion';

      if (errMessage.includes('AUTH_REQUIRED') || errMessage.includes('401')) {
        const redirectPath = location.pathname + location.search;
        navigate(paths.login({ redirect: redirectPath }));
        return;
      }

      if (errMessage.includes('LIMIT_EXCEEDED') || errMessage.includes('403')) {
        setRemainingTurns(0);
        setError(t('playground.companion.drawer.err_limit_exceeded'));
        return;
      }

      setError(errMessage || t('playground.companion.drawer.err_failed_reach'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTranslate = async (index: number, targetLang: 'vi' | 'en') => {
    const targetMsg = messages[index];
    if (!targetMsg || !targetMsg.content || translatingIndex !== null) return;

    setTranslatingIndex(index);
    setError(null);

    try {
      const res = await companionService.translateMessage({
        text: targetMsg.content,
        targetLang,
      });

      const updated: CompanionChatMessage[] = messages.map((msg, i) => {
        if (i === index) {
          const srcLang: 'vi' | 'en' = targetLang === 'vi' ? 'en' : 'vi';
          return {
            ...msg,
            translatedContent: res.translatedText,
            sourceLanguage: srcLang,
          };
        }
        return msg;
      });

      setMessages(updated);
      await companionService.saveChatHistory(updated, effectiveLessonId);
      window.dispatchEvent(
        new CustomEvent('companion:history-updated', { detail: { lessonId: effectiveLessonId } })
      );
    } catch (err) {
      console.error('[CompanionChatDrawer] Translation action failed:', err);
      setError(t('playground.companion.drawer.err_translate_failed'));
    } finally {
      setTranslatingIndex(null);
    }
  };

  const handleClearHistory = async () => {
    try {
      await companionService.clearChatHistory(effectiveLessonId);
      const resetGreeting: CompanionChatMessage[] = [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: getInitialGreeting(),
          timestamp: Date.now(),
        },
      ];
      setMessages(resetGreeting);
      await companionService.saveChatHistory(resetGreeting, effectiveLessonId);
      window.dispatchEvent(
        new CustomEvent('companion:history-updated', { detail: { lessonId: effectiveLessonId } })
      );
      setSuggestedPrompts(getDefaultPrompts());
      setReferencedLessons([]);
      setError(null);
    } catch (err) {
      console.error('[CompanionChatDrawer] Failed to clear history:', err);
      setError(t('playground.companion.drawer.err_clear_history'));
    }
  };

  if (!isOpen) return null;

  const drawerStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '85vh',
        maxHeight: '85vh',
      }
    : {
        position: 'fixed',
        right: '24px',
        bottom: `${WINDOW_BOTTOM_OFFSET}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      };

  return (
    <div
      role="dialog"
      aria-label={t('playground.companion.drawer.dialog_aria')}
      tabIndex={-1}
      style={drawerStyle}
      className={`z-50 flex flex-col overflow-hidden border-2 border-[#8a9a6f] bg-[#fffaf0] font-sans text-[#2f3a2a] antialiased select-text ${
        isMobile
          ? 'vc-drawer-slide rounded-t-[26px] shadow-[0_-8px_30px_rgba(70,90,60,0.35)]'
          : 'vc-window-pop rounded-[26px] shadow-[0_8px_0_-1px_#c9d6b0,0_20px_45px_-12px_rgba(70,90,60,0.45)]'
      }`}
    >
      <style>{companionKeyframes}</style>

      {/* Resize Handle (Desktop top-left corner) */}
      {!isMobile && (
        <button
          type="button"
          aria-label={t('playground.companion.drawer.resize_aria')}
          title={t('playground.companion.drawer.resize_title')}
          onPointerDown={onResizeHandlePointerDown}
          onDoubleClick={resetSize}
          className={`group/grip absolute top-0 left-0 z-20 h-6 w-6 cursor-nwse-resize touch-none rounded-tl-[24px] ${
            isResizing ? 'bg-white/40' : ''
          }`}
        >
          <svg
            viewBox="0 0 12 12"
            aria-hidden="true"
            className={`absolute top-1.5 left-1.5 h-3 w-3 text-[#3e5a3a] transition-opacity ${
              isResizing ? 'opacity-90' : 'opacity-40 group-hover/grip:opacity-90'
            }`}
          >
            <path d="M1 7 L7 1 M1 11 L11 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      )}

      <CompanionChatHeader
        lessonTitle={effectiveLessonTitle}
        language={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        onClearHistory={handleClearHistory}
        remainingTurns={remainingTurns}
        onResetSize={isMobile ? undefined : resetSize}
        onClose={onClose}
        isLoggedIn={!!user}
        hasArticleContext={!!articleContext}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode((prev) => (prev === 'chat' ? 'tools' : 'chat'))}
        onExpandToWorkspace={handleExpandToWorkspace}
      />

      {/* Context indicator banner */}
      {articleContext && (
        <div className="flex shrink-0 items-center border-b border-[#dfe5cf] bg-[#f4f7ee] px-3.5 py-1.5 text-[11.5px] text-[#4a6a44]">
          <div className="flex items-center gap-1.5 truncate">
            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#5d8a45]" />
            <span className="font-semibold text-[#2f4a2c]">
              {t('playground.companion.drawer.reading_with_you')}
            </span>
            <span className="truncate italic text-[#4a6a44]">
              {articleContext.articleTitle || t('playground.companion.drawer.your_story')}
            </span>
          </div>
        </div>
      )}

      {viewMode === 'tools' ? (
        <CompanionLearningTools
          articleTitle={effectiveLessonTitle}
          vocabulary={articleContext?.vocabulary}
          onDraftPrompt={(prompt) => {
            setViewMode('chat');
            setInputMessage(prompt);
            inputRef.current?.focus();
          }}
          onOpenVocabulary={articleContext?.onOpenVocabulary}
        />
      ) : (
        <>
          {/* Messages Body */}
          <div className="vc-scroll relative flex-1 space-y-3 overflow-y-auto bg-[radial-gradient(circle_at_20%_10%,#fdf6e3_0,transparent_45%),radial-gradient(circle_at_90%_80%,#f1f5e6_0,transparent_40%)] px-3.5 py-4">
            {isHistoryLoading && (
              <div className="flex items-center justify-center gap-2 py-2 text-xs italic text-[#7a8a66]">
                <ForestSpirit className="h-5 w-5 vc-spirit-bob" />
                {t('playground.companion.drawer.gathering_history')}
              </div>
            )}

            {messages.map((msg, idx) => (
              <CompanionMessageBubble
                key={msg.id || idx}
                message={msg}
                isTranslating={translatingIndex === idx}
                translateDisabled={translatingIndex !== null}
                onTranslate={(target) => handleTranslate(idx, target)}
              />
            ))}

            {isLoading && (
              <div className="vc-msg-in flex items-end gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#c9d6b0] bg-gradient-to-b from-[#e4f2df] to-[#cfe3b8]">
                  <ForestSpirit className="h-6 w-6" />
                </span>
                <div
                  aria-label="Companion is thinking"
                  className="flex items-center gap-1 rounded-[20px] rounded-bl-md border border-[#dfe5cf] bg-white px-4 py-3"
                >
                  <span className="vc-dot-hop h-1.5 w-1.5 rounded-full bg-[#8a9a6f]" />
                  <span className="vc-dot-hop h-1.5 w-1.5 rounded-full bg-[#8a9a6f] [animation-delay:.15s]" />
                  <span className="vc-dot-hop h-1.5 w-1.5 rounded-full bg-[#8a9a6f] [animation-delay:.3s]" />
                </div>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-2xl border border-[#f0c9bc] bg-[#fdf0eb] px-3 py-2.5 text-xs leading-relaxed text-[#8f3f2c]"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b4533c]" />
                <p className="flex-1">{error}</p>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="shrink-0 rounded-full px-1.5 text-[11px] font-semibold hover:bg-white/70"
                >
                  {t('playground.companion.drawer.dismiss')}
                </button>
              </div>
            )}

            {/* Referenced Lessons */}
            {referencedLessons.length > 0 && (
              <div className="pt-1">
                <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a8a66]">
                  {t('playground.companion.drawer.related_lessons')}
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1 vc-scroll">
                  {referencedLessons.map((item) => (
                    <a
                      key={item.id}
                      href={`/lessons/${item.id}`}
                      className="min-w-[160px] max-w-[200px] shrink-0 rounded-2xl border border-[#c9d6b0] bg-gradient-to-br from-white to-[#f1f5e6] px-3 py-2 text-xs transition-transform hover:-translate-y-0.5"
                    >
                      <p className="truncate font-serif font-bold text-[#2f4a2c]">{item.titleEn}</p>
                      <p className="truncate text-[#7a8a66]">{item.titleVi}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Case 1: Unauthenticated Guest -> Render Login Gate */}
          {!user ? (
            <div className="shrink-0 border-t border-dashed border-[#d6dcc4] bg-[#fffaf0] px-4 py-4 text-center">
              <p className="mb-1 font-serif text-[15px] font-bold text-[#2f4a2c]">
                {t('playground.companion.drawer.signin_required_title')}
              </p>
              <p className="mb-3 text-xs leading-relaxed text-[#627750]">
                {t('playground.companion.drawer.signin_required_desc')}
              </p>
              <button
                type="button"
                onClick={() => {
                  const redirectPath = location.pathname + location.search;
                  navigate(paths.login({ redirect: redirectPath }));
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#5d8a45] px-5 py-2 text-xs font-bold text-white shadow-[0_3px_0_-1px_#3e5a3a] transition-all hover:bg-[#4f7a3a] active:translate-y-px active:shadow-none"
              >
                {t('playground.companion.drawer.signin_btn')}
              </button>
            </div>
          ) : isLimitReached ? (
            /* Case 2: Hit Limit -> Render Upgrade Gate */
            <div className="shrink-0 border-t border-dashed border-[#d6dcc4] bg-[#fffaf0] px-4 py-4 text-center">
              <p className="mb-1 font-serif text-[15px] font-bold text-[#8f3f2c]">
                {t('playground.companion.drawer.limit_reached_title')}
              </p>
              <p className="mb-3 text-xs leading-relaxed text-[#7a8a66]">
                {t('playground.companion.drawer.limit_reached_desc')}
              </p>
              <button
                type="button"
                onClick={() => navigate(PATHS.pricing)}
                className="inline-flex items-center justify-center rounded-full bg-[#b4533c] px-5 py-2 text-xs font-bold text-white shadow-[0_3px_0_-1px_#7a2a1a] transition-all hover:bg-[#9a4330] active:translate-y-px active:shadow-none"
              >
                {t('playground.companion.drawer.upgrade_btn')}
              </button>
            </div>
          ) : (
            /* Case 3: Authenticated with quota remaining -> Show Quick Prompts & Composer */
            <>
              {suggestedPrompts.length > 0 && !isLoading && (
                <div className="shrink-0 border-t border-dashed border-[#d6dcc4] bg-[#fffaf0] px-3 pt-2">
                  <CompanionQuickPrompts
                    prompts={suggestedPrompts}
                    onSelectPrompt={(p) => handleSend(p)}
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="shrink-0 bg-[#fffaf0] px-3 pt-1 pb-3">
                <div className="flex items-end gap-2 rounded-[22px] border-2 border-[#d6dcc4] bg-white py-1.5 pr-1.5 pl-3.5 transition-colors focus-within:border-[#8a9a6f]">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    rows={1}
                    placeholder={t('playground.companion.drawer.input_placeholder')}
                    className="max-h-[120px] flex-1 resize-none bg-transparent py-1.5 text-[13.5px] text-[#2f3a2a] placeholder:text-[#a3ad90] focus:outline-none disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={isLoading || !inputMessage.trim()}
                    aria-label={t('playground.companion.drawer.send_aria')}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5d8a45] text-white shadow-[0_3px_0_-1px_#3e5a3a] transition-all hover:bg-[#4f7a3a] active:translate-y-px active:shadow-none disabled:cursor-not-allowed disabled:bg-[#c9d6b0] disabled:shadow-none"
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-center text-[10px] text-[#a3ad90]">
                  {t('playground.companion.drawer.keyboard_hint')}
                </p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
