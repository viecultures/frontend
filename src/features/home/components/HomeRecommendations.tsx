import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock } from 'lucide-react';
import { LESSONS_DATA } from '@/data/discoveryData';
import { ENGLISH_EDITORIAL, LOCAL_EDITORIAL, TOPIC_LABELS } from '@/features/discovery/lib/editorial';
import { PATHS, paths } from '@/routes/paths';

interface HomeRecommendationsProps { currentId?: string; }

export function HomeRecommendations({ currentId }: HomeRecommendationsProps) {
  const stories = ['imperial-hue', 'hoi-an-lanterns', 'dong-ho-paintings', 'bat-trang-pottery']
    .filter(id => id !== currentId).slice(0, 3)
    .flatMap(id => {
      const lesson = LESSONS_DATA.find(item => item.id === id);
      return lesson ? [lesson] : [];
    });
  return <section className="home-room-recommendations" aria-labelledby="home-stories-title">
    <div className="home-room-section-heading"><div><p className="home-room-eyebrow">LET CURIOSITY LEAD</p><h2 id="home-stories-title">Your next discovery</h2></div><Link className="home-room-link" to={PATHS.discovery}>All stories <ArrowUpRight size={16} /></Link></div>
    <div className="home-room-stories">
      {stories.map(story => <Link className="home-room-story home-room-panel" key={story.id} to={paths.reader({ postId: story.id, level: 'Level 1' })}>
        <div className="home-room-story-image"><img src={LOCAL_EDITORIAL[story.id]?.image || story.imageUrl} alt="" loading="lazy" /><span>{TOPIC_LABELS[story.category] || story.category}</span></div>
        <div className="home-room-story-copy"><h3>{ENGLISH_EDITORIAL[story.id]?.title || story.title}</h3><div><span>Level 1</span><span><Clock size={13} aria-hidden="true" />{story.levelDetails['Level 1'].readTime.replace('phút đọc', 'min read')}</span></div></div>
      </Link>)}
    </div>
  </section>;
}
