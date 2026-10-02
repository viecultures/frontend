import React, { useState } from 'react';
import { Volume2, VolumeX, ArrowRight, Sparkles, BookOpen, Layers, CheckCircle2, Bookmark, ExternalLink, Moon, Sun, Type, Minimize2, Check } from 'lucide-react';
import { speakEnglish } from '@/utils/sampleSpeech';
import articleImage1 from '@/assets/pictures/1789477888834_3466390194730922005_g2285579428170464438_97fb29714b65f3e4f91196487a1510be.jpg';
import articleImage2 from '@/assets/pictures/1789477897671_3466390194730922005_g2285579428170464438_208c3b16036482dde07954a98eba6f37.jpg';

interface VocabItem {
  id: string;
  word: string;
  ipa: string;
  pos: string;
  meaning: string;
  example: string;
  collocation: string;
}

const DEMO_VOCAB: Record<string, VocabItem> = {
  sacred: {
    id: 'sacred',
    word: 'sacred',
    ipa: '/ˈseɪ.krɪd/',
    pos: 'adjective',
    meaning: 'Thiêng liêng, trang trọng trong tâm thức văn hóa dân tộc',
    example: 'Tết is described as the most important and sacred holiday in Vietnamese culture.',
    collocation: 'sacred holiday, sacred tradition',
  },
  renewal: {
    id: 'renewal',
    word: 'renewal',
    ipa: '/rɪˈnjuː.əl/',
    pos: 'noun',
    meaning: 'Sự đổi mới, khởi đầu chu kỳ may mắn và thịnh vượng',
    example: 'It marks the passage from the old year to the new one, bringing renewal and hope.',
    collocation: 'spiritual renewal, cultural renewal',
  },
  remembrance: {
    id: 'remembrance',
    word: 'remembrance',
    ipa: '/rɪˈmem.brəns/',
    pos: 'noun',
    meaning: 'Lòng tưởng nhớ, tri ân công đức tổ tiên cội nguồn',
    example: 'Tết stands for family reunion and remembrance of ancestral lineage.',
    collocation: 'ancestral remembrance, solemn remembrance',
  },
  culinary: {
    id: 'culinary',
    word: 'culinary',
    ipa: '/ˈkʌl.ɪ.nər.i/',
    pos: 'adjective',
    meaning: 'Thuộc về nghệ thuật ẩm thực truyền thống ba miền',
    example: 'Each region of Vietnam boasts its own unique culinary traditions for the spring feast.',
    collocation: 'culinary traditions, culinary heritage',
  },
  ancestral: {
    id: 'ancestral',
    word: 'ancestral',
    ipa: '/ænˈses.trəl/',
    pos: 'adjective',
    meaning: 'Thuộc về tổ tiên, gia tiên tiền tổ ngàn đời',
    example: 'Families gather around the ancestral altar to offer gratitude and prayers.',
    collocation: 'ancestral altar, ancestral gratitude',
  },
};

interface InteractiveReaderDemoSectionProps {
  onNavigate?: (view: string) => void;
}

export const InteractiveReaderDemoSection: React.FC<InteractiveReaderDemoSectionProps> = ({ onNavigate }) => {
  const [selectedWord, setSelectedWord] = useState<VocabItem | null>(DEMO_VOCAB.sacred);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [demoMode, setDemoMode] = useState<'bilingual' | 'extensive'>('bilingual');
  const [fontStyle, setFontStyle] = useState<'serif' | 'sans'>('serif');
  const [fontSize, setFontSize] = useState<number>(16);

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
      className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-surface border-t border-line vn-pattern-bg"
    >
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rice-paper text-heritage-green border border-antique-gold/40 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
            <span className="uppercase tracking-widest text-[11px] font-extrabold">
              TRẢI NGHIỆM TRÌNH ĐỌC SONG NGỮ
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-main tracking-tight leading-tight">
            Đọc Song Ngữ &amp; <span className="italic text-antique-gold font-serif">Tra Từ Thông Minh</span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-text-muted leading-relaxed font-normal max-w-2xl mx-auto">
            Trải nghiệm thực tế giao diện đọc đối chiếu 2 cột song song chuẩn học thuật, tra cứu tức thì phiên âm IPA, nghĩa bản ngữ và collocations chuyên sâu.
          </p>
        </div>

        {/* ── High-Fidelity Bilingual Reader Mockup Window ────────────────── */}
        <div className="w-full bg-surface rounded-3xl border-2 border-border-dark shadow-2xl overflow-hidden flex flex-col transition-all">
          {/* 1. Top Dark Reader Toolbar (matches bilingual-reader view) */}
          <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-heritage-dark text-warm-ivory flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
            {/* Left title */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-serif font-bold text-xs sm:text-sm text-warm-ivory tracking-wide">
                Trình Đọc Song Ngữ VieCultures
              </span>
            </div>

            {/* Right Toolbar Controls */}
            <div className="flex items-center flex-wrap gap-2 text-xs">
              {/* Font Switcher */}
              <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/10 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setFontStyle('serif')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    fontStyle === 'serif' ? 'bg-antique-gold text-heritage-forest' : 'text-warm-ivory/70 hover:text-warm-ivory'
                  }`}
                >
                  Aa Serif
                </button>
                <button
                  type="button"
                  onClick={() => setFontStyle('sans')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    fontStyle === 'sans' ? 'bg-antique-gold text-heritage-forest' : 'text-warm-ivory/70 hover:text-warm-ivory'
                  }`}
                >
                  Aa Sans
                </button>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/10 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setDemoMode('bilingual')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    demoMode === 'bilingual' ? 'bg-emerald-700 text-warm-ivory' : 'text-warm-ivory/70 hover:text-warm-ivory'
                  }`}
                >
                  📖 Song ngữ
                </button>
                <button
                  type="button"
                  onClick={() => setDemoMode('extensive')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    demoMode === 'extensive' ? 'bg-emerald-700 text-warm-ivory' : 'text-warm-ivory/70 hover:text-warm-ivory'
                  }`}
                >
                  📖 Extensive
                </button>
              </div>

              {/* Vocab Counter Badge */}
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 text-antique-bright border border-white/10 text-[11px] font-bold">
                🔖 16 từ vựng
              </span>
            </div>
          </div>

          {/* 2. Sub-bar / Helper Notice */}
          <div className="px-4 py-2 sm:px-6 bg-rice-paper border-b border-line flex flex-wrap items-center justify-between text-[11px] sm:text-xs text-text-muted">
            <div className="flex items-center gap-2 font-medium text-heritage-green">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Đồng bộ cuộn theo tỉ lệ: <strong>Đang bật</strong></span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-mountain-teal font-medium">
              <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
              <span>Chạm vào từ gạch chân để tra IPA &amp; nghe phát âm AI</span>
            </div>
          </div>

          {/* 3. Dual-Pane Parallel Columns Container */}
          <div className={`grid grid-cols-1 ${demoMode === 'bilingual' ? 'lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-line' : ''} bg-surface`}>
            {/* ═══ Left Pane: English Original [EN] ═══ */}
            <div className="p-6 sm:p-8 space-y-5 bg-[#FAF7F0]">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-line/60 pb-3">
                <div className="inline-flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-100/80 px-2.5 py-1 rounded-md">
                    ENGLISH ORIGINAL
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-sky-700 text-white px-1.5 py-0.5 rounded">
                    EN
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-mountain-teal">
                  Level B2–C1 • ~370 Words
                </span>
              </div>

              {/* Article Heading */}
              <div className="space-y-1.5">
                <h3 className={`font-serif text-2xl sm:text-3xl font-bold text-text-main leading-snug ${fontStyle === 'sans' ? 'font-sans' : 'font-serif'}`}>
                  Tết: Renewal, Remembrance and Regional Flavours
                </h3>
                <p className="text-xs sm:text-sm font-serif italic text-text-muted">
                  A cultural exploration of renewal, ancestral gratitude, and rich regional culinary traditions
                </p>
              </div>

              {/* Visual Banner Card */}
              <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden shadow-md border border-line">
                <img
                  src={articleImage1}
                  alt="Tết Heritage Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute top-3 left-3 bg-red-800/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  CULTURAL ESSAY
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-warm-ivory text-xs">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-antique-bright">VIETNAMESE LUNAR NEW YEAR</p>
                    <p className="font-serif font-bold text-sm">Tết Nguyên Đán Heritage</p>
                  </div>
                  <span className="text-[11px] text-warm-ivory/80">Truyền Thống &amp; Phong Vị Ba Miền</span>
                </div>
              </div>

              {/* Interactive Paragraph with Clickable Highlight Words */}
              <div className={`text-text-main leading-relaxed select-none ${fontStyle === 'sans' ? 'font-sans text-sm sm:text-base' : 'font-serif text-base sm:text-lg'}`}>
                <p>
                  Tết Nguyên Đán, often called simply Tết, is described as the most important and{' '}
                  <button
                    type="button"
                    onClick={() => handleWordClick('sacred')}
                    className={`cursor-pointer px-1 py-0.5 rounded transition-all font-semibold ${
                      selectedWord?.id === 'sacred'
                        ? 'bg-antique-gold/30 text-heritage-forest ring-2 ring-antique-gold'
                        : 'underline decoration-antique-gold decoration-2 underline-offset-4 hover:bg-mist-cloud text-heritage-green font-bold'
                    }`}
                  >
                    sacred
                  </button>{' '}
                  holiday in Vietnamese culture. It marks the passage from the old year to the new one, bringing{' '}
                  <button
                    type="button"
                    onClick={() => handleWordClick('renewal')}
                    className={`cursor-pointer px-1 py-0.5 rounded transition-all font-semibold ${
                      selectedWord?.id === 'renewal'
                        ? 'bg-antique-gold/30 text-heritage-forest ring-2 ring-antique-gold'
                        : 'underline decoration-antique-gold decoration-2 underline-offset-4 hover:bg-mist-cloud text-heritage-green font-bold'
                    }`}
                  >
                    renewal
                  </button>{' '}
                  and hope. Beyond festivities, it stands for family reunion and solemn{' '}
                  <button
                    type="button"
                    onClick={() => handleWordClick('remembrance')}
                    className={`cursor-pointer px-1 py-0.5 rounded transition-all font-semibold ${
                      selectedWord?.id === 'remembrance'
                        ? 'bg-antique-gold/30 text-heritage-forest ring-2 ring-antique-gold'
                        : 'underline decoration-antique-gold decoration-2 underline-offset-4 hover:bg-mist-cloud text-heritage-green font-bold'
                    }`}
                  >
                    remembrance
                  </button>{' '}
                  of our{' '}
                  <button
                    type="button"
                    onClick={() => handleWordClick('ancestral')}
                    className={`cursor-pointer px-1 py-0.5 rounded transition-all font-semibold ${
                      selectedWord?.id === 'ancestral'
                        ? 'bg-antique-gold/30 text-heritage-forest ring-2 ring-antique-gold'
                        : 'underline decoration-antique-gold decoration-2 underline-offset-4 hover:bg-mist-cloud text-heritage-green font-bold'
                    }`}
                  >
                    ancestral
                  </button>{' '}
                  roots through rich{' '}
                  <button
                    type="button"
                    onClick={() => handleWordClick('culinary')}
                    className={`cursor-pointer px-1 py-0.5 rounded transition-all font-semibold ${
                      selectedWord?.id === 'culinary'
                        ? 'bg-antique-gold/30 text-heritage-forest ring-2 ring-antique-gold'
                        : 'underline decoration-antique-gold decoration-2 underline-offset-4 hover:bg-mist-cloud text-heritage-green font-bold'
                    }`}
                  >
                    culinary
                  </button>{' '}
                  traditions.
                </p>
              </div>
            </div>

            {/* ═══ Right Pane: Vietnamese Translation [VI] (Only in Bilingual Mode) ═══ */}
            {demoMode === 'bilingual' && (
              <div className="p-6 sm:p-8 space-y-5 bg-[#FAF7F0]/80">
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-line/60 pb-3">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-md">
                      BẢN DỊCH TIẾNG VIỆT
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-700 text-white px-1.5 py-0.5 rounded">
                      VI
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-mountain-teal">
                    Bản Dịch Chuẩn Ngữ Cảnh
                  </span>
                </div>

                {/* Article Heading in Vietnamese */}
                <div className="space-y-1.5">
                  <h3 className={`font-serif text-2xl sm:text-3xl font-bold text-text-main leading-snug ${fontStyle === 'sans' ? 'font-sans' : 'font-serif'}`}>
                    Tết: Sự đổi mới, lòng tưởng nhớ và hương vị các vùng miền
                  </h3>
                  <p className="text-xs sm:text-sm font-serif italic text-text-muted">
                    Khám phá văn hóa về sự đổi mới, lòng tri ân tổ tiên và phong vị ẩm thực ba miền
                  </p>
                </div>

                {/* Visual Banner Card */}
                <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden shadow-md border border-line">
                  <img
                    src={articleImage2}
                    alt="Phong Vị Tết Cổ Truyền"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute top-3 left-3 bg-emerald-800/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    TẢN VĂN VĂN HÓA
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-warm-ivory text-xs">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-antique-bright">PHONG TỤC &amp; ẨM THỰC</p>
                      <p className="font-serif font-bold text-sm">Phong Vị Tết Cổ Truyền</p>
                    </div>
                    <span className="text-[11px] text-warm-ivory/80">Bản Dịch Đối Chiếu Song Ngữ</span>
                  </div>
                </div>

                {/* Vietnamese Translated Paragraph */}
                <div className={`text-text-main leading-relaxed ${fontStyle === 'sans' ? 'font-sans text-sm sm:text-base' : 'font-serif text-base sm:text-lg'}`}>
                  <p>
                    Tết Nguyên Đán, thường được gọi đơn giản là Tết, được mô tả là ngày lễ quan trọng và thiêng liêng nhất trong văn hóa Việt Nam. Tết đánh dấu sự chuyển giao từ năm cũ sang năm mới, mang theo nguồn sinh khí đổi mới và hy vọng. Vượt lên trên những ngày hội vui tươi, Tết là dịp đoàn viên gia đình và tưởng nhớ tổ tiên sâu sắc thông qua những phong vị ẩm thực cổ truyền độc đáo.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 4. Live Floating Vocabulary Inspector Card (Active when word is clicked) */}
          {selectedWord && (
            <div className="p-5 sm:p-6 bg-rice-paper border-t-2 border-antique-gold/40 shadow-inner flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-xl font-bold text-heritage-green">
                    {selectedWord.word}
                  </span>
                  <span className="text-xs font-mono font-bold text-mountain-teal bg-white/80 px-2 py-0.5 rounded border border-line">
                    {selectedWord.ipa}
                  </span>
                  <span className="text-xs font-semibold text-text-muted italic">
                    {selectedWord.pos}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-text-main">
                  {selectedWord.meaning}
                </p>

                <p className="text-xs text-text-muted italic font-serif">
                  &ldquo;{selectedWord.example}&rdquo;
                </p>

                <div className="text-[11px] font-mono text-emerald-800">
                  Collocation: <strong>{selectedWord.collocation}</strong>
                </div>
              </div>

              {/* Pronunciation & Action Button */}
              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handlePlayWordAudio(selectedWord.word)}
                  className="px-4 py-2.5 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs focus-ring"
                  aria-label={`Nghe phát âm từ ${selectedWord.word}`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Dừng âm</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-antique-bright" />
                      <span>Phát âm AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* 5. Bottom Call-To-Action Banner */}
          <div className="p-4 sm:p-5 bg-heritage-forest text-warm-ivory flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-antique-gold/30">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-antique-bright shrink-0" />
              <span>Trải nghiệm toàn bộ 500+ bài đọc song ngữ với AI Audio Shadowing</span>
            </div>

            <button
              type="button"
              onClick={handleOpenReader}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-antique-bright via-antique-rich to-antique-gold text-heritage-forest font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:brightness-105 active:scale-[0.98] flex items-center gap-2 cursor-pointer focus-ring shrink-0"
            >
              <span>Mở Trình Đọc Song Ngữ Đầy Đủ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveReaderDemoSection;
