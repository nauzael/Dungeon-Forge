import React, { useState, useMemo, useEffect } from 'react';
import { Character, InitiativeCombatant } from '../../types';

interface InitiativeTrackerProps {
  partyMembers: Character[];
  combatants: InitiativeCombatant[];
  onCombatantsChange: React.Dispatch<React.SetStateAction<InitiativeCombatant[]>>;
  onSyncParty: () => void;
}

const InitiativeTracker: React.FC<InitiativeTrackerProps> = ({ partyMembers, combatants, onCombatantsChange, onSyncParty }) => {
  const [newName, setNewName] = useState('');
  const [newInit, setNewInit] = useState('');
  const [newAC, setNewAC] = useState('');
  const [newHP, setNewHP] = useState('');
  const [initiativeInputs, setInitiativeInputs] = useState<Record<string, string>>({});
  const [activeInputId, setActiveInputId] = useState<string | null>(null);

  useEffect(() => {
    setInitiativeInputs((prev) => {
      const next = { ...prev };

      combatants.forEach((combatant) => {
        if (activeInputId !== combatant.id) {
          next[combatant.id] = combatant.initiative === null ? '' : String(combatant.initiative);
        }
      });

      Object.keys(next).forEach((id) => {
        if (!combatants.some((combatant) => combatant.id === id)) {
          delete next[id];
        }
      });

      return next;
    });
  }, [combatants, activeInputId]);

  const currentTurnIndex = useMemo(() => {
    return combatants.findIndex(c => c.isCurrentTurn);
  }, [combatants]);

  const sortedCombatants = useMemo(() => {
    return [...combatants]
      .filter(c => c.initiative !== null)
      .sort((a, b) => b.initiative! - a.initiative!);
  }, [combatants]);

  const addCombatant = () => {
    if (!newName.trim() || newInit === '') return;
    
    const newCombatant: InitiativeCombatant = {
      id: `monster-${Date.now()}`,
      name: newName.trim(),
      initiative: parseInt(newInit) || 0,
      isPlayer: false,
      isCurrentTurn: false,
      ac: newAC ? parseInt(newAC) : undefined,
      hp: newHP ? { current: parseInt(newHP), max: parseInt(newHP) } : undefined,
    };

    onCombatantsChange((prev) => [...prev, newCombatant]);
    setNewName('');
    setNewInit('');
    setNewAC('');
    setNewHP('');
  };

  const commitInitiative = (id: string, rawValue: string) => {
    const value = rawValue.trim();
    onCombatantsChange((prev) =>
      prev.map((combatant) => {
        if (combatant.id !== id) return combatant;
        if (value === '') return { ...combatant, initiative: null };
        const parsed = Number.parseInt(value, 10);
        return { ...combatant, initiative: Number.isNaN(parsed) ? 0 : parsed };
      })
    );
  };

  const startEditInitiative = (id: string) => {
    setActiveInputId(id);
    const current = combatants.find((combatant) => combatant.id === id);
    setInitiativeInputs((prev) => ({
      ...prev,
      [id]: current?.initiative === null || current?.initiative === undefined ? '' : String(current.initiative),
    }));
  };

  const handleInitiativeChange = (id: string, value: string) => {
    setInitiativeInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const finishEditInitiative = (id: string) => {
    commitInitiative(id, initiativeInputs[id] ?? '');
    setActiveInputId((prev) => (prev === id ? null : prev));
  };

  const nextTurn = () => {
    const activeCombatants = sortedCombatants;
    if (activeCombatants.length === 0) return;

    const currentIndex = activeCombatants.findIndex(c => c.isCurrentTurn);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % activeCombatants.length;

    onCombatantsChange((prev) =>
      prev.map((combatant) => ({
        ...combatant,
        isCurrentTurn: combatant.id === activeCombatants[nextIndex].id,
      }))
    );
  };

  const resetCombat = () => {
    onCombatantsChange((prev) =>
      prev.map((combatant) => ({
        ...combatant,
        initiative: null,
        isCurrentTurn: false,
      }))
    );
  };

  const removeCombatant = (id: string) => {
    onCombatantsChange((prev) => prev.filter((combatant) => combatant.id !== id));
    setInitiativeInputs((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setActiveInputId((prev) => (prev === id ? null : prev));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined">swords</span>
          Initiative Tracker
        </h3>
        <button
          onClick={onSyncParty}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">sync</span>
          Sync Party
        </button>
      </div>

      {/* Add Combatant Form */}
      <div className="bg-white/5 rounded-xl p-3 space-y-2">
        <p className="text-xs text-slate-400 font-medium">Add to Initiative</p>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="flex-1 min-w-[100px] px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:border-blue-500 outline-none"
          />
          <input
            type="number"
            placeholder="Init"
            value={newInit}
            onChange={e => setNewInit(e.target.value)}
            className="w-16 px-2 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:border-blue-500 outline-none text-center"
          />
          <input
            type="number"
            placeholder="AC"
            value={newAC}
            onChange={e => setNewAC(e.target.value)}
            className="w-14 px-2 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:border-blue-500 outline-none text-center"
          />
          <input
            type="number"
            placeholder="HP"
            value={newHP}
            onChange={e => setNewHP(e.target.value)}
            className="w-14 px-2 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:border-blue-500 outline-none text-center"
          />
          <button
            onClick={addCombatant}
            disabled={!newName.trim() || newInit === ''}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add
          </button>
        </div>
      </div>

      {/* Initiative List */}
      <div className="bg-black/20 rounded-xl overflow-hidden">
        {/* Column Headers */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 text-[10px] text-slate-400 font-bold uppercase">
          <span className="w-6 text-center">#</span>
          <span className="flex-1">Name</span>
          <span className="w-12 text-center">Init</span>
          <span className="w-8 text-center">AC</span>
          <span className="w-16 text-center">HP</span>
          <span className="w-8"></span>
        </div>

        {/* Combatants */}
        {sortedCombatants.length === 0 ? (
          <div className="px-4 py-8 text-center text-slate-500 text-sm">
            No initiative set yet. Enter rolls below each combatant.
          </div>
        ) : (
          sortedCombatants.map((combatant, index) => (
            <div
              key={combatant.id}
              className={`flex items-center gap-2 px-4 py-3 border-b border-white/5 ${
                combatant.isCurrentTurn 
                  ? 'bg-blue-600/20 border-l-4 border-l-blue-500' 
                  : combatant.isPlayer 
                    ? 'bg-green-600/10' 
                    : 'bg-red-600/10'
              }`}
            >
              <span className="w-6 text-center text-slate-500 text-sm font-bold">
                {index + 1}
              </span>
              
              <div className="flex-1 flex items-center gap-2">
                {combatant.isPlayer ? (
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                )}
                <span className="text-white text-sm font-medium truncate">
                  {combatant.name}
                </span>
                {combatant.isCurrentTurn && (
                  <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold">
                    TURN
                  </span>
                )}
              </div>

              <input
                type="number"
                value={initiativeInputs[combatant.id] ?? (combatant.initiative ?? '')}
                onFocus={() => startEditInitiative(combatant.id)}
                onChange={(e) => handleInitiativeChange(combatant.id, e.target.value)}
                onBlur={() => finishEditInitiative(combatant.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                className="w-12 px-2 py-1 bg-white/10 rounded text-white text-sm text-center border border-white/10 focus:border-blue-500 outline-none"
                placeholder="—"
              />

              <span className="w-8 text-center text-slate-400 text-sm">
                {combatant.ac ?? '—'}
              </span>

              <span className={`w-16 text-center text-sm font-medium ${
                !combatant.hp 
                  ? 'text-slate-500' 
                  : combatant.hp.current <= combatant.hp.max * 0.25 
                    ? 'text-red-400' 
                    : combatant.hp.current <= combatant.hp.max * 0.5 
                      ? 'text-amber-400' 
                      : 'text-green-400'
              }`}>
                {combatant.hp ? `${combatant.hp.current}/${combatant.hp.max}` : '—'}
              </span>

              <button
                onClick={() => removeCombatant(combatant.id)}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))
        )}

        {/* Players without initiative */}
        {combatants.filter(c => c.isPlayer && c.initiative === null).length > 0 && (
          <div className="px-4 py-3 bg-slate-800/50">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Waiting for Initiative</p>
            <div className="space-y-2">
              {combatants.filter(c => c.isPlayer && c.initiative === null).map(c => (
                <div key={c.id} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="flex-1 text-slate-400 text-sm">{c.name}</span>
                  <input
                    type="number"
                    value={initiativeInputs[c.id] ?? (c.initiative ?? '')}
                    onFocus={() => startEditInitiative(c.id)}
                    onChange={(e) => handleInitiativeChange(c.id, e.target.value)}
                    onBlur={() => finishEditInitiative(c.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                    placeholder="Roll"
                    className="w-16 px-2 py-1 bg-white/10 rounded text-white text-sm text-center border border-white/10 focus:border-blue-500 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={nextTurn}
          disabled={sortedCombatants.length === 0}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined">skip_next</span>
          Next Turn
        </button>
        <button
          onClick={resetCombat}
          className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined">restart_alt</span>
          Reset
        </button>
      </div>
    </div>
  );
};

export default InitiativeTracker;
