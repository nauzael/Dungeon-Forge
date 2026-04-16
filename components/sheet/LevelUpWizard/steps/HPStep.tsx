import React from 'react';
import { Character } from '../../../../types';

interface HPStepProps {
    character: Character;
    nextLevel: number;
    hitDie: number;
    conMod: number;
    hpGain: number;
    hpMethod: 'roll' | 'average';
    rolledValue: number;
    extraHp: number;
    onHpGainChange: (value: number) => void;
    onHpMethodChange: (value: 'roll' | 'average') => void;
    onRolledValueChange: (value: number) => void;
    onExtraHpChange: (value: number) => void;
}

const HPStep: React.FC<HPStepProps> = ({
    character, nextLevel, hitDie, conMod,
    hpGain, hpMethod, rolledValue, extraHp,
    onHpGainChange, onHpMethodChange, onRolledValueChange, onExtraHpChange
}) => {
    const calculatedGain = hpMethod === 'roll'
        ? rolledValue + conMod
        : Math.floor(hitDie / 2) + 1 + conMod;
    
    const totalGain = calculatedGain + extraHp;
    const newMaxHP = character.hp.max + totalGain;

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

                <div className="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-3">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Additional HP Bonus
                    </label>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-2">
                        Auto bonuses (Tough +2, Dwarf +1, Draconic +1) are included above
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={() => onExtraHpChange(Math.max(0, extraHp - 1))}
                            className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-white/10 flex items-center justify-center hover:bg-slate-300 transition-colors"
                        >
                            <span className="material-symbols-outlined text-base">remove</span>
                        </button>
                        <input
                            type="number"
                            min={0}
                            value={extraHp}
                            onChange={(e) => onExtraHpChange(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-16 text-center bg-transparent text-2xl font-bold text-slate-900 dark:text-white outline-none border-b-2 border-slate-300 dark:border-white/30 focus:border-amber-500 transition-colors"
                        />
                        <button
                            onClick={() => onExtraHpChange(extraHp + 1)}
                            className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-white/10 flex items-center justify-center hover:bg-slate-300 transition-colors"
                        >
                            <span className="material-symbols-outlined text-base">add</span>
                        </button>
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
