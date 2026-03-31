
import { createPortal } from 'react-dom';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Character } from '../../types';
import { SPELL_DETAILS, SPELL_LIST_BY_CLASS, CANTRIPS_KNOWN_BY_LEVEL, SPELLS_KNOWN_BY_LEVEL, MAX_SPELL_LEVEL, SPELLCASTING_ABILITY, ARCANE_SPELLS } from '../../Data/spells';
import { SCHOOL_THEMES, formatModifier, getFinalStats, getSpellSummary } from '../../utils/sheetUtils';
import useGameData from '../../hooks/useGameData';

interface SpellsTabProps {
    character: Character;
    onUpdate: (char: Character) => void;
    isReadOnly?: boolean;
}

const FULL_CASTER_SLOTS: number[][] = [
    [], [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

const getWarlockSlots = (level: number): { count: number, level: number } => {
    let count = 1;
    if (level >= 2) count = 2;
    if (level >= 11) count = 3;
    if (level >= 17) count = 4;
    let slotLvl = 1;
    if (level >= 3) slotLvl = 2;
    if (level >= 5) slotLvl = 3;
    if (level >= 7) slotLvl = 4;
    if (level >= 9) slotLvl = 5;
    return { count, level: slotLvl };
};

const getSlots = (type: string, charLevel: number, spellLevel: number): number => {
    if (spellLevel === 0) return 0;
    if (type === 'none') return 0;
    if (type === 'pact') {
        const { count, level } = getWarlockSlots(charLevel);
        if (spellLevel === level) return count;
        // Mystic Arcanum are handled as preparation of specific high level SPELL_DETAILS usually, 
        // but for slots representation we can show 1.
        if (spellLevel === 6 && charLevel >= 11) return 1;
        if (spellLevel === 7 && charLevel >= 13) return 1;
        if (spellLevel === 8 && charLevel >= 15) return 1;
        if (spellLevel === 9 && charLevel >= 17) return 1;
        return 0;
    }
    let effectiveLevel = charLevel;
    if (type === 'half') effectiveLevel = Math.max(1, Math.ceil(charLevel / 2));
    else if (type === 'third') effectiveLevel = Math.max(1, Math.ceil(charLevel / 3));
    
    effectiveLevel = Math.max(1, Math.min(effectiveLevel, 20));
    if (effectiveLevel >= FULL_CASTER_SLOTS.length) return 0;
    const slots = FULL_CASTER_SLOTS[effectiveLevel];
    const index = spellLevel - 1;
    return (slots && index >= 0 && index < slots.length) ? slots[index] : 0;
};

const getProgressiveValue = (table: Record<number, number> | undefined, level: number, fallback: number = 0): number => {
    if (!table) return fallback;
    let value = fallback;
    Object.keys(table).forEach(keyStr => {
        const key = parseInt(keyStr);
        if (level >= key) value = table[key];
    });
    return value;
};

const SpellsTab: React.FC<SpellsTabProps> = ({ character, onUpdate, isReadOnly }) => {
    const { getSpellDisplayName } = useGameData();
    const t = {
        save_dc: 'Save DC',
        attack_bonus: 'Attack Bonus',
        sorcery_points: 'Sorcery Points',
        max: 'MAX',
        level_label: 'Level',
        cantrips_label: 'Cantrips',
        spell_slots: 'Spell Slots',
        no_spells_prepared: 'No spells prepared',
        view_grimoire: 'View Grimoire',
        pact_source: 'Pact',
        open_grimoire: 'Open Grimoire',
        search_spells: 'Search spells...',
        all_sources: 'All Sources',
        capacity: 'Capacity',
        prepared_spells: 'Prepared',
        limit: 'Limit',
        time: 'Time',
        range: 'Range',
        components: 'Components',
        duration: 'Duration',
        information: 'Information',
        cast_spell: 'Cast Spell',
        feat: 'Feat',
    };
    const [activeSpellLevel, setActiveSpellLevel] = useState<number>(1);
    const [showGrimoire, setShowGrimoire] = useState(false);
    const [grimoireSearch, setGrimoireSearch] = useState('');
    const [grimoireLevel, setGrimoireLevel] = useState(0);
    const [grimoireSource, setGrimoireSource] = useState<string>('All');
    const [expandedGrimoireId, setExpandedGrimoireId] = useState<string | null>(null);
    const [selectedSpellName, setSelectedSpellName] = useState<string | null>(null);
    const usedSlots = character.usedSlots || {};
    const sorceryPoints = character.sorceryPoints || { current: character.level >= 2 && character.class === 'Sorcerer' ? character.level : 0, max: character.level >= 2 && character.class === 'Sorcerer' ? character.level : 0 };
    const [spellDescriptions, setSpellDescriptions] = useState<Record<string, string>>({});

    useEffect(() => {
        // Translation effect removed - all content now in English
    }, [selectedSpellName, expandedGrimoireId]);

    const tabsRef = useRef<HTMLDivElement>(null);
    const grimoireTabsRef = useRef<HTMLDivElement>(null);
    const grimoireSourceRef = useRef<HTMLDivElement>(null);

    const magicInitiateType = useMemo(() => {
        const feats = character.feats || [];
        if (feats.some(f => f.includes('Magic Initiate (Cleric)') || f.includes('Iniciado Mágico (Clérigo)'))) return 'Cleric';
        if (feats.some(f => f.includes('Magic Initiate (Druid)') || f.includes('Iniciado Mágico (Druida)'))) return 'Druid';
        if (feats.some(f => f.includes('Magic Initiate (Wizard)') || f.includes('Iniciado Mágico (Mago)'))) return 'Wizard';
        return null;
    }, [character.feats]);

    const effectiveCasterType = useMemo(() => {
        if (character.class === 'Warlock') return 'pact';
        if (['Cleric', 'Druid', 'Bard', 'Sorcerer', 'Wizard'].includes(character.class)) return 'full';
        if (['Paladin', 'Ranger'].includes(character.class)) return 'half';
        if (['Eldritch Knight', 'Arcane Trickster', 'Warrior of the Mystic Arts'].includes(character.subclass || '')) return 'third';
        return 'none';
    }, [character.class, character.subclass]);

    const availableSources = useMemo(() => {
        const sources = ['All'];
        if (effectiveCasterType !== 'none') {
            sources.push(character.class);
        }
        if (magicInitiateType) {
            sources.push(`${magicInitiateType} (Feat)`);
        }
        if (character.pactCantrips && character.pactCantrips.length > 0) {
            sources.push('Pact');
        }
        return sources;
    }, [character.class, effectiveCasterType, magicInitiateType, character.pactCantrips]);

    const allPreparedSpells = useMemo(() => {
        const prepared = character.preparedSpells || [];
        const pact = character.pactCantrips || [];
        const pactRituals = character.pactRituals || [];
        return Array.from(new Set([...prepared, ...pact, ...pactRituals]));
    }, [character.preparedSpells, character.pactCantrips, character.pactRituals]);

    // LÍMITES 2024: Preparación por nivel
    const currentPreparedForActiveLevel = useMemo(() => {
        const levelToCheck = grimoireLevel;
        return (character.preparedSpells || []).filter(name => {
            const spell = SPELL_DETAILS[name];
            return spell?.level === levelToCheck;
        }).length;
    }, [character.preparedSpells, grimoireLevel]);

    const maxPreparedForActiveLevel = useMemo(() => {
        if (grimoireLevel === 0) {
            let count = 0;
            if (effectiveCasterType === 'third') count = character.level >= 10 ? 3 : 2;
            else if (character.class === 'Ranger') count = character.level >= 10 ? 3 : 2;
            else if (character.class === 'Paladin') count = 0; // Paladins get cantrips via Fighting Style or subclass usually, base 0 in 2014, 2024 has changes. Assuming standard logic.
            else count = getProgressiveValue(CANTRIPS_KNOWN_BY_LEVEL[character.class], character.level, 0);
            
            // Warlock Pact of the Tome? Not checking feats here yet.
            // Magic Initiate?
            if (magicInitiateType) count += 2; 

            return count;
        }

        // SPELLS KNOWN CLASSES (Bard, Ranger, Sorcerer, Warlock, Arcane Trickster, Eldritch Knight)
        // These classes have a global "Spells Known" limit, not per level.
        // We need to check if the total prepared (known) SPELL_DETAILS exceed the global limit.
        const knownCasters = ['Bard', 'Ranger', 'Sorcerer', 'Warlock'];
        const isKnownCaster = knownCasters.includes(character.class) || effectiveCasterType === 'third';

        if (isKnownCaster) {
             // For Known Casters, we don't limit per level strictly in UI (except for max slot level), 
             // but we limit the TOTAL number of SPELL_DETAILS known.
             // However, the user request asks for "Max SPELL_DETAILS per level".
             // In 5e/OneDnD, Known Casters don't have per-level limits (except must have slot).
             // Prepared Casters (Cleric, Druid, Paladin, Wizard) prepare X SPELL_DETAILS total (Level + Mod).
             
             // BUT, if the user specifically asked for "5 SPELL_DETAILS at level 1, etc.", they might be referring to
             // how PREPARED casters in 2024 are changing to "Prepared = Slots".
             
             // Let's implement the 2024 "Prepared = Slots" rule for everyone if that's the requested behavior,
             // OR strictly follow the class table if provided.
             
             // User said: "respetando la tabla de cada clase".
             // If it's a Warlock, they have Spells Known table.
             
             if (character.class === 'Warlock') {
                 // Warlock limit is global.
                 // We should return the global limit minus SPELL_DETAILS known of OTHER levels to see how many "slots" are left for this level?
                 // Or just return the global limit for display?
                 // The UI compares currentPreparedForActiveLevel vs maxPreparedForActiveLevel.
                 // If we return global limit here, it will look like "0 / 15" for level 1, "0 / 15" for level 2.
                 // This might be confusing but accurate for Known casters.
                 
                 const totalKnown = getProgressiveValue(SPELLS_KNOWN_BY_LEVEL[character.class], character.level, 0);
                 const currentTotalKnown = (character.preparedSpells || []).filter(s => SPELL_DETAILS[s]?.level !== 0).length;
                 const currentOthers = currentTotalKnown - currentPreparedForActiveLevel;
                 
                 // Remaining capacity
                 return Math.max(0, totalKnown - currentOthers + currentPreparedForActiveLevel); 
             }
             
             // For other known casters (Bard, Sorcerer, Ranger)
             if (SPELLS_KNOWN_BY_LEVEL[character.class]) {
                 const totalKnown = getProgressiveValue(SPELLS_KNOWN_BY_LEVEL[character.class], character.level, 0);
                 const currentTotalKnown = (character.preparedSpells || []).filter(s => SPELL_DETAILS[s]?.level !== 0).length;
                 const currentOthers = currentTotalKnown - currentPreparedForActiveLevel;
                 return Math.max(0, totalKnown - currentOthers + currentPreparedForActiveLevel);
             }
        }

        // PREPARED CASTERS (Cleric, Druid, Paladin, Wizard - 2024 Rules)
        const slots = getSlots(effectiveCasterType, character.level, grimoireLevel);
        
        // Exception: Magic Initiate feat grants +1 level 1 slot
        if (grimoireLevel === 1 && magicInitiateType) return slots + 1;
        
        return slots;
    }, [character.class, character.level, grimoireLevel, effectiveCasterType, magicInitiateType, character.preparedSpells, currentPreparedForActiveLevel]);

    // Visibilidad de pestañas de nivel según la capacidad de la clase
    const availableSpellLevels = useMemo(() => {
        const levels = new Set<number>();
        levels.add(0); // Cantrips always available
        
        if (effectiveCasterType === 'pact') {
            // Warlock: Show levels 1 to Slot Level + Mystic Arcanums
            const { level: slotLvl } = getWarlockSlots(character.level);
            for (let i = 1; i <= slotLvl; i++) levels.add(i);
            
            // Mystic Arcanum visibility
            if (character.level >= 11) levels.add(6);
            if (character.level >= 13) levels.add(7);
            if (character.level >= 15) levels.add(8);
            if (character.level >= 17) levels.add(9);
        } else {
            // Standard Progression
            for (let i = 1; i <= 9; i++) {
                if (getSlots(effectiveCasterType, character.level, i) > 0) {
                    levels.add(i);
                }
            }
        }
        
        if (magicInitiateType) levels.add(1);
        
        return Array.from(levels).sort((a, b) => a - b);
    }, [effectiveCasterType, character.level, magicInitiateType]);

    useEffect(() => {
        if (tabsRef.current) {
            const activeBtn = tabsRef.current.querySelector(`[data-level="${activeSpellLevel}"]`) as HTMLElement;
            if (activeBtn) {
                const container = tabsRef.current;
                const scrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);
                container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        }
    }, [activeSpellLevel]);

    const isSorcerer = character.class === 'Sorcerer';

    const spellStat = useMemo(() => {
        if (SPELLCASTING_ABILITY[character.class]) return SPELLCASTING_ABILITY[character.class];
        if (character.spellcastingAbility) return character.spellcastingAbility;
        if (character.subclass === 'Warrior of the Mystic Arts') return 'WIS';
        if (effectiveCasterType === 'third') return 'INT';
        if (magicInitiateType) return SPELLCASTING_ABILITY[magicInitiateType];
        return 'INT';
    }, [character.class, character.spellcastingAbility, effectiveCasterType, magicInitiateType]);

    const finalStats = getFinalStats(character);
    const spellMod = Math.floor(((finalStats[spellStat] || 10) - 10) / 2);

    const toggleSlot = (level: number, index: number) => {
        if (isReadOnly) return;
        const key = `${level}-${index}`;
        const newUsed = { ...usedSlots, [key]: !usedSlots[key] };
        onUpdate({ ...character, usedSlots: newUsed });
    };

    const togglePreparedSpell = (spellName: string) => {
        if (isReadOnly) return;
        const current = character.preparedSpells || [];
        const isPrepared = current.includes(spellName);
        const spellData = SPELL_DETAILS[spellName];
        if (!spellData) return;
        
        const isCantrip = spellData.level === 0;

        if (!isPrepared) {
            // Check limits before adding
            if (isCantrip) {
                 if (currentPreparedForActiveLevel >= maxPreparedForActiveLevel) return;
            } else {
                // For Spells (Level 1+)
                if (currentPreparedForActiveLevel >= maxPreparedForActiveLevel) return;
            }
            onUpdate({ ...character, preparedSpells: [...current, spellName] });
        } else {
            onUpdate({ ...character, preparedSpells: current.filter(s => s !== spellName) });
        }
    };

    const castSpell = (level: number) => {
        if (level === 0 || isReadOnly) return; 
        const totalSlots = getSlots(effectiveCasterType, character.level, level);
        let found = false;
        for (let i = 0; i < totalSlots; i++) {
            if (!usedSlots[`${level}-${i}`]) {
                toggleSlot(level, i);
                found = true;
                break;
            }
        }
        if (!found) alert(`No more level ${level} slots!`);
    };

    const saveDC = 8 + character.profBonus + spellMod;
    const spellAttack = character.profBonus + spellMod;
    const SPELL_DETAILSToShow = allPreparedSpells.filter(s => SPELL_DETAILS[s]?.level === activeSpellLevel).sort();
    const slotCount = getSlots(effectiveCasterType, character.level, activeSpellLevel);

    const getLimitColor = (current: number, max: number) => {
        if (max === 0) return 'text-slate-500';
        if (current >= max) return 'bg-red-500/10 border-red-500/20 text-red-400';
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    };

    const getSourceList = (source: string): string[] => {
        if (source === 'All') {
            const list = new Set<string>();
            const mainClassList = SPELL_LIST_BY_CLASS[character.class] || (['Eldritch Knight', 'Arcane Trickster'].includes(character.subclass || '') ? ARCANE_SPELLS : []);
            mainClassList.forEach(s => list.add(s));
            if (magicInitiateType) {
                const featList = SPELL_LIST_BY_CLASS[magicInitiateType] || [];
                featList.forEach(s => list.add(s));
            }
            if (character.pactCantrips) {
                character.pactCantrips.forEach(s => list.add(s));
            }
            return Array.from(list);
        }
        if (source === 'Pact') return character.pactCantrips || [];
        if (source === character.class) {
            if (character.subclass === 'Warrior of the Mystic Arts') return SPELL_LIST_BY_CLASS['Sorcerer'] || [];
            return SPELL_LIST_BY_CLASS[character.class] || (['Eldritch Knight', 'Arcane Trickster'].includes(character.subclass || '') ? ARCANE_SPELLS : []);
        }
        if (source.includes('(Feat)')) {
            const className = source.split(' ')[0];
            return SPELL_LIST_BY_CLASS[className] || [];
        }
        return [];
    };

    return (
    <div className="flex flex-col gap-6 px-4 pb-28 relative min-h-screen">
       <div className="grid grid-cols-3 gap-3 mt-4">
           <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-dark border border-white/5 shadow-sm">
              <span className="text-primary text-2xl font-bold leading-none">{formatModifier(spellMod)}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{spellStat}</span>
           </div>
           <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-dark border-2 border-white/10 shadow-sm relative overflow-hidden">
              <span className="text-white text-2xl font-bold leading-none z-10">{saveDC}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 z-10">{t.save_dc}</span>
           </div>
           <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-dark border border-white/5 shadow-sm">
              <span className="text-primary text-2xl font-bold leading-none">{formatModifier(spellAttack)}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{t.attack_bonus}</span>
           </div>
       </div>

       {isSorcerer && (
           <div className="relative overflow-hidden bg-white/5 border border-purple-500/20 rounded-2xl p-3 shadow-sm animate-fadeIn">
               <div className="flex items-center justify-between gap-4">
                   <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-1.5 mb-1.5">
                           <span className="material-symbols-outlined text-purple-400 text-sm">auto_fix_normal</span>
                           <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">{t.sorcery_points}</span>
                       </div>
                       <div className="flex items-baseline gap-2 mb-2">
                           <span className="text-2xl font-bold text-white leading-none">{sorceryPoints.current}</span>
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">/ {sorceryPoints.max} {t.max}</span>
                       </div>
                       <div className="relative h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                           <div 
                               className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-fuchsia-400 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                               style={{ width: `${(sorceryPoints.current / sorceryPoints.max) * 100}%` }}
                           ></div>
                       </div>
                   </div>
                   <div className="flex items-center gap-1.5 shrink-0 border-l border-white/10 pl-3">
                       <button onClick={() => onUpdate({ ...character, sorceryPoints: { ...sorceryPoints, current: Math.max(0, sorceryPoints.current - 1) } })} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-purple-300 hover:bg-purple-500/20 active:scale-90 transition-all"><span className="material-symbols-outlined text-base">remove</span></button>
                       <button onClick={() => onUpdate({ ...character, sorceryPoints: { ...sorceryPoints, current: Math.min(sorceryPoints.max, sorceryPoints.current + 1) } })} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-purple-300 hover:bg-purple-500/20 active:scale-90 transition-all"><span className="material-symbols-outlined text-base">add</span></button>
                       <button onClick={() => onUpdate({ ...character, sorceryPoints: { ...sorceryPoints, current: sorceryPoints.max } })} className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-white hover:bg-purple-500/40 active:scale-90 transition-all ml-1"><span className="material-symbols-outlined text-base">refresh</span></button>
                   </div>
               </div>
           </div>
       )}

       <div ref={tabsRef} className="flex overflow-x-auto gap-2 no-scrollbar py-1 w-full">
           <div className="flex gap-2 mx-auto min-w-min px-4">
               {availableSpellLevels.map(lvl => (
                   <button 
                       key={lvl} 
                       onClick={() => setActiveSpellLevel(lvl)} 
                       data-level={lvl}
                       className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all whitespace-nowrap ${activeSpellLevel === lvl ? 'bg-primary text-background-dark scale-105' : 'bg-surface-dark text-slate-500'}`}
                   >
                       {lvl === 0 ? t.cantrips_label : `${t.level_label} ${lvl}`}
                   </button>
               ))}
           </div>
       </div>

       {slotCount > 0 && (
           <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t.spell_slots}</span>
              <div className="flex flex-wrap gap-2 justify-center">
                {Array.from({length: slotCount}, (_, i) => (
                    <button key={i} onClick={() => toggleSlot(activeSpellLevel, i)} className={`h-11 w-11 rounded-xl border-2 flex items-center justify-center transition-all ${usedSlots[`${activeSpellLevel}-${i}`] ? 'bg-slate-900 border-white/5 opacity-40' : 'bg-primary/20 border-primary/50 text-primary shadow-[0_0_15px_rgba(53,158,255,0.1)]'}`}>
                       <span className={`material-symbols-outlined ${usedSlots[`${activeSpellLevel}-${i}`] ? 'text-slate-700' : 'text-primary animate-pulse'}`}>bolt</span>
                    </button>
                ))}
              </div>
           </div>
       )}

       <div className="flex flex-col gap-3">
           {SPELL_DETAILSToShow.length === 0 ? (
               <div className="text-center p-8 bg-surface-dark rounded-xl border border-dashed border-white/10 mt-2">
                   <p className="text-slate-500 text-sm mb-2">{t.no_spells_prepared}</p>
                   <button onClick={() => setShowGrimoire(true)} className="text-primary font-bold text-sm">{t.view_grimoire}</button>
               </div>
           ) : SPELL_DETAILSToShow.map(spellName => {
               const spell = SPELL_DETAILS[spellName];
               if (!spell) return null;
               const summary = getSpellSummary(spell.description, spell.school);
               const isPactSpell = character.pactCantrips?.includes(spellName) || character.pactRituals?.includes(spellName);
               
               return (
               <div key={spellName} onClick={() => setSelectedSpellName(spellName)} className={`p-4 rounded-xl bg-surface-dark border ${isPactSpell ? 'border-blue-500/50 shadow-blue-500/5' : summary.classes.split(' ').filter(c=>c.startsWith('border')).join(' ')} shadow-sm cursor-pointer flex items-center justify-between active:scale-[0.99]`}>
                  <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${summary.classes} shrink-0`}>
                          <span className="material-symbols-outlined text-lg">{summary.icon}</span>
                      </div>
                      <div>
                          <div className="flex items-center gap-2">
                              <h3 className="text-white font-bold leading-tight truncate">{getSpellDisplayName(spell.name)}</h3>
                             {isPactSpell && <span className="text-[8px] font-black bg-blue-500 text-white px-1 rounded uppercase tracking-tighter">{t.pact_source}</span>}
                          </div>
                          <div className="flex gap-2 mt-0.5 items-center">
                              <span className={`text-[10px] uppercase font-bold text-slate-400`}>
                                  {t[spell.school.toLowerCase() as keyof typeof t] || spell.school}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                              <span className={`text-[10px] font-bold ${summary.classes.split(' ')[0]}`}>{summary.label}</span>
                          </div>
                      </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-500">chevron_right</span>
               </div>
           )})}
       </div>

       <div className="flex justify-center mt-2 mb-8">
            <button onClick={() => setShowGrimoire(true)} className="flex items-center gap-2 pl-5 pr-6 py-3.5 rounded-full bg-primary text-background-dark font-bold shadow-xl hover:scale-105 active:scale-95 transition-all">
                <span className="material-symbols-outlined text-xl">menu_book</span>
                <span className="text-sm">{t.open_grimoire}</span>
            </button>
       </div>

       {showGrimoire && createPortal(
           <div className="fixed inset-0 z-50 bg-background-dark flex flex-col pt-[env(safe-area-inset-top)] animate-fadeIn">
               <div className="flex flex-col gap-2 p-4 bg-surface-dark border-b border-white/10 shadow-lg">
                   <div className="flex items-center gap-4">
                       <button onClick={() => setShowGrimoire(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"><span className="material-symbols-outlined">close</span></button>
                       <div className="flex-1 relative">
                           <input type="text" placeholder={t.search_spells} value={grimoireSearch} onChange={(e) => setGrimoireSearch(e.target.value)} className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 pl-10 text-white outline-none focus:border-primary/50 transition-all"/>
                           <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500">search</span>
                       </div>
                   </div>

                   {/* FILTRO DE CLASE/ORIGEN */}
                   {availableSources.length > 1 && (
                        <div ref={grimoireSourceRef} className="flex overflow-x-auto gap-2 no-scrollbar py-1 mt-1">
                            <div className="flex gap-1.5 px-1">
                                {availableSources.map(source => (
                                    <button
                                        key={source}
                                        onClick={() => setGrimoireSource(source)}
                                        data-source={source}
                                        className={`shrink-0 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all border ${grimoireSource === source ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-slate-400'}`}
                                    >
                                        {source === 'All' ? t.all_sources : 
                                         source === 'Pact' ? t.pact_source : 
                                         source.includes('(Feat)') ? `${t[source.split(' ')[0].toLowerCase() as keyof typeof t] || source.split(' ')[0]} (${t.feat})` :
                                         t[source.toLowerCase() as keyof typeof t] || source}
                                    </button>
                                ))}
                            </div>
                        </div>
                   )}

                   <div className="flex items-center justify-between gap-4 mt-2 px-1">
                        <div className="flex-1">
                            <div className="flex justify-between items-baseline mb-1.5">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                                    {t.capacity} {t.level_label} {grimoireLevel}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-black px-2 py-0.5 rounded-md border ${getLimitColor(currentPreparedForActiveLevel, maxPreparedForActiveLevel)} transition-colors duration-300`}>
                                        {grimoireLevel === 0 ? `${t.cantrips_label}: ` : `${t.prepared_spells}: `}{currentPreparedForActiveLevel} / {maxPreparedForActiveLevel}
                                    </span>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className={`h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(53,158,255,0.2)] ${currentPreparedForActiveLevel >= maxPreparedForActiveLevel ? 'bg-red-500' : 'bg-primary'}`}
                                    style={{ width: `${Math.min(100, (currentPreparedForActiveLevel / Math.max(1, maxPreparedForActiveLevel)) * 100)}%` }}
                                ></div>
                            </div>
                        </div>
                   </div>
               </div>

               <div ref={grimoireTabsRef} className="flex overflow-x-auto gap-2 p-3 bg-surface-dark/50 border-b border-white/5 no-scrollbar w-full">
                   <div className="flex gap-2 mx-auto min-w-min px-4">
                       {availableSpellLevels.map(lvl => (
                           <button
                               key={lvl}
                               onClick={() => setGrimoireLevel(lvl)}
                               data-level={lvl}
                               className={`shrink-0 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${grimoireLevel === lvl ? 'bg-primary text-background-dark shadow-lg shadow-primary/20 scale-105' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                           >
                               {lvl === 0 ? t.cantrips_label : `${t.level_label} ${lvl}`}
                           </button>
                       ))}
                   </div>
               </div>

               <div className="flex-1 overflow-y-auto p-4 gap-3 flex flex-col pb-24 no-scrollbar bg-gradient-to-b from-surface-dark/20 to-background-dark">
                   {getSourceList(grimoireSource)
                       .filter(name => {
                           const spell = SPELL_DETAILS[name];
                           // Visibility Check: Show spell if its level is in the available levels list
                           const level = spell?.level || 0;
                           const hasAccess = availableSpellLevels.includes(level);

                           return level === grimoireLevel && hasAccess && name.toLowerCase().includes(grimoireSearch.toLowerCase());
                       })
                       .sort()
                       .map(name => {
                           const isPrepared = allPreparedSpells.includes(name);
                           const isPactChoice = character.pactCantrips?.includes(name) || character.pactRituals?.includes(name);
                           const isExpanded = expandedGrimoireId === name;
                           const spell = SPELL_DETAILS[name];
                           const summary = spell ? getSpellSummary(spell.description, spell.school) : { classes: '', icon: 'help', label: '' };

                           const isAtLevelLimit = currentPreparedForActiveLevel >= maxPreparedForActiveLevel;
                           const isBlocked = !isPrepared && isAtLevelLimit && !isPactChoice;

                           return (
                               <div key={name} className={`flex flex-col rounded-2xl border transition-all duration-300 ${isPrepared ? 'bg-primary/5 border-primary/50 shadow-md shadow-primary/5' : isBlocked ? 'bg-white/[0.02] border-white/5 opacity-60' : 'bg-surface-dark border-white/5 hover:border-white/10'}`}>
                                   <div className="flex items-start">
                                       <button onClick={() => setExpandedGrimoireId(isExpanded ? null : name)} className="flex-1 p-4 text-left flex flex-col gap-2 group">
                                           <div className="flex items-center justify-between">
                                               <div className="flex items-center gap-3">
                                                   <div className={`w-2 h-2 rounded-full ${isPrepared ? 'bg-primary shadow-[0_0_8px_rgba(53,158,255,1)] animate-pulse' : isBlocked ? 'bg-red-500/50' : 'bg-slate-500'}`}></div>
                                                    <p className={`font-bold transition-colors ${isPrepared ? 'text-primary' : 'text-white group-hover:text-primary/70'}`}>{getSpellDisplayName(name)}</p>
                                               </div>
                                               <span className={`material-symbols-outlined text-slate-500 text-lg transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`}>expand_more</span>
                                           </div>

                                           <div className="flex items-center gap-2 pl-5">
                                                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${summary.classes}`}>
                                                    <span className="material-symbols-outlined text-[12px]">{summary.icon}</span>
                                                    {summary.label}
                                                </div>
                                                {isPactChoice && <span className="text-[8px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded uppercase">{t.pact_source}</span>}
                                                {isBlocked && !isPactChoice && <span className="text-[8px] font-black bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded uppercase flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">lock</span>{t.limit}</span>}
                                           </div>
                                       </button>
                                       <button
                                            onClick={() => !isBlocked && togglePreparedSpell(name)}
                                            disabled={isBlocked && !isPrepared}
                                            className={`self-stretch w-16 border-l border-white/5 active:scale-75 transition-all flex items-center justify-center ${isPrepared ? (isPactChoice ? 'text-blue-400' : 'text-primary') : isBlocked ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            <span className="material-symbols-outlined font-bold text-xl">
                                                {isPrepared ? 'check_circle' : isBlocked ? 'lock' : 'add_circle'}
                                            </span>
                                       </button>
                                   </div>

                                   {isExpanded && spell && (
                                       <div className="px-5 pb-5 pt-0 animate-fadeIn border-t border-white/5 bg-black/20 rounded-b-2xl">
                                           <div className="grid grid-cols-2 gap-y-3 gap-x-4 py-4 text-[10px]">
                                               <div className="space-y-0.5"><p className="text-slate-500 uppercase font-black tracking-widest opacity-70">{t.time}</p><p className="text-slate-200 font-bold text-xs">{spell.castingTime}</p></div>
                                               <div className="space-y-0.5"><p className="text-slate-500 uppercase font-black tracking-widest opacity-70">{t.range}</p><p className="text-slate-200 font-bold text-xs">{spell.range}</p></div>
                                               <div className="space-y-0.5"><p className="text-slate-500 uppercase font-black tracking-widest opacity-70">{t.components}</p><p className="text-slate-200 font-bold text-xs">{spell.components}</p></div>
                                               <div className="space-y-0.5"><p className="text-slate-500 uppercase font-black tracking-widest opacity-70">{t.duration}</p><p className="text-slate-200 font-bold text-xs">{spell.duration}</p></div>
                                           </div>
                                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                                 <p className="text-xs text-slate-400 leading-relaxed font-body whitespace-pre-wrap">
                                                     {spellDescriptions[name] || spell.description}
                                                 </p>
                                            </div>
                                       </div>
                                   )}
                               </div>
                           );
                       })
                   }
               </div>
           </div>,
           document.body
       )}

       {selectedSpellName && createPortal(
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedSpellName(null)}>
                <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl animate-scaleUp flex flex-col max-h-[85vh] relative overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20"></div>
                    {(() => {
                        const spell = SPELL_DETAILS[selectedSpellName];
                        if (!spell) return null;
                        const summary = getSpellSummary(spell.description, spell.school);

                        return (
                        <>
                            <div className="flex justify-between items-start mb-5">
                                <div className="min-w-0 pr-4">
                                     <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight break-words">{getSpellDisplayName(selectedSpellName)}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${summary.classes}`}>
                                            <span className="material-symbols-outlined text-[12px]">{summary.icon}</span>
                                            {summary.label}
                                        </span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded-md">
                                            {t.level_label} {spell.level === 0 ? t.cantrips_label : spell.level}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedSpellName(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto no-scrollbar pr-1 border-t border-slate-100 dark:border-white/5 pt-5 mb-6">
                                <div className="flex justify-between items-center mb-4 px-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.information}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-6 text-xs">
                                    <div className="space-y-0.5"><p className="text-slate-400 uppercase font-black text-[9px] tracking-widest opacity-60">{t.time}</p><p className="text-slate-900 dark:text-white font-bold">{spell.castingTime}</p></div>
                                    <div className="space-y-0.5"><p className="text-slate-400 uppercase font-black text-[9px] tracking-widest opacity-60">{t.range}</p><p className="text-slate-900 dark:text-white font-bold">{spell.range}</p></div>
                                    <div className="space-y-0.5"><p className="text-slate-400 uppercase font-black text-[9px] tracking-widest opacity-60">{t.components}</p><p className="text-slate-900 dark:text-white font-bold">{spell.components}</p></div>
                                    <div className="space-y-0.5"><p className="text-slate-400 uppercase font-black text-[9px] tracking-widest opacity-60">{t.duration}</p><p className="text-slate-900 dark:text-white font-bold">{spell.duration}</p></div>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                                     <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-body">
                                         {spellDescriptions[selectedSpellName] || spell.description}
                                     </p>
                                </div>
                            </div>
                            <div className="flex gap-3 shrink-0">
                                <button
                                    onClick={() => { castSpell(spell.level || 0); setSelectedSpellName(null); }}
                                    className="w-full py-4 rounded-2xl bg-primary text-background-dark font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-[0.97] transition-all"
                                >
                                    {t.cast_spell}
                                </button>
                            </div>
                        </>
                        );
                    })()}
                </div>
            </div>,
            document.body
        )}
    </div>
  );
};

export default SpellsTab;
