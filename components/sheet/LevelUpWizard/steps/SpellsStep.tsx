import React from 'react';
import { Character } from '../../../../types';
import { METAMAGIC_OPTIONS } from '../../../../Data/characterOptions';
import { UI } from '../../../../constants/ui';

interface SpellsStepProps {
    character: Character;
    nextLevel: number;
    metamagicCount: number;
    selectedMetamagics: string[];
    onMetamagicChange: (metamagics: string[]) => void;
}

const SPELL_CLASSES = ['Bard', 'Cleric', 'Druid', 'Paladin', 'Sorcerer', 'Wizard', 'Artificer', 'Warlock'];

const SpellsStep: React.FC<SpellsStepProps> = ({
    character,
    nextLevel,
    metamagicCount,
    selectedMetamagics,
    onMetamagicChange
}) => {
    const t = UI;
    const isSpellcaster = SPELL_CLASSES.includes(character.class);
    const needsMetamagic = character.class === 'Sorcerer' && (nextLevel === 2 || nextLevel === 10 || nextLevel === 17);

    const toggleMetamagic = (meta: string) => {
        if (selectedMetamagics.includes(meta)) {
            onMetamagicChange(selectedMetamagics.filter(m => m !== meta));
        } else if (selectedMetamagics.length < metamagicCount) {
            onMetamagicChange([...selectedMetamagics, meta]);
        }
    };

    return (
        <div className="flex flex-col h-full p-4">
            <div className="text-center mb-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-white dark:border-surface-dark shadow-lg ${
                    needsMetamagic 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                        : isSpellcaster
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-100 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400'
                }`}>
                    <span className="material-symbols-outlined text-2xl">
                        {needsMetamagic ? 'auto_fix_normal' : isSpellcaster ? 'auto_awesome' : 'menu_book'}
                    </span>
                </div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {needsMetamagic 
                        ? t.metamagic_options || 'Metamagic Options'
                        : isSpellcaster 
                        ? t.spell_slots || 'Spell Progression'
                        : 'Spell Features'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Level {nextLevel}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto">
                {needsMetamagic ? (
                    <div className="space-y-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-4">
                            {nextLevel === 2 
                                ? `Choose ${metamagicCount} Metamagic options`
                                : `Choose 1 Metamagic option`}
                        </p>
                        {METAMAGIC_OPTIONS.map(m => {
                            const isSelected = selectedMetamagics.includes(m.name);
                            const isDisabled = !isSelected && selectedMetamagics.length >= metamagicCount;
                            return (
                                <button
                                    key={m.name}
                                    onClick={() => toggleMetamagic(m.name)}
                                    disabled={isDisabled}
                                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                                        isSelected 
                                            ? 'bg-purple-500/5 border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.2)]' 
                                            : isDisabled 
                                            ? 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 opacity-50 cursor-not-allowed'
                                            : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-white/10 hover:border-purple-500/50'
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`font-bold ${
                                            isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-slate-900 dark:text-white'
                                        }`}>
                                            {m.name}
                                        </span>
                                        {isSelected && (
                                            <span className="material-symbols-outlined text-purple-500 text-base">check_circle</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                                        {m.description}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                ) : isSpellcaster ? (
                    <div className="text-center py-6">
                        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 mx-auto mb-4 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-blue-500">spellcheck</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                            Spell Slot Progression
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Your spell slots have increased to level {Math.min(Math.ceil(nextLevel / 2), 9)}.
                        </p>
                        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                You now have access to higher level spell slots. Visit the <span className="font-bold text-blue-600 dark:text-blue-400">Spells</span> tab to prepare new spells and manage your spellbook.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/50 mx-auto mb-4 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-slate-400">check_circle</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                            No Spell Changes
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Your class does not gain new spell abilities at this level.
                        </p>
                    </div>
                )}
            </div>

            {needsMetamagic && selectedMetamagics.length > 0 && (
                <div className="mt-4 p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider block mb-2">
                        {t.chosen}:
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {selectedMetamagics.map(m => (
                            <span 
                                key={m} 
                                className="px-2 py-1 rounded-md bg-purple-500/20 text-xs font-bold text-purple-600 dark:text-purple-400"
                            >
                                {m}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpellsStep;