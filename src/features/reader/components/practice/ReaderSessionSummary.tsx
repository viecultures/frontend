import { Link } from 'react-router-dom';
import { BookOpen, Compass } from 'lucide-react';
import { getSeriesNavigation } from '@/data/series';
import { PATHS, paths } from '@/routes/paths';
import type { ReaderArticleData } from '../../services/readerApiService';
import type { ReaderSessionState } from '../../services/readerSessionStorage';
import { buildPracticeSegments } from '../../lib/readerPractice';

interface Props {
  article: ReaderArticleData;
  level: string;
  session: ReaderSessionState;
}

export function ReaderSessionSummary({ article, level, session }: Props) {
  const segments = buildPracticeSegments(article);
  const ids = new Set(segments.map(item => item.id));
  const vocabIds = new Set(article.vocabularies.map(item => item.id));
  const reviewed = session.vocab.reviewedIds.filter(id => vocabIds.has(id));
  const remembered = session.vocab.rememberedIds.filter(id => vocabIds.has(id));
  const needsReview = session.vocab.reviewLaterIds.filter(id => vocabIds.has(id));
  const dictation = session.dictation.passageRecords;
  const states = segments.map((_, index) => dictation[index]?.status);
  const self = states.filter(status => status === 'completed-self').length;
  const hinted = states.filter(status => status === 'completed-hinted').length;
  const revealed = states.filter(status => status === 'answer-revealed').length;
  const evaluations = Object.entries(session.shadowing.selfEvaluations).filter(([id]) => ids.has(id));
  const satisfied = evaluations.filter(([, value]) => value === 'satisfied').length;
  const needsWork = evaluations.filter(([, value]) => value === 'needs_work').length;
  const next = getSeriesNavigation(article.id)?.nextChapter;

  return (
    <section className="reader-session-summary" aria-label="Tổng hợp phiên học">
      <h2>Tổng hợp phiên học</h2>
      <p>{article.titleVi || article.titleEn} · {level}</p>
      <dl>
        <div><dt>Đọc bài</dt><dd>{session.readCompleted ? 'Đã xác nhận hoàn thành' : 'Chưa xác nhận hoàn thành'}</dd></div>
        <div><dt>Ôn từ</dt><dd>{reviewed.length}/{article.vocabularies.length} từ · {remembered.length} đã nhớ · {needsReview.length} cần ôn lại</dd></div>
        <div><dt>Nghe chép</dt><dd>{self + hinted + revealed}/{segments.length} đoạn · {self} tự hoàn thành · {hinted} có gợi ý · {revealed} xem đáp án</dd></div>
        <div><dt>Luyện nói</dt><dd>{evaluations.length}/{segments.length} đoạn đã tự đánh giá · {satisfied} hài lòng · {needsWork} cần luyện thêm</dd></div>
      </dl>
      {evaluations.length > 0 && <p>Bản thu âm chỉ có thể nghe lại trong lần mở trang hiện tại.</p>}
      <div className="reader-session-summary-actions">
        {next && <Link to={paths.reader({ postId: next.id, level })}><BookOpen size={17} /> Học bài tiếp theo</Link>}
        <Link to={PATHS.discovery}><Compass size={17} /> Quay về bản đồ di sản</Link>
      </div>
    </section>
  );
}
