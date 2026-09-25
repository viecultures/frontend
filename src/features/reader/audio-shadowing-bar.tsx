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
          ? "relative w-full max-w-7xl mx-auto z-20 p-4 sm:p-5 rounded-3xl border-2 border-[#D9B76A] shadow-md"
          : `fixed top-14 left-4 right-4 max-w-4xl mx-auto z-40 p-3.5 sm:p-4 rounded-2xl border-2 border-[#D9B76A] backdrop-blur-xl transform ${isScrollingDown
            ? "-translate-y-24 opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100 pointer-events-auto shadow-2xl"
          }`
        } ${isLight
          ? "bg-[#F6EEDC] text-[#1E4B43] shadow-[0_12px_40px_rgba(30,75,67,0.12)]"
          : "bg-[#163D37] text-[#FBF7EE] shadow-[0_12px_40px_rgba(22,61,55,0.4)]"
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
                ? "bg-[#1E4B43] hover:bg-[#163D37] text-[#FBF7EE]"
                : "bg-[#D9B76A] hover:bg-[#c9a657] text-[#1E4B43]"
              }`}
            title={isPlaying ? "Tạm dừng" : "Phát audio shadowing"}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
          </Button>

          {/* Title & Recording Progress Slider */}
          <div className="flex-1 space-y-1.5 min-w-0">
            {/* Title Header */}
            <div className="flex items-center justify-between gap-2">
              <div className={`flex items-center gap-2 text-xs font-extrabold tracking-tight ${isLight ? "text-[#1E4B43]" : "text-[#D9B76A]"
                }`}>
                <Volume2 className={`w-4 h-4 animate-pulse shrink-0 ${isLight ? "text-[#1E4B43]" : "text-[#D9B76A]"}`} />
                <span>AI Audio Shadowing Engine</span>
              </div>
              <span className={`text-[11px] font-mono font-semibold ${isLight ? "text-[#1E4B43]/70" : "text-[#BFE3EA]"}`}>
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
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none relative z-10 ${isLight ? "bg-[#E8DFCB]" : "bg-[#1E4B43]"
                  } ${isLight
                    ? "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FBF7EE] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#1E4B43] [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#FBF7EE] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#1E4B43]"
                    : "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FBF7EE] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#D9B76A] [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#FBF7EE] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#D9B76A]"
                  }`}
              />
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-lg pointer-events-none transition-all z-0 ${isLight ? "bg-[#1E4B43]" : "bg-[#D9B76A]"
                  }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Speed, Loop & Shadow Mic Controls */}
        <div className={`flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5 border-t sm:border-t-0 pt-2 sm:pt-0 ${isLight ? "border-[#1E4B43]/15" : "border-[#D9B76A]/20"
          }`}>
          {/* Speed Selector */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${isLight ? "bg-[#E8DFCB]/80 border-[#1E4B43]/20" : "bg-[#1E4B43]/80 border-[#D9B76A]/30"
            }`}>
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${playbackSpeed === s
                    ? isLight
                      ? "bg-[#1E4B43] text-[#FBF7EE] shadow-xs"
                      : "bg-[#D9B76A] text-[#1E4B43] shadow-xs"
                    : isLight
                      ? "text-[#1E4B43] hover:bg-[#FBF7EE]"
                      : "text-[#BFE3EA] hover:text-[#FBF7EE] hover:bg-[#163D37]"
                  }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Repeat Loop Button */}
          <button
            onClick={onToggleRepeatLoop}
            title="Lặp lại câu để thực hành Shadowing"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${isRepeatLoop
                ? isLight
                  ? "bg-[#1E4B43]/15 border-[#1E4B43] text-[#1E4B43] font-bold shadow-xs"
                  : "bg-[#D9B76A]/25 border-[#D9B76A] text-[#D9B76A] font-bold shadow-xs"
                : isLight
                  ? "border-[#1E4B43]/20 bg-[#E8DFCB]/60 text-[#1E4B43] hover:border-[#1E4B43]"
                  : "border-[#D9B76A]/30 bg-[#1E4B43]/80 text-[#BFE3EA] hover:border-[#D9B76A] hover:text-[#FBF7EE]"
              }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Loop</span>
          </button>

          {/* Practice Mic Shadowing */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            title="Ghi âm giọng nói để so sánh khớp độ cao"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${isRecording
                ? "bg-[#E8B7B2] text-[#991B1B] border-[#E8B7B2] animate-pulse"
                : isLight
                  ? "bg-[#E8DFCB] text-[#1E4B43] border-[#1E4B43]/30 hover:bg-[#E8DFCB]/80"
                  : "bg-[#1E4B43] text-[#D9B76A] hover:bg-[#1E4B43]/80 border-[#D9B76A]/40"
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
