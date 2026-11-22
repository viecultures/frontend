import type { RefObject } from "react";
import { ArrowRight, BookOpen, Bot, Headphones, Mic2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LocalizedLink as Link } from "@/components/common/LocalizedLink";
import { paths } from "@/routes/paths";
import type { JourneyChapterSelection } from "./JourneyChapterPopover";

interface JourneySkillDialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  chapter: JourneyChapterSelection | null;
  onClose: () => void;
}

export function JourneySkillDialog({ dialogRef, chapter, onClose }: JourneySkillDialogProps) {
  const { t } = useTranslation("discovery");

  return (
    <dialog
      ref={dialogRef}
      className="journey-skill-dialog"
      aria-labelledby="journey-skill-title"
      onClose={onClose}
    >
      {chapter && (
        <>
          <div className="journey-skill-header">
            <div>
              <span className="journey-eyebrow">{chapter.seriesTitle}</span>
              <h2 id="journey-skill-title">{chapter.title}</h2>
              <p>{t("journey.dialog_question")}</p>
            </div>
            <button
              type="button"
              className="journey-skill-close"
              aria-label={t("journey.dialog_close")}
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
          <div className="journey-skill-options">
            <Link to={paths.reader({ story: chapter.id, level: chapter.level })}>
              <BookOpen size={24} aria-hidden="true" />
              <span>
                <strong>{t("journey.skill_reading_title")}</strong>
                <small>{t("journey.skill_reading_desc")}</small>
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              to={paths.reader({
                story: chapter.id,
                level: chapter.level,
                mode: "practice",
                practice: "dictation",
              })}
            >
              <Headphones size={24} aria-hidden="true" />
              <span>
                <strong>{t("journey.skill_listening_title")}</strong>
                <small>{t("journey.skill_listening_desc")}</small>
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <div className="journey-skill-speaking" aria-label={t("journey.skill_speaking_heading")}>
              <h3>{t("journey.skill_speaking_heading")}</h3>
              <p>{t("journey.skill_speaking_prompt")}</p>
              <Link
                to={paths.reader({
                  story: chapter.id,
                  level: chapter.level,
                  mode: "practice",
                  practice: "shadowing",
                })}
              >
                <Mic2 size={24} aria-hidden="true" />
                <span>
                  <strong>{t("journey.skill_shadowing_title")}</strong>
                  <small>{t("journey.skill_shadowing_desc")}</small>
                </span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link to={paths.aiWorkspace({ story: chapter.id, level: chapter.level })}>
                <Bot size={24} aria-hidden="true" />
                <span>
                  <strong>{t("journey.skill_ai_title")}</strong>
                  <small>{t("journey.skill_ai_desc")}</small>
                </span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}
