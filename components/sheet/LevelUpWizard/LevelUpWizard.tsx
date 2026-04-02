import React, { useState } from 'react';
import { Character, Ability } from '../../../types';
import { CLASS_PROGRESSION, SUBCLASS_OPTIONS, HIT_DIE, CLASS_SKILL_DATA } from '../../../Data/characterOptions';
import { SKILL_LIST } from '../../../Data/skills';
import { getFinalStats } from '../../../utils/sheetUtils';
import { useLanguage } from '../../../hooks/useLanguage';
import HPStep from './steps/HPStep';
import SubclassStep from './steps/SubclassStep';
import SkillsStep from './steps/SkillsStep';
import SpellsStep from './steps/SpellsStep';
import ASIFeatStep from './steps/ASIFeatStep';
import SummaryStep from './steps/SummaryStep';

interface LevelUpWizardProps {
    character: Character;
    onComplete: (updatedCharacter: Character) => void;
    onCancel: () => void;
}

const LevelUpWizard: React.FC<LevelUpWizardProps> = ({ character, onComplete, onCancel }) => {
    const { t } = useLanguage();
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

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [hpGain, setHpGain] = useState(() => {
        const avgGain = Math.floor(hitDie / 2) + 1;
        const isDraconic = character.subclass === 'Draconic Sorcery';
        const draconicBonus = isDraconic ? 1 : 0;
        const hasDuro = character.feats.some((f: string) => f === 'Duro' || f === 'Tough');
        const duroBonus = hasDuro ? 2 : 0;
        return Math.max(1, avgGain + conMod + draconicBonus + duroBonus);
    });
    const [hpMethod, setHpMethod] = useState<'roll' | 'average'>('average');
    const [rolledValue, setRolledValue] = useState(Math.floor(hitDie / 2) + 1);
    const [extraHp, setExtraHp] = useState(0);
    const [subclass, setSubclass] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [asiType, setAsiType] = useState<'stat' | 'feat'>('stat');
    const [stat1, setStat1] = useState<Ability>('STR');
    const [stat2, setStat2] = useState<Ability>('DEX');
    const [feat, setFeat] = useState('');
    const [pendingMetamagics, setPendingMetamagics] = useState<string[]>([]);

    const activeSteps: string[] = ['hp'];
    if (needsSubclass) activeSteps.push('subclass');
    if (skillsNeeded > 0) activeSteps.push('skills');
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
            case 'spells':
                return !needsMetamagic || pendingMetamagics.length === metamagicCount;
            case 'asiFeat':
                return asiType === 'stat' ? stat1 !== stat2 : feat !== '';
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
        
        if (needsSubclass && subclass === 'Draconic Sorcery') extraHpTotal += nextLevel;
        if (needsAsi && asiType === 'feat' && (feat === 'Duro' || feat === 'Tough')) {
            extraHpTotal += (nextLevel * 2);
        }

        const updatedChar: Character = {
            ...character,
            level: nextLevel,
            profBonus: newProf,
            hp: {
                ...character.hp,
                max: character.hp.max + hpGain + extraHp + extraHpTotal,
                current: character.hp.current + hpGain + extraHp + extraHpTotal
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
            } else {
                const newStats = { ...updatedChar.stats };
                if (stat1) newStats[stat1] = Math.min((newStats[stat1] || 10) + 1, 20);
                if (stat2 && stat2 !== stat1) newStats[stat2] = Math.min((newStats[stat2] || 10) + 1, 20);
                updatedChar.stats = newStats;
            }
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
        if (updatedChar.class === 'Sorcerer') {
            // Sorcery Points = level (at Lv2+)
            if (nextLevel >= 2) {
                updatedChar.sorceryPoints = { current: nextLevel, max: nextLevel };
            }
            // Innate Sorcery: 2 uses (Lv1+)
            updatedChar.innateSorcery = { current: 2, max: 2 };
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
                        extraHp={extraHp}
                        onHpGainChange={setHpGain}
                        onHpMethodChange={setHpMethod}
                        onRolledValueChange={setRolledValue}
                        onExtraHpChange={setExtraHp}
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
                        onAsiTypeChange={(v) => setAsiType(v)}
                        onStat1Change={(v) => setStat1(v)}
                        onStat2Change={(v) => setStat2(v)}
                        onFeatChange={(v) => setFeat(v)}
                    />
                );
            case 'summary':
                return (
                    <SummaryStep
                        character={character}
                        nextLevel={nextLevel}
                        pending={{
                            hpGain,
                            extraHp,
                            subclass,
                            selectedSkills,
                            preparedSpells: [],
                            asiType,
                            stat1,
                            stat2,
                            feat
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
