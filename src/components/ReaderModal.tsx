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

  // Web Speech API Voice reading helper
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

  // Helper to render text with interactive highlighted vocabularies
  const renderInteractiveEnglishText = (text: string, highlightWords?: string[]) => {
    if (!highlightWords || highlightWords.length === 0) return text;

    // Build regex to match highlighted words
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
            className="inline-block px-1.5 py-0.5 mx-0.5 rounded-md font-semibold text-amber-300 bg-amber-500/15 border-b-2 border-amber-400 hover:bg-amber-400/30 transition-all cursor-pointer shadow-sm hover:scale-105"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-xl overflow-y-auto">
      
      {/* Modal Card Box */}
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                  Song Ngữ Cặp Đoạn • Band {lesson.level}
                </span>
                <span className="text-xs text-slate-400">• {lesson.categoryNameVi}</span>
              </div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-slate-100 line-clamp-1">
                {lesson.titleEn}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenFlashcards(lesson)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 hover:bg-amber-400 hover:text-slate-950 text-xs font-bold transition-all border border-amber-500/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Luyện Flashcards ({lesson.vocabularies.length})</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Audio Shadowing Sticky Controller */}
        <div className="px-6 py-3 bg-slate-950/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayEntireLesson}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/30 transition-all"
            >
              {isPlayingAll ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Tạm dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Nghe toàn bài (Shadowing)</span>
                </>
              )}
            </button>

            <span className="text-xs text-slate-400 hidden sm:inline">
              *Mẹo: Bấm vào từng đoạn để nghe phát âm câu riêng biệt
            </span>
          </div>

          {/* Speed settings */}
          <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400">Tốc độ:</span>
            {[0.75, 1, 1.25].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  playbackSpeed === speed
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Reading Body: Paragraph Pairing (2 Columns on Desktop) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Banner image & subtitle */}
          <div className="relative rounded-2xl overflow-hidden aspect-[21/9] max-h-52 bg-slate-950 border border-slate-800">
            <img 
              src={lesson.imageUrl} 
              alt={lesson.titleEn}
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
                {lesson.titleVi}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-1">{lesson.summary}</p>
            </div>
          </div>

          {/* Paragraphs List */}
          <div className="space-y-6">
            {lesson.paragraphs.map((para, index) => (
              <div 
                key={para.id} 
                className={`p-5 rounded-2xl border transition-all ${
                  activeSentenceId === para.id 
                    ? 'bg-slate-800/80 border-emerald-500/60 shadow-lg shadow-emerald-950/30' 
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                  <span className="font-bold text-emerald-400/90">ĐOẠN #{index + 1}</span>
                  <button
                    onClick={() => handlePlayParagraph(para.id, para.english)}
                    className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg font-medium transition-all"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe câu này</span>
                  </button>
                </div>

                {/* Dual Column Layout for Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* English Column (Primary) */}
                  <div className="text-slate-100 text-sm sm:text-base leading-relaxed">
                    {renderInteractiveEnglishText(para.english, para.highlightWords)}
                  </div>

                  {/* Vietnamese Column (Desktop: Always visible; Mobile: Toggleable) */}
                  <div className="hidden md:block text-slate-300 text-sm sm:text-base leading-relaxed pl-6 border-l border-slate-800/80 font-light bg-slate-900/40 p-3 rounded-xl">
                    {para.vietnamese}
                  </div>

                  {/* Mobile Toggle */}
                  <div className="md:hidden mt-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => toggleMobileTranslation(para.id)}
                      className="text-xs text-emerald-400 font-semibold flex items-center gap-1"
                    >
                      <span>{showVietnameseMobile[para.id] ? 'Ẩn bản dịch tiếng Việt' : 'Xem bản dịch tiếng Việt'}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${showVietnameseMobile[para.id] ? 'rotate-90' : ''}`} />
                    </button>
                    {showVietnameseMobile[para.id] && (
                      <p className="mt-2 text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                        {para.vietnamese}
                      </p>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Interactive Vocab Tooltip Drawer / Popover if clicked */}
        {selectedVocab && (
          <div className="border-t border-amber-500/40 bg-slate-950 p-5 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-start justify-between gap-4">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-serif font-bold text-xl text-amber-300">
                    {selectedVocab.word}
                  </span>
                  <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {selectedVocab.ipa}
                  </span>
                  <span className="text-xs italic text-emerald-400">
                    ({selectedVocab.pos})
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    Band {selectedVocab.level}
                  </span>
                  <button
                    onClick={() => speakText(selectedVocab.word)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition-all"
                    title="Phát âm từ này"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm font-semibold text-slate-100 mb-2">
                  👉 {selectedVocab.vietnameseMeaning}
                </p>

                <div className="text-xs text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <strong className="text-slate-300">Ngữ cảnh gốc:</strong>{' '}
                  <span className="italic">"{selectedVocab.contextSentence}"</span>
                </div>
              </div>

              {/* Actions on Tooltip */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  onClick={() => setSelectedVocab(null)}
                  className="p-1 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleSaveVocab(selectedVocab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    savedVocabIds.includes(selectedVocab.id)
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
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
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Đã đọc xong bài?</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-medium">Chuyển sang ôn tập từ vựng & chia sẻ cảm nghĩ</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenFlashcards(lesson)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ôn Flashcards 2 mặt ({lesson.vocabularies.length})</span>
            </button>

            <button
              onClick={() => onOpenReflections(lesson)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-teal-400" />
              <span>Viết Cảm Nghĩ (No-Judgment)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
