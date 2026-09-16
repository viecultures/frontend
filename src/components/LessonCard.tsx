import React from 'react';
import { BookOpen, Sparkles, Clock, Volume2, Heart } from 'lucide-react';
import type { Lesson, CEFRLevel } from '../types';

interface LessonCardProps {
  lesson: Lesson;
  onOpenReader: (lesson: Lesson) => void;
  onOpenFlashcards: (lesson: Lesson) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  onOpenReader,
  onOpenFlashcards,
}) => {
  const getLevelBadge = (level: CEFRLevel) => {
    switch (level) {
      case 'A2':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/40';
      case 'B1':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
      case 'B2':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'C1':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/40';
    }
  };

  return (
    <div className="group flex flex-col bg-slate-900/70 rounded-3xl border border-slate-800 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/40 transition-all duration-300 overflow-hidden">
      
      {/* Image Container with Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <img
          src={lesson.imageUrl}
          alt={lesson.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        
        {/* Subtle Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          {/* Level Band Badge */}
          <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${getLevelBadge(lesson.level)}`}>
            Band {lesson.level}
          </span>

          {/* Category Pill */}
          <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-950/80 text-slate-200 border border-slate-700/60 backdrop-blur-md">
            {lesson.categoryNameVi}
          </span>
        </div>

        {/* Bottom stats inside image */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-slate-300 font-medium">
          <span className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg backdrop-blur-md border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {lesson.readTime}
          </span>
          <span className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg backdrop-blur-md border border-slate-800">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            AI Shadowing
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* English Title */}
          <h3 
            onClick={() => onOpenReader(lesson)}
            className="font-serif font-bold text-lg text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2 cursor-pointer mb-1.5 leading-snug"
          >
            {lesson.titleEn}
          </h3>

          {/* Vietnamese Subtitle */}
          <p className="text-xs font-medium text-emerald-400/90 mb-3 line-clamp-1">
            {lesson.titleVi}
          </p>

          {/* Summary */}
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
            {lesson.summary}
          </p>
        </div>

        {/* Vocab count & actions footer */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              {lesson.vocabularies.length} từ vựng học thuật
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500/20" />
              {lesson.likes || 120} yêu thích
            </span>
          </div>

          {/* Buttons CTA */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onOpenReader(lesson)}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 hover:border-transparent font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Đọc song ngữ</span>
            </button>

            <button
              onClick={() => onOpenFlashcards(lesson)}
              className="px-3.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-400 text-amber-300 hover:text-slate-950 border border-amber-500/30 hover:border-transparent font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Luyện Flashcards</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
