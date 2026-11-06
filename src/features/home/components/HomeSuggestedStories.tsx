import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { ArrowUpRight, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FEATURED_HOME_STORIES } from '../data/recommendationData';
import { PATHS, paths } from '@/routes/paths';

interface HomeSuggestedStoriesProps {
  currentId?: string;
}

export function HomeSuggestedStories({ currentId }: HomeSuggestedStoriesProps) {
  const { t, i18n } = useTranslation(['home', 'common']);
  const isVi = i18n.language === 'vi';

  // Pick 3 high-quality cultural stories excluding current article
  const stories = FEATURED_HOME_STORIES
    .filter((item) => item.id !== currentId)
    .slice(0, 3);

  return (
    <section className="home-recommendations" aria-labelledby="home-stories-title">
      <div className="home-section-head">
        <div>
          <span className="home-eyebrow">
            {t('recommendations.eyebrow', 'FOLLOW YOUR CURIOSITY')}
          </span>
          <h2 id="home-stories-title" className="home-section-title">
            {t('recommendations.title', 'Something new to discover')}
          </h2>
        </div>
        <Link className="home-text-link" to={PATHS.discovery}>
          <span>{t('recommendations.all_stories', 'All stories')}</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <div className="home-stories-grid">
        {stories.map((story) => {
          const title = isVi ? story.titleVi : story.titleEn;
          const topicLabel = isVi ? story.categoryVi : story.category;
          const readTimeMinutes = parseInt(story.readTime, 10) || 3;

          return (
            <Link
              key={story.id}
              className="home-story-card"
              to={paths.reader({ postId: story.id, level: story.preferredLevel })}
            >
              <div className="home-story-thumbnail">
                <img
                  src={story.imageUrl}
                  alt={title}
                  className="home-story-thumbnail-img"
                  loading="lazy"
                />
                <span className="home-thumb-tag">{topicLabel}</span>
              </div>
              <div className="home-story-body">
                <h3 className="home-story-title">{title}</h3>
                <small className="home-story-meta">
                  <span>{story.preferredLevel}</span>
                  <span>·</span>
                  <span className="home-story-readtime">
                    <Clock size={11} aria-hidden="true" />
                    <span>
                      {readTimeMinutes} {t('recommendations.min_read', 'min read')}
                    </span>
                  </span>
                </small>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// Backward-compatibility export
export const HomeRecommendations = HomeSuggestedStories;
