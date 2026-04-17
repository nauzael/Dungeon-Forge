import React, { useState, useMemo, useEffect } from 'react';
import { Character, Ability } from '../../../types';
import { CLASS_PROGRESSION, SUBCLASS_OPTIONS, HIT_DIE, CLASS_SKILL_DATA } from '../../../Data/characterOptions';
import { SKILL_LIST } from '../../../Data/skills';
import { FEAT_OPTIONS } from '../../../Data/feats/index';
import { getFinalStats, getAllHpBonusesPerLevel, getItemHpBonusesPerLevel, getItemHpBonusesOneTime } from '../../../utils/sheetUtils';
import { UI } from '../../../constants/ui';
import { logLevelUp, type LevelUpLogEntry } from '../../../utils/logger';
import HPStep from './steps/HPStep';
import SubclassStep from './steps/SubclassStep';
import SkillsStep from './steps/SkillsStep';
import SpellsStep from './steps/SpellsStep';
import ASIFeatStep from './steps/ASIFeatStep';
import SummaryStep from './steps/SummaryStep';
import FightingStyleStep from './steps/FightingStyleStep';
import SchoolSavantStep from './steps/SchoolSavantStep';
import DeftExplorerStep from './steps/DeftExplorerStep';

interface LevelUpWizardProps {
    character: Character;
    onComplete: (updatedCharacter: Character) => void;
    onCancel: () => void;
}

const LevelUpWizard: React.FC<LevelUpWizardProps> = ({ character, onComplete, onCancel }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const t = UI;
    
    const nextLevel = character.level + 1;
    const stats = getFinalStats(character);
    const conMod = Math.floor(((stats.CON || 10) - 10) / 2);
    const hitDie = HIT_DIE[character.class] || 8;

    const newFeatures = CLASS_PROGRESSION[character.class]?.[nextLevel] || [];
    const needsSubclass = !character.subclass && newFeatures.some((f: string) => f.toLowerCase().includes('subclass'));
    const needsAsi = newFeatures.some((f: string) => f.toLowerCase().includes('ability score improvement'));

    const skillData = CLASS_SKILL_DATA[character.class];
    const rawOptions = skillData?.options;
    const isAnySkill = rawOptions === 'Any' || (Array.isArray(rawOptions) && rawOptions.some(o => typeof o === 'string' && o.toLowerCase().includes('any')));
    const skillOptions = isAnySkill ? SKILL_LIST : (Array.isArray(rawOptions) ? rawOptions : []);

    const hasPrimalKnowledge = newFeatures.some((f: string) => f.toLowerCase().includes('primal knowledge'));
    const skillsGainedThisLevel = hasPrimalKnowledge ? 1 : 0;
    const skillsNeeded = skillsGainedThisLevel;
    const isGainingSkills = skillsNeeded > 0;
    const availableSkills = skillOptions.filter((s: string) => !character.skills.includes(s));

    const needsMetamagic = character.class === 'Sorcerer' && (nextLevel === 2 || nextLevel === 10 || nextLevel === 17);
    const metamagicCount = nextLevel === 2 ? 2 : 1;
    const hasFightingStyleClasses = ['Fighter', 'Ranger', 'Paladin'];
    const fightingStyleFeats = ['Archery', 'Blind Fighting', 'Defense', 'Dueling', 'Great Weapon Fighting', 'Interception', 'Protection', 'Thrown Weapon Fighting', 'Two Weapon Fighting', 'Unarmed Fighting'];
    const hasFightingStyle = character.fightingStyle || character.feats.some(f => fightingStyleFeats.includes(f));
    const needsFightingStyle = hasFightingStyleClasses.includes(character.class) && !hasFightingStyle && (
        (character.class === 'Fighter' && nextLevel === 1) ||
        (character.class === 'Ranger' && nextLevel === 2) ||
        (character.class === 'Paladin' && nextLevel === 2)
    );
    const needsAdditionalFightingStyle = character.class === 'Fighter' && !hasFightingStyle && nextLevel === 7;

    // Deft Explorer: Ranger Level 2
    const needsDeftExplorer = character.class === 'Ranger' && nextLevel === 2 && !character.feats?.includes('Deft Explorer');

    const SAVANT_SUBCLASSES: Record<string, { school: string; featureName: string }> = {
        'Abjurer': { school: 'abjuration', featureName: 'Abjuration Savant' },
        'Diviner': { school: 'divination', featureName: 'Divination Savant' },
        'Evoker': { school: 'evocation', featureName: 'Evocation Savant' },
        'Illusionist': { school: 'illusion', featureName: 'Illusion Savant' },
    };
    const hasSavants = (s: string) => s in SAVANT_SUBCLASSES;

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [subclass, setSubclass] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [asiType, setAsiType] = useState<'stat' | 'feat'>('stat');
    const [stat1, setStat1] = useState<Ability>('STR');
    const [stat2, setStat2] = useState<Ability>('DEX');
    const [feat, setFeat] = useState('');
    const [featStat, setFeatStat] = useState<Ability | null>(null);
    const [pendingMetamagics, setPendingMetamagics] = useState<string[]>([]);
    const [fightingStyle, setFightingStyle] = useState(character.fightingStyle || '');
    const [druidicWarriorCantrips, setDruidicWarriorCantrips] = useState<string[]>(character.druidicWarriorCantrips || []);
    const [additionalFightingStyle, setAdditionalFightingStyle] = useState('');
    const [savantSpells, setSavantSpells] = useState<string[]>([]);
    const [deftExplorerSkill, setDeftExplorerSkill] = useState('');
    const [deftExplorerLanguages, setDeftExplorerLanguages] = useState<string[]>([]);
    
    const effectiveSubclass = character.subclass || subclass;
    const isSavantClass = character.class === 'Wizard' && effectiveSubclass && hasSavants(effectiveSubclass);
    const needsSavantInitial = isSavantClass && nextLevel === 3 && !character.savantSpellsAdded;
    const needsSavantSlot = isSavantClass && nextLevel > 3 && !character.savantSpellsAdded && (
        nextLevel === 3 || nextLevel === 5 || nextLevel === 7 || nextLevel === 9 || nextLevel === 11 || 
        nextLevel === 13 || nextLevel === 15 || nextLevel === 17 || nextLevel === 19
    );
    const needsSavantStep = needsSavantInitial || needsSavantSlot;
    const savantSchool = effectiveSubclass ? SAVANT_SUBCLASSES[effectiveSubclass]?.school || 'illusion' : 'illusion';
    const savantFeatureName = effectiveSubclass ? SAVANT_SUBCLASSES[effectiveSubclass]?.featureName || 'Savant' : 'Savant';
    const savantSpellCount = needsSavantInitial ? 2 : 1;
    const savantMaxLevel = Math.min(Math.ceil(nextLevel / 2), 9);
    
    const [hpGain, setHpGain] = useState(() => {
        const avgGain = Math.floor(hitDie / 2) + 1;
        const hpBonusPerLevel = getAllHpBonusesPerLevel(character);
        return Math.max(1, avgGain + conMod + hpBonusPerLevel);
    });
    const [hpMethod, setHpMethod] = useState<'roll' | 'average'>('average');
    const [rolledValue, setRolledValue] = useState(Math.floor(hitDie / 2) + 1);

    const selectedFeat = useMemo(() => FEAT_OPTIONS.find(f => f.name === feat), [feat]);
    const featHasAsi = useMemo(() => selectedFeat?.asi && selectedFeat.asi.length > 0, [selectedFeat]);

    const activeSteps: string[] = ['hp'];
    if (needsSubclass) activeSteps.push('subclass');
    if (needsSavantStep) activeSteps.push('savant');
    if (skillsNeeded > 0) activeSteps.push('skills');
    if (needsFightingStyle) activeSteps.push('fightingStyle');
    if (needsAdditionalFightingStyle) activeSteps.push('additionalFightingStyle');
    if (needsDeftExplorer) activeSteps.push('deftExplorer');
    if (character.class !== 'Barbarian' && character.class !== 'Fighter' && character.class !== 'Monk' && character.class !== 'Rogue') {
        activeSteps.push('spells');
    }
    if (needsAsi) activeSteps.push('asiFeat');
    activeSteps.push('summary');

    const currentStep = activeSteps[currentStepIndex];
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === activeSteps.length - 1;

    const canProceed = () => {
        switch (currentStep) {
            case 'hp':
                return true;
            case 'subclass':
                return subclass !== '';
            case 'skills':
                return selectedSkills.length === skillsNeeded;
            case 'fightingStyle':
                if (fightingStyle === 'Druidic Warrior') {
                    return druidicWarriorCantrips.length === 2;
                }
                return fightingStyle !== '';
            case 'additionalFightingStyle':
                return additionalFightingStyle !== '';
            case 'deftExplorer':
                return deftExplorerSkill !== '' && deftExplorerLanguages.length === 2;
            case 'savant':
                return savantSpells.length === savantSpellCount;
            case 'spells':
                return !needsMetamagic || pendingMetamagics.length === metamagicCount;
            case 'asiFeat':
                if (asiType === 'stat') {
                    return !!stat1;
                }
                if (feat && featHasAsi) {
                    return featStat !== null;
                }
                return feat !== '';
            case 'summary':
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (isLastStep) {
            confirmLevelUp();
        } else {
            setCurrentStepIndex(prev => Math.min(prev + 1, activeSteps.length - 1));
        }
    };

    const handleBack = () => {
        setCurrentStepIndex(prev => Math.max(prev - 1, 0));
    };

    const confirmLevelUp = () => {
        const newProf = Math.ceil(1 + (nextLevel / 4));
        let extraHpTotal = 0;
        
        // Draconic Sorcery retroactive bonus (if just selected at this level)
        if (needsSubclass && subclass === 'Draconic Sorcery') {
            extraHpTotal += ((nextLevel - 1) * 1);
        }
        
        // Tough feat retroactive bonus (if just selected at this level)
        if (needsAsi && asiType === 'feat' && feat === 'Tough' && !character.feats.includes('Tough')) {
            extraHpTotal += ((nextLevel - 1) * 2);
        }
        
        // Automatic magical item bonuses (per level + one-time)
        const itemPerLevelBonus = getItemHpBonusesPerLevel(character);
        const itemOneTimeBonus = getItemHpBonusesOneTime(character);
        
        // Apply retroactive per-level item bonuses (from current equipped items)
        if (itemPerLevelBonus > 0) {
            extraHpTotal += ((nextLevel - 1) * itemPerLevelBonus);
        }
        
        // Apply one-time item bonuses only once at this level
        extraHpTotal += itemOneTimeBonus;

        const updatedChar: Character = {
            ...character,
            level: nextLevel,
            profBonus: newProf,
            hp: {
                ...character.hp,
                max: character.hp.max + hpGain + extraHpTotal,
                current: character.hp.current + hpGain + extraHpTotal
            },
            skills: [...character.skills, ...selectedSkills]
        };

        if (needsSubclass && subclass) {
            updatedChar.subclass = subclass;
            const subclassData = SUBCLASS_OPTIONS[character.class]?.find((s: any) => s.name === subclass);
            if (subclassData?.alwaysPreparedSpells) {
                const spellsToAdd: string[] = [];
                Object.entries(subclassData.alwaysPreparedSpells).forEach(([lvl, spells]) => {
                    if (parseInt(lvl) <= nextLevel) {
                        spellsToAdd.push(...(spells as string[]));
                    }
                });
                if (spellsToAdd.length > 0) {
                    updatedChar.preparedSpells = [...new Set([...(updatedChar.preparedSpells || []), ...spellsToAdd])];
                }
            }
        }

        if (needsAsi) {
            if (asiType === 'feat' && feat) {
                updatedChar.feats = [...(updatedChar.feats || []), feat];
                if (featHasAsi && featStat) {
                    const newStats = { ...updatedChar.stats };
                    newStats[featStat] = Math.min((newStats[featStat] || 10) + 1, 20);
                    updatedChar.stats = newStats;
                }
            } else {
                const newStats = { ...updatedChar.stats };
                if (stat1) {
                    // If stat1 === stat2, add 2 to the same stat; otherwise add 1 each
                    const stat1Increase = stat2 === stat1 ? 2 : 1;
                    newStats[stat1] = Math.min((newStats[stat1] || 10) + stat1Increase, 20);
                    if (stat2 && stat2 !== stat1) {
                        newStats[stat2] = Math.min((newStats[stat2] || 10) + 1, 20);
                    }
                }
                updatedChar.stats = newStats;
            }
        }

        // FIGHTING STYLE / DRUIDIC WARRIOR
        if (needsFightingStyle && fightingStyle) {
            updatedChar.fightingStyle = fightingStyle;
            if (!updatedChar.feats) updatedChar.feats = [];
            if (!updatedChar.feats.includes(fightingStyle)) {
                updatedChar.feats = [...updatedChar.feats, fightingStyle];
            }
            if (fightingStyle === 'Druidic Warrior' && druidicWarriorCantrips.length > 0) {
                updatedChar.druidicWarriorCantrips = druidicWarriorCantrips;
                updatedChar.preparedSpells = [...new Set([...(updatedChar.preparedSpells || []), ...druidicWarriorCantrips])];
            }
        }

        // ADDITIONAL FIGHTING STYLE (Fighter level 7)
        if (needsAdditionalFightingStyle && additionalFightingStyle) {
            if (!updatedChar.feats) updatedChar.feats = [];
            if (!updatedChar.feats.includes(additionalFightingStyle)) {
                updatedChar.feats = [...updatedChar.feats, additionalFightingStyle];
            }
        }

        // DEFT EXPLORER (Ranger level 2)
        if (needsDeftExplorer && deftExplorerSkill && deftExplorerLanguages.length === 2) {
            // Add Deft Explorer feat
            if (!updatedChar.feats) updatedChar.feats = [];
            if (!updatedChar.feats.includes('Deft Explorer')) {
                updatedChar.feats = [...updatedChar.feats, 'Deft Explorer'];
            }
            
            // Add expertise to the selected skill
            if (!updatedChar.expertise) updatedChar.expertise = [];
            if (!updatedChar.expertise.includes(deftExplorerSkill)) {
                updatedChar.expertise = [...updatedChar.expertise, deftExplorerSkill];
            }
            
            // Add the two selected languages
            if (!updatedChar.languages) updatedChar.languages = [];
            updatedChar.languages = [...new Set([...updatedChar.languages, ...deftExplorerLanguages])];
        }

        // ========== CLASS-SPECIFIC PROGRESSION ==========

        // MONK: Ki points equal level, Martial Arts die scales
        if (character.class === 'Monk') {
            updatedChar.focus = { current: nextLevel, max: nextLevel };
            updatedChar.kiMax = nextLevel;
            // Martial Arts die: d6 (1-4), d8 (5-10), d10 (11-16), d12 (17+)
            if (nextLevel >= 17) updatedChar.martialArtsDie = 12;
            else if (nextLevel >= 11) updatedChar.martialArtsDie = 10;
            else if (nextLevel >= 5) updatedChar.martialArtsDie = 8;
            else updatedChar.martialArtsDie = 6;
        }

        // ROGUE: Sneak Attack die progression (d6 at Lv1, +1d6 at Lv3,5,7,9,11,13,15,17,19)
        if (character.class === 'Rogue') {
            const sneakDice = Math.ceil(nextLevel / 2);
            updatedChar.sneakAttackDie = Math.min(sneakDice, 10); // Max 10d6 at Lv19
        }

        // BARBARIAN: Rage uses and Rage Damage
        if (updatedChar.class === 'Barbarian') {
            // Rage uses: 2 (1-2), 3 (3-5), 4 (6-9), 5 (10-13), 6 (14-16), unlimited (20)
            let newRageMax = 2;
            if (nextLevel >= 20) newRageMax = 99; // Primal Champion = unlimited (we use 99)
            else if (nextLevel >= 14) newRageMax = 6;
            else if (nextLevel >= 10) newRageMax = 5;
            else if (nextLevel >= 6) newRageMax = 4;
            else if (nextLevel >= 3) newRageMax = 3;
            updatedChar.rageUses = { current: newRageMax, max: newRageMax };
            // Rage Damage: 2 at Lv1, +1 at Lv5,9,13,17
            let rageDmg = 2;
            if (nextLevel >= 17) rageDmg = 6;
            else if (nextLevel >= 13) rageDmg = 5;
            else if (nextLevel >= 9) rageDmg = 4;
            else if (nextLevel >= 5) rageDmg = 3;
            updatedChar.rageDamage = rageDmg;
        }

        // BARD: Bardic Inspiration uses and die size
        if (updatedChar.class === 'Bard') {
            const newChaMod = Math.floor(((getFinalStats(updatedChar).CHA || 10) - 10) / 2);
            const newBardicMax = Math.max(1, newChaMod);
            updatedChar.bardicInspiration = { current: newBardicMax, max: newBardicMax };
            // Bardic Inspiration die: d6 (1-4), d8 (5-9), d10 (10-14), d12 (15+)
            if (nextLevel >= 15) updatedChar.bardicInspirationDie = 12;
            else if (nextLevel >= 10) updatedChar.bardicInspirationDie = 10;
            else if (nextLevel >= 5) updatedChar.bardicInspirationDie = 8;
            else updatedChar.bardicInspirationDie = 6;
        }

        // CLERIC: Channel Divinity uses
        if (updatedChar.class === 'Cleric') {
            // 1 at Lv2, 2 at Lv6, 3 at Lv18
            const newCDMax = nextLevel >= 18 ? 3 : nextLevel >= 6 ? 2 : 1;
            updatedChar.channelDivinity = { current: newCDMax, max: newCDMax };
        }

        // PALADIN: Channel Divinity, Lay on Hands, Auras
        if (updatedChar.class === 'Paladin') {
            // Channel Divinity: 1 at Lv3, 2 at Lv7, 3 at Lv11
            const newCDMax = nextLevel >= 11 ? 3 : nextLevel >= 7 ? 2 : 1;
            updatedChar.channelDivinity = { current: newCDMax, max: newCDMax };
            // Lay on Hands pool: 5 * level
            updatedChar.layOnHands = { current: nextLevel * 5, max: nextLevel * 5 };
        }

        // DRUID: Wild Shape uses and max CR
        if (updatedChar.class === 'Druid') {
            // Uses: 2 at Lv2, 3 at Lv6, 4 at Lv15
            let wsMax = 2;
            if (nextLevel >= 15) wsMax = 4;
            else if (nextLevel >= 6) wsMax = 3;
            updatedChar.wildShape = { current: wsMax, max: wsMax };
            // Max CR: 1/4 (Lv2), 1/2 (Lv4), 1 (Lv8), with fly at Lv8
            updatedChar.wildShapeMax = nextLevel >= 8 ? 3 : nextLevel >= 4 ? 2 : 1;
        }

        // FIGHTER: Action Surge, Second Wind, Indomitable, Extra Attack
        if (updatedChar.class === 'Fighter') {
            // Action Surge: 1 use (Lv2+), 2 uses (Lv17+)
            const newActionSurgeMax = nextLevel >= 17 ? 2 : 1;
            updatedChar.actionSurge = { current: newActionSurgeMax, max: newActionSurgeMax };
            updatedChar.secondWind = { current: 1, max: 1 }; // Always 1 use, refreshes on short rest
            // Indomitable: 1 use (Lv9+), 2 uses (Lv13+), 3 uses (Lv17+)
            let indomMax = 0;
            if (nextLevel >= 17) indomMax = 3;
            else if (nextLevel >= 13) indomMax = 2;
            else if (nextLevel >= 9) indomMax = 1;
            if (indomMax > 0) {
                updatedChar.indomitable = { current: indomMax, max: indomMax };
            }
        }

        // SORCERER: Sorcery Points and Innate Sorcery
        if (character.class === 'Sorcerer') {
            // Sorcery Points = level (at Lv2+)
            if (nextLevel >= 2) {
                updatedChar.sorceryPoints = { current: nextLevel, max: nextLevel };
            }
            // Innate Sorcery: 2 uses (Lv1+)
            updatedChar.innateSorcery = { current: 2, max: 2 };
        }

        // WARLOCK: Pact Magic slot level, Mystic Arcanum, Magical Cunning
        if (character.class === 'Warlock') {
            // Pact Slot level progression: Lv3=2nd, Lv5=3rd, Lv7=4th, Lv9=5th
            let pactLevel = 1;
            if (nextLevel >= 9) pactLevel = 5;
            else if (nextLevel >= 7) pactLevel = 4;
            else if (nextLevel >= 5) pactLevel = 3;
            else if (nextLevel >= 3) pactLevel = 2;
            updatedChar.pactSlotLevel = pactLevel;
            // Magical Cunning: 1 use per long rest (recover half slots rounded up on short rest)
            updatedChar.magicalCunning = { current: 1, max: 1 };
            // Mystic Arcanum at Lv11, 13, 15, 17
            if (nextLevel >= 11 && !updatedChar.mysticArcanum) {
                updatedChar.mysticArcanum = {};
            }
            if (nextLevel >= 11) updatedChar.mysticArcanum = { ...updatedChar.mysticArcanum };
        }

        // RANGER: Hunter's Mark uses (Lv1: 2, +1 at Lv5,9,13,17)
        if (character.class === 'Ranger') {
            let hmUses = 2;
            if (nextLevel >= 17) hmUses = 6;
            else if (nextLevel >= 13) hmUses = 5;
            else if (nextLevel >= 9) hmUses = 4;
            else if (nextLevel >= 5) hmUses = 3;
            updatedChar.hunterMarkUses = { current: hmUses, max: hmUses };
        }

        // WIZARD: Arcane Recovery (Lv2+), Spell Mastery (Lv18), Signature Spells (Lv20)
        if (character.class === 'Wizard') {
            // Arcane Recovery: Can recover spell slots on short rest (level/2 rounded up)
            const recoveryUses = Math.ceil(nextLevel / 2);
            updatedChar.arcaneRecovery = { uses: recoveryUses };
            // Spell Mastery at Lv18: Choose 2 lv1 and 2 lv2 spells to cast at will
            if (nextLevel >= 18 && !updatedChar.spellMastery) {
                updatedChar.spellMastery = [];
            }
            // Signature Spells at Lv20: Choose 2 lv3 spells to cast without slot
            if (nextLevel >= 20 && !updatedChar.signatureSpells) {
                updatedChar.signatureSpells = [];
            }
        }

        // BARD: Font of Inspiration (Lv5) - recover inspiration on short rest
        if (character.class === 'Bard' && nextLevel >= 5) {
            const chaMod = Math.floor(((getFinalStats(updatedChar).CHA || 10) - 10) / 2);
            updatedChar.fontOfInspiration = { current: Math.max(1, chaMod), max: Math.max(1, chaMod) };
        }

        // EXTRA ATTACK: Classes that get it (Barbarian, Fighter, Monk, Paladin, Ranger at Lv5)
        const extraAttacksClasses = ['Barbarian', 'Fighter', 'Monk', 'Paladin', 'Ranger'];
        if (extraAttacksClasses.includes(updatedChar.class) && nextLevel >= 5) {
            let attacks = 1; // Base from Extra Attack
            // Fighter gets additional at Lv11 (+1) and Lv20 (+1 more)
            if (updatedChar.class === 'Fighter') {
                if (nextLevel >= 20) attacks = 3;
                else if (nextLevel >= 11) attacks = 2;
            }
            updatedChar.extraAttacks = attacks;
        }

        // LUCKY FEAT
        const hasLucky = (updatedChar.feats || []).some((f: string) => f === 'Afortunado' || f === 'Lucky');
        if (hasLucky) {
            const current = Math.min(updatedChar.lucky?.current ?? newProf, newProf);
            updatedChar.lucky = { current, max: newProf };
        }

        if (needsMetamagic && pendingMetamagics.length > 0) {
            updatedChar.metamagics = [...(character.metamagics || []), ...pendingMetamagics];
        }

        if (needsSavantStep && savantSpells.length > 0) {
            // Guardar en savantSpells (son gratuitos, NO van en preparedSpells)
            updatedChar.savantSpells = [...new Set([...(character.savantSpells || []), ...savantSpells])];
            updatedChar.savantSpellsAdded = true;
        }

        const logEntry: LevelUpLogEntry = {
            timestamp: Date.now(),
            characterId: character.id,
            characterName: character.name,
            fromLevel: character.level,
            toLevel: nextLevel,
            changes: {
                hpChange: hpGain + extraHpTotal,
                newFeatures: CLASS_PROGRESSION[character.class]?.[nextLevel] || [],
                newFeats: needsAsi && asiType === 'feat' && feat ? [feat] : [],
                statsIncreased: needsAsi && asiType === 'stat' ? [stat1, stat2] : [],
            },
            source: 'level_up',
        };
        logLevelUp(logEntry);

        onComplete(updatedChar);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 'hp':
                return (
                    <HPStep
                        character={character}
                        nextLevel={nextLevel}
                        hitDie={hitDie}
                        conMod={conMod}
                        hpGain={hpGain}
                        hpMethod={hpMethod}
                        rolledValue={rolledValue}
                        onHpGainChange={setHpGain}
                        onHpMethodChange={setHpMethod}
                        onRolledValueChange={setRolledValue}
                    />
                );
            case 'subclass':
                return (
                    <SubclassStep
                        character={character}
                        nextLevel={nextLevel}
                        selectedSubclass={subclass}
                        onSelect={(s) => {
                            setSubclass(s);
                            handleNext();
                        }}
                    />
                );
            case 'skills':
                return (
                    <SkillsStep
                        character={character}
                        availableSkills={availableSkills}
                        skillsNeeded={skillsNeeded}
                        selectedSkills={selectedSkills}
                        onToggleSkill={(s) => {
                            if (selectedSkills.includes(s)) {
                                setSelectedSkills(selectedSkills.filter(x => x !== s));
                            } else if (selectedSkills.length < skillsNeeded) {
                                setSelectedSkills([...selectedSkills, s]);
                            }
                        }}
                    />
                );
            case 'fightingStyle':
                return (
                    <FightingStyleStep
                        character={character}
                        fightingStyle={fightingStyle}
                        druidicWarriorCantrips={druidicWarriorCantrips}
                        onFightingStyleChange={setFightingStyle}
                        onDruidicWarriorCantripsChange={setDruidicWarriorCantrips}
                    />
                );
            case 'additionalFightingStyle':
                return (
                    <FightingStyleStep
                        character={character}
                        fightingStyle={additionalFightingStyle}
                        druidicWarriorCantrips={[]}
                        onFightingStyleChange={setAdditionalFightingStyle}
                        onDruidicWarriorCantripsChange={() => {}}
                        isAdditionalStyle
                    />
                );
            case 'deftExplorer':
                return (
                    <DeftExplorerStep
                        character={character}
                        selectedExpertiseSkill={deftExplorerSkill}
                        selectedLanguages={deftExplorerLanguages}
                        onExpertiseSkillChange={setDeftExplorerSkill}
                        onLanguagesChange={setDeftExplorerLanguages}
                    />
                );
            case 'savant':
                return (
                    <SchoolSavantStep
                        character={character}
                        subclassName={effectiveSubclass}
                        savantFeatureName={savantFeatureName}
                        spellCount={savantSpellCount}
                        maxSpellLevel={savantMaxLevel}
                        selectedSpells={savantSpells}
                        onSpellsChange={setSavantSpells}
                        schoolName={savantSchool}
                    />
                );
            case 'spells':
                return (
                    <SpellsStep
                        character={character}
                        nextLevel={nextLevel}
                        metamagicCount={metamagicCount}
                        selectedMetamagics={pendingMetamagics}
                        onMetamagicChange={setPendingMetamagics}
                    />
                );
            case 'asiFeat':
                return (
                    <ASIFeatStep
                        character={character}
                        asiType={asiType}
                        stat1={stat1}
                        stat2={stat2}
                        feat={feat}
                        featStat={featStat}
                        selectedFeat={selectedFeat}
                        nextLevel={nextLevel}
                        onAsiTypeChange={(v) => {
                            setAsiType(v);
                            if (v === 'feat') {
                                setStat1('STR');
                                setStat2('DEX');
                            } else {
                                setFeat('');
                                setFeatStat(null);
                            }
                        }}
                        onStat1Change={(v) => setStat1(v)}
                        onStat2Change={(v) => setStat2(v)}
                        onFeatChange={(v) => { setFeat(v); setFeatStat(null); }}
                        onFeatStatChange={setFeatStat}
                    />
                );
            case 'summary':
                return (
                    <SummaryStep
                        character={character}
                        nextLevel={nextLevel}
                        pending={{
                            hpGain,
                            subclass,
                            selectedSkills,
                            preparedSpells: [],
                            asiType,
                            stat1,
                            stat2,
                            feat,
                            featStat,
                            selectedFeat,
                            deftExplorerSkill,
                            deftExplorerLanguages
                        }}
                        onConfirm={confirmLevelUp}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 dark:bg-black/60 flex items-end sm:items-center justify-center animate-fadeIn backdrop-blur-sm">
            <div className="w-full sm:max-w-lg bg-white dark:bg-[#0f1525] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[95vh] sm:max-h-[85vh] flex flex-col animate-slideUp overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/10 shrink-0">
                    <button
                        onClick={onCancel}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">close</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                            {t.levelUp || 'Level Up'}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                            Lv. {character.level} → {nextLevel}
                        </span>
                    </div>
                    <div className="w-10" />
                </div>

                {/* Progress Dots */}
                <div className="flex items-center justify-center gap-1.5 py-2.5 px-4 shrink-0">
                    {activeSteps.map((step, index) => (
                        <div
                            key={step}
                            className={`h-1 rounded-full transition-all duration-300 ${
                                index === currentStepIndex
                                    ? 'w-6 bg-gradient-to-r from-emerald-500 to-green-500'
                                    : index < currentStepIndex
                                    ? 'w-6 bg-emerald-500/40'
                                    : 'w-6 bg-slate-200 dark:bg-white/10'
                            }`}
                        />
                    ))}
                </div>

                {/* Content - takes remaining space and is scrollable */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {renderStep()}
                </div>

                {/* Footer Buttons */}
                <div className="grid grid-cols-2 gap-3 p-4 border-t border-slate-100 dark:border-white/10 shrink-0 bg-white dark:bg-[#0f1525]">
                    <button
                        onClick={handleBack}
                        disabled={isFirstStep}
                        className={`py-3 rounded-xl font-bold text-sm transition-all ${
                            isFirstStep
                                ? 'bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-white/20 cursor-not-allowed'
                                : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 active:scale-[0.98]'
                        }`}
                    >
                        {t.back || 'Back'}
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className={`py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all active:scale-[0.98] ${
                            canProceed()
                                ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-emerald-500/25'
                                : 'bg-slate-300 dark:bg-white/10 cursor-not-allowed shadow-none'
                        }`}
                    >
                        {isLastStep ? (t.confirm || 'Confirm') : (t.next || 'Next')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LevelUpWizard;
