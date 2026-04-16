import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Character } from '../types';
import {
  compressCharacterToSnapshot,
  restoreCharacterFromSnapshot,
  calculateLevelResetChanges,
  generateSnapshotId,
  formatTimestamp,
  getStorageData,
  saveStorageData,
  createSnapshotObject,
} from '../utils/levelResetUtils';
import {
  createEmptyStoredData,
  STORAGE_VERSION,
  MAX_SNAPSHOTS_PER_CHARACTER,
  MAX_AUDIT_LOGS_PER_CHARACTER,
} from '../types/levelSnapshot';

const createMockCharacter = (overrides: Partial<Character> = {}): Character => ({
  id: 'test-char-1',
  name: 'Test Hero',
  level: 3,
  class: 'Fighter',
  species: 'Human',
  hp: { current: 25, max: 30, temp: 0 },
  stats: { STR: 16, DEX: 14, CON: 14, INT: 10, WIS: 12, CHA: 8 },
  skills: ['Athletics', 'Perception'],
  feats: ['Great Weapon Master'],
  profBonus: 2,
  ac: 18,
  init: 2,
  speed: 30,
  languages: ['Common', 'Dwarvish'],
  inventory: [{ id: 'item-1', name: 'Sword', quantity: 1, equipped: true } as any],
  isRaging: false,
  party_id: null,
  created_at: Date.now(),
  updated_at: Date.now(),
  ...overrides,
} as Character);

describe('levelResetUtils', () => {
  describe('compressCharacterToSnapshot', () => {
    it('should compress character to snapshot format', () => {
      const character = createMockCharacter({ level: 5, hp: { current: 40, max: 45, temp: 0 } });
      
      const snapshot = compressCharacterToSnapshot(character);
      
      expect(snapshot.level).toBe(5);
      expect(snapshot.hp.max).toBe(45);
      expect(snapshot.hp.current).toBe(40);
      expect(snapshot.class).toBe('Fighter');
      expect(snapshot.stats.STR).toBe(16);
      expect(snapshot.skills).toEqual(['Athletics', 'Perception']);
      expect(snapshot.feats).toEqual(['Great Weapon Master']);
    });

    it('should include all character fields', () => {
      const character = createMockCharacter({
        stats: { STR: 16, DEX: 14, CON: 14, INT: 10, WIS: 12, CHA: 8 },
        speed: 30,
        ac: 18,
        init: 2,
        profBonus: 2,
      });
      
      const snapshot = compressCharacterToSnapshot(character);
      
      expect(snapshot.stats.STR).toBe(16);
      expect(snapshot.stats.DEX).toBe(14);
      expect(snapshot.speed).toBe(30);
      expect(snapshot.ac).toBe(18);
      expect(snapshot.init).toBe(2);
      expect(snapshot.profBonus).toBe(2);
    });

    it('should copy arrays to avoid mutations', () => {
      const character = createMockCharacter();
      
      const snapshot = compressCharacterToSnapshot(character);
      
      expect(snapshot.skills).not.toBe(character.skills);
      expect(snapshot.skills).toEqual(character.skills);
      expect(snapshot.inventory).not.toBe(character.inventory);
    });

    it('should handle optional fields correctly', () => {
      const character = createMockCharacter({
        subclass: 'Champion',
        rageUses: { current: 2, max: 2 },
      });
      
      const snapshot = compressCharacterToSnapshot(character);
      
      expect(snapshot.subclass).toBe('Champion');
      expect(snapshot.rageUses?.current).toBe(2);
    });
  });

  describe('restoreCharacterFromSnapshot', () => {
    it('should restore character from snapshot', () => {
      const original = createMockCharacter();
      const snapshot = compressCharacterToSnapshot(original);
      const currentCharacter = createMockCharacter({ level: 7, hp: { current: 50, max: 55, temp: 0 } });
      
      const restored = restoreCharacterFromSnapshot(currentCharacter, snapshot);
      
      expect(restored.level).toBe(3);
      expect(restored.hp.max).toBe(30);
      expect(restored.hp.current).toBe(25);
    });

    it('should restore skills and feats', () => {
      const original = createMockCharacter({
        skills: ['Athletics', 'Stealth', 'Acrobatics'],
        feats: ['GWM', 'Lucky'],
      });
      const snapshot = compressCharacterToSnapshot(original);
      const currentCharacter = createMockCharacter({
        skills: ['Perception', 'Insight'],
        feats: ['Alert'],
      });
      
      const restored = restoreCharacterFromSnapshot(currentCharacter, snapshot);
      
      expect(restored.skills).toEqual(['Athletics', 'Stealth', 'Acrobatics']);
      expect(restored.feats).toEqual(['GWM', 'Lucky']);
    });

    it('should preserve non-snapshot fields', () => {
      const original = createMockCharacter({ id: 'test-123' });
      const snapshot = compressCharacterToSnapshot(original);
      const currentCharacter = createMockCharacter({ id: 'test-123' });
      
      const restored = restoreCharacterFromSnapshot(currentCharacter, snapshot);
      
      expect(restored.id).toBe('test-123');
    });
  });

  describe('calculateLevelResetChanges', () => {
    it('should calculate HP change', () => {
      const current = createMockCharacter({ hp: { current: 50, max: 55, temp: 0 } });
      const target = createMockCharacter({ hp: { current: 30, max: 35, temp: 0 } });
      
      const changes = calculateLevelResetChanges(current, target);
      
      expect(changes.hpChange).toBe(-20);
    });

    it('should calculate level change in resources affected', () => {
      const current = createMockCharacter({ level: 7 });
      const target = createMockCharacter({ level: 4 });
      
      const changes = calculateLevelResetChanges(current, target);
      
      expect(changes.resourcesAffected.some(r => r.includes('Level 7'))).toBe(true);
    });

    it('should detect feats that will be lost', () => {
      const current = createMockCharacter({ feats: ['GWM', 'Lucky', 'Alert'] });
      const target = createMockCharacter({ feats: ['GWM'] });
      
      const changes = calculateLevelResetChanges(current, target);
      
      expect(changes.featsLost).toContain('Lucky');
      expect(changes.featsLost).toContain('Alert');
    });

    it('should detect subclass changes', () => {
      const current = createMockCharacter({ subclass: 'Champion' });
      const target = createMockCharacter({ subclass: undefined });
      
      const changes = calculateLevelResetChanges(current, target);
      
      expect(changes.subclassChanges).toBe(true);
    });

    it('should handle stats changes', () => {
      const current = createMockCharacter({
        stats: { STR: 18, DEX: 14, CON: 14, INT: 10, WIS: 12, CHA: 8 },
      });
      const target = createMockCharacter({
        stats: { STR: 16, DEX: 14, CON: 14, INT: 10, WIS: 12, CHA: 8 },
      });
      
      const changes = calculateLevelResetChanges(current, target);
      
      expect(changes.statsChanges.STR).toBe(-2);
    });
  });

  describe('generateSnapshotId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateSnapshotId();
      const id2 = generateSnapshotId();
      
      expect(id1).not.toBe(id2);
    });

    it('should generate a valid UUID format', () => {
      const id = generateSnapshotId();
      
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });
  });

  describe('formatTimestamp', () => {
    it('should format recent timestamps as "just now"', () => {
      const now = Date.now();
      const result = formatTimestamp(now);
      
      expect(result).toBe('just now');
    });

    it('should format minutes ago', () => {
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      const result = formatTimestamp(fiveMinutesAgo);
      
      expect(result).toContain('min');
    });

    it('should format hours ago', () => {
      const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
      const result = formatTimestamp(twoHoursAgo);
      
      expect(result).toContain('h');
    });

    it('should format days ago', () => {
      const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
      const result = formatTimestamp(twoDaysAgo);
      
      expect(result).toContain('d');
    });
  });

  describe('createEmptyStoredData', () => {
    it('should create valid empty storage structure', () => {
      const data = createEmptyStoredData();
      
      expect(data.snapshots).toEqual({});
      expect(data.auditLog).toEqual([]);
      expect(data.version).toBe(STORAGE_VERSION);
      expect(data.lastUpdated).toBeDefined();
    });
  });

  describe('Constants', () => {
    it('should have correct MAX_SNAPSHOTS_PER_CHARACTER', () => {
      expect(MAX_SNAPSHOTS_PER_CHARACTER).toBe(20);
    });

    it('should have correct MAX_AUDIT_LOGS_PER_CHARACTER', () => {
      expect(MAX_AUDIT_LOGS_PER_CHARACTER).toBe(100);
    });

    it('should have valid STORAGE_VERSION', () => {
      expect(STORAGE_VERSION).toBe('1.0.0');
    });
  });
});
