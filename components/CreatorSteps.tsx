
import React, { useState, useEffect, useMemo, useRef } from 'react';
// Added AsiDecision to the import list from types
import { Character, CreatorStep, Ability, Trait, SubclassData, AsiDecision } from '../types';
import { 
  CLASS_SKILL_DATA, 
  HIT_DIE,
  SUBCLASS_OPTIONS,
  CLASS_PROGRESSION,
  CLASS_SUGGESTED_ARRAYS,
  CLASS_MASTERIES,
  SPECIES_DETAILS
} from '../Data/characterOptions';
import { FEAT_OPTIONS } from '../Data/feats';
import { TRINKETS } from '../Data/items';
import { useGameData } from '../hooks/useGameData';

// Subcomponentes refactorizados
import Step1Identity from './creator/Step1Identity';
import Step2Stats from './creator/Step2Stats';
import Step3Details from './creator/Step3Details';
import Step4Skills from './creator/Step4Skills';
import Step5Review from './creator/Step5Review';
import FeatModal from './creator/FeatModal';

import { getTotalInitiative } from '../utils/sheetUtils';
import { useLanguage } from '../hooks/useLanguage';

interface CreatorStepsProps {

  onBack: () => void;
  onFinish: (char: Character) => void;
}

const POINT_BUY_COSTS: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
};

const DEFAULT_CHAR_IMAGE = "/placeholder.svg";

const CreatorSteps: React.FC<CreatorStepsProps> = ({ onBack, onFinish }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<CreatorStep>(1);
  const mainRef = useRef<HTMLDivElement>(null);
  
  // States
  const [name, setName] = useState('');
  const [charImage, setCharImage] = useState(DEFAULT_CHAR_IMAGE);
  const [level, setLevel] = useState<number>(1);
  const [selectedClass, setSelectedClass] = useState('Barbarian');
  const [selectedSubclass, setSelectedSubclass] = useState<string>('');
  const [selectedSpecies, setSelectedSpecies] = useState('Human');
  const [selectedSubspecies, setSelectedSubspecies] = useState<string>('');
  const [selectedBackground, setSelectedBackground] = useState('Acolyte');
  const [selectedAlignment, setSelectedAlignment] = useState('Lawful Good');
  const [selectedLanguage1, setSelectedLanguage1] = useState<string>(''); 
  const [selectedLanguage2, setSelectedLanguage2] = useState<string>(''); 
  const [selectedFeat, setSelectedFeat] = useState<string>(''); 
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedHumanSkill, setSelectedHumanSkill] = useState<string>('');
  const [selectedElfSkill, setSelectedElfSkill] = useState<string>('');
  const [selectedMetamagics, setSelectedMetamagics] = useState<string[]>([]);
  const [selectedMasteries, setSelectedMasteries] = useState<string[]>([]);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [humanFeatSkilledSelections, setHumanFeatSkilledSelections] = useState<string[]>([]);
  const [spellcastingAbility, setSpellcastingAbility] = useState<Ability>('CHA');
  const [useStartingGold, setUseStartingGold] = useState(false);
  const [bgSpells, setBgSpells] = useState<string[]>([]);
  
  const [statMethod, setStatMethod] = useState<'pointBuy' | 'manual'>('pointBuy');
  const [baseStats, setBaseStats] = useState<Record<Ability, number>>({ STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 });
  const [hpMethod, setHpMethod] = useState<'average' | 'manual'>('average');
  const [manualRolledHP, setManualRolledHP] = useState<number>(0);
  
  const [bgAsiMode, setBgAsiMode] = useState<'three' | 'two'>('three');
  const [bgPlus2, setBgPlus2] = useState<Ability>('STR');
  const [bgPlus1, setBgPlus1] = useState<Ability>('DEX');

  const [asiDecisions, setAsiDecisions] = useState<Record<number, AsiDecision>>({});
  const [showFeatModal, setShowFeatModal] = useState(false);
  const [featModalContext, setFeatModalContext] = useState<{ type: 'human' | 'asi', level?: number } | null>(null);
  const [pendingSkillFeat, setPendingSkillFeat] = useState<{ type: 'Skilled' | 'Skill Expert' | 'Boon of Skill' | 'Don de Habilidad', level?: number } | null>(null);

  const [trinket] = useState<string>(() => {
      const randomIndex = Math.floor(Math.random() * TRINKETS.length);
      return `Trinket: ${TRINKETS[randomIndex]}`;
  });

  const { backgrounds } = useGameData();
  const backgroundData = backgrounds[selectedBackground];
  const classSkillOptions = CLASS_SKILL_DATA[selectedClass] || { count: 2 };

  const asiLevels = useMemo(() => {
      const levels: number[] = [];
      const progression = CLASS_PROGRESSION[selectedClass] || {};
      for (let l = 1; l <= level; l++) {
          if (progression[l]?.some(f => f.includes('Ability Score Improvement') || f.includes('Epic Boon'))) levels.push(l);
      }
      return levels;
  }, [selectedClass, level]);

  const maxMetamagics = useMemo(() => {
      if (selectedClass !== 'Sorcerer' || level < 2) return 0;
      if (level >= 17) return 4;
      if (level >= 10) return 3;
      return 2;
  }, [selectedClass, level]);

  const maxExpertise = useMemo(() => {
      let count = 0;
      if (selectedClass === 'Rogue') {
          count += 2; // Level 1
          if (level >= 6) count += 2;
      } else if (selectedClass === 'Bard') {
          if (level >= 2) count += 2; // Expertise
          if (level >= 9) count += 2;
      } else if (selectedClass === 'Ranger') {
          if (level >= 2) count += 1; // Deft Explorer (Level 2)
          if (level >= 9) count += 2; // Expertise (Level 9)
      }
      // Skill Expert feat grants 1 expertise
      if (selectedFeat === 'Skill Expert') count += 1;
      asiLevels.forEach(lvl => {
          if (asiDecisions[lvl]?.feat === 'Skill Expert') count += 1;
          // Boon of Skill grants 1 expertise (in addition to all skills proficiency)
          if (asiDecisions[lvl]?.feat === 'Boon of Skill' || asiDecisions[lvl]?.feat === 'Don de Habilidad') count += 1;
      });
      return count;
  }, [selectedClass, level, selectedFeat, asiLevels, asiDecisions]);

  const finalStats = useMemo(() => {
    const stats = { ...baseStats };
    if (backgroundData?.scores) {
        if (bgAsiMode === 'three') backgroundData.scores.forEach(ability => stats[ability] = Math.min(20, stats[ability] + 1));
        else {
             if (bgPlus2) stats[bgPlus2] = Math.min(20, stats[bgPlus2] + 2);
             if (bgPlus1) stats[bgPlus1] = Math.min(20, stats[bgPlus1] + 1);
        }
    }
    asiLevels.forEach(lvl => {
        const decision = asiDecisions[lvl];
        if (decision?.type === 'stat') {
            if (decision.stat1) stats[decision.stat1] = Math.min(30, stats[decision.stat1] + 1);
            if (decision.stat2) stats[decision.stat2] = Math.min(30, stats[decision.stat2] + 1);
        } else if (decision?.type === 'feat' && decision.stat1) stats[decision.stat1] = Math.min(30, stats[decision.stat1] + 1);
    });
    return stats;
  }, [baseStats, backgroundData, bgAsiMode, bgPlus2, bgPlus1, asiLevels, asiDecisions]);

  const usedPoints = useMemo(() => Object.values(baseStats).reduce((acc: number, val) => acc + (POINT_BUY_COSTS[val as number] || 0), 0), [baseStats]);
  const remainingPoints = 27 - usedPoints;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    if (level < 3) setSelectedSubclass('');
  }, [level, selectedClass]);

  useEffect(() => {
    setSelectedSubspecies('');
  }, [selectedSpecies]);

  useEffect(() => {
    if (statMethod === 'pointBuy') setBaseStats({ STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 });
  }, [statMethod]);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) setSelectedSkills(prev => prev.filter(s => s !== skill));
    else if (selectedSkills.length < classSkillOptions.count) setSelectedSkills(prev => [...prev, skill]);
  };

  const toggleMetamagic = (meta: string) => {
      if (selectedMetamagics.includes(meta)) setSelectedMetamagics(prev => prev.filter(m => m !== meta));
      else if (selectedMetamagics.length < maxMetamagics) setSelectedMetamagics(prev => [...prev, meta]);
  };

  const maxMasteries = CLASS_MASTERIES[selectedClass] || 0;
  const setMasteryAtIndex = (index: number, mastery: string) => {
      setSelectedMasteries(prev => {
          const next = [...prev];
          if (mastery) {
              next[index] = mastery;
          } else {
              next.splice(index, 1);
          }
          // Filter out duplicates just in case
          return next.filter((v, i) => v && next.indexOf(v) === i).slice(0, maxMasteries);
      });
  };

  const toggleExpertise = (skill: string) => {
    if (selectedExpertise.includes(skill)) setSelectedExpertise(prev => prev.filter(s => s !== skill));
    else if (selectedExpertise.length < maxExpertise) setSelectedExpertise(prev => [...prev, skill]);
  };

  const handleStatChange = (stat: Ability, delta: number) => {
    if (statMethod === 'pointBuy') {
        const currentVal = baseStats[stat];
        const newVal = currentVal + delta;
        if (newVal < 8 || newVal > 15) return;
        const costDiff = (POINT_BUY_COSTS[newVal] - POINT_BUY_COSTS[currentVal]);
        if (remainingPoints - costDiff < 0) return;
        setBaseStats(prev => ({ ...prev, [stat]: newVal }));
    } else setBaseStats(prev => ({ ...prev, [stat]: Math.max(1, Math.min(20, prev[stat] + delta)) }));
  };

  const handleAsiChange = (level: number, updates: Partial<AsiDecision>) => {
      setAsiDecisions(prev => ({ ...prev, [level]: { ...(prev[level] || { type: 'stat', stat1: 'STR', stat2: 'STR' }), ...updates } }));
  };

  const handleFeatSelect = (featName: string) => {
      if (featName === 'Skilled' || featName === 'Skill Expert' || featName === 'Boon of Skill' || featName === 'Don de Habilidad') {
          if (featModalContext?.type === 'human') {
              setSelectedFeat(featName);
          } else if (featModalContext?.type === 'asi' && featModalContext.level) {
              handleAsiChange(featModalContext.level, { feat: featName });
          }
          setShowFeatModal(false);
          setPendingSkillFeat({ type: featName, level: featModalContext?.level });
      } else {
          if (featModalContext?.type === 'human') setSelectedFeat(featName);
          else if (featModalContext?.type === 'asi' && featModalContext.level) handleAsiChange(featModalContext.level, { feat: featName });
          setShowFeatModal(false);
      }
  };

    const calculateAC = () => {
        const dexMod = Math.floor(((finalStats.DEX || 10) - 10) / 2);
        const conMod = Math.floor(((finalStats.CON || 10) - 10) / 2);
        const wisMod = Math.floor(((finalStats.WIS || 10) - 10) / 2);
        const chaMod = Math.floor(((finalStats.CHA || 10) - 10) / 2);
        let ac = 10 + dexMod;
        
        if (selectedClass === 'Barbarian') ac = 10 + dexMod + conMod;
        else if (selectedClass === 'Monk') ac = 10 + dexMod + wisMod;
        else if (selectedClass === 'Sorcerer' && selectedSubclass === 'Draconic Sorcery') ac = 10 + dexMod + chaMod;

        const allFeats = [backgroundData?.feat, selectedFeat, ...asiLevels.map(l => asiDecisions[l]?.type === 'feat' ? asiDecisions[l]?.feat : undefined)].filter((f): f is string => !!f);
        
        // Bonus de Dotes
        if (allFeats.some(f => f.includes('Doble Empuñadura') || f.includes('Dual Wielder'))) ac += 1;
        if (allFeats.some(f => f.includes('Defensa') || f.includes('Defense'))) ac += 1; // Estilo de Combate

        return ac;
    };

    const calculateMaxHP = () => {
        const hasAmuletOfHealth = (backgroundData?.equipment || []).some(e => e.toLowerCase().includes('amulet of health') || e.toLowerCase().includes('amuleto de salud'));
        const conStat = hasAmuletOfHealth ? Math.max(finalStats.CON || 10, 19) : (finalStats.CON || 10);
        const conMod = Math.floor((conStat - 10) / 2);
        const hitDie = HIT_DIE[selectedClass] || 8;
        
        let baseHp = hitDie + conMod;
        if (level > 1) {
            if (hpMethod === 'average') baseHp += (Math.floor(hitDie / 2) + 1 + conMod) * (level - 1);
            else baseHp += manualRolledHP + (conMod * (level - 1));
        }

        let bonusTotal = 0;
        if (selectedSpecies === 'Dwarf') bonusTotal += level;
        if (selectedClass === 'Sorcerer' && selectedSubclass === 'Draconic Sorcery') bonusTotal += level;
        
        const allFeats = [backgroundData?.feat, selectedFeat, ...asiLevels.map(l => asiDecisions[l]?.type === 'feat' ? asiDecisions[l]?.feat : undefined)].filter((f): f is string => !!f);
        
        // Dote: Duro / Tough
        if (allFeats.some(f => f === 'Duro' || f === 'Tough')) {
            bonusTotal += (level * 2);
        }
        
        // Epic Boon of Fortitude
        if (allFeats.some(f => f.includes('Fortitude') || f.includes('Fortaleza'))) {
            bonusTotal += 40;
        }

        return Math.max(1, baseHp + bonusTotal);
    };

  const renderHpBreakdown = () => {
    const hasAmuletOfHealth = (backgroundData?.equipment || []).some(e => e.toLowerCase().includes('amulet of health') || e.toLowerCase().includes('amuleto de salud'));
    const conMod = Math.floor(( (hasAmuletOfHealth ? Math.max(finalStats.CON || 10, 19) : finalStats.CON || 10) - 10) / 2);
    const hitDie = HIT_DIE[selectedClass] || 8;
    const avgRoll = Math.floor(hitDie / 2) + 1;
    let bonuses = [];
    if (selectedSpecies === 'Dwarf') bonuses.push({ name: t.dwarfResilience, val: level });
    if (selectedClass === 'Sorcerer' && selectedSubclass === 'Draconic Sorcery') bonuses.push({ name: t.draconicResilience, val: level });
    const allFeats = [backgroundData?.feat, selectedFeat, ...asiLevels.map(l => asiDecisions[l]?.type === 'feat' ? asiDecisions[l]?.feat : undefined)].filter(Boolean);
    if (allFeats.includes('Duro') || allFeats.includes('Tough')) bonuses.push({ name: t.toughFeat, val: level * 2 });
    return (
        <div className="mt-3 p-4 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5 text-xs font-mono text-slate-600 dark:text-slate-400 shadow-inner">
            {hasAmuletOfHealth && <div className="text-primary font-bold mb-2 uppercase text-[9px]">{t.amuletOfHealth}</div>}
            <div className="flex justify-between items-center mb-1"><span>{t.level1}:</span><span>{hitDie} + {conMod} = <span className="font-bold text-slate-900 dark:text-white">{hitDie+conMod}</span></span></div>
            {level > 1 && <div className="flex justify-between border-t border-slate-200 pt-1 border-dashed"><span>{t.levels} 2-{level}:</span><span>{hpMethod === 'average' ? (avgRoll + conMod) * (level - 1) : manualRolledHP + (conMod * (level - 1))}</span></div>}
            {bonuses.map((b, i) => <div key={i} className="flex justify-between text-primary border-t border-slate-200 pt-1 border-dashed"><span>{b.name}:</span><span>+{b.val}</span></div>)}
            <div className="border-t-2 border-slate-200 mt-2 pt-2 flex justify-between text-sm font-bold text-slate-900 dark:text-white"><span>{t.total}:</span><span className="text-primary">{calculateMaxHP()}</span></div>
        </div>
    );
  };

    const calculateSpeed = () => {
        const speciesData = SPECIES_DETAILS[selectedSpecies];
        let speed = speciesData?.speed || 30;
        
        // Subspecies speed bonuses (e.g. Wood Elf)
        if (selectedSubspecies === 'Wood Elf' || selectedSubspecies === 'Elfo del Bosque') speed = 35;

        if (selectedClass === 'Monk' && level >= 2) speed += level >= 18 ? 30 : level >= 14 ? 25 : level >= 10 ? 20 : level >= 6 ? 15 : 10;
        if (selectedClass === 'Barbarian' && level >= 5) speed += 10;
        
        const allFeats = [backgroundData?.feat, selectedFeat, ...asiLevels.map(l => asiDecisions[l]?.type === 'feat' ? asiDecisions[l]?.feat : undefined)].filter((f): f is string => !!f);
        
        // Mobile / Speedy / Boon of Speed
        if (allFeats.some(f => f === 'Veloz' || f === 'Mobile' || f === 'Speedy')) speed += 10;
        if (allFeats.some(f => f.includes('Boon of Speed') || f.includes('Bono de Velocidad'))) speed += 30;
        
        return speed;
    };

  const previewInit = useMemo(() => {
    const allFeats = [backgroundData?.feat, selectedFeat, ...asiLevels.map(l => asiDecisions[l]?.type === 'feat' ? asiDecisions[l]?.feat : undefined)].filter((f): f is string => !!f);
    const profBonus = Math.ceil(1 + (level / 4));
    const tempChar: any = {
        level,
        class: selectedClass,
        subclass: selectedSubclass,
        species: selectedSpecies,
        feats: allFeats,
        profBonus,
        inventory: [trinket, ...(backgroundData?.equipment || [])].map(itemStr => ({ name: itemStr, equipped: true }))
    };
    return getTotalInitiative(tempChar, finalStats);
  }, [backgroundData, selectedFeat, asiLevels, asiDecisions, level, selectedClass, selectedSubclass, selectedSpecies, finalStats, trinket]);

  const nextStep = () => {
    if (step < 5) setStep((s) => (s + 1) as CreatorStep);
    else {
        const allFeats = [backgroundData?.feat, selectedFeat, ...asiLevels.map(l => asiDecisions[l]?.type === 'feat' ? asiDecisions[l]?.feat : undefined)].filter((f): f is string => !!f);
        
        // Build a temporary partial character for calculation
        const profBonus = Math.ceil(1 + (level / 4));
        const tempChar: any = {
            level,
            class: selectedClass,
            subclass: selectedSubclass,
            species: selectedSpecies,
            feats: allFeats,
            profBonus,
            inventory: [trinket, ...(backgroundData?.equipment || [])].map(itemStr => ({ name: itemStr, equipped: true }))
        };
        const calculatedInit = getTotalInitiative(tempChar, finalStats);

            const newCharacter: Character = {
            id: `c-${Date.now()}`,
            name: name || 'Heroe',
            level, class: selectedClass, subclass: selectedSubclass, species: selectedSpecies, subspecies: selectedSubspecies, background: selectedBackground, alignment: selectedAlignment,
            hp: { current: calculateMaxHP(), max: calculateMaxHP(), temp: 0 },
            focus: selectedClass === 'Monk' ? { current: level, max: level } : undefined,
            lucky: undefined,
            inspiration: { current: 0, max: 3 },
            ac: calculateAC(), init: calculatedInit, speed: calculateSpeed(), profBonus: profBonus,
            stats: finalStats,
            skills: [...(backgroundData?.skills || []), ...selectedSkills, ...(selectedHumanSkill ? [selectedHumanSkill] : []), ...(selectedElfSkill ? [selectedElfSkill] : []), ...asiLevels.flatMap(l => asiDecisions[l]?.skills || []), ...(selectedFeat === 'Skilled' ? humanFeatSkilledSelections : [])],
            expertise: [...selectedExpertise, ...asiLevels.flatMap(l => asiDecisions[l]?.expertiseSkill ? [asiDecisions[l].expertiseSkill] : []), ...(selectedFeat === 'Skill Expert' ? humanFeatSkilledSelections : [])],
            languages: ['Common', selectedLanguage1, selectedLanguage2].filter(Boolean),
            feats: allFeats,
            metamagics: selectedMetamagics,
            weaponMasteries: selectedMasteries,
            spellcastingAbility: spellcastingAbility || undefined,
            preparedSpells: [
                ...bgSpells,
                ...(selectedClass === 'Ranger' ? ['Hunter\'s Mark'] : []),
                ...(selectedClass === 'Paladin' ? ['Divine Smite'] : [])
            ], 
            inventory: useStartingGold ? [] : [trinket, ...(backgroundData?.equipment || [])].map((itemStr, i) => {
              const match = itemStr.match(/^(.*?) \((\d+)\)$/);
              const baseName = match ? match[1] : itemStr;
              return { id: `init-item-${i}`, name: baseName, quantity: match ? parseInt(match[2]) : 1, equipped: baseName.toLowerCase().includes('amuleto') || baseName.toLowerCase().includes('amulet') };
            }),
            startingGold: useStartingGold ? 50 : undefined,
            money: { cp: 0, sp: 0, gp: useStartingGold ? 50 : 0, ep: 0, pp: 0 },
            imageUrl: charImage, notes: []
        };
        // Inicializar Lucky si el personaje tiene la dote Afortunado/Lucky
        const hasLucky = newCharacter.feats.some(f => f === 'Afortunado' || f === 'Lucky');
        if (hasLucky) {
            newCharacter.lucky = { current: newCharacter.profBonus, max: newCharacter.profBonus };
        }
        onFinish(newCharacter);
    }
  };
  
  return (
    <div className="flex flex-col h-full min-h-screen relative bg-background-light dark:bg-background-dark">
      <header className="flex items-center justify-between p-4 pt-[calc(1.5rem+env(safe-area-inset-top))] z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm sticky top-0">
        <button onClick={() => step > 1 ? setStep((step - 1) as any) : onBack()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"><span className="material-symbols-outlined">arrow_back</span></button>
        <div className="flex-1 text-center"><h2 className="text-lg font-bold">{step === 5 ? t.resume : `${t.step} ${step} ${t.of} 5`}</h2></div>
        <div className="w-10"></div>
      </header>

      {step < 5 && (
          <div className="px-6 pb-2 flex gap-2">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-primary shadow-[0_0_10px_rgba(53,158,255,0.5)]' : 'bg-slate-300 dark:bg-surface-dark'}`}></div>)}
          </div>
      )}

      <main ref={mainRef} className="flex-1 overflow-y-auto no-scrollbar pb-5">
        {step === 1 && (
            <Step1Identity 
                name={name} setName={setName} charImage={charImage} setCharImage={setCharImage} level={level} setLevel={setLevel}
                selectedClass={selectedClass} setSelectedClass={setSelectedClass} selectedSubclass={selectedSubclass} setSelectedSubclass={setSelectedSubclass}
                selectedSpecies={selectedSpecies} setSelectedSpecies={setSelectedSpecies} 
                selectedSubspecies={selectedSubspecies} setSelectedSubspecies={setSelectedSubspecies}
                selectedBackground={selectedBackground} setSelectedBackground={setSelectedBackground}
                bgSpells={bgSpells} setBgSpells={setBgSpells}
            />
        )}
        {step === 2 && (
            <Step2Stats 
                selectedBackground={selectedBackground} backgroundData={backgroundData} bgAsiMode={bgAsiMode} setBgAsiMode={setBgAsiMode} 
                bgPlus2={bgPlus2} setBgPlus2={setBgPlus2} bgPlus1={bgPlus1} setBgPlus1={setBgPlus1} statMethod={statMethod} setStatMethod={setStatMethod}
                remainingPoints={remainingPoints} baseStats={baseStats} handleStatChange={handleStatChange} finalStats={finalStats}
                hpMethod={hpMethod} setHpMethod={setHpMethod} manualRolledHP={manualRolledHP} setManualRolledHP={setManualRolledHP}
                level={level} renderHpBreakdown={renderHpBreakdown} asiLevels={asiLevels} asiDecisions={asiDecisions}
                handleAsiChange={handleAsiChange} openFeatModal={(ctx) => { setFeatModalContext(ctx); setShowFeatModal(true); }}
                suggestedArray={CLASS_SUGGESTED_ARRAYS[selectedClass]} setBaseStats={setBaseStats}
            />
        )}
        {step === 3 && (
            <Step3Details 
                selectedAlignment={selectedAlignment} setSelectedAlignment={setSelectedAlignment} 
                selectedLanguage1={selectedLanguage1} setSelectedLanguage1={setSelectedLanguage1}
                selectedLanguage2={selectedLanguage2} setSelectedLanguage2={setSelectedLanguage2}
                selectedSpecies={selectedSpecies} selectedFeat={selectedFeat} openFeatModal={(ctx) => { setFeatModalContext(ctx as any); setShowFeatModal(true); }}
                spellcastingAbility={spellcastingAbility} setSpellcastingAbility={setSpellcastingAbility}
                useStartingGold={useStartingGold} setUseStartingGold={setUseStartingGold}
            />
        )}
        {step === 4 && (
            <Step4Skills 
                selectedSpecies={selectedSpecies} selectedElfSkill={selectedElfSkill} setSelectedElfSkill={setSelectedElfSkill}
                selectedHumanSkill={selectedHumanSkill} setSelectedHumanSkill={setSelectedHumanSkill} 
                selectedSkills={selectedSkills} toggleSkill={toggleSkill} finalStats={finalStats} backgroundData={backgroundData}
                level={level} classSkillOptions={classSkillOptions} maxMetamagics={maxMetamagics} 
                selectedMetamagics={selectedMetamagics} toggleMetamagic={toggleMetamagic}
                maxMasteries={maxMasteries} selectedMasteries={selectedMasteries} setMasteryAtIndex={setMasteryAtIndex}
                maxExpertise={maxExpertise} selectedExpertise={selectedExpertise} toggleExpertise={toggleExpertise}
                pendingSkillFeat={pendingSkillFeat} setPendingSkillFeat={setPendingSkillFeat}
                asiDecisions={asiDecisions}
                onAsiUpdate={handleAsiChange}
                selectedFeat={selectedFeat}
                onHumanFeatSkillsUpdate={setHumanFeatSkilledSelections}
            />
        )}
        {step === 5 && (
            <Step5Review 
                charImage={charImage} name={name} selectedSpecies={selectedSpecies} selectedSubspecies={selectedSubspecies} selectedClass={selectedClass} 
                selectedSubclass={selectedSubclass} level={level} hp={calculateMaxHP()} ac={calculateAC()} speed={calculateSpeed()}
                init={`${previewInit >= 0 ? '+' : ''}${previewInit}`}
                finalStats={finalStats} selectedBackground={selectedBackground} selectedAlignment={selectedAlignment}
                backgroundData={backgroundData} selectedFeat={selectedFeat} asiLevels={asiLevels} asiDecisions={asiDecisions}
                activePassives={[]} selectedMetamagics={selectedMetamagics} languages={['Common', selectedLanguage1, selectedLanguage2].filter(Boolean)}
                trainedSkills={[...(backgroundData?.skills || []), ...selectedSkills, ...(selectedHumanSkill ? [selectedHumanSkill] : []), ...(selectedElfSkill ? [selectedElfSkill] : [])]}
                onConfirm={nextStep}
            />
        )}
      </main>

      {step < 5 && (
        <div className="px-4 py-3 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-background-dark sticky bottom-0 z-20 mb-[env(safe-area-inset-bottom)]">
            <button onClick={nextStep} className="w-full py-3 rounded-xl font-bold text-lg bg-primary text-background-dark shadow-lg shadow-primary/30">{t.continue}</button>
        </div>
      )}

      {showFeatModal && (
          <FeatModal 
              featModalContext={featModalContext} selectedFeat={selectedFeat} asiDecisions={asiDecisions} 
              handleFeatSelect={handleFeatSelect} onClose={() => setShowFeatModal(false)} 
          />
      )}
    </div>
  );
};

export default CreatorSteps;
