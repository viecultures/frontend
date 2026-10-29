import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { ArrowLeft, ArrowRight, ListOrdered } from 'lucide-react';
import { getSeriesNavigation } from '@/data/series';
import { PATHS, paths, withQuery } from '@/routes/paths';

interface ReaderSeriesNavigationProps {
  articleId: string;
}

export function ReaderSeriesNavigation({ articleId }: ReaderSeriesNavigationProps) {
  const nav = getSeriesNavigation(articleId);
  if (!nav) return null;

  const { series, chapterIndex, previousChapter, nextChapter, totalChapters } = nav;

  return <nav className="reader-series-nav" aria-label={`${series.title} series`}>
    <div>
      <span>{series.theme.toUpperCase()} · {series.provinceId.toUpperCase().replace('-', ' ')}</span>
      <strong>{series.title} · Story {chapterIndex + 1} of {totalChapters}</strong>
    </div>
    <div className="reader-series-nav-links">
      {previousChapter && (
        <Link to={paths.reader({ story: previousChapter.id, level: 'Level 2' })}>
          <ArrowLeft size={17} /> Previous story
        </Link>
      )}
      <Link to={withQuery(PATHS.discovery, { place: series.provinceId })}>
        <ListOrdered size={17} /> View series
      </Link>
      {nextChapter && (
        <Link className="reader-series-next" to={paths.reader({ story: nextChapter.id, level: 'Level 2' })}>
          Next story <ArrowRight size={17} />
        </Link>
      )}
    </div>
  </nav>;
}
