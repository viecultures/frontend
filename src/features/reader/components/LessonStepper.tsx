import { BookOpen, CheckCircle2, ClipboardList, Headphones, Layers, Mic } from 'lucide-react';

export type LessonStep = 'read' | 'vocab' | 'dictation' | 'shadowing' | 'summary';

interface LessonStepperProps {
  active: LessonStep;
  completed: Partial<Record<LessonStep, boolean>>;
  unavailable: Partial<Record<LessonStep, boolean>>;
  onSelect: (step: LessonStep) => void;
}

const steps = [
  { id: 'read', label: 'Đọc', icon: BookOpen },
  { id: 'vocab', label: 'Ôn từ', icon: Layers },
  { id: 'dictation', label: 'Nghe chép', icon: Headphones },
  { id: 'shadowing', label: 'Luyện nói', icon: Mic },
  { id: 'summary', label: 'Tổng hợp', icon: ClipboardList },
] as const;

export function LessonStepper({ active, completed, unavailable, onSelect }: LessonStepperProps) {
  return (
    <nav className="lesson-stepper" aria-label="Các chặng học của bài">
      {steps.map(({ id, label, icon: Icon }, index) => {
        const disabled = unavailable[id] === true;
        const current = active === id;
        const done = completed[id] === true;
        return (
          <button
            key={id}
            type="button"
            className={`lesson-stepper-item${current ? ' is-active' : ''}${done ? ' is-complete' : ''}`}
            aria-current={current ? 'step' : undefined}
            disabled={disabled}
            title={disabled ? `${label}: bài này chưa có dữ liệu để luyện` : undefined}
            onClick={() => onSelect(id)}
          >
            {done ? <CheckCircle2 size={18} aria-hidden="true" /> : <Icon size={18} aria-hidden="true" />}
            <span>{index + 1}. {label}</span>
          </button>
        );
      })}
    </nav>
  );
}
