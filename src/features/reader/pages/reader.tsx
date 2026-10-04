import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Link from "@/components/Link";
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Moon,
  Sun,
  X,
  Columns,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { AudioShadowingBar } from "../components/audio-shadowing-bar";
import { BilingualReaderView } from "../components/bilingual-reader-view";
import { ExtensiveReaderView } from "../components/extensive-reader-view";
import { VoiceCustomizerModal } from "../components/voice-customizer-modal";
import { Footer } from "@/components/Footer";
import {
  VOCAB_DATABASE,
  RECOMMENDED_ARTICLES,
  ARTICLE_BILINGUAL_DATA,
  AVAILABLE_VOICES,
  getVoiceAudioUrl,
  type VocabItem,
} from "@/data/readerData";

export default function ReaderPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Reader Control States
  const [fontSize, setFontSize] = useState<number>(17);
  const [fontFamily, setFontFamily] = useState<"serif" | "sans">("serif");
  const [themeMode, setThemeMode] = useState<"olive" | "paper" | "dark">("paper");
  
  // Initial mode reads from URL query ?mode=extensive
  const initialMode = searchParams.get("mode") === "extensive" ? "extensive" : "bilingual";
  const [readingMode, setReadingMode] = useState<"bilingual" | "extensive">(initialMode);
  
  // Sync state if URL searchParams change externally
  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "extensive" && readingMode !== "extensive") {
      setReadingMode("extensive");
    } else if (modeParam !== "extensive" && readingMode !== "bilingual") {
      setReadingMode("bilingual");
    }
  }, [searchParams]);

  const handleModeChange = (newMode: "bilingual" | "extensive") => {
    setReadingMode(newMode);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (newMode === "extensive") {
          next.set("mode", "extensive");
        } else {
          next.delete("mode");
        }
        return next;
      },
      { replace: true }
    );
  };
  const [isVocabDrawerOpen, setIsVocabDrawerOpen] = useState<boolean>(false);
  const [selectedVocab, setSelectedVocab] = useState<VocabItem | null>(null);
  const [bookmarkedWords, setBookmarkedWords] = useState<Record<string, boolean>>({});

  // Quiz States (Bilingual Mode)
  const [q1Answer, setQ1Answer] = useState<string>("");
  const [q2Answer, setQ2Answer] = useState<string>("");
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Audio Shadowing Player States (Real Neural TTS & Multi-Voice)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isRepeatLoop, setIsRepeatLoop] = useState<boolean>(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);
  const [hoveredSentenceIndex, setHoveredSentenceIndex] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Customizable Google Gemini Voice State (Puck, Charon, Kore, Aoede, Fenrir)
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(() => {
    const saved = localStorage.getItem("vie_preferred_voice");
    if (saved && AVAILABLE_VOICES.some((v) => v.id === saved)) {
      return saved;
    }
    return "puck";
  });
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  // Initialize HTML5 Audio Element for high quality Neural TTS playback
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };
    const handleEnded = () => {
      if (isRepeatLoop) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        setIsPlaying(false);
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [isRepeatLoop]);

  // Sync playback speed with HTML5 audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const playAudioUrl = (url: string) => {
    if (!audioRef.current) return;
    const isDifferent = !audioRef.current.src.endsWith(url);
    if (isDifferent) {
      audioRef.current.src = url;
      audioRef.current.load();
    }
    audioRef.current.playbackRate = playbackSpeed;
    audioRef.current.play().catch((err) => {
      console.warn("Audio playback failed for", url, err);
      if (url.endsWith(".wav") && audioRef.current) {
        audioRef.current.src = url.replace(".wav", ".mp3");
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play().catch(console.error);
      }
    });
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (activeSentenceIndex !== null) {
        playAudioUrl(getVoiceAudioUrl(selectedVoiceId, "sentence", activeSentenceIndex));
      } else {
        playAudioUrl(getVoiceAudioUrl(selectedVoiceId, "full"));
      }
    }
  };

  const handleSelectSentence = (index: number) => {
    if (activeSentenceIndex === index && isPlaying) {
      audioRef.current?.pause();
      return;
    }
    setActiveSentenceIndex(index);
    playAudioUrl(getVoiceAudioUrl(selectedVoiceId, "sentence", index));
  };

  const handleSelectVoice = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
    localStorage.setItem("vie_preferred_voice", voiceId);

    // If currently playing, seamlessly hot-swap audio with new voice
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      const curTime = audioRef.current.currentTime;
      const newUrl = getVoiceAudioUrl(
        voiceId,
        activeSentenceIndex !== null ? "sentence" : "full",
        activeSentenceIndex ?? 0
      );
      audioRef.current.src = newUrl;
      audioRef.current.load();
      audioRef.current.currentTime = curTime;
      audioRef.current.playbackRate = playbackSpeed;
      if (wasPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  };

  const handleSeek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const currentSentenceEn =
    activeSentenceIndex !== null && ARTICLE_BILINGUAL_DATA.paragraphs[activeSentenceIndex]
      ? ARTICLE_BILINGUAL_DATA.paragraphs[activeSentenceIndex].enText
      : "Toàn bài đọc: " + ARTICLE_BILINGUAL_DATA.titleEn;

  const activeVoiceConfig =
    AVAILABLE_VOICES.find((v) => v.id === selectedVoiceId) || AVAILABLE_VOICES[0];

  const playingModeTitle =
    activeSentenceIndex !== null
      ? `Câu ${activeSentenceIndex + 1} / ${ARTICLE_BILINGUAL_DATA.paragraphs.length} (${activeVoiceConfig.name} - ${activeVoiceConfig.genderLabel})`
      : `Toàn bài đọc (${activeVoiceConfig.name} - ${activeVoiceConfig.genderLabel})`;

  // Toggle Vocabulary Drawer
  const openVocab = (key: string) => {
    if (VOCAB_DATABASE[key]) {
      setSelectedVocab(VOCAB_DATABASE[key]);
      setIsVocabDrawerOpen(true);
    }
  };

  const toggleBookmarkWord = (wordId: string) => {
    setBookmarkedWords((prev) => ({ ...prev, [wordId]: !prev[wordId] }));
  };

  // Dynamic style helpers based on themeMode
  const canvasBgClass =
    themeMode === "olive"
      ? "bg-[#545C2D] text-[#FBF7EE]"
      : themeMode === "dark"
        ? "bg-[#141C1A] text-[#E8DFCB]"
        : "bg-[#F6EEDC] text-[#3F5550]";

  const paperSheetBgClass =
    themeMode === "dark"
      ? "bg-[#1E2925] text-[#FBF7EE] border-[#D9B76A]/35 shadow-[0_12px_45px_rgba(0,0,0,0.6)]"
      : themeMode === "olive"
        ? "bg-[#FBF7EE] text-[#2C3B37] border-[rgba(30,75,67,0.12)] shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
        : "bg-[#FBF7EE] text-[#2C3B37] border-[rgba(30,75,67,0.12)] shadow-md";

  const paperTitleColor =
    themeMode === "dark"
      ? "text-[#FBF7EE] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
      : "text-[#1E4B43]";

  const paperSubtitleColor =
    themeMode === "dark"
      ? "text-[#BFE3EA]"
      : "text-[#4B5563]";

  const paperBodyTextColor =
    themeMode === "dark"
      ? "text-[#F6EEDC]/95"
      : "text-[#2C3B37]";

  const vocabBtnClass =
    themeMode === "dark"
      ? "border-b-2 border-dashed border-[#D9B76A] bg-[#D9B76A]/30 font-semibold text-[#D9B76A] hover:bg-[#D9B76A]/45 px-1 rounded transition-colors cursor-pointer shadow-xs"
      : "border-b-2 border-dashed border-[#D9B76A] bg-[#D9B76A]/15 font-semibold text-[#1E4B43] px-1 rounded hover:bg-[#D9B76A]/30 transition-colors cursor-pointer";

  const bottomCardBgClass =
    themeMode === "dark"
      ? "bg-[#1E2925] text-[#FBF7EE] border-[#D9B76A]/30 shadow-xl"
      : "bg-[#FBF7EE] text-[#3F5550] border-[rgba(30,75,67,0.12)] shadow-xl";

  return (
    <main className="min-h-screen bg-[#FBF7EE] text-[#3F5550] relative selection:bg-[#BFE3EA] selection:text-[#1E4B43]">
      {/* Top Reader Toolbar Control Bar (sticky at top 0) */}
      <section className="bg-[#1E4B43] text-[#FBF7EE] border-b border-[#D9B76A]/30 py-3 px-6 sm:px-8 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Side: Back Link & Breadcrumbs */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <Link
              href="/discovery"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FBF7EE] hover:text-[#D9B76A] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 text-[#D9B76A] group-hover:-translate-x-1 transition-transform" />
              <span className="font-serif italic text-sm">Reading</span>
            </Link>
          </div>

          {/* Right Controls: Reading Mode Toggle, Font Family, Font Size, Voice Customizer, Theme Toggle */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-semibold">
            {/* Sinh Voice Gemini Action Button */}
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D9B76A] to-[#FCE5B5] text-[#1E4B43] hover:brightness-110 active:scale-95 transition-all cursor-pointer font-bold text-xs shadow-md"
              title="Sinh giọng đọc cho bài đọc này bằng Google Gemini AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1E4B43] fill-[#1E4B43]" />
              <span>Sinh Voice Gemini</span>
            </button>

            {/* Tùy chỉnh Giọng đọc AI */}
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#163D37] border border-[#D9B76A]/40 text-[#FCE5B5] hover:bg-[#1E4B43] hover:border-[#D9B76A] transition-all cursor-pointer font-bold text-xs shadow-xs"
              title="Tùy chỉnh giọng đọc Google Gemini AI (Puck, Charon, Kore, Aoede, Fenrir)"
            >
              <span>{activeVoiceConfig.flag} {activeVoiceConfig.name}</span>
            </button>

            {/* Phông chữ (Serif vs Sans) */}
            <div className="flex items-center bg-[#163D37] p-1 rounded-xl border border-[#D9B76A]/40 text-xs font-bold">
              <button
                onClick={() => setFontFamily("serif")}
                className={`px-2.5 py-1 rounded-lg font-serif transition-all ${
                  fontFamily === "serif"
                    ? "bg-[#D9B76A] text-[#1E4B43] shadow-xs font-bold"
                    : "text-[#BFE3EA] hover:text-[#FBF7EE]"
                }`}
                title="Phông chữ Serif (Playfair)"
              >
                Aa Serif
              </button>
              <button
                onClick={() => setFontFamily("sans")}
                className={`px-2.5 py-1 rounded-lg font-sans transition-all ${
                  fontFamily === "sans"
                    ? "bg-[#D9B76A] text-[#1E4B43] shadow-xs font-bold"
                    : "text-[#BFE3EA] hover:text-[#FBF7EE]"
                }`}
                title="Phông chữ Sans (Plus Jakarta)"
              >
                Aa Sans
              </button>
            </div>

            {/* Cỡ chữ (Icon A⁻ / A⁺) */}
            <div className="flex items-center bg-[#163D37] p-1 rounded-xl border border-[#D9B76A]/40">
              <button
                onClick={() => setFontSize((prev) => Math.max(14, prev - 1))}
                className="px-2 py-1 rounded-lg hover:bg-[#1E4B43] text-[#BFE3EA] hover:text-[#FBF7EE] font-extrabold text-xs transition-colors"
                title="Giảm cỡ chữ"
              >
                A⁻
              </button>
              <span className="font-mono text-xs font-bold text-[#D9B76A] px-1.5">{fontSize}px</span>
              <button
                onClick={() => setFontSize((prev) => Math.min(24, prev + 1))}
                className="px-2 py-1 rounded-lg hover:bg-[#1E4B43] text-[#BFE3EA] hover:text-[#FBF7EE] font-extrabold text-xs transition-colors"
                title="Tăng cỡ chữ"
              >
                A⁺
              </button>
            </div>

            {/* Toggle Chế độ Đọc: Song Ngữ vs Extensive Reading */}
            <div className="flex items-center bg-[#163D37] p-1 rounded-xl border border-[#D9B76A]/40 text-xs font-bold">
              <button
                onClick={() => handleModeChange("bilingual")}
                className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                  readingMode === "bilingual"
                    ? "bg-[#D9B76A] text-[#1E4B43] shadow-xs"
                    : "text-[#BFE3EA] hover:text-[#FBF7EE]"
                }`}
                title="Chế độ Song Ngữ (Anh - Việt)"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Song ngữ</span>
              </button>
              <button
                onClick={() => handleModeChange("extensive")}
                className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                  readingMode === "extensive"
                    ? "bg-[#D9B76A] text-[#1E4B43] shadow-xs"
                    : "text-[#BFE3EA] hover:text-[#FBF7EE]"
                }`}
                title="Chế độ Đọc Mở Rộng Tiếng Anh (Extensive Reading)"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Extensive</span>
              </button>
            </div>

            {/* Từ vựng bài đọc Button */}
            <button
              onClick={() => {
                setSelectedVocab(VOCAB_DATABASE["well-read"]);
                setIsVocabDrawerOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D9B76A] text-[#1E4B43] font-bold shadow-sm hover:bg-[#c9a657] transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>5 từ vựng</span>
            </button>

            {/* Theme Toggle */}
            <div className="flex items-center bg-[#163D37] p-1 rounded-xl border border-[#D9B76A]/40">
              <button
                onClick={() => setThemeMode("dark")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  themeMode === "dark" ? "bg-[#18211E] text-[#D9B76A]" : "text-[#BFE3EA]"
                }`}
                title="Tối"
              >
                <Moon className="w-3 h-3 inline mr-1" />
                Tối
              </button>
              <button
                onClick={() => setThemeMode("olive")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  themeMode === "olive" ? "bg-[#545C2D] text-[#FBF7EE]" : "text-[#BFE3EA]"
                }`}
                title="Khung Olive"
              >
                Olive
              </button>
              <button
                onClick={() => setThemeMode("paper")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  themeMode === "paper" ? "bg-[#FBF7EE] text-[#1E4B43]" : "text-[#BFE3EA]"
                }`}
                title="Sáng"
              >
                <Sun className="w-3 h-3 inline mr-1" />
                Sáng
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Olive Canvas Container */}
      <section className={`py-8 px-4 sm:px-8 transition-colors duration-300 ${canvasBgClass}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Audio Shadowing Engine Section */}
          <AudioShadowingBar
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            playbackSpeed={playbackSpeed}
            onChangeSpeed={(speed) => setPlaybackSpeed(speed)}
            isRepeatLoop={isRepeatLoop}
            onToggleRepeatLoop={() => setIsRepeatLoop(!isRepeatLoop)}
            currentSentenceEn={currentSentenceEn}
            themeMode={themeMode}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            playingModeTitle={playingModeTitle}
            selectedVoiceId={selectedVoiceId}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          />

          {/* Main Reading Views: Bilingual View vs Extensive Reading View */}
          {readingMode === "bilingual" ? (
            <BilingualReaderView
              themeMode={themeMode}
              fontFamily={fontFamily}
              fontSize={fontSize}
              paperSheetBgClass={paperSheetBgClass}
              paperTitleColor={paperTitleColor}
              paperSubtitleColor={paperSubtitleColor}
              paperBodyTextColor={paperBodyTextColor}
              vocabBtnClass={vocabBtnClass}
              bottomCardBgClass={bottomCardBgClass}
              openVocab={openVocab}
              q1Answer={q1Answer}
              setQ1Answer={setQ1Answer}
              q2Answer={q2Answer}
              setQ2Answer={setQ2Answer}
              quizSubmitted={quizSubmitted}
              setQuizSubmitted={setQuizSubmitted}
              activeSentenceIndex={activeSentenceIndex}
              isPlayingSentence={isPlaying}
              onSelectSentence={handleSelectSentence}
              hoveredIndex={hoveredSentenceIndex}
              setHoveredIndex={setHoveredSentenceIndex}
              onOpenGeminiGenerator={() => setIsVoiceModalOpen(true)}
            />
          ) : (
            <ExtensiveReaderView
              themeMode={themeMode}
              fontFamily={fontFamily}
              fontSize={fontSize}
              paperSheetBgClass={paperSheetBgClass}
              paperTitleColor={paperTitleColor}
              paperSubtitleColor={paperSubtitleColor}
              paperBodyTextColor={paperBodyTextColor}
              vocabBtnClass={vocabBtnClass}
              bottomCardBgClass={bottomCardBgClass}
              openVocab={openVocab}
            />
          )}

          {/* Recommended Articles Section */}
          <div className="pt-8 border-t border-[rgba(217,183,106,0.2)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D9B76A]">
                  Continue Reading
                </span>
                <h3 className={`font-serif text-xl font-bold mt-0.5 ${themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"}`}>
                  Bài Đọc Đề Xuất Tiếp Theo
                </h3>
              </div>
              <Link
                href="/discovery"
                className={`text-xs font-bold inline-flex items-center gap-1 transition-colors ${
                  themeMode === "dark" ? "text-[#D9B76A] hover:text-white" : "text-[#1E4B43] hover:text-[#D9B76A]"
                }`}
              >
                <span>Xem tất cả bài đọc</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RECOMMENDED_ARTICLES.map((article) => (
                <Link
                  key={article.id}
                  href="/bilingual-reader"
                  className={`group p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    themeMode === "dark"
                      ? "bg-[#1E2925] border-[#D9B76A]/30 text-[#FBF7EE] shadow-md hover:border-[#D9B76A]"
                      : "bg-[#FBF7EE] border-[rgba(30,75,67,0.12)] text-[#3F5550] shadow-sm hover:shadow-md"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E4B43] bg-[#F6EEDC] px-2.5 py-1 rounded">
                      {article.category} • {article.level}
                    </span>
                    <h4 className={`font-serif text-base font-bold mt-3 group-hover:text-[#D9B76A] transition-colors ${themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"}`}>
                      {article.title}
                    </h4>
                    <p className="text-xs opacity-80 mt-1.5 line-clamp-2 leading-relaxed">
                      {article.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[rgba(217,183,106,0.2)] flex items-center justify-between text-xs font-semibold opacity-80">
                    <span>{article.readTime} • {article.vocabCount} Vocab</span>
                    <span className="text-[#D9B76A] group-hover:translate-x-1 transition-transform inline-block font-bold">
                      Đọc ngay →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Reader Footer */}
      <Footer />

      {/* Vocabulary Slide-Over Drawer Modal */}
      {isVocabDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsVocabDrawerOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Body Panel */}
          <div className="relative w-full max-w-md bg-[#FBF7EE] h-full shadow-2xl border-l border-[#D9B76A]/40 p-6 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(30,75,67,0.12)] mb-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1E4B43]">
                    Từ Vựng Bài Đọc
                  </h3>
                  <span className="text-xs text-[#6E7E79]">
                    "How to be disgustingly educated"
                  </span>
                </div>
                <button
                  onClick={() => setIsVocabDrawerOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F6EEDC] text-[#1E4B43] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Active Inspected Vocab Card */}
              {selectedVocab && (
                <div className="p-5 rounded-2xl bg-[#F6EEDC] border border-[#D9B76A]/40 mb-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-serif text-xl font-bold text-[#1E4B43]">
                      {selectedVocab.word}
                    </h4>
                    <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-[#1E4B43]/10 text-[#1E4B43]">
                      {selectedVocab.pos}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#6E7E79] italic mb-3">
                    {selectedVocab.ipa}
                  </p>
                  <p className="text-sm font-bold text-[#1E4B43] mb-3 leading-snug">
                    {selectedVocab.viMeaning}
                  </p>
                  <div className="p-3 rounded-xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.08)] text-xs text-[#3F5550] italic">
                    "{selectedVocab.contextSentence}"
                  </div>

                  <div className="mt-4 pt-3 border-t border-[rgba(30,75,67,0.10)] flex items-center justify-between">
                    <button
                      onClick={() => toggleBookmarkWord(selectedVocab.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E4B43] hover:text-[#D9B76A]"
                    >
                      {bookmarkedWords[selectedVocab.id] ? (
                        <>
                          <BookmarkCheck className="w-4 h-4 fill-[#1E4B43]" />
                          <span>Đã lưu vào bộ sưu tập</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" />
                          <span>Lưu từ vựng này</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* List of All Vocabulary in Article */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E7E79] mb-2">
                  Tất cả từ vựng trong bài ({Object.keys(VOCAB_DATABASE).length})
                </h4>
                {Object.values(VOCAB_DATABASE).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedVocab(item)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedVocab?.id === item.id
                        ? "bg-[#1E4B43] text-[#FBF7EE] border-[#D9B76A]"
                        : "bg-[#FBF7EE] text-[#3F5550] border-[rgba(30,75,67,0.10)] hover:bg-[#F6EEDC]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm">{item.word}</span>
                      <span className="text-[10px] opacity-80 uppercase font-mono">
                        {item.pos}
                      </span>
                    </div>
                    <p className="text-xs mt-1 line-clamp-1 opacity-90">{item.viMeaning}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-[rgba(30,75,67,0.12)] space-y-2 mt-6">
              <Link
                href="/discovery#flashcards"
                className="w-full py-3 rounded-full text-xs font-bold text-[#FBF7EE] bg-[#1E4B43] hover:bg-[#163D37] flex items-center justify-center gap-2 shadow-sm border border-[#D9B76A]/50 transition-all"
              >
                <span>Ôn Tập Flashcards từ vựng</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D9B76A]" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Voice Customizer Modal */}
      <VoiceCustomizerModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        selectedVoiceId={selectedVoiceId}
        onSelectVoice={handleSelectVoice}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={(speed) => setPlaybackSpeed(speed)}
        onVoiceGenerated={(newAudioUrl) => {
          playAudioUrl(newAudioUrl);
        }}
      />
    </main>
  );
}
