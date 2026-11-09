import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { resolveAssetUrl, getDefaultCategoryImage } from '../../utils/assetHelper';

export interface HeritageImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  category?: string | null;
  containerClassName?: string;
  fallbackLabel?: string;
}

export const HeritageImage: React.FC<HeritageImageProps> = ({
  src,
  alt,
  category,
  className = '',
  containerClassName = '',
  fallbackLabel = 'Di sản',
  loading = 'lazy',
  ...restProps
}) => {
  const [resolvedSrc, setResolvedSrc] = useState<string>(() => resolveAssetUrl(src, category));
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isFailedCompletely, setIsFailedCompletely] = useState<boolean>(false);
  const [hasTriedFallback, setHasTriedFallback] = useState<boolean>(false);

  useEffect(() => {
    const nextSrc = resolveAssetUrl(src, category);
    setResolvedSrc(nextSrc);
    setIsLoaded(false);
    setIsFailedCompletely(false);
    setHasTriedFallback(false);
  }, [src, category]);

  const handleError = () => {
    if (!hasTriedFallback) {
      setHasTriedFallback(true);
      const fallbackUrl = getDefaultCategoryImage(category);
      if (fallbackUrl !== resolvedSrc) {
        setResolvedSrc(fallbackUrl);
        return;
      }
    }
    setIsFailedCompletely(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      className={`relative overflow-hidden bg-warm-ivory dark:bg-stone-800 ${containerClassName}`}
    >
      {/* 1. Skeleton Loading State */}
      {!isLoaded && !isFailedCompletely && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-antique-gold/15 animate-pulse"
        />
      )}

      {/* 2. Primary / Fallback Image */}
      {!isFailedCompletely ? (
        <img
          src={resolvedSrc}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
          {...restProps}
        />
      ) : (
        /* 3. Ultimate Fallback State when offline/unavailable */
        <div
          className="w-full h-full flex flex-col items-center justify-center bg-stone-100 dark:bg-stone-800/80 text-antique-gold p-2"
          aria-label={alt}
        >
          <ImageIcon aria-hidden="true" className="w-5 h-5 opacity-70" />
          <span className="text-[10px] font-semibold text-text-muted mt-1 select-none">
            {fallbackLabel}
          </span>
        </div>
      )}
    </div>
  );
};
