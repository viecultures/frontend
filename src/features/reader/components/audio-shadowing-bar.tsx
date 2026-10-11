import React, { useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Mic, Repeat, Gauge, RotateCcw, Sparkles, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioShadowingBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  isRepeatLoop: boolean;
  onToggleRepeatLoop: () => void;
  currentSentenceEn?: string;
  themeMode?: "paper" | "dark";
  selectedLevel?: "Level 1" | "Level 2" | "Level 3";
  onClose?: () => void;
  // Audio state props
  currentTime?: number;
  duration?: number;
  onSeek?: (newTime: number) => void;
  onRestart?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  // Voice selection props
  selectedVoiceName?: string;
  selectedVoiceFlag?: string;
  selectedVoiceGender?: string;
  audioScope?: "full" | "sentence";
  onOpenVoiceCustomizer?: () => void;
}

export const AudioShadowingBar: React.FC<AudioShadowingBarProps> = ({
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onChangeSpeed,
  isRepeatLoop,
  onToggleRepeatLoop,
  themeMode = "paper",
  selectedLevel = "Level 2",
  currentTime = 0,
  duration = 0,
  onSeek,
  onRestart,
  isMuted = false,
  onToggleMute,
  selectedVoiceName = "Puck",
  selectedVoiceFlag = "🇺🇸",
  audioScope = "full",
  onOpenVoiceCustomizer,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const speeds = [0.75, 1.0, 1.25, 1.5];

  const isDark = themeMode === "dark";

  // Cycle to next speed
  const handleCycleSpeed = () => {
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    onChangeSpeed(speeds[nextIndex]);
  };

  // Track scroll position & direction for floating vs in-flow behavior
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsScrollingDown(true);
      } else if (currentScrollY < lastScrollY) {
        setIsScrollingDown(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatSecs = (seconds: number) => {
    if (!seconds || isNaN(seconds) || seconds <= 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (onSeek && duration > 0) {
      const targetTime = (val / 100) * duration;
      onSeek(targetTime);
    }
  };

  const isAtTop = scrollY < 80;

  return (
    <div
      className={`transition-transform transition-opacity duration-300 ${
        isAtTop
          ? "relative w-full max-w-7xl mx-auto z-20 p-2.5 sm:px-6 sm:py-3 rounded-2xl sm:rounded-3xl border-2 shadow-md"
          : `fixed top-14 left-4 right-4 max-w-4xl mx-auto z-40 p-2 sm:px-5 sm:py-2.5 rounded-2xl border-2 backdrop-blur-xl transform ${
              isScrollingDown
                ? "-translate-y-28 opacity-0 pointer-events-none"
                : "translate-y-0 opacity-100 pointer-events-auto shadow-2xl"
            }`
      } ${
        isDark
          ? "bg-[#1E2925] text-[#FBF7EE] border-[#D9B76A]/80 shadow-[0_12px_45px_rgba(0,0,0,0.6)]"
          : "bg-[#FBF7EE] text-[#1E4B43] border-[#D9B76A] shadow-[0_12px_40px_rgba(30,75,67,0.12)]"
      }`}
    >
      {/* ── Single Compact 1-Line Row Layout ──────────────────────────────────── */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3 sm:gap-4">
        
        {/* 1. Left: Track / Audio Info + Voice Indicator Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 border ${
              isDark
                ? "bg-[#141C1A] border-[#D9B76A]/40 text-[#D9B76A]"
                : "bg-[#1E4B43]/10 border-[#1E4B43]/20 text-[#1E4B43]"
            }`}
          >
            {isRecording ? (
              <Mic className="w-4 h-4 text-red-400 animate-pulse" />
            ) : isPlaying ? (
              <Sparkles className="w-4 h-4 text-[#D9B76A] animate-spin" style={{ animationDuration: '3s' }} />
            ) : (
              <Volume2 className="w-4 h-4 text-[#D9B76A]" />
            )}
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className={`text-xs font-bold truncate leading-tight ${
                isDark ? "text-[#FBF7EE]" : "text-[#1E4B43]"
              }`}>
                Tết: Renewal
              </h4>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                audioScope === "full"
                  ? "bg-[#2563EB]/15 text-[#2563EB] dark:text-[#93C5FD]"
                  : "bg-[#D9B76A]/20 text-[#D9B76A]"
              }`}>
                {audioScope === "full" ? "Toàn bài" : "Shadowing"}
              </span>
            </div>

            {/* Voice Switcher trigger button */}
            {onOpenVoiceCustomizer && (
              <button
                type="button"
                onClick={onOpenVoiceCustomizer}
                className={`text-[10px] font-bold flex items-center gap-1 group transition-colors cursor-pointer hover:underline ${
                  isDark ? "text-[#D9B76A]" : "text-[#1E4B43]"
                }`}
                title="Bấm để chọn giọng đọc Google Gemini"
              >
                <span>{selectedVoiceFlag}</span>
                <span>Giọng: {selectedVoiceName}</span>
                <SlidersHorizontal className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Center: All Controls + Scrubber in ONE Single Horizontal Line */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-center min-w-0">
          
          {/* Icons on the LEFT of Play: Replay & Loop */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Replay */}
            <button
              onClick={onRestart}
              title="Nghe lại từ đầu"
              className={`p-1.5 sm:p-2 rounded-full transition-colors cursor-pointer shrink-0 ${
                isDark
                  ? "text-[#BFE3EA] hover:text-[#D9B76A] hover:bg-white/10"
                  : "text-[#1E4B43] hover:text-[#D9B76A] hover:bg-[#1E4B43]/10"
              }`}
              aria-label="Nghe lại từ đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Loop / Repeat */}
            <button
              onClick={onToggleRepeatLoop}
              title={isRepeatLoop ? "Đang bật lặp lại câu" : "Bật lặp lại câu"}
              className={`p-1.5 sm:p-2 rounded-full border transition-colors relative cursor-pointer shrink-0 ${
                isRepeatLoop
                  ? isDark
                    ? "bg-[#D9B76A]/25 text-[#D9B76A] border-[#D9B76A]/50 font-bold shadow-xs"
                    : "bg-[#1E4B43]/15 text-[#1E4B43] border-[#1E4B43]/30 font-bold shadow-xs"
                  : isDark
                  ? "text-[#BFE3EA]/70 hover:text-[#D9B76A] border-transparent hover:bg-white/10"
                  : "text-[#1E4B43]/70 hover:text-[#1E4B43] border-transparent hover:bg-[#1E4B43]/10"
              }`}
              aria-label="Lặp lại câu"
            >
              <Repeat className="w-3.5 h-3.5" />
              {isRepeatLoop && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current" />
              )}
            </button>
          </div>

          {/* Play/Pause Button */}
          <Button
            variant="gold"
            size="icon"
            onClick={onTogglePlay}
            className={`rounded-full w-8 h-8 sm:w-9 sm:h-9 shadow-md shrink-0 transition-transform active:scale-95 cursor-pointer ${
              isDark
                ? "bg-[#D9B76A] hover:bg-[#c9a657] text-[#1E4B43]"
                : "bg-[#1E4B43] hover:bg-[#163D37] text-[#FBF7EE]"
            }`}
            title={isPlaying ? "Tạm dừng" : "Phát audio Google Gemini"}
            aria-label={isPlaying ? "Tạm dừng" : "Phát audio"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 ml-0.5 fill-current" />
            )}
          </Button>

          {/* Scrubber / Progress Bar */}
          <div className="flex items-center gap-2 flex-1 max-w-[240px] sm:max-w-xs min-w-[100px] select-none">
            <span
              style={{
                fontVariantNumeric: "tabular-nums",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              }}
              className={`text-[11px] font-semibold text-right w-8 min-w-[32px] block shrink-0 select-none ${
                isDark ? "text-[#BFE3EA]" : "text-[#1E4B43]/80"
              }`}
            >
              {formatSecs(currentTime)}
            </span>

            <div className="relative w-full h-4 flex items-center min-w-0">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progressPercent}
                onChange={handleSliderChange}
                style={{
                  background: isDark
                    ? `linear-gradient(to right, #D9B76A 0%, #D9B76A ${progressPercent}%, rgba(255, 255, 255, 0.2) ${progressPercent}%, rgba(255, 255, 255, 0.2) 100%)`
                    : `linear-gradient(to right, #1E4B43 0%, #1E4B43 ${progressPercent}%, rgba(30, 75, 67, 0.15) ${progressPercent}%, rgba(30, 75, 67, 0.15) 100%)`,
                }}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer focus:outline-none m-0 ${
                  isDark
                    ? "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#D9B76A] [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#D9B76A] [&::-moz-range-thumb]:border-none"
                    : "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1E4B43] [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#1E4B43] [&::-moz-range-thumb]:border-none"
                }`}
                aria-label="Thanh thời gian đọc"
              />
            </div>

            <span
              style={{
                fontVariantNumeric: "tabular-nums",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              }}
              className={`text-[11px] font-semibold text-left w-8 min-w-[32px] block shrink-0 select-none ${
                isDark ? "text-[#BFE3EA]" : "text-[#1E4B43]/80"
              }`}
            >
              {formatSecs(duration)}
            </span>
          </div>

          {/* Icons on the RIGHT of Audio track: Recording (Mic) & Speed (Gauge) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Shadow Mic */}
            <button
              onClick={() => setIsRecording(!isRecording)}
              title={isRecording ? "Đang thu âm (Nhấp để dừng)" : "Bật thu âm AI Shadowing"}
              className={`p-1.5 sm:p-2 rounded-full border transition-colors cursor-pointer shrink-0 ${
                isRecording
                  ? "bg-red-500/25 text-red-400 border-red-400 animate-pulse shadow-sm"
                  : isDark
                  ? "text-[#BFE3EA] hover:text-[#D9B76A] hover:bg-white/10 border-transparent"
                  : "text-[#1E4B43] hover:text-[#D9B76A] hover:bg-[#1E4B43]/10 border-transparent"
              }`}
              aria-label="Thu âm AI Shadowing"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>

            {/* Speed Selector */}
            <button
              onClick={handleCycleSpeed}
              title={`Tốc độ đọc: ${playbackSpeed}x. Nhấp để đổi.`}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold transition-colors cursor-pointer shrink-0 ${
                isDark
                  ? "bg-[#141C1A] border-[#D9B76A]/50 text-[#D9B76A] hover:bg-[#D9B76A]/20"
                  : "bg-[#1E4B43]/10 border-[#1E4B43]/30 text-[#1E4B43] hover:bg-[#1E4B43]/20"
              }`}
              aria-label={`Tốc độ đọc ${playbackSpeed}x`}
            >
              <Gauge className="w-3 h-3" />
              <span className="font-mono tabular-nums text-[10px]">{playbackSpeed}x</span>
            </button>
          </div>

        </div>

        {/* 3. Right: Voice Customizer Action Button & Mute */}
        <div className="flex items-center justify-end gap-2 shrink-0 min-w-0">
          {onOpenVoiceCustomizer && (
            <button
              onClick={onOpenVoiceCustomizer}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all cursor-pointer shadow-xs ${
                isDark
                  ? "bg-[#D9B76A]/20 border-[#D9B76A]/60 text-[#D9B76A] hover:bg-[#D9B76A]/30"
                  : "bg-[#1E4B43]/10 border-[#1E4B43]/30 text-[#1E4B43] hover:bg-[#1E4B43]/15"
              }`}
              title="Mở giao diện tùy chỉnh giọng đọc Google Gemini"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span className="hidden sm:inline">Chỉnh giọng đọc</span>
            </button>
          )}

          <button
            onClick={onToggleMute}
            title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isMuted
                ? "bg-red-500/20 text-red-400 border-red-500/40"
                : isDark
                ? "bg-[#141C1A] border-[#D9B76A]/40 text-[#D9B76A] hover:bg-[#D9B76A]/20"
                : "bg-[#1E4B43]/10 border-[#1E4B43]/20 text-[#1E4B43] hover:bg-[#1E4B43]/20"
            }`}
            aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border shrink-0 ${
            isDark
              ? "border-[#D9B76A]/40 bg-[#D9B76A]/15 text-[#D9B76A]"
              : "border-[#1E4B43]/30 bg-[#1E4B43]/10 text-[#1E4B43]"
          }`}>
            {selectedLevel}
          </span>
        </div>

      </div>
    </div>
  );
};

export default AudioShadowingBar;
