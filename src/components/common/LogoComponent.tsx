import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LOGO_CONFIG } from '@/constants/logos';

interface LogoComponentProps {
  /** Logo variant to display */
  variant?: 'primary' | 'secondary' | 'icon' | 'alternative1' | 'alternative2';
  /** Size of the logo */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Additional CSS classes */
  className?: string;
  /** Whether this is for admin context */
  isAdmin?: boolean;
  /** Custom click handler (overrides default navigation) */
  onClick?: () => void;
  /** Whether to show as a link or just an image */
  asLink?: boolean;
  /** Custom navigation path */
  to?: string;
  /** Whether to show loading state */
  showLoading?: boolean;
  /** Whether to show fallback text on error */
  showFallback?: boolean;
}

const LogoComponent: React.FC<LogoComponentProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  isAdmin = false,
  onClick,
  asLink = true,
  to,
  showLoading = true,
  showFallback = true
}) => {
  const [imageError, setImageError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  // Size configurations for responsive design
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  // Logo source mapping
  const logoSrc = {
    primary: LOGO_CONFIG.PRIMARY,
    secondary: LOGO_CONFIG.SECONDARY,
    icon: LOGO_CONFIG.ICON,
    alternative1: LOGO_CONFIG.ALTERNATIVE_1,
    alternative2: LOGO_CONFIG.ALTERNATIVE_2
  };

  // Determine navigation path
  const navigationPath = to || (isAdmin ? '/admin' : '/');

  // Handle click events
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    } else if (!asLink && navigationPath) {
      e.preventDefault();
      navigate(navigationPath);
    }
  }, [onClick, asLink, navigationPath, navigate]);

  // Handle image load error
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Handle image load success
  const handleImageLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  // Fallback component when image fails to load
  const FallbackLogo = () => {
    if (!showFallback) return null;

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Icon/Symbol */}
        <div className={`${sizeClasses[size]} aspect-square bg-gradient-to-br from-academy-green to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md`}>
          <span className={size === 'sm' ? 'text-xs' : size === 'xl' ? 'text-lg' : 'text-sm'}>
            LA
          </span>
        </div>
        
        {/* Text - hide on small sizes for better mobile experience */}
        {size !== 'sm' && (
          <div className="flex flex-col leading-tight">
            <span className={`${textSizes[size]} font-bold text-academy-green`}>
              Learn Academy
            </span>
            <span className="text-xs text-gray-500 -mt-1">
              Language Learning Platform
            </span>
          </div>
        )}
      </div>
    );
  };

  // Loading placeholder
  const LoadingPlaceholder = () => {
    if (!showLoading || loaded) return null;

    return (
      <div 
        className={`${sizeClasses[size]} bg-gray-200 animate-pulse rounded`} 
        style={{ width: 'auto', aspectRatio: '3/1' }}
        aria-label="Loading logo..."
      />
    );
  };

  // Main logo image
  const LogoImage = () => (
    <>
      <LoadingPlaceholder />
      <img 
        src={logoSrc[variant]} 
        alt="Learn Academy Logo" 
        className={`${sizeClasses[size]} w-auto object-contain transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </>
  );

  // If image failed to load, show fallback
  if (imageError) {
    if (asLink) {
      return (
        <Link 
          to={navigationPath}
          className="hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-academy-green focus:ring-offset-2 rounded"
          onClick={handleClick}
          aria-label="Learn Academy - Go to home page"
        >
          <FallbackLogo />
        </Link>
      );
    } else {
      return (
        <button
          onClick={handleClick}
          className="hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-academy-green focus:ring-offset-2 rounded"
          aria-label="Learn Academy - Go to home page"
        >
          <FallbackLogo />
        </button>
      );
    }
  }

  // Render logo with or without link
  if (asLink) {
    return (
      <Link 
        to={navigationPath}
        className="flex items-center hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-academy-green focus:ring-offset-2 rounded"
        onClick={handleClick}
        aria-label="Learn Academy - Go to home page"
      >
        <LogoImage />
      </Link>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-academy-green focus:ring-offset-2 rounded"
      aria-label="Learn Academy - Go to home page"
    >
      <LogoImage />
    </button>
  );
};

export default LogoComponent;