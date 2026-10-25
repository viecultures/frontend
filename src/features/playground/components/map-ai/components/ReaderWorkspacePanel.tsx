import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, MessageSquarePlus } from 'lucide-react';
import { useReaderHandoff } from '@/features/playground/lib/reader-handoff';
import { useChatWorkspace } from '../lib/chat-workspace';
import { useSettings } from '../lib/state';

const SUMMARY_LIMIT = 260;

export function ReaderWorkspacePanel() {
  const context = useReaderHandoff(state => state.context);
  const speakingLevel = useSettings(state => state.proficiencyLevel);
  const [showFullSummary, setShowFullSummary] = useState(false);

  useEffect(() => setShowFullSummary(false), [context?.articleId]);

  function useWordInChat(word: string) {
    useReaderHandoff.getState().insertTextIntoDraft(word);
    if (window.matchMedia('(max-width: 1024px)').matches) {
      useChatWorkspace.getState().closePanel();
    }
  }

  if (!context) return <p role="status">No reading reference is selected.</p>;

  const summary = context.summary?.trim() || '';
  const isLongSummary = summary.length > SUMMARY_LIMIT;
  const visibleSummary = isLongSummary && !showFullSummary
    ? `${summary.slice(0, SUMMARY_LIMIT).trimEnd()}…`
    : summary;

  return (
    <article className="reader-workspace-panel" aria-label="Reading reference">
      <header className="reader-reference-intro">
        <div className="reader-reference-levels" aria-label="Learning levels">
          <span>Bài đọc · {context.level}</span>
          <span>Luyện nói · {speakingLevel}</span>
        </div>
        <h2>{context.title}</h2>
        <Link className="reader-reference-back" to={context.readerUrl}>
          <ArrowLeft size={16} aria-hidden="true" /> Quay lại Reader
        </Link>
      </header>

      {summary && (
        <section className="reader-reference-summary" aria-labelledby="reader-reference-summary-heading">
          <h3 id="reader-reference-summary-heading">Giới thiệu bài đọc</h3>
          <p>{visibleSummary}</p>
          {isLongSummary && (
            <button type="button" onClick={() => setShowFullSummary(value => !value)} aria-expanded={showFullSummary}>
              {showFullSummary ? 'Thu gọn' : 'Xem thêm'}
            </button>
          )}
        </section>
      )}

      {context.vocabulary.length > 0 && (
        <section className="reader-reference-vocabulary" aria-labelledby="reader-reference-vocabulary-heading">
          <div className="reader-reference-section-heading">
            <h3 id="reader-reference-vocabulary-heading">Từ gợi ý cho cuộc trò chuyện</h3>
            <span>{context.vocabulary.length} từ</span>
          </div>
          <ul className="reader-reference-word-list">
            {context.vocabulary.map((item, index) => (
              <li key={`${item.word}-${index}`}>
                <details className="reader-reference-word-card">
                  <summary>
                    <span className="reader-reference-word-copy">
                      <strong lang="en">{item.word}</strong>
                      <span lang="vi">{item.viMeaning || 'Chưa có nghĩa tiếng Việt'}</span>
                    </span>
                    <ChevronDown size={18} aria-hidden="true" />
                  </summary>
                  <div className="reader-reference-word-extra">
                    {item.contextSentence && <p lang="en">{item.contextSentence}</p>}
                    <button type="button" onClick={() => useWordInChat(item.word)}>
                      <MessageSquarePlus size={16} aria-hidden="true" /> Dùng trong chat
                    </button>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
