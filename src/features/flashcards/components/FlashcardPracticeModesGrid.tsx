import { Target, Headphones, Sparkles, Flame, Trophy } from "lucide-react";
import type { PlayerMode } from "./FlashcardModeTabs";

interface FlashcardPracticeModesGridProps {
  playerMode: PlayerMode;
  onSelectQuiz: () => void;
  onSelectListening: () => void;
}

export function FlashcardPracticeModesGrid({
  playerMode,
  onSelectQuiz,
  onSelectListening,
}: FlashcardPracticeModesGridProps) {
  return (
    <div className="pt-8 space-y-4 border-t border-line">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-antique-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-heritage-green">
              CHẾ ĐỘ LUYỆN TẬP BỔ TRỢ
            </span>
          </div>
          <span className="text-[11px] text-text-secondary font-medium">
            Chọn hình thức để tối ưu khả năng ghi nhớ dài hạn
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* 1. Quiz */}
          <div
            onClick={onSelectQuiz}
            role="button"
            tabIndex={0}
            className={`p-5 rounded-3xl text-white space-y-3 shadow-md cursor-pointer transition-all hover:scale-[1.03] hover:shadow-xl flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#E67E22] via-[#D35400] to-[#B94A00] border border-amber-300/40 focus-ring ${
              playerMode === "mc" ? "ring-4 ring-antique-gold scale-[1.02]" : ""
            }`}
          >
            <div className="w-11 h-11 rounded-2xl bg-white/95 text-[#D35400] flex items-center justify-center shadow-sm">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base">Quiz 4 Lựa Chọn</h4>
              <p className="text-[11px] text-amber-100 font-medium">
                Phản xạ nghĩa từ tốc độ
              </p>
            </div>
          </div>

          {/* 2. Listening */}
          <div
            onClick={onSelectListening}
            role="button"
            tabIndex={0}
            className={`p-5 rounded-3xl text-white space-y-3 shadow-md cursor-pointer transition-all hover:scale-[1.03] hover:shadow-xl flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 border border-emerald-300/40 focus-ring ${
              playerMode === "spelling" ? "ring-4 ring-antique-gold scale-[1.02]" : ""
            }`}
          >
            <div className="w-11 h-11 rounded-2xl bg-white/95 text-emerald-800 flex items-center justify-center shadow-sm">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base">Listening & Spelling</h4>
              <p className="text-[11px] text-emerald-100 font-medium">
                Nghe và gõ lại chuẩn xác
              </p>
            </div>
          </div>

          {/* 3. Spaced Repetition */}
          <div className="p-5 rounded-3xl text-white space-y-3 shadow-md flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-800 to-indigo-950 border border-indigo-300/30">
            <div className="w-11 h-11 rounded-2xl bg-white/95 text-indigo-800 flex items-center justify-center shadow-sm">
              <Flame className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base">Thuật Toán SRS</h4>
              <p className="text-[11px] text-indigo-100 font-medium">
                Tự động giãn cách ôn tập
              </p>
            </div>
          </div>

          {/* 4. Gamification Reward */}
          <div className="p-5 rounded-3xl text-white space-y-3 shadow-md flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#1E4B43] via-[#2A665B] to-[#163D37] border border-antique-gold/50">
            <div className="w-11 h-11 rounded-2xl bg-antique-gold text-heritage-dark flex items-center justify-center shadow-sm">
              <Trophy className="w-6 h-6 text-heritage-dark" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base">Tích Xu Học Tập</h4>
              <p className="text-[11px] text-sky-mist font-medium">
                Nhận Xu Văn Hóa khi hoàn thành
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
