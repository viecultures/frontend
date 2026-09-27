import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Award, Compass, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import { LEARNING_PATHWAY_STEPS } from '@/data/vietnamCultureData';

export const LearningMethodSection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = LEARNING_PATHWAY_STEPS[activeStepIndex] || LEARNING_PATHWAY_STEPS[0];

  return (
    <section
      id="lo-trinh-hoc"
      className="relative py-12 sm:py-16 px-4 sm:px-8 lg:px-12 bg-[#FBF7EE] dark:bg-[#102B26] text-[#1E4B43] dark:text-[#FBF7EE] transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="space-y-3 max-w-3xl">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#6E9FA1] dark:text-[#9FCED8]">
            Lộ Trình Đào Tạo 4 Giai Đoạn
          </p>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-normal leading-[1.12] text-[#1E4B43] dark:text-[#FBF7EE]">
            Hành trình từ người học tiếng Anh đến Đại sứ Di sản.
          </h2>
          <p className="text-sm sm:text-base text-[#1E4B43]/80 dark:text-[#FBF7EE]/80 font-light leading-relaxed">
            Phương pháp giảng dạy độc quyền kết hợp giữa ngôn ngữ học văn hoá (Cultural Linguistics) và kỹ năng diễn thuyết công chúng (Rhetorical Public Speaking).
          </p>
        </div>

        {/* 4 Step Selector Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {LEARNING_PATHWAY_STEPS.map((step, idx) => {
            const isSelected = activeStepIndex === idx;
            return (
              <button
                key={step.step}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                className={`p-3.5 sm:p-4 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? 'bg-[#1E4B43] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26] shadow-md scale-[1.01]'
                    : 'bg-[#FAF6ED] dark:bg-[#143731] text-[#1E4B43] dark:text-[#FBF7EE] hover:bg-[#F6EEDC] border border-[#E8DFCB] dark:border-[#1E4B43]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span>{step.step}</span>
                  <span className={isSelected ? 'text-[#D9B76A] dark:text-[#102B26]' : 'text-[#6E9FA1]'}>
                    {step.duration}
                  </span>
                </div>
                <div className="font-display text-xs sm:text-sm font-normal leading-snug">
                  {step.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Focus Panel */}
        <motion.div
          key={activeStep.step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#FAF6ED] dark:bg-[#143731] border-2 border-[#1E4B43] dark:border-[#D9B76A]/60 shadow-lg space-y-5"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DFCB] dark:border-[#1E4B43] pb-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D9B76A]">
                {activeStep.step} • {activeStep.duration}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl text-[#1E4B43] dark:text-[#FBF7EE]">
                {activeStep.title}
              </h3>
              <p className="text-sm font-serif italic text-[#6E9FA1] dark:text-[#9FCED8]">
                &ldquo;{activeStep.englishTitle}&rdquo;
              </p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-[#EAF5F2] dark:bg-[#143731] border border-[#B8E0D7] dark:border-[#D9B76A]/40 text-xs font-semibold text-[#1E4B43] dark:text-[#D9B76A] shrink-0">
              Mục tiêu: {activeStep.objective}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1E4B43] dark:text-[#D9B76A] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#D9B76A]" />
                <span>Nội dung học tập trọng tâm:</span>
              </span>
              <p className="text-sm sm:text-base text-[#1E4B43]/85 dark:text-[#FBF7EE]/85 font-light leading-relaxed">
                {activeStep.description}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F6EEDC] dark:bg-[#143731] border border-[#D9B76A]/40 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1E4B43] dark:text-[#D9B76A] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E4B43] dark:text-[#D9B76A]" />
                <span>Sản phẩm đầu ra (Deliverable):</span>
              </span>
              <p className="text-xs sm:text-sm text-[#1E4B43]/90 dark:text-[#FBF7EE]/90 font-medium leading-relaxed">
                {activeStep.deliverable}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
