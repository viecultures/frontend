import React from 'react';
import { Compass, BookOpen, BookMarked, Users } from 'lucide-react';

interface HomeGreetingControlsProps {
  userName?: string;
  onNavigate: (view: string) => void;
}

export const HomeGreetingControls: React.FC<HomeGreetingControlsProps> = ({
  userName = 'Học Viên',
  onNavigate,
}) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* User Greeting Header */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-ivory tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
          Chào {userName}
        </h1>
        <p className="text-xs sm:text-sm text-white/90 mt-1 font-medium drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)] max-w-xl leading-relaxed">
          Chào mừng trở lại phòng học di sản — sẵn sàng tiếp tục hành trình khám phá hôm nay nhé!
        </p>
      </div>

      {/* Quick Practice Shortcut Pills Row */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => onNavigate('discovery')}
          className="px-3.5 py-1.5 bg-heritage-dark/90 border border-antique-gold/40 hover:border-antique-gold hover:bg-antique-gold rounded-full text-xs font-bold text-warm-ivory hover:text-heritage-dark transition-all duration-200 flex items-center gap-1.5 shadow-md hover:shadow-[0_0_15px_rgba(217,183,106,0.35)] hover:-translate-y-0.5 active:scale-95 group cursor-pointer focus-ring"
        >
          <Compass className="w-3.5 h-3.5 text-antique-gold group-hover:text-heritage-dark group-hover:scale-110 transition-transform" />
          <span>Khám Phá Di Sản</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('bilingual-reader')}
          className="px-3.5 py-1.5 bg-heritage-dark/90 border border-antique-gold/40 hover:border-antique-gold hover:bg-antique-gold rounded-full text-xs font-bold text-warm-ivory hover:text-heritage-dark transition-all duration-200 flex items-center gap-1.5 shadow-md hover:shadow-[0_0_15px_rgba(217,183,106,0.35)] hover:-translate-y-0.5 active:scale-95 group cursor-pointer focus-ring"
        >
          <BookOpen className="w-3.5 h-3.5 text-antique-gold group-hover:text-heritage-dark group-hover:scale-110 transition-transform" />
          <span>Đọc Song Ngữ</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('dictionary')}
          className="px-3.5 py-1.5 bg-heritage-dark/90 border border-antique-gold/40 hover:border-antique-gold hover:bg-antique-gold rounded-full text-xs font-bold text-warm-ivory hover:text-heritage-dark transition-all duration-200 flex items-center gap-1.5 shadow-md hover:shadow-[0_0_15px_rgba(217,183,106,0.35)] hover:-translate-y-0.5 active:scale-95 group cursor-pointer focus-ring"
        >
          <BookMarked className="w-3.5 h-3.5 text-antique-gold group-hover:text-heritage-dark group-hover:scale-110 transition-transform" />
          <span>Kho Từ Vựng Flashcard</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('community-1')}
          className="px-3.5 py-1.5 bg-heritage-dark/90 border border-antique-gold/40 hover:border-antique-gold hover:bg-antique-gold rounded-full text-xs font-bold text-warm-ivory hover:text-heritage-dark transition-all duration-200 flex items-center gap-1.5 shadow-md hover:shadow-[0_0_15px_rgba(217,183,106,0.35)] hover:-translate-y-0.5 active:scale-95 group cursor-pointer focus-ring"
        >
          <Users className="w-3.5 h-3.5 text-antique-gold group-hover:text-heritage-dark group-hover:scale-110 transition-transform" />
          <span>Cộng Đồng Học Viên</span>
        </button>
      </div>
    </div>
  );
};

export default HomeGreetingControls;
