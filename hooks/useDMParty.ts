import { useState, useEffect, useRef, useCallback } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { supabase, createParty, subscribeWithRetry, removeFromParty, updatePartyName, deleteParty } from '../utils/firebase';
import { debugLogger } from '../utils/debugLogger';
import { Character } from '../types';

interface Party {
  id: string;
  name: string;
  code: string;
}

/**
 * Encapsula toda la lógica de gestión de parties del DM:
 * - Fetch parties
 * - Create/delete/update party
 * - Fetch members
 * - Realtime subscription
 * - Kick character
 */
export const useDMParty = (userId: string | null) => {
  const [party, setParty] = useState<Party | null>(null);
  const [parties, setParties] = useState<Party[]>([]);
  const [members, setMembers] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'error' | 'reconnecting'>('connecting');
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper: Deduplicate with Map lookup (O(1)) - Con validación defensiva contra fantasmas
  const deduplicateAndMerge = useCallback((current: Character[], incoming: Character, partyId?: string): Character[] => {
    // DEFENSA CRÍTICA: Si incoming no tiene party_id, NUNCA lo reinsertes (es un fantasma siendo removido)
    if (!incoming.party_id && partyId) {
      console.log(`[DEDUP-GHOST-PREVENTION] Rechazando character ${incoming.id} - party_id es null`);
      // Solo retorna los actuales, ignora incoming
      return current;
    }
    
    const dedupMap = new Map<string, Character>();
    
    for (const char of current) {
      dedupMap.set(char.id, char);
    }
    
    const existing = dedupMap.get(incoming.id);
    if (!existing) {
      dedupMap.set(incoming.id, incoming);
    } else {
      const incomingTime = incoming.syncTimestamp || 0;
      const existingTime = existing.syncTimestamp || 0;
      if (incomingTime > existingTime) {
        dedupMap.set(incoming.id, incoming);
      }
    }
    
    return Array.from(dedupMap.values());
  }, []);

  // Helper: Remove duplicates from array
  const removeDuplicates = useCallback((chars: Character[]): Character[] => {
    const map = new Map<string, Character>();
    
    for (const char of chars) {
      const existing = map.get(char.id);
      if (!existing) {
        map.set(char.id, char);
      } else {
        const incomingTime = char.syncTimestamp || 0;
        const existingTime = existing.syncTimestamp || 0;
        if (incomingTime > existingTime) {
          map.set(char.id, char);
        }
      }
    }
    
    return Array.from(map.values());
  }, []);

  // Fetch all parties for user
  const fetchAllParties = useCallback(async () => {
    if (!userId) return;
    unstable_batchedUpdates(() => {
      setIsLoading(true);
    });
    
    // 🔧 FIX LOCAL MODE: Detectar modo local y cargar desde localStorage
    const isLocalMode = localStorage.getItem('df_local_mode') === 'true';
    let data: Party[] | null = null;
    
    if (isLocalMode) {
      console.log('[DM-LocalMode] Loading parties from localStorage');
      const partiesStr = localStorage.getItem('dnd-parties-local');
      if (partiesStr) {
        try {
          data = JSON.parse(partiesStr) as Party[];
        } catch (e) {
          console.error('[DM-LocalMode] Failed to parse localStorage parties:', e);
        }
      }
    } else {
      const result = await supabase
        .from('parties')
        .select('*')
        .eq('creator_id', userId);
      data = result.data;
    }
    
    unstable_batchedUpdates(() => {
      if (data) setParties(data);
      setIsLoading(false);
      setIsRemoving(null);
    });
  }, [userId]);

  // Fetch members of a party
  const fetchMembers = useCallback(async (partyId: string) => {
    unstable_batchedUpdates(() => {
      setIsLoading(true);
    });
    
    // 🔧 FIX LOCAL MODE: Detectar modo local y cargar desde localStorage
    const isLocalMode = localStorage.getItem('df_local_mode') === 'true';
    let data: any = null;
    
    if (isLocalMode) {
      console.log('[DM-LocalMode] Loading members from localStorage');
      const charsStr = localStorage.getItem('dnd-characters');
      if (charsStr) {
        try {
          const allChars = JSON.parse(charsStr) as Character[];
          // Filtrar solo characters de esta party
          data = allChars
            .filter(c => c.party_id === partyId && !c.deleted_at)
            .map(c => ({ data: c }));
        } catch (e) {
          console.error('[DM-LocalMode] Failed to parse localStorage characters:', e);
        }
      }
    } else {
      const result = await supabase
        .from('characters')
        .select('data')
        .eq('party_id', partyId)
        .is('deleted_at', null);  // Filtrar soft-deleted para evitar reaparición
      data = result.data;
    }
    
    unstable_batchedUpdates(() => {
      if (data) {
        const loadedChars = data.map((item: any) => item.data as Character);
        const deduplicated = removeDuplicates(loadedChars);
        console.log(`[DM] Loaded ${loadedChars.length} characters, deduplicated to ${deduplicated.length}`);
        setMembers(deduplicated);
      }
      setIsLoading(false);
      setIsRemoving(null);
    });
  }, [removeDuplicates]);

  // Debounced wrapper for fetchMembers
  const debouncedFetchMembers = useCallback((partyId: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      fetchMembers(partyId);
      timerRef.current = null;
    }, 300);
  }, [fetchMembers]);

  // Create new party
  const handleCreateParty = useCallback(async (partyName: string): Promise<boolean> => {
    if (!userId || !partyName.trim()) return false;
    const newParty = await createParty(userId, partyName);
    if (newParty) {
      setParties(prev => [...prev, newParty]);
      setParty(newParty);
      debouncedFetchMembers(newParty.id);
      return true;
    }
    return false;
  }, [userId, debouncedFetchMembers]);

  // Delete party
  const handleDeleteParty = useCallback(async (): Promise<boolean> => {
    if (!party || !userId) return false;
    const success = await deleteParty(party.id, userId);
    if (success) {
      setParties(prev => prev.filter(p => p.id !== party.id));
      setParty(null);
      return true;
    }
    return false;
  }, [party, userId]);

  // Kick character
  const handleKickCharacter = useCallback(async (id: string, name: string): Promise<boolean> => {
    unstable_batchedUpdates(() => {
      setIsRemoving(id);
      setIsLoading(true);
    });
    
    try {
      const success = await removeFromParty(id);
      unstable_batchedUpdates(() => {
        if (success) {
          setMembers(prev => prev.filter(c => c.id !== id));
          debugLogger.log('[DM-Kick]', `Character ${name} (${id}) successfully kicked`, 'info');
          console.log(`[handleKickCharacter] ${name} successfully kicked`);
        } else {
          const errorMsg = `Failed to kick ${name} - removeFromParty returned false`;
          debugLogger.log('[DM-Kick]', errorMsg, 'error', { characterId: id, characterName: name });
          console.error(`[handleKickCharacter] ${errorMsg}`);
        }
        setIsLoading(false);
        setIsRemoving(null);
      });
      return success;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      debugLogger.log('[DM-Kick]', `Exception kicking ${name}: ${errorMsg}`, 'error', { characterId: id, characterName: name, error: errorMsg });
      console.error(`[handleKickCharacter] Exception:`, err);
      unstable_batchedUpdates(() => {
        setIsLoading(false);
        setIsRemoving(null);
      });
      return false;
    }
  }, []);

  // Update party name
  const handleUpdateName = useCallback(async (newName: string): Promise<boolean> => {
    if (!party || !newName.trim()) return false;
    const success = await updatePartyName(party.id, newName.trim());
    if (success) {
      setParty(prev => prev ? { ...prev, name: newName.trim() } : null);
      setParties(prev => prev.map(p => p.id === party.id ? { ...p, name: newName.trim() } : p));
      return true;
    }
    return false;
  }, [party]);

  // Select party
  const selectParty = useCallback((selectedParty: Party) => {
    unstable_batchedUpdates(() => {
      setParty(selectedParty);
    });
    debouncedFetchMembers(selectedParty.id);
  }, [debouncedFetchMembers]);

  // Unseal party
  const unselectParty = useCallback(() => {
    setParty(null);
    setMembers([]);
  }, []);

  // Realtime subscription
  useEffect(() => {
    if (party) {
      const subscription = subscribeWithRetry(
        party.id,
        (payload: any) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const updatedChar = payload.new.data as Character;
            if (!updatedChar) return;
            
            // Validación defensiva: si party_id es null o no coincide, remover
            if (!payload.new.party_id || payload.new.party_id !== party.id) {
              unstable_batchedUpdates(() => {
                setMembers(prev => prev.filter(c => c.id !== updatedChar.id));
              });
              console.log(`[DM-Realtime-GHOST-PREVENTED] Character ${updatedChar.id} removed (left party or party_id=null)`);
              return;
            }

            unstable_batchedUpdates(() => {
              setMembers(prev => {
                const updated = deduplicateAndMerge(prev, updatedChar, party.id);
                if (updated.length !== prev.length || updated.some((c, i) => c.id !== prev[i]?.id)) {
                  console.log(`[DM-Realtime] Character updated: ${updatedChar.name} (total members: ${updated.length})`);
                }
                return updated;
              });
            });
          } else if (payload.eventType === 'DELETE') {
            const oldId = payload.old.id;
            unstable_batchedUpdates(() => {
              setMembers(prev => prev.filter(c => c.id !== oldId));
            });
            console.log(`[DM-Realtime] Character deleted: ${oldId}`);
          }
        },
        (broadcastChar: any) => {
          const char = broadcastChar as Character;
          
          if (isRemoving === char.id) {
            console.log(`[DM-Broadcast-GHOST-PREVENTED] Ignorando character siendo removido: ${char.name}`);
            return;
          }
          
          // Validación defensiva: rechazar si party_id es null, undefined, o no coincide
          if (!char.party_id || char.party_id !== party.id) {
            console.log(`[DM-Broadcast-GHOST-PREVENTED] Ignorando character fuera de party: ${char.name} (party_id=${char.party_id})`);
            return;
          }
          
          unstable_batchedUpdates(() => {
            setMembers(prev => {
              const updated = deduplicateAndMerge(prev, char, party.id);
              if (updated.length > prev.length) {
                console.log(`[DM-Broadcast] Character added via broadcast: ${char.name} (total members: ${updated.length})`);
              }
              return updated;
            });
          });
        },
        (status) => {
          unstable_batchedUpdates(() => {
            setRealtimeStatus(status);
          });
          console.log(`[DM-Realtime] Status changed to: ${status}`);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [party?.id, isRemoving, deduplicateAndMerge]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Fetch parties on mount
  useEffect(() => {
    fetchAllParties();
  }, [userId, fetchAllParties]);

  return {
    party,
    parties,
    members,
    isLoading,
    realtimeStatus,
    isRemoving,
    fetchAllParties,
    fetchMembers,
    debouncedFetchMembers,
    handleCreateParty,
    handleDeleteParty,
    handleKickCharacter,
    handleUpdateName,
    selectParty,
    unselectParty,
    setParty,
    setMembers,
  };
};
