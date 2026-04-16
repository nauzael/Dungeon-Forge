import React, { useState } from 'react';
import { CRITICAL_TABLE, FUMBLE_TABLE, rollOnTable, CriticalEffect } from '../../Data/dm/criticalTables';

type TableType = 'critical' | 'fumble' | null;

interface CriticalFumbleTableProps {
  onApplyDamage?: (damage: string) => void;
}

const CriticalFumbleTable: React.FC<CriticalFumbleTableProps> = ({ onApplyDamage }) => {
  const [activeTable, setActiveTable] = useState<TableType>(null);
  const [currentResult, setCurrentResult] = useState<CriticalEffect | null>(null);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const selectAction = (tableType: TableType, rollValue: number) => {
    setActiveTable(tableType);
    setDiceRoll(rollValue);
    const table = tableType === 'critical' ? CRITICAL_TABLE : FUMBLE_TABLE;
    const result = rollOnTable(table, rollValue);
    setCurrentResult(result);
  };

  const handleRandom = () => {
    if (!activeTable) return;
    setIsRolling(true);
    const rollValue = Math.floor(Math.random() * 20) + 1;
    setTimeout(() => {
      selectAction(activeTable, rollValue);
      setIsRolling(false);
    }, 500);
  };

  const reset = () => {
    setActiveTable(null);
    setCurrentResult(null);
    setDiceRoll(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined">casino</span>
          Critical & Fumble Tables
        </h3>
      </div>

      {/* Table Toggle */}
      <div className="flex bg-white/5 p-1 rounded-xl gap-1">
        <button
          onClick={() => { setActiveTable('critical'); setCurrentResult(null); setDiceRoll(null); }}
          className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTable === 'critical' 
              ? 'bg-amber-500 text-white shadow-lg' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="text-xl">⚔️</span>
          CRÍTICOS (NAT 20)
        </button>
        <button
          onClick={() => { setActiveTable('fumble'); setCurrentResult(null); setDiceRoll(null); }}
          className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTable === 'fumble' 
              ? 'bg-red-600 text-white shadow-lg' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="text-xl">💀</span>
          PIFIAS (NAT 1)
        </button>
      </div>

      {/* Manual Roll Selector Grid */}
      {activeTable && !isRolling && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Selecciona el resultado del dado:</p>
            <button 
              onClick={handleRandom}
              className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">casino</span>
              Aleatorio
            </button>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => selectAction(activeTable, num)}
                className={`aspect-square rounded-lg flex items-center justify-center font-black text-sm transition-all border ${
                  diceRoll === num
                    ? activeTable === 'critical'
                      ? 'bg-amber-500 border-amber-400 text-white scale-110 shadow-lg'
                      : 'bg-red-600 border-red-500 text-white scale-110 shadow-lg'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rolling Animation */}
      {isRolling && (
        <div className="bg-black/40 rounded-xl p-8 text-center">
          <div className="text-6xl font-black text-white animate-pulse">
            ?
          </div>
          <p className="text-slate-400 text-sm mt-2">Rolling...</p>
        </div>
      )}

      {/* Result Display */}
      {currentResult && !isRolling && (
        <div className={`rounded-xl overflow-hidden ${
          activeTable === 'critical' 
            ? 'bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/30' 
            : 'bg-gradient-to-br from-red-900/40 to-red-950/40 border border-red-500/30'
        }`}>
          {/* Header */}
          <div className={`px-4 py-3 ${
            activeTable === 'critical' 
              ? 'bg-amber-500/20' 
              : 'bg-red-500/20'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-3xl ${activeTable === 'critical' ? 'text-amber-400' : 'text-red-400'}`}>
                  {diceRoll === 20 ? '🎯' : diceRoll === 1 ? '💀' : '🎲'}
                </span>
                <div>
                  <p className={`font-black text-lg ${activeTable === 'critical' ? 'text-amber-300' : 'text-red-300'}`}>
                    {activeTable === 'critical' ? 'CRITICAL HIT!' : 'FUMBLE!'}
                  </p>
                  <p className="text-slate-400 text-xs">Roll: {diceRoll}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-amber-500 text-lg">swords</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Ataque Físico</span>
              </div>
              <p className="text-white text-sm leading-relaxed">
                {currentResult.physical}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-blue-400 text-lg">auto_awesome</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Ataque Mágico</span>
              </div>
              <p className="text-white text-sm leading-relaxed">
                {currentResult.magic}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleRandom}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">casino</span>
                Tirar de nuevo
              </button>
              
              {onApplyDamage && activeTable === 'critical' && currentResult.roll === 1 && (
                <button
                  onClick={() => onApplyDamage('max')}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  Max Damage
                </button>
              )}

              <button
                onClick={reset}
                className="px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl text-sm transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Text */}
      {!activeTable && !isRolling && (
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-slate-400 text-xs text-center leading-relaxed">
            Selecciona una tabla para ver los efectos de Críticos o Pifias. 
            Podrás elegir el resultado manualmente o lanzar el dado virtual.
          </p>
        </div>
      )}

    </div>
  );
};

export default CriticalFumbleTable;
