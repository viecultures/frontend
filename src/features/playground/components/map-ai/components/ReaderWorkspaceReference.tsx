import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen, X } from 'lucide-react';
import { paths } from '@/routes/paths';
import { readerApiService } from '@/features/reader/services/readerApiService';
import { useReaderHandoff } from '@/features/playground/lib/reader-handoff';
import { useChatWorkspace } from '../lib/chat-workspace';
import './reader-workspace.css';

interface ReaderWorkspaceReferenceProps { active: boolean }

export function ReaderWorkspaceReference({ active }: ReaderWorkspaceReferenceProps) {
  const { t } = useTranslation('playground');
  const [params] = useSearchParams();
  const story = params.get('story');
  const requestedLevel = params.get('level');
  const level = requestedLevel === 'Level 1' || requestedLevel === 'Level 3' ? requestedLevel : 'Level 2';
  const context = useReaderHandoff(state => state.context);
  const [error, setError] = useState(false);
  const [dismissedStory, setDismissedStory] = useState<string | null>(null);

  useEffect(() => {
    if (!active || !story || story === dismissedStory || context?.articleId === story) return;
    if (context) { useReaderHandoff.getState().dismissReference(); return; }
    let current = true;
    setError(false);
    async function restoreLink() {
      try {
        const post = story === 'tet-holiday' ? null : await readerApiService.getPostById(story!);
        const article = post ? readerApiService.mapPostToReaderData(post) : readerApiService.getLocalArticle(story!, level);
        if (!current) return;
        if (!article) { setError(true); return; }
        useReaderHandoff.getState().restoreReference({
          articleId: article.id, title: article.titleEn, level,
          summary: article.summary || article.paragraphs.slice(0, 2).map(paragraph => paragraph.enText).join('\n').slice(0, 3000),
          vocabulary: article.vocabularies.slice(0, 12),
          readerUrl: paths.reader({ postId: article.id, level }),
        });
      } catch { if (current) setError(true); }
    }
    void restoreLink();
    return () => { current = false; };
  }, [active, story, level, context?.articleId, dismissedStory]);

  if (!active) return null;
  if (error) return <div className="reader-workspace-reference" role="status">{t('playground.reader_panel.load_error')} <Link to={paths.reader({ postId: story || undefined, level })}>{t('playground.reader_panel.return_to_reader')}</Link></div>;
  if (!context || (story && context.articleId !== story)) return null;

  function dismissReference() {
    setDismissedStory(story);
    useReaderHandoff.getState().dismissReference();
    if (useChatWorkspace.getState().panel?.type === 'reader') useChatWorkspace.getState().closePanel();
  }
  return (
    <section className="reader-workspace-reference" aria-label={t('playground.reader_panel.aria_label')} title={context.title}>
      <span className="reader-workspace-reference-label">{t('playground.reader_panel.reading_badge', { title: context.title })}</span>
      <div className="reader-workspace-reference-actions">
        <button type="button" aria-label={t('playground.reader_panel.view_notes_title')} title={t('playground.reader_panel.view_notes_title')} onClick={() => useChatWorkspace.getState().openReaderReference()}><BookOpen size={16} /><span>{t('playground.reader_panel.view_notes')}</span></button>
        <Link to={context.readerUrl} aria-label={t('playground.reader_panel.back_reader_title')} title={t('playground.reader_panel.back_reader_title')}><ArrowLeft size={16} /><span>{t('playground.reader_panel.back_to_reader')}</span></Link>
        <button type="button" onClick={dismissReference} aria-label={t('playground.reader_panel.dismiss_ref_title')} title={t('playground.reader_panel.dismiss_ref_title')}><X size={16} /></button>
      </div>
    </section>
  );
}
