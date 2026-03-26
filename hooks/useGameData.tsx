import { useMemo } from 'react';
import { BACKGROUNDS_EN } from '../Data/backgrounds';
import { 
  METAMAGIC_EN, 
  INVOCATIONS_EN, 
  ALIGNMENTS_EN, 
  LANGUAGES_EN 
} from '../Data/gameData';

import { WEAPONS_DB } from '../Data/items';
import { WeaponData } from '../types';

export const useGameData = () => {
  const backgrounds = useMemo(() => BACKGROUNDS_EN, []);
  const metamagics = useMemo(() => METAMAGIC_EN, []);
  const invocations = useMemo(() => INVOCATIONS_EN, []);
  const alignments = useMemo(() => ALIGNMENTS_EN, []);
  const languages = useMemo(() => LANGUAGES_EN, []);
  const weapons = useMemo(() => Object.values(WEAPONS_DB) as WeaponData[], []);

  return {
    backgrounds,
    metamagics,
    invocations,
    alignments,
    languages,
    weapons
  };
};
