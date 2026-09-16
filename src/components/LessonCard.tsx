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
        return 'bg-[#59789F] text-white border-[#12332B]';
      case 'B1':
        return 'bg-[#2A816F] text-white border-[#12332B]';
      case 'B2':
        return 'bg-[#EAA22E] text-[#12332B] border-[#12332B]';
      case 'C1':
        return 'bg-[#925E06] text-white border-[#12332B]';
    }
  };

  return (
    <div className="dongho-card flex flex-col justify-between overflow-hidden bg-[#FFFDF9] group">
      
      {/* Top Image Container with Woodcut Border */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b-2 border-[#12332B] bg-[#F8E9CF]">
        <img
          src={lesson.imageUrl}
          alt={lesson.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Level Band Stamp */}
          <span className={`dongho-tag shadow-[2px_2px_0px_#12332B] ${getLevelBadge(lesson.level)}`}>
            Band {lesson.level}
          </span>

          {/* Category Tag */}
          <span className="dongho-tag bg-[#FAF6EE] text-[#12332B] shadow-[2px_2px_0px_#12332B]">
            {lesson.categoryNameVi}
          </span>
        </div>

        {/* Bottom stats pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#12332B] font-bold">
          <span className="flex items-center gap-1.5 bg-[#FAF6EE]/95 px-2.5 py-1 rounded-[2px] border border-[#12332B] shadow-[1px_1px_0px_#12332B]">
            <Clock className="w-3.5 h-3.5 text-[#EAA22E]" />
            {lesson.readTime}
          </span>
          <span className="flex items-center gap-1.5 bg-[#FAF6EE]/95 px-2.5 py-1 rounded-[2px] border border-[#12332B] shadow-[1px_1px_0px_#12332B]">
            <Volume2 className="w-3.5 h-3.5 text-[#1A7368]" />
            AI Shadowing
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* English Title */}
          <h3 
            onClick={() => onOpenReader(lesson)}
            className="font-heading font-bold text-xl text-[#12332B] group-hover:text-[#1A7368] transition-colors line-clamp-2 cursor-pointer mb-1.5 leading-snug"
          >
            {lesson.titleEn}
          </h3>

          {/* Vietnamese Title */}
          <p className="text-xs font-bold text-[#1A7368] mb-3 line-clamp-1">
            {lesson.titleVi}
          </p>

          {/* Summary */}
          <p className="text-xs text-[#4A635D] leading-relaxed line-clamp-2 mb-4">
            {lesson.summary}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-4 border-t-2 border-[#12332B]/10">
          <div className="flex items-center justify-between text-xs text-[#4A635D] mb-4 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EAA22E] inline-block border border-[#12332B]"></span>
              {lesson.vocabularies.length} từ vựng học thuật
            </span>
            <span className="flex items-center gap-1 text-[#12332B]">
              <Heart className="w-3.5 h-3.5 text-[#E58396] fill-[#E58396]" />
              {lesson.likes || 140} yêu thích
            </span>
          </div>

          {/* Action Woodcut Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onOpenReader(lesson)}
              className="dongho-btn dongho-btn-primary py-2.5 text-xs font-bold"
            >
              <BookOpen className="w-3.5 h-3.5 text-white" />
              <span>Đọc song ngữ</span>
            </button>

            <button
              onClick={() => onOpenFlashcards(lesson)}
              className="dongho-btn dongho-btn-paper py-2.5 text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#EAA22E]" />
              <span>Luyện Flashcards</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
