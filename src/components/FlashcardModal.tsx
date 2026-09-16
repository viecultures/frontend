import React, { useState, useEffect } from 'react';
import { 
  X, RotateCw, Volume2, CheckCircle2, RotateCcw, 
  Sparkles, ArrowRight, Lightbulb, Zap 
} from 'lucide-react';
import type { Lesson, VocabItem } from '../types';

interface FlashcardModalProps {
  lesson: Lesson;
  onClose: () => void;
  onOpenReflections: (lesson: Lesson) => void;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({
  lesson,
  onClose,
  onOpenReflections,
}) => {
  const [queue, setQueue] = useState<VocabItem[]>([...lesson.vocabularies]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredCount, setMasteredCount] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentCard = queue[currentIndex];

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowLeft' && isFlipped) {
        handleNeedsReview();
      } else if (e.code === 'ArrowRight' && isFlipped) {
        handleMastered();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, isCompleted, currentIndex, queue]);

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
    if (!isFlipped && currentCard) {
      speakWord(currentCard.word);
    }
  };

  const handleMastered = () => {
    setMasteredCount(prev => prev + 1);
    setIsFlipped(false);
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleNeedsReview = () => {
    setReviewCount(prev => prev + 1);
    setIsFlipped(false);
    const updatedQueue = [...queue, currentCard];
    setQueue(updatedQueue);
    setCurrentIndex(prev => prev + 1);
  };

  const handleRestart = () => {
    setQueue([...lesson.vocabularies]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCount(0);
    setReviewCount(0);
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#12332B]/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF6EE] border-2 border-[#12332B] rounded-[4px] shadow-[10px_10px_0px_#12332B] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#12332B] bg-[#F8E9CF]">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-[3px] bg-[#EAA22E] text-[#12332B] flex items-center justify-center border-2 border-[#12332B] shadow-[2px_2px_0px_#12332B]">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="dongho-tag bg-[#1A7368] text-white text-[10px]">
                  Flashcard 3D Mộc Bản • Lặp Ngắt Quãng
                </span>
              </div>
              <h2 className="font-heading font-bold text-base sm:text-lg text-[#12332B] line-clamp-1">
                {lesson.titleEn}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-[3px] border border-[#12332B] bg-[#FAF6EE] text-[#12332B] hover:bg-[#E58396] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Counter */}
        {!isCompleted && (
          <div className="px-6 py-3 bg-[#FAF6EE] border-b-2 border-[#12332B] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#12332B]">
              <span>Thẻ {currentIndex + 1} / {queue.length}</span>
              <span>•</span>
              <span className="text-[#1A7368]">Đã nhớ: {masteredCount}</span>
              <span>•</span>
              <span className="text-[#925E06]">Cần ôn: {reviewCount}</span>
            </div>

            <div className="w-32 bg-[#F8E9CF] h-2.5 rounded-[2px] border border-[#12332B] overflow-hidden">
              <div 
                className="bg-[#1A7368] h-full transition-all duration-300"
                style={{ width: `${((currentIndex) / queue.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center min-h-[360px] bg-[#FAF6EE]">
          
          {!isCompleted ? (
            <div className="w-full max-w-lg perspective-1000">
              
              {/* 3D Flip Card */}
              <div
                onClick={handleFlip}
                className={`relative w-full min-h-[300px] cursor-pointer rounded-[4px] transition-transform duration-500 transform-style-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                
                {/* FRONT OF CARD */}
                <div className="absolute inset-0 backface-hidden w-full h-full bg-[#FFFDF9] border-2 border-[#12332B] rounded-[4px] p-8 flex flex-col justify-between shadow-[6px_6px_0px_#12332B] text-center">
                  <div className="flex items-center justify-between text-xs text-[#12332B]">
                    <span className="dongho-tag bg-[#F8E9CF] text-[#12332B]">
                      MẶT 1: TỪ VỰNG &amp; NGỮ CẢNH
                    </span>
                    <span className="dongho-tag bg-[#EAA22E] text-[#12332B]">
                      Band {currentCard?.level}
                    </span>
                  </div>

                  <div className="my-6">
                    <h3 className="font-heading font-bold text-4xl sm:text-5xl text-[#1A7368] tracking-tight mb-2">
                      {currentCard?.word}
                    </h3>
                    <p className="text-xs font-mono font-bold text-[#4A635D] italic">
                      ({currentCard?.pos})
                    </p>
                  </div>

                  {/* Context Sentence */}
                  <div className="bg-[#FAF6EE] p-4 rounded-[2px] border-2 border-[#12332B]/30 text-left">
                    <div className="text-xs font-bold text-[#1A7368] mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5" /> Câu ngữ cảnh gốc trong bài đọc:
                    </div>
                    <p className="text-xs sm:text-sm text-[#12332B] italic leading-relaxed">
                      "{currentCard?.contextSentence}"
                    </p>
                  </div>

                  <div className="text-xs font-bold text-[#4A635D] flex items-center justify-center gap-1.5 pt-2">
                    <RotateCw className="w-3.5 h-3.5 text-[#EAA22E]" />
                    <span>Bấm hoặc nhấn <kbd className="px-2 py-0.5 bg-[#F8E9CF] border border-[#12332B] rounded-[2px] text-[#12332B] font-mono">Space</kbd> để lật thẻ</span>
                  </div>
                </div>

                {/* BACK OF CARD */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full bg-[#F8E9CF] border-2 border-[#12332B] rounded-[4px] p-8 flex flex-col justify-between shadow-[6px_6px_0px_#12332B] text-center">
                  <div className="flex items-center justify-between text-xs text-[#12332B]">
                    <span className="dongho-tag bg-[#1A7368] text-white">
                      MẶT 2: GIẢI NGHĨA &amp; PHÁT ÂM
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(currentCard?.word);
                      }}
                      className="dongho-btn dongho-btn-paper text-xs px-2.5 py-1"
                    >
                      <Volume2 className="w-4 h-4 text-[#1A7368]" />
                      <span>Nghe AI</span>
                    </button>
                  </div>

                  <div className="my-4">
                    <div className="text-sm font-mono font-bold text-[#12332B] bg-[#FAF6EE] inline-block px-3 py-1 rounded-[2px] border border-[#12332B] mb-2">
                      {currentCard?.ipa}
                    </div>
                    <h4 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A7368] mb-2">
                      {currentCard?.vietnameseMeaning}
                    </h4>
                    {currentCard?.usageNote && (
                      <p className="text-xs text-[#4A635D] bg-[#FAF6EE] p-3 rounded-[2px] border border-[#12332B]/30 max-w-sm mx-auto">
                        💡 {currentCard.usageNote}
                      </p>
                    )}
                  </div>

                  {/* Spaced Repetition Indicator */}
                  <div className="bg-[#FAF6EE] p-3 rounded-[2px] border border-[#12332B] text-xs font-bold text-[#12332B] flex items-center justify-around">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-[#EAA22E]" />
                      <span>Chu kỳ lặp: <strong>1 ngày ➔ 3 ngày ➔ 7 ngày</strong></span>
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-[#4A635D] pt-1">
                    Hãy tự đánh giá mức độ ghi nhớ của bạn bên dưới 👇
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* COMPLETION SCREEN */
            <div className="text-center py-8 px-4 max-w-md">
              <div className="w-16 h-16 rounded-[4px] bg-[#1A7368] text-white border-2 border-[#12332B] shadow-[4px_4px_0px_#12332B] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="font-heading font-bold text-3xl text-[#12332B] mb-2">
                Xuất Sắc! Hoàn Thành Phiên Ôn
              </h3>
              <p className="text-xs text-[#4A635D] mb-6 leading-relaxed">
                Tất cả từ vựng học thuật của bài đọc <strong>"{lesson.titleEn}"</strong> đã được đưa vào chu trình lặp ngắt quãng (Spaced Repetition).
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#FFFDF9] p-3.5 rounded-[3px] border-2 border-[#12332B] shadow-[2px_2px_0px_#12332B]">
                  <div className="text-2xl font-bold text-[#1A7368]">{masteredCount}</div>
                  <div className="text-xs font-bold text-[#4A635D]">Từ đã ghi nhớ</div>
                </div>
                <div className="bg-[#FFFDF9] p-3.5 rounded-[3px] border-2 border-[#12332B] shadow-[2px_2px_0px_#12332B]">
                  <div className="text-2xl font-bold text-[#EAA22E]">1 Ngày</div>
                  <div className="text-xs font-bold text-[#4A635D]">Lần nhắc ôn kế tiếp</div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => onOpenReflections(lesson)}
                  className="dongho-btn dongho-btn-primary w-full py-3.5 text-xs font-bold shadow-[4px_4px_0px_#12332B]"
                >
                  <span>Viết Cảm Nghĩ Bằng Từ Vừa Học</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRestart}
                  className="dongho-btn dongho-btn-paper w-full py-3 text-xs font-bold"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ôn tập lại từ đầu</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Binary Control Bar in Dong Ho Woodcut Style */}
        {!isCompleted && isFlipped && (
          <div className="px-6 py-4 border-t-2 border-[#12332B] bg-[#F8E9CF] flex items-center justify-between gap-4">
            {/* Red / Needs review */}
            <button
              onClick={handleNeedsReview}
              className="flex-1 py-3.5 rounded-[3px] bg-[#E58396] hover:bg-[#d86d82] text-[#12332B] border-2 border-[#12332B] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[3px_3px_0px_#12332B] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>🔴 Cần ôn lại (← Phím Trái)</span>
            </button>

            {/* Green / Mastered */}
            <button
              onClick={handleMastered}
              className="flex-1 py-3.5 rounded-[3px] bg-[#1A7368] hover:bg-[#13584F] text-white border-2 border-[#12332B] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[3px_3px_0px_#12332B] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>🟢 Đã nhớ (Phím Phải →)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
