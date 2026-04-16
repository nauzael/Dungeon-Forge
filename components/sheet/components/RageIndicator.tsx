import React, { useState } from 'react';
import { Character } from '../../../types';
import { useRage } from '../../../hooks/useRage';

interface RageIndicatorProps {
    character: Character;
    onUpdate: (update: Partial<Character>) => void;
    isReadOnly?: boolean;
}

export const RageIndicator: React.FC<RageIndicatorProps> = ({ character, onUpdate, isReadOnly }) => {
    const { state, toggleRage, toggleRecklessAttack } = useRage(character, onUpdate);
    const [showConfirmModal, setShowConfirmModal] = useState<'activate' | 'deactivate' | null>(null);
    
    if (character.class !== 'Barbarian') return null;
    
    const handleToggleRage = () => {
        if (isReadOnly) return;
        
        if (state.isRaging) {
            setShowConfirmModal('deactivate');
        } else {
            setShowConfirmModal('activate');
        }
    };
    
    const confirmAction = () => {
        const update = toggleRage();
        if (Object.keys(update).length > 0) {
            onUpdate(update);
        }
        setShowConfirmModal(null);
    };
    
    const cancelAction = () => {
        setShowConfirmModal(null);
    };
    
    const handleToggleReckless = () => {
        if (isReadOnly) return;
        const update = toggleRecklessAttack();
        if (Object.keys(update).length > 0) {
            onUpdate(update);
        }
    };
    
    const rageDamage = state.rageDamage;
    const worldTreeHP = character.subclass === 'Path of the World Tree' ? character.level : 0;
    const divineFuryDamage = character.subclass === 'Path of the Zealot' ? (1 + Math.floor(character.level / 2)) : 0;
    
    const getSubclassAbilityText = () => {
        const subclass = character.subclass;
        const abilities: string[] = [];
        
        if (subclass === 'Path of the World Tree') {
            abilities.push(`🌳 Vitality of the Tree: +${worldTreeHP} temporary HP`);
        }
        if (subclass === 'Path of the Zealot') {
            abilities.push(`⚡ Divine Fury: +${divineFuryDamage} damage to enemies below max HP`);
        }
        if (subclass === 'Path of the Berserker') {
            abilities.push(`😤 Frenzy: Extra attack after taking damage`);
        }
        if (subclass === 'Path of the Wild Heart') {
            abilities.push(`🐺 Primal Companion: Summon a beast companion`);
        }
        
        return abilities;
    };
    
    return (
        <>
            <div className="flex flex-col gap-3">
                <div className="relative mt-[5px] mb-[5px]">
                    <button
                        onClick={handleToggleRage}
                        onTouchEnd={(e) => { e.preventDefault(); handleToggleRage(); }}
                        disabled={isReadOnly || (!state.canActivate && !state.isRaging)}
                        className={`
                            w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl 
                            transition-all duration-300 transform
                            ${state.isRaging 
                                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse' 
                                : 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-600 dark:text-orange-400 hover:from-orange-500/30 hover:to-orange-600/30 border border-orange-500/30'}
                            ${(!state.canActivate && !state.isRaging) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                        `}
                    >
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-xl">
                                {state.isRaging ? 'local_fire_department' : 'whatshot'}
                            </span>
                            <span className="font-bold">
                                {state.isRaging ? 'FURIOUS' : 'RAGE'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium opacity-80">
                                {state.isRaging ? '🔥' : `${state.usesRemaining}/${state.maxUses}`}
                            </span>
                        </div>
                    </button>
                    
                    {!state.canActivate && !state.isRaging && (
                        <p className="text-xs text-slate-500 text-center mt-1">No charges remaining</p>
                    )}
                    
                    {state.isRaging && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {rageDamage > 0 && (
                                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs">
                                    <span className="material-symbols-outlined text-sm">local_fire_department</span>
                                    +{rageDamage} damage
                                </div>
                            )}
                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs">
                                <span className="material-symbols-outlined text-sm">shield</span>
                                B/P/S Resist
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs">
                                <span className="material-symbols-outlined text-sm">fitness_center</span>
                                STR Adv
                            </div>
                            {character.subclass === 'Path of the World Tree' && worldTreeHP > 0 && (
                                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-xs">
                                    <span className="material-symbols-outlined text-sm">forest</span>
                                    +{worldTreeHP} temp HP
                                </div>
                            )}
                            {character.subclass === 'Path of the Zealot' && divineFuryDamage > 0 && (
                                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs">
                                    <span className="material-symbols-outlined text-sm">bolt</span>
                                    Divine +{divineFuryDamage}
                                </div>
                            )}
                            {character.subclass === 'Path of the Berserker' && (
                                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs">
                                    <span className="material-symbols-outlined text-sm">mood</span>
                                    Frenzy +{state.isRecklessAttack ? rageDamage : 0}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                {character.subclass === 'Path of the Berserker' && (
                    <button
                        onClick={handleToggleReckless}
                        onTouchEnd={(e) => { e.preventDefault(); handleToggleReckless(); }}
                        disabled={isReadOnly}
                        className={`
                            w-full flex items-center justify-between gap-3 px-4 py-2 rounded-xl 
                            transition-all duration-200
                            ${state.isRecklessAttack 
                                ? 'bg-gradient-to-r from-yellow-500/30 to-yellow-600/30 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30' 
                                : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}
                            ${isReadOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                        `}
                    >
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">psychology</span>
                            <span className="text-sm font-medium">Reckless Attack</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${state.isRecklessAttack ? 'bg-yellow-500' : 'bg-slate-400'}`} />
                            <span className="text-xs opacity-70">{state.isRecklessAttack ? 'ON' : 'OFF'}</span>
                        </div>
                    </button>
                )}
            </div>
            
            {showConfirmModal && (
                <div 
                    className="fixed left-0 top-0 right-0 bottom-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
                    style={{ position: 'fixed', height: '100vh', width: '100vw' }}
                >
                    <div className="bg-white dark:bg-[#1a2235] rounded-2xl p-5 shadow-2xl animate-scaleIn" style={{ width: '100%', maxWidth: '320px' }}>
                        <div className="flex flex-col items-center text-center">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="material-symbols-outlined text-3xl text-orange-500">warning</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {showConfirmModal === 'activate' ? 'Start Rage?' : 'End Rage?'}
                                </h3>
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400 mb-5">
                                {showConfirmModal === 'activate' 
                                    ? (
                                        <div className="text-left">
                                            <span className="font-semibold">🔥 Rage Active:</span>
                                            <ul className="mt-2 space-y-1 text-xs opacity-90">
                                                <li>• +{rageDamage} damage</li>
                                                <li>• Resistance to Bludgeoning, Piercing, and Slashing</li>
                                                <li>• Advantage on Strength checks/saves</li>
                                            </ul>
                                            {getSubclassAbilityText().length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-slate-300/30">
                                                    <span className="font-semibold">✨ {character.subclass}:</span>
                                                    <ul className="mt-1 space-y-1 text-xs opacity-90">
                                                        {getSubclassAbilityText().map((ability, i) => (
                                                            <li key={i}>{ability}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )
                                    : <span>End your Rage? You'll lose all Rage bonuses.</span>}
                            </div>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={cancelAction}
                                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmAction}
                                    className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-colors ${
                                        showConfirmModal === 'activate'
                                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                                            : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                                    }`}
                                >
                                    {showConfirmModal === 'activate' ? 'Start Rage' : 'End Rage'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
