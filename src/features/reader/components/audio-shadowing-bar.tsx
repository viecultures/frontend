import React, { useState, useEffect } from "react";
import { Play, Pause, Volume2, Mic, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioShadowingBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  isRepeatLoop: boolean;
  onToggleRepeatLoop: () => void;
  currentSentenceEn?: string;
  themeMode?: "olive" | "paper" | "dark";
  onClose?: () => void;
}

export const AudioShadowingBar: React.FC<AudioShadowingBarProps> = ({
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onChangeSpeed,
  isRepeatLoop,
  onToggleRepeatLoop,
  themeMode = "dark",
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(35); // Default progress for visual demonstration
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const speeds = [0.75, 1.0, 1.25];

  const isLight = themeMode === "paper";

  // Track scroll position & direction for seamless in-flow vs floating behavior
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling DOWN -> Hide floating bar
        setIsScrollingDown(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling UP -> Show floating bar
        setIsScrollingDown(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simulate audio playback / recording progress movement
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying || isRecording) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 300 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isRecording, playbackSpeed]);

  const formatTime = (percent: number) => {
    const totalSeconds = 15;
    const current = Math.floor((percent / 100) * totalSeconds);
    const m = Math.floor(current / 60);
    const s = current % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const isAtTop = scrollY < 80;

  return (
    <div
      className={`transition-all duration-300 ${isAtTop
          ? "relative w-full max-w-7xl mx-auto z-20 p-4 sm:p-5 rounded-3xl border-2 border-antique-gold shadow-md"
          : `fixed top-14 left-4 right-4 max-w-4xl mx-auto z-40 p-3.5 sm:p-4 rounded-2xl border-2 border-antique-gold backdrop-blur-xl transform ${isScrollingDown
            ? "-translate-y-24 opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100 pointer-events-auto shadow-2xl"
          }`
        } ${isLight
          ? "bg-rice-paper text-heritage-green shadow-[0_12px_40px_heritage-green/12]"
          : "bg-heritage-dark text-warm-ivory shadow-[0_12px_40px_heritage-dark/4]"
        }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">

        {/* Left Side: Play Button & Title + Recording Slider */}
        <div className="flex items-center gap-3.5 flex-1 max-w-xl">
          <Button
            variant="gold"
            size="icon"
            onClick={onTogglePlay}
            className={`rounded-full w-10 h-10 sm:w-11 sm:h-11 shadow-md shrink-0 transition-transform active:scale-95 ${isLight
                ? "bg-heritage-green hover:bg-heritage-dark text-warm-ivory"
                : "bg-antique-gold hover:bg-[#c9a657] text-heritage-green"
              }`}
            title={isPlaying ? "Tạm dừng" : "Phát audio shadowing"}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
          </Button>

          {/* Title & Recording Progress Slider */}
          <div className="flex-1 space-y-1.5 min-w-0">
            {/* Title Header */}
            <div className="flex items-center justify-between gap-2">
              <div className={`flex items-center gap-2 text-xs font-extrabold tracking-tight ${isLight ? "text-heritage-green" : "text-antique-gold"
                }`}>
                <Volume2 className={`w-4 h-4 animate-pulse shrink-0 ${isLight ? "text-heritage-green" : "text-antique-gold"}`} />
                <span>AI Audio Shadowing Engine</span>
              </div>
              <span className={`text-[11px] font-mono font-semibold ${isLight ? "text-heritage-green/70" : "text-sky-mist"}`}>
                {formatTime(progress)} / 0:15
              </span>
            </div>

            {/* Recording & Playback Range Slider */}
            <div className="relative flex items-center group">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none relative z-10 ${isLight ? "bg-mist-cloud" : "bg-heritage-green"
                  } ${isLight
                    ? "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-warm-ivory [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-heritage-green [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-warm-ivory [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-heritage-green"
                    : "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-warm-ivory [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-antique-gold [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-warm-ivory [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-antique-gold"
                  }`}
              />
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-lg pointer-events-none transition-all z-0 ${isLight ? "bg-heritage-green" : "bg-antique-gold"
                  }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Speed, Loop & Shadow Mic Controls */}
        <div className={`flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5 border-t sm:border-t-0 pt-2 sm:pt-0 ${isLight ? "border-heritage-green/15" : "border-antique-gold/20"
          }`}>
          {/* Speed Selector */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${isLight ? "bg-mist-cloud/80 border-heritage-green/20" : "bg-heritage-green/80 border-antique-gold/30"
            }`}>
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${playbackSpeed === s
                    ? isLight
                      ? "bg-heritage-green text-warm-ivory shadow-xs"
                      : "bg-antique-gold text-heritage-green shadow-xs"
                    : isLight
                      ? "text-heritage-green hover:bg-warm-ivory"
                      : "text-sky-mist hover:text-warm-ivory hover:bg-heritage-dark"
                  }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Repeat Loop Button */}
          <button onClick={onToggleRepeatLoop}
            title="Lặp lại câu để thực hành Shadowing"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${isRepeatLoop
                ? isLight
                  ? "focus-ring bg-heritage-green/15 border-heritage-green text-heritage-green font-bold shadow-xs"
                  : "bg-antique-gold/25 border-antique-gold text-antique-gold font-bold shadow-xs"
                : isLight
                  ? "border-heritage-green/20 bg-mist-cloud/60 text-heritage-green hover:border-heritage-green"
                  : "border-antique-gold/30 bg-heritage-green/80 text-sky-mist hover:border-antique-gold hover:text-warm-ivory"
              }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Loop</span>
          </button>

          {/* Practice Mic Shadowing */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            title="Ghi âm giọng nói để so sánh khớp độ cao"
            className={`focus-ring px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${isRecording
                ? "bg-[#E8B7B2] text-[#991B1B] border-[#E8B7B2] animate-pulse"
                : isLight
                  ? "bg-mist-cloud text-heritage-green border-heritage-green/30 hover:bg-mist-cloud/80"
                  : "bg-heritage-green text-antique-gold hover:bg-heritage-green/80 border-antique-gold/40"
              }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isRecording ? "Recording..." : "Shadow Mic"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AudioShadowingBar;
