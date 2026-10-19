import { Search, CalendarDays, X } from "lucide-react";

interface DictionaryDailyHeroProps {
  searchQuery: string;
  onChangeSearch: (query: string) => void;
}

export function DictionaryDailyHero({ searchQuery, onChangeSearch }: DictionaryDailyHeroProps) {
  return (
    <header className="vocab-page-heading">
      <div>
        <p className="vocab-eyebrow">A LITTLE EACH DAY, A CLOSER LOOK AT VIETNAM</p>
        <h1>Your vocabulary <span>library</span></h1>
        <p className="vocab-description">Collect new words and discover more of Vietnamese culture.</p>
      </div>
      <div className="vocab-heading-tools">
        <span className="vocab-date"><CalendarDays size={15} />{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Ho_Chi_Minh" })}</span>
        <div className="vocab-search">
          <Search size={18} aria-hidden="true" />
          <input type="search" aria-label="Search vocabulary decks" value={searchQuery} onChange={(e) => onChangeSearch(e.target.value)} placeholder="Search vocabulary decks or topics…" />
          {searchQuery && <button type="button" aria-label="Clear search" onClick={() => onChangeSearch("")}><X size={16} /></button>}
        </div>
      </div>
    </header>
  );
}
