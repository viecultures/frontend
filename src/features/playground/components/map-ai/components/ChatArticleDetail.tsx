import { BookOpen, ExternalLink, MapPin, MessageSquarePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { VIETNAM_LANDMARKS } from '@/data/landmarksData';
import { useReaderHandoff } from '@/features/playground/lib/reader-handoff';
import { paths } from '@/routes/paths';
import { useChatWorkspace } from '../lib/chat-workspace';

interface ChatArticleDetailProps {
  articleId: string;
  onShowMap: (articleId: string) => void;
}

export function ChatArticleDetail({ articleId, onShowMap }: ChatArticleDetailProps) {
  const { t } = useTranslation('playground');
  const article = VIETNAM_LANDMARKS.find(item => item.id === articleId);
  if (!article) return <p role="alert">{t('playground.chat_article.not_found')}</p>;

  function addToChat(text: string) {
    useReaderHandoff.getState().insertTextIntoDraft(text);
    if (window.matchMedia('(max-width: 1024px)').matches) {
      useChatWorkspace.getState().closePanel();
    }
  }

  return (
    <article className="chat-article-detail" aria-label={t('playground.chat_article.aria_story_details')}>
      <img src={article.image} alt={article.name} className="chat-article-image" onError={event => { event.currentTarget.hidden = true; }} />
      <div className="chat-article-body">
        <p className="chat-article-meta">{article.locationNameVi} · {article.level} · {article.readTime}</p>
        <h2>{article.title}</h2>
        <p lang="vi" className="chat-article-subtitle">{article.titleVi}</p>
        <section className="chat-article-section" aria-label={t('playground.chat_article.aria_bilingual_intro')} aria-labelledby="chat-article-intro-heading">
          <h3 id="chat-article-intro-heading">{t('playground.chat_article.intro_heading')}</h3>
          <p className="chat-article-section-help">{t('playground.chat_article.intro_help')}</p>
          <div className="chat-article-language-block">
            <span className="chat-article-language-label">{t('playground.chat_article.label_en')}</span>
            <p lang="en">{article.excerptEn}</p>
          </div>
          <div className="chat-article-language-block chat-article-language-block--translation">
            <span className="chat-article-language-label">{t('playground.chat_article.label_vi')}</span>
            <p lang="vi">{article.excerptVi}</p>
          </div>
        </section>
        <section className="chat-article-section" aria-labelledby="chat-article-vocab-heading">
          <h3 id="chat-article-vocab-heading">{t('playground.chat_article.vocab_heading')}</h3>
          <p className="chat-article-section-help">{t('playground.chat_article.vocab_help')}</p>
          <div className="chat-article-vocab">{article.vocabHighlights.map(word => (
            <button type="button" key={word} onClick={() => addToChat(word)} aria-label={t('playground.chat_article.use_word_aria', { word })}>
              <MessageSquarePlus size={14} aria-hidden="true" /> {word}
            </button>
          ))}</div>
          {article.bilingualTerms.length > 0 && (
            <div className="chat-article-terms">
              <h4>{t('playground.chat_article.terms_heading')}</h4>
              <dl>{article.bilingualTerms.map(term => (
                <div key={term.en}><dt lang="en">{term.en}</dt><dd lang="vi">{term.vi}</dd></div>
              ))}</dl>
            </div>
          )}
        </section>
        <section className="chat-article-section" aria-labelledby="chat-article-speaking-heading">
          <h3 id="chat-article-speaking-heading">{t('playground.chat_article.speaking_heading')}</h3>
          <p className="chat-article-section-help">{t('playground.chat_article.speaking_help')}</p>
          <div className="chat-article-speaking-card">
            <p lang="en">{article.speakingSentenceEn}</p>
            <p lang="vi" className="chat-article-translation">{article.speakingSentenceVi}</p>
            <button type="button" onClick={() => addToChat(article.speakingSentenceEn)}>
              <MessageSquarePlus size={15} aria-hidden="true" /> {t('playground.chat_article.insert_sample_sentence')}
            </button>
          </div>
        </section>
        <div className="chat-article-actions">
          <button type="button" onClick={() => onShowMap(article.id)}><MapPin size={15} /> {t('playground.chat_article.view_on_map')}</button>
          <a href={paths.reader({ article: article.id, level: article.level })} target="_blank" rel="noopener noreferrer">
            <BookOpen size={15} /> {t('playground.chat_article.read_full_article')} <ExternalLink size={13} aria-label={t('playground.chat_article.open_new_tab')} />
          </a>
        </div>
      </div>
    </article>
  );
}
