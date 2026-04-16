import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Character, Ability } from '../../../../types';
import { FEAT_OPTIONS, type Feat } from '../../../../Data/feats/index';

interface ASIFeatStepProps {
    character: Character;
    asiType: 'stat' | 'feat';
    stat1: Ability;
    stat2: Ability;
    feat: string;
    featStat: Ability | null;
    selectedFeat?: Feat;
    nextLevel: number;
    onAsiTypeChange: (value: 'stat' | 'feat') => void;
    onStat1Change: (value: Ability) => void;
    onStat2Change: (value: Ability) => void;
    onFeatChange: (value: string) => void;
    onFeatStatChange: (value: Ability) => void;
}

const ASIFeatStep: React.FC<ASIFeatStepProps> = ({
    character, asiType, stat1, stat2, feat, featStat, selectedFeat, nextLevel,
    onAsiTypeChange, onStat1Change, onStat2Change, onFeatChange, onFeatStatChange
}) => {
    const [expandedFeatModal, setExpandedFeatModal] = useState<Feat | null>(null);
    const stats: Ability[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
    const featAsiOptions = selectedFeat?.asi as Ability[] | undefined;

    // Filtrar feats por nivel disponible en nextLevel, EXCLUYENDO Origin feats
    const availableFeats = FEAT_OPTIONS.filter(f => f.level <= nextLevel && f.category !== 'Origin');
    
    const featsByCategory = {
        'General': availableFeats.filter(f => f.category === 'General'),
        'Fighting Style': availableFeats.filter(f => f.category === 'Fighting Style'),
        'Epic Boon': availableFeats.filter(f => f.category === 'Epic Boon'),
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
                                Increase ability scores
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                Choose to increase one ability by 2, or two abilities by 1 each
                            </p>
                        </div>

                        {/* Primera Elección */}
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                                First Increase
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {stats.map((stat) => {
                                    const currentValue = character.stats[stat] || 10;
                                    const isSelected1 = stat1 === stat;
                                    const increase1 = stat === stat1 ? 1 : 0;
                                    return (
                                        <button
                                            key={`1-${stat}`}
                                            onClick={() => onStat1Change(stat)}
                                            className={`p-4 rounded-xl border-2 transition-all ${
                                                isSelected1
                                                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500'
                                                    : 'bg-white dark:bg-[#1a2235] border-slate-200 dark:border-white/10 hover:border-amber-300'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                                    {stat}
                                                </span>
                                                <span className="text-lg font-black text-slate-900 dark:text-white">
                                                    {currentValue}{increase1 > 0 ? `+${increase1}` : ''}
                                                </span>
                                            </div>
                                            <div className={`text-xs font-semibold ${isSelected1 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>
                                                {isSelected1 ? '✓ Selected' : 'Select'}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Segunda Elección */}
                        {stat1 && (
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                                    {stat1 ? `Second Increase (or +1 more to ${stat1})` : 'Second Increase'}
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {stats.map((stat) => {
                                        const currentValue = character.stats[stat] || 10;
                                        const isSelected2 = stat2 === stat;
                                        const isSameStat = stat === stat1;
                                        const totalIncrease = (stat === stat1 ? 1 : 0) + (stat === stat2 ? 1 : 0);
                                        return (
                                            <button
                                                key={`2-${stat}`}
                                                onClick={() => onStat2Change(stat)}
                                                className={`p-4 rounded-xl border-2 transition-all ${
                                                    isSelected2
                                                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500'
                                                        : 'bg-white dark:bg-[#1a2235] border-slate-200 dark:border-white/10 hover:border-amber-300'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                                        {stat}
                                                    </span>
                                                    <span className="text-lg font-black text-slate-900 dark:text-white">
                                                        {currentValue}{totalIncrease > 0 ? `+${totalIncrease}` : ''}
                                                    </span>
                                                </div>
                                                <div className={`text-xs font-semibold ${isSelected2 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>
                                                    {isSelected2 ? (isSameStat ? '✓ +2 Total' : '✓ Selected') : (isSameStat ? '+2 Here' : 'Select')}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                            Increase one ability by 2, or two different abilities by 1 each
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-5">
                            {Object.entries(featsByCategory).map(([category, feats]) => {
                                if (feats.length === 0) return null;
                                return (
                                    <div key={category}>
                                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">
                                            {category}
                                        </h4>
                                        <div className="space-y-2">
                                            {feats.map((f) => {
                                                const isSelected = feat === f.name;
                                                return (
                                                    <button
                                                        key={f.name}
                                                        onClick={() => setExpandedFeatModal(f)}
                                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                                                            isSelected
                                                                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500 shadow-md'
                                                                : 'bg-white dark:bg-[#1a2235] border-slate-200 dark:border-white/10 hover:border-amber-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex-1">
                                                                <p className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                                                                    {f.name}
                                                                </p>
                                                                {f.asi && (
                                                                    <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                                                                        +1 {f.asi.join(' or ')}
                                                                    </p>
                                                                )}
                                                                {f.prerequisite && (
                                                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                                                        Prerequisite: {f.prerequisite}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-lg text-slate-400 dark:text-slate-500">info</span>
                                                                {isSelected && (
                                                                    <span className="material-symbols-outlined text-lg text-amber-500">check_circle</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Feat Details Modal */}
                        {expandedFeatModal && createPortal(
                            <div
                                className="fixed inset-0 z-[300] bg-black/40 flex items-end sm:items-center justify-center animate-fadeIn backdrop-blur-sm"
                                onClick={() => setExpandedFeatModal(null)}
                            >
                                <div
                                    className="w-full sm:max-w-md bg-white dark:bg-[#0f1525] rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col animate-slideUp overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Modal Header */}
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/10 shrink-0">
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                            {expandedFeatModal.name}
                                        </h3>
                                        <button
                                            onClick={() => setExpandedFeatModal(null)}
                                            className="w-10 h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">close</span>
                                        </button>
                                    </div>

                                    {/* Modal Content */}
                                    <div className="flex-1 overflow-y-auto px-5 py-4">
                                        {/* ASI Badge */}
                                        {expandedFeatModal.asi && (
                                            <div className="mb-4 inline-block px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-bold">
                                                +1 to {expandedFeatModal.asi.join(' or ')}
                                            </div>
                                        )}

                                        {/* Prerequisite */}
                                        {expandedFeatModal.prerequisite && (
                                            <div className="mb-4 p-3 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
                                                    Prerequisite
                                                </p>
                                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                                    {expandedFeatModal.prerequisite}
                                                </p>
                                            </div>
                                        )}

                                        {/* Description */}
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2">
                                                Description
                                            </p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                                {expandedFeatModal.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="border-t border-slate-100 dark:border-white/10 px-5 py-4 shrink-0 space-y-3 bg-slate-50 dark:bg-white/5">
                                        {/* ASI Selection (if needed) */}
                                        {feat === expandedFeatModal.name && expandedFeatModal.asi && expandedFeatModal.asi.length > 0 && (
                                            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-500/30">
                                                <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-3">
                                                    Choose +1 ability:
                                                </h4>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {expandedFeatModal.asi.map((stat) => {
                                                        const currentValue = character.stats[stat] || 10;
                                                        const isStatSelected = featStat === stat;
                                                        return (
                                                            <button
                                                                key={stat}
                                                                onClick={() => onFeatStatChange(stat)}
                                                                className={`p-2.5 rounded-lg border-2 transition-all ${
                                                                    isStatSelected
                                                                        ? 'bg-amber-500 text-white border-amber-500'
                                                                        : 'bg-white dark:bg-[#1a2235] border-slate-200 dark:border-white/10 hover:border-amber-300 text-slate-900 dark:text-white'
                                                                }`}
                                                            >
                                                                <span className={`font-bold text-sm ${isStatSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                                                    {stat}
                                                                </span>
                                                                <span className={`block text-xs ${isStatSelected ? 'text-amber-100' : 'text-slate-500 dark:text-slate-400'}`}>
                                                                    {currentValue} → {Math.min(currentValue + 1, 20)}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Selection Button */}
                                        {feat !== expandedFeatModal.name ? (
                                            <button
                                                onClick={() => {
                                                    onFeatChange(expandedFeatModal.name);
                                                }}
                                                className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg active:scale-[0.98]"
                                            >
                                                Select Feat
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setExpandedFeatModal(null)}
                                                className="w-full py-3 rounded-lg font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all shadow-lg active:scale-[0.98]"
                                            >
                                                ✓ Feat Selected
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>,
                            document.body
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ASIFeatStep;
