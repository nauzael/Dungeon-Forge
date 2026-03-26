
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
  'Acrobatics': 'Mantiene el equilibrio en situaciones difíciles',
  'Animal Handling': 'Permite calmar a animales domésticos',
  'Arcana': 'Mide tu capacidad para recordar conocimientos sobre hechizos',
  'Athletics': 'Cubre situaciones físicas difíciles',
  'Deception': 'Determina si puedes ocultar la verdad',
  'History': 'Mide tu capacidad para recordar conocimientos históricos',
  'Insight': 'Te permite determinar las verdaderas intenciones',
  'Intimidation': 'Se usa para influir mediante amenazas',
  'Investigation': 'Usada para buscar pistas y hacer deducciones',
  'Medicine': 'Te permite estabilizar o diagnosticar',
  'Nature': 'Mide tu capacidad sobre terreno y naturaleza',
  'Perception': 'Te permite detectar la presencia de algo',
  'Performance': 'Qué tan bien puedes deleitar a una audiencia',
  'Persuasion': 'Se usa para influir en alguien',
  'Religion': 'Mide tu capacidad sobre deidades',
  'Sleight of Hand': 'Trucos manuales',
  'Stealth': 'Te permite ocultarte',
  'Survival': 'Se usa para seguir rastros'
};
