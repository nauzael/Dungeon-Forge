/**
 * Magical Items with HP Bonuses
 * Auto-detection for equipment that grants additional HP
 */

export interface MagicalItemBonus {
  name: string;
  type: 'one-time' | 'per-level'; // one-time: fixed bonus, per-level: bonus per level gained
  hpBonus: number; // Total HP if one-time, HP per level if per-level
  description: string;
}

export const MAGICAL_ITEMS_WITH_HP_BONUS: Record<string, MagicalItemBonus> = {
  'Amulet of Health': {
    name: 'Amulet of Health',
    type: 'one-time',
    hpBonus: 0, // Constitution 19: calculated separately via CON modifier
    description: 'Sets CON to 19 (if lower), increasing HP via CON modifier',
  },
  'Boon of Bountiful Health': {
    name: 'Boon of Bountiful Health',
    type: 'one-time',
    hpBonus: 20,
    description: 'Epic Boon: +20 max HP',
  },
  'Boon of Fortitude': {
    name: 'Boon of Fortitude',
    type: 'one-time',
    hpBonus: 30,
    description: 'Epic Boon: +30 max HP + 5 HP regen per turn',
  },
  'Cloak of Vitality': {
    name: 'Cloak of Vitality',
    type: 'one-time',
    hpBonus: 10,
    description: 'Rare: +10 max HP',
  },
  'Ring of Vigor': {
    name: 'Ring of Vigor',
    type: 'per-level',
    hpBonus: 1,
    description: '+1 max HP per level',
  },
  'Stone of Endurance': {
    name: 'Stone of Endurance',
    type: 'one-time',
    hpBonus: 15,
    description: 'Uncommon: +15 max HP',
  },
};

/**
 * Get HP bonus from a single item
 */
export const getItemHpBonus = (itemName: string): MagicalItemBonus | null => {
  return MAGICAL_ITEMS_WITH_HP_BONUS[itemName] || null;
};

/**
 * Get total one-time HP bonus from all equipped items
 */
export const getTotalItemHpBonusOneTime = (equippedItems: string[]): number => {
  return equippedItems.reduce((total, itemName) => {
    const bonus = getItemHpBonus(itemName);
    if (bonus && bonus.type === 'one-time') {
      return total + bonus.hpBonus;
    }
    return total;
  }, 0);
};

/**
 * Get total per-level HP bonus from all equipped items
 */
export const getTotalItemHpBonusPerLevel = (equippedItems: string[]): number => {
  return equippedItems.reduce((total, itemName) => {
    const bonus = getItemHpBonus(itemName);
    if (bonus && bonus.type === 'per-level') {
      return total + bonus.hpBonus;
    }
    return total;
  }, 0);
};

/**
 * Get all active HP bonuses from a character (feats, species, subclass, items)
 */
export const getAllHpBonuseSources = (
  character: any
): Array<{ source: string; value: number; type: 'per-level' | 'one-time' }> => {
  const sources = [];

  // Feats
  if (character.feats?.includes('Tough') || character.feats?.includes('Duro')) {
    sources.push({ source: 'Tough Feat', value: 2, type: 'per-level' });
  }

  // Species
  if (character.species === 'Dwarf') {
    sources.push({ source: 'Dwarven Toughness', value: 1, type: 'per-level' });
  }

  // Subclass
  if (character.subclass === 'Draconic Sorcery') {
    sources.push({ source: 'Draconic Resilience', value: 1, type: 'per-level' });
  }

  // Equipped items
  const equippedItems = (character.inventory || [])
    .filter((item: any) => item.equipped)
    .map((item: any) => item.name);

  const itemBonusPerLevel = getTotalItemHpBonusPerLevel(equippedItems);
  const itemBonusOneTime = getTotalItemHpBonusOneTime(equippedItems);

  if (itemBonusPerLevel > 0) {
    sources.push({ source: 'Equipped Items (per level)', value: itemBonusPerLevel, type: 'per-level' });
  }

  if (itemBonusOneTime > 0) {
    sources.push({ source: 'Equipped Items (one-time)', value: itemBonusOneTime, type: 'one-time' });
  }

  return sources;
};
