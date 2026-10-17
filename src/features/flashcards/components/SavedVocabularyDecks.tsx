import { Link } from 'react-router-dom';
import { listSavedArticles } from '@/features/learning/lib/learningStorage';
import { paths } from '@/routes/paths';

export function SavedVocabularyDecks() {
  const articles = listSavedArticles();
  if (!articles.length) return null;
  return <section className="p-5 rounded-2xl bg-surface border border-line space-y-3" aria-label="Từ vựng đã lưu">
    <h2 className="font-serif text-xl text-heritage-green font-bold">Sổ tay từ vựng của bạn</h2>
    <p className="text-xs">Các từ bạn chọn lưu trong bài đọc · Lưu trên trình duyệt này</p>
    {articles.map(({ article, level, count }) => <Link key={article.id + level} className="block border-t border-line py-3 text-heritage-green" to={paths.flashcardStudy({ deck: article.id, level, saved: true })}>
      {article.titleVi} · {level} · {count} từ đã lưu →
    </Link>)}
  </section>;
}
