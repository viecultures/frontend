import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { Bookmark, BookmarkCheck, BookOpen } from 'lucide-react';
import { getLessonStatsForLevel } from '@/data/discoveryData';
import { paths } from '@/routes/paths';
import { activeLevel, type DiscoveryLesson } from '../lib/catalog';
import { ENGLISH_EDITORIAL, LOCAL_EDITORIAL, TOPIC_LABELS } from '../lib/editorial';

interface Props {
  lesson: DiscoveryLesson;
  variant?: 'lead' | 'support' | 'card';
  saved: boolean;
  onSave: (id: string) => void;
}

export function EditorialStory({ lesson, variant = 'card', saved, onSave }: Props) {
  const { t, i18n } = useTranslation('discovery');
  const isEn = i18n.language === 'en';
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const local = !lesson.isFromDatabase ? LOCAL_EDITORIAL[lesson.id] : undefined;
  const english = !lesson.isFromDatabase ? ENGLISH_EDITORIAL[lesson.id] : undefined;
  const title = isEn
    ? (english?.title || lesson.title)
    : (local?.title || lesson.vietnameseTitle || lesson.title);
  const description = isEn
    ? (english?.description || lesson.summary)
    : (local?.description || lesson.summary);
  // Unverified stock images in the legacy dataset often show unrelated subjects.
  const image = local?.image || lesson.imageUrl;
  const targetLevel = activeLevel(lesson, 'All');
  const stats = getLessonStatsForLevel(lesson, targetLevel);
  const href = lesson.postIds?.[targetLevel]
    ? paths.reader({ postId: lesson.postIds[targetLevel], level: targetLevel })
    : paths.reader({ story: lesson.id, level: targetLevel });
  const readMinutes = parseInt(stats.readTime, 10) || 5;

  const topicLabel = t(`editorial.topics.${lesson.category}`, {
    defaultValue: TOPIC_LABELS[lesson.category] || lesson.category,
  });

  return (
    <article className={`discovery-story discovery-story--${variant}`} data-story-id={lesson.id}>
      <Link to={href} className="discovery-story-link focus-ring" aria-label={title}>
        <div className="discovery-story-image">
          {image && failedImage !== image ? <img src={image} alt="" loading={variant === 'lead' ? 'eager' : 'lazy'} onError={() => setFailedImage(image)} />
            : <span className="discovery-image-fallback"><BookOpen size={28} aria-hidden="true" /><span className="discovery-fallback-text">{topicLabel}</span></span>}
        </div>
        <div className="discovery-story-copy">
          <span className="discovery-category">{topicLabel}</span>
          <h3>{title}</h3>
          <p className="discovery-story-description">{description}</p>
        </div>
      </Link>
      <div className="discovery-story-footer">
        <span>{t('editorial.min_read', { count: readMinutes, defaultValue: `${readMinutes} min read` })}</span>
        <button type="button" className="discovery-save focus-ring" aria-pressed={saved} aria-label={`${saved ? t('editorial.unsave_story', 'Unsave story') : t('editorial.save_story', 'Save story')}: ${title}`} onClick={() => onSave(lesson.id)}>
          {saved ? <BookmarkCheck size={19} aria-hidden="true" /> : <Bookmark size={19} aria-hidden="true" />}
        </button>
      </div>
    </article>
  );
}