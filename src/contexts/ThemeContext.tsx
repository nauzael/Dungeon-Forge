/**
 * Contexto de Temas - Dungeon Forge
 * Proveedor de temas para toda la aplicación
 */
import React, { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { AppTheme, ThemeId } from '../types/theme';
import { OFFICIAL_THEMES, DEFAULT_THEME } from '../constants/themes';
import { validateThemeColors } from '../utils/wcagContrast';

const THEME_STORAGE_KEY = 'dungeon-forge-theme';
const THEME_AUTO_MODE_KEY = 'dungeon-forge-theme-auto';

interface ThemeContextType {
  currentTheme: AppTheme;
  selectedThemeId: ThemeId;
  isAutoMode: boolean;
  setTheme: (themeId: ThemeId) => void;
  setAutoMode: (auto: boolean) => void;
  toggleTheme: () => void;
  getThemeById: (id: ThemeId) => AppTheme | undefined;
  allThemes: AppTheme[];
  validationResults: ReturnType<typeof validateThemeColors> | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(DEFAULT_THEME);
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>(DEFAULT_THEME.id);
  const [isAutoMode, setIsAutoMode] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [validationResults, setValidationResults] = useState<ReturnType<typeof validateThemeColors> | null>(null);

  // Cargar tema guardado al iniciar
  useEffect(() => {
    try {
      const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
      const savedAutoMode = localStorage.getItem(THEME_AUTO_MODE_KEY);

      if (savedAutoMode === 'true') {
        // Modo auto: seguir preferencia del sistema
        setIsAutoMode(true);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemTheme = prefersDark
          ? OFFICIAL_THEMES.find(t => t.isDark) || DEFAULT_THEME
          : OFFICIAL_THEMES.find(t => !t.isDark) || DEFAULT_THEME;
        setCurrentTheme(systemTheme);
        setSelectedThemeId(systemTheme.id);
      } else if (savedThemeId) {
        const theme = OFFICIAL_THEMES.find(t => t.id === savedThemeId);
        if (theme) {
          setCurrentTheme(theme);
          setSelectedThemeId(savedThemeId);
        }
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
      setCurrentTheme(DEFAULT_THEME);
    }
    setIsLoaded(true);
  }, []);

  // Validar colores del tema actual
  useEffect(() => {
    const results = validateThemeColors(currentTheme.colors);
    setValidationResults(results);
    if (!results.compliant) {
      console.warn('Theme validation issues:', results.issues);
    }
  }, [currentTheme]);

  // Aplicar tema al DOM
  useEffect(() => {
    if (!isLoaded) return;

    const root = document.documentElement;
    const colors = currentTheme.colors;

    // Establecer variables CSS
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-background-secondary', colors.backgroundSecondary);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-surface-highlight', colors.surfaceHighlight);
    root.style.setProperty('--color-text-primary', colors.textPrimary);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-text-muted', colors.textMuted);
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-dark', colors.primaryDark);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-warning', colors.warning);
    root.style.setProperty('--color-error', colors.error);
    root.style.setProperty('--color-info', colors.info);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-border-hover', colors.borderHover);

    // Establecer tipografía
    root.style.setProperty('--font-family-display', currentTheme.typography.fontFamilyDisplay);
    root.style.setProperty('--font-family-body', currentTheme.typography.fontFamilyBody);
    root.style.setProperty('--font-size-base', currentTheme.typography.fontSizeBase);
    root.style.setProperty('--line-height-base', currentTheme.typography.lineHeightBase);

    // Establecer forma
    root.style.setProperty('--border-radius', currentTheme.shape.borderRadius);
    root.style.setProperty('--border-radius-lg', currentTheme.shape.borderRadiusLg);
    root.style.setProperty('--border-radius-xl', currentTheme.shape.borderRadiusXl);
    root.style.setProperty('--box-shadow', currentTheme.shape.boxShadow);
    root.style.setProperty('--box-shadow-lg', currentTheme.shape.boxShadowLg);

    // Actualizar atributos para dark mode
    root.setAttribute('data-theme', currentTheme.id);
    root.setAttribute('data-color-scheme', currentTheme.isDark ? 'dark' : 'light');

    // Actualizar meta theme-color para la barra de estado del navegador
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', colors.background);
    }
  }, [currentTheme, isLoaded]);

  // Escuchar cambios de preferencia del sistema en modo auto
  useEffect(() => {
    if (!isAutoMode) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const prefersDark = mediaQuery.matches;
      const systemTheme = prefersDark
        ? OFFICIAL_THEMES.find(t => t.isDark) || DEFAULT_THEME
        : OFFICIAL_THEMES.find(t => !t.isDark) || DEFAULT_THEME;
      setCurrentTheme(systemTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isAutoMode]);

  const setTheme = useCallback((themeId: ThemeId) => {
    const theme = OFFICIAL_THEMES.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      setSelectedThemeId(themeId);
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
      localStorage.setItem(THEME_AUTO_MODE_KEY, 'false');
      setIsAutoMode(false);
    }
  }, []);

  const setAutoMode = useCallback((auto: boolean) => {
    setIsAutoMode(auto);
    localStorage.setItem(THEME_AUTO_MODE_KEY, auto ? 'true' : 'false');
    if (auto) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark
        ? OFFICIAL_THEMES.find(t => t.isDark) || DEFAULT_THEME
        : OFFICIAL_THEMES.find(t => !t.isDark) || DEFAULT_THEME;
      setCurrentTheme(systemTheme);
      setSelectedThemeId(systemTheme?.id || DEFAULT_THEME.id);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = currentTheme.isDark
      ? OFFICIAL_THEMES.find(t => !t.isDark) || DEFAULT_THEME
      : OFFICIAL_THEMES.find(t => t.isDark) || DEFAULT_THEME;
    setTheme(nextTheme.id);
  }, [currentTheme, setTheme]);

  const getThemeById = useCallback((id: ThemeId) => {
    return OFFICIAL_THEMES.find(t => t.id === id);
  }, []);

  const value: ThemeContextType = {
    currentTheme,
    selectedThemeId,
    isAutoMode,
    setTheme,
    setAutoMode,
    toggleTheme,
    getThemeById,
    allThemes: OFFICIAL_THEMES,
    validationResults,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Hook de conveniencia para usar el tema
 */
export function useTheme() {
  const { currentTheme, setTheme, toggleTheme } = useThemeContext();
  return {
    theme: currentTheme,
    isDark: currentTheme.isDark,
    colors: currentTheme.colors,
    setTheme,
    toggleTheme,
  };
}
