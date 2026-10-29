import { Layers, Target, PenTool } from "lucide-react";
import { useTranslation } from "react-i18next";

export type PlayerMode = "flip" | "mc" | "spelling";
interface FlashcardModeTabsProps {
  playerMode: PlayerMode;
  onChangeMode: (mode: PlayerMode) => void;
}

export function FlashcardModeTabs({ playerMode, onChangeMode }: FlashcardModeTabsProps) {
  const { t } = useTranslation('flashcards');

  const modes = [
    { id: "flip", label: t('modes.flip', 'Flip cards'), icon: Layers },
    { id: "mc", label: t('modes.quiz', 'Quiz'), icon: Target },
    { id: "spelling", label: t('modes.spelling', 'Spelling'), icon: PenTool },
  ] as const;

  return (
    <div className="vocab-mode-tabs" role="group" aria-label={t('modes.study_mode_aria', 'Study mode')}>
      {modes.map(({ id, label, icon: Icon }) => (
        <button key={id} aria-pressed={playerMode === id} onClick={() => onChangeMode(id)}>
          <Icon size={16} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
