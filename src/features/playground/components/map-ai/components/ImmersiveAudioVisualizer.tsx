/**
 * ImmersiveAudioVisualizer
 *
 * Real-time audio-reactive soundwave visualizer responding to AI speech, user mic input, and thinking states.
 * - Dynamic height scaling per bar based on volume and audio frequency simulation.
 * - Gentle ambient wave animation when idle or thinking.
 * - One-click microphone toggle trigger.
 * - Strict UI Iconography: 100% Lucide React SVG icons.
 */

import React, { useMemo } from 'react';
import { Mic, MicOff, RefreshCw } from 'lucide-react';

export interface ImmersiveAudioVisualizerProps {
  isPlaying?: boolean;
  volume?: number;
  recording?: boolean;
  inputVolume?: number;
  isThinking?: boolean;
  onMicClick?: () => void;
  className?: string;
}

export const ImmersiveAudioVisualizer: React.FC<ImmersiveAudioVisualizerProps> = ({
  isPlaying = false,
  volume = 0,
  recording = false,
  inputVolume = 0,
  isThinking = false,
  onMicClick,
  className = '',
}) => {
  const barCount = 18;
  const activeLevel = isPlaying ? Math.max(0.15, volume) : recording ? Math.max(0.15, inputVolume) : 0;

  // Generate responsive bars with symmetric center weighting
  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      // Bell curve factor for aesthetic soundwave
      const center = (barCount - 1) / 2;
      const dist = Math.abs(i - center) / center;
      const weight = Math.max(0.25, 1 - dist * 0.6);

      let heightPercent = 20;
      if (isPlaying || (recording && activeLevel > 0.05)) {
        const noise = Math.sin((i + 1) * 1.8) * 0.2 + 0.8;
        heightPercent = Math.min(100, Math.max(15, activeLevel * 100 * weight * noise));
      } else if (isThinking) {
        // Wave ripple during AI thinking
        heightPercent = 25 + Math.sin(i * 0.6) * 15;
      }

      return {
        id: i,
        heightPercent,
        delay: `${(i * 0.04).toFixed(2)}s`,
      };
    });
  }, [isPlaying, recording, activeLevel, isThinking, barCount]);

  const barColor = isPlaying
    ? 'bg-[#98DC6E]'
    : recording && activeLevel > 0.05
      ? 'bg-emerald-400'
      : isThinking
        ? 'bg-amber-400'
        : 'bg-white/20';

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Soundwave Bars */}
      <div
        className="flex items-center justify-center gap-1 h-9 px-3 py-1 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 shadow-inner"
        aria-label="Soundwave Visualizer"
      >
        {bars.map((bar) => (
          <span
            key={bar.id}
            className={`w-1 rounded-full transition-all duration-150 ease-out ${barColor}`}
            style={{
              height: `${bar.heightPercent}%`,
              transitionDelay: isThinking ? bar.delay : '0s',
            }}
          />
        ))}
      </div>

      {/* Mic toggle trigger */}
      {onMicClick && (
        <button
          type="button"
          onClick={onMicClick}
          className={`p-2 rounded-2xl border transition-all cursor-pointer shadow-md ${
            recording
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
          }`}
          title={recording ? 'Tắt microphone' : 'Bật microphone'}
          aria-label={recording ? 'Tắt mic' : 'Bật mic'}
        >
          {recording ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
};

export default ImmersiveAudioVisualizer;
