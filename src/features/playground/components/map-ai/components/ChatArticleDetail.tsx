import { BookOpen, ExternalLink, MapPin } from 'lucide-react';
import { VIETNAM_LANDMARKS } from '@/data/landmarksData';
import { paths } from '@/routes/paths';

interface ChatArticleDetailProps {
  articleId: string;
  onShowMap: (articleId: string) => void;
}

export function ChatArticleDetail({ articleId, onShowMap }: ChatArticleDetailProps) {
  const article = VIETNAM_LANDMARKS.find(item => item.id === articleId);
  if (!article) return <p role="alert">This story could not be found.</p>;

  return (
    <article className="chat-article-detail" aria-label="Story details">
      <img src={article.image} alt={article.name} className="chat-article-image" onError={event => { event.currentTarget.hidden = true; }} />
      <div className="chat-article-body">
        <p className="chat-article-meta">{article.locationNameVi} · {article.level} · {article.readTime}</p>
        <h2>{article.title}</h2>
        <p lang="vi" className="chat-article-subtitle">{article.titleVi}</p>
        <section aria-label="Bilingual introduction">
          <h3>Bilingual introduction</h3>
          <p lang="en">{article.excerptEn}</p>
          <p lang="vi" className="chat-article-translation">{article.excerptVi}</p>
        </section>
        <section aria-label="Cultural vocabulary">
          <h3>Cultural vocabulary</h3>
          <div className="chat-article-vocab">{article.vocabHighlights.map(word => <span key={word}>{word}</span>)}</div>
          <dl>{article.bilingualTerms.map(term => (
            <div key={term.en}><dt lang="en">{term.en}</dt><dd lang="vi">{term.vi}</dd></div>
          ))}</dl>
        </section>
        <section aria-label="Speaking practice">
          <h3>Speaking practice</h3>
          <p lang="en">{article.speakingSentenceEn}</p>
          <p lang="vi" className="chat-article-translation">{article.speakingSentenceVi}</p>
        </section>
        <div className="chat-article-actions">
          <button type="button" onClick={() => onShowMap(article.id)}><MapPin size={15} /> Show on map</button>
          <a href={paths.reader({ article: article.id, level: article.level })} target="_blank" rel="noopener noreferrer">
            <BookOpen size={15} /> Read full story <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </article>
  );
}
