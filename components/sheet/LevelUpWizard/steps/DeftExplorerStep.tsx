import React, { useState } from 'react';
import { Character } from '../../../../types';

interface DeftExplorerStepProps {
    character: Character;
    selectedExpertiseSkill: string;
    selectedLanguages: string[];
    onExpertiseSkillChange: (value: string) => void;
    onLanguagesChange: (languages: string[]) => void;
}

const AVAILABLE_LANGUAGES = [
    'Abyssal',
    'Aquan',
    'Auran',
    'Celestial',
    'Common',
    'Deep Speech',
    'Draconic',
    'Dwarvish',
    'Elvish',
    'Giant',
    'Gith',
    'Gnomish',
    'Goblin',
    'Halfling',
    'Infernal',
    'Orc',
    'Primordial',
    'Sylvan',
    'Undercommon',
];

const DeftExplorerStep: React.FC<DeftExplorerStepProps> = ({
    character,
    selectedExpertiseSkill,
    selectedLanguages,
    onExpertiseSkillChange,
    onLanguagesChange,
}) => {
    // Available skills are those the character is trained in
    const trainedSkills = character.skills || [];
    const notYetExpert = trainedSkills.filter(skill => !character.expertise?.includes(skill));

    // Available languages are those not already known
    const knownLanguages = character.languages || [];
    const availableLanguages = AVAILABLE_LANGUAGES.filter(lang => !knownLanguages.includes(lang));

    const toggleLanguage = (language: string) => {
        if (selectedLanguages.includes(language)) {
            onLanguagesChange(selectedLanguages.filter(l => l !== language));
        } else if (selectedLanguages.length < 2) {
            onLanguagesChange([...selectedLanguages, language]);
        }
    };

    const isReadyToConfirm = selectedExpertiseSkill && selectedLanguages.length === 2;

    return (
        <div className="flex flex-col h-full p-4 overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-2 border border-white dark:border-white/20 shadow-sm">
                    <span className="material-symbols-outlined text-2xl">explore</span>
                </div>
                <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                    Deft Explorer
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                    Gain Expertise in one skill and learn two languages
                </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                {/* Expertise Selection */}
                <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        🎯 Choose Expertise Skill
                    </label>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                        Select one of your trained skills to gain Expertise
                    </p>

                    {notYetExpert.length === 0 ? (
                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-xs text-amber-700 dark:text-amber-300">
                            You already have Expertise in all your trained skills.
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {notYetExpert.map((skill) => (
                                <button
                                    key={skill}
                                    onClick={() => onExpertiseSkillChange(skill)}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg border-2 transition-all ${
                                        selectedExpertiseSkill === skill
                                            ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500 dark:border-purple-400'
                                            : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-600'
                                    }`}
                                >
                                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{skill}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Languages Selection */}
                <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        🗣️ Learn Two Languages
                    </label>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                        Select exactly 2 additional languages. Already known: {knownLanguages.length}
                    </p>

                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {availableLanguages.map((language) => (
                            <button
                                key={language}
                                onClick={() => toggleLanguage(language)}
                                className={`px-3 py-2 rounded-lg border-2 transition-all text-xs font-medium ${
                                    selectedLanguages.includes(language)
                                        ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-500 dark:border-indigo-400 text-indigo-900 dark:text-indigo-200'
                                        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600'
                                }`}
                            >
                                {language}
                                {selectedLanguages.includes(language) && (
                                    <span className="ml-1">✓</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {selectedLanguages.length === 2 && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-xs text-green-700 dark:text-green-300">
                            ✓ Selected: {selectedLanguages.join(', ')}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            {!isReadyToConfirm && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-700 dark:text-blue-300">
                    <span className="material-symbols-outlined text-sm align-middle">info</span>
                    {' '}
                    {!selectedExpertiseSkill ? 'Select a skill to gain Expertise.' : ''}
                    {selectedExpertiseSkill && selectedLanguages.length < 2 ? `Select ${2 - selectedLanguages.length} more language(s).` : ''}
                </div>
            )}
        </div>
    );
};

export default DeftExplorerStep;
