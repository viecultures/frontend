import { Volume2, Shuffle, Mic, ChevronDown, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation('flashcards');

  return (
    <header className="vocab-study-heading">
      <Link to={PATHS.dictionary} className="vocab-back-link">
        <ArrowLeft size={15} />
        {t('header.back_to_vocabulary', 'Back to vocabulary')}
      </Link>
      <div className="vocab-study-title-row">
        <div className="vocab-study-title">
          <h1>{activeLesson.title}</h1>
          <span className="vocab-study-category">{t('header.flashcards_badge', 'Flashcards')}</span>
        </div>
        <div className="vocab-study-toolbar" aria-label={t('header.review_options', 'Review options')}>
          <button onClick={onToggleShuffle} aria-pressed={isShuffled} className="vocab-toolbar-button">
            <Shuffle size={15} />
            <span>{isShuffled ? t('header.shuffled', 'Shuffled') : t('header.shuffle', 'Shuffle')}</span>
          </button>
          <label className="vocab-auto-audio">
            <Volume2 size={15} />
            <span>{t('header.auto_audio', 'Auto audio')}</span>
            <input type="checkbox" checked={isAutoAudio} onChange={(e) => onToggleAutoAudio(e.target.checked)} />
            <span className="vocab-switch" aria-hidden="true" />
          </label>
          <div className="vocab-voice-select">
            <Mic size={15} />
            <select aria-label={t('header.voice_label', 'Pronunciation voice')} value={accentVoice} onChange={(e) => onChangeVoice(e.target.value as "en-US" | "en-GB")}>
              <option value="en-US">{t('header.voice_us', 'English (US)')}</option>
              <option value="en-GB">{t('header.voice_uk', 'English (UK)')}</option>
            </select>
            <ChevronDown size={12} />
          </div>
        </div>
      </div>
    </header>
  );
}
