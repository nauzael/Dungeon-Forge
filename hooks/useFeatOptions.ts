import { useLanguage } from './useLanguage';
import { FEAT_OPTIONS, GENERIC_FEATURES } from '../Data/feats';
import { FEAT_OPTIONS_ES, Feat } from '../Data/feats-es';
import FEAT_NAME_TO_ES from '../Data/translations/es/feat-names.json';

const FEAT_NAME_TO_EN = Object.fromEntries(
  Object.entries(FEAT_NAME_TO_ES as Record<string, string>).map(([en, es]) => [es, en])
);

interface FeatOptionsData {
  featOptions: Feat[];
  getFeatDisplayName: (enName: string) => string;
  getFeatDescription: (enName: string) => string | undefined;
  isOriginFeat: (enName: string) => boolean;
  getFeatByName: (enName: string) => Feat | undefined;
  hasFeat: (enName: string, characterFeats: string[]) => boolean;
}

export const useFeatOptions = (): FeatOptionsData => {
  const { language } = useLanguage();
  
  const featOptions = language === 'es' ? FEAT_OPTIONS_ES : FEAT_OPTIONS;
  
  const getFeatDisplayName = (enName: string): string => {
    if (language === 'es') {
      return (FEAT_NAME_TO_ES as Record<string, string>)[enName] || enName;
    }
    return enName;
  };
  
  const getFeatDescription = (enName: string): string | undefined => {
    const sourceFeat = FEAT_OPTIONS.find(f => f.name === enName);
    return sourceFeat?.description;
  };

  const isOriginFeat = (enName: string): boolean => {
    const feat = FEAT_OPTIONS.find(f => f.name === enName);
    return feat?.category === 'Origin';
  };

  const getFeatByName = (enName: string): Feat | undefined => {
    return FEAT_OPTIONS.find(f => f.name === enName);
  };

  const hasFeat = (enName: string, characterFeats: string[]): boolean => {
    if (characterFeats.includes(enName)) return true;
    const esName = (FEAT_NAME_TO_ES as Record<string, string>)[enName];
    if (esName && characterFeats.includes(esName)) return true;
    return false;
  };

  return {
    featOptions,
    getFeatDisplayName,
    getFeatDescription,
    isOriginFeat,
    getFeatByName,
    hasFeat,
  };
};

export default useFeatOptions;
