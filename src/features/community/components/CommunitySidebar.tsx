import { ShieldCheck, Trophy, Sparkles, TrendingUp, Award, ArrowRight, User } from "lucide-react";
import Link from "@/components/Link";

interface CommunitySidebarProps {
  onSelectTopicTag?: (tag: string) => void;
  selectedTag?: string;
}

const TRENDING_TOPICS = [
  { tag: "Imperial Hue", count: 42, label: "#ImperialHue" },
  { tag: "Saigon Bánh Mì", count: 35, label: "#SaigonBanhMi" },
  { tag: "Hội An Lanterns", count: 29, label: "#HoiAnLanterns" },
  { tag: "Bát Tràng Pottery", count: 18, label: "#BatTrang" },
  { tag: "Egg Coffee", count: 24, label: "#EggCoffee" },
];

const TOP_AMBASSADORS = [
  { name: "Trần Thanh Thảo", role: "Sứ Giả Cố Đô", points: "1,450 XP", initials: "TT" },
  { name: "Daniel Krauss", role: "Global Learner", points: "1,120 XP", initials: "DK" },
  { name: "Lê Thu Hà", role: "Sứ Giả Hội An", points: "980 XP", initials: "TH" },
];

export function CommunitySidebar({ onSelectTopicTag, selectedTag }: CommunitySidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Contest Banner Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-heritage-green via-[#2A665B] to-heritage-dark text-warm-ivory border border-antique-gold/40 space-y-4 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-antique-gold/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-antique-gold text-heritage-dark text-[11px] font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5" />
          <span>Thử Thách Tuần Này</span>
        </div>

        <h3 className="font-serif text-lg font-bold text-warm-ivory leading-snug">
          Kiến Trúc & Di Sản Cố Đô Huế (Imperial Hue)
        </h3>

        <p className="text-xs text-sky-mist leading-relaxed">
          Viết bài chia sẻ ngắn ứng dụng từ vựng di sản để tích lũy Xu Văn Hóa và vinh danh trên Bảng Xếp Hạng.
        </p>

        <Link
          href="/community-2"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-heritage-dark bg-warm-ivory hover:bg-rice-paper border border-antique-gold shadow-sm transition-all w-full focus-ring"
        >
          <span>Tham Gia Thử Thách Ngay</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Trending Cultural Topics */}
      <div className="p-6 rounded-3xl bg-surface border border-line shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-heritage-green flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-antique-gold" />
            <span>Chủ Đề Di Sản Sôi Nổi</span>
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {TRENDING_TOPICS.map((topic) => (
            <button
              key={topic.tag}
              onClick={() => onSelectTopicTag?.(topic.tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer focus-ring flex items-center gap-1.5 ${
                selectedTag === topic.tag
                  ? "bg-heritage-green text-warm-ivory shadow-sm"
                  : "bg-rice-paper text-heritage-green hover:bg-mist-cloud border border-line"
              }`}
            >
              <span>{topic.label}</span>
              <span className="text-[10px] opacity-70">({topic.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top Ambassadors Leaderboard Mini */}
      <div className="p-6 rounded-3xl bg-surface border border-line shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-line">
          <h3 className="font-serif text-base font-bold text-heritage-green flex items-center gap-2">
            <Award className="w-4 h-4 text-antique-gold" />
            <span>Sứ Giả Văn Hóa Tuần</span>
          </h3>
          <span className="text-[11px] font-bold text-antique-rich">Top 3</span>
        </div>

        <div className="space-y-3">
          {TOP_AMBASSADORS.map((amb, index) => (
            <div key={amb.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  index === 0 ? "bg-amber-100 text-amber-900 border border-amber-300" :
                  index === 1 ? "bg-slate-100 text-slate-700 border border-slate-300" :
                  "bg-orange-100 text-orange-900 border border-orange-300"
                }`}>
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-bold text-heritage-green">{amb.name}</h4>
                  <span className="text-[10px] text-text-secondary">{amb.role}</span>
                </div>
              </div>
              <span className="font-bold text-emerald-700 text-[11px]">{amb.points}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines Card */}
      <div className="p-6 rounded-3xl bg-rice-paper/70 border border-line space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck
            className="w-4 h-4 text-heritage-green"
            aria-hidden="true"
          />
          <h3 className="font-serif text-sm font-bold text-heritage-green">
            Quy Tắc Cộng Đồng VieCultures
          </h3>
        </div>
        <ul className="text-xs text-text-body space-y-2 list-disc list-inside leading-relaxed">
          <li>Tự do diễn đạt suy nghĩ bằng tiếng Anh không sợ sai ngữ pháp.</li>
          <li>Tôn trọng sự đa dạng văn hóa và góc nhìn đa chiều.</li>
          <li>Khuyến khích đưa từ vựng bài đọc vào ngữ cảnh tự nhiên.</li>
        </ul>
      </div>
    </aside>
  );
}
