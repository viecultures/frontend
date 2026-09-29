import { useState, useEffect } from "react";
import { Trophy, Coins, Gift, Medal, Clock, PenTool, ShoppingBag, Sparkles, Landmark, Flame } from "lucide-react";

interface ContestHeroBannerProps {
  onOpenForm: () => void;
}

export function ContestHeroBanner({ onOpenForm }: ContestHeroBannerProps) {
  // Live Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 28,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mb-10 rounded-3xl bg-surface border border-antique-gold/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* LEFT COLUMN (40% Width): Authentic Hue Imperial Photography */}
        <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-[360px] bg-heritage-green overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80"
            alt="Hue Imperial Citadel Gate"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.88]"
            loading="lazy"
          />

          {/* Gradient & Frame */}
          <div className="absolute inset-0 bg-gradient-to-t from-heritage-dark/85 via-transparent to-black/30" />
          <div className="absolute inset-3 border border-antique-gold/35 rounded-2xl pointer-events-none" />

          {/* Top Label Tag */}
          <div className="absolute top-5 left-5 z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-heritage-dark/90 text-antique-gold text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-antique-gold/50 shadow-md">
              <Trophy className="w-3.5 h-3.5 text-antique-rich fill-current" />
              <span>Thử Thách Tuần 14</span>
            </span>
          </div>

          {/* Location Caption on Image */}
          <div className="absolute bottom-5 left-5 z-10">
            <span className="text-xs font-serif font-bold text-warm-ivory bg-heritage-dark/80 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-antique-gold/30 shadow-sm flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-antique-gold" />
              <span>Cố Đô Huế • Ngọ Môn Hoàng Thành</span>
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN (60% Width): Editorial Typography, Bold High-Contrast Clock & Actions */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
          {/* Top Header Row with PROMINENT Countdown Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-antique-gold/15 text-heritage-green text-xs font-bold border border-antique-gold/30 w-fit">
              <Landmark className="w-3.5 h-3.5 text-antique-rich" />
              <span>Chủ Đề Di Sản Tiêu Điểm</span>
            </span>

            {/* HIGH-CONTRAST GOLD/DARK COUNTDOWN BADGE (Nổi bật, không chìm) */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-heritage-dark text-warm-ivory border-2 border-antique-gold/60 shadow-md w-fit self-start sm:self-auto">
              <div className="flex items-center gap-1.5 text-xs font-bold text-antique-gold">
                <Clock className="w-3.5 h-3.5 text-antique-gold" />
                <span className="uppercase tracking-wider text-[11px]">Hạn nộp:</span>
              </div>

              {/* Digital Bold Timer Numbers */}
              <div className="flex items-center gap-1 font-mono text-xs font-bold">
                <div className="bg-black/50 px-2 py-0.5 rounded border border-antique-gold/40 text-warm-ivory flex items-baseline gap-0.5">
                  <span className="text-sm font-bold text-antique-gold">{String(timeLeft.days).padStart(2, "0")}</span>
                  <span className="text-[9px] font-sans text-sky-mist">d</span>
                </div>
                <span className="text-antique-gold font-bold">:</span>
                <div className="bg-black/50 px-2 py-0.5 rounded border border-antique-gold/40 text-warm-ivory flex items-baseline gap-0.5">
                  <span className="text-sm font-bold text-antique-gold">{String(timeLeft.hours).padStart(2, "0")}</span>
                  <span className="text-[9px] font-sans text-sky-mist">h</span>
                </div>
                <span className="text-antique-gold font-bold">:</span>
                <div className="bg-black/50 px-2 py-0.5 rounded border border-antique-gold/40 text-warm-ivory flex items-baseline gap-0.5">
                  <span className="text-sm font-bold text-antique-gold">{String(timeLeft.minutes).padStart(2, "0")}</span>
                  <span className="text-[9px] font-sans text-sky-mist">m</span>
                </div>
                <span className="text-antique-gold font-bold">:</span>
                <div className="bg-black/50 px-2 py-0.5 rounded border border-antique-gold/40 text-warm-ivory flex items-baseline gap-0.5">
                  <span className="text-sm font-bold text-amber-300">{String(timeLeft.seconds).padStart(2, "0")}</span>
                  <span className="text-[9px] font-sans text-sky-mist">s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-green leading-snug">
              Kiến Trúc & Di Sản Cố Đô Huế
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary font-sans font-medium">
              Imperial Hue Architecture & Heritage Essay Challenge
            </p>
          </div>

          {/* Prompt & Required Vocab Box */}
          <div className="p-4 rounded-2xl bg-rice-paper/70 border border-line space-y-2.5">
            <p className="text-xs sm:text-sm text-text-body leading-relaxed">
              Viết bài chia sẻ ngắn (100–300 từ) bằng tiếng Anh về nét đẹp kiến trúc hoặc kỷ niệm của bạn tại Cố Đô Huế. Ứng dụng ít nhất 3 từ vựng di sản:
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-antique-gold" />
                <span>Từ khóa gợi ý:</span>
              </span>
              {["architectural", "intangible", "geomancy", "fortress"].map((word) => (
                <span
                  key={word}
                  className="px-2.5 py-0.5 rounded-md bg-surface text-heritage-green border border-antique-gold/40 text-xs font-semibold shadow-xs"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* Prize Row & Actions */}
          <div className="space-y-4 pt-1">
            {/* Prize summary */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-antique-gold" />
                <span>+100 Xu tham gia</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-antique-gold/20 text-heritage-green border border-antique-gold/40 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-antique-rich" />
                <span>+500 Xu Top 1</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1.5">
                <Medal className="w-3.5 h-3.5 text-rose-600" />
                <span>Huy hiệu Sứ Giả</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onOpenForm}
                className="px-6 py-3 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm border border-antique-gold/60 inline-flex items-center gap-2 transition-all focus-ring cursor-pointer"
              >
                <PenTool className="w-4 h-4 text-antique-gold" />
                <span>Viết Bài Dự Thi (+100 Xu)</span>
              </button>

              <a
                href="#gamification-shop"
                className="px-5 py-3 rounded-full text-xs font-semibold text-heritage-green bg-rice-paper hover:bg-mist-cloud border border-line inline-flex items-center gap-1.5 transition-all focus-ring"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-antique-gold" />
                <span>Cửa Hàng Đổi Quà</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
