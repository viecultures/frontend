import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Award,
  Compass,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Brain,
  ArrowRight,
  ShieldCheck,
  Target
} from 'lucide-react';
import { LEARNING_PATHWAY_STEPS } from '@/data/vietnamCultureData';

export const LearningMethodSection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const activeStep = LEARNING_PATHWAY_STEPS[activeStepIndex] || LEARNING_PATHWAY_STEPS[0];

  return (
    <section
      id="lo-trinh-hoc"
      className="relative py-20 px-4 sm:px-8 lg:px-12 bg-rice-paper text-heritage-green relative overflow-hidden border-t border-line"
    >
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">

        {/* ── Section Editorial Header ──────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface text-heritage-green border border-antique-gold/40 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
            <span className="uppercase tracking-wider text-[11px] font-extrabold">
              LỘ TRÌNH ĐÀO TẠO 4 GIAI ĐOẠN
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-heritage-green tracking-tight">
            Hành Trình Trở Thành <span className="italic text-antique-gold font-serif">Đại Sứ Di Sản</span>
          </h2>

          <p className="text-sm sm:text-base text-text-body font-normal leading-relaxed">
            Phương pháp giảng dạy độc quyền kết hợp giữa Ngôn ngữ học Văn hóa (Cultural Linguistics) và Kỹ năng Diễn thuyết Công chúng (Rhetorical Public Speaking).
          </p>
        </div>

        {/* ── 4 Step Selector Buttons ───────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LEARNING_PATHWAY_STEPS.map((step, idx) => {
            const isSelected = activeStepIndex === idx;
            return (
              <button
                key={step.step}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                className={`p-5 rounded-2xl text-left transition-all duration-300 border cursor-pointer focus-ring flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-heritage-green text-warm-ivory border-antique-gold shadow-lg scale-102'
                    : 'bg-surface text-heritage-green border-line hover:border-antique-gold/40 hover:bg-mist-cloud/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs font-extrabold px-2.5 py-0.5 rounded ${
                    isSelected ? 'bg-black/30 text-antique-bright' : 'bg-rice-paper text-heritage-green'
                  }`}>
                    {step.step}
                  </span>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-antique-gold' : 'text-mountain-teal'}`}>
                    {step.duration}
                  </span>
                </div>

                <div>
                  <h3 className={`font-serif text-sm sm:text-base font-bold ${isSelected ? 'text-warm-ivory' : 'text-heritage-green'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-sky-mist' : 'text-text-secondary'}`}>
                    {step.englishTitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Active Stage Detailed Focus Panel ─────────────────────────── */}
        <motion.div
          key={activeStep.step}
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8 sm:p-12 rounded-3xl bg-surface border-2 border-antique-gold/30 shadow-xl space-y-8"
        >
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-antique-gold">
                {activeStep.step} • {activeStep.duration}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-green">
                {activeStep.title}
              </h3>
              <p className="text-sm font-serif italic text-mountain-teal">
                &ldquo;{activeStep.englishTitle}&rdquo;
              </p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-rice-paper border border-antique-gold/40 text-xs font-bold text-heritage-green flex items-center gap-2 shrink-0">
              <Target className="w-4 h-4 text-antique-gold" />
              <span>Mục tiêu: {activeStep.objective}</span>
            </div>
          </div>

          {/* Details 2-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left description */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-heritage-green flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-antique-gold" />
                <span>Nội Dung Học Tập Trọng Tâm:</span>
              </span>
              <p className="text-sm sm:text-base text-text-body leading-relaxed">
                {activeStep.description}
              </p>
            </div>

            {/* Right Deliverable box */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-heritage-forest text-warm-ivory border border-antique-gold/40 shadow-inner space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-antique-bright flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sản Phẩm Đầu Ra (Deliverable):</span>
              </span>
              <p className="text-xs sm:text-sm text-warm-ivory/90 font-medium leading-relaxed">
                {activeStep.deliverable}
              </p>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-sky-mist">
                <span>Chuẩn đầu ra kiểm định</span>
                <span className="text-antique-bright font-bold">Level 1 - 3</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default LearningMethodSection;
