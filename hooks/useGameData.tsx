import { useMemo } from 'react';
import { BACKGROUNDS } from '../Data/backgrounds';
import { 
  METAMAGIC, 
  INVOCATIONS, 
  ALIGNMENTS, 
  LANGUAGES 
} from '../Data/gameData';

import { WEAPONS_DB } from '../Data/items';
import { WeaponData } from '../types';

export const useGameData = () => {
  const backgrounds = useMemo(() => BACKGROUNDS, []);
  const metamagics = useMemo(() => METAMAGIC, []);
  const invocations = useMemo(() => INVOCATIONS, []);
  const alignments = useMemo(() => ALIGNMENTS, []);
  const languages = useMemo(() => LANGUAGES, []);
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
