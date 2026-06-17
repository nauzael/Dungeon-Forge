import { useState, useEffect, useRef, useCallback } from 'react';
import {
  createParty,
  subscribeWithRetry,
  removeFromParty,
  updatePartyName,
  deleteParty,
  firestore,
  isRtdbAvailable,
} from '../utils/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { debugLogger } from '../utils/debugLogger';
import { Character } from '../types';

interface Party {
  id: string;
  name: string;
  code: string;
}

/**
 * Encapsula toda la lógica de gestión de parties del DM:
 * - Fetch parties from Firebase
 * - Create/delete/update party
 * - Fetch members from Firebase
 * - Realtime subscription
 * - Kick character
 */
export const useDMParty = (userId: string | null) => {
  const [party, setParty] = useState<Party | null>(null);
  const [parties, setParties] = useState<Party[]>([]);
  const [members, setMembers] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState<
    'connecting' | 'connected' | 'error' | 'reconnecting'
  >('connecting');
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  // CRITICAL FIX: Use a ref-based Set for kicked character IDs.
  // State-based isRemoving causes the RTDB useEffect to tear down and recreate subscriptions
  // 3 times per kick, and the kicked character reappears because RTDB removal may fail
  // (DM's client often lacks write permission to nodes created by the player).
  // The ref persists across renders without triggering re-subscription.
  const kickedIdsRef = useRef<Set<string>>(new Set());
  const partyIdRef = useRef<string | null>(null);

  // PERSISTENCE: Save/Load kicked IDs to/from localStorage so they survive page refresh.
  // Key: "df_kicked_{partyId}" → comma-separated character IDs
  const loadKickedIds = useCallback((partyId: string): Set<string> => {
    try {
      const stored = localStorage.getItem(`df_kicked_${partyId}`);
      if (stored) {
        return new Set(stored.split(',').filter(Boolean));
      }
    } catch { /* ignore */ }
    return new Set();
  }, []);

  const saveKickedIds = useCallback((partyId: string, ids: Set<string>) => {
    try {
      localStorage.setItem(`df_kicked_${partyId}`, Array.from(ids).join(','));
    } catch { /* ignore */ }
  }, []);

  // Ref for Firestore polling interval (fallback when RTDB is unavailable)
  const partyPollingRef = useRef<NodeJS.Timeout | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper: Deduplicate with Map lookup (O(1))
  const deduplicateAndMerge = useCallback(
    (current: Character[], incoming: Character, partyId?: string): Character[] => {
      if (!incoming.party_id && partyId) {
        console.log(
          `[DEDUP-GHOST-PREVENTION] Rechazando character ${incoming.id} - party_id es null`
        );
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
    },
    []
  );

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

  // Fetch all parties for user from Firebase
  const fetchAllParties = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);

    let data: Party[] | null = null;

    try {
      if (!firestore) throw new Error('Firestore not initialized');

      console.log(`[DM-Firebase] Fetching parties for user ${userId}`);

      // Query Firebase: parties where dm_uid == userId
      const partiesRef = collection(firestore, 'parties');
      const q = query(partiesRef, where('dm_uid', '==', userId));
      const snapshot = await getDocs(q);

      data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          name: d.name || 'Untitled Party',
          code: d.code || '',
        };
      });

      console.log(`[DM-Firebase] Loaded ${data.length} parties from Firebase`);
    } catch (err) {
      console.error('[DM-Firebase] Failed to fetch parties:', err);
      // Fallback to localStorage
      try {
        const partiesStr = localStorage.getItem('dnd-parties-local');
        if (partiesStr) {
          data = JSON.parse(partiesStr) as Party[];
          console.log(`[DM-Fallback] Using localStorage with ${data.length} parties`);
        }
      } catch (e) {
        console.error('[DM-Fallback] Failed to parse localStorage:', e);
      }
    }

    if (data) setParties(data);
    setIsLoading(false);
    setIsRemoving(null);
  }, [userId]);

  // Fetch members of a party from Firebase
  const fetchMembers = useCallback(
    async (partyId: string) => {
      setIsLoading(true);

      let data: Character[] | null = null;

      try {
        if (!firestore) throw new Error('Firestore not initialized');

        console.log(`[DM-FetchMembers-Firebase] Loading party ${partyId}`);

        // Query Firebase: characters where party_id == partyId
        const charsRef = collection(firestore, 'characters');
        const q = query(charsRef, where('party_id', '==', partyId));
        const snapshot = await getDocs(q);

        // DIAGNOSTIC: Log every matching document to detect ghost characters
        console.log(`[KICK-FETCH] Query returned ${snapshot.docs.length} docs:`);
        snapshot.docs.forEach((doc) => {
          const d = doc.data();
          const name = d.data?.name || d.name || 'unknown';
          const dataPartyId = d.data?.party_id || d.party_id || 'none';
          console.log(`[KICK-FETCH]   📄 ${doc.id} → name="${name}", party_id="${dataPartyId}"`);
        });

        data = snapshot.docs.map((doc) => {
          const d = doc.data();
          return d.data as Character;
        });

        console.log(
          `[DM-FetchMembers-Firebase] Loaded ${data.length} members for party ${partyId}`
        );
      } catch (err) {
        console.error('[DM-FetchMembers-Firebase] Failed to fetch members:', err);
        // Fallback to localStorage
        try {
          const charsStr = localStorage.getItem('dnd-characters');
          if (charsStr) {
            const allChars = JSON.parse(charsStr) as Character[];
            data = allChars.filter((c) => c.party_id === partyId);
            console.log(
              `[DM-FetchMembers-Fallback] Using localStorage with ${data.length} members`
            );
          }
        } catch (e) {
          console.error('[DM-FetchMembers-Fallback] Failed:', e);
        }
      }

      if (data) {
        const deduplicated = removeDuplicates(data);
        console.log(
          `[DM] Loaded ${data.length} characters, deduplicated to ${deduplicated.length}`
        );
        setMembers(deduplicated);
      }
      setIsLoading(false);
      setIsRemoving(null);
    },
    [removeDuplicates]
  );

  // Debounced wrapper for fetchMembers
  const debouncedFetchMembers = useCallback(
    (partyId: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        fetchMembers(partyId);
        timerRef.current = null;
      }, 300);
    },
    [fetchMembers]
  );

  // Create new party
  const handleCreateParty = useCallback(
    async (partyName: string): Promise<boolean> => {
      if (!userId || !partyName.trim()) return false;
      const newParty = await createParty(userId, partyName);
      if (newParty && newParty.data) {
        const party = newParty.data;
        const partyObj: Party = { id: party.id, name: party.name, code: party.code };
        setParties((prev) => [...prev, partyObj]);
        setParty(partyObj);
        debouncedFetchMembers(party.id);
        return true;
      }
      return false;
    },
    [userId, debouncedFetchMembers]
  );

  // Delete party
  const handleDeleteParty = useCallback(async (): Promise<boolean> => {
    if (!party || !userId) return false;
    console.log('[DM-DeleteParty] Starting deletion for party:', party.id, party.name);
    const result: { error: unknown } | null = await deleteParty(party.id, userId);
    console.log('[DM-DeleteParty] Result from deleteParty():', result);
    const hasError = result && result.error ? true : false;
    if (!hasError) {
      console.log('[DM-DeleteParty] No error, proceeding with state update');
      // Clean up persisted kicked IDs from localStorage
      try { localStorage.removeItem(`df_kicked_${party.id}`); } catch { /* ignore */ }
      setParties((prev) => prev.filter((p) => p.id !== party.id));
      setParty(null);
      setMembers([]);
      console.log('[DM-DeleteParty] Party deleted successfully:', party.id);
      return true;
    } else {
      const errorMsg =
        result && result.error instanceof Error
          ? result.error.message
          : String(result?.error || 'Unknown error');
      console.error('[DM-DeleteParty] ❌ Error deleting party:', errorMsg);
      console.error('[DM-DeleteParty] Full error object:', result?.error);
      return false;
    }
  }, [party, userId]);

  // Kick character
  const handleKickCharacter = useCallback(async (id: string, name: string): Promise<boolean> => {
    const kickStartTime = Date.now();
    console.log(`[KICK-UI] ────────────────────────────────────────────`);
    console.log(`[KICK-UI] handleKickCharacter START`);
    console.log(`[KICK-UI]   character id: ${id}`);
    console.log(`[KICK-UI]   character name: "${name}"`);
    console.log(`[KICK-UI]   party: ${party?.id} ("${party?.name}")`);
    console.log(`[KICK-UI]   userId: ${userId}`);
    console.log(`[KICK-UI]   members count BEFORE kick: ${members.length}`);
    console.log(`[KICK-UI]   members list: ${members.map(m => `${m.id}("${m.name}")`).join(', ')}`);
    console.log(`[KICK-UI]   kickedIdsRef: [${Array.from(kickedIdsRef.current).join(', ')}]`);

    // Mark as kicked IMMEDIATELY in the ref (no re-render, no subscription churn)
    kickedIdsRef.current.add(id);
    if (party?.id) {
      saveKickedIds(party.id, kickedIdsRef.current);
    }
    setIsRemoving(id);
    setIsLoading(true);

    console.log(`[KICK-UI] Calling removeFromParty(${id})...`);

    try {
      const result = await removeFromParty(id);
      const success = !result.error;

      console.log(`[KICK-UI] removeFromParty returned:`, { success, error: result.error?.message || null });

      if (success) {
        setMembers((prev) => {
          const newMembers = prev.filter((c) => c.id !== id);
          console.log(`[KICK-UI] setMembers: ${prev.length} → ${newMembers.length} (removed ${id})`);
          return newMembers;
        });
        debugLogger.log('[DM-Kick]', `Character ${name} (${id}) successfully kicked`, 'info', {
          characterId: id, partyId: party?.id, elapsed: Date.now() - kickStartTime,
        });
        console.log(`[KICK-UI] ✅ ${name} kicked successfully (${Date.now() - kickStartTime}ms)`);
        // Force-refresh member list from Firestore to confirm the kick persisted
        if (party?.id) {
          console.log(`[KICK-UI] Triggering debouncedFetchMembers for party ${party.id}...`);
          debouncedFetchMembers(party.id);
        }
      } else {
        console.error(`[KICK-UI] ❌ Failed to kick ${name}:`, result.error);
      }

      setIsLoading(false);
      setIsRemoving(null);
      console.log(`[KICK-UI] ────────────────────────────────────────────`);
      return success;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      debugLogger.log('[DM-Kick]', `Exception kicking ${name}: ${errorMsg}`, 'error', {
        characterId: id, characterName: name, error: errorMsg,
      });
      console.error(`[KICK-UI] ❌ Exception kicking ${name}:`, err);
      setIsLoading(false);
      setIsRemoving(null);
      console.log(`[KICK-UI] ────────────────────────────────────────────`);
      return false;
    }
  }, [party?.id, party?.name, userId, members.length, saveKickedIds, debouncedFetchMembers]);

  // Update party name
  const handleUpdateName = useCallback(
    async (newName: string): Promise<boolean> => {
      if (!party || !newName.trim()) return false;
      const success = await updatePartyName(party.id, newName.trim());
      if (success) {
        setParty((prev) => (prev ? { ...prev, name: newName.trim() } : null));
        setParties((prev) =>
          prev.map((p) => (p.id === party.id ? { ...p, name: newName.trim() } : p))
        );
        return true;
      }
      return false;
    },
    [party]
  );

  // Select party
  const selectParty = useCallback(
    (selectedParty: Party) => {
      setParty(selectedParty);
      debouncedFetchMembers(selectedParty.id);
    },
    [debouncedFetchMembers]
  );

  // Unseal party
  const unselectParty = useCallback(() => {
    setParty(null);
    setMembers([]);
  }, []);

  // Realtime subscription
  // NOTE: isRemoving is NOT in the dependency array — we use kickedIdsRef instead.
  // This prevents the subscription from being torn down and recreated during a kick,
  // which was causing the kicked character to reappear.
  useEffect(() => {
    if (party) {
      partyIdRef.current = party.id;

      // PERSISTENCE: Load kicked IDs from localStorage so they survive page refresh
      kickedIdsRef.current = loadKickedIds(party.id);

      const subscription = subscribeWithRetry(
        party.id,
        (payload: unknown) => {
          // Firebase RTDB sends a raw map: { charId: { name, level, ... }, ... }
          if (!payload || typeof payload !== 'object') return;

          const charsMap = payload as Record<string, Character>;
          const kickedIds = kickedIdsRef.current;

          setMembers((prev) => {
            const merged = new Map(prev.map(c => [c.id, c]));
            let hasChanges = false;

            // Step 1: Remove any kicked characters from merged FIRST
            // This ensures they stay removed even if RTDB removal failed
            for (const kickedId of kickedIds) {
              if (merged.has(kickedId)) {
                merged.delete(kickedId);
                hasChanges = true;
                console.log(`[DM-Realtime] Kicked character ${kickedId} removed from merged`);
              }
            }

            // Step 2: Add or update characters present in the RTDB snapshot
            for (const [charId, charData] of Object.entries(charsMap)) {
              // KICK-TRACE: Check if this character is in the kicked set
              if (kickedIds.has(charId)) {
                console.log(`[KICK-RTDB] Character ${charId} is in kickedIds — will be filtered out`);
              }

              if (!charData || typeof charData !== 'object') continue;

              // Ghost prevention: skip if party_id doesn't match
              if (!charData.party_id || charData.party_id !== party.id) {
                if (merged.has(charId)) {
                  merged.delete(charId);
                  hasChanges = true;
                  console.log(`[DM-Realtime-GHOST-PREVENTED] Character ${charId} removed (party_id mismatch)`);
                }
                continue;
              }

              // If character is in the kicked set, skip it
              if (kickedIds.has(charId)) continue;

              const existing = merged.get(charId);
              if (!existing) {
                // New character
                merged.set(charId, {
                  ...charData,
                  id: charId,
                  syncTimestamp: charData.syncTimestamp || Date.now(),
                });
                hasChanges = true;
                console.log(`[DM-Realtime] Character added: ${charData.name || charId}`);
              } else {
                // Update existing - use syncTimestamp for dedup
                const incomingTime = charData.syncTimestamp || 0;
                const existingTime = existing.syncTimestamp || 0;
                if (incomingTime >= existingTime) {
                  merged.set(charId, {
                    ...charData,
                    id: charId,
                    syncTimestamp: charData.syncTimestamp || Date.now(),
                  });
                  hasChanges = true;
                }
              }
            }

            // CRITICAL FIX: Do NOT remove members absent from RTDB snapshot.
            // Previously this logic removed characters that hadn't broadcasted yet
            // (new joiners who hadn't made an edit), causing the member list to appear empty.
            // Members are ONLY removed via kickedIds (explicit kick) or party_id mismatch.

            if (hasChanges) {
              console.log(`[DM-Realtime] Members updated: ${merged.size} total`);
            }

            return Array.from(merged.values());
          });
        },
        (broadcastChar: unknown) => {
          const char = broadcastChar as Character;

          // Check kicked IDs from ref (always current, no stale closure)
          if (kickedIdsRef.current.has(char.id)) {
            console.log(
              `[DM-Broadcast-GHOST-PREVENTED] Ignoring kicked character: ${char.name}`
            );
            return;
          }

          if (!char.party_id || char.party_id !== party.id) {
            console.log(
              `[DM-Broadcast-GHOST-PREVENTED] Ignoring character outside party: ${char.name} (party_id=${char.party_id})`
            );
            return;
          }

          setMembers((prev) => {
            const updated = deduplicateAndMerge(prev, char, party.id);
            if (updated.length > prev.length) {
              console.log(
                `[DM-Broadcast] Character added via broadcast: ${char.name} (total members: ${updated.length})`
              );
            }
            return updated;
          });
        },
        (status) => {
          setRealtimeStatus(status);
          console.log(`[DM-Realtime] Status changed to: ${status}`);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [party?.id, party, deduplicateAndMerge]);

  // SAFETY: If status is 'error' (RTDB unavailable) or stuck on 'connecting' for 15s,
  // start Firestore polling immediately as fallback.
  useEffect(() => {
    if (!party) return;

    // Case 1: RTDB returned 'error' immediately (database not initialized, security rules, etc.)
    // Start polling RIGHT AWAY instead of waiting 15s.
    if (realtimeStatus === 'error') {
      console.warn('[DM-Realtime] RTDB unavailable — starting Firestore polling immediately');
      fetchMembers(party.id);
      if (partyPollingRef.current) {
        clearInterval(partyPollingRef.current);
      }
      partyPollingRef.current = setInterval(() => {
        fetchMembers(party.id);
      }, 5000);
      return;
    }

    // Case 2: Still 'connecting' — wait 15s before giving up
    if (realtimeStatus !== 'connecting') return;

    const stuckTimeout = setTimeout(() => {
      console.warn('[DM-Realtime] Stuck on connecting for 15s — falling back to Firestore polling');
      setRealtimeStatus('error');
      // Start polling as fallback if RTDB never connected
      if (party) {
        fetchMembers(party.id);
        const pollInterval = setInterval(() => {
          fetchMembers(party.id);
        }, 5000);
        partyPollingRef.current = pollInterval;
      }
    }, 15000);

    return () => {
      clearTimeout(stuckTimeout);
    };
  }, [realtimeStatus, party?.id]);

  // Cleanup debounce timer and polling on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (partyPollingRef.current) {
        clearInterval(partyPollingRef.current);
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
