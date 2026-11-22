import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { PATHS, paths } from '@/routes/paths';
import { journeyApiService } from '@/features/discovery/services/journeyApiService';
import type { SeriesMetadata } from '@/data/series/types';

export const CoverflowArticlesSection: React.FC = () => {
  const { t, i18n } = useTranslation('landing');
  const [stories, setStories] = useState<SeriesMetadata[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = stories[activeIndex];
  const isVietnamese = i18n.language.startsWith('vi');

  useEffect(() => {
    let mounted = true;
    journeyApiService.getJourneys({ status: 'published' }).then((journeys) => {
      if (!mounted) return;
      const mapped = journeys
        .filter((j) => j.theme === 'cuisine' && j.chapters.length > 0)
        .map((j) => ({
          id: j.id,
          title: j.title,
          titleVi: j.titleVi || j.title,
          theme: 'cuisine' as const,
          provinceId: j.provinceId,
          region: j.region as SeriesMetadata['region'],
          description: j.description,
          imageUrl: j.imageUrl,
          status: 'published' as const,
          chapters: j.chapters.map((c) => ({
            id: c.id,
            order: c.order,
            titleEn: c.title,
            titleVi: c.titleVi || c.title,
            summary: c.summary,
            summaryVi: c.summaryVi || c.summary,
            readTime: c.readTime,
            cefrLevel: c.preferredLevel,
          })),
        }));
      if (mapped.length > 0) {
        setStories(mapped);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const move = (direction: number) => {
    if (stories.length === 0) return;
    setActiveIndex((index) => (index + direction + stories.length) % stories.length);
  };

  return (
    <section id="featured-articles" className="landing-articles landing-section" aria-labelledby="landing-articles-title">
      <div className="landing-container">
        <div className="landing-section-heading">
          <div>
            <p className="landing-series-kicker">{t('articles.series_kicker')}</p>
            <h2 id="landing-articles-title" className="font-bold">{t('articles.title')}</h2>
          </div>
          <Link to={PATHS.discovery} className="landing-text-link focus-ring">
            {t('articles.all_stories')} <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <p className="landing-section-description">{t('articles.subtitle')}</p>

        {active ? (
          <div className="landing-series-layout">
            <div className="landing-series-gallery" role="region" aria-label={t('articles.gallery_label')} onKeyDown={(event) => {
              if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
              if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
            }}>
              <div className="landing-series-stage">
                {stories.map((series, index) => {
                  let offset = (index - activeIndex + stories.length) % stories.length;
                  if (offset > stories.length / 2) offset -= stories.length;
                  const distance = Math.abs(offset);
                  const visible = distance <= 2;
                  return (
                    <button
                      key={series.id}
                      type="button"
                      className={`landing-series-card${offset === 0 ? ' is-active' : ''}`}
                      style={{
                        transform: `translateX(${offset * 57}%) scale(${offset === 0 ? 1 : distance === 1 ? .82 : .65}) rotateY(${offset === 0 ? 0 : offset > 0 ? -24 : 24}deg)`,
                        zIndex: 10 - distance,
                        opacity: visible ? (distance === 2 ? .5 : 1) : 0,
                        pointerEvents: visible ? 'auto' : 'none',
                      }}
                      aria-label={t('articles.select_series', { title: isVietnamese ? series.titleVi : series.title })}
                      aria-pressed={offset === 0}
                      tabIndex={visible ? 0 : -1}
                      inert={!visible}
                      onClick={() => setActiveIndex(index)}
                    >
                      <img src={series.imageUrl} alt="" width={1024} height={576} loading="lazy" />
                      <span className="landing-series-card-copy">
                        <span>{t('articles.chapter_count', { count: series.chapters.length })}</span>
                        <strong>{isVietnamese ? series.titleVi : series.title}</strong>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="landing-series-controls">
                <button type="button" onClick={() => move(-1)} aria-label={t('articles.previous_series')}><ChevronLeft size={22} aria-hidden="true" /></button>
                <span aria-live="polite">{activeIndex + 1} / {stories.length}</span>
                <button type="button" onClick={() => move(1)} aria-label={t('articles.next_series')}><ChevronRight size={22} aria-hidden="true" /></button>
              </div>
            </div>

            <div className="landing-series-detail">
              <span className="landing-series-detail-label"><BookOpen size={17} aria-hidden="true" />{t('articles.series_label')}</span>
              <h3>{isVietnamese ? active.titleVi : active.title}</h3>
              <p>{t('articles.series_intro')}</p>
              <ol>
                {active.chapters.map((chapter, index) => (
                  <li key={chapter.id}>
                    <Link to={paths.reader({ story: chapter.id })}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <span>{isVietnamese ? chapter.titleVi : chapter.titleEn}</span>
                      <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : <p>{t('articles.empty')}</p>}
      </div>
    </section>
  );
};

export default CoverflowArticlesSection;
