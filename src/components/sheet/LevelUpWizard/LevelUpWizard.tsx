import React, { useState, useMemo, useEffect } from 'react';
import { Character, Ability } from '../../../../types';
import { CLASS_PROGRESSION, SUBCLASS_OPTIONS, HIT_DIE, CLASS_SKILL_DATA, CLASS_SAVING_THROWS } from '../../../../Data/characterOptions';
import { SKILL_LIST } from '../../../../Data/skills';
import { SPELL_DETAILS } from '../../../../Data/spells';
import { FEAT_OPTIONS } from '../../../../Data/feats/index';
import { getFinalStats, getAllHpBonusesPerLevel, getItemHpBonusesPerLevel, getItemHpBonusesOneTime, getWizardSpellsToLearnOnLevelUp } from '../../../../utils/sheetUtils';
import { UI } from '../../../../constants/ui';
import { logLevelUp, type LevelUpLogEntry } from '../../../../utils/logger';
import HPStep from './steps/HPStep';
import SubclassStep from './steps/SubclassStep';
import SkillsStep from './steps/SkillsStep';
import SpellsStep from './steps/SpellsStep';
import ASIFeatStep from './steps/ASIFeatStep';
import SummaryStep from './steps/SummaryStep';
import FightingStyleStep from './steps/FightingStyleStep';
import SchoolSavantStep from './steps/SchoolSavantStep';
import DeftExplorerStep from './steps/DeftExplorerStep';
import WizardSpellbookStep from './steps/WizardSpellbookStep';
import ExpertiseStep from './steps/ExpertiseStep';
import SubclassChoiceStep, { type SubclassChoiceGroup } from './steps/SubclassChoiceStep';
import MagicalSecretsStep from './steps/MagicalSecretsStep';

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

    // ✅ MOVE ALL useState HOOKS TO THE TOP (Before any logic that uses them)
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
    const [newSpellsLearned, setNewSpellsLearned] = useState<string[]>([]);
    
    // New: Expertise, subclass choices, magical secrets, mystic arcanum
    const [newExpertiseSkills, setNewExpertiseSkills] = useState<string[]>([]);
    const [subclassChoiceSelections, setSubclassChoiceSelections] = useState<string[][]>([]);
    const [magicalSecretSpells, setMagicalSecretSpells] = useState<string[]>([]);
    const [mysticArcanumSpell, setMysticArcanumSpell] = useState('');
    
    const nextLevel = character.level + 1;
    const stats = getFinalStats(character);
    const conMod = Math.floor(((stats.CON || 10) - 10) / 2);
    const hitDie = HIT_DIE[character.class] || 8;
    
    const [hpGain, setHpGain] = useState(() => {
        const avgGain = Math.floor(hitDie / 2) + 1;
        const hpBonusPerLevel = getAllHpBonusesPerLevel(character);
        return Math.max(1, avgGain + conMod + hpBonusPerLevel);
    });
    const [hpMethod, setHpMethod] = useState<'roll' | 'average'>('average');
    const [rolledValue, setRolledValue] = useState(Math.floor(hitDie / 2) + 1);

    // ✅ ⭐ MUST define effectiveSubclass BEFORE any IIFE/useMemo that references it
    const effectiveSubclass = character.subclass || subclass;

    // ✅ NOW use the state variables after they're defined
    const t = UI;
    const newFeatures = CLASS_PROGRESSION[character.class]?.[nextLevel] || [];
    const needsSubclass = !character.subclass && newFeatures.some((f: string) => f.toLowerCase().includes('subclass'));
    const needsAsi = newFeatures.some((f: string) => f.toLowerCase().includes('ability score improvement'));
    const needsMetamagic = character.class === 'Sorcerer' && (nextLevel === 2 || nextLevel === 10 || nextLevel === 17);
    const metamagicCount = nextLevel === 2 ? 2 : 1;

    // ─── Compute subclass features & always-prepared spells for this level ───
    const subclassFeaturesForLevel = (() => {
      if (!effectiveSubclass) return [] as { name: string; description: string }[];
      const subclassData = SUBCLASS_OPTIONS[character.class]?.find((s: any) => s.name === effectiveSubclass);
      if (!subclassData?.features?.[nextLevel]) return [];
      return subclassData.features[nextLevel] as { name: string; description: string }[];
    })();

    const newAlwaysPreparedSpells = (() => {
      if (!effectiveSubclass) return [] as string[];
      const subclassData = SUBCLASS_OPTIONS[character.class]?.find((s: any) => s.name === effectiveSubclass);
      const spellsForLevel = subclassData?.alwaysPreparedSpells?.[nextLevel];
      if (!spellsForLevel) return [];
      return (spellsForLevel as string[]).filter(s => !(character.preparedSpells || []).includes(s));
    })();

    // Deft Explorer: Ranger Level 2
    const needsDeftExplorer = character.class === 'Ranger' && nextLevel === 2 && !character.feats?.includes('Deft Explorer');

    // ─── Expertise detection ───
    const needsExpertise = newFeatures.some((f: string) =>
        f.toLowerCase().includes('expertise')
    ) && !needsDeftExplorer;
    const expertiseCount = needsExpertise ? 2 : 0;

    // ─── Subclass choice configuration ───
    interface SubclassChoiceConfig {
        className: string;
        subclassName: string;
        level: number;
        featureName: string;
        choices: SubclassChoiceGroup[];
    }
    const SUBCLASS_CHOICES: SubclassChoiceConfig[] = [
        { className: 'Ranger', subclassName: 'Fey Wanderer', level: 3, featureName: 'Otherworldly Glamour',
            choices: [{ label: 'Choose a Skill Proficiency', options: ['Deception', 'Performance', 'Persuasion'], count: 1, excludeKnown: true, icon: 'psychology' }] },
        { className: 'Bard', subclassName: 'College of the Moon', level: 3, featureName: 'Primal Lore',
            choices: [{ label: 'Choose a Skill Proficiency', options: ['Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Survival'], count: 1, excludeKnown: true, icon: 'psychology' }] },
        { className: 'Paladin', subclassName: 'Oath of the Noble Genies', level: 3, featureName: "Genie's Splendor",
            choices: [{ label: 'Choose a Skill Proficiency', options: ['Acrobatics', 'Intimidation', 'Performance', 'Persuasion'], count: 1, excludeKnown: true, icon: 'psychology' }] },
        { className: 'Fighter', subclassName: 'Banneret', level: 3, featureName: 'Knightly Envoy',
            choices: [
                { label: 'Well Spoken — Choose a Skill', options: ['Insight', 'Intimidation', 'Persuasion', 'Performance'], count: 1, excludeKnown: true, icon: 'psychology' },
                { label: 'Polyglot — Learn a Language', options: ['Abyssal', 'Celestial', 'Deep Speech', 'Draconic', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Infernal', 'Orc', 'Primordial', 'Sylvan', 'Undercommon'], count: 1, icon: 'language' },
            ] },
        { className: 'Wizard', subclassName: 'Bladesinger', level: 3, featureName: 'Training in War and Song',
            choices: [{ label: 'Choose a Skill Proficiency', options: ['Acrobatics', 'Athletics', 'Performance', 'Persuasion'], count: 1, excludeKnown: true, icon: 'psychology' }] },
        { className: 'Cleric', subclassName: 'Knowledge Domain', level: 3, featureName: 'Blessings of Knowledge',
            choices: [{ label: 'Choose Two Skills (Expertise)', options: ['Arcana', 'History', 'Nature', 'Religion'], count: 2, alsoExpertise: true, excludeKnown: true, icon: 'psychology' }] },
    ];
    const activeSubclassChoices = SUBCLASS_CHOICES.filter(cfg =>
        cfg.className === character.class &&
        cfg.subclassName === effectiveSubclass &&
        cfg.level === nextLevel &&
        subclassFeaturesForLevel.some((f: any) => f.name?.toLowerCase().includes(cfg.featureName.toLowerCase()))
    );
    // Flatten all choice groups from all active configs
    const allChoiceGroups: SubclassChoiceGroup[] = [];
    activeSubclassChoices.forEach(cfg => {
        cfg.choices.forEach(c => allChoiceGroups.push(c));
    });
    const needsSubclassChoice = allChoiceGroups.length > 0;

    // ─── Magical Secrets (Bard L10) ───
    const needsMagicalSecrets = character.class === 'Bard' &&
        newFeatures.some((f: string) => f.toLowerCase().includes('magical secrets'));
    const magicalSecretCount = 2;

    // ─── Mystic Arcanum (Warlock L11, 13, 15, 17) ───
    const needsMysticArcanum = character.class === 'Warlock' &&
        newFeatures.some((f: string) => f.toLowerCase().includes('mystic arcanum'));
    const mysticArcanumMaxLevel = (() => {
        const feature = newFeatures.find((f: string) => f.toLowerCase().includes('mystic arcanum'));
        if (!feature) return 6;
        const match = feature.match(/level\s*(\d+)/i);
        return match ? parseInt(match[1]) : 6;
    })();

    // ─── Build feature gains for SummaryStep display ───
    const featureGains: { name: string; description?: string; type: 'class' | 'subclass' | 'spell' | 'metamagic' }[] = [];
    // Class features (excluding "Subclass Feature" and "Ability Score Improvement" which are separate steps)
    newFeatures
      .filter((f: string) => {
        const lower = f.toLowerCase();
        return !lower.includes('subclass') && !lower.includes('ability score improvement');
      })
      .forEach((f: string) => {
        featureGains.push({ name: f, type: 'class' });
      });
    // Subclass features
    subclassFeaturesForLevel.forEach(f => {
      featureGains.push({ name: f.name, description: f.description, type: 'subclass' });
    });
    // Always-prepared spells
    newAlwaysPreparedSpells.forEach(s => {
      featureGains.push({ name: s, type: 'spell' });
    });
    // Metamagic (if applicable)
    if (needsMetamagic && pendingMetamagics.length > 0) {
      pendingMetamagics.forEach(m => {
        featureGains.push({ name: m, type: 'metamagic' });
      });
    }
    // Expertise (if applicable)
    if (needsExpertise) {
      featureGains.push({ name: `Expertise (${newExpertiseSkills.length} skill${newExpertiseSkills.length !== 1 ? 's' : ''})`, type: 'class' });
    }
    // Magical Secrets (if applicable)
    if (needsMagicalSecrets) {
      featureGains.push({ name: `Magical Secrets (${magicalSecretSpells.length} spell${magicalSecretSpells.length !== 1 ? 's' : ''})`, type: 'spell' });
    }
    // Mystic Arcanum (if applicable)
    if (needsMysticArcanum && mysticArcanumSpell) {
      featureGains.push({ name: `Mystic Arcanum: ${mysticArcanumSpell}`, type: 'spell' });
    }

    const skillData = CLASS_SKILL_DATA[character.class];
    const rawOptions = skillData?.options;
    const isAnySkill = rawOptions === 'Any' || (Array.isArray(rawOptions) && rawOptions.some(o => typeof o === 'string' && o.toLowerCase().includes('any')));
    const skillOptions = isAnySkill ? SKILL_LIST : (Array.isArray(rawOptions) ? rawOptions : []);

    // Detect Bonus Proficiencies from SUBCLASSES (e.g., College of Lore Bard Level 3)
    let bonusProficienciesCount = 0;
    if (effectiveSubclass) {
      const subclassData = SUBCLASS_OPTIONS[character.class]?.find((s: any) => s.name === effectiveSubclass);
      const subclassFeatures = subclassData?.features?.[nextLevel] || [];
      const bonusProfsFeature = subclassFeatures.find((f: any) => typeof f === 'object' && f.name?.toLowerCase().includes('bonus proficiencies'));
      if (bonusProfsFeature) {
        // Extraer el número de skills de la descripción (ej: "You gain proficiency with three skills of your choice.")
        const match = bonusProfsFeature.description?.match(/\b(\d+)\s+skills?\b/i) || bonusProfsFeature.description?.match(/\b(one|two|three|four|five)\s+skills?\b/i);
        if (match) {
          const numberMap: Record<string, number> = { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5 };
          bonusProficienciesCount = !isNaN(parseInt(match[1])) ? parseInt(match[1]) : (numberMap[match[1]?.toLowerCase()] || 0);
        }
      }
    }

    const hasPrimalKnowledge = newFeatures.some((f: string) => f.toLowerCase().includes('primal knowledge'));
    const skillsGainedThisLevel = hasPrimalKnowledge ? 1 : 0;
    const skillsNeeded = skillsGainedThisLevel + bonusProficienciesCount; // ✅ Sumar skills de clase + subclase
    const isGainingSkills = skillsNeeded > 0;
    const availableSkills = skillOptions.filter((s: string) => !character.skills.includes(s));

    const hasFightingStyleClasses = ['Fighter', 'Ranger', 'Paladin'];
    const fightingStyleFeats = ['Archery', 'Blind Fighting', 'Defense', 'Dueling', 'Great Weapon Fighting', 'Interception', 'Protection', 'Thrown Weapon Fighting', 'Two Weapon Fighting', 'Unarmed Fighting'];
    const hasFightingStyle = character.fightingStyle || character.feats.some(f => fightingStyleFeats.includes(f));
    const needsFightingStyle = hasFightingStyleClasses.includes(character.class) && !hasFightingStyle && (
        (character.class === 'Fighter' && nextLevel === 1) ||
        (character.class === 'Ranger' && nextLevel === 2) ||
        (character.class === 'Paladin' && nextLevel === 2)
    );
    const needsAdditionalFightingStyle = character.class === 'Fighter' && !hasFightingStyle && nextLevel === 7;

    // Wave 5: Wizard Spellbook Learning
    // Wizards learn 2 new spells when leveling up (except level 1)
    const isWizard = character.class === 'Wizard';
    const needsWizardSpellLearning = isWizard && nextLevel > 1;

    const SAVANT_SUBCLASSES: Record<string, { school: string; featureName: string }> = {
        'Abjurer': { school: 'abjuration', featureName: 'Abjuration Savant' },
        'Diviner': { school: 'divination', featureName: 'Divination Savant' },
        'Evoker': { school: 'evocation', featureName: 'Evocation Savant' },
        'Illusionist': { school: 'illusion', featureName: 'Illusion Savant' },
    };
    const hasSavants = (s: string) => s in SAVANT_SUBCLASSES;
    
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

    const selectedFeat = useMemo(() => FEAT_OPTIONS.find(f => f.name === feat), [feat]);
    const featHasAsi = useMemo(() => selectedFeat?.asi && selectedFeat.asi.length > 0, [selectedFeat]);

    const activeSteps: string[] = ['hp'];
    if (needsSubclass) activeSteps.push('subclass');
    if (needsSavantStep) activeSteps.push('savant');
    if (skillsNeeded > 0) activeSteps.push('skills');
    if (needsFightingStyle) activeSteps.push('fightingStyle');
    if (needsAdditionalFightingStyle) activeSteps.push('additionalFightingStyle');
    if (needsDeftExplorer) activeSteps.push('deftExplorer');
    if (needsExpertise) activeSteps.push('expertise');
    if (needsSubclassChoice) activeSteps.push('subclassChoice');
    if (needsMagicalSecrets) activeSteps.push('magicalSecrets');
    if (needsMysticArcanum) activeSteps.push('mysticArcanum');
    if (character.class !== 'Barbarian' && character.class !== 'Fighter' && character.class !== 'Monk' && character.class !== 'Rogue') {
        activeSteps.push('spells');
    }
    if (needsWizardSpellLearning) activeSteps.push('wizardSpellbook');
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
            case 'wizardSpellbook':
                // For Wizard spellbook step, must learn available spells (can be 0)
                const spellbook = character.wizard?.spellbook || [];
                const nonCantripCount = spellbook.filter(s => {
                    const detail = SPELL_DETAILS[s];
                    return detail && detail.level > 0;
                }).length;
                const { available: maxNewSpells } = getWizardSpellsToLearnOnLevelUp(character.level, nextLevel, nonCantripCount);
                return newSpellsLearned.length <= maxNewSpells; // Can proceed with 0 or more (up to max)
            case 'expertise':
                return newExpertiseSkills.length === expertiseCount;
            case 'subclassChoice':
                return allChoiceGroups.every((group, idx) => {
                    const sel = subclassChoiceSelections[idx] || [];
                    return sel.length === group.count;
                });
            case 'magicalSecrets':
                return magicalSecretSpells.length === magicalSecretCount;
            case 'mysticArcanum':
                return mysticArcanumSpell !== '';
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
        }

        // ─── Apply subclass always-prepared spells at EVERY level up ───
        if (effectiveSubclass) {
            const subclassData = SUBCLASS_OPTIONS[character.class]?.find((s: any) => s.name === effectiveSubclass);
            if (subclassData?.alwaysPreparedSpells) {
                const spellsToAdd: string[] = [];
                Object.entries(subclassData.alwaysPreparedSpells).forEach(([lvl, spells]) => {
                    if (parseInt(lvl) <= nextLevel) {
                        (spells as string[]).forEach(s => {
                            if (!(updatedChar.preparedSpells || []).includes(s)) {
                                spellsToAdd.push(s);
                            }
                        });
                    }
                });
                if (spellsToAdd.length > 0) {
                    updatedChar.preparedSpells = [...new Set([...(updatedChar.preparedSpells || []), ...spellsToAdd])];
                }
            }
        }

        // ─── Apply subclass feature: Iron Mind (Gloom Stalker level 7) ───
        if (effectiveSubclass === 'Gloom Stalker' && nextLevel >= 7) {
            if (!updatedChar.extraSavingThrows) updatedChar.extraSavingThrows = [];
            const baseSaves = CLASS_SAVING_THROWS[character.class] || [];
            // Iron Mind: Proficiency in Wisdom saves, or Intelligence/Charisma if already have Wisdom proficiency
            const alreadyHasWis = baseSaves.includes('WIS') || (character.feats || []).some(f => f.includes('Resiliente') && f.includes('WIS'));
            const saveToAdd: Ability = alreadyHasWis ? 'INT' : 'WIS';
            if (!updatedChar.extraSavingThrows.includes(saveToAdd)) {
                updatedChar.extraSavingThrows = [...updatedChar.extraSavingThrows, saveToAdd];
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

        // MONK & PUGILIST: Ki/Moxie points equal level
        if (character.class === 'Monk' || character.class === 'Pugilist') {
            updatedChar.focus = { current: nextLevel, max: nextLevel };
            updatedChar.kiMax = nextLevel;
        }
        if (character.class === 'Monk') {
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
            // Magical Cunning: 1 use per long rest (recover half slots rounded-radius-sm up on short rest)
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

        // WIZARD: Arcane Recovery (Lv2+), Spell Mastery (Lv18), Signature Spells (Lv20), Wave 5: Spellbook Learning
        if (character.class === 'Wizard') {
            // Arcane Recovery: Can recover spell slots on short rest (level/2 rounded-radius-sm up)
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
            // Wave 5: Learn new spells for spellbook
            if (needsWizardSpellLearning && newSpellsLearned.length > 0) {
                const currentSpellbook = updatedChar.wizard?.spellbook || [];
                updatedChar.wizard = {
                    ...updatedChar.wizard,
                    spellbook: [...new Set([...currentSpellbook, ...newSpellsLearned])]
                };
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

        // ─── Apply Expertise (Rogue L6, Bard L2/L9, Ranger L9) ───
        if (needsExpertise && newExpertiseSkills.length > 0) {
            updatedChar.expertise = [...new Set([...(updatedChar.expertise || []), ...newExpertiseSkills])];
        }

        // ─── Apply Subclass Choices (skills, languages, etc.) ───
        if (needsSubclassChoice && subclassChoiceSelections.length > 0) {
            subclassChoiceSelections.forEach((selections, idx) => {
                const group = allChoiceGroups[idx];
                if (!group || selections.length === 0) return;

                // Add skill proficiencies
                updatedChar.skills = [...new Set([...(updatedChar.skills || []), ...selections])];

                // Also grant Expertise if specified
                if (group.alsoExpertise) {
                    updatedChar.expertise = [...new Set([...(updatedChar.expertise || []), ...selections])];
                }

                // Add languages (not tracked in skills)
                if (group.icon === 'language') {
                    updatedChar.languages = [...new Set([...(updatedChar.languages || []), ...selections])];
                }
            });
        }

        // ─── Apply Magical Secrets (Bard L10) ───
        if (needsMagicalSecrets && magicalSecretSpells.length > 0) {
            updatedChar.magicalSecrets = [
                ...new Set([...(character.magicalSecrets || []), ...magicalSecretSpells])
            ];
            // Also add to prepared spells so they're usable
            updatedChar.preparedSpells = [
                ...new Set([...(updatedChar.preparedSpells || []), ...magicalSecretSpells])
            ];
        }

        // ─── Apply Mystic Arcanum (Warlock L11, 13, 15, 17) ───
        if (needsMysticArcanum && mysticArcanumSpell) {
            updatedChar.mysticArcanum = {
                ...(character.mysticArcanum || {}),
                ...updatedChar.mysticArcanum,
                [nextLevel]: mysticArcanumSpell,
            };
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
            case 'expertise':
                return (
                    <ExpertiseStep
                        character={character}
                        expertiseCount={expertiseCount}
                        selectedSkills={newExpertiseSkills}
                        onSkillsChange={setNewExpertiseSkills}
                    />
                );
            case 'subclassChoice':
                return (
                    <SubclassChoiceStep
                        character={character}
                        choices={allChoiceGroups}
                        selections={subclassChoiceSelections}
                        onSelectionsChange={setSubclassChoiceSelections}
                    />
                );
            case 'magicalSecrets':
                return (
                    <MagicalSecretsStep
                        character={character}
                        title="Magical Secrets"
                        spellCount={magicalSecretCount}
                        maxSpellLevel={5}
                        featureName="Magical Secrets"
                        selectedSpells={magicalSecretSpells}
                        onSpellsChange={setMagicalSecretSpells}
                    />
                );
            case 'mysticArcanum':
                return (
                    <MagicalSecretsStep
                        character={character}
                        title={`Mystic Arcanum (Level ${mysticArcanumMaxLevel})`}
                        spellCount={1}
                        maxSpellLevel={mysticArcanumMaxLevel}
                        featureName="Mystic Arcanum"
                        selectedSpells={mysticArcanumSpell ? [mysticArcanumSpell] : []}
                        onSpellsChange={(spells) => setMysticArcanumSpell(spells[0] || '')}
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
            case 'wizardSpellbook':
                return (
                    <WizardSpellbookStep
                        character={character}
                        currentLevel={character.level}
                        nextLevel={nextLevel}
                        newSpellsLearned={newSpellsLearned}
                        onSpellsChange={setNewSpellsLearned}
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
                            deftExplorerLanguages,
                            newExpertiseSkills,
                            subclassChoiceSelections,
                            allChoiceGroups,
                            magicalSecretSpells,
                            mysticArcanumSpell,
                        }}
                        featureGains={featureGains}
                        onConfirm={confirmLevelUp}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 dark:bg-black/60 flex items-end sm:items-center justify-center animate-fadeIn backdrop-blur-sm">
            <div className="w-full sm:max-w-lg bg-white dark:bg-[#0f1525] rounded-t-3xl sm:rounded-radius-2xl shadow-2xl max-h-[95vh] sm:max-h-[85vh] flex flex-col animate-slideUp overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/10 shrink-0">
                    <button
                        onClick={onCancel}
                        className="w-10 h-10 flex items-center justify-center rounded-radius-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
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
                            className={`h-1 rounded-radius-pill transition-all duration-motion-base ${
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
                        className={`py-3 rounded-radius-lg font-bold text-sm transition-all ${
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
                        className={`py-3 rounded-radius-lg font-bold text-sm text-white shadow-elev-modal transition-all active:scale-[0.98] ${
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
