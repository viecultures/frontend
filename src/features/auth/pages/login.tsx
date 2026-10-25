import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowUpRight, Loader2, Lock, Mail } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { BrandLogo } from '@/components/BrandLogo';
import { PATHS } from '@/routes/paths';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { authService, type AuthResult } from '@/services/authService';
import { localAuthService } from '@/services/localAuthService';
import { isLocalAuthMode } from '@/config/authConfig';
import { setAuthSession, type AppUser } from '@/utils/auth-storage';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal';
import '../login.css';

interface LoginPageProps {
  onLoginSuccess?: (userData: AppUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useAppNavigate();
  const hasGoogleLogin = !isLocalAuthMode && !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

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
    setIsLoading(true);
    setErrorMessage(null);
    try {
      completeLogin(await authService.loginWithGoogle(idToken));
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

  const changeTab = (tab: 'login' | 'register') => {
    setAuthTab(tab);
    setErrorMessage(null);
  };

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
          <h1 id="auth-title">{authTab === 'login' ? 'Chào mừng trở lại' : isLocalAuthMode ? 'Tạo hồ sơ dùng thử' : 'Bắt đầu hành trình của bạn'}</h1>
          <p className="auth-intro">
            {authTab === 'login'
              ? 'Đăng nhập để tiếp tục đọc và lưu lại những điều bạn đã học.'
              : 'Tạo tài khoản để tiếp tục khám phá tiếng Anh qua những câu chuyện món ăn Việt.'}
          </p>

          <div className="auth-tabs" role="tablist" aria-label="Hình thức truy cập">
            <button id="auth-login-tab" type="button" role="tab" aria-selected={authTab === 'login'} aria-controls="auth-panel" disabled={isLoading} className={authTab === 'login' ? 'is-active' : ''} onClick={() => changeTab('login')}>Đăng nhập</button>
            <button id="auth-register-tab" type="button" role="tab" aria-selected={authTab === 'register'} aria-controls="auth-panel" disabled={isLoading} className={authTab === 'register' ? 'is-active' : ''} onClick={() => changeTab('register')}>Đăng ký</button>
          </div>

          <div id="auth-panel" role="tabpanel" aria-labelledby={authTab === 'login' ? 'auth-login-tab' : 'auth-register-tab'}>
            <form onSubmit={handleSubmit} className="auth-form">
              {authTab === 'register' && (
                <div className="auth-field">
                  <label htmlFor="fullName">Họ và tên</label>
                  <input id="fullName" type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Nguyễn Văn A" autoComplete="name" required />
                </div>
              )}

              <div className="auth-field">
                <label htmlFor="email">Email</label>
                <div className="auth-input-wrap">
                  <Mail size={18} aria-hidden="true" />
                  <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ban@example.com" autoComplete="email" required />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="password">Mật khẩu</label>
                <div className="auth-input-wrap">
                  <Lock size={18} aria-hidden="true" />
                  <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nhập mật khẩu" autoComplete={authTab === 'login' ? 'current-password' : 'new-password'} minLength={isLocalAuthMode || authTab === 'register' ? 6 : undefined} required />
                </div>
              </div>

              <div className="auth-options">
                <label className="auth-remember"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /><span>Ghi nhớ đăng nhập</span></label>
                {!isLocalAuthMode && authTab === 'login' && <button type="button" className="auth-inline-link" onClick={() => setIsForgotPasswordOpen(true)}>Quên mật khẩu?</button>}
              </div>

              {errorMessage && <div className="auth-error" role="alert"><AlertCircle size={18} aria-hidden="true" /><span>{errorMessage}</span></div>}

              <button type="submit" className="auth-submit" disabled={isLoading}>
                {isLoading ? <><Loader2 size={18} className="auth-spinner" aria-hidden="true" /> Đang xử lý...</> : authTab === 'login' ? 'Đăng nhập' : isLocalAuthMode ? 'Tạo hồ sơ dùng thử' : 'Tạo tài khoản'}
                {!isLoading && <ArrowUpRight size={18} aria-hidden="true" />}
              </button>
            </form>

            {(isLocalAuthMode || hasGoogleLogin) && (
              <div className="auth-alternate">
                <div className="auth-divider"><span>HOẶC</span></div>
                {isLocalAuthMode ? (
                  <button type="button" className="auth-demo-button" disabled={isLoading} onClick={handleDemoLogin}>Dùng thử tài khoản mẫu <ArrowUpRight size={17} aria-hidden="true" /></button>
                ) : (
                  <div className="auth-google">
                    {isLoading ? <div className="auth-google-loading"><Loader2 size={18} className="auth-spinner" aria-hidden="true" /> Đang xác thực...</div> : (
                      <GoogleLogin
                        onSuccess={(response) => response.credential ? handleGoogleSuccess(response.credential) : setErrorMessage('Không nhận được mã xác thực Google từ trình duyệt.')}
                        onError={() => setErrorMessage('Đăng nhập bằng Google không thành công hoặc cửa sổ đăng nhập đã bị đóng.')}
                        theme="outline"
                        shape="rectangular"
                        size="large"
                        text="continue_with"
                        width="100%"
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="auth-guest-note">Chỉ muốn xem thử? <Link to={PATHS.discovery}>Khám phá các bài đọc</Link></p>
        </section>
        <p className="auth-footer-note">Học từ món ăn, nhớ qua câu chuyện.</p>
      </div>

      <aside className="auth-story-panel" aria-label="Học tiếng Anh qua món ăn Việt">
        <div className="auth-story-image"><img src="/images/series/pho-hanoi.jpg" alt="Bát phở Hà Nội bên hồ Hoàn Kiếm" width="1024" height="576" /></div>
        <div className="auth-story-copy">
          <span className="auth-story-kicker">TỪ BÀN ĂN ĐẾN TRANG SÁCH</span>
          <h2>Mỗi món ăn mở ra <span>một câu chuyện.</span></h2>
          <p>Đọc, nghe và ghi nhớ tiếng Anh qua những món ăn cùng đời sống quanh chúng.</p>
          <div className="auth-story-line"><span>01 / PHỞ HÀ NỘI</span><span>VIECULTURES</span></div>
        </div>
      </aside>

      {isForgotPasswordOpen && <ForgotPasswordModal isOpen={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)} initialEmail={email} onSuccessLogin={(newEmail) => { setEmail(newEmail); setIsForgotPasswordOpen(false); }} />}
    </main>
  );
};

export default LoginPage;
