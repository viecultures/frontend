import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Crown,
  Clock,
  Compass,
  Bot,
} from 'lucide-react';
import { READER_NEXT_LESSON_INFO } from '../data/learningLoopData';
import { setStoredUser, getStoredUser } from '@/utils/auth-storage';
import { PATHS, paths } from '@/routes/paths';
import { profileService } from '@/features/profile/services/profileService';

interface LessonCompletionFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId?: string;
  articleTitle?: string;
  isLoggedIn?: boolean;
  user?: { name: string; email: string; avatar?: string } | null;
  onLoginSuccess?: (user: { name: string; email: string }) => void;
}

type StepType = 'stamp' | 'auth' | 'survey' | 'completion';

export const LessonCompletionFlowModal: React.FC<LessonCompletionFlowModalProps> = ({
  isOpen,
  onClose,
  articleId = 'tet-holiday',
  articleTitle = 'Tết Cổ Truyền: Đổi Mới, Nhớ Về Cội Nguồn & Phong Vị Ba Miền',
  isLoggedIn = false,
  user = null,
  onLoginSuccess,
}) => {

  const navigate = useNavigate();

  // Multi-step flow state
  const [currentStep, setCurrentStep] = useState<StepType>('stamp');
  const [isStamped, setIsStamped] = useState<boolean>(false);
  const [isAnimatingStamp, setIsAnimatingStamp] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState(user || getStoredUser());

  // In-app Survey states
  const [surveyDailyTime, setSurveyDailyTime] = useState<string>('10–15 min');
  const [surveyTopic, setSurveyTopic] = useState<string>('Regional cuisine');

  if (!isOpen) return null;

  // Web Audio chime for Mộc Son ceremony
  const playCeremonialSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch {
      // AudioContext unavailable
    }
  };

  const handleApplyStamp = () => {
    if (isStamped) return;
    setIsAnimatingStamp(true);
    playCeremonialSound();
    setTimeout(() => {
      setIsStamped(true);
      setIsAnimatingStamp(false);
      try {
        profileService.unlockSeal(articleId || 'tet-holiday');
      } catch {
        // ignore
      }
    }, 750);
  };


  const handleProceedAfterStamp = () => {
    const active = currentUser || getStoredUser();
    if (!isLoggedIn && !active) {
      setCurrentStep('auth');
    } else {
      setCurrentStep('survey');
    }
  };

  const handleCompleteSurvey = () => {
    setCurrentStep('completion');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-warm-ivory text-ink-soft border-4 border-antique-gold rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden vn-pattern-bg my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── STEP 1: ĐÓNG MỘC SON & STREAK ──────────────────────── */}
        {currentStep === 'stamp' && (
          <div className="text-center space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-antique-gold">
                VIETNAMESE HERITAGE • LEARNING CERTIFICATE
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-heritage-green">
                Lesson complete
              </h2>
              <p className="text-xs sm:text-sm font-sans italic text-stone-600">
                "{articleTitle}"
              </p>
            </div>

            {/* Certificate Frame */}
            <div className="relative py-6 px-4 bg-rice-paper border-2 border-dashed border-antique-gold rounded-2xl max-w-lg mx-auto flex flex-col items-center justify-center min-h-[220px]">
              {/* Daily Streak Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-md mb-4">
                <Flame className="w-4 h-4 fill-current animate-pulse text-yellow-200" />
                <span>Day 1 learning streak!</span>
              </div>

              {/* Ceremonial Mộc Son Stamp */}
              {isStamped ? (
                <div className="relative animate-in zoom-in-75 duration-500 transform hover:scale-105 transition-transform">
                  <div className="w-36 h-36 rounded-full border-4 border-[#9E2A2B] bg-[#9E2A2B]/10 flex flex-col items-center justify-center p-3 text-[#9E2A2B] shadow-[0_0_30px_rgba(158,42,43,0.35)] rotate-[-6deg]">
                    <span className="text-[9px] font-sans uppercase tracking-widest font-black">
                      VIETNAMESE HERITAGE
                    </span>
                    <div className="my-1 border-y border-[#9E2A2B] py-0.5 w-full text-center">
                      <span className="font-sans text-base font-black tracking-wider">
                        COMPLETED
                      </span>
                    </div>
                    <span className="text-[9px] font-sans uppercase tracking-wider font-bold">
                      HERITAGE SEAL
                    </span>
                    <span className="text-[8px] font-mono mt-0.5 opacity-80">
                      STAMP #{Math.floor(1000 + Math.random() * 9000)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-stone-600 max-w-xs leading-relaxed">
                    Apply your <strong>heritage seal</strong> to mark this lesson complete and start your learning streak.
                  </p>
                  <button
                    type="button"
                    onClick={handleApplyStamp}
                    disabled={isAnimatingStamp}
                    className="px-6 py-3 rounded-full bg-[#9E2A2B] hover:bg-[#852223] text-white font-sans font-bold text-xs shadow-lg border border-antique-gold transition-all transform hover:scale-105 cursor-pointer inline-flex items-center gap-2"
                  >
                    <Award className="w-4 h-4 text-antique-gold" />
                    <span>{isAnimatingStamp ? 'Applying seal…' : 'Apply heritage seal'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Step Action */}
            {isStamped && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleProceedAfterStamp}
                  className="px-8 py-3.5 rounded-full bg-heritage-green hover:bg-heritage-dark text-white font-sans font-bold text-xs sm:text-sm shadow-xl border border-antique-gold transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue: save your achievement</span>
                  <ArrowRight className="w-4 h-4 text-antique-gold" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: ĐĂNG NHẬP LƯU THÀNH TỰU ─────────────────────────── */}
        {currentStep === 'auth' && (
          <div className="text-center space-y-6 animate-in fade-in duration-300 py-2">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-antique-gold">
                SAVE YOUR PROGRESS
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-heritage-green">
                Save your seal & learning streak
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                You earned a <strong>heritage seal</strong> and a <strong>1-day streak</strong>. Sign in to save your certificate to your heritage profile.
              </p>
            </div>

            <div className="pt-3 max-w-xs mx-auto space-y-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  const currentPath = window.location.pathname + window.location.search;
                  navigate(paths.login({ redirect: currentPath }));
                }}
                className="w-full py-3.5 px-6 rounded-full bg-heritage-green hover:bg-heritage-dark text-white font-sans font-bold text-sm shadow-xl border border-antique-gold transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02]"
              >
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4 text-antique-gold" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep('survey')}
                className="text-xs text-stone-500 hover:underline pt-1 inline-block cursor-pointer"
              >
                Later (keep progress in this browser)
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: KHẢO SÁT TRONG APP (IN-APP ONBOARDING SURVEY) ──────── */}
        {currentStep === 'survey' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-antique-gold">
                YOUR LEARNING GOALS
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-heritage-green">
                Set up your learning path
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Choose your interests to personalize your learning path.
              </p>
            </div>

            <div className="max-w-lg mx-auto space-y-5 bg-rice-paper p-6 rounded-2xl border border-antique-gold/30">
              {/* Question 1: Daily Time */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-heritage-green">
                  <Clock className="w-4 h-4 text-antique-gold" />
                  <span>1. How much time would you like to study each day?</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['10–15 min', '20–30 min', '45+ min'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSurveyDailyTime(opt)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        surveyDailyTime === opt
                          ? 'bg-heritage-green text-white border-heritage-green shadow-xs'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Favorite Cultural Topic */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-heritage-green">
                  <Compass className="w-4 h-4 text-antique-gold" />
                  <span>2. Which cultural topic interests you most?</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Regional cuisine',
                    'Historic sites',
                    'Traditional festivals',
                    'Customs & daily life',
                  ].map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setSurveyTopic(topic)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left transition-all cursor-pointer ${
                        surveyTopic === topic
                          ? 'bg-heritage-green text-white border-heritage-green shadow-xs'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleCompleteSurvey}
                className="px-8 py-3 rounded-full bg-heritage-green hover:bg-heritage-dark text-white font-sans font-bold text-xs sm:text-sm shadow-md border border-antique-gold transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Save preferences</span>
                <ArrowRight className="w-4 h-4 text-antique-gold" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: HOÀN TẤT, ĐIỀU HƯỚNG BÀI TIẾP THEO & GIỚI THIỆU CHATBOT / PRO ── */}
        {currentStep === 'completion' && (
          <div className="text-center space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-antique-gold">
                WELL DONE
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-heritage-green">
                Your achievement has been saved
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                You completed the lesson and kept your learning streak going!
              </p>
            </div>

            {/* Preview Next Lesson */}
            <div className="max-w-md mx-auto bg-white rounded-2xl border-2 border-antique-gold p-4 text-left shadow-lg space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={READER_NEXT_LESSON_INFO.coverImage}
                  alt={READER_NEXT_LESSON_INFO.titleVi}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#9E2A2B]">
                    {READER_NEXT_LESSON_INFO.region}
                  </span>
                  <h4 className="font-sans text-sm font-bold text-heritage-green leading-snug">
                    {READER_NEXT_LESSON_INFO.titleVi}
                  </h4>
                  <span className="text-[10px] text-stone-500 block">
                    {READER_NEXT_LESSON_INFO.readTime} • {READER_NEXT_LESSON_INFO.category}
                  </span>
                </div>
              </div>
              <p className="text-xs text-stone-600 italic">
                {READER_NEXT_LESSON_INFO.summaryVi}
              </p>
            </div>

            {/* Notice about AI Chatbot located in bottom right corner */}
            <div className="max-w-md mx-auto p-3.5 bg-gradient-to-r from-heritage-forest to-heritage-green rounded-2xl border border-antique-gold text-left flex items-start gap-3 text-white">
              <div className="p-2 rounded-xl bg-antique-gold text-heritage-forest shrink-0 mt-0.5">
                <Bot className="w-5 h-5 fill-current" />
              </div>
              <div className="space-y-0.5 text-xs">
                <div className="font-bold text-antique-gold flex items-center gap-1.5">
                  <span>AI Cultural Companion</span>
                  <span className="px-1.5 py-0.2 rounded bg-yellow-400 text-stone-900 text-[9px] font-bold">PRO</span>
                </div>
                <p className="text-stone-200 text-[11px] leading-relaxed">
                  Open the cultural companion in the <strong>bottom-right corner</strong> to explore more. Upgrade to Pro for more conversations.
                </p>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(paths.profile({ tab: 'passport' }));
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-antique-gold hover:bg-[#c9a75a] text-heritage-forest font-sans font-bold text-xs sm:text-sm shadow-xl border border-antique-gold transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4 text-heritage-forest" />
                <span>View heritage passport</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(paths.reader({ postId: 'imperial-hue' }));
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-heritage-green hover:bg-heritage-dark text-white font-sans font-bold text-xs sm:text-sm shadow-xl border border-antique-gold transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Next lesson: Imperial Hue</span>
                <ArrowRight className="w-4 h-4 text-antique-gold" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(PATHS.pricing);
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#9E2A2B] hover:bg-[#852223] text-white font-sans font-bold text-xs sm:text-sm shadow-xl border border-antique-gold transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Crown className="w-4 h-4 text-antique-gold fill-current" />
                <span>Upgrade to Pro (VND 39,000)</span>
              </button>
            </div>


            <div>
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-stone-500 hover:underline cursor-pointer"
              >
                Close & return to reading
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonCompletionFlowModal;
