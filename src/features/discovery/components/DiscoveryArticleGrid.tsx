import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from '@/components/Link';
import {
  BookOpen,
  Clock,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Layers,
} from 'lucide-react';
import {
  type Lesson,
  type LevelType,
  getCefrBadgeStyle,
  getLessonStatsForLevel,
} from '@/data/discoveryData';
import { ArticleCardSkeleton } from '@/components/ui/skeleton';
import { paths } from '@/routes/paths';

interface DiscoveryArticleGridProps {
  isLoading: boolean;
  lessons: Lesson[];
  viewMode: 'grid' | 'list';
  bookmarks: Record<string, boolean>;
  onToggleBookmark: (id: string) => void;
  onlyBookmarked: boolean;
  onResetAllFilters: () => void;
  selectedCefr?: string;
}

const ALL_LEVELS: LevelType[] = ['Level 1', 'Level 2', 'Level 3'];

export const DiscoveryArticleGrid: React.FC<DiscoveryArticleGridProps> = ({
  isLoading,
  lessons,
  viewMode,
  bookmarks,
  onToggleBookmark,
  onlyBookmarked,
  onResetAllFilters,
  selectedCefr = 'All',
}) => {
  const { t } = useTranslation('discovery');

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
          {t('article_grid.empty_title')}
        </h3>
        <p className="text-sm text-text-body mt-2 max-w-md mx-auto leading-relaxed">
          {onlyBookmarked
            ? t('article_grid.empty_saved_desc')
            : t('article_grid.empty_general_desc')}
        </p>
        <button
          type="button"
          onClick={onResetAllFilters}
          className="mt-6 px-6 py-2.5 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm transition-all focus-ring cursor-pointer hover:scale-102 active:scale-98"
        >
          {t('article_grid.reset_filters_btn')}
        </button>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {lessons.map((lesson) => {
          const isBookmarked = !!bookmarks[lesson.id];
          const currentStats = getLessonStatsForLevel(lesson, selectedCefr);
          const activeLevel: LevelType =
            selectedCefr !== 'All' ? (selectedCefr as LevelType) : lesson.cefrLevel;

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
                    <BookOpen className="w-10 h-10" />
                  </div>
                )}
                {/* Subtle vignette gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Top Overlay: Category badge & Bookmark */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-heritage-green/90 text-warm-ivory border border-white/20 backdrop-blur-md shadow-xs">
                      {lesson.categoryVi}
                    </span>
                    {lesson.isFromDatabase && (
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-600/90 text-warm-ivory border border-white/25 backdrop-blur-md shadow-xs flex items-center gap-1">
                        <BookOpen className="w-2.5 h-2.5 text-antique-gold" />
                        <span>{t('article_grid.database_badge')}</span>
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleBookmark(lesson.id)}
                    className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-warm-ivory backdrop-blur-md transition-all cursor-pointer shadow-xs"
                    aria-label={t('article_grid.save_lesson_aria')}
                    title={isBookmarked ? t('article_grid.saved_status_title') : t('article_grid.save_lesson_title')}
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
                {/* Top Section: Title, Subtitle, and Summary with fixed line heights */}
                <div className="space-y-1.5 flex-1">
                  <Link
                    href={paths.reader({ story: lesson.id, level: activeLevel })}
                    className="block group/link focus-ring rounded-lg"
                  >
                    <h3 className="font-serif text-xl font-bold text-heritage-green leading-snug group-hover/link:text-antique-rich transition-colors ink-underline line-clamp-2 h-[3.25rem] flex items-start">
                      {lesson.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-text-secondary font-medium italic line-clamp-1 h-[1.15rem] truncate">
                    {lesson.vietnameseTitle}
                  </p>
                  <p className="text-xs text-text-body mt-2 line-clamp-3 h-[3.6rem] leading-relaxed">
                    {currentStats.cefrLevel && lesson.levelDetails?.[currentStats.cefrLevel]?.summary
                      ? lesson.levelDetails[currentStats.cefrLevel].summary
                      : lesson.summary}
                  </p>
                </div>

                {/* Bottom Section: Perfectly Aligned 3 Level Pills and Footer */}
                <div className="mt-4 pt-1 space-y-3">
                  {/* 3 Level Pills Selector & Reading Time */}
                  <div className="flex items-center justify-between text-[11px] font-bold tracking-wider">
                    <div className="flex items-center gap-1.5" title={t('article_grid.choose_reading_level')}>
                      {ALL_LEVELS.map((lvl) => {
                        const isSelected = selectedCefr === lvl;
                        return (
                          <Link
                            key={lvl}
                            href={paths.reader({ story: lesson.id, level: lvl })}
                            className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider border transition-all focus-ring hover:scale-105 active:scale-95 ${
                              selectedCefr === 'All'
                                ? getCefrBadgeStyle(lvl) + ' shadow-2xs'
                                : isSelected
                                ? getCefrBadgeStyle(lvl) + ' shadow-sm ring-2 ring-antique-gold/70 scale-105'
                                : 'bg-rice-paper text-text-secondary/70 border-heritage-green/15 opacity-55 hover:opacity-100 hover:text-heritage-green'
                            }`}
                            title={t('article_grid.read_with_level', { level: lvl })}
                          >
                            {lvl}
                          </Link>
                        );
                      })}
                    </div>
                    <span className="flex items-center gap-1 text-text-secondary font-medium text-xs shrink-0">
                      <Clock className="w-3.5 h-3.5 text-antique-gold shrink-0" />
                      <span>{currentStats.readTime}</span>
                    </span>
                  </div>

                  {/* Card Footer: Vocab Count & Read Action */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-semibold text-text-secondary flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-heritage-green" />
                      <span>{t('article_grid.heritage_vocab_count', { count: currentStats.vocabCount })}</span>
                    </span>
                    <Link
                      href={paths.reader({ story: lesson.id, level: activeLevel })}
                      className="font-bold text-heritage-green group-hover:text-antique-rich inline-flex items-center gap-1 transition-colors focus-ring rounded"
                    >
                      <span>{t('article_grid.read_article')}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-antique-gold" />
                    </Link>
                  </div>
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
        const currentStats = getLessonStatsForLevel(lesson, selectedCefr);
        const activeLevel: LevelType =
          selectedCefr !== 'All' ? (selectedCefr as LevelType) : lesson.cefrLevel;

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
                  <BookOpen className="w-6 h-6 text-antique-gold" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <div className="flex items-center gap-1" title={t('article_grid.choose_reading_level')}>
                    {ALL_LEVELS.map((lvl) => {
                      const isSelected = selectedCefr === lvl;
                      return (
                        <Link
                          key={lvl}
                          href={paths.reader({ story: lesson.id, level: lvl })}
                          className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold border transition-all hover:scale-105 active:scale-95 ${
                            selectedCefr === 'All'
                              ? getCefrBadgeStyle(lvl)
                              : isSelected
                              ? getCefrBadgeStyle(lvl) + ' shadow-sm ring-2 ring-antique-gold/70'
                              : 'bg-rice-paper text-text-secondary/70 border-heritage-green/15 opacity-55 hover:opacity-100 hover:text-heritage-green'
                          }`}
                          title={t('article_grid.read_with_level', { level: lvl })}
                        >
                          {lvl}
                        </Link>
                      );
                    })}
                  </div>
                  <span className="text-[11px] font-bold text-heritage-green bg-heritage-green/10 px-2 py-0.5 rounded border border-heritage-green/15">
                    {lesson.categoryVi}
                  </span>
                  {lesson.isFromDatabase && (
                    <span className="text-[10px] font-bold text-warm-ivory bg-emerald-600 px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <BookOpen className="w-2.5 h-2.5 text-antique-gold" />
                      <span>{t('article_grid.database_badge')}</span>
                    </span>
                  )}
                </div>
                <Link
                  href={paths.reader({ story: lesson.id, level: activeLevel })}
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

            <div className="flex items-center gap-4 text-xs font-semibold text-text-body shrink-0 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0">
              <div className="flex items-center gap-3 text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-antique-gold shrink-0" />
                  <span>{currentStats.readTime}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-heritage-green shrink-0" />
                  <span>{t('article_grid.vocab_count', { count: currentStats.vocabCount })}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleBookmark(lesson.id)}
                  className="p-2 rounded-xl bg-rice-paper hover:bg-mist-cloud text-heritage-green transition-colors cursor-pointer"
                  aria-label={t('article_grid.save_lesson_aria')}
                  title={isBookmarked ? t('article_grid.saved_status_title') : t('article_grid.save_lesson_title')}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 fill-antique-gold text-antique-gold" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-heritage-green" />
                  )}
                </button>
                <Link
                  href={paths.reader({ story: lesson.id, level: activeLevel })}
                  className="px-4 py-2 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory font-bold inline-flex items-center gap-1.5 transition-all shadow-xs focus-ring hover:scale-102"
                >
                  <span>{t('article_grid.read_article')}</span>
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