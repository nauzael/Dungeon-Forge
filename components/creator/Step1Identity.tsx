
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { SectionSeparator } from './Shared';
import { HIT_DIE, CLASS_STAT_PRIORITIES, SUBCLASS_OPTIONS, CLASS_LIST, SPECIES_LIST } from '../../Data/characterOptions';
import { CLASS_UI_MAP, SPECIES_UI_MAP, BACKGROUND_UI_MAP } from '../../constants';
import { SPELL_LIST_BY_CLASS } from '../../Data/spells';
import { SCHOOL_THEMES } from '../../utils/sheetUtils';
import { useLanguage } from '../../hooks/useLanguage';
import { useClasses } from '../../Data/classes';
import { useSpecies } from '../../Data/species';
import { useGameData } from '../../hooks/useGameData';
import { CLASS_AVATARS, SPECIES_AVATARS } from '../../Data/avatars';

interface Step1Props {
    name: string;
    setName: (v: string) => void;
    charImage: string;
    setCharImage: (v: string) => void;
    level: number;
    setLevel: (v: number) => void;
    selectedClass: string;
    setSelectedClass: (v: string) => void;
    selectedSubclass: string;
    setSelectedSubclass: (v: string) => void;
    selectedSpecies: string;
    setSelectedSpecies: (v: string) => void;
    selectedSubspecies: string;
    setSelectedSubspecies: (v: string) => void;
    selectedBackground: string;
    setSelectedBackground: (v: string) => void;
    bgSpells: string[];
    setBgSpells: (v: string[]) => void;
}

const DEFAULT_CHAR_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuAn_LidL9u8S0A9NqU9kR8iS6X9k-y7Z1Q7I6n0z7C9E0w=s512";

const Step1Identity: React.FC<Step1Props> = ({
    name, setName, charImage, setCharImage, level, setLevel,
    selectedClass, setSelectedClass, selectedSubclass, setSelectedSubclass,
    selectedSpecies, setSelectedSpecies, selectedSubspecies, setSelectedSubspecies,
    selectedBackground, setSelectedBackground,
    bgSpells, setBgSpells
}) => {
    const { t, language } = useLanguage();
    const classes = useClasses();
    const speciesList = useSpecies();
    const { backgrounds, spells: SPELL_DETAILS } = useGameData();

    const classData = classes[selectedClass]?.details as any;
    const speciesData = speciesList[selectedSpecies] as any;
    const backgroundData = backgrounds[selectedBackground];
    const availableSubclasses = SUBCLASS_OPTIONS[selectedClass] || [];
    const availableSubspecies = speciesData?.subspecies || [];

    const [showImageOptions, setShowImageOptions] = useState(false);
    const [showMagicModal, setShowMagicModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Refs for scroll containers
    const classScrollRef = useRef<HTMLDivElement>(null);
    const subclassScrollRef = useRef<HTMLDivElement>(null);
    const speciesScrollRef = useRef<HTMLDivElement>(null);
    const subspeciesScrollRef = useRef<HTMLDivElement>(null);
    const backgroundScrollRef = useRef<HTMLDivElement>(null);

    // Detección de magia por trasfondo (PHB 2024 Magic Initiate)
    const bgMagicConfig = useMemo(() => {
        if (!backgroundData) return null;
        const featName = backgroundData.feat;
        const isMagicInitiate = featName.includes('Magic Initiate') || featName.includes('Iniciado en la Magia');
        
        if (isMagicInitiate) {
            let listType: 'Cleric' | 'Druid' | 'Wizard' = 'Wizard';
            if (featName.includes('Cleric') || featName.includes('Clérigo')) listType = 'Cleric';
            if (featName.includes('Druid') || featName.includes('Druida')) listType = 'Druid';
            
            return {
                type: listType,
                cantripsNeeded: 2,
                level1Needed: 1,
                sourceList: SPELL_LIST_BY_CLASS[listType] || []
            };
        }
        return null;
    }, [backgroundData]);

    // Limpiar hechizos si cambia el trasfondo y subespecie si cambia la especie
    useEffect(() => {
        setBgSpells([]);
    }, [selectedBackground, setBgSpells]);

    useEffect(() => {
        if (selectedSpecies && availableSubspecies.length > 0) {
            if (!availableSubspecies.find((s: any) => s.name === selectedSubspecies)) {
                setSelectedSubspecies('');
            }
        } else {
            setSelectedSubspecies('');
        }
    }, [selectedSpecies]);

    // Avatar suggestion logic
    useEffect(() => {
        const avatars = [
            ...(CLASS_AVATARS[selectedClass]?.male || []),
            ...(CLASS_AVATARS[selectedClass]?.female || []),
            ...(SPECIES_AVATARS[selectedSpecies]?.male || []),
            ...(SPECIES_AVATARS[selectedSpecies]?.female || [])
        ];
        
        // Solo sugerir si la imagen actual es la predeterminada "vacía"
        const isDefault = charImage === DEFAULT_CHAR_IMAGE;
        
        if (isDefault) {
            const suggested = avatars[0] || DEFAULT_CHAR_IMAGE;
            if (charImage !== suggested) {
                setCharImage(suggested);
            }
        }
    }, [selectedClass, selectedSpecies]);

    const toggleBgSpell = (spellName: string, lvl: number) => {
        if (!bgMagicConfig) return;
        const current = [...bgSpells];
        const isSelected = current.includes(spellName);
        
        if (isSelected) {
            setBgSpells(current.filter(s => s !== spellName));
        } else {
            const currentLvl0 = current.filter(s => SPELL_DETAILS[s]?.level === 0).length;
            const currentLvl1 = current.filter(s => SPELL_DETAILS[s]?.level === 1).length;
            
            if (lvl === 0 && currentLvl0 < bgMagicConfig.cantripsNeeded) {
                setBgSpells([...current, spellName]);
            } else if (lvl === 1 && currentLvl1 < bgMagicConfig.level1Needed) {
                setBgSpells([...current, spellName]);
            }
        }
    };

    // Helper to center selected element
    const centerSelected = (containerRef: React.RefObject<HTMLDivElement | null>) => {
        if (containerRef.current) {
            const selected = containerRef.current.querySelector('input:checked')?.parentElement;
            if (selected) {
                selected.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    };

    useEffect(() => centerSelected(classScrollRef), [selectedClass]);
    useEffect(() => centerSelected(subclassScrollRef), [selectedSubclass]);
    useEffect(() => centerSelected(speciesScrollRef), [selectedSpecies]);
    useEffect(() => centerSelected(subspeciesScrollRef), [selectedSubspecies]);
    useEffect(() => centerSelected(backgroundScrollRef), [selectedBackground]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert("The image is too large. Please choose one under 2MB.");
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result === 'string') {
                setCharImage(result);
                setShowImageOptions(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleUrlPrompt = () => {
        const url = window.prompt("Paste image URL (Hotlink):", charImage === DEFAULT_CHAR_IMAGE ? "" : charImage);
        if (url !== null) {
            if (url.length > 5000) {
                alert("Image URL is too long. Please use a shorter direct link.");
            } else {
                setCharImage(url || DEFAULT_CHAR_IMAGE);
                setShowImageOptions(false);
            }
        }
    };

    return (
        <>
            <div className="px-6 pt-3 pb-1">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                    {t.start_adventure} <br/>
                    <span className="text-primary">{t.adventure}</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.define_identity}</p>
            </div>

            <div className="px-6 mb-4 flex items-center gap-4">
                <div className="relative shrink-0 group cursor-pointer" onClick={() => setShowImageOptions(true)}>
                    <div className="w-20 h-20 rounded-2xl bg-surface-dark border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden hover:border-primary transition-all bg-cover bg-center" style={charImage !== DEFAULT_CHAR_IMAGE ? { backgroundImage: `url(${charImage})`, borderStyle: 'solid' } : {}}>
                        {charImage === DEFAULT_CHAR_IMAGE && <span className="material-symbols-outlined text-3xl text-slate-500 group-hover:text-primary transition-colors">add_a_photo</span>}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-background-dark">
                        <span className="material-symbols-outlined text-background-dark text-xs font-bold">edit</span>
                    </div>
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t.character_name}</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-lg font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-sm" placeholder={t.character_name_placeholder} type="text" />
                </div>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

            {showImageOptions && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setShowImageOptions(false)}>
                    <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl animate-scaleUp" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-6 text-center">{t.profile_image}</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-4 p-4 rounded-2xl bg-primary text-background-dark font-bold transition-transform active:scale-95">
                                <span className="material-symbols-outlined">upload</span>
                                <span>{t.upload_local}</span>
                            </button>
                            <button onClick={handleUrlPrompt} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold transition-transform active:scale-95">
                                <span className="material-symbols-outlined">link</span>
                                <span>{t.use_url}</span>
                            </button>
                        </div>
                        {charImage !== DEFAULT_CHAR_IMAGE && (
                            <button onClick={() => { setCharImage(DEFAULT_CHAR_IMAGE); setShowImageOptions(false); }} className="flex items-center gap-4 p-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold transition-transform active:scale-95">
                                <span className="material-symbols-outlined">delete</span>
                                <span>{t.delete_photo}</span>
                            </button>
                        )}

                        <div className="mt-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Suggested for {selectedClass}</h4>
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    ...(CLASS_AVATARS[selectedClass]?.male || []),
                                    ...(CLASS_AVATARS[selectedClass]?.female || []),
                                    ...(SPECIES_AVATARS[selectedSpecies]?.male || []),
                                    ...(SPECIES_AVATARS[selectedSpecies]?.female || []),
                                    '/assets/avatars/fighter.png', '/assets/avatars/wizard.png', '/assets/avatars/cleric.png', '/assets/avatars/warlock.png'
                                ]
                                    .filter((v, i, a) => v && a.indexOf(v) === i)
                                    .map((url, idx) => (
                                        <button 
                                            key={idx} 
                                            onClick={() => { setCharImage(url!); setShowImageOptions(false); }} 
                                            className={`aspect-square rounded-xl bg-cover bg-center border-2 transition-all active:scale-90 ${charImage === url ? 'border-primary' : 'border-transparent'}`}
                                            style={{ backgroundImage: `url(${url})` }}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                        
                        <button onClick={() => setShowImageOptions(false)} className="w-full mt-6 py-3 font-bold text-slate-400 uppercase tracking-widest text-xs">{t.cancel}</button>
                    </div>
                </div>,
                document.body
            )}

            <SectionSeparator label={t.class} />
            <div className="mb-4">
                <div className="px-6 flex justify-between items-end mb-3">
                    <h3 className="text-lg font-bold">{t.class}</h3>
                    <span className="text-primary text-xs font-medium">{classData?.name}</span>
                </div>
                <div className="w-full relative group">
                    <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-background-light to-transparent dark:from-background-dark z-10 pointer-events-none"></div>
                    <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-background-light to-transparent dark:from-background-dark z-10 pointer-events-none"></div>
                    <div ref={classScrollRef} className="flex overflow-x-auto gap-4 px-6 py-6 no-scrollbar w-full snap-x snap-mandatory">
                        {CLASS_LIST.map((cls) => {
                            const ui = CLASS_UI_MAP[cls] || { role: 'Aventurero', color: 'text-slate-400', icon: 'person' };
                            const isSelected = selectedClass === cls;
                            return (
                                <label key={cls} className="relative shrink-0 cursor-pointer group/card snap-center scroll-m-6">
                                    <input className="peer sr-only" name="class" type="radio" checked={isSelected} onChange={() => setSelectedClass(cls)} />
                                    <div className={`w-36 h-52 rounded-3xl p-4 flex flex-col items-center justify-between transition-all duration-300 ease-out border-2 ${isSelected ? 'bg-white dark:bg-surface-dark border-primary shadow-[0_10px_30px_-10px_rgba(53,158,255,0.4)] scale-105' : 'bg-white/60 dark:bg-surface-dark/60 border-transparent hover:border-slate-300 shadow-sm'}`}>
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-inner ${isSelected ? 'bg-primary/10 rotate-3' : 'bg-slate-100 dark:bg-white/5 group-hover/card:scale-110'}`}>
                                            <span className={`material-symbols-outlined text-4xl ${ui.color} transition-transform ${isSelected ? 'scale-110' : ''}`}>{ui.icon}</span>
                                        </div>
                                        <div className="text-center space-y-1 w-full">
                                            <span className={`block font-bold text-base tracking-tight truncate ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{cls}</span>
                                            <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider truncate w-full">{ui.role}</span>
                                        </div>
                                        <div className={`absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-black shadow-sm transition-all duration-300 ${isSelected ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`}>
                                            <span className="material-symbols-outlined text-sm font-bold">check</span>
                                        </div>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className="px-6 mt-2 space-y-3">
                    <p className="text-sm text-slate-600 dark:text-slate-300 italic">{classData?.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 dark:bg-surface-dark p-3 rounded-xl border border-slate-100 dark:border-white/5">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">{t.hit_die}</span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">d{HIT_DIE[selectedClass]}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-surface-dark p-3 rounded-xl border border-slate-100 dark:border-white/5">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">{t.primary_ability}</span>
                            <span className="text-lg font-bold text-primary">{CLASS_STAT_PRIORITIES[selectedClass]?.[0]}</span>
                        </div>
                    </div>
                </div>

                <div className="px-6 mt-4">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t.level}</label>
                    <div className="relative">
                        <select value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-10 py-3 text-base font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm appearance-none">
                            {Array.from({length: 20}, (_, i) => i + 1).map(lvl => <option key={lvl} value={lvl}>{t.level} {lvl}</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-slate-500 dark:text-slate-400">
                            <span className="material-symbols-outlined">expand_more</span>
                        </div>
                    </div>
                </div>
            </div>

            {availableSubclasses.length > 0 && level >= 3 && (
                <div className="mb-4 animate-fadeIn">
                    <SectionSeparator label={t.subclass_linage} />
                    <div className="px-6 flex flex-col items-center mb-4 text-center">
                        <h3 className="text-xl font-bold">{t.subclass_title}</h3>
                        <span className="text-primary text-sm font-medium mt-1 max-w-[80%] truncate">{selectedSubclass || t.select_specialization}</span>
                    </div>
                    <div className="w-full relative group">
                        <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-background-light to-transparent dark:from-background-dark z-10 pointer-events-none"></div>
                        <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-background-light to-transparent dark:from-background-dark z-10 pointer-events-none"></div>
                        <div ref={subclassScrollRef} className="flex overflow-x-auto gap-4 px-6 py-4 no-scrollbar w-full snap-x snap-mandatory">
                            {availableSubclasses.map((sub) => {
                                const isSelected = selectedSubclass === sub.name;
                                return (
                                    <label key={sub.name} className="relative shrink-0 cursor-pointer group/card snap-center scroll-m-6">
                                        <input className="peer sr-only" name="subclass" type="radio" checked={isSelected} onChange={() => setSelectedSubclass(sub.name)} />
                                        <div className={`w-64 min-h-[14rem] h-full rounded-2xl p-5 flex flex-col items-center gap-1 transition-all duration-300 ease-out border-2 text-center relative ${isSelected ? 'bg-white dark:bg-surface-dark border-primary shadow-[0_10px_30px_-10px_rgba(53,158,255,0.4)] scale-105 z-10' : 'bg-white/60 dark:bg-surface-dark/60 border-transparent hover:border-slate-300 shadow-sm'}`}>
                                            <div className="flex flex-col items-center w-full gap-2 flex-1">
                                                <span className={`block font-bold text-sm leading-tight px-2 ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{sub.name}</span>
                                                <div className="w-full border-t border-slate-100 dark:border-white/5 my-0.5 opacity-50"></div>
                                                <span className="block text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-1 italic">{sub.description}</span>
                                            </div>
                                            <div className={`absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-black shadow-sm transition-all duration-300 ${isSelected ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`}>
                                                <span className="material-symbols-outlined text-xs font-bold">check</span>
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <SectionSeparator label={t.species} />
            <div className="mb-4">
                <div className="px-6 flex justify-between items-end mb-3">
                    <h3 className="text-lg font-bold">{t.species}</h3>
                    <span className="text-primary text-xs font-medium">{speciesData?.name}</span>
                </div>
                <div className="w-full relative group">
                    <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-background-light to-transparent dark:from-background-dark z-10 pointer-events-none"></div>
                    <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-background-light to-transparent dark:from-background-dark z-10 pointer-events-none"></div>
                    <div ref={speciesScrollRef} className="flex overflow-x-auto gap-4 px-6 py-4 no-scrollbar w-full snap-x snap-mandatory">
                        {SPECIES_LIST.map((s) => {
                            const ui = SPECIES_UI_MAP[s] || { icon: 'face', color: 'text-slate-400' };
                            const isSelected = selectedSpecies === s;
                            return (
                                <label key={s} className="relative shrink-0 cursor-pointer group/card snap-center scroll-m-6">
                                    <input className="peer sr-only" name="species" type="radio" checked={isSelected} onChange={() => setSelectedSpecies(s)} />
                                    <div className={`w-28 h-32 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 transition-all duration-300 ease-out border-2 ${isSelected ? 'bg-white dark:bg-surface-dark border-primary shadow-lg scale-105' : 'bg-white/70 dark:bg-surface-dark/70 border-transparent hover:border-slate-300'}`}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-primary/10' : 'bg-slate-100 dark:bg-white/5'}`}>
                                            <span className={`material-symbols-outlined text-2xl ${ui.color}`}>{ui.icon}</span>
                                        </div>
                                        <span className={`font-bold text-xs text-center leading-tight ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{speciesList[s]?.name || s}</span>
                                        <div className={`absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-black shadow-sm transition-all duration-300 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                                            <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                                        </div>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>

            {availableSubspecies.length > 0 && (
                <div className="mb-4 animate-fadeIn">
                    <SectionSeparator label={t.subspecies_title} />
                    <div className="px-6 flex flex-col items-center mb-4 text-center">
                        <h3 className="text-xl font-bold">{t.select_lineage}</h3>
                        <span className="text-primary text-sm font-medium mt-1 truncate">{selectedSubspecies || t.select_specialization}</span>
                    </div>
                    <div className="w-full relative group">
                        <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-background-light to-transparent dark:from-background-dark z-10 pointer-events-none"></div>
                        <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-background-light to-transparent dark:from-background-dark z-10 pointer-events-none"></div>
                        <div ref={subspeciesScrollRef} className="flex overflow-x-auto gap-4 px-6 py-4 no-scrollbar w-full snap-x snap-mandatory">
                            {availableSubspecies.map((sub: any) => {
                                const isSelected = selectedSubspecies === sub.name;
                                return (
                                    <label key={sub.name} className="relative shrink-0 cursor-pointer group/card snap-center scroll-m-6">
                                        <input className="peer sr-only" name="subspecies" type="radio" checked={isSelected} onChange={() => setSelectedSubspecies(sub.name)} />
                                        <div className={`w-64 min-h-[12rem] h-full rounded-2xl p-5 flex flex-col items-center gap-1 transition-all duration-300 ease-out border-2 text-center relative ${isSelected ? 'bg-white dark:bg-surface-dark border-primary shadow-lg scale-105 z-10' : 'bg-white/60 dark:bg-surface-dark/60 border-transparent hover:border-slate-300 shadow-sm'}`}>
                                            <div className="flex flex-col items-center w-full gap-2 flex-1">
                                                <span className={`block font-bold text-sm leading-tight px-2 ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{sub.name}</span>
                                                <div className="w-full border-t border-slate-100 dark:border-white/5 my-0.5 opacity-50"></div>
                                                <span className="block text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-1 italic">{sub.description}</span>
                                            </div>
                                            <div className={`absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-black shadow-sm transition-all duration-300 ${isSelected ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`}>
                                                <span className="material-symbols-outlined text-xs font-bold">check</span>
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <SectionSeparator label={t.background} />
            <div className="mb-4">
                <div className="px-6 flex justify-between items-end mb-3">
                    <h3 className="text-lg font-bold">{t.background}</h3>
                    <span className="text-primary text-xs font-medium">{backgroundData?.name || selectedBackground}</span>
                </div>
                <div className="w-full relative group">
                    <div ref={backgroundScrollRef} className="flex overflow-x-auto gap-4 px-6 py-4 no-scrollbar w-full snap-x snap-mandatory">
                        {Object.keys(backgrounds).map((b) => {
                            const ui = BACKGROUND_UI_MAP[b] || { icon: 'person', color: 'text-slate-400' };
                            const bg = backgrounds[b];
                            const isSelected = selectedBackground === b;
                            return (
                                <label key={b} className="relative shrink-0 cursor-pointer group/card snap-center scroll-m-6">
                                    <input className="peer sr-only" name="background" type="radio" checked={isSelected} onChange={() => setSelectedBackground(b)} />
                                    <div className={`w-36 h-28 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 transition-all duration-300 ease-out border-2 ${isSelected ? 'bg-white dark:bg-surface-dark border-primary shadow-lg scale-105' : 'bg-white/70 dark:bg-surface-dark/70 border-transparent hover:border-slate-300'}`}>
                                        <span className={`material-symbols-outlined text-2xl ${ui.color} transition-transform`}>{ui.icon}</span>
                                        <span className={`font-bold text-xs text-center leading-tight mt-1 ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{bg.name || b}</span>
                                        <span className="text-[9px] font-bold text-primary uppercase tracking-wider text-center">{bg?.scores.join(' ')}</span>
                                        <div className={`absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-black shadow-sm transition-all duration-300 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                                            <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                                        </div>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className="px-6 mt-2">
                    <div className="p-5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                <span className="material-symbols-outlined text-2xl">auto_stories</span>
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-base text-slate-900 dark:text-white truncate">{selectedBackground}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{backgroundData?.description}</p>
                            </div>
                        </div>

                        {/* CONFIGURACIÓN DE MAGIA DE TRASFONDO - BOTÓN MODAL */}
                        {bgMagicConfig && (
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 space-y-3 animate-fadeIn">
                                <button 
                                    onClick={() => setShowMagicModal(true)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${bgSpells.length === (bgMagicConfig.cantripsNeeded + bgMagicConfig.level1Needed) ? 'bg-primary/5 border-primary/40' : 'bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 hover:border-primary/50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${bgSpells.length === (bgMagicConfig.cantripsNeeded + bgMagicConfig.level1Needed) ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                                            <span className="material-symbols-outlined text-xl">magic_button</span>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{t.config_magic}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.magic_initiate} ({bgMagicConfig.type})</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-black px-2 py-1 rounded-lg ${bgSpells.length === (bgMagicConfig.cantripsNeeded + bgMagicConfig.level1Needed) ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}>
                                            {bgSpells.length} / {bgMagicConfig.cantripsNeeded + bgMagicConfig.level1Needed}
                                        </span>
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">chevron_right</span>
                                    </div>
                                </button>
                                {bgSpells.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 px-1">
                                        {bgSpells.map(s => <span key={s} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">{s}</span>)}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 space-y-4">
                            <div className="flex flex-wrap gap-2 items-center">
                                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-md">
                                    <span className="text-[10px] font-bold uppercase text-slate-400">{t.attributes}</span>
                                    <span className="text-xs text-primary font-black">{backgroundData?.scores.join(', ')}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-md">
                                    <span className="text-[10px] font-bold uppercase text-slate-400">{t.tools}</span>
                                    <span className="text-xs text-slate-900 dark:text-white font-bold">{backgroundData?.tool}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-primary/5 border border-primary/10 p-3 rounded-xl">
                                <div className="bg-primary/20 p-1.5 rounded-lg text-primary shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">military_tech</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white mb-1 truncate">{t.feat}: {backgroundData?.feat}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{backgroundData?.featDescription}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL DE SELECCIÓN DE MAGIA DE TRASFONDO */}
            {showMagicModal && bgMagicConfig && createPortal(
                <div className="fixed inset-0 z-[110] bg-background-light dark:bg-background-dark flex flex-col pt-[env(safe-area-inset-top)] animate-fadeIn">
                    <div className="p-4 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-white/10 flex items-center justify-between shadow-md">
                        <button onClick={() => setShowMagicModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500"><span className="material-symbols-outlined">close</span></button>
                        <div className="text-center">
                             <h3 className="text-sm font-black uppercase tracking-widest text-primary">{t.magic_initiate}</h3>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{bgMagicConfig.type}</p>
                        </div>
                        <div className="w-10"></div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
                        {/* TRUCOS */}
                        <section>
                            <div className="flex justify-between items-baseline mb-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">{t.choose_cantrips}</h4>
                                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${bgSpells.filter(s => SPELL_DETAILS[s]?.level === 0).length === bgMagicConfig.cantripsNeeded ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                                    {bgSpells.filter(s => SPELL_DETAILS[s]?.level === 0).length} / {bgMagicConfig.cantripsNeeded}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {bgMagicConfig.sourceList.filter(s => SPELL_DETAILS[s]?.level === 0).map(name => {
                                    const isSel = bgSpells.includes(name);
                                    const spell = SPELL_DETAILS[name];
                                    const theme = SCHOOL_THEMES[spell.school] || { text: 'text-slate-400', bg: 'bg-slate-500/10', icon: 'auto_fix' };
                                    return (
                                        <button key={name} onClick={() => toggleBgSpell(name, 0)} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${isSel ? 'bg-primary/10 border-primary shadow-lg scale-[1.02]' : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-white/5 opacity-80 hover:opacity-100'}`}>
                                            <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${isSel ? 'bg-primary text-white shadow-inner' : theme.bg + ' ' + theme.text}`}>
                                                <span className="material-symbols-outlined text-lg">{isSel ? 'check' : theme.icon}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`text-sm font-bold truncate ${isSel ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{name}</p>
                                                <p className="text-[9px] font-black uppercase tracking-tighter text-slate-400 opacity-70">{spell.school}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* NIVEL 1 */}
                        <section className="pb-10">
                            <div className="flex justify-between items-baseline mb-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">{t.choose_level1}</h4>
                                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${bgSpells.filter(s => SPELL_DETAILS[s]?.level === 1).length === bgMagicConfig.level1Needed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                                    {bgSpells.filter(s => SPELL_DETAILS[s]?.level === 1).length} / {bgMagicConfig.level1Needed}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {bgMagicConfig.sourceList.filter(s => SPELL_DETAILS[s]?.level === 1).map(name => {
                                    const isSel = bgSpells.includes(name);
                                    const spell = SPELL_DETAILS[name];
                                    const theme = SCHOOL_THEMES[spell.school] || { text: 'text-slate-400', bg: 'bg-slate-500/10', icon: 'auto_fix' };
                                    return (
                                        <button key={name} onClick={() => toggleBgSpell(name, 1)} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${isSel ? 'bg-primary/10 border-primary shadow-lg scale-[1.02]' : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-white/5 opacity-80 hover:opacity-100'}`}>
                                            <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${isSel ? 'bg-primary text-white shadow-inner' : theme.bg + ' ' + theme.text}`}>
                                                <span className="material-symbols-outlined text-lg">{isSel ? 'check' : theme.icon}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`text-sm font-bold truncate ${isSel ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{name}</p>
                                                <p className="text-[9px] font-black uppercase tracking-tighter text-slate-400 opacity-70">{spell.school}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    <div className="p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-200 dark:border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                        <button 
                            onClick={() => setShowMagicModal(false)}
                            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 ${bgSpells.length === (bgMagicConfig.cantripsNeeded + bgMagicConfig.level1Needed) ? 'bg-primary text-background-dark shadow-primary/20' : 'bg-slate-200 dark:bg-white/5 text-slate-500 cursor-not-allowed'}`}
                        >
                            {t.confirm_selection}
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default Step1Identity;
