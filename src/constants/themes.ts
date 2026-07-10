/**
 * Predefined Themes - Dungeon Forge
 * Ready-to-use color palettes
 * All themes meet WCAG 2.2 AA (minimum 4.5:1 contrast)
 */
import { AppTheme, ThemeId } from '../types/theme';

/**
 * Classic D&D Theme (Dark - Current Default)
 * Based on the current Dungeon Forge palette
 */
export const CLASSIC_DND: AppTheme = {
  id: 'classic-dnd',
  name: 'Classic Dungeon',
  description: 'The traditional dark theme of Dungeon Forge',
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
    fontIcon: 'Material Symbols Outlined',
    leadingTight: '1.06',
    trackingDisplay: '-0.02em',
  },
  shape: {
    borderRadius: '0.25rem',
    borderRadiusLg: '0.5rem',
    borderRadiusXl: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
    boxShadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    // Radius scale (DS granular)
    radiusSm: '4px',
    radiusMd: '8px',
    radiusLg: '12px',
    radiusXl: '16px',
    radius2xl: '24px',
    radiusPill: '9999px',
    // Elevation
    elevFlat: 'none',
    elevRing: '0 0 0 1px rgba(154, 219, 255, 0.1)',
    elevRaised: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
    elevModal: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    elevGlow: '0 0 20px rgba(154, 219, 255, 0.3)',
    // Motion durations
    motionFast: '150ms',
    motionBase: '300ms',
    motionSlow: '500ms',
    motionHp: '700ms',
    // Easing curves
    easeStandard: 'cubic-bezier(0.2, 0, 0, 1)',
    easeSpring: 'cubic-bezier(0.16, 1, 0.3, 1)',
    // Focus
    focusRing: '0 0 0 3px rgba(53, 158, 255, 0.5)',
    // Container
    containerMax: '1200px',
    containerGutterPhone: '16px',
    containerGutterTablet: '24px',
    containerGutterDesktop: '36px',
  },
};

/**
 * Light Theme (Daylight)
 * For daytime sessions or low-brightness preference
 */
export const DAYLIGHT: AppTheme = {
  id: 'daylight',
  name: 'Daylight',
  description: 'Light theme for daytime sessions',
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
    fontIcon: 'Material Symbols Outlined',
    leadingTight: '1.06',
    trackingDisplay: '-0.02em',
  },
  shape: {
    borderRadius: '0.25rem',
    borderRadiusLg: '0.5rem',
    borderRadiusXl: '0.75rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    boxShadowLg: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    // DAYLIGHT-specific: lighter shadows
    elevRaised: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    elevModal: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    // Add rest same as CLASSIC_DND defaults
    radiusSm: '4px',
    radiusMd: '8px',
    radiusLg: '12px',
    radiusXl: '16px',
    radius2xl: '24px',
    radiusPill: '9999px',
    elevFlat: 'none',
    elevRing: '0 0 0 1px rgba(0, 0, 0, 0.1)',
    elevGlow: '0 0 20px rgba(59, 130, 246, 0.2)',
    motionFast: '150ms',
    motionBase: '300ms',
    motionSlow: '500ms',
    motionHp: '700ms',
    easeStandard: 'cubic-bezier(0.2, 0, 0, 1)',
    easeSpring: 'cubic-bezier(0.16, 1, 0.3, 1)',
    focusRing: '0 0 0 3px rgba(37, 99, 235, 0.5)',
    containerMax: '1200px',
    containerGutterPhone: '16px',
    containerGutterTablet: '24px',
    containerGutterDesktop: '36px',
  },
};

/**
 * Dragon Blood Theme (Red/Dark)
 * Reddish tones for an epic atmosphere
 */
export const DRAGON_BLOOD: AppTheme = {
  id: 'dragon-blood',
  name: 'Dragon Blood',
  description: 'Dark reddish tones for an epic atmosphere',
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
 * Elven Forest Theme (Green/Natural)
 * Deep greens for nature lovers
 */
export const ELVEN_FOREST: AppTheme = {
  id: 'elven-forest',
  name: 'Elven Forest',
  description: 'Deep greens and natural tones',
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
 * Underdark Theme (Purple/Violet Dark)
 * Bioluminescent purples and deep shadows — the beauty of the deep dark
 */
export const UNDERDARK: AppTheme = {
  id: 'underdark',
  name: 'Underdark',
  description: 'Bioluminescent purples and deep shadows',
  category: 'official',
  isDark: true,
  wcagCompliant: true,
  colors: {
    background: '#0D0A1A',
    backgroundSecondary: '#15102B',
    surface: '#15102B',
    surfaceHighlight: '#241A45',
    textPrimary: '#EDE9FE',
    textSecondary: '#D8B4FE',
    textMuted: '#A78BFA',
    primary: '#8B5CF6',
    primaryDark: '#7C3AED',
    secondary: '#A855F7',
    accent: '#2DD4BF',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#A78BFA',
    border: 'rgba(139, 92, 246, 0.15)',
    borderHover: 'rgba(139, 92, 246, 0.3)',
  },
  typography: {
    ...CLASSIC_DND.typography,
    trackingDisplay: '-0.015em',
  },
  shape: {
    ...CLASSIC_DND.shape,
    borderRadius: '0.5rem',
    borderRadiusLg: '0.75rem',
    borderRadiusXl: '1rem',
    radiusSm: '6px',
    radiusMd: '10px',
    radiusLg: '14px',
    radiusXl: '20px',
    radius2xl: '28px',
    elevGlow: '0 0 24px rgba(139, 92, 246, 0.3)',
    elevRing: '0 0 0 1px rgba(139, 92, 246, 0.15)',
    focusRing: '0 0 0 3px rgba(139, 92, 246, 0.5)',
  },
};

/**
 * Arcane Library Theme (Amber/Gold on Warm Brown)
 * Ancient tomes, candlelight, and polished oak — scholarly warmth
 */
export const ARCANE_LIBRARY: AppTheme = {
  id: 'arcane-library',
  name: 'Arcane Library',
  description: 'Ancient tomes, candlelight, and polished oak',
  category: 'official',
  isDark: true,
  wcagCompliant: true,
  colors: {
    background: '#1A1510',
    backgroundSecondary: '#231D15',
    surface: '#231D15',
    surfaceHighlight: '#352B1E',
    textPrimary: '#FEF3C7',
    textSecondary: '#FDE68A',
    textMuted: '#B8A87C',
    primary: '#F59E0B',
    primaryDark: '#D97706',
    secondary: '#B45309',
    accent: '#FBBF24',
    success: '#34D399',
    warning: '#F59E0B',
    error: '#F87171',
    info: '#F59E0B',
    border: 'rgba(245, 158, 11, 0.12)',
    borderHover: 'rgba(245, 158, 11, 0.25)',
  },
  typography: {
    ...CLASSIC_DND.typography,
    fontSizeBase: '0.9rem',
    lineHeightBase: '1.55',
    trackingDisplay: '-0.01em',
  },
  shape: {
    ...CLASSIC_DND.shape,
    borderRadius: '0.1875rem',
    borderRadiusLg: '0.375rem',
    borderRadiusXl: '0.625rem',
    radiusSm: '3px',
    radiusMd: '6px',
    radiusLg: '9px',
    radiusXl: '12px',
    radius2xl: '18px',
    elevRaised: '0 6px 12px -4px rgba(0, 0, 0, 0.5)',
    elevModal: '0 12px 20px -6px rgba(0, 0, 0, 0.6)',
    elevGlow: '0 0 16px rgba(245, 158, 11, 0.25)',
    elevRing: '0 0 0 1px rgba(245, 158, 11, 0.12)',
    focusRing: '0 0 0 3px rgba(245, 158, 11, 0.5)',
    motionSlow: '600ms',
    easeStandard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

/**
 * Frozen North Theme (Ice Blue/Cyan with Crystalline Edges)
 * Sharp as a glacier, cold as the Spine of the World
 */
export const FROZEN_NORTH: AppTheme = {
  id: 'frozen-north',
  name: 'Frozen North',
  description: 'Sharp crystalline ice — cold as the Spine of the World',
  category: 'official',
  isDark: true,
  wcagCompliant: true,
  colors: {
    background: '#0F1A24',
    backgroundSecondary: '#152535',
    surface: '#152535',
    surfaceHighlight: '#1C344A',
    textPrimary: '#ECFEFF',
    textSecondary: '#CFFAFE',
    textMuted: '#67E8F9',
    primary: '#22D3EE',
    primaryDark: '#06B6D4',
    secondary: '#0891B2',
    accent: '#A5F3FC',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#22D3EE',
    border: 'rgba(34, 211, 238, 0.12)',
    borderHover: 'rgba(34, 211, 238, 0.25)',
  },
  typography: {
    ...CLASSIC_DND.typography,
    fontSizeBase: '0.875rem',
    lineHeightBase: '1.45',
    trackingDisplay: '-0.025em',
  },
  shape: {
    ...CLASSIC_DND.shape,
    borderRadius: '0.0625rem',
    borderRadiusLg: '0.125rem',
    borderRadiusXl: '0.1875rem',
    radiusSm: '1px',
    radiusMd: '2px',
    radiusLg: '3px',
    radiusXl: '4px',
    radius2xl: '6px',
    radiusPill: '2px',
    elevRaised: '0 2px 0 0 rgba(34, 211, 238, 0.15)',
    elevModal: '0 4px 0 0 rgba(34, 211, 238, 0.2)',
    elevGlow: '0 0 20px rgba(34, 211, 238, 0.2)',
    elevRing: '0 0 0 1px rgba(34, 211, 238, 0.15)',
    focusRing: '0 0 0 2px rgba(34, 211, 238, 0.6)',
    motionFast: '100ms',
    motionBase: '200ms',
    easeStandard: 'cubic-bezier(0, 0, 0.2, 1)',
  },
};

/**
 * Infernal Forge Theme (Lava/Ember on Dark Charcoal)
 * The heat of the Nine Hells — fire, brimstone, and molten steel
 */
export const INFERNAL_FORGE: AppTheme = {
  id: 'infernal-forge',
  name: 'Infernal Forge',
  description: 'The heat of the Nine Hells — fire and molten steel',
  category: 'official',
  isDark: true,
  wcagCompliant: true,
  colors: {
    background: '#0F0A08',
    backgroundSecondary: '#1A100E',
    surface: '#1A100E',
    surfaceHighlight: '#2B1A14',
    textPrimary: '#FFF7ED',
    textSecondary: '#FED7AA',
    textMuted: '#D69060',
    primary: '#F97316',
    primaryDark: '#EA580C',
    secondary: '#DC2626',
    accent: '#FBBF24',
    success: '#4ADE80',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#F97316',
    border: 'rgba(249, 115, 22, 0.15)',
    borderHover: 'rgba(249, 115, 22, 0.3)',
  },
  typography: {
    ...CLASSIC_DND.typography,
    fontSizeBase: '0.875rem',
    lineHeightBase: '1.5',
    trackingDisplay: '-0.015em',
  },
  shape: {
    ...CLASSIC_DND.shape,
    borderRadius: '0.25rem',
    borderRadiusLg: '0.5rem',
    borderRadiusXl: '0.75rem',
    radiusSm: '4px',
    radiusMd: '8px',
    radiusLg: '12px',
    radiusXl: '16px',
    radius2xl: '24px',
    elevGlow: '0 0 20px rgba(249, 115, 22, 0.3)',
    elevRing: '0 0 0 1px rgba(249, 115, 22, 0.1)',
    focusRing: '0 0 0 3px rgba(249, 115, 22, 0.5)',
    motionFast: '120ms',
    motionBase: '250ms',
    motionSlow: '450ms',
    easeStandard: 'cubic-bezier(0.2, 0, 0, 1)',
  },
};

/**
 * Astral Plane Theme (Cosmic Indigo/Magenta)
 * Drifting through the Silver Void — stars, nebulae, and divine energy
 */
export const ASTRAL_PLANE: AppTheme = {
  id: 'astral-plane',
  name: 'Astral Plane',
  description: 'Drifting through the Silver Void — stars and nebulae',
  category: 'official',
  isDark: true,
  wcagCompliant: true,
  colors: {
    background: '#0B0B1A',
    backgroundSecondary: '#13132E',
    surface: '#13132E',
    surfaceHighlight: '#1D1D45',
    textPrimary: '#F5F3FF',
    textSecondary: '#E0E7FF',
    textMuted: '#A5B4FC',
    primary: '#818CF8',
    primaryDark: '#6366F1',
    secondary: '#C084FC',
    accent: '#E879F9',
    success: '#6EE7B7',
    warning: '#FDE68A',
    error: '#FDA4AF',
    info: '#818CF8',
    border: 'rgba(129, 140, 248, 0.12)',
    borderHover: 'rgba(129, 140, 248, 0.25)',
  },
  typography: {
    ...CLASSIC_DND.typography,
    fontSizeBase: '0.875rem',
    lineHeightBase: '1.5',
    trackingDisplay: '-0.015em',
  },
  shape: {
    ...CLASSIC_DND.shape,
    borderRadius: '0.375rem',
    borderRadiusLg: '0.625rem',
    borderRadiusXl: '0.875rem',
    radiusSm: '5px',
    radiusMd: '9px',
    radiusLg: '13px',
    radiusXl: '18px',
    radius2xl: '26px',
    elevGlow: '0 0 30px rgba(129, 140, 248, 0.2)',
    elevRing: '0 0 0 1px rgba(129, 140, 248, 0.1)',
    elevModal: '0 8px 24px -4px rgba(0, 0, 0, 0.5)',
    focusRing: '0 0 0 3px rgba(129, 140, 248, 0.5)',
  },
};

/**
 * High Contrast Theme (Accessibility)
 * Maximum contrast for WCAG AAA accessibility
 */
export const HIGH_CONTRAST: AppTheme = {
  id: 'high-contrast',
  name: 'High Contrast',
  description: 'Maximum contrast for WCAG AAA accessibility',
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
    fontIcon: 'Material Symbols Outlined',
    leadingTight: '1.06',
    trackingDisplay: '-0.02em',
  },
  shape: {
    borderRadius: '0.125rem',
    borderRadiusLg: '0.25rem',
    borderRadiusXl: '0.5rem',
    boxShadow: 'none',
    boxShadowLg: 'none',
    // Radius scale (reduced for HC)
    radiusSm: '2px',
    radiusMd: '4px',
    radiusLg: '6px',
    radiusXl: '8px',
    radius2xl: '12px',
    radiusPill: '9999px',
    // Elevation — none for HC
    elevFlat: 'none',
    elevRing: 'none',
    elevRaised: 'none',
    elevModal: 'none',
    elevGlow: 'none',
    // Motion durations
    motionFast: '150ms',
    motionBase: '300ms',
    motionSlow: '500ms',
    motionHp: '700ms',
    // Easing curves
    easeStandard: 'cubic-bezier(0.2, 0, 0, 1)',
    easeSpring: 'cubic-bezier(0.16, 1, 0.3, 1)',
    // Focus — yellow for HC
    focusRing: '0 0 0 3px #FFFF00',
    // Container
    containerMax: '1200px',
    containerGutterPhone: '16px',
    containerGutterTablet: '24px',
    containerGutterDesktop: '36px',
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
  UNDERDARK,
  ARCANE_LIBRARY,
  FROZEN_NORTH,
  INFERNAL_FORGE,
  ASTRAL_PLANE,
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
