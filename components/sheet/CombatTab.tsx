
import { createPortal } from 'react-dom';
import React, { useState, useMemo, useEffect } from 'react';
import { Character, Ability, WeaponData, ArmorData, InventoryItem } from '../../types';
import { SKILL_ABILITY_MAP, SKILL_DESCRIPTIONS } from '../../Data/skills';
import { useSkills } from '../../Data/skills/index';
import { MASTERY_DESCRIPTIONS } from '../../Data/items';
import { CLASS_SAVING_THROWS, HIT_DIE } from '../../Data/characterOptions';
import { SPELL_DETAILS } from '../../Data/spells';
import { 
    getFinalStats, 
    getArmorClass, 
    formatModifier, 
    getItemData, 
    getSavingThrowBonus,
    getACBreakdown,
    getInitBreakdown,
    getTotalInitiative,
    getSpeedBreakdown,
    getWeaponToHitBreakdown,
    getWeaponDamageBreakdown,
    getHPBreakdown,
    getSkillBonus,
    getSaveBreakdown,
    getTotalSpeed,
    getSpellSlotSummary,
    isProficientInSave,
    getAbilityModifier
} from '../../utils/sheetUtils';

interface CombatTabProps {
    character: Character;
    onUpdate: (char: Character) => void;
    isReadOnly?: boolean;
}

const CombatTab: React.FC<CombatTabProps> = ({ character, onUpdate, isReadOnly }) => {
    const skills = useSkills();
    const SKILL_LIST = skills.map(s => s.name);
    // const [isRaging, setIsRaging] = useState(false); // REMOVED local state
    const isRaging = character.isRaging || false;
    const setIsRaging = (val: boolean) => !isReadOnly && onUpdate({ ...character, isRaging: val });
    const [hpModal, setHpModal] = useState<{ show: boolean; type: 'damage' | 'heal' }>({ show: false, type: 'damage' });
    const [hpAmount, setHpAmount] = useState('');
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [inspectedStat, setInspectedStat] = useState<'AC' | 'Init' | 'Spd' | 'Prof' | 'Insp' | 'HP' | 'Save_STR' | 'Save_DEX' | 'Save_CON' | 'Save_INT' | 'Save_WIS' | 'Save_CHA' | null>(null);
    const [weaponStatModal, setWeaponStatModal] = useState<{ item: any; weapon: any; type: 'toHit' | 'damage'; isSpell?: boolean } | null>(null);
    const [skillDescriptions, setSkillDescriptions] = useState<Record<string, string>>({});

    useEffect(() => {
        // Translation removed - all content in English
    }, [selectedSkill]);

    const finalStats = useMemo(() => getFinalStats(character), [character]);
    const armorClass = useMemo(() => getArmorClass(character, finalStats), [character, finalStats]);
    const initiativeTotal = useMemo(() => getTotalInitiative(character, finalStats), [character, finalStats]);
    const speedTotal = useMemo(() => getTotalSpeed(character, finalStats), [character, finalStats]);
    
    const chaMod = Math.floor(((finalStats.CHA || 10) - 10) / 2);
    const wisMod = Math.floor(((finalStats.WIS || 10) - 10) / 2);
    const spellSlotSummary = useMemo(() => getSpellSlotSummary(character), [character]);
    
    // Fix: Ensure spellcastingAbility is not undefined before using as index
    const spellAbility = character.spellcastingAbility || 'INT';
    const spellMod = Math.floor(((finalStats[spellAbility] || 10) - 10) / 2);
    const spellSaveDC = 8 + character.profBonus + spellMod;
    const spellAttackBonus = character.profBonus + spellMod;

    const spellcastingStats = {
        saveDC: spellSaveDC,
        attackBonus: spellAttackBonus,
        ability: spellAbility,
        mod: spellMod,
        toHit: character.profBonus + spellMod,
        dc: 8 + character.profBonus + spellMod
    };

    const isBarbarian = character.class === 'Barbarian';
    const isMonk = character.class === 'Monk';
    const isBard = character.class === 'Bard';
    const isRogue = character.class === 'Rogue';
    const isCleric = character.class === 'Cleric';
    const isPaladin = character.class === 'Paladin';
    const isDruid = character.class === 'Druid';
    const isFighter = character.class === 'Fighter';
    const isWarriorOfMercy = isMonk && character.subclass === 'Warrior of Mercy';
    const isMysticArtsMonk = isMonk && character.subclass === 'Warrior of the Mystic Arts';
    const isMagicStealer = isRogue && character.subclass === 'Magic Stealer';
    const isSpellguard = isPaladin && character.subclass === 'Oath of the Spellguard';
    const isVestigeWarlock = character.class === 'Warlock' && character.subclass === 'Vestige Patron';

    const hpPercent = (character.hp.current / character.hp.max) * 100;
    const hpColorClass = hpPercent > 75 ? 'text-emerald-500' : hpPercent > 35 ? 'text-amber-500' : 'text-red-500';

    // Focus System (Monk)
    const maxFocus = character.level;
    const currentFocus = character.focus?.current ?? maxFocus;
    const focusPercent = (currentFocus / maxFocus) * 100;
    const focusColorClass = focusPercent > 60 ? 'text-cyan-400' : focusPercent > 25 ? 'text-cyan-500' : 'text-cyan-700';

    const martialArtsDie = useMemo(() => {
        if (character.level >= 17) return 'd12';
        if (character.level >= 11) return 'd10';
        if (character.level >= 5) return 'd8';
        return 'd6';
    }, [character.level]);

    const useFocusPoint = (count: number = 1) => {
        if (!isReadOnly && currentFocus >= count) {
            onUpdate({ ...character, focus: { current: currentFocus - count, max: maxFocus } });
        }
    };

    // Hit Dice System (All Classes)
    const maxHitDice = character.level;
    const currentHitDice = character.hitDice?.current ?? maxHitDice;
    const dieType = HIT_DIE[character.class] || 8;

    const useHitDie = () => {
        if (!isReadOnly && currentHitDice > 0) {
            onUpdate({ ...character, hitDice: { current: currentHitDice - 1, max: maxHitDice } });
        }
    };

    const resetHitDice = () => {
        if (!isReadOnly) onUpdate({ ...character, hitDice: { current: maxHitDice, max: maxHitDice } });
    };

    const resetFocus = () => {
        if (!isReadOnly) onUpdate({ ...character, focus: { current: maxFocus, max: maxFocus } });
    };

    // ── Barbarian Rage ──────────────────────────────────────────────────
    const rageMax = useMemo(() => {
        const lvl = character.level;
        if (lvl >= 20) return 99; // Unlimited
        if (lvl >= 17) return 6;
        if (lvl >= 12) return 5;
        if (lvl >= 6) return 4;
        if (lvl >= 3) return 3;
        return 2;
    }, [character.level]);
    const rageUnlimited = character.level >= 20;
    const rageCurrent = character.rageUses?.current ?? rageMax;
    const useRage = () => {
        if (!isReadOnly && (rageUnlimited || rageCurrent > 0))
            onUpdate({ ...character, rageUses: { current: rageUnlimited ? 99 : Math.max(0, rageCurrent - 1), max: rageMax } });
    };
    const resetRage = () => {
        if (!isReadOnly) onUpdate({ ...character, rageUses: { current: rageMax, max: rageMax } });
    };

    // ── Bard Bardic Inspiration ─────────────────────────────────────────
    const bardicInspirationDie = useMemo(() => {
        if (character.level >= 15) return 'd12';
        if (character.level >= 10) return 'd10';
        if (character.level >= 5) return 'd8';
        return 'd6';
    }, [character.level]);
    const bardicMax = Math.max(1, chaMod);
    const bardicCurrent = character.bardicInspiration?.current ?? bardicMax;
    const useBardicInspiration = () => {
        if (bardicCurrent > 0) onUpdate({ ...character, bardicInspiration: { current: bardicCurrent - 1, max: bardicMax } });
    };
    const resetBardicInspiration = () => onUpdate({ ...character, bardicInspiration: { current: bardicMax, max: bardicMax } });

    // ── Channel Divinity (Cleric / Paladin) ─────────────────────────────
    const channelDivinityMax = useMemo(() => {
        const lvl = character.level;
        if (isCleric) { return lvl >= 18 ? 3 : lvl >= 6 ? 2 : 1; }
        if (isPaladin) { return lvl >= 11 ? 3 : lvl >= 7 ? 2 : 1; }
        return 0;
    }, [character.level, isCleric, isPaladin]);
    const channelDivinityCurrent = character.channelDivinity?.current ?? channelDivinityMax;
    const useChannelDivinity = () => {
        if (channelDivinityCurrent > 0) onUpdate({ ...character, channelDivinity: { current: channelDivinityCurrent - 1, max: channelDivinityMax } });
    };
    const resetChannelDivinity = () => onUpdate({ ...character, channelDivinity: { current: channelDivinityMax, max: channelDivinityMax } });

    // ── Wild Shape (Druid) ───────────────────────────────────────────────
    const wildShapeCurrent = character.wildShape?.current ?? 2;
    const useWildShape = () => {
        if (wildShapeCurrent > 0) onUpdate({ ...character, wildShape: { current: wildShapeCurrent - 1, max: 2 } });
    };
    const resetWildShape = () => onUpdate({ ...character, wildShape: { current: 2, max: 2 } });

    // ── Lay on Hands (Paladin) ──────────────────────────────────────────
    const layOnHandsMax = character.level * 5;
    const layOnHandsCurrent = character.layOnHands?.current ?? layOnHandsMax;
    const healWithLayOnHands = (amount: number) => {
        const newVal = Math.max(0, layOnHandsCurrent - amount);
        onUpdate({ ...character, layOnHands: { current: newVal, max: layOnHandsMax } });
    };
    const resetLayOnHands = () => onUpdate({ ...character, layOnHands: { current: layOnHandsMax, max: layOnHandsMax } });

    // ── Fighter: Action Surge + Second Wind ─────────────────────────────
    const actionSurgeMax = character.level >= 17 ? 2 : 1;
    const actionSurgeCurrent = character.actionSurge?.current ?? actionSurgeMax;
    const useActionSurge = () => {
        if (actionSurgeCurrent > 0) onUpdate({ ...character, actionSurge: { current: actionSurgeCurrent - 1, max: actionSurgeMax } });
    };
    const resetActionSurge = () => onUpdate({ ...character, actionSurge: { current: actionSurgeMax, max: actionSurgeMax } });
    const secondWindCurrent = character.secondWind?.current ?? 1;
    const useSecondWind = () => {
        if (secondWindCurrent > 0) onUpdate({ ...character, secondWind: { current: 0, max: 1 } });
    };
    const resetSecondWind = () => onUpdate({ ...character, secondWind: { current: 1, max: 1 } });
    const healSecondWind = () => {
        const conMod = Math.floor(((finalStats.CON || 10) - 10) / 2);
        const healAmt = Math.floor(dieType / 2) + 1 + conMod;
        if (secondWindCurrent > 0) {
            const newHp = Math.min(character.hp.max, character.hp.current + healAmt);
            onUpdate({ ...character, hp: { ...character.hp, current: newHp }, secondWind: { current: 0, max: 1 } });
        }
    };

    // ── Sneak Attack (Rogue) ─────────────────────────────────────────────
    const sneakAttackDice = useMemo(() => {
        return Math.ceil(character.level / 2); // 1d6 at Lv1, +1d6 every 2 levels
    }, [character.level]);

    // Lucky (Afortunado) controls
    const hasLuckyFeat = (character.feats || []).some(f => f === 'Afortunado' || f === 'Lucky');
    const luckyMax = character.lucky?.max ?? character.profBonus;
    const luckyCurrent = character.lucky?.current ?? 0;
    const spendLuckyPoint = () => {
        if (isReadOnly || luckyCurrent <= 0) return;
        onUpdate({ 
            ...character, 
            lucky: { current: luckyCurrent - 1, max: luckyMax } 
        });
    };
    const regainLuckyPoint = () => {
        onUpdate({ 
            ...character, 
            lucky: { current: Math.min(luckyCurrent + 1, luckyMax), max: luckyMax } 
        });
    };
    const resetLucky = () => {
        onUpdate({ 
            ...character, 
            lucky: { current: luckyMax, max: luckyMax } 
        });
    };

    // Heroic Inspiration controls
    const inspMax = character.inspiration?.max ?? 3;
    const inspCurrent = character.inspiration?.current ?? 0;
    const addInspiration = () => {
        onUpdate({ 
            ...character, 
            inspiration: { current: Math.min(inspCurrent + 1, inspMax), max: inspMax } 
        });
    };
    const spendInspiration = () => {
        if (!isReadOnly && inspCurrent > 0) {
            onUpdate({ 
                ...character, 
                inspiration: { current: Math.max(inspCurrent - 1, 0), max: inspMax } 
            });
        }
    };

    // ── Warrior of the Mystic Arts (Monk) ─────────────────────────────
    const convertSlotToFocus = (slotLevel: number) => {
        const slots = character.spellSlots?.[slotLevel];
        if (slots && slots.current > 0) {
            const newSlots = { ...character.spellSlots, [slotLevel]: { ...slots, current: slots.current - 1 } };
            onUpdate({
                ...character,
                spellSlots: newSlots,
                focus: { current: Math.min(maxFocus, currentFocus + slotLevel), max: maxFocus }
            });
        }
    };

    const convertFocusToSlot = (slotLevel: number) => {
        const cost = slotLevel + 1; // 1st=2pt, 2nd=3pt...
        if (currentFocus >= cost) {
            const slots = character.spellSlots?.[slotLevel] || { current: 0, max: 0 };
            const newSlots = { ...character.spellSlots, [slotLevel]: { ...slots, current: Math.min(slots.max, slots.current + 1) } };
            onUpdate({
                ...character,
                spellSlots: newSlots,
                focus: { current: currentFocus - cost, max: maxFocus }
            });
        }
    };

    // ── Magic Stealer (Rogue) ──────────────────────────────────────────
    const eseMax = character.level >= 17 ? 3 : character.level >= 11 ? 2 : 1;
    const eseCurrent = character.empoweredSneakAttack?.dice ?? eseMax;
    const useEmpoweredSneakAttack = () => {
        if (eseCurrent > 0) {
            onUpdate({ ...character, empoweredSneakAttack: { dice: eseCurrent - 1 } });
        }
    };
    const resetEmpoweredSneakAttack = () => {
        onUpdate({ ...character, empoweredSneakAttack: { dice: eseMax } });
    };

    // ── Vestige Patron (Warlock) ──────────────────────────────────────
    const vestigeHpMax = character.level * 5;
    const vestigeHpCurrent = character.vestige?.hp?.current ?? vestigeHpMax;
    const updateVestigeHp = (amount: number) => {
        const newHp = Math.max(0, Math.min(vestigeHpMax, vestigeHpCurrent + amount));
        onUpdate({
            ...character,
            vestige: { ...character.vestige!, hp: { current: newHp, max: vestigeHpMax } }
        });
    };


    const openHpModal = (type: 'damage' | 'heal') => {
        setHpModal({ show: true, type });
        setHpAmount('');
    };

    const applyHpChange = () => {
        if (isReadOnly) return;
        const amount = parseInt(hpAmount);
        if (isNaN(amount) || amount <= 0 || hpAmount === '') {
            setHpModal({ ...hpModal, show: false });
            return;
        }
        let newCurrent = character.hp.current;
        let newTemp = character.hp.temp;
        if (hpModal.type === 'heal') {
            newCurrent = Math.min(character.hp.max, newCurrent + amount);
        } else {
            let remainingDamage = amount;
            if (isBarbarian && isRaging) remainingDamage = Math.floor(remainingDamage / 2);
            if (newTemp > 0) {
                const absorbed = Math.min(newTemp, remainingDamage);
                newTemp -= absorbed;
                remainingDamage -= absorbed;
            }
            newCurrent = Math.max(0, newCurrent - remainingDamage);
        }
        onUpdate({ ...character, hp: { ...character.hp, current: newCurrent, temp: newTemp } });
        setHpModal({ ...hpModal, show: false });
    };

    const renderWeapons = () => {
        const physicalWeapons = character.inventory.filter(i => {
            if (!i.equipped) return false;
            const itemData = getItemData(i.name);
            return itemData && itemData.type === 'Weapon';
        }).map(item => ({
            id: item.id,
            name: item.name,
            data: getItemData(item.name) as WeaponData,
            item: item,
            isSpell: false
        }));

        const eldritchWeapons = (character.agonizingBlastCantrips || []).map(name => {
            const spell = SPELL_DETAILS[name];
            if (!spell) return null;
            const scale = character.level >= 17 ? 4 : character.level >= 11 ? 3 : character.level >= 5 ? 2 : 1;
            const isEB = name === 'Eldritch Blast';
            const dieMatch = spell.description.match(/(\d?d\d+)/);
            const die = dieMatch ? dieMatch[1] : '1d10';
            return {
                id: `spell-${name}`,
                name: name,
                isSpell: true,
                scale: scale,
                die: die,
                isEB: isEB,
                properties: ['Eldritch', 'Spell'],
                toHit: character.profBonus + spellcastingStats.mod,
                damageBonus: spellcastingStats.mod,
                displayDamage: isEB ? `${die}${spellcastingStats.mod >= 0 ? '+' : ''}${spellcastingStats.mod} (x${scale})` : `${scale}${die.startsWith('d') ? die : die.substring(1)}${spellcastingStats.mod >= 0 ? '+' : ''}${spellcastingStats.mod}`
            };
        }).filter(Boolean);

        const allWeapons = [...physicalWeapons, ...eldritchWeapons];
        
        return allWeapons.map((entry: any) => {
            if (!entry.isSpell) {
                const { item, data: weapon } = entry;
                const toHitItems = getWeaponToHitBreakdown(character, item, weapon, finalStats);
                const toHit = toHitItems.reduce((acc, curr) => acc + (typeof curr.value === 'number' ? curr.value : 0), 0);
                const dmgItems = getWeaponDamageBreakdown(character, item, weapon, finalStats, isRaging);
                const dmgMod = dmgItems.reduce((acc, curr) => acc + (typeof curr.value === 'number' ? curr.value : 0), 0);
                const damageDie = dmgItems.find(i => typeof i.value === 'string')?.value || weapon.damage;

                return (
                    <div key={entry.id} className="rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm ring-1 ring-slate-200 dark:ring-white/5 hover:ring-primary/50 transition-all">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex gap-3">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-[24px]">swords</span></div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">{entry.name}</h4>
                                    <div className="flex gap-1 mt-1 flex-wrap">
                                        {weapon.properties.map((p: string) => (<span key={p} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300">{p}</span>))}
                                        {weapon.mastery && (character.weaponMasteries || []).includes(weapon.name) && (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-primary/10 text-primary border border-primary/20 uppercase tracking-tighter">
                                                Mastery: {weapon.mastery}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setWeaponStatModal({ item, weapon, type: 'toHit' })} className="flex flex-col items-center justify-center py-2 px-4 rounded-xl bg-slate-50 dark:bg-black/20 group">
                                <span className="text-xs font-bold text-slate-400 group-hover:text-primary uppercase tracking-wider mb-1">To Hit</span>
                                <span className="text-lg font-bold text-slate-900 dark:text-white">{formatModifier(toHit)}</span> 
                            </button>
                            <button onClick={() => setWeaponStatModal({ item, weapon, type: 'damage' })} className="flex flex-col items-center justify-center py-2 px-4 rounded-xl bg-slate-50 dark:bg-black/20 group">
                                <span className="text-xs font-bold text-slate-400 group-hover:text-primary uppercase tracking-wider mb-1">Damage</span>
                                <span className="text-lg font-bold text-slate-900 dark:text-white">{damageDie}{dmgMod >= 0 ? '+' : ''}{dmgMod}</span>
                                {weapon.mastery === 'Graze' && (character.weaponMasteries || []).includes(weapon.name) && (
                                    <span className="text-[9px] text-amber-500 font-bold mt-0.5">Graze: {formatModifier(dmgItems.find(i => i.label.includes('Mastery: Graze'))?.value as number || 0)} on miss</span>
                                )}
                            </button>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div key={entry.id} className="rounded-2xl bg-gradient-to-br from-fuchsia-600/10 to-transparent dark:bg-surface-dark p-4 shadow-sm ring-1 ring-fuchsia-500/30 dark:ring-fuchsia-500/20 hover:ring-fuchsia-500/50 transition-all border-l-4 border-fuchsia-500">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex gap-3">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 shrink-0 shadow-inner">
                                    <span className="material-symbols-outlined text-[24px] animate-pulse">auto_fix_normal</span>
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{entry.name}</h4>
                                        <span className="text-[8px] font-black bg-fuchsia-500 text-white px-1 rounded uppercase tracking-tighter shadow-sm">EB</span>
                                    </div>
                                    <div className="flex gap-1 mt-1 flex-wrap">
                                        {entry.properties.map((p: string) => (<span key={p} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-tighter">{p}</span>))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setWeaponStatModal({ item: entry, weapon: entry, type: 'toHit', isSpell: true })} className="flex flex-col items-center justify-center py-2 px-4 rounded-xl bg-fuchsia-500/5 dark:bg-black/20 group border border-fuchsia-500/10">
                                <span className="text-[10px] font-black text-fuchsia-400 group-hover:text-fuchsia-500 uppercase tracking-widest mb-1">Hit</span>
                                <span className="text-lg font-bold text-slate-900 dark:text-white">{formatModifier(entry.toHit)}</span> 
                            </button>
                            <button onClick={() => setWeaponStatModal({ item: entry, weapon: entry, type: 'damage', isSpell: true })} className="flex flex-col items-center justify-center py-2 px-4 rounded-xl bg-fuchsia-500/5 dark:bg-black/20 group border border-fuchsia-500/10">
                                <span className="text-[10px] font-black text-fuchsia-400 group-hover:text-fuchsia-500 uppercase tracking-widest mb-1">Arcane Damage</span>
                                <span className="text-lg font-bold text-slate-900 dark:text-white">{entry.displayDamage}</span>
                            </button>
                        </div>
                    </div>
                );
            }
        });
    };

    return (
        <div className="px-4 pb-20">
            <div className="grid grid-cols-5 gap-2 my-4">
                {[
                    { id: 'AC' as const, icon: "shield", label: "AC", value: armorClass, color: "text-primary" },
                    { id: 'Init' as const, icon: "bolt", label: "Init", value: formatModifier(initiativeTotal), color: "text-yellow-500" },
                    { id: 'Spd' as const, icon: "sprint", label: "Spd", value: speedTotal, color: "text-blue-400" },
                    { id: 'Prof' as const, icon: "school", label: "Prof", value: `+${character.profBonus}`, color: "text-purple-400", noModal: true },
                    { id: 'Insp' as const, icon: "military_tech", label: "Insp", value: `${inspCurrent}/${inspMax}`, color: "text-cyan-400" },
                ].map(stat => (
                    <button key={stat.label} onClick={() => !stat.noModal && setInspectedStat(stat.id)} className="flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-surface-dark p-2 shadow-sm ring-1 ring-slate-200 dark:ring-white/5 active:scale-95 transition-all">
                        <span className={`material-symbols-outlined mb-1 ${stat.color} text-[18px]`}>{stat.icon}</span>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</span>
                        <span className="text-lg font-bold dark:text-white text-slate-900 leading-none mt-1">{stat.value}</span>
                    </button>
                ))}
            </div>

            {/* Recursos: Lucky */}
            {/* Removed standalone Lucky section as it is now integrated into HP card */}

            <div className="grid grid-cols-3 gap-2 mb-6">
                {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as Ability[]).map(stat => {
                    const score = finalStats[stat] || 10;
                    const mod = Math.floor((score - 10) / 2);
                    return (
                        <div key={stat} className="flex flex-col items-center p-2 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 shadow-sm">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat}</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-bold text-slate-900 dark:text-white leading-none">{formatModifier(mod)}</span>
                                <span className="text-[10px] text-slate-400 font-medium">{score}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* SECCIÓN DE TIRADAS DE SALVACIÓN RESTAURADA */}
            <div className="mb-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Tiradas de Salvación</h3>
                <div className="grid grid-cols-3 gap-2">
                    {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as Ability[]).map(stat => {
                        const isProf = isProficientInSave(character, stat);
                        const abilityMod = getAbilityModifier(finalStats, stat);
                        const globalBonus = getSavingThrowBonus(character, finalStats);
                        const total = abilityMod + (isProf ? character.profBonus : 0) + globalBonus;
                        
                        return (
                            <button key={stat} onClick={() => setInspectedStat(`Save_${stat}` as any)} className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 shadow-sm active:scale-95 transition-all">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <div className={`w-1 h-1 rounded-full ${isProf ? 'bg-primary' : 'bg-slate-300 dark:bg-white/10'}`}></div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase">{stat}</span>
                                </div>
                                <span className={`font-bold text-sm ${isProf ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{formatModifier(total)}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col gap-3 mb-6">
                <div className="flex flex-col gap-4 rounded-3xl bg-white dark:bg-surface-dark p-6 shadow-lg border border-slate-200 dark:border-white/5 overflow-hidden relative group/hp">
                    {!isReadOnly && isBarbarian && (
                        <div className="absolute top-4 right-5">
                            <button onClick={() => setIsRaging(!isRaging)} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${isRaging ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/10 text-slate-500'}`}>
                                <span className="material-symbols-outlined text-xs">local_fire_department</span>
                                {isRaging ? 'Rage Active' : 'Enter Rage'}
                            </button>
                        </div>
                    )}
                    
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col cursor-pointer" onClick={() => setInspectedStat('HP')}>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                Max Hit Points
                                <span className="material-symbols-outlined text-[12px] opacity-0 group-hover/hp:opacity-100 transition-opacity">info</span>
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-5xl font-black tracking-tight ${hpColorClass}`}>{character.hp.current}</span>
                                <span className="text-xl font-bold text-slate-400">/ {character.hp.max}</span>
                            </div>
                        </div>
                        {!isReadOnly && (
                            <div className="flex gap-2">
                                <button onClick={() => openHpModal('damage')} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-black/20 border border-red-500/30 text-red-500 active:scale-90 transition-all"><span className="material-symbols-outlined font-bold">heart_broken</span></button>
                                <button onClick={() => openHpModal('heal')} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-black/20 border border-emerald-500/30 text-emerald-500 active:scale-90 transition-all"><span className="material-symbols-outlined font-bold">healing</span></button>
                            </div>
                        )}
                    </div>
                    <div className="relative h-2 w-full rounded-full bg-slate-100 dark:bg-black/40 overflow-hidden">
                        <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out ${hpPercent < 25 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${Math.min(100, hpPercent)}%` }}></div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Hit Dice</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-black text-slate-900 dark:text-white leading-none">{currentHitDice}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase">/ {maxHitDice}d{dieType}</span>
                            </div>
                        </div>
                        {!isReadOnly && (
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={useHitDie}
                                    disabled={currentHitDice <= 0}
                                    className={`h-10 px-4 flex items-center gap-2 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all active:scale-95 ${currentHitDice > 0 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30' : 'bg-slate-100 dark:bg-white/5 text-slate-400 border-transparent cursor-not-allowed'}`}
                                >
                                    <span className="material-symbols-outlined text-sm">casino</span>
                                    Use
                                </button>
                                <button 
                                    onClick={resetHitDice}
                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-primary active:scale-90 transition-all"
                                    title="Long Rest (Reset)"
                                >
                                    <span className="material-symbols-outlined text-sm font-bold">restore</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {hasLuckyFeat && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-amber-500">casino</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suerte (Lucky)</span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">Recarga: Descanso Largo</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 dark:bg-black/20 p-2 rounded-xl border border-slate-100 dark:border-white/5">
                                <div className="flex gap-2">
                                    {Array.from({ length: luckyMax }).map((_, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => {
                                                if (i < luckyCurrent) spendLuckyPoint();
                                            }}
                                            className={`size-6 rounded-full border-2 transition-all ${i < luckyCurrent ? 'bg-amber-400 border-amber-400 shadow-sm cursor-pointer hover:bg-amber-500' : 'bg-transparent border-slate-300 dark:border-white/20 cursor-default'}`}
                                        ></button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{luckyCurrent} / {luckyMax}</span>
                                    <button 
                                        onClick={resetLucky}
                                        className="size-8 flex items-center justify-center rounded-lg bg-white dark:bg-white/5 text-slate-400 hover:text-amber-500 shadow-sm border border-slate-200 dark:border-white/5 active:scale-90 transition-all"
                                        title="Recuperar Todo"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {isMonk && (
                    <div className="flex flex-col gap-4 rounded-3xl bg-white dark:bg-surface-dark p-6 shadow-lg border border-slate-200 dark:border-white/5">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-1">Focus Points</span>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-4xl font-black tracking-tighter ${focusColorClass}`}>{currentFocus}</span>
                                    <span className="text-lg font-bold text-slate-400">/ {maxFocus}</span>
                                </div>
                            </div>
                            <button onClick={resetFocus} className="size-12 rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 active:scale-90 transition-all flex items-center justify-center" title="Descanso Corto/Largo">
                                <span className="material-symbols-outlined font-bold">refresh</span>
                            </button>
                        </div>
                        <div className="relative h-2 w-full rounded-full bg-slate-100 dark:bg-black/40 overflow-hidden">
                             <div className="absolute top-0 left-0 h-full bg-cyan-500 transition-all duration-500" style={{ width: `${Math.min(100, focusPercent)}%` }}></div>
                        </div>

                        <div className="mt-2 pt-2">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Monk Abilities</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {[
                                    { id: 'flurry', label: 'Flurry', icon: 'sports_martial_arts', cost: 1 },
                                    { id: 'def', label: 'Defense', icon: 'security', cost: 1 },
                                    { id: 'step', label: 'Step', icon: 'air', cost: 1 },
                                    ...(character.level >= 5 ? [{ id: 'stun', label: 'Stun', icon: 'offline_bolt', cost: 1 }] : [])
                                ].map(skill => (
                                    <button 
                                        key={skill.id}
                                        onClick={() => useFocusPoint(skill.cost)} 
                                        disabled={currentFocus < skill.cost} 
                                        className={`flex flex-col items-center justify-center py-2 rounded-xl border transition-all active:scale-90 ${currentFocus >= skill.cost ? 'bg-cyan-500/5 border-cyan-500/20 hover:bg-cyan-500/10' : 'opacity-20 grayscale cursor-not-allowed'}`}
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-cyan-500 mb-0.5">{skill.icon}</span>
                                        <span className="text-[8px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-tighter">{skill.label}</span>
                                    </button>
                                ))}
                            </div>

                            {isWarriorOfMercy && (
                                <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Mercy Spending</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            onClick={() => useFocusPoint(1)}
                                            disabled={currentFocus < 1}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all active:scale-95 ${currentFocus >= 1 ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10' : 'opacity-20 cursor-not-allowed'}`}
                                        >
                                            <span className="material-symbols-outlined text-[16px] text-emerald-500">back_hand</span>
                                            <div className="flex flex-col items-start min-w-0">
                                                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase leading-none">Sanación</span>
                                                <span className="text-[8px] text-slate-400 font-mono">1d{martialArtsDie.substring(1)}+{wisMod}</span>
                                            </div>
                                        </button>
                                        <button 
                                            onClick={() => useFocusPoint(1)}
                                            disabled={currentFocus < 1}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all active:scale-95 ${currentFocus >= 1 ? 'bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10' : 'opacity-20 cursor-not-allowed'}`}
                                        >
                                            <span className="material-symbols-outlined text-[16px] text-rose-500">skull</span>
                                            <div className="flex flex-col items-start min-w-0">
                                                <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase leading-none">Damage</span>
                                                <span className="text-[8px] text-slate-400 font-mono">1d{martialArtsDie.substring(1)}+{wisMod}</span>
                                            </div>
                                        </button>
                                        {character.level >= 17 && (
                                            <button 
                                                onClick={() => useFocusPoint(5)}
                                                disabled={currentFocus < 5}
                                                className={`col-span-2 flex items-center justify-center gap-3 py-2 rounded-xl border transition-all active:scale-95 ${currentFocus >= 5 ? 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10' : 'opacity-20 cursor-not-allowed'}`}
                                            >
                                                <span className="material-symbols-outlined text-[18px] text-amber-500">auto_fix_high</span>
                                                <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Misericordia Definitiva (5 Foco)</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── BARBARIAN RAGE ── */}
            {isBarbarian && (
                <div className="flex flex-col gap-4 rounded-3xl bg-white dark:bg-surface-dark p-6 shadow-lg border border-slate-200 dark:border-white/5 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">Furia</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black tracking-tighter text-orange-500">
                                    {rageUnlimited ? '∞' : rageCurrent}
                                </span>
                                {!rageUnlimited && <span className="text-lg font-bold text-slate-400">/ {rageMax}</span>}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={useRage} disabled={!rageUnlimited && rageCurrent <= 0}
                                className={`size-12 rounded-2xl border active:scale-90 transition-all flex items-center justify-center text-orange-500 ${(!rageUnlimited && rageCurrent <= 0) ? 'opacity-30 cursor-not-allowed bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5' : 'bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20'}`}
                                title="Enter Rage">
                                <span className="material-symbols-outlined font-bold">local_fire_department</span>
                            </button>
                            <button onClick={resetRage} className="size-12 rounded-2xl bg-white dark:bg-white/5 text-slate-400 hover:text-orange-500 shadow-sm border border-slate-200 dark:border-white/5 active:scale-90 transition-all flex items-center justify-center" title="Descanso Largo">
                                <span className="material-symbols-outlined font-bold">refresh</span>
                            </button>
                        </div>
                    </div>
                    {!rageUnlimited && (
                        <div className="flex gap-1.5">
                            {Array.from({ length: rageMax }, (_, i) => (
                                <div key={i} className={`flex-1 h-2 rounded-full transition-colors ${i < rageCurrent ? 'bg-orange-500' : 'bg-slate-200 dark:bg-white/10'}`} />
                            ))}
                        </div>
                    )}
                    <div className="text-xs text-slate-400 text-center font-medium">
                        Damage +{Math.floor(((finalStats.STR || 10) - 10) / 2)} extra • Resistance to B/P/S
                        {character.level >= 20 && ' • Unlimited Rage!'}
                    </div>
                </div>
            )}

            {/* ── BARD BARDIC INSPIRATION ── */}
            {isBard && (
                <div className="flex flex-col gap-4 rounded-3xl bg-white dark:bg-surface-dark p-6 shadow-lg border border-slate-200 dark:border-white/5 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-1">Inspiración de Bardo</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black tracking-tighter text-purple-500">{bardicCurrent}</span>
                                <span className="text-lg font-bold text-slate-400">/ {bardicMax}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={useBardicInspiration} disabled={bardicCurrent <= 0}
                                className={`size-12 rounded-2xl border active:scale-90 transition-all flex items-center justify-center text-purple-500 ${bardicCurrent <= 0 ? 'opacity-30 cursor-not-allowed bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5' : 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20'}`}
                                title="Usar Inspiración">
                                <span className="material-symbols-outlined font-bold">music_note</span>
                            </button>
                            <button onClick={resetBardicInspiration} className="size-12 rounded-2xl bg-white dark:bg-white/5 text-slate-400 hover:text-purple-500 shadow-sm border border-slate-200 dark:border-white/5 active:scale-90 transition-all flex items-center justify-center" title="Descanso Largo">
                                <span className="material-symbols-outlined font-bold">refresh</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-1.5">
                        {Array.from({ length: bardicMax }, (_, i) => (
                            <div key={i} className={`flex-1 h-2 rounded-full transition-colors ${i < bardicCurrent ? 'bg-purple-500' : 'bg-slate-200 dark:bg-white/10'}`} />
                        ))}
                    </div>
                    <div className="text-xs text-slate-400 text-center font-medium">Die: {bardicInspirationDie} • Uses = CHA Mod</div>
                </div>
            )}

            {/* ── CHANNEL DIVINITY (Cleric / Paladin) ── */}
            {(isCleric || isPaladin) && channelDivinityMax > 0 && (
                <div className="flex flex-col gap-4 rounded-3xl bg-white dark:bg-surface-dark p-6 shadow-lg border border-slate-200 dark:border-white/5 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mb-1">Canal de Divinidad</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black tracking-tighter text-yellow-500">{channelDivinityCurrent}</span>
                                <span className="text-lg font-bold text-slate-400">/ {channelDivinityMax}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={useChannelDivinity} disabled={channelDivinityCurrent <= 0}
                                className={`size-12 rounded-2xl border active:scale-90 transition-all flex items-center justify-center text-yellow-500 ${channelDivinityCurrent <= 0 ? 'opacity-30 cursor-not-allowed bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5' : 'bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20'}`}
                                title="Usar Canal de Divinidad">
                                <span className="material-symbols-outlined font-bold">verified_user</span>
                            </button>
                            <button onClick={resetChannelDivinity} className="size-12 rounded-2xl bg-white dark:bg-white/5 text-slate-400 hover:text-yellow-500 shadow-sm border border-slate-200 dark:border-white/5 active:scale-90 transition-all flex items-center justify-center" title="Descanso Corto/Largo">
                                <span className="material-symbols-outlined font-bold">refresh</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-center">
                        {Array.from({ length: channelDivinityMax }, (_, i) => (
                            <div key={i} className={`size-5 rounded-full border-2 transition-colors ${i < channelDivinityCurrent ? 'bg-yellow-500 border-yellow-500' : 'bg-transparent border-slate-300 dark:border-slate-600'}`} />
                        ))}
                    </div>
                    <div className="text-xs text-slate-400 text-center font-medium">Restores on Short or Long Rest</div>
                </div>
            )}

            {/* ── WILD SHAPE (Druid) ── */}
            {isDruid && (
                <div className="flex flex-col gap-4 rounded-3xl bg-white dark:bg-surface-dark p-6 shadow-lg border border-slate-200 dark:border-white/5 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Forma Salvaje</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black tracking-tighter text-emerald-500">{wildShapeCurrent}</span>
                                <span className="text-lg font-bold text-slate-400">/ 2</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={useWildShape} disabled={wildShapeCurrent <= 0}
                                className={`size-12 rounded-2xl border active:scale-90 transition-all flex items-center justify-center text-emerald-500 ${wildShapeCurrent <= 0 ? 'opacity-30 cursor-not-allowed bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5' : 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'}`}
                                title="Usar Forma Salvaje">
                                <span className="material-symbols-outlined font-bold">forest</span>
                            </button>
                            <button onClick={resetWildShape} className="size-12 rounded-2xl bg-white dark:bg-white/5 text-slate-400 hover:text-emerald-500 shadow-sm border border-slate-200 dark:border-white/5 active:scale-90 transition-all flex items-center justify-center" title="Descanso Corto/Largo">
                                <span className="material-symbols-outlined font-bold">refresh</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-4 justify-center">
                        {[0, 1].map(i => (
                            <div key={i} className={`size-6 rounded-full border-2 transition-colors ${i < wildShapeCurrent ? 'bg-emerald-500 border-emerald-500' : 'bg-transparent border-slate-300 dark:border-slate-600'}`} />
                        ))}
                    </div>
                    <div className="text-xs text-slate-400 text-center font-medium">Restores on Short or Long Rest</div>
                </div>
            )}

            {/* ── LAY ON HANDS (Paladin) ── */}
            {isPaladin && (
                <div className="flex flex-col gap-4 rounded-3xl bg-white dark:bg-surface-dark p-6 shadow-lg border border-slate-200 dark:border-white/5 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">Lay On Hands</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black tracking-tighter text-sky-500">{layOnHandsCurrent}</span>
                                <span className="text-lg font-bold text-slate-400">/ {layOnHandsMax} HP</span>
                            </div>
                        </div>
                        <button onClick={resetLayOnHands} className="size-12 rounded-2xl bg-white dark:bg-white/5 text-slate-400 hover:text-sky-500 shadow-sm border border-slate-200 dark:border-white/5 active:scale-90 transition-all flex items-center justify-center" title="Descanso Largo">
                            <span className="material-symbols-outlined font-bold">refresh</span>
                        </button>
                    </div>
                    <div className="relative h-2 w-full rounded-full bg-slate-100 dark:bg-black/40 overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-sky-500 transition-all duration-500" style={{ width: `${Math.min(100, (layOnHandsCurrent / layOnHandsMax) * 100)}%` }} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                        {[1, 5, 10].map(amount => (
                            <button key={amount} onClick={() => healWithLayOnHands(amount)} disabled={layOnHandsCurrent < amount}
                                className={`py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 ${layOnHandsCurrent >= amount ? 'bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20' : 'opacity-30 cursor-not-allowed border-slate-200 dark:border-white/5 text-slate-400'}`}>
                                -{amount} HP
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── FIGHTER: ACTION SURGE + SECOND WIND ── */}
            {isFighter && (
                <div className="flex flex-col gap-3 rounded-3xl bg-white dark:bg-surface-dark p-6 shadow-lg border border-slate-200 dark:border-white/5 mb-4">
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Fighter Resources</span>
                    <div className="grid grid-cols-2 gap-3">
                        <div className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${actionSurgeCurrent > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 opacity-50'}`}>
                            <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Oleada de Acción</span>
                            <div className="flex gap-1.5">
                                {Array.from({ length: actionSurgeMax }, (_, i) => (
                                    <div key={i} className={`size-4 rounded-full border-2 ${i < actionSurgeCurrent ? 'bg-red-500 border-red-500' : 'bg-transparent border-slate-300 dark:border-slate-600'}`} />
                                ))}
                            </div>
                            <div className="flex gap-1">
                                <button onClick={useActionSurge} disabled={actionSurgeCurrent <= 0}
                                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-black active:scale-90 transition-all ${actionSurgeCurrent > 0 ? 'bg-red-500 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed'}`}>
                                    USE
                                </button>
                                <button onClick={resetActionSurge} className="px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-red-500 text-[10px] font-black active:scale-90 transition-all">
                                    <span className="material-symbols-outlined text-[14px]">refresh</span>
                                </button>
                            </div>
                        </div>
                        <div className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${secondWindCurrent > 0 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 opacity-50'}`}>
                            <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">2do Aliento</span>
                            <div className={`size-4 rounded-full border-2 ${secondWindCurrent > 0 ? 'bg-emerald-500 border-emerald-500' : 'bg-transparent border-slate-300 dark:border-slate-600'}`} />
                            <div className="flex gap-1">
                                <button onClick={healSecondWind} disabled={secondWindCurrent <= 0}
                                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-black active:scale-90 transition-all ${secondWindCurrent > 0 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed'}`}>
                                    CURAR
                                </button>
                                <button onClick={resetSecondWind} className="px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-emerald-500 text-[10px] font-black active:scale-90 transition-all">
                                    <span className="material-symbols-outlined text-[14px]">refresh</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-slate-400 text-center font-medium">Restores on Short or Long Rest</div>
                </div>
            )}

            {/* ── SNEAK ATTACK (Rogue) ── */}
            {isRogue && (
                <div className="flex items-center justify-between rounded-3xl bg-white dark:bg-surface-dark p-5 shadow-lg border border-slate-200 dark:border-white/5 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="size-12 rounded-2xl bg-slate-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-500">visibility_off</span>
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sneak Attack</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">{sneakAttackDice}d6</div>
                            <div className="text-[10px] text-slate-400">Once per turn</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-slate-500">Avg</div>
                        <div className="text-lg font-black text-slate-700 dark:text-slate-300">
                            {Math.floor(sneakAttackDice * 3.5)}
                        </div>
                        <div className="text-[10px] text-slate-400">max {sneakAttackDice * 6}</div>
                    </div>
                </div>
            )}

            {/* ── MYSTIC FOCUS CONVERSION (Warrior of the Mystic Arts) ── */}
            {isMysticArtsMonk && (
                <div className="flex flex-col gap-4 rounded-3xl bg-white dark:bg-surface-dark p-6 shadow-lg border border-slate-200 dark:border-white/5 mb-4 border-l-4 border-cyan-500">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-1">Mystic Conversion</span>
                            <span className="text-xs text-slate-400">Slot and Focus Exchange</span>
                        </div>
                        <span className="material-symbols-outlined text-cyan-500">auto_fix_normal</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase text-center">Espacio → Foco</span>
                            {[1, 2, 3, 4, 5].map(lvl => {
                                const current = character.spellSlots?.[lvl]?.current ?? 0;
                                const max = character.spellSlots?.[lvl]?.max ?? 0;
                                if (max === 0) return null;
                                return (
                                    <button key={lvl} onClick={() => convertSlotToFocus(lvl)} disabled={current <= 0}
                                        className={`py-1.5 rounded-xl border text-[10px] font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${current > 0 ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400' : 'opacity-20 border-slate-200 dark:border-white/5 text-slate-400'}`}>
                                        Lv{lvl} ({current}) → +{lvl} Foco
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase text-center">Foco → Espacio</span>
                            {[1, 2, 3, 4, 5].map(lvl => {
                                const cost = lvl + 1;
                                const max = character.spellSlots?.[lvl]?.max ?? 0;
                                const current = character.spellSlots?.[lvl]?.current ?? 0;
                                if (max === 0) return null;
                                return (
                                    <button key={lvl} onClick={() => convertFocusToSlot(lvl)} disabled={currentFocus < cost || current >= max}
                                        className={`py-1.5 rounded-xl border text-[10px] font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${currentFocus >= cost && current < max ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'opacity-20 border-slate-200 dark:border-white/5 text-slate-400'}`}>
                                        {cost} Foco → Lv{lvl}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ── EMPOWERED SNEAK ATTACK (Magic Stealer) ── */}
            {isMagicStealer && (
                <div className="flex flex-col gap-4 rounded-3xl bg-white dark:bg-surface-dark p-6 shadow-lg border border-slate-200 dark:border-white/5 mb-4 border-l-4 border-amber-500">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Empowered Sneak Attack</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black tracking-tighter text-amber-500">{eseCurrent}</span>
                                <span className="text-lg font-bold text-slate-400">/ {eseMax} Uses</span>
                            </div>
                        </div>
                        <button onClick={resetEmpoweredSneakAttack} className="size-12 rounded-2xl bg-white dark:bg-white/5 text-slate-400 hover:text-amber-500 shadow-sm border border-slate-200 dark:border-white/5 active:scale-90 transition-all flex items-center justify-center" title="Descanso Corto/Largo">
                            <span className="material-symbols-outlined font-bold">refresh</span>
                        </button>
                    </div>
                    <button onClick={useEmpoweredSneakAttack} disabled={eseCurrent <= 0}
                        className={`w-full py-3 rounded-2xl border font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] ${eseCurrent > 0 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-400 opacity-50'}`}>
                        Empower Attack (+{eseCurrent}d6)
                    </button>
                    <p className="text-[10px] text-slate-500 text-center">Recharges when casting a level 1+ spell or on a Rest</p>
                </div>
            )}

            {/* ── VESTIGE COMPANION (Vestige Patron) ── */}
            {isVestigeWarlock && (
                <div className="flex flex-col gap-4 rounded-3xl bg-white dark:bg-surface-dark p-6 shadow-lg border border-slate-200 dark:border-white/5 mb-4 border-l-4 border-purple-500">
                   <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-1">Compañero Vestigial</span>
                            <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{character.vestige?.type || 'Vestigio'}</span>
                        </div>
                        <div className="size-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center"><span className="material-symbols-outlined text-xl">tempest</span></div>
                   </div>
                   <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">Hit Points</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-black text-purple-500">{vestigeHpCurrent}</span>
                                <span className="text-xs font-bold text-slate-400">/ {vestigeHpMax}</span>
                            </div>
                        </div>
                         <div className="flex gap-2">
                             <button onClick={() => updateVestigeHp(-5)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-black/20 border border-purple-500/30 text-purple-500 active:scale-90 transition-all font-bold">-5</button>
                             <button onClick={() => updateVestigeHp(5)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-black/20 border border-purple-500/30 text-purple-500 active:scale-90 transition-all font-bold">+5</button>
                         </div>
                   </div>
                   <div className="relative h-1.5 w-full bg-slate-100 dark:bg-black/40 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-purple-500 transition-all duration-300" style={{ width: `${(vestigeHpCurrent / vestigeHpMax) * 100}%` }}></div>
                   </div>
                   <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                            <span className="font-bold block text-purple-500 uppercase">Aura: {character.vestige?.domain || 'Pattern'}</span>
                            Bonus of +{character.profBonus} to saves vs magic.
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                            <span className="font-bold block text-purple-500 uppercase">Attack</span>
                            1d8 + {character.profBonus} force damage.
                        </div>
                   </div>
                </div>
            )}

            {/* ── SPELLGUARD (Oath of the Spellguard) ── */}
            {isSpellguard && (
                <div className="flex flex-col gap-4 rounded-3xl bg-white dark:bg-surface-dark p-6 shadow-lg border border-slate-200 dark:border-white/5 mb-4 border-l-4 border-sky-400">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-1">Guardian Bond</span>
                            <span className="text-xs text-slate-400">Protecting an ally</span>
                        </div>
                        <span className="material-symbols-outlined text-sky-400">safety_check</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-sky-400/5 border border-sky-400/20">
                         <p className="text-xs text-slate-600 dark:text-slate-300">Linked ally receives <span className="font-bold text-sky-400">+{character.profBonus}</span> to AC and Saves if in your Protection Aura.</p>
                         <div className="mt-3 flex gap-2 items-center">
                            <input 
                                type="text" 
                                placeholder="Ally name..." 
                                value={character.guardianBondTarget || ''}
                                onChange={(e) => onUpdate({ ...character, guardianBondTarget: e.target.value })}
                                className="flex-1 bg-black/10 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-sky-400/50"
                            />
                         </div>
                    </div>
                </div>
            )}

            {Object.keys(spellSlotSummary).length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <span className="material-symbols-outlined text-xs text-slate-400">auto_awesome</span>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Conjuros</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        {Object.entries(spellSlotSummary).map(([level, slots]) => {
                            const lvl = parseInt(level);
                            const percent = (slots.current / slots.max) * 100;
                            return (
                                <div key={lvl} className="p-3 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase tracking-tighter">Level {lvl}</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{slots.current} / {slots.max}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-black/40 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-500 ${percent === 0 ? 'bg-slate-300' : 'bg-primary shadow-[0_0_8px_rgba(53,158,255,0.4)]'}`} 
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-3 mb-6">{renderWeapons()}</div>

            {character.weaponMasteries && character.weaponMasteries.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Active Masteries</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {character.weaponMasteries.map(m => {
                            const weaponData = getItemData(m) as WeaponData;
                            return (
                                <div key={m} className="p-3 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-base">swords</span></div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-900 dark:text-white leading-none">{m}</div>
                                            <div className="text-[10px] font-bold text-primary uppercase mt-1">{weaponData?.mastery || '-'}</div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[150px] leading-tight text-right italic">{MASTERY_DESCRIPTIONS[weaponData?.mastery || '-']}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {character.spellcastingAbility && (
                <div className="mb-6 p-4 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20"><span className="material-symbols-outlined">auto_fix_high</span></div>
                            <div>
                                <div className="text-[10px] font-black text-primary uppercase tracking-widest">Innate Ability</div>
                                <div className="text-lg font-black text-slate-900 dark:text-white leading-none mt-0.5">{character.spellcastingAbility}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Spell Mod</div>
                            <div className="text-xl font-black text-primary leading-none mt-0.5">{formatModifier(spellcastingStats.mod)}</div>
                        </div>
                    </div>
                </div>
            )}
      
            <div className="mb-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Abilities</h3>
                <div className="grid grid-cols-2 gap-2">
                    {SKILL_LIST.map(skill => {
                        const isProf = character.skills.includes(skill);
                        const isExpert = (character.expertise || []).includes(skill);
                        const total = getSkillBonus(character, skill, finalStats);
                        return (
                            <button key={skill} onClick={() => setSelectedSkill(skill)} className={`flex items-center justify-between p-2.5 rounded-xl border transition-all active:scale-[0.99] ${isExpert ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-white/5'}`}>
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className={`w-1.5 h-1.5 rounded-full ${isExpert ? 'bg-primary shadow-[0_0_5px_rgba(53,158,255,0.8)]' : isProf ? 'bg-primary' : 'bg-slate-300 dark:bg-white/10'}`}></div>
                                    <span className={`font-bold text-xs truncate ${isProf || isExpert ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{skill}</span>
                                    {isExpert && <span className="text-[8px] font-black bg-primary text-background-dark px-1 rounded uppercase tracking-tighter">EXP</span>}
                                </div>
                                <span className={`font-bold text-xs ${isProf || isExpert ? 'text-primary' : 'text-slate-400'}`}>{formatModifier(total)}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Stat Breakdowns */}
            {inspectedStat && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setInspectedStat(null)}>
                    <div className="w-full max-w-[320px] bg-white dark:bg-surface-dark p-6 rounded-3xl animate-scaleUp" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-widest mb-6">
                            {inspectedStat === 'HP' ? 'Hit Points' 
                             : inspectedStat?.startsWith('Save_') 
                                ? `Salvación de ${{
                                    'STR': 'Fuerza',
                                    'DEX': 'Destreza',
                                    'CON': 'Constitución',
                                    'INT': 'Inteligencia',
                                    'WIS': 'Sabiduría',
                                    'CHA': 'Carisma'
                                  }[inspectedStat.split('_')[1] as Ability] || inspectedStat.split('_')[1]}` 
                                : inspectedStat} Breakdown
                        </h3>
                        
                        <div className="space-y-2">
                            {(inspectedStat === 'AC' 
                                ? getACBreakdown(character, finalStats)
                                : inspectedStat === 'Init' 
                                ? getInitBreakdown(character, finalStats)
                                : inspectedStat === 'Spd'
                                ? getSpeedBreakdown(character, finalStats)
                                : inspectedStat === 'HP'
                                ? getHPBreakdown(character, finalStats)
                                : inspectedStat?.startsWith('Save_')
                                ? getSaveBreakdown(character, inspectedStat.split('_')[1] as Ability, finalStats)
                                : []
                            ).map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <span className={`material-symbols-outlined text-sm ${inspectedStat === 'HP' ? 'text-red-400' : 'text-primary'}`}>{item.icon}</span>
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{typeof item.value === 'number' && inspectedStat !== 'HP' ? formatModifier(item.value) : item.value}</span>
                                </div>
                            ))}

                            {inspectedStat === 'Insp' && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-sm text-cyan-500">military_tech</span>
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Current Points</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{inspCurrent} / {inspMax}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                                        {Array.from({ length: Math.max(inspMax, 1) }).map((_, i) => (
                                            <div key={i} className={`h-3 flex-1 rounded-full transition-all duration-300 ${i < inspCurrent ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-slate-200 dark:bg-white/10'}`}></div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <button 
                                            onClick={spendInspiration} 
                                            disabled={inspCurrent <= 0} 
                                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 hover:bg-cyan-600 transition-all shadow-sm shadow-cyan-500/20"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">remove</span>
                                            <span className="text-xs uppercase tracking-wider">Gastar</span>
                                        </button>
                                        <button 
                                            onClick={addInspiration} 
                                            disabled={inspCurrent >= inspMax} 
                                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">add</span>
                                            <span className="text-xs uppercase tracking-wider">Añadir</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {inspectedStat !== 'Insp' && (
                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex justify-between items-center px-1">
                            <span className="text-xs font-black text-slate-400 uppercase">Total Maximum</span>
                            <span className={`text-2xl font-black ${inspectedStat === 'HP' ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                                {inspectedStat === 'AC' ? armorClass 
                                 : inspectedStat === 'Init' ? formatModifier(initiativeTotal) 
                                 : inspectedStat === 'Spd' ? speedTotal 
                                 : inspectedStat === 'HP' ? character.hp.max 
                                 : inspectedStat?.startsWith('Save_') 
                                    ? formatModifier(getSaveBreakdown(character, inspectedStat.split('_')[1] as Ability, finalStats).reduce((acc, item) => acc + (typeof item.value === 'number' ? item.value : 0), 0))
                                    : 0}
                            </span>
                        </div>
                        )}
                    </div>
                </div>,
                document.body
            )}

            {/* HP Modal */}
            {hpModal.show && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setHpModal({ ...hpModal, show: false })}>
                    <div className="w-full max-w-[280px] bg-white dark:bg-surface-dark p-6 rounded-3xl animate-scaleUp" onClick={e => e.stopPropagation()}>
                        <input type="number" value={hpAmount} onChange={(e) => setHpAmount(e.target.value)} autoFocus className="w-full text-center text-5xl font-black bg-transparent border-b-2 border-slate-200 dark:border-white/10 py-3 mb-8 outline-none text-slate-900 dark:text-white" placeholder="0"/>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setHpModal({ ...hpModal, show: false })} className="py-3 rounded-2xl font-bold text-sm text-slate-500 bg-slate-100 dark:bg-white/5">Cancel</button>
                            <button onClick={applyHpChange} className={`py-3 rounded-2xl font-bold text-sm text-white shadow-lg ${hpModal.type === 'heal' ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-red-500 shadow-red-500/30'}`}>Confirm</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Skill Modal */}
            {selectedSkill && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedSkill(null)}>
                    <div className="w-full max-sm bg-white dark:bg-surface-dark p-6 rounded-3xl animate-scaleUp flex flex-col max-h-[70vh]" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedSkill}</h3>
                                <p className="text-xs font-bold text-primary uppercase tracking-widest">{SKILL_ABILITY_MAP[selectedSkill]} based</p>
                            </div>
                            <button onClick={() => setSelectedSkill(null)} className="size-8 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-4">
                            <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Descripción</span></div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-body">{SKILL_DESCRIPTIONS[selectedSkill || '']}</p>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Weapon Stat Breakdowns */}
            {weaponStatModal && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setWeaponStatModal(null)}>
                    <div className="w-full max-w-[280px] bg-white dark:bg-surface-dark p-6 rounded-3xl animate-scaleUp" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-widest mb-6">
                            {weaponStatModal.type === 'toHit' ? 'Attack Bonus' : 'Damage Bonus'}
                        </h3>
                        <div className="space-y-2">
                            {weaponStatModal.isSpell ? (
                                <>
                                    {weaponStatModal.type === 'toHit' ? (
                                        <>
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-fuchsia-500/5 dark:bg-black/20 border border-fuchsia-500/10">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm text-fuchsia-400">bolt</span>
                                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Charisma (CHA)</span>
                                                </div>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">{formatModifier(chaMod)}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-fuchsia-500/5 dark:bg-black/20 border border-fuchsia-500/10">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm text-fuchsia-400">school</span>
                                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Proficiency</span>
                                                </div>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">+{character.profBonus}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-fuchsia-500/5 dark:bg-black/20 border border-fuchsia-500/10">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm text-fuchsia-400">swords</span>
                                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Spell Slot</span>
                                                </div>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {weaponStatModal.item.isEB ? weaponStatModal.item.die : `${weaponStatModal.item.scale}${weaponStatModal.item.die.startsWith('d') ? weaponStatModal.item.die : weaponStatModal.item.die.substring(1)}`}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-fuchsia-500/5 dark:bg-black/20 border border-fuchsia-500/10">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm text-fuchsia-400">bolt</span>
                                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Explosión Agonizante (CHA)</span>
                                                </div>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">{formatModifier(chaMod)}</span>
                                            </div>
                                            {weaponStatModal.item.isEB && (
                                                <div className="p-2 text-[10px] text-fuchsia-400 font-bold uppercase text-center">
                                                    You attack {weaponStatModal.item.scale} times with this spell
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                (weaponStatModal.type === 'toHit' 
                                    ? getWeaponToHitBreakdown(character, weaponStatModal.item, weaponStatModal.weapon, finalStats)
                                    : getWeaponDamageBreakdown(character, weaponStatModal.item, weaponStatModal.weapon, finalStats, isRaging)
                                ).map((b, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm text-primary">{b.icon}</span>
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{b.label}</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{typeof b.value === 'number' ? formatModifier(b.value) : b.value}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default CombatTab;
