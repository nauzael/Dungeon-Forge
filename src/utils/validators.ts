import { Character } from '../types';

/**
 * Result de validación de un Character
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Valida que un Character tenga datos válidos
 * - No permite NaN, Infinity en stats
 * - HP <= maxHP
 * - Ability scores en rango [3, 20]
 * - IDs no vacíos
 * - Inventory items con ID
 * - Required fields no vacíos
 * 
 * No lanza excepciones, retorna ValidationResult con detalles
 */
export function isValidCharacter(char: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validación básica de objeto
  if (!char || typeof char !== 'object') {
    return {
      valid: false,
      errors: ['Character no es un objeto válido'],
      warnings: []
    };
  }

  const c = char as any;

  // Validar ID
  if (!c.id || typeof c.id !== 'string' || c.id.trim().length === 0) {
    errors.push('Character ID no puede estar vacío');
  }

  // Validar nombre
  if (!c.name || typeof c.name !== 'string' || c.name.trim().length === 0) {
    errors.push('Character name no puede estar vacío');
  }

  // Validar clase
  if (!c.class || typeof c.class !== 'string' || c.class.trim().length === 0) {
    errors.push('Character class no puede estar vacío');
  }

  // Validar nivel
  if (typeof c.level !== 'number' || c.level < 1 || c.level > 20) {
    errors.push('Character level debe estar entre 1 y 20');
  }

  // Validar HP
  if (!c.hp || typeof c.hp !== 'object') {
    errors.push('Character hp structure es inválido');
  } else {
    const { current, max, temp } = c.hp;
    
    if (typeof current !== 'number' || isNaN(current)) {
      errors.push('HP current es NaN');
    }
    if (typeof max !== 'number' || isNaN(max)) {
      errors.push('HP max es NaN');
    }
    if (typeof temp !== 'number' || isNaN(temp)) {
      errors.push('HP temp es NaN');
    }
    
    // HP no puede ser infinito
    if (!isFinite(current) || !isFinite(max) || !isFinite(temp)) {
      errors.push('HP contiene Infinity');
    }
    
    // HP current <= max
    if (isFinite(current) && isFinite(max) && current > max) {
      errors.push(`HP current (${current}) > max (${max})`);
    }
  }

  // Validar stats (ability scores)
  if (!c.stats || typeof c.stats !== 'object') {
    errors.push('Character stats structure es inválido');
  } else {
    const abilities = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
    for (const ability of abilities) {
      const score = c.stats[ability];
      
      if (typeof score !== 'number' || isNaN(score)) {
        errors.push(`${ability} score es NaN`);
      }
      
      // Ability scores en rango [3, 20]
      if (isFinite(score) && (score < 3 || score > 20)) {
        errors.push(`${ability} score ${score} fuera de rango [3, 20]`);
      }
      
      if (!isFinite(score)) {
        errors.push(`${ability} score contiene Infinity`);
      }
    }
  }

  // Validar inventory items
  if (Array.isArray(c.inventory)) {
    for (let i = 0; i < c.inventory.length; i++) {
      const item = c.inventory[i];
      if (!item || typeof item !== 'object') {
        errors.push(`Inventory item ${i} no es un objeto válido`);
      } else if (!item.id || typeof item.id !== 'string') {
        errors.push(`Inventory item ${i} sin ID`);
      } else if (typeof item.quantity !== 'number' || item.quantity < 0) {
        errors.push(`Inventory item ${i} quantity inválida`);
      }
    }
  } else if (c.inventory !== undefined) {
    errors.push('Inventory no es un array');
  }

  // Validar spells (si existen)
  if (Array.isArray(c.spells)) {
    for (let i = 0; i < c.spells.length; i++) {
      const spell = c.spells[i];
      if (!spell || typeof spell !== 'object') {
        errors.push(`Spell ${i} no es un objeto válido`);
      } else if (!spell.name || typeof spell.name !== 'string') {
        errors.push(`Spell ${i} sin name`);
      }
    }
  }

  // Validar features (si existen)
  if (Array.isArray(c.features)) {
    for (let i = 0; i < c.features.length; i++) {
      const feature = c.features[i];
      if (!feature || typeof feature !== 'object') {
        errors.push(`Feature ${i} no es un objeto válido`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
