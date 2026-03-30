
import { DetailData } from '../../types';
import { 
  dwarfEn, elfEn, halflingEn, humanEn, dragonbornEn, 
  gnomeEn, tieflingEn, aasimarEn, goliathEn, orcEn,
  boggartEn, changelingEn, dhampirEn, faerieEn, flamekinEn,
  kalashtarEn, khoravarEn, lorwynChangelingEn, rimekinEn, shifterEn, warforgedEn
} from './species-en';

const SPECIES: Record<string, DetailData> = {
  Dwarf: dwarfEn,
  Elf: elfEn,
  Halfling: halflingEn,
  Human: humanEn,
  Dragonborn: dragonbornEn,
  Gnome: gnomeEn,
  'Half-Orc': orcEn,
  Tiefling: tieflingEn,
  Aasimar: aasimarEn,
  Goliath: goliathEn,
  Orc: orcEn,
  Boggart: boggartEn,
  Changeling: changelingEn,
  Dhampir: dhampirEn,
  Faerie: faerieEn,
  Flamekin: flamekinEn,
  Kalashtar: kalashtarEn,
  Khoravar: khoravarEn,
  'Lorwyn Changeling': lorwynChangelingEn,
  Rimekin: rimekinEn,
  Shifter: shifterEn,
  Warforged: warforgedEn,
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
