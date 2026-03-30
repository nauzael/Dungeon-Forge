
import React, { useState, useEffect } from 'react';
import { XP_BUDGETS, getEncounterDifficulty, CR_XP } from '../../utils/encounterUtils';

interface Monster {
    id: string;
    name: string;
    cr: string;
    hp: number;
    ac: number;
    actions: string[];
}

const MonsterBuilder: React.FC<{ playerLevels: number[] }> = ({ playerLevels }) => {
    const [monsters, setMonsters] = useState<Monster[]>([]);
    const [name, setName] = useState('');
    const [cr, setCr] = useState('1');
    const [hp, setHp] = useState(30);
    const [ac, setAc] = useState(13);
    const [showAdd, setShowAdd] = useState(false);

    // Calculate total XP budget for the current party
    const budgets = playerLevels.length > 0 ? playerLevels.reduce((acc, lvl) => {
        const b = XP_BUDGETS[lvl] || XP_BUDGETS[20];
        return {
            easy: acc.easy + b.easy,
            medium: acc.medium + b.medium,
            hard: acc.hard + b.hard,
            deadly: acc.deadly + b.deadly,
        };
    }, { easy: 0, medium: 0, hard: 0, deadly: 0 }) : { easy: 0, medium: 0, hard: 0, deadly: 0 };

    const currentTotalXP = monsters.reduce((acc, m) => acc + (CR_XP[m.cr] || 0), 0);
    const difficulty = getEncounterDifficulty(currentTotalXP, playerLevels);

    const handleAdd = () => {
        if (!name) return;
        const newMonster: Monster = {
            id: Date.now().toString(),
            name,
            cr,
            hp,
            ac,
            actions: ['Ataque Básico']
        };
        setMonsters(prev => [...prev, newMonster]);
        setName('');
        setShowAdd(false);
    };

    return (
        <div className="space-y-6">
            <div className="bg-[#1e293b] rounded-3xl p-6 border border-white/5 shadow-2xl space-y-5">
                <div className="flex flex-col items-center text-center space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Presupuesto Táctico</span>
                    <h2 className="text-2xl font-serif italic font-bold text-white">Equilibrio del Encuentro</h2>
                    <p className="text-[9px] font-black uppercase text-blue-400 tracking-tighter">Para {playerLevels.length} Aventureros (Promedio Nivel {Math.round(playerLevels.reduce((a, b) => a + b, 0) / (playerLevels.length || 1))})</p>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {Object.entries(budgets).map(([diff, xp]) => (
                        <div key={diff} className={`flex flex-col items-center bg-black/20 rounded-xl p-2 border ${difficulty.toLowerCase() === diff.toLowerCase() ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/5'}`}>
                            <span className={`text-[7px] font-black uppercase ${difficulty.toLowerCase() === diff.toLowerCase() ? 'text-blue-400' : 'text-slate-500'}`}>{diff}</span>
                            <span className="text-xs font-bold text-white leading-none">{xp}</span>
                        </div>
                    ))}
                </div>

                <div className="pt-2">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-black uppercase text-slate-500">XP Total Actual</span>
                        <span className={`text-sm font-black ${difficulty === 'DEADLY' ? 'text-red-500 animate-pulse' : difficulty === 'HARD' ? 'text-orange-500' : 'text-emerald-500'}`}>{currentTotalXP} ({difficulty})</span>
                    </div>
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5 shadow-inner">
                        <div 
                            className={`h-full transition-all duration-700 ${difficulty === 'DEADLY' ? 'bg-red-500' : difficulty === 'HARD' ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${Math.min((currentTotalXP / (budgets.deadly || 1)) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center px-2">
                <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest leading-none">Bestiario del Encuentro</h3>
                <button 
                    onClick={() => setShowAdd(true)}
                    className="size-8 rounded-full bg-blue-600 flex items-center justify-center border-4 border-[#0f172a] shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                >
                    <span className="material-symbols-outlined text-[18px] text-white">add</span>
                </button>
            </div>

            {showAdd && (
                <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-blue-500/20 space-y-4 animate-slideDown shadow-2xl">
                    <h3 className="text-sm font-black uppercase text-blue-400">Constructor de Monstruos</h3>
                    <div className="space-y-3">
                        <input 
                            type="text" 
                            placeholder="Nombre (Ej: Orco Guerrero)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase text-slate-500 pl-1">CR (Desafío)</label>
                                <select 
                                    value={cr}
                                    onChange={(e) => setCr(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white appearance-none outline-none focus:border-blue-500/50"
                                >
                                    {Object.keys(CR_XP).map(val => <option key={val} value={val} className="bg-slate-900">{val}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase text-slate-500 pl-1">HP (Vida)</label>
                                <input 
                                    type="number" 
                                    value={hp}
                                    onChange={(e) => setHp(parseInt(e.target.value))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                             <button onClick={() => setShowAdd(false)} className="flex-1 py-3 bg-white/5 text-slate-400 font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-white/10 transition-colors">Cancelar</button>
                             <button onClick={handleAdd} className="flex-1 py-3 bg-blue-600 text-white font-bold uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-blue-900/40">Engendrar</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-4 pb-20">
                {monsters.length === 0 && (
                    <div className="text-center py-10 italic text-slate-600 font-medium">Aún no has convocado enemigos para este desafío...</div>
                )}
                {monsters.map(m => (
                    <div key={m.id} className="bg-[#1e293b] rounded-2xl p-4 border border-white/5 shadow-xl flex justify-between items-center group active:scale-[0.98] transition-all">
                        <div className="flex gap-4">
                            <div className="size-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl">skull</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white group-hover:text-red-400 transition-colors uppercase tracking-tight">{m.name}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-500 font-black uppercase">CR {m.cr}</span>
                                    <span className="text-slate-700 text-[10px]">•</span>
                                    <span className="text-[10px] text-emerald-500 font-bold uppercase">{m.hp} HP</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setMonsters(prev => prev.filter(x => x.id !== m.id))}
                            className="size-10 rounded-full bg-white/5 border border-white/5 text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonsterBuilder;
