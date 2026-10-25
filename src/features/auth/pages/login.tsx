import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowUpRight, CheckCircle2, Loader2, Lock, Mail, RefreshCw } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { BrandLogo } from '@/components/BrandLogo';
import { PATHS } from '@/routes/paths';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { authService, backendAuthService, type AuthResult } from '@/services/authService';
import { authMailService } from '@/services/authMailService';
import { isLocalAuthMode } from '@/config/authConfig';
import { setAuthSession, type AppUser } from '@/utils/auth-storage';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal';
import '../login.css';

interface LoginPageProps {
  onLoginSuccess?: (userData: AppUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [registerStep, setRegisterStep] = useState<'form' | 'otp'>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(0);
  const [pendingAuthResult, setPendingAuthResult] = useState<AuthResult | null>(null);

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useAppNavigate();
  const hasGoogleLogin = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const completeLogin = (result: AuthResult) => {
    setAuthSession(result.user, result.token, rememberMe);
    if (onLoginSuccess) {
      onLoginSuccess(result.user);
      return;
    }
    const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
    if (redirectUrl?.startsWith('/') && !redirectUrl.startsWith('//')) {
      window.location.href = redirectUrl;
    } else {
      navigate(PATHS.home);
    }
  };

  const handleGoogleSuccess = async (idToken: string) => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await backendAuthService.loginWithGoogle(idToken);
      completeLogin(result);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Đăng nhập Google thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (authTab === 'login') {
        const result = await authService.login(email, password);
        completeLogin(result);
      } else {
        const result = await authService.register(email, password, fullName);
        setPendingAuthResult(result);
        setRegisterStep('otp');
        setCooldown(60);
        setOtpDigits(['', '', '', '', '', '']);
        setSuccessMessage('Mã xác thực gồm 6 chữ số đã được gửi đến email của bạn.');
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      }
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

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
    for (let i = 0; i < pastedData.length; i++) {
      nextDigits[i] = pastedData[i];
    }
    setOtpDigits(nextDigits);

    const focusIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[focusIndex]?.focus();
  };

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    const otpCode = otpDigits.join('');
    if (otpCode.length < 6) {
      setErrorMessage('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return;
    }

    if (isLoading) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      await authMailService.confirmEmail(email, otpCode);
      if (pendingAuthResult) {
        completeLogin(pendingAuthResult);
      } else {
        const result = await authService.login(email, password);
        completeLogin(result);
      }
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Mã OTP không chính xác hoặc đã hết hạn.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || isLoading) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const response = await authMailService.sendVerifyEmailOtp(email);
      setCooldown(response.cooldownSeconds || 60);
      setSuccessMessage('Đã gửi lại mã OTP. Vui lòng kiểm tra hộp thư của bạn.');
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Không thể gửi lại mã OTP lúc này.');
    } finally {
      setIsLoading(false);
    }
  };

  const changeTab = (tab: 'login' | 'register') => {
    setAuthTab(tab);
    setRegisterStep('form');
    setErrorMessage(null);
    setSuccessMessage(null);
    setOtpDigits(['', '', '', '', '', '']);
  };

  const isOtpStep = authTab === 'register' && registerStep === 'otp';

  return (
    <main className="auth-page">
      <div className="auth-form-panel">
        <header className="auth-topbar">
          <Link to={PATHS.landing} className="auth-brand" aria-label="VieCultures — về trang chủ">
            <BrandLogo size="md" theme="light" />
          </Link>
          <Link to={PATHS.landing} className="auth-back-link">
            <ArrowLeft size={17} aria-hidden="true" /> Trang chủ
          </Link>
        </header>

        <section className="auth-content" aria-labelledby="auth-title">
          <p className="auth-eyebrow">VIECULTURES / FOOD STORIES</p>
          <h1 id="auth-title">
            {isOtpStep
              ? 'Xác thực email'
              : authTab === 'login'
              ? 'Chào mừng trở lại'
              : 'Bắt đầu hành trình của bạn'}
          </h1>
          <p className="auth-intro">
            {isOtpStep
              ? `Nhập mã xác thực gồm 6 chữ số đã được gửi tới ${email} để kích hoạt tài khoản.`
              : authTab === 'login'
              ? 'Đăng nhập để tiếp tục đọc và lưu lại những điều bạn đã học.'
              : 'Tạo tài khoản để tiếp tục khám phá tiếng Anh qua những câu chuyện món ăn Việt.'}
          </p>

          {!isOtpStep && (
            <div className="auth-tabs" role="tablist" aria-label="Hình thức truy cập">
              <button
                id="auth-login-tab"
                type="button"
                role="tab"
                aria-selected={authTab === 'login'}
                aria-controls="auth-panel"
                disabled={isLoading}
                className={authTab === 'login' ? 'is-active' : ''}
                onClick={() => changeTab('login')}
              >
                Đăng nhập
              </button>
              <button
                id="auth-register-tab"
                type="button"
                role="tab"
                aria-selected={authTab === 'register'}
                aria-controls="auth-panel"
                disabled={isLoading}
                className={authTab === 'register' ? 'is-active' : ''}
                onClick={() => changeTab('register')}
              >
                Đăng ký
              </button>
            </div>
          )}

          <div id="auth-panel" role="tabpanel" aria-labelledby={authTab === 'login' ? 'auth-login-tab' : 'auth-register-tab'}>
            {isOtpStep ? (
              <form onSubmit={handleVerifyOtp} className="auth-otp-container">
                <div className="auth-otp-inputs">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpInputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={idx === 0 ? handleOtpPaste : undefined}
                      className="auth-otp-digit"
                      aria-label={`Chữ số thứ ${idx + 1}`}
                      disabled={isLoading}
                      required
                    />
                  ))}
                </div>

                <div className="auth-otp-meta">
                  <span>Chưa nhận được mã?</span>
                  <button
                    type="button"
                    className="auth-resend-btn"
                    disabled={cooldown > 0 || isLoading}
                    onClick={handleResendOtp}
                  >
                    {cooldown > 0 ? `Gửi lại mã (${cooldown}s)` : 'Gửi lại mã OTP'}
                  </button>
                </div>

                {errorMessage && (
                  <div className="auth-error" role="alert">
                    <AlertCircle size={18} aria-hidden="true" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="auth-error" style={{ borderColor: 'var(--color-line)', background: 'var(--color-surface-muted)', color: 'var(--color-ink)' }} role="status">
                    <CheckCircle2 size={18} aria-hidden="true" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <button type="submit" className="auth-submit" disabled={isLoading || otpDigits.join('').length < 6}>
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="auth-spinner" aria-hidden="true" />
                      <span>Đang xác thực...</span>
                    </>
                  ) : (
                    <>
                      <span>Xác nhận & Hoàn tất</span>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="auth-back-step-btn"
                  disabled={isLoading}
                  onClick={() => {
                    setRegisterStep('form');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  <span>Quay lại đổi thông tin</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form">
                {authTab === 'register' && (
                  <div className="auth-field">
                    <label htmlFor="fullName">Họ và tên</label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Nguyễn Văn A"
                      autoComplete="name"
                      required
                    />
                  </div>
                )}

                <div className="auth-field">
                  <label htmlFor="email">Email</label>
                  <div className="auth-input-wrap">
                    <Mail size={18} aria-hidden="true" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="ban@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label htmlFor="password">Mật khẩu</label>
                  <div className="auth-input-wrap">
                    <Lock size={18} aria-hidden="true" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Nhập mật khẩu"
                      autoComplete={authTab === 'login' ? 'current-password' : 'new-password'}
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="auth-options">
                  <label className="auth-remember">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                    />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  {!isLocalAuthMode && authTab === 'login' && (
                    <button
                      type="button"
                      className="auth-inline-link"
                      onClick={() => setIsForgotPasswordOpen(true)}
                    >
                      Quên mật khẩu?
                    </button>
                  )}
                </div>

                {errorMessage && (
                  <div className="auth-error" role="alert">
                    <AlertCircle size={18} aria-hidden="true" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button type="submit" className="auth-submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="auth-spinner" aria-hidden="true" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : authTab === 'login' ? (
                    'Đăng nhập'
                  ) : (
                    'Tạo tài khoản'
                  )}
                  {!isLoading && <ArrowUpRight size={18} aria-hidden="true" />}
                </button>
              </form>
            )}

            {!isOtpStep && hasGoogleLogin && (
              <div className="auth-alternate">
                <div className="auth-divider">
                  <span>HOẶC</span>
                </div>
                <div className="auth-google">
                  {isLoading ? (
                    <div className="auth-google-loading">
                      <Loader2 size={18} className="auth-spinner" aria-hidden="true" />
                      <span>Đang xác thực...</span>
                    </div>
                  ) : (
                    <GoogleLogin
                      onSuccess={(response) =>
                        response.credential
                          ? handleGoogleSuccess(response.credential)
                          : setErrorMessage('Không nhận được mã xác thực Google từ trình duyệt.')
                      }
                      onError={() =>
                        setErrorMessage('Đăng nhập bằng Google không thành công hoặc cửa sổ đăng nhập đã bị đóng.')
                      }
                      theme="outline"
                      shape="rectangular"
                      size="large"
                      text="continue_with"
                      width="100%"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          <p className="auth-guest-note">
            Chỉ muốn xem thử? <Link to={PATHS.discovery}>Khám phá các bài đọc</Link>
          </p>
        </section>
        <p className="auth-footer-note">Học từ món ăn, nhớ qua câu chuyện.</p>
      </div>

      <aside className="auth-story-panel" aria-label="Học tiếng Anh qua món ăn Việt">
        <div className="auth-story-image">
          <img src="/images/series/pho-hanoi.jpg" alt="Bát phở Hà Nội bên hồ Hoàn Kiếm" width="1024" height="576" />
        </div>
        <div className="auth-story-copy">
          <span className="auth-story-kicker">TỪ BÀN ĂN ĐẾN TRANG SÁCH</span>
          <h2>
            Mỗi món ăn mở ra <span>một câu chuyện.</span>
          </h2>
          <p>Đọc, nghe và ghi nhớ tiếng Anh qua những món ăn cùng đời sống quanh chúng.</p>
          <div className="auth-story-line">
            <span>01 / PHỞ HÀ NỘI</span>
            <span>VIECULTURES</span>
          </div>
        </div>
      </aside>

      {isForgotPasswordOpen && (
        <ForgotPasswordModal
          isOpen={isForgotPasswordOpen}
          onClose={() => setIsForgotPasswordOpen(false)}
          initialEmail={email}
          onSuccessLogin={(newEmail) => {
            setEmail(newEmail);
            setIsForgotPasswordOpen(false);
          }}
        />
      )}
    </main>
  );
};

export default LoginPage;
