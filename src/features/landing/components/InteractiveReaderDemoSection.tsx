import React, { useState } from 'react';
import { Volume2, VolumeX, ArrowRight, Sparkles, BookOpen, Layers, CheckCircle2, Bookmark, ExternalLink } from 'lucide-react';
import { speakEnglish } from '@/utils/sampleSpeech';

interface VocabItem {
  id: string;
  word: string;
  ipa: string;
  pos: string;
  meaning: string;
  example: string;
}

const DEMO_VOCAB: Record<string, VocabItem> = {
  architectural: {
    id: 'architectural',
    word: 'architectural',
    ipa: '/ˌɑːrkɪˈtektʃərəl/',
    pos: 'adjective',
    meaning: 'Thuộc về kiến trúc, nghệ thuật xây dựng',
    example: 'The Imperial Citadel represents an extraordinary architectural accomplishment.',
  },
  citadel: {
    id: 'citadel',
    word: 'citadel',
    ipa: '/ˈsɪt.ə.del/',
    pos: 'noun',
    meaning: 'Hoàng thành, pháo đài phòng thủ cổ xưa',
    example: 'The Nguyen Dynasty citadel was built along the scenic Perfume River.',
  },
  geomancy: {
    id: 'geomancy',
    word: 'geomancy',
    ipa: '/ˈdʒiː.ə.mæn.si/',
    pos: 'noun',
    meaning: 'Nghệ thuật phong thủy, hài hòa âm dương đất trời',
    example: 'Royal architects utilized Eastern geomancy to orient the sacred palaces.',
  },
  resilience: {
    id: 'resilience',
    word: 'resilience',
    ipa: '/rɪˈzɪl.jəns/',
    pos: 'noun',
    meaning: 'Sự kiên cường, sức sống bền bỉ qua thời gian',
    example: 'Hue heritage stands as a living symbol of Vietnamese cultural resilience.',
  },
};

interface InteractiveReaderDemoSectionProps {
  onNavigate?: (view: string) => void;
}

export const InteractiveReaderDemoSection: React.FC<InteractiveReaderDemoSectionProps> = ({ onNavigate }) => {
  const [selectedWord, setSelectedWord] = useState<VocabItem>(DEMO_VOCAB.architectural);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [demoMode, setDemoMode] = useState<'bilingual' | 'extensive'>('bilingual');

  const handleWordClick = (key: string) => {
    const vocab = DEMO_VOCAB[key];
    if (vocab) {
      setSelectedWord(vocab);
    }
  };

  const handlePlayWordAudio = (word: string) => {
    if (isPlayingAudio) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakEnglish(word, () => setIsPlayingAudio(false));
    }
  };

  const handleOpenReader = () => {
    if (onNavigate) {
      onNavigate('bilingual-reader');
    } else {
      window.dispatchEvent(new CustomEvent('app:navigate', { detail: 'bilingual-reader' }));
    }
  };

  return (
    <section
      id="interactive-demo"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-surface border-t border-line vn-pattern-bg"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Explanatory Copy */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rice-paper text-heritage-green border border-antique-gold/40 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
              <span className="uppercase tracking-widest text-[11px] font-extrabold">
                Interactive Demo
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-main tracking-tight">
              Try The <span className="italic text-antique-gold font-serif">Reader Overlay</span>
            </h2>

            <p className="text-sm sm:text-base text-text-muted leading-relaxed font-normal">
              Click any underlined vocabulary word in the preview to inspect instant IPA pronunciation, Vietnamese translation, and audio playback.
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-start gap-3 text-xs sm:text-sm font-medium text-text-main">
              <CheckCircle2 className="w-4 h-4 text-mountain-teal shrink-0 mt-0.5" />
              <span>Tra từ 1 chạm với phiên âm chuẩn quốc tế IPA &amp; Collocations bản xứ</span>
            </div>
            <div className="flex items-start gap-3 text-xs sm:text-sm font-medium text-text-main">
              <CheckCircle2 className="w-4 h-4 text-mountain-teal shrink-0 mt-0.5" />
              <span>Phát âm giọng đọc AI chuẩn bản ngữ theo từng tốc độ (0.75x - 1.5x)</span>
            </div>
            <div className="flex items-start gap-3 text-xs sm:text-sm font-medium text-text-main">
              <CheckCircle2 className="w-4 h-4 text-mountain-teal shrink-0 mt-0.5" />
              <span>Chuyển đổi linh hoạt giữa chế độ Song Ngữ đối chiếu và Đọc Sâu không dịch</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={handleOpenReader}
              className="px-8 py-4 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer focus-ring"
            >
              <span>Open Full Reader Screen</span>
              <ArrowRight className="w-4 h-4 text-antique-gold" />
            </button>
          </div>
        </div>

        {/* Right Column: Live Interactive Reader Mockup */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border-2 border-border-dark p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Top Widget Bar */}
            <div className="flex items-center justify-between border-b border-line pb-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="font-mono text-xs font-bold text-heritage-green ml-2">Reader Engine v2.5</span>
              </div>

              {/* View Switcher Pill */}
              <div className="flex items-center bg-surface border border-line rounded-xl p-0.5 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setDemoMode('bilingual')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    demoMode === 'bilingual'
                      ? 'bg-heritage-green text-warm-ivory shadow-xs'
                      : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  Song Ngữ
                </button>
                <button
                  type="button"
                  onClick={() => setDemoMode('extensive')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    demoMode === 'extensive'
                      ? 'bg-heritage-green text-warm-ivory shadow-xs'
                      : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  Đọc Sâu
                </button>
              </div>
            </div>

            {/* Simulated Reader Passage */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-antique-gold">
                  Trích Đoạn: Cố Đô Huế &amp; Nghệ Thuật Cung Đình
                </span>
                <span className="font-mono text-[11px] font-bold text-mountain-teal">
                  Level B1 • 8 phút
                </span>
              </div>

              {/* English text with interactive highlighted words */}
              <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper/60 border border-line">
                <p className="font-serif text-base sm:text-lg text-text-main leading-relaxed select-none">
                  Constructed in the early 19th century, the Imperial{' '}
                  <button
                    type="button"
                    onClick={() => handleWordClick('citadel')}
                    className={`cursor-pointer px-1 py-0.5 rounded transition-all font-semibold ${
                      selectedWord.id === 'citadel'
                        ? 'bg-antique-gold/30 text-heritage-forest ring-2 ring-antique-gold'
                        : 'underline decoration-antique-gold decoration-2 underline-offset-4 hover:bg-mist-cloud/60 text-heritage-green'
                    }`}
                  >
                    citadel
                  </button>{' '}
                  stands as an extraordinary{' '}
                  <button
                    type="button"
                    onClick={() => handleWordClick('architectural')}
                    className={`cursor-pointer px-1 py-0.5 rounded transition-all font-semibold ${
                      selectedWord.id === 'architectural'
                        ? 'bg-antique-gold/30 text-heritage-forest ring-2 ring-antique-gold'
                        : 'underline decoration-antique-gold decoration-2 underline-offset-4 hover:bg-mist-cloud/60 text-heritage-green'
                    }`}
                  >
                    architectural
                  </button>{' '}
                  achievement. Master builders aligned every bastion according to Eastern{' '}
                  <button
                    type="button"
                    onClick={() => handleWordClick('geomancy')}
                    className={`cursor-pointer px-1 py-0.5 rounded transition-all font-semibold ${
                      selectedWord.id === 'geomancy'
                        ? 'bg-antique-gold/30 text-heritage-forest ring-2 ring-antique-gold'
                        : 'underline decoration-antique-gold decoration-2 underline-offset-4 hover:bg-mist-cloud/60 text-heritage-green'
                    }`}
                  >
                    geomancy
                  </button>
                  , reflecting a profound cultural{' '}
                  <button
                    type="button"
                    onClick={() => handleWordClick('resilience')}
                    className={`cursor-pointer px-1 py-0.5 rounded transition-all font-semibold ${
                      selectedWord.id === 'resilience'
                        ? 'bg-antique-gold/30 text-heritage-forest ring-2 ring-antique-gold'
                        : 'underline decoration-antique-gold decoration-2 underline-offset-4 hover:bg-mist-cloud/60 text-heritage-green'
                    }`}
                  >
                    resilience
                  </button>{' '}
                  that endured centuries of change.
                </p>

                {/* Bilingual Vietnamese translation preview */}
                {demoMode === 'bilingual' && (
                  <p className="mt-3 pt-3 border-t border-line text-xs sm:text-sm text-text-muted font-serif italic leading-relaxed">
                    Được khởi dựng từ đầu thế kỷ 19, Hoàng thành Huế là một thành tựu kiến trúc kiệt xuất. Các nghệ nhân xưa đã quy hoạch từng pháo đài theo thuật phong thủy phương Đông, phản ánh sức sống kiên cường của nền văn hóa qua hàng thế kỷ biến thiên.
                  </p>
                )}
              </div>
            </div>

            {/* Live Interactive Vocabulary Tooltip Inspector Card */}
            <div className="p-5 rounded-2xl bg-rice-paper border-2 border-antique-gold/40 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-xl font-bold text-heritage-green">
                      {selectedWord.word}
                    </span>
                    <span className="text-xs font-mono text-mountain-teal font-semibold">
                      {selectedWord.ipa}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-text-muted italic">
                    {selectedWord.pos}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlayWordAudio(selectedWord.word)}
                  className="px-3.5 py-2 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs focus-ring"
                  aria-label={`Nghe phát âm từ ${selectedWord.word}`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Dừng</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-antique-gold" />
                      <span>Phát âm AI</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 border-t border-line/60 space-y-1">
                <p className="text-xs sm:text-sm font-bold text-text-main">
                  {selectedWord.meaning}
                </p>
                <p className="text-xs text-text-muted italic font-serif leading-relaxed">
                  &ldquo;{selectedWord.example}&rdquo;
                </p>
              </div>
            </div>

            {/* Subtle bottom hint */}
            <div className="flex items-center justify-between text-[11px] text-text-muted pt-1">
              <span>Chạm vào các từ gạch chân để đổi từ tra cứu</span>
              <span className="font-bold text-heritage-green">4/4 Từ cốt lõi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveReaderDemoSection;
