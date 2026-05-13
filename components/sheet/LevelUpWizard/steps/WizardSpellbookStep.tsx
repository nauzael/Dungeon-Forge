import React, { useState, useMemo } from 'react';
import { Character } from '../../../../types';
import { SPELL_DETAILS, getWizardAvailableSpells } from '../../../../Data/spells';
import { getWizardSpellbookByLevel, getWizardSpellsToLearnOnLevelUp, getWizardMaxSpellLevel } from '../../../../utils/sheetUtils';
import { UI } from '../../../../constants/ui';

interface WizardSpellbookStepProps {
    character: Character;
    currentLevel: number;
    nextLevel: number;
    newSpellsLearned: string[];
    onSpellsChange: (spells: string[]) => void;
}

const WizardSpellbookStep: React.FC<WizardSpellbookStepProps> = ({
    character,
    currentLevel,
    nextLevel,
    newSpellsLearned,
    onSpellsChange,
}) => {
    const t = UI;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevel, setSelectedLevel] = useState(0);

    // Calculate how many spells can be learned
    const currentSpellbook = character.wizard?.spellbook || [];
    const nonCantripSpells = useMemo(() => {
        return currentSpellbook.filter(s => {
            const detail = SPELL_DETAILS[s];
            return detail && detail.level > 0;
        }).length;
    }, [currentSpellbook]);
    const maxAtCurrentLevel = getWizardSpellbookByLevel(currentLevel);
    const maxAtNextLevel = getWizardSpellbookByLevel(nextLevel);
    const maxSpellLevelAtNextLevel = getWizardMaxSpellLevel(nextLevel);
    const spellSlots = getWizardSpellsToLearnOnLevelUp(currentLevel, nextLevel, nonCantripSpells);

    // Available spells for learning
    const availableToLearn = useMemo(() => {
        return getWizardAvailableSpells(undefined, [...currentSpellbook, ...newSpellsLearned], maxSpellLevelAtNextLevel);
    }, [currentSpellbook, newSpellsLearned, maxSpellLevelAtNextLevel]);

    // Filter spells for display
    const filteredSpells = useMemo(() => {
        let spells = availableToLearn;

        if (selectedLevel > 0) {
            spells = spells.filter(s => {
                const detail = SPELL_DETAILS[s];
                return detail && detail.level === selectedLevel;
            });
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            spells = spells.filter(s => s.toLowerCase().includes(query));
        }

        return spells;
    }, [availableToLearn, selectedLevel, searchQuery]);

    const toggleSpell = (spellName: string) => {
        if (newSpellsLearned.includes(spellName)) {
            onSpellsChange(newSpellsLearned.filter(s => s !== spellName));
        } else if (newSpellsLearned.length < spellSlots.available) {
            onSpellsChange([...newSpellsLearned, spellName]);
        }
    };

    return (
        <div className="flex flex-col h-full p-4">
            {/* Header */}
            <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-white dark:border-surface-dark shadow-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <span className="material-symbols-outlined text-2xl">library_books</span>
                </div>
                <h2 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>
                    Learn New Spells
                </h2>
                <p className="text-sm text-gray-400 mt-2">
                    Choose up to <span className="font-bold text-blue-400">{spellSlots.available}</span> new spells for your grimoire
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
                <div className="bg-gray-800 rounded p-2">
                    <div className="font-bold text-blue-400">{currentSpellbook.length}/{maxAtCurrentLevel}</div>
                    <div className="text-gray-500 text-[10px] mt-1">Current</div>
                </div>
                <div className="bg-gray-800 rounded p-2">
                    <div className="font-bold text-green-400">+{spellSlots.available}</div>
                    <div className="text-gray-500 text-[10px] mt-1">Available</div>
                </div>
                <div className="bg-gray-800 rounded p-2">
                    <div className="font-bold text-yellow-400">{currentSpellbook.length + newSpellsLearned.length}/{maxAtNextLevel}</div>
                    <div className="text-gray-500 text-[10px] mt-1">After Level</div>
                </div>
            </div>

            {spellSlots.available === 0 ? (
                <div className="text-center text-gray-400 text-sm py-8">
                    No new spells to learn at this level.
                </div>
            ) : (
                <>
                    {/* Filters */}
                    <div className="mb-4 space-y-2">
                        <input
                            type="text"
                            placeholder="Search spells..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                        />

                        <div className="flex gap-1 overflow-x-auto pb-2">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                                <button
                                    key={level}
                                    onClick={() => setSelectedLevel(level === selectedLevel ? 0 : level)}
                                    className={`px-3 py-1 text-xs rounded whitespace-nowrap transition ${
                                        selectedLevel === level
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    {level === 0 ? 'All' : `Lvl ${level}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Spell List */}
                    <div className="flex-1 overflow-y-auto border border-gray-700 rounded bg-gray-900">
                        {filteredSpells.length === 0 ? (
                            <div className="p-4 text-center text-gray-400 text-sm">No spells match your criteria.</div>
                        ) : (
                            <div className="divide-y divide-gray-700">
                                {filteredSpells.map(spellName => {
                                    const detail = SPELL_DETAILS[spellName];
                                    const isSelected = newSpellsLearned.includes(spellName);

                                    return (
                                        <button
                                            key={spellName}
                                            onClick={() => toggleSpell(spellName)}
                                            disabled={!isSelected && newSpellsLearned.length >= spellSlots.available}
                                            className={`w-full text-left px-3 py-2 transition ${
                                                isSelected
                                                    ? 'bg-blue-600/30 border-l-2 border-blue-500'
                                                    : 'hover:bg-gray-800'
                                            } ${newSpellsLearned.length >= spellSlots.available && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-sm">{spellName}</div>
                                                    {detail && (
                                                        <div className="text-xs text-gray-400">
                                                            Level {detail.level} • {detail.school || 'Unknown'}
                                                        </div>
                                                    )}
                                                </div>
                                                {isSelected && (
                                                    <span className="material-symbols-outlined text-blue-400 text-lg flex-shrink-0">
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

                    {/* Selected count */}
                    <div className="mt-2 text-xs text-center text-gray-400">
                        {newSpellsLearned.length} / {spellSlots.available} spells selected
                    </div>
                </>
            )}
        </div>
    );
};

export default WizardSpellbookStep;
