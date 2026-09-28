import { Trophy } from "lucide-react";

interface ContestHeroBannerProps {
  onOpenForm: () => void;
}

export function ContestHeroBanner({ onOpenForm }: ContestHeroBannerProps) {
  return (
    <section className="mb-10 rounded-3xl bg-gradient-to-br from-[#16221F] via-heritage-green to-[#143630] text-warm-ivory p-8 sm:p-12 border-2 border-antique-gold/60 shadow-2xl relative overflow-hidden">
      {/* Subtle Background Particle Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-antique-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-4">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-antique-gold text-heritage-green text-xs font-bold uppercase tracking-wider shadow-sm">
          <Trophy className="w-3.5 h-3.5 fill-current" />
          Thử Thách Viết Theo Chủ Đề • Tuần 14/2026
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-warm-ivory">
          Chủ Đề Tuần Này: "Kiến Trúc & Di Sản Cố Đô Huế"
          <span className="block text-lg sm:text-xl font-normal text-sky-mist mt-1 font-sans">
            (Imperial Hue Architecture & Heritage Challenge)
          </span>
        </h1>

        <p className="text-sm sm:text-base text-rice-paper/90 leading-relaxed max-w-3xl">
          Viết bài viết ngắn (100 – 300 từ) bằng tiếng Anh chia sẻ góc nhìn hoặc
          kỷ niệm của bạn về di sản Huế, ứng dụng ít nhất 3 từ vựng vừa học để
          tích lũy <strong className="text-antique-gold">Xu Văn Hóa 💎</strong>{" "}
          và mở khóa tính năng độc quyền!
        </p>

        {/* Prize Pool & Timer Box */}
        <div className="p-5 rounded-2xl bg-warm-ivory/10 border border-antique-gold/40 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 my-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-antique-gold">
              🎁 Phần thưởng Gamification tuần này:
            </span>
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="px-3 py-1 rounded-full bg-warm-ivory/20 border border-white/20">
                💎 +100 Xu cho bài tham gia
              </span>
              <span className="px-3 py-1 rounded-full bg-antique-gold/30 border border-antique-gold/50 text-warm-ivory">
                💎 +500 Xu cho Top 3
              </span>
              <span className="px-3 py-1 rounded-full bg-[#E8B7B2]/30 border border-[#E8B7B2]/40 text-warm-ivory">
                🎖️ Huy hiệu "Sứ Giả Cố Đô"
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-mist block">
              ⏱️ Thời gian chủ đề:
            </span>
            <span className="text-sm font-bold text-warm-ivory">
              Còn 04 ngày để gửi bài & tích xu
            </span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={onOpenForm}
            className="px-7 py-3.5 rounded-full text-xs font-bold text-heritage-green bg-antique-gold hover:bg-[#c9a657] shadow-lg transition-all border border-warm-ivory/40 flex items-center gap-2 cursor-pointer focus-ring"
          >
            <span>✍️ + Viết Bài Tham Gia (Nhận ngay +100 Xu 💎)</span>
          </button>

          <a
            href="#gamification-shop"
            className="px-6 py-3.5 rounded-full text-xs font-bold text-warm-ivory bg-warm-ivory/10 hover:bg-warm-ivory/20 border border-white/30 transition-all flex items-center gap-2 focus-ring"
          >
            <span>🛍️ Đổi Xu Mở Khóa Chức Năng</span>
          </a>
        </div>
      </div>
    </section>
  );
}
