import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, Volume2, VolumeX, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { CULTURAL_NUANCES } from '@/data/vietnamCultureData';
import { speakEnglish, stopSpeaking } from '@/utils/sampleSpeech';

export const CulturalNuanceExplorer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const categories = ['Tất cả', 'Ẩm thực (Cuisine)', 'Lối sống & Triết lý (Ethos)', 'Làng nghề (Crafts)', 'Lễ hội & Tết (Festivals)'];

  const filteredItems = selectedCategory === 'Tất cả'
    ? CULTURAL_NUANCES
    : CULTURAL_NUANCES.filter((item) => item.category === selectedCategory);

  const activeItem = filteredItems[activeItemIndex] || filteredItems[0];

  const handlePlayAudio = (phrase: string) => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakEnglish(phrase, () => setIsPlayingAudio(false));
    }
  };

  return (
    <section
      id="giai-ma-ngu-canh"
      className="relative py-12 sm:py-16 px-4 sm:px-8 lg:px-12 bg-[#FBF7EE] dark:bg-[#102B26] text-[#1E4B43] dark:text-[#FBF7EE] transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Editorial Section Header */}
        <div className="space-y-3 max-w-3xl">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#6E9FA1] dark:text-[#9FCED8]">
            Bộ Giải Mã Khái Niệm Bất Khả Dịch
          </p>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-normal leading-[1.12] text-[#1E4B43] dark:text-[#FBF7EE]">
            Từ dịch máy ngô nghê đến diễn đạt bản sắc tinh tế.
          </h2>
          <p className="text-sm sm:text-base text-[#1E4B43]/80 dark:text-[#FBF7EE]/80 font-light leading-relaxed">
            Khám phá lý do vì sao Google Translate thường dịch sai tinh thần văn hoá Việt và cách người bản xứ diễn đạt những khái niệm như &ldquo;Đượm tình&rdquo;, &ldquo;Vị thanh&rdquo;, hay &ldquo;Tình làng nghĩa xóm&rdquo;.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setActiveItemIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1E4B43] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26] shadow-xs'
                  : 'bg-[#FAF6ED] dark:bg-[#143731] text-[#1E4B43] dark:text-[#FBF7EE] hover:bg-[#F6EEDC] border border-[#E8DFCB] dark:border-[#1E4B43]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Interactive Nuance Sandbox Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Concept Selector List */}
          <div className="lg:col-span-5 space-y-3">
            {filteredItems.map((item, idx) => {
              const isSelected = activeItem.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveItemIndex(idx)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAF6ED] dark:bg-[#143731] shadow-md border-2 border-[#1E4B43] dark:border-[#D9B76A] scale-[1.01]'
                      : 'hover:bg-[#FAF6ED] dark:hover:bg-[#143731]/60 border border-[#E8DFCB] dark:border-[#1E4B43] bg-[#FAF6ED]/60 dark:bg-[#143731]/30'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E9FA1] dark:text-[#9FCED8]">
                      {item.category}
                    </span>
                    <h3 className="font-display text-lg sm:text-xl font-normal text-[#1E4B43] dark:text-[#FBF7EE]">
                      {item.vietnameseTerm}
                    </h3>
                  </div>

                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md bg-[#EAF5F2] text-[#1E4B43] dark:bg-[#1E4B43] dark:text-[#D9B76A] border border-[#B8E0D7] dark:border-transparent">
                    {item.cefrLevel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Comparative Analysis Card (Single Elevation) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="p-6 sm:p-8 rounded-3xl bg-[#FAF6ED] dark:bg-[#143731] border-2 border-[#1E4B43] dark:border-[#D9B76A]/70 shadow-lg space-y-6"
              >
                {/* Header with Title & Level */}
                <div className="flex items-start justify-between gap-4 border-b border-[#E8DFCB] dark:border-[#1E4B43] pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#D9B76A]">
                      Khái niệm nghiên cứu
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-normal text-[#1E4B43] dark:text-[#FBF7EE]">
                      {activeItem.vietnameseTerm}
                    </h3>
                  </div>

                  <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-[#1E4B43] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26]">
                    Chuẩn {activeItem.cefrLevel}
                  </span>
                </div>

                {/* 1. Literal Translation (Bad AI / Word-by-word) */}
                <div className="p-4 rounded-2xl bg-[#FDF2F0] dark:bg-[#4A2624]/40 border border-[#F8D7DA] dark:border-[#7A3632]/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#C0392B] dark:text-[#E8B7B2] uppercase tracking-wide">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Dịch máy ngô nghê (Literal Translation):</span>
                  </div>
                  <div className="font-serif italic text-base text-[#1E4B43] dark:text-[#FBF7EE] pl-6">
                    &ldquo;{activeItem.literalTranslation}&rdquo;
                  </div>
                  <p className="text-xs text-[#1E4B43]/80 dark:text-[#FBF7EE]/80 pl-6 leading-relaxed">
                    <strong>Tại sao không nên dùng:</strong> {activeItem.whyLiteralFails}
                  </p>
                </div>

                {/* 2. Nuanced English Expression (Hero Solution) */}
                <div className="p-5 rounded-2xl bg-[#EAF5F2] dark:bg-[#1C4B43]/50 border-2 border-[#B8E0D7] dark:border-[#D9B76A]/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1E4B43] dark:text-[#D9B76A] uppercase tracking-wide flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1E4B43] dark:text-[#D9B76A]" />
                      <span>Diễn đạt bản sắc tinh tế (Eloquent Nuance):</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handlePlayAudio(activeItem.nuancedEnglishPhrase)}
                      className="p-1.5 rounded-lg bg-[#1E4B43] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26] hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5 text-xs px-2.5 shadow-xs"
                    >
                      {isPlayingAudio ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Dừng</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-[#D9B76A] dark:text-[#102B26]" />
                          <span>Nghe phát âm</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="font-display text-lg sm:text-xl text-[#1E4B43] dark:text-[#FBF7EE] leading-snug">
                    {activeItem.nuancedEnglishPhrase}
                  </div>

                  <div className="text-xs font-mono text-[#6E9FA1] dark:text-[#9FCED8]">
                    IPA: {activeItem.ipa}
                  </div>
                </div>

                {/* 3. Sample Context Usage */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1E4B43] dark:text-[#D9B76A] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D9B76A]" />
                    <span>Ứng dụng trong câu giao tiếp / thuyết trình:</span>
                  </span>
                  <p className="text-sm font-serif italic text-[#1E4B43] dark:text-[#FBF7EE] bg-[#FAF6ED] dark:bg-[#102B26]/60 p-4 rounded-xl border border-[#E8DFCB] dark:border-[#1E4B43] leading-relaxed">
                    &ldquo;{activeItem.contextUsage}&rdquo;
                  </p>
                </div>

                {/* 4. Cultural Story Insight */}
                <div className="text-xs text-[#1E4B43]/85 dark:text-[#FBF7EE]/80 pt-2 border-t border-[#E8DFCB] dark:border-[#1E4B43] leading-relaxed">
                  <strong className="text-[#D9B76A]">Chiều sâu văn hoá:</strong> {activeItem.culturalStory}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
