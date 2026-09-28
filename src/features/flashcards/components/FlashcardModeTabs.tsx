import { Layers, Target, PenTool } from "lucide-react";

export type PlayerMode = "flip" | "mc" | "spelling";

interface FlashcardModeTabsProps {
  playerMode: PlayerMode;
  onChangeMode: (mode: PlayerMode) => void;
}

export function FlashcardModeTabs({
  playerMode,
  onChangeMode,
}: FlashcardModeTabsProps) {
  return (
    <div className="p-1.5 bg-white border border-[rgba(30,75,67,0.15)] rounded-2xl shadow-xs flex items-center justify-center gap-1 sm:gap-2 max-w-lg mx-auto w-full">
      <button
        onClick={() => onChangeMode("flip")}
        className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
          playerMode === "flip"
            ? "bg-[#1E4B43] text-white shadow-xs"
            : "text-[#1E4B43] hover:bg-[#F6EEDC]/60"
        }`}
      >
        <Layers
          className={`w-4 h-4 ${
            playerMode === "flip" ? "text-[#D9B76A]" : "text-[#1E4B43]"
          }`}
        />
        <span>Lật Thẻ 3D</span>
      </button>

      <button
        onClick={() => onChangeMode("mc")}
        className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
          playerMode === "mc"
            ? "bg-[#1E4B43] text-white shadow-xs"
            : "text-[#1E4B43] hover:bg-[#F6EEDC]/60"
        }`}
      >
        <Target
          className={`w-4 h-4 ${
            playerMode === "mc" ? "text-[#D9B76A]" : "text-[#1E4B43]"
          }`}
        />
        <span>Trắc Nghiệm</span>
      </button>

      <button
        onClick={() => onChangeMode("spelling")}
        className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
          playerMode === "spelling"
            ? "bg-[#1E4B43] text-white shadow-xs"
            : "text-[#1E4B43] hover:bg-[#F6EEDC]/60"
        }`}
      >
        <PenTool
          className={`w-4 h-4 ${
            playerMode === "spelling" ? "text-[#D9B76A]" : "text-[#1E4B43]"
          }`}
        />
        <span>Gõ Từ</span>
      </button>
    </div>
  );
}
