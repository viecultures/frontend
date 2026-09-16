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
  // Queue of cards
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

  // Keyboard navigation shortcuts
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

  // Binary evaluation: Mastered
  const handleMastered = () => {
    setMasteredCount(prev => prev + 1);
    setIsFlipped(false);
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  // Binary evaluation: Needs Review (Re-insert at the end of queue)
  const handleNeedsReview = () => {
    setReviewCount(prev => prev + 1);
    setIsFlipped(false);
    
    // Add current card to the end of the queue
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                  Flashcard 3D • Spaced Repetition
                </span>
              </div>
              <h2 className="font-serif font-bold text-sm sm:text-base text-slate-100 line-clamp-1">
                {lesson.titleEn}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar & Counter */}
        {!isCompleted && (
          <div className="px-6 py-3 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <span>Thẻ {currentIndex + 1} / {queue.length}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">Đã nhớ: {masteredCount}</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400">Cần ôn: {reviewCount}</span>
            </div>

            <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-300"
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
                className={`relative w-full min-h-[300px] cursor-pointer rounded-3xl transition-transform duration-500 transform-style-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                
                {/* FRONT OF CARD */}
                <div className="absolute inset-0 backface-hidden w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-amber-500/40 hover:border-amber-400 rounded-3xl p-8 flex flex-col justify-between shadow-xl shadow-amber-950/20 text-center">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 font-bold border border-slate-700">
                      MẶT 1: TỪ VỰNG & NGỮ CẢNH
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold">
                      Band {currentCard?.level}
                    </span>
                  </div>

                  <div className="my-6">
                    <h3 className="font-serif font-bold text-3xl sm:text-4xl text-amber-300 tracking-tight mb-2">
                      {currentCard?.word}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono italic">
                      ({currentCard?.pos})
                    </p>
                  </div>

                  {/* Context Sentence (Mandatory rule from document) */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-left">
                    <div className="text-[11px] font-bold text-emerald-400 mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5" /> Câu ngữ cảnh gốc trong bài đọc:
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                      "{currentCard?.contextSentence}"
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-2">
                    <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Bấm hoặc nhấn <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono">Space</kbd> để lật thẻ</span>
                  </div>
                </div>

                {/* BACK OF CARD */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full bg-gradient-to-br from-slate-900 to-emerald-950/40 border-2 border-emerald-500/50 rounded-3xl p-8 flex flex-col justify-between shadow-xl shadow-emerald-950/30 text-center">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                      MẶT 2: GIẢI NGHĨA & PHÁT ÂM
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(currentCard?.word);
                      }}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 flex items-center gap-1 text-xs"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Nghe AI</span>
                    </button>
                  </div>

                  <div className="my-4">
                    <div className="text-sm font-mono text-slate-300 bg-slate-950/60 inline-block px-3 py-1 rounded-xl border border-slate-800 mb-2">
                      {currentCard?.ipa}
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold text-emerald-300 mb-2">
                      {currentCard?.vietnameseMeaning}
                    </h4>
                    {currentCard?.usageNote && (
                      <p className="text-xs text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800 max-w-sm mx-auto">
                        💡 {currentCard.usageNote}
                      </p>
                    )}
                  </div>

                  {/* Spaced Repetition Indicator */}
                  <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center justify-around">
                    <div className="flex items-center gap-1 text-slate-300">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Chu kỳ lặp: <strong>1 ngày ➔ 3 ngày ➔ 7 ngày</strong></span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 pt-1">
                    Hãy đánh giá mức độ ghi nhớ của bạn bên dưới 👇
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* COMPLETION SCREEN */
            <div className="text-center py-8 px-4 max-w-md">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-slate-100 mb-2">
                Xuất Sắc! Bạn Đã Hoàn Thành Phiên Ôn Tập
              </h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Tất cả từ vựng học thuật của bài đọc <strong>"{lesson.titleEn}"</strong> đã được đưa vào chu trình lặp ngắt quãng (Spaced Repetition).
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="text-xl font-bold text-emerald-400">{masteredCount}</div>
                  <div className="text-[11px] text-slate-400">Từ đã ghi nhớ</div>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="text-xl font-bold text-amber-400">1 Ngày</div>
                  <div className="text-[11px] text-slate-400">Lần nhắc ôn kế tiếp</div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => onOpenReflections(lesson)}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all"
                >
                  <span>Viết Cảm Nghĩ Bằng Từ Vừa Học</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRestart}
                  className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ôn tập lại từ đầu</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Binary Control Bar (As specified in BR-04) */}
        {!isCompleted && isFlipped && (
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
            {/* Red / Needs review */}
            <button
              onClick={handleNeedsReview}
              className="flex-1 py-3.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 hover:border-transparent font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-rose-500/30"
            >
              <RotateCcw className="w-4 h-4" />
              <span>🔴 Cần ôn lại (← Phím Trái)</span>
            </button>

            {/* Green / Mastered */}
            <button
              onClick={handleMastered}
              className="flex-1 py-3.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 hover:border-transparent font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/30"
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
