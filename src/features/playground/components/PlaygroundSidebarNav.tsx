import {
  ChevronUp,
  ChevronDown,
  Headphones,
  Mic,
  Box,
  Compass,
  Feather,
  Radio,
  Zap
} from 'lucide-react';
import { PLAYGROUND_SCREENS } from '../types';

interface PlaygroundSidebarNavProps {
  currentScreenIndex: number;
  onSelectScreen: (index: number) => void;
}

export const PlaygroundSidebarNav: React.FC<PlaygroundSidebarNavProps> = ({
  currentScreenIndex,
  onSelectScreen
}) => {
  const getIcon = (iconName: string, active: boolean) => {
    const props = { className: `w-4 h-4 ${active ? 'text-[#D4AF37]' : 'text-[#5D706A] group-hover:text-white'}` };
    switch (iconName) {
      case 'Headphones': return <Headphones {...props} />;
      case 'Mic': return <Mic {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'Box': return <Box {...props} />;
      case 'Feather': return <Feather {...props} />;
      case 'Radio': return <Radio {...props} />;
      case 'Zap': return <Zap {...props} />;
      default: return null;
    }
  };

  const handlePrev = () => {
    if (currentScreenIndex > 0) {
      onSelectScreen(currentScreenIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentScreenIndex < PLAYGROUND_SCREENS.length - 1) {
      onSelectScreen(currentScreenIndex + 1);
    }
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3">
      {/* Up Button */}
      <button
        onClick={handlePrev}
        disabled={currentScreenIndex === 0}
        className="w-8 h-8 rounded-full bg-[#1E2925]/80 backdrop-blur-md border border-[#D4AF37]/30 text-white/70 hover:text-white hover:bg-[#1E4B43] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer shadow-lg"
        title="Màn hình trước (Phím ↑)"
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      {/* Screen Dots & Tooltip List */}
      <div className="bg-[#1E2925]/90 backdrop-blur-md p-2 rounded-2xl border border-[#D4AF37]/30 shadow-2xl flex flex-col gap-2">
        {PLAYGROUND_SCREENS.map((screen, idx) => {
          const isActive = currentScreenIndex === idx;
          return (
            <div key={screen.id} className="relative group flex items-center justify-center">
              <button
                onClick={() => onSelectScreen(idx)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1E4B43] border border-[#D4AF37] scale-110 shadow-md'
                    : 'hover:bg-white/10'
                }`}
              >
                {getIcon(screen.iconName, isActive)}
              </button>

              {/* Tooltip Card on Hover */}
              <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col w-56 p-3 bg-[#1E2925] border border-[#D4AF37]/40 rounded-xl shadow-2xl pointer-events-none z-50 text-left transition-all animate-in fade-in slide-in-from-right-2">
                <div className="flex items-center justify-between text-[10px] text-[#D4AF37] font-mono mb-1">
                  <span>MÀN HÌNH #{screen.number}</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    {screen.status}
                  </span>
                </div>
                <div className="font-serif font-bold text-xs text-[#FBF7EE]">
                  {screen.title}
                </div>
                <p className="text-[11px] text-[#9FB1AA] mt-1 leading-snug">
                  {screen.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Down Button */}
      <button
        onClick={handleNext}
        disabled={currentScreenIndex === PLAYGROUND_SCREENS.length - 1}
        className="w-8 h-8 rounded-full bg-[#1E2925]/80 backdrop-blur-md border border-[#D4AF37]/30 text-white/70 hover:text-white hover:bg-[#1E4B43] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer shadow-lg"
        title="Màn hình tiếp theo (Phím ↓)"
      >
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Keyboard Shortcut Indicator */}
      <div className="text-[9px] font-mono text-[#D4AF37] bg-black/50 px-2 py-0.5 rounded-full border border-white/10 opacity-70">
        Phím 1 - 5
      </div>
    </div>
  );
};
