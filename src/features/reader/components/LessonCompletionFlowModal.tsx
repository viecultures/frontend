import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Flame,
  Sparkles,
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
  const [surveyDailyTime, setSurveyDailyTime] = useState<string>('15 phút');
  const [surveyTopic, setSurveyTopic] = useState<string>('Ẩm thực ba miền');

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
      <div className="relative w-full max-w-xl bg-[#FBF7EE] text-[#3F5550] border-4 border-[#D9B76A] rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden vn-pattern-bg my-8">
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
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D9B76A]">
                VIỆT CỔ VĂN HIẾN • CHỨNG THƯ DI SẢN
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1E4B43]">
                Chứng Nhận Hoàn Thành Bài Học
              </h2>
              <p className="text-xs sm:text-sm font-serif italic text-stone-600">
                "{articleTitle}"
              </p>
            </div>

            {/* Certificate Frame */}
            <div className="relative py-6 px-4 bg-[#F6EEDC] border-2 border-dashed border-[#D9B76A] rounded-2xl max-w-lg mx-auto flex flex-col items-center justify-center min-h-[220px]">
              {/* Daily Streak Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-md mb-4">
                <Flame className="w-4 h-4 fill-current animate-pulse text-yellow-200" />
                <span>Kích Hoạt Chuỗi Học Ngày 1!</span>
              </div>

              {/* Ceremonial Mộc Son Stamp */}
              {isStamped ? (
                <div className="relative animate-in zoom-in-75 duration-500 transform hover:scale-105 transition-transform">
                  <div className="w-36 h-36 rounded-full border-4 border-[#9E2A2B] bg-[#9E2A2B]/10 flex flex-col items-center justify-center p-3 text-[#9E2A2B] shadow-[0_0_30px_rgba(158,42,43,0.35)] rotate-[-6deg]">
                    <span className="text-[9px] font-serif uppercase tracking-widest font-black">
                      VIỆT CỔ DI SẢN
                    </span>
                    <div className="my-1 border-y border-[#9E2A2B] py-0.5 w-full text-center">
                      <span className="font-serif text-base font-black tracking-wider">
                        CHUẨN DIỆT
                      </span>
                    </div>
                    <span className="text-[9px] font-serif uppercase tracking-wider font-bold">
                      MỘC SON CHÍNH KHẢO
                    </span>
                    <span className="text-[8px] font-mono mt-0.5 opacity-80">
                      STAMP #{Math.floor(1000 + Math.random() * 9000)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-stone-600 max-w-xs leading-relaxed">
                    Nhấn nút bên dưới để đóng dấu <strong>Mộc Son đỏ</strong> ghi nhận nỗ lực đọc hiểu và thắp sáng ngọn lửa chuỗi học.
                  </p>
                  <button
                    type="button"
                    onClick={handleApplyStamp}
                    disabled={isAnimatingStamp}
                    className="px-6 py-3 rounded-full bg-[#9E2A2B] hover:bg-[#852223] text-white font-serif font-bold text-xs shadow-lg border border-[#D9B76A] transition-all transform hover:scale-105 cursor-pointer inline-flex items-center gap-2"
                  >
                    <Award className="w-4 h-4 text-[#D9B76A]" />
                    <span>{isAnimatingStamp ? 'Đang Dập Mộc Son...' : 'Dập Mộc Son Đỏ Ngay'}</span>
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
                  className="px-8 py-3.5 rounded-full bg-[#1E4B43] hover:bg-[#163D37] text-white font-serif font-bold text-xs sm:text-sm shadow-xl border border-[#D9B76A] transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Tiếp Tục: Lưu Giữ Thành Tựu</span>
                  <ArrowRight className="w-4 h-4 text-[#D9B76A]" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: ĐĂNG NHẬP LƯU THÀNH TỰU ─────────────────────────── */}
        {currentStep === 'auth' && (
          <div className="text-center space-y-6 animate-in fade-in duration-300 py-2">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D9B76A]">
                LƯU TRỮ HỒ SƠ CÁ NHÂN
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1E4B43]">
                Lưu Giữ Mộc Son & Chuỗi Ngày Học
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Bạn vừa đạt <strong>Mộc Son</strong> và <strong>Chuỗi ngày 1</strong>. Hãy đăng nhập để lưu giữ chứng nhận vào hồ sơ di sản cá nhân của bạn.
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
                className="w-full py-3.5 px-6 rounded-full bg-[#1E4B43] hover:bg-[#163D37] text-white font-serif font-bold text-sm shadow-xl border border-[#D9B76A] transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02]"
              >
                <span>Đăng Nhập</span>
                <ArrowRight className="w-4 h-4 text-[#D9B76A]" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep('survey')}
                className="text-xs text-stone-500 hover:underline pt-1 inline-block cursor-pointer"
              >
                Để sau (lưu tạm trên trình duyệt)
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: KHẢO SÁT TRONG APP (IN-APP ONBOARDING SURVEY) ──────── */}
        {currentStep === 'survey' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D9B76A]">
                KHẢO SÁT MỤC TIÊU HỌC TẬP
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1E4B43]">
                Thiết Lập Lộ Trình Của Bạn
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Chỉ mất vài giây để hệ thống cá nhân hóa chủ đề văn hóa yêu thích cho bạn.
              </p>
            </div>

            <div className="max-w-lg mx-auto space-y-5 bg-[#F6EEDC] p-6 rounded-2xl border border-[rgba(217,183,106,0.3)]">
              {/* Question 1: Daily Time */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-[#1E4B43]">
                  <Clock className="w-4 h-4 text-[#D9B76A]" />
                  <span>1. Bạn muốn dành bao nhiêu thời gian học mỗi ngày?</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['10-15 phút', '20-30 phút', '45+ phút'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSurveyDailyTime(opt)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        surveyDailyTime === opt
                          ? 'bg-[#1E4B43] text-white border-[#1E4B43] shadow-xs'
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
                <label className="flex items-center gap-2 text-xs font-bold text-[#1E4B43]">
                  <Compass className="w-4 h-4 text-[#D9B76A]" />
                  <span>2. Chủ đề văn hóa nào bạn yêu thích nhất?</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Ẩm thực ba miền',
                    'Di tích lịch sử',
                    'Lễ hội truyền thống',
                    'Phong tục & Đời sống',
                  ].map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setSurveyTopic(topic)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left transition-all cursor-pointer ${
                        surveyTopic === topic
                          ? 'bg-[#1E4B43] text-white border-[#1E4B43] shadow-xs'
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
                className="px-8 py-3 rounded-full bg-[#1E4B43] hover:bg-[#163D37] text-white font-serif font-bold text-xs sm:text-sm shadow-md border border-[#D9B76A] transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Hoàn Tất Khảo Sát</span>
                <ArrowRight className="w-4 h-4 text-[#D9B76A]" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: HOÀN TẤT, ĐIỀU HƯỚNG BÀI TIẾP THEO & GIỚI THIỆU CHATBOT / PRO ── */}
        {currentStep === 'completion' && (
          <div className="text-center space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D9B76A]">
                CHÚC MỪNG HOÀN THÀNH
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1E4B43]">
                Thành Tựu Của Bạn Đã Được Ghi Nhận
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Bạn đã hoàn thành bài học và giữ vững chuỗi học hôm nay!
              </p>
            </div>

            {/* Preview Next Lesson */}
            <div className="max-w-md mx-auto bg-white rounded-2xl border-2 border-[#D9B76A] p-4 text-left shadow-lg space-y-3">
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
                  <h4 className="font-serif text-sm font-bold text-[#1E4B43] leading-snug">
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
            <div className="max-w-md mx-auto p-3.5 bg-gradient-to-r from-[#122A22] to-[#1E4B43] rounded-2xl border border-[#D9B76A] text-left flex items-start gap-3 text-white">
              <div className="p-2 rounded-xl bg-[#D9B76A] text-[#122A22] shrink-0 mt-0.5">
                <Bot className="w-5 h-5 fill-current" />
              </div>
              <div className="space-y-0.5 text-xs">
                <div className="font-bold text-[#D9B76A] flex items-center gap-1.5">
                  <span>Trợ Lý AI Cultural Companion</span>
                  <span className="px-1.5 py-0.2 rounded bg-yellow-400 text-stone-900 text-[9px] font-bold">PRO</span>
                </div>
                <p className="text-stone-200 text-[11px] leading-relaxed">
                  Giao diện trò chuyện văn hóa luôn sẵn sàng ở <strong>góc phải bên dưới</strong> màn hình. Hãy nâng cấp gói Pro để đàm đạo không giới hạn!
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
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#D9B76A] hover:bg-[#c9a75a] text-[#122A22] font-serif font-bold text-xs sm:text-sm shadow-xl border border-[#D9B76A] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4 text-[#122A22]" />
                <span>Xem Hộ Chiếu Mộc Son</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(paths.reader({ postId: 'imperial-hue' }));
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#1E4B43] hover:bg-[#163D37] text-white font-serif font-bold text-xs sm:text-sm shadow-xl border border-[#D9B76A] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Học Bài Tiếp Theo: Cố Đô Huế</span>
                <ArrowRight className="w-4 h-4 text-[#D9B76A]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(PATHS.pricing);
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#9E2A2B] hover:bg-[#852223] text-white font-serif font-bold text-xs sm:text-sm shadow-xl border border-[#D9B76A] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Crown className="w-4 h-4 text-[#D9B76A] fill-current" />
                <span>Nâng Cấp Gói Pro (39k)</span>
              </button>
            </div>


            <div>
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-stone-500 hover:underline cursor-pointer"
              >
                Đóng & tiếp tục xem bài đọc
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonCompletionFlowModal;
