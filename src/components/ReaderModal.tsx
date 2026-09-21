import React, { useState } from 'react';
import { 
  X, Volume2, Play, Pause, Sparkles, MessageSquare, 
  BookOpen, BookmarkCheck, Check, ChevronRight 
} from 'lucide-react';
import type { Lesson, VocabItem } from '../types';

interface ReaderModalProps {
  lesson: Lesson;
  onClose: () => void;
  onOpenFlashcards: (lesson: Lesson) => void;
  onOpenReflections: (lesson: Lesson) => void;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  lesson,
  onClose,
  onOpenFlashcards,
  onOpenReflections,
}) => {
  const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeSentenceId, setActiveSentenceId] = useState<number | null>(null);
  const [selectedVocab, setSelectedVocab] = useState<VocabItem | null>(null);
  const [savedVocabIds, setSavedVocabIds] = useState<string[]>([]);
  const [showVietnameseMobile, setShowVietnameseMobile] = useState<Record<number, boolean>>({});

  const speakText = (text: string, rate: number = 1) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePlayEntireLesson = () => {
    if (isPlayingAll) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingAll(false);
      setActiveSentenceId(null);
    } else {
      setIsPlayingAll(true);
      const fullText = lesson.paragraphs.map(p => p.english).join(' ');
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.lang = 'en-US';
        utterance.rate = playbackSpeed;
        utterance.onend = () => {
          setIsPlayingAll(false);
          setActiveSentenceId(null);
        };
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handlePlayParagraph = (paraId: number, text: string) => {
    setActiveSentenceId(paraId);
    speakText(text, playbackSpeed);
  };

  const toggleSaveVocab = (vocabId: string) => {
    setSavedVocabIds(prev => 
      prev.includes(vocabId) ? prev.filter(id => id !== vocabId) : [...prev, vocabId]
    );
  };

  const toggleMobileTranslation = (paraId: number) => {
    setShowVietnameseMobile(prev => ({
      ...prev,
      [paraId]: !prev[paraId]
    }));
  };

  const renderInteractiveEnglishText = (text: string, highlightWords?: string[]) => {
    if (!highlightWords || highlightWords.length === 0) return text;

    const regex = new RegExp(`\\b(${highlightWords.join('|')})\\b`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const isHighlight = highlightWords.some(w => w.toLowerCase() === part.toLowerCase());
      if (isHighlight) {
        const matchingVocab = lesson.vocabularies.find(
          v => v.word.toLowerCase() === part.toLowerCase() || 
               v.highlightedWordInContext.toLowerCase() === part.toLowerCase()
        );

        return (
          <button
            key={index}
            onClick={() => matchingVocab && setSelectedVocab(matchingVocab)}
            className="inline-block px-2 py-0.5 mx-0.5 rounded-full font-semibold text-[#18221E] bg-[#FCE5B5] hover:bg-[#FFF0CE] hover:scale-105 transition-all cursor-pointer shadow-sm"
            title="Bấm để xem nghĩa học thuật & phát âm"
          >
            {part}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      
      {/* Modal Card Box */}
      <div className="relative w-full max-w-5xl bg-[#0D1C18]/95 border border-white/20 rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-white/10 text-[#F5D280] flex items-center justify-center border border-white/15">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                  Song Ngữ Cặp Đoạn • Band {lesson.level}
                </span>
                <span className="text-xs text-white/60">• {lesson.categoryNameVi}</span>
              </div>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-white line-clamp-1">
                {lesson.titleEn}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenFlashcards(lesson)}
              className="hidden sm:flex btn-pill-primary text-xs px-4 py-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Luyện Flashcards ({lesson.vocabularies.length})</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audio Shadowing Sticky Controller */}
        <div className="px-6 py-3.5 bg-black/30 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayEntireLesson}
              className="btn-pill-primary px-5 py-2 text-xs font-semibold"
            >
              {isPlayingAll ? (
                <>
                  <Pause className="w-4 h-4 text-[#18221E]" />
                  <span>Tạm dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-[#18221E] text-[#18221E]" />
                  <span>Nghe toàn bài (Shadowing)</span>
                </>
              )}
            </button>

            <span className="text-xs text-white/60 hidden sm:inline">
              💡 Bấm vào từng đoạn để nghe phát âm câu riêng biệt
            </span>
          </div>

          {/* Speed settings */}
          <div className="flex items-center gap-2 bg-black/40 px-2 py-1 rounded-full border border-white/15">
            <span className="text-xs text-white/60 font-medium">Tốc độ:</span>
            {[0.75, 1, 1.25].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                  playbackSpeed === speed
                    ? 'bg-[#FCE5B5] text-[#18221E]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Reading Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Banner image with soft rounded corners */}
          <div className="relative rounded-[20px] overflow-hidden border border-white/15 aspect-[21/9] max-h-52 bg-black/40">
            <img 
              src={lesson.imageUrl} 
              alt={lesson.titleEn}
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1C18] via-[#0D1C18]/40 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-1">
                {lesson.titleVi}
              </h3>
              <p className="text-xs text-white/80 line-clamp-1">{lesson.summary}</p>
            </div>
          </div>

          {/* Paragraphs List */}
          <div className="space-y-6">
            {lesson.paragraphs.map((para, index) => (
              <div 
                key={para.id} 
                className={`p-6 rounded-[20px] border transition-all ${
                  activeSentenceId === para.id 
                    ? 'bg-white/10 border-[#FCE5B5]/60 shadow-lg' 
                    : 'bg-black/30 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3 text-xs font-semibold text-white/60">
                  <span className="text-[#F5D280] uppercase tracking-wider">❖ ĐOẠN #{index + 1}</span>
                  <button
                    onClick={() => handlePlayParagraph(para.id, para.english)}
                    className="btn-pill-glass text-xs px-3 py-1"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#F5D280]" />
                    <span>Nghe câu này</span>
                  </button>
                </div>

                {/* Dual Column Layout for Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* English Column (Primary) */}
                  <div className="text-white text-base leading-relaxed">
                    {renderInteractiveEnglishText(para.english, para.highlightWords)}
                  </div>

                  {/* Vietnamese Column */}
                  <div className="hidden md:block text-white/75 text-base leading-relaxed pl-6 border-l border-white/15 bg-black/20 p-4 rounded-[16px]">
                    {para.vietnamese}
                  </div>

                  {/* Mobile Toggle */}
                  <div className="md:hidden mt-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => toggleMobileTranslation(para.id)}
                      className="text-xs text-[#F5D280] font-semibold flex items-center gap-1"
                    >
                      <span>{showVietnameseMobile[para.id] ? 'Ẩn bản dịch tiếng Việt' : 'Xem bản dịch tiếng Việt'}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${showVietnameseMobile[para.id] ? 'rotate-90' : ''}`} />
                    </button>
                    {showVietnameseMobile[para.id] && (
                      <p className="mt-2 text-xs text-white/75 leading-relaxed bg-black/40 p-3 rounded-[12px] border border-white/10">
                        {para.vietnamese}
                      </p>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Interactive Vocab Tooltip Drawer */}
        {selectedVocab && (
          <div className="border-t border-white/20 bg-black/70 backdrop-blur-xl p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-heading font-bold text-2xl text-[#FCE5B5]">
                    {selectedVocab.word}
                  </span>
                  <span className="text-xs font-mono text-white/70 bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                    {selectedVocab.ipa}
                  </span>
                  <span className="text-xs italic text-emerald-300">
                    ({selectedVocab.pos})
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 text-[10px] font-semibold">
                    Band {selectedVocab.level}
                  </span>
                  <button
                    onClick={() => speakText(selectedVocab.word)}
                    className="p-1 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all"
                    title="Phát âm từ này"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm font-semibold text-white mb-2">
                  👉 {selectedVocab.vietnameseMeaning}
                </p>

                <div className="text-xs text-white/80 bg-black/40 p-3 rounded-[12px] border border-white/10">
                  <strong className="text-[#F5D280]">Ngữ cảnh gốc:</strong>{' '}
                  <span className="italic">"{selectedVocab.contextSentence}"</span>
                </div>
              </div>

              {/* Actions on Tooltip */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  onClick={() => setSelectedVocab(null)}
                  className="p-1 text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={() => toggleSaveVocab(selectedVocab.id)}
                  className={`btn-pill-primary text-xs px-3.5 py-1.5 ${
                    savedVocabIds.includes(selectedVocab.id)
                      ? 'bg-emerald-400 text-slate-950'
                      : ''
                  }`}
                >
                  {savedVocabIds.includes(selectedVocab.id) ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã lưu vào thẻ ôn</span>
                    </>
                  ) : (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5" />
                      <span>Lưu ôn Flashcard</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <span>Đã đọc xong bài?</span>
            <span>•</span>
            <span className="text-[#F5D280] font-medium">Chuyển sang ôn tập Flashcards hoặc viết cảm nghĩ</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenFlashcards(lesson)}
              className="btn-pill-primary px-5 py-2.5 text-xs font-semibold"
            >
              <Sparkles className="w-4 h-4 text-[#18221E]" />
              <span>Ôn Flashcards ({lesson.vocabularies.length})</span>
            </button>

            <button
              onClick={() => onOpenReflections(lesson)}
              className="btn-pill-glass px-5 py-2.5 text-xs font-medium"
            >
              <MessageSquare className="w-4 h-4 text-[#F5D280]" />
              <span>Viết Cảm Nghĩ (No-Judgment)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
