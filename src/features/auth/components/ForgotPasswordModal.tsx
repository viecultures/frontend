import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, KeyRound, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';
import { authMailService } from '@/services/authMailService';
import type { AppLanguage } from '@/context/SettingsContext';
import { authCopy } from '../authCopy';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  language: AppLanguage;
  onClose: () => void;
  initialEmail?: string;
  onSuccessLogin?: (email: string) => void;
}

type Step = 'EMAIL' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS';

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  language,
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
  const copy = authCopy[language].forgot;
  const serviceMessage = (message: string | undefined, fallback: string) =>
    language === 'vi' ? message || fallback : fallback;

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

  useEffect(() => {
    setErrorMessage('');
    setSuccessMessage('');
  }, [language]);

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
      setErrorMessage(copy.emailRequired);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await authMailService.sendForgotPasswordOtp(email);
      if (res.success) {
        setSuccessMessage(serviceMessage(res.message, copy.otpSent));
        setCooldown(res.cooldownSeconds || 60);
        setStep('OTP');
      } else {
        setErrorMessage(serviceMessage(res.message, copy.sendFailed));
        if (res.cooldownSeconds && res.cooldownSeconds > 0) {
          setCooldown(res.cooldownSeconds);
        }
      }
    } catch (err: any) {
      setErrorMessage(serviceMessage(err.message, copy.sendFailed));
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
      setErrorMessage(copy.otpRequired);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await authMailService.verifyForgotPasswordOtp(email, currentOtp);
      if (res.success && res.verified) {
        setSuccessMessage(serviceMessage(res.message, copy.otpVerified));
        setStep('NEW_PASSWORD');
      } else {
        setErrorMessage(serviceMessage(res.message, copy.otpInvalid));
      }
    } catch (err: any) {
      setErrorMessage(serviceMessage(err.message, copy.verifyFailed));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 3: Reset Password ───────────────────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMessage(copy.passwordTooShort);
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage(copy.passwordMismatch);
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
        setErrorMessage(serviceMessage(res.message, copy.resetFailed));
      }
    } catch (err: any) {
      setErrorMessage(serviceMessage(err.message, copy.resetFailed));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" lang={language}>
      {/* Ambient background glow */}
      <div className="absolute w-[500px] h-[500px] bg-heritage-green/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-heritage-forest border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={copy.close}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-antique-bright/10 border border-antique-bright/30 text-antique-bright text-xs font-semibold uppercase tracking-wider mb-2">
            <KeyRound className="w-3.5 h-3.5" />
            <span>{copy.kicker}</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-white">
            {step === 'EMAIL' && copy.emailTitle}
            {step === 'OTP' && copy.otpTitle}
            {step === 'NEW_PASSWORD' && copy.passwordTitle}
            {step === 'SUCCESS' && copy.successTitle}
          </h2>
          <p className="text-xs sm:text-sm text-white/70 mt-1">
            {step === 'EMAIL' && copy.emailIntro}
            {step === 'OTP' && copy.otpIntro(email)}
            {step === 'NEW_PASSWORD' && copy.passwordIntro}
            {step === 'SUCCESS' && copy.successIntro}
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
                {copy.accountEmail}
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
                  <span>{copy.sending}</span>
                </>
              ) : cooldown > 0 ? (
                <span>{copy.resendIn(cooldown)}</span>
              ) : (
                <>
                  <span>{copy.sendOtp}</span>
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
                {copy.otpLabel(email)}
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
                  <span>{copy.verifying}</span>
                </>
              ) : (
                <>
                  <span>{copy.confirmOtp}</span>
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
                {copy.changeEmail}
              </button>
              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={cooldown > 0 || isLoading}
                className="text-antique-bright hover:underline disabled:opacity-50 disabled:no-underline font-medium flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{cooldown > 0 ? copy.resendIn(cooldown) : copy.resendOtp}</span>
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3: Enter New Password ─────────────────────────────────── */}
        {step === 'NEW_PASSWORD' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-white/80 uppercase tracking-wider mb-1" htmlFor="new-pass">
                {copy.newPassword}
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
                  placeholder={copy.passwordPlaceholder}
                  required
                  autoFocus
                  className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-antique-bright focus:ring-1 focus:ring-antique-bright transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-white/80 uppercase tracking-wider mb-1" htmlFor="confirm-pass">
                {copy.confirmPassword}
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
                  placeholder={copy.confirmPlaceholder}
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
                  <span>{copy.saving}</span>
                </>
              ) : (
                <>
                  <span>{copy.savePassword}</span>
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
              {copy.successMessage}
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onSuccessLogin) onSuccessLogin(email);
              }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-antique-bright to-antique-gold text-heritage-forest font-bold rounded-xl text-sm shadow-lg hover:brightness-105 transition-all"
            >
              {copy.loginNow}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
