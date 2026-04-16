import { useCallback, useMemo } from 'react';
import { Character } from '../types';
import {
    isBarbarian,
    canActivateRage,
    activateRage,
    deactivateRage,
    resetRageUses,
    getRageUses,
    getRageDamage,
    getDangerSenseBonus,
    getStrengthAdvantage,
    getVitalityOfTheTreeHP,
    getDivineFuryDamage,
    isRecklessAttackActive,
} from '../utils/rageUtils';

interface RageState {
    isRaging: boolean;
    isRecklessAttack: boolean;
    usesRemaining: number;
    maxUses: number;
    rageDamage: number;
    dangerSense: boolean;
    strengthAdvantage: boolean;
    vitalityHP: number;
    divineFuryDamage: number;
    canActivate: boolean;
    isUnlimited: boolean;
}

interface UseRageReturn {
    state: RageState;
    toggleRage: () => Partial<Character>;
    activateRageAction: () => Partial<Character>;
    deactivateRageAction: () => Partial<Character>;
    toggleRecklessAttack: () => Partial<Character>;
    resetUses: () => Partial<Character>;
}

export const useRage = (character: Character, onUpdate?: (update: Partial<Character>) => void): UseRageReturn => {
    const barbarianCheck = useMemo(() => isBarbarian(character), [character]);
    
    const state = useMemo<RageState>(() => {
        if (!barbarianCheck) {
            return {
                isRaging: false,
                isRecklessAttack: false,
                usesRemaining: 0,
                maxUses: 0,
                rageDamage: 0,
                dangerSense: false,
                strengthAdvantage: false,
                vitalityHP: 0,
                divineFuryDamage: 0,
                canActivate: false,
                isUnlimited: false,
            };
        }
        
        const rageMax = getRageUses(character.level);
        const rageUnlimited = character.level >= 20;
        const rageCurrent = character.rageUses?.current ?? rageMax;
        
        return {
            isRaging: character.isRaging || false,
            isRecklessAttack: character.isRecklessAttack || false,
            usesRemaining: rageCurrent,
            maxUses: rageMax,
            rageDamage: getRageDamage(character.level),
            dangerSense: getDangerSenseBonus(character),
            strengthAdvantage: getStrengthAdvantage(character),
            vitalityHP: getVitalityOfTheTreeHP(character),
            divineFuryDamage: getDivineFuryDamage(character),
            canActivate: canActivateRage(character),
            isUnlimited: rageUnlimited,
        };
    }, [barbarianCheck, character.isRaging, character.isRecklessAttack, character.level, character.rageUses, character.subclass]);
    
    const toggleRage = useCallback(() => {
        if (!barbarianCheck || !onUpdate) return {};
        
        if (state.isRaging) {
            return deactivateRage(character);
        } else {
            return activateRage(character);
        }
    }, [barbarianCheck, onUpdate, state.isRaging, character]);
    
    const activateRageAction = useCallback(() => {
        if (!barbarianCheck || !onUpdate) return {};
        return activateRage(character);
    }, [barbarianCheck, onUpdate, character]);
    
    const deactivateRageAction = useCallback(() => {
        if (!barbarianCheck || !onUpdate) return {};
        return deactivateRage(character);
    }, [barbarianCheck, onUpdate, character]);
    
    const toggleRecklessAttack = useCallback(() => {
        if (!barbarianCheck || !onUpdate) return {};
        
        return {
            isRecklessAttack: !isRecklessAttackActive(character),
        };
    }, [barbarianCheck, onUpdate, character]);
    
    const resetUses = useCallback(() => {
        if (!barbarianCheck || !onUpdate) return {};
        return resetRageUses(character);
    }, [barbarianCheck, onUpdate, character]);
    
    return {
        state,
        toggleRage,
        activateRageAction,
        deactivateRageAction,
        toggleRecklessAttack,
        resetUses,
    };
};
