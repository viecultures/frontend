import { Search, CalendarDays, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DictionaryDailyHeroProps {
  searchQuery: string;
  onChangeSearch: (query: string) => void;
}

export function DictionaryDailyHero({ searchQuery, onChangeSearch }: DictionaryDailyHeroProps) {
  const { t, i18n } = useTranslation('flashcards');
  const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-GB';

  return (
    <header className="vocab-page-heading">
      <div>
        <p className="vocab-eyebrow">{t('dictionary.hero_eyebrow', 'A LITTLE EACH DAY, A CLOSER LOOK AT VIETNAM')}</p>
        <h1>{t('dictionary.hero_title', 'Your vocabulary')} <span>{t('dictionary.hero_title_highlight', 'library')}</span></h1>
        <p className="vocab-description">{t('dictionary.hero_desc', 'Collect new words and discover more of Vietnamese culture.')}</p>
      </div>
      <div className="vocab-heading-tools">
        <span className="vocab-date">
          <CalendarDays size={15} />
          {new Date().toLocaleDateString(locale, { day: "numeric", month: "short", timeZone: "Asia/Ho_Chi_Minh" })}
        </span>
        <div className="vocab-search">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            aria-label={t('dictionary.search_input_aria', 'Search vocabulary decks')}
            value={searchQuery}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder={t('dictionary.search_decks_placeholder', 'Search vocabulary decks or topics…')}
          />
          {searchQuery && (
            <button
              type="button"
              aria-label={t('dictionary.clear_search', 'Clear search')}
              onClick={() => onChangeSearch("")}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
