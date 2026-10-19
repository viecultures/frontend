import React, { useEffect } from 'react';
import { ArrowRight, Check, Lock } from 'lucide-react';
import { useLiveAPIContext } from '../contexts/LiveAPIContext';
import { useSettings } from '../lib/state';
import { buildAiMapLessonPayload } from '../lib/lesson-payload';
import { useAiMapLessonStore } from '../lib/lesson-state';
import type { AiMapLessonStep } from '../types';

const steps: { id: AiMapLessonStep; label: string }[] = [
  { id: 'explore', label: 'Explore' },
  { id: 'listen', label: 'Listen' },
  { id: 'speak', label: 'Speak' },
  { id: 'quiz', label: 'Quiz' },
];

export default function AiMapLessonProgressBar() {
  const { tutorMode, activeLessonId, proficiencyLevel } = useSettings();
  const { activeView, connecting, ending, isSending, isRestoringContext, sendControlInstruction } = useLiveAPIContext();
  const { session, payload, startLesson, completeStep } = useAiMapLessonStore();

  useEffect(() => {
    if (activeView !== 'chat' || tutorMode !== 'guided-lesson') return;
    const next = buildAiMapLessonPayload(activeLessonId, proficiencyLevel);
    if (next) startLesson(next);
  }, [activeView, activeLessonId, proficiencyLevel, startLesson, tutorMode]);

  if (activeView !== 'chat' || tutorMode !== 'guided-lesson' || !session || !payload) return null;

  const canOpen = (step: AiMapLessonStep) => {
    const index = steps.findIndex(item => item.id === step);
    return steps.slice(0, index).every(item => session.completedSteps.includes(item.id));
  };

  const continueWithAgent = async () => {
    if (activeView !== 'chat' || connecting || ending || isSending || isRestoringContext) return;
    const prompts: Record<AiMapLessonStep, string> = {
      explore: `Start the guided lesson about ${payload.title}. Briefly introduce the cultural context and ask me one simple opening question.`,
      listen: `Continue the guided lesson with the listening step. Read a short passage about ${payload.title}, then ask one comprehension question.`,
      speak: `Continue the guided lesson with the speaking step. Ask me to describe or compare something about ${payload.title}.`,
      quiz: `Continue the guided lesson with a short quiz about ${payload.title}. Ask one question at a time and wait for my answer.`,
      complete: 'Summarize my guided lesson progress and congratulate me.',
    };
    const requestedStep = session.currentStep;
    const result = await sendControlInstruction(prompts[requestedStep]);
    if (result.status === 'ok' && requestedStep !== 'complete' && requestedStep !== 'quiz') completeStep(requestedStep);
  };

  const completedCount = session.completedSteps.filter(step => step !== 'complete').length;
  return <div className="flex-shrink-0 border-b border-white/10 bg-[#10191a] px-3 py-2">
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-300">Guided lesson · {completedCount}/4</p><p className="truncate text-xs text-slate-300">{payload.title}</p></div>
      <button disabled={connecting || ending || isSending || isRestoringContext} onClick={continueWithAgent} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-cyan-400 px-2.5 py-1.5 text-[11px] font-semibold text-slate-950"><span>Continue practice</span><ArrowRight size={12} /></button>
    </div>
    <div className="mt-2 grid grid-cols-4 gap-1">
      {steps.map(step => { const done = session.completedSteps.includes(step.id); const unlocked = canOpen(step.id); const current = session.currentStep === step.id; return <div key={step.id} className={`flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] ${current ? 'bg-cyan-400/15 text-cyan-200' : done ? 'bg-emerald-400/10 text-emerald-300' : 'bg-white/5 text-slate-500'}`}>{done ? <Check size={11} /> : unlocked ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : <Lock size={10} />}<span className="truncate">{step.label}</span></div>; })}
    </div>
  </div>;
}
