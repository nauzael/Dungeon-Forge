import React, { useState } from 'react';
import { Character } from '../../types';
import { getFinalStats } from '../../utils/sheetUtils';
import { getRageUses } from '../../utils/rageUtils';
import { FEATURE_USAGE_CONFIGS } from '../../utils/featureUsageConfig';

interface RestModalProps {
    character: Character;
    onComplete: (updatedCharacter: Character) => void;
    onCancel: () => void;
}

const HIT_DICE: Record<string, number> = {
    Barbarian: 12, Fighter: 10, Paladin: 10, Ranger: 10,
    Bard: 8, Cleric: 8, Druid: 8, Monk: 8, Rogue: 8, Warlock: 8, Sorcerer: 6, Wizard: 6
};

const calculateMaxForFeature = (featureName: string, char: Character): number => {
    const config = FEATURE_USAGE_CONFIGS[featureName];
    if (!config) return 0;
    const stats = getFinalStats(char);
    switch (config.maxFormula) {
        case 'WIS': return Math.max(1, Math.floor((stats.WIS - 10) / 2));
        case 'INT': return Math.max(1, Math.floor((stats.INT - 10) / 2));
        case 'CHA': return Math.max(1, Math.floor((stats.CHA - 10) / 2));
        case 'DEX': return Math.max(1, Math.floor((stats.DEX - 10) / 2));
        case 'CON': return Math.max(1, Math.floor((stats.CON - 10) / 2));
        case 'level': return char.level;
        case 'proficiencyBonus': return char.profBonus;
        case '1': return 1;
        default: return 0;
    }
};

const resetFeatureUsages = (char: Character, resetType: 'short_rest' | 'long_rest'): Character => {
    const usages = char.featureUsages || {};
    const updatedUsages: typeof usages = {};
    let hasChanges = false;

    Object.entries(usages).forEach(([name, usage]) => {
        const config = FEATURE_USAGE_CONFIGS[name];
        if (!config) return;

        if (config.resetType === resetType || (resetType === 'long_rest' && config.resetType === 'long_rest')) {
            const newMax = calculateMaxForFeature(name, char);
            updatedUsages[name] = {
                ...usage,
                current: newMax,
                max: newMax,
            };
            hasChanges = true;
        } else {
            updatedUsages[name] = usage;
        }
    });

    return hasChanges ? { ...char, featureUsages: updatedUsages } : char;
};

const RestModal: React.FC<RestModalProps> = ({ character, onComplete, onCancel }) => {
    const [restType, setRestType] = useState<string | null>(null);
    const [diceToSpend, setDiceToSpend] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const dieType = HIT_DICE[character.class] || 8;
    const maxHitDice = character.level;
    const currentHitDice = character.hitDice?.current ?? maxHitDice;
    const spentHitDice = maxHitDice - currentHitDice;
    const stats = getFinalStats(character);
    const conMod = Math.floor(((stats.CON || 10) - 10) / 2);

    const canDoLongRest = true;
    const hoursUntilLongRest = 0;

    const hpRecoveryPerDie = Math.floor(dieType / 2) + 1 + conMod;

    const handleShortRest = () => {
        setIsProcessing(true);
        let updated = { ...character };

        if (diceToSpend > 0 && spentHitDice > 0) {
            const actualDice = Math.min(diceToSpend, spentHitDice);
            const hpRecovered = actualDice * hpRecoveryPerDie;
            updated.hp = {
                ...updated.hp,
                current: Math.min(updated.hp.max, updated.hp.current + hpRecovered)
            };
            updated.hitDice = {
                current: (updated.hitDice?.current ?? maxHitDice) + actualDice,
                max: maxHitDice
            };
        }

        const charClass = character.class;
        if (charClass === 'Barbarian') {
            const rageCurrent = updated.rageUses?.current ?? 0;
            const rageMax = getRageUses(updated.level);
            if (rageCurrent < rageMax) {
                updated.rageUses = { current: Math.min(rageMax, rageCurrent + 1), max: rageMax };
            }
        }
        if (charClass === 'Fighter') updated.secondWind = { current: 1, max: 1 };
        if (charClass === 'Warlock') {
            const pactLevel = updated.pactSlotLevel || 1;
            updated.spellSlots = { ...updated.spellSlots, 5: { current: pactLevel, max: pactLevel } };
        }
        if (charClass === 'Monk') updated.focus = { current: updated.level, max: updated.level };
        if (charClass === 'Cleric' || charClass === 'Paladin') {
            const cdMax = charClass === 'Cleric' ? (updated.level >= 18 ? 3 : updated.level >= 6 ? 2 : 1) : (updated.level >= 11 ? 3 : updated.level >= 7 ? 2 : 1);
            updated.channelDivinity = { current: Math.min(cdMax, (updated.channelDivinity?.current ?? 0) + 1), max: cdMax };
        }
        if (charClass === 'Bard' && updated.level >= 5) {
            const chaMod = Math.max(1, Math.floor(((stats.CHA || 10) - 10) / 2));
            updated.bardicInspiration = { current: chaMod, max: chaMod };
        }
        if (charClass === 'Druid') {
            const wsMax = updated.level >= 15 ? 4 : updated.level >= 6 ? 3 : 2;
            updated.wildShape = { current: Math.min(wsMax, (updated.wildShape?.current ?? 0) + 1), max: wsMax };
        }

        updated = resetFeatureUsages(updated, 'short_rest');

        setTimeout(() => {
            setIsProcessing(false);
            onComplete(updated);
        }, 300);
    };

    const handleLongRest = () => {
        setIsProcessing(true);

        let updated = { ...character };
        updated.hp = { current: updated.hp.max, max: updated.hp.max, temp: 0 };

        const recoveredDice = spentHitDice > 0 ? Math.max(1, Math.floor(spentHitDice / 2)) : 0;
        updated.hitDice = {
            current: Math.min(maxHitDice, (updated.hitDice?.current ?? maxHitDice) + recoveredDice),
            max: maxHitDice
        };

        const charClass = character.class;
        if (charClass === 'Barbarian') {
            const rageMax = getRageUses(updated.level);
            updated.rageUses = { current: rageMax, max: rageMax };
        }
        if (charClass === 'Bard') {
            const chaMod = Math.max(1, Math.floor(((stats.CHA || 10) - 10) / 2));
            updated.bardicInspiration = { current: chaMod, max: chaMod };
        }
        if (charClass === 'Cleric' || charClass === 'Paladin') {
            const cdMax = charClass === 'Cleric' ? (updated.level >= 18 ? 3 : updated.level >= 6 ? 2 : 1) : (updated.level >= 11 ? 3 : updated.level >= 7 ? 2 : 1);
            updated.channelDivinity = { current: cdMax, max: cdMax };
        }
        if (charClass === 'Paladin') updated.layOnHands = { current: updated.level * 5, max: updated.level * 5 };
        if (charClass === 'Fighter') {
            updated.actionSurge = { current: updated.level >= 17 ? 2 : 1, max: updated.level >= 17 ? 2 : 1 };
            updated.secondWind = { current: 1, max: 1 };
            if (updated.level >= 9) updated.indomitable = { current: updated.level >= 17 ? 3 : updated.level >= 13 ? 2 : 1, max: updated.level >= 17 ? 3 : updated.level >= 13 ? 2 : 1 };
        }
        if (charClass === 'Monk') updated.focus = { current: updated.level, max: updated.level };
        if (charClass === 'Druid') {
            const wsMax = updated.level >= 15 ? 4 : updated.level >= 6 ? 3 : 2;
            updated.wildShape = { current: wsMax, max: wsMax };
        }
        if (charClass === 'Sorcerer' && updated.level >= 2) {
            updated.sorceryPoints = { current: updated.level, max: updated.level };
            updated.innateSorcery = { current: 2, max: 2 };
        }
        if (charClass === 'Ranger') {
            const hmMax = updated.level >= 17 ? 6 : updated.level >= 13 ? 5 : updated.level >= 9 ? 4 : updated.level >= 5 ? 3 : 2;
            updated.hunterMarkUses = { current: hmMax, max: hmMax };
        }

        updated = resetFeatureUsages(updated, 'long_rest');

        updated.lastLongRest = Date.now();
        updated.activeConcentration = undefined;

        setTimeout(() => {
            setIsProcessing(false);
            onComplete(updated);
        }, 300);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 dark:bg-black/60 flex items-end sm:items-center justify-center animate-fadeIn backdrop-blur-sm">
            <div className="w-full sm:max-w-lg bg-white dark:bg-[#0f1525] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[95vh] sm:max-h-[85vh] flex flex-col animate-slideUp overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/10 shrink-0">
                    <button onClick={onCancel} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">close</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Rest</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{character.name}</span>
                    </div>
                    <div className="w-10" />
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {!restType && (
                        <>
                            <button onClick={() => setRestType('short')} className="w-full p-4 rounded-2xl border-2 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all text-left">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-2xl text-amber-500">hourglass_bottom</span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">Short Rest</span>
                                    <span className="text-xs text-slate-500 ml-auto">1 hour</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Spend Hit Dice to recover HP. Recover some class resources.
                                    {character.class === 'Barbarian' && ' Barbarians recover 1 Rage charge.'}
                                </p>
                            </button>
                            
                            <button onClick={() => canDoLongRest && setRestType('long')} disabled={!canDoLongRest} className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${canDoLongRest ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 opacity-50 cursor-not-allowed'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-2xl text-emerald-500">bedtime</span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">Long Rest</span>
                                    <span className="text-xs text-slate-500 ml-auto">8 hours</span>
                                </div>
                                {!canDoLongRest && <p className="text-sm text-slate-500">Available in {Math.ceil(hoursUntilLongRest)} hours</p>}
                                {canDoLongRest && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Recover all HP, half Hit Dice, and all resources.
                                        {character.class === 'Barbarian' && ' All Rage charges are restored.'}
                                    </p>
                                )}
                            </button>
                        </>
                    )}
                    
                    {restType === 'short' && (
                        <div className="space-y-4">
                            <button onClick={() => setRestType(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                                <span className="material-symbols-outlined text-sm">arrow_back</span> Back
                            </button>
                            
                            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="material-symbols-outlined text-amber-500">hourglass_bottom</span>
                                    <span className="font-bold text-slate-900 dark:text-white">Short Rest</span>
                                </div>
                                
                                {spentHitDice > 0 ? (
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Hit Dice to Spend</span>
                                            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{spentHitDice} available</span>
                                        </div>
                                        <input type="range" min={0} max={spentHitDice} value={diceToSpend} onChange={(e) => setDiceToSpend(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500" />
                                        <div className="flex justify-between mt-1 text-xs text-slate-500">
                                            <span>0</span>
                                            <span>{diceToSpend} dice</span>
                                            <span>{spentHitDice}</span>
                                        </div>
                                        {diceToSpend > 0 && (
                                            <div className="mt-2 p-2 rounded-xl bg-amber-500/10 text-sm text-slate-700 dark:text-slate-300">
                                                HP Recovery: +{diceToSpend * hpRecoveryPerDie} ({diceToSpend}d{dieType} + {conMod} CON)
                                            </div>
                                        )}
                                        {character.class === 'Barbarian' && (
                                            <div className="mt-2 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-slate-700 dark:text-slate-300">
                                                🔥 Rage Recovery: +1 charge
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mb-4 p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-sm text-slate-500">No Hit Dice spent</div>
                                )}
                            </div>
                            
                            <button onClick={handleShortRest} disabled={isProcessing} className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 transition-all">
                                {isProcessing ? 'Resting...' : 'Take Short Rest'}
                            </button>
                        </div>
                    )}
                    
                    {restType === 'long' && (
                        <div className="space-y-4">
                            <button onClick={() => setRestType(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                                <span className="material-symbols-outlined text-sm">arrow_back</span> Back
                            </button>
                            
                            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="material-symbols-outlined text-emerald-500">bedtime</span>
                                    <span className="font-bold text-slate-900 dark:text-white">Long Rest</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Recover all HP ({character.hp.current}/{character.hp.max}), {Math.max(1, Math.floor(spentHitDice / 2))} Hit Dice, and all resources.</p>
                            </div>
                            
                            <button onClick={handleLongRest} disabled={isProcessing || !canDoLongRest} className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 transition-all">
                                {isProcessing ? 'Resting...' : 'Take Long Rest'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestModal;
