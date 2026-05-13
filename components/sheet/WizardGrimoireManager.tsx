import React, { useState, useMemo, useCallback } from 'react';
import { Character } from '../../types';
import {
  SPELL_DETAILS,
  SPELL_LIST_BY_CLASS,
  ARCANE_SPELLS,
  getWizardAvailableSpells,
  getWizardSpellsBySchool
} from '../../Data/spells';
import {
  getWizardMaxPreparedSpells,
  getWizardSpellbookByLevel,
  getWizardMaxSpellLevel,
  validateWizardPreparedSpells,
  getFinalStats,
  formatModifier,
  getSpellSummary,
  SCHOOL_THEMES
} from '../../utils/sheetUtils';

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

  // Wizard data (with safe fallbacks)
  const spellbook = useMemo(() => character.wizard?.spellbook || [], [character.wizard?.spellbook]);
  const prepared = useMemo(() => character.preparedSpells || [], [character.preparedSpells]);
  const maxPrepared = useMemo(() => getWizardMaxPreparedSpells(character), [character]);
  const maxSpellbook = useMemo(() => getWizardSpellbookByLevel(character.level), [character.level]);
  const maxSpellLevel = useMemo(() => getWizardMaxSpellLevel(character.level), [character.level]);
  
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
      // Show ALL spells from spellbook (including cantrips - Wizards can prepare any spell)
      spells = spellbook.filter(s => {
        const detail = SPELL_DETAILS[s];
        return detail && detail.level >= 0; // Include cantrips and all spell levels
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
      // Show ALL spell levels including cantrips (Wizards can prepare any spell)
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
  const handleLearnSpell = useCallback((spellName: string) => {
    try {
      if (!spellName) {
        console.error('No spell name provided');
        return;
      }

      if (spellbook.includes(spellName)) {
        alert(`${spellName} is already in your spellbook.`);
        return;
      }

      if (spellbook.length >= maxSpellbook) {
        alert(`Your spellbook is full (${maxSpellbook} spells)`);
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

      console.log('Learning spell:', spellName, 'New spellbook:', newSpellbook);
      onUpdate(updatedCharacter);
    } catch (error) {
      console.error('Error learning spell:', error);
      alert('Failed to learn spell. Check console for details.');
    }
  }, [character, spellbook, maxSpellbook, onUpdate]);

  // Handle remove spell from spellbook
  const handleRemoveSpell = useCallback((spellName: string) => {
    if (!window.confirm(`Remove ${spellName} from your spellbook?`)) {
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
  }, [character, spellbook, prepared, onUpdate]);

  // Handle prepare/unprepare spell
  const handleTogglePrepare = useCallback((spellName: string) => {
    let newPrepared = prepared.includes(spellName)
      ? prepared.filter(s => s !== spellName)
      : [...prepared, spellName];

    const validation = validateWizardPreparedSpells(character, newPrepared);
    if (!validation.valid) {
      alert(validation.reason || 'Invalid prepared spells selection');
      return;
    }

    onUpdate({
      ...character,
      preparedSpells: newPrepared
    });
  }, [character, prepared, onUpdate]);

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
        className={`flex items-center justify-between gap-4 p-4 rounded-xl border-2 ${schoolColor.light} ${schoolColor.dark} ${schoolColor.border} 
                     hover:shadow-md transition-all duration-200 backdrop-blur-xs cursor-pointer hover:scale-[1.01]`}
      >
        {/* School Icon & Spell Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="material-symbols-outlined text-lg flex-shrink-0 mt-0.5 text-slate-600 dark:text-slate-300">
            {detail.level === 0 ? 'stars' : 'auto_awesome'}
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-base text-slate-900 dark:text-white leading-tight">{spellName}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {detail.level === 0 ? 'Cantrip' : `Level ${detail.level}`} • {detail.school || 'Unknown'} {detail.ritual ? '• Ritual' : ''}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0 flex-wrap sm:flex-nowrap justify-end">
          {activeTab === 'learn' && (
            <button
              onClick={() => handleLearnSpell(spellName)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 active:scale-95 whitespace-nowrap ${
                isLearned || spellbook.length >= maxSpellbook
                  ? 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg'
              }`}
              disabled={isLearned || spellbook.length >= maxSpellbook}
              title={isLearned ? 'Already learned' : spellbook.length >= maxSpellbook ? 'Spellbook full' : 'Learn spell'}
            >
              📖 Learn
            </button>
          )}

          {(activeTab === 'prepare' || activeTab === 'rituals') && (
            <>
              <button
                onClick={() => handleTogglePrepare(spellName)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 active:scale-95 whitespace-nowrap ${
                  isPrepared
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md hover:shadow-lg'
                    : !isInBook
                    ? 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'
                    : 'bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 transition-all'
                }`}
                disabled={!isInBook}
                title={!isInBook ? 'Learn spell first' : isPrepared ? 'Prepared' : 'Prepare spell'}
              >
                {isPrepared ? '✓ Ready' : '✨ Prepare'}
              </button>
              <button
                onClick={() => handleRemoveSpell(spellName)}
                className="px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 active:scale-95 whitespace-nowrap bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg"
                title="Remove spell from spellbook"
              >
                🗑️ Delete
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/80 dark:bg-black/60 flex items-end sm:items-center justify-center animate-fadeIn backdrop-blur-sm">
      <div className="w-full sm:max-w-2xl bg-white dark:bg-[#0f1525] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[95vh] sm:max-h-[85vh] flex flex-col animate-slideUp overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-white/10 shrink-0 bg-white dark:bg-[#0f1525]">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">close</span>
          </button>
          <div className="flex flex-col items-center flex-1 px-4">
            <h2 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">Wizard Spellbook</h2>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              Grimoire: {spellbook.length}/{maxSpellbook} | Prepared: {prepared.length}/{maxPrepared}
            </div>
          </div>
          <div className="w-10 flex-shrink-0"></div>
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
              className={`flex-1 py-3 px-4 text-center text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-white/5'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab === 'learn' && '📚 Learn'}
              {tab === 'prepare' && '✨ Prepare'}
              {tab === 'rituals' && '🔮 Rituals'}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto grimoire-scroll">
          {/* Filters */}
          <div className="border-b border-slate-200 dark:border-white/10 p-4 bg-white dark:bg-[#0f1525] space-y-3 sticky top-0 z-10">
            <input
              type="text"
              placeholder="🔍 Search spells..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-white/10 text-slate-900 dark:text-white text-sm rounded-lg border-2 border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-slate-500 dark:placeholder-slate-400"
            />

            {activeTab !== 'rituals' && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {availableLevels.map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level === selectedLevel ? 0 : level)}
                    className={`px-4 py-2.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                      selectedLevel === level
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {level === 0 ? 'All' : `Lvl ${level}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Spell List */}
          {filteredSpells.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 block mb-3">spell_check</span>
              <div className="font-medium">
                {activeTab === 'learn' && 'All available spells learned!'}
                {activeTab === 'prepare' && 'No spells to prepare.'}
                {activeTab === 'rituals' && 'No ritual spells available.'}
              </div>
            </div>
          ) : (
            <div className="space-y-3 p-4">
              {filteredSpells.map(renderSpellRow)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-white/10 p-4 bg-white dark:bg-white/5 shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-white/10 dark:to-white/20 hover:from-slate-300 hover:to-slate-400 dark:hover:from-white/20 dark:hover:to-white/30 text-slate-900 dark:text-white rounded-xl text-sm font-bold uppercase tracking-widest transition-all active:scale-[0.98] duration-200"
          >
            Close Grimoire
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
            <div className="w-full sm:max-w-lg bg-white dark:bg-[#0f1525] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col animate-slideUp overflow-hidden">
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
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">close</span>
                  </button>
                </div>
              </div>

              {/* Detail Modal Content */}
              <div className="flex-1 overflow-y-auto grimoire-scroll space-y-4 p-4">
                {/* Casting Time */}
                <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-3 border border-slate-200 dark:border-white/10">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">⏱️ Casting Time</div>
                  <div className="text-sm text-slate-900 dark:text-white mt-1">{detail.castingTime}</div>
                </div>

                {/* Range */}
                <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-3 border border-slate-200 dark:border-white/10">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">📍 Range</div>
                  <div className="text-sm text-slate-900 dark:text-white mt-1">{detail.range}</div>
                </div>

                {/* Components */}
                <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-3 border border-slate-200 dark:border-white/10">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">🎭 Components</div>
                  <div className="text-sm text-slate-900 dark:text-white mt-1">{detail.components}</div>
                </div>

                {/* Duration */}
                <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-3 border border-slate-200 dark:border-white/10">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">⏳ Duration</div>
                  <div className="text-sm text-slate-900 dark:text-white mt-1">{detail.duration}</div>
                </div>

                {/* Description */}
                <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-3 border border-slate-200 dark:border-white/10">
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
                      console.log('Learn button clicked for:', selectedSpellDetail);
                      handleLearnSpell(selectedSpellDetail!);
                      setSelectedSpellDetail(null);
                    }}
                    disabled={spellbook.length >= maxSpellbook}
                    className={`w-full px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] ${
                      spellbook.length >= maxSpellbook
                        ? 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg'
                    }`}
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
                      className={`w-full px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] ${
                        isPrepared
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md hover:shadow-lg'
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
                      className="w-full px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg"
                    >
                      🗑️ Delete Spell
                    </button>
                  </>
                )}

                <button
                  onClick={() => setSelectedSpellDetail(null)}
                  className="w-full px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all"
                >
                  Close
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
