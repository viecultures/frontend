import React from 'react';
import Link from '@/components/Link';
import {
  BookOpen,
  Clock,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { type Lesson, getCefrBadgeStyle } from '@/data/discoveryData';
import { ArticleCardSkeleton } from '@/components/ui/skeleton';

interface DiscoveryArticleGridProps {
  isLoading: boolean;
  lessons: Lesson[];
  viewMode: 'grid' | 'list';
  bookmarks: Record<string, boolean>;
  onToggleBookmark: (id: string) => void;
  onlyBookmarked: boolean;
  onResetAllFilters: () => void;
}

export const DiscoveryArticleGrid: React.FC<DiscoveryArticleGridProps> = ({
  isLoading,
  lessons,
  viewMode,
  bookmarks,
  onToggleBookmark,
  onlyBookmarked,
  onResetAllFilters,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {Array.from({ length: 6 }).map((_, idx) => (
          <ArticleCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="py-16 text-center rounded-3xl bg-rice-paper/60 border border-dashed border-heritage-green/25 p-8">
        <div className="w-16 h-16 rounded-full bg-mist-cloud flex items-center justify-center mx-auto mb-4 text-heritage-green">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-xl font-bold text-heritage-green">
          Không tìm thấy bài học phù hợp
        </h3>
        <p className="text-sm text-text-body mt-2 max-w-md mx-auto">
          {onlyBookmarked
            ? 'Bạn chưa lưu bài học nào trong danh mục này.'
            : 'Không tìm thấy câu chuyện văn hóa nào khớp với các bộ lọc hiện tại.'}
        </p>
        <button
          type="button"
          onClick={onResetAllFilters}
          className="mt-6 px-6 py-2.5 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm transition-all focus-ring cursor-pointer"
        >
          Đặt lại tất cả bộ lọc
        </button>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {lessons.map((lesson) => {
          const isBookmarked = !!bookmarks[lesson.id];
          return (
            <article
              key={lesson.id}
              className="group relative rounded-3xl bg-warm-ivory border border-heritage-green/12 shadow-[0_4px_20px_-4px] shadow-heritage-green/6 hover:shadow-[0_12px_32px_-6px] shadow-heritage-green/16 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 focus-ring"
            >
              {/* Card Cover Image */}
              <div className="relative h-48 w-full bg-gradient-to-br from-heritage-green to-heritage-dark overflow-hidden">
                {lesson.imageUrl ? (
                  <img
                    src={lesson.imageUrl}
                    alt={lesson.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {lesson.iconSymbol}
                  </div>
                )}
              </div>

              {/* Card Body & Metadata */}
              <div className="p-6 flex-1 flex flex-col justify-between bg-warm-ivory">
                <div className="space-y-3">
                  {/* Category Badge & Bookmark Button */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-heritage-green/10 text-heritage-green border border-heritage-green/15 shadow-xs">
                      {lesson.categoryVi}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleBookmark(lesson.id)}
                      className="p-1.5 rounded-full bg-mist-cloud/60 hover:bg-mist-cloud text-heritage-green transition-all cursor-pointer"
                      aria-label="Lưu bài học"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-heritage-green fill-heritage-green" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-heritage-green" />
                      )}
                    </button>
                  </div>

                  {/* Story Title & Summary */}
                  <div>
                    <h3 className="font-serif text-xl font-bold text-heritage-green leading-snug group-hover:text-antique-gold transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1 font-medium italic">
                      {lesson.vietnameseTitle}
                    </p>
                    <p className="text-xs text-text-body mt-2.5 line-clamp-3 leading-relaxed">
                      {lesson.summary}
                    </p>
                  </div>

                  {/* CEFR Badge & Reading Time */}
                  <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase pt-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-md border shadow-xs ${getCefrBadgeStyle(
                        lesson.cefrLevel
                      )}`}
                    >
                      CEFR {lesson.cefrLevel}
                    </span>
                    <span className="flex items-center gap-1 text-text-secondary">
                      <Clock className="w-3.5 h-3.5 text-antique-gold" />
                      {lesson.readTime}
                    </span>
                  </div>
                </div>

                {/* Card Footer: Vocab Count & Read Action */}
                <div className="mt-5 pt-4 border-t border-heritage-green/10 flex items-center justify-between text-xs">
                  <span className="font-semibold text-text-secondary flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-heritage-green" />
                    {lesson.vocabCount} Từ vựng
                  </span>
                  <Link
                    href={`/reader?story=${lesson.id}`}
                    className="font-bold text-heritage-green group-hover:text-antique-gold inline-flex items-center gap-1 transition-colors focus-ring"
                  >
                    <span>Đọc tiếp</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  /* List View Layout */
  return (
    <div className="space-y-4">
      {lessons.map((lesson) => {
        const isBookmarked = !!bookmarks[lesson.id];
        return (
          <article
            key={lesson.id}
            className="group rounded-2xl bg-warm-ivory border border-heritage-green/12 p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-antique-gold/60 focus-ring"
          >
            <div className="flex items-center gap-4 flex-1">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${lesson.gradient} flex items-center justify-center shrink-0 shadow-xs border border-antique-gold/30 overflow-hidden relative`}
              >
                {lesson.imageUrl ? (
                  <img
                    src={lesson.imageUrl}
                    alt={lesson.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-2xl">{lesson.iconSymbol}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCefrBadgeStyle(
                      lesson.cefrLevel
                    )}`}
                  >
                    CEFR {lesson.cefrLevel}
                  </span>
                  <span className="text-[11px] font-bold text-heritage-green bg-heritage-green/10 px-2 py-0.5 rounded">
                    {lesson.categoryVi}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-heritage-green group-hover:text-antique-gold transition-colors leading-snug">
                  {lesson.title}
                </h3>
                <p className="text-xs text-text-secondary italic">
                  {lesson.vietnameseTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-text-body shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-heritage-green/10">
              <div className="flex items-center gap-3 text-text-secondary">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-antique-gold" />
                  {lesson.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-heritage-green" />
                  {lesson.vocabCount} từ vựng
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleBookmark(lesson.id)}
                  className="p-2 rounded-xl bg-rice-paper hover:bg-mist-cloud text-heritage-green transition-colors cursor-pointer"
                  aria-label="Lưu bài học"
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 fill-heritage-green text-heritage-green" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-heritage-green" />
                  )}
                </button>
                <Link
                  href={`/reader?story=${lesson.id}`}
                  className="px-4 py-2 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory font-bold inline-flex items-center gap-1.5 transition-all shadow-xs focus-ring"
                >
                  <span>Đọc bài</span>
                  <ArrowRight className="w-3.5 h-3.5 text-antique-gold" />
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default DiscoveryArticleGrid;
