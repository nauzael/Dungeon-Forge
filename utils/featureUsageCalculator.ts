import { Character, FeatureUsage, FeatureUsageConfig } from '../types';
import { FEATURE_USAGE_CONFIGS } from './featureUsageConfig';
import { getFinalStats } from './sheetUtils';

export const calculateMaxUses = (
  config: FeatureUsageConfig,
  character: Character
): number => {
  const finalStats = getFinalStats(character);

  switch (config.maxFormula) {
    case 'WIS':
      return Math.max(1, Math.floor((finalStats.WIS - 10) / 2));
    case 'INT':
      return Math.max(1, Math.floor((finalStats.INT - 10) / 2));
    case 'CHA':
      return Math.max(1, Math.floor((finalStats.CHA - 10) / 2));
    case 'DEX':
      return Math.max(1, Math.floor((finalStats.DEX - 10) / 2));
    case 'CON':
      return Math.max(1, Math.floor((finalStats.CON - 10) / 2));
    case 'level':
      return character.level;
    case 'proficiencyBonus':
      return character.profBonus;
    case '1':
      return 1;
    default:
      return 0;
  }
};

export const initializeFeatureUsage = (
  featureName: string,
  character: Character
): FeatureUsage | null => {
  const config = FEATURE_USAGE_CONFIGS[featureName];
  if (!config) return null;

  const max = calculateMaxUses(config, character);

  return {
    current: max,
    max,
    resetType: config.resetType,
    costToRestore: config.costToRestore,
  };
};

export const getFeatureUsagesForCharacter = (
  character: Character,
  featureNames: string[]
): Record<string, FeatureUsage> => {
  const usages: Record<string, FeatureUsage> = {};
  const existingUsages = character.featureUsages || {};

  featureNames.forEach(name => {
    const config = FEATURE_USAGE_CONFIGS[name];
    if (!config) return;

    const existing = existingUsages[name];
    if (existing) {
      const newMax = calculateMaxUses(config, character);
      if (existing.max !== newMax) {
        usages[name] = {
          ...existing,
          max: newMax,
          current: Math.min(existing.current, newMax),
        };
      } else {
        usages[name] = existing;
      }
    } else {
      usages[name] = initializeFeatureUsage(name, character)!;
    }
  });

  return usages;
};
