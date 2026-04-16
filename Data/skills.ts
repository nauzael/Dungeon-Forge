
import { Ability } from '../types';

export const ABILITY_NAMES: Record<Ability, string> = {
  STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution',
  INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma'
};

export const SKILL_ABILITY_MAP: Record<string, Ability> = {
  'Acrobatics': 'DEX', 'Animal Handling': 'WIS', 'Arcana': 'INT', 
  'Athletics': 'STR', 'Deception': 'CHA', 'History': 'INT', 
  'Insight': 'WIS', 'Intimidation': 'CHA', 'Investigation': 'INT', 
  'Medicine': 'WIS', 'Nature': 'INT', 'Perception': 'WIS', 
  'Performance': 'CHA', 'Persuasion': 'CHA', 'Religion': 'INT', 
  'Sleight of Hand': 'DEX', 'Stealth': 'DEX', 'Survival': 'WIS'
};

export const SKILL_LIST = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 
  'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 
  'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion', 
  'Sleight of Hand', 'Stealth', 'Survival'
] as const;

export const SKILL_DESCRIPTIONS: Record<string, string> = {
  'Acrobatics': 'Keeps your balance in difficult situations',
  'Animal Handling': 'Allows you to calm animals',
  'Arcana': 'Measures your ability to recall knowledge about spells',
  'Athletics': 'Covers physically challenging situations',
  'Deception': 'Determines if you can hide the truth',
  'History': 'Measures your ability to recall historical knowledge',
  'Insight': 'Allows you to determine true intentions',
  'Intimidation': 'Used to influence through threats',
  'Investigation': 'Used to search for clues and make deductions',
  'Medicine': 'Allows you to stabilize or diagnose',
  'Nature': 'Measures your knowledge of terrain and nature',
  'Perception': 'Allows you to detect the presence of something',
  'Performance': 'How well you can delight an audience',
  'Persuasion': 'Used to influence someone',
  'Religion': 'Measures your knowledge of deities',
  'Sleight of Hand': 'Manual tricks',
  'Stealth': 'Allows you to hide',
  'Survival': 'Used to follow tracks'
};
