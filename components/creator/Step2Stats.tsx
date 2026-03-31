
import React from 'react';
import { Ability, BackgroundData, AsiDecision } from '../../types';
import useFeatOptions from '../../hooks/useFeatOptions';

interface Step2Props {
    selectedBackground: string;
    backgroundData: BackgroundData;
    bgAsiMode: 'three' | 'two';
    setBgAsiMode: (v: 'three' | 'two') => void;
    bgPlus2: Ability;
    setBgPlus2: (v: Ability) => void;
    bgPlus1: Ability;
    setBgPlus1: (v: Ability) => void;
    statMethod: 'pointBuy' | 'manual';
    setStatMethod: (v: 'pointBuy' | 'manual') => void;
    remainingPoints: number;
    baseStats: Record<Ability, number>;
    handleStatChange: (stat: Ability, delta: number) => void;
    finalStats: Record<Ability, number>;
    hpMethod: 'average' | 'manual';
    setHpMethod: (v: 'average' | 'manual') => void;
    manualRolledHP: number;
    setManualRolledHP: (v: number) => void;
    level: number;
    renderHpBreakdown: () => React.ReactNode;
    asiLevels: number[];
    asiDecisions: Record<number, AsiDecision>;
    handleAsiChange: (level: number, updates: Partial<AsiDecision>) => void;
    openFeatModal: (context: { type: 'asi', level: number }) => void;
    suggestedArray?: Record<Ability, number>;
    setBaseStats: (v: Record<Ability, number>) => void;
}

import { useLanguage } from '../../hooks/useLanguage';

const Step2Stats: React.FC<Step2Props> = ({
    selectedBackground, backgroundData, bgAsiMode, setBgAsiMode, bgPlus2, setBgPlus2, bgPlus1, setBgPlus1,
    statMethod, setStatMethod, remainingPoints, baseStats, handleStatChange, finalStats,
    hpMethod, setHpMethod, manualRolledHP, setManualRolledHP, level, renderHpBreakdown,
    asiLevels, asiDecisions, handleAsiChange, openFeatModal, suggestedArray, setBaseStats
}) => {
    const { t } = useLanguage();
    const { featOptions: FEAT_OPTIONS, getFeatDisplayName, getFeatDescription } = useFeatOptions();

    const getStatTranslation = (stat: Ability) => {
        const keyMap: Record<Ability, string> = {
            'STR': t.strength, 'DEX': t.dexterity, 'CON': t.constitution,
            'INT': t.intelligence, 'WIS': t.wisdom, 'CHA': t.charisma
        };
        return keyMap[stat] || stat;
    };

    return (
        <div className="px-6 py-4 space-y-6">
            <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
                    {t.background_bonuses} <span className="text-slate-400 text-xs font-normal">({selectedBackground})</span>
                </h3>
                <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl mb-4">
                    <button onClick={() => setBgAsiMode('three')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${bgAsiMode === 'three' ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-slate-500'}`}>+1 / +1 / +1</button>
                    <button onClick={() => setBgAsiMode('two')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${bgAsiMode === 'two' ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-slate-500'}`}>+2 / +1</button>
                </div>
                {bgAsiMode === 'three' ? (
                    <div className="flex gap-2 justify-center">
                        {(backgroundData?.scores || []).map(s => <div key={s} className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg font-bold text-xs">{s} +1</div>)}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase w-8 text-right text-primary">+2</span>
                            <div className="flex gap-2 flex-1">
                                {(backgroundData?.scores || []).map(s => (
                                    <button key={s} onClick={() => { setBgPlus2(s); if (bgPlus1 === s) setBgPlus1(backgroundData.scores.find(x => x !== s) || s); }} className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${bgPlus2 === s ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-white/5 border-slate-200 text-slate-500'}`}>{s}</button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase w-8 text-right text-slate-500">+1</span>
                            <div className="flex gap-2 flex-1">
                                {(backgroundData?.scores || []).map(s => (
                                    <button key={s} onClick={() => setBgPlus1(s)} disabled={bgPlus2 === s} className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${bgPlus1 === s ? 'bg-slate-600 text-white border-slate-600' : bgPlus2 === s ? 'opacity-30 cursor-not-allowed bg-slate-100 border-transparent' : 'bg-white dark:bg-white/5 border-slate-200 text-slate-500'}`}>{s}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xl font-bold">{t.attributes}</h3>
                    {statMethod === 'pointBuy' && <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">{remainingPoints} pts</div>}
                </div>
                {suggestedArray && (
                    <button 
                        onClick={() => {
                            setStatMethod('manual');
                            setBaseStats(suggestedArray);
                        }}
                        className="w-full mb-3 p-4 rounded-2xl border-2 border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-all text-left flex items-start gap-4 shadow-sm"
                    >
                        <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined">tips_and_updates</span>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-black uppercase tracking-widest leading-none mb-1">Array Recomendado (2024)</div>
                            <div className="flex gap-2.5">
                                {Object.entries(suggestedArray).map(([stat, val]) => (
                                    <div key={stat} className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-500">{stat}</span>
                                        <span className="text-sm font-black text-primary">{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </button>
                )}
                <div className="flex p-1 bg-slate-200 dark:bg-white/10 rounded-xl mb-3">
                    {(['pointBuy', 'manual'] as const).map(m => (
                        <button key={m} onClick={() => setStatMethod(m)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${statMethod === m ? 'bg-white dark:bg-surface-dark shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400'}`}>{m === 'pointBuy' ? t.point_buy : t.manual}</button>
                    ))}
                </div>
                <div className="space-y-3">
                    {(Object.keys(baseStats) as Ability[]).map(stat => (
                        <div key={stat} className="flex items-center justify-between bg-slate-100 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-white/10 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">{stat}</div>
                                <div>
                                    <span className="block font-bold text-slate-900 dark:text-white">{getStatTranslation(stat)}</span>
                                    <span className="text-xs text-slate-500">{t.final}: <span className="text-primary font-bold">{finalStats[stat]}</span></span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => handleStatChange(stat, -1)} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center hover:bg-slate-300 transition-colors"><span className="material-symbols-outlined text-sm">remove</span></button>
                                <span className="w-6 text-center font-bold text-lg">{baseStats[stat]}</span>
                                <button onClick={() => handleStatChange(stat, 1)} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center hover:bg-slate-300 transition-colors"><span className="material-symbols-outlined text-sm">add</span></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                <h3 className="text-lg font-bold mb-3">{t.hit_points}</h3>
                <div className="flex p-1 bg-slate-200 dark:bg-white/10 rounded-xl mb-3">
                    {(['average', 'manual'] as const).map(m => (
                        <button key={m} onClick={() => setHpMethod(m)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${hpMethod === m ? 'bg-white dark:bg-surface-dark shadow-sm text-primary' : 'text-slate-500'}`}>{m === 'average' ? t.fixed_average : t.manual}</button>
                    ))}
                </div>
                {hpMethod === 'manual' && level > 1 && (
                    <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 mb-3">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.rolled_sum} ({t.level} 2-{level})</label>
                        <input type="number" value={manualRolledHP} onChange={(e) => setManualRolledHP(Math.max(0, parseInt(e.target.value) || 0))} className="w-full bg-white dark:bg-surface-dark border border-slate-200 rounded-lg px-3 py-2 text-lg font-bold outline-none focus:ring-2 focus:ring-primary/50" />
                        <p className="text-xs text-slate-400 mt-2">{t.rolled_sum_desc}</p>
                    </div>
                )}
                {renderHpBreakdown()}
            </div>

            {asiLevels.length > 0 && (
                <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-4">
                    <h3 className="text-lg font-bold">{t.level_improvements}</h3>
                    {asiLevels.map(lvl => {
                        const decision = asiDecisions[lvl] || { type: 'stat', stat1: 'STR', stat2: 'STR' };
                        return (
                            <div key={lvl} className="bg-white dark:bg-surface-dark border border-slate-200 rounded-2xl p-4 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-bold text-primary uppercase tracking-wider">{t.level} {lvl}</span>
                                    <div className="flex bg-slate-100 dark:bg-white/5 rounded-lg p-0.5">
                                        <button onClick={() => handleAsiChange(lvl, { type: 'stat' })} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${decision.type === 'stat' ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-slate-500'}`}>{t.stats}</button>
                                        <button onClick={() => handleAsiChange(lvl, { type: 'feat' })} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${decision.type === 'feat' ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-slate-500'}`}>{t.feat}</button>
                                    </div>
                                </div>
                                {decision.type === 'stat' ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{t.plus_one_to}</label>
                                            <select value={decision.stat1} onChange={(e) => handleAsiChange(lvl, { stat1: e.target.value as Ability })} className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg py-2 px-2 text-sm font-bold outline-none focus:border-primary/50">
                                                {(Object.keys(baseStats) as Ability[]).map(s => <option key={s} value={s}>{getStatTranslation(s)}</option>)}
                                            </select>
                                        </div>
                                        <div><label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{t.plus_one_to}</label>
                                            <select value={decision.stat2} onChange={(e) => handleAsiChange(lvl, { stat2: e.target.value as Ability })} className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg py-2 px-2 text-sm font-bold outline-none focus:border-primary/50">
                                                {(Object.keys(baseStats) as Ability[]).map(s => <option key={s} value={s}>{getStatTranslation(s)}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <button onClick={() => openFeatModal({ type: 'asi', level: lvl })} className="w-full text-left p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border-2 border-slate-200 dark:border-white/5 hover:border-primary/50 transition-all flex justify-between items-center group">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{t.feat}</span>
                                                <span className={`font-black text-base ${decision.feat ? 'text-primary' : 'text-slate-400'}`}>
                                                    {decision.feat || t.selectFeat}
                                                </span>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">edit_note</span>
                                        </button>
                                        
                                        {decision.feat && (
                                            <div className="space-y-3 animate-fadeIn">
                                                {/* Half-feat ASI Selector */}
                                                {FEAT_OPTIONS.find(f => f.name === decision.feat)?.asi && (
                                                    <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <span className="material-symbols-outlined text-primary text-sm">add_circle</span>
                                                            <label className="text-[10px] text-primary uppercase font-black tracking-widest">{t.feat_bonus} (+1 {t.to})</label>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {(FEAT_OPTIONS.find(f => f.name === decision.feat)?.asi || []).map(s => (
                                                                <button 
                                                                    key={s}
                                                                    onClick={() => handleAsiChange(lvl, { stat1: s })}
                                                                    className={`flex-1 py-2.5 rounded-xl border-2 font-black text-xs transition-all ${
                                                                        decision.stat1 === s 
                                                                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]' 
                                                                        : 'bg-white dark:bg-black/20 border-slate-200 dark:border-white/5 text-slate-500'
                                                                    }`}
                                                                >
                                                                    {getStatTranslation(s)}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                                                        {getFeatDescription(decision.feat)}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Step2Stats;
