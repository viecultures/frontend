import React, { useState, useEffect, useRef } from 'react';
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
  Clock,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  MapPin,
  Bot,
} from 'lucide-react';
import { setIsProUser, getStoredUser, getIsProUser } from '@/utils/auth-storage';
import { PATHS } from '@/routes/paths';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getStoredUser();

  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'momo'>('bank');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingMessage, setProcessingMessage] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(() => getIsProUser());

  // 15-minute countdown timer (900 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(900);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [qrLoaded, setQrLoaded] = useState<boolean>(false);

  // Generate a distinct and professional transfer memo
  const [transferCode, setTransferCode] = useState<string>(() => {
    const userSlug = currentUser?.name
      ? currentUser.name.trim().split(/\s+/).pop()?.toUpperCase() || 'MEMBER'
      : 'MEMBER';
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `PRO_${userSlug}_${rand}`;
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Run countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Reset QR and timer
  const handleResetTimer = () => {
    const userSlug = currentUser?.name
      ? currentUser.name.trim().split(/\s+/).pop()?.toUpperCase() || 'MEMBER'
      : 'MEMBER';
    const rand = Math.floor(1000 + Math.random() * 9000);
    setTransferCode(`PRO_${userSlug}_${rand}`);
    setTimeLeft(900);
    setQrLoaded(false);
  };

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  // Instant simulation of VietQR bank transfer (Demo testing button)
  const handleSimulateInstantTransfer = () => {
    setIsProcessing(true);
    setProcessingMessage('Đang kết nối cổng thanh toán VietQR & lắng nghe Webhook...');

    setTimeout(() => {
      setProcessingMessage('Đã nhận biến động số dư (+39.000 VNĐ)! Đang nâng cấp tài khoản Pro...');
    }, 500);

    setTimeout(() => {
      // Instant transition to Pro status upon payment confirmation; lifts the 3 turns/day AI rate limit immediately
      setIsProUser(true);
      setIsProcessing(false);
      setProcessingMessage('');
      setPaymentSuccess(true);
    }, 1100);
  };

  // Standard manual confirmation
  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setProcessingMessage('Đang kiểm tra giao dịch chuyển khoản trên hệ thống...');
    setTimeout(() => {
      setIsProUser(true);
      setIsProcessing(false);
      setProcessingMessage('');
      setPaymentSuccess(true);
    }, 800);
  };

  // VietQR Quick Link MB Bank
  const vietQrUrl = `https://img.vietqr.io/image/MB-0388912345-compact2.png?amount=39000&addInfo=${encodeURIComponent(
    transferCode
  )}&accountName=CONG%20TY%20CO%20PHAN%20VIECULTURES`;

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
            Quét mã VietQR chuyển khoản nhanh 24/7 để mở khóa đàm thoại không giới hạn cùng trợ lý AI và trọn vẹn 63 tỉnh thành.
          </p>
        </div>

        {paymentSuccess ? (
          /* Payment Success Confirmation View */
          <div className="max-w-2xl mx-auto bg-heritage-forest text-warm-ivory border-4 border-antique-gold rounded-3xl p-8 sm:p-12 text-center shadow-2xl space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 mx-auto rounded-full bg-antique-gold text-heritage-forest flex items-center justify-center shadow-lg animate-bounce">
              <Crown className="w-10 h-10 fill-current" />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4" />
                <span>GIAO DỊCH THÀNH CÔNG • PRO ACTIVATED</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Chào Mừng Bạn Đến Với Gói Pro!
              </h2>
              <p className="text-xs sm:text-sm text-stone-200 max-w-lg mx-auto leading-relaxed">
                Tài khoản <strong className="text-antique-gold">{currentUser?.name || 'Hội viên'}</strong> đã được nâng cấp lên <strong>Hội Viên Di Sản Pro</strong> thành công. Giới hạn 3 lượt/ngày của trợ lý AI đã được dỡ bỏ hoàn toàn.
              </p>
            </div>

            {/* Unlocked Perks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
              <div className="p-3.5 rounded-2xl bg-black/25 border border-antique-gold/30 space-y-1">
                <div className="flex items-center gap-2 text-antique-gold font-bold text-xs">
                  <Bot className="w-4 h-4" />
                  <span>AI Companion</span>
                </div>
                <p className="text-[11px] text-stone-300">Đàm thoại không giới hạn, không còn rate limit.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/25 border border-antique-gold/30 space-y-1">
                <div className="flex items-center gap-2 text-antique-gold font-bold text-xs">
                  <MapPin className="w-4 h-4" />
                  <span>Kho Bài Đọc</span>
                </div>
                <p className="text-[11px] text-stone-300">Mở khóa trọn bộ 63 tỉnh thành & di sản 3 miền.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/25 border border-antique-gold/30 space-y-1">
                <div className="flex items-center gap-2 text-antique-gold font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Âm Thanh & Từ Vựng</span>
                </div>
                <p className="text-[11px] text-stone-300">Đủ 3 tốc độ (0.5x, 0.8x, 1x) & sổ tay không giới hạn.</p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
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
                onClick={() => navigate(PATHS.discovery)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-heritage-green/60 hover:bg-heritage-green text-antique-gold border border-antique-gold/40 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>Khám Phá Bản Đồ 63 Tỉnh</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(PATHS.home)}
                className="w-full sm:w-auto px-5 py-3.5 rounded-full border border-white/20 text-stone-300 hover:text-white hover:bg-white/5 text-xs font-bold transition-all cursor-pointer"
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
                  <span>Gói Hội Viên Di Sản Pro</span>
                  <Crown className="w-4 h-4 text-antique-gold fill-current" />
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Chu kỳ thanh toán: <strong>1 Tháng (Tự động kích hoạt)</strong>
                </p>
              </div>

              {/* Price Details */}
              <div className="space-y-2 py-2">
                <div className="flex justify-between text-xs text-stone-600 dark:text-stone-300">
                  <span>Giá niêm yết:</span>
                  <span className="line-through">69.000 VNĐ</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-600 font-bold">
                  <span>Ưu đãi Checkpoint 4 (EXE101):</span>
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
                  Đặc quyền được mở khóa ngay:
                </span>
                <ul className="text-xs space-y-2.5 text-stone-700 dark:text-stone-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Không giới hạn lượt đàm thoại cùng AI Cultural Companion</strong> (Dỡ bỏ hạn mức 3 lượt/ngày)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Nhận xét cá nhân hóa từ Mascot di sản</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Mở khóa toàn bộ 63 tỉnh thành bài đọc di sản</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Đủ 3 tốc độ audio (0.5x, 0.8x, 1x) Google Gemini Real Audio</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>100% Không có banner quảng cáo</strong></span>
                  </li>
                </ul>
              </div>

              <div className="p-3.5 bg-rice-paper dark:bg-black/20 rounded-2xl border border-antique-gold/30 flex items-center gap-2.5 text-xs text-stone-600 dark:text-stone-300">
                <ShieldCheck className="w-5 h-5 text-heritage-green dark:text-antique-gold shrink-0" />
                <span>Bảo mật giao dịch chuyển khoản VietQR theo tiêu chuẩn Ngân Hàng Nhà Nước.</span>
              </div>
            </div>

            {/* Right Column: Payment Gateway / VietQR Mock Presentation */}
            <div className="lg:col-span-7 bg-heritage-forest text-warm-ivory border-4 border-antique-gold rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-antique-gold">
                    CỔNG THANH TOÁN VIETQR
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Quét Mã Để Kích Hoạt Tức Thì
                  </h3>
                </div>

                {/* Countdown Timer Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/40 border border-antique-gold/40 text-xs font-mono">
                  <Clock className={`w-3.5 h-3.5 ${timeLeft < 180 ? 'text-rose-400 animate-pulse' : 'text-antique-gold'}`} />
                  <span className="text-stone-300">Hiệu lực:</span>
                  <strong className={timeLeft < 180 ? 'text-rose-400' : 'text-antique-gold'}>
                    {formatTime(timeLeft)}
                  </strong>
                </div>
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
                  <span>VietQR / MB Bank</span>
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
                    <span>Cổng Tự Động Ghi Nhận Chuyển Khoản</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-heritage-green">
                    {paymentMethod === 'bank' ? 'VietQR MB Bank 24/7' : 'Ví MoMo Chuyển Tiền'}
                  </h4>
                </div>

                {/* QR Code Presentation with live VietQR & SVG fallback */}
                <div className="w-56 h-56 mx-auto bg-stone-50 border-2 border-heritage-green/30 p-2.5 rounded-2xl flex items-center justify-center shadow-inner relative group overflow-hidden">
                  {timeLeft > 0 ? (
                    <>
                      <img
                        src={vietQrUrl}
                        alt="Mã thanh toán VietQR gói Pro"
                        className={`w-full h-full object-contain rounded-xl transition-opacity duration-300 ${
                          qrLoaded ? 'opacity-100' : 'opacity-0 absolute'
                        }`}
                        onLoad={() => setQrLoaded(true)}
                      />
                      {!qrLoaded && (
                        <div className="flex flex-col items-center justify-center p-3 text-center space-y-2">
                          <QrCode className="w-28 h-28 text-heritage-green animate-pulse" />
                          <span className="text-[10px] text-stone-500 font-mono">Đang tải mã VietQR...</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <AlertCircle className="w-10 h-10 text-rose-500" />
                      <span className="text-xs font-bold text-rose-600">Mã QR đã hết hiệu lực</span>
                      <button
                        type="button"
                        onClick={handleResetTimer}
                        className="px-3 py-1.5 rounded-xl bg-heritage-green text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shadow hover:bg-heritage-dark"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Tạo mã mới</span>
                      </button>
                    </div>
                  )}

                  {timeLeft > 0 && qrLoaded && (
                    <div className="absolute inset-0 bg-heritage-green/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                      <span className="text-[11px] font-bold bg-white text-stone-900 px-3 py-1 rounded-full shadow border border-stone-200">
                        Quét bằng App Ngân Hàng
                      </span>
                    </div>
                  )}
                </div>

                {/* Account Details with Copy Buttons */}
                <div className="bg-stone-50 rounded-2xl p-4 text-xs space-y-2.5 border border-stone-200 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">Ngân hàng thụ hưởng:</span>
                    <strong className="text-stone-900">MB Bank (Quân Đội)</strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">Số tài khoản:</span>
                    <div className="flex items-center gap-1.5">
                      <strong className="font-mono text-stone-900 text-sm">0388912345</strong>
                      <button
                        type="button"
                        onClick={() => handleCopy('0388912345', 'account')}
                        className="p-1 rounded hover:bg-stone-200 text-stone-500 cursor-pointer transition-colors"
                        title="Sao chép số tài khoản"
                      >
                        {copiedField === 'account' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">Tên người nhận:</span>
                    <strong className="text-stone-900">CONG TY CO PHAN VIECULTURES</strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">Số tiền:</span>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-[#9E2A2B] font-bold text-sm">39.000 VNĐ</strong>
                      <button
                        type="button"
                        onClick={() => handleCopy('39000', 'amount')}
                        className="p-1 rounded hover:bg-stone-200 text-stone-500 cursor-pointer transition-colors"
                        title="Sao chép số tiền"
                      >
                        {copiedField === 'amount' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1.5 border-t border-stone-200">
                    <span className="text-stone-500">Nội dung chuyển khoản:</span>
                    <div className="flex items-center gap-1.5">
                      <strong className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">
                        {transferCode}
                      </strong>
                      <button
                        type="button"
                        onClick={() => handleCopy(transferCode, 'memo')}
                        className="p-1 rounded hover:bg-stone-200 text-stone-500 cursor-pointer transition-colors"
                        title="Sao chép nội dung chuyển khoản"
                      >
                        {copiedField === 'memo' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Processing status banner */}
                {isProcessing && (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-700" />
                    <span className="font-medium">{processingMessage}</span>
                  </div>
                )}

                {/* Primary Demo Simulation Button (Required for Testing) */}
                <div className="pt-2 space-y-2.5">
                  <button
                    type="button"
                    onClick={handleSimulateInstantTransfer}
                    disabled={isProcessing}
                    className="w-full py-4 rounded-full bg-[#9E2A2B] hover:bg-[#822122] text-white font-serif font-bold text-xs sm:text-sm shadow-xl border-2 border-antique-gold transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.01] disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 text-antique-gold fill-current" />
                    <span>Mô Phỏng Chuyển Khoản Tức Thì (Simulate Instant Transfer)</span>
                  </button>

                  {/* Standard manual verification button */}
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    disabled={isProcessing}
                    className="w-full py-3 rounded-full bg-heritage-green hover:bg-heritage-dark text-white font-serif font-bold text-xs shadow-md border border-antique-gold/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-antique-gold" />
                    <span>Xác Nhận Đã Thanh Toán Xong (Thủ Công)</span>
                  </button>
                </div>
              </div>

              <div className="text-center space-y-1">
                <p className="text-[11px] text-stone-300">
                  ⚡ <strong>Nút Mô Phỏng:</strong> Giúp hội đồng & giảng viên kiểm thử luồng thanh toán tức thì mà không cần chuyển tiền thật.
                </p>
                <p className="text-[10px] text-stone-400">
                  Hệ thống tự động đồng bộ quyền hạn Hội Viên Pro ngay khi giao dịch thành công.
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
