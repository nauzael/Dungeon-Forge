import { DetailData } from '../../../types';
import { 
  dwarfEn, elfEn, halflingEn, humanEn, dragonbornEn, 
  gnomeEn, tieflingEn, aasimarEn, goliathEn, orcEn,
  boggartEn, changelingEn, dhampirEn, faerieEn, flamekinEn,
  kalashtarEn, khoravarEn, lorwynChangelingEn, rimekinEn, shifterEn, warforgedEn
} from '../species-en';

export const SPECIES_EN: Record<string, DetailData> = {
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
