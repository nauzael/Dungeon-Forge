/**
 * Sistema de Temas - Dungeon Forge
 * Define la estructura de temas intercambiables
 */

/**
 * IDs de temas oficiales
 */
export type ThemeId =
  | 'classic-dnd'
  | 'daylight'
  | 'dragon-blood'
  | 'elven-forest'
  | 'high-contrast';

/**
 * Paleta de colores base para un tema
 */
export interface ThemeColors {
  // Fondos
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceHighlight: string;
  
  // Texto
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  
  // Acentos
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  
  // Estados
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Bordes
  border: string;
  borderHover: string;
}

/**
 * Tipografía del tema
 */
export interface ThemeTypography {
  fontFamilyDisplay: string;
  fontFamilyBody: string;
  fontSizeBase: string;
  lineHeightBase: string;
}

/**
 * Bordes y sombras
 */
export interface ThemeShape {
  borderRadius: string;
  borderRadiusLg: string;
  borderRadiusXl: string;
  boxShadow: string;
  boxShadowLg: string;
}

/**
 * Tema completo
 */
export interface AppTheme {
  id: ThemeId;
  name: string;
  description: string;
  category: 'official' | 'community' | 'custom';
  colors: ThemeColors;
  typography: ThemeTypography;
  shape: ThemeShape;
  isDark: boolean;
  wcagCompliant: boolean;
}

/**
 * Preferencias del usuario
 */
export interface ThemePreferences {
  selectedThemeId: ThemeId;
  autoTheme: boolean;
}
