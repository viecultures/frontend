import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { ArrowUpRight, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FEATURED_HOME_STORIES } from '../data/recommendationData';
import { PATHS, paths } from '@/routes/paths';

interface HomeRecommendationsProps {
  currentId?: string;
}

export function HomeRecommendations({ currentId }: HomeRecommendationsProps) {
  const { t, i18n } = useTranslation(['home', 'common']);
  const isVi = i18n.language === 'vi';

  const stories = FEATURED_HOME_STORIES
    .filter((item) => item.id !== currentId)
    .slice(0, 3);

  return (
    <section className="home-room-recommendations" aria-labelledby="home-stories-title">
      <div className="home-room-section-heading">
        <div>
          <p className="home-room-eyebrow">{t('recommendations.eyebrow', 'LET CURIOSITY LEAD')}</p>
          <h2 id="home-stories-title">{t('recommendations.title', 'Your next discovery')}</h2>
        </div>
        <Link className="home-room-link" to={PATHS.discovery}>
          {t('recommendations.all_stories', 'All stories')} <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="home-room-stories">
        {stories.map((story) => {
          const title = isVi ? story.titleVi : story.titleEn;
          const topicLabel = isVi ? story.categoryVi : story.category;
          const readTimeMinutes = parseInt(story.readTime, 10) || 3;

          return (
            <Link
              className="home-room-story home-room-panel"
              key={story.id}
              to={paths.reader({ postId: story.id, level: story.preferredLevel })}
            >
              <div className="home-room-story-image">
                <img src={story.imageUrl} alt="" loading="lazy" />
                <span>{topicLabel}</span>
              </div>
              <div className="home-room-story-copy">
                <h3>{title}</h3>
                <div>
                  <span>{story.preferredLevel}</span>
                  <span>
                    <Clock size={13} aria-hidden="true" />
                    {readTimeMinutes} {t('recommendations.min_read', 'min read')}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
