import React, { useState } from 'react';
import { Mail, Lock, Sparkles, ArrowLeft, CheckCircle2, Crown, Loader2, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { BrandLogo } from '@/components/BrandLogo';
import { PATHS } from '@/routes/paths';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal';
import { authService, type AuthResult } from '@/services/authService';
import { setAuthSession, type AppUser } from '@/utils/auth-storage';
import { isLocalAuthMode } from '@/config/authConfig';
import { localAuthService } from '@/services/localAuthService';

interface LoginPageProps {
  onLoginSuccess?: (userData: AppUser) => void;
}

// ─── Shared input class — design system surfaces ─────────────────────────────────────
const INPUT_CLASS =
  'w-full bg-surface-raised border border-line rounded-xl px-3.5 py-2 text-sm text-ink ' +
  'placeholder-ink-faint transition-all ' +
  'focus:outline-none focus:border-focus focus:ring-1 focus:ring-focus';

const INPUT_WITH_ICON =
  'w-full bg-surface-raised border border-line rounded-xl pl-9 pr-3.5 py-2 text-sm text-ink ' +
  'placeholder-ink-faint transition-all ' +
  'focus:outline-none focus:border-focus focus:ring-1 focus:ring-focus';

const LABEL_CLASS =
  'block text-[11px] font-semibold text-ink-soft uppercase tracking-wider mb-1';

// ─── Component ─────────────────────────────────────────────────────────────────
export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleNavigate = useAppNavigate();

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
      handleNavigate(PATHS.home);
    }
  };

  const handleDemoLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      completeLogin(await localAuthService.loginDemo());
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Không thể đăng nhập. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (idToken: string) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const result = await authService.loginWithGoogle(idToken);

      completeLogin(result);
    } catch (err: unknown) {
      console.error('Google Sign-In failed:', err);
      const msg = err instanceof Error ? err.message : 'Đăng nhập Google thất bại. Vui lòng thử lại sau.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const result = authTab === 'register'
        ? await authService.register(email, password, fullName)
        : await authService.login(email, password);
      completeLogin(result);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Không thể đăng nhập. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Ivory canvas and sky-blue feature panel from the shared design system.
    <div className="h-screen w-full bg-surface text-ink flex flex-col justify-center items-center relative overflow-hidden">

      {/* Ambient lighting — glass-card radial blurs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-heritage-green/10 rounded-full blur-[160px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-antique-bright/5 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Main Grid (Full Viewport) ──────────────────────────────────── */}
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 relative z-10 bg-surface">

        {/* ── Left Column: Form ──────────────────────────────────────────── */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:px-12 lg:py-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-line overflow-y-auto">
          <div className="max-w-md w-full mx-auto my-auto space-y-4">
            {/* Unified Brand Logo */}
            <div className="mb-2">
              <BrandLogo
                size="md"
                theme="light"
                onClick={() => handleNavigate(PATHS.landing)}
                className="focus-ring rounded-xl"
              />
            </div>

            {/* Tab Switcher */}
            <div
              className="flex bg-surface-muted p-1 rounded-xl border border-line"
              role="tablist"
              aria-label="Chọn hình thức đăng nhập"
            >
              <button
                type="button"
                role="tab"
                aria-selected={authTab === 'login'}
                disabled={isLoading}
                onClick={() => setAuthTab('login')}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all focus-ring ${
                  authTab === 'login'
                    ? 'bg-action text-on-action shadow-sm'
                    : 'text-ink-soft hover:text-ink hover:bg-surface-hover'
                }`}
              >
                Đăng Nhập / Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={authTab === 'register'}
                disabled={isLoading}
                onClick={() => setAuthTab('register')}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all focus-ring ${
                  authTab === 'register'
                    ? 'bg-action text-on-action shadow-sm'
                    : 'text-ink-soft hover:text-ink hover:bg-surface-hover'
                }`}
              >
                Đăng Ký / Sign Up
              </button>
            </div>

            {/* Header */}
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-ink mb-1">
                {authTab === 'login' ? 'Welcome Back' : isLocalAuthMode ? 'Tạo Hồ Sơ Dùng Thử' : 'Tạo Tài Khoản Mới'}
              </h1>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed font-normal">
                {authTab === 'login'
                  ? 'Nhập tài khoản của bạn để tiếp tục hành trình học tiếng Anh di sản văn hóa.'
                  : 'Bắt đầu học tiếng Anh qua câu chuyện nghệ thuật & di sản hoàn toàn miễn phí.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {authTab === 'register' && (
                <div>
                  <label className={LABEL_CLASS} htmlFor="fullName">
                    Họ và Tên / Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    required
                    autoComplete="name"
                    className={INPUT_CLASS}
                  />
                </div>
              )}

              <div>
                <label className={LABEL_CLASS} htmlFor="email">
                  Email / Tên Đăng Nhập
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-faint" aria-hidden="true">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="learner@example.com"
                    required
                    autoComplete="email"
                    className={INPUT_WITH_ICON}
                  />
                </div>
              </div>

              <div>
                <label className={LABEL_CLASS} htmlFor="password">
                  Mật Khẩu / Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-faint" aria-hidden="true">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete={authTab === 'login' ? 'current-password' : 'new-password'}
                    minLength={isLocalAuthMode || authTab === 'register' ? 6 : undefined}
                    className={INPUT_WITH_ICON}
                  />
                </div>
              </div>

              {/* Options row */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-ink-soft">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-line bg-surface-muted text-heritage-green focus:ring-heritage-green w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                {!isLocalAuthMode && authTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-xs text-accent-ink hover:underline font-medium focus-ring rounded"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-action text-on-action hover:bg-action-hover font-bold rounded-xl text-sm shadow-lg hover:brightness-105 active:scale-[0.99] transition-all mt-1 focus-ring"
              >
                {isLoading ? 'Đang đăng nhập...' : authTab === 'login' ? 'Đăng Nhập Ngay' : isLocalAuthMode ? 'Tạo Hồ Sơ Dùng Thử' : 'Đăng Ký Tài Khoản'}
              </button>
            </form>

            {/* Social divider */}
            <div className="relative my-3 text-center" aria-hidden="true">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-line" />
              </div>
              <span className="relative px-3 bg-surface text-[11px] text-ink-faint uppercase tracking-wider">
                Hoặc tiếp tục với
              </span>
            </div>

            {/* Error Feedback Banner */}
            {errorMessage && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-fadeIn"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-danger">Đăng nhập không thành công</p>
                  <p className="text-ink-soft text-[11px] mt-0.5 leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Social Authentication */}
            {isLocalAuthMode ? (
              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleDemoLogin}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-white text-[#1f1f1f] border border-line rounded-xl text-xs font-semibold hover:bg-white/90 transition-all focus-ring disabled:opacity-50"
                >
                  <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.89-1.74 2.98-4.3 2.98-7.36Z" />
                    <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.13H3.07v2.59A10 10 0 0 0 12 22Z" />
                    <path fill="#FBBC05" d="M6.41 13.91a6 6 0 0 1 0-3.82V7.5H3.07a10 10 0 0 0 0 9l3.34-2.59Z" />
                    <path fill="#EA4335" d="M12 5.96c1.47 0 2.79.51 3.83 1.51l2.87-2.87A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.93 5.5l3.34 2.59C7.2 7.72 9.4 5.96 12 5.96Z" />
                  </svg>
                  <span>Login with Google</span>
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleDemoLogin}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#1877F2] text-white border border-line rounded-xl text-xs font-semibold hover:brightness-110 transition-all focus-ring disabled:opacity-50"
                >
                  <svg aria-hidden="true" className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Login with Facebook</span>
                </button>
              </div>
            ) : <div className="space-y-2.5">
              {/* Google Sign-In with Official GIS Button */}
              <div className="relative w-full flex justify-center [&>div]:w-full [&>div>iframe]:!w-full [&>div]:flex [&>div]:justify-center">
                {isLoading ? (
                  <div className="w-full py-2.5 px-3 bg-surface-muted border border-antique-bright/30 rounded-xl text-xs font-semibold text-accent-ink flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-accent-ink" />
                    <span>Đang xác thực...</span>
                  </div>
                ) : import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      if (credentialResponse.credential) {
                        handleGoogleSuccess(credentialResponse.credential);
                      } else {
                        setErrorMessage('Không nhận được mã xác thực Google từ trình duyệt.');
                      }
                    }}
                    onError={() => {
                      setErrorMessage('Đăng nhập bằng Google không thành công hoặc cửa sổ đăng nhập đã bị đóng.');
                    }}
                    theme="outline"
                    shape="rectangular"
                    size="large"
                    text="continue_with"
                    width="100%"
                  />
                ) : (
                  <p className="text-xs text-ink-soft">Đăng nhập Google chưa được cấu hình.</p>
                )}
              </div>

              {/* Facebook authentication has no backend endpoint yet. */}
              <button
                type="button"
                disabled
                title="Đăng nhập Facebook chưa được hỗ trợ."
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-surface-muted border border-line rounded-xl text-xs font-semibold text-ink hover:bg-surface-hover transition-all focus-ring cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 fill-sky-mist" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook — Sắp ra mắt</span>
              </button>
            </div>}
          </div>

          {/* Back link */}
          <div className="pt-2 text-xs text-ink-faint flex items-center justify-between">
            <button
              onClick={() => handleNavigate(PATHS.landing)}
              className="text-accent-ink hover:underline font-semibold flex items-center gap-1 focus-ring rounded"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Landing Page</span>
            </button>
          </div>
        </div>

        {/* ── Right Column: Value Proposition Panel ──────────────────────── */}
        <div className="lg:col-span-5 bg-surface-feature p-6 sm:p-8 lg:px-12 lg:py-6 flex flex-col justify-between relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-64 h-64 bg-heritage-green/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-md w-full mx-auto my-auto space-y-4 relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-heritage-green/20 text-action border border-heritage-green/30 mb-3">
                <Sparkles className="w-3 h-3 text-accent-ink" />
                EDTECH VĂN HÓA DI SẢN
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink leading-tight">
                Nâng Tầm Tiếng Anh Qua Di Sản Việt Nam
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-ink-soft leading-relaxed font-normal">
              Tạo tài khoản để theo dõi tiến độ học từ vựng 3D Flashcards, mở khóa bài đọc song ngữ AI và tham gia thử thách cảm nghĩ cộng đồng.
            </p>

            <ul className="space-y-2.5 pt-1" aria-label="Tính năng nổi bật">
              {[
                'Lưu từ vựng học thuật & Spaced Repetition',
                'Tra từ song ngữ thông minh & AI Shadowing',
                'Nhận huy hiệu Sứ Giả Văn Hóa & Thưởng Xu',
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink">
                  <CheckCircle2 className="w-4 h-4 text-action shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-line relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-antique-bright/20 border border-antique-bright/40 flex items-center justify-center text-base text-accent-ink" aria-hidden="true">
                  <Crown className="w-5 h-5 text-accent-ink" />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">VieCultures Ambassador Program</p>
                  <p className="text-[11px] text-ink/60">Hơn 12,500+ học viên đang tham gia</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {!isLocalAuthMode && <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        initialEmail={email}
        onSuccessLogin={(newEmail) => {
          setEmail(newEmail);
          setIsForgotPasswordOpen(false);
        }}
      />}
    </div>
  );
};

export default LoginPage;
