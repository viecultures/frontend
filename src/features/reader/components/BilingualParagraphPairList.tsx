import React, { useState, type MouseEvent } from 'react';
import { Eye, EyeOff, Play, Volume2, BookOpen } from 'lucide-react';
import type { ReaderArticleData } from '../services/readerApiService';

export interface BilingualParagraphPairListProps {
  articleData: ReaderArticleData;
  activeParagraphIndex: number;
  fontSize: number;
  themeMode: 'paper' | 'dark';
  vocabBtnClass: string;
  onVocabClick: (word: string, event: MouseEvent<HTMLButtonElement>) => void;
  onPlayParagraphAudio?: (index: number, timestamp: number) => void;
  onMouseUpText?: (e: MouseEvent<HTMLDivElement>) => void;
  onDoubleClickText?: (e: MouseEvent<HTMLDivElement>) => void;
}

export const BilingualParagraphPairList: React.FC<BilingualParagraphPairListProps> = ({
  articleData,
  activeParagraphIndex,
  fontSize,
  themeMode,
  vocabBtnClass,
  onVocabClick,
  onPlayParagraphAudio,
  onMouseUpText,
  onDoubleClickText,
}) => {
  const isDark = themeMode === 'dark';

  // Mobile accordion expand state for each paragraph
  const [expandedTranslations, setExpandedTranslations] = useState<Record<number, boolean>>({});
  const [allExpanded, setAllExpanded] = useState<boolean>(false);

  const toggleTranslation = (index: number) => {
    setExpandedTranslations((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleToggleAll = () => {
    const nextState = !allExpanded;
    setAllExpanded(nextState);
    const updated: Record<number, boolean> = {};
    articleData.paragraphs.forEach((_, idx) => {
      updated[idx] = nextState;
    });
    setExpandedTranslations(updated);
  };

  // Build vocabulary regex for highlighting
  const vocabulary = [...(articleData.vocabularies || [])].sort(
    (a, b) => b.word.length - a.word.length
  );
  const escapedWords = vocabulary
    .map((v) => v.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .filter(Boolean);
  const vocabularyPattern = escapedWords.length
    ? new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi')
    : null;

  const renderEnglishWithVocab = (text: string) => {
    if (!vocabularyPattern) return text;
    return text.split(vocabularyPattern).map((part, index) => {
      const match = vocabulary.find(
        (v) => v.word.toLowerCase() === part.toLowerCase()
      );
      return match ? (
        <button
          key={index}
          type="button"
          onClick={(event) => onVocabClick(match.word, event)}
          className={vocabBtnClass}
          title={`Tra cứu từ vựng: “${part}”`}
        >
          {part}
        </button>
      ) : (
        part
      );
    });
  };

  return (
    <div className="bilingual-paragraph-pair-container space-y-6">
      {/* ── Quick Controls Bar for Paragraph Pairing ───────────────────────── */}
      <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10 text-xs">
        <div className="flex items-center gap-2 text-mist-cloud">
          <BookOpen className="w-4 h-4 text-antique-gold" />
          <span className="font-semibold text-warm-ivory dark:text-warm-ivory">
            Đối xứng song ngữ 1:1 ({articleData.paragraphs.length} cặp đoạn)
          </span>
        </div>

        {/* Mobile Accordion All-Toggle */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={handleToggleAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium border-antique-gold/30 text-antique-gold hover:bg-antique-gold/10 transition-colors"
          >
            {allExpanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{allExpanded ? 'Ẩn tất cả bản dịch' : 'Hiện tất cả bản dịch'}</span>
          </button>
        </div>
      </div>

      {/* ── List of 1:1 Paragraph Pairs ────────────────────────────────────── */}
      <div className="space-y-4 sm:space-y-6">
        {articleData.paragraphs.map((para, index) => {
          const isActive = activeParagraphIndex === index;
          const isExpanded = expandedTranslations[index] || false;
          const startTimestamp = para.audioTimestampStart ?? 0;

          return (
            <div
              key={para.id || index}
              id={`paragraph-pair-${index}`}
              className={`paragraph-pair-row rounded-2xl transition-all duration-300 border ${
                isActive
                  ? isDark
                    ? 'bg-[#1C2824] border-antique-gold ring-1 ring-antique-gold/40 shadow-lg'
                    : 'bg-[#F9F5EB] border-antique-gold ring-1 ring-antique-gold/50 shadow-md'
                  : isDark
                  ? 'bg-[#18211E]/80 border-white/5 hover:border-antique-gold/20'
                  : 'bg-[#FAF7EF]/90 border-black/8 hover:border-antique-gold/30'
              } p-4 sm:p-6`}
            >
              {/* Paragraph Metadata Header Bar */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-antique-gold text-[#123047]'
                        : isDark
                        ? 'bg-white/10 text-mist-cloud'
                        : 'bg-black/5 text-[#526C78]'
                    }`}
                  >
                    #{index + 1}
                  </span>

                  {isActive && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Đang phát</span>
                    </span>
                  )}
                </div>

                {onPlayParagraphAudio && (
                  <button
                    type="button"
                    onClick={() => onPlayParagraphAudio(index, startTimestamp)}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-antique-gold/30 text-antique-gold hover:bg-antique-gold/15 transition-all active:scale-95 cursor-pointer"
                    title={`Nghe đoạn này (${Math.floor(startTimestamp)}s)`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span className="hidden sm:inline">Nghe đoạn</span>
                  </button>
                )}
              </div>

              {/* Desktop: 2-Column Side-by-Side Split View (>= 1024px) */}
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 items-start">
                {/* Left Column: English Original */}
                <div
                  className="english-paragraph-col pr-4 border-r border-black/8 dark:border-white/8 select-text"
                  onMouseUp={onMouseUpText}
                  onDoubleClick={onDoubleClickText}
                >
                  <p
                    className="font-serif leading-[1.8] text-justify transition-all"
                    style={{ fontSize: `${fontSize}px` }}
                    lang="en"
                  >
                    {renderEnglishWithVocab(para.enText)}
                  </p>
                </div>

                {/* Right Column: Vietnamese Supporting Translation */}
                <div className="vietnamese-paragraph-col pl-2 select-text">
                  <p
                    className={`font-sans leading-[1.75] text-justify transition-all ${
                      isDark ? 'text-mist-cloud/85' : 'text-[#4A5568]'
                    }`}
                    style={{ fontSize: `${Math.max(14, fontSize - 1)}px` }}
                    lang="vi"
                  >
                    {para.viText}
                  </p>
                </div>
              </div>

              {/* Mobile: Stacked Card View (< 1024px) */}
              <div className="lg:hidden space-y-3">
                {/* English Content First */}
                <div
                  className="select-text"
                  onMouseUp={onMouseUpText}
                  onDoubleClick={onDoubleClickText}
                >
                  <p
                    className="font-serif leading-[1.75] text-left transition-all"
                    style={{ fontSize: `${fontSize}px` }}
                    lang="en"
                  >
                    {renderEnglishWithVocab(para.enText)}
                  </p>
                </div>

                {/* Accordion Toggle Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => toggleTranslation(index)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer bg-antique-gold/10 border-antique-gold/25 text-antique-gold hover:bg-antique-gold/20"
                    aria-expanded={isExpanded}
                    aria-controls={`vi-accordion-${index}`}
                  >
                    {isExpanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isExpanded ? 'Ẩn bản dịch tiếng Việt' : '👁️ Xem bản dịch tiếng Việt'}</span>
                  </button>
                </div>

                {/* Accordion Vietnamese Content */}
                {isExpanded && (
                  <div
                    id={`vi-accordion-${index}`}
                    className={`p-3.5 rounded-xl border text-sm leading-relaxed animate-in fade-in slide-in-from-top-1 ${
                      isDark
                        ? 'bg-black/25 border-antique-gold/20 text-mist-cloud/90'
                        : 'bg-[#F2ECE1]/80 border-heritage-green/10 text-[#4A5568]'
                    }`}
                    lang="vi"
                  >
                    <p>{para.viText}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
