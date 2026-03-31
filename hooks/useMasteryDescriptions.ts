import { useLanguage } from './useLanguage';
import { MASTERY_DESCRIPTIONS } from '../Data/items';
import { MASTERY_DESCRIPTIONS_ES } from '../Data/items-es';

export const useMasteryDescriptions = (): Record<string, string> => {
  const { language } = useLanguage();
  return language === 'es' ? MASTERY_DESCRIPTIONS_ES : MASTERY_DESCRIPTIONS;
};

export default useMasteryDescriptions;
