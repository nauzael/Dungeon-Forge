import { useState, useEffect, useCallback } from 'react';
import { Character, InitiativeCombatant } from '../types';

/**
 * Encapsula la lógica del Initiative Tracker:
 * - Load combatants from localStorage
 * - Sync combatants when members change
 * - Save combatants to localStorage
 */
export const useInitiativeTracker = (partyId: string | null, members: Character[]) => {
  const [initiativeCombatants, setInitiativeCombatants] = useState<InitiativeCombatant[]>([]);

  // Build initial state from members
  const buildInitiativeState = useCallback((
    currentCombatants: InitiativeCombatant[],
    partyMembers: Character[]
  ): InitiativeCombatant[] => {
    const playerMap = new Map(
      currentCombatants.filter((combatant) => combatant.isPlayer).map((combatant) => [combatant.id, combatant])
    );

    const syncedPlayers: InitiativeCombatant[] = partyMembers.map((member) => {
      const existing = playerMap.get(member.id);
      return {
        id: member.id,
        name: member.name,
        initiative: existing?.initiative ?? null,
        isPlayer: true,
        isCurrentTurn: existing?.isCurrentTurn ?? false,
        ac: member.ac,
        hp: member.hp,
      };
    });

    const monsters = currentCombatants.filter((combatant) => !combatant.isPlayer);
    return [...syncedPlayers, ...monsters];
  }, []);

  // Load combatants from localStorage on party change
  useEffect(() => {
    if (!partyId) {
      setInitiativeCombatants([]);
      return;
    }

    try {
      const raw = localStorage.getItem(`df-dm-initiative-${partyId}`);
      if (!raw) {
        setInitiativeCombatants([]);
        return;
      }

      const parsed = JSON.parse(raw) as InitiativeCombatant[];
      if (!Array.isArray(parsed)) {
        setInitiativeCombatants([]);
        return;
      }

      setInitiativeCombatants(parsed);
    } catch (e) {
      setInitiativeCombatants([]);
    }
  }, [partyId]);

  // Save combatants to localStorage
  useEffect(() => {
    if (!partyId) return;

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(`df-dm-initiative-${partyId}`, JSON.stringify(initiativeCombatants));
      } catch { /* ignore localStorage write error */ }
    }, 300);

    return () => clearTimeout(timer);
  }, [initiativeCombatants, partyId]);

  // Sync combatants when members change
  useEffect(() => {
    setInitiativeCombatants((prev) => buildInitiativeState(prev, members));
  }, [members, buildInitiativeState]);

  return { initiativeCombatants, setInitiativeCombatants };
};
