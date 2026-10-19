import { Layers, Target, PenTool } from "lucide-react";

export type PlayerMode = "flip" | "mc" | "spelling";
interface FlashcardModeTabsProps {
  playerMode: PlayerMode;
  onChangeMode: (mode: PlayerMode) => void;
}
const modes = [
  { id: "flip", label: "Flip cards", icon: Layers },
  { id: "mc", label: "Quiz", icon: Target },
  { id: "spelling", label: "Spelling", icon: PenTool },
] as const;

export function FlashcardModeTabs({ playerMode, onChangeMode }: FlashcardModeTabsProps) {
  return <div className="vocab-mode-tabs" role="group" aria-label="Study mode">{modes.map(({ id, label, icon: Icon }) => <button key={id} aria-pressed={playerMode === id} onClick={() => onChangeMode(id)}><Icon size={16} /><span>{label}</span></button>)}</div>;
}
