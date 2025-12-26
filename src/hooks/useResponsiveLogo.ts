import { useState, useEffect } from 'react';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
type LogoVariant = 'primary' | 'secondary' | 'icon' | 'alternative1' | 'alternative2';

interface ResponsiveLogoConfig {
  size: LogoSize;
  variant: LogoVariant;
}

interface UseResponsiveLogoOptions {
  /** Breakpoints for different screen sizes */
  breakpoints?: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  /** Logo configurations for different screen sizes */
  configs?: {
    sm: ResponsiveLogoConfig;
    md: ResponsiveLogoConfig;
    lg: ResponsiveLogoConfig;
    xl: ResponsiveLogoConfig;
  };
}

const defaultBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

const defaultConfigs = {
  sm: { size: 'sm' as LogoSize, variant: 'icon' as LogoVariant },
  md: { size: 'md' as LogoSize, variant: 'primary' as LogoVariant },
  lg: { size: 'lg' as LogoSize, variant: 'primary' as LogoVariant },
  xl: { size: 'xl' as LogoSize, variant: 'primary' as LogoVariant },
};

/**
 * Hook to get responsive logo configuration based on screen size
 */
export const useResponsiveLogo = (options: UseResponsiveLogoOptions = {}) => {
  const { breakpoints = defaultBreakpoints, configs = defaultConfigs } = options;
  
  const [screenSize, setScreenSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      
      if (width < breakpoints.sm) {
        setScreenSize('sm');
      } else if (width < breakpoints.md) {
        setScreenSize('sm');
      } else if (width < breakpoints.lg) {
        setScreenSize('md');
      } else if (width < breakpoints.xl) {
        setScreenSize('lg');
      } else {
        setScreenSize('xl');
      }
    };

    // Set initial size
    updateScreenSize();

    // Add event listener
    window.addEventListener('resize', updateScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateScreenSize);
  }, [breakpoints]);

  return {
    screenSize,
    logoConfig: configs[screenSize],
    size: configs[screenSize].size,
    variant: configs[screenSize].variant,
  };
};

/**
 * Hook specifically for navigation logos with mobile-optimized settings
 */
export const useNavLogo = () => {
  return useResponsiveLogo({
    configs: {
      sm: { size: 'sm', variant: 'primary' },
      md: { size: 'md', variant: 'primary' },
      lg: { size: 'md', variant: 'primary' },
      xl: { size: 'lg', variant: 'primary' },
    },
  });
};

/**
 * Hook for hero section logos with larger sizes
 */
export const useHeroLogo = () => {
  return useResponsiveLogo({
    configs: {
      sm: { size: 'lg', variant: 'primary' },
      md: { size: 'xl', variant: 'primary' },
      lg: { size: 'xl', variant: 'primary' },
      xl: { size: 'xl', variant: 'primary' },
    },
  });
};