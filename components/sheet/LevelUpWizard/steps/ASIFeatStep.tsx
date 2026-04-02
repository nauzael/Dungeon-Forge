import React from 'react';
import { Character, Ability } from '../../../../types';
import { FEAT_OPTIONS } from '../../../../Data/feats/index';

interface ASIFeatStepProps {
    character: Character;
    asiType: 'stat' | 'feat';
    stat1: Ability;
    stat2: Ability;
    feat: string;
    onAsiTypeChange: (value: 'stat' | 'feat') => void;
    onStat1Change: (value: Ability) => void;
    onStat2Change: (value: Ability) => void;
    onFeatChange: (value: string) => void;
}

const ASIFeatStep: React.FC<ASIFeatStepProps> = ({
    character, asiType, stat1, stat2, feat,
    onAsiTypeChange, onStat1Change, onStat2Change, onFeatChange
}) => {
    const stats: Ability[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

    const featsByCategory = {
        'General': FEAT_OPTIONS.filter(f => f.category === 'General' && f.level <= character.level + 1),
        'Fighting Style': FEAT_OPTIONS.filter(f => f.category === 'Fighting Style'),
        'Origin': FEAT_OPTIONS.filter(f => f.category === 'Origin'),
        'Epic Boon': FEAT_OPTIONS.filter(f => f.category === 'Epic Boon'),
    };

    return (
        <div className="flex flex-col h-full p-5">
            <div className="text-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3 border-2 border-white dark:border-white/20 shadow-lg">
                    <span className="material-symbols-outlined text-3xl">stars</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Ability Score or Feat
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Choose one
                </p>
            </div>

            <div className="flex gap-3 mb-5">
                <button
                    onClick={() => onAsiTypeChange('stat')}
                    className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${
                        asiType === 'stat'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                            : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                    }`}
                >
                    Stats
                </button>
                <button
                    onClick={() => onAsiTypeChange('feat')}
                    className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${
                        asiType === 'feat'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                            : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                    }`}
                >
                    Feat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                {asiType === 'stat' ? (
                    <div className="space-y-4">
                        <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Points remaining
                            </p>
                            <p className="text-3xl font-black text-amber-500">2</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {stats.map((stat) => {
                                const currentValue = character.stats[stat] || 10;
                                const isSelected = stat1 === stat || stat2 === stat;
                                return (
                                    <div
                                        key={stat}
                                        className={`p-4 rounded-xl border-2 transition-all ${
                                            isSelected
                                                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500'
                                                : 'bg-white dark:bg-[#1a2235] border-slate-200 dark:border-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                                {stat}
                                            </span>
                                            <span className="text-lg font-black text-slate-900 dark:text-white">
                                                {currentValue}
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => {
                                                    if (isSelected) return;
                                                    if (!stat1 || stat1 === stat) onStat1Change(stat);
                                                    else if (!stat2 || stat2 === stat) onStat2Change(stat);
                                                    else {
                                                        onStat1Change(stat);
                                                        onStat2Change('STR');
                                                    }
                                                }}
                                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                                                    isSelected
                                                        ? 'bg-amber-500 text-white'
                                                        : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                                                }`}
                                            >
                                                +1
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                            Select two different stats for +1 each
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {Object.entries(featsByCategory).map(([category, feats]) => {
                            if (feats.length === 0) return null;
                            return (
                                <div key={category}>
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                                        {category}
                                    </h4>
                                    <div className="space-y-2">
                                        {feats.slice(0, 5).map((f) => (
                                            <button
                                                key={f.name}
                                                onClick={() => onFeatChange(f.name)}
                                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                                    feat === f.name
                                                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500'
                                                        : 'bg-white dark:bg-[#1a2235] border-slate-200 dark:border-white/10 hover:border-amber-300'
                                                }`}
                                            >
                                                <p className="font-bold text-base text-slate-900 dark:text-white mb-0.5">
                                                    {f.name}
                                                </p>
                                                {f.asi && (
                                                    <p className="text-sm text-amber-600 dark:text-amber-400">
                                                        +1 {f.asi.join(' or ')}
                                                    </p>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ASIFeatStep;
