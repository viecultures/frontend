import { ArrowRight, BookOpen, Layers, SearchX } from "lucide-react";
import type { Lesson } from "@/data/discoveryData";
import { resolveDeckCards } from "@/data/flashcardsData";
import { DeckCoverIllustration } from "./DeckCoverIllustration";

interface DictionaryLibraryGridProps {
  lessons: Lesson[];
  onGoToStudy: (lessonId: string) => void;
  onInspectLesson: (lesson: Lesson) => void;
}

export function DictionaryLibraryGrid({ lessons, onGoToStudy, onInspectLesson }: DictionaryLibraryGridProps) {
  if (!lessons.length) return (
    <div className="vocab-empty" role="status"><SearchX size={32} /><h3>Chưa tìm thấy bộ từ phù hợp</h3><p>Thử một từ khóa khác hoặc chọn “Tất cả” chủ đề nhé.</p></div>
  );
  return (
    <div className="vocab-library-grid">
      {lessons.map((lesson) => (
        <article className="vocab-deck" key={lesson.id}>
          <button className={`vocab-deck-cover bg-gradient-to-br ${lesson.gradient}`} onClick={() => onInspectLesson(lesson)} aria-label={`Xem bộ từ ${lesson.vietnameseTitle}`}>
            <DeckCoverIllustration category={lesson.category} className="vocab-deck-art" />
            <span className="vocab-deck-category">{lesson.categoryVi}</span>
            <span className="vocab-deck-level">{lesson.cefrLevel}</span>
          </button>
          <div className="vocab-deck-body">
            <p className="vocab-deck-meta"><Layers size={14} />{resolveDeckCards(lesson.id).length} thẻ từ vựng<span>EN / VI</span></p>
            <h3><button onClick={() => onInspectLesson(lesson)}>{lesson.vietnameseTitle}</button></h3>
            <p className="vocab-deck-subtitle">{lesson.title}</p>
            <div className="vocab-deck-footer">
              <button className="vocab-deck-preview" onClick={() => onInspectLesson(lesson)}><BookOpen size={15} /> Xem từ vựng</button>
              <button className="vocab-deck-study" onClick={() => onGoToStudy(lesson.id)}>Học ngay <ArrowRight size={15} /></button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
