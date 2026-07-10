import React from 'react';
import { Character, Ability } from '../../../../../types';
import { UI } from '../../../../../constants/ui';
import { type Feat } from '../../../../../Data/feats/index';

interface FeatureDisplay {
  name: string;
  description?: string;
  type: 'class' | 'subclass' | 'spell' | 'metamagic';
}

interface SubclassChoiceGroup {
    label: string;
    options: string[];
    count: number;
    alsoExpertise?: boolean;
    icon?: string;
}

interface SummaryStepProps {
    character: Character;
    nextLevel: number;
    pending: {
        hpGain: number;
        subclass: string;
        selectedSkills: string[];
        preparedSpells: string[];
        asiType: 'stat' | 'feat';
        stat1: string;
        stat2: string;
        feat: string;
        featStat: Ability | null;
        selectedFeat?: Feat;
        deftExplorerSkill?: string;
        deftExplorerLanguages?: string[];
        newExpertiseSkills?: string[];
        subclassChoiceSelections?: string[][];
        allChoiceGroups?: SubclassChoiceGroup[];
        magicalSecretSpells?: string[];
        mysticArcanumSpell?: string;
    };
    featureGains?: FeatureDisplay[];
    onConfirm: () => void;
}

const SPARKLE_ICONS: Record<string, string> = {
  class: 'auto_awesome',
  subclass: 'stars',
  spell: 'auto_awesome_mosaic',
  metamagic: 'auto_fix_normal',
};

const SPARKLE_COLORS: Record<string, string> = {
  class: 'text-blue-500',
  subclass: 'text-purple-500',
  spell: 'text-sky-400',
  metamagic: 'text-fuchsia-500',
};

const SummaryStep: React.FC<SummaryStepProps> = ({ character, nextLevel, pending, featureGains, onConfirm }) => {
    const t = UI;

    // Filter out items already shown in other sections
    const displayFeatures = (featureGains || []).filter(f => {
      if (f.type === 'class' && pending.subclass && f.name.toLowerCase().includes('subclass')) return false;
      return true;
    });

    return (
        <div className="flex flex-col h-full p-5">
            <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-radius-xl bg-gradient-to-br from-green-400 to-emerald-600 text-white flex items-center justify-center mx-auto mb-4 shadow-xl animate-bounce">
                    <span className="material-symbols-outlined text-5xl">emoji_events</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {t.levelUpComplete || 'Level Up Complete!'}
                </h2>
                <p className="text-xl text-green-500 font-bold mt-2">
                    Level {nextLevel}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                {/* Core changes */}
                <div className="bg-slate-50 dark:bg-white/5 rounded-radius-xl p-5 space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
                        <span className="font-bold text-base text-slate-900 dark:text-white">
                            HP: +{pending.hpGain} (+ automatic bonuses)
                        </span>
                    </div>
                    {pending.subclass && (
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-purple-500 text-xl">check_circle</span>
                            <span className="font-bold text-base text-slate-900 dark:text-white">
                                {t.subclass || 'Subclass'}: {pending.subclass}
                            </span>
                        </div>
                    )}
                    {pending.selectedSkills.length > 0 && (
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-blue-500 text-xl">check_circle</span>
                            <span className="font-bold text-base text-slate-900 dark:text-white">
                                {t.skills || 'Skills'}: {pending.selectedSkills.join(', ')}
                            </span>
                        </div>
                    )}
                    {pending.deftExplorerSkill && (
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-indigo-500 text-xl">check_circle</span>
                            <div className="flex-1">
                                <div className="font-bold text-base text-slate-900 dark:text-white">
                                    Deft Explorer
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                    • Expertise: {pending.deftExplorerSkill}
                                    <br />• Languages: {pending.deftExplorerLanguages?.join(', ')}
                                </div>
                            </div>
                        </div>
                    )}
                    {pending.newExpertiseSkills && pending.newExpertiseSkills.length > 0 && (
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-amber-500 text-xl">check_circle</span>
                            <div className="flex-1">
                                <div className="font-bold text-base text-slate-900 dark:text-white">
                                    Expertise
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                    {pending.newExpertiseSkills.join(', ')}
                                </div>
                            </div>
                        </div>
                    )}
                    {pending.subclassChoiceSelections && pending.subclassChoiceSelections.length > 0 && pending.allChoiceGroups && (() => {
                        const { subclassChoiceSelections: sel, allChoiceGroups: groups } = pending;
                        return (
                            <div className="flex flex-col gap-2">
                                {sel.map((selections, idx) => {
                                    const group = groups[idx];
                                    if (!group || selections.length === 0) return null;
                                    return (
                                        <div key={idx} className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-purple-500 text-xl">check_circle</span>
                                            <div className="flex-1">
                                                <div className="font-bold text-sm text-slate-900 dark:text-white">
                                                    {group.label}
                                                </div>
                                                <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                                                    {selections.join(', ')}
                                                    {group.alsoExpertise && (
                                                        <span className="ml-1.5 text-[9px] font-black uppercase tracking-widest text-amber-500 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-md">
                                                            Expertise
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()}
                    {pending.magicalSecretSpells && pending.magicalSecretSpells.length > 0 && (
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-fuchsia-500 text-xl">check_circle</span>
                            <div className="flex-1">
                                <div className="font-bold text-base text-slate-900 dark:text-white">
                                    Magical Secrets
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                    {pending.magicalSecretSpells.join(', ')}
                                </div>
                            </div>
                        </div>
                    )}
                    {pending.mysticArcanumSpell && (
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-fuchsia-500 text-xl">check_circle</span>
                            <div className="flex-1">
                                <div className="font-bold text-base text-slate-900 dark:text-white">
                                    Mystic Arcanum
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                    {pending.mysticArcanumSpell}
                                </div>
                            </div>
                        </div>
                    )}
                    {pending.asiType === 'stat' && (
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-amber-500 text-xl">check_circle</span>
                            <span className="font-bold text-base text-slate-900 dark:text-white">
                                +1 {pending.stat1}, +1 {pending.stat2}
                            </span>
                        </div>
                    )}
                    {pending.asiType === 'feat' && pending.feat && (
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-amber-500 text-xl">check_circle</span>
                            <span className="font-bold text-base text-slate-900 dark:text-white">
                                {t.feat || 'Feat'}: {pending.feat}
                                {pending.featStat && ` (+1 ${pending.featStat})`}
                            </span>
                        </div>
                    )}
                </div>

                {/* Features gained section */}
                {displayFeatures.length > 0 && (
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-white/5 dark:to-blue-900/10 rounded-radius-xl p-5 border border-blue-100/50 dark:border-blue-800/20">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      NEW FEATURES & ABILITIES
                      <span className="flex-1 h-px bg-slate-200 dark:bg-white/5 ml-1"></span>
                    </h3>
                    <div className="space-y-2.5">
                      {displayFeatures.map((f, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <span className={`material-symbols-outlined text-lg mt-0.5 ${SPARKLE_COLORS[f.type] || 'text-blue-500'}`}>
                            {SPARKLE_ICONS[f.type] || 'auto_awesome'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {f.name}
                              {f.type === 'spell' && (
                                <span className="ml-1.5 text-[9px] font-black uppercase tracking-widest text-sky-500 dark:text-sky-400 bg-sky-100/50 dark:bg-sky-900/20 px-1.5 py-0.5 rounded-md">
                                  Spell
                                </span>
                              )}
                              {f.type === 'metamagic' && (
                                <span className="ml-1.5 text-[9px] font-black uppercase tracking-widest text-fuchsia-500 dark:text-fuchsia-400 bg-fuchsia-100/50 dark:bg-fuchsia-900/20 px-1.5 py-0.5 rounded-md">
                                  Metamagic
                                </span>
                              )}
                              {f.type === 'subclass' && (
                                <span className="ml-1.5 text-[9px] font-black uppercase tracking-widest text-purple-500 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-900/20 px-1.5 py-0.5 rounded-md">
                                  Subclass
                                </span>
                              )}
                            </span>
                            {f.description && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5 line-clamp-2">
                                {f.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <button
                onClick={onConfirm}
                className="w-full py-4 mt-5 rounded-radius-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm shadow-elev-modal hover:shadow-xl hover:from-green-600 hover:to-emerald-700 transition-all active:scale-[0.98]"
            >
                {t.viewCharacterSheet || 'View Character Sheet'}
            </button>
        </div>
    );
};

export default SummaryStep;
