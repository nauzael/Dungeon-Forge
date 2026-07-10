import React from 'react';
import { Character } from '../../../../../types';

interface ExpertiseStepProps {
    character: Character;
    expertiseCount: number;
    selectedSkills: string[];
    onSkillsChange: (skills: string[]) => void;
}

const ExpertiseStep: React.FC<ExpertiseStepProps> = ({
    character,
    expertiseCount,
    selectedSkills,
    onSkillsChange,
}) => {
    // Only skills the character is proficient in AND doesn't already have Expertise
    const availableSkills = (character.skills || [])
        .filter(skill => !(character.expertise || []).includes(skill));

    const toggleSkill = (skill: string) => {
        if (selectedSkills.includes(skill)) {
            onSkillsChange(selectedSkills.filter(s => s !== skill));
        } else if (selectedSkills.length < expertiseCount) {
            onSkillsChange([...selectedSkills, skill]);
        }
    };

    const isReady = selectedSkills.length === expertiseCount;

    return (
        <div className="flex flex-col h-full p-5">
            <div className="text-center mb-5">
                <div className="w-16 h-16 rounded-radius-xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3 border-2 border-white dark:border-white/20 shadow-elev-modal">
                    <span className="material-symbols-outlined text-3xl">stars</span>
                </div>
                <h2 className="text-xl font-black tracking-tight" style={{color: 'var(--color-text-primary)'}}>
                    Expertise
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Choose {expertiseCount} skill{expertiseCount > 1 ? 's' : ''} to gain Expertise
                </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
                {availableSkills.length === 0 ? (
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-radius-md p-4 text-center">
                        <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                            No skills available for Expertise.
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                            You already have Expertise in all your trained skills.
                        </p>
                    </div>
                ) : (
                    availableSkills.map((skill) => {
                        const isSelected = selectedSkills.includes(skill);
                        const isDisabled = !isSelected && selectedSkills.length >= expertiseCount;
                        return (
                            <button
                                key={skill}
                                onClick={() => toggleSkill(skill)}
                                disabled={isDisabled}
                                className={`w-full p-4 rounded-radius-lg border-2 transition-all text-left ${
                                    isSelected
                                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500 dark:border-amber-400'
                                        : isDisabled
                                        ? 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 opacity-50 cursor-not-allowed'
                                        : 'bg-white dark:bg-[#1a2235] border-slate-200 dark:border-white/10 hover:border-amber-300 dark:hover:border-amber-700'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-base" style={{color: 'var(--color-text-primary)'}}>{skill}</span>
                                    {isSelected && (
                                        <span className="material-symbols-outlined text-amber-500 text-2xl">check_circle</span>
                                    )}
                                </div>
                            </button>
                        );
                    })
                )}
            </div>

            <div className="mt-5 bg-slate-50 dark:bg-white/5 rounded-radius-lg p-4 text-center">
                <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                    {selectedSkills.length} / {expertiseCount} selected
                </p>
            </div>

            {!isReady && availableSkills.length > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 text-center mt-2">
                    Select {expertiseCount - selectedSkills.length} more skill{expertiseCount - selectedSkills.length !== 1 ? 's' : ''} to continue
                </p>
            )}
        </div>
    );
};

export default ExpertiseStep;
