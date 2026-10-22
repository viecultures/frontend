import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Crown,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Sparkles,
  Zap,
  BookOpen,
  ArrowRight,
  CreditCard,
  Smartphone,
} from 'lucide-react';
import { setIsProUser, getStoredUser } from '@/utils/auth-storage';
import { PATHS } from '@/routes/paths';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getStoredUser();

  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'momo'>('bank');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const transferCode = `PRO_${currentUser ? currentUser.name.replace(/\s+/g, '').slice(0, 6).toUpperCase() : 'MEMBER'}_${Math.floor(1000 + Math.random() * 9000)}`;

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProUser(true);
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 750);
  };

  return (
    <div className="w-full text-ink-soft dark:text-warm-ivory font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Top Back Action */}
        <div>
          <button
            type="button"
            onClick={() => navigate(PATHS.pricing)}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-heritage-green dark:hover:text-antique-gold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Bảng Giá</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-forest text-antique-gold text-xs font-bold uppercase tracking-wider border border-antique-gold">
            <Crown className="w-3.5 h-3.5 fill-current" />
            <span>Thanh Toán Đăng Ký Gói Pro</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-heritage-green dark:text-warm-ivory">
            Xác Nhận Nâng Cấp Hội Viên Di Sản
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl mx-auto">
            Quét mã QR để kích hoạt đặc quyền trò chuyện cùng AI Cultural Companion không giới hạn và mở khóa trọn bộ 63 tỉnh thành.
          </p>
        </div>

        {paymentSuccess ? (
          /* Payment Success Confirmation View */
          <div className="max-w-xl mx-auto bg-heritage-forest text-warm-ivory border-4 border-antique-gold rounded-3xl p-8 sm:p-10 text-center shadow-2xl space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 mx-auto rounded-full bg-antique-gold text-heritage-forest flex items-center justify-center shadow-lg animate-bounce">
              <Crown className="w-10 h-10 fill-current" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-antique-gold">
                GIAO DỊCH THÀNH CÔNG
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Chào Mừng Bạn Đến Với Gói Pro!
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
                Tài khoản của bạn đã được nâng cấp lên <strong>Hội Viên Di Sản Pro</strong>. Toàn bộ đặc quyền đàm đạo cùng AI đã sẵn sàng.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate(PATHS.reader)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#9E2A2B] hover:bg-[#852223] text-white font-serif font-bold text-xs sm:text-sm shadow-xl border border-antique-gold transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-105"
              >
                <BookOpen className="w-4 h-4 text-antique-gold" />
                <span>Vào Bài Đọc & Đàm Đạo AI Ngay</span>
                <ArrowRight className="w-4 h-4 text-antique-gold" />
              </button>

              <button
                type="button"
                onClick={() => navigate(PATHS.home)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/20 text-stone-300 hover:text-white hover:bg-white/5 text-xs font-bold transition-all cursor-pointer"
              >
                Về Trang Chủ
              </button>
            </div>
          </div>
        ) : (
          /* Two Column Checkout Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Order Summary */}
            <div className="lg:col-span-5 bg-white dark:bg-[#152320] border-2 border-antique-gold/50 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
              <div className="pb-4 border-b border-stone-200 dark:border-white/10 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  ĐƠN HÀNG CỦA BẠN
                </span>
                <h3 className="font-serif text-xl font-bold text-heritage-green dark:text-warm-ivory flex items-center gap-2">
                  <span>Gói Hội Viên Pro</span>
                  <Crown className="w-4 h-4 text-antique-gold fill-current" />
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Chu kỳ thanh toán: <strong>1 Tháng</strong>
                </p>
              </div>

              {/* Price Details */}
              <div className="space-y-2 py-2">
                <div className="flex justify-between text-xs text-stone-600 dark:text-stone-300">
                  <span>Giá niêm yết:</span>
                  <span className="line-through">69.000 VNĐ</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-600 font-bold">
                  <span>Ưu đãi Checkpoint 4:</span>
                  <span>-30.000 VNĐ</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-stone-200 dark:border-white/10">
                  <span className="font-serif font-bold text-sm text-heritage-green dark:text-white">
                    Tổng thanh toán:
                  </span>
                  <span className="font-serif text-2xl font-black text-[#9E2A2B] dark:text-antique-gold">
                    39.000 VNĐ
                  </span>
                </div>
              </div>

              {/* Benefits list */}
              <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                  Đặc quyền bao gồm:
                </span>
                <ul className="text-xs space-y-2.5 text-stone-700 dark:text-stone-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Đàm đạo sâu cùng AI Cultural Companion</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Mở khóa toàn bộ 63 tỉnh thành bài đọc</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Giọng đọc bản ngữ Google Gemini Real Audio</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% Không có banner quảng cáo</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-rice-paper dark:bg-black/20 rounded-2xl border border-antique-gold/30 flex items-center gap-2.5 text-xs text-stone-600 dark:text-stone-300">
                <ShieldCheck className="w-5 h-5 text-heritage-green dark:text-antique-gold shrink-0" />
                <span>Bảo mật giao dịch VietQR tiêu chuẩn Ngân hàng Nhà nước.</span>
              </div>
            </div>

            {/* Right Column: Payment Gateway / QR Code */}
            <div className="lg:col-span-7 bg-heritage-forest text-warm-ivory border-4 border-antique-gold rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-antique-gold">
                  PHƯƠNG THỨC THANH TOÁN
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Quét Mã Để Hoàn Tất
                </h3>
              </div>

              {/* Method Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    paymentMethod === 'bank'
                      ? 'bg-antique-gold text-heritage-forest shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>VietQR / Ngân Hàng</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('momo')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    paymentMethod === 'momo'
                      ? 'bg-antique-gold text-heritage-forest shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Ví Điện Tử MoMo</span>
                </button>
              </div>

              {/* QR Code Presentation Box */}
              <div className="bg-white text-stone-800 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl border-2 border-antique-gold">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Cổng Thanh Toán Tự Động Kích Hoạt</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-heritage-green">
                    {paymentMethod === 'bank' ? 'VietQR MB Bank' : 'Ví Điện Tử MoMo'}
                  </h4>
                </div>

                {/* QR Code Graphic */}
                <div className="w-44 h-44 mx-auto bg-stone-50 border-2 border-stone-800 p-3 rounded-2xl flex items-center justify-center shadow-inner relative group">
                  <QrCode className="w-36 h-36 text-heritage-green" />
                  <div className="absolute inset-0 bg-heritage-green/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                    <span className="text-[10px] font-bold bg-white px-2 py-1 rounded shadow text-stone-800">
                      Quét bằng App Ngân Hàng
                    </span>
                  </div>
                </div>

                {/* Account Details */}
                <div className="bg-stone-50 rounded-2xl p-4 text-xs space-y-2 border border-stone-200 text-left">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Ngân hàng thụ hưởng:</span>
                    <strong className="text-stone-800">MB Bank (Quân Đội)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Số tài khoản:</span>
                    <strong className="font-mono text-stone-900 text-sm">0388912345</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Tên người nhận:</span>
                    <strong className="text-stone-800">CONG TY VIECULTURES</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Số tiền:</span>
                    <strong className="text-[#9E2A2B] font-bold text-sm">39.000 VND</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-stone-200">
                    <span className="text-stone-500">Nội dung chuyển khoản:</span>
                    <strong className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">
                      {transferCode}
                    </strong>
                  </div>
                </div>

                {/* Confirmation Button */}
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-full bg-heritage-green hover:bg-heritage-dark text-white font-serif font-bold text-xs sm:text-sm shadow-xl border border-antique-gold transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.01]"
                >
                  <CheckCircle2 className="w-4 h-4 text-antique-gold" />
                  <span>
                    {isProcessing ? 'Đang Xác Thực Giao Dịch...' : 'Xác Nhận Đã Thanh Toán Xong'}
                  </span>
                </button>
              </div>

              <div className="text-center">
                <p className="text-[11px] text-stone-300">
                  Sau khi quét mã và chuyển khoản thành công, nhấn nút xác nhận để hệ thống mở khóa tính năng ngay lập tức.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
