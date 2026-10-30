import { useState } from 'react';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { paths } from '@/routes/paths';
import type { ReadingBookmark } from '../lib/studyRoomStorage';

interface HomeContinueReadingCardProps {
  bookmark?: ReadingBookmark;
}

export function HomeContinueReadingCard({ bookmark }: HomeContinueReadingCardProps) {
  const { t } = useTranslation('home');
  const [imageError, setImageError] = useState(false);

  const hasHistory = Boolean(bookmark && bookmark.id);
  const position = Math.min(100, Math.max(0, Math.round((bookmark?.position || 0) * 100)));
  const isCompleted = position >= 100;

  const title = hasHistory
    ? bookmark!.title
    : t('continue_card.default_title', 'The little secrets of Hà Nội’s bún chả.');

  const description = hasHistory
    ? (bookmark!.topic || t('continue_card.saved_desc', 'Return to your story, with your reading position remembered.'))
    : t('continue_card.default_desc', 'Smoky grills, fresh herbs, and a story worth slowing down for.');

  const level = bookmark?.level || 'Level 1';
  const readMinutes = 5; // standard estimate for current chapter
  const topicLabel = bookmark?.topic || t('continue_card.default_topic', 'HÀ NỘI · FOOD & CULTURE');
  const imageUrl = bookmark?.image || '/images/landing/bun-cha.webp';

  const readerUrl = paths.reader({
    postId: bookmark?.id || 'bun-cha',
    level,
  });

  return (
    <section className="home-hero-card" aria-labelledby="home-continue-title">
      <div className="home-hero-copy">
        <span className="home-eyebrow">
          {hasHistory
            ? t('continue_card.eyebrow_saved', 'CONTINUE YOUR STORY')
            : t('continue_card.eyebrow_new', 'YOUR FIRST CHAPTER')}
        </span>

        <h2 id="home-continue-title" className="home-hero-title">
          {title}
        </h2>

        <p className="home-hero-desc">{description}</p>

        <div className="home-hero-meta">
          <span className="home-hero-level">{level}</span>
          <span className="home-hero-time">{t('continue_card.read_time', { count: readMinutes, defaultValue: `${readMinutes} min read` })}</span>
          <span className="home-hero-percent">
            {t('continue_card.read_percent', { count: position, defaultValue: `· ${position}% read` })}
          </span>
        </div>

        <div className="home-hero-progress-track" role="progressbar" aria-valuenow={position} aria-valuemin={0} aria-valuemax={100} aria-label={t('continue_card.reading_position', 'Reading position')}>
          <div className="home-hero-progress-fill" style={{ width: `${position}%` }} />
        </div>

        <Link className="home-primary-btn" to={readerUrl}>
          <span>
            {isCompleted
              ? t('continue_card.btn_read_again', 'Read the story again')
              : hasHistory
                ? t('continue_card.btn_continue', 'Continue reading')
                : t('continue_card.btn_start', 'Start your first story')}
          </span>
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>

      <div className="home-hero-art">
        {imageError ? (
          <div className="home-hero-art-placeholder">
            <BookOpen size={48} className="home-placeholder-icon" aria-hidden="true" />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={title}
            className="home-hero-art-img"
            onError={() => setImageError(true)}
            loading="eager"
          />
        )}
        <span className="home-hero-art-tag">{topicLabel}</span>
      </div>
    </section>
  );
}

// Backward-compatibility export
export const HomeContinueCard = HomeContinueReadingCard;
