import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AudioShadowingBar,
  BilingualReaderView,
  ExtensiveReaderView,
  ReaderToolbar,
  ReaderVocabDrawer,
  ReaderRecommendedSection,
} from "../components";
import { Footer } from "@/components/Footer";
import {
  VOCAB_DATABASE,
  RECOMMENDED_ARTICLES,
  type VocabItem,
} from "@/data/readerData";

export default function ReaderPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Reader Control States
  const [fontSize, setFontSize] = useState<number>(17);
  const [themeMode, setThemeMode] = useState<"paper" | "dark">("paper");

  // Initial mode reads from URL query ?mode=extensive
  const initialMode =
    searchParams.get("mode") === "extensive" ? "extensive" : "bilingual";
  const [readingMode, setReadingMode] = useState<"bilingual" | "extensive">(
    initialMode
  );

  // Initial level reads from URL query ?level=Level 1/2/3
  const levelParam = searchParams.get("level");
  const initialLevel: "Level 1" | "Level 2" | "Level 3" =
    levelParam === "Level 1" || levelParam === "Level 3" ? levelParam : "Level 2";
  const [selectedLevel, setSelectedLevel] = useState<"Level 1" | "Level 2" | "Level 3">(
    initialLevel
  );

  // Sync state if URL searchParams change externally
  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "extensive" && readingMode !== "extensive") {
      setReadingMode("extensive");
    } else if (modeParam !== "extensive" && readingMode !== "bilingual") {
      setReadingMode("bilingual");
    }

    const currentLvl = searchParams.get("level");
    if (
      (currentLvl === "Level 1" || currentLvl === "Level 2" || currentLvl === "Level 3") &&
      currentLvl !== selectedLevel
    ) {
      setSelectedLevel(currentLvl);
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

  const handleLevelChange = (newLevel: "Level 1" | "Level 2" | "Level 3") => {
    setSelectedLevel(newLevel);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("level", newLevel);
        return next;
      },
      { replace: true }
    );
  };

  const [isVocabDrawerOpen, setIsVocabDrawerOpen] = useState<boolean>(false);
  const [selectedVocab, setSelectedVocab] = useState<VocabItem | null>(null);
  const [bookmarkedWords, setBookmarkedWords] = useState<
    Record<string, boolean>
  >({});

  // Quiz States (Bilingual Mode)
  const [q1Answer, setQ1Answer] = useState<string>("");
  const [q2Answer, setQ2Answer] = useState<string>("");
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Audio Shadowing Bar states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isRepeatLoop, setIsRepeatLoop] = useState<boolean>(false);
  const [currentSentenceEn] = useState<string>(
    "Tết Nguyên Đán, often called simply Tết, is described as the most important and sacred holiday in Vietnamese culture."
  );

  const handleTogglePlay = () => {
    if (isPlaying) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentSentenceEn);
        utterance.rate = playbackSpeed;
        utterance.lang = "en-US";
        utterance.onend = () => {
          if (isRepeatLoop) {
            window.speechSynthesis.speak(utterance);
          } else {
            setIsPlaying(false);
          }
        };
        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

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
    themeMode === "dark"
      ? "bg-[#141C1A] text-[#E8DFCB]"
      : "bg-[#F6EEDC] text-[#3F5550]";

  const paperSheetBgClass =
    themeMode === "dark"
      ? "bg-[#1E2925] text-[#FBF7EE] border-[#D9B76A]/35 shadow-[0_12px_45px_rgba(0,0,0,0.6)]"
      : "bg-[#FBF7EE] text-[#2C3B37] border-[rgba(30,75,67,0.12)] shadow-md";

  const paperTitleColor =
    themeMode === "dark"
      ? "text-[#FBF7EE] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
      : "text-[#1E4B43]";

  const paperSubtitleColor =
    themeMode === "dark" ? "text-[#BFE3EA]" : "text-[#4B5563]";

  const paperBodyTextColor =
    themeMode === "dark" ? "text-[#F6EEDC]/95" : "text-[#2C3B37]";

  const vocabBtnClass =
    themeMode === "dark"
      ? "ink-underline border-b-2 border-dashed border-antique-gold bg-antique-gold/30 font-semibold text-antique-gold hover:bg-antique-gold/45 px-1 rounded transition-colors cursor-pointer shadow-xs focus-ring-dark"
      : "ink-underline border-b-2 border-dashed border-antique-gold bg-antique-gold/15 font-semibold text-heritage-green px-1 rounded hover:bg-antique-gold/30 transition-colors cursor-pointer focus-ring";

  const bottomCardBgClass =
    themeMode === "dark"
      ? "bg-[#1E2925] text-[#FBF7EE] border-[#D9B76A]/30 shadow-xl"
      : "bg-[#FBF7EE] text-[#3F5550] border-[rgba(30,75,67,0.12)] shadow-xl";

  return (
    <main className="min-h-screen bg-[#FBF7EE] text-[#3F5550] relative selection:bg-[#BFE3EA] selection:text-[#1E4B43]">
      {/* Top Reader Toolbar Control Bar (sticky at top 0) */}
      <ReaderToolbar
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        readingMode={readingMode}
        onChangeReadingMode={handleModeChange}
        selectedLevel={selectedLevel}
        onChangeLevel={handleLevelChange}
        onOpenVocabList={() => {
          setSelectedVocab(VOCAB_DATABASE["sacred"]);
          setIsVocabDrawerOpen(true);
        }}
        vocabCount={Object.keys(VOCAB_DATABASE).length}
        themeMode={themeMode}
        onChangeThemeMode={setThemeMode}
      />

      {/* Main Canvas Container */}
      <section
        className={`py-8 px-4 sm:px-8 transition-colors duration-300 ${canvasBgClass}`}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Audio Shadowing Engine Section */}
          <AudioShadowingBar
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            playbackSpeed={playbackSpeed}
            onChangeSpeed={(speed: number) => setPlaybackSpeed(speed)}
            isRepeatLoop={isRepeatLoop}
            onToggleRepeatLoop={() => setIsRepeatLoop(!isRepeatLoop)}
            currentSentenceEn={currentSentenceEn}
            themeMode={themeMode}
            selectedLevel={selectedLevel}
          />

          {/* Main Reading Views: Bilingual View vs Extensive Reading View */}
          {readingMode === "bilingual" ? (
            <BilingualReaderView
              themeMode={themeMode}
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
              selectedLevel={selectedLevel}
              onChangeLevel={handleLevelChange}
            />
          ) : (
            <ExtensiveReaderView
              themeMode={themeMode}
              fontSize={fontSize}
              paperSheetBgClass={paperSheetBgClass}
              paperTitleColor={paperTitleColor}
              paperSubtitleColor={paperSubtitleColor}
              paperBodyTextColor={paperBodyTextColor}
              vocabBtnClass={vocabBtnClass}
              bottomCardBgClass={bottomCardBgClass}
              openVocab={openVocab}
              selectedLevel={selectedLevel}
              onChangeLevel={handleLevelChange}
            />
          )}

          {/* Recommended Articles Section */}
          <ReaderRecommendedSection
            articles={RECOMMENDED_ARTICLES}
            themeMode={themeMode}
          />
        </div>
      </section>

      {/* Main Reader Footer */}
      <Footer />

      {/* Vocabulary Slide-Over Drawer Modal */}
      <ReaderVocabDrawer
        isOpen={isVocabDrawerOpen}
        onClose={() => setIsVocabDrawerOpen(false)}
        selectedVocab={selectedVocab}
        onSelectVocab={setSelectedVocab}
        vocabList={Object.values(VOCAB_DATABASE)}
        bookmarkedWords={bookmarkedWords}
        onToggleBookmarkWord={toggleBookmarkWord}
      />
    </main>
  );
}
