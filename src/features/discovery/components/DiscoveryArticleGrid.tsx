import React from 'react';
import Link from '@/components/Link';
import {
  BookOpen,
  Clock,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Layers,
  Sparkles,
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
        <div className="w-16 h-16 rounded-full bg-mist-cloud flex items-center justify-center mx-auto mb-4 text-heritage-green shadow-xs">
          <Layers className="w-8 h-8 text-antique-gold" />
        </div>
        <h3 className="font-serif text-xl font-bold text-heritage-green">
          Không tìm thấy bài học phù hợp
        </h3>
        <p className="text-sm text-text-body mt-2 max-w-md mx-auto leading-relaxed">
          {onlyBookmarked
            ? 'Bạn chưa lưu bài học nào trong danh mục này. Hãy nhấp biểu tượng đánh dấu để lưu bài viết yêu thích.'
            : 'Không tìm thấy câu chuyện văn hóa nào khớp với các bộ lọc hiện tại. Thử thay đổi từ khóa hoặc bộ lọc.'}
        </p>
        <button
          type="button"
          onClick={onResetAllFilters}
          className="mt-6 px-6 py-2.5 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm transition-all focus-ring cursor-pointer hover:scale-102 active:scale-98"
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
                  <div className="w-full h-full flex items-center justify-center bg-heritage-green text-antique-gold">
                    <Sparkles className="w-10 h-10" />
                  </div>
                )}
                {/* Subtle vignette gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Top Overlay: Category badge & Bookmark */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-heritage-green/90 text-warm-ivory border border-white/20 backdrop-blur-md shadow-xs">
                    {lesson.categoryVi}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleBookmark(lesson.id)}
                    className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-warm-ivory backdrop-blur-md transition-all cursor-pointer shadow-xs"
                    aria-label="Lưu bài học"
                    title={isBookmarked ? "Đã lưu vào danh sách" : "Lưu bài học"}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-antique-gold fill-antique-gold" />
                    ) : (
                      <Bookmark className="w-4 h-4 text-warm-ivory" />
                    )}
                  </button>
                </div>
              </div>

              {/* Card Body & Metadata */}
              <div className="p-6 flex-1 flex flex-col justify-between bg-warm-ivory">
                <div className="space-y-2.5">
                  {/* Story Title & Vietnamese Translation */}
                  <div>
                    <Link
                      href={`/reader?story=${lesson.id}`}
                      className="block group/link focus-ring rounded-lg"
                    >
                      <h3 className="font-serif text-xl font-bold text-heritage-green leading-snug group-hover/link:text-antique-rich transition-colors ink-underline">
                        {lesson.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-text-secondary mt-1 font-medium italic">
                      {lesson.vietnameseTitle}
                    </p>
                    <p className="text-xs text-text-body mt-2.5 line-clamp-3 leading-relaxed">
                      {lesson.summary}
                    </p>
                  </div>

                  {/* Level Badge & Reading Time */}
                  <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase pt-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md border shadow-xs ${getCefrBadgeStyle(
                        lesson.cefrLevel
                      )}`}
                    >
                      {lesson.cefrLevel}
                    </span>
                    <span className="flex items-center gap-1.5 text-text-secondary font-medium">
                      <Clock className="w-3.5 h-3.5 text-antique-gold shrink-0" />
                      <span>{lesson.readTime}</span>
                    </span>
                  </div>
                </div>

                {/* Card Footer: Vocab Count & Read Action */}
                <div className="mt-5 pt-4 border-t border-heritage-green/10 flex items-center justify-between text-xs">
                  <span className="font-semibold text-text-secondary flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-heritage-green" />
                    <span>{lesson.vocabCount} Từ vựng di sản</span>
                  </span>
                  <Link
                    href={`/reader?story=${lesson.id}`}
                    className="font-bold text-heritage-green group-hover:text-antique-rich inline-flex items-center gap-1 transition-colors focus-ring rounded"
                  >
                    <span>Đọc bài</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-antique-gold" />
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
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-heritage-green to-heritage-dark flex items-center justify-center shrink-0 shadow-xs border border-antique-gold/30 overflow-hidden relative"
              >
                {lesson.imageUrl ? (
                  <img
                    src={lesson.imageUrl}
                    alt={lesson.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <Sparkles className="w-6 h-6 text-antique-gold" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCefrBadgeStyle(
                      lesson.cefrLevel
                    )}`}
                  >
                    {lesson.cefrLevel}
                  </span>
                  <span className="text-[11px] font-bold text-heritage-green bg-heritage-green/10 px-2 py-0.5 rounded border border-heritage-green/15">
                    {lesson.categoryVi}
                  </span>
                </div>
                <Link
                  href={`/reader?story=${lesson.id}`}
                  className="block group/title focus-ring rounded"
                >
                  <h3 className="font-serif text-lg font-bold text-heritage-green group-hover/title:text-antique-rich transition-colors leading-snug ink-underline">
                    {lesson.title}
                  </h3>
                </Link>
                <p className="text-xs text-text-secondary italic">
                  {lesson.vietnameseTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-text-body shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-heritage-green/10">
              <div className="flex items-center gap-3 text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-antique-gold shrink-0" />
                  <span>{lesson.readTime}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-heritage-green shrink-0" />
                  <span>{lesson.vocabCount} từ vựng</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleBookmark(lesson.id)}
                  className="p-2 rounded-xl bg-rice-paper hover:bg-mist-cloud text-heritage-green transition-colors cursor-pointer"
                  aria-label="Lưu bài học"
                  title={isBookmarked ? "Đã lưu vào danh sách" : "Lưu bài học"}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 fill-antique-gold text-antique-gold" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-heritage-green" />
                  )}
                </button>
                <Link
                  href={`/reader?story=${lesson.id}`}
                  className="px-4 py-2 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory font-bold inline-flex items-center gap-1.5 transition-all shadow-xs focus-ring hover:scale-102"
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
