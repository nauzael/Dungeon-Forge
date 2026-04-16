import { Character, Ability, BeastStats, WildShapeState } from '../types';
import { getBeastsForLevel, getBeastByName as getBeastByNameFromData } from '../Data/beasts';

export { getBeastByName } from '../Data/beasts';

export const getMaxCRForLevel = (druidLevel: number, isCircleOfTheMoon: boolean): number => {
  if (isCircleOfTheMoon) {
    return Math.floor(druidLevel / 3);
  }
  if (druidLevel >= 8) return 1;
  if (druidLevel >= 4) return 0.5;
  return 0.25;
};

export const getKnownFormsCount = (druidLevel: number): number => {
  if (druidLevel >= 8) return 8;
  if (druidLevel >= 4) return 6;
  return 4; // Nivel 2-3
};

export const getWildShapeUsesForLevel = (druidLevel: number): number => {
  if (druidLevel >= 8) return 3;
  return 2;
};

export const getTHPForWildShape = (druidLevel: number, isCircleOfTheMoon: boolean): number => {
  if (isCircleOfTheMoon) {
    return druidLevel * 3;
  }
  return druidLevel;
};

export const calculateWildShapeAC = (
  character: Character,
  beastAC: number
): number => {
  const isCircleOfTheMoon = character.subclass === 'Circle of the Moon';
  if (isCircleOfTheMoon) {
    const wisMod = Math.floor((character.stats.WIS - 10) / 2);
    return Math.max(beastAC, 13 + wisMod);
  }
  return beastAC;
};

export const canUseFlySpeed = (
  druidLevel: number,
  isCircleOfTheMoon: boolean,
  beastHasFlySpeed: boolean
): boolean => {
  if (isCircleOfTheMoon) return beastHasFlySpeed;
  return druidLevel >= 8 && beastHasFlySpeed;
};

export const getAvailableBeasts = (
  druidLevel: number,
  isCircleOfTheMoon: boolean,
  knownForms?: string[]
): BeastStats[] => {
  const maxCR = getMaxCRForLevel(druidLevel, isCircleOfTheMoon);
  const allBeasts = getBeastsForLevel(druidLevel);
  
  const filteredBeasts = allBeasts.filter(beast => {
    if (beast.cr > maxCR) return false;
    if (beast.flySpeed && !canUseFlySpeed(druidLevel, isCircleOfTheMoon, !!beast.flySpeed)) return false;
    // Si no hay formas conocidas definidas (compatibilidad), mostrar todas
    // Si hay formas conocidas, filtrar solo por esas
    if (knownForms && knownForms.length > 0 && !knownForms.includes(beast.name)) return false;
    return true;
  });
  
  return filteredBeasts;
};

export const transformIntoBeast = (
  character: Character,
  beast: BeastStats
): { updatedChar: Character; wildShapeState: WildShapeState } => {
  const isCircleOfTheMoon = character.subclass === 'Circle of the Moon';
  const druidLevel = character.level;
  
  const snapshot: WildShapeState = {
    form: beast.name,
    originalStats: { ...character.stats } as Record<Ability, number>,
    originalHP: { ...character.hp },
    originalAC: character.ac,
    thpGained: getTHPForWildShape(druidLevel, isCircleOfTheMoon),
    startedAt: Date.now(),
    isLunarRadiance: false,
    attacks: [...beast.attacks] // Incluir ataques de la bestia
  };
  
  const newAC = calculateWildShapeAC(character, beast.ac);
  
  const updatedChar: Character = {
    ...character,
    hp: {
      ...character.hp,
      temp: character.hp.temp + snapshot.thpGained
    },
    ac: newAC,
    stats: {
      STR: beast.stats.STR,
      DEX: beast.stats.DEX,
      CON: beast.stats.CON,
      INT: character.stats.INT, // Preservar INT del druida
      WIS: character.stats.WIS, // Preservar WIS del druida
      CHA: character.stats.CHA  // Preservar CHA del druida
    },
    activeWildShape: beast.name,
    wildShape: character.wildShape
      ? {
          current: Math.max(0, character.wildShape.current - 1),
          max: character.wildShape.max
        }
      : { current: getWildShapeUsesForLevel(druidLevel) - 1, max: getWildShapeUsesForLevel(druidLevel) },
    wildShapeForms: character.wildShapeForms 
      ? (character.wildShapeForms.includes(beast.name) 
          ? character.wildShapeForms 
          : [...character.wildShapeForms, beast.name])
      : [beast.name]
  };
  
  saveWildShapeToLocalStorage(character.id, beast.name, snapshot);
  
  return { updatedChar, wildShapeState: snapshot };
};

export const restoreOriginalForm = (
  character: Character,
  wildShapeState: WildShapeState
): Character => {
  const druidLevel = character.level;
  
  let newHP = { ...character.hp };
  if (newHP.temp > 0) {
    newHP.temp = Math.max(0, newHP.temp - wildShapeState.thpGained);
  }
  
  const restoredChar: Character = {
    ...character,
    hp: {
      ...wildShapeState.originalHP,
      temp: newHP.temp
    },
    ac: wildShapeState.originalAC,
    stats: { ...wildShapeState.originalStats },
    activeWildShape: undefined,
    wildShape: character.wildShape
      ? {
          current: character.wildShape.current, // Mantener usos actuales (no incrementar)
          max: character.wildShape.max
        }
      : { current: getWildShapeUsesForLevel(druidLevel), max: getWildShapeUsesForLevel(druidLevel) }
  };
  
  clearWildShapeFromLocalStorage(character.id);
  
  return restoredChar;
};

export const saveWildShapeToLocalStorage = (characterId: string, formName: string, wildShapeState: WildShapeState): void => {
  try {
    localStorage.setItem(
      `wildshape_${characterId}`,
      JSON.stringify({
        form: formName,
        timestamp: Date.now(),
        originalStats: wildShapeState.originalStats,
        originalHP: wildShapeState.originalHP,
        originalAC: wildShapeState.originalAC,
        thpGained: wildShapeState.thpGained
      })
    );
  } catch (e) {
    console.error('Failed to save wild shape state:', e);
  }
};

export const getWildShapeFromLocalStorage = (characterId: string): {
  form: string;
  timestamp: number;
  originalStats?: Record<string, number>;
  originalHP?: { current: number; max: number; temp: number };
  originalAC?: number;
  thpGained?: number;
} | null => {
  try {
    const saved = localStorage.getItem(`wildshape_${characterId}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load wild shape state:', e);
  }
  return null;
};

export const clearWildShapeFromLocalStorage = (characterId: string): void => {
  try {
    localStorage.removeItem(`wildshape_${characterId}`);
  } catch (e) {
    console.error('Failed to clear wild shape state:', e);
  }
};

export const initializeWildShapeUses = (character: Character): Character => {
  if (character.class !== 'Druid' || character.wildShape) {
    return character;
  }
  
  const druidLevel = character.level;
  const uses = getWildShapeUsesForLevel(druidLevel);
  
  return {
    ...character,
    wildShape: { current: uses, max: uses }
  };
};

export const isLunarRadianceAvailable = (druidLevel: number): boolean => {
  return druidLevel >= 6;
};

export const getDurationHours = (druidLevel: number): number => {
  return Math.floor(druidLevel / 2);
};
