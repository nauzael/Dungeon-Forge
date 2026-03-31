
import { Character, InventoryItem, Ability, ItemData, ArmorData, WeaponData } from '../types';
import { ALL_ITEMS, MAGIC_ITEMS } from '../Data/items';
import { CLASS_SAVING_THROWS, SPECIES_DETAILS, HIT_DIE } from '../Data/characterOptions';
import { SKILL_ABILITY_MAP } from '../Data/skills';

export const SCHOOL_THEMES: Record<string, { text: string, bg: string, border: string, icon: string }> = {
    'Abjuration': { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'shield' },
    'Conjuration': { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: 'apps' },
    'Divination': { text: 'text-indigo-300', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', icon: 'visibility' },
    'Enchantment': { text: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', icon: 'favorite' },
    'Evocation': { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'local_fire_department' },
    'Illusion': { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: 'auto_fix' },
    'Necromancy': { text: 'text-lime-400', bg: 'bg-lime-500/10', border: 'border-lime-500/20', icon: 'skull' },
    'Transmutation': { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'change_circle' },
    // Spanish keys
    'Abjuración': { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'shield' },
    'Conjuración': { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: 'apps' },
    'Adivinación': { text: 'text-indigo-300', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', icon: 'visibility' },
    'Encantamiento': { text: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', icon: 'favorite' },
    'Evocación': { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'local_fire_department' },
    'Ilusión': { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: 'auto_fix' },
    'Nigromancia': { text: 'text-lime-400', bg: 'bg-lime-500/10', border: 'border-lime-500/20', icon: 'skull' },
    'Transmutación': { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'change_circle' },
};

export const getItemData = (name: string): ItemData | undefined => {
    if (ALL_ITEMS[name]) return ALL_ITEMS[name];
    
    // Handle Magic variants created by user (e.g. "Longsword +1")
    const magicMatch = name.match(/^(.*?)\s*\+(\d+)$/);
    if (magicMatch && ALL_ITEMS[magicMatch[1]]) return ALL_ITEMS[magicMatch[1]];

    const match = name.match(/^(.*?) \((\d+)\)$/);
    if (match && ALL_ITEMS[match[1]]) return ALL_ITEMS[match[1]];
    return undefined;
};

export const formatModifier = (val: number) => `${val >= 0 ? '+' : ''}${val}`;

export interface StatBreakdownItem {
    label: string;
    value: number | string;
    icon: string;
}

export const getAbilityModifier = (stats: Record<string, number>, ability: Ability) => Math.floor(((stats[ability] || 10) - 10) / 2);

export const getWeaponToHitBreakdown = (character: Character, item: InventoryItem, weapon: WeaponData, finalStats: Record<string, number>): StatBreakdownItem[] => {
    const breakdown: StatBreakdownItem[] = [];
    const strMod = getAbilityModifier(finalStats, 'STR');
    const dexMod = getAbilityModifier(finalStats, 'DEX');
    const isMonk = character.class === 'Monk';
    
    let scalingStat: Ability;
    let scalingVal: number;

    if (item.customStat) {
        scalingStat = item.customStat;
        scalingVal = getAbilityModifier(finalStats, scalingStat);
        breakdown.push({ label: `Atributo (Manual: ${scalingStat})`, value: scalingVal, icon: 'star' });
    } else {
        const isFinesse = weapon.properties.includes('Finesse');
        const isRanged = weapon.rangeType === 'Ranged';
        const isMonkWeapon = isMonk && (
            (weapon.category === 'Simple' && weapon.rangeType === 'Melee') ||
            (weapon.category === 'Martial' && weapon.rangeType === 'Melee' && weapon.properties.includes('Light'))
        );
        
        let useDex = isRanged || (isFinesse && dexMod > strMod);
        if (isMonk && (isMonkWeapon || weapon.name === 'Unarmed Strike')) {
            if (dexMod > strMod) useDex = true;
        }
        
        scalingStat = useDex ? 'DEX' : 'STR';
        scalingVal = useDex ? dexMod : strMod;
        breakdown.push({ label: `Atributo (${scalingStat})`, value: scalingVal, icon: useDex ? 'bolt' : 'fitness_center' });
    }

    breakdown.push({ label: 'Bono de Competencia', value: character.profBonus, icon: 'school' });

    const bonusMatch = item.name.match(/\+(\d+)$/);
    if (bonusMatch) {
        const bonus = parseInt(bonusMatch[1]);
        if (bonus > 0) breakdown.push({ label: `Bono Mágico +${bonus}`, value: bonus, icon: 'magic_button' });
    }
    
    if (item.name === 'Sun Blade' || item.name === 'Holy Avenger') {
        const val = item.name === 'Sun Blade' ? 2 : 3;
        breakdown.push({ label: `${item.name} Bonus`, value: val, icon: 'auto_awesome' });
    }

    if (weapon.name === 'Unarmed Strike') {
        const wraps = character.inventory.find(i => i.equipped && i.name.includes('Wraps of Unarmed Power'));
        if (wraps) {
            const wrapBonusMatch = wraps.name.match(/\+(\d+)$/);
            if (wrapBonusMatch) {
                const bonus = parseInt(wrapBonusMatch[1]);
                if (bonus > 0) breakdown.push({ label: 'Wraps of Unarmed Power', value: bonus, icon: 'sports_martial_arts' });
            }
        }
    }

    if (character.feats.some(f => f.includes('Arquero') || f.includes('Archery')) && weapon.rangeType === 'Ranged') {
        breakdown.push({ label: 'Estilo: Arquero', value: 2, icon: 'military_tech' });
    }

    return breakdown;
};

export const getWeaponDamageBreakdown = (character: Character, item: InventoryItem, weapon: WeaponData, finalStats: Record<string, number>, isRaging: boolean): StatBreakdownItem[] => {
    const breakdown: StatBreakdownItem[] = [];
    const strMod = getAbilityModifier(finalStats, 'STR');
    const dexMod = getAbilityModifier(finalStats, 'DEX');
    const chaMod = getAbilityModifier(finalStats, 'CHA');
    const isMonk = character.class === 'Monk';
    
    let damageDie = weapon.damage;
    if (isMonk) {
        let martialArtsDie = '1d6';
        if (character.level >= 5) martialArtsDie = '1d8';
        if (character.level >= 11) martialArtsDie = '1d10';
        if (character.level >= 17) martialArtsDie = '1d12';
        
        const getDieSize = (s: string) => { 
            if (s === '1') return 1; 
            const parts = s.split('d'); 
            return parts.length > 1 ? parseInt(parts[1]) : 0; 
        };
        
        const isMonkWeapon = (weapon.category === 'Simple' && weapon.rangeType === 'Melee') ||
                            (weapon.category === 'Martial' && weapon.rangeType === 'Melee' && weapon.properties.includes('Light'));
        
        if (weapon.name === 'Unarmed Strike' || (isMonkWeapon && getDieSize(martialArtsDie) > getDieSize(weapon.damage))) {
            damageDie = martialArtsDie;
            breakdown.push({ label: 'Dado de Artes Marciales', value: damageDie, icon: 'self_improvement' });
        } else {
            breakdown.push({ label: 'Dado base de arma', value: damageDie, icon: 'swords' });
        }
    } else {
        breakdown.push({ label: 'Dado base de arma', value: damageDie, icon: 'swords' });
    }

    if (character.feats.some(f => f.includes('Atacante Salvaje') || f.includes('Savage Attacker'))) {
        breakdown.push({ label: 'Dote: Atacante Salvaje (Tira 2x)', value: 'Mejor', icon: 'auto_awesome' });
    }

    if (character.feats.some(f => f.includes('Lucha con Armas Pesadas') || f.includes('Great Weapon Fighting')) && weapon.properties.includes('Two-Handed')) {
        breakdown.push({ label: 'Estilo: Armas Pesadas (Repite 1-2)', value: 'Reroll 1-2', icon: 'refresh' });
    }

    let scalingStat: Ability;
    let scalingVal: number;

    if (item.customStat) {
        scalingStat = item.customStat;
        scalingVal = getAbilityModifier(finalStats, scalingStat);
        breakdown.push({ label: `Atributo (Manual: ${scalingStat})`, value: scalingVal, icon: 'star' });
    } else {
        const isFinesse = weapon.properties.includes('Finesse');
        const isRanged = weapon.rangeType === 'Ranged';
        const isMonkWeapon = isMonk && (
            (weapon.category === 'Simple' && weapon.rangeType === 'Melee') ||
            (weapon.category === 'Martial' && weapon.rangeType === 'Melee' && weapon.properties.includes('Light'))
        );

        let useDex = isRanged || (isFinesse && dexMod > strMod);
        if (isMonk && (isMonkWeapon || weapon.name === 'Unarmed Strike')) {
            if (dexMod > strMod) useDex = true;
        }
        
        scalingStat = useDex ? 'DEX' : 'STR';
        scalingVal = useDex ? dexMod : strMod;
        breakdown.push({ label: `Atributo (${scalingStat})`, value: scalingVal, icon: useDex ? 'bolt' : 'fitness_center' });
    }

    const bonusMatch = item.name.match(/\+(\d+)$/);
    if (bonusMatch) {
        const bonus = parseInt(bonusMatch[1]);
        if (bonus > 0) breakdown.push({ label: `Bono Mágico +${bonus}`, value: bonus, icon: 'magic_button' });
    }

    if (weapon.name === 'Unarmed Strike') {
        const wraps = character.inventory.find(i => i.equipped && i.name.includes('Wraps of Unarmed Power'));
        if (wraps) {
            const wrapBonusMatch = wraps.name.match(/\+(\d+)$/);
            if (wrapBonusMatch) {
                const bonus = parseInt(wrapBonusMatch[1]);
                if (bonus > 0) breakdown.push({ label: 'Wraps of Unarmed Power', value: bonus, icon: 'sports_martial_arts' });
            }
        }
    }

    const isActuallyUsingStrength = (item.customStat === 'STR') || (!item.customStat && scalingStat === 'STR');
    if (isRaging && isActuallyUsingStrength && weapon.rangeType === 'Melee') {
        const rageDamage = character.level < 9 ? 2 : character.level < 16 ? 3 : 4;
        breakdown.push({ label: 'Daño de Furia', value: rageDamage, icon: 'local_fire_department' });
    }

    if (weapon.mastery === 'Graze' && (character.weaponMasteries || []).includes(weapon.name)) {
        breakdown.push({ label: 'Maestría: Graze (Si fallas)', value: scalingVal, icon: 'error' });
    }

    const hasDueling = character.feats.some(f => f.includes('Duelo') || f.includes('Dueling'));
    const hasThrown = character.feats.some(f => f.includes('Lucha con Armas Arrojadizas') || f.includes('Thrown Weapon Fighting'));
    const isTwoHanded = weapon.properties.includes('Two-Handed');
    const equippedWeapons = character.inventory.filter(i => i.equipped && getItemData(i.name)?.type === 'Weapon');

    if (hasDueling && weapon.rangeType === 'Melee' && !isTwoHanded && equippedWeapons.length === 1) {
        // Dueling requires no weapon in off-hand (shield is okay)
        breakdown.push({ label: 'Estilo: Duelo', value: 2, icon: 'military_tech' });
    }
    if (hasThrown && weapon.properties.some(p => p.includes('Thrown'))) {
        breakdown.push({ label: 'Estilo: Armas Arrojadizas', value: 2, icon: 'military_tech' });
    }
    
    // Warlock Lifedrinker (Level 12+, Pact of the Blade implied if taking invocation)
    // Checking invocation by name string match in character.invocations
    if (character.class === 'Warlock' && character.level >= 12 && character.invocations?.some(i => i.includes('Lifedrinker'))) {
         // Lifedrinker: necrotic damage = CHA mod (min 1)
         const bonus = Math.max(1, chaMod);
         breakdown.push({ label: 'Lifedrinker (Necrotic)', value: bonus, icon: 'skull' });
    }
    
    // Hunter's Mark (Ranger / 2024 / Feats)
    if (character.preparedSpells?.some(s => s === 'Hunter\'s Mark' || s === 'Marca del Cazador')) {
         breakdown.push({ label: 'Marca del Cazador (Si activa)', value: '1d6', icon: 'gps_fixed' });
    }

    // Divine Smite (Paladin)
    if (character.class === 'Paladin' && character.preparedSpells?.some(s => s === 'Divine Smite' || s === 'Castigo Divino')) {
         breakdown.push({ label: 'Divine Smite (Opcional)', value: '2d8+', icon: 'auto_awesome' });
    }

    // Paladin Radiant Strikes (Level 11+)
    if (character.class === 'Paladin' && character.level >= 11 && weapon.rangeType === 'Melee') {
        breakdown.push({ label: 'Golpes Radiantes', value: '1d8', icon: 'auto_awesome' });
    }

    return breakdown;
};

export const getACBreakdown = (character: Character, finalStats: Record<string, number>): StatBreakdownItem[] => {
    const dexMod = getAbilityModifier(finalStats, 'DEX');
    const conMod = getAbilityModifier(finalStats, 'CON');
    const wisMod = getAbilityModifier(finalStats, 'WIS');
    const chaMod = getAbilityModifier(finalStats, 'CHA');
    
    const breakdown: StatBreakdownItem[] = [];
    let hasArmor = false;
    let hasShield = false;

    const equippedArmor = (character.inventory || []).find(i => {
        if (!i.equipped) return false;
        const data = getItemData(i.name);
        return data?.type === 'Armor' && (data as ArmorData).armorType !== 'Shield';
    });

    if (equippedArmor) {
        const armorData = getItemData(equippedArmor.name) as ArmorData;
        hasArmor = true;
        breakdown.push({ label: `Armadura: ${equippedArmor.name}`, value: armorData.baseAC, icon: 'shield' });
        
        let dexBonus = dexMod;
        let maxDex = armorData.maxDex;

        // Medium Armor Master: Max Dex becomes 3 for Medium Armor (usually 2)
        if (armorData.armorType === 'Medium' && character.feats.some(f => 
            f === 'Maestro de Armadura Media' || 
            f === 'Medium Armor Master' ||
            f.toLowerCase().includes('maestro de armadura media') ||
            f.toLowerCase().includes('medium armor master'))) {
            if (maxDex === 2) maxDex = 3;
        }

        if (maxDex !== undefined) dexBonus = Math.min(dexBonus, maxDex);
        
        if (dexBonus !== 0) {
            breakdown.push({ label: `Destreza (limitada por armadura)`, value: dexBonus, icon: 'bolt' });
        }

        const armorBonusMatch = equippedArmor.name.match(/\+(\d+)$/);
        if (armorBonusMatch) {
            const bonus = parseInt(armorBonusMatch[1]);
            if (bonus > 0) breakdown.push({ label: `Bono Mágico +${bonus}`, value: bonus, icon: 'magic_button' });
        }
        
        // Forge Cleric: Soul of the Forge (Level 6) - Heavy Armor
        if (character.class === 'Cleric' && character.subclass === 'Forge Domain' && character.level >= 6 && armorData.armorType === 'Heavy') {
             breakdown.push({ label: 'Alma de la Forja', value: 1, icon: 'handyman' });
        }
    } else {
        breakdown.push({ label: 'Base sin armadura', value: 10, icon: 'person' });
        breakdown.push({ label: 'Destreza', value: dexMod, icon: 'bolt' });

        if (character.class === 'Barbarian') {
            breakdown.push({ label: 'Defensa sin Armadura (CON)', value: conMod, icon: 'fitness_center' });
        } else if (character.class === 'Monk') {
            breakdown.push({ label: 'Defensa sin Armadura (WIS)', value: wisMod, icon: 'self_improvement' });
        } else if (character.class === 'Sorcerer' && character.subclass === 'Draconic Sorcery') {
            breakdown.push({ label: 'Resiliencia Dracónica (CHA)', value: chaMod, icon: 'auto_awesome' });
        }
    }

    const equippedShield = (character.inventory || []).find(i => {
        if (!i.equipped) return false;
        const data = getItemData(i.name);
        return data?.type === 'Armor' && (data as ArmorData).armorType === 'Shield';
    });

    if (equippedShield) {
        const shieldData = getItemData(equippedShield.name) as ArmorData;
        hasShield = true;
        breakdown.push({ label: `Escudo: ${equippedShield.name}`, value: shieldData.baseAC, icon: 'shield' });

        const shieldBonusMatch = equippedShield.name.match(/\+(\d+)$/);
        if (shieldBonusMatch) {
            const bonus = parseInt(shieldBonusMatch[1]);
            if (bonus > 0) breakdown.push({ label: `Bono Mágico de Escudo +${bonus}`, value: bonus, icon: 'magic_button' });
        }
    }
    
    // Warforged Integrated Protection
    if (character.species === 'Warforged') {
        breakdown.push({ label: 'Protección Integrada', value: 1, icon: 'smart_toy' });
    }
    
    // Kensei Monk: Agile Parry (Note: Requires unarmed strike attack, assuming active for breakdown display if conditions met)
    if (character.class === 'Monk' && character.subclass === 'Way of the Kensei' && !hasArmor && !hasShield) {
         // Check if holding a kensei weapon? 
         // For now, just adding as a potential conditional or static if we assume optimal play
         // Let's add it only if a weapon is equipped
         const hasWeapon = character.inventory.some(i => i.equipped && getItemData(i.name)?.type === 'Weapon');
         if (hasWeapon) {
             breakdown.push({ label: 'Parada Ágil (Si atacas sin armas)', value: 2, icon: 'swords' });
         }
    }

    const inventory = character.inventory || [];
    inventory.forEach(item => {
        if (!item.equipped) return;
        if (item.name === 'Ring of Protection') breakdown.push({ label: 'Anillo de Protección', value: 1, icon: 'auto_awesome' });
        if (item.name === 'Cloak of Protection') breakdown.push({ label: 'Capa de Protección', value: 1, icon: 'apparel' });
        if (item.name === 'Stone of Good Luck') breakdown.push({ label: 'Piedra Ioun (Protección)', value: 1, icon: 'diamond' });
        if (item.name === 'Bracers of Defense' && !hasArmor && !hasShield) breakdown.push({ label: 'Bracers of Defense', value: 2, icon: 'security' });
    });

    if (character.feats.some(f => f.includes('Defensa') || f.includes('Defense')) && hasArmor) {
        breakdown.push({ label: 'Estilo: Defensa', value: 1, icon: 'shield_person' });
    }
    if (character.feats.some(f => f === 'Doble Empuñadura' || f === 'Dual Wielder')) {
        const equippedWeapons = inventory.filter(i => i.equipped && getItemData(i.name)?.type === 'Weapon');
        if (equippedWeapons.length >= 2) breakdown.push({ label: 'Dote: Doble Empuñadura', value: 1, icon: 'swords' });
    }

    return breakdown;
};

export const getInitBreakdown = (character: Character, finalStats: Record<string, number>): StatBreakdownItem[] => {
    const dexMod = getAbilityModifier(finalStats, 'DEX');
    const breakdown: StatBreakdownItem[] = [];
    breakdown.push({ label: 'Destreza', value: dexMod, icon: 'bolt' });
    
    const feats = character.feats || [];
    if (feats.some(f => f.includes('Alerta') || f.includes('Alert'))) {
        breakdown.push({ label: 'Dote: Alerta', value: character.profBonus, icon: 'notifications_active' });
    }
    if (character.subclass === 'Gloom Stalker' && character.level >= 3) {
        const wisMod = getAbilityModifier(finalStats, 'WIS');
        breakdown.push({ label: 'Dread Ambusher (WIS)', value: wisMod, icon: 'visibility_off' });
    }
    if (character.subclass === 'Swashbuckler' && character.level >= 3) {
        const chaMod = getAbilityModifier(finalStats, 'CHA');
        breakdown.push({ label: 'Rakish Audacity (CHA)', value: chaMod, icon: 'sentiment_very_satisfied' });
    }
    if (character.subclass === 'War Magic' && character.level >= 2) {
        const intMod = getAbilityModifier(finalStats, 'INT');
        breakdown.push({ label: 'Tactical Wit (INT)', value: intMod, icon: 'psychology' });
    }
    
    // 2024 / Tasha's Updates
    if (character.class === 'Paladin' && character.subclass === 'Oath of the Watchers' && character.level >= 7) {
        breakdown.push({ label: 'Aura del Centinela (Prof)', value: character.profBonus, icon: 'security' });
    }

    if ((character.inventory || []).some(i => i.equipped && i.name === 'Stone of Good Luck')) {
        breakdown.push({ label: 'Piedra Ioun', value: 1, icon: 'diamond' });
    }
    return breakdown;
};

export const getTotalInitiative = (character: Character, finalStats: Record<string, number>): number => {
    const breakdown = getInitBreakdown(character, finalStats);
    return breakdown.reduce((acc, item) => acc + (typeof item.value === 'number' ? item.value : 0), 0);
};

export const getSpeedBreakdown = (character: Character, finalStats: Record<string, number>): StatBreakdownItem[] => {
    const breakdown: StatBreakdownItem[] = [];
    const speciesData = SPECIES_DETAILS[character.species];
    let baseSpeed = speciesData?.speed || 30;
    
    // Subspecies Speed overrides (case-insensitive and support for translations)
    const sub = (character.subspecies || '').toLowerCase();
    if (sub.includes('wood') || sub.includes('bosque')) baseSpeed = 35;
    
    breakdown.push({ label: 'Base', value: baseSpeed, icon: 'directions_walk' });
    
    if (character.class === 'Monk') {
        const hasArmor = character.inventory.some(i => i.equipped && getItemData(i.name)?.type === 'Armor' && (getItemData(i.name) as ArmorData).armorType !== 'Shield');
        const hasShield = character.inventory.some(i => i.equipped && getItemData(i.name)?.type === 'Armor' && (getItemData(i.name) as ArmorData).armorType === 'Shield');
        if (!hasArmor && !hasShield) {
            let monkBonus = 0;
            // 2024 Monk Progression
            if (character.level >= 18) monkBonus = 30;
            else if (character.level >= 14) monkBonus = 25;
            else if (character.level >= 10) monkBonus = 20;
            else if (character.level >= 6) monkBonus = 15;
            else if (character.level >= 2) monkBonus = 10;
            if (monkBonus > 0) breakdown.push({ label: 'Movimiento sin Armadura', value: monkBonus, icon: 'self_improvement' });
        }
    }
    
    if (character.class === 'Barbarian' && character.level >= 5) {
        const hasHeavyArmor = character.inventory.some(i => i.equipped && getItemData(i.name)?.type === 'Armor' && (getItemData(i.name) as ArmorData).armorType === 'Heavy');
        if (!hasHeavyArmor) breakdown.push({ label: 'Movimiento Rápido', value: 10, icon: 'sprint' });
    }
    
    if (character.class === 'Rogue' && character.subclass === 'Scout' && character.level >= 9) {
        breakdown.push({ label: 'Movilidad Superior', value: 10, icon: 'directions_run' });
    }
    
    if (character.class === 'Ranger' && (character.subclass === 'Gloom Stalker' || (character.subclass || '').includes('acechador')) && character.level >= 3) {
        breakdown.push({ label: 'Dread Ambusher (1er turno)', value: 10, icon: 'visibility_off' });
    }

    if (character.feats.some(f => f === 'Veloz' || f === 'Mobile' || f === 'Speedy')) {
        breakdown.push({ label: 'Dote: Veloz', value: 10, icon: 'speed' });
    }
    
    if (character.feats.some(f => f.includes('Boon of Speed') || f.includes('Bono de Velocidad'))) {
        breakdown.push({ label: 'Bono Épico: Velocidad (+30 pies)', value: 30, icon: 'bolt' });
    }
    
    if ((character.inventory || []).some(i => i.equipped && i.name.toLowerCase().includes('boots of speed'))) {
        breakdown.push({ label: 'Boots of Speed (Active)', value: 'x2', icon: 'directions_run' });
    }
    return breakdown;
};

export const getTotalSpeed = (character: Character, finalStats: Record<string, number>): number => {
    const items = getSpeedBreakdown(character, finalStats);
    let total = 0;
    let multiplier = 1;
    
    items.forEach(item => {
        if (typeof item.value === 'number') total += item.value;
        else if (typeof item.value === 'string' && item.value.startsWith('x')) {
            const m = parseFloat(item.value.substring(1));
            if (!isNaN(m)) multiplier *= m;
        }
    });
    
    return total * multiplier;
};

export const getHPBreakdown = (character: Character, finalStats: Record<string, number>): StatBreakdownItem[] => {
    const conMod = getAbilityModifier(finalStats, 'CON');
    const hitDie = HIT_DIE[character.class] || 8;
    const breakdown: StatBreakdownItem[] = [];

    // 1. Nivel 1
    breakdown.push({ label: `Base Nivel 1 (d${hitDie})`, value: hitDie, icon: 'looks_one' });
    
    // 2. Bonificadores explícitos
    let bonusesTotal = 0;

    // Constitución
    const conTotal = conMod * character.level;
    if (conTotal !== 0) {
        breakdown.push({ label: `Constitución (${formatModifier(conMod)} x ${character.level})`, value: conTotal, icon: 'fitness_center' });
        bonusesTotal += conTotal;
    }

    // Raza y Subclase
    if (character.species === 'Dwarf') {
        breakdown.push({ label: 'Resistencia Enana', value: character.level, icon: 'face' });
        bonusesTotal += character.level;
    }
    if (character.class === 'Sorcerer' && character.subclass === 'Draconic Sorcery') {
        breakdown.push({ label: 'Resiliencia Dracónica', value: character.level, icon: 'auto_awesome' });
        bonusesTotal += character.level;
    }

    // Dotes y Boons
    if (character.feats.some(f => f === 'Resistente' || f === 'Tough')) {
        breakdown.push({ label: 'Dote: Resistente (+2 por nivel)', value: character.level * 2, icon: 'military_tech' });
        bonusesTotal += (character.level * 2);
    }
    
    if (character.feats.some(f => f.includes('Fortitude') || f.includes('Fortaleza'))) {
        breakdown.push({ label: 'Bono Épico: Fortaleza (+40 HP)', value: 40, icon: 'shield' });
        bonusesTotal += 40;
    }

    // 3. El resto son los dados de golpe tirados/media para niveles 2+
    const remaining = character.hp.max - hitDie - bonusesTotal;
    if (character.level > 1 && remaining > 0) {
        breakdown.push({ label: `Dados de Golpe (Lvl 2-${character.level})`, value: remaining, icon: 'casino' });
    }

    return breakdown;
};

export const getFinalStats = (character: Character): Record<string, number> => {
    const stats: Record<string, number> = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10, ...character.stats };
    const inventory = character.inventory || [];
    
    // --- FEAT BONUSES ---
    // Helper to detect stat choice in feat name like "Resiliente (CON)" or "Actor (+1 CHA)"
    // Matches: (STR), (Fuerza), (+1 STR), etc.
    const detectStatChoice = (featName: string): string | null => {
        const upper = featName.toUpperCase();
        if (upper.match(/\b(STR|FUERZA|FUE)\b/)) return 'STR';
        if (upper.match(/\b(DEX|DESTREZA|DES)\b/)) return 'DEX';
        if (upper.match(/\b(CON|CONSTITUCI[ÓO]N)\b/)) return 'CON';
        if (upper.match(/\b(INT|INTELIGENCIA)\b/)) return 'INT';
        if (upper.match(/\b(WIS|SABIDUR[ÍI]A|SAB)\b/)) return 'WIS';
        if (upper.match(/\b(CHA|CARISMA|CAR)\b/)) return 'CHA';
        return null;
    };

    // 1. FIXED STAT FEATS (2024 General Feats with fixed ASI)
    if (character.feats.some(f => f.includes('Actor'))) stats.CHA = Math.min(20, stats.CHA + 1);
    if (character.feats.some(f => f.includes('Experto en Ballesta') || f.includes('Crossbow Expert'))) stats.DEX = Math.min(20, stats.DEX + 1);
    if (character.feats.some(f => f.includes('Duelista Defensivo') || f.includes('Defensive Duelist'))) stats.DEX = Math.min(20, stats.DEX + 1);
    if (character.feats.some(f => f.includes('Durable'))) stats.CON = Math.min(20, stats.CON + 1); // "Durable" is General (+1 CON). "Tough" = "Resistente" is Origin (No ASI, gives HP instead).
    
    if (character.feats.some(f => f.includes('Maestro de Armas Pesadas') || f.includes('Great Weapon Master'))) stats.STR = Math.min(20, stats.STR + 1);
    if (character.feats.some(f => f.includes('Pesadamente Armado') || f.includes('Heavily Armored'))) stats.STR = Math.min(20, stats.STR + 1);
    if (character.feats.some(f => f.includes('Maestro de Armadura Pesada') || f.includes('Heavy Armor Master'))) stats.STR = Math.min(20, stats.STR + 1);
    if (character.feats.some(f => f.includes('Mente Aguda') || f.includes('Keen Mind'))) stats.INT = Math.min(20, stats.INT + 1);
    if (character.feats.some(f => f.includes('Tirador de Elite') || f.includes('Sharpshooter'))) stats.DEX = Math.min(20, stats.DEX + 1);
    if (character.feats.some(f => f.includes('Maestro del Escudo') || f.includes('Shield Master'))) stats.STR = Math.min(20, stats.STR + 1);
    if (character.feats.some(f => f.includes('Veloz') || f.includes('Speedy'))) stats.DEX = Math.min(20, stats.DEX + 1);

    // 2. VARIABLE STAT FEATS & EPIC BOONS
    // We rely on the user having indicated the choice in the name, e.g. "Atleta (Fuerza)"
    // Or we try to apply if it's an Epic Boon (Max 30)
    character.feats.forEach(feat => {
        const isEpic = feat.includes('Don de') || feat.includes('Boon of');
        const cap = isEpic ? 30 : 20;
        
        // Skip if it's one of the fixed ones handled above to avoid double counting
        // (Simple check: if we already handled "Actor" and this is "Actor", skip. 
        // But "Actor (CHA)" would trigger parsing. We should be careful.)
        // Ideally, we should remove the fixed ones from this check or make the fixed check more specific.
        // For now, let's assume Fixed ones don't need parsing.
        
        const fixedFeats = ['Actor', 'Experto en Ballesta', 'Crossbow Expert', 'Duelista Defensivo', 'Defensive Duelist', 'Resistente', 'Durable', 'Maestro de Armas Pesadas', 'Great Weapon Master', 'Pesadamente Armado', 'Heavily Armored', 'Maestro de Armadura Pesada', 'Heavy Armor Master', 'Mente Aguda', 'Keen Mind', 'Tirador de Elite', 'Sharpshooter', 'Maestro del Escudo', 'Shield Master', 'Veloz', 'Speedy'];
        if (fixedFeats.some(f => feat.includes(f))) return;

        // Parse stat
        const stat = detectStatChoice(feat);
        if (stat) {
            stats[stat] = Math.min(cap, stats[stat] + 1);
        }
    });

    // Inventory Bonuses
    inventory.forEach(item => {
        if (!item.equipped) return;
        const itemName = item.name.toLowerCase();
        
        // Set Items
        if (itemName.includes('amulet of health')) stats.CON = Math.max(stats.CON, 19);
        if (itemName.includes('headband of intellect')) stats.INT = Math.max(stats.INT, 19);
        if (itemName.includes('gauntlets of ogre power')) stats.STR = Math.max(stats.STR, 19);
        if (itemName.includes('belt of giant strength')) {
            if (itemName.includes('hill')) stats.STR = Math.max(stats.STR, 21);
            else if (itemName.includes('frost') || itemName.includes('stone')) stats.STR = Math.max(stats.STR, 23);
            else if (itemName.includes('fire')) stats.STR = Math.max(stats.STR, 25);
            else if (itemName.includes('cloud')) stats.STR = Math.max(stats.STR, 27);
            else if (itemName.includes('storm')) stats.STR = Math.max(stats.STR, 29);
        }
        
        // Ioun Stones
        if (itemName.includes('ioun stone (agility)')) stats.DEX = Math.min(20, stats.DEX + 2);
        if (itemName.includes('ioun stone (fortitude)')) stats.CON = Math.min(20, stats.CON + 2);
        if (itemName.includes('ioun stone (insight)')) stats.WIS = Math.min(20, stats.WIS + 2);
        if (itemName.includes('ioun stone (intellect)')) stats.INT = Math.min(20, stats.INT + 2);
        if (itemName.includes('ioun stone (leadership)')) stats.CHA = Math.min(20, stats.CHA + 2);
        if (itemName.includes('ioun stone (strength)')) stats.STR = Math.min(20, stats.STR + 2);
        
        // Tomes & Manuals
        if (itemName.includes('manual of gainful exercise')) stats.STR = Math.min(30, stats.STR + 2);
        if (itemName.includes('manual of quickness of action')) stats.DEX = Math.min(30, stats.DEX + 2);
        if (itemName.includes('manual of bodily health')) stats.CON = Math.min(30, stats.CON + 2);
        if (itemName.includes('tome of clear thought')) stats.INT = Math.min(30, stats.INT + 2);
        if (itemName.includes('tome of understanding')) stats.WIS = Math.min(30, stats.WIS + 2);
        if (itemName.includes('tome of leadership and influence')) stats.CHA = Math.min(30, stats.CHA + 2);
    });

    // Class Capstones
    if (character.level >= 20) {
        if (character.class === 'Barbarian') { 
            stats.STR = Math.min(24, stats.STR + 4); 
            stats.CON = Math.min(24, stats.CON + 4); 
        }
        if (character.class === 'Monk') {
            // Body and Mind (2024)
            stats.DEX = Math.min(26, stats.DEX + 4);
            stats.WIS = Math.min(26, stats.WIS + 4);
        }
    }
    
    return stats;
};

export const getArmorClass = (character: Character, finalStats: Record<string, number>): number => {
    const items = getACBreakdown(character, finalStats);
    return items.reduce((acc, curr) => acc + (typeof curr.value === 'number' ? curr.value : 0), 0);
};

export const isProficientInSave = (character: Character, stat: Ability): boolean => {
    const profSaves = CLASS_SAVING_THROWS[character.class] || [];
    if (profSaves.includes(stat)) return true;
    
    // Check for Resilient (Resiliente) feat
    if (character.feats.some(f => f.includes('Resiliente') && f.includes(stat))) return true;
    
    // Check for Monk level 14 (Diamond Soul / Disciplined Survivor)
    if (character.class === 'Monk' && character.level >= 14) return true;

    // Check for Rogue level 15 (Slippery Mind) 2024: Wisdom & Charisma
    if (character.class === 'Rogue' && character.level >= 15 && (stat === 'WIS' || stat === 'CHA')) return true;
    
    return false;
};

export const getSaveBreakdown = (character: Character, stat: Ability, finalStats: Record<string, number>): StatBreakdownItem[] => {
    const breakdown: StatBreakdownItem[] = [];
    const mod = getAbilityModifier(finalStats, stat);
    
    breakdown.push({ label: `Atributo (${stat})`, value: mod, icon: 'fitness_center' });
    
    if (isProficientInSave(character, stat)) {
        breakdown.push({ label: 'Bono de Competencia', value: character.profBonus, icon: 'school' });
    }

    if (character.class === 'Paladin' && character.level >= 6) {
        const chaMod = getAbilityModifier(finalStats, 'CHA');
        breakdown.push({ label: 'Aura de Protección (CHA)', value: Math.max(1, chaMod), icon: 'shield_person' });
    }

    const inventory = character.inventory || [];
    if (inventory.some(i => i.equipped && i.name.toLowerCase().includes('ring of protection'))) {
        breakdown.push({ label: 'Anillo de Protección', value: 1, icon: 'auto_awesome' });
    }
    if (inventory.some(i => i.equipped && i.name.toLowerCase().includes('cloak of protection'))) {
        breakdown.push({ label: 'Capa de Protección', value: 1, icon: 'apparel' });
    }
    if (inventory.some(i => i.equipped && i.name.toLowerCase().includes('stone of good luck'))) {
        breakdown.push({ label: 'Piedra de la Buena Suerte', value: 1, icon: 'diamond' });
    }
    if (inventory.some(i => i.equipped && i.name.toLowerCase().includes('luck blade'))) {
        breakdown.push({ label: 'Luck Blade', value: 1, icon: 'swords' });
    }
    if (inventory.some(i => i.equipped && i.name.toLowerCase().includes('robe of stars'))) {
        breakdown.push({ label: 'Robe of Stars', value: 1, icon: 'stars' });
    }
    if (inventory.some(i => i.equipped && i.name.toLowerCase().includes('staff of power'))) {
        breakdown.push({ label: 'Staff of Power', value: 2, icon: 'magic_button' });
    }

    return breakdown;
};

export const getSavingThrowBonus = (character: Character, finalStats?: Record<string, number>): number => {
    let bonus = 0;
    const inventory = character.inventory || [];
    
    // Check for specific items individually to allow stacking of different items
    // (e.g. Ring + Cloak = +2)
    
    if (inventory.some(i => i.equipped && i.name.toLowerCase().includes('ring of protection'))) bonus += 1;
    if (inventory.some(i => i.equipped && i.name.toLowerCase().includes('cloak of protection'))) bonus += 1;
    if (inventory.some(i => i.equipped && i.name.toLowerCase().includes('stone of good luck'))) bonus += 1;
    if (inventory.some(i => i.equipped && i.name.toLowerCase().includes('luck blade'))) bonus += 1;
    if (inventory.some(i => i.equipped && i.name.toLowerCase().includes('robe of stars'))) bonus += 1;
    if (inventory.some(i => i.equipped && i.name.toLowerCase().includes('staff of power'))) bonus += 2;

    if (character.class === 'Paladin' && character.level >= 6) {
        const stats = finalStats || getFinalStats(character);
        const chaMod = getAbilityModifier(stats, 'CHA');
        bonus += Math.max(1, chaMod);
    }
    return bonus;
};

export const getEffectiveCasterType = (character: Character) => {
    if (character.class === 'Warlock') return 'pact';
    if (['Cleric', 'Druid', 'Bard', 'Sorcerer', 'Wizard'].includes(character.class)) return 'full';
    if (['Paladin', 'Ranger'].includes(character.class)) return 'half';
    if (['Eldritch Knight', 'Arcane Trickster'].includes(character.subclass || '')) return 'third';
    return 'none';
};


export const getSkillBonus = (character: Character, skillName: string, finalStats: Record<string, number>): number => {
    const ability = SKILL_ABILITY_MAP[skillName];
    if (!ability) return 0;
    const mod = getAbilityModifier(finalStats, ability);
    const hasBoonOfSkill = (character.feats || []).some(f => f.includes('Boon of Skill') || f.includes('Don de Habilidad'));
    const isProf = (character.skills || []).includes(skillName) || hasBoonOfSkill;
    const isExpert = (character.expertise || []).includes(skillName);
    const bonus = isExpert ? (character.profBonus * 2) : (isProf ? character.profBonus : 0);
    return mod + bonus;
};

export const getSpellSummary = (description: string, school: string) => {
    const theme = SCHOOL_THEMES[school] || { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: 'auto_awesome' };
    let label = 'Effect';
    let icon = theme.icon;
    const lower = description.toLowerCase();
    const isDamage = lower.includes('damage') || lower.includes('daño') || lower.includes('impacta');
    const isHeal = lower.includes('heal') || lower.includes('restore') || lower.includes('curar') || lower.includes('recupera') || lower.includes('puntos de golpe');
    const isControl = lower.includes('charm') || lower.includes('frighten') || lower.includes('encantado') || lower.includes('asustado') || lower.includes('resistencia');
    const isSummon = lower.includes('summon') || lower.includes('conjure') || lower.includes('invocar') || lower.includes('aparece');
    const isTransport = lower.includes('teleport') || lower.includes('teletransporta') || lower.includes('mueve');
    
    if (isDamage) { 
        label = 'Damage'; 
        icon = 'local_fire_department'; 
        if (isHeal) { label = 'Mix'; icon = 'healing'; } 
    }
    else if (isHeal) { label = 'Heal'; icon = 'favorite'; }
    else if (isControl) { label = 'Control'; icon = 'psychology'; }
    else if (isSummon) { label = 'Summon'; icon = 'person_add'; }
    else if (isTransport) { label = 'Transport'; icon = 'move_up'; }
    return { classes: `${theme.text} ${theme.bg} ${theme.border}`, icon: icon, label: label };
};
export const getSpellSlotSummary = (character: Character) => {
    const type = character.class === 'Warlock' ? 'pact' : character.class === 'Paladin' || character.class === 'Ranger' ? 'half' : ['Eldritch Knight', 'Arcane Trickster'].includes(character.subclass || '') ? 'third' : ['Cleric', 'Druid', 'Bard', 'Sorcerer', 'Wizard'].includes(character.class) ? 'full' : 'none';
    const slots: Record<number, { current: number, max: number }> = {};
    
    if (type === 'none') return slots;
    const usedSlots = character.usedSlots || {};
    
    for (let lvl = 1; lvl <= 9; lvl++) {
        const max = getSlots(type, character.level, lvl);
        if (max > 0) {
            let used = 0;
            for (let i = 0; i < max; i++) if (usedSlots[`${lvl}-${i}`]) used++;
            slots[lvl] = { current: max - used, max };
        }
    }
    return slots;
};

const FULL_CASTER_SLOTS = [[], [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1]];
const getSlots = (type: string, lvl: number, spellLvl: number): number => {
    if (spellLvl === 0) return 0;
    if (type === 'pact') {
        const count = lvl >= 17 ? 4 : lvl >= 11 ? 3 : lvl >= 2 ? 2 : 1;
        const slotLvl = lvl >= 9 ? 5 : lvl >= 7 ? 4 : lvl >= 5 ? 3 : lvl >= 3 ? 2 : 1;
        if (spellLvl === slotLvl) return count;
        if (spellLvl > 5 && lvl >= (11 + (spellLvl-6)*2)) return 1;
        return 0;
    }
    let eff = lvl;
    if (type === 'half') eff = Math.ceil(lvl / 2);
    else if (type === 'third') eff = Math.ceil(lvl / 3);
    const tbl = FULL_CASTER_SLOTS[Math.min(20, Math.max(1, eff))];
    return tbl[spellLvl - 1] || 0;
};
