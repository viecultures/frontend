import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Repeat,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Headphones,
} from 'lucide-react';
import { AUDIO_SPEEDS, formatAudioTime, type AudioSpeedValue } from '../constants';

export interface StickyAudioPlayerProps {
  articleTitle?: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  currentTime: number;
  duration: number;
  onSeek: (newTime: number) => void;
  onRewind?: (seconds?: number) => void;
  isRepeatLoop?: boolean;
  onToggleRepeatLoop?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  activeParagraphIndex?: number;
  totalParagraphs?: number;
  onScrollToActiveParagraph?: () => void;
  selectedVoiceName?: string;
  selectedVoiceFlag?: string;
  onOpenVoiceCustomizer?: () => void;
  themeMode?: 'paper' | 'dark';
  className?: string;
}

export const StickyAudioPlayer: React.FC<StickyAudioPlayerProps> = ({
  articleTitle = 'Tết: Renewal, Remembrance & Regional Flavours',
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onChangeSpeed,
  currentTime,
  duration,
  onSeek,
  onRewind,
  isRepeatLoop = false,
  onToggleRepeatLoop,
  isMuted = false,
  onToggleMute,
  activeParagraphIndex = 0,
  totalParagraphs = 0,
  onScrollToActiveParagraph,
  selectedVoiceName = 'Puck',
  selectedVoiceFlag = '🇺🇸',
  onOpenVoiceCustomizer,
  themeMode = 'paper',
  className = '',
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const isDark = themeMode === 'dark';

  const progressPercent =
    duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (duration > 0) {
      const targetTime = (val / 100) * duration;
      onSeek(targetTime);
    }
  };

  const handleRewind5s = () => {
    if (onRewind) {
      onRewind(5);
    } else {
      const newTime = Math.max(0, currentTime - 5);
      onSeek(newTime);
    }
  };

  // Minimized Floating Pill Mode
  if (isMinimized) {
    return (
      <aside
        aria-label="Audio player mini controller"
        className={`fixed bottom-4 right-4 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-2xl border transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
          isDark
            ? 'bg-[#18211E]/95 text-warm-ivory border-antique-gold/30 backdrop-blur-md'
            : 'bg-[#FAF7EF]/95 text-[#123047] border-[#D6D8CC] backdrop-blur-md'
        } ${className}`}
      >
        <button
          type="button"
          onClick={onTogglePlay}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-heritage-green text-warm-ivory hover:scale-105 active:scale-95 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-antique-gold"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
        </button>

        <div className="flex flex-col text-left cursor-pointer" onClick={() => setIsMinimized(false)}>
          <span className="text-xs font-semibold truncate max-w-[140px] sm:max-w-[180px]">{articleTitle}</span>
          <span className="text-[10px] text-antique-gold font-mono">
            {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="p-2 text-mist-cloud hover:text-warm-ivory rounded-full hover:bg-black/10 transition-colors"
          title="Expand player"
          aria-label="Expand audio player"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Sticky Audio Player"
      className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 border-t shadow-[0_-8px_30px_rgba(0,0,0,0.15)] ${
        isDark
          ? 'bg-[#141C1A]/95 text-warm-ivory border-antique-gold/25 backdrop-blur-lg'
          : 'bg-[#FAF7EF]/95 text-[#123047] border-[#D6D8CC] backdrop-blur-lg'
      } ${className}`}
    >
      {/* ── Scrubber Slider Line across top of player ───────────────────────── */}
      <div className="relative w-full h-1.5 group cursor-pointer bg-black/10 dark:bg-white/10">
        <div
          className="absolute left-0 top-0 bottom-0 bg-antique-gold transition-all duration-100 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={progressPercent}
          onChange={handleSliderChange}
          aria-label="Seek audio playback"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4">
        {/* ── Left Column: Audio Metadata & Paragraph Indicator ─────────────── */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-2 rounded-xl bg-antique-gold/15 text-antique-gold shrink-0">
              <Headphones className="w-4 h-4" />
            </span>
            <div className="truncate">
              <h4 className="text-xs sm:text-sm font-semibold truncate max-w-[200px] sm:max-w-[280px]">
                {articleTitle}
              </h4>
              <div className="flex items-center gap-2 text-[11px] text-mist-cloud">
                {totalParagraphs > 0 && (
                  <button
                    type="button"
                    onClick={onScrollToActiveParagraph}
                    className="inline-flex items-center gap-1 text-antique-gold hover:underline cursor-pointer font-medium"
                    title="Click to jump to active paragraph in view"
                  >
                    <span>Đoạn {activeParagraphIndex + 1}/{totalParagraphs}</span>
                    <Volume2 className="w-2.5 h-2.5" />
                  </button>
                )}
                {selectedVoiceName && (
                  <button
                    type="button"
                    onClick={onOpenVoiceCustomizer}
                    className="hidden sm:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    title="Change voice"
                  >
                    <span>{selectedVoiceFlag}</span>
                    <span>{selectedVoiceName}</span>
                    <SlidersHorizontal className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Minimize button on mobile */}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="md:hidden p-2 rounded-lg text-mist-cloud hover:text-warm-ivory hover:bg-black/10 transition-colors"
            title="Minimize audio player"
            aria-label="Minimize audio player"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* ── Center Column: Playback Controls & Scrubber ───────────────────── */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 w-full md:w-auto">
          {/* Rewind 5s Button */}
          <button
            type="button"
            onClick={handleRewind5s}
            className="w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all text-mist-cloud hover:text-warm-ivory border border-transparent hover:border-black/10 dark:hover:border-white/10"
            title="Tua lại 5 giây (-5s)"
            aria-label="Tua lại 5 giây"
          >
            <RotateCcw className="w-4 h-4 mr-0.5" />
            <span className="text-[10px] font-mono">5s</span>
          </button>

          {/* Primary Play / Pause Button */}
          <button
            type="button"
            onClick={onTogglePlay}
            className="w-12 h-12 min-w-[48px] rounded-full flex items-center justify-center bg-heritage-green text-warm-ivory hover:brightness-110 active:scale-95 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-antique-gold"
            aria-label={isPlaying ? 'Tạm dừng bài nghe' : 'Phát bài nghe'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            )}
          </button>

          {/* Loop / Repeat Button */}
          {onToggleRepeatLoop && (
            <button
              type="button"
              onClick={onToggleRepeatLoop}
              className={`w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center transition-all ${
                isRepeatLoop
                  ? 'bg-antique-gold/20 text-antique-gold border border-antique-gold/50 font-bold'
                  : 'text-mist-cloud hover:text-warm-ivory hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              title={isRepeatLoop ? 'Lặp lại: BẬT' : 'Lặp lại: TẮT'}
              aria-label="Toggle repeat loop"
              aria-pressed={isRepeatLoop}
            >
              <Repeat className="w-4 h-4" />
            </button>
          )}

          {/* Time Display */}
          <div className="flex items-center gap-1 font-mono text-xs text-mist-cloud min-w-[85px] justify-center">
            <span className="text-warm-ivory dark:text-warm-ivory font-medium">
              {formatAudioTime(currentTime)}
            </span>
            <span>/</span>
            <span>{formatAudioTime(duration)}</span>
          </div>
        </div>

        {/* ── Right Column: Invariant Speed Controls & Volume & Minimize ────── */}
        <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-3 w-full md:w-auto">
          {/* Strict 3-Speed Selector mandated by system_constants.md: [1x, 0.8x, 0.5x] */}
          <div
            className="flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
            role="group"
            aria-label="Tốc độ âm thanh (Audio speeds)"
          >
            {AUDIO_SPEEDS.map((opt) => {
              const isActive = Math.abs(playbackSpeed - opt.value) < 0.05;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => onChangeSpeed(opt.value)}
                  className={`min-w-[44px] min-h-[32px] px-2.5 py-1 text-xs rounded-lg transition-all font-semibold ${
                    isActive
                      ? 'bg-antique-gold text-[#123047] dark:text-[#123047] font-bold shadow-xs'
                      : 'text-mist-cloud hover:text-warm-ivory hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                  title={`${opt.label} - ${opt.description}`}
                  aria-pressed={isActive}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Mute Button */}
          {onToggleMute && (
            <button
              type="button"
              onClick={onToggleMute}
              className={`min-w-[40px] min-h-[40px] p-2 rounded-xl transition-all ${
                isMuted
                  ? 'text-red-400 bg-red-500/10'
                  : 'text-mist-cloud hover:text-warm-ivory hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}

          {/* Desktop Minimize Toggle */}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="hidden md:inline-flex min-w-[36px] min-h-[36px] items-center justify-center rounded-xl text-mist-cloud hover:text-warm-ivory hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Minimize audio player"
            aria-label="Minimize audio player"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
