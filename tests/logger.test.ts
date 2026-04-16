import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logLevelUp, logLevelReset, getLevelUpLogs, clearLevelUpLogs, getLevelUpLogsForCharacter } from '../utils/logger';

const localStorageMock = {
    store: {} as Record<string, string>,
    getItem: vi.fn((key: string) => localStorageMock.store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
        localStorageMock.store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
        delete localStorageMock.store[key];
    }),
};

Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true,
});

describe('Logger Utils', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.store = {};
    });

    describe('logLevelUp', () => {
        it('should store level up log entry in localStorage', () => {
            const entry = {
                timestamp: Date.now(),
                characterId: 'char-123',
                characterName: 'Test Hero',
                fromLevel: 5,
                toLevel: 6,
                changes: {
                    hpChange: 8,
                    newFeatures: ['Extra Attack'],
                    newFeats: [],
                    statsIncreased: [],
                },
                source: 'level_up' as const,
            };

            logLevelUp(entry);

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'dungeon_forge_level_logs',
                expect.any(String)
            );

            const storedLogs = JSON.parse(localStorageMock.store['dungeon_forge_level_logs']);
            expect(storedLogs).toHaveLength(1);
            expect(storedLogs[0].characterId).toBe('char-123');
            expect(storedLogs[0].fromLevel).toBe(5);
            expect(storedLogs[0].toLevel).toBe(6);
        });

        it('should limit stored logs to 100 entries', () => {
            for (let i = 0; i < 105; i++) {
                logLevelUp({
                    timestamp: Date.now() + i,
                    characterId: 'char-123',
                    characterName: 'Test Hero',
                    fromLevel: i,
                    toLevel: i + 1,
                    changes: { hpChange: 5, newFeatures: [], newFeats: [], statsIncreased: [] },
                    source: 'level_up',
                });
            }

            const storedLogs = JSON.parse(localStorageMock.store['dungeon_forge_level_logs']);
            expect(storedLogs).toHaveLength(100);
        });

        it('should handle localStorage errors gracefully', () => {
            localStorageMock.setItem.mockImplementationOnce(() => {
                throw new Error('Quota exceeded');
            });

            const entry = {
                timestamp: Date.now(),
                characterId: 'char-123',
                characterName: 'Test Hero',
                fromLevel: 5,
                toLevel: 6,
                changes: { hpChange: 8, newFeatures: [], newFeats: [], statsIncreased: [] },
                source: 'level_up' as const,
            };

            expect(() => logLevelUp(entry)).not.toThrow();
        });
    });

    describe('logLevelReset', () => {
        it('should store level reset log entry in localStorage', () => {
            const entry = {
                timestamp: Date.now(),
                characterId: 'char-123',
                characterName: 'Test Hero',
                fromLevel: 5,
                toLevel: 4,
                changes: {
                    hpChange: -8,
                    newFeatures: [],
                    newFeats: [],
                    statsIncreased: [],
                },
                source: 'level_reset' as const,
            };

            logLevelReset(entry);

            expect(localStorageMock.setItem).toHaveBeenCalled();
            const storedLogs = JSON.parse(localStorageMock.store['dungeon_forge_level_logs']);
            expect(storedLogs).toHaveLength(1);
            expect(storedLogs[0].source).toBe('level_reset');
        });
    });

    describe('getLevelUpLogs', () => {
        it('should return empty array when no logs exist', () => {
            const logs = getLevelUpLogs();
            expect(logs).toEqual([]);
        });

        it('should return stored logs', () => {
            const storedEntry = {
                timestamp: Date.now(),
                characterId: 'char-123',
                characterName: 'Test Hero',
                fromLevel: 5,
                toLevel: 6,
                changes: { hpChange: 8, newFeatures: [], newFeats: [], statsIncreased: [] },
                source: 'level_up',
            };
            localStorageMock.store['dungeon_forge_level_logs'] = JSON.stringify([storedEntry]);

            const logs = getLevelUpLogs();
            expect(logs).toHaveLength(1);
            expect(logs[0].characterId).toBe('char-123');
        });

        it('should handle invalid JSON gracefully', () => {
            localStorageMock.store['dungeon_forge_level_logs'] = 'invalid json';

            const logs = getLevelUpLogs();
            expect(logs).toEqual([]);
        });
    });

    describe('getLevelUpLogsForCharacter', () => {
        it('should filter logs by characterId', () => {
            localStorageMock.store['dungeon_forge_level_logs'] = JSON.stringify([
                { timestamp: Date.now(), characterId: 'char-123', characterName: 'Hero 1', fromLevel: 1, toLevel: 2, changes: { hpChange: 5, newFeatures: [], newFeats: [], statsIncreased: [] }, source: 'level_up' },
                { timestamp: Date.now(), characterId: 'char-456', characterName: 'Hero 2', fromLevel: 1, toLevel: 2, changes: { hpChange: 5, newFeatures: [], newFeats: [], statsIncreased: [] }, source: 'level_up' },
                { timestamp: Date.now(), characterId: 'char-123', characterName: 'Hero 1', fromLevel: 2, toLevel: 3, changes: { hpChange: 6, newFeatures: [], newFeats: [], statsIncreased: [] }, source: 'level_up' },
            ]);

            const logs = getLevelUpLogsForCharacter('char-123');
            expect(logs).toHaveLength(2);
            expect(logs.every(l => l.characterId === 'char-123')).toBe(true);
        });
    });

    describe('clearLevelUpLogs', () => {
        it('should clear all logs from localStorage', () => {
            localStorageMock.store['dungeon_forge_level_logs'] = JSON.stringify([
                { timestamp: Date.now(), characterId: 'char-123', characterName: 'Test', fromLevel: 1, toLevel: 2, changes: { hpChange: 5, newFeatures: [], newFeats: [], statsIncreased: [] }, source: 'level_up' },
            ]);

            clearLevelUpLogs();

            expect(localStorageMock.removeItem).toHaveBeenCalledWith('dungeon_forge_level_logs');
        });

        it('should handle errors gracefully', () => {
            localStorageMock.removeItem.mockImplementationOnce(() => {
                throw new Error('Storage error');
            });

            expect(() => clearLevelUpLogs()).not.toThrow();
        });
    });
});
