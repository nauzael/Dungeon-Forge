import React from 'react';
import { Character } from '../../../../types';

interface SkillsStepProps {
    character: Character;
    availableSkills: string[];
    skillsNeeded: number;
    selectedSkills: string[];
    onToggleSkill: (skill: string) => void;
}

const SkillsStep: React.FC<SkillsStepProps> = ({ availableSkills, skillsNeeded, selectedSkills, onToggleSkill }) => {
    return (
        <div className="flex flex-col h-full p-5">
            <div className="text-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3 border-2 border-white dark:border-white/20 shadow-lg">
                    <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    New Skills
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Choose {skillsNeeded} skill{skillsNeeded > 1 ? 's' : ''}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
                {availableSkills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                        <button
                            key={skill}
                            onClick={() => onToggleSkill(skill)}
                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                isSelected
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                                    : 'bg-white dark:bg-[#1a2235] border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-700'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-base text-slate-900 dark:text-white">{skill}</span>
                                {isSelected && (
                                    <span className="material-symbols-outlined text-blue-500 text-2xl">check_circle</span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-5 bg-slate-50 dark:bg-white/5 rounded-xl p-4 text-center">
                <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                    {selectedSkills.length} / {skillsNeeded} selected
                </p>
            </div>
        </div>
    );
};

export default SkillsStep;
