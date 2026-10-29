import { Volume2, Shuffle, Mic, ChevronDown, ArrowLeft } from "lucide-react";
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import type { Lesson } from "@/data/discoveryData";
import { PATHS } from '@/routes/paths';

interface FlashcardStudyHeaderProps {
  activeLesson: Lesson;
  isShuffled: boolean;
  onToggleShuffle: () => void;
  isAutoAudio: boolean;
  onToggleAutoAudio: (enabled: boolean) => void;
  accentVoice: "en-US" | "en-GB";
  onChangeVoice: (voice: "en-US" | "en-GB") => void;
}

export function FlashcardStudyHeader({ activeLesson, isShuffled, onToggleShuffle, isAutoAudio, onToggleAutoAudio, accentVoice, onChangeVoice }: FlashcardStudyHeaderProps) {
  return (
    <header className="vocab-study-heading">
      <Link to={PATHS.dictionary} className="vocab-back-link"><ArrowLeft size={15} />Back to vocabulary</Link>
      <div className="vocab-study-title-row">
        <div className="vocab-study-title"><h1>{activeLesson.title}</h1><span className="vocab-study-category">Flashcards</span></div>
        <div className="vocab-study-toolbar" aria-label="Review options">
          <button onClick={onToggleShuffle} aria-pressed={isShuffled} className="vocab-toolbar-button"><Shuffle size={15} /><span>{isShuffled ? "Shuffled" : "Shuffle"}</span></button>
          <label className="vocab-auto-audio"><Volume2 size={15} /><span>Auto audio</span><input type="checkbox" checked={isAutoAudio} onChange={(e) => onToggleAutoAudio(e.target.checked)} /><span className="vocab-switch" aria-hidden="true" /></label>
          <div className="vocab-voice-select"><Mic size={15} /><select aria-label="Pronunciation voice" value={accentVoice} onChange={(e) => onChangeVoice(e.target.value as "en-US" | "en-GB")}><option value="en-US">English (US)</option><option value="en-GB">English (UK)</option></select><ChevronDown size={12} /></div>
        </div>
      </div>
    </header>
  );
}
