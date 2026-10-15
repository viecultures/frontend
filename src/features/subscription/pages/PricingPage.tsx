import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Check,
  X,
  Crown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Zap,
  CheckCircle2,
  BookOpen,
  Volume2,
  Bot,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { getIsProUser, setIsProUser, getStoredUser } from '@/utils/auth-storage';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isPro, setLocalIsPro] = useState<boolean>(getIsProUser());
  const [showQrCheckout, setShowQrCheckout] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const currentUser = getStoredUser();

  useEffect(() => {
    setLocalIsPro(getIsProUser());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectPro = () => {
    setShowQrCheckout(true);
    setTimeout(() => {
      document.getElementById('qr-payment-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleConfirmPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProUser(true);
      setLocalIsPro(true);
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
    }, 800);
  };

  return (
    <div className="w-full text-[#3F5550] dark:text-[#FBF7EE] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Top Back Action */}
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1E4B43] dark:text-[#D9B76A] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang trước</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1E4B43]/10 dark:bg-[#D9B76A]/10 border border-[#D9B76A]/40 text-[#1E4B43] dark:text-[#D9B76A] text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5" />
            <span>Bảng Giá & Đặc Quyền Hội Viên</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#1E4B43] dark:text-[#FBF7EE] tracking-tight">
            Nâng Tầm Tiếng Anh Cùng Di Sản Việt
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
            Lựa chọn gói đồng hành phù hợp để mở khóa toàn diện kho bài đọc 63 tỉnh thành và đàm đạo không giới hạn cùng trợ lý văn hóa AI.
          </p>

          {/* Billing Toggle (Tháng / Năm) */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <div className="bg-[#1E4B43]/10 dark:bg-white/10 p-1 rounded-2xl inline-flex items-center border border-[#D9B76A]/30 text-xs font-bold">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[#1E4B43] text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-[#1E4B43]'
                }`}
              >
                Gói Hàng Tháng
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-[#1E4B43] text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-[#1E4B43]'
                }`}
              >
                <span>Gói 1 Năm</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#9E2A2B] text-white font-mono">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 2 Option Comparison Cards: Bản Thường vs Bản Pro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* OPTION 1: Bản Thường (Miễn Phí) */}
          <div className="bg-[#F6EEDC] dark:bg-[#141C1A] border-2 border-stone-300 dark:border-white/10 rounded-3xl p-6 sm:p-10 flex flex-col justify-between shadow-md transition-all">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Gói Khởi Điểm
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E4B43] dark:text-white">
                  Bản Miễn Phí (Free)
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Dành cho người mới bắt đầu làm quen với phương pháp đọc song ngữ.
                </p>
              </div>

              <div className="py-2 border-y border-stone-300/60 dark:border-white/10">
                <div className="font-serif text-4xl font-extrabold text-[#1E4B43] dark:text-[#D9B76A]">
                  0 VNĐ
                </div>
                <span className="text-xs text-stone-500">Miễn phí vĩnh viễn</span>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3.5 text-xs sm:text-sm">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>15 bài đọc di sản mẫu cơ bản</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Lưu tối đa 30 từ vựng vào sổ tay</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Audio Shadowing tốc độ chuẩn (1x)</span>
                </li>
                <li className="flex items-center gap-3 opacity-60">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Không hỗ trợ trợ lý AI Cultural Companion</span>
                </li>
                <li className="flex items-center gap-3 opacity-60">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Kèm banner quảng cáo chân trang</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                type="button"
                disabled
                className="w-full py-3.5 rounded-2xl bg-stone-200 dark:bg-stone-800 text-stone-500 font-serif font-bold text-xs sm:text-sm cursor-not-allowed text-center"
              >
                {!isPro ? 'Gói Hiện Tại Của Bạn' : 'Gói Cơ Bản'}
              </button>
            </div>
          </div>

          {/* OPTION 2: Bản Hội Viên Pro (39.000đ/tháng) */}
          <div className="relative bg-[#122A22] text-[#FBF7EE] border-4 border-[#D9B76A] rounded-3xl p-6 sm:p-10 flex flex-col justify-between shadow-2xl transition-all transform hover:scale-[1.01]">
            {/* Best Value Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#9E2A2B] text-white border border-[#D9B76A] text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D9B76A]" />
              <span>Được Khuyên Dùng Nhất</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D9B76A]">
                  Trải Nghiệm Toàn Diện
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                  <span>Hội Viên Di Sản Pro</span>
                  <Crown className="w-6 h-6 text-[#D9B76A] fill-current" />
                </h3>
                <p className="text-xs text-stone-300">
                  Mở khóa trọn vẹn sức mạnh học tiếng Anh qua văn hóa và đàm thoại AI chuyên sâu.
                </p>
              </div>

              <div className="py-2 border-y border-white/10">
                <div className="font-serif text-4xl font-extrabold text-[#D9B76A]">
                  {billingCycle === 'monthly' ? '39.000 VNĐ' : '375.000 VNĐ'}
                </div>
                <span className="text-xs text-white/70">
                  {billingCycle === 'monthly' ? 'Thanh toán mỗi tháng' : 'Tiết kiệm ~2 tháng học'}
                </span>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3.5 text-xs sm:text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D9B76A] shrink-0 mt-0.5" />
                  <span><strong>Đàm đạo sâu cùng AI Cultural Companion:</strong> Trò chuyện không giới hạn bằng tiếng Anh, hỗ trợ gợi ý Quick Prompts đa chiều.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D9B76A] shrink-0 mt-0.5" />
                  <span><strong>Mở khóa trọn bộ 63 tỉnh thành:</strong> Tiếp cận toàn bộ kho tàng danh lam, phong tục và di sản phi vật thể UNESCO.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D9B76A] shrink-0 mt-0.5" />
                  <span><strong>Đầy đủ 3 dải tốc độ audio (0.5x, 0.8x, 1x):</strong> Google Gemini Real Audio đọc tự nhiên như người bản xứ.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D9B76A] shrink-0 mt-0.5" />
                  <span><strong>Không giới hạn sổ tay từ vựng:</strong> Lưu và đồng bộ tiến trình học tập vĩnh viễn trên đám mây.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D9B76A] shrink-0 mt-0.5" />
                  <span><strong>100% Không quảng cáo & Nhận Huy Hiệu Pro.</strong></span>
                </li>
              </ul>
            </div>

            <div className="pt-8 space-y-2">
              {isPro ? (
                <div className="w-full py-4 rounded-2xl bg-[#1E4B43] border border-[#D9B76A] text-[#D9B76A] font-serif font-bold text-center text-sm shadow-md flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Bạn Đang Là Hội Viên Pro</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSelectPro}
                  className="w-full py-4 rounded-2xl bg-[#9E2A2B] hover:bg-[#852223] text-white font-serif font-bold text-sm sm:text-base shadow-xl border border-[#D9B76A] transition-all transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5 text-[#D9B76A]" />
                  <span>Nâng Cấp Gói Pro Ngay (39.000đ)</span>
                  <ArrowRight className="w-4 h-4 text-[#D9B76A]" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── QR PAYMENT SECTION (Nhấn thêm cái nữa mới QR) ──────────────────── */}
        {showQrCheckout && !isPro && (
          <section id="qr-payment-section" className="scroll-mt-24 max-w-2xl mx-auto pt-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#141C1A] border-4 border-[#D9B76A] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-center">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#D9B76A]">
                  CỔNG THANH TOÁN MÔ PHỎNG EDTECH
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1E4B43] dark:text-white">
                  Quét Mã VietQR / MoMo Kích Hoạt Gói Pro
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                  Hệ thống tự động kích hoạt tài khoản ngay khi nhận được xác nhận chuyển khoản.
                </p>
              </div>

              {/* QR Code Container */}
              <div className="max-w-xs mx-auto bg-stone-50 dark:bg-stone-900 border-2 border-stone-800 p-4 rounded-2xl shadow-inner space-y-3">
                <div className="w-40 h-40 mx-auto bg-white p-2 rounded-xl border flex items-center justify-center shadow-xs">
                  <QrCode className="w-32 h-32 text-[#1E4B43]" />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="font-serif text-lg font-bold text-[#9E2A2B]">
                    {billingCycle === 'monthly' ? '39.000 VNĐ' : '375.000 VNĐ'}
                  </div>
                  <div className="font-mono text-stone-700 dark:text-stone-300 font-bold">
                    Nội dung: PRO VIE_{currentUser?.name ? currentUser.name.slice(0, 4).toUpperCase() : 'USER'}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Ngân hàng Quân Đội (MB Bank) • STK: 0987654321
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isProcessingPayment}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1E4B43] hover:bg-[#163D37] text-white font-serif font-bold text-xs sm:text-sm shadow-xl border border-[#D9B76A] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D9B76A]" />
                  <span>
                    {isProcessingPayment
                      ? 'Đang Kiểm Tra Chuyển Khoản...'
                      : 'Xác Nhận Đã Thanh Toán (Mô Phỏng)'}
                  </span>
                </button>
                <div>
                  <button
                    type="button"
                    onClick={() => setShowQrCheckout(false)}
                    className="text-xs text-stone-500 hover:underline cursor-pointer"
                  >
                    Thu gọn mã QR
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Payment Success Banner */}
        {paymentSuccess && (
          <section className="max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Check className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                  Chúc Mừng Bạn Đã Trở Thành Hội Viên Pro!
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 max-w-md mx-auto">
                  Bạn đã được mở khóa đặc quyền trò chuyện không giới hạn cùng trợ lý văn hóa AI và trọn bộ 63 tỉnh thành.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/bilingual-reader')}
                  className="px-6 py-3 rounded-full bg-[#1E4B43] hover:bg-[#163D37] text-white font-serif font-bold text-xs sm:text-sm shadow-md border border-[#D9B76A] transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-[#D9B76A]" />
                  <span>Quay Lại Bài Đọc & Mở Chat AI</span>
                  <ArrowRight className="w-4 h-4 text-[#D9B76A]" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Detailed Feature Comparison Table (matching system_constants.md) */}
        <section className="pt-8 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E4B43] dark:text-[#FBF7EE]">
              Bảng So Sánh Quyền Lợi Chi Tiết
            </h3>
            <p className="text-xs text-stone-500">
              Đối chiếu minh bạch theo chuẩn kiến trúc hệ thống VieCultures
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[rgba(217,183,106,0.3)] bg-white dark:bg-[#141C1A] shadow-md">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead>
                <tr className="bg-[#1E4B43] text-white border-b border-[#D9B76A]/30">
                  <th className="py-4 px-6 font-serif">Tính Năng / Đặc Quyền</th>
                  <th className="py-4 px-6 font-serif text-center">Bản Miễn Phí (Free)</th>
                  <th className="py-4 px-6 font-serif text-center bg-[#163D37] text-[#D9B76A]">
                    Hội Viên Pro (39k)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-white/10">
                <tr>
                  <td className="py-3.5 px-6 font-medium">Trò chuyện chuyên sâu với AI Cultural Companion</td>
                  <td className="py-3.5 px-6 text-center text-stone-400">Không hỗ trợ</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    Không giới hạn
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">Kho bài đọc song ngữ 3 miền</td>
                  <td className="py-3.5 px-6 text-center text-stone-600 dark:text-stone-300">15 bài mẫu</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    Trọn vẹn 63 tỉnh thành
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">Tốc độ audio & Giọng đọc Gemini</td>
                  <td className="py-3.5 px-6 text-center text-stone-600 dark:text-stone-300">Chỉ 1x</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    0.5x, 0.8x, 1x (Gemini Voices)
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">Sổ tay lưu từ vựng cá nhân</td>
                  <td className="py-3.5 px-6 text-center text-stone-600 dark:text-stone-300">Tối đa 30 từ</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    Không giới hạn
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">Lưu trữ Mộc Son & Daily Streak lên đám mây</td>
                  <td className="py-3.5 px-6 text-center text-stone-600 dark:text-stone-300">Lưu tạm Local</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    Đồng bộ vĩnh viễn
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">Quảng cáo hiển thị</td>
                  <td className="py-3.5 px-6 text-center text-rose-500">Có banner</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    100% Không quảng cáo
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PricingPage;
