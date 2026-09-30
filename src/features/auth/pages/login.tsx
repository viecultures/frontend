import React, { useState } from 'react';
import { Mail, Lock, Sparkles, ArrowLeft, CheckCircle2, Crown, Globe } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

interface LoginPageProps {
  onLoginSuccess?: (userData?: { email?: string; name?: string }) => void;
  onNavigate?: (view: string) => void;
}

// ─── Shared input class — dark glass style ─────────────────────────────────────
const INPUT_CLASS =
  'w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-sm text-white ' +
  'placeholder-white/40 transition-all ' +
  'focus:outline-none focus:border-antique-bright focus:ring-1 focus:ring-antique-bright';

const INPUT_WITH_ICON =
  'w-full bg-black/40 border border-white/20 rounded-xl pl-9 pr-3.5 py-2 text-sm text-white ' +
  'placeholder-white/40 transition-all ' +
  'focus:outline-none focus:border-antique-bright focus:ring-1 focus:ring-antique-bright';

const LABEL_CLASS =
  'block text-[11px] font-semibold text-white/80 uppercase tracking-wider mb-1';

// ─── Component ─────────────────────────────────────────────────────────────────
export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleNavigate = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      window.dispatchEvent(new CustomEvent('app:navigate', { detail: view }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLoginSuccess) {
      onLoginSuccess();
    } else {
      handleNavigate('home');
    }
  };

  return (
    // Root: heritage-forest deep dark — cinematic dark mode
    <div className="h-screen w-full bg-heritage-forest text-white flex flex-col justify-center items-center relative overflow-hidden">

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
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 relative z-10 bg-heritage-forest">

        {/* ── Left Column: Form ──────────────────────────────────────────── */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:px-12 lg:py-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 overflow-y-auto">
          <div className="max-w-md w-full mx-auto my-auto space-y-4">
            {/* Unified Brand Logo */}
            <div className="mb-2">
              <BrandLogo
                size="md"
                theme="dark"
                onClick={() => handleNavigate('landing')}
                className="focus-ring-dark rounded-xl"
              />
            </div>

            {/* Tab Switcher */}
            <div
              className="flex bg-black/40 p-1 rounded-xl border border-white/10"
              role="tablist"
              aria-label="Chọn hình thức đăng nhập"
            >
              <button
                type="button"
                role="tab"
                aria-selected={authTab === 'login'}
                onClick={() => setAuthTab('login')}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all focus-ring-dark ${
                  authTab === 'login'
                    ? 'bg-antique-bright text-heritage-forest shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Đăng Nhập / Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={authTab === 'register'}
                onClick={() => setAuthTab('register')}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all focus-ring-dark ${
                  authTab === 'register'
                    ? 'bg-antique-bright text-heritage-forest shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Đăng Ký / Sign Up
              </button>
            </div>

            {/* Header */}
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-1">
                {authTab === 'login' ? 'Welcome Back' : 'Tạo Tài Khoản Mới'}
              </h1>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40" aria-hidden="true">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40" aria-hidden="true">
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
                    className={INPUT_WITH_ICON}
                  />
                </div>
              </div>

              {/* Options row */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/30 bg-black/40 text-heritage-green focus:ring-heritage-green w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                {authTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Chức năng Quên mật khẩu đang được phát triển.')}
                    className="text-xs text-antique-bright hover:underline font-medium focus-ring-dark rounded"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-antique-bright to-antique-gold text-heritage-forest font-bold rounded-xl text-sm shadow-lg hover:brightness-105 active:scale-[0.99] transition-all mt-1 focus-ring-dark"
              >
                {authTab === 'login' ? 'Đăng Nhập Ngay' : 'Đăng Ký Tài Khoản'}
              </button>
            </form>

            {/* Social divider */}
            <div className="relative my-3 text-center" aria-hidden="true">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/15" />
              </div>
              <span className="relative px-3 bg-heritage-forest text-[11px] text-white/50 uppercase tracking-wider">
                Hoặc tiếp tục với
              </span>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onLoginSuccess) onLoginSuccess();
                  else handleNavigate('home');
                }}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-black/30 border border-white/15 rounded-xl text-xs font-semibold text-white hover:bg-white/10 transition-all focus-ring-dark"
              >
                <Globe className="w-4 h-4 text-sky-mist" />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onLoginSuccess) onLoginSuccess();
                  else handleNavigate('home');
                }}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-black/30 border border-white/15 rounded-xl text-xs font-semibold text-white hover:bg-white/10 transition-all focus-ring-dark"
              >
                <svg className="w-4 h-4 fill-sky-mist" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>

          {/* Back link */}
          <div className="pt-2 text-xs text-white/50 flex items-center justify-between">
            <button
              onClick={() => handleNavigate('landing')}
              className="text-antique-bright hover:underline font-semibold flex items-center gap-1 focus-ring-dark rounded"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Landing Page</span>
            </button>
          </div>
        </div>

        {/* ── Right Column: Value Proposition Panel ──────────────────────── */}
        <div className="lg:col-span-5 bg-[#0A1612] p-6 sm:p-8 lg:px-12 lg:py-6 flex flex-col justify-between relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-64 h-64 bg-heritage-green/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-md w-full mx-auto my-auto space-y-4 relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-heritage-green/20 text-sky-mist border border-heritage-green/30 mb-3">
                <Sparkles className="w-3 h-3 text-antique-bright" />
                EDTECH VĂN HÓA DI SẢN
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight">
                Nâng Tầm Tiếng Anh Qua Di Sản Việt Nam
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
              Tạo tài khoản để theo dõi tiến độ học từ vựng 3D Flashcards, mở khóa bài đọc song ngữ AI và tham gia thử thách cảm nghĩ cộng đồng.
            </p>

            <ul className="space-y-2.5 pt-1" aria-label="Tính năng nổi bật">
              {[
                'Lưu từ vựng học thuật & Spaced Repetition',
                'Tra từ song ngữ thông minh & AI Shadowing',
                'Nhận huy hiệu Sứ Giả Văn Hóa & Thưởng Xu',
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-sky-mist shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-white/10 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-antique-bright/20 border border-antique-bright/40 flex items-center justify-center text-base text-antique-bright" aria-hidden="true">
                  <Crown className="w-5 h-5 text-antique-bright" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">VieCultures Ambassador Program</p>
                  <p className="text-[11px] text-white/60">Hơn 12,500+ học viên đang tham gia</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
