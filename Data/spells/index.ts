
import { SpellDetail } from '../../types';

import { CANTRIPS } from './cantrips';
import { LEVEL1 } from './level1';
import { LEVEL2 } from './level2';
import { LEVEL3 } from './level3';
import { LEVEL4 } from './level4';
import { LEVEL5 } from './level5';
import { LEVEL6 } from './level6';
import { LEVEL7 } from './level7';
import { LEVEL8 } from './level8';
import { LEVEL9 } from './level9';

export const SPELL_DETAILS: Record<string, SpellDetail> = {
  ...CANTRIPS,
  ...LEVEL1,
  ...LEVEL2,
  ...LEVEL3,
  ...LEVEL4,
  ...LEVEL5,
  ...LEVEL6,
  ...LEVEL7,
  ...LEVEL8,
  ...LEVEL9
};

export const getSpellByName = (name: string): SpellDetail | undefined => {
  return SPELL_DETAILS[name];
};

export const getSpellsByLevel = (level: number): Record<string, SpellDetail> => {
  let spells: Record<string, SpellDetail>;
  switch (level) {
    case 0: spells = CANTRIPS; break;
    case 1: spells = LEVEL1; break;
    case 2: spells = LEVEL2; break;
    case 3: spells = LEVEL3; break;
    case 4: spells = LEVEL4; break;
    case 5: spells = LEVEL5; break;
    case 6: spells = LEVEL6; break;
    case 7: spells = LEVEL7; break;
    case 8: spells = LEVEL8; break;
    case 9: spells = LEVEL9; break;
    default: spells = {};
  }
  return spells;
};

export { CANTRIPS, LEVEL1, LEVEL2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9 };
