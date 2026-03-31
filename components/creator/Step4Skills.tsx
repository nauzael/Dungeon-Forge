
import React, { useState } from 'react';
import { Ability, Skill, BackgroundData } from '../../types';
import { SKILL_ABILITY_MAP } from '../../Data/skills';
import { useSkills } from '../../Data/skills/index';
import { METAMAGIC_OPTIONS } from '../../Data/characterOptions';
import { MASTERY_DESCRIPTIONS } from '../../Data/items';

interface Step4Props {
    selectedSpecies: string;
    selectedElfSkill: string;
    setSelectedElfSkill: (v: string) => void;
    selectedHumanSkill: string;
    setSelectedHumanSkill: (v: string) => void;
    selectedSkills: string[];
    toggleSkill: (skill: string) => void;
    finalStats: Record<Ability, number>;
    backgroundData: BackgroundData;
    level: number;
    classSkillOptions: { count: number };
    maxMetamagics: number;
    selectedMetamagics: string[];
    toggleMetamagic: (m: string) => void;
    maxMasteries: number;
    selectedMasteries: string[];
    setMasteryAtIndex: (idx: number, m: string) => void;
    maxExpertise: number;
    selectedExpertise: string[];
    toggleExpertise: (s: string) => void;
}

import { useLanguage } from '../../hooks/useLanguage';
import { useGameData } from '../../hooks/useGameData';
import WeaponMasteryModal from './WeaponMasteryModal';

const Step4Skills: React.FC<Step4Props> = ({
    selectedSpecies, selectedElfSkill, setSelectedElfSkill, selectedHumanSkill, setSelectedHumanSkill,
    selectedSkills, toggleSkill, finalStats, backgroundData, level, classSkillOptions,
    maxMetamagics, selectedMetamagics, toggleMetamagic,
    maxMasteries, selectedMasteries, setMasteryAtIndex,
    maxExpertise, selectedExpertise, toggleExpertise
}) => {
    const { t } = useLanguage();
    const { metamagics: metamagicOptions, weapons: allWeapons } = useGameData();
    const [showMasteryModal, setShowMasteryModal] = useState(false);
    const [activeMasterySlot, setActiveMasterySlot] = useState(0);
    const availableWeapons = allWeapons.filter(w => w.mastery && w.mastery !== '-');
    const skills = useSkills();
    const SKILL_LIST = skills.map(s => s.name);
    
    return (
        <div className="px-6 py-4 space-y-6">
            {selectedSpecies === 'Elf' && (
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 mb-4 animate-fadeIn">
                    <div className="flex items-center gap-2 mb-3"><span className="material-symbols-outlined text-green-600">visibility</span><h3 className="text-base font-bold text-slate-900 dark:text-white">{t.keen_senses}</h3></div>
                    <p className="text-xs text-slate-500 mb-3">{t.choose_skill_desc}</p>
                    <select value={selectedElfSkill} onChange={(e) => setSelectedElfSkill(e.target.value)} className="w-full bg-white dark:bg-surface-dark border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold">
                        <option value="" disabled>{t.select_skill_prompt}</option>
                        {['Insight', 'Perception', 'Survival'].map(skill => <option key={skill} value={skill}>{skill}</option>)}
                    </select>
                </div>
            )}
            {selectedSpecies === 'Human' && (
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-3"><span className="material-symbols-outlined text-primary">accessibility_new</span><h3 className="text-base font-bold text-slate-900 dark:text-white">{t.racial_skill}</h3></div>
                    <p className="text-xs text-slate-500 mb-3">{t.choose_extra_skill_desc}</p>
                    <select value={selectedHumanSkill} onChange={(e) => setSelectedHumanSkill(e.target.value)} className="w-full bg-white dark:bg-surface-dark border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold">
                        <option value="" disabled>{t.select_extra_skill_prompt}</option>
                        {SKILL_LIST.map(skill => {
                            if ((backgroundData?.skills || []).includes(skill) || selectedSkills.includes(skill) || selectedElfSkill === skill) return null;
                            return <option key={skill} value={skill}>{skill}</option>;
                        })}
                    </select>
                </div>
            )}

            <div>
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xl font-bold">{t.class_skills}</h3>
                     <div className="text-sm font-medium text-slate-500">{t.chosen}: <span className={`${selectedSkills.length === classSkillOptions.count ? 'text-primary' : 'text-slate-900 dark:text-white'} font-bold`}>{selectedSkills.length}</span> / {classSkillOptions.count}</div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {SKILL_LIST.map(skill => {
                        const ability = SKILL_ABILITY_MAP[skill];
                        const mod = Math.floor(((finalStats[ability] || 10) - 10) / 2);
                        const isBackground = (backgroundData?.skills || []).includes(skill);
                        const isHumanSelected = selectedHumanSkill === skill;
                        const isElfSelected = selectedElfSkill === skill;
                        const isSelected = selectedSkills.includes(skill);
                        const isProf = isBackground || isHumanSelected || isElfSelected || isSelected;
                        const currentProfBonus = Math.ceil(1 + (level / 4));
                        const total = mod + (isProf ? currentProfBonus : 0);
                        return (
                            <button key={skill} onClick={() => !isBackground && !isHumanSelected && !isElfSelected && toggleSkill(skill)} disabled={isBackground || isHumanSelected || isElfSelected} className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${isBackground || isHumanSelected || isElfSelected ? 'bg-slate-100 dark:bg-white/5 border-transparent opacity-80' : isSelected ? 'bg-primary/5 border-primary shadow-[0_0_15px_rgba(53,158,255,0.2)]' : 'bg-white dark:bg-surface-dark border-slate-200 hover:border-primary/50'}`}>
                                <span className={`font-bold ${isProf ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{skill} {isBackground && <span className="text-[10px] text-primary uppercase ml-2">({t.background_label})</span>}{isHumanSelected && <span className="text-[10px] text-blue-500 uppercase ml-2">({t.human_label})</span>}{isElfSelected && <span className="text-[10px] text-green-500 uppercase ml-2">({t.elf_label})</span>}</span>
                                <div className="flex items-center gap-3"><span className={`text-xs font-bold ${isProf ? 'text-primary' : 'text-slate-400'}`}>{total >= 0 ? '+' : ''}{total}</span><div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isProf ? 'bg-primary border-primary' : 'border-slate-300 dark:border-slate-600'}`}>{isProf && <span className="material-symbols-outlined text-sm text-black font-bold">check</span>}</div></div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {maxMetamagics > 0 && (
                <div className="mt-8 animate-fadeIn">
                    <h3 className="text-xl font-bold mb-4">{t.metamagic_options} <span className="text-sm font-medium text-slate-500 ml-2">({selectedMetamagics.length} / {maxMetamagics})</span></h3>
                    <div className="grid grid-cols-1 gap-2">
                        {metamagicOptions.map(m => (
                            <button key={m.name} onClick={() => toggleMetamagic(m.name)} disabled={!selectedMetamagics.includes(m.name) && selectedMetamagics.length >= maxMetamagics} className={`p-4 rounded-xl border text-left transition-all ${selectedMetamagics.includes(m.name) ? 'bg-primary/5 border-primary shadow-[0_0_15px_rgba(53,158,255,0.2)]' : 'bg-white dark:bg-surface-dark border-slate-200 hover:border-primary/50'}`}>
                                <div className="flex justify-between items-center mb-1"><span className={`font-bold ${selectedMetamagics.includes(m.name) ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{m.name}</span>{selectedMetamagics.includes(m.name) && <span className="material-symbols-outlined text-primary text-base">check_circle</span>}</div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{m.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {maxMasteries > 0 && (
                <div className="mt-8 animate-fadeIn">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">{t.weapon_masteries}</h3>
                        <div className="text-sm font-medium text-slate-500">{t.slots}: <span className="text-primary font-bold">{maxMasteries}</span></div>
                    </div>
                    <div className="space-y-3">
                        {Array.from({ length: maxMasteries }).map((_, idx) => {
                            const currentVal = selectedMasteries[idx] || '';
                            const selectedWeapon = availableWeapons.find(w => w.name === currentVal);
                            
                            return (
                                <div key={idx} className="space-y-1.5 animate-slideUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <h4 className="flex items-center gap-1.5 ml-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                        <span className="material-symbols-outlined text-xs">slot</span>
                                        {t.mastery_slot} {idx + 1}
                                    </h4>
                                    
                                    <button 
                                        onClick={() => {
                                            setActiveMasterySlot(idx);
                                            setShowMasteryModal(true);
                                        }}
                                        className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-2 ${
                                            selectedWeapon 
                                            ? 'bg-primary/5 border-primary shadow-[0_4px_15px_rgba(53,158,255,0.08)]' 
                                            : 'bg-white dark:bg-surface-dark border-dashed border-slate-300 dark:border-white/10'
                                        }`}
                                    >
                                        {!selectedWeapon ? (
                                            <div className="flex items-center justify-between opacity-60 group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-slate-400">swords</span>
                                                    </div>
                                                    <span className="font-bold text-slate-400 uppercase tracking-tight">{t.select_weapon_mastery_prompt}</span>
                                                </div>
                                                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">add_circle</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <span className="material-symbols-outlined text-primary text-xl">swords</span>
                                                            <span className="font-bold text-lg text-slate-900 dark:text-white leading-none">{selectedWeapon.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary text-background-dark uppercase">
                                                                {selectedWeapon.mastery}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                                {selectedWeapon.damage} {selectedWeapon.damageType}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg">edit</span>
                                                </div>
                                                <div className="p-3 bg-white/50 dark:bg-black/20 rounded-xl border border-primary/10">
                                                    <p className="text-xs text-slate-500 dark:text-slate-300 italic leading-snug">
                                                        {selectedWeapon.mastery && MASTERY_DESCRIPTIONS[selectedWeapon.mastery]}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {showMasteryModal && (
                <WeaponMasteryModal 
                    currentSlot={activeMasterySlot} 
                    selectedMasteries={selectedMasteries} 
                    onSelect={(m) => setMasteryAtIndex(activeMasterySlot, m)}
                    onClose={() => setShowMasteryModal(false)}
                />
            )}

            {maxExpertise > 0 && (
                <div className="mt-8 animate-fadeIn pb-10">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">{t.expertise}</h3>
                        <div className="text-sm font-medium text-slate-500">{t.chosen}: <span className={`${selectedExpertise.length === maxExpertise ? 'text-primary' : 'text-slate-900 dark:text-white'} font-bold`}>{selectedExpertise.length}</span> / {maxExpertise}</div>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">{t.expertise_desc}</p>
                    <div className="grid grid-cols-1 gap-2">
                        {SKILL_LIST.map(skill => {
                            const isProf = (backgroundData?.skills || []).includes(skill) || selectedSkills.includes(skill) || selectedHumanSkill === skill || selectedElfSkill === skill;
                            if (!isProf) return null;
                            const isSelected = selectedExpertise.includes(skill);
                            const isDisabled = !isSelected && selectedExpertise.length >= maxExpertise;
                            return (
                                <button key={skill} onClick={() => toggleExpertise(skill)} disabled={isDisabled} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isSelected ? 'bg-primary/5 border-primary shadow-[0_0_15px_rgba(53,158,255,0.2)]' : isDisabled ? 'opacity-40' : 'bg-white dark:bg-surface-dark border-slate-200'}`}>
                                    <span className={`font-bold ${isSelected ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{skill}</span>
                                    {isSelected && <span className="material-symbols-outlined text-primary">verified</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step4Skills;
