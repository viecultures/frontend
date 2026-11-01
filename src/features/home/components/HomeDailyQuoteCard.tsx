import { useState } from 'react';
import { Maximize2, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DailyQuoteDialog } from './DailyQuoteDialog';

interface HomeDailyQuoteCardProps {
  imageUrl?: string;
  quoteVi?: string;
  author?: string;
  creator?: string;
}

export function HomeDailyQuoteCard({
  imageUrl = '/images/calendar/heritage-saigon.webp',
  quoteVi = 'Không có gì quý hơn độc lập, tự do.',
  author = 'Hồ Chí Minh',
  creator = 'VieCultures Daily',
}: HomeDailyQuoteCardProps) {
  const { t } = useTranslation('home');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <section className="home-daily-quote-card" aria-label={t('daily_quote.title', 'Daily Quote')}>
        {/* Binder rings on top edge */}
        <span className="home-binder b1" aria-hidden="true" />
        <span className="home-binder b2" aria-hidden="true" />
        <span className="home-binder b3" aria-hidden="true" />

        {/* Card header */}
        <div className="home-daily-heading">
          <div>
            <h2 className="home-daily-title">{t('daily_quote.title', 'Daily Quote')}</h2>
            <p className="home-daily-subtitle">
              {t('daily_quote.created_by', 'Created by')}{' '}
              <b>{creator}</b>
            </p>
          </div>
          <button
            type="button"
            className="home-daily-expand-btn"
            onClick={() => setIsDialogOpen(true)}
            aria-label={t('daily_quote.expand_title', 'View larger')}
            title={t('daily_quote.expand_title', 'View larger')}
          >
            <Maximize2 size={14} aria-hidden="true" />
          </button>
        </div>

        {/* Illustrated artwork button */}
        <button
          type="button"
          className="home-daily-image-btn"
          onClick={() => setIsDialogOpen(true)}
          aria-label={`${t('daily_quote.explore_story', 'Explore the story behind')}: ${quoteVi}`}
        >
          <div className="home-daily-image-container">
            <img
              src={imageUrl}
              alt={`${author} - ${quoteVi}`}
              className="home-daily-image-asset"
              loading="lazy"
            />
          </div>
        </button>

        {/* Card footer */}
        <div className="home-daily-bottom">
          <button
            type="button"
            className="home-daily-explore-link"
            onClick={() => setIsDialogOpen(true)}
          >
            <span>{t('daily_quote.explore_story', 'Explore the story behind')}</span>
            <ArrowUpRight size={12} aria-hidden="true" />
          </button>
          <span className="home-daily-page-pill">
            {t('daily_quote.page_index', { current: '01', total: '01', defaultValue: '01 / 01' })}
          </span>
        </div>
      </section>

      {/* Heritage Quote Dialog */}
      <DailyQuoteDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        imageUrl={imageUrl}
        quoteVi={quoteVi}
        author={author}
      />
    </>
  );
}

// Backward-compatibility export
export const HomeCalendarCard = HomeDailyQuoteCard;
