import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Headphones,
  Film,
  RotateCcw,
  Copy,
  Check,
  Search,
  ChevronRight,
  ListOrdered,
  Volume2,
  Send,
  Lightbulb,
  Eye,
  EyeOff,
  Play,
  Pause,
  Repeat,
  Gauge,
  Square
} from 'lucide-react';
import {
  dictationApiService,
  generateHintScaffold
} from '../../services/dictationService';
import type {
  YtbTranscriptSnippet,
  YtbTranscriptData,
  DictationCheckResult,
  ShadowingEvaluationResult
} from '../../services/dictationService';
import { useReaderDictionary } from '@/features/reader/hooks/useReaderDictionary';
import { InPlaceDictionaryPopup } from '@/features/reader/components/InPlaceDictionaryPopup';

export const VideoDictationShadowingScreen: React.FC = () => {
  // Query Parameters for /api/v1/ytb-transcript
  const [videoUrlInput, setVideoUrlInput] = useState('https://www.youtube.com/watch?v=kXYiU_JCYtU');
  const [activeVideoId, setActiveVideoId] = useState('kXYiU_JCYtU');
  const [lang, setLang] = useState('en');
  const [mode, setMode] = useState<'SHADOWING' | 'SENTENCE' | 'COMMA' | 'RAW'>('SHADOWING');
  const [clean, setClean] = useState(true);

  // Real Backend Data State (No mock data fallback)
  const [transcriptData, setTranscriptData] = useState<YtbTranscriptData | null>(null);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedSnippetIndex, setSelectedSnippetIndex] = useState(0);

  // Mode Tabs: Dictation vs Shadowing
  const [activeTab, setActiveTab] = useState<'dictation' | 'shadowing'>('dictation');

  // Playback & Sentence Synchronization State
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [autoPauseAtEnd, setAutoPauseAtEnd] = useState<boolean>(true);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Dictation & Practice Tools State
  const [userInputText, setUserInputText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<DictationCheckResult | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  // Shadowing Voice Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [isEvaluatingShadowing, setIsEvaluatingShadowing] = useState<boolean>(false);
  const [shadowingResult, setShadowingResult] = useState<ShadowingEvaluationResult | null>(null);

  // Transcript Search & Copy State
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  // Backend connection status
  const [backendStatus, setBackendStatus] = useState<{ isOnline: boolean; message: string }>({
    isOnline: false,
    message: 'Đang kiểm tra kết nối localhost:8080...'
  });

  // Universal In-place Dictionary Hook
  const { popupState, closeDictionary, handleTextSelection } = useReaderDictionary();

  // Refs
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const snippetItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const snippets = transcriptData?.snippets || [];
  const currentSnippet: YtbTranscriptSnippet | null = snippets[selectedSnippetIndex] || null;

  // Extract Video ID from URL or raw ID
  const extractVideoId = (input: string) => {
    const trimmed = input.trim();
    if (trimmed.includes('v=')) {
      return trimmed.split('v=')[1].split('&')[0];
    }
    if (trimmed.includes('youtu.be/')) {
      return trimmed.split('youtu.be/')[1].split('?')[0];
    }
    return trimmed;
  };

  // Helper to format seconds (e.g. 2.3 -> 00:02.3)
  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  const playbackRateRef = useRef(playbackRate);
  playbackRateRef.current = playbackRate;
  const autoPauseAtEndRef = useRef(autoPauseAtEnd);
  autoPauseAtEndRef.current = autoPauseAtEnd;
  const isLoopingRef = useRef(isLooping);
  isLoopingRef.current = isLooping;

  // Clear running auto-stop timers
  const clearPlaybackTimers = () => {
    if (playbackTimerRef.current) {
      clearTimeout(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
  };

  // Pause YouTube video via postMessage
  const pauseVideo = () => {
    clearPlaybackTimers();
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
          '*'
        );
      } catch (e) {
        console.warn('Iframe postMessage pause error:', e);
      }
    }
    setIsPlaying(false);
  };

  // Seek and Play Video function with Auto-Stop / A-B Loop support
  const seekToTime = useCallback((seconds: number, snippetDuration?: number) => {
    clearPlaybackTimers();
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds, true] }),
          '*'
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setPlaybackRate', args: [playbackRateRef.current] }),
          '*'
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          '*'
        );
        setIsPlaying(true);
      } catch (e) {
        console.warn('Iframe postMessage seek error:', e);
      }
    }

    const duration = snippetDuration ?? (currentSnippet ? currentSnippet.duration : 0);
    if (duration > 0 && (autoPauseAtEndRef.current || isLoopingRef.current)) {
      const durationMs = Math.max(600, (duration / playbackRateRef.current) * 1000);
      playbackTimerRef.current = setTimeout(() => {
        if (isLoopingRef.current) {
          seekToTime(seconds, duration);
        } else if (autoPauseAtEndRef.current) {
          pauseVideo();
        }
      }, durationMs);
    }
  }, [currentSnippet]);

  // Set playback speed rate (0.75x, 1x, 1.25x)
  const handleChangeSpeed = (newRate: number) => {
    setPlaybackRate(newRate);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setPlaybackRate', args: [newRate] }),
          '*'
        );
      } catch (e) {
        console.warn('Iframe postMessage speed error:', e);
      }
    }
  };

  // Fetch Transcript from GET /api/v1/ytb-transcript
  const handleFetchTranscript = async () => {
    if (!videoUrlInput.trim()) return;
    setIsLoadingTranscript(true);
    setApiError(null);
    clearPlaybackTimers();

    const targetVideoId = extractVideoId(videoUrlInput);
    setActiveVideoId(targetVideoId);

    const result = await dictationApiService.fetchYtbTranscript(
      videoUrlInput,
      lang,
      mode,
      clean
    );

    if (result.data && result.data.success && result.data.data) {
      setTranscriptData(result.data.data);
      setSelectedSnippetIndex(0);
      setUserInputText('');
      setCheckResult(null);
      setShowHint(false);
      setShowAnswer(false);
      setUserAudioUrl(null);
      setShadowingResult(null);
      setApiError(null);
      setBackendStatus({ isOnline: true, message: 'Backend kết nối thành công' });
    } else {
      setTranscriptData(null);
      setApiError(result.error || 'Không nhận được dữ liệu transcript từ backend.');
      const health = await dictationApiService.checkHealth();
      setBackendStatus(health);
    }

    setIsLoadingTranscript(false);
  };

  // Check health and attempt initial fetch on mount
  useEffect(() => {
    dictationApiService.checkHealth().then(status => setBackendStatus(status));
    handleFetchTranscript();
    return () => {
      clearPlaybackTimers();
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    };
  }, []);

  // Handle snippet selection & smooth slide to item
  const handleSelectSnippet = (idx: number) => {
    if (idx >= 0 && idx < snippets.length) {
      setSelectedSnippetIndex(idx);
      setUserInputText('');
      setCheckResult(null);
      setShowHint(false);
      setShowAnswer(false);
      setUserAudioUrl(null);
      setShadowingResult(null);
      seekToTime(snippets[idx].start, snippets[idx].duration);

      // Smooth scroll slider to active snippet
      const targetElement = snippetItemRefs.current[idx];
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  // Check Dictation with Backend / Local Evaluation
  const handleCheckDictation = async () => {
    if (!userInputText.trim() || !currentSnippet) return;
    setIsChecking(true);
    const result = await dictationApiService.evaluateDictation(
      `snip-${selectedSnippetIndex}`,
      userInputText,
      currentSnippet.text
    );
    setCheckResult(result);
    setIsChecking(false);
  };

  // Shadowing Microphone Recording
  const handleToggleRecord = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setUserAudioUrl(audioUrl);
          stream.getTracks().forEach((track) => track.stop());

          if (currentSnippet) {
            setIsEvaluatingShadowing(true);
            const evalResult = await dictationApiService.evaluateShadowingAudio(
              `shadow-${selectedSnippetIndex}`,
              audioBlob,
              currentSnippet.text
            );
            setShadowingResult(evalResult);
            setIsEvaluatingShadowing(false);
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingSeconds(0);
        recordIntervalRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      } catch (err) {
        console.error('Microphone permission error:', err);
        alert('Vui lòng cấp quyền truy cập Microphone trong trình duyệt để sử dụng tính năng Shadowing.');
      }
    }
  };

  // Copy Full Transcript
  const handleCopyAllTranscript = () => {
    if (!snippets.length) return;
    const fullText = snippets
      .map((s) => `[${formatSeconds(s.start)}] ${s.text}`)
      .join('\n');
    navigator.clipboard.writeText(fullText);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  // Filtered snippets for search
  const filteredSnippets = snippets.filter(s =>
    s.text.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  return (
    <div
      onMouseUp={handleTextSelection}
      onDoubleClick={handleTextSelection}
      className="w-full h-screen max-h-screen overflow-hidden flex flex-col justify-between p-2.5 md:p-3.5 bg-[#FBF7EE] dark:bg-[#0b1a17] text-[#1E2925] dark:text-[#E8ECE9] select-text"
    >
      {/* ── TOP BANNER & CONTROL BAR (Compact) ── */}
      <div className="flex-shrink-0 flex flex-col gap-1.5 border-b border-[#1E4B43]/15 dark:border-[#2C3E38] pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1E4B43] text-[#D4AF37] flex items-center justify-center font-bold shadow flex-shrink-0">
              <Headphones className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.2 rounded text-[9px] font-serif uppercase tracking-widest bg-[#1E4B43] text-[#D4AF37] font-semibold border border-[#D4AF37]/30">
                Screen 01
              </span>
              <h2 className="text-xs md:text-sm font-serif font-bold text-[#1E4B43] dark:text-[#FBF7EE]">
                YouTube Transcript &amp; Dictation Hub
              </h2>
            </div>
          </div>

          {/* Backend Status Indicator */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] border font-mono self-start sm:self-auto ${backendStatus.isOnline
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-800 dark:text-amber-200 border-amber-500/30'
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full inline-block ${backendStatus.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
            />
            <span>GET /api/v1/ytb-transcript</span>
            <button
              onClick={handleFetchTranscript}
              disabled={isLoadingTranscript}
              className="p-0.5 hover:bg-black/10 rounded cursor-pointer ml-0.5"
              title="Gọi lại API"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${isLoadingTranscript ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* API Request Query Parameters Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-[#12231F] p-1.5 rounded-xl border border-[#1E4B43]/20 shadow-sm text-xs">
          {/* videoUrl input */}
          <div className="flex-1 min-w-[200px] flex items-center gap-1">
            <span className="font-semibold text-[11px] text-[#1E4B43] dark:text-[#D4AF37]">videoUrl:</span>
            <input
              type="text"
              value={videoUrlInput}
              onChange={(e) => setVideoUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchTranscript()}
              placeholder="https://www.youtube.com/watch?v=... hoặc video ID"
              className="flex-1 px-2 py-1 rounded-lg bg-[#FBF7EE] dark:bg-[#0b1a17] border border-[#1E4B43]/20 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-xs font-mono"
            />
          </div>

          {/* lang */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#5D706A]">lang:</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="px-1.5 py-1 rounded-lg bg-[#FBF7EE] dark:bg-[#0b1a17] border border-[#1E4B43]/20 font-mono text-[11px] font-semibold text-[#1E4B43] dark:text-[#D4AF37]"
            >
              <option value="en">en (English)</option>
              <option value="vi">vi (Tiếng Việt)</option>
              <option value="ja">ja (Japanese)</option>
              <option value="ko">ko (Korean)</option>
            </select>
          </div>

          {/* mode */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#5D706A]">mode:</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="px-1.5 py-1 rounded-lg bg-[#FBF7EE] dark:bg-[#0b1a17] border border-[#1E4B43]/20 font-mono font-semibold text-[11px] text-[#1E4B43] dark:text-[#D4AF37]"
            >
              <option value="SHADOWING">SHADOWING</option>
              <option value="SENTENCE">SENTENCE</option>
              <option value="COMMA">COMMA</option>
              <option value="RAW">RAW</option>
            </select>
          </div>

          {/* clean checkbox */}
          <label className="flex items-center gap-1 cursor-pointer select-none text-[10px] text-[#5D706A]">
            <input
              type="checkbox"
              checked={clean}
              onChange={(e) => setClean(e.target.checked)}
              className="rounded text-[#1E4B43] focus:ring-[#D4AF37]"
            />
            <span>clean</span>
          </label>

          {/* Fetch Transcript Button */}
          <button
            onClick={handleFetchTranscript}
            disabled={isLoadingTranscript}
            className="flex items-center gap-1 px-3 py-1 bg-[#1E4B43] hover:bg-[#153630] disabled:opacity-50 text-[#D4AF37] font-bold rounded-lg transition-all cursor-pointer shadow text-xs"
          >
            <Send className={`w-3 h-3 ${isLoadingTranscript ? 'animate-spin' : ''}`} />
            <span>{isLoadingTranscript ? 'Đang gọi...' : 'Lấy Transcript'}</span>
          </button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE ── */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 my-1.5 items-stretch overflow-hidden">
        {/* LEFT COLUMN: <iframe> Video Player + Advanced Playback Controls (5 Cols) */}
        <div className="lg:col-span-5 h-full flex flex-col justify-between bg-white/80 dark:bg-[#12231F]/80 backdrop-blur-md rounded-2xl p-3 border border-[#1E4B43]/15 dark:border-[#2C3E38] shadow-sm overflow-hidden">
          {/* Video Metadata Header */}
          <div className="flex-shrink-0 flex items-center justify-between border-b border-[#1E4B43]/10 pb-1.5 mb-1.5">
            <div className="flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-xs font-bold text-[#1E4B43] dark:text-[#FBF7EE] truncate max-w-[220px]">
                {transcriptData?.title || `YouTube Video (${activeVideoId})`}
              </span>
            </div>
            {transcriptData && (
              <span className="text-[10px] font-mono text-[#5D706A]">
                {transcriptData.author}
              </span>
            )}
          </div>

          {/* <iframe> Video Player Frame */}
          <div className="flex-1 min-h-0 w-full relative aspect-video rounded-xl overflow-hidden shadow-md border border-[#1E4B43]/20 bg-black flex items-center justify-center">
            <iframe
              ref={iframeRef}
              id="youtube-player-frame"
              src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?enablejsapi=1&rel=0&modestbranding=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          {/* ── ADVANCED PLAYBACK & SENTENCE SYNCHRONIZATION CONTROLS ── */}
          <div className="flex-shrink-0 mt-2 pt-2 border-t border-[#1E4B43]/10 flex flex-col gap-1.5 text-xs">
            {/* Top row: Replay current / Play-Pause / Start Time */}
            <div className="flex items-center justify-between">
              {currentSnippet ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => seekToTime(currentSnippet.start, currentSnippet.duration)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1E4B43] hover:bg-[#153630] text-[#D4AF37] font-bold transition-all shadow cursor-pointer text-xs"
                    title="Nghe lại câu hiện tại từ đầu mốc thời gian"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Nghe Lại Câu #{selectedSnippetIndex + 1}</span>
                  </button>

                  <button
                    onClick={isPlaying ? pauseVideo : () => seekToTime(currentSnippet.start, currentSnippet.duration)}
                    className="p-1 rounded-lg bg-[#1E4B43]/10 hover:bg-[#1E4B43]/20 text-[#1E4B43] dark:text-[#D4AF37] cursor-pointer"
                    title={isPlaying ? 'Tạm dừng video' : 'Tiếp tục phát'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>

                  <span className="font-mono text-[10px] text-[#5D706A]">
                    start: {formatSeconds(currentSnippet.start)}
                  </span>
                </div>
              ) : (
                <span className="text-[11px] text-[#5D706A]">
                  Chưa có câu thoại được chọn
                </span>
              )}

              <span className="text-[10px] font-mono text-[#5D706A]">
                Video ID: {activeVideoId}
              </span>
            </div>

            {/* Bottom row: Auto-pause, A-B Loop, Speed controls */}
            <div className="flex items-center justify-between text-[11px] bg-[#FBF7EE] dark:bg-[#0b1a17] p-1.5 rounded-xl border border-[#1E4B43]/10">
              {/* Lặp câu (A-B Loop) */}
              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg font-medium cursor-pointer transition-colors ${
                  isLooping
                    ? 'bg-[#1E4B43] text-[#D4AF37]'
                    : 'text-[#5D706A] hover:bg-[#1E4B43]/10'
                }`}
                title="Lặp lại câu tiếng Anh hiện tại liên tục (A-B Loop) để luyện nghe và chép"
              >
                <Repeat className="w-3 h-3" />
                <span>Lặp câu (A-B)</span>
              </button>

              {/* Tự dừng hết câu (Auto-pause) */}
              <button
                onClick={() => setAutoPauseAtEnd(!autoPauseAtEnd)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg font-medium cursor-pointer transition-colors ${
                  autoPauseAtEnd
                    ? 'bg-[#1E4B43] text-[#D4AF37]'
                    : 'text-[#5D706A] hover:bg-[#1E4B43]/10'
                }`}
                title="Tự động dừng khi hết câu để bạn kịp viết bài làm"
              >
                <Pause className="w-3 h-3" />
                <span>Tự dừng hết câu</span>
              </button>

              {/* Tốc độ (Speed) buttons */}
              <div className="flex items-center gap-0.5 font-mono text-[10px]">
                <Gauge className="w-3 h-3 text-[#5D706A] mr-0.5" />
                {[0.75, 1.0, 1.25].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleChangeSpeed(rate)}
                    className={`px-1.5 py-0.2 rounded font-bold cursor-pointer transition-colors ${
                      playbackRate === rate
                        ? 'bg-[#D4AF37] text-[#1E4B43]'
                        : 'text-[#5D706A] hover:bg-[#1E4B43]/10'
                    }`}
                    title={`Phát ở tốc độ ${rate}x`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real Transcript & Working Area (7 Cols) */}
        <div className="lg:col-span-7 h-full flex flex-col justify-between bg-white/80 dark:bg-[#12231F]/80 backdrop-blur-md rounded-2xl p-3 border border-[#1E4B43]/15 dark:border-[#2C3E38] shadow-sm overflow-hidden">
          {/* API Loading State */}
          {isLoadingTranscript ? (
            <div className="my-auto text-center py-12 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-[#D4AF37] mx-auto" />
              <div className="text-sm font-bold text-[#1E4B43] dark:text-[#FBF7EE]">
                Đang gọi API Backend: GET /api/v1/ytb-transcript
              </div>
              <p className="text-xs text-[#5D706A] font-mono">
                URL: {videoUrlInput} | lang: {lang} | mode: {mode}
              </p>
            </div>
          ) : apiError ? (
            /* API Error State (No fake mock data) */
            <div className="my-auto p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-800 dark:text-rose-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Không Thể Lấy Transcript Từ Backend</span>
              </div>
              <p className="leading-relaxed font-mono">{apiError}</p>
              <div className="pt-2">
                <button
                  onClick={handleFetchTranscript}
                  className="px-3 py-1.5 bg-[#1E4B43] text-[#D4AF37] font-bold rounded-lg cursor-pointer text-xs"
                >
                  Thử Lại Ngay
                </button>
              </div>
            </div>
          ) : transcriptData && snippets.length > 0 ? (
            /* Real API Transcript Data Loaded */
            <div className="h-full flex flex-col justify-between overflow-hidden">
              {/* Header Info */}
              <div className="flex-shrink-0 flex items-center justify-between border-b border-[#1E4B43]/10 pb-1.5 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <ListOrdered className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-xs font-bold text-[#1E4B43] dark:text-[#FBF7EE]">
                    Tất Cả Transcript ({snippets.length} câu)
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono font-semibold">
                    Live API Data
                  </span>
                </div>

                <button
                  onClick={handleCopyAllTranscript}
                  className="flex items-center gap-1 text-[10px] text-[#B8860B] dark:text-[#D4AF37] hover:underline cursor-pointer"
                >
                  {copiedTranscript ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedTranscript ? 'Đã sao chép' : 'Sao chép hết'}</span>
                </button>
              </div>

              {/* 2-Column Inner Layout: Left Working Input + Right Transcript Slider */}
              <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-2.5 items-stretch overflow-hidden">
                {/* SUB-COLUMN 1: Ô NHẬP LIỆU BÀI LÀM HIỆN TẠI (md:col-span-6) */}
                <div className="md:col-span-6 h-full flex flex-col justify-between bg-[#FBF7EE]/60 dark:bg-[#0b1a17]/60 rounded-xl p-2.5 border border-[#1E4B43]/15 overflow-hidden">
                  <div className="flex-1 min-h-0 flex flex-col justify-between">
                    <div>
                      {/* Header Range */}
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#1E4B43] dark:text-[#FBF7EE]">
                          Câu #{selectedSnippetIndex + 1}
                        </span>
                        {currentSnippet && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1E4B43]/10 text-[#1E4B43] dark:text-[#D4AF37] font-semibold">
                            {formatSeconds(currentSnippet.start)} ({currentSnippet.duration}s)
                          </span>
                        )}
                      </div>

                      {/* Mode Tabs: Chép Chính Tả vs Shadowing */}
                      <div className="flex bg-white dark:bg-[#12231F] p-0.5 rounded-lg border border-[#1E4B43]/10 text-xs mb-1.5">
                        <button
                          onClick={() => setActiveTab('dictation')}
                          className={`flex-1 py-1 rounded font-semibold text-center text-[11px] transition-all cursor-pointer ${
                            activeTab === 'dictation'
                              ? 'bg-[#1E4B43] text-[#D4AF37] shadow-sm'
                              : 'text-[#5D706A] hover:text-[#1E4B43]'
                          }`}
                        >
                          Chép Chính Tả
                        </button>
                        <button
                          onClick={() => setActiveTab('shadowing')}
                          className={`flex-1 py-1 rounded font-semibold text-center text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            activeTab === 'shadowing'
                              ? 'bg-[#1E4B43] text-[#D4AF37] shadow-sm'
                              : 'text-[#5D706A] hover:text-[#1E4B43]'
                          }`}
                        >
                          <Mic className="w-3 h-3" />
                          <span>Shadowing</span>
                        </button>
                      </div>

                      {/* ── TAB 1: CHÉP CHÍNH TẢ ── */}
                      {activeTab === 'dictation' ? (
                        <div className="space-y-1.5">
                          {/* Textarea Input */}
                          <textarea
                            value={userInputText}
                            onChange={(e) => setUserInputText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                handleCheckDictation();
                              }
                            }}
                            rows={3}
                            placeholder="Nghe và gõ lại câu thoại này (Ctrl - Enter để kiểm tra)..."
                            className="w-full p-2 rounded-lg bg-white dark:bg-[#12231F] border border-[#1E4B43]/20 font-serif text-xs leading-relaxed text-[#1E4B43] dark:text-[#FBF7EE] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] resize-none"
                          />

                          {/* ── DICTATION PRACTICE TOOLS: GỢI Ý & XEM ĐÁP ÁN ── */}
                          <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5">
                              {/* Gợi ý (Hint scaffold) */}
                              <button
                                onClick={() => setShowHint(!showHint)}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-semibold cursor-pointer transition-colors ${
                                  showHint
                                    ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/40'
                                    : 'bg-white dark:bg-[#12231F] text-[#5D706A] border-[#1E4B43]/15 hover:border-[#1E4B43]/30'
                                }`}
                                title="Hiển thị khung chữ cái gợi ý (H____ w____) giữ chữ cái đầu và dấu câu"
                              >
                                <Lightbulb className="w-3 h-3 text-amber-500" />
                                <span>{showHint ? 'Ẩn Gợi Ý' : 'Gợi Ý (Hint)'}</span>
                              </button>

                              {/* Xem đáp án */}
                              <button
                                onClick={() => setShowAnswer(!showAnswer)}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-semibold cursor-pointer transition-colors ${
                                  showAnswer
                                    ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border-emerald-500/40'
                                    : 'bg-white dark:bg-[#12231F] text-[#5D706A] border-[#1E4B43]/15 hover:border-[#1E4B43]/30'
                                }`}
                                title="Xem nguyên văn câu tiếng Anh trong video"
                              >
                                {showAnswer ? <EyeOff className="w-3 h-3 text-emerald-600" /> : <Eye className="w-3 h-3" />}
                                <span>{showAnswer ? 'Ẩn Đáp Án' : 'Xem Đáp Án'}</span>
                              </button>
                            </div>

                            <span className="text-[10px] font-mono text-[#5D706A]">
                              {userInputText.trim().split(/\s+/).filter(Boolean).length} từ
                            </span>
                          </div>

                          {/* Giao diện khung chữ cái gợi ý (Hint Scaffold Display) */}
                          {showHint && currentSnippet && (
                            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 font-mono text-[11px] text-amber-900 dark:text-amber-200">
                              <span className="font-bold mr-1">Khung sườn:</span>
                              {generateHintScaffold(currentSnippet.text)}
                            </div>
                          )}

                          {/* Giao diện đáp án nguyên văn */}
                          {showAnswer && currentSnippet && (
                            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 font-serif text-[11px] text-emerald-900 dark:text-emerald-200">
                              <span className="font-bold mr-1">Đáp án video:</span>
                              {currentSnippet.text}
                            </div>
                          )}

                          {/* ── WORD DIFF: GREEN (CORRECT), RED STRIKETHROUGH (INCORRECT), ORANGE (MISSING) ── */}
                          {checkResult && (
                            <div className="p-1.5 rounded-lg bg-white dark:bg-[#12231F] border border-[#1E4B43]/15 mt-1 text-xs">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-[11px] text-[#1E4B43] dark:text-[#FBF7EE]">Chính xác:</span>
                                <span className="font-mono font-bold text-emerald-600 text-xs">
                                  {checkResult.accuracy}% ({checkResult.matchedWords}/{checkResult.wordCount} từ)
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-1 text-[11px]">
                                {checkResult.diff.map((d, dIdx) => (
                                  <span
                                    key={dIdx}
                                    title={d.expected ? `Đáp án đúng: "${d.expected}"` : undefined}
                                    className={`px-1.5 py-0.5 rounded cursor-help transition-all ${
                                      d.status === 'correct'
                                        ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-semibold'
                                        : d.status === 'incorrect'
                                        ? 'bg-rose-500/20 text-rose-800 dark:text-rose-300 line-through'
                                        : d.status === 'missing'
                                        ? 'bg-orange-500/20 text-orange-800 dark:text-orange-300 border border-orange-500/40'
                                        : 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                                    }`}
                                  >
                                    {d.word}
                                  </span>
                                ))}
                              </div>

                              <p className="text-[10px] text-[#5D706A] italic mt-1">
                                {checkResult.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* ── TAB 2: SHADOWING VOICE PRACTICE ── */
                        <div className="space-y-2 p-1">
                          <div className="p-2 rounded-xl bg-white dark:bg-[#12231F] border border-[#1E4B43]/15">
                            <span className="text-[10px] font-bold text-[#5D706A] uppercase tracking-wider block mb-0.5">
                              Câu cần đọc theo (Target Sentence):
                            </span>
                            <p className="font-serif text-xs font-semibold text-[#1E4B43] dark:text-[#FBF7EE] leading-relaxed">
                              {currentSnippet?.text || 'Chưa chọn câu'}
                            </p>
                          </div>

                          {/* Record Button & Timer */}
                          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-[#12231F] border border-[#1E4B43]/15 gap-2">
                            <button
                              onClick={handleToggleRecord}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                                isRecording
                                  ? 'bg-rose-600 text-white animate-pulse'
                                  : 'bg-[#1E4B43] hover:bg-[#153630] text-[#D4AF37]'
                              }`}
                            >
                              {isRecording ? <Square className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                              <span>{isRecording ? `Dừng Thu (${recordingSeconds}s)` : 'Bắt Đầu Thu Âm'}</span>
                            </button>
                            <p className="text-[10px] text-[#5D706A]">
                              {isRecording
                                ? 'Đang ghi âm giọng đọc của bạn... Nhấn Dừng khi đọc xong'
                                : 'Đọc theo ngữ điệu và phát âm của nhân vật trong video'}
                            </p>
                          </div>

                          {/* Audio playback của người học & Nút nghe lại video để so sánh */}
                          {userAudioUrl && (
                            <div className="p-2 rounded-xl bg-white dark:bg-[#12231F] border border-[#1E4B43]/15 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-[#1E4B43] dark:text-[#D4AF37]">
                                  Bản thu âm của bạn:
                                </span>
                                {currentSnippet && (
                                  <button
                                    onClick={() => seekToTime(currentSnippet.start, currentSnippet.duration)}
                                    className="flex items-center gap-1 text-[10px] text-[#1E4B43] dark:text-[#D4AF37] font-semibold hover:underline cursor-pointer"
                                  >
                                    <Volume2 className="w-3 h-3" />
                                    <span>Nghe mẫu video để so sánh</span>
                                  </button>
                                )}
                              </div>
                              <audio src={userAudioUrl} controls className="w-full h-8" />
                            </div>
                          )}

                          {/* Shadowing Evaluation Breakdown */}
                          {isEvaluatingShadowing ? (
                            <div className="text-center py-2 text-xs text-[#5D706A] flex items-center justify-center gap-1.5">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                              <span>Đang phân tích độ chuẩn xác và ngữ điệu...</span>
                            </div>
                          ) : shadowingResult ? (
                            <div className="p-2 rounded-xl bg-white dark:bg-[#12231F] border border-[#1E4B43]/15 space-y-1 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[11px] text-[#1E4B43] dark:text-[#FBF7EE]">
                                  Điểm Shadowing:
                                </span>
                                <span className="font-mono font-bold text-xs text-emerald-600">
                                  {shadowingResult.overallScore}/100
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-center">
                                <div className="p-1 rounded bg-[#1E4B43]/5">
                                  <div className="text-[#5D706A]">Chuẩn xác</div>
                                  <div className="font-bold text-[#1E4B43] dark:text-[#D4AF37]">{shadowingResult.accuracyScore}%</div>
                                </div>
                                <div className="p-1 rounded bg-[#1E4B43]/5">
                                  <div className="text-[#5D706A]">Lưu loát</div>
                                  <div className="font-bold text-[#1E4B43] dark:text-[#D4AF37]">{shadowingResult.fluencyScore}%</div>
                                </div>
                                <div className="p-1 rounded bg-[#1E4B43]/5">
                                  <div className="text-[#5D706A]">Ngữ điệu</div>
                                  <div className="font-bold text-[#1E4B43] dark:text-[#D4AF37]">{shadowingResult.pitchScore}%</div>
                                </div>
                              </div>
                              <p className="text-[10px] text-[#5D706A] italic pt-0.5">
                                {shadowingResult.feedback}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>

                    {/* Dictation Action */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-[#1E4B43]/10 mt-1">
                      <button
                        onClick={() => {
                          setUserInputText('');
                          setCheckResult(null);
                          setShowHint(false);
                          setShowAnswer(false);
                        }}
                        className="text-[10px] text-[#5D706A] hover:text-black cursor-pointer"
                      >
                        Xóa
                      </button>

                      <div className="flex items-center gap-1.5">
                        {checkResult && checkResult.accuracy >= 80 && selectedSnippetIndex < snippets.length - 1 && (
                          <button
                            onClick={() => handleSelectSnippet(selectedSnippetIndex + 1)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow"
                          >
                            <span>Câu Tiếp</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={handleCheckDictation}
                          disabled={!userInputText.trim() || isChecking}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#1E4B43] text-[#D4AF37] font-bold text-xs cursor-pointer disabled:opacity-50"
                        >
                          <Send className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                          <span>{isChecking ? 'Đang chấm...' : 'Kiểm Tra'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SUB-COLUMN 2: TẤT CẢ TRANSCRIPT SLIDER (md:col-span-6) */}
                <div className="md:col-span-6 h-full flex flex-col justify-start bg-[#FBF7EE]/60 dark:bg-[#0b1a17]/60 rounded-xl p-2.5 border border-[#1E4B43]/15 overflow-hidden">
                  {/* Search Bar & Slider Status */}
                  <div className="flex-shrink-0 flex items-center justify-between gap-1.5 mb-1.5 w-full">
                    <div className="relative flex-1">
                      <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-[#5D706A]" />
                      <input
                        type="text"
                        value={transcriptSearch}
                        onChange={(e) => setTranscriptSearch(e.target.value)}
                        placeholder="Tìm từ trong transcript..."
                        className="w-full pl-6 pr-2 py-0.5 text-[10px] rounded-lg bg-white dark:bg-[#12231F] border border-[#1E4B43]/15 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#5D706A] whitespace-nowrap">
                      {selectedSnippetIndex + 1}/{snippets.length}
                    </span>
                  </div>

                  {/* Transcript Slider Container */}
                  <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 w-full scroll-smooth">
                    {filteredSnippets.length === 0 ? (
                      <div className="text-center py-6 text-xs text-[#5D706A]">
                        Không tìm thấy câu phù hợp
                      </div>
                    ) : (
                      filteredSnippets.map((snip, sIdx) => {
                        const originalIndex = snippets.indexOf(snip);
                        const displayIndex = originalIndex >= 0 ? originalIndex : sIdx;
                        const isCurrent = selectedSnippetIndex === displayIndex;
                        return (
                          <div
                            key={displayIndex}
                            ref={el => { snippetItemRefs.current[displayIndex] = el; }}
                            onClick={() => handleSelectSnippet(displayIndex)}
                            className={`p-2 rounded-lg border text-xs cursor-pointer transition-all text-left ${isCurrent
                                ? 'bg-white dark:bg-[#12231F] border-[#D4AF37] shadow-sm ring-1 ring-[#D4AF37]'
                                : 'bg-white/70 dark:bg-[#12231F]/70 border-[#1E4B43]/10 hover:border-[#1E4B43]/30 hover:bg-white'
                              }`}
                          >
                            <div className="flex items-center justify-between text-[9px] font-mono text-[#5D706A] mb-0.5">
                              <span className="font-bold text-[#1E4B43] dark:text-[#D4AF37]">
                                #{displayIndex + 1} • {formatSeconds(snip.start)} ({snip.duration}s)
                              </span>
                              {isCurrent && (
                                <span className="px-1 py-0.2 rounded bg-[#1E4B43] text-[#D4AF37] font-semibold text-[8px]">
                                  Đang chọn
                                </span>
                              )}
                            </div>
                            <p className="font-serif text-[11px] text-[#1E4B43] dark:text-[#FBF7EE] leading-relaxed">
                              {snip.text}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Blank initial state */
            <div className="my-auto text-center py-10 space-y-2">
              <Headphones className="w-8 h-8 text-[#D4AF37] mx-auto" />
              <div className="text-xs font-bold text-[#1E4B43] dark:text-[#FBF7EE]">
                Chưa có dữ liệu Transcript
              </div>
              <p className="text-[11px] text-[#5D706A] max-w-sm mx-auto">
                Nhập link YouTube ở trên và bấm <strong>"Lấy Transcript"</strong> để gọi API <span className="font-mono">GET /api/v1/ytb-transcript</span>.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM STATUS BAR ── */}
      <div className="flex-shrink-0 flex items-center justify-between text-[11px] text-[#5D706A] dark:text-[#8E9F99] border-t border-[#1E4B43]/10 pt-1.5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Endpoint: GET http://localhost:8080/api/v1/ytb-transcript
          </span>
          <span className="hidden sm:inline-block text-[#5D706A]">
            • Bôi đen hoặc nhấp đúp từ vựng để tra cứu từ điển &amp; phiên âm IPA tức thì
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Kéo xuống hoặc dùng phím điều hướng để xem các màn hình tiếp theo</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
        </div>
      </div>

      {/* ── IN-PLACE DICTIONARY PORTAL POPUP ── */}
      <InPlaceDictionaryPopup
        isOpen={popupState.isOpen}
        vocab={popupState.vocab}
        position={popupState.position}
        onClose={closeDictionary}
        themeMode="paper"
      />
    </div>
  );
};
