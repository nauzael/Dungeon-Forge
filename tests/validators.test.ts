import { describe, it, expect } from 'vitest';
import { isValidCharacter } from '../utils/validators';
import type { Character } from '../types';

describe('isValidCharacter', () => {
  // Helper: crear character válido base
  const createValidCharacter = (overrides?: Partial<Character>): Partial<Character> => ({
    name: 'Test Character',
    class: 'Wizard',
    level: 5,
    species: 'Human',
    hp: { current: 30, max: 30, temp: 0 },
    ac: 15,
    stats: { STR: 10, DEX: 14, CON: 12, INT: 16, WIS: 13, CHA: 11 },
    ...overrides
  });

  describe('válidos - casos happy path', () => {
    it('debe validar character completamente válido', () => {
      const char = createValidCharacter();
      const result = isValidCharacter(char);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('debe permitir HP current = 0', () => {
      const char = createValidCharacter({ hp: { current: 0, max: 30, temp: 0 } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(true);
    });

    it('debe permitir temp = 0', () => {
      const char = createValidCharacter({ hp: { current: 10, max: 30, temp: 0 } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(true);
    });

    it('debe permitir AC = 0', () => {
      const char = createValidCharacter({ ac: 0 });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(true);
    });

    it('debe permitir Stats = 3 (mínimo)', () => {
      const char = createValidCharacter({ stats: { STR: 3, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(true);
    });

    it('debe permitir Stats = 20 (máximo)', () => {
      const char = createValidCharacter({ stats: { STR: 20, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(true);
    });

    it('debe permitir level 1-20', () => {
      for (let i = 1; i <= 20; i++) {
        const char = createValidCharacter({ level: i });
        const result = isValidCharacter(char);
        expect(result.valid).toBe(true);
      }
    });

    it('debe permitir character parcial (solo algunos campos)', () => {
      const partial: Partial<Character> = { name: 'Partial', class: 'Barbarian' };
      const result = isValidCharacter(partial);
      expect(result.valid).toBe(true);
    });
  });

  describe('HP validation', () => {
    it('debe rechazar HP current = NaN', () => {
      const char = createValidCharacter({ hp: { current: NaN, max: 30, temp: 0 } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('HP current'))).toBe(true);
    });

    it('debe rechazar HP max = NaN', () => {
      const char = createValidCharacter({ hp: { current: 30, max: NaN, temp: 0 } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('HP max'))).toBe(true);
    });

    it('debe rechazar HP temp = NaN', () => {
      const char = createValidCharacter({ hp: { current: 30, max: 30, temp: NaN } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('HP temp'))).toBe(true);
    });

    it('debe rechazar HP current = Infinity', () => {
      const char = createValidCharacter({ hp: { current: Infinity, max: 30, temp: 0 } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('HP current'))).toBe(true);
    });

    it('debe rechazar HP current > max', () => {
      const char = createValidCharacter({ hp: { current: 100, max: 30, temp: 0 } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('HP current') && e.includes('max'))).toBe(true);
    });

    it('debe rechazar HP current < 0', () => {
      const char = createValidCharacter({ hp: { current: -1, max: 30, temp: 0 } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('HP current'))).toBe(true);
    });

    it('debe rechazar HP max < 1', () => {
      const char = createValidCharacter({ hp: { current: 0, max: 0, temp: 0 } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('HP max'))).toBe(true);
    });
  });

  describe('AC validation', () => {
    it('debe rechazar AC < 0', () => {
      const char = createValidCharacter({ ac: -1 });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('AC'))).toBe(true);
    });

    it('debe rechazar AC > 30', () => {
      const char = createValidCharacter({ ac: 31 });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('AC'))).toBe(true);
    });

    it('debe rechazar AC = NaN', () => {
      const char = createValidCharacter({ ac: NaN });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('AC'))).toBe(true);
    });

    it('debe permitir AC = 30 (máximo)', () => {
      const char = createValidCharacter({ ac: 30 });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(true);
    });
  });

  describe('Stats validation', () => {
    it('debe rechazar STR < 3', () => {
      const char = createValidCharacter({ stats: { STR: 2, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('STR'))).toBe(true);
    });

    it('debe rechazar DEX > 20', () => {
      const char = createValidCharacter({ stats: { STR: 10, DEX: 21, CON: 10, INT: 10, WIS: 10, CHA: 10 } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('DEX'))).toBe(true);
    });

    it('debe rechazar CON = NaN', () => {
      const char = createValidCharacter({ stats: { STR: 10, DEX: 10, CON: NaN, INT: 10, WIS: 10, CHA: 10 } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('CON'))).toBe(true);
    });

    it('debe rechazar INT = Infinity', () => {
      const char = createValidCharacter({ stats: { STR: 10, DEX: 10, CON: 10, INT: Infinity, WIS: 10, CHA: 10 } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('INT'))).toBe(true);
    });

    it('debe validar todos los 6 stats', () => {
      const char = createValidCharacter({ stats: { STR: 25, DEX: 25, CON: 25, INT: 25, WIS: 25, CHA: 25 } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('Level validation', () => {
    it('debe rechazar level < 1', () => {
      const char = createValidCharacter({ level: 0 });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('level'))).toBe(true);
    });

    it('debe rechazar level > 20', () => {
      const char = createValidCharacter({ level: 21 });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('level'))).toBe(true);
    });

    it('debe rechazar level = NaN', () => {
      const char = createValidCharacter({ level: NaN });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('level'))).toBe(true);
    });
  });

  describe('Spell slots validation', () => {
    it('debe rechazar spell slot = NaN', () => {
      const char = createValidCharacter({ spellSlots: { 1: { current: NaN, max: 5 } } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('spell slot'))).toBe(true);
    });

    it('debe rechazar spell slot < 0', () => {
      const char = createValidCharacter({ spellSlots: { 1: { current: -1, max: 5 } } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('spell slot'))).toBe(true);
    });

    it('debe rechazar spell slot max < 0', () => {
      const char = createValidCharacter({ spellSlots: { 1: { current: 0, max: -1 } } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('spell slot'))).toBe(true);
    });

    it('debe permitir spell slots = 0', () => {
      const char = createValidCharacter({ spellSlots: { 1: { current: 0, max: 0 } } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(true);
    });
  });

  describe('Resources validation', () => {
    it('debe rechazar rageUses = NaN', () => {
      const char = createValidCharacter({ rageUses: { current: NaN, max: 10 } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('rageUses'))).toBe(true);
    });

    it('debe rechazar bardicInspiration < 0', () => {
      const char = createValidCharacter({ bardicInspiration: { current: -1, max: 5 } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('bardicInspiration'))).toBe(true);
    });

    it('debe permitir resources = 0', () => {
      const char = createValidCharacter({ sorceryPoints: { current: 0, max: 10 } });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(true);
    });
  });

  describe('Name validation', () => {
    it('debe rechazar nombre vacío', () => {
      const char = createValidCharacter({ name: '' });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('name'))).toBe(true);
    });

    it('debe rechazar nombre solo spaces', () => {
      const char = createValidCharacter({ name: '   ' });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('name'))).toBe(true);
    });

    it('debe permitir nombre válido', () => {
      const char = createValidCharacter({ name: 'Frodo Bolsón' });
      const result = isValidCharacter(char);
      expect(result.errors.some(e => e.includes('name'))).toBe(false);
    });
  });

  describe('Class validation', () => {
    it('debe rechazar clase inválida', () => {
      const char = createValidCharacter({ class: 'InvalidClass' });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('class'))).toBe(true);
    });

    it('debe rechazar clase vacía', () => {
      const char = createValidCharacter({ class: '' });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('class'))).toBe(true);
    });

    const validClasses = [
      'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
      'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
    ];

    validClasses.forEach(className => {
      it(`debe permitir clase: ${className}`, () => {
        const char = createValidCharacter({ class: className });
        const result = isValidCharacter(char);
        expect(result.errors.some(e => e.includes('class'))).toBe(false);
      });
    });
  });

  describe('Múltiples errores', () => {
    it('debe retornar múltiples errores en array', () => {
      const char: Partial<Character> = {
        name: '',
        class: 'BadClass',
        level: 25,
        hp: { current: NaN, max: 30, temp: 0 },
        ac: -5,
        stats: { STR: 25, DEX: 0, CON: NaN, INT: -1, WIS: 100, CHA: 21 }
      };
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(5);
    });

    it('debe retornar errores como array (no string)', () => {
      const char = createValidCharacter({ name: '', class: 'Invalid' });
      const result = isValidCharacter(char);
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.errors.every(e => typeof e === 'string')).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('debe manejar character undefined gracefully', () => {
      const result = isValidCharacter(undefined as any);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('debe manejar character null gracefully', () => {
      const result = isValidCharacter(null as any);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('debe permitir character completamente vacío (Partial)', () => {
      const result = isValidCharacter({});
      expect(result.valid).toBe(true);
    });

    it('debe validar Infinity correctamente', () => {
      const char = createValidCharacter({ level: Infinity });
      const result = isValidCharacter(char);
      expect(result.valid).toBe(false);
    });
  });
});
