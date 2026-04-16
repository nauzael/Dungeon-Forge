import type { Character } from '../types';

export interface LevelSnapshot {
  id: string;
  characterId: string;
  level: number;
  timestamp: number;
  snapshotData: CharacterSnapshot;
  metadata: SnapshotMetadata;
}

export interface CharacterSnapshot {
  level: number;
  class: string;
  subclass?: string;
  species: string;
  hp: { current: number; max: number; temp: number };
  stats: Record<string, number>;
  skills: string[];
  feats: string[];
  profBonus: number;
  hitDice?: { current: number; max: number };
  rageUses?: { current: number; max: number };
  rageDamage?: number;
  bardicInspiration?: { current: number; max: number };
  bardicInspirationDie?: number;
  channelDivinity?: { current: number; max: number };
  wildShape?: { current: number; max: number };
  wildShapeMax?: number;
  layOnHands?: { current: number; max: number };
  actionSurge?: { current: number; max: number };
  secondWind?: { current: number; max: number };
  indomitable?: { current: number; max: number };
  sneakAttackDie?: number;
  martialArtsDie?: number;
  kiMax?: number;
  extraAttacks?: number;
  pactSlotLevel?: number;
  mysticArcanum?: Record<string, string>;
  arcaneRecovery?: { uses: number };
  spellMastery?: string[];
  signatureSpells?: string[];
  metamagics?: string[];
  preparedSpells?: string[];
  innateSpells?: string[];
  invocations?: string[];
  weaponMasteries?: string[];
  focus?: { current: number; max: number };
  sorceryPoints?: { current: number; max: number };
  innateSorcery?: { current: number; max: number };
  hunterMarkUses?: { current: number; max: number };
  magicalCunning?: { current: number; max: number };
  fightingStyle?: string;
  druidicWarriorCantrips?: string[];
  fontOfInspiration?: { current: number; max: number };
  lucky?: { current: number; max: number };
  savantSpellsAdded?: boolean;
  savantSpellsAddedAt?: number[];
  savantSpells?: string[];
  inspiration?: { current: number; max: number };
  empoweredSneakAttack?: { dice: number };
  vestige?: { type: string; hp: { current: number; max: number }; domain: string };
  guardianBondTarget?: string;
  expertise?: string[];
  agonizingBlastCantrips?: string[];
  pactCantrips?: string[];
  pactRituals?: string[];
  lessonsFeats?: string[];
  ac: number;
  init: number;
  speed: number;
  languages: string[];
  inventory: Character['inventory'];
  usedSlots?: Record<string, boolean>;
  spellSlots?: Record<number, { current: number; max: number }>;
  concentrationSpell?: string;
  lastLongRest?: number;
  isRaging?: boolean;
  activeConcentration?: string;
  spellcastingAbility?: string;
  startingGold?: number;
  money?: { cp: number; sp: number; gp: number; ep: number; pp: number };
  notes?: { id: string; title: string; content: string; date: string }[];
}

export interface SnapshotMetadata {
  source: 'level_up' | 'manual';
  reason?: string;
  characterName: string;
}

export interface AuditLog {
  id: string;
  characterId: string;
  action: 'SNAPSHOT_CREATED' | 'LEVEL_RESET' | 'SNAPSHOT_DELETED' | 'PRE_RESET_BACKUP';
  fromLevel: number;
  toLevel?: number;
  snapshotId?: string;
  timestamp: number;
  characterState: {
    level?: number;
    hp?: { current: number; max: number; temp: number };
    name?: string;
  };
}

export interface StoredSnapshotData {
  snapshots: Record<string, LevelSnapshot[]>;
  auditLog: AuditLog[];
  version: string;
  lastUpdated: number;
}

export interface LevelResetChanges {
  hpChange: number;
  statsChanges: Record<string, number>;
  skillsLost: string[];
  skillsGained: string[];
  featsLost: string[];
  featsGained: string[];
  spellsLost: string[];
  subclassChanges: boolean;
  resourcesAffected: string[];
}

export const MAX_SNAPSHOTS_PER_CHARACTER = 20;
export const MAX_AUDIT_LOGS_PER_CHARACTER = 100;
export const STORAGE_KEY = 'dungeon_forge_level_snapshots';
export const STORAGE_VERSION = '1.0.0';

export const createEmptyStoredData = (): StoredSnapshotData => ({
  snapshots: {},
  auditLog: [],
  version: STORAGE_VERSION,
  lastUpdated: Date.now(),
});
