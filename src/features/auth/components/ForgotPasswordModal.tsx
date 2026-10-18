import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, KeyRound, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';
import { authMailService } from '@/services/authMailService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onSuccessLogin?: (email: string) => void;
}

type Step = 'EMAIL' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS';

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
  onSuccessLogin,
}) => {
  const [step, setStep] = useState<Step>('EMAIL');
  const [email, setEmail] = useState(initialEmail);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail);
      setStep('EMAIL');
      setOtpDigits(['', '', '', '', '', '']);
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen, initialEmail]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const currentOtp = otpDigits.join('');

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────────
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ email của bạn.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await authMailService.sendForgotPasswordOtp(email);
      if (res.success) {
        setSuccessMessage(res.message);
        setCooldown(res.cooldownSeconds || 60);
        setStep('OTP');
      } else {
        setErrorMessage(res.message);
        if (res.cooldownSeconds && res.cooldownSeconds > 0) {
          setCooldown(res.cooldownSeconds);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể gửi email lúc này. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: Handle OTP Input & Verify ─────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const nextDigits = [...otpDigits];
    nextDigits[index] = value.slice(-1);
    setOtpDigits(nextDigits);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;
    const nextDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      nextDigits[i] = pastedData[i] || '';
    }
    setOtpDigits(nextDigits);
    const lastFilled = Math.min(pastedData.length, 5);
    otpInputRefs.current[lastFilled]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentOtp.length < 6) {
      setErrorMessage('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await authMailService.verifyForgotPasswordOtp(email, currentOtp);
      if (res.success && res.verified) {
        setSuccessMessage(res.message);
        setStep('NEW_PASSWORD');
      } else {
        setErrorMessage(res.message || 'Mã OTP không chính xác.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Xác thực OTP thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 3: Reset Password ───────────────────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMessage('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await authMailService.resetPassword(email, currentOtp, newPassword);
      if (res.success) {
        setStep('SUCCESS');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Ambient background glow */}
      <div className="absolute w-[500px] h-[500px] bg-heritage-green/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-heritage-forest border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-antique-bright/10 border border-antique-bright/30 text-antique-bright text-xs font-semibold uppercase tracking-wider mb-2">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Khôi Phục Tài Khoản</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-white">
            {step === 'EMAIL' && 'Quên Mật Khẩu?'}
            {step === 'OTP' && 'Nhập Mã Xác Thực'}
            {step === 'NEW_PASSWORD' && 'Thiết Lập Mật Khẩu Mới'}
            {step === 'SUCCESS' && 'Đổi Mật Khẩu Thành Công!'}
          </h2>
          <p className="text-xs sm:text-sm text-white/70 mt-1">
            {step === 'EMAIL' && 'Nhập email đã đăng ký. Hệ thống sẽ gửi mã OTP 6 số bảo mật để xác thực.'}
            {step === 'OTP' && `Mã xác thực đã được gửi tới ${email}. Vui lòng kiểm tra hộp thư.`}
            {step === 'NEW_PASSWORD' && 'Tạo mật khẩu mới mạnh mẽ cho tài khoản VieCultures của bạn.'}
            {step === 'SUCCESS' && 'Bạn đã cập nhật mật khẩu mới thành công và có thể đăng nhập ngay.'}
          </p>
        </div>

        {/* Error / Alert Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && step !== 'SUCCESS' && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ── STEP 1: Input Email ────────────────────────────────────────── */}
        {step === 'EMAIL' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-white/80 uppercase tracking-wider mb-1.5" htmlFor="reset-email">
                Email Tài Khoản
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  required
                  autoFocus
                  className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-antique-bright focus:ring-1 focus:ring-antique-bright transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || cooldown > 0}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-antique-bright to-antique-gold text-heritage-forest font-bold rounded-xl text-sm shadow-lg hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang gửi mã OTP...</span>
                </>
              ) : cooldown > 0 ? (
                <span>Gửi lại sau {cooldown}s</span>
              ) : (
                <>
                  <span>Gửi Mã Xác Thực OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ── STEP 2: Input 6 OTP Digits ─────────────────────────────────── */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-center text-xs text-white/70 mb-3">
                Nhập mã 6 chữ số được gửi tới <strong className="text-antique-bright">{email}</strong>
              </label>
              <div className="flex justify-between gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    className="w-12 h-14 text-center text-xl font-bold bg-black/40 border border-white/20 rounded-xl text-antique-bright focus:outline-none focus:border-antique-bright focus:ring-2 focus:ring-antique-bright transition-all"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || currentOtp.length < 6}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-antique-bright to-antique-gold text-heritage-forest font-bold rounded-xl text-sm shadow-lg hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang kiểm tra...</span>
                </>
              ) : (
                <>
                  <span>Xác Nhận Mã OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs text-white/60 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep('EMAIL')}
                className="hover:text-white underline underline-offset-2"
              >
                Đổi email khác
              </button>
              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={cooldown > 0 || isLoading}
                className="text-antique-bright hover:underline disabled:opacity-50 disabled:no-underline font-medium flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{cooldown > 0 ? `Gửi lại sau ${cooldown}s` : 'Gửi lại mã'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3: Enter New Password ─────────────────────────────────── */}
        {step === 'NEW_PASSWORD' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-white/80 uppercase tracking-wider mb-1" htmlFor="new-pass">
                Mật Khẩu Mới
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="new-pass"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  autoFocus
                  className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-antique-bright focus:ring-1 focus:ring-antique-bright transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-white/80 uppercase tracking-wider mb-1" htmlFor="confirm-pass">
                Xác Nhận Mật Khẩu Mới
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirm-pass"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-antique-bright focus:ring-1 focus:ring-antique-bright transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-antique-bright to-antique-gold text-heritage-forest font-bold rounded-xl text-sm shadow-lg hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang lưu mật khẩu mới...</span>
                </>
              ) : (
                <>
                  <span>Lưu Mật Khẩu Mới</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ── STEP 4: Success Screen ─────────────────────────────────────── */}
        {step === 'SUCCESS' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-sm text-white/80">
              Mật khẩu đã được cập nhật thành công. Email xác nhận an toàn đã được gửi tới hộp thư của bạn.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onSuccessLogin) onSuccessLogin(email);
              }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-antique-bright to-antique-gold text-heritage-forest font-bold rounded-xl text-sm shadow-lg hover:brightness-105 transition-all"
            >
              Đăng Nhập Ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
