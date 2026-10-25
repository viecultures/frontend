import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SendHorizontal } from 'lucide-react';
import { companionService } from '@/services/companionService';
import type {
  CompanionChatMessage,
  CompanionLanguage,
  ReferencedLesson,
} from '@/types/companion';
import { CompanionQuickPrompts } from './CompanionQuickPrompts';
import { CompanionChatHeader } from './CompanionChatHeader';
import { CompanionMessageBubble } from './CompanionMessageBubble';
import { ForestSpirit } from './ForestSpirit';
import { companionKeyframes } from './companionTheme';
import { useResizableWindow, type WindowSize } from './useResizableWindow';
import { useMediaQuery } from './useMediaQuery';

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
    return lessonTitle
      ? `Hello! I am your VieCultures Companion. We are currently exploring "${lessonTitle}". Feel free to ask me anything about the culture, history, or language in this lesson!`
      : `Hello! I am your VieCultures Companion. What Vietnamese tradition, street food, or cultural custom would you love to chat about today?`;
  }, [lessonTitle]);

  const getDefaultPrompts = useCallback((): string[] => {
    return lessonTitle
      ? [
          'What is the cultural significance of this lesson?',
          'Can you explain the key cultural phrases in simple English?',
        ]
      : [
          'What makes Northern and Southern Pho different?',
          'Tell me about the most vibrant festivals in Vietnam.',
        ];
  }, [lessonTitle]);

  // Load chat history when drawer opens
  useEffect(() => {
    if (!isOpen) return;

    let isSubscribed = true;

    const loadHistory = async () => {
      setIsHistoryLoading(true);
      setError(null);
      try {
        const history = await companionService.getChatHistory(lessonId);
        if (!isSubscribed) return;

        if (history && history.length > 0) {
          setMessages(history);
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
          await companionService.saveChatHistory(initialMsgs, lessonId);
        }
        setSuggestedPrompts(getDefaultPrompts());
      } catch (err) {
        console.error('[CompanionChatDrawer] Failed to load history:', err);
        setError('Unable to load full chat history. You can still chat normally.');
      } finally {
        if (isSubscribed) {
          setIsHistoryLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, lessonId, getInitialGreeting, getDefaultPrompts]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isHistoryLoading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || inputMessage).trim();
    console.log('[CompanionChatDrawer] handleSend triggered:', {
      textToSend,
      lessonId,
      language: selectedLanguage,
    });
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
        lessonId,
        message: textToSend,
        history: messages,
        language: selectedLanguage,
      });

      console.log('[CompanionChatDrawer] Received response:', response);

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

      // Persist new history
      await companionService.saveChatHistory(updatedHistory, lessonId);
    } catch (err) {
      console.error('[CompanionChatDrawer] Failed to get response:', err);
      const errMessage = err instanceof Error ? err.message : 'Failed to reach AI companion';
      setError(errMessage);
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
      await companionService.saveChatHistory(updated, lessonId);
    } catch (err) {
      console.error('[CompanionChatDrawer] Translation action failed:', err);
      setError('Translation failed. Please try again.');
    } finally {
      setTranslatingIndex(null);
    }
  };

  const handleClearHistory = async (): Promise<void> => {
    try {
      await companionService.clearChatHistory(lessonId);
      const initialMsgs: CompanionChatMessage[] = [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: getInitialGreeting(),
          timestamp: Date.now(),
        },
      ];
      setMessages(initialMsgs);
      setSuggestedPrompts(getDefaultPrompts());
      setReferencedLessons([]);
      setError(null);
      await companionService.saveChatHistory(initialMsgs, lessonId);
    } catch (err) {
      console.error('[CompanionChatDrawer] Failed to clear history:', err);
      setError('Could not clear history. Please try again.');
    }
  };

  if (!isOpen) {
    return null;
  }

  const windowStyle: React.CSSProperties | undefined = isMobile
    ? undefined
    : { width: size.width, height: size.height };

  return (
    <div
      role="dialog"
      aria-label="Cultural AI Companion chat"
      style={windowStyle}
      className={`vc-window-pop fixed z-50 flex flex-col overflow-hidden bg-[#fffaf0] font-sans ${
        isMobile
          ? 'inset-0'
          : 'right-6 bottom-[108px] rounded-[26px] border-2 border-[#8a9a6f] shadow-[0_8px_0_-2px_#c9d6b0,0_28px_60px_-20px_rgba(50,70,40,0.55)]'
      }`}
    >
      <style>{companionKeyframes}</style>

      {/* Resize grip (top-left, since the window is anchored bottom-right) */}
      {!isMobile && (
        <button
          type="button"
          aria-label="Drag to resize chat window"
          title="Drag to resize. Double-click to reset."
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
        lessonTitle={lessonTitle}
        language={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        onClearHistory={handleClearHistory}
        remainingTurns={remainingTurns}
        onResetSize={isMobile ? undefined : resetSize}
        onClose={onClose}
      />

      {/* Messages Body */}
      <div className="vc-scroll relative flex-1 space-y-3 overflow-y-auto bg-[radial-gradient(circle_at_20%_10%,#fdf6e3_0,transparent_45%),radial-gradient(circle_at_90%_80%,#f1f5e6_0,transparent_40%)] px-3.5 py-4">
        {isHistoryLoading && (
          <div className="flex items-center justify-center gap-2 py-2 text-xs italic text-[#7a8a66]">
            <ForestSpirit className="h-5 w-5 vc-spirit-bob" />
            Gathering our past conversations...
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
              Dismiss
            </button>
          </div>
        )}

        {/* Referenced Lessons */}
        {referencedLessons.length > 0 && (
          <div className="pt-1">
            <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a8a66]">
              Related lessons
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

      {/* Quick Prompts */}
      {suggestedPrompts.length > 0 && !isLoading && (
        <div className="shrink-0 border-t border-dashed border-[#d6dcc4] bg-[#fffaf0] px-3 pt-2">
          <CompanionQuickPrompts
            prompts={suggestedPrompts}
            onSelectPrompt={(p) => handleSend(p)}
            disabled={isLoading}
          />
        </div>
      )}

      {/* Input Bar */}
      <div className="shrink-0 bg-[#fffaf0] px-3 pt-1 pb-3">
        <div className="flex items-end gap-2 rounded-[22px] border-2 border-[#d6dcc4] bg-white py-1.5 pr-1.5 pl-3.5 transition-colors focus-within:border-[#8a9a6f]">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            placeholder="Ask about Vietnamese culture..."
            className="max-h-[120px] flex-1 resize-none bg-transparent py-1.5 text-[13.5px] text-[#2f3a2a] placeholder:text-[#a3ad90] focus:outline-none disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={isLoading || !inputMessage.trim()}
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5d8a45] text-white shadow-[0_3px_0_-1px_#3e5a3a] transition-all hover:bg-[#4f7a3a] active:translate-y-px active:shadow-none disabled:cursor-not-allowed disabled:bg-[#c9d6b0] disabled:shadow-none"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-center text-[10px] text-[#a3ad90]">Enter to send, Shift + Enter for a new line</p>
      </div>
    </div>
  );
};
