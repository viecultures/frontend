import React from 'react';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { ArrowLeft, ArrowRight, Check, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSeriesNavigation } from '@/data/series';
import { PATHS, paths, withQuery } from '@/routes/paths';

interface ReaderSeriesNavigationProps {
  articleId: string;
  selectedLevel?: 'Level 1' | 'Level 2' | 'Level 3';
  themeMode?: 'paper' | 'dark';
}

export function ReaderSeriesNavigation({
  articleId,
  selectedLevel = 'Level 2',
  themeMode = 'paper',
}: ReaderSeriesNavigationProps) {
  const { t, i18n } = useTranslation('reader');
  const isVi = (i18n.language || '').startsWith('vi');

  const nav = getSeriesNavigation(articleId);
  if (!nav) return null;

  const { series, chapterIndex, previousChapter, nextChapter, totalChapters } = nav;
  const seriesTitle = isVi && series.titleVi ? series.titleVi : series.title;

  return (
    <nav
      className={`reader-series-bottom-card ${themeMode === 'dark' ? 'is-dark' : ''}`}
      aria-label={`${seriesTitle} series`}
    >
      {/* 1. Header: Series Metadata & Visual Progress Stepper */}
      <div className="reader-series-header">
        <div className="reader-series-meta">
          <span className="reader-series-eyebrow">
            {t('series_nav.series_label', 'CHUỖI BÀI VĂN HÓA')} · {series.theme.toUpperCase()} · {series.provinceId.toUpperCase().replace(/-/g, ' ')}
          </span>
          <h3 className="reader-series-title">{seriesTitle}</h3>
        </div>

        <div className="reader-series-progress">
          <div className="reader-series-progress-label">
            {t('series_nav.story_count', {
              current: chapterIndex + 1,
              total: totalChapters,
              defaultValue: `Bài ${chapterIndex + 1} / ${totalChapters}`,
            })}
          </div>
          {/* Stepper dots */}
          <div className="reader-series-stepper" aria-hidden="true">
            {series.chapters.map((chap, idx) => {
              const isPast = idx < chapterIndex;
              const isCurrent = idx === chapterIndex;
              return (
                <React.Fragment key={chap.id}>
                  {idx > 0 && (
                    <span className={`reader-series-stepper-line ${isPast || isCurrent ? 'is-active' : ''}`} />
                  )}
                  <span
                    className={`reader-series-stepper-dot ${
                      isPast ? 'is-past' : isCurrent ? 'is-current' : ''
                    }`}
                    title={isVi ? chap.titleVi : chap.titleEn}
                  >
                    {isPast && <Check size={10} />}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Navigation Grid: Previous and Next Chapter Cards */}
      <div className="reader-series-grid">
        {/* Previous Chapter Slot */}
        <div className="reader-series-prev-col">
          {previousChapter ? (
            <Link
              to={paths.reader({ postId: previousChapter.id, level: selectedLevel })}
              className="reader-series-nav-btn is-prev"
            >
              <div className="reader-series-btn-icon" aria-hidden="true">
                <ArrowLeft size={18} />
              </div>
              <div className="reader-series-btn-content">
                <span className="reader-series-btn-tag">
                  {t('series_nav.previous_story', 'Bài trước')}
                </span>
                <h4 className="reader-series-btn-title">
                  {isVi && previousChapter.titleVi ? previousChapter.titleVi : previousChapter.titleEn}
                </h4>
                {previousChapter.readTime && (
                  <span className="reader-series-btn-time">{previousChapter.readTime}</span>
                )}
              </div>
            </Link>
          ) : (
            <div className="reader-series-first-notice">
              <span className="reader-series-first-dot" aria-hidden="true" />
              <span>{t('series_nav.first_story_hint', 'Bạn đang ở bài đầu tiên của chuỗi bài')}</span>
            </div>
          )}
        </div>

        {/* Next Chapter Slot */}
        <div className="reader-series-next-col">
          {nextChapter ? (
            <Link
              to={paths.reader({ postId: nextChapter.id, level: selectedLevel })}
              className="reader-series-nav-btn is-next"
            >
              <div className="reader-series-btn-content">
                <div className="reader-series-next-badge-row">
                  <span className="reader-series-btn-tag is-next-tag">
                    {t('series_nav.next_story', 'Bài tiếp theo')}
                  </span>
                  {nextChapter.cefrLevel && (
                    <span className="reader-series-pill">{nextChapter.cefrLevel}</span>
                  )}
                  {nextChapter.readTime && (
                    <span className="reader-series-btn-time">{nextChapter.readTime}</span>
                  )}
                </div>
                <h4 className="reader-series-btn-title is-next-title">
                  {isVi && nextChapter.titleVi ? nextChapter.titleVi : nextChapter.titleEn}
                </h4>
                <p className="reader-series-btn-desc">
                  {isVi && nextChapter.summaryVi ? nextChapter.summaryVi : nextChapter.summary}
                </p>
                <div className="reader-series-next-action">
                  <span>{t('series_nav.read_next', 'Đọc tiếp bài này')}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </div>
              </div>
            </Link>
          ) : (
            <div className="reader-series-completed-card">
              <div className="reader-series-completed-content">
                <span className="reader-series-btn-tag is-completed-tag">
                  {t('series_nav.series_label', 'CHUỖI BÀI VĂN HÓA')}
                </span>
                <h4 className="reader-series-btn-title">
                  {t('series_nav.series_completed', 'Bạn đã hoàn thành chuỗi bài này!')}
                </h4>
              </div>
              <Link
                to={withQuery(PATHS.discovery, { place: series.provinceId })}
                className="reader-series-explore-btn"
              >
                <Compass size={16} aria-hidden="true" />
                <span>{t('series_nav.explore_more_series', 'Khám phá các chuỗi bài khác')}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
