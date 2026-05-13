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
      spells = spellbook.filter(s => {
        const detail = SPELL_DETAILS[s];
        return detail && detail.level > 0; // Exclude cantrips from preparation
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

  // Handle learn spell
  const handleLearnSpell = useCallback((spellName: string) => {
    if (spellbook.includes(spellName)) {
      alert(`${spellName} is already in your spellbook.`);
      return;
    }

    if (spellbook.length >= maxSpellbook) {
      alert(`Your spellbook is full (${maxSpellbook}/${maxSpellbook} spells). Max is ${maxSpellbook}.`);
      return;
    }

    const newSpellbook = [...spellbook, spellName];
    onUpdate({
      ...character,
      wizard: {
        ...character.wizard,
        spellbook: newSpellbook
      }
    });
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

  // Spell display row
  const renderSpellRow = (spellName: string) => {
    const detail = SPELL_DETAILS[spellName];
    if (!detail) return null;

    const isLearned = spellbook.includes(spellName);
    const isPrepared = prepared.includes(spellName);
    const isInBook = spellbook.includes(spellName);

    return (
      <div
        key={spellName}
        className="flex items-center justify-between py-3 px-3 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition rounded-lg"
      >
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-slate-900 dark:text-white">{spellName}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Level {detail.level} • {detail.school || 'Unknown'} {detail.ritual ? '(Ritual)' : ''}
          </div>
        </div>

        {activeTab === 'learn' && (
          <button
            onClick={() => handleLearnSpell(spellName)}
            className="ml-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-500 text-white text-xs font-semibold rounded-lg transition-all active:scale-95"
            disabled={isLearned || spellbook.length >= maxSpellbook}
          >
            Learn
          </button>
        )}

        {(activeTab === 'prepare' || activeTab === 'rituals') && (
          <div className="flex gap-2 ml-2">
            <button
              onClick={() => handleTogglePrepare(spellName)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all active:scale-95 ${
                isPrepared
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 disabled:opacity-50'
              }`}
              disabled={!isInBook}
            >
              {isPrepared ? '✓ Prepared' : 'Prepare'}
            </button>
            <button
              onClick={() => handleRemoveSpell(spellName)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-all active:scale-95 shadow-sm"
              title="Remove spell from spellbook"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/80 dark:bg-black/60 flex items-end sm:items-center justify-center animate-fadeIn backdrop-blur-sm">
      <div className="w-full sm:max-w-2xl bg-white dark:bg-[#0f1525] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[95vh] sm:max-h-[85vh] flex flex-col animate-slideUp overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">close</span>
          </button>
          <div className="flex flex-col items-center flex-1 px-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-slate-900 dark:text-white">Wizard Spellbook</h2>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Grimoire: {spellbook.length}/{maxSpellbook} | Prepared: {prepared.length}/{maxPrepared}
            </div>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5">
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
        <div className="flex-1 overflow-y-auto">
          {/* Filters */}
          <div className="border-b border-slate-100 dark:border-white/10 p-4 bg-slate-50 dark:bg-white/5 space-y-3 sticky top-0">
            <input
              type="text"
              placeholder="Search spells..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-white/5 text-slate-900 dark:text-white text-sm rounded-lg border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            {activeTab !== 'rituals' && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level === selectedLevel ? 0 : level)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                      selectedLevel === level
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
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
            <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
              <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600 block mb-2">spell_check</span>
              {activeTab === 'learn' && 'All available spells learned!'}
              {activeTab === 'prepare' && 'No spells to prepare.'}
              {activeTab === 'rituals' && 'No ritual spells available.'}
            </div>
          ) : (
            <div className="space-y-1 p-3">
              {filteredSpells.map(renderSpellRow)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 dark:border-white/10 p-4 bg-slate-50 dark:bg-white/5 shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white rounded-xl text-sm font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
          >
            Close Grimoire
          </button>
        </div>
      </div>
    </div>
  );
};

export default WizardGrimoireManager;
