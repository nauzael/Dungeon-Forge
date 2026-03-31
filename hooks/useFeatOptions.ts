import { useLanguage } from './useLanguage';
import { FEAT_OPTIONS, GENERIC_FEATURES } from '../Data/feats';
import { FEAT_OPTIONS_ES, Feat } from '../Data/feats-es';
import FEAT_NAME_TO_ES from '../Data/translations/es/feat-names.json';

interface FeatOptionsData {
  featOptions: Feat[];
  getFeatDisplayName: (enName: string) => string;
  getFeatDescription: (enName: string) => string | undefined;
  isOriginFeat: (enName: string) => boolean;
  getFeatByName: (enName: string) => Feat | undefined;
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

  return {
    featOptions,
    getFeatDisplayName,
    getFeatDescription,
    isOriginFeat,
    getFeatByName,
  };
};

export default useFeatOptions;
