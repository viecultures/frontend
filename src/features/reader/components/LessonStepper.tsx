import { BookOpen, CheckCircle2, ClipboardList, Headphones, Layers, Mic } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type LessonStep = 'read' | 'vocab' | 'dictation' | 'shadowing' | 'summary';

interface LessonStepperProps {
  active: LessonStep | null;
  completed: Partial<Record<LessonStep, boolean>>;
  unavailable: Partial<Record<LessonStep, boolean>>;
  onSelect: (step: LessonStep) => void;
}

const steps = [
  { id: 'read', labelKey: 'read', icon: BookOpen },
  { id: 'vocab', labelKey: 'vocab', icon: Layers },
  { id: 'dictation', labelKey: 'dictation', icon: Headphones },
  { id: 'shadowing', labelKey: 'shadowing', icon: Mic },
  { id: 'summary', labelKey: 'results', icon: ClipboardList },
] as const;

export function LessonStepper({ active, completed, unavailable, onSelect }: LessonStepperProps) {
  const { t } = useTranslation('reader');
  return (
    <nav className="lesson-stepper" aria-label={t('journey.activity_nav')}>
      <span className="lesson-stepper-label">{t('journey.activity_nav')}</span>
      {steps.map(({ id, labelKey, icon: Icon }) => {
        const label = t(`journey.${labelKey}`);
        const disabled = unavailable[id] === true;
        const current = active === id;
        const done = completed[id] === true;
        return (
          <button
            key={id}
            type="button"
            className={`lesson-stepper-item${current ? ' is-active' : ''}${done ? ' is-complete' : ''}${id === 'summary' ? ' is-summary' : ''}`}
            aria-current={current ? 'page' : undefined}
            disabled={disabled}
            title={disabled ? t('journey.unavailable', { activity: label }) : undefined}
            onClick={() => onSelect(id)}
          >
            {done ? <CheckCircle2 size={18} aria-hidden="true" /> : <Icon size={18} aria-hidden="true" />}
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
