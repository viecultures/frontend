import { Search, Calendar } from "lucide-react";

interface DictionaryDailyHeroProps {
  searchQuery: string;
  onChangeSearch: (query: string) => void;
}

export function DictionaryDailyHero({
  searchQuery,
  onChangeSearch,
}: DictionaryDailyHeroProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Title */}
      <div className="space-y-0.5 shrink-0">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#059669]">
          — HỌC TẬP MỖI NGÀY
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1E4B43]">
          Hôm nay học gì?
        </h1>
      </div>

      {/* Inline Search Bar & Date Badge */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#1E4B43]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="Tìm từ vựng hoặc thư mục bài đọc..."
            className="w-full pl-10 pr-9 py-2.5 rounded-full bg-white border-2 border-[rgba(30,75,67,0.18)] shadow-xs text-xs text-[#1E4B43] font-bold focus:outline-none focus:border-[#1E4B43] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onChangeSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6E7E79] hover:text-[#1E4B43] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <div className="text-xs font-bold text-[#6E7E79] bg-white px-3.5 py-2.5 rounded-full border border-[rgba(30,75,67,0.12)] flex items-center gap-1.5 shadow-xs shrink-0">
          <Calendar className="w-3.5 h-3.5 text-[#D9B76A]" />
          <span>
            Hôm nay,{" "}
            {new Date().toLocaleDateString("vi-VN", {
              day: "numeric",
              month: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
