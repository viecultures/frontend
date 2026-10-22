import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { paths, PATHS } from '@/routes/paths';
import type { ReadingBookmark } from '../lib/studyRoomStorage';

interface HomeContinueCardProps { bookmark?: ReadingBookmark; }

export function HomeContinueCard({ bookmark }: HomeContinueCardProps) {
  const position = Math.round((bookmark?.position || 0) * 100);
  return <section className="home-room-continue home-room-panel" aria-labelledby="home-continue-title">
    <div className="home-room-continue-copy">
      <p className="home-room-eyebrow"><BookOpen size={15} aria-hidden="true" />{bookmark ? 'PICK UP WHERE YOU LEFT OFF' : 'YOUR FIRST CHAPTER'}</p>
      <h2 id="home-continue-title">{bookmark ? bookmark.title : <>Every story opens<br />a new world.</>}</h2>
      <p>{bookmark ? 'Return to your story, with your reading position remembered.' : 'Start with the traditions of Tet. Read in English, explore the Vietnamese translation and save words along the way.'}</p>
      <div className="home-room-story-meta"><span>{bookmark?.level || 'Level 1'}</span><span>English · Vietnamese</span></div>
      {bookmark && <div className="home-room-reading-position">
        <div><span>Reading position</span><span>{position}%</span></div>
        <progress value={position} max={100} aria-label="Saved reading position" />
      </div>}
      <div className="home-room-continue-actions">
        <Link className="home-room-primary" to={paths.reader({ postId: bookmark?.id || 'tet-holiday', level: bookmark?.level || 'Level 1' })}>
          {bookmark ? 'Continue reading' : 'Start your first story'}<ArrowRight size={17} aria-hidden="true" />
        </Link>
        <Link className="home-room-link" to={PATHS.discovery}>Browse stories</Link>
      </div>
    </div>
    <div className="home-room-continue-image">
      <img src={bookmark?.image || '/images/landing/hoi-an-lanterns.jpg'} alt="" />
      <span>{bookmark?.topic || 'Traditions & everyday life'}</span>
    </div>
  </section>;
}
