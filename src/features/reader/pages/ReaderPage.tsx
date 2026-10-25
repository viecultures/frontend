import '../reader-components.css';
import '../reader-design.css';
import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AudioShadowingBar,
  BilingualReaderView,
  ReaderPracticeView,
  ReaderToolbar,
  ReaderVocabDrawer,
  ReaderRecommendedSection,
  VoiceCustomizerModal,
  FloatingAiCompanionWidget,
  StickyAudioPlayer,
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
import { getStoredUser, clearAuthStorage, getIsProUser, type AppUser } from "@/utils/auth-storage";
import { getActiveParagraphIndex } from "../constants";

import { articleKey, cacheArticle, getCachedArticle } from '@/services/learning/learningStorage';
import { useSavedVocabulary, SavedVocabularyContext } from '../hooks/useSavedVocabulary';
import { PATHS } from '@/routes/paths';
import { practiceModeFrom, type PracticeMode } from '../lib/readerPractice';
import { MocSonSealModal } from '@/features/gamification';
import { ReaderReflectionsSection } from '@/features/community/components/ReaderReflectionsSection';

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
  const [isSealModalOpen, setIsSealModalOpen] = useState<boolean>(false);

  // Keep old extensive-reader links working while exposing Practice as the workspace.
  const modeParam = searchParams.get('mode');
  const readingMode: 'bilingual' | 'practice' = modeParam === 'practice' || modeParam === 'extensive' ? 'practice' : 'bilingual';
  const practiceMode = practiceModeFrom(searchParams.get('practice'));

  // Initial level reads from URL query ?level=Level 1/2/3
  const levelParam = searchParams.get("level");
  const initialLevel: "Level 1" | "Level 2" | "Level 3" =
    levelParam === "Level 1" || levelParam === "Level 3" ? levelParam : "Level 2";
  const [selectedLevel, setSelectedLevel] = useState<"Level 1" | "Level 2" | "Level 3">(
    initialLevel
  );

  // Resolved article shared by Reading and Practice; null while loading.
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
        if (active) { setArticleData(article); setArticleError(!article); setLoadedKey(requestedKey); }
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
    const currentLvl = searchParams.get("level");
    if (
      (currentLvl === "Level 1" || currentLvl === "Level 2" || currentLvl === "Level 3") &&
      currentLvl !== selectedLevel
    ) {
      setSelectedLevel(currentLvl);
    }
  }, [searchParams]);

  const handleModeChange = (newMode: 'bilingual' | 'practice') => {
    setSearchParams(previous => {
      const next = new URLSearchParams(previous);
      if (newMode === 'practice') next.set('mode', 'practice');
      else { next.delete('mode'); next.delete('practice'); }
      return next;
    });
  };

  const handleStartPractice = (mode: PracticeMode = 'questions') => {
    setSearchParams(previous => {
      const next = new URLSearchParams(previous);
      next.set('mode', 'practice'); next.set('practice', mode);
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handlePracticeModeChange = (mode: PracticeMode) => {
    setSearchParams(previous => {
      const next = new URLSearchParams(previous);
      next.set('mode', 'practice'); next.set('practice', mode);
      return next;
    }, { replace: true });
  };

  const handleLevelChange = async (newLevel: 'Level 1' | 'Level 2' | 'Level 3') => {
    const request = ++levelRequest.current;
    setLevelError('');
    let nextId = targetId;
    if (articleData?.cefrLevel && /^[ABC][12]$/.test(articleData.cefrLevel) && !articleData.topicGroup && newLevel !== selectedLevel) {
      setLevelError('This article is not available at the selected level.');
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
      if (!found) { setLevelError('This article has no content at the selected level.'); return; }
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

  // Playback for article recordings and the bundled Tết voices.
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
  useEffect(() => { if (readingMode === 'practice') audioRef.current?.pause(); }, [readingMode]);

  const currentSentenceEn =
    articleData && articleData.paragraphs.length > 0 && articleData.paragraphs[0].enText
      ? articleData.paragraphs[0].enText.split(". ")[0] + "."
      : "Tết Nguyên Đán, often called simply Tết, is described as the most important and sacred holiday in Vietnamese culture.";

  const currentVoice: GeminiVoice =
    GEMINI_VOICES.find((v) => v.id === selectedVoiceId) || GEMINI_VOICES[0];
  const currentAudioUrl =
    loadedKey !== requestedKey || articleError ? '' : articleData && articleData.id !== 'tet-holiday' ? (articleData.shadowingAudioUrl || '') :
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

  // Active paragraph calculation
  const activeParagraphIndex = getActiveParagraphIndex(
    currentTime,
    duration,
    articleData?.paragraphs
  );

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

  // Scroll to active paragraph
  const scrollToActiveParagraph = () => {
    if (activeParagraphIndex >= 0) {
      const el = document.getElementById(`paragraph-pair-${activeParagraphIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Handle Play specific paragraph audio
  const handlePlayParagraphAudio = (index: number, timestamp: number) => {
    handleSeek(timestamp);
    if (!isPlaying && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn("Audio play error:", err);
      });
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
  const vocabBtnClass =
    themeMode === "dark"
      ? "ink-underline border-b-2 border-dashed border-antique-gold bg-antique-gold/30 font-semibold text-antique-gold hover:bg-antique-gold/45 px-1 rounded transition-colors cursor-pointer shadow-xs focus-ring-dark"
      : "ink-underline border-b-2 border-dashed border-antique-gold bg-antique-gold/15 font-semibold text-heritage-green px-1 rounded hover:bg-antique-gold/30 transition-colors cursor-pointer focus-ring";

  const bottomCardBgClass =
    themeMode === "dark"
      ? "bg-[#1E2925] text-warm-ivory border-antique-gold/30 shadow-xl"
      : "bg-warm-ivory text-ink-soft border-heritage-green/12 shadow-xl";

  if (loadedKey !== requestedKey) return <main className="p-12" role="status">Loading article…</main>;
  if (articleError) return <main className="p-12" role="alert"><h1>Could not load this article</h1><p>Check your connection or choose another article.</p><button onClick={() => setReloadAttempt(value => value + 1)}>Try again</button> <Link to={PATHS.discovery}>Browse articles</Link></main>;

  return (
    <SavedVocabularyContext.Provider value={savedVocabulary}>
    <main className="reader-component-theme reader-desk min-h-screen relative selection:bg-sky-mist selection:text-heritage-green" data-desk-theme={themeMode}>
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
      {!savedVocabulary.canSave && <p role="alert" className="px-8 py-3">Could not save vocabulary. Check your browser storage space and permissions.</p>}

      {/* Main Canvas Container with extra bottom padding for StickyAudioPlayer */}
      <section
        className="reader-desk-canvas pb-28 sm:pb-32"
      >
        <div className="reader-desk-content">
          <aside className="reader-margin-note reader-margin-note-left" aria-hidden="true">Rooted<br />in<br />heritage</aside>
          <aside className="reader-margin-note reader-margin-note-right" aria-hidden="true">Vietnamese<br />culture<br />a brighter<br />tomorrow</aside>

          {/* Optional inline audio disclosure for Shadowing / Pronunciation practice */}
          {readingMode === 'bilingual' && <details id="reader-audio" className="reader-audio-disclosure">
          <summary>Listen & practice pronunciation</summary>
          {articleData && articleData.id !== 'tet-holiday' && !articleData.shadowingAudioUrl ? <p role="status">Audio is not available for this article yet. You can continue reading and reviewing vocabulary.</p> : <AudioShadowingBar
            articleTitle={articleData?.titleEn}
            onStartShadowing={() => handleStartPractice('shadowing')}
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
          </details>}

          {/* Reading and Practice retain the same article and level. */}
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
              onStartPractice={handleStartPractice}
              activeParagraphIndex={activeParagraphIndex}
              onPlayParagraphAudio={handlePlayParagraphAudio}
              onOpenSealModal={() => setIsSealModalOpen(true)}
            />
          ) : (
            articleData && <ReaderPracticeView
              key={requestedKey}
              themeMode={themeMode}
              fontSize={fontSize}
              vocabBtnClass={vocabBtnClass}
              articleData={articleData}
              mode={practiceMode}
              onChangeMode={handlePracticeModeChange}
              onBackToReading={() => handleModeChange('bilingual')}
              fullAudioUrl={articleData.id === 'tet-holiday' ? currentVoice.fullAudioUrl : articleData.shadowingAudioUrl}
            />
          )}

          {/* Non-Judgmental Community Reflections Section (FLOW-COMMUNITY / TASK-008) */}
          {readingMode === 'bilingual' && articleData && (
            <ReaderReflectionsSection
              postId={articleData.id}
              postTitle={articleData.titleEn}
              vocabularies={articleData.vocabularies || []}
              themeMode={themeMode}
            />
          )}

          {/* Recommended Articles Section */}
          {readingMode === 'bilingual' && <ReaderRecommendedSection
            articles={RECOMMENDED_ARTICLES}
            themeMode={themeMode}
          />}
        </div>
      </section>

      {/* Main Reader Footer */}
      <Footer />

      {/* Persistent Sticky Audio Player Bar (mandated by TASK-004 & system_constants.md) */}
      {readingMode === 'bilingual' && currentAudioUrl && (
        <StickyAudioPlayer
          articleTitle={articleData?.titleEn}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          playbackSpeed={playbackSpeed}
          onChangeSpeed={(speed: number) => setPlaybackSpeed(speed)}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          isRepeatLoop={isRepeatLoop}
          onToggleRepeatLoop={() => setIsRepeatLoop(!isRepeatLoop)}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          activeParagraphIndex={activeParagraphIndex}
          totalParagraphs={articleData?.paragraphs?.length || 0}
          onScrollToActiveParagraph={scrollToActiveParagraph}
          selectedVoiceName={currentVoice.name}
          selectedVoiceFlag={currentVoice.flag}
          onOpenVoiceCustomizer={() => setIsVoiceModalOpen(true)}
          themeMode={themeMode}
        />
      )}

      {/* Vocabulary Slide-Over Drawer Modal */}
      <ReaderVocabDrawer
        isOpen={isVocabDrawerOpen}
        onClose={() => setIsVocabDrawerOpen(false)}
        selectedVocab={selectedVocab}
        onSelectVocab={setSelectedVocab}
        vocabList={articleData ? articleData.vocabularies : Object.values(VOCAB_DATABASE)}
        bookmarkedWords={bookmarkedWords}
        onToggleBookmarkWord={toggleBookmarkWord}
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
      {loadedKey === requestedKey && !articleError && <FloatingAiCompanionWidget
        key={`${articleData?.id || targetId}-${selectedLevel}`}
        articleTitle={articleData?.titleEn || "Tết: Renewal, Remembrance & Regional Flavours"}
        articleId={articleData?.id || targetId || 'tet-holiday'}
        articleSummary={articleData?.summary || articleData?.paragraphs[0]?.enText}
        level={selectedLevel}
        vocabulary={articleData ? articleData.vocabularies : Object.values(VOCAB_DATABASE)}
        onOpenVocabulary={() => setIsVocabDrawerOpen(true)}
        themeMode={themeMode}
      />}

      {/* Ceremonial Cultural Red Seal (Mộc Son Đỏ) Modal */}
      <MocSonSealModal
        isOpen={isSealModalOpen}
        onClose={() => setIsSealModalOpen(false)}
        articleId={articleData?.id || targetId || 'tet-holiday'}
        articleTitle={articleData?.titleVi || articleData?.titleEn || 'Tết Cổ Truyền: Đổi Mới, Nhớ Về Cội Nguồn'}
        wordsLearnedCount={articleData?.vocabularies?.length || 4}
        source="reader"
      />
    </main>
    </SavedVocabularyContext.Provider>
  );
}
