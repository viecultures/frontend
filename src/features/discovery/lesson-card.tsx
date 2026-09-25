import React from 'react';
import { BookOpen, Sparkles, Clock, Volume2, Heart } from 'lucide-react';
import type { Lesson, CEFRLevel } from '@/types';

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
        return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
      case 'B1':
        return 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30';
      case 'B2':
        return 'bg-amber-500/20 text-amber-200 border-amber-400/30';
      case 'C1':
        return 'bg-purple-500/20 text-purple-200 border-purple-400/30';
    }
  };

  return (
    <div className="glass-card flex flex-col justify-between overflow-hidden group">
      
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
        <img
          src={lesson.imageUrl}
          alt={lesson.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        
        {/* Subtle Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1C18] via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          {/* Level Band Stamp */}
          <span className={`px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border backdrop-blur-md ${getLevelBadge(lesson.level)}`}>
            Band {lesson.level}
          </span>

          {/* Category Tag */}
          <span className="px-3 py-0.5 rounded-full text-[11px] font-medium bg-black/50 text-white/90 border border-white/15 backdrop-blur-md">
            {lesson.categoryNameVi}
          </span>
        </div>

        {/* Bottom stats pill */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-white/80 font-medium">
          <span className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
            <Clock className="w-3.5 h-3.5 text-[#F5D280]" />
            {lesson.readTime}
          </span>
          <span className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
            <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
            AI Shadowing
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* English Title */}
          <h3 
            onClick={() => onOpenReader(lesson)}
            className="font-heading font-bold text-xl text-white group-hover:text-[#FCE5B5] transition-colors line-clamp-2 cursor-pointer mb-1.5 leading-snug"
          >
            {lesson.titleEn}
          </h3>

          {/* Vietnamese Title */}
          <p className="text-xs font-medium text-[#F7E5C3] mb-3 line-clamp-1">
            {lesson.titleVi}
          </p>

          {/* Summary */}
          <p className="text-xs text-white/70 leading-relaxed line-clamp-2 mb-4">
            {lesson.summary}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-white/60 mb-4 font-normal">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F5D280] inline-block"></span>
              {lesson.vocabularies.length} từ vựng học thuật
            </span>
            <span className="flex items-center gap-1 text-white/70">
              <Heart className="w-3.5 h-3.5 text-[#E58396] fill-[#E58396]/50" />
              {lesson.likes || 140} yêu thích
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onOpenReader(lesson)}
              className="btn-pill-primary py-2.5 text-xs font-semibold"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#18221E]" />
              <span>Đọc song ngữ</span>
            </button>

            <button
              onClick={() => onOpenFlashcards(lesson)}
              className="btn-pill-glass py-2.5 text-xs font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F5D280]" />
              <span>Flashcards</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
