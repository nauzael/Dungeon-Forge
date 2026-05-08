/**
 * Utilidad para validación de contraste WCAG 2.2
 * Calcula ratios de contraste y verifica cumplimiento AA/AAA
 */

/**
 * Convertir hex a RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  };
}

/**
 * Calcular luminancia relativa (WCAG 2.1)
 */
function relativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const [rs, gs, bs] = [rgb.r, rgb.g, rgb.b].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calcular ratio de contraste entre dos colores
 * Retorna valor entre 1 (mismo color) y 21 (blanco/negro)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = relativeLuminance(hexToRgb(color1));
  const lum2 = relativeLuminance(hexToRgb(color2));
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Verificar cumplimiento WCAG para un par de colores
 * @param foreground Color de frente (texto, iconos)
 * @param background Color de fondo
 * @param level Nivel de cumplimiento: 'AA' o 'AAA'
 * @param size Tamaño del texto: 'normal' o 'large' (18px+ o 14px bold)
 */
export function checkWcagCompliance(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = getContrastRatio(foreground, background);
  
  // Requisitos WCAG
  const requirements = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 },
  };
  
  return ratio >= requirements[level][size];
}

/**
 * Resultado de validación de tema
 */
interface ValidationResults {
  compliant: boolean;
  issues: string[];
  ratios: Record<string, number>;
}

/**
 * Validar todos los colores de un tema
 * @param colors Objeto de colores del tema
 * @returns Resultados de validación
 */
export function validateThemeColors(colors: {
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  background: string;
  backgroundSecondary: string;
  surface: string;
  primary: string;
  success: string;
  warning: string;
  error: string;
}): ValidationResults {
  const issues: string[] = [];
  const ratios: Record<string, number> = {};

  // Texto primario sobre fondo principal
  ratios['textPrimary/background'] = getContrastRatio(colors.textPrimary, colors.background);
  if (ratios['textPrimary/background'] < 4.5) {
    issues.push('Texto primario no cumple WCAG AA (4.5:1)');
  }

  // Texto secundario sobre fondo secundario
  ratios['textSecondary/backgroundSecondary'] = getContrastRatio(colors.textSecondary, colors.backgroundSecondary);
  if (ratios['textSecondary/backgroundSecondary'] < 4.5) {
    issues.push('Texto secundario no cumple WCAG AA');
  }

  // Texto primario sobre superficie
  ratios['textPrimary/surface'] = getContrastRatio(colors.textPrimary, colors.surface);
  if (ratios['textPrimary/surface'] < 4.5) {
    issues.push('Texto primario sobre superficie no cumple WCAG AA');
  }

  // Color primario sobre superficie (elementos grandes)
  ratios['primary/surface'] = getContrastRatio(colors.primary, colors.surface);
  if (ratios['primary/surface'] < 3) {
    issues.push('Color primario no cumple WCAG AA para elementos grandes (3:1)');
  }

  // Colores de estado
  const statusColors = { success: colors.success, warning: colors.warning, error: colors.error };
  Object.entries(statusColors).forEach(([key, color]) => {
    ratios[`status-${key}/surface`] = getContrastRatio(color, colors.surface);
    if (ratios[`status-${key}/surface`] < 3) {
      issues.push(`Color ${key} no cumple contraste mínimo (3:1)`);
    }
  });

  return {
    compliant: issues.length === 0,
    issues,
    ratios,
  };
}

/**
 * Obtener recomendación de color más claro u oscuro
 * @param baseColor Color base
 * @param targetColor Color objetivo para contraste
 * @param minRatio Ratio mínimo deseado
 */
export function getContrastRecommendation(
  baseColor: string,
  targetColor: string,
  minRatio: number = 4.5
): { meets: boolean; suggestion?: string } {
  const ratio = getContrastRatio(baseColor, targetColor);
  
  if (ratio >= minRatio) {
    return { meets: true };
  }

  // Sugerir ajuste (simplificado)
  const isDark = relativeLuminance(hexToRgb(targetColor)) < 0.5;
  const suggestion = isDark ? 'Usa un color más claro' : 'Usa un color más oscuro';
  
  return { meets: false, suggestion };
}
