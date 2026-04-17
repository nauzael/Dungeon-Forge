import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Character } from '../types';
import type { LevelSnapshot, AuditLog, LevelResetChanges, SnapshotMetadata } from '../types/levelSnapshot';
import {
  getSnapshotsForCharacter,
  saveSnapshotForCharacter,
  deleteSnapshot,
  addAuditLogEntry,
  getAuditLogsForCharacter,
  compressCharacterToSnapshot,
  restoreCharacterFromSnapshot,
  calculateLevelResetChanges,
  createSnapshotObject,
  generateSnapshotId,
  estimateMemoryUsage,
  getStorageData,
} from '../utils/levelResetUtils';

interface UseLevelSnapshotsReturn {
  snapshots: LevelSnapshot[];
  currentLevel: number;
  createSnapshot: (character: Character, reason?: string) => LevelSnapshot;
  restoreSnapshot: (snapshotId: string, character: Character) => Character;
  deleteSnapshotById: (snapshotId: string) => boolean;
  canRestore: (snapshotId: string) => boolean;
  getAvailableLevels: () => number[];
  getAuditLog: () => AuditLog[];
  clearHistory: () => void;
  memoryUsage: number;
  getChangesForSnapshot: (snapshotId: string, character: Character) => LevelResetChanges | null;
  refreshSnapshots: () => void;
  hasSnapshots: boolean;
}

export const useLevelSnapshots = (
  character: Character,
  onUpdate?: (update: Partial<Character>) => void
): UseLevelSnapshotsReturn => {
  const characterId = character.id;
  const [snapshots, setSnapshots] = useState<LevelSnapshot[]>(() => {
    return character.snapshots || [];
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    return character.auditLog || [];
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshSnapshots = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (characterId) {
      // 1. Prioritize character internal snapshots (synced with cloud)
      if (character.snapshots && character.snapshots.length > 0) {
        setSnapshots(character.snapshots);
        setAuditLogs(character.auditLog || []);
        return;
      }

      // 2. Fallback to localStorage (Legacy or initial load)
      const loadedSnapshots = getSnapshotsForCharacter(characterId);
      const loadedLogs = getAuditLogsForCharacter(characterId);
      
      if (loadedSnapshots.length > 0) {
          setSnapshots(loadedSnapshots);
          setAuditLogs(loadedLogs);
          
          // Legacy Sync: Migrate localStorage snapshots to character internal object
          if (onUpdate) {
              onUpdate({ 
                  snapshots: loadedSnapshots,
                  auditLog: loadedLogs
              });
          }
      }
    }
  }, [characterId, character.snapshots, refreshTrigger]);

  // Sync snapshots when character updates (e.g., after level up)
  useEffect(() => {
    if (characterId) {
      const syncInterval = setInterval(() => {
        const currentSnapshots = getSnapshotsForCharacter(characterId);
        setSnapshots(prev => {
          // Only update if snapshots changed to avoid unnecessary re-renders
          if (JSON.stringify(prev) !== JSON.stringify(currentSnapshots)) {
            return currentSnapshots;
          }
          return prev;
        });
      }, 500);

      return () => clearInterval(syncInterval);
    }
  }, [characterId]);

  const memoryUsage = useMemo(() => {
    return estimateMemoryUsage(snapshots);
  }, [snapshots]);

  const createSnapshot = useCallback((character: Character, reason?: string): LevelSnapshot => {
    if (!character?.id) {
      throw new Error('Character is required');
    }

    const metadata: SnapshotMetadata = {
      source: 'level_up',
      reason,
      characterName: character.name,
    };

    const snapshot = createSnapshotObject(character, metadata);

    const updatedSnapshots = saveSnapshotForCharacter(character.id, snapshot);

    addAuditLogEntry(character.id, {
      id: generateSnapshotId(),
      characterId: character.id,
      action: 'SNAPSHOT_CREATED',
      fromLevel: character.level,
      timestamp: Date.now(),
      characterState: {
        level: character.level,
        name: character.name,
      },
    });

    // Ensure state is updated with fresh data
    const newSnapshots = [...updatedSnapshots];
    const newLogs = getAuditLogsForCharacter(character.id);
    
    setSnapshots(newSnapshots);
    setAuditLogs(newLogs);

    // Sync to Character (Cloud)
    if (onUpdate) {
        onUpdate({ 
            snapshots: newSnapshots,
            auditLog: newLogs
        });
    }

    // Log for debugging
    console.log(`[LevelUp] Snapshot created for level ${character.level}. Total snapshots: ${updatedSnapshots.length}`);

    return snapshot;
  }, [characterId, onUpdate]);

  const restoreSnapshot = useCallback((snapshotId: string, character: Character): Character => {
    const snapshot = snapshots.find(s => s.id === snapshotId);

    if (!snapshot) {
      throw new Error('Snapshot not found');
    }

    if (snapshot.level >= character.level) {
      throw new Error('Cannot restore to same or higher level');
    }

    const preResetBackup = createSnapshotObject(character, {
      source: 'manual',
      reason: 'Pre-reset backup',
      characterName: character.name,
    });
    saveSnapshotForCharacter(character.id, preResetBackup);

    addAuditLogEntry(character.id, {
      id: generateSnapshotId(),
      characterId: character.id,
      action: 'LEVEL_RESET',
      fromLevel: character.level,
      toLevel: snapshot.snapshotData.level,
      snapshotId,
      timestamp: Date.now(),
      characterState: {
        level: character.level,
        hp: character.hp,
        name: character.name,
      },
    });

    const restoredCharacter = restoreCharacterFromSnapshot(character, snapshot.snapshotData);

    const updatedSnapshots = getSnapshotsForCharacter(character.id);
    const updatedLogs = getAuditLogsForCharacter(character.id);
    setSnapshots([...updatedSnapshots]);
    setAuditLogs(updatedLogs);

    // Sync to Character (Cloud) - Since we added a "Pre-reset backup", we should update
    if (onUpdate) {
        onUpdate({ 
            snapshots: updatedSnapshots,
            auditLog: updatedLogs
        });
    }

    return restoredCharacter;
  }, [snapshots, onUpdate]);

  const deleteSnapshotById = useCallback((snapshotId: string): boolean => {
    const snapshot = snapshots.find(s => s.id === snapshotId);
    if (!snapshot) return false;

    const success = deleteSnapshot(snapshot.characterId, snapshotId);

    if (success) {
      addAuditLogEntry(snapshot.characterId, {
        id: generateSnapshotId(),
        characterId: snapshot.characterId,
        action: 'SNAPSHOT_DELETED',
        fromLevel: snapshot.level,
        timestamp: Date.now(),
        characterState: {},
      });

      const newSnapshots = getSnapshotsForCharacter(snapshot.characterId);
      const newLogs = getAuditLogsForCharacter(snapshot.characterId);
      setSnapshots(newSnapshots);
      setAuditLogs(newLogs);

      // Sync to Character (Cloud)
      if (onUpdate) {
          onUpdate({ 
              snapshots: newSnapshots,
              auditLog: newLogs
          });
      }
    }

    return success;
  }, [snapshots, onUpdate]);

  const canRestore = useCallback((snapshotId: string): boolean => {
    const snapshot = snapshots.find(s => s.id === snapshotId);
    return snapshot?.metadata?.source === 'level_up';
  }, [snapshots]);

  const getAvailableLevels = useCallback((): number[] => {
    return snapshots
      .filter(s => s.metadata?.source === 'level_up')
      .map(s => s.level)
      .sort((a, b) => b - a);
  }, [snapshots]);

  const getAuditLog = useCallback((): AuditLog[] => {
    return auditLogs;
  }, [auditLogs]);

  const clearHistory = useCallback(() => {
    const storage = getStorageData();
    if (storage.snapshots[characterId]) {
      delete storage.snapshots[characterId];
      require('../utils/levelResetUtils').saveStorageData(storage);
    }
    setSnapshots([]);
    setAuditLogs([]);
  }, [characterId]);

  const getChangesForSnapshot = useCallback((snapshotId: string, character: Character): LevelResetChanges | null => {
    const snapshot = snapshots.find(s => s.id === snapshotId);
    if (!snapshot) return null;

    return calculateLevelResetChanges(character, snapshot.snapshotData);
  }, [snapshots]);

  const currentLevel = useMemo(() => {
    return snapshots.length > 0
      ? Math.max(...snapshots.map(s => s.level))
      : 0;
  }, [snapshots]);

  const hasSnapshots = snapshots.length > 0 && snapshots.some(s => s.metadata?.source === 'level_up');

  return {
    snapshots,
    currentLevel,
    createSnapshot,
    restoreSnapshot,
    deleteSnapshotById,
    canRestore,
    getAvailableLevels,
    getAuditLog,
    clearHistory,
    memoryUsage,
    getChangesForSnapshot,
    refreshSnapshots,
    hasSnapshots,
  };
};

export default useLevelSnapshots;
