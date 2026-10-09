import React from 'react';
import { Sparkles, User, MapPin, Volume2 } from 'lucide-react';
import { VIETNAM_34_PROVINCES } from '@/data/vietnamMapData';
import type { ChatMessage } from '../types';

interface StreamingConsoleProps {
  turns: ChatMessage[];
  isLoading: boolean;
  onSelectProvince: (provinceId: string) => void;
  onSpeakText: (text: string) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export const StreamingConsole: React.FC<StreamingConsoleProps> = ({
  turns,
  isLoading,
  onSelectProvince,
  onSpeakText,
  scrollRef,
}) => {
  return (
    <div
      ref={scrollRef}
      className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5 flex flex-col select-text"
    >
      {/* EMPTY STATE (Matching map_ai_agent screenshot) */}
      {turns.length === 0 && !isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto animate-in fade-in duration-300">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.16em] text-[#2563EB] dark:text-[#60A5FA] uppercase select-none">
            START THE CONVERSATION BY PRESSING THE PLAY BUTTON
          </p>
        </div>
      ) : (
        /* CONVERSATION TURNS STREAM */
        <div className="space-y-4">
          {turns.map((turn) => {
            const isAgent = turn.sender === 'agent';
            const targetProv = turn.focusedProvinceId
              ? VIETNAM_34_PROVINCES.find((p) => p.id === turn.focusedProvinceId)
              : null;

            return (
              <div
                key={turn.id}
                className={`flex items-start gap-3 ${isAgent ? 'flex-row' : 'flex-row-reverse'
                  } animate-in fade-in slide-in-from-bottom-2 duration-200`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${isAgent
                    ? 'bg-[#1E4B43] text-[#D4AF37]'
                    : 'bg-[#3B82F6] text-white'
                    }`}
                >
                  {isAgent ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Content Box */}
                <div className={`max-w-[85%] flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-xs font-semibold text-[#5D706A] dark:text-[#9FB1AA]">
                      {isAgent ? 'VieCultures AI Guide' : 'You'}
                    </span>
                    <span className="text-[10px] text-[#8E9F99] font-mono">{turn.timestamp}</span>
                  </div>

                  <div
                    className={`rounded-2xl p-4 shadow-sm text-sm leading-relaxed border ${isAgent
                      ? 'bg-white dark:bg-[#162420] border-gray-200/80 dark:border-white/10 text-[#1E2925] dark:text-[#E8EFEA]'
                      : 'bg-[#2563EB] border-[#2563EB] text-white rounded-tr-none'
                      }`}
                  >
                    <div className="whitespace-pre-line space-y-2">{turn.text}</div>

                    {/* Interactive Province Focus Chip */}
                    {isAgent && targetProv && (
                      <div className="mt-3 pt-2.5 border-t border-black/5 dark:border-white/10 flex items-center justify-between gap-2">
                        <button
                          onClick={() => onSelectProvince(targetProv.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1E4B43]/10 dark:bg-[#D4AF37]/15 text-[#1E4B43] dark:text-[#D4AF37] hover:bg-[#1E4B43] hover:text-white text-xs font-semibold transition-all cursor-pointer border border-[#1E4B43]/20 dark:border-[#D4AF37]/30"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Khám phá {targetProv.name} trên bản đồ</span>
                        </button>

                        <button
                          onClick={() => onSpeakText(turn.text)}
                          className="p-1.5 rounded-md text-[#5D706A] hover:text-[#1E4B43] dark:text-[#8E9F99] dark:hover:text-[#D4AF37] transition-all cursor-pointer"
                          title="Nghe lại"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Streaming loading indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 animate-in fade-in">
              <div className="w-8 h-8 rounded-full bg-[#1E4B43] text-[#D4AF37] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white dark:bg-[#162420] border border-gray-200 dark:border-white/10 text-xs text-[#5D706A] dark:text-[#8E9F99] flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>đang phân tích...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StreamingConsole;
