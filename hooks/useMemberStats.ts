import { useMemo } from 'react';
import { Character } from '../types';
import { getArmorClass, getSpellSlotSummary, getFinalStats } from '../utils/sheetUtils';

/**
 * Memoizes calculations para members del DM
 */
export const useMemberStats = (member: Character | null) => {
  const finalStats = useMemo(() => {
    if (!member) return null;
    return getFinalStats(member);
  }, [member]);

  const armorClass = useMemo(() => {
    if (!member || !finalStats) return 0;
    return getArmorClass(member, finalStats);
  }, [member, finalStats]);

  const spellSlots = useMemo(() => {
    if (!member) return null;
    return getSpellSlotSummary(member);
  }, [member]);

  return { finalStats, armorClass, spellSlots };
};
