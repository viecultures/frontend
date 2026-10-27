import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  X,
  Crown,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Volume2,
  Bot,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { getIsProUser } from '@/utils/auth-storage';
import { PATHS } from '@/routes/paths';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  const [isPro, setLocalIsPro] = useState<boolean>(getIsProUser());
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    setLocalIsPro(getIsProUser());
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const handleSubChange = () => setLocalIsPro(getIsProUser());
    window.addEventListener('subscription:change', handleSubChange);
    window.addEventListener('auth:change', handleSubChange);
    return () => {
      window.removeEventListener('subscription:change', handleSubChange);
      window.removeEventListener('auth:change', handleSubChange);
    };
  }, []);

  const handleSelectPro = () => {
    navigate(PATHS.checkout);
  };

  return (
    <div className="w-full text-ink-soft dark:text-warm-ivory font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Top Back Action */}
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-heritage-green dark:text-antique-gold hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang trước</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-heritage-green/10 dark:bg-antique-gold/10 border border-antique-gold/40 text-heritage-green dark:text-antique-gold text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5" />
            <span>Bảng Giá & Đặc Quyền Hội Viên</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-heritage-green dark:text-warm-ivory tracking-tight">
            Nâng Tầm Tiếng Anh Cùng Di Sản Việt
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
            Lựa chọn gói đồng hành phù hợp để mở khóa toàn diện kho bài đọc 63 tỉnh thành và đàm đạo không giới hạn cùng trợ lý văn hóa AI.
          </p>

          {/* Billing Toggle (Tháng / Năm) */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <div className="bg-heritage-green/10 dark:bg-white/10 p-1 rounded-2xl inline-flex items-center border border-antique-gold/30 text-xs font-bold">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-heritage-green text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-heritage-green'
                }`}
              >
                Gói Hàng Tháng
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-heritage-green text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-heritage-green'
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
          <div className="bg-rice-paper dark:bg-[#141C1A] border-2 border-stone-300 dark:border-white/10 rounded-3xl p-6 sm:p-10 flex flex-col justify-between shadow-md transition-all">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Gói Khởi Điểm
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-green dark:text-white">
                  Bản Miễn Phí (Free)
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Dành cho người mới bắt đầu làm quen với phương pháp đọc song ngữ.
                </p>
              </div>

              <div className="py-2 border-y border-stone-300/60 dark:border-white/10">
                <div className="font-serif text-4xl font-extrabold text-heritage-green dark:text-antique-gold">
                  0 VNĐ
                </div>
                <span className="text-xs text-stone-500">Miễn phí vĩnh viễn</span>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3.5 text-xs sm:text-sm">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>3 lượt đàm thoại AI/ngày</strong> (3 AI chat turns/day)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>1-Click Save</strong> lưu từ vựng kèm ngữ cảnh câu (tối đa 30 từ)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>15 bài đọc di sản văn hóa mẫu cơ bản</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Audio Shadowing tốc độ chuẩn (1x)</span>
                </li>
                <li className="flex items-center gap-3 opacity-60">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Không nhận xét cá nhân hóa từ Mascot di sản</span>
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
          <div className="relative bg-heritage-forest text-warm-ivory border-4 border-antique-gold rounded-3xl p-6 sm:p-10 flex flex-col justify-between shadow-2xl transition-all transform hover:scale-[1.01]">
            {/* Best Value Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#9E2A2B] text-white border border-antique-gold text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
              <span>Được Khuyên Dùng Nhất</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-antique-gold">
                  Trải Nghiệm Toàn Diện
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                  <span>Hội Viên Di Sản Pro</span>
                  <Crown className="w-6 h-6 text-antique-gold fill-current" />
                </h3>
                <p className="text-xs text-stone-300">
                  Mở khóa trọn vẹn sức mạnh học tiếng Anh qua văn hóa và đàm thoại AI chuyên sâu.
                </p>
              </div>

              <div className="py-2 border-y border-white/10">
                <div className="font-serif text-4xl font-extrabold text-antique-gold">
                  {billingCycle === 'monthly' ? '39.000 VNĐ' : '375.000 VNĐ'}
                </div>
                <span className="text-xs text-white/70">
                  {billingCycle === 'monthly' ? 'Thanh toán mỗi tháng' : 'Tiết kiệm ~2 tháng học'}
                </span>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3.5 text-xs sm:text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-antique-gold shrink-0 mt-0.5" />
                  <span><strong>Đàm đạo sâu cùng AI Cultural Companion:</strong> Trò chuyện không giới hạn bằng tiếng Anh, dỡ bỏ hoàn toàn giới hạn 3 lượt/ngày.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-antique-gold shrink-0 mt-0.5" />
                  <span><strong>Nhận xét & phản hồi cá nhân hóa từ Mascot di sản:</strong> Đánh giá phát âm, vốn từ và gợi ý phát triển phản xạ theo ngữ cảnh văn hóa.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-antique-gold shrink-0 mt-0.5" />
                  <span><strong>Mở khóa trọn bộ 63 tỉnh thành:</strong> Tiếp cận toàn bộ kho tàng danh lam, phong tục và di sản phi vật thể UNESCO.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-antique-gold shrink-0 mt-0.5" />
                  <span><strong>Đầy đủ 3 dải tốc độ audio (0.5x, 0.8x, 1x):</strong> Google Gemini Real Audio đọc tự nhiên như người bản xứ.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-antique-gold shrink-0 mt-0.5" />
                  <span><strong>Không giới hạn 1-Click Save & Sổ tay từ vựng:</strong> Lưu và đồng bộ tiến trình học tập vĩnh viễn trên đám mây.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-antique-gold shrink-0 mt-0.5" />
                  <span><strong>100% Không quảng cáo & Nhận Huy Hiệu Pro.</strong></span>
                </li>
              </ul>
            </div>

            <div className="pt-8 space-y-2">
              {isPro ? (
                <div className="w-full py-4 rounded-2xl bg-heritage-green border border-antique-gold text-antique-gold font-serif font-bold text-center text-sm shadow-md flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Bạn Đang Là Hội Viên Pro</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSelectPro}
                  className="w-full py-4 rounded-2xl bg-[#9E2A2B] hover:bg-[#852223] text-white font-serif font-bold text-sm sm:text-base shadow-xl border border-antique-gold transition-all transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5 text-antique-gold" />
                  <span>Nâng Cấp Gói Pro Ngay (39.000đ)</span>
                  <ArrowRight className="w-4 h-4 text-antique-gold" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Feature Comparison Table (matching system_constants.md) */}
        <section className="pt-8 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-heritage-green dark:text-warm-ivory">
              Bảng So Sánh Quyền Lợi Chi Tiết
            </h3>
            <p className="text-xs text-stone-500">
              Đối chiếu minh bạch theo chuẩn kiến trúc hệ thống VieCultures
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-antique-gold/30 bg-white dark:bg-[#141C1A] shadow-md">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead>
                <tr className="bg-heritage-green text-white border-b border-antique-gold/30">
                  <th className="py-4 px-6 font-serif">Tính Năng / Đặc Quyền</th>
                  <th className="py-4 px-6 font-serif text-center">Bản Miễn Phí (Free)</th>
                  <th className="py-4 px-6 font-serif text-center bg-heritage-dark text-antique-gold">
                    Hội Viên Pro (39k)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-white/10">
                <tr>
                  <td className="py-3.5 px-6 font-medium">Trò chuyện chuyên sâu với AI Cultural Companion</td>
                  <td className="py-3.5 px-6 text-center text-stone-600 dark:text-stone-300">3 lượt / ngày (3 turns/day)</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    Không giới hạn (Unlimited)
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">Nhận xét & phản hồi cá nhân hóa từ Mascot di sản</td>
                  <td className="py-3.5 px-6 text-center text-stone-400">Mẫu cơ bản mặc định</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    Cá nhân hóa chuyên sâu
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">1-Click Save lưu từ vựng kèm ngữ cảnh câu</td>
                  <td className="py-3.5 px-6 text-center text-stone-600 dark:text-stone-300">Tối đa 30 từ</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    Không giới hạn
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">Kho bài đọc song ngữ 3 miền</td>
                  <td className="py-3.5 px-6 text-center text-stone-600 dark:text-stone-300">15 bài mẫu cơ bản</td>
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
