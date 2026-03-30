import { FEATS_EN, Feat } from './feats';

export const FEATS_EN_RECORD: Record<string, Feat> = FEATS_EN.reduce((acc, feat) => {
  acc[feat.name] = feat;
  return acc;
}, {} as Record<string, Feat>);

export { FEATS_EN_RECORD as FEATS_EN };
