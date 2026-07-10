import { Character } from '../types';
import { getClassList } from '../Data/classes';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Validaciones utilitarias (funciones privadas)
const isValidNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

/**
 * Validates that a Character has valid data without corruption.
 * Acepta Character parcial (Partial<Character>) para validar solo los campos que existen.
 * 
 * Validaciones:
 * - HP: current no NaN/Infinity, 0 <= current <= max, max >= 1
 * - AC: 0-30, no NaN/Infinity
 * - Stats: 3-20 por stat (si existen), no NaN/Infinity
 * - Level: 1-20, no NaN/Infinity
 * - Spell slots: no NaN/Infinity, >= 0
 * - Resources: no NaN/Infinity, >= 0
 * - Name: not empty
 * - Class: in valid class list
 */
export function isValidCharacter(character: Partial<Character>): ValidationResult {
  const errors: string[] = [];

  // Guard: character debe existir
  if (!character || typeof character !== 'object') {
    errors.push('Character must be an object');
    return { valid: false, errors };
  }

  // Validar name si existe
  if (character.name !== undefined) {
    if (typeof character.name !== 'string' || character.name.trim().length === 0) {
      errors.push('name must be a non-empty string');
    }
  }

  // Validar level si existe
  if (character.level !== undefined) {
    if (!isValidNumber(character.level) || character.level < 1 || character.level > 20) {
      errors.push('level must be between 1 and 20');
    }
  }

  // Validar class si existe
  if (character.class !== undefined) {
    if (typeof character.class !== 'string' || character.class.trim().length === 0) {
      errors.push('class must be a non-empty string');
    } else {
      const validClasses = getClassList();
      if (!validClasses.includes(character.class)) {
        errors.push(`class '${character.class}' is not valid. Valid classes: ${validClasses.join(', ')}`);
      }
    }
  }

  // Validar HP si existe
  if (character.hp !== undefined) {
    if (typeof character.hp === 'object' && character.hp !== null) {
      const { current, max, temp } = character.hp as { current: unknown; max: unknown; temp: unknown };

      // Validar HP current
      if (current !== undefined) {
        if (!isValidNumber(current) || current < 0) {
          errors.push('HP current must be a non-negative number');
        } else if (max !== undefined && isValidNumber(max) && current > max) {
          errors.push(`HP current (${current}) > max (${max})`);
        }
      }

      // Validar HP max
      if (max !== undefined) {
        if (!isValidNumber(max) || max < 1) {
          errors.push('HP max must be >= 1');
        }
      }

      // Validar HP temp
      if (temp !== undefined) {
        if (!isValidNumber(temp) || temp < 0) {
          errors.push('HP temp must be a non-negative number');
        }
      }
    } else {
      errors.push('hp must be an object');
    }
  }

  // Validar AC si existe
  if (character.ac !== undefined) {
    if (!isValidNumber(character.ac) || character.ac < 0 || character.ac > 30) {
      errors.push('AC must be between 0 and 30');
    }
  }

  // Validar Stats si existen
  if (character.stats !== undefined) {
    if (typeof character.stats === 'object' && character.stats !== null) {
      const abilities = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
      for (const ability of abilities) {
        const value = (character.stats as Record<string, unknown>)[ability];
        if (value !== undefined) {
          if (!isValidNumber(value) || value < 3 || value > 20) {
            errors.push(`${ability} must be between 3 and 20`);
          }
        }
      }
    } else {
      errors.push('stats must be an object');
    }
  }

  // Validar Spell slots si existen
  if (character.spellSlots !== undefined) {
    if (typeof character.spellSlots === 'object' && character.spellSlots !== null) {
      for (const [level, slot] of Object.entries(character.spellSlots as Record<string, unknown>)) {
        if (typeof slot === 'object' && slot !== null) {
          const { current, max } = slot as { current: unknown; max: unknown };
          if (current !== undefined && (!isValidNumber(current) || current < 0)) {
            errors.push(`spell slot level ${level} current must be a non-negative number`);
          }
          if (max !== undefined && (!isValidNumber(max) || max < 0)) {
            errors.push(`spell slot level ${level} max must be a non-negative number`);
          }
        }
      }
    } else {
      errors.push('spellSlots must be an object');
    }
  }

  // Validar Resources si existen (rageUses, bardicInspiration, sorceryPoints, etc.)
  const resourceFields = [
    'rageUses',
    'bardicInspiration',
    'channelDivinity',
    'wildShape',
    'layOnHands',
    'actionSurge',
    'secondWind',
    'indomitable',
    'sorceryPoints',
    'innateSorcery',
    'hunterMarkUses',
    'magicalCunning',
    'fontOfInspiration',
    'focus',
    'hitDice',
    'lucky',
    'inspiration'
  ];

  for (const field of resourceFields) {
    const resource = (character as Record<string, unknown>)[field];
    if (resource !== undefined) {
      if (typeof resource === 'object' && resource !== null) {
        const { current, max } = resource as { current: unknown; max: unknown };
        if (current !== undefined && (!isValidNumber(current) || current < 0)) {
          errors.push(`${field} current must be a non-negative number`);
        }
        if (max !== undefined && (!isValidNumber(max) || max < 0)) {
          errors.push(`${field} max must be a non-negative number`);
        }
      } else {
        errors.push(`${field} must be an object`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
