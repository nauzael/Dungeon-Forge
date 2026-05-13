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
        className="flex items-center justify-between py-2 px-3 border-b border-gray-700 hover:bg-gray-800 transition"
      >
        <div className="flex-1">
          <div className="font-semibold text-sm">{spellName}</div>
          <div className="text-xs text-gray-400">
            Level {detail.level} • {detail.school || 'Unknown'} {detail.ritual ? '(Ritual)' : ''}
          </div>
        </div>

        {activeTab === 'learn' && (
          <button
            onClick={() => handleLearnSpell(spellName)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition"
            disabled={isLearned || spellbook.length >= maxSpellbook}
          >
            Learn
          </button>
        )}

        {(activeTab === 'prepare' || activeTab === 'rituals') && (
          <div className="flex gap-2">
            <button
              onClick={() => handleTogglePrepare(spellName)}
              className={`px-3 py-1 text-xs rounded transition ${
                isPrepared
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              }`}
              disabled={!isInBook}
            >
              {isPrepared ? 'Prepared' : 'Prepare'}
            </button>
            <button
              onClick={() => handleRemoveSpell(spellName)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition"
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
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-end md:items-center justify-center">
      <div className="bg-gray-900 w-full md:w-2/3 md:max-w-2xl md:rounded-lg rounded-t-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-700 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Wizard Spellbook</h2>
            <div className="text-xs text-gray-400 mt-1">
              Grimoire: {spellbook.length}/{maxSpellbook} | Prepared: {prepared.length}/{maxPrepared}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 bg-gray-800">
          {(['learn', 'prepare', 'rituals'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedLevel(0); // Reset level filter on tab change
              }}
              className={`flex-1 py-2 px-4 text-center text-sm font-semibold transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'learn' && 'Learn Spells'}
              {tab === 'prepare' && 'Prepare'}
              {tab === 'rituals' && 'Ritual Casting'}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="border-b border-gray-700 p-4 bg-gray-800 space-y-2">
          <input
            type="text"
            placeholder="Search spells..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-500"
          />

          {activeTab !== 'rituals' && (
            <div className="flex gap-2 overflow-x-auto">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level === selectedLevel ? 0 : level)}
                  className={`px-3 py-1 text-xs rounded whitespace-nowrap transition ${
                    selectedLevel === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {level === 0 ? 'All' : `Lvl ${level}`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Spell List */}
        <div className="flex-1 overflow-y-auto">
          {filteredSpells.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">
              {activeTab === 'learn' && 'All available spells learned!'}
              {activeTab === 'prepare' && 'No spells to prepare.'}
              {activeTab === 'rituals' && 'No ritual spells available.'}
            </div>
          ) : (
            filteredSpells.map(renderSpellRow)
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4 bg-gray-800">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WizardGrimoireManager;
