import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, ArrowDown, BookOpen, Compass, Sparkles } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import { speakEnglish } from '@/utils/sampleSpeech';

export const HeroSection: React.FC = () => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const sampleEnglishStory = 
    "Vietnam is not merely a war or a map coordinate; it is a four-thousand-year-old river of resilience, poetry, and shared bowls of fragrant broth under morning mist.";

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakEnglish(sampleEnglishStory, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  return (
    <section className="relative min-h-[92vh] pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-8 lg:px-12 flex flex-col justify-center overflow-hidden bg-[#FBF7EE] dark:bg-[#102B26] text-[#1E4B43] dark:text-[#FBF7EE] transition-colors duration-300">
      {/* Subtle Cultural Pattern Background Accent (60% Kem Sáng / 20% Xanh Trời) */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#BFE3EA] blur-3xl" />
        <div className="absolute bottom-10 -left-20 w-80 h-80 rounded-full bg-[#F6EEDC] dark:bg-[#1A423A] blur-2xl" />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10 space-y-12">
        {/* Editorial Sub-kicker without pill badge */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium tracking-wide text-[#6E9FA1] dark:text-[#9FCED8]">
          <span className="uppercase">EdTech Tiên Phong Về Ngôn Ngữ Di Sản</span>
          <span aria-hidden="true" className="text-[#D9B76A]">·</span>
          <span>CEFR B1 – C1 Cultural Mastery</span>
          <span aria-hidden="true" className="text-[#D9B76A]">·</span>
          <span>Bản đồ Di sản Tương tác</span>
        </div>

        {/* Hero Title & Mission Statement */}
        <div className="space-y-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-[#1E4B43] dark:text-[#FBF7EE]"
            style={{ textWrap: 'balance' }}
          >
            Kể câu chuyện Việt Nam với bạn bè quốc tế bằng tiếng Anh sâu sắc và tự hào.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="text-lg sm:text-xl text-[#1E4B43]/85 dark:text-[#FBF7EE]/80 font-light leading-relaxed max-w-3xl"
          >
            Thoát khỏi cách dịch từ-sang-từ khô cứng. Học cách chuyển tải triết lý âm dương trong ẩm thực, tình làng nghĩa xóm, và chiều sâu nghìn năm của tà áo lụa bằng ngôn ngữ học thuật, giàu hình ảnh và tự nhiên chuẩn bản xứ.
          </motion.p>
        </div>

        {/* Interactive Audio Pronunciation Preview Box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-5 sm:p-6 rounded-3xl bg-[#BFE3EA]/35 dark:bg-[#1E4B43]/30 border border-[#9FCED8]/60 dark:border-[#9FCED8]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
        >
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E4B43] dark:text-[#D9B76A]">
              <Sparkles className="w-3.5 h-3.5 text-[#D9B76A]" />
              <span>Thính phòng Di sản (Audio Sample)</span>
              <span className="text-[11px] text-[#6E9FA1] font-normal lowercase">(chạm để nghe phát âm mẫu)</span>
            </div>
            <p className="font-display italic text-base sm:text-lg text-[#1E4B43] dark:text-[#FBF7EE] leading-snug">
              &ldquo;{sampleEnglishStory}&rdquo;
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleAudio}
            className={`px-5 py-3 rounded-2xl flex items-center gap-2.5 font-medium text-sm transition-all duration-200 cursor-pointer shrink-0 shadow-xs ${
              isPlayingAudio
                ? 'bg-[#E8B7B2] text-[#1E4B43]'
                : 'bg-[#1E4B43] hover:bg-[#143731] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26] dark:hover:bg-[#c6a355]'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Đang đọc mẫu... (Dừng)</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#D9B76A] dark:text-[#102B26]" />
                <span>Nghe giọng đọc chuẩn bản xứ</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href="#ban-do-di-san"
            className="px-6 py-3.5 rounded-2xl bg-[#1E4B43] hover:bg-[#163832] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26] dark:hover:bg-[#c9a657] font-semibold text-sm sm:text-base flex items-center gap-2.5 shadow-md transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Khám phá Bản đồ Di sản</span>
          </a>

          <a
            href="#giai-ma-ngu-canh"
            className="px-6 py-3.5 rounded-2xl bg-[#F6EEDC] hover:bg-[#E8DFCB] dark:bg-[#1E4B43]/60 dark:hover:bg-[#1E4B43] text-[#1E4B43] dark:text-[#FBF7EE] font-semibold text-sm sm:text-base border border-[#D9B76A]/40 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#D9B76A]" />
            <span>Thử thách Giải mã Từ vựng</span>
          </a>
        </div>

        {/* Quantitative Rigor Stats Row */}
        <div className="pt-6 border-t border-[#E8DFCB] dark:border-[#1E4B43]/50 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="font-display text-3xl sm:text-4xl text-[#1E4B43] dark:text-[#FBF7EE] font-normal tabular-nums">
              <AnimatedNumber value={63} />
            </div>
            <p className="text-xs sm:text-sm text-[#6E9FA1] dark:text-[#9FCED8] font-medium pt-1">
              Tỉnh thành kết nối di sản
            </p>
          </div>

          <div>
            <div className="font-display text-3xl sm:text-4xl text-[#1E4B43] dark:text-[#FBF7EE] font-normal tabular-nums">
              <AnimatedNumber value={1200} />
              <span className="text-xl font-light text-[#D9B76A]">+</span>
            </div>
            <p className="text-xs sm:text-sm text-[#6E9FA1] dark:text-[#9FCED8] font-medium pt-1">
              Collocations bản sắc chuyên sâu
            </p>
          </div>

          <div>
            <div className="font-display text-3xl sm:text-4xl text-[#1E4B43] dark:text-[#FBF7EE] font-normal tabular-nums">
              <AnimatedNumber value={100} />
              <span className="text-xl font-light text-[#D9B76A]">%</span>
            </div>
            <p className="text-xs sm:text-sm text-[#6E9FA1] dark:text-[#9FCED8] font-medium pt-1">
              Phát âm giọng đọc chuẩn bản ngữ
            </p>
          </div>

          <div>
            <div className="font-display text-3xl sm:text-4xl text-[#1E4B43] dark:text-[#FBF7EE] font-normal tabular-nums">
              <AnimatedNumber value={98} />
              <span className="text-xl font-light text-[#D9B76A]">%</span>
            </div>
            <p className="text-xs sm:text-sm text-[#6E9FA1] dark:text-[#9FCED8] font-medium pt-1">
              Tự tin thuyết trình quốc tế
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
