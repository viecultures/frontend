/**
 * MascotChatBubble
 *
 * Spacious comic speech bubbles originating from the Cultural Mascot (Bong bóng chat từ linh vật).
 * Design faithfully matches user mockup (media_1791886197485_e5db3817.png):
 * - Bigger & wider layout for comfortable reading and vocabulary inspection.
 * - Pastel lime-green bubbles (#98DC6E) with dark forest-green text (#132A18).
 * - Comic speech tail pointing down towards the mascot.
 * - Integrated instant vocabulary dictionary lookup: double-click or drag-highlight (bôi đen) any word.
 * - Interactive TTS replay button (Volume2) and animated typing indicator for AI thinking.
 * - Strict UI Iconography Rule: 100% Lucide React SVG icons, zero raw emojis.
 */

import React, { useMemo } from 'react';
import { Volume2, Radio, BookOpen } from 'lucide-react';
import { InPlaceDictionaryPopup } from '@/features/reader/components/InPlaceDictionaryPopup';
import { useReaderDictionary } from '@/features/reader/hooks/useReaderDictionary';
import { maskProfanity } from '@/utils/dictionary-service';

export interface MascotChatBubbleProps {
  latestText?: string;
  role?: 'agent' | 'user' | 'system';
  isAwaitingResponse?: boolean;
  isThinking?: boolean;
  onSpeak?: (text: string) => void;
  className?: string;
}

interface ComicBubbleItemProps {
  text: string;
  isUser?: boolean;
  onSpeak?: (text: string) => void;
  showTail?: boolean;
  onTextSelection?: (e: React.MouseEvent) => void;
}

const ComicBubbleItem: React.FC<ComicBubbleItemProps> = ({
  text,
  isUser = false,
  onSpeak,
  showTail = true,
  onTextSelection,
}) => {
  const isShortText = text.length <= 40;

  return (
    <div
      className={`group relative flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
        isUser ? 'items-end self-end' : 'items-start self-start'
      }`}
    >
      <div
        onMouseUp={onTextSelection}
        onDoubleClick={onTextSelection}
        className={`relative w-fit min-w-[100px] max-w-[min(600px,calc(92vw-40px))] px-5 py-3 sm:px-6 sm:py-3.5 rounded-[24px] sm:rounded-[28px] shadow-[0_14px_36px_rgba(0,0,0,0.5)] transition-all duration-200 ${
          isUser
            ? 'bg-[#183438] text-[#E0F2FE] border border-cyan-400/30'
            : 'bg-[#98DC6E] text-[#132A18]'
        }`}
      >
        {/* Comic Speech Tail pointing down-left toward the mascot */}
        {showTail && !isUser && (
          <svg
            className="absolute -bottom-3.5 left-7 w-6 h-4 pointer-events-none drop-shadow-sm"
            viewBox="0 0 20 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M0 0 L 16 0 C 14 5, 8 11, 0 16 C 3 10, 3 4, 0 0 Z"
              fill="#98DC6E"
            />
          </svg>
        )}

        {/* User Speech Tail pointing down-right */}
        {showTail && isUser && (
          <svg
            className="absolute -bottom-3.5 right-7 w-6 h-4 pointer-events-none drop-shadow-sm"
            viewBox="0 0 20 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M4 0 L 20 0 C 17 4, 17 10, 20 16 C 12 11, 6 5, 4 0 Z"
              fill="#183438"
            />
          </svg>
        )}

        {/* Optional Vocab Hint & Action Bar (only on longer educational dialogue) */}
        {!isUser && !isShortText && (
          <div className="flex items-center justify-between gap-4 pb-1.5 mb-2 border-b border-[#132A18]/15 text-[11px] font-medium text-[#132A18]/70 select-none">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <BookOpen className="w-3.5 h-3.5 text-[#132A18]/80 shrink-0" />
              <span>Bôi đen hoặc nhấp đúp để tra từ vựng</span>
            </span>

            {onSpeak && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(maskProfanity(text));
                }}
                className="p-1 rounded-full hover:bg-black/10 text-[#132A18]/80 hover:text-[#132A18] transition-colors cursor-pointer shrink-0"
                title="Nghe phát âm toàn bài (TTS)"
                aria-label="Nghe phát âm"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Bubble Text Content with Clean Scroll */}
        <div className="max-h-[calc(100vh-380px)] overflow-y-auto pr-1 select-text">
          <div
            className={`flex gap-2.5 ${
              isShortText ? 'items-center' : 'items-start'
            }`}
          >
            {isUser && (
              <span className="w-4 h-4 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
                <Radio className="w-2.5 h-2.5" />
              </span>
            )}

            <p className="font-semibold text-[15px] sm:text-[16px] lg:text-[17px] leading-relaxed tracking-normal select-text cursor-text selection:bg-[#132A18] selection:text-[#98DC6E] whitespace-pre-line">
              {maskProfanity(text)}
            </p>

            {/* Inline Audio button for short text */}
            {onSpeak && !isUser && isShortText && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(maskProfanity(text));
                }}
                className="ml-2.5 p-1 rounded-full hover:bg-black/10 text-[#132A18]/70 hover:text-[#132A18] transition-colors cursor-pointer shrink-0"
                title="Nghe phát âm (TTS)"
                aria-label="Nghe phát âm"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MascotChatBubble: React.FC<MascotChatBubbleProps> = ({
  latestText,
  role = 'agent',
  isAwaitingResponse = false,
  isThinking = false,
  onSpeak,
  className = '',
}) => {
  const isUser = role === 'user';
  const showThinking = isAwaitingResponse || isThinking;
  const { popupState, closeDictionary, handleTextSelection } = useReaderDictionary();

  // Dialogue bubbles: idle greeting or dynamic AI dialogue
  const bubbleList = useMemo(() => {
    if (!latestText) {
      // Default greeting bubbles matching mockup: "Hello" / "Nice to meet you"
      return [
        { id: 'b1', text: 'Hello' },
        { id: 'b2', text: 'Nice to meet you' },
      ];
    }

    // When AI speaks, display the speech turn
    return [{ id: 'b-main', text: latestText }];
  }, [latestText]);

  return (
    <>
      <div
        className={`relative flex flex-col items-start space-y-3 w-fit max-w-full select-none ${className}`}
        aria-live="polite"
      >
        {/* Dialogue Bubbles */}
        {bubbleList.map((bubble, idx) => (
          <ComicBubbleItem
            key={bubble.id}
            text={bubble.text}
            isUser={isUser}
            onSpeak={onSpeak}
            showTail={idx === bubbleList.length - 1}
            onTextSelection={handleTextSelection}
          />
        ))}

        {/* Thinking / Typing Animation Bubble */}
        {showThinking && (
          <div className="self-start relative inline-flex items-center gap-1.5 px-5 py-3 rounded-[24px] bg-[#98DC6E] shadow-md animate-in fade-in zoom-in-95 duration-200">
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#132A18] animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#132A18] animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#132A18] animate-bounce"
              style={{ animationDelay: '300ms' }}
            />

            {/* Comic Tail */}
            <svg
              className="absolute -bottom-3 left-6 w-5 h-4 pointer-events-none drop-shadow-sm"
              viewBox="0 0 20 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M0 0 L 16 0 C 14 5, 8 11, 0 16 C 3 10, 3 4, 0 0 Z"
                fill="#98DC6E"
              />
            </svg>
          </div>
        )}
      </div>

      {/* In-Place Dictionary Lookup Popup */}
      <InPlaceDictionaryPopup
        isOpen={popupState.isOpen}
        vocab={popupState.vocab}
        position={popupState.position}
        onClose={closeDictionary}
        themeMode="dark"
      />
    </>
  );
};

export default MascotChatBubble;
