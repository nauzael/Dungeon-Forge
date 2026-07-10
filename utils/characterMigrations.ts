import { Character, SpeciesSpell, DetailData } from '../types';
import { SPECIES_DETAILS } from '../Data/characterOptions';
import { SPELL_LIST_BY_CLASS, SPELL_DETAILS } from '../Data/spells';

/**
 * Character Data Migrations
 * 
 * This module handles migrations of existing character data when game data changes.
 * Migrations are tracked and only applied once per character.
 */

const MIGRATION_VERSION = '2026.6.21';

/**
 * Get the set of migrations that have been applied to characters
 */
export const getAppliedMigrations = (): Set<string> => {
  try {
    const stored = localStorage.getItem('df_character_migrations');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

/**
 * Save the set of applied migrations
 */
const saveAppliedMigrations = (migrations: Set<string>): void => {
  try {
    localStorage.setItem('df_character_migrations', JSON.stringify([...migrations]));
  } catch (e) {
  }
};

/**
 * Calculate innate spells for a character based on their species and level.
 * This mirrors the logic in CreatorSteps.tsx speciesInnateSpells.
 */
export const calculateInnateSpells = (
  species: string,
  subspecies: string | undefined,
  level: number
): string[] => {
  const speciesData: DetailData | undefined = SPECIES_DETAILS[species];
  if (!speciesData) return [];

  const innateSpells: string[] = [];

  // Base species innate spells
  if (speciesData.innateSpells) {
    for (const s of speciesData.innateSpells) {
      if (s.level <= level) {
        innateSpells.push(s.spell);
      }
    }
  }

  // Subspecies innate spells
  if (speciesData.subspecies && subspecies) {
    const subspeciesData = speciesData.subspecies.find(
      sub => sub.name === subspecies || sub.name.includes(subspecies)
    );
    if (subspeciesData?.innateSpells) {
      for (const s of subspeciesData.innateSpells) {
        if (s.level <= level) {
          innateSpells.push(s.spell);
        }
      }
    }
  }

  return innateSpells;
};

/**
 * Migration: Rebuild innate spells for characters with empty/missing innateSpells
 * Issue: Characters created before the innate spells fix had empty innateSpells arrays
 */
const migrateInnateSpells = (character: Character): Character => {
  // Skip if no species (shouldn't happen but safety check)
  if (!character.species) return character;

  // Calculate what the innate spells should be
  const correctInnateSpells = calculateInnateSpells(
    character.species,
    character.subspecies,
    character.level
  );

  // Only migrate if:
  // 1. Character has species that should have innate spells
  // 2. Current innateSpells is empty or missing
  // 3. We calculated some innate spells
  const currentInnateSpells = character.innateSpells || [];
  
  if (correctInnateSpells.length > 0 && currentInnateSpells.length === 0) {
    return {
      ...character,
      innateSpells: correctInnateSpells
    };
  }

  return character;
};

/**
 * Migration: Convert Reborn from main race to Elf subrace
 * Issue: Reborn was originally a main race but should be an Elf lineage option
 * Converts characters with species='Reborn' to species='Elf' with subspecies='Reborn'
 */
const migrateRebornToElfSubrace = (character: Character): Character => {
  if (character.species === 'Reborn') {
    return {
      ...character,
      species: 'Elf',
      subspecies: 'Reborn'
    };
  }

  return character;
};

/**
 * Migration: Initialize class-specific resource fields for characters created before LevelUpWizard updates
 * Adds missing rageUses, bardicInspiration, channelDivinity, sneakAttackDie, kiMax, martialArtsDie, etc.
 */
const migrateClassResources = (character: Character): Character => {
  const level = character.level || 1;
  const charClass = character.class;
  
  const getChaMod = () => {
    const cha = character.stats?.CHA || 10;
    return Math.floor((cha - 10) / 2);
  };
  
  const updated = { ...character };
  let didUpdate = false;

  if (charClass === 'Barbarian' && !updated.rageUses) {
    const rageMax = level >= 20 ? 99 : level >= 17 ? 6 : level >= 13 ? 5 : level >= 9 ? 4 : level >= 5 ? 3 : 2;
    const rageDmg = level >= 17 ? 6 : level >= 13 ? 5 : level >= 9 ? 4 : level >= 5 ? 3 : 2;
    updated.rageUses = { current: rageMax, max: rageMax };
    updated.rageDamage = rageDmg;
    didUpdate = true;
  }
  
  if (charClass === 'Bard' && !updated.bardicInspiration) {
    const chaMod = Math.max(1, getChaMod());
    updated.bardicInspiration = { current: chaMod, max: chaMod };
    const bardicDie = level >= 15 ? 12 : level >= 10 ? 10 : level >= 5 ? 8 : 6;
    updated.bardicInspirationDie = bardicDie;
    didUpdate = true;
  }
  
  if (charClass === 'Cleric' && !updated.channelDivinity) {
    updated.channelDivinity = { current: 1, max: 1 };
    didUpdate = true;
  }
  
  if (charClass === 'Paladin' && !updated.channelDivinity) {
    updated.channelDivinity = { current: 1, max: 1 };
    updated.layOnHands = { current: level * 5, max: level * 5 };
    didUpdate = true;
  }
  
  if (charClass === 'Fighter' && !updated.actionSurge) {
    updated.actionSurge = { current: 1, max: 1 };
    updated.secondWind = { current: 1, max: 1 };
    if (level >= 9 && !updated.indomitable) {
      updated.indomitable = { current: 1, max: level >= 13 ? 3 : 2 };
    }
    didUpdate = true;
  }
  
  if (charClass === 'Monk' && !updated.kiMax) {
    updated.kiMax = level;
    updated.martialArtsDie = level >= 17 ? 12 : level >= 11 ? 10 : level >= 5 ? 8 : 6;
    didUpdate = true;
  }
  
  if (charClass === 'Rogue' && !updated.sneakAttackDie) {
    updated.sneakAttackDie = Math.min(Math.ceil(level / 2), 10);
    didUpdate = true;
  }
  
  if (charClass === 'Sorcerer' && !updated.sorceryPoints) {
    updated.sorceryPoints = { current: level >= 2 ? level : 0, max: level >= 2 ? level : 0 };
    updated.innateSorcery = { current: 2, max: 2 };
    didUpdate = true;
  }
  
  if (charClass === 'Druid' && !updated.wildShape) {
    updated.wildShape = { current: 2, max: 2 };
    updated.wildShapeMax = level >= 8 ? 3 : level >= 4 ? 2 : 1;
    didUpdate = true;
  }
  
  if (charClass === 'Ranger' && !updated.hunterMarkUses) {
    let hmUses = 2;
    if (level >= 17) hmUses = 6;
    else if (level >= 13) hmUses = 5;
    else if (level >= 9) hmUses = 4;
    else if (level >= 5) hmUses = 3;
    updated.hunterMarkUses = { current: hmUses, max: hmUses };
    didUpdate = true;
  }
  
  if (charClass === 'Warlock' && !updated.pactSlotLevel) {
    let pactLevel = 1;
    if (level >= 9) pactLevel = 5;
    else if (level >= 7) pactLevel = 4;
    else if (level >= 5) pactLevel = 3;
    else if (level >= 3) pactLevel = 2;
    updated.pactSlotLevel = pactLevel;
    updated.magicalCunning = { current: 1, max: 1 };
    if (level >= 11) {
      updated.mysticArcanum = {};
    }
    didUpdate = true;
  }
  
  if (charClass === 'Wizard' && !updated.arcaneRecovery) {
    updated.arcaneRecovery = { uses: Math.ceil(level / 2) };
    if (level >= 18) {
      updated.spellMastery = [];
    }
    if (level >= 20) {
      updated.signatureSpells = [];
    }
    didUpdate = true;
  }
  
  if (charClass === 'Bard' && level >= 5 && !updated.fontOfInspiration) {
    const chaMod = Math.max(1, getChaMod());
    updated.fontOfInspiration = { current: Math.max(1, chaMod), max: Math.max(1, chaMod) };
    didUpdate = true;
  }
  
  return updated;
};

/**
 * Migration: Extract Magic Initiate feat spells into featSpells field
 * Issue: Magic Initiate spells were stored in preparedSpells and counted against class spell limits
 * Fix: Move them to featSpells so they're excluded from class spell capacity counting
 */
const migrateFeatSpells = (character: Character): Character => {
  // Skip if already has featSpells
  if (character.featSpells && character.featSpells.length > 0) return character;

  // Check for Magic Initiate feat
  const feats = character.feats || [];
  let miType: string | null = null;
  for (const feat of feats) {
    if (feat.includes('Magic Initiate (Cleric)')) { miType = 'Cleric'; break; }
    if (feat.includes('Magic Initiate (Druid)') || feat.includes('Iniciado en la Magia (Druida)')) { miType = 'Druid'; break; }
    if (feat.includes('Magic Initiate (Wizard)') || feat.includes('Iniciado en la Magia (Mago)')) { miType = 'Wizard'; break; }
  }
  if (!miType) return character;

  const miSpells = SPELL_LIST_BY_CLASS[miType];
  if (!miSpells || miSpells.length === 0) return character;

  const preparedSpells = character.preparedSpells || [];
  const innateSpells = character.innateSpells || [];

  // Categorize MI class spells by level
  const miCantrips = miSpells.filter(s => SPELL_DETAILS[s]?.level === 0);
  const miLevel1 = miSpells.filter(s => SPELL_DETAILS[s]?.level === 1);

  // Find up to 2 cantrips + 1 level 1 spell from the MI class in preparedSpells
  const foundFeatSpells: string[] = [];
  let cantripCount = 0;
  let level1Count = 0;

  for (const spellName of preparedSpells) {
    if (innateSpells.includes(spellName)) continue;
    if (miCantrips.includes(spellName) && cantripCount < 2) {
      foundFeatSpells.push(spellName);
      cantripCount++;
    }
  }

  for (const spellName of preparedSpells) {
    if (innateSpells.includes(spellName)) continue;
    if (miLevel1.includes(spellName) && level1Count < 1) {
      foundFeatSpells.push(spellName);
      level1Count++;
    }
  }

  if (foundFeatSpells.length > 0) {
    return {
      ...character,
      featSpells: foundFeatSpells,
    };
  }

  return character;
};

/**
 * Apply all migrations to a character
 */
export const migrateCharacter = (character: Character): Character => {
  let migrated = character;
  migrated = migrateRebornToElfSubrace(migrated);
  migrated = migrateInnateSpells(migrated);
  migrated = migrateClassResources(migrated);
  migrated = migrateFeatSpells(migrated);
  return migrated;
};

/**
 * Apply migrations to all characters
 * Returns the migrated characters and whether any migration was applied
 */
export const migrateCharacters = (characters: Character[]): { characters: Character[]; migrated: boolean } => {
  const appliedMigrations = getAppliedMigrations();
  
  // Check if this migration version has been applied
  if (appliedMigrations.has(MIGRATION_VERSION)) {
    return { characters, migrated: false };
  }

  let anyMigrated = false;
  const migratedCharacters = characters.map(char => {
    const migrated = migrateCharacter(char);
    if (migrated !== char) {
      anyMigrated = true;
    }
    return migrated;
  });

  if (anyMigrated) {
    appliedMigrations.add(MIGRATION_VERSION);
    saveAppliedMigrations(appliedMigrations);
  }

  return { characters: migratedCharacters, migrated: anyMigrated };
};
