import { Character } from '../types';

export const RAGE_USES_BY_LEVEL: Record<number, number> = {
    1: 2,
    2: 2,
    3: 3,
    4: 3,
    5: 3,
    6: 4,
    7: 4,
    8: 4,
    9: 4,
    10: 4,
    11: 4,
    12: 5,
    13: 5,
    14: 5,
    15: 5,
    16: 5,
    17: 6,
    18: 6,
    19: 6,
    20: 6,
};

export const RAGE_DAMAGE_BY_LEVEL = {
    LOW: 2,
    MID: 3,
    HIGH: 4,
} as const;

export type RageDamageTier = 'LOW' | 'MID' | 'HIGH';

export const getRageUses = (level: number): number => {
    if (level >= 20) return 99;
    return RAGE_USES_BY_LEVEL[Math.min(level, 20)] || 2;
};

export const getRageDamage = (level: number): number => {
    if (level >= 17) return RAGE_DAMAGE_BY_LEVEL.HIGH;
    if (level >= 9) return RAGE_DAMAGE_BY_LEVEL.MID;
    return RAGE_DAMAGE_BY_LEVEL.LOW;
};

export const getRageDamageTier = (level: number): RageDamageTier => {
    if (level >= 17) return 'HIGH';
    if (level >= 9) return 'MID';
    return 'LOW';
};

export type DamageType = 'Bludgeoning' | 'Piercing' | 'Slashing';

export const getRageResistanceTypes = (character: Character): DamageType[] => {
    if (!character.isRaging) return [];
    
    const baseResistance: DamageType[] = ['Bludgeoning', 'Piercing', 'Slashing'];
    
    if (character.subclass === 'Path of the Wild Heart') {
        return baseResistance;
    }
    
    return baseResistance;
};

export const getDangerSenseBonus = (character: Character): boolean => {
    if (!character.isRaging) return false;
    return character.level >= 2;
};

export const getStrengthAdvantage = (character: Character): boolean => {
    return character.isRaging || false;
};

export const isBarbarian = (character: Character): boolean => {
    return character.class === 'Barbarian';
};

export const canActivateRage = (character: Character): boolean => {
    if (!isBarbarian(character)) return false;
    
    const rageUnlimited = character.level >= 20;
    const rageCurrent = character.rageUses?.current ?? getRageUses(character.level);
    
    return rageUnlimited || rageCurrent > 0;
};

export const activateRage = (character: Character): Partial<Character> => {
    if (!canActivateRage(character)) return {};
    
    const rageMax = getRageUses(character.level);
    const rageUnlimited = character.level >= 20;
    const rageCurrent = character.rageUses?.current ?? rageMax;
    
    const newUses = rageUnlimited ? 99 : Math.max(0, rageCurrent - 1);
    
    const updates: Partial<Character> = {
        isRaging: true,
        rageUses: { current: newUses, max: rageMax },
    };
    
    if (character.subclass === 'Path of the World Tree') {
        const tempHP = character.hp.temp + character.level;
        updates.hp = { ...character.hp, temp: tempHP };
    }
    
    return updates;
};

export const deactivateRage = (character: Character): Partial<Character> => {
    const updates: Partial<Character> = {
        isRaging: false,
    };
    
    if (character.subclass === 'Path of the World Tree' && character.hp.temp > 0) {
        updates.hp = { ...character.hp, temp: 0 };
    }
    
    return updates;
};

export const resetRageUses = (character: Character): Partial<Character> => {
    const rageMax = getRageUses(character.level);
    return {
        rageUses: { current: rageMax, max: rageMax },
    };
};

export const getVitalityOfTheTreeHP = (character: Character): number => {
    if (!character.isRaging || character.subclass !== 'Path of the World Tree') return 0;
    return character.level;
};

export const getDivineFuryDamage = (character: Character): number => {
    if (!character.isRaging || character.subclass !== 'Path of the Zealot') return 0;
    return 1 + Math.floor(character.level / 2);
};

export const getFrenzyBonusDamage = (character: Character): number => {
    if (!character.isRaging || character.subclass !== 'Path of the Berserker') return 0;
    if (!character.isRecklessAttack) return 0;
    return getRageDamage(character.level);
};

export const isRecklessAttackActive = (character: Character): boolean => {
    return character.isRecklessAttack || false;
};

export const toggleRecklessAttack = (character: Character): Partial<Character> => {
    return {
        isRecklessAttack: !isRecklessAttackActive(character),
    };
};

export interface RageBreakdownItem {
    label: string;
    value: number;
    icon: string;
    active: boolean;
}

export const getRageBreakdown = (character: Character): RageBreakdownItem[] => {
    if (!isBarbarian(character)) return [];
    
    const items: RageBreakdownItem[] = [];
    
    items.push({
        label: 'Rage Damage',
        value: getRageDamage(character.level),
        icon: 'local_fire_department',
        active: character.isRaging || false,
    });
    
    items.push({
        label: 'B/P/S Resistance',
        value: 1,
        icon: 'shield',
        active: character.isRaging || false,
    });
    
    if (character.level >= 2) {
        items.push({
            label: 'Danger Sense',
            value: 1,
            icon: 'visibility',
            active: character.isRaging || false,
        });
    }
    
    items.push({
        label: 'Strength Advantage',
        value: 1,
        icon: 'fitness_center',
        active: character.isRaging || false,
    });
    
    if (character.subclass === 'Path of the World Tree' && character.isRaging) {
        items.push({
            label: 'Vitality of the Tree',
            value: character.level,
            icon: 'forest',
            active: true,
        });
    }
    
    if (character.subclass === 'Path of the Zealot' && character.isRaging) {
        items.push({
            label: 'Divine Fury',
            value: getDivineFuryDamage(character),
            icon: 'bolt',
            active: true,
        });
    }
    
    if (character.subclass === 'Path of the Berserker' && character.isRaging) {
        items.push({
            label: 'Frenzy (Reckless)',
            value: getFrenzyBonusDamage(character),
            icon: 'whatshot',
            active: character.isRecklessAttack || false,
        });
    }
    
    return items;
};
