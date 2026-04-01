import { Character, SpeciesSpell, DetailData } from '../types';
import { SPECIES_DETAILS } from '../Data/characterOptions';

/**
 * Character Data Migrations
 * 
 * This module handles migrations of existing character data when game data changes.
 * Migrations are tracked and only applied once per character.
 */

const MIGRATION_VERSION = '2026.4.1';

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
    console.error('Failed to save migration state:', e);
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
    console.log(`[Migration] Rebuilding innate spells for "${character.name}":`, correctInnateSpells);
    return {
      ...character,
      innateSpells: correctInnateSpells
    };
  }

  return character;
};

/**
 * Apply all migrations to a character
 */
export const migrateCharacter = (character: Character): Character => {
  let migrated = character;
  migrated = migrateInnateSpells(migrated);
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
    console.log('[Migration] Applied migrations for version', MIGRATION_VERSION);
  }

  return { characters: migratedCharacters, migrated: anyMigrated };
};
