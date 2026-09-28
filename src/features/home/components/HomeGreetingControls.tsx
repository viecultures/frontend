import React from 'react';
import { Compass, BookOpen, BookMarked, Users } from 'lucide-react';

interface HomeGreetingControlsProps {
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening';
  setTimeOfDay: (time: 'Morning' | 'Afternoon' | 'Evening') => void;
  userName?: string;
  onNavigate: (view: string) => void;
}

export const HomeGreetingControls: React.FC<HomeGreetingControlsProps> = ({
  timeOfDay,
  setTimeOfDay,
  userName = 'Học Viên',
  onNavigate,
}) => {
  const getTimeLabel = (time: 'Morning' | 'Afternoon' | 'Evening') => {
    switch (time) {
      case 'Morning':
        return 'Buổi Sáng (Morning)';
      case 'Afternoon':
        return 'Buổi Trưa (Afternoon)';
      case 'Evening':
        return 'Buổi Tối (Evening)';
    }
  };

  const getBgLocation = (time: 'Morning' | 'Afternoon' | 'Evening') => {
    switch (time) {
      case 'Morning':
        return 'Bình minh Tràng An (Ninh Bình)';
      case 'Afternoon':
        return 'Nắng vàng Phố Cổ (Hội An)';
      case 'Evening':
        return 'Đêm Sài Gòn Hoa Lệ (TP. Hồ Chí Minh)';
    }
  };

  return (
    <div className="space-y-6">
      {/* Time Badge Pill & Manual Selectors */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/20 text-xs font-semibold text-antique-bright backdrop-blur-md shadow-md">
          <span className="w-2 h-2 rounded-full bg-antique-bright animate-ping" />
          <span>{getTimeLabel(timeOfDay)}</span>
        </div>

        {/* Manual Time Selector */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/15 backdrop-blur-md text-[11px] shadow-md">
          {(['Morning', 'Afternoon', 'Evening'] as const).map((time) => {
            const isActive = timeOfDay === time;
            const emoji = time === 'Morning' ? '🌅 Sáng' : time === 'Afternoon' ? '☀️ Trưa' : '🌙 Tối';
            return (
              <button
                key={time}
                type="button"
                onClick={() => setTimeOfDay(time)}
                className={`px-2.5 py-0.5 rounded-full transition-all font-medium cursor-pointer ${
                  isActive
                    ? 'bg-antique-bright text-heritage-forest font-bold shadow'
                    : 'text-white/70 hover:text-white'
                }`}
                title={`Đổi background ${emoji}`}
              >
                {emoji}
              </button>
            );
          })}
        </div>

        {/* Image Source Credit */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/15 text-[11px] text-white/70 backdrop-blur-md">
          <span>📷 {getBgLocation(timeOfDay)}</span>
        </div>
      </div>

      {/* User Greeting Header */}
      <div>
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
          {userName}
        </h1>
        <p className="text-sm sm:text-base text-white/90 mt-2 font-medium drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)]">
          Chào mừng trở lại — cùng khởi động nhanh nhé!
        </p>
      </div>

      {/* Quick Practice Shortcut Pills Row */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => onNavigate('discovery')}
          className="px-4 py-2.5 bg-heritage-forest/95 border border-white/25 hover:border-antique-bright hover:bg-antique-bright rounded-full text-xs sm:text-sm font-bold text-white/95 hover:text-heritage-forest transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(252,229,181,0.45)] hover:-translate-y-0.5 active:scale-95 group cursor-pointer"
        >
          <Compass className="w-4 h-4 text-amber-400 group-hover:text-heritage-forest group-hover:scale-110 transition-transform" />
          <span>Khám Phá Di Sản</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('bilingual-reader')}
          className="px-4 py-2.5 bg-heritage-forest/95 border border-white/25 hover:border-antique-bright hover:bg-antique-bright rounded-full text-xs sm:text-sm font-bold text-white/95 hover:text-heritage-forest transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(252,229,181,0.45)] hover:-translate-y-0.5 active:scale-95 group cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-sky-400 group-hover:text-heritage-forest group-hover:scale-110 transition-transform" />
          <span>Đọc Song Ngữ AI</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('dictionary')}
          className="px-4 py-2.5 bg-heritage-forest/95 border border-white/25 hover:border-antique-bright hover:bg-antique-bright rounded-full text-xs sm:text-sm font-bold text-white/95 hover:text-heritage-forest transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(252,229,181,0.45)] hover:-translate-y-0.5 active:scale-95 group cursor-pointer"
        >
          <BookMarked className="w-4 h-4 text-emerald-400 group-hover:text-heritage-forest group-hover:scale-110 transition-transform" />
          <span>Tủ Sách Từ Điển</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('community')}
          className="px-4 py-2.5 bg-heritage-forest/95 border border-white/25 hover:border-antique-bright hover:bg-antique-bright rounded-full text-xs sm:text-sm font-bold text-white/95 hover:text-heritage-forest transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(252,229,181,0.45)] hover:-translate-y-0.5 active:scale-95 group cursor-pointer"
        >
          <Users className="w-4 h-4 text-purple-400 group-hover:text-heritage-forest group-hover:scale-110 transition-transform" />
          <span>Cộng Đồng Học Tập</span>
        </button>
      </div>
    </div>
  );
};

export default HomeGreetingControls;
