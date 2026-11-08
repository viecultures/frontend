import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { DailyQuoteDialog } from './DailyQuoteDialog';
import { formatLunarString } from '@/utils/lunarCalendar';
import { getDailyQuoteForDate, type DailyQuoteItem } from '../data/dailyQuotesNovember';

interface HomeDailyQuoteCardProps {
  quote?: DailyQuoteItem;
  imageUrl?: string;
  quoteVi?: string;
  author?: string;
  creator?: string;
}

export function HomeDailyQuoteCard({
  quote,
  imageUrl,
  quoteVi,
  author,
  creator,
}: HomeDailyQuoteCardProps = {}) {
  const { t, i18n } = useTranslation('home');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const goToPrevDay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() - 1);
      return next;
    });
  };

  const goToNextDay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + 1);
      return next;
    });
  };

  const goToToday = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedDate(new Date());
  };

  // Lấy câu danh ngôn tự động cho ngày đang chọn
  const activeQuote = quote ?? getDailyQuoteForDate(selectedDate);

  const finalImageUrl = imageUrl ?? activeQuote.artworkUrl;
  const finalQuoteVi = quoteVi ?? activeQuote.quoteVi;
  const finalAuthor = author ?? activeQuote.author;
  const finalCreator = creator ?? activeQuote.creator;
  const locationLabel = activeQuote.locationName;

  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US';
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(selectedDate);
  const monthYear = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(selectedDate);
  const solarDay = String(selectedDate.getDate()).padStart(2, '0');
  const lunarStr = formatLunarString(selectedDate);

  return (
    <>
      <section className="home-daily-quote-card" aria-label={t('daily_quote.title')}>
        <span className="home-binder b1" aria-hidden="true" />
        <span className="home-binder b3" aria-hidden="true" />
        <div className="home-calendar-open-surface">
          <span className="home-calendar-scenery" aria-hidden="true">
            <img src={finalImageUrl} alt="" />
          </span>
          <button
            type="button"
            className="home-calendar-open-hitbox"
            onClick={() => setIsDialogOpen(true)}
            aria-label={t('daily_quote.expand_title')}
          />
          <span className="home-calendar-top">
            <span className="home-calendar-date">
              <span className="home-calendar-weekday-row">
                <button
                  type="button"
                  className="home-calendar-nav-arrow"
                  onClick={goToPrevDay}
                  aria-label={t('daily_quote.prev_day', 'Ngày trước')}
                  title={t('daily_quote.prev_day', 'Ngày trước')}
                >
                  <ChevronLeft size={14} aria-hidden="true" />
                </button>
                <span className="home-calendar-weekday">{weekday}</span>
                <button
                  type="button"
                  className="home-calendar-nav-arrow"
                  onClick={goToNextDay}
                  aria-label={t('daily_quote.next_day', 'Ngày sau')}
                  title={t('daily_quote.next_day', 'Ngày sau')}
                >
                  <ChevronRight size={14} aria-hidden="true" />
                </button>
              </span>
              {!isToday && (
                <button
                  type="button"
                  className="home-calendar-today-pill"
                  onClick={goToToday}
                  aria-label={t('daily_quote.back_to_today', 'Về hôm nay')}
                  title={t('daily_quote.back_to_today', 'Về hôm nay')}
                >
                  {t('daily_quote.today', 'Hôm nay')}
                </button>
              )}
              <strong>{solarDay}</strong>
              <span>{monthYear}</span>
            </span>
            <span className="home-calendar-details">
              <span>{t('quick.lunar')}: {lunarStr}</span>
              <span><MapPin size={16} aria-hidden="true" />{locationLabel}</span>
            </span>
          </span>
          <span className="home-calendar-quote">
            <span>“{finalQuoteVi}”</span>
            <cite>— {finalAuthor} —</cite>
          </span>
          <span className="home-calendar-expand">
            <ArrowUpRight size={19} aria-hidden="true" />
          </span>
        </div>
      </section>
      <DailyQuoteDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        quote={activeQuote}
        onPrevDay={goToPrevDay}
        onNextDay={goToNextDay}
        isToday={isToday}
        onToday={goToToday}
        imageUrl={finalImageUrl}
        quoteVi={finalQuoteVi}
        author={finalAuthor}
        creator={finalCreator}
      />
    </>
  );
}

export const HomeCalendarCard = HomeDailyQuoteCard;
