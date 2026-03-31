
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Character, Ability, Trait } from '../../types';
import { SPECIES_DETAILS, CLASS_DETAILS, CLASS_PROGRESSION, SUBCLASS_OPTIONS, ELDRITCH_INVOCATIONS } from '../../Data/characterOptions';
import { FEAT_OPTIONS, GENERIC_FEATURES } from '../../Data/feats';
import { CANTRIPS } from '../../Data/spells/cantrips';
import { LEVEL1 } from '../../Data/spells/level1';
import { SPELL_DETAILS } from '../../Data/spells';
import { getFinalStats } from '../../utils/sheetUtils';

interface FeaturesTabProps {
    character: Character;
    onUpdate: (char: Character) => void;
    isReadOnly?: boolean;
}

interface FeatureItem {
    name: string;
    description: string;
    level: number;
    source: 'Species' | 'Class' | 'Subclass' | 'Feat';
}

const ICON_MAP: Record<string, string> = { 
    'Class': 'shield', 
    'Subclass': 'auto_awesome', 
    'Species': 'face', 
    'Feat': 'military_tech' 
};

const FeaturesTab: React.FC<FeaturesTabProps> = ({ character, onUpdate, isReadOnly }) => {
    const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);
    
    const [showInvocationsModal, setShowInvocationsModal] = useState(false);
    const [invocationSearch, setInvocationSearch] = useState('');

    const [showOriginFeatSelector, setShowOriginFeatSelector] = useState(false);

    const [showInvocationTray, setShowInvocationTray] = useState(false);

    const [showTomeConfig, setShowTomeConfig] = useState(false);
    const [tempPactCantrips, setTempPactCantrips] = useState<string[]>(character.pactCantrips || []);
    const [tempPactRituals, setTempPactRituals] = useState<string[]>(character.pactRituals || []);
    
    const [showAgonizingConfig, setShowAgonizingConfig] = useState(false);
    const [tempAgonizingCantrips, setTempAgonizingCantrips] = useState<string[]>(character.agonizingBlastCantrips || []);

    const [showLessonsConfig, setShowLessonsConfig] = useState(false);
    const [targetLessonsInstance, setTargetLessonsInstance] = useState<string | null>(null);

    const finalStats = useMemo(() => getFinalStats(character), [character]);
    const chaMod = Math.floor(((finalStats.CHA || 10) - 10) / 2);

    const isWarlock = character.class === 'Warlock';

    const maxInvocations = useMemo(() => {
        const lvl = character.level;
        if (lvl >= 18) return 10;
        if (lvl >= 15) return 9;
        if (lvl >= 12) return 8;
        if (lvl >= 9) return 7;
        if (lvl >= 7) return 6;
        if (lvl >= 5) return 5;
        if (lvl >= 2) return 3;
        return 1;
    }, [character.level]);

    const currentInvocationsCount = (character.invocations || []).length;

    const groupedFeatures = useMemo(() => {
        const list: FeatureItem[] = [];
        const speciesData = SPECIES_DETAILS[character.species];
        
        if (speciesData) {
            speciesData.traits.forEach(t => list.push({...t, source: 'Species', level: 1}));
            if (character.subspecies) {
                const subData = speciesData.subspecies?.find(s => s.name === character.subspecies);
                subData?.traits.forEach(t => list.push({...t, source: 'Species', level: 1}));
            }
        }

        const classData = CLASS_DETAILS[character.class];
        if (classData) classData.traits.forEach(t => list.push({...t, source: 'Class', level: 1}));

        const subclassList = SUBCLASS_OPTIONS[character.class] || [];
        const subclassData = subclassList.find(s => s.name === character.subclass);

        for (let l = 1; l <= character.level; l++) {
            const prog = CLASS_PROGRESSION[character.class]?.[l] || [];
            prog.forEach(featName => {
                if (l === 1 && classData?.traits.some(t => t.name === featName)) return;
                let desc = GENERIC_FEATURES[featName] || '';
                if (featName === 'Ability Score Improvement') desc = "You gain a feat of your choice or the Ability Score Improvement feat.";
                list.push({ name: featName, description: desc, level: l, source: 'Class' });
            });
            if (subclassData && subclassData.features[l]) {
                subclassData.features[l].forEach(trait => {
                    list.push({ ...trait, source: 'Subclass', level: l });
                });
            }
        }

        character.feats.forEach(f => {
            const featOpt = FEAT_OPTIONS.find(fo => fo.name === f);
            list.push({ name: f, description: featOpt?.description || 'Special ability or feat.', level: 1, source: 'Feat' });
        });

        if (character.invocations) {
            character.invocations.forEach(invName => {
                const baseName = invName.split(' (')[0];
                const data = ELDRITCH_INVOCATIONS.find(i => i.name === baseName);
                list.push({ name: `Invocation: ${invName}`, description: data?.description || '', level: data?.level || 1, source: 'Subclass' });
            });
        }

        const groups: Record<string, FeatureItem[]> = { 'Species': [], 'Class': [], 'Subclass': [], 'Feat': [] };
        list.forEach(feat => groups[feat.source].push(feat));
        return groups;
    }, [character]);

    const toggleInvocation = (name: string) => {
        if (isReadOnly) return;
        const current = character.invocations || [];
        if (name === 'Lessons of the First Ones') {
            if (current.length < maxInvocations) setShowOriginFeatSelector(true);
            return;
        }
        if (current.includes(name)) {
            onUpdate({ ...character, invocations: current.filter(i => i !== name) });
        } else {
            if (current.length < maxInvocations) {
                onUpdate({ ...character, invocations: [...current, name] });
            }
        }
    };

    const selectOriginFeatForLessons = (featName: string) => {
        if (isReadOnly) return;
        const currentInvs = character.invocations || [];
        const currentFeats = character.feats || [];
        const currentLessons = character.lessonsFeats || [];
        let updatedHp = { ...character.hp };
        if (featName === 'Duro' || featName === 'Tough') {
            const bonus = character.level * 2;
            updatedHp.max += bonus;
            updatedHp.current += bonus;
        }
        onUpdate({
            ...character,
            invocations: [...currentInvs, `Lessons of the First Ones (${featName})`],
            feats: [...currentFeats, featName],
            lessonsFeats: [...currentLessons, featName],
            hp: updatedHp
        });
        setShowOriginFeatSelector(false);
    };

    const removeInvocationWithFeat = (fullInvName: string) => {
        if (isReadOnly) return;
        const currentInvs = character.invocations || [];
        const currentFeats = character.feats || [];
        const currentLessons = character.lessonsFeats || [];
        const featMatch = fullInvName.match(/Lessons of the First Ones \((.*)\)/);
        if (featMatch) {
            const featName = featMatch[1];
            let updatedHp = { ...character.hp };
            if (featName === 'Duro' || featName === 'Tough') {
                const bonus = character.level * 2;
                updatedHp.max = Math.max(1, updatedHp.max - bonus);
                updatedHp.current = Math.max(1, updatedHp.current - bonus);
            }
            onUpdate({
                ...character,
                invocations: currentInvs.filter(i => i !== fullInvName),
                feats: currentFeats.filter(f => f !== featName),
                lessonsFeats: currentLessons.filter(f => f !== featName),
                hp: updatedHp
            });
        } else {
            onUpdate({ ...character, invocations: currentInvs.filter(i => i !== fullInvName) });
        }
    };

    const renderSection = (title: string, items: FeatureItem[]) => {
        if (items.length === 0) return null;
        const icon = ICON_MAP[title] || 'stars';
        return (
            <div key={title} className="flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-2 px-1">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-lg">{icon}</span></div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{title === 'Feat' ? 'Feats & Features' : `${title} Features`}</h3>
                </div>
                <div className="space-y-2">
                    {items.map((feat, idx) => (
                        <div key={`${feat.name}-${idx}`} onClick={() => setSelectedFeature(feat)} className="rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 shadow-sm hover:border-primary/40 transition-all cursor-pointer group active:scale-[0.98]">
                            <div className="p-4 flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-slate-900 dark:text-white text-base font-bold truncate group-hover:text-primary transition-colors">{feat.name}</h4>
                                        {feat.level > 1 && <span className="text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded">Lvl {feat.level}</span>}
                                    </div>
                                    {feat.description && <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{feat.description.split('\n')[0]}</p>}
                                </div>
                                <span className="material-symbols-outlined text-slate-400 opacity-50">chevron_right</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="px-4 pb-24 pt-4">
            {isWarlock && (
                <div className="space-y-3 mb-8">
                    <div className="relative overflow-hidden group/warlock shadow-sm">
                        <div className="absolute inset-0 bg-fuchsia-600/5 blur-2xl group-hover/warlock:bg-fuchsia-600/10 transition-colors"></div>
                        <div className="relative flex flex-col gap-3 rounded-3xl bg-surface-light dark:bg-surface-dark p-5 border border-fuchsia-500/30 backdrop-blur-md shadow-[0_4px_20px_-10px_rgba(217,70,239,0.3)]">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-fuchsia-500/10 dark:bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 shrink-0 border border-fuchsia-500/20">
                                    <span className="material-symbols-outlined text-2xl animate-pulse">auto_fix_normal</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[10px] font-black text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wider leading-none mb-1">Manifest Powers</h4>
                                    <p className="text-sm font-bold text-slate-700 dark:text-white truncate">{currentInvocationsCount} Active Invocations</p>
                                </div>
                                <button onClick={() => setShowInvocationTray(true)} className="px-4 py-2.5 rounded-2xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-fuchsia-500/20 active:scale-95 transition-all whitespace-nowrap shrink-0">{isReadOnly ? 'View Tray' : 'Open Tray'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {renderSection('Species', groupedFeatures['Species'])}
            {renderSection('Class', groupedFeatures['Class'])}
            {renderSection('Subclass', groupedFeatures['Subclass'])}
            {renderSection('Feat', groupedFeatures['Feat'])}

            {selectedFeature && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedFeature(null)}>
                    <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl flex flex-col max-h-[80vh] animate-scaleUp" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-5 border-b border-slate-100 dark:border-white/5 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{selectedFeature.name}</h3>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-2 border border-primary/10">
                                    <span className="material-symbols-outlined text-[12px]">{ICON_MAP[selectedFeature.source]}</span>
                                    {selectedFeature.source}
                                </span>
                            </div>
                            <button onClick={() => setSelectedFeature(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-400"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                            <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</span></div>
                            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-body whitespace-pre-wrap">{selectedFeature.description}</div>
                        </div>
                        <button onClick={() => setSelectedFeature(null)} className="w-full py-4 bg-primary text-background-dark font-bold rounded-2xl mt-6">Close</button>
                    </div>
                </div>,
                document.body
            )}

            {/* MODALES DEL BRUJO */}
            {showInvocationTray && createPortal(
                <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col pt-[env(safe-area-inset-top)] animate-fadeIn">
                    <div className="p-4 bg-surface-light dark:bg-surface-dark border-b border-black/5 dark:border-white/10 flex items-center justify-between">
                        <button onClick={() => setShowInvocationTray(false)} className="size-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500"><span className="material-symbols-outlined">close</span></button>
                        <h3 className="text-lg font-black uppercase tracking-widest text-fuchsia-500">Invocaciones Arcanas</h3>
                        <div className="w-10"></div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                        <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-2xl p-4 flex justify-between items-center">
                            <div className="flex-1 pr-4">
                                <p className="text-[10px] font-black uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400 mb-1">Pact Boon</p>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Límite de Invocaciones</h4>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xl font-black ${currentInvocationsCount >= maxInvocations ? 'text-red-500' : 'text-fuchsia-500'}`}>{currentInvocationsCount}</span>
                                <span className="text-slate-400 font-bold">/ {maxInvocations}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {character.invocations?.map((invName) => {
                                const baseName = invName.split(' (')[0];
                                const invData = ELDRITCH_INVOCATIONS.find(i => i.name === baseName);
                                const isTome = baseName === 'Pact of the Tome';
                                const isAgonizing = baseName === 'Agonizing Blast';
                                const isLessons = baseName === 'Lessons of the First Ones';
                                return (
                                    <div key={invName} className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 rounded-2xl p-4 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-base font-bold text-slate-900 dark:text-white">{invName}</h4>
                                            <button onClick={() => removeInvocationWithFeat(invName)} className="text-red-500/50 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{invData?.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {isTome && <button onClick={() => setShowTomeConfig(true)} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase border border-blue-500/20 active:scale-95 transition-all"><span className="material-symbols-outlined text-xs">auto_stories</span> Configurar Tomo</button>}
                                            {isAgonizing && <button onClick={() => setShowAgonizingConfig(true)} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase border border-amber-500/20 active:scale-95 transition-all"><span className="material-symbols-outlined text-xs">bolt</span> Configurar Rayos</button>}
                                            {isLessons && <button onClick={() => { setTargetLessonsInstance(invName); setShowLessonsConfig(true); }} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase border border-emerald-500/20 active:scale-95 transition-all"><span className="material-symbols-outlined text-xs">military_tech</span> Change Feat</button>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="fixed bottom-[env(safe-area-inset-bottom)] left-0 w-full p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-black/5 dark:border-white/5 flex gap-3">
                        <button onClick={() => setShowInvocationsModal(true)} disabled={currentInvocationsCount >= maxInvocations} className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.1em] shadow-lg transition-all active:scale-95 ${currentInvocationsCount >= maxInvocations ? 'bg-slate-200 dark:bg-white/5 text-slate-400 cursor-not-allowed' : 'bg-fuchsia-600 text-white shadow-fuchsia-500/30'}`}>Learn New Invocation</button>
                    </div>
                </div>,
                document.body
            )}

            {showInvocationsModal && createPortal(
                <div className="fixed inset-0 z-[70] bg-background-light dark:bg-background-dark flex flex-col pt-[env(safe-area-inset-top)] animate-fadeIn">
                    <div className="flex flex-col border-b border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark">
                        <div className="flex items-center gap-4 p-4">
                            <button onClick={() => setShowInvocationsModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"><span className="material-symbols-outlined">arrow_back</span></button>
                            <div className="flex-1 relative">
                                <input type="text" placeholder="Search invocation..." value={invocationSearch} onChange={(e) => setInvocationSearch(e.target.value)} autoFocus className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-slate-900 dark:text-white outline-none focus:border-fuchsia-500/50" />
                                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500">search</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-[env(safe-area-inset-bottom)]">
                        {ELDRITCH_INVOCATIONS
                            .filter(i => (i.repeatable || !character.invocations?.some(ci => ci.startsWith(i.name))) && i.name.toLowerCase().includes(invocationSearch.toLowerCase()) && (i.level || 1) <= character.level)
                            .map(inv => (
                                <button key={inv.name} onClick={() => { toggleInvocation(inv.name); if(inv.name !== 'Lessons of the First Ones') setShowInvocationsModal(false); }} className="w-full text-left p-4 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 hover:border-fuchsia-500/40 transition-all group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-base text-slate-900 dark:text-white group-hover:text-fuchsia-500">{inv.name}</span>
                                        {inv.level && <span className="text-[10px] font-black text-fuchsia-500 bg-fuchsia-500/10 px-1.5 py-0.5 rounded">Lvl {inv.level}</span>}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{inv.description}</p>
                                </button>
                            ))}
                    </div>
                </div>,
                document.body
            )}

            {showOriginFeatSelector && createPortal(
                <div className="fixed inset-0 z-[80] bg-background-light dark:bg-background-dark flex flex-col pt-[env(safe-area-inset-top)] animate-fadeIn">
                    <div className="p-4 border-b border-black/5 dark:border-white/10 bg-white dark:bg-surface-dark flex items-center justify-between">
                        <button onClick={() => setShowOriginFeatSelector(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500"><span className="material-symbols-outlined">close</span></button>
                        <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500">Lessons of the First</h3>
                        <div className="w-10"></div>
                    </div>
                    <div className="p-4 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center border-b border-emerald-500/10 uppercase tracking-tighter">Choose an Origin Feat (Level 1)</div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {FEAT_OPTIONS.filter(f => f.description.includes('Origin Feat') && !character.feats?.includes(f.name)).map(feat => (
                            <button key={feat.name} onClick={() => { selectOriginFeatForLessons(feat.name); setShowOriginFeatSelector(false); setShowInvocationsModal(false); }} className="w-full text-left p-4 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 hover:border-emerald-500/40 transition-all group">
                                <span className="block font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-500 mb-1">{feat.name}</span>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{feat.description}</p>
                            </button>
                        ))}
                    </div>
                </div>,
                document.body
            )}

            {showTomeConfig && createPortal(
                <div className="fixed inset-0 z-[80] bg-background-light dark:bg-background-dark flex flex-col pt-[env(safe-area-inset-top)] animate-fadeIn">
                    <div className="p-4 border-b border-black/5 dark:border-white/10 bg-white dark:bg-surface-dark flex items-center justify-between">
                        <button onClick={() => setShowTomeConfig(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500"><span className="material-symbols-outlined">close</span></button>
                        <h3 className="text-sm font-black uppercase tracking-widest text-blue-500">Tome Pact</h3>
                        <div className="w-10"></div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-8">
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex justify-between items-center px-1"><span>3 Cantrips from any class</span><span className={`text-[10px] ${tempPactCantrips.length === 3 ? 'text-primary' : 'text-slate-500'}`}>{tempPactCantrips.length}/3</span></h4>
                            <div className="grid grid-cols-1 gap-2">
                                {Object.keys(CANTRIPS).map(name => {
                                    const isSelected = tempPactCantrips.includes(name);
                                    const canAdd = tempPactCantrips.length < 3;
                                    return (
                                        <button key={name} onClick={() => isSelected ? setTempPactCantrips(prev => prev.filter(n => n !== name)) : canAdd && setTempPactCantrips(prev => [...prev, name])} className={`text-left p-3 rounded-xl border transition-all ${isSelected ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-white/5 opacity-80'}`}>
                                            <div className="flex justify-between items-center"><span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>{name}</span>{isSelected && <span className="material-symbols-outlined text-primary text-base">check_circle</span>}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex justify-between items-center px-1"><span>2 Rituales de nivel 1</span><span className={`text-[10px] ${tempPactRituals.length === 2 ? 'text-primary' : 'text-slate-500'}`}>{tempPactRituals.length}/2</span></h4>
                            <div className="grid grid-cols-1 gap-2">
                                {Object.keys(LEVEL1).filter(name => LEVEL1[name].description.includes('Ritual')).map(name => {
                                    const isSelected = tempPactRituals.includes(name);
                                    const canAdd = tempPactRituals.length < 2;
                                    return (
                                        <button key={name} onClick={() => isSelected ? setTempPactRituals(prev => prev.filter(n => n !== name)) : canAdd && setTempPactRituals(prev => [...prev, name])} className={`text-left p-3 rounded-xl border transition-all ${isSelected ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-white/5 opacity-80'}`}>
                                            <div className="flex justify-between items-center"><span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>{name}</span>{isSelected && <span className="material-symbols-outlined text-primary text-base">check_circle</span>}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-black/5 dark:border-white/5">
                        <button onClick={() => { onUpdate({ ...character, pactCantrips: tempPactCantrips, pactRituals: tempPactRituals }); setShowTomeConfig(false); }} className="w-full py-4 rounded-2xl bg-primary text-background-dark font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20">Seal Pact</button>
                    </div>
                </div>,
                document.body
            )}

            {showAgonizingConfig && createPortal(
                <div className="fixed inset-0 z-[80] bg-background-light dark:bg-background-dark flex flex-col pt-[env(safe-area-inset-top)] animate-fadeIn">
                    <div className="p-4 border-b border-black/5 dark:border-white/10 bg-white dark:bg-surface-dark flex items-center justify-between">
                        <button onClick={() => setShowAgonizingConfig(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500"><span className="material-symbols-outlined">close</span></button>
                        <h3 className="text-sm font-black uppercase tracking-widest text-amber-500">Agonizing Blast</h3>
                        <div className="w-10"></div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10 italic text-center">Choose the cantrips that will add your Charisma modifier to damage.</p>
                        <div className="grid grid-cols-1 gap-2">
                            {character.preparedSpells?.filter(s => SPELL_DETAILS[s]?.level === 0 && (SPELL_DETAILS[s]?.description.includes('ranged spell attack') || SPELL_DETAILS[s]?.description.includes('melee spell attack') || s === 'Eldritch Blast')).map(name => {
                                const isSelected = tempAgonizingCantrips.includes(name);
                                return (
                                    <button key={name} onClick={() => isSelected ? setTempAgonizingCantrips(prev => prev.filter(n => n !== name)) : setTempAgonizingCantrips(prev => [...prev, name])} className={`text-left p-4 rounded-2xl border transition-all ${isSelected ? 'bg-amber-500/10 border-amber-500 shadow-sm' : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-white/5'}`}>
                                        <div className="flex justify-between items-center"><span className={`font-bold ${isSelected ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>{name}</span>{isSelected && <span className="material-symbols-outlined text-amber-500">check_circle</span>}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-black/5 dark:border-white/5">
                        <button onClick={() => { onUpdate({ ...character, agonizingBlastCantrips: tempAgonizingCantrips }); setShowAgonizingConfig(false); }} className="w-full py-4 rounded-2xl bg-amber-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20">Save Selection</button>
                    </div>
                </div>,
                document.body
            )}

            {showLessonsConfig && createPortal(
                <div className="fixed inset-0 z-[80] bg-background-light dark:bg-background-dark flex flex-col pt-[env(safe-area-inset-top)] animate-fadeIn">
                    <div className="p-4 border-b border-black/5 dark:border-white/10 bg-white dark:bg-surface-dark flex items-center justify-between">
                        <button onClick={() => setShowLessonsConfig(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500"><span className="material-symbols-outlined">close</span></button>
                        <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500">Change Lesson</h3>
                        <div className="w-10"></div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {FEAT_OPTIONS.filter(f => f.description.includes('Origin Feat') && !character.feats?.includes(f.name)).map(feat => (
                            <button key={feat.name} onClick={() => {
                                const currentFeat = targetLessonsInstance?.match(/\((.*)\)/)?.[1];
                                if (currentFeat) {
                                    let updatedHp = { ...character.hp };
                                    if (currentFeat === 'Duro' || currentFeat === 'Tough') {
                                        const bonus = character.level * 2;
                                        updatedHp.max = Math.max(1, updatedHp.max - bonus);
                                        updatedHp.current = Math.max(1, updatedHp.current - bonus);
                                    }
                                    if (feat.name === 'Duro' || feat.name === 'Tough') {
                                        const bonus = character.level * 2;
                                        updatedHp.max += bonus;
                                        updatedHp.current += bonus;
                                    }
                                    onUpdate({
                                        ...character,
                                        invocations: character.invocations?.map(inv => inv === targetLessonsInstance ? `Lessons of the First Ones (${feat.name})` : inv),
                                        feats: character.feats?.map(f => f === currentFeat ? feat.name : f),
                                        lessonsFeats: character.lessonsFeats?.map(f => f === currentFeat ? feat.name : f),
                                        hp: updatedHp
                                    });
                                }
                                setShowLessonsConfig(false);
                            }} className="w-full text-left p-4 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 hover:border-emerald-500/40 transition-all group">
                                <span className="block font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-500 mb-1">{feat.name}</span>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{feat.description}</p>
                            </button>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default FeaturesTab;
