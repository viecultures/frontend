import React, { useState } from 'react';
import { Mail, Lock, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess?: () => void;
  onNavigate?: (view: string) => void;
}

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
    <div className="h-screen w-full bg-[#0D1C18] text-white flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#FCE5B5]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Full-Screen Container (No Outer Border, Full Viewport Fit) */}
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 relative z-10 bg-[#122A22]">
        
        {/* Left Column: Form Section */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:px-12 lg:py-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 overflow-y-auto">
          <div className="max-w-md w-full mx-auto my-auto space-y-4">
            {/* Auth Tab Switcher */}
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setAuthTab('login')}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  authTab === 'login'
                    ? 'bg-[#FCE5B5] text-[#18221E] shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Đăng Nhập / Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('register')}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  authTab === 'register'
                    ? 'bg-[#FCE5B5] text-[#18221E] shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Đăng Ký / Sign Up
              </button>
            </div>

            {/* Header Titles */}
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

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {authTab === 'register' && (
                <div>
                  <label className="block text-[11px] font-semibold text-white/80 uppercase tracking-wider mb-1">
                    Họ và Tên / Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    required
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FCE5B5] focus:ring-1 focus:ring-[#FCE5B5] transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-white/80 uppercase tracking-wider mb-1">
                  Email / Tên Đăng Nhập
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                    className="w-full bg-black/40 border border-white/20 rounded-xl pl-9 pr-3.5 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FCE5B5] focus:ring-1 focus:ring-[#FCE5B5] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/80 uppercase tracking-wider mb-1">
                  Mật Khẩu / Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-black/40 border border-white/20 rounded-xl pl-9 pr-3.5 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FCE5B5] focus:ring-1 focus:ring-[#FCE5B5] transition-all"
                  />
                </div>
              </div>

              {/* Form Options */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/30 bg-black/40 text-emerald-500 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                {authTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Chức năng Quên mật khẩu đang được phát triển.')}
                    className="text-xs text-[#FCE5B5] hover:underline font-medium"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#FCE5B5] to-[#E5C170] text-[#18221E] font-bold rounded-xl text-sm shadow-lg hover:brightness-105 active:scale-[0.99] transition-all mt-1"
              >
                {authTab === 'login' ? 'Đăng Nhập Ngay' : 'Đăng Ký Tài Khoản'}
              </button>
            </form>

            {/* Social Divider */}
            <div className="relative my-3 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/15" />
              </div>
              <span className="relative px-3 bg-[#122A22] text-[11px] text-white/50 uppercase tracking-wider">
                Hoặc tiếp tục với
              </span>
            </div>

            {/* Social Buttons Wireframe */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleNavigate('home')}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-black/30 border border-white/15 rounded-xl text-xs font-semibold text-white hover:bg-white/10 transition-all"
              >
                <span>🌐 Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('home')}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-black/30 border border-white/15 rounded-xl text-xs font-semibold text-white hover:bg-white/10 transition-all"
              >
                <span>📘 Facebook</span>
              </button>
            </div>
          </div>

          <div className="pt-2 text-xs text-white/50 flex items-center justify-between">
            <button
              onClick={() => handleNavigate('landing')}
              className="text-[#FCE5B5] hover:underline font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Landing Page</span>
            </button>
          </div>
        </div>

        {/* Right Column: Heritage EdTech Value Proposition Panel */}
        <div className="lg:col-span-5 bg-[#0A1612] p-6 sm:p-8 lg:px-12 lg:py-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-md w-full mx-auto my-auto space-y-4 relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
                <Sparkles className="w-3 h-3 text-[#FCE5B5]" />
                EDTECH VĂN HÓA DI SẢN
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight">
                Nâng Tầm Tiếng Anh Qua Di Sản Việt Nam
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
              Tạo tài khoản để theo dõi tiến độ học từ vựng 3D Flashcards, mở khóa bài đọc song ngữ AI và tham gia thử thách cảm nghĩ cộng đồng.
            </p>

            <ul className="space-y-2.5 pt-1">
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Lưu từ vựng học thuật &amp; Spaced Repetition</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Tra từ song ngữ thông minh &amp; AI Shadowing</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Nhận huy hiệu Sứ Giả Văn Hóa &amp; Thưởng Xu</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-white/10 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FCE5B5]/20 border border-[#FCE5B5]/40 flex items-center justify-center text-base">
                  👑
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
