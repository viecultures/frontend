import { Volume2, CheckCircle2, XCircle, RotateCw, Sparkles, BookOpen } from "lucide-react";
import type { Flashcard } from "@/data/flashcardsData";

interface FlashcardFlipViewProps {
  card: Flashcard;
  isFlipped: boolean;
  onToggleFlip: () => void;
  currentIndex: number;
  totalCards: number;
  onPlayAudio: (word?: string) => void;
  onReviewLater: () => void;
  onMastered: () => void;
}

export function FlashcardFlipView({
  card,
  isFlipped,
  onToggleFlip,
  currentIndex,
  totalCards,
  onPlayAudio,
  onReviewLater,
  onMastered,
}: FlashcardFlipViewProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full max-w-2xl mx-auto">
      {/* 3D Flip Card Container */}
      <div
        className="w-full h-[430px] [perspective:1400px] cursor-pointer group select-none"
        onClick={onToggleFlip}
        role="button"
        tabIndex={0}
        aria-label={
          isFlipped
            ? `Mặt sau: ${card.viMeaning}. Nhấp hoặc ấn Space để lật về mặt trước.`
            : `Mặt trước: ${card.word}. Nhấp hoặc ấn Space để lật xem nghĩa tiếng Việt.`
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleFlip();
          }
        }}
      >
        <div
          className={`relative w-full h-full duration-500 [transform-style:preserve-3d] transition-transform rounded-3xl ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* FRONT FACE (Tiếng Anh - Rich Warm Heritage Parchment) */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl bg-surface border-2 border-line group-hover:border-antique-gold/80 group-hover:shadow-2xl shadow-lg p-8 sm:p-10 flex flex-col justify-between text-center transition-all overflow-hidden">
            {/* Corner Ornaments */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-antique-gold/40 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-antique-gold/40 rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-antique-gold/40 rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-antique-gold/40 rounded-br-lg pointer-events-none" />

            {/* Header Badge & Counter */}
            <div className="flex items-center justify-between text-xs font-bold relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rice-paper text-heritage-green font-bold text-[11px] shadow-2xs border border-antique-gold/40">
                <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
                <span>Mặt Trước • English</span>
              </span>
              <span className="font-mono text-xs font-bold text-heritage-green bg-surface px-3 py-1 rounded-full border border-line shadow-2xs">
                Thẻ {currentIndex + 1} / {totalCards}
              </span>
            </div>

            {/* Main Word & Pronunciation */}
            <div className="my-auto space-y-4 relative z-10">
              <div className="flex items-center justify-center gap-3">
                <h3 className="font-serif text-4xl sm:text-5xl font-black text-heritage-green tracking-tight">
                  {card.word}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayAudio(card.word);
                  }}
                  className="p-3 rounded-full bg-antique-gold text-heritage-dark hover:bg-antique-bright hover:scale-110 transition-all cursor-pointer shadow-md focus-ring border border-warm-ivory"
                  title="Phát âm từ vựng (Pronounce)"
                  aria-label={`Phát âm từ ${card.word}`}
                >
                  <Volume2 className="w-5 h-5 text-heritage-dark" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-mono text-text-secondary">
                <span className="italic font-semibold text-text-secondary bg-rice-paper/60 px-3 py-1 rounded-full border border-line">
                  {card.ipa}
                </span>
                <span>•</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-[11px] uppercase shadow-2xs">
                  {card.pos}
                </span>
              </div>

              <p className="text-xs sm:text-sm italic text-text-body max-w-lg mx-auto bg-rice-paper/50 p-4 rounded-2xl border border-heritage-green/10 leading-relaxed shadow-xs">
                "{card.contextEn}"
              </p>
            </div>

            {/* Flip hint footer */}
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-text-secondary relative z-10">
              <RotateCw className="w-3.5 h-3.5 text-antique-gold" />
              <span>Nhấp vào thẻ hoặc ấn</span>
              <kbd className="px-2.5 py-1 rounded-md bg-heritage-green text-warm-ivory text-[11px] font-mono font-bold shadow-xs">
                Space
              </kbd>
              <span>để xem nghĩa</span>
            </div>
          </div>

          {/* BACK FACE (Nghĩa Tiếng Việt - Royal Emerald Imperial Canvas) */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl bg-gradient-to-br from-heritage-green via-heritage-dark to-heritage-forest text-warm-ivory border-2 border-antique-gold/80 shadow-2xl p-8 sm:p-10 flex flex-col justify-between text-center transition-all overflow-hidden">
            {/* Decorative Gold Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-antique-gold/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header Badge & Counter */}
            <div className="flex items-center justify-between text-xs font-bold relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-antique-gold text-heritage-dark font-extrabold text-[11px] shadow-sm border border-warm-ivory/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mặt Sau • Tiếng Việt</span>
              </span>
              <span className="font-mono text-xs font-bold text-sky-mist bg-warm-ivory/10 px-3 py-1 rounded-full border border-white/20">
                Thẻ {currentIndex + 1} / {totalCards}
              </span>
            </div>

            {/* Vietnamese Meaning & Definition */}
            <div className="my-auto space-y-4 relative z-10">
              <span className="text-xs font-mono text-sky-mist uppercase tracking-wider font-bold">
                {card.word} ({card.pos}) • {card.ipa}
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-antique-bright drop-shadow-md">
                {card.viMeaning}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-warm-ivory max-w-md mx-auto bg-warm-ivory/15 p-4 rounded-2xl border border-white/20 leading-relaxed shadow-inner backdrop-blur-xs">
                {card.viDefinition}
              </p>
            </div>

            {/* Flip hint footer */}
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-sky-mist relative z-10">
              <RotateCw className="w-3.5 h-3.5 text-antique-gold" />
              <span>Nhấp vào thẻ hoặc ấn</span>
              <kbd className="px-2.5 py-1 rounded-md bg-antique-gold text-heritage-dark text-[11px] font-mono font-bold shadow-xs">
                Space
              </kbd>
              <span>để quay lại</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom SRS Action Buttons */}
      <div className="grid grid-cols-2 gap-4 pt-1">
        <button
          onClick={onReviewLater}
          className="py-4 rounded-2xl bg-surface border-2 border-rose-300 text-rose-800 font-bold text-xs hover:bg-rose-50 hover:border-rose-400 hover:scale-[1.02] flex items-center justify-center gap-2.5 cursor-pointer shadow-sm transition-all focus-ring"
        >
          <XCircle className="w-5 h-5 text-rose-600" />
          <span>Cần ôn lại</span>
          <span className="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-900 text-xs font-mono font-black border border-rose-300">
            1
          </span>
        </button>

        <button
          onClick={onMastered}
          className="py-4 rounded-2xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory font-bold text-xs hover:scale-[1.02] flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:shadow-lg border border-antique-gold/40 transition-all focus-ring"
        >
          <CheckCircle2 className="w-5 h-5 text-antique-gold" />
          <span>Đã thuộc từ này</span>
          <span className="px-2.5 py-0.5 rounded-md bg-warm-ivory/20 text-warm-ivory text-xs font-mono font-black border border-white/30">
            2
          </span>
        </button>
      </div>
    </div>
  );
}
