import React, { useState } from 'react';

interface ImageWithBlurPlaceholderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export const ImageWithBlurPlaceholder: React.FC<ImageWithBlurPlaceholderProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden w-full h-full bg-slate-100 dark:bg-neutral-900/60 transition-colors ${containerClassName}`}>
      {/* Animated low-res blurred gradient placeholder layer that displays immediately */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/40 via-neutral-300/30 to-slate-200/40 dark:from-neutral-900/80 dark:via-neutral-850/60 dark:to-neutral-900/80" />
          <div className="absolute inset-0 bg-neutral-500/5 dark:bg-black/20" />
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 dark:bg-indigo-500/10 dark:border-indigo-500/20 blur-2xl opacity-50" />
        </div>
      )}

      {/* High-res image using loading="lazy" with fade-in transition */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          isLoaded 
            ? 'opacity-100 scale-100 blur-0' 
            : 'opacity-0 scale-102 blur-xl'
        } ${className}`}
        {...props}
      />
    </div>
  );
};
