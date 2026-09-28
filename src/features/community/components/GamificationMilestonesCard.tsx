import { Award } from "lucide-react";

export function GamificationMilestonesCard() {
  return (
    <div className="p-6 rounded-3xl bg-warm-ivory border border-heritage-green/12 space-y-4 shadow-sm">
      <h3 className="font-serif text-base font-bold text-heritage-green flex items-center gap-2">
        <Award className="w-4 h-4 text-antique-gold" />
        Nhiệm Vụ & Cột Mốc Tích Xu
      </h3>

      <ul className="text-xs space-y-3">
        <li className="flex items-center justify-between pb-2 border-b border-heritage-green/10">
          <span>✍️ Viết 1 bài theo chủ đề tuần</span>
          <strong className="text-[#059669]">+100 Xu 💎</strong>
        </li>
        <li className="flex items-center justify-between pb-2 border-b border-heritage-green/10">
          <span>❤️ Bài viết đạt 10+ lượt thích</span>
          <strong className="text-[#059669]">+150 Xu 💎</strong>
        </li>
        <li className="flex items-center justify-between">
          <span>🔥 Tham gia 4 tuần liên tiếp</span>
          <strong className="text-[#D97706]">+500 Xu & Badge 🎖️</strong>
        </li>
      </ul>
    </div>
  );
}
