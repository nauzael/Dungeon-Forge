import React, { useMemo, useState } from 'react';
import { Character, SpellDetail } from '../../../../types';
import { SPELL_DETAILS } from '../../../../Data/spells';
import { UI } from '../../../../constants/ui';

interface SchoolSavantStepProps {
    character: Character;
    subclassName: string;
    savantFeatureName: string;
    spellCount: number;
    maxSpellLevel: number;
    selectedSpells: string[];
    onSpellsChange: (spells: string[]) => void;
    schoolName: string;
}

const SchoolSavantStep: React.FC<SchoolSavantStepProps> = ({
    character,
    subclassName,
    savantFeatureName,
    spellCount,
    maxSpellLevel,
    selectedSpells,
    onSpellsChange,
    schoolName
}) => {
    const { t } = useLanguage();
    const [filterLevel, setFilterLevel] = useState<number>(0);

    const allSpells = useMemo(() => {
        const spells: { name: string; detail: SpellDetail }[] = [];

        Object.entries(SPELL_DETAILS).forEach(([name, detail]) => {
            if (detail.school?.toLowerCase().includes(schoolName.toLowerCase()) && detail.level <= maxSpellLevel) {
                spells.push({ name, detail });
            }
        });

        return spells.sort((a, b) => a.detail.level - b.detail.level);
    }, [maxSpellLevel, schoolName]);

    const filteredSpells = useMemo(() => {
        if (filterLevel === 0) return allSpells;
        return allSpells.filter(s => s.detail.level === filterLevel);
    }, [allSpells, filterLevel]);

    const toggleSpell = (spellName: string) => {
        if (selectedSpells.includes(spellName)) {
            onSpellsChange(selectedSpells.filter(s => s !== spellName));
        } else if (selectedSpells.length < spellCount) {
            onSpellsChange([...selectedSpells, spellName]);
        }
    };

    const levelFilters = [0, ...Array.from({ length: maxSpellLevel }, (_, i) => i + 1)];

    return (
        <div className="flex flex-col h-full p-4">
            <div className="text-center mb-4 shrink-0">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-white dark:border-surface-dark shadow-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    <span className="material-symbols-outlined text-2xl">auto_fix_normal</span>
                </div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {savantFeatureName}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Choose {spellCount} Illusion spell{spellCount > 1 ? 's' : ''} (level {maxSpellLevel} or lower)
                </p>
            </div>

            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 shrink-0 no-scrollbar">
                {levelFilters.map(level => (
                    <button
                        key={level}
                        onClick={() => setFilterLevel(level)}
                        className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                            filterLevel === level
                                ? 'bg-purple-500 text-white'
                                : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20'
                        }`}
                    >
                        {level === 0 ? 'All' : level === 0 ? 'Cantrip' : `Lv ${level}`}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
                {filteredSpells.map(({ name, detail }) => {
                    const isSelected = selectedSpells.includes(name);
                    const isDisabled = !isSelected && selectedSpells.length >= spellCount;
                    const isAlreadyKnown = character.preparedSpells?.includes(name);

                    return (
                        <button
                            key={name}
                            onClick={() => toggleSpell(name)}
                            disabled={isDisabled || isAlreadyKnown}
                            className={`w-full p-3 rounded-xl border text-left transition-all ${
                                isSelected
                                    ? 'bg-purple-500/10 border-purple-500 shadow-[0_0_10px_rgba(147,51,234,0.15)]'
                                    : isDisabled
                                    ? 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 opacity-50 cursor-not-allowed'
                                    : isAlreadyKnown
                                    ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30 opacity-60'
                                    : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-white/10 hover:border-purple-500/50'
                            }`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold text-sm ${
                                        isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-slate-900 dark:text-white'
                                    }`}>
                                        {name}
                                    </span>
                                    {detail.level === 0 ? (
                                        <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded">
                                            Cantrip
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                                            Lv {detail.level}
                                        </span>
                                    )}
                                    {isAlreadyKnown && (
                                        <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                                            Known
                                        </span>
                                    )}
                                </div>
                                {isSelected && (
                                    <span className="material-symbols-outlined text-purple-500 text-lg">check_circle</span>
                                )}
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                                {detail.description?.split('\n')[0]}
                            </p>
                        </button>
                    );
                })}

                {filteredSpells.length === 0 && (
                    <div className="text-center py-8">
                        <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-white/20 mb-2">search_off</span>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            No Illusion spells found at this level
                        </p>
                    </div>
                )}
            </div>

            {selectedSpells.length > 0 && (
                <div className="mt-3 p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 shrink-0">
                    <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider block mb-2">
                        {t.chosen || 'Selected'} ({selectedSpells.length}/{spellCount}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {selectedSpells.map(spell => (
                            <span
                                key={spell}
                                className="px-2 py-1 rounded-md bg-purple-500/20 text-xs font-bold text-purple-600 dark:text-purple-400"
                            >
                                {spell}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolSavantStep;
