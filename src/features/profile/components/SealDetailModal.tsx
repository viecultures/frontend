import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, BookOpen, Volume2, Calendar, MapPin, Sparkles, ArrowRight, Share2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS, paths } from '@/routes/paths';
import type { CulturalSeal } from '../types';

interface SealDetailModalProps {
  seal: CulturalSeal | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SealDetailModal: React.FC<SealDetailModalProps> = ({
  seal,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen || !seal) return null;

  const handleShareCertificate = () => {
    const text = `📜 CHỨNG NHẬN MỘC SON DI SẢN: ${seal.titleVi}\n🏛️ Vùng: ${seal.province} | Mã Mộc: ${seal.sealCode}\n📅 Ngày dập: ${seal.stampedAt || 'Hôm nay'}\n"${seal.quoteVi}"\n\nHọc tiếng Anh cùng văn hóa Việt tại: https://viecultures.com`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };


  const regionLabel =
    seal.region === 'north'
      ? 'Văn Hóa Bắc Bộ'
      : seal.region === 'central'
      ? 'Văn Hóa Miền Trung'
      : 'Văn Hóa Nam Bộ';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-[#FBF7EE] dark:bg-[#122A22] border-2 border-[#D9B76A] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#3F5550] dark:text-[#FBF7EE] z-10 overflow-hidden font-sans"
        >
          {/* Subtle Traditional Corner Embellishments */}
          <div className="absolute top-2 left-2 text-[#D9B76A]/40 text-xs font-serif select-none pointer-events-none">
            ❖ ─────
          </div>
          <div className="absolute top-2 right-12 text-[#D9B76A]/40 text-xs font-serif select-none pointer-events-none">
            ───── ❖
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Tag */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1E4B43]/10 dark:bg-[#D9B76A]/10 text-[#1E4B43] dark:text-[#D9B76A] border border-[#D9B76A]/40">
              <Award className="w-3.5 h-3.5" />
              <span>{regionLabel}</span>
            </span>
            <span className="text-xs font-mono text-stone-400 dark:text-stone-500">
              {seal.sealCode}
            </span>
          </div>

          {/* Authentic Mộc Son Seal Stamp Visual */}
          <div className="my-4 flex flex-col items-center justify-center">
            <div className="relative p-6 sm:p-8 rounded-full border-4 border-dashed border-[#9E2A2B]/80 bg-[#9E2A2B]/5 shadow-inner flex flex-col items-center justify-center text-center max-w-[240px] aspect-square transition-transform hover:rotate-1">
              {/* Outer Circular Ring with Vietnamese Seal Calligraphy */}
              <div className="text-3xl sm:text-4xl mb-1">{seal.badgeIcon}</div>
              <div className="font-serif font-black text-sm uppercase tracking-widest text-[#9E2A2B] leading-tight">
                MỘC SON BẢO CHỨNG
              </div>
              <div className="font-serif text-xs font-bold text-[#9E2A2B]/90 mt-0.5 line-clamp-1">
                {seal.province}
              </div>
              <div className="text-[10px] font-mono tracking-wider text-[#9E2A2B]/75 mt-1 border-t border-[#9E2A2B]/40 pt-1 w-full text-center">
                {seal.stampedAt ? `NGÀY: ${seal.stampedAt}` : 'CHƯA MỞ KHÓA'}
              </div>

              {/* Watermark Cinnabar Stamp Ring */}
              <div className="absolute inset-1.5 rounded-full border border-[#9E2A2B]/30 pointer-events-none" />
            </div>
          </div>

          {/* Title & Info */}
          <div className="text-center space-y-1.5 mt-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E4B43] dark:text-[#FBF7EE] leading-snug">
              {seal.titleVi}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-300 italic font-medium">
              "{seal.titleEn}"
            </p>
          </div>

          {/* Cultural Quote Box */}
          <div className="my-5 p-4 rounded-2xl bg-[#F6EEDC] dark:bg-[#1A3D34] border border-[#D9B76A]/40 text-xs sm:text-sm space-y-2">
            <div className="flex items-center gap-1.5 text-[#1E4B43] dark:text-[#D9B76A] font-bold text-xs uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#D9B76A]" />
              <span>Giai thoại & Chiêm nghiệm văn hóa</span>
            </div>
            <p className="font-serif text-stone-700 dark:text-stone-200 italic leading-relaxed">
              "{seal.quoteVi}"
            </p>
            <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed">
              {seal.quoteEn}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#D9B76A]/30 text-center text-xs">
            <div>
              <span className="block text-stone-400 dark:text-stone-400 uppercase tracking-wider text-[10px]">
                Từ vựng ngữ cảnh
              </span>
              <span className="font-serif font-bold text-base text-[#1E4B43] dark:text-[#D9B76A]">
                {seal.learnedWordsCount} từ học thuật
              </span>
            </div>
            <div>
              <span className="block text-stone-400 dark:text-stone-400 uppercase tracking-wider text-[10px]">
                Thời lượng bài đọc
              </span>
              <span className="font-serif font-bold text-base text-[#1E4B43] dark:text-[#D9B76A]">
                ~{seal.readingMinutes} phút đọc & nghe
              </span>
            </div>
          </div>

          {/* CTA Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
            <Link
              to={paths.reader({ postId: seal.postId })}
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1E4B43] hover:bg-[#163731] text-[#FBF7EE] text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer focus-ring"
            >
              <BookOpen className="w-4 h-4 text-[#D9B76A]" />
              <span>{seal.isUnlocked ? 'Đọc lại câu chuyện' : 'Chinh phục bài học ngay'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {seal.isUnlocked && (
              <button
                type="button"
                onClick={handleShareCertificate}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white dark:bg-white/10 hover:bg-stone-100 dark:hover:bg-white/20 border border-stone-300 dark:border-white/20 text-stone-700 dark:text-stone-200 text-xs sm:text-sm font-bold transition-all cursor-pointer"
                title="Sao chép chứng thư để chia sẻ"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Đã chép chứng thư!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-[#D9B76A]" />
                    <span>Chia sẻ Mộc</span>
                  </>
                )}
              </button>
            )}

            <Link
              to={paths.flashcardStudy({ deck: seal.postId })}
              onClick={onClose}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#F6EEDC] dark:bg-[#1E4B43]/50 hover:bg-[#D9B76A]/20 border border-[#D9B76A] text-[#1E4B43] dark:text-[#FBF7EE] text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <span>Ôn Flashcard</span>
            </Link>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
