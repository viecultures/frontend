import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Languages } from 'lucide-react';
import type { CompanionChatMessage } from '@/types/companion';
import { ForestSpirit } from './ForestSpirit';

export type TranslateTarget = 'vi' | 'en';

interface CompanionMessageBubbleProps {
  message: CompanionChatMessage;
  isTranslating: boolean;
  translateDisabled: boolean;
  onTranslate: (target: TranslateTarget) => void;
}

const VIETNAMESE_CHARS =
  /[ăâđêôơưàảãáạằẳẵắặầẩẫấậèẻẽéẹềểễếệìỉĩíịòỏõóọồổỗốộờởỡớợùủũúụừửữứựỳỷỹýỵ]/i;

/** Picks the opposite language of the message content: Vietnamese text -> EN, otherwise -> VI. */
export const detectTranslateTarget = (content: string): TranslateTarget =>
  VIETNAMESE_CHARS.test(content) ? 'en' : 'vi';

export const sanitizeCompanionMarkdown = (content: string): string => {
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

export const CompanionMessageBubble: React.FC<CompanionMessageBubbleProps> = ({
  message,
  isTranslating,
  translateDisabled,
  onTranslate,
}) => {
  const isUser = message.role === 'user';
  const target = detectTranslateTarget(message.content);

  return (
    <div className={`vc-msg-in group/msg flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <span className="mt-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#c9d6b0] bg-gradient-to-b from-[#e4f2df] to-[#cfe3b8]">
          <ForestSpirit className="h-6 w-6" />
        </span>
      )}

      <div className={`flex min-w-0 max-w-[82%] flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-[20px] px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
            isUser
              ? 'rounded-br-md bg-[#5d8a45] text-[#fffaf0] shadow-[0_3px_0_-1px_#3e5a3a]'
              : 'rounded-bl-md border border-[#dfe5cf] bg-white text-[#2f3a2a] shadow-[0_3px_0_-1px_#e4e9d6]'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none break-words leading-relaxed text-[#2f3a2a] [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&_strong]:text-[#3e5a3a]">
              <ReactMarkdown components={{ hr: () => null }}>
                {sanitizeCompanionMarkdown(message.content)}
              </ReactMarkdown>
            </div>
          )}

          {message.translatedContent && (
            <div
              className={`mt-2 border-t border-dashed pt-2 text-xs ${
                isUser ? 'border-white/40' : 'border-[#c9d6b0]'
              }`}
            >
              <span
                className={`mb-0.5 block text-[10px] font-bold uppercase tracking-wider ${
                  isUser ? 'text-white/70' : 'text-[#7a8a66]'
                }`}
              >
                Translation
              </span>
              <p className={`whitespace-pre-wrap break-words ${isUser ? 'text-white/90' : 'text-[#4a5a40]'}`}>
                {message.translatedContent}
              </p>
            </div>
          )}
        </div>

        <div
          className={`mt-1 flex h-5 items-center px-1 transition-opacity duration-200 sm:opacity-0 sm:group-hover/msg:opacity-100 sm:focus-within:opacity-100 ${
            isTranslating ? 'sm:opacity-100' : ''
          }`}
        >
          {isTranslating ? (
            <span className="text-[11px] italic text-[#7a8a66]">Translating...</span>
          ) : (
            <button
              type="button"
              onClick={() => onTranslate(target)}
              disabled={translateDisabled}
              title={target === 'en' ? 'Translate to English' : 'Translate to Vietnamese'}
              className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium text-[#7a8a66] hover:bg-[#eef3e2] hover:text-[#3e5a3a] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Languages className="h-3 w-3" />
              {target === 'en' ? 'Translate to EN' : 'Translate to VI'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
