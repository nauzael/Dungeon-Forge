import React from 'react';
import { Character, Ability } from '../../../../types';
import { UI } from '../../../../constants/ui';
import { type Feat } from '../../../../Data/feats/index';

interface SummaryStepProps {
    character: Character;
    nextLevel: number;
    pending: {
        hpGain: number;
        subclass: string;
        selectedSkills: string[];
        preparedSpells: string[];
        asiType: 'stat' | 'feat';
        stat1: string;
        stat2: string;
        feat: string;
        featStat: Ability | null;
        selectedFeat?: Feat;
    };
    onConfirm: () => void;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ character, nextLevel, pending, onConfirm }) => {
    const t = UI;

    return (
        <div className="flex flex-col h-full p-5">
            <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 text-white flex items-center justify-center mx-auto mb-4 shadow-xl animate-bounce">
                    <span className="material-symbols-outlined text-5xl">emoji_events</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {t.levelUpComplete || 'Level Up Complete!'}
                </h2>
                <p className="text-xl text-green-500 font-bold mt-2">
                    Level {nextLevel}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
                        <span className="font-bold text-base text-slate-900 dark:text-white">
                            HP: +{pending.hpGain} (+ automatic bonuses)
                        </span>
                    </div>
                    {pending.subclass && (
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-purple-500 text-xl">check_circle</span>
                            <span className="font-bold text-base text-slate-900 dark:text-white">
                                {t.subclass || 'Subclass'}: {pending.subclass}
                            </span>
                        </div>
                    )}
                    {pending.selectedSkills.length > 0 && (
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-blue-500 text-xl">check_circle</span>
                            <span className="font-bold text-base text-slate-900 dark:text-white">
                                {t.skills || 'Skills'}: {pending.selectedSkills.join(', ')}
                            </span>
                        </div>
                    )}
                    {pending.asiType === 'stat' && (
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-amber-500 text-xl">check_circle</span>
                            <span className="font-bold text-base text-slate-900 dark:text-white">
                                +1 {pending.stat1}, +1 {pending.stat2}
                            </span>
                        </div>
                    )}
                    {pending.asiType === 'feat' && pending.feat && (
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-amber-500 text-xl">check_circle</span>
                            <span className="font-bold text-base text-slate-900 dark:text-white">
                                {t.feat || 'Feat'}: {pending.feat}
                                {pending.featStat && ` (+1 ${pending.featStat})`}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={onConfirm}
                className="w-full py-4 mt-5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 transition-all active:scale-[0.98]"
            >
                {t.viewCharacterSheet || 'View Character Sheet'}
            </button>
        </div>
    );
};

export default SummaryStep;
