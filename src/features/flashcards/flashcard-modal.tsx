import React, { useState, useEffect } from 'react';
import { 
  X, RotateCw, Volume2, CheckCircle2, RotateCcw, 
  Sparkles, ArrowRight, Lightbulb, Zap 
} from 'lucide-react';
import type { Lesson, VocabItem } from '@/types';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0D1C18]/95 border border-white/20 rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-white/10 text-[#F5D280] flex items-center justify-center border border-white/15">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-semibold border border-amber-500/30">
                  Flashcard 3D • Lặp Ngắt Quãng
                </span>
              </div>
              <h2 className="font-heading font-bold text-base sm:text-lg text-white line-clamp-1">
                {lesson.titleEn}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Counter */}
        {!isCompleted && (
          <div className="px-6 py-3 bg-black/30 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-white/80">
              <span>Thẻ {currentIndex + 1} / {queue.length}</span>
              <span>•</span>
              <span className="text-emerald-300 font-semibold">Đã nhớ: {masteredCount}</span>
              <span>•</span>
              <span className="text-[#F5D280] font-semibold">Cần ôn: {reviewCount}</span>
            </div>

            <div className="w-32 bg-white/10 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#FCE5B5] to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${((currentIndex) / queue.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center min-h-[360px]">
          
          {!isCompleted ? (
            <div className="w-full max-w-lg perspective-1000">
              
              {/* 3D Flip Card */}
              <div
                onClick={handleFlip}
                className={`relative w-full min-h-[310px] cursor-pointer rounded-[20px] transition-transform duration-500 transform-style-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                
                {/* FRONT OF CARD */}
                <div className="absolute inset-0 backface-hidden w-full h-full bg-gradient-to-br from-[#122A22] to-[#0A1613] border border-white/20 rounded-[20px] p-8 flex flex-col justify-between shadow-2xl text-center">
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 font-medium">
                      MẶT 1: TỪ VỰNG &amp; NGỮ CẢNH
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/30 font-semibold">
                      Band {currentCard?.level}
                    </span>
                  </div>

                  <div className="my-6">
                    <h3 className="font-heading font-bold text-4xl sm:text-5xl text-[#FCE5B5] tracking-tight mb-2 drop-shadow-md">
                      {currentCard?.word}
                    </h3>
                    <p className="text-xs font-mono text-white/60 italic">
                      ({currentCard?.pos})
                    </p>
                  </div>

                  {/* Context Sentence */}
                  <div className="bg-black/40 p-4 rounded-[16px] border border-white/10 text-left">
                    <div className="text-xs font-semibold text-[#F5D280] mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5" /> Câu ngữ cảnh gốc trong bài đọc:
                    </div>
                    <p className="text-xs sm:text-sm text-white/90 italic leading-relaxed">
                      "{currentCard?.contextSentence}"
                    </p>
                  </div>

                  <div className="text-xs text-white/60 flex items-center justify-center gap-1.5 pt-2">
                    <RotateCw className="w-3.5 h-3.5 text-[#F5D280]" />
                    <span>Bấm hoặc nhấn <kbd className="px-2 py-0.5 bg-white/10 rounded-full text-white font-mono text-[11px]">Space</kbd> để lật thẻ</span>
                  </div>
                </div>

                {/* BACK OF CARD */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full bg-gradient-to-br from-[#16382D] to-[#0D1C18] border border-emerald-400/40 rounded-[20px] p-8 flex flex-col justify-between shadow-2xl text-center">
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
                      MẶT 2: GIẢI NGHĨA &amp; PHÁT ÂM
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(currentCard?.word);
                      }}
                      className="btn-pill-glass text-xs px-3 py-1"
                    >
                      <Volume2 className="w-4 h-4 text-[#F5D280]" />
                      <span>Nghe AI</span>
                    </button>
                  </div>

                  <div className="my-4">
                    <div className="text-sm font-mono text-white/80 bg-black/40 inline-block px-3 py-1 rounded-full border border-white/15 mb-2">
                      {currentCard?.ipa}
                    </div>
                    <h4 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">
                      {currentCard?.vietnameseMeaning}
                    </h4>
                    {currentCard?.usageNote && (
                      <p className="text-xs text-white/80 bg-black/30 p-3 rounded-[12px] border border-white/10 max-w-sm mx-auto">
                        💡 {currentCard.usageNote}
                      </p>
                    )}
                  </div>

                  {/* Spaced Repetition Indicator */}
                  <div className="bg-black/40 p-3 rounded-[14px] border border-white/10 text-xs text-white/80 flex items-center justify-around">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-[#F5D280]" />
                      <span>Chu kỳ lặp: <strong>1 ngày ➔ 3 ngày ➔ 7 ngày</strong></span>
                    </div>
                  </div>

                  <div className="text-xs text-white/60 pt-1">
                    Hãy đánh giá mức độ ghi nhớ của bạn bên dưới 👇
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* COMPLETION SCREEN */
            <div className="text-center py-8 px-4 max-w-md">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="font-heading font-bold text-3xl text-white mb-2">
                Xuất Sắc! Hoàn Thành Phiên Ôn
              </h3>
              <p className="text-xs text-white/75 mb-6 leading-relaxed">
                Tất cả từ vựng học thuật của bài đọc <strong>"{lesson.titleEn}"</strong> đã được đưa vào chu trình lặp ngắt quãng (Spaced Repetition).
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-black/40 p-4 rounded-[16px] border border-white/10">
                  <div className="text-2xl font-bold text-emerald-300">{masteredCount}</div>
                  <div className="text-xs text-white/60">Từ đã ghi nhớ</div>
                </div>
                <div className="bg-black/40 p-4 rounded-[16px] border border-white/10">
                  <div className="text-2xl font-bold text-[#FCE5B5]">1 Ngày</div>
                  <div className="text-xs text-white/60">Lần nhắc ôn kế tiếp</div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => onOpenReflections(lesson)}
                  className="btn-pill-primary w-full py-3.5 text-xs font-semibold"
                >
                  <span>Viết Cảm Nghĩ Bằng Từ Vừa Học</span>
                  <ArrowRight className="w-4 h-4 text-[#18221E]" />
                </button>
                <button
                  onClick={handleRestart}
                  className="btn-pill-glass w-full py-3 text-xs font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ôn tập lại từ đầu</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Binary Control Bar */}
        {!isCompleted && isFlipped && (
          <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex items-center justify-between gap-4">
            <button
              onClick={handleNeedsReview}
              className="flex-1 py-3.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>🔴 Cần ôn lại (← Phím Trái)</span>
            </button>

            <button
              onClick={handleMastered}
              className="flex-1 py-3.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/30 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
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
