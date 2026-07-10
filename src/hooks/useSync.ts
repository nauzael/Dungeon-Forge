import { useState, useEffect, useRef, useCallback } from 'react';
import type { Character, SharedResourceEvent, CharacterWithOwner, ViewState, ResourceSharePayload } from '../../types';
import type { SyncContextType } from '../contexts/SyncContext';
import { isValidCharacter } from '../utils/validators';
import { STORAGE_KEY_CHARACTERS } from '../constants';
import {
  saveCharacterToCloud,
  saveCharacterWithRollback,
  fetchCharactersFromCloud,
  subscribeWithRetry,
  broadcastCharacterUpdate,
  extractVolatileFields,
  softDeleteCharacter,
  subscribeToOwnCharacters,
  subscribeToPartyResources,
  subscribeToResourceShare,
  firestore,
  removeCharacterFromPartyRTDB,
} from '../../utils/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export interface UseSyncParams {
  characters: Character[];
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  activeCharacterId: string | null;
  setActiveCharacterId: React.Dispatch<React.SetStateAction<string | null>>;
  activeCharacter: Character | undefined;
  deletedCharacterIds: Set<string>;
  setDeletedCharacterIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  observedCharacter: Character | null;
  setObservedCharacter: React.Dispatch<React.SetStateAction<Character | null>>;
  isAuthenticated: boolean;
  isLocalMode: boolean;
  user: { name: string; id: string } | null;
  view: ViewState;
  setView: React.Dispatch<React.SetStateAction<ViewState>>;
  syncStatus: SyncContextType;
  dialog: { showConfirm: (...args: any[]) => Promise<boolean>; showAlert: (...args: any[]) => Promise<void> };
  syncFeedbackTimerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
}

export interface UseSyncReturn {
  isSyncing: boolean;
  syncMessage: string;
  showSyncFeedback: boolean;
  sharedResource: SharedResourceEvent | null;
  setSharedResource: React.Dispatch<React.SetStateAction<SharedResourceEvent | null>>;
  handleCharacterUpdate: (updatedChar: Partial<Character> | Character) => void;
  handleFastUpdate: (partialChar: Partial<Character>) => void;
  handleDMCharacterUpdate: (updatedChar: Character) => Promise<void>;
  handleDeleteCharacter: (id: string) => Promise<void>;
}

export function useSync(params: UseSyncParams): UseSyncReturn {
  const {
    characters,
    setCharacters,
    activeCharacterId,
    setActiveCharacterId,
    activeCharacter,
    deletedCharacterIds,
    setDeletedCharacterIds,
    observedCharacter,
    setObservedCharacter,
    isAuthenticated,
    isLocalMode,
    user,
    view,
    setView: _setView,
    syncStatus,
    dialog,
    syncFeedbackTimerRef,
  } = params;

  // ── State ──────────────────────────────────────────────────────────────

  const [sharedResource, setSharedResource] = useState<SharedResourceEvent | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [showSyncFeedback, setShowSyncFeedback] = useState(false);

  /** Ref to track activeCharacter.id across renders without triggering re-subscriptions.
   *  Prevents stale closure bug (same pattern as Long Rest fix documented in AGENTS.md). */
  const activeCharIdRef = useRef(activeCharacter?.id);

  /** Show sync indicator and auto-hide after `delay` ms of inactivity */
  const showSyncFor = (ms: number) => {
    setShowSyncFeedback(true);
    if (syncFeedbackTimerRef.current) clearTimeout(syncFeedbackTimerRef.current);
    syncFeedbackTimerRef.current = setTimeout(() => {
      setShowSyncFeedback(false);
      setSyncMessage('');
      syncFeedbackTimerRef.current = null;
    }, ms);
  };

  // ── Refs ───────────────────────────────────────────────────────────────

  // WAVE 6: Listener cleanup on character switch
  const listenerRef = useRef<{ unsubscribe: () => Promise<void> } | null>(null);

  // RTDB CLEANUP ON KICK: Track prev party_id to detect kick transitions
  const prevPartyIdRef = useRef<string | null>(null);

  // Pending uploads queue for sync
  const pendingUploads = useRef<Character[]>([]);

  // Deduplication of listener events (prevent processing same event from multiple listeners)
  const recentEventIds = useRef<Set<string>>(new Set());
  const DEDUP_WINDOW_MS = 100;

  // Dirty tracking for efficient cloud saves
  const dirtyCharacterIdsRef = useRef<Set<string>>(new Set());
  const lastSnapshotRef = useRef<string>('');

  // ── Helpers ────────────────────────────────────────────────────────────

  const getEventId = (characterId: string, timestamp: number): string => {
    return `${characterId}-${timestamp}`;
  };

  const isDuplicateEvent = useCallback((characterId: string, timestamp: number): boolean => {
    const eventId = getEventId(characterId, timestamp);
    const isDuplicate = recentEventIds.current.has(eventId);

    if (!isDuplicate) {
      recentEventIds.current.add(eventId);
      // Schedule cleanup of this event ID after dedup window
      setTimeout(() => {
        recentEventIds.current.delete(eventId);
      }, DEDUP_WINDOW_MS);
    }

    return isDuplicate;
  }, []);

  // ── Effects ────────────────────────────────────────────────────────────

  // Effect 1: RTDB subscription for active character
  useEffect(() => {
    const subscribeToActiveCharacter = async (characterId: string, partyId: string) => {
      // Cleanup anterior listener
      if (listenerRef.current) {
        await listenerRef.current.unsubscribe();
      }

      // Abrir listener SOLO para character activo
      if (!isLocalMode && isAuthenticated) {
        const subscription = subscribeWithRetry(
          partyId,
          (payload: unknown) => {
            // Solo procesar si es el character activo
            const p = payload as Record<string, unknown>;
            if (p.new && typeof p.new === 'object') {
              const newData = p.new as unknown as Record<string, unknown>;
              if (newData.id === characterId) {
                const char = newData.data as unknown as Character;
                setCharacters((prev) =>
                  prev.map((c) => {
                    if (c.id !== characterId) return c;
                    // Timestamp guard: reject RTDB data if it's not strictly newer
                    // than what we have locally. This prevents our own broadcast
                    // loopback from overwriting fresher local state.
                    const incomingTime = (char as Character).syncTimestamp || 0;
                    const currentTime = c.syncTimestamp || 0;
                    if (incomingTime <= currentTime) return c;
                    return char;
                  })
                );
              }
            }
          },
          (_status: unknown) => {
            // Status changes (connecting, connected, error, reconnecting)
          },
          characterId
        );

        listenerRef.current = subscription;
      }
    };

    if (activeCharacter?.id && activeCharacter?.party_id) {
      subscribeToActiveCharacter(activeCharacter.id, activeCharacter.party_id);
    } else {
      // Party ID is null (kicked/left) — clean up any existing listener
      if (listenerRef.current) {
        listenerRef.current.unsubscribe();
        listenerRef.current = null;
      }
    }

    return () => {
      // Additional cleanup on unmount or character change
      if (listenerRef.current) {
        listenerRef.current.unsubscribe();
        listenerRef.current = null;
      }
    };
  }, [activeCharacter?.id, activeCharacter?.party_id, isLocalMode, isAuthenticated]);

  // Effect 2: RTDB cleanup on kick
  useEffect(() => {
    const currentPartyId = activeCharacter?.party_id;
    const previousPartyId = prevPartyIdRef.current;

    // Detect transition: had party_id, now null → player was kicked/left
    if (previousPartyId && !currentPartyId && activeCharacter?.id) {
      removeCharacterFromPartyRTDB(previousPartyId, activeCharacter.id);
    }

    prevPartyIdRef.current = currentPartyId ?? null;
  }, [activeCharacter?.party_id, activeCharacter?.id]);

  // Effect 3: Sync with Cloud on Login — Merge Inteligente
  useEffect(() => {
    // Skip sync if in local mode
    if (isLocalMode) return;

    if (isAuthenticated && user?.id && !user.id.includes('mock')) {
      const syncFromCloud = async () => {
        setIsSyncing(true);
        setSyncMessage('Sincronizando...');
        setShowSyncFeedback(true);
        if (syncFeedbackTimerRef.current) clearTimeout(syncFeedbackTimerRef.current);

        const cloudChars = await fetchCharactersFromCloud(user.id);

        if (cloudChars && cloudChars.length > 0) {
          setCharacters((prev) => {
            const merged = [...prev];
            let updated = false;

            for (const cloudChar of cloudChars) {
              // Cloud es la fuente de verdad para personajes activos (deleted_at = null).
              // If it appears here, remove any stale local deletion markers.
              if (deletedCharacterIds.has(cloudChar.id)) {
                setDeletedCharacterIds((prev) => {
                  const next = new Set(prev);
                  next.delete(cloudChar.id);
                  try {
                    localStorage.setItem('df-deleted-characters', JSON.stringify([...next]));
                  } catch (e) {
                    // Storage might be full, continue anyway
                  }
                  return next;
                });
              }

              const localIndex = merged.findIndex((c) => c.id === cloudChar.id);

              if (localIndex === -1) {
                merged.push({ ...cloudChar, syncTimestamp: Date.now() });
                updated = true;
              } else {
                const localChar = merged[localIndex];
                const localTime = localChar.syncTimestamp || 0;
                const cloudTime =
                  cloudChar.syncTimestamp ||
                  ((cloudChar as unknown as Record<string, unknown>).updated_at
                    ? new Date(
                        (cloudChar as unknown as Record<string, unknown>).updated_at as string
                      ).getTime()
                    : 0);

                if (cloudTime > localTime) {
                  merged[localIndex] = { ...cloudChar, syncTimestamp: Date.now() };
                  updated = true;
                } else if (localTime > cloudTime && localTime > 0) {
                  merged[localIndex] = { ...merged[localIndex], syncTimestamp: Date.now() };
                  pendingUploads.current.push(merged[localIndex]);
                }
              }
            }

            return updated ? merged : prev;
          });
        } else {
          setSyncMessage('Subiendo personajes...');
          setCharacters((prev) => {
            const toUpload = prev.map((c) => ({ ...c, syncTimestamp: Date.now() }));
            pendingUploads.current.push(...toUpload);
            return prev;
          });
        }

        // Process pending uploads in order
        const uploads = [...pendingUploads.current];
        pendingUploads.current = [];
        for (const char of uploads) {
          await saveCharacterToCloud(char, user.id);
        }

        setSyncMessage('Ready!');
        showSyncFor(2500);
        setTimeout(() => {
          setIsSyncing(false);
        }, 300);
      };
      syncFromCloud();
    }
  }, [isAuthenticated, user, deletedCharacterIds, isLocalMode]);

  // Effect 4: Dirty tracking — track which characters changed
  useEffect(() => {
    const snapshot = JSON.stringify(characters);
    if (lastSnapshotRef.current) {
      // Not the first render — find which characters changed
      const prevChars = JSON.parse(lastSnapshotRef.current) as Character[];
      const prevMap = new Map(prevChars.map(c => [c.id, JSON.stringify(c)]));
      for (const char of characters) {
        const prevSerialized = prevMap.get(char.id);
        const currentSerialized = JSON.stringify(char);
        if (!prevSerialized || prevSerialized !== currentSerialized) {
          dirtyCharacterIdsRef.current.add(char.id);
        }
      }
    }
    lastSnapshotRef.current = snapshot;
  }, [characters]);

  // Effect 5: Persist to localStorage and cloud (debounced)
  useEffect(() => {
    // Always save to localStorage immediately (cheap)
    const dataToSave = JSON.stringify(characters);
    localStorage.setItem(STORAGE_KEY_CHARACTERS, dataToSave);

    // Cloud save only if dirty and authenticated
    const dirtyIds = dirtyCharacterIdsRef.current;
    if (dirtyIds.size === 0 || !isAuthenticated || !user?.id || user.id.includes('mock')) {
      return;
    }

    const saveData = setTimeout(async () => {
      try {
        // Collect dirty characters
        const dirtyChars = characters.filter(c => dirtyIds.has(c.id));
        dirtyIds.clear(); // Clear before async work

        if (dirtyChars.length === 0) return;

        setIsSyncing(true);
        setSyncMessage('Guardando...');
        setShowSyncFeedback(true);
        if (syncFeedbackTimerRef.current) clearTimeout(syncFeedbackTimerRef.current);

        // Save only changed characters, with small delays between writes
        for (let i = 0; i < dirtyChars.length; i++) {
          const char = dirtyChars[i];

          // Use the character's EXISTING syncTimestamp (already set by handleCharacterUpdate
          // or handleFastUpdate). DO NOT generate a new Date.now() here — that would cause
          // Firestore's onSnapshot to see a newer timestamp, update local state, and trigger
          // another persist, creating an infinite save loop (the "constant flickering" bug).
          const charToSave = {
            ...char,
            syncTimestamp: char.syncTimestamp || Date.now(),
          };
          await saveCharacterToCloud(charToSave, user.id);

          // Broadcast RTDB update AFTER Firestore save completes
          // Uses extractVolatileFields to send only ~200-500 bytes instead of ~8KB full character.
          // IMPORTANT: Use `char` (NOT `charToSave`) to preserve the syncTimestamp
          // from React state, preventing the RTDB listener from detecting a "different"
          // timestamp and triggering an infinite save-broadcast-loop.
          if (char.party_id) {
            broadcastCharacterUpdate(char.party_id, { id: char.id }, extractVolatileFields(char));
          }

          // Small delay between writes to avoid bursting the queue
          if (i < dirtyChars.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        setSyncMessage('Saved!');
        showSyncFor(2500);
        setTimeout(() => {
          setIsSyncing(false);
        }, 300);
      } catch (error) {
        if (
          error instanceof Error &&
          (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
        ) {
          await dialog.showAlert('Memory Alert!', 'Local storage is full.');
        }
        setIsSyncing(false);
        setSyncMessage('');
        showSyncFor(2500);
      }
    }, 500); // Increased from 300ms to 500ms
    return () => clearTimeout(saveData);
  }, [characters, isAuthenticated, user]);

  // Effect 6: Real-time synchronization for the Observer View
  useEffect(() => {
    if (!observedCharacter || view !== 'observer-sheet') return;

    const subscription = subscribeWithRetry(
      observedCharacter.party_id || 'no-party',
      (payload: unknown) => {
        const p = payload as Record<string, unknown>;
        if (p.new && typeof p.new === 'object') {
          const newData = p.new as unknown as Record<string, unknown>;
          if (newData.id === observedCharacter.id) {
            const char = newData.data as unknown as Character;
            const timestamp = char.syncTimestamp || Date.now();

            // Skip if this is a duplicate event from another listener
            if (isDuplicateEvent(char.id, timestamp)) {
              return;
            }

            setObservedCharacter(char);
          }
        }
      },
      (_status: unknown) => {
        // Log status changes (connecting, connected, error, reconnecting)
      },
      observedCharacter.id
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [observedCharacter, view, isDuplicateEvent]);

  // Effect 7: Real-time sync for own characters (from other devices) — Firebase Firestore onSnapshot
  useEffect(() => {
    if (isLocalMode || !isAuthenticated || !user?.id || user.id.includes('mock')) return;

    const unsubscribe = subscribeToOwnCharacters(user.id, (char, type) => {
      const timestamp = char.syncTimestamp || Date.now();

      // Skip if this is a duplicate event from another listener
      if (isDuplicateEvent(char.id, timestamp)) {
        return;
      }

      if (type === 'DELETE') {
        setCharacters((prev) => prev.filter((c) => c.id !== char.id));
        setDeletedCharacterIds((prev) => {
          const newDeleted = new Set(prev);
          newDeleted.add(char.id);
          try {
            localStorage.setItem('df-deleted-characters', JSON.stringify([...newDeleted]));
          } catch {
            // Storage might be full, continue anyway
          }
          return newDeleted;
        });
      } else {
        setCharacters((prev) => {
          const localChar = prev.find((c) => c.id === char.id);
          const localTime = localChar?.syncTimestamp || 0;
          if ((char.syncTimestamp || 0) > localTime) {
            return prev.map((c) => (c.id === char.id ? char : c));
          }
          return prev;
        });
      }
    });

    return unsubscribe;
  }, [isAuthenticated, user?.id, isDuplicateEvent, isLocalMode]);

  // Effect 8a: Mantener activeCharIdRef sincronizado con activeCharacter.id
  // (separate effect to avoid forcing re-subscription on character switch)
  useEffect(() => {
    activeCharIdRef.current = activeCharacter?.id;
  });

  // Effect 8b: Subscribe to party shared resources — Firebase RTDB
  // Filtra por viewingCharacterIds: undefined=todos ven, []=nadie ve, ['id1']=solo esos
  useEffect(() => {
    if (!activeCharacter?.party_id) return;

    const unsubscribe = subscribeToResourceShare(activeCharacter.party_id, (payload: ResourceSharePayload | null) => {
      try {
        if (!payload?.resource) {
          setSharedResource(null);
          return;
        }

        const viewingIds = payload.viewingCharacterIds;
        const currentCharId = activeCharIdRef.current;

        // viewingCharacterIds !== undefined means specific targeting
        if (viewingIds !== undefined) {
          // Empty array = visible to no one (DM selected nobody)
          if (viewingIds.length === 0) {
            setSharedResource(null);
            return;
          }
          // Non-empty array = visible only to characters in the list
          if (currentCharId && !viewingIds.includes(currentCharId)) {
            setSharedResource(null);
            return;
          }
        }
        // viewingCharacterIds === undefined = visible to ALL (backward compat)

        const resource = payload.resource;
        setSharedResource({
          url: resource.url,
          title: resource.title,
          description: resource.description,
        });
      } catch (err) {
        console.error('useSync: Error processing shared resource:', err);
        setSharedResource(null);
      }
    });

    return unsubscribe;
  }, [activeCharacter?.party_id, activeCharacter?.id, isLocalMode]);

  // ── Handlers ───────────────────────────────────────────────────────────

  const handleCharacterUpdate = useCallback(
    (updatedChar: Partial<Character> | Character) => {
      if (!activeCharacter) return;

      setCharacters((prev) => {
        const currentChar = prev.find((c) => c.id === activeCharacter.id);
        if (!currentChar) return prev;

        const isPartial = !('class' in updatedChar) || !('id' in updatedChar);
        const merged: Character = isPartial
          ? { ...currentChar, ...updatedChar }
          : (updatedChar as Character);

        return prev.map((c) =>
          c.id === activeCharacter.id
            ? { ...merged, syncTimestamp: Date.now() }
            : c
        );
      });
      setActiveCharacterId(activeCharacter.id);
    },
    [activeCharacter]
  );

  /** Fast path: updates characters[] state AND broadcasts to RTDB immediately.
   *  Unlike handleCharacterUpdate, this skips the 500ms debounce so HP changes / rest
   *  are visible instantly and survive tab switches / component remounts.
   *  Firestore persistence still goes through the normal debounced path. */
  const handleFastUpdate = useCallback(
    (partialChar: Partial<Character>) => {
      if (!activeCharacter) return;
      // IMPORTANT: Spread from `c` (the live entry in `prev`), NOT from the
      // captured `activeCharacter` closure. Under React 18 batching, two
      // rapid setCharacters(fn) calls both receive the same `prev` snapshot,
      // but spreading from `activeCharacter` (which is frozen at closure time)
      // causes the second call to UNDO the first's changes. Spreading from `c`
      // ensures each merge starts from the latest state of that character.
      setCharacters((prev) =>
        prev.map((c) =>
          c.id === activeCharacter.id
            ? { ...c, ...partialChar, syncTimestamp: Date.now() }
            : c
        )
      );
      setActiveCharacterId(activeCharacter.id);
    },
    [activeCharacter]
  );

  const handleDMCharacterUpdate = async (updatedChar: Character) => {
    // KICK-TRACE: Detect if this save might be from a kicked character
    // 1. Validar character antes de guardar
    const validation = isValidCharacter(updatedChar);
    if (!validation.valid) {
      syncStatus.showError(validation.errors?.[0] || 'Validation error', updatedChar.id);
      return; // Don't save if invalid
    }

    // 2. Update the local observed character state
    setObservedCharacter(updatedChar);

    // 3. Show syncing state
    syncStatus.showSync();

    // 4. Persist to cloud with rollback
    try {
      const ownerId = (updatedChar as CharacterWithOwner).user_id || user?.id || 'guest';

      // Create rollback handler - restore previous state on failure
      const handleRollback = (snapshot: Character) => {
        setObservedCharacter(snapshot);
      };

      // Save with rollback capability
      await saveCharacterWithRollback(updatedChar, ownerId, handleRollback);

      // Success - update sync status
      syncStatus.showSuccess(`${updatedChar.name} guardado`);
    } catch (error) {
      // Error - show feedback
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      syncStatus.showError(errorMessage, updatedChar.id);
      return; // Stop here, don't broadcast on error
    }

    // 5. Broadcast to the party on success (partial — volatile fields only)
    if (updatedChar.party_id) {
      broadcastCharacterUpdate(updatedChar.party_id, { id: updatedChar.id }, extractVolatileFields(updatedChar));
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    if (activeCharacterId === id) setActiveCharacterId(null);

    // Track deletion to prevent restoration after reload
    const newDeleted = new Set(deletedCharacterIds);
    newDeleted.add(id);
    setDeletedCharacterIds(newDeleted);
    try {
      localStorage.setItem('df-deleted-characters', JSON.stringify([...newDeleted]));
    } catch (e) {
      // Storage might be full, continue anyway
    }

    // Only sync deletion with Firestore if not in local mode
    if (!isLocalMode && isAuthenticated && user?.id && !user.id.includes('mock')) {
      const success = await softDeleteCharacter(id);
      if (!success) {
        try {
          if (firestore) {
            const characterRef = doc(firestore, 'characters', id);
            await deleteDoc(characterRef);
          }
        } catch (deleteErr) {
          // Silent fail — local deletion already applied
        }
      }
    }
  };

  // ── Return ─────────────────────────────────────────────────────────────

  return {
    isSyncing,
    syncMessage,
    showSyncFeedback,
    sharedResource,
    setSharedResource,
    handleCharacterUpdate,
    handleFastUpdate,
    handleDMCharacterUpdate,
    handleDeleteCharacter,
  };
}
