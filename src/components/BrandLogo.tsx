import React from 'react';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
  showText?: boolean;
  suffix?: string;
  badge?: string;
  onClick?: () => void;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  theme = 'dark',
  showText = true,
  suffix,
  badge,
  onClick,
  className = '',
}) => {
  // Sizing definitions
  const iconSizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-xl',
  }[size];

  const textSizeClasses = {
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  }[size];

  // Theme text styling
  const mainTextColor = theme === 'dark' ? 'text-warm-ivory' : 'text-heritage-green';
  const highlightTextColor = theme === 'dark' ? 'text-antique-gold' : 'text-accent-ink';

  const content = (
    <div
      className={`inline-flex items-center gap-3 select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Visual Emblem Container */}
      <div
        className={`relative ${iconSizeClasses} border border-antique-gold/50 overflow-hidden shrink-0 transition-transform duration-200 ${
          onClick ? 'group-hover:scale-105 group-hover:border-antique-gold' : ''
        }`}
      >
        <img src="/brand/viecultures-mascot-logo.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>

      {/* Typography Brand Name */}
      {showText && (
        <div className="flex items-center gap-2">
          <span
            className={`font-sans font-bold tracking-tight ${textSizeClasses} ${mainTextColor} transition-colors ${
              onClick ? 'group-hover:text-antique-gold' : ''
            }`}
          >
            Vie<span className={highlightTextColor}>Cultures</span>
            {suffix && <span className="ml-1 text-sm font-sans font-bold opacity-80">{suffix}</span>}
          </span>

          {/* Optional Badge / Room indicator */}
          {badge && (
            <div className={`hidden sm:flex items-center gap-1.5 text-xs font-medium pl-2.5 border-l ${theme === 'dark' ? 'text-warm-ivory/80 border-warm-ivory/20' : 'text-ink-soft border-line'}`}>
              <span className="w-2 h-2 rounded-full bg-mountain-teal" />
              <span>{badge}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return content;
};

export default BrandLogo;
