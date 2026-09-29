import React from 'react';
import { Sparkles } from 'lucide-react';

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
    md: 'w-10 h-10 rounded-full',
    lg: 'w-12 h-12 rounded-full',
  }[size];

  const iconInnerClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  const textSizeClasses = {
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  }[size];

  // Theme text styling
  const mainTextColor = theme === 'dark' ? 'text-warm-ivory' : 'text-heritage-green';
  const highlightTextColor = theme === 'dark' ? 'text-antique-gold' : 'text-antique-rich';

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
        className={`relative ${iconSizeClasses} border border-antique-gold/50 bg-heritage-green/90 overflow-hidden shrink-0 shadow-md flex items-center justify-center text-antique-gold transition-all duration-300 ${
          onClick ? 'group-hover:scale-105 group-hover:border-antique-gold group-hover:shadow-[0_0_15px_rgba(217,183,106,0.35)]' : ''
        }`}
      >
        {/* Subtle decorative background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-antique-gold/25 via-transparent to-black/40 pointer-events-none" />
        
        {/* Crisp Golden Cultural Sparkle Icon */}
        <Sparkles className={`${iconInnerClasses} text-antique-gold shrink-0 relative z-10`} />
      </div>

      {/* Typography Brand Name */}
      {showText && (
        <div className="flex items-center gap-2">
          <span
            className={`font-serif font-bold tracking-tight ${textSizeClasses} ${mainTextColor} transition-colors ${
              onClick ? 'group-hover:text-antique-gold' : ''
            }`}
          >
            Vie<span className={highlightTextColor}>Cultures</span>
            {suffix && <span className="ml-1 text-sm font-sans font-bold opacity-80">{suffix}</span>}
          </span>

          {/* Optional Badge / Room indicator */}
          {badge && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/80 font-medium pl-2.5 border-l border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
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
