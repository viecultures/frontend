import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { paths, PATHS } from '@/routes/paths';
import type { ReadingBookmark } from '../lib/studyRoomStorage';

interface HomeContinueCardProps { bookmark?: ReadingBookmark; }

export function HomeContinueCard({ bookmark }: HomeContinueCardProps) {
  const { t } = useTranslation('home');
  const position = Math.round((bookmark?.position || 0) * 100);

  return <section className="home-room-continue home-room-panel" aria-labelledby="home-continue-title">
    <div className="home-room-continue-copy">
      <p className="home-room-eyebrow">
        <BookOpen size={15} aria-hidden="true" />
        {bookmark ? t('continue_card.eyebrow_saved', 'PICK UP WHERE YOU LEFT OFF') : t('continue_card.eyebrow_new', 'YOUR FIRST CHAPTER')}
      </p>
      <h2 id="home-continue-title">
        {bookmark ? bookmark.title : t('continue_card.default_title', 'Every story opens a new world.')}
      </h2>
      <p>
        {bookmark
          ? t('continue_card.saved_desc', 'Return to your story, with your reading position remembered.')
          : t('continue_card.new_desc', 'Start with the traditions of Tet. Read in English, explore the Vietnamese translation and save words along the way.')}
      </p>
      <div className="home-room-story-meta">
        <span>{bookmark?.level || 'Level 1'}</span>
        <span>{t('continue_card.bilingual', 'English · Vietnamese')}</span>
      </div>
      {bookmark && <div className="home-room-reading-position">
        <div>
          <span>{t('continue_card.reading_position', 'Reading position')}</span>
          <span>{position}%</span>
        </div>
        <progress value={position} max={100} aria-label={t('continue_card.reading_position', 'Reading position')} />
      </div>}
      <div className="home-room-continue-actions">
        <Link className="home-room-primary" to={paths.reader({ postId: bookmark?.id || 'tet-holiday', level: bookmark?.level || 'Level 1' })}>
          {bookmark ? t('continue_card.btn_continue', 'Continue reading') : t('continue_card.btn_start', 'Start your first story')}
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
        <Link className="home-room-link" to={PATHS.discovery}>
          {t('continue_card.browse_stories', 'Browse stories')}
        </Link>
      </div>
    </div>
    <div className="home-room-continue-image">
      <img src={bookmark?.image || '/images/landing/hoi-an-lanterns.webp'} alt="" />
      <span>{bookmark?.topic || t('continue_card.default_topic', 'Traditions & everyday life')}</span>
    </div>
  </section>;
}
