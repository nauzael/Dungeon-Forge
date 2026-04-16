
import React from 'react';
import { Ability, BackgroundData } from '../../types';

interface Step5Props {
    charImage: string;
    name: string;
    selectedSpecies: string;
    selectedSubspecies: string;
    selectedClass: string;
    selectedSubclass: string;
    level: number;
    hp: number;
    ac: number;
    speed: number;
    init: string;
    finalStats: Record<Ability, number>;
    selectedBackground: string;
    selectedAlignment: string;
    backgroundData: BackgroundData;
    selectedFeat: string;
    asiLevels: number[];
    asiDecisions: any;
    activePassives: string[];
    selectedMetamagics: string[];
    languages: string[];
    trainedSkills: string[];
    onConfirm: () => void;
}

import { UI } from '../../constants/ui';

const Step5Review: React.FC<Step5Props> = ({
    charImage, name, selectedSpecies, selectedSubspecies, selectedClass, selectedSubclass, level, hp, ac, speed, init,
    finalStats, selectedBackground, selectedAlignment, backgroundData, selectedFeat, asiLevels,
    asiDecisions, activePassives, selectedMetamagics, languages, trainedSkills, onConfirm
}) => {
    const t = UI;

    const getStatShortName = (stat: string) => {
        const keyMap: Record<string, string> = {
            'STR': t.str, 'DEX': t.dex, 'CON': t.con,
            'INT': t.int, 'WIS': t.wis, 'CHA': t.cha
        };
        return keyMap[stat] || stat;
    };

    return (
        <div className="px-6 py-4 space-y-6">
             <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-3xl bg-slate-200 dark:bg-surface-light mb-3 shadow-lg border-2 border-white" style={{backgroundImage: `url(${charImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white leading-tight">{name || t.hero}</h2>
                <div className="flex flex-wrap justify-center items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-primary uppercase tracking-wide">
                        {selectedSpecies}{selectedSubspecies ? ` (${selectedSubspecies})` : ''}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">{selectedClass}</span>
                    {selectedSubclass && <><span className="w-1 h-1 rounded-full bg-slate-400"></span><span className="text-sm font-bold text-slate-500 max-w-[150px] truncate">{selectedSubclass}</span></>}
                    <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                    <span className="text-sm font-bold text-slate-500">{t.level} {level}</span>
                </div>
             </div>

             <div className="grid grid-cols-4 gap-3">
                {[
                  { l: t.hp, v: hp, i: 'favorite', c: 'text-red-500' },
                  { l: t.ac, v: ac, i: 'shield', c: 'text-blue-500' },
                  { l: 'SPD', v: speed, i: 'directions_run', c: 'text-green-500' }, // Use t.speed if short enough
                  { l: 'INI', v: init, i: 'bolt', c: 'text-yellow-500' }  // Use t.initiative if short enough
                ].map(s => (
                    <div key={s.l} className="flex flex-col items-center p-2.5 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 shadow-sm">
                        <span className={`material-symbols-outlined ${s.c} text-lg mb-1`}>{s.i}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.l}</span>
                        <span className="text-lg font-bold text-slate-900 dark:text-white leading-none">{s.v}</span>
                    </div>
                ))}
             </div>

             <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 pl-1">{t.attributes}</h4>
                <div className="grid grid-cols-3 gap-2">
                    {Object.entries(finalStats).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-transparent">
                            <span className="text-xs font-bold text-slate-500">{getStatShortName(key)}</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{val}</span>
                        </div>
                    ))}
                </div>
             </div>

             <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-200 space-y-4 shadow-sm">
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-white/5 pb-3">
                    <div className="flex flex-col"><span className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">{t.background}</span><span className="font-bold text-sm text-slate-900 dark:text-white">{selectedBackground}</span></div>
                    <div className="flex flex-col items-end"><span className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">{t.alignment}</span><span className="font-bold text-sm text-slate-900 dark:text-white">{selectedAlignment}</span></div>
                </div>
                <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.feats_and_traits}</span>
                    <div className="flex flex-col gap-2">
                        {backgroundData?.feat && <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">military_tech</span><span className="text-sm font-medium">{backgroundData.feat}</span></div>}
                        {selectedFeat && <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">military_tech</span><span className="text-sm font-medium">{selectedFeat}</span></div>}
                        {asiLevels.map(l => asiDecisions[l]?.type === 'feat' && asiDecisions[l].feat ? <div key={l} className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">military_tech</span><span className="text-sm font-medium">{asiDecisions[l].feat}</span></div> : null)}
                        {activePassives.map(p => <div key={p} className="flex items-center gap-2"><span className="material-symbols-outlined text-purple-500 text-sm">auto_awesome</span><span className="text-sm font-medium">{p}</span></div>)}
                    </div>
                </div>
                {selectedMetamagics.length > 0 && <div><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">{t.metamagics}</span><div className="flex flex-wrap gap-1.5">{selectedMetamagics.map(m => <span key={m} className="px-2 py-1 rounded-md bg-purple-500/10 text-xs font-bold text-purple-400 border border-purple-500/20">{m}</span>)}</div></div>}
                <div className="pt-1"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Languages</span><div className="flex flex-wrap gap-1.5">{languages.map(l => <span key={l} className="px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200">{l}</span>)}</div></div>
             </div>

             <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 pl-1">{t.trained_skills}</h4>
                <div className="flex flex-wrap gap-2">{trainedSkills.map(skill => <div key={skill} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary"><span className="material-symbols-outlined text-[14px]">check</span><span className="text-xs font-bold">{skill}</span></div>)}</div>
             </div>

             <button onClick={onConfirm} className="w-full py-4 bg-primary text-background-dark font-bold rounded-xl shadow-[0_8px_30px_rgb(53,158,255,0.4)] text-lg hover:scale-[1.02] transition-transform mt-4">{t.confirm_character}</button>
        </div>
    );
};

export default Step5Review;
