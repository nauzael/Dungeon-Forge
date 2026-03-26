
import { DetailData } from '../../types';
import { 
  dwarfEn, elfEn, halflingEn, humanEn, dragonbornEn, 
  gnomeEn, halfOrcEn, tieflingEn, aasimarEn, goliathEn, orcEn 
} from './species-en';

const SPECIES: Record<string, DetailData> = {
  Dwarf: dwarfEn,
  Elf: elfEn,
  Halfling: halflingEn,
  Human: humanEn,
  Dragonborn: dragonbornEn,
  Gnome: gnomeEn,
  'Half-Orc': halfOrcEn,
  Tiefling: tieflingEn,
  Aasimar: aasimarEn,
  Goliath: goliathEn,
  Orc: orcEn
};

export { SPECIES };
export type { DetailData };

export const useSpecies = (): Record<string, DetailData> => {
  return SPECIES;
};

export const getSpeciesByName = (name: string): DetailData | undefined => {
  return SPECIES[name];
};

export const getSpeciesList = (): string[] => {
  return Object.keys(SPECIES);
};
