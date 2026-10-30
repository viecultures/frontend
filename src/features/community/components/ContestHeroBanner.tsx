import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Trophy, Coins, Medal, Clock, PenTool, ShoppingBag, Landmark } from "lucide-react";

interface ContestHeroBannerProps {
  onOpenForm: () => void;
}

export function ContestHeroBanner({ onOpenForm }: ContestHeroBannerProps) {
  const { t } = useTranslation("community");

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
    <section className="community-contest-hero mb-6 rounded-2xl bg-white border border-[#E8E2D5] shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* LEFT COLUMN (40% Width): Authentic Hue Imperial Photography */}
        <div className="lg:col-span-4 relative min-h-[180px] lg:min-h-[260px] bg-[#1D5046] overflow-hidden group">
          <img
            src="/images/landing/hue-citadel.webp"
            alt="Hue Imperial Citadel Gate"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />

          {/* Gradient & Frame */}
          <div className="absolute inset-0 bg-gradient-to-t from-heritage-dark/85 via-transparent to-black/30" />

          {/* Top Label Tag */}
          <div className="absolute top-5 left-5 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1D5046] text-white text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5 text-antique-rich fill-current" />
              <span>{t("community.contest.hero_week_tag")}</span>
            </span>
          </div>

          {/* Location Caption on Image */}
          <div className="absolute bottom-5 left-5 z-10">
            <span className="text-xs font-semibold text-white bg-[#1D5046]/90 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-antique-gold" />
              <span>{t("community.contest.hero_location")}</span>
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN (60% Width): Editorial Typography, Bold High-Contrast Clock & Actions */}
        <div className="lg:col-span-8 p-5 sm:p-6 flex flex-col justify-between space-y-3.5">
          {/* Top Header Row with PROMINENT Countdown Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E2D5]">
            <span className="inline-flex items-center gap-1.5 text-[#1D5046] text-xs font-semibold w-fit">
              <Landmark className="w-3.5 h-3.5 text-antique-rich" />
              <span>{t("community.contest.hero_spotlight")}</span>
            </span>

            {/* HIGH-CONTRAST GOLD/DARK COUNTDOWN BADGE */}
            <div className="community-countdown inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF7F0] text-[#314F49] border border-[#E8E2D5] w-fit self-start sm:self-auto">
              <div className="flex items-center gap-1 text-xs font-semibold text-[#6E7B75]">
                <Clock className="w-3.5 h-3.5" />
                <span>{t("community.contest.hero_timer_label")}</span>
              </div>

              {/* Digital Bold Timer Numbers */}
              <div className="flex items-center gap-1 font-mono text-xs font-bold">
                <div className="flex items-baseline gap-0.5">
                  <span>{String(timeLeft.days).padStart(2, "0")}</span><span>d</span>
                </div>
                <span>:</span>
                <div className="flex items-baseline gap-0.5">
                  <span>{String(timeLeft.hours).padStart(2, "0")}</span><span>h</span>
                </div>
                <span>:</span>
                <div className="flex items-baseline gap-0.5">
                  <span>{String(timeLeft.minutes).padStart(2, "0")}</span><span>m</span>
                </div>
                <span>:</span>
                <div className="flex items-baseline gap-0.5">
                  <span>{String(timeLeft.seconds).padStart(2, "0")}</span><span>s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1D5046] leading-snug">
              {t("community.contest.hero_title")}
            </h2>
            <p className="text-xs sm:text-sm text-[#6E7B75]">
              {t("community.contest.hero_subtitle")}
            </p>
          </div>

          {/* Prompt & Required Vocab Box */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-2.5">
            <p className="text-xs sm:text-sm text-text-body leading-relaxed">
              {t("community.contest.hero_prompt")}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-3 h-3 text-antique-gold" />
                <span>{t("community.contest.hero_suggested_vocab")}</span>
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
          <div className="space-y-3 pt-1">
            {/* Prize summary */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-antique-gold" />
                <span>{t("community.contest.hero_prize_enter")}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-antique-gold/20 text-heritage-green border border-antique-gold/40 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-antique-rich" />
                <span>{t("community.contest.hero_prize_first")}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1.5">
                <Medal className="w-3.5 h-3.5 text-rose-600" />
                <span>{t("community.contest.hero_prize_badge")}</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onOpenForm}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#1D5046] hover:bg-[#153D35] border border-[#1D5046] inline-flex items-center gap-2 transition-colors focus-ring cursor-pointer"
              >
                <PenTool className="w-4 h-4 text-antique-gold" />
                <span>{t("community.contest.hero_write_btn")}</span>
              </button>

              <a
                href="#gamification-shop"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#1D5046] bg-[#FAF7F0] hover:bg-white border border-[#E8E2D5] inline-flex items-center gap-1.5 transition-colors focus-ring"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-antique-gold" />
                <span>{t("community.contest.hero_shop_link")}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContestHeroBanner;
