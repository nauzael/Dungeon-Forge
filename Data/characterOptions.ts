
import { Ability, Skill, BackgroundData, DetailData, SubclassData, Trait } from '../types';

// Importación de species (usa versions en inglés)
import { SPECIES } from './species';

// Importación de classes (usa versions en inglés de classes-en.ts)
import { 
  barbarianEn as barbarian, bardEn as bard, clericEn as cleric, druidEn as druid,
  fighterEn as fighter, monkEn as monk, paladinEn as paladin, rangerEn as ranger,
  rogueEn as rogue, sorcererEn as sorcerer, warlockEn as warlock, wizardEn as wizard
} from './classes/classes-en';

const CLASSES_MAP = {
  'Barbarian': barbarian, 'Bard': bard, 'Cleric': cleric, 'Druid': druid,
  'Fighter': fighter, 'Monk': monk, 'Paladin': paladin, 'Ranger': ranger,
  'Rogue': rogue, 'Sorcerer': sorcerer, 'Warlock': warlock, 'Wizard': wizard
};

export const CLASS_LIST = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
];

import { INVOCATIONS as ELDRITCH_INVOCATIONS, METAMAGIC as METAMAGIC_OPTIONS, ALIGNMENTS, LANGUAGES } from './gameData';

export { ELDRITCH_INVOCATIONS, METAMAGIC_OPTIONS, ALIGNMENTS, LANGUAGES };


export const HIT_DIE: Record<string, number> = Object.fromEntries(
  Object.entries(CLASSES_MAP).map(([name, data]) => [name, data.hitDie])
);

export const CLASS_SAVING_THROWS: Record<string, Ability[]> = Object.fromEntries(
  Object.entries(CLASSES_MAP).map(([name, data]) => [name, data.savingThrows])
);

export const CLASS_STAT_PRIORITIES: Record<string, Ability[]> = Object.fromEntries(
  Object.entries(CLASSES_MAP).map(([name, data]) => [name, data.statPriorities])
);

export const CLASS_SKILL_DATA: Record<string, { count: number, options: Skill[] | 'Any' }> = Object.fromEntries(
  Object.entries(CLASSES_MAP).map(([name, data]) => [name, data.skillData])
);

import { BACKGROUNDS as BACKGROUNDS_DATA } from './backgrounds';

export { BACKGROUNDS_DATA };


// Use English species from species/index.ts
const SPECIES_DATA = SPECIES;

// Standard/PHB species only - excludes Eberron, Lorwyn, and exotic settings
const COMMON_SPECIES = [
  'Aasimar', 'Dragonborn', 'Dwarf', 'Elf', 'Gnome', 'Goliath', 'Halfling', 'Human', 'Orc', 'Tiefling'
];

// Use all species from SPECIES object (for existing characters)
export const SPECIES_DETAILS: Record<string, DetailData> = { ...SPECIES_DATA };

// Standard species list for character creator (excludes Eberron/Lorwyn/exotic)
export const SPECIES_LIST = COMMON_SPECIES;

export const CLASS_DETAILS: Record<string, DetailData> = Object.fromEntries(
  Object.entries(CLASSES_MAP).map(([name, data]) => [name, data.details])
);

export const CLASS_PROGRESSION: Record<string, Record<number, string[]>> = Object.fromEntries(
  Object.entries(CLASSES_MAP).map(([name, data]) => [name, data.progression])
);

export const CLASS_SUGGESTED_ARRAYS: Record<string, Record<Ability, number>> = Object.fromEntries(
  Object.entries(CLASSES_MAP).map(([name, data]) => [name, (data as any).suggestedArray])
);

export const CLASS_MASTERIES: Record<string, number> = Object.fromEntries(
  Object.entries(CLASSES_MAP).map(([name, data]) => [name, (data as any).masteriesCount || 0])
);

export const SUBCLASS_OPTIONS: Record<string, SubclassData[]> = Object.fromEntries(
  Object.entries(CLASSES_MAP).map(([name, data]) => [name, data.subclasses])
);

export const MAX_SPELL_LEVEL: Record<'full' | 'half' | 'pact', Record<number, number>> = {
    'full': { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6, 13: 7, 14: 7, 15: 8, 16: 8, 17: 9, 18: 9, 19: 9, 20: 9, },
    'half': { 1: 1, 2: 1, 3: 1, 4: 1, 5: 2, 6: 2, 7: 2, 8: 2, 9: 3, 10: 3, 11: 3, 12: 3, 13: 4, 14: 4, 15: 4, 16: 4, 17: 5, 18: 5, 19: 5, 20: 5, },
    'pact': { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 5, 12: 5, 13: 5, 14: 5, 15: 5, 16: 5, 17: 5, 18: 5, 19: 5, 20: 5, }
};
