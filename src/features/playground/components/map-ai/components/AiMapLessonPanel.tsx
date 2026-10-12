import React, { useEffect, useMemo, useState } from 'react';
import { Check, Lock, RotateCcw, ArrowRight, BookOpen, Headphones, Mic, Trophy } from 'lucide-react';
import { useSettings } from '../lib/state';
import { buildAiMapLessonPayload } from '../lib/lesson-payload';
import { useAiMapLessonStore } from '../lib/lesson-state';
import type { AiMapLessonStep } from '../types';
import { useGamification } from '@/context/GamificationContext';

const steps: { id: AiMapLessonStep; label: string; icon: React.ElementType }[] = [
  { id: 'explore', label: 'Khám phá', icon: BookOpen },
  { id: 'listen', label: 'Lắng nghe', icon: Headphones },
  { id: 'speak', label: 'Luyện nói', icon: Mic },
  { id: 'quiz', label: 'Kiểm tra', icon: Trophy },
];

export default function AiMapLessonPanel({ onSpeakText }: { onSpeakText?: (text: string) => void }) {
  const { activeLessonId, proficiencyLevel } = useSettings();
  const { session, payload, startLesson, completeStep, setQuizScore, markVocabulary, grantReward, resetLesson } = useAiMapLessonStore();
  const { earnReward } = useGamification();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const next = buildAiMapLessonPayload(activeLessonId, proficiencyLevel);
    if (next) startLesson(next);
  }, [activeLessonId, proficiencyLevel, startLesson]);

  const active = payload?.lessonId === activeLessonId ? payload : null;
  const current = session?.currentStep || 'explore';
  const quizResult = session?.quizScore;
  const canOpen = (step: AiMapLessonStep) => {
    if (!session) return false;
    const index = steps.findIndex(item => item.id === step);
    return steps.slice(0, index).every(item => session.completedSteps.includes(item.id));
  };
  const progress = useMemo(() => session ? Math.round((session.completedSteps.filter(step => step !== 'complete').length / 4) * 100) : 0, [session]);

  if (!active || !session) return null;

  const submitQuiz = () => {
    const correctAnswers = active.comprehensionQuestions.filter(question => answers[question.id] === question.correctOptionId).length;
    const result = { totalQuestions: active.comprehensionQuestions.length, correctAnswers, score: Math.round((correctAnswers / active.comprehensionQuestions.length) * 100), passed: correctAnswers / active.comprehensionQuestions.length >= 0.6 };
    setQuizScore(result); setSubmitted(true);
    if (result.passed) { markVocabulary(active.vocabulary.map(item => item.word)); if (!session.rewardGranted) { earnReward('READER_QUIZ_COMPLETED', { isPerfect: result.score === 100, title: 'Hoàn thành bài học AI Map', description: active.title }); grantReward(); } }
  };

  const handleNext = () => { if (current === 'explore' || current === 'listen' || current === 'speak') completeStep(current); };
  const stepIndex = steps.findIndex(item => item.id === current);

  return <section className="mb-3 rounded-2xl border border-cyan-400/20 bg-slate-950/90 p-4 text-slate-100 shadow-xl">
    <div className="mb-3 flex items-start justify-between gap-3">
      <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">Learning loop · {progress}%</p><h2 className="mt-1 text-base font-semibold">{active.vietnameseTitle}</h2><p className="text-xs text-slate-400">{active.title} · {active.durationMinutes} phút · {active.level}</p></div>
      <button onClick={resetLesson} className="rounded-lg p-2 text-slate-400 hover:bg-white/10" title="Bắt đầu lại"><RotateCcw size={15} /></button>
    </div>
    <div className="mb-4 grid grid-cols-4 gap-1">
      {steps.map((step, index) => { const Icon = step.icon; const done = session.completedSteps.includes(step.id); const locked = !canOpen(step.id); const selected = current === step.id; return <button key={step.id} disabled={locked} onClick={() => !locked && useAiMapLessonStore.setState({ session: { ...session, currentStep: step.id } })} className={`rounded-lg p-2 text-left text-[10px] ${selected ? 'bg-cyan-400/20 text-cyan-200' : done ? 'bg-emerald-400/10 text-emerald-300' : locked ? 'bg-white/5 text-slate-600' : 'bg-white/5 text-slate-300'}`}><div className="flex items-center justify-between"><span>0{index + 1}</span>{done ? <Check size={12} /> : locked ? <Lock size={11} /> : <Icon size={12} />}</div><span className="mt-1 block">{step.label}</span></button>; })}
    </div>
    {current === 'explore' && <div><p className="text-sm leading-6 text-slate-300">{active.summaryVi}</p><p className="mt-2 text-xs leading-5 text-slate-400">{active.summaryEn}</p><button onClick={handleNext} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950">Bắt đầu lắng nghe <ArrowRight size={14} /></button></div>}
    {current === 'listen' && <div><p className="mb-2 text-xs text-slate-400">Đọc hoặc nghe các prompt sau, sau đó tự tóm tắt lại ý chính.</p><div className="space-y-2">{active.listeningPrompts.slice(0, 3).map(prompt => <button key={prompt} onClick={() => onSpeakText?.(prompt)} className="block w-full rounded-lg bg-white/5 p-2 text-left text-xs text-slate-200 hover:bg-white/10">{prompt}</button>)}</div><button onClick={handleNext} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950">Đã hoàn thành nghe <ArrowRight size={14} /></button></div>}
    {current === 'speak' && <div><p className="mb-2 text-xs text-slate-400">Luyện nói bằng Gemini Live hoặc bấm từng prompt để nghe mẫu.</p><div className="space-y-2">{active.speakingPrompts.slice(0, 3).map(prompt => <button key={prompt} onClick={() => onSpeakText?.(prompt)} className="block w-full rounded-lg bg-white/5 p-2 text-left text-xs text-slate-200 hover:bg-white/10">{prompt}</button>)}</div><button onClick={handleNext} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950">Mở bài kiểm tra <ArrowRight size={14} /></button></div>}
    {current === 'quiz' && <div><p className="mb-3 text-xs text-slate-400">Đạt từ 60% để hoàn thành bài học.</p><div className="space-y-4">{active.comprehensionQuestions.map(question => <div key={question.id}><p className="mb-2 text-sm text-slate-200">{question.prompt}</p><div className="grid gap-1">{question.options.map(option => <label key={option.id} className={`rounded-lg border p-2 text-xs ${answers[question.id] === option.id ? 'border-cyan-300 bg-cyan-400/10' : 'border-white/10 bg-white/5'}`}><input type="radio" name={question.id} value={option.id} checked={answers[question.id] === option.id} onChange={() => setAnswers(prev => ({ ...prev, [question.id]: option.id }))} className="mr-2" />{option.label}</label>)}</div></div>)}</div><button disabled={Object.keys(answers).length !== active.comprehensionQuestions.length} onClick={submitQuiz} className="mt-4 rounded-lg bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">Chấm điểm</button></div>}
    {current === 'complete' && quizResult && <div><div className="rounded-xl bg-emerald-400/10 p-3"><p className="text-sm font-semibold text-emerald-300">{quizResult.passed ? 'Bạn đã hoàn thành lesson!' : 'Hãy luyện lại để vượt qua lesson.'}</p><p className="mt-1 text-2xl font-bold">{quizResult.score}%</p><p className="text-xs text-slate-400">{quizResult.correctAnswers}/{quizResult.totalQuestions} câu đúng</p></div><div className="mt-3"><p className="text-xs font-semibold text-slate-300">Từ vựng đã gặp</p><div className="mt-2 flex flex-wrap gap-1">{session.encounteredVocabulary.map(word => <span key={word} className="rounded-full bg-white/10 px-2 py-1 text-[10px]">{word}</span>)}</div></div><div className="mt-4 flex flex-wrap gap-2"><a href={`/reader?story=${active.relatedArticleIds[0]}&level=${encodeURIComponent(active.level)}`} className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950">Đọc bài liên quan</a><button onClick={() => { resetLesson(); setSubmitted(false); }} className="rounded-lg bg-white/10 px-3 py-2 text-xs">Luyện lại</button></div></div>}
  </section>;
}
