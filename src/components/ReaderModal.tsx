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

  // Web Speech API helper
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

  // Helper to render text with interactive highlighted vocabularies in woodblock stamp style
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
            className="inline-block px-1.5 py-0.5 mx-0.5 rounded-[2px] font-bold text-[#12332B] bg-[#EAA22E] border border-[#12332B] shadow-[1.5px_1.5px_0px_#12332B] hover:bg-[#E58396] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#12332B]/75 backdrop-blur-sm overflow-y-auto">
      
      {/* Modal Card Box */}
      <div className="relative w-full max-w-5xl bg-[#FAF6EE] border-2 border-[#12332B] rounded-[4px] shadow-[10px_10px_0px_#12332B] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#12332B] bg-[#F8E9CF]">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-[3px] bg-[#1A7368] text-white flex items-center justify-center border-2 border-[#12332B] shadow-[2px_2px_0px_#12332B]">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="dongho-tag bg-[#E58396] text-[#12332B] text-[10px]">
                  Song Ngữ Cặp Đoạn • Band {lesson.level}
                </span>
                <span className="text-xs font-bold text-[#4A635D]">• {lesson.categoryNameVi}</span>
              </div>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-[#12332B] line-clamp-1">
                {lesson.titleEn}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenFlashcards(lesson)}
              className="hidden sm:flex dongho-btn dongho-btn-accent text-xs px-3.5 py-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ôn Flashcards ({lesson.vocabularies.length})</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-[3px] border border-[#12332B] bg-[#FAF6EE] text-[#12332B] hover:bg-[#E58396] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audio Shadowing Sticky Controller */}
        <div className="px-6 py-3 bg-[#FAF6EE] border-b-2 border-[#12332B] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayEntireLesson}
              className="dongho-btn dongho-btn-primary px-4 py-2 text-xs font-bold"
            >
              {isPlayingAll ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Tạm dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Nghe toàn bài (Shadowing)</span>
                </>
              )}
            </button>

            <span className="text-xs font-medium text-[#4A635D] hidden sm:inline">
              💡 Bấm nút "Nghe câu này" ở từng đoạn để luyện phát âm riêng biệt
            </span>
          </div>

          {/* Speed settings */}
          <div className="flex items-center gap-2 bg-[#F8E9CF] px-2 py-1 rounded-[3px] border-2 border-[#12332B]">
            <span className="text-xs font-bold text-[#12332B]">Tốc độ:</span>
            {[0.75, 1, 1.25].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded-[2px] text-xs font-bold transition-all ${
                  playbackSpeed === speed
                    ? 'bg-[#1A7368] text-white'
                    : 'text-[#12332B] hover:bg-[#FAF6EE]'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Reading Body: Paragraph Pairing (2 Columns on Desktop) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF6EE]">
          
          {/* Banner image with woodblock frame */}
          <div className="relative rounded-[3px] overflow-hidden border-2 border-[#12332B] shadow-[4px_4px_0px_#12332B] aspect-[21/9] max-h-52 bg-[#F8E9CF]">
            <img 
              src={lesson.imageUrl} 
              alt={lesson.titleEn}
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12332B]/90 via-[#12332B]/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-1">
                {lesson.titleVi}
              </h3>
              <p className="text-xs text-[#FAF6EE] line-clamp-1">{lesson.summary}</p>
            </div>
          </div>

          {/* Paragraphs List */}
          <div className="space-y-6">
            {lesson.paragraphs.map((para, index) => (
              <div 
                key={para.id} 
                className={`p-5 rounded-[3px] border-2 transition-all ${
                  activeSentenceId === para.id 
                    ? 'bg-[#F8E9CF] border-[#1A7368] shadow-[4px_4px_0px_#1A7368]' 
                    : 'bg-[#FFFDF9] border-[#12332B] shadow-[3px_3px_0px_#12332B]'
                }`}
              >
                <div className="flex items-center justify-between mb-3 text-xs font-bold text-[#12332B]">
                  <span className="text-[#1A7368] uppercase">❖ ĐOẠN #{index + 1}</span>
                  <button
                    onClick={() => handlePlayParagraph(para.id, para.english)}
                    className="dongho-btn dongho-btn-paper text-xs px-2.5 py-1"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#1A7368]" />
                    <span>Nghe câu này</span>
                  </button>
                </div>

                {/* Dual Column Layout for Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* English Column (Primary) */}
                  <div className="text-[#12332B] text-base leading-relaxed">
                    {renderInteractiveEnglishText(para.english, para.highlightWords)}
                  </div>

                  {/* Vietnamese Column */}
                  <div className="hidden md:block text-[#4A635D] text-base leading-relaxed pl-6 border-l-2 border-[#12332B]/20 bg-[#FAF6EE] p-4 rounded-[2px]">
                    {para.vietnamese}
                  </div>

                  {/* Mobile Toggle */}
                  <div className="md:hidden mt-2 pt-2 border-t border-[#12332B]/20">
                    <button
                      onClick={() => toggleMobileTranslation(para.id)}
                      className="text-xs text-[#1A7368] font-bold flex items-center gap-1"
                    >
                      <span>{showVietnameseMobile[para.id] ? 'Ẩn bản dịch tiếng Việt' : 'Xem bản dịch tiếng Việt'}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${showVietnameseMobile[para.id] ? 'rotate-90' : ''}`} />
                    </button>
                    {showVietnameseMobile[para.id] && (
                      <p className="mt-2 text-xs text-[#4A635D] leading-relaxed bg-[#FAF6EE] p-3 rounded-[2px] border border-[#12332B]">
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
          <div className="border-t-2 border-[#12332B] bg-[#F8E9CF] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-heading font-bold text-2xl text-[#12332B]">
                    {selectedVocab.word}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#12332B] bg-[#FAF6EE] px-2 py-0.5 rounded-[2px] border border-[#12332B]">
                    {selectedVocab.ipa}
                  </span>
                  <span className="text-xs italic font-bold text-[#1A7368]">
                    ({selectedVocab.pos})
                  </span>
                  <span className="dongho-tag bg-[#EAA22E] text-[#12332B] text-[10px]">
                    Band {selectedVocab.level}
                  </span>
                  <button
                    onClick={() => speakText(selectedVocab.word)}
                    className="p-1 rounded-[2px] border border-[#12332B] bg-[#FAF6EE] text-[#12332B] hover:bg-[#EAA22E] transition-all"
                    title="Phát âm từ này"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm font-bold text-[#12332B] mb-2">
                  👉 {selectedVocab.vietnameseMeaning}
                </p>

                <div className="text-xs text-[#12332B] bg-[#FAF6EE] p-3 rounded-[2px] border border-[#12332B]">
                  <strong className="text-[#1A7368]">Ngữ cảnh gốc:</strong>{' '}
                  <span className="italic">"{selectedVocab.contextSentence}"</span>
                </div>
              </div>

              {/* Actions on Tooltip */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  onClick={() => setSelectedVocab(null)}
                  className="p-1 text-[#12332B] hover:text-[#E58396]"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={() => toggleSaveVocab(selectedVocab.id)}
                  className={`dongho-btn text-xs px-3 py-1.5 ${
                    savedVocabIds.includes(selectedVocab.id)
                      ? 'dongho-btn-primary'
                      : 'dongho-btn-paper'
                  }`}
                >
                  {savedVocabIds.includes(selectedVocab.id) ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã lưu vào thẻ ôn</span>
                    </>
                  ) : (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5 text-[#1A7368]" />
                      <span>Lưu ôn Flashcard</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t-2 border-[#12332B] bg-[#F8E9CF] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4A635D]">
            <span>Đã đọc xong bài?</span>
            <span>•</span>
            <span className="text-[#1A7368] font-bold">Chuyển sang ôn tập Flashcards hoặc viết cảm nghĩ</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenFlashcards(lesson)}
              className="dongho-btn dongho-btn-accent px-4 py-2.5 text-xs font-bold"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ôn Flashcards 2 mặt ({lesson.vocabularies.length})</span>
            </button>

            <button
              onClick={() => onOpenReflections(lesson)}
              className="dongho-btn dongho-btn-paper px-4 py-2.5 text-xs font-bold"
            >
              <MessageSquare className="w-4 h-4 text-[#1A7368]" />
              <span>Viết Cảm Nghĩ (No-Judgment)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
