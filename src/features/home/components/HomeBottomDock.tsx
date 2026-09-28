import React from 'react';
import { Clock } from 'lucide-react';

interface HomeBottomDockProps {
  activeDockMode: 'study' | 'pomodoro';
  onSelectDockMode: (mode: 'study' | 'pomodoro') => void;
  pomoSeconds: number;
  isPomoRunning: boolean;
  onTogglePomo: () => void;
}

export const HomeBottomDock: React.FC<HomeBottomDockProps> = ({
  activeDockMode,
  onSelectDockMode,
  pomoSeconds,
  isPomoRunning,
  onTogglePomo,
}) => {
  const formatPomoTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6 relative z-10">
      <div className="flex items-center gap-3">
        {/* Unified Floating Bottom Control Dock Container */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-heritage-forest/90 border border-white/20 backdrop-blur-xl shadow-2xl p-2 rounded-2xl w-full sm:w-auto">
          {/* Streak Sub-card */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-black/40 rounded-xl border border-white/10">
            <span className="text-xl">🔥</span>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300">STREAK</div>
              <div className="text-xs font-extrabold text-white">2 Ngày Liên Tiếp</div>
            </div>
          </div>

          {/* Daily Challenge Sub-card */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-black/40 rounded-xl border border-white/10">
            <Clock className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">THỬ THÁCH HẰNG NGÀY</div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Còn lại</span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-mono border border-emerald-500/30">
                  13:40:27
                </span>
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block w-px h-7 bg-white/15 mx-0.5" />

          {/* Mode Switcher Dock (Study / Pomodoro) */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => onSelectDockMode('study')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeDockMode === 'study'
                  ? 'bg-antique-bright text-heritage-forest shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Study Mode
            </button>
            <button
              type="button"
              onClick={() => onSelectDockMode('pomodoro')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeDockMode === 'pomodoro'
                  ? 'bg-antique-bright text-heritage-forest shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span>Pomodoro</span>
              {activeDockMode === 'pomodoro' && (
                <span className="font-mono text-[11px] bg-black/20 px-1.5 py-0.5 rounded">
                  {formatPomoTime(pomoSeconds)}
                </span>
              )}
            </button>

            {activeDockMode === 'pomodoro' && (
              <button
                type="button"
                onClick={onTogglePomo}
                className="px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-600 transition-all ml-1 cursor-pointer"
              >
                {isPomoRunning ? 'Pause' : 'Start'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBottomDock;
