import { useState, useEffect } from 'react';

export interface ResponsiveBreakpoints {
  isMobile: boolean;      // < 768px
  isTablet: boolean;      // 768px - 1023px
  isTabletLandscape: boolean; // >= 1024px (iPad landscape, landscape tablets)
  isDesktop: boolean;     // >= 1024px
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
}

/**
 * Hook para detectar breakpoints responsivos y cambios de orientación.
 * 
 * Uso:
 * const { isTablet, isMobile, isDesktop, width } = useResponsive();
 * 
 * Breakpoints:
 * - Mobile: < 768px
 * - Tablet: 768px - 1023px
 * - Desktop/TabletLandscape: >= 1024px
 */
export const useResponsive = (): ResponsiveBreakpoints => {
  const [dimensions, setDimensions] = useState<ResponsiveBreakpoints>({
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : true,
    isTablet: typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false,
    isTabletLandscape: typeof window !== 'undefined' ? window.innerWidth >= 1024 : false,
    isDesktop: typeof window !== 'undefined' ? window.innerWidth >= 1024 : false,
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    orientation: typeof window !== 'undefined' 
      ? window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      : 'portrait'
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const orientation = width > height ? 'landscape' : 'portrait';

      setDimensions({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isTabletLandscape: width >= 1024 && width < 1366,
        isDesktop: width >= 1024,
        width,
        height,
        orientation
      });
    };

    // Initial check
    handleResize();

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return dimensions;
};

/**
 * Hook simplificado para solo saber si es tablet o no
 * Más performante si solo necesitas este check
 */
export const useIsTablet = (): boolean => {
  const { isTablet } = useResponsive();
  return isTablet;
};

/**
 * Hook simplificado para solo saber si es desktop o no
 */
export const useIsDesktop = (): boolean => {
  const { isDesktop } = useResponsive();
  return isDesktop;
};
