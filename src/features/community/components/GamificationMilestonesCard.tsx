import { Award, Coins, CheckCircle2, CircleDashed, PenTool, Heart, Flame, Medal } from "lucide-react";

export function GamificationMilestonesCard() {
  return (
    <div className="p-6 rounded-3xl bg-surface border border-line space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-line">
        <h3 className="font-serif text-base font-bold text-heritage-green flex items-center gap-2">
          <Award className="w-4 h-4 text-antique-gold" />
          <span>Nhiệm Vụ Tích Xu Tuần</span>
        </h3>
        <span className="text-xs font-semibold text-text-secondary">Tiến độ: 1/3</span>
      </div>

      <ul className="text-xs space-y-3.5">
        <li className="p-3 rounded-2xl bg-rice-paper/50 border border-line space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-heritage-green flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Gửi 1 bài theo chủ đề tuần</span>
            </span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <Coins className="w-3 h-3 text-antique-gold" />
              <span>+100 Xu</span>
            </span>
          </div>
          <div className="w-full bg-line rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full w-full" />
          </div>
        </li>

        <li className="p-3 rounded-2xl bg-rice-paper/50 border border-line space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-heritage-green flex items-center gap-1.5">
              <CircleDashed className="w-4 h-4 text-antique-gold" />
              <span>Bài viết đạt 10+ lượt thích</span>
            </span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <Coins className="w-3 h-3 text-antique-gold" />
              <span>+150 Xu</span>
            </span>
          </div>
          <div className="w-full bg-line rounded-full h-1.5 overflow-hidden">
            <div className="bg-antique-gold h-full rounded-full w-3/5" />
          </div>
        </li>

        <li className="p-3 rounded-2xl bg-rice-paper/50 border border-line space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-heritage-green flex items-center gap-1.5">
              <CircleDashed className="w-4 h-4 text-antique-gold" />
              <span>Tham gia 4 tuần liên tiếp</span>
            </span>
            <span className="font-bold text-amber-700 flex items-center gap-1">
              <Medal className="w-3 h-3 text-amber-600" />
              <span>+500 Xu & Huy Hiệu</span>
            </span>
          </div>
          <div className="w-full bg-line rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-600 h-full rounded-full w-1/4" />
          </div>
        </li>
      </ul>
    </div>
  );
}
