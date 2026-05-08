/**
 * Hook personalizado para gestión de temas
 * Re-exporta funcionalidad del contexto para conveniencia
 */
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { AppTheme, ThemeId } from '../types/theme';

interface UseThemeReturn {
  theme: AppTheme;
  isDark: boolean;
  colors: AppTheme['colors'];
  setTheme: (themeId: ThemeId) => void;
  toggleTheme: () => void;
}

/**
 * Hook simplificado para usar el tema actual
 * Ideal para componentes que solo necesitan leer el tema
 */
export function useTheme(): UseThemeReturn {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  const { currentTheme, setTheme, toggleTheme } = context;

  return {
    theme: currentTheme,
    isDark: currentTheme.isDark,
    colors: currentTheme.colors,
    setTheme,
    toggleTheme,
  };
}

/**
 * Hook para obtener solo los colores del tema
 * Útil para componentes que necesitan acceder a variables CSS
 */
export function useThemeColors(): AppTheme['colors'] {
  const { colors } = useTheme();
  return colors;
}

/**
 * Hook para verificar si el tema actual es oscuro
 */
export function useIsDark(): boolean {
  const { isDark } = useTheme();
  return isDark;
}

export default useTheme;
