import React, { useState, useMemo } from 'react';
import { Character } from '../../../../../types';
import { SPELL_DETAILS } from '../../../../../Data/spells';

interface MagicalSecretsStepProps {
    character: Character;
    /** Title displayed at the top */
    title: string;
    /** How many spells to select */
    spellCount: number;
    /** Maximum spell level allowed */
    maxSpellLevel: number;
    /** Feature name for display */
    featureName: string;
    selectedSpells: string[];
    onSpellsChange: (spells: string[]) => void;
}

const MagicalSecretsStep: React.FC<MagicalSecretsStepProps> = ({
    character,
    title,
    spellCount,
    maxSpellLevel,
    featureName,
    selectedSpells,
    onSpellsChange,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevel, setSelectedLevel] = useState(0);

    // All spells up to maxSpellLevel, excluding ones the character already knows
    const availableSpells = useMemo(() => {
        const knownSpells = new Set([
            ...(character.preparedSpells || []),
            ...(character.savantSpells || []),
            ...(character.wizard?.spellbook || []),
        ]);
        return Object.entries(SPELL_DETAILS)
            .filter(([name, detail]) => {
                if (knownSpells.has(name)) return false;
                if (detail.level < 1 || detail.level > maxSpellLevel) return false;
                return true;
            })
            .map(([name]) => name)
            .sort();
    }, [character, maxSpellLevel]);

    const filteredSpells = useMemo(() => {
        let spells = availableSpells;
        if (selectedLevel > 0) {
            spells = spells.filter(s => SPELL_DETAILS[s]?.level === selectedLevel);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            spells = spells.filter(s => s.toLowerCase().includes(q));
        }
        return spells;
    }, [availableSpells, selectedLevel, searchQuery]);

    const toggleSpell = (spell: string) => {
        if (selectedSpells.includes(spell)) {
            onSpellsChange(selectedSpells.filter(s => s !== spell));
        } else if (selectedSpells.length < spellCount) {
            onSpellsChange([...selectedSpells, spell]);
        }
    };

    // Determine available levels for filter buttons
    const availableLevels = [...new Set(availableSpells.map(s => SPELL_DETAILS[s]?.level).filter(Boolean))].sort((a, b) => a - b);

    return (
        <div className="flex flex-col h-full p-4">
            {/* Header */}
            <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-radius-pill flex items-center justify-center mx-auto mb-2 border-4 border-white dark:border-surface-dark shadow-elev-modal bg-gradient-to-br from-fuchsia-100 to-purple-100 dark:from-fuchsia-900/30 dark:to-purple-900/30 text-fuchsia-600 dark:text-fuchsia-400">
                    <span className="material-symbols-outlined text-2xl">auto_awesome_mosaic</span>
                </div>
                <h2 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>
                    {title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="font-bold text-fuchsia-500">{featureName}</span>
                    {' — '}Choose <span className="font-bold">{spellCount}</span> spell{spellCount > 1 ? 's' : ''} from any class (up to level {maxSpellLevel})
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-center text-xs">
                <div className="bg-slate-100 dark:bg-white/5 rounded-radius-sm p-2">
                    <div className="font-bold text-fuchsia-500">{selectedSpells.length}/{spellCount}</div>
                    <div className="text-slate-500 text-[10px] mt-1">Selected</div>
                </div>
                <div className="bg-slate-100 dark:bg-white/5 rounded-radius-sm p-2">
                    <div className="font-bold text-slate-700 dark:text-slate-300">{availableSpells.length}</div>
                    <div className="text-slate-500 text-[10px] mt-1">Available</div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-3 space-y-2">
                <input
                    type="text"
                    placeholder="Search spells..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-white/10 text-sm rounded-radius-sm border border-slate-200 dark:border-white/10 focus:outline-none"
                    style={{color: 'var(--color-text-primary)'}}
                />
                <div className="flex gap-1 overflow-x-auto pb-1">
                    <button
                        onClick={() => setSelectedLevel(0)}
                        className={`px-3 py-1 text-xs rounded-radius-sm whitespace-nowrap transition ${
                            selectedLevel === 0
                                ? 'bg-fuchsia-600 text-white'
                                : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20'
                        }`}
                    >
                        All Levels
                    </button>
                    {availableLevels.map(level => (
                        <button
                            key={level}
                            onClick={() => setSelectedLevel(selectedLevel === level ? 0 : level)}
                            className={`px-3 py-1 text-xs rounded-radius-sm whitespace-nowrap transition ${
                                selectedLevel === level
                                    ? 'bg-fuchsia-600 text-white'
                                    : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20'
                            }`}
                        >
                            Lvl {level}
                        </button>
                    ))}
                </div>
            </div>

            {/* Spell List */}
            <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-white/10 rounded-radius-sm bg-white dark:bg-[#1a2235]">
                {filteredSpells.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-sm">No spells match your criteria.</div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {filteredSpells.map(spellName => {
                            const detail = SPELL_DETAILS[spellName];
                            const isSelected = selectedSpells.includes(spellName);

                            return (
                                <button
                                    key={spellName}
                                    onClick={() => toggleSpell(spellName)}
                                    disabled={!isSelected && selectedSpells.length >= spellCount}
                                    className={`w-full text-left px-3 py-2 transition ${
                                        isSelected
                                            ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 border-l-2 border-fuchsia-500'
                                            : 'hover:bg-slate-50 dark:hover:bg-white/5'
                                    } ${selectedSpells.length >= spellCount && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-sm" style={{color: 'var(--color-text-primary)'}}>{spellName}</div>
                                            {detail && (
                                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                                    Level {detail.level} • {detail.school || 'Unknown'}
                                                </div>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <span className="material-symbols-outlined text-fuchsia-500 text-lg flex-shrink-0">
                                                check_circle
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="mt-2 text-xs text-center text-slate-500 dark:text-slate-400">
                {selectedSpells.length} / {spellCount} selected
            </div>
        </div>
    );
};

export default MagicalSecretsStep;
