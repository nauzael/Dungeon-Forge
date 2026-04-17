import React from 'react';
import { Character } from '../../../../types';
import { getItemHpBonusesPerLevel, getItemHpBonusesOneTime } from '../../../../utils/sheetUtils';

interface HPStepProps {
    character: Character;
    nextLevel: number;
    hitDie: number;
    conMod: number;
    hpGain: number;
    hpMethod: 'roll' | 'average';
    rolledValue: number;
    onHpGainChange: (value: number) => void;
    onHpMethodChange: (value: 'roll' | 'average') => void;
    onRolledValueChange: (value: number) => void;
}

const HPStep: React.FC<HPStepProps> = ({
    character, nextLevel, hitDie, conMod,
    hpGain, hpMethod, rolledValue,
    onHpGainChange, onHpMethodChange, onRolledValueChange
}) => {
    const calculatedGain = hpMethod === 'roll'
        ? rolledValue + conMod
        : Math.floor(hitDie / 2) + 1 + conMod;
    
    const totalGain = calculatedGain;
    const newMaxHP = character.hp.max + totalGain;

    // Calculate active bonuses (now including items)
    const avgRoll = Math.floor(hitDie / 2) + 1;
    const hasTough = character.feats?.includes('Tough') || character.feats?.includes('Duro');
    const isDwarf = character.species === 'Dwarf';
    const isDraconic = character.subclass === 'Draconic Sorcery';
    
    const itemBonusPerLevel = getItemHpBonusesPerLevel(character);
    const itemBonusOneTime = getItemHpBonusesOneTime(character);
    
    const activeBonuses: { label: string; value: number; icon: string; type: 'per-level' | 'one-time' }[] = [];
    
    // Per-level bonuses
    if (hasTough) activeBonuses.push({ label: 'Tough Feat', value: 2, icon: 'military_tech', type: 'per-level' });
    if (isDwarf) activeBonuses.push({ label: 'Dwarven Toughness', value: 1, icon: 'face', type: 'per-level' });
    if (isDraconic) activeBonuses.push({ label: 'Draconic Resilience', value: 1, icon: 'auto_awesome', type: 'per-level' });
    if (itemBonusPerLevel > 0) activeBonuses.push({ label: `Equipped Items (per level)`, value: itemBonusPerLevel, icon: 'diamond', type: 'per-level' });
    
    // One-time bonuses
    if (itemBonusOneTime > 0) activeBonuses.push({ label: `Equipped Items (one-time)`, value: itemBonusOneTime, icon: 'diamond', type: 'one-time' });

    return (
        <div className="flex flex-col h-full p-4 overflow-y-auto no-scrollbar">
            <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-2 border border-white dark:border-white/20 shadow-sm">
                    <span className="material-symbols-outlined text-2xl">favorite</span>
                </div>
                <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                    Hit Points
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Level {nextLevel}
                </p>
            </div>

            <div className="space-y-3">
                <div className="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                    <button
                        onClick={() => onHpMethodChange('average')}
                        className={`w-full p-3 text-left transition-all ${
                            hpMethod === 'average'
                                ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500'
                                : 'hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                hpMethod === 'average'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                            }`}>
                                <span className="material-symbols-outlined text-lg">analytics</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-slate-900 dark:text-white text-sm">
                                    Use Average
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Recommended
                                </p>
                            </div>
                            {hpMethod === 'average' && (
                                <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                            )}
                        </div>
                        <div className="mt-2 pl-12 text-xs text-slate-600 dark:text-slate-300">
                            <span className="font-mono bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded">
                                {Math.floor(hitDie / 2) + 1}
                            </span>
                            {' '}HD +{' '}
                            <span className="font-mono bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded">
                                {conMod >= 0 ? '+' : ''}{conMod}
                            </span>
                            {' CON'}
                        </div>
                    </button>

                    <div className="border-t border-slate-200 dark:border-white/10" />

                    <button
                        onClick={() => onHpMethodChange('roll')}
                        className={`w-full p-3 text-left transition-all ${
                            hpMethod === 'roll'
                                ? 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500'
                                : 'hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                hpMethod === 'roll'
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                            }`}>
                                <span className="material-symbols-outlined text-lg">casino</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-slate-900 dark:text-white text-sm">
                                    Roll My Own
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Roll your hit die
                                </p>
                            </div>
                            {hpMethod === 'roll' && (
                                <span className="material-symbols-outlined text-purple-500 text-lg">check_circle</span>
                            )}
                        </div>
                        {hpMethod === 'roll' && (
                            <div className="mt-3 space-y-2">
                                <div className="flex items-center justify-center gap-3">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onRolledValueChange(Math.max(1, rolledValue - 1)); }}
                                        className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-white/10 flex items-center justify-center hover:bg-slate-300"
                                    >
                                        <span className="material-symbols-outlined text-sm">remove</span>
                                    </button>
                                    <input
                                        type="number"
                                        min={1}
                                        max={hitDie}
                                        value={rolledValue}
                                        onChange={(e) => onRolledValueChange(Math.max(1, Math.min(hitDie, parseInt(e.target.value) || 1)))}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-14 h-10 text-center bg-white dark:bg-black/20 border border-slate-300 dark:border-white/20 rounded-lg font-mono text-lg font-bold text-slate-900 dark:text-white outline-none focus:border-purple-500"
                                    />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onRolledValueChange(Math.min(hitDie, rolledValue + 1)); }}
                                        className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-white/10 flex items-center justify-center hover:bg-slate-300"
                                    >
                                        <span className="material-symbols-outlined text-sm">add</span>
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                                    Roll: {rolledValue} + CON {conMod >= 0 ? '+' : ''}{conMod} = {rolledValue + conMod}
                                </p>
                            </div>
                        )}
                    </button>
                </div>

                <div className="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-4 space-y-3">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            📊 HP Calculation Breakdown
                        </label>
                        
                        {/* Base components */}
                        <div className="bg-white dark:bg-white/5 rounded-lg p-2.5 space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 dark:text-slate-300">Base Gain (Hit Die)</span>
                                <span className="font-mono bg-slate-100 dark:bg-white/10 px-2 py-1 rounded text-slate-900 dark:text-white font-bold">
                                    {avgRoll}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 dark:text-slate-300">CON Modifier</span>
                                <span className="font-mono bg-slate-100 dark:bg-white/10 px-2 py-1 rounded text-slate-900 dark:text-white font-bold">
                                    {conMod >= 0 ? '+' : ''}{conMod}
                                </span>
                            </div>
                        </div>
                        
                        {/* Automatic bonuses per level */}
                        {activeBonuses.filter(b => b.type === 'per-level').length > 0 && (
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2.5 space-y-1.5">
                                <p className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wide">
                                    ✓ Automatic Bonuses (per level)
                                </p>
                                {activeBonuses.filter(b => b.type === 'per-level').map((bonus, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm text-green-600 dark:text-green-400">
                                                {bonus.icon}
                                            </span>
                                            <span className="text-slate-700 dark:text-slate-200">{bonus.label}</span>
                                        </div>
                                        <span className="font-mono bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded text-green-700 dark:text-green-300 font-bold">
                                            +{bonus.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* One-time bonuses from items */}
                        {activeBonuses.filter(b => b.type === 'one-time').length > 0 && (
                            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2.5 space-y-1.5">
                                <p className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                                    🎁 Item Bonuses (one-time)
                                </p>
                                {activeBonuses.filter(b => b.type === 'one-time').map((bonus, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm text-amber-600 dark:text-amber-400">
                                                {bonus.icon}
                                            </span>
                                            <span className="text-slate-700 dark:text-slate-200">{bonus.label}</span>
                                        </div>
                                        <span className="font-mono bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded text-amber-700 dark:text-amber-300 font-bold">
                                            +{bonus.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Total with all bonuses */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5 border border-blue-200 dark:border-blue-800">
                            <div className="flex justify-between items-center text-xs mb-1">
                                <span className="text-slate-600 dark:text-slate-300 font-medium">
                                    Subtotal This Level
                                </span>
                                <span className="font-mono bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded text-blue-700 dark:text-blue-300 font-bold">
                                    {calculatedGain}
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                = {hpMethod === 'roll' ? rolledValue : avgRoll} (die) {conMod >= 0 ? '+' : ''} {Math.abs(conMod)} (CON)
                                {activeBonuses.filter(b => b.type === 'per-level').length > 0 && ` + bonuses`}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 rounded-xl border border-green-500/30 p-3 text-center">
                    <p className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">
                        NEW MAX HP
                    </p>
                    <p className="text-2xl font-black text-green-600 dark:text-green-400">
                        {newMaxHP}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        was {character.hp.max} (+{totalGain})
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HPStep;
