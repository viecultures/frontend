import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowUpRight, CheckCircle2, Loader2, Lock, Mail, RefreshCw } from 'lucide-react';
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
  const [language, setAuthLanguage] = useState<AppLanguage>(readAuthLanguage);
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
      <div className="auth-form-panel">
        <header className="auth-topbar">
          <Link to={PATHS.landing} className="auth-brand" aria-label={copy.brandLabel}>
            <BrandLogo size="sm" theme="dark" />
          </Link>
          <div className="auth-topbar-actions">
            <div className="auth-language-switch" role="group" aria-label="Language / Ngôn ngữ">
              <button type="button" lang="vi" aria-pressed={language === 'vi'} onClick={() => changeLanguage('vi')}>VI</button>
              <button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => changeLanguage('en')}>EN</button>
            </div>
            <Link to={PATHS.landing} className="auth-back-link">
              <ArrowLeft size={17} aria-hidden="true" /> {copy.home}
            </Link>
          </div>
          {!isOtpStep && (
            <div className="auth-tabs" role="tablist" aria-label={copy.accessLabel}>
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
                {copy.login}
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
                {copy.register}
              </button>
            </div>
          )}
        </header>

        <section className="auth-content" aria-labelledby="auth-title">
          <h1 id="auth-title" className={authTab === 'register' && !isOtpStep ? 'auth-title-register' : undefined}>
            {isOtpStep
              ? copy.verifyTitle
              : authTab === 'login'
                ? copy.loginTitle
                : copy.registerTitle}
          </h1>
          <p className="auth-intro">
            {isOtpStep
              ? copy.verifyIntro(email)
              : authTab === 'login'
                ? copy.loginIntro
                : copy.registerIntro}
          </p>

          <div id="auth-panel" role="tabpanel" aria-labelledby={isOtpStep ? 'auth-title' : authTab === 'login' ? 'auth-login-tab' : 'auth-register-tab'}>
            {!isOtpStep && (isDemoLoginEnabled || hasGoogleLogin) && (
              <div className="auth-alternate">
                {hasGoogleLogin && (
                  <div className="auth-google">
                    {isLoading ? (
                      <div className="auth-google-loading">
                        <Loader2 size={18} className="auth-spinner" aria-hidden="true" />
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
                {isDemoLoginEnabled && (
                  <button type="button" className="auth-demo-button" disabled={isLoading} onClick={handleDemoLogin}>
                    {isLoading && <Loader2 size={18} className="auth-spinner" aria-hidden="true" />}
                    <span>{isLoading ? copy.demoLoading : copy.demo}</span>
                  </button>
                )}
                <div className="auth-divider"><span>{copy.or}</span></div>
              </div>
            )}
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
                      aria-label={copy.otpDigit(idx + 1)}
                      disabled={isLoading}
                      required
                    />
                  ))}
                </div>

                <div className="auth-otp-meta">
                  <span>{copy.otpNotReceived}</span>
                  <button
                    type="button"
                    className="auth-resend-btn"
                    disabled={cooldown > 0 || isLoading}
                    onClick={handleResendOtp}
                  >
                    {cooldown > 0 ? copy.resendIn(cooldown) : copy.resendOtp}
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
                      <span>{copy.verifying}</span>
                    </>
                  ) : (
                    <>
                      <span>{copy.verifyComplete}</span>
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
                  <span>{copy.backToForm}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form">
                {authTab === 'register' && (
                  <div className="auth-field">
                    <label htmlFor="fullName">{copy.fullName}</label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder={copy.fullNamePlaceholder}
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
                  <label htmlFor="password">{copy.password}</label>
                  <div className="auth-input-wrap">
                    <Lock size={18} aria-hidden="true" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder={copy.passwordPlaceholder}
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
                    <span>{copy.remember}</span>
                  </label>
                  {!isLocalAuthMode && (
                    <button
                      type="button"
                      className="auth-inline-link"
                      style={{ visibility: authTab === 'login' ? 'visible' : 'hidden' }}
                      tabIndex={authTab === 'login' ? 0 : -1}
                      onClick={() => setIsForgotPasswordOpen(true)}
                    >
                      {copy.forgotPassword}
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
                      <span>{copy.processing}</span>
                    </>
                  ) : authTab === 'login' ? (
                    copy.login
                  ) : (
                    copy.createAccount
                  )}
                  {!isLoading && <ArrowUpRight size={18} aria-hidden="true" />}
                </button>
              </form>
            )}
          </div>

          <p className="auth-guest-note">
            {copy.guestPrefix} <Link to={PATHS.discovery}>{copy.explore}</Link>
          </p>
        </section>
        <p className="auth-footer-note">{copy.footer}</p>
      </div>

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
