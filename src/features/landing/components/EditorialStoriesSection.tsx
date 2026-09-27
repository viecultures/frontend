import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Volume2, VolumeX, Sparkles, Clock, User, ChevronRight } from 'lucide-react';
import { EDITORIAL_ARTICLES } from '@/data/vietnamCultureData';
import { speakEnglish } from '@/utils/sampleSpeech';

export const EditorialStoriesSection: React.FC = () => {
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<{
    term: string;
    definition: string;
    ipa: string;
    context: string;
  } | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const article = EDITORIAL_ARTICLES[activeArticleIndex] || EDITORIAL_ARTICLES[0];

  const handlePlayWordSpeech = (term: string) => {
    if (isPlayingAudio) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakEnglish(term, () => setIsPlayingAudio(false));
    }
  };

  return (
    <section
      id="tap-chi-di-san"
      className="relative py-12 sm:py-16 px-4 sm:px-8 lg:px-12 bg-[#FBF7EE] dark:bg-[#102B26] text-[#1E4B43] dark:text-[#FBF7EE] border-t border-[#E8DFCB] dark:border-[#1E4B43]/50 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="space-y-3 max-w-3xl">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#6E9FA1] dark:text-[#9FCED8]">
            Tạp Chí Báo Chí Quốc Tế & Ngữ Liệu Song Ngữ
          </p>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-normal leading-[1.12] text-[#1E4B43] dark:text-[#FBF7EE]">
            Đọc báo chí tinh hoa, chạm vào từng từ vựng để nghe và hiểu sâu.
          </h2>
          <p className="text-sm sm:text-base text-[#1E4B43]/80 dark:text-[#FBF7EE]/80 font-light leading-relaxed">
            Các chuyên đề báo chí được chắp bút bởi các dịch giả và học giả văn hoá, kết hợp giữa phong cách biên khảo phương Tây và tâm hồn phương Đông.
          </p>
        </div>

        {/* Article Switcher Pills / Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {EDITORIAL_ARTICLES.map((art, idx) => (
            <button
              key={art.id}
              type="button"
              onClick={() => {
                setActiveArticleIndex(idx);
                setSelectedWord(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeArticleIndex === idx
                  ? 'bg-[#1E4B43] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26] shadow-sm'
                  : 'bg-[#FAF6ED] dark:bg-[#143731] text-[#1E4B43] dark:text-[#FBF7EE] hover:bg-[#F6EEDC] border border-[#E8DFCB] dark:border-[#1E4B43]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{art.category}</span>
            </button>
          ))}
        </div>

        {/* Featured Editorial Article Container */}
        <div className="p-5 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl bg-[#FAF6ED] dark:bg-[#143731] border border-[#E8DFCB] dark:border-[#1E4B43] shadow-md space-y-6">
          {/* Article Header Meta */}
          <div className="space-y-4 border-b border-[#E8DFCB] dark:border-[#1E4B43] pb-6">
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#6E9FA1] dark:text-[#9FCED8]">
              <span className="font-semibold uppercase tracking-wider text-[#D9B76A]">
                {article.category}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {article.author}
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-4xl text-[#1E4B43] dark:text-[#FBF7EE] font-normal leading-tight">
              {article.title}
            </h3>

            <p className="text-base text-[#1E4B43]/80 dark:text-[#FBF7EE]/80 italic font-serif">
              {article.subtitle}
            </p>
          </div>

          {/* Article Body Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Story Paragraphs - Concise Preview */}
            <div className="lg:col-span-8 space-y-4">
              <div className="space-y-4 text-sm sm:text-base text-[#1E4B43]/90 dark:text-[#FBF7EE]/85 font-light leading-relaxed">
                {article.contentParagraphs.slice(0, 2).map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>

              {/* Call to Action Button to Full Article */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const event = new CustomEvent('app-navigate', { detail: '/bilingual-reader' });
                    window.dispatchEvent(event);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E4B43] hover:bg-[#163D37] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26] font-semibold text-xs sm:text-sm transition-all shadow-sm cursor-pointer group"
                >
                  <BookOpen className="w-4 h-4 text-[#D9B76A] dark:text-[#102B26]" />
                  <span>Đọc toàn bộ chuyên đề song ngữ &amp; Luyện đọc</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Interactive Sidebar: Key Terms Cards */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF6ED] dark:bg-[#102B26] border border-[#E8DFCB] dark:border-[#1E4B43] space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#E8DFCB] dark:border-[#1E4B43] pb-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#D9B76A] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Từ Vựng Báo Chí Cốt Lõi</span>
                  </span>
                  <span className="text-[11px] text-[#6E9FA1]">Nghe phát âm</span>
                </div>

                <div className="space-y-2">
                  {article.keyTerms.map((term) => {
                    const isSelected = selectedWord?.term === term.term;
                    return (
                      <div
                        key={term.term}
                        onClick={() => setSelectedWord(isSelected ? null : term)}
                        className={`w-full p-3 rounded-xl transition-all text-xs cursor-pointer flex flex-col space-y-1.5 ${
                          isSelected
                            ? 'bg-[#EAF5F2] dark:bg-[#1C4B43] border border-[#B8E0D7] dark:border-[#D9B76A] shadow-xs'
                            : 'bg-[#F6EEDC]/60 dark:bg-[#143731] hover:bg-[#F6EEDC] border border-[#E8DFCB] dark:border-[#1E4B43]'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-[#1E4B43] dark:text-[#FBF7EE]">
                          <span className="text-xs">{term.term}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-[#6E9FA1]">{term.ipa}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayWordSpeech(term.term);
                              }}
                              className="p-1 rounded-md bg-[#1E4B43] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26] hover:opacity-90 transition-opacity"
                              title="Nghe phát âm"
                            >
                              <Volume2 className="w-3 h-3 text-[#D9B76A] dark:text-[#102B26]" />
                            </button>
                          </div>
                        </div>

                        <p className="text-[11px] text-[#1E4B43]/80 dark:text-[#FBF7EE]/75 leading-tight">
                          {term.definition}
                        </p>

                        {isSelected && (
                          <div className="text-[11px] text-[#1E4B43]/85 dark:text-[#FBF7EE]/85 italic border-t border-[#1E4B43]/10 dark:border-white/10 pt-1.5 font-serif">
                            Ngữ cảnh: &ldquo;{term.context}&rdquo;
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
