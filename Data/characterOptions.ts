
import { Ability, Skill, BackgroundData, DetailData, SubclassData, Trait } from '../types';

// Importación de archivos de razas independientes
import { human } from './species/human';
import { elf } from './species/elf';
import { dwarf } from './species/dwarf';
import { halfling } from './species/halfling';
import { dragonborn } from './species/dragonborn';
import { gnome } from './species/gnome';
import { orc } from './species/orc';
import { tiefling } from './species/tiefling';
import { aasimar } from './species/aasimar';
import { goliath } from './species/goliath';

// Importación de archivos de clases independientes
import { barbarian } from './classes/barbarian';
import { bard } from './classes/bard';
import { cleric } from './classes/cleric';
import { druid } from './classes/druid';
import { fighter } from './classes/fighter';
import { monk } from './classes/monk';
import { paladin } from './classes/paladin';
import { ranger } from './classes/ranger';
import { rogue } from './classes/rogue';
import { sorcerer } from './classes/sorcerer';
import { warlock } from './classes/warlock';
import { wizard } from './classes/wizard';

const CLASSES_MAP = {
  'Barbarian': barbarian, 'Bard': bard, 'Cleric': cleric, 'Druid': druid,
  'Fighter': fighter, 'Monk': monk, 'Paladin': paladin, 'Ranger': ranger,
  'Rogue': rogue, 'Sorcerer': sorcerer, 'Warlock': warlock, 'Wizard': wizard
};

export const SPECIES_LIST = [
  'Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 'Gnome', 'Orc', 'Tiefling', 'Aasimar', 'Goliath'
];

export const CLASS_LIST = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
];

import { INVOCATIONS_EN as ELDRITCH_INVOCATIONS, METAMAGIC_EN as METAMAGIC_OPTIONS, ALIGNMENTS_EN as ALIGNMENTS, LANGUAGES_EN as LANGUAGES } from './gameData';

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

import { BACKGROUNDS_EN as BACKGROUNDS_DATA } from './backgrounds';

export { BACKGROUNDS_DATA };


export const SPECIES_DETAILS: Record<string, DetailData> = {
  'Human': human, 'Elf': elf, 'Dwarf': dwarf, 'Halfling': halfling,
  'Dragonborn': dragonborn, 'Gnome': gnome, 'Orc': orc, 'Tiefling': tiefling,
  'Aasimar': aasimar, 'Goliath': goliath,
};

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
