import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useReaderHandoff } from '@/features/playground/lib/reader-handoff';

export function ReaderWorkspacePanel() {
  const context = useReaderHandoff(state => state.context);
  if (!context) return <p role="status">No reading reference is selected.</p>;
  return (
    <article className="reader-workspace-panel" aria-label="Reader reference">
      <span>{context.level} · From Reader</span>
      <h2>{context.title}</h2>
      {context.summary && <section><h3>Story introduction</h3><p>{context.summary}</p></section>}
      {context.vocabulary.length > 0 && <section><h3>Words to try in your conversation</h3><dl>{context.vocabulary.map((word, index) => <div key={`${word.word}-${index}`}>
        <dt>{word.word}</dt><dd lang="vi">{word.viMeaning}</dd>{word.contextSentence && <dd>{word.contextSentence}</dd>}
      </div>)}</dl></section>}
      <Link to={context.readerUrl}><BookOpen size={16} /> Continue reading</Link>
    </article>
  );
}
