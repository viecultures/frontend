import React, { useState } from 'react';
import { Target, RotateCw, Volume2, VolumeX, ArrowRight, Brain, CheckCircle2, RotateCcw, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { speakEnglish } from '@/utils/sampleSpeech';

interface FlashcardDemoItem {
  id: string;
  word: string;
  ipa: string;
  pos: string;
  example: string;
  meaning: string;
  definition: string;
  collocation: string;
}

const DEMO_CARDS: FlashcardDemoItem[] = [
  {
    id: '1',
    word: 'architectural',
    ipa: '/ˌɑːrkɪˈtektʃərəl/',
    pos: 'adjective',
    example: 'The Imperial Citadel represents an extraordinary architectural accomplishment.',
    meaning: 'Thuộc về kiến trúc',
    definition: 'Liên quan đến nghệ thuật thiết kế và xây dựng công trình di sản.',
    collocation: 'architectural heritage, architectural masterpiece',
  },
  {
    id: '2',
    word: 'geomancy',
    ipa: '/ˈdʒiː.ə.mæn.si/',
    pos: 'noun',
    example: 'Royal architects utilized Eastern geomancy to harmonize structures with nature.',
    meaning: 'Nghệ thuật phong thủy',
    definition: 'Phương pháp định vị công trình hài hòa âm dương ngũ hành đất trời.',
    collocation: 'geomantic principles, apply geomancy',
  },
  {
    id: '3',
    word: 'resilience',
    ipa: '/rɪˈzɪl.jəns/',
    pos: 'noun',
    example: 'The ancient capital stands as a living testament to Vietnamese cultural resilience.',
    meaning: 'Sự kiên cường, bền bỉ',
    definition: 'Khả năng phục hồi và trường tồn mạnh mẽ trước những biến cố lịch sử.',
    collocation: 'cultural resilience, extraordinary resilience',
  },
  {
    id: '4',
    word: 'intangible',
    ipa: '/ɪnˈtæn.dʒə.bəl/',
    pos: 'adjective',
    example: 'Nha Nhac Court Music is recognized worldwide as an intangible cultural heritage.',
    meaning: 'Phi vật thể, tinh thần',
    definition: 'Tài sản văn hóa vô hình truyền thừa qua âm nhạc, nghi lễ và tri thức dân gian.',
    collocation: 'intangible cultural heritage, intangible legacy',
  },
  {
    id: '5',
    word: 'syncretism',
    ipa: '/ˈsɪŋ.krə.tɪ.zəm/',
    pos: 'noun',
    example: 'Saigon banh mi is a prime example of culinary syncretism between French and Vietnamese tastes.',
    meaning: 'Sự dung hợp văn hóa',
    definition: 'Quá trình hòa quyện, tiếp biến tinh hoa văn hóa khác nhau tạo nên bản sắc độc đáo.',
    collocation: 'culinary syncretism, cultural syncretism',
  },
];

interface InteractiveFlashcardDemoSectionProps {
  onNavigate?: (view: string) => void;
}

export const InteractiveFlashcardDemoSection: React.FC<InteractiveFlashcardDemoSectionProps> = ({ onNavigate }) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentCard = DEMO_CARDS[activeCardIndex];

  const handleToggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setActiveCardIndex((prev) => (prev + 1) % DEMO_CARDS.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setActiveCardIndex((prev) => (prev - 1 + DEMO_CARDS.length) % DEMO_CARDS.length);
  };

  const handleRate = (type: 'again' | 'good') => {
    if (type === 'again') {
      setNotification(`Đã đánh dấu: "${currentCard.word}" Cần Ôn Lại! Thuật toán SRS sẽ lặp lại sau 10 phút.`);
    } else {
      setNotification(`Tuyệt vời! "${currentCard.word}" đã được chuyển vào chu kỳ trí nhớ 3 ngày.`);
    }
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingAudio) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakEnglish(currentCard.word, () => setIsPlayingAudio(false));
    }
  };

  const handleExploreFlashcards = () => {
    if (onNavigate) {
      onNavigate('flashcard-study');
    } else {
      window.dispatchEvent(new CustomEvent('app:navigate', { detail: 'flashcard-study' }));
    }
  };

  return (
    <section
      id="flashcard-demo"
      className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-surface border-t border-line"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Live Interactive Flashcard Box */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-3xl border-2 border-border-dark p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Top Bar with Live Indicator */}
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2 text-text-muted">
                <Target className="w-4 h-4 text-emerald-600" />
                <span className="uppercase tracking-wider">TRẢI NGHIỆM THẺ NHỚ THÔNG MINH</span>
              </div>
              <span className="text-emerald-700 font-mono font-bold">
                {activeCardIndex + 18} / 25 Từ vựng (76%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${((activeCardIndex + 18) / 25) * 100}%` }}
              />
            </div>

            {/* 3D Flip Card Container */}
            <div
              onClick={handleToggleFlip}
              className="group relative w-full min-h-[220px] p-6 rounded-2xl bg-surface border-2 border-line hover:border-antique-gold/60 text-center flex flex-col justify-between items-center cursor-pointer select-none transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
            >
              {/* Corner Watermark SVG */}
              <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-20 overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-antique-gold" strokeWidth="1.2">
                  <path d="M100 0 C70 10 40 40 30 70 C20 100 0 100 0 100" strokeDasharray="3 3" />
                  <circle cx="80" cy="20" r="10" fill="#E8B7B2" fillOpacity="0.4" />
                </svg>
              </div>

              {/* Card Switch Arrows */}
              <div className="w-full flex items-center justify-between text-xs text-text-muted pb-2 border-b border-line/40 relative z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevCard();
                  }}
                  className="p-1 rounded-md hover:bg-mist-cloud text-heritage-green flex items-center gap-1 cursor-pointer font-bold"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Thẻ trước</span>
                </button>

                <span className="font-mono font-bold text-mountain-teal">
                  Thẻ {activeCardIndex + 1} / {DEMO_CARDS.length}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextCard();
                  }}
                  className="p-1 rounded-md hover:bg-mist-cloud text-heritage-green flex items-center gap-1 cursor-pointer font-bold"
                >
                  <span>Thẻ sau</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {!isFlipped ? (
                /* Card Front (English) */
                <div className="space-y-2 py-4 animate-in fade-in zoom-in-95 duration-200 relative z-10">
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="font-serif text-3xl sm:text-4xl font-bold text-text-main">
                      {currentCard.word}
                    </h3>
                    <button
                      type="button"
                      onClick={handlePlayAudio}
                      className="p-1.5 rounded-full hover:bg-mist-cloud text-mountain-teal transition-colors"
                      aria-label="Nghe phát âm"
                    >
                      {isPlayingAudio ? (
                        <VolumeX className="w-4 h-4 text-red-500" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-antique-gold" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm font-mono text-text-muted">
                    {currentCard.ipa} • {currentCard.pos}
                  </p>

                  <p className="text-xs sm:text-sm text-text-muted italic max-w-sm mx-auto font-serif pt-1 leading-relaxed">
                    &ldquo;{currentCard.example}&rdquo;
                  </p>
                </div>
              ) : (
                /* Card Back (Vietnamese Meaning & Definition) */
                <div className="space-y-2 py-4 animate-in fade-in zoom-in-95 duration-200 relative z-10">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700">
                    {currentCard.meaning}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-main font-semibold max-w-sm mx-auto">
                    {currentCard.definition}
                  </p>
                  <p className="text-xs text-mountain-teal font-mono pt-1">
                    {currentCard.collocation}
                  </p>
                </div>
              )}

              {/* Card Flip Hint */}
              <div className="pt-2 border-t border-line/40 w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-text-muted relative z-10">
                <RotateCw className="w-3.5 h-3.5 text-antique-gold" />
                <span>Bấm vào thẻ để lật xem {isFlipped ? 'từ vựng Tiếng Anh' : 'đáp án Tiếng Việt'}</span>
              </div>
            </div>

            {/* SRS Feedback Toast */}
            {notification && (
              <div className="p-3 rounded-xl bg-heritage-forest text-warm-ivory text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <Sparkles className="w-4 h-4 text-antique-bright shrink-0" />
                <span>{notification}</span>
              </div>
            )}

            {/* SRS Rating Action Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleRate('again')}
                className="flex-1 py-3 px-4 rounded-xl border border-red-300 hover:bg-red-50 text-red-700 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer focus-ring"
              >
                <RotateCcw className="w-3.5 h-3.5 text-red-600" />
                <span>Cần Ôn Lại</span>
              </button>

              <button
                type="button"
                onClick={() => handleRate('good')}
                className="flex-1 py-3 px-4 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs focus-ring"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-antique-bright" />
                <span>Đã Nhớ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Explanatory Copy */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rice-paper text-heritage-green border border-antique-gold/40 text-xs font-bold shadow-xs">
              <Brain className="w-3.5 h-3.5 text-antique-gold" />
              <span className="uppercase tracking-widest text-[11px] font-extrabold">
                HỆ THỐNG GHI NHỚ DÀI HẠN
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-main tracking-tight">
              Thẻ Nhớ Thông Minh &amp; <br />
              <span className="italic text-antique-gold font-serif">Lặp Ngắt Quãng SM-2</span>
            </h2>

            <p className="text-sm sm:text-base text-text-muted leading-relaxed font-normal">
              Hệ thống ghi nhớ từ vựng thông minh ứng dụng thuật toán lặp lại ngắt quãng (Spaced Repetition System). Hỗ trợ 5 chế độ tập luyện: Lật thẻ, Trắc nghiệm, Gõ từ, Nối từ và Luyện nghe phát âm.
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-start gap-3 text-xs sm:text-sm font-medium text-text-main">
              <CheckCircle2 className="w-4 h-4 text-mountain-teal shrink-0 mt-0.5" />
              <span>Thuật toán SM-2 tối ưu hóa thời gian ôn tập tự động theo đường cong quên lãng Ebbinghaus</span>
            </div>
            <div className="flex items-start gap-3 text-xs sm:text-sm font-medium text-text-main">
              <CheckCircle2 className="w-4 h-4 text-mountain-teal shrink-0 mt-0.5" />
              <span>Hỗ trợ phím tắt Space (lật thẻ) &amp; Phím 1-4 (đánh giá mức độ nhớ) nhanh như Anki</span>
            </div>
            <div className="flex items-start gap-3 text-xs sm:text-sm font-medium text-text-main">
              <CheckCircle2 className="w-4 h-4 text-mountain-teal shrink-0 mt-0.5" />
              <span>Đồng bộ tức thì từ mới lưu trong quá trình đọc bài thành bộ thẻ ôn tập hàng ngày</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={handleExploreFlashcards}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-antique-bright via-antique-rich to-antique-gold text-heritage-forest font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:brightness-105 active:scale-[0.98] flex items-center gap-2 cursor-pointer focus-ring"
            >
              <span>Trải Nghiệm Flashcard Đầy Đủ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveFlashcardDemoSection;
