import React from 'react';
import { Character, WildShapeState, BeastStats } from '../../../types';
import { getBeastByName, getDurationHours } from '../../../utils/wildShapeUtils';

interface WildShapePanelProps {
  character: Character;
  wildShapeState: WildShapeState | null;
  onTransform: () => void;
  onRestore: () => void;
}

const BEAST_ICONS: Record<string, string> = {
  'Lobo': 'pets',
  'Araña': 'bug_report',
  'Rata': 'pets',
  'Caballo de monta': 'directions_car',
  'Caballo de guerra': 'military_tech',
  'Jabalí': 'pets',
  'Búho gigante': 'nightlight',
  'Cocodrilo': 'water',
  'Oso pardo': 'pets',
  'León': 'pets',
  'Tigre': 'pets',
  'Águila gigante': 'flight',
  'Serpiente constrictora gigante': 'bug_report',
  'Hiena gigante': 'pets',
  'Pulpo gigante': 'water',
};

const getBeastIcon = (name: string): string => {
  return BEAST_ICONS[name] || 'pets';
};

const WildShapePanel: React.FC<WildShapePanelProps> = ({
  character,
  wildShapeState,
  onTransform,
  onRestore
}) => {
  const isDruid = character.class === 'Druid';
  const isCircleOfTheMoon = character.subclass === 'Circle of the Moon';
  const hasUses = (character.wildShape?.current ?? 0) > 0;
  const isTransformed = !!wildShapeState;
  
  if (!isDruid || character.level < 2) {
    return null;
  }
  
  const currentBeast = isTransformed 
    ? getBeastByName(wildShapeState.form)
    : null;
  
  const displayAC = isTransformed && currentBeast
    ? character.ac
    : character.ac;

  const beastAttacks = isTransformed
    ? (wildShapeState.attacks && wildShapeState.attacks.length > 0
        ? wildShapeState.attacks
        : currentBeast?.attacks ?? [])
    : [];
  
  return (
    <div className="bg-card-dark rounded-lg border border-white/10 overflow-hidden">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">
              nature
            </span>
            <span className="text-sm font-bold text-white">
              Wild Shape
            </span>
            {isCircleOfTheMoon && (
              <span className="text-[10px] bg-moon/20 text-moon px-1.5 py-0.5 rounded-full">
                🌙 Luna
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: character.wildShape?.max ?? 0 }).map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < (character.wildShape?.current ?? 0)
                    ? 'bg-primary'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
        
        {!isTransformed ? (
          <button
            onClick={onTransform}
            disabled={!hasUses}
            className={`w-full py-2 px-3 rounded-lg text-sm font-bold transition-all ${
              hasUses
                ? 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30'
                : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
            }`}
          >
            {hasUses ? 'Transformar' : 'Sin usos disponibles'}
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-primary/10 rounded-lg p-2 border border-primary/20">
              <span className="material-symbols-outlined text-primary text-xl">
                {getBeastIcon(wildShapeState.form)}
              </span>
              <div className="flex-1">
                <div className="text-sm font-bold text-primary">
                  {wildShapeState.form}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-white/60">
                  <span>AC {displayAC}</span>
                  <span>•</span>
                  <span>+{wildShapeState.thpGained} THP</span>
                  <span>•</span>
                  <span>~{getDurationHours(character.level)}h</span>
                </div>
              </div>
            </div>
            
            {currentBeast && (
              <div className="grid grid-cols-6 gap-1 text-[9px] text-white/50">
                <div className="text-center">
                  <div className="font-bold text-white/70">FUE</div>
                  <div>{currentBeast.stats.STR}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white/70">DES</div>
                  <div>{currentBeast.stats.DEX}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white/70">CON</div>
                  <div>{currentBeast.stats.CON}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white/70">INT</div>
                  <div>{currentBeast.stats.INT}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white/70">SAB</div>
                  <div>{currentBeast.stats.WIS}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white/70">CAR</div>
                  <div>{currentBeast.stats.CHA}</div>
                </div>
              </div>
            )}
            
            {beastAttacks.length > 0 && (
              <div className="rounded-xl bg-white/5 p-3 border border-white/10 text-[10px] text-white/70 space-y-2">
                <div className="font-bold text-white/80 uppercase tracking-[0.15em] text-[11px]">Ataques de la forma</div>
                {beastAttacks.map((attack, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-1 text-white">
                      <span className="text-primary font-bold">+{attack.attackBonus}</span>
                      <span className="font-semibold">{attack.name}</span>
                      <span className="text-white/50">{attack.damage} {attack.damageType}</span>
                    </div>
                    {attack.effect && (
                      <div className="text-white/40 text-[9px]">{attack.effect}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={onRestore}
              className="w-full py-2 px-3 rounded-lg text-sm font-bold bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-all"
            >
              Terminar Forma
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WildShapePanel;
