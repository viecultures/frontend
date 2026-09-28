import { Volume2, Shuffle, Mic, ChevronRight } from "lucide-react";
import type { Lesson } from "@/data/discoveryData";

interface FlashcardStudyHeaderProps {
  activeLesson: Lesson;
  isShuffled: boolean;
  onToggleShuffle: () => void;
  isAutoAudio: boolean;
  onToggleAutoAudio: (enabled: boolean) => void;
  accentVoice: "en-US" | "en-GB";
  onChangeVoice: (voice: "en-US" | "en-GB") => void;
}

export function FlashcardStudyHeader({
  activeLesson,
  isShuffled,
  onToggleShuffle,
  isAutoAudio,
  onToggleAutoAudio,
  accentVoice,
  onChangeVoice,
}: FlashcardStudyHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-[rgba(30,75,67,0.12)] w-full">
      {/* Left Title Section */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="min-w-0 flex-1">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7E79]">
            ĐANG HỌC • BỘ THẺ
          </span>
          <h1 className="font-serif text-lg sm:text-xl font-bold text-[#1E4B43] truncate flex items-center gap-2">
            <span className="truncate">{activeLesson.title}</span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#059669]/20 font-sans shadow-2xs shrink-0 whitespace-nowrap">
              {activeLesson.categoryVi}
            </span>
          </h1>
        </div>
      </div>

      {/* Right Action Controls Toolbar */}
      <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
        {/* 1. Trộn thẻ */}
        <button
          onClick={onToggleShuffle}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer shadow-2xs ${
            isShuffled
              ? "bg-[#1E4B43] text-[#FBF7EE] border-[#1E4B43]"
              : "bg-white text-[#1E4B43] border-[rgba(30,75,67,0.2)] hover:bg-[#F6EEDC]"
          }`}
        >
          <Shuffle className="w-3.5 h-3.5 text-[#059669]" />
          <span>{isShuffled ? "Đã trộn" : "Trộn thẻ"}</span>
        </button>

        {/* 2. Tự động phát âm toggle */}
        <label className="px-3.5 py-1.5 rounded-full bg-white border border-[rgba(30,75,67,0.2)] text-xs font-semibold text-[#1E4B43] flex items-center gap-2 cursor-pointer shadow-2xs hover:bg-[#F6EEDC] transition-all select-none">
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-[#059669]" />
            <span>Tự động phát âm</span>
          </div>
          <input
            type="checkbox"
            checked={isAutoAudio}
            onChange={(e) => onToggleAutoAudio(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-7 h-4 flex items-center rounded-full p-0.5 transition-colors ${
              isAutoAudio ? "bg-[#059669]" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-3 h-3 rounded-full shadow-xs transform transition-transform ${
                isAutoAudio ? "translate-x-3" : "translate-x-0"
              }`}
            />
          </div>
        </label>

        {/* 3. Giọng đọc (US / UK Dropdown) */}
        <div className="relative inline-flex items-center">
          <Mic className="w-3.5 h-3.5 absolute left-3 text-[#059669] pointer-events-none" />
          <select
            value={accentVoice}
            onChange={(e) => onChangeVoice(e.target.value as "en-US" | "en-GB")}
            className="pl-8 pr-7 py-1.5 rounded-full bg-white border border-[rgba(30,75,67,0.2)] text-xs font-semibold text-[#1E4B43] shadow-2xs focus:outline-none cursor-pointer appearance-none hover:bg-[#F6EEDC] transition-all"
          >
            <option value="en-US">Giọng Anh (US)</option>
            <option value="en-GB">Giọng Anh (UK)</option>
          </select>
          <ChevronRight className="w-3 h-3 rotate-90 absolute right-2.5 text-[#1E4B43] pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
