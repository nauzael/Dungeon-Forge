import React, { useState, useMemo, useEffect } from 'react';
import { Character, BeastStats } from '../../../types';
import { 
  getAvailableBeasts, 
  getMaxCRForLevel, 
  getTHPForWildShape,
  calculateWildShapeAC,
  isLunarRadianceAvailable,
  getKnownFormsCount
} from '../../../utils/wildShapeUtils';
import { getBeastsForLevel } from '../../../Data/beasts';
import { useModalScrollLock } from '../../../hooks/useModalScrollLock';

interface WildShapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onSelect: (beast: BeastStats) => void;
  onUpdate: (character: Character) => void;
}

const BEAST_ICONS: Record<string, string> = {
  'Lobo': 'pets',
  'Araña': 'bug_report',
  'Rata': 'pets',
  'Caballo de monta': 'directions_car',
  'Caballo de guerra': 'military_tech',
  'Jabalí': 'pets',
  'Búho gigante': 'nightlight_round',
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

const WildShapeModal: React.FC<WildShapeModalProps> = ({
  isOpen,
  onClose,
  character,
  onSelect,
  onUpdate
}) => {
  const [selectedBeast, setSelectedBeast] = useState<BeastStats | null>(null);
  const [isManagingForms, setIsManagingForms] = useState(false);
  
  const { lockScroll, unlockScroll } = useModalScrollLock();
  
  // Manejar scroll lock cuando el modal se abre/cierra
  useEffect(() => {
    if (isOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
    
    // Cleanup cuando el componente se desmonta
    return () => {
      unlockScroll();
    };
  }, [isOpen, lockScroll, unlockScroll]);
  
  const isCircleOfTheMoon = character.subclass === 'Circle of the Moon';
  const druidLevel = character.level;
  const maxCR = getMaxCRForLevel(druidLevel, isCircleOfTheMoon);
  const thp = getTHPForWildShape(druidLevel, isCircleOfTheMoon);
  const lunarRadianceAvailable = isLunarRadianceAvailable(druidLevel);
  const canFly = isCircleOfTheMoon || druidLevel >= 8;
  const maxKnownForms = getKnownFormsCount(druidLevel);
  
  // Bestias disponibles para transformación (solo formas conocidas)
  const availableBeasts = useMemo(() => {
    return getAvailableBeasts(druidLevel, isCircleOfTheMoon, character.wildShapeForms);
  }, [druidLevel, isCircleOfTheMoon, character.wildShapeForms]);
  
  // Todas las bestias elegibles para gestión de formas
  const allEligibleBeasts = useMemo(() => {
    const allBeasts = getBeastsForLevel(druidLevel);
    return allBeasts.filter(beast => {
      if (beast.cr > maxCR) return false;
      if (beast.flySpeed && !canFly) return false;
      return true;
    });
  }, [druidLevel, maxCR, canFly]);
  
  const beastsToShow = isManagingForms ? allEligibleBeasts : availableBeasts;
  
  const beastsByCR = useMemo(() => {
    const grouped: Record<number, BeastStats[]> = {};
    beastsToShow.forEach(beast => {
      const cr = beast.cr;
      if (!grouped[cr]) grouped[cr] = [];
      grouped[cr].push(beast);
    });
    return grouped;
  }, [beastsToShow]);
  
  if (!isOpen) return null;
  
  const handleSelect = () => {
    if (selectedBeast) {
      if (isManagingForms) {
        // Gestionar formas conocidas
        const currentForms = character.wildShapeForms || [];
        const isKnown = currentForms.includes(selectedBeast.name);
        
        if (isKnown) {
          // Remover forma conocida
          const newForms = currentForms.filter(name => name !== selectedBeast.name);
          onUpdate({
            ...character,
            wildShapeForms: newForms
          });
          setSelectedBeast(null);
        } else if (currentForms.length < maxKnownForms) {
          // Agregar forma conocida
          const newForms = [...currentForms, selectedBeast.name];
          onUpdate({
            ...character,
            wildShapeForms: newForms
          });
          setSelectedBeast(null);
        }
      } else {
        // Transformar
        onSelect(selectedBeast);
        setSelectedBeast(null);
        onClose();
      }
    }
  };
  
  const toggleMode = () => {
    setIsManagingForms(!isManagingForms);
    setSelectedBeast(null);
  };
  
  const previewAC = selectedBeast 
    ? calculateWildShapeAC(character, selectedBeast.ac)
    : 0;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" style={{ height: '100dvh' }}>
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-sm max-h-[80dvh] mx-4 bg-background-dark border border-white/10 rounded-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">
              nature
            </span>
            <h2 className="text-lg font-bold text-white">
              {isManagingForms ? 'Gestionar Formas' : 'Wild Shape'}
            </h2>
            {isCircleOfTheMoon && (
              <span className="text-xs bg-moon/20 text-moon px-2 py-0.5 rounded-full">
                🌙 Circle of the Moon
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMode}
              className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isManagingForms ? 'Transformar' : 'Gestionar'}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-white/60">close</span>
            </button>
          </div>
        </div>
        
        <div className="p-3 bg-card-dark/50 border-b border-white/5">
          <div className="flex items-center justify-between text-xs text-white/60">
            {isManagingForms ? (
              <>
                <span>Formas conocidas: <span className="text-primary font-bold">{(character.wildShapeForms || []).length}/{maxKnownForms}</span></span>
                <span>Máximo CR: <span className="text-primary font-bold">{maxCR}</span></span>
              </>
            ) : (
              <>
                <span>CR Máximo: <span className="text-primary font-bold">{maxCR}</span></span>
                <span>THP al transformar: <span className="text-green-400 font-bold">+{thp}</span></span>
              </>
            )}
          </div>
          {canFly && !isManagingForms && (
            <div className="mt-1 text-[10px] text-primary/80 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">flight</span>
              Fly Speed disponible
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.entries(beastsByCR).sort(([a], [b]) => Number(a) - Number(b)).map(([cr, beasts]) => (
            <div key={cr}>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
                CR {cr}
              </div>
              <div className="space-y-2">
                {beasts.map((beast) => {
                  const isKnown = isManagingForms && (character.wildShapeForms || []).includes(beast.name);
                  
                  return (
                    <button
                      key={beast.name}
                      onClick={() => setSelectedBeast(beast)}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        selectedBeast?.name === beast.name
                          ? 'bg-primary/20 border-primary/50'
                          : 'bg-card-dark border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-white/40 text-2xl">
                          {getBeastIcon(beast.name)}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white">{beast.name}</span>
                            <div className="flex items-center gap-2">
                              {isManagingForms && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  isKnown 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-white/10 text-white/40'
                                }`}>
                                  {isKnown ? 'Conocida' : 'Disponible'}
                                </span>
                              )}
                              <span className="text-xs text-white/40">
                                HP {beast.hp} | AC {beast.ac}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-white/50">
                            <span>{beast.size}</span>
                            <span>•</span>
                            <span>{beast.speed}m</span>
                            {beast.flySpeed && (
                              <>
                                <span>•</span>
                                <span className="text-primary">{beast.flySpeed}m fly</span>
                              </>
                            )}
                            {beast.swimSpeed && (
                              <>
                                <span>•</span>
                                <span className="text-blue-400">{beast.swimSpeed}m swim</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          
          {availableBeasts.length === 0 && (
            <div className="text-center py-8 text-white/40">
              <span className="material-symbols-outlined text-4xl mb-2">pets</span>
              <p>No hay bestias disponibles</p>
            </div>
          )}
        </div>
        
        {selectedBeast && (
          <div className="p-4 border-t border-white/10 bg-card-dark/80">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-primary text-2xl">
                {getBeastIcon(selectedBeast.name)}
              </span>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">{selectedBeast.name}</div>
                <div className="text-xs text-white/50">
                  HP {selectedBeast.hp} | AC {previewAC} | THP +{thp}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-6 gap-1 text-[10px] text-white/60 mb-3">
              <div className="text-center">
                <div className="font-bold text-white/70">FUE</div>
                <div>{selectedBeast.stats.STR}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white/70">DES</div>
                <div>{selectedBeast.stats.DEX}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white/70">CON</div>
                <div>{selectedBeast.stats.CON}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white/70">INT</div>
                <div>{selectedBeast.stats.INT}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white/70">SAB</div>
                <div>{selectedBeast.stats.WIS}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white/70">CAR</div>
                <div>{selectedBeast.stats.CHA}</div>
              </div>
            </div>
            
            {selectedBeast.attacks.length > 0 && (
              <div className="mb-3 text-[10px] text-white/50">
                <div className="font-bold text-white/70 mb-1">Ataques:</div>
                {selectedBeast.attacks.map((atk, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="text-primary">+{atk.attackBonus}</span>
                    <span>{atk.name}:</span>
                    <span>{atk.damage} {atk.damageType}</span>
                    {atk.effect && (
                      <span className="text-white/40">({atk.effect})</span>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={handleSelect}
              disabled={isManagingForms && selectedBeast && (character.wildShapeForms || []).includes(selectedBeast.name) && (character.wildShapeForms || []).length <= 1}
              className="w-full py-3 px-4 rounded-lg bg-primary hover:bg-primary/80 disabled:bg-gray-500 disabled:cursor-not-allowed text-black font-bold transition-colors"
            >
              {isManagingForms ? (
                selectedBeast && (character.wildShapeForms || []).includes(selectedBeast.name) ? 
                  'Remover Forma' : 
                  'Agregar Forma'
              ) : (
                'Transformar'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WildShapeModal;
