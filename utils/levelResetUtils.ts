import type { Character, Ability, InventoryItem } from '../types';
import type {
  LevelSnapshot,
  CharacterSnapshot,
  AuditLog,
  StoredSnapshotData,
  LevelResetChanges,
  SnapshotMetadata,
} from '../types/levelSnapshot';
import {
  MAX_SNAPSHOTS_PER_CHARACTER,
  MAX_AUDIT_LOGS_PER_CHARACTER,
  STORAGE_KEY,
  STORAGE_VERSION,
  createEmptyStoredData,
} from '../types/levelSnapshot';

export const compressCharacterToSnapshot = (character: Character): CharacterSnapshot => {
  return {
    level: character.level,
    class: character.class,
    subclass: character.subclass,
    species: character.species,
    hp: { ...character.hp },
    stats: { ...character.stats },
    skills: [...character.skills],
    feats: [...character.feats],
    profBonus: character.profBonus,
    ac: character.ac,
    init: character.init,
    speed: character.speed,
    languages: [...character.languages],
    inventory: character.inventory.map(item => ({ ...item })),
    hitDice: character.hitDice ? { ...character.hitDice } : undefined,
    rageUses: character.rageUses ? { ...character.rageUses } : undefined,
    rageDamage: character.rageDamage,
    bardicInspiration: character.bardicInspiration ? { ...character.bardicInspiration } : undefined,
    bardicInspirationDie: character.bardicInspirationDie,
    channelDivinity: character.channelDivinity ? { ...character.channelDivinity } : undefined,
    wildShape: character.wildShape ? { ...character.wildShape } : undefined,
    wildShapeMax: character.wildShapeMax,
    layOnHands: character.layOnHands ? { ...character.layOnHands } : undefined,
    actionSurge: character.actionSurge ? { ...character.actionSurge } : undefined,
    secondWind: character.secondWind ? { ...character.secondWind } : undefined,
    indomitable: character.indomitable ? { ...character.indomitable } : undefined,
    sneakAttackDie: character.sneakAttackDie,
    martialArtsDie: character.martialArtsDie,
    kiMax: character.kiMax,
    extraAttacks: character.extraAttacks,
    pactSlotLevel: character.pactSlotLevel,
    mysticArcanum: character.mysticArcanum ? { ...character.mysticArcanum } : undefined,
    arcaneRecovery: character.arcaneRecovery ? { ...character.arcaneRecovery } : undefined,
    spellMastery: character.spellMastery ? [...character.spellMastery] : undefined,
    signatureSpells: character.signatureSpells ? [...character.signatureSpells] : undefined,
    metamagics: character.metamagics ? [...character.metamagics] : undefined,
    preparedSpells: character.preparedSpells ? [...character.preparedSpells] : undefined,
    innateSpells: character.innateSpells ? [...character.innateSpells] : undefined,
    invocations: character.invocations ? [...character.invocations] : undefined,
    weaponMasteries: character.weaponMasteries ? [...character.weaponMasteries] : undefined,
    focus: character.focus ? { ...character.focus } : undefined,
    sorceryPoints: character.sorceryPoints ? { ...character.sorceryPoints } : undefined,
    innateSorcery: character.innateSorcery ? { ...character.innateSorcery } : undefined,
    hunterMarkUses: character.hunterMarkUses ? { ...character.hunterMarkUses } : undefined,
    magicalCunning: character.magicalCunning ? { ...character.magicalCunning } : undefined,
    fontOfInspiration: character.fontOfInspiration ? { ...character.fontOfInspiration } : undefined,
    lucky: character.lucky ? { ...character.lucky } : undefined,
    savantSpellsAdded: character.savantSpellsAdded,
    savantSpellsAddedAt: character.savantSpellsAddedAt,
    savantSpells: character.savantSpells ? [...character.savantSpells] : undefined,
    inspiration: character.inspiration ? { ...character.inspiration } : undefined,
    empoweredSneakAttack: character.empoweredSneakAttack ? { ...character.empoweredSneakAttack } : undefined,
    vestige: character.vestige ? { ...character.vestige } : undefined,
    guardianBondTarget: character.guardianBondTarget,
    expertise: character.expertise ? [...character.expertise] : undefined,
    agonizingBlastCantrips: character.agonizingBlastCantrips ? [...character.agonizingBlastCantrips] : undefined,
    pactCantrips: character.pactCantrips ? [...character.pactCantrips] : undefined,
    pactRituals: character.pactRituals ? [...character.pactRituals] : undefined,
    lessonsFeats: character.lessonsFeats ? [...character.lessonsFeats] : undefined,
    usedSlots: character.usedSlots ? { ...character.usedSlots } : undefined,
    spellSlots: character.spellSlots ? { ...character.spellSlots } : undefined,
    concentrationSpell: character.concentrationSpell,
    lastLongRest: character.lastLongRest,
    isRaging: character.isRaging,
    activeConcentration: character.activeConcentration,
    spellcastingAbility: character.spellcastingAbility,
    startingGold: character.startingGold,
    money: character.money ? { ...character.money } : undefined,
    notes: character.notes ? character.notes.map(n => ({ ...n })) : undefined,
  };
};

export const restoreCharacterFromSnapshot = (
  character: Character,
  snapshot: CharacterSnapshot
): Character => {
  return {
    ...character,
    level: snapshot.level,
    class: snapshot.class,
    subclass: snapshot.subclass,
    species: snapshot.species,
    hp: { ...snapshot.hp },
    stats: { ...snapshot.stats },
    skills: [...snapshot.skills],
    feats: [...snapshot.feats],
    profBonus: snapshot.profBonus,
    ac: snapshot.ac,
    init: snapshot.init,
    speed: snapshot.speed,
    languages: [...snapshot.languages],
    inventory: snapshot.inventory.map((item: InventoryItem) => ({ ...item })),
    hitDice: snapshot.hitDice ? { ...snapshot.hitDice } : undefined,
    rageUses: snapshot.rageUses ? { ...snapshot.rageUses } : undefined,
    rageDamage: snapshot.rageDamage,
    bardicInspiration: snapshot.bardicInspiration ? { ...snapshot.bardicInspiration } : undefined,
    bardicInspirationDie: snapshot.bardicInspirationDie,
    channelDivinity: snapshot.channelDivinity ? { ...snapshot.channelDivinity } : undefined,
    wildShape: snapshot.wildShape ? { ...snapshot.wildShape } : undefined,
    wildShapeMax: snapshot.wildShapeMax,
    layOnHands: snapshot.layOnHands ? { ...snapshot.layOnHands } : undefined,
    actionSurge: snapshot.actionSurge ? { ...snapshot.actionSurge } : undefined,
    secondWind: snapshot.secondWind ? { ...snapshot.secondWind } : undefined,
    indomitable: snapshot.indomitable ? { ...snapshot.indomitable } : undefined,
    sneakAttackDie: snapshot.sneakAttackDie,
    martialArtsDie: snapshot.martialArtsDie,
    kiMax: snapshot.kiMax,
    extraAttacks: snapshot.extraAttacks,
    pactSlotLevel: snapshot.pactSlotLevel,
    mysticArcanum: snapshot.mysticArcanum ? { ...snapshot.mysticArcanum } : undefined,
    arcaneRecovery: snapshot.arcaneRecovery ? { ...snapshot.arcaneRecovery } : undefined,
    spellMastery: snapshot.spellMastery ? [...snapshot.spellMastery] : undefined,
    signatureSpells: snapshot.signatureSpells ? [...snapshot.signatureSpells] : undefined,
    metamagics: snapshot.metamagics ? [...snapshot.metamagics] : undefined,
    preparedSpells: snapshot.preparedSpells ? [...snapshot.preparedSpells] : undefined,
    innateSpells: snapshot.innateSpells ? [...snapshot.innateSpells] : undefined,
    invocations: snapshot.invocations ? [...snapshot.invocations] : undefined,
    weaponMasteries: snapshot.weaponMasteries ? [...snapshot.weaponMasteries] : undefined,
    focus: snapshot.focus ? { ...snapshot.focus } : undefined,
    sorceryPoints: snapshot.sorceryPoints ? { ...snapshot.sorceryPoints } : undefined,
    innateSorcery: snapshot.innateSorcery ? { ...snapshot.innateSorcery } : undefined,
    hunterMarkUses: snapshot.hunterMarkUses ? { ...snapshot.hunterMarkUses } : undefined,
    magicalCunning: snapshot.magicalCunning ? { ...snapshot.magicalCunning } : undefined,
    fightingStyle: snapshot.fightingStyle,
    druidicWarriorCantrips: snapshot.druidicWarriorCantrips ? [...snapshot.druidicWarriorCantrips] : undefined,
    fontOfInspiration: snapshot.fontOfInspiration ? { ...snapshot.fontOfInspiration } : undefined,
    lucky: snapshot.lucky ? { ...snapshot.lucky } : undefined,
    savantSpellsAdded: snapshot.savantSpellsAdded,
    savantSpellsAddedAt: snapshot.savantSpellsAddedAt,
    savantSpells: snapshot.savantSpells ? [...snapshot.savantSpells] : undefined,
    inspiration: snapshot.inspiration ? { ...snapshot.inspiration } : undefined,
    empoweredSneakAttack: snapshot.empoweredSneakAttack ? { ...snapshot.empoweredSneakAttack } : undefined,
    vestige: snapshot.vestige ? { type: snapshot.vestige.type as 'Celestial' | 'Fiend' | 'Undead', hp: { ...snapshot.vestige.hp }, domain: snapshot.vestige.domain } : undefined,
    guardianBondTarget: snapshot.guardianBondTarget,
    expertise: snapshot.expertise ? [...snapshot.expertise] : undefined,
    agonizingBlastCantrips: snapshot.agonizingBlastCantrips ? [...snapshot.agonizingBlastCantrips] : undefined,
    pactCantrips: snapshot.pactCantrips ? [...snapshot.pactCantrips] : undefined,
    pactRituals: snapshot.pactRituals ? [...snapshot.pactRituals] : undefined,
    lessonsFeats: snapshot.lessonsFeats ? [...snapshot.lessonsFeats] : undefined,
    usedSlots: snapshot.usedSlots ? { ...snapshot.usedSlots } : undefined,
    spellSlots: snapshot.spellSlots ? { ...snapshot.spellSlots } : undefined,
    concentrationSpell: snapshot.concentrationSpell,
    lastLongRest: snapshot.lastLongRest,
    isRaging: snapshot.isRaging,
    activeConcentration: snapshot.activeConcentration,
    spellcastingAbility: snapshot.spellcastingAbility as Ability | undefined,
    startingGold: snapshot.startingGold,
    money: snapshot.money ? { ...snapshot.money } : undefined,
    notes: character.notes ? character.notes.map(n => ({ ...n })) : undefined,
  };
};

export const calculateLevelResetChanges = (
  currentCharacter: Character,
  targetSnapshot: CharacterSnapshot
): LevelResetChanges => {
  const hpChange = targetSnapshot.hp.max - currentCharacter.hp.max;

  const statsChanges: Record<string, number> = {};
  const allStats = new Set([...Object.keys(currentCharacter.stats), ...Object.keys(targetSnapshot.stats)]);
  for (const stat of allStats) {
    const current = currentCharacter.stats[stat] || 0;
    const target = targetSnapshot.stats[stat] || 0;
    if (current !== target) {
      statsChanges[stat] = target - current;
    }
  }

  const currentSkills = new Set(currentCharacter.skills);
  const targetSkills = new Set(targetSnapshot.skills);
  const skillsLost = [...currentSkills].filter(s => !targetSkills.has(s));
  const skillsGained = [...targetSkills].filter(s => !currentSkills.has(s));

  const currentFeats = new Set(currentCharacter.feats);
  const targetFeats = new Set(targetSnapshot.feats);
  const featsLost = [...currentFeats].filter(f => !targetFeats.has(f));
  const featsGained = [...targetFeats].filter(f => !currentFeats.has(f));

  const currentSpells = new Set(currentCharacter.preparedSpells || []);
  const targetSpells = new Set(targetSnapshot.preparedSpells || []);
  const spellsLost = [...currentSpells].filter(s => !targetSpells.has(s));

  const subclassChanges = currentCharacter.subclass !== targetSnapshot.subclass;

  const resourcesAffected: string[] = [];
  if (currentCharacter.level !== targetSnapshot.level) {
    resourcesAffected.push(`Level ${currentCharacter.level} → ${targetSnapshot.level}`);
  }
  if (hpChange !== 0) resourcesAffected.push(`HP: ${hpChange > 0 ? '+' : ''}${hpChange}`);
  if (skillsLost.length > 0) resourcesAffected.push(`${skillsLost.length} skills lost`);
  if (featsLost.length > 0) resourcesAffected.push(`${featsLost.length} feats lost`);
  if (spellsLost.length > 0) resourcesAffected.push(`${spellsLost.length} spells lost`);
  if (subclassChanges) resourcesAffected.push('Subclass change');

  return {
    hpChange,
    statsChanges,
    skillsLost,
    skillsGained,
    featsLost,
    featsGained,
    spellsLost,
    subclassChanges,
    resourcesAffected,
  };
};

export const generateSnapshotId = (): string => {
  return crypto.randomUUID();
};

export const generateAuditLogId = (): string => {
  return crypto.randomUUID();
};

export const getStorageData = (): StoredSnapshotData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      console.log('[Snapshots] No snapshots found in localStorage');
      return createEmptyStoredData();
    }
    const parsed = JSON.parse(stored) as StoredSnapshotData;
    if (parsed.version !== STORAGE_VERSION) {
      console.warn('Storage version mismatch, resetting data', { current: parsed.version, expected: STORAGE_VERSION });
      return createEmptyStoredData();
    }
    // Validate snapshots structure
    if (typeof parsed.snapshots !== 'object' || parsed.snapshots === null) {
      console.warn('[Snapshots] Snapshots data corrupted, reinitializing');
      return createEmptyStoredData();
    }
    const totalSnapshots = Object.keys(parsed.snapshots).reduce((sum, charId) => sum + (parsed.snapshots[charId]?.length || 0), 0);
    console.log(`[Snapshots] Loaded from storage. Total snapshots: ${totalSnapshots}`);
    return parsed;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return createEmptyStoredData();
  }
};

export const saveStorageData = (data: StoredSnapshotData): boolean => {
  try {
    const dataWithTimestamp = { ...data, lastUpdated: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithTimestamp));
    console.log(`[Snapshots] Saved successfully. Snapshots count:`, Object.keys(data.snapshots).reduce((sum, charId) => sum + (data.snapshots[charId]?.length || 0), 0));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded - your device storage is full');
    }
    return false;
  }
};

export const getSnapshotsForCharacter = (characterId: string): LevelSnapshot[] => {
  const storage = getStorageData();
  return storage.snapshots[characterId] || [];
};

export const saveSnapshotForCharacter = (
  characterId: string,
  snapshot: LevelSnapshot
): LevelSnapshot[] => {
  const storage = getStorageData();
  if (!storage.snapshots[characterId]) {
    storage.snapshots[characterId] = [];
  }

  storage.snapshots[characterId].push(snapshot);

  storage.snapshots[characterId].sort((a, b) => b.timestamp - a.timestamp);

  if (storage.snapshots[characterId].length > MAX_SNAPSHOTS_PER_CHARACTER) {
    const toRemove = storage.snapshots[characterId].length - MAX_SNAPSHOTS_PER_CHARACTER;
    storage.snapshots[characterId] = storage.snapshots[characterId].slice(0, MAX_SNAPSHOTS_PER_CHARACTER);
    console.log(`Removed ${toRemove} oldest snapshots for character ${characterId}`);
  }

  saveStorageData(storage);
  return storage.snapshots[characterId];
};

export const deleteSnapshot = (characterId: string, snapshotId: string): boolean => {
  const storage = getStorageData();
  if (!storage.snapshots[characterId]) {
    return false;
  }

  const initialLength = storage.snapshots[characterId].length;
  storage.snapshots[characterId] = storage.snapshots[characterId].filter(s => s.id !== snapshotId);

  if (storage.snapshots[characterId].length === initialLength) {
    return false;
  }

  saveStorageData(storage);
  return true;
};

export const addAuditLogEntry = (characterId: string, log: AuditLog): void => {
  const storage = getStorageData();
  if (!storage.auditLog) {
    storage.auditLog = [];
  }

  storage.auditLog.push(log);
  storage.auditLog.sort((a, b) => b.timestamp - a.timestamp);

  if (storage.auditLog.length > MAX_AUDIT_LOGS_PER_CHARACTER) {
    storage.auditLog = storage.auditLog.slice(0, MAX_AUDIT_LOGS_PER_CHARACTER);
  }

  saveStorageData(storage);
};

export const getAuditLogsForCharacter = (characterId: string): AuditLog[] => {
  const storage = getStorageData();
  return storage.auditLog.filter(log => log.characterId === characterId);
};

export const estimateMemoryUsage = (snapshots: LevelSnapshot[]): number => {
  return snapshots.reduce((total, snapshot) => {
    return total + JSON.stringify(snapshot).length * 2;
  }, 0);
};

export const formatTimestamp = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
  return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
};

export const clearAllSnapshotsForCharacter = (characterId: string): boolean => {
  const storage = getStorageData();
  if (storage.snapshots[characterId]) {
    delete storage.snapshots[characterId];
    saveStorageData(storage);
    return true;
  }
  return false;
};

export const createSnapshotObject = (
  character: Character,
  metadata: SnapshotMetadata
): LevelSnapshot => {
  return {
    id: generateSnapshotId(),
    characterId: character.id,
    level: character.level,
    timestamp: Date.now(),
    snapshotData: compressCharacterToSnapshot(character),
    metadata,
  };
};
