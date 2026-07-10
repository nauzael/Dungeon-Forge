export const LEVEL_UP_LOG_VERSION = '1.0';

export interface LevelUpLogEntry {
  timestamp: number;
  characterId: string;
  characterName: string;
  fromLevel: number;
  toLevel: number;
  changes: {
    hpChange: number;
    newFeatures: string[];
    newFeats: string[];
    statsIncreased: string[];
  };
  source: 'level_up' | 'level_reset' | 'manual';
}

const MAX_LOG_ENTRIES = 100;

export function logLevelUp(entry: LevelUpLogEntry): void {

  try {
    const logs = JSON.parse(localStorage.getItem('dungeon_forge_level_logs') || '[]') as LevelUpLogEntry[];
    logs.push(entry);
    if (logs.length > MAX_LOG_ENTRIES) {
      logs.shift();
    }
    localStorage.setItem('dungeon_forge_level_logs', JSON.stringify(logs));
  } catch (error) {
  }
}

export function logLevelReset(entry: LevelUpLogEntry): void {

  try {
    const logs = JSON.parse(localStorage.getItem('dungeon_forge_level_logs') || '[]') as LevelUpLogEntry[];
    logs.push(entry);
    if (logs.length > MAX_LOG_ENTRIES) {
      logs.shift();
    }
    localStorage.setItem('dungeon_forge_level_logs', JSON.stringify(logs));
  } catch (error) {
  }
}

export function getLevelUpLogs(): LevelUpLogEntry[] {
  try {
    return JSON.parse(localStorage.getItem('dungeon_forge_level_logs') || '[]');
  } catch {
    return [];
  }
}

export function clearLevelUpLogs(): void {
  try {
    localStorage.removeItem('dungeon_forge_level_logs');
  } catch (error) {
  }
}

export function getLevelUpLogsForCharacter(characterId: string): LevelUpLogEntry[] {
  const logs = getLevelUpLogs();
  return logs.filter(log => log.characterId === characterId);
}
