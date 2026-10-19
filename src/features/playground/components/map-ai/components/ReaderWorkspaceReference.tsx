import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, X } from 'lucide-react';
import { paths } from '@/routes/paths';
import { readerApiService } from '@/features/reader/services/readerApiService';
import { useReaderHandoff } from '@/features/playground/lib/reader-handoff';
import { useChatWorkspace } from '../lib/chat-workspace';
import './reader-workspace.css';

interface ReaderWorkspaceReferenceProps { active: boolean }

export function ReaderWorkspaceReference({ active }: ReaderWorkspaceReferenceProps) {
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
  if (error) return <div className="reader-workspace-reference" role="status">This story could not be loaded. You can still continue your conversation. <Link to={paths.reader({ postId: story || undefined, level })}>Return to Reader</Link></div>;
  if (!context || (story && context.articleId !== story)) return null;

  function dismissReference() {
    setDismissedStory(story);
    useReaderHandoff.getState().dismissReference();
    if (useChatWorkspace.getState().panel?.type === 'reader') useChatWorkspace.getState().closePanel();
  }
  return (
    <section className="reader-workspace-reference" aria-label="Reading context" title={context.title}>
      <span className="reader-workspace-reference-label">From Reader</span>
      <div className="reader-workspace-reference-actions">
        <button type="button" aria-label="Reading reference" title="Reading reference" onClick={() => useChatWorkspace.getState().openReaderReference()}><BookOpen size={16} /><span>Reading reference</span></button>
        <Link to={context.readerUrl} aria-label="Back to Reader" title="Back to Reader"><ArrowLeft size={16} /><span>Back to Reader</span></Link>
        <button type="button" onClick={dismissReference} aria-label="Dismiss reading reference" title="Dismiss reading reference"><X size={16} /></button>
      </div>
    </section>
  );
}
