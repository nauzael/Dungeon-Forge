import { useLanguage } from './useLanguage';
import { SPELL_DETAILS_EN } from '../Data/spells/en';
import { SPELL_DETAILS_ES } from '../Data/spells/es';
import { BACKGROUNDS_EN } from '../Data/backgrounds/en';
import { BACKGROUNDS_ES } from '../Data/backgrounds/es';
import { FEATS_EN } from '../Data/feats/en';
import { FEATS_ES } from '../Data/feats/es';
import { SPECIES_EN } from '../Data/species/en';
import { SPECIES_ES } from '../Data/species/es';
import { CLASSES_EN } from '../Data/classes/en';
import { CLASSES_ES } from '../Data/classes/es';
import { SPELL_NAME_TO_ES } from '../utils/translations';

interface GameData {
  spells: typeof SPELL_DETAILS_EN;
  backgrounds: typeof BACKGROUNDS_EN;
  feats: typeof FEATS_EN;
  species: typeof SPECIES_EN;
  classes: typeof CLASSES_EN;
  getSpellDisplayName: (enName: string) => string;
}

export const useGameData = (): GameData => {
  const { language } = useLanguage();

  const getSpellDisplayName = (enName: string): string => {
    if (language === 'es') {
      return SPELL_NAME_TO_ES[enName] || enName;
    }
    return enName;
  };

  if (language === 'es') {
    return {
      spells: SPELL_DETAILS_ES,
      backgrounds: BACKGROUNDS_ES,
      feats: FEATS_ES,
      species: SPECIES_ES,
      classes: CLASSES_ES,
      getSpellDisplayName,
    };
  }

  return {
    spells: SPELL_DETAILS_EN,
    backgrounds: BACKGROUNDS_EN,
    feats: FEATS_EN,
    species: SPECIES_EN,
    classes: CLASSES_EN,
    getSpellDisplayName,
  };
};

export default useGameData;
