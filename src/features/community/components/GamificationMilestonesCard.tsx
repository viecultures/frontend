import { Award, Coins, CheckCircle2, CircleDashed, PenTool, Heart, Flame, Medal } from "lucide-react";

export function GamificationMilestonesCard() {
  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E8E2D5] space-y-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between pb-2 border-b border-line">
        <h3 className="font-serif text-base font-bold text-heritage-green flex items-center gap-2">
          <Award className="w-4 h-4 text-antique-gold" />
          <span>Weekly coin missions</span>
        </h3>
        <span className="text-xs font-semibold text-text-secondary">Progress: 1/3</span>
      </div>

      <ul className="text-xs space-y-3.5">
        <li className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-heritage-green flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Submit one weekly entry</span>
            </span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <Coins className="w-3 h-3 text-antique-gold" />
              <span>+100 coins</span>
            </span>
          </div>
          <div className="w-full bg-line rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full w-full" />
          </div>
        </li>

        <li className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-heritage-green flex items-center gap-1.5">
              <CircleDashed className="w-4 h-4 text-antique-gold" />
              <span>Receive 10+ likes on an entry</span>
            </span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <Coins className="w-3 h-3 text-antique-gold" />
              <span>+150 coins</span>
            </span>
          </div>
          <div className="w-full bg-line rounded-full h-1.5 overflow-hidden">
            <div className="bg-antique-gold h-full rounded-full w-3/5" />
          </div>
        </li>

        <li className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-heritage-green flex items-center gap-1.5">
              <CircleDashed className="w-4 h-4 text-antique-gold" />
              <span>Join for four consecutive weeks</span>
            </span>
            <span className="font-bold text-amber-700 flex items-center gap-1">
              <Medal className="w-3 h-3 text-amber-600" />
              <span>+500 coins & badge</span>
            </span>
          </div>
          <div className="w-full bg-line rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-600 h-full rounded-full w-1/4" />
          </div>
        </li>
      </ul>
    </div>
  );
}
