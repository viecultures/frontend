import { ShieldCheck, Award } from "lucide-react";
import Link from "@/components/Link";

export function CommunitySidebar() {
  return (
    <aside className="hidden md:block md:col-span-4 space-y-6">
      {/* Guidelines Card */}
      <div className="p-6 rounded-3xl bg-rice-paper border border-line space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck
            className="w-5 h-5 text-heritage-green"
            aria-hidden="true"
          />
          <h3 className="font-serif text-base font-bold text-heritage-green">
            Quy Tắc Cộng Đồng VieCultures
          </h3>
        </div>
        <ul className="text-xs text-text-body space-y-2.5 list-disc list-inside leading-relaxed">
          <li>
            Tự do diễn đạt suy nghĩ bằng tiếng Anh mà không sợ lỗi ngữ pháp.
          </li>
          <li>
            Tôn trọng sự đa dạng văn hóa và góc nhìn cá nhân của các học viên
            khác.
          </li>
          <li>
            Khuyến khích thực hành sử dụng các từ vựng mới học vào ngữ cảnh bài
            viết.
          </li>
        </ul>
      </div>

      {/* Contest Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-heritage-green via-[#2A665B] to-heritage-dark text-warm-ivory border border-antique-gold/40 space-y-4 shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-antique-gold text-heritage-dark text-[11px] font-bold uppercase">
          <Award className="w-3.5 h-3.5" aria-hidden="true" />
          Community 2
        </div>
        <h3 className="font-serif text-lg font-bold text-warm-ivory leading-snug">
          Thử Thách Viết Theo Chủ Đề Tuần & Tích Xu 💎
        </h3>
        <p className="text-xs text-sky-mist leading-relaxed">
          Tham gia viết bài theo chủ đề tuần để tích lũy Xu Văn Hóa 💎 và đổi
          các phần thưởng độc quyền trong Cửa Hàng!
        </p>
        <Link
          href="/community-2"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-heritage-dark bg-warm-ivory hover:bg-rice-paper border border-antique-gold shadow-sm transition-all w-full focus-ring"
        >
          <span>Xem Thử Thách Tuần (Contest Hub)</span>
        </Link>
      </div>
    </aside>
  );
}
