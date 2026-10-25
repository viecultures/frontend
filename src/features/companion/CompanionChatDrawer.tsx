import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { companionService } from '@/services/companionService';
import type {
  CompanionChatMessage,
  CompanionLanguage,
  ReferencedLesson,
} from '@/types/companion';
import { CompanionQuickPrompts } from './CompanionQuickPrompts';

interface CompanionChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId?: string;
  lessonTitle?: string;
}

const sanitizeCompanionMarkdown = (content: string): string => {
  if (!content) return '';
  return content
    // Remove standalone divider lines made of 3+ asterisks, dashes, or underscores (e.g. ***, ---, ___)
    .replace(/^(?:\s*[*-_]){3,}\s*$/gm, '')
    // Remove rogue 3+ asterisks that sit by themselves or at line boundaries
    .replace(/(?:^|\n)\s*\*{3,}\s*(?:\n|$)/g, '\n')
    // Remove trailing asterisks, hashes, or dashes at the end of the text
    .replace(/[\s*#_-]+$/, '')
    // Collapse excess newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
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
  const [selectedLanguage, setSelectedLanguage] = useState<CompanionLanguage>('bilingual');
  const [translatingIndex, setTranslatingIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleClearHistory = async () => {
    const confirmClear = window.confirm(
      'Ban co chac chan muon xoa toan bo lich su hoi thoai nay khong?'
    );
    if (!confirmClear) return;

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

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex max-w-full pl-10">
      <div className="w-screen max-w-md bg-stone-50 border-l border-amber-200 shadow-2xl flex flex-col font-sans">
        {/* Drawer Header */}
        <div className="p-4 bg-amber-900 text-amber-50 flex items-center justify-between border-b border-amber-800">
          <div>
            <h2 className="text-lg font-serif font-bold tracking-wide">
              Cultural Companion
            </h2>
            <p className="text-xs text-amber-200">
              {lessonTitle ? `In Context: ${lessonTitle}` : 'General Cultural Explorer'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {remainingTurns !== null && (
              <span className="text-xs px-2 py-0.5 rounded bg-amber-800 text-amber-100 font-mono">
                {remainingTurns === -1 ? 'Pro Unlimited' : `${remainingTurns} turns left`}
              </span>
            )}
            <button
              type="button"
              onClick={handleClearHistory}
              title="Xoa lich su hoi thoai"
              className="text-amber-200 hover:text-white text-xs font-semibold px-2 py-1 rounded bg-amber-800/60 hover:bg-red-800 transition-colors"
            >
              Xoa lich su
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-amber-200 hover:text-white text-sm font-semibold px-2 py-1 rounded bg-amber-800/60 hover:bg-amber-800"
            >
              Close
            </button>
          </div>
        </div>

        {/* Language Selection Toggle Bar */}
        <div className="px-4 py-2 bg-amber-950/90 border-b border-amber-800 flex items-center justify-between text-xs text-amber-100">
          <span className="font-medium text-amber-300">Ngon ngu:</span>
          <div className="flex rounded-md bg-amber-900/80 p-0.5 border border-amber-700/60">
            <button
              type="button"
              onClick={() => setSelectedLanguage('vi')}
              className={`px-2.5 py-1 rounded text-xs transition-colors font-medium ${
                selectedLanguage === 'vi'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'text-amber-200 hover:text-white'
              }`}
            >
              Tieng Viet
            </button>
            <button
              type="button"
              onClick={() => setSelectedLanguage('en')}
              className={`px-2.5 py-1 rounded text-xs transition-colors font-medium ${
                selectedLanguage === 'en'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'text-amber-200 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setSelectedLanguage('bilingual')}
              className={`px-2.5 py-1 rounded text-xs transition-colors font-medium ${
                selectedLanguage === 'bilingual'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'text-amber-200 hover:text-white'
              }`}
            >
              Song ngu
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isHistoryLoading && (
            <div className="text-center py-2 text-xs text-stone-500 font-serif italic">
              Loading chat history...
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-amber-700 text-white rounded-br-none'
                    : 'bg-white text-stone-800 border border-amber-100/80 rounded-bl-none font-sans'
                }`}
              >
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div className="prose prose-sm max-w-none text-stone-800 leading-relaxed font-sans [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4">
                    <ReactMarkdown
                      components={{
                        hr: () => null,
                      }}
                    >
                      {sanitizeCompanionMarkdown(msg.content)}
                    </ReactMarkdown>
                  </div>
                )}

                {/* Inline Translation Result */}
                {msg.translatedContent && (
                  <div className="mt-2.5 pt-2 border-t border-amber-200/50 text-xs">
                    <span className="font-semibold block text-[10px] uppercase tracking-wider mb-1 text-stone-500">
                      Ban dich:
                    </span>
                    <p
                      className={`whitespace-pre-wrap ${
                        msg.role === 'user' ? 'text-amber-100' : 'text-stone-700'
                      }`}
                    >
                      {msg.translatedContent}
                    </p>
                  </div>
                )}
              </div>

              {/* Translation Action Buttons */}
              <div
                className={`flex items-center gap-1.5 mt-1 text-[11px] ${
                  msg.role === 'user' ? 'justify-end pr-1' : 'justify-start pl-1'
                }`}
              >
                {translatingIndex === idx ? (
                  <span className="text-stone-400 italic">Dang dich...</span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleTranslate(idx, 'vi')}
                      className="text-amber-800 hover:text-amber-950 hover:underline px-1 py-0.5"
                    >
                      Dich sang VI
                    </button>
                    <span className="text-stone-300">|</span>
                    <button
                      type="button"
                      onClick={() => handleTranslate(idx, 'en')}
                      className="text-amber-800 hover:text-amber-950 hover:underline px-1 py-0.5"
                    >
                      Dich sang EN
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start">
              <div className="bg-white border border-stone-200 text-stone-500 rounded-2xl rounded-bl-none px-4 py-2 text-xs italic font-serif">
                Companion is thinking...
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs leading-relaxed">
              <p className="font-semibold">Notice</p>
              <p>{error}</p>
            </div>
          )}

          {/* Referenced Lessons */}
          {referencedLessons.length > 0 && (
            <div className="pt-2 border-t border-stone-200">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Referenced Lessons
              </p>
              <div className="space-y-1.5">
                {referencedLessons.map((item) => (
                  <a
                    key={item.id}
                    href={`/lessons/${item.id}`}
                    className="block p-2 rounded bg-amber-50/70 border border-amber-200 hover:bg-amber-100/80 transition-colors text-xs text-amber-950"
                  >
                    <p className="font-serif font-bold">{item.titleEn}</p>
                    <p className="text-stone-600">{item.titleVi}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {suggestedPrompts.length > 0 && (
          <div className="px-4 py-2 bg-stone-100/80 border-t border-stone-200">
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Suggested Topics
            </p>
            <CompanionQuickPrompts
              prompts={suggestedPrompts}
              onSelectPrompt={(p) => handleSend(p)}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-stone-200">
          <div className="flex gap-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={2}
              placeholder="Ask a question or practice English..."
              className="flex-1 resize-none rounded-lg border border-stone-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-600 text-stone-800 disabled:bg-stone-100"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={isLoading || !inputMessage.trim()}
              className="self-end px-4 py-2 rounded-lg bg-amber-800 text-white font-medium text-sm hover:bg-amber-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
