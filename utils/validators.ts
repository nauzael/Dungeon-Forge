import { Character } from '../types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Valida que un Character tenga todos los campos requeridos antes de guardar a cloud.
 * Esta validación es crítica para evitar corrupción de datos en la base de datos.
 *
 * Campos requeridos:
 * - id: UUID válido
 * - name: no vacío
 * - level: 1-20
 * - class: valor conocido
 * - species: valor conocido
 * - hp: objeto con current, max, temp válidos
 * - stats: objeto con STR, DEX, CON, INT, WIS, CHA (3-20 cada uno)
 * - ac: número 0-30
 * - init: número -5 a 10
 * - speed: número positivo
 * - profBonus: número 1-6
 * - inventory: array de items
 * - imageUrl: string (puede estar vacío)
 */
export function isValidCharacter(character: Character): ValidationResult {
  const errors: string[] = [];

  // Validaciones básicas
  if (!character.id || typeof character.id !== 'string') {
    errors.push('Missing or invalid id');
  }

  if (!character.name || typeof character.name !== 'string' || character.name.trim().length === 0) {
    errors.push('Missing or invalid name');
  }

  if (typeof character.level !== 'number' || character.level < 1 || character.level > 20) {
    errors.push('Level must be between 1 and 20');
  }

  if (!character.class || typeof character.class !== 'string') {
    errors.push('Missing or invalid class');
  }

  if (!character.species || typeof character.species !== 'string') {
    errors.push('Missing or invalid species');
  }

  // Validar HP
  if (!character.hp || typeof character.hp !== 'object') {
    errors.push('Missing hp object');
  } else {
    const { current, max, temp } = character.hp;
    if (typeof current !== 'number' || current < 0) {
      errors.push('hp.current must be a non-negative number');
    }
    if (typeof max !== 'number' || max <= 0) {
      errors.push('hp.max must be a positive number');
    }
    if (typeof temp !== 'number' || temp < 0) {
      errors.push('hp.temp must be a non-negative number');
    }
  }

  // Validar Stats
  if (!character.stats || typeof character.stats !== 'object') {
    errors.push('Missing stats object');
  } else {
    const abilities = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
    for (const ability of abilities) {
      const value = character.stats[ability];
      if (typeof value !== 'number' || value < 3 || value > 20) {
        errors.push(`${ability} must be between 3 and 20, got ${value}`);
      }
    }
  }

  // Validar AC
  if (typeof character.ac !== 'number' || character.ac < 0 || character.ac > 30) {
    errors.push('AC must be between 0 and 30');
  }

  // Validar Initiative
  if (typeof character.init !== 'number' || character.init < -5 || character.init > 10) {
    errors.push('Initiative must be between -5 and 10');
  }

  // Validar Speed
  if (typeof character.speed !== 'number' || character.speed <= 0) {
    errors.push('Speed must be a positive number');
  }

  // Validar Prof Bonus
  if (typeof character.profBonus !== 'number' || character.profBonus < 1 || character.profBonus > 6) {
    errors.push('Proficiency Bonus must be between 1 and 6');
  }

  // Validar Inventory
  if (!Array.isArray(character.inventory)) {
    errors.push('Inventory must be an array');
  } else {
    for (let i = 0; i < character.inventory.length; i++) {
      const item = character.inventory[i];
      if (!item.id || !item.name || typeof item.quantity !== 'number') {
        errors.push(`Inventory item ${i} has invalid structure`);
      }
    }
  }

  // Validar imageUrl (puede estar vacío, pero debe ser string)
  if (typeof character.imageUrl !== 'string') {
    errors.push('imageUrl must be a string');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
