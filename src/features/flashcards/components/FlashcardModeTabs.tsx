import { Layers, Target, PenTool } from "lucide-react";

export type PlayerMode = "flip" | "mc" | "spelling";
interface FlashcardModeTabsProps {
  playerMode: PlayerMode;
  onChangeMode: (mode: PlayerMode) => void;
}
const modes = [
  { id: "flip", label: "Lật thẻ", icon: Layers },
  { id: "mc", label: "Trắc nghiệm", icon: Target },
  { id: "spelling", label: "Gõ từ", icon: PenTool },
] as const;

export function FlashcardModeTabs({ playerMode, onChangeMode }: FlashcardModeTabsProps) {
  return <div className="vocab-mode-tabs" role="group" aria-label="Chế độ học">{modes.map(({ id, label, icon: Icon }) => <button key={id} aria-pressed={playerMode === id} onClick={() => onChangeMode(id)}><Icon size={16} /><span>{label}</span></button>)}</div>;
}
