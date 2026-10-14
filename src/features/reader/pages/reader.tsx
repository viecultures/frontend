import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AudioShadowingBar,
  BilingualReaderView,
  ExtensiveReaderView,
  ReaderToolbar,
  ReaderVocabDrawer,
  ReaderRecommendedSection,
  VoiceCustomizerModal,
} from "../components";
import { Footer } from "@/components/Footer";
import {
  VOCAB_DATABASE,
  RECOMMENDED_ARTICLES,
  type VocabItem,
} from "@/data/readerData";
import { GEMINI_VOICES, type GeminiVoice } from "../types/voice";
import { readerApiService } from "../services/readerApiService";
import type { ReaderArticleData } from "../services/readerApiService";

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

  // Dynamic Post Data from Backend API (null = fallback to Tết default)
  const [articleData, setArticleData] = useState<ReaderArticleData | null>(null);

  // Fetch article data whenever postId, story, article, or id URL parameter changes
  useEffect(() => {
    const postId = searchParams.get("postId") || searchParams.get("id");
    const storyId = searchParams.get("story") || searchParams.get("article");
    const targetId = postId || storyId;

    if (!targetId || targetId === "tet-holiday") {
      setArticleData(null);
      return;
    }

    let isMounted = true;
    readerApiService
      .getPostById(targetId)
      .then((post) => {
        if (!isMounted) return;
        if (post) {
          const mapped = readerApiService.mapPostToReaderData(post);
          setArticleData(mapped);
          if (mapped.level && (mapped.level === "Level 1" || mapped.level === "Level 2" || mapped.level === "Level 3")) {
            setSelectedLevel(mapped.level);
          }
        } else {
          // Fallback to local curated article (landmarks or discovery lessons)
          const localArticle = readerApiService.getLocalArticle(targetId, selectedLevel);
          if (localArticle) {
            setArticleData(localArticle);
            if (localArticle.level && (localArticle.level === "Level 1" || localArticle.level === "Level 2" || localArticle.level === "Level 3")) {
              setSelectedLevel(localArticle.level as any);
            }
          } else {
            setArticleData(null);
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          const localArticle = readerApiService.getLocalArticle(targetId, selectedLevel);
          setArticleData(localArticle);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [searchParams.get("postId"), searchParams.get("story"), searchParams.get("article"), searchParams.get("id")]);

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

  const handleLevelChange = async (newLevel: "Level 1" | "Level 2" | "Level 3") => {
    setSelectedLevel(newLevel);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("level", newLevel);
        return next;
      },
      { replace: true }
    );

    // If currently viewing a post with topicGroup, attempt to switch to the corresponding CEFR post
    if (articleData?.topicGroup) {
      const levelMap: Record<string, string[]> = {
        "Level 1": ["A1", "A2", "Level 1"],
        "Level 2": ["B1", "B2", "Level 2"],
        "Level 3": ["C1", "C2", "Level 3"],
      };
      const candidateLevels = levelMap[newLevel] || [newLevel];
      for (const lvl of candidateLevels) {
        const matchingPost = await readerApiService.getPostByTopicGroupAndLevel(articleData.topicGroup, lvl);
        if (matchingPost) {
          setArticleData(readerApiService.mapPostToReaderData(matchingPost));
          setSearchParams(
            (prev) => {
              const next = new URLSearchParams(prev);
              next.set("postId", matchingPost.id);
              next.set("level", newLevel);
              return next;
            },
            { replace: true }
          );
          break;
        }
      }
    }
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

  // ── Google Gemini Real Audio Engine (Bỏ hoàn toàn giọng robotic cũ) ──
  const [selectedVoiceId, setSelectedVoiceId] = useState<
    "puck" | "charon" | "kore" | "aoede" | "fenrir"
  >("puck");
  const [audioScope, setAudioScope] = useState<"full" | "sentence">("full");
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isRepeatLoop, setIsRepeatLoop] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSentenceEn =
    articleData && articleData.paragraphs.length > 0 && articleData.paragraphs[0].enText
      ? articleData.paragraphs[0].enText.split(". ")[0] + "."
      : "Tết Nguyên Đán, often called simply Tết, is described as the most important and sacred holiday in Vietnamese culture.";

  const currentVoice: GeminiVoice =
    GEMINI_VOICES.find((v) => v.id === selectedVoiceId) || GEMINI_VOICES[0];
  const currentAudioUrl =
    articleData?.shadowingAudioUrl ||
    (audioScope === "full"
      ? currentVoice.fullAudioUrl
      : currentVoice.sentenceAudioUrl);

  // Initialize and update Audio element when voice or scope changes
  useEffect(() => {
    const wasPlaying = isPlaying;

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    audio.src = currentAudioUrl;
    audio.playbackRate = playbackSpeed;
    audio.muted = isMuted;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (isRepeatLoop) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    if (wasPlaying) {
      audio.play().catch(() => {});
    }

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [currentAudioUrl]);

  // Sync playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Sync mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Handle Play/Pause
  const handleTogglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.warn("Audio play prevented:", err);
      });
    }
  };

  // Handle Seek / Scrubber drag
  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Handle Restart audio
  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      audioRef.current.play().catch(() => {});
    }
  };

  // Handle Voice Selection
  const handleSelectVoice = (
    voiceId: "puck" | "charon" | "kore" | "aoede" | "fenrir"
  ) => {
    setSelectedVoiceId(voiceId);
  };

  // Toggle Vocabulary Drawer
  const openVocab = (key: string) => {
    const lowerKey = key.trim().toLowerCase();
    const vocab = articleData?.vocabMap?.[lowerKey] || articleData?.vocabMap?.[key] || VOCAB_DATABASE[key];
    if (vocab) {
      setSelectedVocab(vocab);
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
          const firstVocab = articleData && articleData.vocabularies.length > 0
            ? articleData.vocabularies[0]
            : VOCAB_DATABASE["sacred"];
          setSelectedVocab(firstVocab);
          setIsVocabDrawerOpen(true);
        }}
        vocabCount={articleData ? articleData.vocabularies.length : Object.keys(VOCAB_DATABASE).length}
        themeMode={themeMode}
        onChangeThemeMode={setThemeMode}
        onOpenVoiceCustomizer={() => setIsVoiceModalOpen(true)}
        selectedVoiceName={currentVoice.name}
        selectedVoiceFlag={currentVoice.flag}
      />

      {/* Main Canvas Container */}
      <section
        className={`py-8 px-4 sm:px-8 transition-colors duration-300 ${canvasBgClass}`}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Audio Shadowing Engine Section with Real Google Gemini Audio */}
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
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            onRestart={handleRestart}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
            selectedVoiceName={currentVoice.name}
            selectedVoiceFlag={currentVoice.flag}
            selectedVoiceGender={currentVoice.gender}
            audioScope={audioScope}
            onOpenVoiceCustomizer={() => setIsVoiceModalOpen(true)}
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
              articleData={articleData}
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
              articleData={articleData}
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
        vocabList={articleData && articleData.vocabularies.length > 0 ? articleData.vocabularies : Object.values(VOCAB_DATABASE)}
        bookmarkedWords={bookmarkedWords}
        onToggleBookmarkWord={toggleBookmarkWord}
        deckId={articleData?.id || searchParams.get("story") || searchParams.get("article") || 'tet-holiday'}
        selectedLevel={selectedLevel}
      />

      {/* Voice Customizer Modal (Tùy chỉnh giọng đọc Google Gemini) */}
      <VoiceCustomizerModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        selectedVoiceId={selectedVoiceId}
        onSelectVoice={handleSelectVoice}
        audioScope={audioScope}
        onChangeAudioScope={setAudioScope}
        themeMode={themeMode}
      />
    </main>
  );
}
