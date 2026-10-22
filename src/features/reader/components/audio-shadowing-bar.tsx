import React, { useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Mic, Repeat, Gauge, RotateCcw, Sparkles, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioShadowingBarProps {
  articleTitle?: string;
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
  onStartShadowing?: () => void;
}

export const AudioShadowingBar: React.FC<AudioShadowingBarProps> = ({
  articleTitle = 'Tết: Renewal',
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
  onStartShadowing,
}) => {
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
      data-audio-theme={themeMode}
      className={`reader-component-audio transition-transform transition-opacity duration-300 ${
        isAtTop
          ? "relative w-full max-w-7xl mx-auto z-20 p-2.5 sm:px-6 sm:py-3 rounded-2xl sm:rounded-3xl border-2 shadow-md"
          : `fixed top-14 left-4 right-4 max-w-4xl mx-auto z-40 p-2 sm:px-5 sm:py-2.5 rounded-2xl border-2 backdrop-blur-xl transform ${
              isScrollingDown
                ? "-translate-y-28 opacity-0 pointer-events-none"
                : "translate-y-0 opacity-100 pointer-events-auto shadow-2xl"
            }`
      } ${
        isDark
          ? "bg-[#1E2925] text-warm-ivory border-antique-gold/80 shadow-[0_12px_45px_rgba(0,0,0,0.6)]"
          : "bg-warm-ivory text-heritage-green border-antique-gold shadow-[0_12px_40px_color-mix(in_srgb,_var(--color-heritage-green)_12%,_transparent)]"
      }`}
    >
      {/* ── Single Compact 1-Line Row Layout ──────────────────────────────────── */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3 sm:gap-4">
        
        {/* 1. Left: Track / Audio Info + Voice Indicator Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 border ${
              isDark
                ? "bg-[#141C1A] border-antique-gold/40 text-antique-gold"
                : "bg-heritage-green/10 border-heritage-green/20 text-heritage-green"
            }`}
          >
            {isPlaying ? (
              <Sparkles className="w-4 h-4 text-antique-gold" />
            ) : (
              <Volume2 className="w-4 h-4 text-antique-gold" />
            )}
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className={`text-xs font-bold truncate leading-tight ${
                isDark ? "text-warm-ivory" : "text-heritage-green"
              }`}>
                {articleTitle}
              </h4>
              <span className={`reader-audio-scope text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                audioScope === "full"
                  ? "bg-[#2563EB]/15 text-[#2563EB] dark:text-[#93C5FD]"
                  : "bg-antique-gold/20 text-antique-gold"
              }`}>
                {audioScope === "full" ? "Full article" : "Shadowing"}
              </span>
            </div>

            {/* Voice Switcher trigger button */}
            {onOpenVoiceCustomizer && (
              <button
                type="button"
                onClick={onOpenVoiceCustomizer}
                className={`text-[10px] font-bold flex items-center gap-1 group transition-colors cursor-pointer hover:underline ${
                  isDark ? "text-antique-gold" : "text-heritage-green"
                }`}
                title="Choose reading voice"
              >
                <span>{selectedVoiceFlag}</span>
                <span>Voice: {selectedVoiceName}</span>
                <SlidersHorizontal className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile controls use a full row, with the timeline below them. */}
        <div className="order-last flex basis-full flex-wrap items-center gap-2 sm:gap-3 flex-1 justify-center min-w-0 md:order-none md:basis-auto md:flex-nowrap">
          
          {/* Icons on the LEFT of Play: Replay & Loop */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Replay */}
            <button
              onClick={onRestart}
              title="Restart audio"
              className={`p-1.5 sm:p-2 rounded-full transition-colors cursor-pointer shrink-0 ${
                isDark
                  ? "text-sky-mist hover:text-antique-gold hover:bg-white/10"
                  : "text-heritage-green hover:text-antique-gold hover:bg-heritage-green/10"
              }`}
              aria-label="Restart audio"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Loop / Repeat */}
            <button
              onClick={onToggleRepeatLoop}
              title={isRepeatLoop ? "Sentence repeat is on" : "Enable sentence repeat"}
              className={`p-1.5 sm:p-2 rounded-full border transition-colors relative cursor-pointer shrink-0 ${
                isRepeatLoop
                  ? isDark
                    ? "bg-antique-gold/25 text-antique-gold border-antique-gold/50 font-bold shadow-xs"
                    : "bg-heritage-green/15 text-heritage-green border-heritage-green/30 font-bold shadow-xs"
                  : isDark
                  ? "text-sky-mist/70 hover:text-antique-gold border-transparent hover:bg-white/10"
                  : "text-heritage-green/70 hover:text-heritage-green border-transparent hover:bg-heritage-green/10"
              }`}
              aria-label="Repeat sentence"
              aria-pressed={isRepeatLoop}
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
            className={`rounded-full size-11 shrink-0 ${
              isDark
                ? "bg-antique-gold hover:bg-[#c9a657] text-heritage-green"
                : "bg-heritage-green hover:bg-heritage-dark text-warm-ivory"
            }`}
            title={isPlaying ? "Pause" : "Play audio"}
            aria-label={isPlaying ? "Pause" : "Play audio"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 ml-0.5 fill-current" />
            )}
          </Button>

          {/* Scrubber / Progress Bar */}
          <div className="order-last flex basis-full items-center gap-2 flex-1 min-w-[100px] select-none md:order-none md:basis-auto md:max-w-xs">
            <span
              style={{
                fontVariantNumeric: "tabular-nums",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              }}
              className={`text-[11px] font-semibold text-right w-8 min-w-[32px] block shrink-0 select-none ${
                isDark ? "text-sky-mist" : "text-heritage-green/80"
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
                    ? `linear-gradient(to right, var(--color-antique-gold) 0%, var(--color-antique-gold) ${progressPercent}%, rgba(255, 255, 255, 0.2) ${progressPercent}%, rgba(255, 255, 255, 0.2) 100%)`
                    : `linear-gradient(to right, var(--color-heritage-green) 0%, var(--color-heritage-green) ${progressPercent}%, color-mix(in srgb, var(--color-heritage-green) 15%, transparent) ${progressPercent}%, color-mix(in srgb, var(--color-heritage-green) 15%, transparent) 100%)`,
                }}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer focus:outline-none m-0 ${
                  isDark
                    ? "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-antique-gold [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-antique-gold [&::-moz-range-thumb]:border-none"
                    : "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-heritage-green [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-heritage-green [&::-moz-range-thumb]:border-none"
                }`}
                aria-label="Audio progress"
              />
            </div>

            <span
              style={{
                fontVariantNumeric: "tabular-nums",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              }}
              className={`text-[11px] font-semibold text-left w-8 min-w-[32px] block shrink-0 select-none ${
                isDark ? "text-sky-mist" : "text-heritage-green/80"
              }`}
            >
              {formatSecs(duration)}
            </span>
          </div>

          {/* Icons on the RIGHT of Audio track: Recording (Mic) & Speed (Gauge) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onStartShadowing && <button
              type="button"
              onClick={onStartShadowing}
              title="Practise shadowing"
              aria-label="Practise shadowing"
              className="p-2 rounded-full border border-transparent hover:border-antique-gold"
            ><Mic className="w-3.5 h-3.5" /></button>}

            {/* Speed Selector */}
            <button
              onClick={handleCycleSpeed}
              title={`Playback speed: ${playbackSpeed}x. Click to change.`}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold transition-colors cursor-pointer shrink-0 ${
                isDark
                  ? "bg-[#141C1A] border-antique-gold/50 text-antique-gold hover:bg-antique-gold/20"
                  : "bg-heritage-green/10 border-heritage-green/30 text-heritage-green hover:bg-heritage-green/20"
              }`}
              aria-label={`Playback speed ${playbackSpeed}x`}
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
                  ? "bg-antique-gold/20 border-antique-gold/60 text-antique-gold hover:bg-antique-gold/30"
                  : "bg-heritage-green/10 border-heritage-green/30 text-heritage-green hover:bg-heritage-green/15"
              }`}
              title="Open voice settings"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span className="hidden sm:inline">Voice settings</span>
            </button>
          )}

          <button
            onClick={onToggleMute}
            title={isMuted ? "Unmute" : "Mute"}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isMuted
                ? "bg-red-500/20 text-red-400 border-red-500/40"
                : isDark
                ? "bg-[#141C1A] border-antique-gold/40 text-antique-gold hover:bg-antique-gold/20"
                : "bg-heritage-green/10 border-heritage-green/20 text-heritage-green hover:bg-heritage-green/20"
            }`}
            aria-label={isMuted ? "Unmute" : "Mute"}
            aria-pressed={isMuted}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

        </div>

      </div>
    </div>
  );
};

export default AudioShadowingBar;
