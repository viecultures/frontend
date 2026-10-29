import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { ArrowLeft, ArrowRight, ListOrdered } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSeriesNavigation } from '@/data/series';
import { PATHS, paths, withQuery } from '@/routes/paths';

interface ReaderSeriesNavigationProps {
  articleId: string;
}

export function ReaderSeriesNavigation({ articleId }: ReaderSeriesNavigationProps) {
  const { t } = useTranslation('reader');
  const nav = getSeriesNavigation(articleId);
  if (!nav) return null;

  const { series, chapterIndex, previousChapter, nextChapter, totalChapters } = nav;

  return <nav className="reader-series-nav" aria-label={`${series.title} series`}>
    <div>
      <span>{series.theme.toUpperCase()} · {series.provinceId.toUpperCase().replace('-', ' ')}</span>
      <strong>{series.title} · {t('series_nav.story_count', { current: chapterIndex + 1, total: totalChapters, defaultValue: `Story ${chapterIndex + 1} of ${totalChapters}` })}</strong>
    </div>
    <div className="reader-series-nav-links">
      {previousChapter && (
        <Link to={paths.reader({ story: previousChapter.id, level: 'Level 2' })}>
          <ArrowLeft size={17} /> {t('series_nav.previous_story', 'Previous story')}
        </Link>
      )}
      <Link to={withQuery(PATHS.discovery, { place: series.provinceId })}>
        <ListOrdered size={17} /> {t('series_nav.view_series', 'View series')}
      </Link>
      {nextChapter && (
        <Link className="reader-series-next" to={paths.reader({ story: nextChapter.id, level: 'Level 2' })}>
          {t('series_nav.next_story', 'Next story')} <ArrowRight size={17} />
        </Link>
      )}
    </div>
  </nav>;
}
