import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { companionService } from '@/services/companionService';
import type {
  CompanionChatMessage,
  ReferencedLesson,
} from '@/types/companion';
import { CompanionQuickPrompts } from './CompanionQuickPrompts';

interface CompanionChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId?: string;
  lessonTitle?: string;
}

export const CompanionChatDrawer: React.FC<CompanionChatDrawerProps> = ({
  isOpen,
  onClose,
  lessonId,
  lessonTitle,
}) => {
  const [messages, setMessages] = useState<CompanionChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const [referencedLessons, setReferencedLessons] = useState<ReferencedLesson[]>([]);
  const [remainingTurns, setRemainingTurns] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialGreeting = lessonTitle
        ? `Hello! I'm your VieCultures Companion. We are currently exploring "${lessonTitle}". Feel free to ask me anything about the culture, history, or language in this lesson!`
        : `Hello! I'm your VieCultures Companion. What Vietnamese tradition, street food, or cultural custom would you love to chat about today?`;

      setMessages([
        {
          role: 'assistant',
          content: initialGreeting,
        },
      ]);

      setSuggestedPrompts(
        lessonTitle
          ? [
              `What is the cultural significance of this lesson?`,
              `Can you explain the key cultural phrases in simple English?`,
            ]
          : [
              `What makes Northern and Southern Pho different?`,
              `Tell me about the most vibrant festivals in Vietnam.`,
            ]
      );
    }
  }, [isOpen, lessonTitle, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || inputMessage).trim();
    console.log('[CompanionChatDrawer] handleSend triggered:', { textToSend, lessonId });
    if (!textToSend || isLoading) return;

    setError(null);
    setInputMessage('');

    const newHistory: CompanionChatMessage[] = [
      ...messages,
      { role: 'user', content: textToSend },
    ];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const response = await companionService.sendMessage({
        lessonId,
        message: textToSend,
        history: messages,
      });

      console.log('[CompanionChatDrawer] Received response:', response);

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.reply },
      ]);
      setSuggestedPrompts(response.suggestedPrompts || []);
      setReferencedLessons(response.referencedLessons || []);
      setRemainingTurns(response.remainingDailyTurns);
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
          <div className="flex items-center gap-3">
            {remainingTurns !== null && (
              <span className="text-xs px-2 py-0.5 rounded bg-amber-800 text-amber-100 font-mono">
                {remainingTurns === -1 ? 'Pro Unlimited' : `${remainingTurns} turns left`}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-amber-200 hover:text-white text-sm font-semibold px-2 py-1 rounded bg-amber-800/60 hover:bg-amber-800"
            >
              Close
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
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
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
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
