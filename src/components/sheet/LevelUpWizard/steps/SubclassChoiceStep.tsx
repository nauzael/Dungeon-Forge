import React from 'react';
import { Character } from '../../../../../types';

export interface SubclassChoiceGroup {
    label: string;
    options: string[];
    count: number;
    /** When true, the chosen skills also gain Expertise */
    alsoExpertise?: boolean;
    /** When true, filter out skills the character already has */
    excludeKnown?: boolean;
    icon?: string;
}

interface SubclassChoiceStepProps {
    character: Character;
    choices: SubclassChoiceGroup[];
    selections: string[][];
    onSelectionsChange: (selections: string[][]) => void;
}

const SubclassChoiceStep: React.FC<SubclassChoiceStepProps> = ({
    character,
    choices,
    selections,
    onSelectionsChange,
}) => {
    const isReady = choices.every((choice, idx) => {
        const sel = selections[idx] || [];
        return sel.length === choice.count;
    });

    const toggleOption = (groupIdx: number, option: string) => {
        const choice = choices[groupIdx];
        const current = [...(selections[groupIdx] || [])];

        if (current.includes(option)) {
            current.splice(current.indexOf(option), 1);
        } else if (current.length < choice.count) {
            current.push(option);
        } else {
            return;
        }

        const newSelections = [...selections];
        newSelections[groupIdx] = current;
        onSelectionsChange(newSelections);
    };

    return (
        <div className="flex flex-col h-full p-5">
            <div className="text-center mb-5">
                <div className="w-16 h-16 rounded-radius-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-3 border-2 border-white dark:border-white/20 shadow-elev-modal">
                    <span className="material-symbols-outlined text-3xl">auto_awesome</span>
                </div>
                <h2 className="text-xl font-black tracking-tight" style={{color: 'var(--color-text-primary)'}}>
                    Subclass Features
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Choose your subclass options
                </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar">
                {choices.map((choice, groupIdx) => {
                    const currentSelections = selections[groupIdx] || [];
                    const remaining = choice.count - currentSelections.length;

                    // Filter out skills the character already has if excludeKnown is set
                    let filteredOptions = choice.options;
                    if (choice.excludeKnown) {
                        filteredOptions = filteredOptions.filter(opt =>
                            !((character.skills || []).includes(opt) && opt !== '...')
                        );
                    }

                    return (
                        <div key={groupIdx} className="space-y-3">
                            <div className="flex items-center gap-2">
                                {choice.icon && (
                                    <span className="material-symbols-outlined text-lg text-purple-500">{choice.icon}</span>
                                )}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                        {choice.label}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {remaining > 0
                                            ? `Choose ${choice.count} option${choice.count > 1 ? 's' : ''} (${remaining} remaining)`
                                            : 'Selection complete'}
                                    </p>
                                </div>
                            </div>

                            {choice.alsoExpertise && currentSelections.length > 0 && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-radius-md p-2 text-xs text-blue-700 dark:text-blue-300">
                                    <span className="material-symbols-outlined text-xs align-middle">info</span>
                                    {' '}You gain Expertise in the selected skill{currentSelections.length > 1 ? 's' : ''}
                                </div>
                            )}

                            <div className="space-y-2">
                                {filteredOptions.map((option) => {
                                    const isSelected = currentSelections.includes(option);
                                    const isMaxed = !isSelected && currentSelections.length >= choice.count;

                                    return (
                                        <button
                                            key={option}
                                            onClick={() => toggleOption(groupIdx, option)}
                                            disabled={isMaxed}
                                            className={`w-full text-left px-4 py-3 rounded-radius-lg border-2 transition-all ${
                                                isSelected
                                                    ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500'
                                                    : isMaxed
                                                    ? 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 opacity-40 cursor-not-allowed'
                                                    : 'bg-white dark:bg-[#1a2235] border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-700'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-sm" style={{color: 'var(--color-text-primary)'}}>
                                                    {option}
                                                </span>
                                                {isSelected && (
                                                    <span className="material-symbols-outlined text-purple-500 text-xl">check_circle</span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {currentSelections.length > 0 && (
                                <p className="text-xs text-green-600 dark:text-green-400 text-center">
                                    ✓ Selected: {currentSelections.join(', ')}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {!isReady && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-radius-md text-xs text-blue-700 dark:text-blue-300">
                    <span className="material-symbols-outlined text-sm align-middle">info</span>
                    {' '}
                    Complete all selections to continue.
                </div>
            )}
        </div>
    );
};

export default SubclassChoiceStep;
