import React, { useState, useMemo, useCallback } from 'react';
import { Character } from '../../../types';
import {
  SPELL_DETAILS,
  SPELL_LIST_BY_CLASS,
  ARCANE_SPELLS,
  getWizardAvailableSpells,
  getWizardSpellsBySchool
} from '../../../Data/spells';
import { useDialog } from '../../../src/contexts/DialogContext';
import {
  getWizardMaxPreparedSpells,
  getWizardSpellbookByLevel,
  getWizardMaxSpellLevel,
  getWizardMaxCantrips,
  validateWizardPreparedSpells,
  getFinalStats,
  formatModifier,
  getSpellSummary,
  SCHOOL_THEMES
} from '../../../utils/sheetUtils';

interface WizardGrimoireManagerProps {
  character: Character;
  onUpdate: (char: Character) => void;
  onClose: () => void;
}

type GrimoireTab = 'learn' | 'prepare' | 'rituals';

interface SpellInfo {
  name: string;
  level: number;
  school?: string;
  isRitual?: boolean;
}

const WizardGrimoireManager: React.FC<WizardGrimoireManagerProps> = ({
  character,
  onUpdate,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<GrimoireTab>('learn');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [selectedSpellDetail, setSelectedSpellDetail] = useState<string | null>(null);
  const [cantripToChange, setCantripToChange] = useState<string | null>(null);
  const dialog = useDialog();

  // Wizard data (with safe fallbacks)
  const spellbook = useMemo(() => character.wizard?.spellbook || [], [character.wizard?.spellbook]);
  const prepared = useMemo(() => character.preparedSpells || [], [character.preparedSpells]);
  const maxPrepared = useMemo(() => getWizardMaxPreparedSpells(character), [character]);
  
  // Count only non-cantrip prepared spells
  const preparedNonCantripCount = useMemo(() => {
    return prepared.filter(s => {
      const detail = SPELL_DETAILS[s];
      return detail && detail.level > 0;
    }).length;
  }, [prepared]);
  const maxSpellbook = useMemo(() => getWizardSpellbookByLevel(character.level), [character.level]);
  const maxSpellLevel = useMemo(() => getWizardMaxSpellLevel(character.level), [character.level]);
  const maxCantrips = useMemo(() => getWizardMaxCantrips(character.level), [character.level]);
  
  // Count cantrips separately
  const cantripCount = useMemo(() => {
    return spellbook.filter(spellName => {
      const detail = SPELL_DETAILS[spellName];
      return detail && detail.level === 0;
    }).length;
  }, [spellbook]);

  // Count non-cantrip spells
  const nonCantripCount = useMemo(() => {
    return spellbook.filter(spellName => {
      const detail = SPELL_DETAILS[spellName];
      return detail && detail.level > 0;
    }).length;
  }, [spellbook]);
  
  // Available spells for learning
  const availableToLearn = useMemo(() => {
    return getWizardAvailableSpells(undefined, spellbook, maxSpellLevel);
  }, [spellbook, maxSpellLevel]);

  // Filter for display
  const filteredSpells = useMemo(() => {
    let spells: string[] = [];

    if (activeTab === 'learn') {
      spells = availableToLearn;
    } else if (activeTab === 'prepare') {
      // Show all spells from spellbook including cantrips (Wizards prepare during long rest)
      spells = spellbook.filter(s => {
        const detail = SPELL_DETAILS[s];
        return detail && detail.level >= 0; // Include cantrips and spells
      });
    } else if (activeTab === 'rituals') {
      spells = spellbook.filter(s => {
        const detail = SPELL_DETAILS[s];
        return detail && detail.ritual === true;
      });
    }

    // Apply filters
    if (selectedLevel > 0) {
      spells = spells.filter(s => {
        const detail = SPELL_DETAILS[s];
        return detail && detail.level === selectedLevel;
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      spells = spells.filter(s => s.toLowerCase().includes(query));
    }

    return spells;
  }, [activeTab, spellbook, availableToLearn, selectedLevel, searchQuery]);

  // Get available spell levels for current tab
  const availableLevels = useMemo(() => {
    let spells: string[] = [];

    if (activeTab === 'learn') {
      spells = availableToLearn;
    } else if (activeTab === 'prepare') {
      // Show all spell levels including cantrips (Wizards prepare during long rest)
      spells = spellbook.filter(s => {
        const detail = SPELL_DETAILS[s];
        return detail && detail.level >= 0;
      });
    } else if (activeTab === 'rituals') {
      spells = spellbook.filter(s => {
        const detail = SPELL_DETAILS[s];
        return detail && detail.ritual === true;
      });
    }

    // Get unique levels present in current spells
    const levels = new Set<number>();
    spells.forEach(s => {
      const detail = SPELL_DETAILS[s];
      if (detail) {
        levels.add(detail.level);
      }
    });

    return Array.from(levels).sort((a, b) => a - b);
  }, [activeTab, spellbook, availableToLearn]);

  // Handle learn spell
  const handleLearnSpell = useCallback(async (spellName: string) => {
    try {
      if (!spellName) {
        return;
      }

      if (spellbook.includes(spellName)) {
        await dialog.showAlert(`${spellName} is already in your spellbook.`);
        return;
      }

      const detail = SPELL_DETAILS[spellName];
      const isCantrip = detail && detail.level === 0;

      // Check cantrip limit
      if (isCantrip && cantripCount >= maxCantrips) {
        await dialog.showAlert(`You know the maximum number of cantrips (${maxCantrips}). You must forget a cantrip to learn a new one.`);
        return;
      }

      // Check spell limit (only for non-cantrip spells)
      if (!isCantrip && nonCantripCount >= maxSpellbook) {
        await dialog.showAlert(`Your spellbook is full (${maxSpellbook} spells). You must forget a spell to learn a new one.`);
        return;
      }

      const newSpellbook = [...spellbook, spellName];
      
      // Ensure wizard object exists
      const updatedCharacter = {
        ...character,
        wizard: {
          ...(character.wizard || { spellbook: [] }),
          spellbook: newSpellbook
        }
      };
      onUpdate(updatedCharacter);
    } catch (error) {
      await dialog.showAlert('Failed to learn spell. Check console for details.');
    }
  }, [dialog, character, spellbook, maxSpellbook, cantripCount, maxCantrips, onUpdate]);

  // Handle remove spell from spellbook
  const handleRemoveSpell = useCallback(async (spellName: string) => {
    if (!(await dialog.showConfirm(`Remove ${spellName} from your spellbook?`))) {
      return;
    }

    const newSpellbook = spellbook.filter(s => s !== spellName);
    const newPrepared = prepared.filter(s => s !== spellName); // Also remove from prepared if it was there

    onUpdate({
      ...character,
      wizard: {
        ...character.wizard,
        spellbook: newSpellbook
      },
      preparedSpells: newPrepared
    });
  }, [dialog, character, spellbook, prepared, onUpdate]);

  // Handle prepare/unprepare spell
  const handleTogglePrepare = useCallback(async (spellName: string) => {
    const newPrepared = prepared.includes(spellName)
      ? prepared.filter(s => s !== spellName)
      : [...prepared, spellName];

    const validation = validateWizardPreparedSpells(character, newPrepared);
    if (!validation.valid) {
      await dialog.showAlert(validation.reason || 'Invalid prepared spells selection');
      return;
    }

    onUpdate({
      ...character,
      preparedSpells: newPrepared
    });
  }, [dialog, character, prepared, onUpdate]);

  // Handle change cantrip (Arcane Formulae at Level 3+)
  const handleChangeCantrip = useCallback((oldCantrip: string, newCantrip: string) => {
    if (!oldCantrip || !newCantrip) return;
    
    // Replace old cantrip with new one in spellbook
    const newSpellbook = spellbook.map(s => s === oldCantrip ? newCantrip : s);
    
    // If old cantrip was prepared, replace it in prepared list too
    const newPrepared = prepared.map(s => s === oldCantrip ? newCantrip : s);

    onUpdate({
      ...character,
      wizard: {
        ...character.wizard,
        spellbook: newSpellbook
      },
      preparedSpells: newPrepared
    });
    
    setCantripToChange(null);
  }, [character, spellbook, prepared, onUpdate]);

  // Helper: Get school color for spell card
  const getSchoolColor = (school?: string) => {
    const schoolMap: Record<string, { light: string; dark: string; border: string }> = {
      'Abjuration': { light: 'bg-red-50', dark: 'dark:bg-red-900/20', border: 'border-red-400/40' },
      'Conjuration': { light: 'bg-purple-50', dark: 'dark:bg-purple-900/20', border: 'border-purple-400/40' },
      'Divination': { light: 'bg-indigo-50', dark: 'dark:bg-indigo-900/20', border: 'border-indigo-400/40' },
      'Enchantment': { light: 'bg-pink-50', dark: 'dark:bg-pink-900/20', border: 'border-pink-400/40' },
      'Evocation': { light: 'bg-blue-50', dark: 'dark:bg-blue-900/20', border: 'border-blue-400/40' },
      'Illusion': { light: 'bg-cyan-50', dark: 'dark:bg-cyan-900/20', border: 'border-cyan-400/40' },
      'Necromancy': { light: 'bg-slate-50', dark: 'dark:bg-slate-800/40', border: 'border-slate-400/40' },
      'Transmutation': { light: 'bg-emerald-50', dark: 'dark:bg-emerald-900/20', border: 'border-emerald-400/40' },
    };
    return schoolMap[school || 'Divination'] || schoolMap['Divination'];
  };

  // Spell display as card
  const renderSpellRow = (spellName: string) => {
    const detail = SPELL_DETAILS[spellName];
    if (!detail) return null;

    const isLearned = spellbook.includes(spellName);
    const isPrepared = prepared.includes(spellName);
    const isInBook = spellbook.includes(spellName);
    const schoolColor = getSchoolColor(detail.school);

    return (
      <div
        key={spellName}
        onClick={() => setSelectedSpellDetail(spellName)}
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-4 rounded-radius-md sm:rounded-radius-lg border-2 ${schoolColor.light} ${schoolColor.dark} ${schoolColor.border} 
                     hover:shadow-md transition-all duration-200 backdrop-blur-xs cursor-pointer hover:scale-[1.01]`}
      >
        {/* School Icon & Spell Info */}
        <div className="flex items-start gap-3 sm:gap-3 flex-1 min-w-0">
          <span className="material-symbols-outlined text-lg sm:text-lg flex-shrink-0 mt-0.5 text-slate-600 dark:text-slate-300">
            {detail.level === 0 ? 'stars' : 'auto_awesome'}
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-base sm:text-base text-slate-900 dark:text-white leading-tight">{spellName}</div>
            <div className="text-xs sm:text-xs text-slate-600 dark:text-slate-400 mt-1 sm:mt-1">
              {detail.level === 0 ? 'Cantrip' : `Lvl ${detail.level}`} • {detail.school || 'Unknown'} {detail.ritual ? '• Ritual' : ''}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-2 flex-shrink-0 w-full sm:w-auto">
          {activeTab === 'learn' && (
            <button
              onClick={() => handleLearnSpell(spellName)}
              className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-xs font-bold rounded-radius-md sm:rounded-radius-md transition-all duration-200 active:scale-95 whitespace-nowrap ${
                isLearned || (detail.level > 0 && nonCantripCount >= maxSpellbook) || (detail.level === 0 && cantripCount >= maxCantrips)
                  ? 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-elev-modal'
              }`}
              disabled={isLearned || (detail.level > 0 && nonCantripCount >= maxSpellbook) || (detail.level === 0 && cantripCount >= maxCantrips)}
              title={
                isLearned 
                  ? 'Already learned' 
                  : detail.level === 0 && cantripCount >= maxCantrips
                  ? `Cantrip limit reached (${maxCantrips})`
                  : detail.level > 0 && nonCantripCount >= maxSpellbook
                  ? 'Spellbook full' 
                  : 'Learn spell'
              }
            >
              <span className="hidden sm:inline">📖 Learn</span>
              <span className="sm:hidden">Learn</span>
            </button>
          )}

          {(activeTab === 'prepare' || activeTab === 'rituals') && (
            <>
              <button
                onClick={() => handleTogglePrepare(spellName)}
                className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-xs font-bold rounded-radius-md sm:rounded-radius-md transition-all duration-200 active:scale-95 whitespace-nowrap ${
                  isPrepared
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md hover:shadow-elev-modal'
                    : !isInBook
                    ? 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'
                    : 'bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 transition-all'
                }`}
                disabled={!isInBook}
                title={!isInBook ? 'Learn spell first' : isPrepared ? 'Prepared' : 'Prepare spell'}
              >
                {isPrepared ? '✓' : '✨'}
                <span className="hidden sm:inline">{isPrepared ? ' Ready' : ' Prepare'}</span>
              </button>
              {detail.level === 0 && character.level >= 3 ? (
                <button
                  onClick={() => setCantripToChange(spellName)}
                  className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-xs font-bold rounded-radius-md sm:rounded-radius-md transition-all duration-200 active:scale-95 whitespace-nowrap bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md hover:shadow-elev-modal"
                  title="Change this cantrip to another (Arcane Formulae)"
                >
                  <span className="hidden sm:inline">🔄 Change</span>
                  <span className="sm:hidden">Chg</span>
                </button>
              ) : (
                <button
                  onClick={() => handleRemoveSpell(spellName)}
                  className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-xs font-bold rounded-radius-md sm:rounded-radius-md transition-all duration-200 active:scale-95 whitespace-nowrap bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-elev-modal"
                  title="Remove spell from spellbook"
                >
                  <span className="hidden sm:inline">🗑️ Delete</span>
                  <span className="sm:hidden">Del</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/80 dark:bg-black/60 flex items-end sm:items-center justify-center animate-fadeIn backdrop-blur-sm">
      <div className="w-[calc(100%-1rem)] sm:w-full sm:max-w-2xl bg-white dark:bg-[#0f1525] rounded-t-3xl sm:rounded-radius-2xl shadow-2xl max-h-[96vh] sm:max-h-[88vh] flex flex-col animate-slideUp overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-3.5 sm:px-4 sm:py-4 border-b border-slate-200 dark:border-white/10 shrink-0 bg-white dark:bg-[#0f1525]">
          <button
            onClick={onClose}
            className="w-10 h-10 sm:w-10 sm:h-10 flex items-center justify-center rounded-radius-md sm:rounded-radius-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-lg sm:text-lg text-slate-600 dark:text-slate-300">close</span>
          </button>
          <div className="flex flex-col items-center flex-1 px-2 sm:px-4">
            <h2 className="text-sm sm:text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">Wizard Spellbook</h2>
            <div className="text-xs sm:text-xs text-slate-500 dark:text-slate-400 mt-1 sm:mt-1.5 space-y-1">
              <div>
                <span className="hidden sm:inline">Cantrips: {cantripCount}/{maxCantrips} | Spells: {nonCantripCount}/{maxSpellbook} | Prepared: {preparedNonCantripCount}/{maxPrepared}</span>
                <span className="sm:hidden text-[9px]">{cantripCount}/{maxCantrips} • {nonCantripCount}/{maxSpellbook} • {preparedNonCantripCount}/{maxPrepared}</span>
              </div>
            </div>
          </div>
          <div className="w-9 sm:w-10 flex-shrink-0"></div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-[#0f1525]">
          {(['learn', 'prepare', 'rituals'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedLevel(0);
              }}
              className={`flex-1 py-3.5 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest transition-all ${
                activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-white/5'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab === 'learn' && '📚 Learn'}
              {tab === 'prepare' && '✨ Prep'}
              {tab === 'rituals' && '🔮 Rit'}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto grimoire-scroll">
          {/* Filters */}
          <div className="border-b border-slate-200 dark:border-white/10 p-4 sm:p-4 bg-white dark:bg-[#0f1525] space-y-3 sm:space-y-3 sticky top-0 z-10">
            <input
              type="text"
              placeholder="🔍 Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 sm:px-4 py-3 sm:py-3 bg-slate-50 dark:bg-white/10 text-slate-900 dark:text-white text-sm sm:text-sm rounded-radius-md border-2 border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-slate-500 dark:placeholder-slate-400"
            />

            {activeTab !== 'rituals' && (
              <div className="flex gap-2 sm:gap-2 overflow-x-auto pb-2 sm:pb-2">
                {availableLevels.map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level === selectedLevel ? 0 : level)}
                    className={`px-3.5 sm:px-4 py-2.5 sm:py-2.5 text-xs sm:text-xs font-bold rounded-radius-md sm:rounded-radius-md whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                      selectedLevel === level
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-elev-modal shadow-blue-500/30'
                        : 'bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {level === 0 ? 'All' : `L${level}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Spell List */}
          {filteredSpells.length === 0 ? (
            <div className="p-4 sm:p-8 text-center text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              <span className="material-symbols-outlined text-3xl sm:text-4xl text-slate-300 dark:text-slate-600 block mb-2 sm:mb-3">spell_check</span>
              <div className="font-medium">
                {activeTab === 'learn' && 'All available spells learned!'}
                {activeTab === 'prepare' && 'No spells to prepare.'}
                {activeTab === 'rituals' && 'No ritual spells available.'}
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-3 p-4 sm:p-4">
              {filteredSpells.map(renderSpellRow)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-white/10 p-4 sm:p-4 bg-white dark:bg-white/5 shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 sm:px-4 py-3 sm:py-3 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-white/10 dark:to-white/20 hover:from-slate-300 hover:to-slate-400 dark:hover:from-white/20 dark:hover:to-white/30 text-slate-900 dark:text-white rounded-radius-md sm:rounded-radius-lg text-sm sm:text-sm font-bold uppercase tracking-widest transition-all active:scale-[0.98] duration-200"
          >
            Close
          </button>
        </div>
      </div>

      {/* Spell Detail Modal */}
      {selectedSpellDetail && (() => {
        const detail = SPELL_DETAILS[selectedSpellDetail];
        if (!detail) return null;

        const isLearned = spellbook.includes(selectedSpellDetail);
        const isPrepared = prepared.includes(selectedSpellDetail);
        const schoolColor = getSchoolColor(detail.school);

        return (
          <div className="fixed inset-0 z-[120] bg-slate-900/80 dark:bg-black/60 flex items-end sm:items-center justify-center animate-fadeIn backdrop-blur-sm">
            <div className="w-full sm:max-w-lg bg-white dark:bg-[#0f1525] rounded-t-3xl sm:rounded-radius-2xl shadow-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col animate-slideUp overflow-hidden">
              {/* Detail Modal Header */}
              <div className={`px-4 py-4 border-b border-slate-200 dark:border-white/10 shrink-0 ${schoolColor.light} ${schoolColor.dark}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">{selectedSpellDetail}</h2>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                      {detail.level === 0 ? 'Cantrip' : `Level ${detail.level}`} • {detail.school}
                      {detail.ritual ? ' • Ritual' : ''}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSpellDetail(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-radius-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">close</span>
                  </button>
                </div>
              </div>

              {/* Detail Modal Content */}
              <div className="flex-1 overflow-y-auto grimoire-scroll space-y-4 p-4">
                {/* Casting Time */}
                <div className="bg-slate-50 dark:bg-white/5 rounded-radius-md p-3 border border-slate-200 dark:border-white/10">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">⏱️ Casting Time</div>
                  <div className="text-sm text-slate-900 dark:text-white mt-1">{detail.castingTime}</div>
                </div>

                {/* Range */}
                <div className="bg-slate-50 dark:bg-white/5 rounded-radius-md p-3 border border-slate-200 dark:border-white/10">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">📍 Range</div>
                  <div className="text-sm text-slate-900 dark:text-white mt-1">{detail.range}</div>
                </div>

                {/* Components */}
                <div className="bg-slate-50 dark:bg-white/5 rounded-radius-md p-3 border border-slate-200 dark:border-white/10">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">🎭 Components</div>
                  <div className="text-sm text-slate-900 dark:text-white mt-1">{detail.components}</div>
                </div>

                {/* Duration */}
                <div className="bg-slate-50 dark:bg-white/5 rounded-radius-md p-3 border border-slate-200 dark:border-white/10">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">⏳ Duration</div>
                  <div className="text-sm text-slate-900 dark:text-white mt-1">{detail.duration}</div>
                </div>

                {/* Description */}
                <div className="bg-slate-50 dark:bg-white/5 rounded-radius-md p-3 border border-slate-200 dark:border-white/10">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-2">📜 Description</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{detail.description}</div>
                </div>
              </div>

              {/* Detail Modal Actions */}
              <div className="border-t border-slate-200 dark:border-white/10 p-4 bg-white dark:bg-white/5 shrink-0 space-y-2">
                {activeTab === 'learn' && !isLearned && (
                  <button
                    type="button"
                    onClick={() => {
                      handleLearnSpell(selectedSpellDetail!);
                      setSelectedSpellDetail(null);
                    }}
                    disabled={spellbook.length >= maxSpellbook || (detail.level === 0 && cantripCount >= maxCantrips)}
                    className={`w-full px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-radius-lg transition-all active:scale-[0.98] ${
                      spellbook.length >= maxSpellbook || (detail.level === 0 && cantripCount >= maxCantrips)
                        ? 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-elev-modal'
                    }`}
                    title={
                      detail.level === 0 && cantripCount >= maxCantrips
                        ? `Cantrip limit reached (${maxCantrips})`
                        : spellbook.length >= maxSpellbook
                        ? 'Spellbook full'
                        : 'Learn spell'
                    }
                  >
                    📖 Learn Spell
                  </button>
                )}

                {(activeTab === 'prepare' || activeTab === 'rituals') && isLearned && (
                  <>
                    <button
                      onClick={() => {
                        handleTogglePrepare(selectedSpellDetail);
                        setSelectedSpellDetail(null);
                      }}
                      className={`w-full px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-radius-lg transition-all active:scale-[0.98] ${
                        isPrepared
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md hover:shadow-elev-modal'
                          : 'bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {isPrepared ? '✓ Prepared' : '✨ Prepare Spell'}
                    </button>
                    <button
                      onClick={() => {
                        handleRemoveSpell(selectedSpellDetail);
                        setSelectedSpellDetail(null);
                      }}
                      className="w-full px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-radius-lg transition-all active:scale-[0.98] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-elev-modal"
                    >
                      🗑️ Delete Spell
                    </button>
                  </>
                )}

                <button
                  onClick={() => setSelectedSpellDetail(null)}
                  className="w-full px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-radius-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Change Cantrip Modal */}
      {cantripToChange && (() => {
        const availableCantrips = availableToLearn.filter(s => {
          const detail = SPELL_DETAILS[s];
          return detail && detail.level === 0;
        });

        return (
          <div className="fixed inset-0 z-[130] bg-slate-900/80 dark:bg-black/60 flex items-end sm:items-center justify-center animate-fadeIn backdrop-blur-sm">
            <div className="w-full sm:max-w-lg bg-white dark:bg-[#0f1525] rounded-t-3xl sm:rounded-radius-2xl shadow-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col animate-slideUp overflow-hidden">
              {/* Header */}
              <div className="px-4 py-4 border-b border-slate-200 dark:border-white/10 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Change Cantrip</h2>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Replace <span className="font-bold">{cantripToChange}</span> with another cantrip
                    </div>
                  </div>
                  <button
                    onClick={() => setCantripToChange(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-radius-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">close</span>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto grimoire-scroll p-3 sm:p-4 space-y-2 sm:space-y-3">
                {availableCantrips.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
                    <span className="material-symbols-outlined text-2xl block mb-2 text-slate-300 dark:text-slate-600">search_off</span>
                    No cantrips available to learn
                  </div>
                ) : (
                  availableCantrips.map(cantripName => {
                    const detail = SPELL_DETAILS[cantripName];
                    if (!detail) return null;

                    return (
                      <button
                        key={cantripName}
                        onClick={() => {
                          handleChangeCantrip(cantripToChange, cantripName);
                        }}
                        className="w-full flex items-center justify-between gap-3 p-3 sm:p-4 rounded-radius-md sm:rounded-radius-lg bg-slate-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-2 border-slate-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">{cantripName}</div>
                          <div className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                            {detail.school || 'Unknown'} {detail.ritual ? '• Ritual' : ''}
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-base sm:text-lg text-blue-600 dark:text-blue-400 flex-shrink-0">check_circle</span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 dark:border-white/10 p-3 sm:p-4 bg-white dark:bg-white/5">
                <button
                  onClick={() => setCantripToChange(null)}
                  className="w-full px-4 py-2 sm:py-3 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 rounded-radius-md sm:rounded-radius-lg text-xs sm:text-sm font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default WizardGrimoireManager;
