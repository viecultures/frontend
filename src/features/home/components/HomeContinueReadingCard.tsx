import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen } from 'lucide-react';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { paths } from '@/routes/paths';
import { FEATURED_HOME_STORIES } from '../data/recommendationData';
import type { ReadingBookmark } from '../lib/studyRoomStorage';

interface HomeContinueReadingCardProps { bookmark?: ReadingBookmark; }

export function HomeContinueReadingCard({ bookmark }: HomeContinueReadingCardProps) {
  const { t, i18n } = useTranslation('home');
  const firstStory = FEATURED_HOME_STORIES[0];
  const storyId = bookmark?.id || firstStory?.id;
  const level = bookmark?.level || firstStory?.preferredLevel || 'Level 1';
  const title = bookmark?.title || (firstStory ? (i18n.language.startsWith('vi') ? firstStory.titleVi : firstStory.titleEn) : t('continue_card.default_title'));
  const image = bookmark?.image || firstStory?.imageUrl;
  const position = bookmark ? Math.min(100, Math.max(0, Math.round(bookmark.position * 100))) : 0;

  return <section className="home-continue-card" aria-labelledby="home-continue-title">
    <h2 id="home-continue-title"><BookOpen size={21} aria-hidden="true" />{t('quick.continue_title')}</h2>
    <div className="home-continue-body">
      {image && <img src={image} alt="" loading="lazy" />}
      <div className="home-continue-details">
        <p>{title}</p>
        {bookmark ? <div className="home-continue-progress"><div className="home-continue-track" role="progressbar" aria-label={t('continue_card.reading_position')} aria-valuenow={position} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${position}%` }} /></div><span>{position}%</span></div> : <span className="home-continue-empty">{t('quick.start_hint')}</span>}
      </div>
      {storyId && <Link to={paths.reader({ postId: storyId, level })} className="home-continue-action" aria-label={bookmark ? t('continue_card.btn_continue') : t('continue_card.btn_start')}><ArrowRight size={18} aria-hidden="true" /></Link>}
    </div>
  </section>;
}

export const HomeContinueCard = HomeContinueReadingCard;
