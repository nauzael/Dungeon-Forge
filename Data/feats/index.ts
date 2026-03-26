
import { FEATS_EN } from './feats-en';

export interface Feat {
  name: string;
  description: string;
}

export const useFeats = (): Feat[] => {
  return FEATS_EN;
};
