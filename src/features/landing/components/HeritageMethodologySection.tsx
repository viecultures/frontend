import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Compass,
  BookOpen,
  Layers,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Headphones,
  Brain,
  MessageSquare
} from 'lucide-react';

interface MethodologyStep {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  desc: string;
  highlights: string[];
  tag: string;
}

const METHODOLOGY_STEPS: MethodologyStep[] = [
  {
    id: 'step-1',
    stepNumber: '01',
    title: 'Khám Phá Địa Linh Nhân Kiệt',
    subtitle: 'Toạ Độ Di Sản 34 Tỉnh Thành',
    icon: <Compass className="w-6 h-6 text-antique-gold" />,
    desc: 'Hành trình bắt đầu từ bản đồ di sản 34 tỉnh thành. Mỗi địa danh gắn liền với câu chuyện văn hóa tiêu biểu: từ Nhã nhạc cung đình Huế, Ruộng bậc thang Sa Pa đến Bánh mì Sài Gòn.',
    highlights: [
      'Bản đồ tương tác SVG 34 tỉnh thành cập nhật 2025',
      'Phân loại theo 3 miền: Bắc - Trung - Nam',
      'Định danh di sản thế giới UNESCO & di tích lịch sử',
    ],
    tag: 'BƯỚC 1: KHƠI GỢI CẢM HỨNG',
  },
  {
    id: 'step-2',
    stepNumber: '02',
    title: 'Đọc Sâu & AI Audio Shadowing',
    subtitle: 'Đọc Song Ngữ & Luyện Âm Chuẩn Xác',
    icon: <BookOpen className="w-6 h-6 text-antique-gold" />,
    desc: 'Đắm mình trong các bài đọc song ngữ chuẩn học thuật (CEFR B1 - C1). Tra từ vựng chỉ bằng 1 chạm, nghe phát âm bản xứ và luyện nhại giọng chuẩn ngữ điệu.',
    highlights: [
      'Chế độ đọc Song Ngữ (Bilingual) & Đọc Sâu (Extensive)',
      'Gạch chân thư pháp tra từ vựng kèm phiên âm IPA',
      'Thanh luyện nghe & AI Audio Shadowing',
    ],
    tag: 'BƯỚC 2: TIẾP NHẬN & LUYỆN NÓI',
  },
  {
    id: 'step-3',
    stepNumber: '03',
    title: 'Ghi Nhớ Dài Hạn Với Flashcards SRS',
    subtitle: 'Cơ Chế Lặp Ngắt Quãng SM-2',
    icon: <Brain className="w-6 h-6 text-antique-gold" />,
    desc: 'Không học vẹt danh sách từ rời rạc. Toàn bộ từ vựng được tự động đưa vào chu trình lặp lại ngắt quãng (SRS) với thẻ lật 3D, giúp khắc sâu vào trí nhớ dài hạn.',
    highlights: [
      'Hiệu ứng lật thẻ 3D trực quan và phím tắt thông minh',
      'Thuật toán tính toán chu kỳ ôn tập Again / Hard / Good / Easy',
      'Đo lường tiến độ nắm vững từ vựng theo thời gian thực',
    ],
    tag: 'BƯỚC 3: KHẮC SÂU TRÍ NHỚ',
  },
  {
    id: 'step-4',
    stepNumber: '04',
    title: 'Trở Thành Sứ Giả Văn Hóa',
    subtitle: 'Góc Cảm Nhận & Lan Tỏa Bản Sắc',
    icon: <Award className="w-6 h-6 text-antique-gold" />,
    desc: 'Ứng dụng từ vựng đã học để viết bài cảm nhận tự do trong không gian cộng đồng. Tham gia thử thách viết tuần, tích lũy Xu Văn Hóa và nhận huy hiệu danh giá.',
    highlights: [
      'Viết cảm nhận tự do không áp lực điểm số đỏ',
      'Thử thách viết theo chủ đề tuần (Weekly Contest Hub)',
      'Hệ thống thưởng Xu Văn Hóa & Huy hiệu Sứ Giả',
    ],
    tag: 'BƯỚC 4: LAN TỎA BẢN SẮC',
  },
];

interface HeritageMethodologySectionProps {
  onNavigate?: (view: string) => void;
}

export const HeritageMethodologySection: React.FC<HeritageMethodologySectionProps> = ({ onNavigate }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const currentStep = METHODOLOGY_STEPS[activeStepIndex];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-rice-paper text-heritage-green relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10 relative z-10">

        {/* ── Section Header ────────────────────────────────────────────── */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface text-heritage-green border border-antique-gold/40 text-[11px] font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
            <span className="uppercase tracking-wider font-extrabold">
              PHƯƠNG PHÁP TIẾP CẬN ĐỘC BẢN
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-heritage-green tracking-tight">
            Lộ Trình <span className="italic text-antique-gold font-serif">Đắm Chìm Di Sản</span>
          </h2>

          <p className="text-xs sm:text-sm text-text-body font-normal leading-relaxed max-w-xl mx-auto">
            Học ngôn ngữ tự nhiên như cách người bản xứ cảm thụ văn hóa — từ khơi gợi tò mò địa danh đến lan tỏa niềm tự hào dân tộc.
          </p>
        </div>

        {/* ── Step Selector Tabs Row ────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
          {METHODOLOGY_STEPS.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                className={`p-3.5 sm:p-4 rounded-xl text-left transition-all duration-200 border cursor-pointer focus-ring flex flex-col justify-between space-y-2.5 ${
                  isActive
                    ? 'bg-heritage-green text-warm-ivory border-antique-gold shadow-md'
                    : 'bg-surface text-heritage-green border-line hover:border-antique-gold/40 hover:bg-mist-cloud/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[10px] font-extrabold px-2 py-0.5 rounded ${
                    isActive ? 'bg-black/30 text-antique-bright' : 'bg-rice-paper text-heritage-green'
                  }`}>
                    {step.stepNumber}
                  </span>
                  <span className={isActive ? 'text-antique-bright' : 'text-heritage-green'}>
                    {step.icon}
                  </span>
                </div>

                <div>
                  <h3 className={`font-serif text-xs sm:text-sm font-bold ${isActive ? 'text-warm-ivory' : 'text-heritage-green'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-[10px] sm:text-[11px] mt-0.5 ${isActive ? 'text-sky-mist' : 'text-text-secondary'}`}>
                    {step.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Active Step Detailed Showcase Panel ───────────────────────── */}
        <motion.div
          key={currentStep.id}
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-surface border border-antique-gold/30 p-6 sm:p-8 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center"
        >
          {/* Left Column: Storytelling & Key Points (7/12) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rice-paper text-heritage-green text-[11px] font-bold border border-antique-gold/40">
              <span className="text-antique-gold font-serif font-bold text-xs">✦</span>
              <span>{currentStep.tag}</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-heritage-green leading-snug">
                {currentStep.title}
              </h3>
              <p className="text-xs font-medium text-mountain-teal">
                {currentStep.subtitle}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-text-body leading-relaxed">
              {currentStep.desc}
            </p>

            {/* Checklist highlights */}
            <ul className="space-y-2 pt-1" aria-label="Đặc điểm phương pháp">
              {currentStep.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-heritage-dark font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-mountain-teal shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Visual Callout Box (5/12) */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-xl bg-heritage-forest text-warm-ivory border border-antique-gold/40 shadow-inner space-y-4">
            <div className="flex items-center justify-between border-b border-antique-gold/20 pb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-antique-bright">
                TRIẾT LÝ PHƯƠNG PHÁP VIECULTURES
              </span>
              <span className="font-mono text-xs text-sky-mist">
                Bước {currentStep.stepNumber} / 04
              </span>
            </div>

            <blockquote className="font-serif italic text-xs sm:text-sm text-warm-ivory leading-relaxed">
              &ldquo;Ngôn ngữ không chỉ là công cụ giao tiếp; đó là chiếc cầu nối lưu giữ và tái hiện tâm hồn của cả một dân tộc.&rdquo;
            </blockquote>

            <div className="pt-2 border-t border-antique-gold/20 flex items-center justify-between text-[11px] text-sky-mist">
              <span>Được cố vấn bởi chuyên gia văn hóa</span>
              <span className="text-antique-gold font-bold">100% Thuần Việt &amp; Học Thuật</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeritageMethodologySection;
