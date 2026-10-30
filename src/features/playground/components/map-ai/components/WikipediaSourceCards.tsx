import { ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { WikipediaSearchResult } from '../services/wikipediaSourceService';

function trustedUrl(value: string | undefined, domain: 'wikipedia.org' | 'wikimedia.org'): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === domain || url.hostname.endsWith(`.${domain}`))
      ? url.toString() : null;
  } catch {
    return null;
  }
}

export function WikipediaSourceCards({ result }: { result: WikipediaSearchResult }) {
  const { t } = useTranslation('playground');
  const sources = result.sources.slice(0, 3);
  return (
    <section className="chat-tool-message p-3.5 border text-xs shadow-sm space-y-3" aria-label={t('playground.wikipedia_sources.title')}>
      <div className="chat-tool-header font-bold">{t('playground.wikipedia_sources.title')} ({sources.length})</div>
      {sources.length === 0 && <p>{t('playground.wikipedia_sources.empty')}</p>}
      {sources.map((source, index) => {
        const articleUrl = trustedUrl(source.url, 'wikipedia.org');
        const imageUrl = trustedUrl(source.image?.url, 'wikimedia.org');
        const filePageUrl = trustedUrl(source.image?.filePageUrl, 'wikimedia.org')
          ?? trustedUrl(source.image?.filePageUrl, 'wikipedia.org');
        const licenseUrl = source.image?.licenseUrl?.startsWith('https://') ? source.image.licenseUrl : null;
        return (
          <article key={`${source.url}-${index}`} data-source-card className="chat-story-card rounded-xl border p-3 space-y-2">
            {articleUrl && <a href={articleUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline flex items-center gap-1">
              {source.title}<ExternalLink size={12} />
            </a>}
            <p className="leading-relaxed">{source.extract}</p>
            {imageUrl && filePageUrl && source.image?.artist && source.image.license && licenseUrl && (
              <figure className="space-y-1">
                <a href={filePageUrl} target="_blank" rel="noopener noreferrer" aria-label={`Image source for ${source.title}`}>
                  <img src={imageUrl} alt={source.title} loading="lazy" referrerPolicy="no-referrer"
                    className="max-h-48 max-w-full rounded-lg object-contain" />
                </a>
                <figcaption className="text-[10px] opacity-75 flex flex-wrap items-center gap-1">
                  <ImageIcon size={11} /> {t('playground.wikipedia_sources.image')}: {source.image.artist} ·
                  <a href={licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">{source.image.license}</a> ·
                  <a href={filePageUrl} target="_blank" rel="noopener noreferrer" className="underline">{t('playground.wikipedia_sources.file_details')}</a>
                </figcaption>
              </figure>
            )}
          </article>
        );
      })}
      <small className="opacity-70">{t('playground.wikipedia_sources.retrieved', { date: new Date(result.fetchedAt).toLocaleDateString() })}
        {' '}{t('playground.wikipedia_sources.check_full_context')}</small>
    </section>
  );
}
