import { Ability } from '../../../types';

export type ClassData = {
  details: unknown;
  hitDie: number;
  savingThrows: Ability[];
  statPriorities: Ability[];
  skillData: { count: number; options: unknown };
  progression: Record<number, string[]>;
  subclasses: unknown[];
  masteriesCount?: number;
  suggestedArray?: Record<Ability, number>;
};

import { barbarian } from '../barbarian';
import { bard } from '../bard';
import { cleric } from '../cleric';
import { druid } from '../druid';
import { fighter } from '../fighter';
import { monk } from '../monk';
import { paladin } from '../paladin';
import { ranger } from '../ranger';
import { rogue } from '../rogue';
import { sorcerer } from '../sorcerer';
import { warlock } from '../warlock';
import { wizard } from '../wizard';

export const CLASSES_ES: Record<string, ClassData> = {
  Barbarian: barbarian as ClassData,
  Bard: bard as ClassData,
  Cleric: cleric as ClassData,
  Druid: druid as ClassData,
  Fighter: fighter as ClassData,
  Monk: monk as ClassData,
  Paladin: paladin as ClassData,
  Ranger: ranger as ClassData,
  Rogue: rogue as ClassData,
  Sorcerer: sorcerer as ClassData,
  Warlock: warlock as ClassData,
  Wizard: wizard as ClassData
};
