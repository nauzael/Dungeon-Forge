/**
 * Temas Predefinidos - Dungeon Forge
 * Paletas de colores listas para usar
 * Todos los temas cumplen WCAG 2.2 AA (contraste 4.5:1 mínimo)
 */
import { AppTheme, ThemeId } from '../types/theme';

/**
 * Tema Clásico D&D (Oscuro - Default actual)
 * Basado en la paleta actual de Dungeon Forge
 */
export const CLASSIC_DND: AppTheme = {
  id: 'classic-dnd',
  name: 'Mazmorra Clásica',
  description: 'El tema oscuro tradicional de Dungeon Forge',
  category: 'official',
  isDark: true,
  wcagCompliant: true,
  colors: {
    background: '#0F172A',
    backgroundSecondary: '#1E293B',
    surface: '#1E293B',
    surfaceHighlight: '#334155',
    textPrimary: '#F8FAFC',
    textSecondary: '#E2E8F0',
    textMuted: '#94A3B8',
    primary: '#359EFF',
    primaryDark: '#2B7DE0',
    secondary: '#64748B',
    accent: '#9ADBFF',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    border: 'rgba(154, 219, 255, 0.1)',
    borderHover: 'rgba(154, 219, 255, 0.2)',
  },
  typography: {
    fontFamilyDisplay: 'Spline Sans, sans-serif',
    fontFamilyBody: 'Noto Sans, sans-serif',
    fontSizeBase: '0.875rem',
    lineHeightBase: '1.5',
  },
  shape: {
    borderRadius: '0.25rem',
    borderRadiusLg: '0.5rem',
    borderRadiusXl: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
    boxShadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
  },
};

/**
 * Tema Claro (Luz Diurna)
 * Para sesiones diurnas o preferencia de bajo brillo
 */
export const DAYLIGHT: AppTheme = {
  id: 'daylight',
  name: 'Luz Diurna',
  description: 'Tema claro para sesiones diurnas',
  category: 'official',
  isDark: false,
  wcagCompliant: true,
  colors: {
    background: '#F8FAFC',
    backgroundSecondary: '#F1F5F9',
    surface: '#FFFFFF',
    surfaceHighlight: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#334155',
    textMuted: '#64748B',
    primary: '#2563EB',
    primaryDark: '#1D4ED8',
    secondary: '#64748B',
    accent: '#3B82F6',
    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
    info: '#2563EB',
    border: 'rgba(0, 0, 0, 0.1)',
    borderHover: 'rgba(0, 0, 0, 0.2)',
  },
  typography: {
    fontFamilyDisplay: 'Spline Sans, sans-serif',
    fontFamilyBody: 'Noto Sans, sans-serif',
    fontSizeBase: '0.875rem',
    lineHeightBase: '1.5',
  },
  shape: {
    borderRadius: '0.25rem',
    borderRadiusLg: '0.5rem',
    borderRadiusXl: '0.75rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    boxShadowLg: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
};

/**
 * Tema Sangre de Dragón (Rojo/Oscuro)
 * Tonos rojizos para un ambiente épico
 */
export const DRAGON_BLOOD: AppTheme = {
  id: 'dragon-blood',
  name: 'Sangre de Dragón',
  description: 'Tonos rojizos oscuros para un ambiente épico',
  category: 'official',
  isDark: true,
  wcagCompliant: true,
  colors: {
    background: '#0C0A0A',
    backgroundSecondary: '#1A1414',
    surface: '#1A1414',
    surfaceHighlight: '#2D2424',
    textPrimary: '#FEE2E2',
    textSecondary: '#FECACA',
    textMuted: '#A8A29E',
    primary: '#DC2626',
    primaryDark: '#B91C1C',
    secondary: '#7F1D1D',
    accent: '#F87171',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#DC2626',
    border: 'rgba(220, 38, 38, 0.2)',
    borderHover: 'rgba(220, 38, 38, 0.4)',
  },
  typography: CLASSIC_DND.typography,
  shape: CLASSIC_DND.shape,
};

/**
 * Tema Bosque Élfico (Verde/Natural)
 * Verdes profundos para amantes de la naturaleza
 */
export const ELVEN_FOREST: AppTheme = {
  id: 'elven-forest',
  name: 'Bosque Élfico',
  description: 'Verdes profundos y tonos naturales',
  category: 'official',
  isDark: true,
  wcagCompliant: true,
  colors: {
    background: '#0A1F1A',
    backgroundSecondary: '#142E26',
    surface: '#142E26',
    surfaceHighlight: '#1F4D3D',
    textPrimary: '#ECFDF5',
    textSecondary: '#D1FAE5',
    textMuted: '#6EE7B7',
    primary: '#10B981',
    primaryDark: '#059669',
    secondary: '#34D399',
    accent: '#6EE7B7',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#10B981',
    border: 'rgba(16, 185, 129, 0.2)',
    borderHover: 'rgba(16, 185, 129, 0.4)',
  },
  typography: CLASSIC_DND.typography,
  shape: CLASSIC_DND.shape,
};

/**
 * Tema Alto Contraste (Accesibilidad)
 * Máximo contraste para accesibilidad WCAG AAA
 */
export const HIGH_CONTRAST: AppTheme = {
  id: 'high-contrast',
  name: 'Alto Contraste',
  description: 'Máximo contraste para accesibilidad WCAG AAA',
  category: 'official',
  isDark: true,
  wcagCompliant: true,
  colors: {
    background: '#000000',
    backgroundSecondary: '#1A1A1A',
    surface: '#1A1A1A',
    surfaceHighlight: '#333333',
    textPrimary: '#FFFFFF',
    textSecondary: '#E5E5E5',
    textMuted: '#A3A3A3',
    primary: '#FFFF00',
    primaryDark: '#E5E500',
    secondary: '#00FFFF',
    accent: '#FF00FF',
    success: '#00FF00',
    warning: '#FFFF00',
    error: '#FF0000',
    info: '#00FFFF',
    border: '#FFFFFF',
    borderHover: '#CCCCCC',
  },
  typography: {
    fontFamilyDisplay: 'Spline Sans, sans-serif',
    fontFamilyBody: 'Noto Sans, sans-serif',
    fontSizeBase: '1rem',
    lineHeightBase: '1.6',
  },
  shape: {
    borderRadius: '0.125rem',
    borderRadiusLg: '0.25rem',
    borderRadiusXl: '0.5rem',
    boxShadow: 'none',
    boxShadowLg: 'none',
  },
};

/**
 * Lista de todos los temas oficiales
 */
export const OFFICIAL_THEMES: AppTheme[] = [
  CLASSIC_DND,
  DAYLIGHT,
  DRAGON_BLOOD,
  ELVEN_FOREST,
  HIGH_CONTRAST,
];

/**
 * Tema por defecto
 */
export const DEFAULT_THEME: AppTheme = CLASSIC_DND;

/**
 * Obtener tema por ID
 */
export function getThemeById(id: ThemeId): AppTheme | undefined {
  return OFFICIAL_THEMES.find(t => t.id === id);
}

/**
 * Obtener tema por ID con fallback al default
 */
export function getThemeOrDefault(id: ThemeId | null | undefined): AppTheme {
  if (!id) return DEFAULT_THEME;
  return getThemeById(id) || DEFAULT_THEME;
}
