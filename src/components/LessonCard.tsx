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
        return 'bg-[#BFE3EA]/60 text-[#1E4B43] border-[#9FCED8]';
      case 'B1':
        return 'bg-[#F6EEDC] text-[#1E4B43] border-[#D9B76A]/60';
      case 'B2':
        return 'bg-[#D9B76A]/25 text-[#7A5610] border-[#D9B76A]';
      case 'C1':
        return 'bg-[#E8B7B2]/30 text-[#8C2C24] border-[#E8B7B2]';
    }
  };

  return (
    <div className="heritage-card flex flex-col justify-between overflow-hidden group">
      
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F6EEDC]">
        <img
          src={lesson.imageUrl}
          alt={lesson.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Level Band Stamp */}
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-xs backdrop-blur-xs ${getLevelBadge(lesson.level)}`}>
            Band {lesson.level}
          </span>

          {/* Category Tag */}
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FBF7EE]/90 text-[#1E4B43] border border-[#E8DFCB] shadow-xs backdrop-blur-xs">
            {lesson.categoryNameVi}
          </span>
        </div>

        {/* Bottom stats pill */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-[#2C2523] font-medium">
          <span className="flex items-center gap-1.5 bg-[#FDFBF7]/90 px-2.5 py-1 rounded-full border border-[#E8DFCB] shadow-xs backdrop-blur-xs">
            <Clock className="w-3.5 h-3.5 text-[#D9B76A]" />
            {lesson.readTime}
          </span>
          <span className="flex items-center gap-1.5 bg-[#FDFBF7]/90 px-2.5 py-1 rounded-full border border-[#E8DFCB] shadow-xs backdrop-blur-xs">
            <Volume2 className="w-3.5 h-3.5 text-[#1E4B43]" />
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
            className="font-heading font-bold text-xl text-[#1E4B43] group-hover:text-[#3D6E70] transition-colors line-clamp-2 cursor-pointer mb-1.5 leading-snug"
          >
            {lesson.titleEn}
          </h3>

          {/* Vietnamese Title */}
          <p className="text-xs font-semibold text-[#8C6B28] mb-3 line-clamp-1">
            {lesson.titleVi}
          </p>

          {/* Summary */}
          <p className="text-xs text-[#6B635B] leading-relaxed line-clamp-2 mb-4 font-normal">
            {lesson.summary}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-4 border-t border-[#E8DFCB]">
          <div className="flex items-center justify-between text-xs text-[#6B635B] mb-4 font-normal">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D9B76A] inline-block"></span>
              {lesson.vocabularies.length} từ vựng học thuật
            </span>
            <span className="flex items-center gap-1 text-[#2C2523]">
              <Heart className="w-3.5 h-3.5 text-[#E8B7B2] fill-[#E8B7B2]" />
              {lesson.likes || 140} yêu thích
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onOpenReader(lesson)}
              className="btn-pill-primary py-2.5 text-xs font-semibold"
            >
              <BookOpen className="w-3.5 h-3.5 text-white" />
              <span>Đọc song ngữ</span>
            </button>

            <button
              onClick={() => onOpenFlashcards(lesson)}
              className="btn-pill-glass py-2.5 text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1E4B43]" />
              <span>Flashcards</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
