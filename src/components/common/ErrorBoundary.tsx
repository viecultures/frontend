import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCcw, Home, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import i18n from '@/lib/i18n';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, showDetails: false };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught component error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, showDetails: false });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, showDetails: false });
    const isEn = (i18n?.language || '').toLowerCase().startsWith('en');
    window.location.href = isEn ? '/en' : '/vi';
  };

  private toggleDetails = () => {
    this.setState((prev) => ({ ...prev, showDetails: !prev.showDetails }));
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isEn = (i18n?.language || '').toLowerCase().startsWith('en');
      const badgeText = isEn ? 'Display pause' : 'Gián đoạn hiển thị';
      const titleText = isEn ? 'A Momentary Pause' : 'Khoảnh Khắc Tạm Gián Đoạn';
      const descText = isEn
        ? 'The application encountered a brief display interruption. Your learning history and cultural seals remain completely safe.'
        : 'Hệ thống vừa gặp một gián đoạn nhỏ khi tải giao diện. Dữ liệu học tập và dấu mộc son của bạn luôn được bảo toàn.';
      const retryText = isEn ? 'Reload page' : 'Tải lại trang';
      const homeText = isEn ? 'Back to home' : 'Về trang chủ';
      const detailsToggleText = isEn ? 'Technical details' : 'Chi tiết kỹ thuật';

      return (
        <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 sm:py-16">
          <div className="relative w-full max-w-xl bg-surface-raised dark:bg-[#1A2E2B] border border-antique-gold/30 dark:border-antique-gold/25 rounded-3xl p-7 sm:p-10 text-center shadow-xl backdrop-blur-sm overflow-hidden">
            {/* Ambient background glow */}
            <div
              className="absolute -top-16 -right-16 w-56 h-56 bg-antique-gold/15 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-16 -left-16 w-56 h-56 bg-heritage-green/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-center">
              {/* Emblem with warm antique gold/terracotta theme */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-antique-gold/15 border-2 border-antique-gold/40 flex items-center justify-center text-antique-rich dark:text-antique-bright mb-4 shadow-inner">
                <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-antique-rich dark:text-antique-bright" aria-hidden="true" />
              </div>

              {/* Kicker badge */}
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-antique-gold/15 text-antique-rich dark:text-antique-bright border border-antique-gold/30 mb-3">
                {badgeText}
              </span>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-dark dark:text-warm-ivory tracking-tight">
                {titleText}
              </h2>

              {/* Description */}
              <p className="text-sm text-ink-soft dark:text-warm-ivory/80 max-w-md mt-3 leading-relaxed font-sans">
                {descText}
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-7 w-full max-w-xs sm:max-w-sm">
                <button
                  type="button"
                  onClick={this.handleRetry}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-heritage-green text-warm-ivory hover:bg-heritage-dark shadow-sm transition-all focus-ring active:scale-95 flex-1 min-w-[130px]"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>{retryText}</span>
                </button>
                <button
                  type="button"
                  onClick={this.handleGoHome}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-surface border border-antique-gold/60 text-ink dark:text-warm-ivory hover:bg-surface-muted shadow-sm transition-all focus-ring active:scale-95 flex-1 min-w-[130px]"
                >
                  <Home className="w-4 h-4 text-antique-rich dark:text-antique-gold" aria-hidden="true" />
                  <span>{homeText}</span>
                </button>
              </div>

              {/* Technical error details toggle (development & debugging) */}
              {this.state.error && (
                <div className="w-full mt-6 text-left">
                  <button
                    type="button"
                    onClick={this.toggleDetails}
                    className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink dark:text-warm-ivory/60 transition-colors mx-auto block"
                  >
                    <span>{detailsToggleText}</span>
                    {this.state.showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>

                  {this.state.showDetails && (
                    <div className="mt-2 p-3 bg-surface-muted/80 dark:bg-black/30 border border-line rounded-xl text-xs font-mono text-ink-soft dark:text-warm-ivory/70 max-h-40 overflow-y-auto break-all">
                      <p className="font-semibold text-rose-700 dark:text-rose-400 mb-1">
                        {this.state.error.name}: {this.state.error.message}
                      </p>
                      {this.state.error.stack && (
                        <pre className="text-[11px] whitespace-pre-wrap opacity-80">
                          {this.state.error.stack}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
