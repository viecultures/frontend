import React, { useState, useEffect } from 'react';
import { Clock, Flame, Play, Pause, RotateCcw } from 'lucide-react';

interface HomeBottomDockProps {
  activeDockMode: 'study' | 'pomodoro';
  onSelectDockMode: (mode: 'study' | 'pomodoro') => void;
  pomoSeconds: number;
  isPomoRunning: boolean;
  onTogglePomo: () => void;
  onResetPomo?: () => void;
}

// Calculate remaining time until next midnight (00:00:00) in GMT+7 (Asia/Ho_Chi_Minh)
function getDailyChallengeCountdownGMT7(): string {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const vnNow = new Date(utcMs + 7 * 60 * 60 * 1000);

  const vnMidnight = new Date(vnNow);
  vnMidnight.setHours(24, 0, 0, 0);

  const diffMs = Math.max(0, vnMidnight.getTime() - vnNow.getTime());
  const totalSec = Math.floor(diffMs / 1000);

  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export const HomeBottomDock: React.FC<HomeBottomDockProps> = ({
  activeDockMode,
  onSelectDockMode,
  pomoSeconds,
  isPomoRunning,
  onTogglePomo,
  onResetPomo,
}) => {
  const [dailyCountdown, setDailyCountdown] = useState<string>(() => getDailyChallengeCountdownGMT7());

  // Real-time ticker for Daily Challenge countdown (resets at 00:00 GMT+7)
  useEffect(() => {
    const timer = setInterval(() => {
      setDailyCountdown(getDailyChallengeCountdownGMT7());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatPomoTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="home-classic-dock max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6 relative z-10">
      <div className="flex items-center gap-3">
        {/* Unified Floating Bottom Control Dock Container */}
        <div className="home-dock-surface flex flex-wrap items-center gap-2 sm:gap-3 backdrop-blur-xl p-2 w-full sm:w-auto">
          {/* Streak Sub-card */}
          <div className="home-dock-stat flex items-center gap-2.5 px-3.5 py-1.5">
            <div className="home-dock-icon p-1 text-antique-bright">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="home-dock-label">Study streak</div>
              <div className="home-dock-detail">2 consecutive days</div>
            </div>
          </div>

          {/* Daily Challenge Sub-card */}
          <div
            className="home-dock-stat flex items-center gap-2.5 px-3.5 py-1.5"
            title="Daily challenge refreshes at midnight (GMT+7)"
          >
            <div className="home-dock-icon p-1">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="home-dock-label">Daily challenge</div>
              <div className="home-dock-detail flex items-center gap-2">
                <span>Time left</span>
                <span className="home-dock-countdown tabular-nums">
                  {dailyCountdown}
                </span>
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block w-px h-7 bg-white/15 mx-0.5" />

          {/* Mode Switcher Dock (Study / Pomodoro) */}
          <div className="home-dock-modes flex flex-wrap items-center gap-1.5 p-1">
            <button
              type="button"
              onClick={() => onSelectDockMode('study')}
              aria-pressed={activeDockMode === 'study'}
              className={`home-dock-mode px-3.5 py-1.5 transition-colors cursor-pointer focus-ring ${
                activeDockMode === 'study'
                  ? 'home-dock-mode-active'
                  : 'home-dock-mode-idle'
              }`}
            >
              Study Mode
            </button>

            <button
              type="button"
              onClick={() => onSelectDockMode('pomodoro')}
              aria-pressed={activeDockMode === 'pomodoro'}
              className={`home-dock-mode px-3.5 py-1.5 transition-colors flex items-center gap-1.5 cursor-pointer focus-ring ${
                activeDockMode === 'pomodoro'
                  ? 'home-dock-mode-active'
                  : 'home-dock-mode-idle'
              }`}
            >
              <span>Pomodoro</span>
              {activeDockMode === 'pomodoro' && (
                <span className="home-dock-timer tabular-nums">
                  {formatPomoTime(pomoSeconds)}
                </span>
              )}
            </button>

            {activeDockMode === 'pomodoro' && (
              <div className="flex items-center gap-1 ml-1">
                <button
                  type="button"
                  onClick={onTogglePomo}
                  className="home-dock-timer-action px-2.5 py-1 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {isPomoRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isPomoRunning ? 'Pause' : 'Start'}</span>
                </button>

                {onResetPomo && (
                  <button
                    type="button"
                    onClick={onResetPomo}
                    className="home-dock-reset p-1 transition-colors cursor-pointer"
                    aria-label="Reset to 25 minutes"
                    title="Reset to 25 minutes"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBottomDock;
