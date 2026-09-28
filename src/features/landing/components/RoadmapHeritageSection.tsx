import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Check,
  ShieldCheck,
  Headphones,
  Award
} from 'lucide-react';

export const RoadmapHeritageSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
    }
  };

  return (
    <footer className="relative bg-heritage-forest text-warm-ivory border-t border-antique-gold/30 overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-heritage-green/30 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

      {/* Main VIP Guidebook Enrollment Container */}
      <div className="py-16 sm:py-20 px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">

          {/* Badge Kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-heritage-dark/90 text-antique-bright border border-antique-gold/40 text-xs font-bold shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
            <span className="uppercase tracking-widest text-[11px] font-extrabold">
              QUÀ TẶNG ĐỘC QUYỀN HỌC VIÊN
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-warm-ivory">
              Sẵn Sàng Kể Câu Chuyện Quê Hương Bằng Tiếng Anh <span className="italic text-antique-bright font-serif">Đầy Kiêu Hãnh?</span>
            </h2>

            <p className="text-sm sm:text-base text-warm-ivory/80 font-normal max-w-2xl mx-auto leading-relaxed">
              Nhận trọn bộ cẩm nang <strong className="text-antique-bright font-bold">100 Cụm Từ Vựng Bất Khả Dịch Của Văn Hóa Việt Nam</strong> (kèm audio phát âm giọng bản xứ) hoàn toàn miễn phí.
            </p>
          </div>

          {/* Email Subscription Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
            {isSubmitted ? (
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full p-4 rounded-2xl bg-heritage-green/80 border border-antique-bright text-sm text-warm-ivory flex items-center justify-center gap-2 shadow-lg"
              >
                <Check className="w-5 h-5 text-antique-bright shrink-0" />
                <span className="font-medium">Cảm ơn bạn! Cẩm nang đang được gửi tới email của bạn.</span>
              </motion.div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Nhập email của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3.5 rounded-2xl bg-heritage-dark/90 border border-antique-gold/40 text-sm text-warm-ivory placeholder-warm-ivory/50 focus:outline-none focus-ring-dark shadow-inner"
                  aria-label="Địa chỉ email nhận cẩm nang"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-antique-bright via-antique-rich to-antique-gold text-heritage-forest font-bold text-sm hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shadow-md focus-ring-dark"
                >
                  Nhận Cẩm Nang Ngay
                </button>
              </div>
            )}
          </form>

          {/* Guarantee Badges Row */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-warm-ivory/70">
            <div className="flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-antique-bright shrink-0" />
              <span>Kèm file âm thanh phát âm bản xứ</span>
            </div>

            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-mist shrink-0" />
              <span>Bảo mật thông tin 100%</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Biên soạn bởi chuyên gia CEFR</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default RoadmapHeritageSection;
