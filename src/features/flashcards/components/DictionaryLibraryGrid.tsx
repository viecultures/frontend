import {
  ChevronRight,
  BookOpen,
  Clock,
  Sparkles,
  Flame,
  Landmark,
  UtensilsCrossed,
  Palette,
  Mountain,
} from "lucide-react";
import type { Lesson } from "@/data/discoveryData";

interface DictionaryLibraryGridProps {
  lessons: Lesson[];
  onGoToStudy: (lessonId: string) => void;
  onInspectLesson: (lesson: Lesson) => void;
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "Heritage":
      return Landmark;
    case "Cuisine":
      return UtensilsCrossed;
    case "Crafts":
      return Palette;
    case "Nature":
      return Mountain;
    case "Folklore":
      return Sparkles;
    default:
      return BookOpen;
  }
}

export function DictionaryLibraryGrid({
  lessons,
  onGoToStudy,
  onInspectLesson,
}: DictionaryLibraryGridProps) {
  if (lessons.length === 0) {
    return (
      <div className="text-center py-16 bg-surface rounded-3xl border border-line p-8 space-y-3">
        <BookOpen className="w-10 h-10 text-antique-gold mx-auto" />
        <h3 className="font-serif text-lg font-bold text-heritage-green">
          Không tìm thấy bộ từ vựng nào
        </h3>
        <p className="text-xs text-text-secondary">
          Thử tìm kiếm với từ khóa khác hoặc chọn xem "Tất cả" danh mục.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
      {lessons.map((lesson) => {
        const IconComponent = getCategoryIcon(lesson.category);

        return (
          <div
            key={lesson.id}
            className="group relative rounded-3xl bg-surface border border-line p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-antique-gold/70 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            {/* Top Header: Image Thumbnail / Icon Emblem & Category Badge */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                {/* Thumbnail Image with Clean Fallback SVG */}
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-xs shrink-0 border border-line bg-rice-paper flex items-center justify-center group-hover:scale-105 transition-transform">
                  {lesson.imageUrl ? (
                    <img
                      src={lesson.imageUrl}
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <IconComponent className="w-6 h-6 text-heritage-green" />
                  )}
                </div>

                {/* Category Pill & CEFR Badge */}
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-rice-paper text-heritage-green border border-antique-gold/40 shadow-2xs">
                    {lesson.categoryVi}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-heritage-green text-warm-ivory border border-antique-gold/30">
                    {lesson.cefrLevel}
                  </span>
                </div>
              </div>

              {/* Deck Titles */}
              <div>
                <h3 className="font-serif text-base font-bold text-heritage-green group-hover:text-heritage-dark transition-colors leading-snug line-clamp-2">
                  {lesson.title}
                </h3>
                <p className="text-[11px] text-text-secondary italic font-medium truncate mt-1">
                  {lesson.vietnameseTitle}
                </p>
              </div>

              {/* Meta: Read time & Vocab count */}
              <div className="flex items-center gap-3 text-[11px] text-text-secondary font-medium pt-0.5">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-antique-gold" />
                  {lesson.readTime}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-heritage-green font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
                  {lesson.vocabCount} từ vựng
                </span>
              </div>
            </div>

            {/* Bottom Actions: HỌC TỪ MỚI | ÔN TẬP (SRS) | Xem từ điển */}
            <div className="pt-3.5 border-t border-line space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                {/* Button 1: Học từ mới (Heritage Green) */}
                <button
                  onClick={() => onGoToStudy(lesson.id)}
                  className="py-2.5 px-3 rounded-2xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow-md border border-antique-gold/40 focus-ring"
                >
                  <Sparkles className="w-3.5 h-3.5 text-antique-gold shrink-0" />
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[9px] uppercase tracking-wider text-sky-mist font-semibold">
                      HỌC MỚI
                    </span>
                    <span className="text-xs font-bold text-warm-ivory mt-0.5">
                      {lesson.vocabCount} từ
                    </span>
                  </div>
                </button>

                {/* Button 2: Ôn tập SRS (Antique Gold) */}
                <button
                  onClick={() => onGoToStudy(lesson.id)}
                  className="py-2.5 px-3 rounded-2xl bg-antique-gold hover:bg-antique-bright text-heritage-dark font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow-md border border-warm-ivory/50 focus-ring"
                >
                  <Flame className="w-3.5 h-3.5 text-heritage-dark shrink-0" />
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[9px] uppercase tracking-wider text-heritage-dark/80 font-bold">
                      SRS THÔNG MINH
                    </span>
                    <span className="text-xs font-bold text-heritage-dark mt-0.5">
                      Ôn Tập
                    </span>
                  </div>
                </button>
              </div>

              {/* View Dictionary Link */}
              <button
                onClick={() => onInspectLesson(lesson)}
                className="w-full text-center text-[11px] font-bold text-heritage-green hover:text-heritage-dark hover:bg-rice-paper/60 flex items-center justify-center gap-1 transition-colors cursor-pointer py-1.5 rounded-xl border border-transparent hover:border-antique-gold/30 focus-ring"
              >
                <span>Xem từ điển bộ từ</span>
                <ChevronRight className="w-3.5 h-3.5 text-antique-gold group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
