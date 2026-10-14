import { Search, CalendarDays, X } from "lucide-react";

interface DictionaryDailyHeroProps {
  searchQuery: string;
  onChangeSearch: (query: string) => void;
}

export function DictionaryDailyHero({ searchQuery, onChangeSearch }: DictionaryDailyHeroProps) {
  return (
    <header className="vocab-page-heading">
      <div>
        <p className="vocab-eyebrow">MỖI NGÀY MỘT CHÚT, HIỂU VIỆT NAM HƠN</p>
        <h1>Kho từ vựng <span>của bạn</span></h1>
        <p className="vocab-description">Gom từng từ mới, mở thêm một góc văn hóa.</p>
      </div>
      <div className="vocab-heading-tools">
        <span className="vocab-date"><CalendarDays size={15} />{new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", timeZone: "Asia/Ho_Chi_Minh" })}</span>
        <div className="vocab-search">
          <Search size={18} aria-hidden="true" />
          <input type="search" aria-label="Tìm bộ từ vựng" value={searchQuery} onChange={(e) => onChangeSearch(e.target.value)} placeholder="Tìm bộ từ vựng, chủ đề…" />
          {searchQuery && <button type="button" aria-label="Xóa tìm kiếm" onClick={() => onChangeSearch("")}><X size={16} /></button>}
        </div>
      </div>
    </header>
  );
}
