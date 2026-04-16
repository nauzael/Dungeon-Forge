import React, { useState, useMemo, useCallback } from 'react';
import { XP_BUDGETS, getEncounterDifficulty, CR_XP } from '../../utils/encounterUtils';
import {
  SRD_MONSTERS,
  POPULAR_MONSTERS,
  searchMonsters,
  MonsterData,
  MONSTER_TYPES,
  MonsterType,
} from '../../Data/monsters';

interface MonsterAbility {
  id: string;
  name: string;
  description: string;
  uses: number;
  maxUses: number;
  resetOn: 'short' | 'long' | 'none';
}

export type ConditionType =
  | 'blinded'
  | 'charmed'
  | 'deafened'
  | 'frightened'
  | 'grappled'
  | 'incapacitated'
  | 'invisible'
  | 'paralyzed'
  | 'petrified'
  | 'poisoned'
  | 'prone'
  | 'restrained'
  | 'stunned'
  | 'unconscious'
  | 'exhaustion';

export const CONDITIONS: Record<ConditionType, { label: string; icon: string; color: string }> = {
  blinded: { label: 'Cegado', icon: 'visibility_off', color: 'text-slate-400' },
  charmed: { label: 'Encantado', icon: 'favorite', color: 'text-pink-400' },
  deafened: { label: 'Sordo', icon: 'volume_off', color: 'text-slate-500' },
  frightened: { label: 'Asustado', icon: 'sentiment_very_dissatisfied', color: 'text-yellow-400' },
  grappled: { label: 'Agarrado', icon: 'back_hand', color: 'text-orange-400' },
  incapacitated: { label: 'Incapacitado', icon: 'do_not_disturb', color: 'text-red-400' },
  invisible: { label: 'Invisible', icon: 'visibility', color: 'text-blue-300' },
  paralyzed: { label: 'Paralizado', icon: 'airline_seat_flat', color: 'text-yellow-500' },
  petrified: { label: 'Petrificado', icon: 'diamond', color: 'text-slate-400' },
  poisoned: { label: 'Envenenado', icon: 'science', color: 'text-green-400' },
  prone: { label: 'Tumbado', icon: 'airline_seat_recline_normal', color: 'text-slate-400' },
  restrained: { label: 'Restringido', icon: 'lock', color: 'text-orange-500' },
  stunned: { label: 'Aturdido', icon: 'flash_on', color: 'text-yellow-300' },
  unconscious: { label: 'Inconsciente', icon: 'sick', color: 'text-slate-500' },
  exhaustion: { label: 'Agotamiento', icon: 'battery_alert', color: 'text-red-500' },
};

export interface Monster {
  id: string;
  name: string;
  cr: string;
  maxHp: number;
  currentHp: number;
  ac: number;
  type: MonsterType;
  abilities: MonsterAbility[];
  conditions: ConditionType[];
  notes: string;
}

interface MonsterBuilderProps {
  playerLevels: number[];
}

const CR_TEMPLATES: Record<string, { hp: number; ac: number }> = {
  '0': { hp: 7, ac: 11 },
  '1/8': { hp: 10, ac: 12 },
  '1/4': { hp: 15, ac: 12 },
  '1/2': { hp: 22, ac: 13 },
  '1': { hp: 30, ac: 13 },
  '2': { hp: 45, ac: 14 },
  '3': { hp: 60, ac: 15 },
  '4': { hp: 75, ac: 15 },
  '5': { hp: 90, ac: 16 },
  '6': { hp: 110, ac: 16 },
  '7': { hp: 130, ac: 17 },
  '8': { hp: 150, ac: 17 },
  '9': { hp: 175, ac: 18 },
  '10': { hp: 200, ac: 18 },
  '11': { hp: 225, ac: 18 },
  '12': { hp: 250, ac: 19 },
  '13': { hp: 280, ac: 19 },
  '14': { hp: 310, ac: 19 },
  '15': { hp: 340, ac: 19 },
  '16': { hp: 380, ac: 20 },
  '17': { hp: 420, ac: 20 },
  '18': { hp: 460, ac: 21 },
  '19': { hp: 500, ac: 21 },
  '20': { hp: 550, ac: 22 },
  '21': { hp: 600, ac: 22 },
  '22': { hp: 660, ac: 22 },
  '23': { hp: 720, ac: 23 },
  '24': { hp: 780, ac: 23 },
  '25': { hp: 850, ac: 24 },
  '26': { hp: 920, ac: 24 },
  '27': { hp: 990, ac: 25 },
  '28': { hp: 1070, ac: 25 },
  '29': { hp: 1150, ac: 26 },
  '30': { hp: 1250, ac: 26 },
};

const DEFAULT_ABILITIES: MonsterAbility[] = [
  {
    id: 'multiattack',
    name: 'Multiattack',
    description: 'El monstruo hace dos ataques de garras.',
    uses: 0,
    maxUses: 0,
    resetOn: 'none',
  },
  {
    id: 'bite',
    name: 'Mordisco',
    description: 'Ataque de mordisco cuerpo a cuerpo.',
    uses: 0,
    maxUses: 0,
    resetOn: 'none',
  },
  {
    id: 'claw',
    name: 'Garra',
    description: 'Ataque de garra cuerpo a cuerpo.',
    uses: 0,
    maxUses: 0,
    resetOn: 'none',
  },
];

const MonsterBuilder: React.FC<MonsterBuilderProps> = ({ playerLevels }) => {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [name, setName] = useState('');
  const [cr, setCr] = useState('1');
  const [hp, setHp] = useState(30);
  const [ac, setAc] = useState(13);
  const [type, setType] = useState<MonsterType>('humanoid');
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MonsterData[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<MonsterType | 'all'>('all');
  const [expandedMonster, setExpandedMonster] = useState<string | null>(null);
  const [damageInput, setDamageInput] = useState<Record<string, string>>({});
  const [healInput, setHealInput] = useState<Record<string, string>>({});

  const budgets = useMemo(() => {
    if (playerLevels.length === 0) return { easy: 0, medium: 0, hard: 0, deadly: 0 };
    return playerLevels.reduce(
      (acc, lvl) => {
        const b = XP_BUDGETS[lvl] || XP_BUDGETS[20];
        return {
          easy: acc.easy + b.easy,
          medium: acc.medium + b.medium,
          hard: acc.hard + b.hard,
          deadly: acc.deadly + b.deadly,
        };
      },
      { easy: 0, medium: 0, hard: 0, deadly: 0 }
    );
  }, [playerLevels]);

  const currentTotalXP = monsters.reduce((acc, m) => acc + (CR_XP[m.cr] || 0), 0);
  const difficulty = getEncounterDifficulty(currentTotalXP, playerLevels);

  const filteredMonsters = useMemo(() => {
    if (selectedFilter === 'all') return monsters;
    return monsters.filter((m) => m.type === selectedFilter);
  }, [monsters, selectedFilter]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 0) {
      setSuggestions(searchMonsters(value));
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (monster: MonsterData) => {
    setName(monster.name);
    setCr(monster.cr);
    setHp(monster.hp);
    setAc(monster.ac);
    setType(monster.type);
    setSuggestions([]);
    setSearchQuery('');
  };

  const handleAdd = () => {
    if (!name) return;
    const newMonster: Monster = {
      id: Date.now().toString(),
      name,
      cr,
      maxHp: hp,
      currentHp: hp,
      ac,
      type,
      abilities: [...DEFAULT_ABILITIES],
      conditions: [],
      notes: '',
    };
    setMonsters((prev) => [...prev, newMonster]);
    resetForm();
  };

  const handleQuickSpawn = (monster: MonsterData) => {
    const newMonster: Monster = {
      id: Date.now().toString(),
      name: monster.name,
      cr: monster.cr,
      maxHp: monster.hp,
      currentHp: monster.hp,
      ac: monster.ac,
      type: monster.type,
      abilities: [...DEFAULT_ABILITIES],
      conditions: [],
      notes: '',
    };
    setMonsters((prev) => [...prev, newMonster]);
  };

  const resetForm = () => {
    setName('');
    setCr('1');
    setHp(30);
    setAc(13);
    setType('humanoid');
    setSearchQuery('');
    setSuggestions([]);
    setShowAdd(false);
  };

  const handleDuplicate = (monster: Monster) => {
    const newMonster: Monster = {
      ...monster,
      id: Date.now().toString(),
      name: `${monster.name} (Clone)`,
      currentHp: monster.maxHp,
    };
    setMonsters((prev) => [...prev, newMonster]);
  };

  const handleAutoCalculate = useCallback(() => {
    const template = CR_TEMPLATES[cr];
    if (template) {
      setHp(template.hp);
      setAc(template.ac);
    }
  }, [cr]);

  const handleCrChange = (newCr: string) => {
    setCr(newCr);
    const template = CR_TEMPLATES[newCr];
    if (template) {
      setHp(template.hp);
      setAc(template.ac);
    }
  };

  const dealDamage = (monsterId: string, damage: number) => {
    setMonsters((prev) =>
      prev.map((m) => {
        if (m.id === monsterId) {
          const newHp = Math.max(0, m.currentHp - damage);
          return { ...m, currentHp: newHp };
        }
        return m;
      })
    );
    setDamageInput((prev) => ({ ...prev, [monsterId]: '' }));
  };

  const healMonster = (monsterId: string, amount: number) => {
    setMonsters((prev) =>
      prev.map((m) => {
        if (m.id === monsterId) {
          const newHp = Math.min(m.maxHp, m.currentHp + amount);
          return { ...m, currentHp: newHp };
        }
        return m;
      })
    );
    setHealInput((prev) => ({ ...prev, [monsterId]: '' }));
  };

  const toggleCondition = (monsterId: string, condition: ConditionType) => {
    setMonsters((prev) =>
      prev.map((m) => {
        if (m.id === monsterId) {
          const hasCondition = m.conditions.includes(condition);
          return {
            ...m,
            conditions: hasCondition
              ? m.conditions.filter((c) => c !== condition)
              : [...m.conditions, condition],
          };
        }
        return m;
      })
    );
  };

  const resetShortRest = (monsterId: string) => {
    setMonsters((prev) =>
      prev.map((m) => {
        if (m.id === monsterId) {
          return {
            ...m,
            currentHp: Math.min(m.maxHp, m.currentHp + Math.floor(m.maxHp / 2)),
            abilities: m.abilities.map((a) =>
              a.resetOn === 'short' ? { ...a, uses: a.maxUses } : a
            ),
          };
        }
        return m;
      })
    );
  };

  const resetLongRest = (monsterId: string) => {
    setMonsters((prev) =>
      prev.map((m) => {
        if (m.id === monsterId) {
          return {
            ...m,
            currentHp: m.maxHp,
            conditions: [],
            abilities: m.abilities.map((a) =>
              a.resetOn === 'long' || a.resetOn === 'short' ? { ...a, uses: a.maxUses } : a
            ),
          };
        }
        return m;
      })
    );
  };

  const useAbility = (monsterId: string, abilityId: string) => {
    setMonsters((prev) =>
      prev.map((m) => {
        if (m.id === monsterId) {
          return {
            ...m,
            abilities: m.abilities.map((a) =>
              a.id === abilityId && a.uses < a.maxUses ? { ...a, uses: a.uses + 1 } : a
            ),
          };
        }
        return m;
      })
    );
  };

  const getHpPercent = (current: number, max: number) => Math.round((current / max) * 100);
  const getHpColor = (percent: number) => {
    if (percent > 50) return 'bg-emerald-500';
    if (percent > 25) return 'bg-yellow-500';
    if (percent > 0) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const isDead = (monster: Monster) => monster.currentHp <= 0;

  return (
    <div className="space-y-6">
      {/* Encounter Balance Card */}
      <div className="bg-[#1e293b] rounded-3xl p-6 border border-white/5 shadow-2xl space-y-5">
        <div className="flex flex-col items-center text-center space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
            Tactical Budget
          </span>
          <h2 className="text-2xl font-serif italic font-bold text-white">Encounter Balance</h2>
          <p className="text-[9px] font-black uppercase text-blue-400 tracking-tighter">
            For {playerLevels.length} Adventurers (Avg Level{' '}
            {Math.round(playerLevels.reduce((a, b) => a + b, 0) / (playerLevels.length || 1))})
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {Object.entries(budgets).map(([diff, xp]) => (
            <div
              key={diff}
              className={`flex flex-col items-center bg-black/20 rounded-xl p-2 border ${difficulty.toLowerCase() === diff.toLowerCase() ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/5'}`}
            >
              <span
                className={`text-[7px] font-black uppercase ${difficulty.toLowerCase() === diff.toLowerCase() ? 'text-blue-400' : 'text-slate-500'}`}
              >
                {diff}
              </span>
              <span className="text-xs font-bold text-white leading-none">{xp}</span>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-black uppercase text-slate-500">
              Current Total XP
            </span>
            <span
              className={`text-sm font-black ${difficulty === 'DEADLY' ? 'text-red-500 animate-pulse' : difficulty === 'HARD' ? 'text-orange-500' : 'text-emerald-500'}`}
            >
              {currentTotalXP} ({difficulty})
            </span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5 shadow-inner">
            <div
              className={`h-full transition-all duration-700 ${difficulty === 'DEADLY' ? 'bg-red-500' : difficulty === 'HARD' ? 'bg-orange-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min((currentTotalXP / (budgets.deadly || 1)) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quick Spawn Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest leading-none">
            Quick Spawn
          </h3>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="size-8 rounded-full bg-blue-600 flex items-center justify-center border-4 border-[#0f172a] shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px] text-white">
              {showAdd ? 'remove' : 'add'}
            </span>
          </button>
        </div>

        {/* Popular Monsters Grid */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {POPULAR_MONSTERS.slice(0, 12).map((monster) => (
            <button
              key={monster.name}
              onClick={() => handleQuickSpawn(monster)}
              className="flex-shrink-0 bg-[#1e293b] rounded-xl px-3 py-2 border border-white/5 hover:border-blue-500/30 transition-all active:scale-95 group"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-red-400">
                  {MONSTER_TYPES[monster.type]?.icon || 'skull'}
                </span>
                <div className="text-left min-w-0">
                  <p className="text-[10px] font-bold text-white leading-tight truncate">
                    {monster.name}
                  </p>
                  <p className="text-[8px] text-slate-500">CR {monster.cr}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Monster Form */}
      {showAdd && (
        <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-blue-500/20 space-y-4 animate-slideDown shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase text-blue-400">Custom Monster</h3>
            <button onClick={resetForm} className="text-slate-500 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Search Autocomplete */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar monstruo del SRD..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50"
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-48 overflow-y-auto">
                {suggestions.map((monster) => (
                  <button
                    key={monster.name}
                    onClick={() => handleSelectSuggestion(monster)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-600/20 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-lg text-red-400">
                      {MONSTER_TYPES[monster.type]?.icon}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{monster.name}</p>
                      <p className="text-[10px] text-slate-500">
                        CR {monster.cr} • {MONSTER_TYPES[monster.type]?.label}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Monster Preview */}
          {name && (
            <div className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-white/5">
              <span className="material-symbols-outlined text-2xl text-red-400">
                {MONSTER_TYPES[type]?.icon}
              </span>
              <div>
                <p className="font-bold text-white">{name}</p>
                <p className="text-[10px] text-slate-500">
                  {MONSTER_TYPES[type]?.label} • CR {cr}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-slate-500 pl-1">CR</label>
              <select
                value={cr}
                onChange={(e) => handleCrChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-xs text-white appearance-none outline-none focus:border-blue-500/50 truncate"
              >
                {Object.keys(CR_XP).map((val) => (
                  <option key={val} value={val} className="bg-slate-900 text-white">
                    {val}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-slate-500 pl-1">HP</label>
              <input
                type="number"
                value={hp}
                onChange={(e) => setHp(parseInt(e.target.value) || 0)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-xs text-white outline-none focus:border-blue-500/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-slate-500 pl-1">AC</label>
              <input
                type="number"
                value={ac}
                onChange={(e) => setAc(parseInt(e.target.value) || 0)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-xs text-white outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          <button
            onClick={handleAutoCalculate}
            className="w-full py-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-bold uppercase text-[9px] tracking-widest rounded-xl hover:bg-emerald-600/30 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Auto-calc HP/AC por CR ({CR_TEMPLATES[cr]?.hp} HP / {CR_TEMPLATES[cr]?.ac} AC)
          </button>

          <div className="space-y-1">
            <label className="text-[8px] font-black uppercase text-slate-500 pl-1">Tipo</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MonsterType)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white appearance-none outline-none focus:border-blue-500/50"
            >
              {Object.entries(MONSTER_TYPES).map(([key, val]) => (
                <option key={key} value={key} className="bg-slate-900">
                  {val.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={resetForm}
              className="flex-1 py-3 bg-white/5 text-slate-400 font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 py-3 bg-blue-600 text-white font-bold uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-colors"
            >
              Invocar
            </button>
          </div>
        </div>
      )}

      {/* Encounter List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest leading-none">
            Bestiario ({monsters.length})
          </h3>
          {monsters.length > 0 && (
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as MonsterType | 'all')}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-400 outline-none"
              >
                <option value="all">Todos</option>
                {Object.entries(MONSTER_TYPES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setMonsters([])}
                className="px-2 py-1 bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-bold rounded-lg hover:bg-red-500/30"
              >
                Limpiar
              </button>
            </div>
          )}
        </div>

        {filteredMonsters.length === 0 ? (
          <div className="text-center py-10 italic text-slate-600 font-medium">
            {monsters.length === 0
              ? 'No has invocado enemigos para este encuentro...'
              : 'No hay monstruos de este tipo en el encuentro.'}
          </div>
        ) : (
          <div className="grid gap-3 pb-20">
            {filteredMonsters.map((m) => (
              <div
                key={m.id}
                className={`bg-[#1e293b] rounded-2xl border border-white/5 shadow-xl overflow-hidden transition-all ${isDead(m) ? 'opacity-50 grayscale' : ''}`}
              >
                {/* Monster Header - Always visible */}
                <div
                  className="p-4 flex justify-between items-center cursor-pointer active:bg-white/5"
                  onClick={() => setExpandedMonster(expandedMonster === m.id ? null : m.id)}
                >
                  <div className="flex gap-4">
                    <div
                      className={`size-12 rounded-xl border flex items-center justify-center ${isDead(m) ? 'bg-slate-700 border-slate-600 text-slate-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}
                    >
                      <span className="material-symbols-outlined text-2xl">
                        {MONSTER_TYPES[m.type]?.icon || 'skull'}
                      </span>
                    </div>
                    <div>
                      <h4
                        className={`font-bold uppercase tracking-tight ${isDead(m) ? 'text-slate-500 line-through' : 'text-white group-hover:text-red-400'}`}
                      >
                        {m.name}
                        {isDead(m) && ' 💀'}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-black uppercase">
                          CR {m.cr}
                        </span>
                        <span className="text-slate-700 text-[10px]">•</span>
                        <span className="text-[10px] text-blue-400 font-bold">AC {m.ac}</span>
                      </div>
                    </div>
                  </div>

                  {/* HP Bar - Compact */}
                  <div className="flex-1 max-w-[120px] mx-4">
                    <div className="flex justify-between text-[9px] mb-1">
                      <span
                        className={`font-black ${isDead(m) ? 'text-slate-500' : 'text-emerald-400'}`}
                      >
                        {m.currentHp}/{m.maxHp}
                      </span>
                      <span className="text-slate-500">{getHpPercent(m.currentHp, m.maxHp)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`h-full transition-all duration-500 ${getHpColor(getHpPercent(m.currentHp, m.maxHp))}`}
                        style={{ width: `${getHpPercent(m.currentHp, m.maxHp)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <span className="material-symbols-outlined text-slate-500">
                    {expandedMonster === m.id ? 'expand_less' : 'expand_more'}
                  </span>
                </div>

                {/* Expanded Combat View */}
                {expandedMonster === m.id && (
                  <div className="border-t border-white/5 p-4 space-y-4 bg-[#0f172a]/50 animate-slideDown">
                    {/* HP Tracker */}
                    <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase text-slate-500 pl-1">
                        HP Tracker
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 flex gap-2">
                          <input
                            type="number"
                            placeholder="Daño"
                            value={damageInput[m.id] || ''}
                            onChange={(e) =>
                              setDamageInput((prev) => ({ ...prev, [m.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && damageInput[m.id]) {
                                dealDamage(m.id, parseInt(damageInput[m.id]) || 0);
                              }
                            }}
                            className="flex-1 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 text-sm text-white placeholder-red-400/50 outline-none focus:border-red-500/50"
                          />
                          <button
                            onClick={() => {
                              if (damageInput[m.id])
                                dealDamage(m.id, parseInt(damageInput[m.id]) || 0);
                            }}
                            className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl"
                          >
                            Daño
                          </button>
                        </div>
                        <div className="flex-1 flex gap-2">
                          <input
                            type="number"
                            placeholder="Curación"
                            value={healInput[m.id] || ''}
                            onChange={(e) =>
                              setHealInput((prev) => ({ ...prev, [m.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && healInput[m.id]) {
                                healMonster(m.id, parseInt(healInput[m.id]) || 0);
                              }
                            }}
                            className="flex-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2 text-sm text-white placeholder-emerald-400/50 outline-none focus:border-emerald-500/50"
                          />
                          <button
                            onClick={() => {
                              if (healInput[m.id])
                                healMonster(m.id, parseInt(healInput[m.id]) || 0);
                            }}
                            className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
                          >
                            Curar
                          </button>
                        </div>
                      </div>

                      {/* HP Bar - Full */}
                      <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                        <div
                          className={`h-full transition-all duration-500 ${getHpColor(getHpPercent(m.currentHp, m.maxHp))}`}
                          style={{ width: `${getHpPercent(m.currentHp, m.maxHp)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Conditions */}
                    <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase text-slate-500 pl-1">
                        Condiciones ({m.conditions.length})
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(CONDITIONS).map(([key, cond]) => {
                          const isActive = m.conditions.includes(key as ConditionType);
                          return (
                            <button
                              key={key}
                              onClick={() => toggleCondition(m.id, key as ConditionType)}
                              className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase flex items-center gap-1 transition-all ${isActive ? `${cond.color} bg-white/10 border border-current` : 'text-slate-600 bg-white/5 border border-white/5 hover:border-white/20'}`}
                            >
                              <span className="material-symbols-outlined text-xs">{cond.icon}</span>
                              {cond.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Abilities */}
                    <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase text-slate-500 pl-1">
                        Habilidades ({m.abilities.length})
                      </label>
                      <div className="space-y-1.5">
                        {m.abilities.map((ability) => (
                          <div
                            key={ability.id}
                            className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2 border border-white/5"
                          >
                            <div className="flex-1">
                              <p className="text-xs font-bold text-white">{ability.name}</p>
                              <p className="text-[9px] text-slate-500 line-clamp-1">
                                {ability.description}
                              </p>
                            </div>
                            {ability.maxUses > 0 ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => useAbility(m.id, ability.id)}
                                  disabled={ability.uses >= ability.maxUses}
                                  className={`size-7 rounded-lg flex items-center justify-center text-xs font-bold ${ability.uses >= ability.maxUses ? 'bg-slate-700 text-slate-500' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                                >
                                  {ability.uses}/{ability.maxUses}
                                </button>
                              </div>
                            ) : (
                              <span className="text-[9px] text-slate-500 font-bold">—</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rest Actions */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => resetShortRest(m.id)}
                        className="flex-1 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-bold uppercase text-[9px] tracking-widest rounded-xl hover:bg-yellow-500/30 transition-colors"
                      >
                        Short Rest (+{Math.floor(m.maxHp / 2)} HP)
                      </button>
                      <button
                        onClick={() => resetLongRest(m.id)}
                        className="flex-1 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold uppercase text-[9px] tracking-widest rounded-xl hover:bg-emerald-500/30 transition-colors"
                      >
                        Long Rest (Full HP)
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleDuplicate(m)}
                        className="flex-1 py-2 bg-white/5 border border-white/10 text-slate-400 font-bold uppercase text-[9px] tracking-widest rounded-xl hover:bg-white/10 transition-colors"
                      >
                        Duplicar
                      </button>
                      <button
                        onClick={() => setMonsters((prev) => prev.filter((x) => x.id !== m.id))}
                        className="flex-1 py-2 bg-red-500/20 border border-red-500/30 text-red-400 font-bold uppercase text-[9px] tracking-widest rounded-xl hover:bg-red-500/30 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonsterBuilder;
