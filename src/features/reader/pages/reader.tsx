import '../reader-components.css';
import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AudioShadowingBar,
  BilingualReaderView,
  ExtensiveReaderView,
  ReaderToolbar,
  ReaderVocabDrawer,
  ReaderRecommendedSection,
  VoiceCustomizerModal,
  FloatingAiCompanionWidget,
} from "../components";
import { Footer } from "@/components/Footer";
import {
  VOCAB_DATABASE,
  RECOMMENDED_ARTICLES,
  type VocabItem,
} from "@/data/readerData";
import { GEMINI_VOICES, type GeminiVoice } from "../types/voice";
import { readerApiService, readerLevelFor } from "../services/readerApiService";
import type { ReaderArticleData } from "../services/readerApiService";
import { getStoredUser, setStoredUser, clearAuthStorage, getIsProUser, type AppUser } from "@/utils/auth-storage";

import { articleKey, cacheArticle, getCachedArticle } from '@/services/learning/learningStorage';
import { useSavedVocabulary, SavedVocabularyContext } from '../hooks/useSavedVocabulary';
import { PATHS } from '@/routes/paths';

export default function ReaderPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // User & Pro status
  const [user, setUser] = useState<AppUser | null>(() => getStoredUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getStoredUser());
  const [isPro, setIsPro] = useState<boolean>(() => getIsProUser());

  useEffect(() => {
    const handleAuth = () => {
      const u = getStoredUser();
      setUser(u);
      setIsLoggedIn(!!u);
    };
    const handleSub = () => setIsPro(getIsProUser());
    window.addEventListener('auth:change', handleAuth);
    window.addEventListener('subscription:change', handleSub);
    return () => {
      window.removeEventListener('auth:change', handleAuth);
      window.removeEventListener('subscription:change', handleSub);
    };
  }, []);

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

  const targetId = searchParams.get('postId') || searchParams.get('id') || searchParams.get('story') || searchParams.get('article') || 'tet-holiday';
  const requestedKey = articleKey(targetId, selectedLevel);
  const [loadedKey, setLoadedKey] = useState('');
  const [articleError, setArticleError] = useState(false);
  const [levelError, setLevelError] = useState('');
  const [reloadAttempt, setReloadAttempt] = useState(0);
  const levelRequest = useRef(0);
  useEffect(() => {
    let active = true;
    setArticleData(null);
    setArticleError(false);
    const load = async () => {
      if (targetId === 'tet-holiday') {
        const article = readerApiService.getLocalArticle(targetId, selectedLevel);
        if (article) cacheArticle(article, selectedLevel);
        if (active) setLoadedKey(requestedKey);
        return;
      }
      const post = await readerApiService.getPostById(targetId);
      if (!active) return;
      if (post && readerLevelFor(post.level) !== selectedLevel) {
        const actualLevel = readerLevelFor(post.level);
        setSelectedLevel(actualLevel);
        setSearchParams(previous => { const next = new URLSearchParams(previous); next.set('level', actualLevel); return next; }, { replace: true });
        return;
      }
      const article = post ? readerApiService.mapPostToReaderData(post) :
        readerApiService.getLocalArticle(targetId, selectedLevel) || getCachedArticle(targetId, selectedLevel);
      if (article) cacheArticle(article, selectedLevel);
      setArticleData(article);
      setArticleError(!article);
      setLoadedKey(requestedKey);
    };
    void load().catch(() => { if (active) { setArticleError(true); setLoadedKey(requestedKey); } });
    return () => { active = false; levelRequest.current++; };
  }, [requestedKey, reloadAttempt]);

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

  const handleLevelChange = async (newLevel: 'Level 1' | 'Level 2' | 'Level 3') => {
    const request = ++levelRequest.current;
    setLevelError('');
    let nextId = targetId;
    if (articleData?.cefrLevel && /^[ABC][12]$/.test(articleData.cefrLevel) && !articleData.topicGroup && newLevel !== selectedLevel) {
      setLevelError('Bài này chưa có phiên bản ở mức bạn chọn.');
      return;
    }
    if (articleData?.topicGroup) {
      const candidates = { 'Level 1': ['A1', 'A2'], 'Level 2': ['B1', 'B2'], 'Level 3': ['C1', 'C2'] };
      let found = false;
      for (const level of candidates[newLevel]) {
        const post = await readerApiService.getPostByTopicGroupAndLevel(articleData.topicGroup, level);
        if (request !== levelRequest.current) return;
        if (post) { nextId = post.id; found = true; break; }
      }
      if (!found) { setLevelError('Bài này chưa có nội dung ở mức bạn chọn.'); return; }
    }
    if (request !== levelRequest.current) return;
    setSelectedLevel(newLevel);
    setSearchParams(previous => {
      const next = new URLSearchParams(previous);
      next.set('level', newLevel);
      if (nextId !== targetId) {
        next.delete('story'); next.delete('article'); next.delete('id');
        next.set('postId', nextId);
      }
      return next;
    }, { replace: true });
  };

  const [isVocabDrawerOpen, setIsVocabDrawerOpen] = useState<boolean>(false);
  const [selectedVocab, setSelectedVocab] = useState<VocabItem | null>(null);
  const savedVocabulary = useSavedVocabulary(articleData?.id || targetId, selectedLevel);
  const bookmarkedWords = Object.fromEntries(savedVocabulary.words.map(word => [word.id, true]));
  useEffect(() => {
    setIsVocabDrawerOpen(false); setSelectedVocab(null);
    setQ1Answer(''); setQ2Answer(''); setQuizSubmitted(false);
  }, [requestedKey]);

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
    loadedKey !== requestedKey || articleError ? '' : articleData ? (articleData.shadowingAudioUrl || '') :
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
    audio.pause();
    if (!currentAudioUrl) {
      audio.removeAttribute('src');
      setIsPlaying(false); setDuration(0); setCurrentTime(0);
      return;
    }
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

  useEffect(() => () => { audioRef.current?.pause(); }, []);

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
    const word = articleData?.vocabularies.find(item => item.id === wordId) ||
      savedVocabulary.words.find(item => item.id === wordId) || Object.values(VOCAB_DATABASE).find(item => item.id === wordId);
    if (word) savedVocabulary.toggle(word);
  };

  // Dynamic style helpers based on themeMode
  const canvasBgClass =
    themeMode === "dark"
      ? "bg-[#141C1A] text-[#E8DFCB]"
      : "bg-[#F6EEDC] text-[#3F5550]";

  const vocabBtnClass =
    themeMode === "dark"
      ? "ink-underline border-b-2 border-dashed border-antique-gold bg-antique-gold/30 font-semibold text-antique-gold hover:bg-antique-gold/45 px-1 rounded transition-colors cursor-pointer shadow-xs focus-ring-dark"
      : "ink-underline border-b-2 border-dashed border-antique-gold bg-antique-gold/15 font-semibold text-heritage-green px-1 rounded hover:bg-antique-gold/30 transition-colors cursor-pointer focus-ring";

  const bottomCardBgClass =
    themeMode === "dark"
      ? "bg-[#1E2925] text-[#FBF7EE] border-[#D9B76A]/30 shadow-xl"
      : "bg-[#FBF7EE] text-[#3F5550] border-[rgba(30,75,67,0.12)] shadow-xl";

  if (loadedKey !== requestedKey) return <main className="p-12" role="status">Đang tải bài đọc…</main>;
  if (articleError) return <main className="p-12" role="alert"><h1>Chưa tải được bài đọc này</h1><p>Kiểm tra kết nối hoặc chọn lại bài.</p><button onClick={() => setReloadAttempt(value => value + 1)}>Thử lại</button> <Link to={PATHS.discovery}>Chọn bài đọc</Link></main>;

  return (
    <SavedVocabularyContext.Provider value={savedVocabulary}>
    <main className="reader-component-theme min-h-screen bg-[#FBF7EE] text-[#3F5550] relative selection:bg-[#BFE3EA] selection:text-[#1E4B43]">
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
            : articleData ? null : VOCAB_DATABASE["sacred"];
          setSelectedVocab(firstVocab);
          setIsVocabDrawerOpen(true);
        }}
        vocabCount={articleData ? articleData.vocabularies.length : Object.keys(VOCAB_DATABASE).length}
        themeMode={themeMode}
        onChangeThemeMode={setThemeMode}
        onOpenVoiceCustomizer={() => setIsVoiceModalOpen(true)}
        selectedVoiceName={currentVoice.name}
        selectedVoiceFlag={currentVoice.flag}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={() => {
          clearAuthStorage();
          setIsLoggedIn(false);
          setUser(null);
        }}
        isPro={isPro}
      />

      {levelError && <p role="alert" className="px-8 py-3">{levelError}</p>}
      {!savedVocabulary.canSave && <p role="alert" className="px-8 py-3">Chưa lưu được từ vựng. Kiểm tra dung lượng hoặc quyền lưu trữ trình duyệt.</p>}
      {/* Main Canvas Container */}
      <section
        className={`py-8 px-4 sm:px-8 transition-colors duration-300 ${canvasBgClass}`}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Audio Shadowing Engine Section with Real Google Gemini Audio */}
          {articleData && !articleData.shadowingAudioUrl ? <p role="status">Bài này chưa có bản thu âm. Bạn có thể tiếp tục đọc và ôn từ.</p> : <AudioShadowingBar
            articleTitle={articleData?.titleEn}
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
          />}

          {/* Main Reading Views: Bilingual View vs Extensive Reading View */}
          {readingMode === "bilingual" ? (
            <BilingualReaderView
              themeMode={themeMode}
              fontSize={fontSize}
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
        vocabList={articleData ? articleData.vocabularies : Object.values(VOCAB_DATABASE)}
        bookmarkedWords={bookmarkedWords}
        onToggleBookmarkWord={toggleBookmarkWord}
        deckId={articleData?.id || searchParams.get("story") || searchParams.get("article") || 'tet-holiday'}
        selectedLevel={selectedLevel}
        articleTitle={articleData?.titleEn}
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

      {/* Floating AI Companion Chatbot at bottom-right corner */}
      <FloatingAiCompanionWidget
        articleTitle={articleData?.titleVi || "Tết Cổ Truyền: Đổi Mới, Nhớ Về Cội Nguồn & Phong Vị Ba Miền"}
      />
    </main>
    </SavedVocabularyContext.Provider>
  );
}
