import { useLanguage } from './useLanguage';
import { FEAT_OPTIONS } from '../Data/feats';
import { FEAT_OPTIONS_ES, Feat } from '../Data/feats-es';

interface FeatOptionsData {
  featOptions: Feat[];
  getFeatDisplayName: (enName: string) => string;
  getFeatDescription: (enName: string) => string | undefined;
}

export const useFeatOptions = (): FeatOptionsData => {
  const { language } = useLanguage();
  
  const featOptions = language === 'es' ? FEAT_OPTIONS_ES : FEAT_OPTIONS;
  
  const getFeatDisplayName = (enName: string): string => {
    if (language === 'es') {
      const translated = FEAT_OPTIONS_ES.find(f => {
        return FEAT_OPTIONS.find(ef => ef.name === enName && ef.name === f.name) !== undefined ||
               f.name === enName;
      });
      if (translated) {
        return translated.name;
      }
      const esFromEn = FEAT_OPTIONS_ES.find(f => f.name === enName);
      return esFromEn ? esFromEn.name : enName;
    }
    return enName;
  };
  
  const getFeatDescription = (enName: string): string | undefined => {
    const sourceFeat = FEAT_OPTIONS.find(f => f.name === enName);
    return sourceFeat?.description;
  };

  return {
    featOptions,
    getFeatDisplayName,
    getFeatDescription,
  };
};

export default useFeatOptions;
