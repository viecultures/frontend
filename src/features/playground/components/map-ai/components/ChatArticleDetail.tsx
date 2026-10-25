import { BookOpen, ExternalLink, MapPin, MessageSquarePlus } from 'lucide-react';
import { VIETNAM_LANDMARKS } from '@/data/landmarksData';
import { useReaderHandoff } from '@/features/playground/lib/reader-handoff';
import { paths } from '@/routes/paths';
import { useChatWorkspace } from '../lib/chat-workspace';

interface ChatArticleDetailProps {
  articleId: string;
  onShowMap: (articleId: string) => void;
}

export function ChatArticleDetail({ articleId, onShowMap }: ChatArticleDetailProps) {
  const article = VIETNAM_LANDMARKS.find(item => item.id === articleId);
  if (!article) return <p role="alert">This story could not be found.</p>;

  function addToChat(text: string) {
    useReaderHandoff.getState().insertTextIntoDraft(text);
    if (window.matchMedia('(max-width: 1024px)').matches) {
      useChatWorkspace.getState().closePanel();
    }
  }

  return (
    <article className="chat-article-detail" aria-label="Story details">
      <img src={article.image} alt={article.name} className="chat-article-image" onError={event => { event.currentTarget.hidden = true; }} />
      <div className="chat-article-body">
        <p className="chat-article-meta">{article.locationNameVi} · {article.level} · {article.readTime}</p>
        <h2>{article.title}</h2>
        <p lang="vi" className="chat-article-subtitle">{article.titleVi}</p>
        <section className="chat-article-section" aria-label="Bilingual introduction" aria-labelledby="chat-article-intro-heading">
          <h3 id="chat-article-intro-heading">Tóm tắt song ngữ</h3>
          <p className="chat-article-section-help">Đọc bản tiếng Anh trước, rồi đối chiếu bản dịch để kiểm tra cách hiểu.</p>
          <div className="chat-article-language-block">
            <span className="chat-article-language-label">English</span>
            <p lang="en">{article.excerptEn}</p>
          </div>
          <div className="chat-article-language-block chat-article-language-block--translation">
            <span className="chat-article-language-label">Tiếng Việt</span>
            <p lang="vi">{article.excerptVi}</p>
          </div>
        </section>
        <section className="chat-article-section" aria-labelledby="chat-article-vocab-heading">
          <h3 id="chat-article-vocab-heading">Từ vựng văn hóa</h3>
          <p className="chat-article-section-help">Chọn một cụm từ để đưa vào ô chat và luyện cách dùng trong ngữ cảnh.</p>
          <div className="chat-article-vocab">{article.vocabHighlights.map(word => (
            <button type="button" key={word} onClick={() => addToChat(word)} aria-label={`Dùng ${word} trong chat`}>
              <MessageSquarePlus size={14} aria-hidden="true" /> {word}
            </button>
          ))}</div>
          {article.bilingualTerms.length > 0 && (
            <div className="chat-article-terms">
              <h4>Thuật ngữ trong bài</h4>
              <dl>{article.bilingualTerms.map(term => (
                <div key={term.en}><dt lang="en">{term.en}</dt><dd lang="vi">{term.vi}</dd></div>
              ))}</dl>
            </div>
          )}
        </section>
        <section className="chat-article-section" aria-labelledby="chat-article-speaking-heading">
          <h3 id="chat-article-speaking-heading">Luyện nói</h3>
          <p className="chat-article-section-help">Dùng câu mẫu để bắt đầu, rồi thử diễn đạt lại theo cách của bạn.</p>
          <div className="chat-article-speaking-card">
            <p lang="en">{article.speakingSentenceEn}</p>
            <p lang="vi" className="chat-article-translation">{article.speakingSentenceVi}</p>
            <button type="button" onClick={() => addToChat(article.speakingSentenceEn)}>
              <MessageSquarePlus size={15} aria-hidden="true" /> Đưa câu mẫu vào chat
            </button>
          </div>
        </section>
        <div className="chat-article-actions">
          <button type="button" onClick={() => onShowMap(article.id)}><MapPin size={15} /> Xem vị trí trên bản đồ</button>
          <a href={paths.reader({ article: article.id, level: article.level })} target="_blank" rel="noopener noreferrer">
            <BookOpen size={15} /> Đọc toàn bộ bài <ExternalLink size={13} aria-label="Mở tab mới" />
          </a>
        </div>
      </div>
    </article>
  );
}
