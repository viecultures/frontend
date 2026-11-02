import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Leaf,
  Loader2,
  Lock,
  Mail,
  User,
} from 'lucide-react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { BrandLogo } from '@/components/BrandLogo';
import { PATHS } from '@/routes/paths';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { authService, backendAuthService, type AuthResult } from '@/services/authService';
import { localAuthService } from '@/services/localAuthService';
import { authMailService } from '@/services/authMailService';
import { isDemoLoginEnabled, isLocalAuthMode } from '@/config/authConfig';
import { setAuthSession, type AppUser } from '@/utils/auth-storage';
import { useSettings, type AppLanguage } from '@/context/SettingsContext';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal';
import { authCopy } from '../authCopy';
import '../login.css';

interface LoginPageProps {
  onLoginSuccess?: (userData: AppUser) => void;
}

const AUTH_LANGUAGE_STORAGE_KEY = 'viecultures_auth_language';

const readAuthLanguage = (): AppLanguage => {
  try {
    return window.localStorage.getItem(AUTH_LANGUAGE_STORAGE_KEY) === 'vi' ? 'vi' : 'en';
  } catch {
    return 'en';
  }
};

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const requestedTab = searchParams.get('tab') === 'register' || searchParams.get('mode') === 'register' ? 'register' : 'login';

  const [language, setAuthLanguage] = useState<AppLanguage>(readAuthLanguage);
  const [authTab, setAuthTab] = useState<'login' | 'register'>(requestedTab);
  const [registerStep, setRegisterStep] = useState<'form' | 'otp'>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(0);
  const [pendingAuthResult, setPendingAuthResult] = useState<AuthResult | null>(null);

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const languageSynced = useRef(false);
  const navigate = useAppNavigate();
  const { setLanguage } = useSettings();
  const copy = authCopy[language];
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const hasGoogleLogin = !!googleClientId;

  const readableError = (error: unknown, fallback: string) =>
    language === 'vi' && error instanceof Error ? error.message : fallback;

  useEffect(() => {
    if (languageSynced.current) return;
    languageSynced.current = true;
    setLanguage(language);
  }, [language, setLanguage]);

  const changeLanguage = (nextLanguage: AppLanguage) => {
    setAuthLanguage(nextLanguage);
    setLanguage(nextLanguage);
    try {
      window.localStorage.setItem(AUTH_LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch {
      // The current page still switches language when storage is unavailable.
    }
    setErrorMessage(null);
    setSuccessMessage(null);
  };

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
      setErrorMessage(readableError(error, copy.googleLoginFailed));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const demoResult = await localAuthService.loginDemo();
      const result = isLocalAuthMode
        ? demoResult
        : { ...demoResult, user: { ...demoResult.user, role: 'ROLE_USER' } };
      completeLogin(result);
    } catch (error: unknown) {
      setErrorMessage(readableError(error, copy.demoFailed));
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
        setSuccessMessage(copy.otpSent);
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      }
    } catch (error: unknown) {
      setErrorMessage(readableError(error, copy.requestFailed));
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
      setErrorMessage(copy.otpMissing);
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
      setErrorMessage(readableError(error, copy.otpVerifyFailed));
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
      setSuccessMessage(copy.otpResent);
    } catch (error: unknown) {
      setErrorMessage(readableError(error, copy.otpResendFailed));
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
    <main className="auth-page" lang={language}>
      {/* Top Navigation Bar */}
      <header className="auth-header">
        <Link to={PATHS.landing} className="auth-brand" aria-label={copy.brandLabel}>
          <BrandLogo size="md" theme="light" />
        </Link>

        <div className="auth-header-right">
          <Link to={PATHS.landing} className="auth-back-home">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>{copy.home}</span>
          </Link>

          <div className="auth-lang-pill" role="group" aria-label="Language / Ngôn ngữ">
            <button
              type="button"
              className={`auth-lang-btn ${language === 'vi' ? 'is-active' : ''}`}
              aria-pressed={language === 'vi'}
              onClick={() => changeLanguage('vi')}
            >
              VI
            </button>
            <button
              type="button"
              className={`auth-lang-btn ${language === 'en' ? 'is-active' : ''}`}
              aria-pressed={language === 'en'}
              onClick={() => changeLanguage('en')}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* Main 2-Column Section */}
      <div className="auth-main">
        {/* Left Column: Hero Tagline & Cultural Story */}
        <section className="auth-hero" aria-labelledby="hero-title">
          <h1 id="hero-title" className="auth-hero-title font-serif">
            {copy.tagline1}
            <br />
            {copy.tagline2}
          </h1>
          <p className="auth-hero-subtitle">{copy.subtagline}</p>
          <div className="auth-hero-badge">
            <Leaf size={15} className="text-[#2E7D32]" aria-hidden="true" />
            <span>{copy.cultureBadge}</span>
          </div>
        </section>

        {/* Right Column: Floating Auth Card */}
        <div className="auth-card-panel" role="region" aria-label={copy.accessLabel}>
          {/* Segmented Tab Controls (Login / Register) */}
          {!isOtpStep && (
            <div className="auth-card-tabs" role="tablist" aria-label={copy.accessLabel}>
              <button
                id="auth-login-tab"
                type="button"
                role="tab"
                aria-selected={authTab === 'login'}
                aria-controls="auth-panel"
                disabled={isLoading}
                className={`auth-tab-btn ${authTab === 'login' ? 'is-active' : ''}`}
                onClick={() => changeTab('login')}
              >
                {copy.login}
              </button>
              <button
                id="auth-register-tab"
                type="button"
                role="tab"
                aria-selected={authTab === 'register'}
                aria-controls="auth-panel"
                disabled={isLoading}
                className={`auth-tab-btn ${authTab === 'register' ? 'is-active' : ''}`}
                onClick={() => changeTab('register')}
              >
                {copy.register}
              </button>
            </div>
          )}

          {/* Card Header */}
          <div className="auth-card-header">
            <h2 id="auth-title" className="auth-card-title">
              {isOtpStep
                ? copy.verifyTitle
                : authTab === 'login'
                  ? copy.loginTitle
                  : copy.registerTitle}
            </h2>
            <p className="auth-card-subtitle">
              {isOtpStep
                ? copy.verifyIntro(email)
                : authTab === 'login'
                  ? copy.loginIntro
                  : copy.registerIntro}
            </p>
          </div>

          <div id="auth-panel" role="tabpanel" aria-labelledby={isOtpStep ? 'auth-title' : authTab === 'login' ? 'auth-login-tab' : 'auth-register-tab'}>
            {/* OTP Verification Flow */}
            {isOtpStep ? (
              <form onSubmit={handleVerifyOtp} className="auth-form-fields">
                <div className="auth-otp-row">
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
                      className="auth-otp-input"
                      aria-label={copy.otpDigit(idx + 1)}
                      disabled={isLoading}
                      required
                    />
                  ))}
                </div>

                <div className="auth-otp-actions">
                  <span>{copy.otpNotReceived}</span>
                  <button
                    type="button"
                    className="auth-otp-resend"
                    disabled={cooldown > 0 || isLoading}
                    onClick={handleResendOtp}
                  >
                    {cooldown > 0 ? copy.resendIn(cooldown) : copy.resendOtp}
                  </button>
                </div>

                {errorMessage && (
                  <div className="auth-alert auth-alert-error" role="alert">
                    <AlertCircle size={17} aria-hidden="true" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="auth-alert auth-alert-success" role="status">
                    <CheckCircle2 size={17} aria-hidden="true" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={isLoading || otpDigits.join('').length < 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                      <span>{copy.verifying}</span>
                    </>
                  ) : (
                    <>
                      <span>{copy.verifyComplete}</span>
                      <ArrowRight size={17} aria-hidden="true" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="auth-otp-back"
                  disabled={isLoading}
                  onClick={() => {
                    setRegisterStep('form');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                >
                  <ArrowLeft size={15} aria-hidden="true" />
                  <span>{copy.backToForm}</span>
                </button>
              </form>
            ) : (
              /* Standard Auth Flow (Login or Register) */
              <div>
                {/* Google Sign-in */}
                {hasGoogleLogin && (
                  <div className="auth-google-wrapper">
                    {isLoading ? (
                      <div className="auth-google-loading">
                        <Loader2 size={18} className="animate-spin text-[#19382B]" aria-hidden="true" />
                        <span>{copy.googleLoading}</span>
                      </div>
                    ) : (
                      <GoogleOAuthProvider key={language} clientId={googleClientId} locale={language}>
                        <GoogleLogin
                          onSuccess={(response) =>
                            response.credential
                              ? handleGoogleSuccess(response.credential)
                              : setErrorMessage(copy.googleMissing)
                          }
                          onError={() => setErrorMessage(copy.googleFailed)}
                          theme="outline"
                          shape="rectangular"
                          size="large"
                          text="continue_with"
                          width="100%"
                        />
                      </GoogleOAuthProvider>
                    )}
                  </div>
                )}

                {/* Divider */}
                <div className="auth-card-divider" role="separator">
                  <span>{authTab === 'login' ? copy.orLoginWithEmail : copy.orRegisterWithEmail}</span>
                </div>

                <form onSubmit={handleSubmit} className="auth-form-fields">
                  {/* Full Name for Registration */}
                  {authTab === 'register' && (
                    <div className="auth-field-group">
                      <label htmlFor="fullName" className="auth-field-label">
                        {copy.fullName}
                      </label>
                      <div className="auth-input-container">
                        <User size={18} className="auth-input-icon" aria-hidden="true" />
                        <input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={copy.fullNamePlaceholder}
                          autoComplete="name"
                          className="auth-text-input"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Input */}
                  <div className="auth-field-group">
                    <label htmlFor="email" className="auth-field-label">
                      Email
                    </label>
                    <div className="auth-input-container">
                      <Mail size={18} className="auth-input-icon" aria-hidden="true" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ban@example.com"
                        autoComplete="email"
                        className="auth-text-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input with show/hide toggle */}
                  <div className="auth-field-group">
                    <label htmlFor="password" className="auth-field-label">
                      {copy.password}
                    </label>
                    <div className="auth-input-container">
                      <Lock size={18} className="auth-input-icon" aria-hidden="true" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={copy.passwordPlaceholder}
                        autoComplete={authTab === 'login' ? 'current-password' : 'new-password'}
                        minLength={6}
                        className="auth-text-input"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="auth-password-toggle"
                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                      </button>
                    </div>
                  </div>

                  {/* Extra Options: Remember Me & Forgot Password */}
                  <div className="auth-extra-row">
                    <label className="auth-remember-label">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="auth-remember-checkbox"
                      />
                      <span>{copy.remember}</span>
                    </label>

                    {authTab === 'login' && !isLocalAuthMode && (
                      <button
                        type="button"
                        className="auth-forgot-link"
                        onClick={() => setIsForgotPasswordOpen(true)}
                      >
                        {copy.forgotPassword}
                      </button>
                    )}
                  </div>

                  {/* Error Alert */}
                  {errorMessage && (
                    <div className="auth-alert auth-alert-error" role="alert">
                      <AlertCircle size={17} aria-hidden="true" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                        <span>{copy.processing}</span>
                      </>
                    ) : (
                      <>
                        <span>{authTab === 'login' ? copy.login : copy.createAccount}</span>
                        <ArrowRight size={17} aria-hidden="true" />
                      </>
                    )}
                  </button>

                  {/* Demo Account Button */}
                  {isDemoLoginEnabled && (
                    <button
                      type="button"
                      className="auth-demo-btn"
                      disabled={isLoading}
                      onClick={handleDemoLogin}
                    >
                      {isLoading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
                      <span>{isLoading ? copy.demoLoading : copy.demo}</span>
                    </button>
                  )}
                </form>
              </div>
            )}
          </div>

          {/* Card Footer: Explore as guest */}
          <div className="auth-card-footer">
            <span>{copy.guestPrefix} </span>
            <Link to={PATHS.discovery}>{copy.explore}</Link>
          </div>
        </div>
      </div>

      {/* Page Bottom Footer: Quote with leaf icon */}
      <footer className="auth-page-footer">
        <div className="auth-footer-quote">
          <span className="auth-quote-line" aria-hidden="true" />
          <Leaf size={14} className="text-[#2E7D32]" aria-hidden="true" />
          <span>{copy.footer}</span>
          <span className="auth-quote-line" aria-hidden="true" />
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <ForgotPasswordModal
          isOpen={isForgotPasswordOpen}
          language={language}
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
