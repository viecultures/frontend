import { Sparkles, Compass, Plus, ArrowRight, Flame, BookOpen } from "lucide-react";

interface DictionaryQuickActionCardsProps {
  onGoToRecent: () => void;
  onExploreMore: () => void;
  onOpenCreateDeck: () => void;
}

export function DictionaryQuickActionCards({
  onGoToRecent,
  onExploreMore,
  onOpenCreateDeck,
}: DictionaryQuickActionCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
      {/* Card 1: Gần đây — Soft Mint / Emerald Theme */}
      <div className="relative p-6 rounded-3xl bg-surface border-2 border-emerald-600/30 shadow-sm hover:shadow-xl hover:border-emerald-600/60 hover:-translate-y-1 space-y-4 flex flex-col justify-between transition-all overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-xs border border-emerald-200 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-emerald-700" />
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs">
            <Flame className="w-3 h-3 text-rose-600" />
            <span>Đang học gần đây</span>
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            Huế • Kiến Trúc Hoàng Gia
          </span>
          <h3 className="font-serif text-lg font-bold text-heritage-green mt-0.5">
            Imperial Hue Architecture
          </h3>
          <p className="text-xs text-text-secondary font-medium mt-1">
            12 từ mới đang chờ bạn ôn tập hôm nay
          </p>
        </div>

        <button
          onClick={onGoToRecent}
          className="w-full py-3 rounded-2xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer border border-antique-gold/40 focus-ring"
        >
          <span>Tiếp tục học ngay</span>
          <ArrowRight className="w-3.5 h-3.5 text-antique-gold" />
        </button>
      </div>

      {/* Card 2: Khám phá thêm bộ — Warm Parchment / Amber Theme */}
      <div className="relative p-6 rounded-3xl bg-surface border-2 border-amber-400/30 shadow-sm hover:shadow-xl hover:border-amber-500/60 hover:-translate-y-1 space-y-4 flex flex-col justify-between transition-all overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shadow-xs border border-amber-200 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-amber-800" />
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs">
            <BookOpen className="w-3 h-3 text-amber-700" />
            <span>22+ Bộ thẻ có sẵn</span>
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
            Kho Tàng Di Sản Việt
          </span>
          <h3 className="font-serif text-lg font-bold text-heritage-green mt-0.5">
            Khám phá thêm bộ từ mới
          </h3>
          <p className="text-xs text-text-secondary font-medium mt-1 leading-relaxed">
            Lưu thêm bài đọc văn hóa 3 miền vào kệ từ điển cá nhân
          </p>
        </div>

        <button
          onClick={onExploreMore}
          className="w-full py-3 rounded-2xl bg-surface hover:bg-rice-paper text-heritage-green border-2 border-amber-500/40 text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer focus-ring"
        >
          <span>Xem danh mục các bộ thẻ</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 text-heritage-green inline" />
        </button>
      </div>

      {/* Card 3: Tạo bộ từ mới — Deep Heritage Green & Gold */}
      <div className="relative p-6 rounded-3xl bg-gradient-to-br from-heritage-green to-heritage-dark text-warm-ivory border-2 border-antique-gold/60 shadow-md hover:shadow-xl hover:-translate-y-1 space-y-4 flex flex-col justify-between transition-all overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-antique-gold/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-2xl bg-antique-gold text-heritage-dark flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
            <Plus className="w-6 h-6 text-heritage-dark" />
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-antique-gold/30 text-warm-ivory border border-antique-gold/50">
            <Sparkles className="w-3 h-3 text-antique-bright" />
            <span>Tự tạo cá nhân</span>
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-mist">
            Không Giới Hạn Từ Vựng
          </span>
          <h3 className="font-serif text-lg font-bold text-warm-ivory mt-0.5">
            Tạo bộ từ vựng của riêng bạn
          </h3>
          <p className="text-xs text-sky-mist font-medium mt-1 leading-relaxed">
            Tự nhập danh sách từ vựng cá nhân để luyện tập Spaced Repetition
          </p>
        </div>

        <button
          onClick={onOpenCreateDeck}
          className="w-full py-3 rounded-2xl bg-antique-gold hover:bg-antique-bright text-heritage-dark text-xs font-extrabold transition-all shadow-md hover:shadow-lg border border-warm-ivory/40 cursor-pointer focus-ring"
        >
          + Khởi tạo bộ từ ngay
        </button>
      </div>
    </div>
  );
}
