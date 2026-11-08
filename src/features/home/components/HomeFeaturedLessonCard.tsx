import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen, Clock3 } from 'lucide-react';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { paths } from '@/routes/paths';
import { FEATURED_HOME_STORIES } from '../data/recommendationData';

const AUTO_ROTATE_INTERVAL_MS = 3000;

export function HomeFeaturedLessonCard() {
  const { t, i18n } = useTranslation('home');
  const [index, setIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const lessons = FEATURED_HOME_STORIES.slice(0, 4);

  useEffect(() => {
    if (lessons.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % lessons.length);
      setImageFailed(false);
    }, AUTO_ROTATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [lessons.length, isPaused, index]);

  const lesson = lessons[index];
  if (!lesson) return null;

  const isVi = i18n.language.startsWith('vi');
  const title = isVi ? lesson.titleVi : lesson.titleEn;
  const category = isVi ? lesson.categoryVi : lesson.category;
  const minutes = Number.parseInt(lesson.readTime, 10);

  return (
    <section
      className="home-featured"
      aria-label={t('featured.label')}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {!imageFailed && (
        <img
          key={lesson.id}
          className="home-featured-image"
          src={lesson.imageUrl}
          alt=""
          onError={() => setImageFailed(true)}
        />
      )}
      <div className="home-featured-shade" />
      <div className="home-featured-content">
        <span className="home-featured-badge">
          <BookOpen size={17} aria-hidden="true" />
          {t('featured.label')}
        </span>
        <h2>{title}</h2>
        <p>{t('featured.description')}</p>
        <div className="home-featured-meta">
          <span>{lesson.preferredLevel}</span>
          {Number.isFinite(minutes) && (
            <span>
              <Clock3 size={14} aria-hidden="true" />
              {t('continue_card.read_time', { count: minutes })}
            </span>
          )}
          <span>{category}</span>
        </div>
        <Link
          to={paths.reader({ postId: lesson.id, level: lesson.preferredLevel })}
          className="home-featured-cta"
        >
          {t('featured.read')} <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
      {lessons.length > 1 && (
        <div className="home-featured-dots" role="group" aria-label={t('featured.choose')}>
          {lessons.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              className={index === itemIndex ? 'is-active' : ''}
              aria-label={t('featured.slide', { count: itemIndex + 1 })}
              aria-pressed={index === itemIndex}
              onClick={() => {
                setIndex(itemIndex);
                setImageFailed(false);
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
