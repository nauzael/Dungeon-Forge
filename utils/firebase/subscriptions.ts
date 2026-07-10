import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { ref, onValue, Unsubscribe } from 'firebase/database';
import { firestore, database } from './init';
import { Character, CampaignResource, ResourceSharePayload } from '../../types';

export interface RealtimeSubscription {
  channel: { id: string };
  unsubscribe: () => Promise<void>;
  status: 'connecting' | 'connected' | 'error' | 'reconnecting';
}

export const subscribeWithRetry = (
  partyId: string,
  onUpdate: (payload: unknown) => void,
  onStatusChange?: (status: 'connecting' | 'connected' | 'error' | 'reconnecting') => void,
  activeCharacterId?: string // WAVE 10: Selective document listener
): RealtimeSubscription => {
  // Check local mode
  const isLocalMode = localStorage.getItem('df_local_mode') === 'true';
  if (isLocalMode) {
    onStatusChange?.('connected');
    return {
      channel: { id: partyId },
      unsubscribe: async () => {},
      status: 'connected',
    };
  }

  if (!database) {
    onStatusChange?.('error');
    return {
      channel: { id: partyId },
      unsubscribe: async () => {},
      status: 'error',
    };
  }

  // WAVE 10: Use selective document listener if activeCharacterId provided
  const listenerPath = activeCharacterId
    ? `parties/${partyId}/characters/${activeCharacterId}`
    : `parties/${partyId}/characters`;

  let unsubscribeFn: Unsubscribe | null = null;
  let status: 'connecting' | 'connected' | 'error' | 'reconnecting' = 'connecting';

  try {
    onStatusChange?.('connecting');

    const listenerRef = ref(database, listenerPath);

    unsubscribeFn = onValue(
      listenerRef,
      (snapshot) => {
        if (status !== 'connected') {
          status = 'connected';
          onStatusChange?.('connected');
        }

        if (snapshot.exists()) {
          const data = snapshot.val();

          // WAVE 10: When listening to specific character, payload is the character object directly
          // When listening to all characters, payload is a map of character objects
          if (activeCharacterId) {
            // Specific character: wrap in standard format for callback
            onUpdate({ new: { id: activeCharacterId, data } });
          } else {
            // All characters: send the full map
            onUpdate(data);
          }
        } else {
          // CRITICAL: When all characters are removed (e.g., last member kicked),
          // snapshot.exists() is false. We must still call onUpdate with an empty map
          // so the DM's merge logic can remove stale members.
          if (!activeCharacterId) {
            onUpdate({});
          }
        }
      },
      (error) => {
        status = 'error';
        onStatusChange?.('error');
      }
    );
  } catch (e) {
    status = 'error';
    onStatusChange?.('error');
  }

  return {
    channel: { id: partyId },
    unsubscribe: async () => {
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    },
    status,
  };
};

export const subscribeToParty = (
  partyId: string,
  onUpdate: (payload: unknown) => void
): (() => void) => {
  if (!database) {
    return () => {};
  }

  const partyRef = ref(database, `parties/${partyId}`);

  const unsubscribe = onValue(
    partyRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.val());
      }
    },
    (error) => {
    }
  );

  return () => unsubscribe();
};

// --- Firebase Realtime Subscriptions ---

/**
 * Suscribe a cambios en los personajes propios del usuario via Firestore onSnapshot.
 */
export const subscribeToOwnCharacters = (
  userId: string,
  onCharacterChange: (char: Character, type: 'UPDATE' | 'DELETE') => void
): (() => void) => {
  if (!firestore) {
    return () => {};
  }

  const q = query(collection(firestore, 'characters'), where('user_id', '==', userId));

  // Saltamos el primer snapshot (carga inicial ya manejada por fetchCharactersFromCloud)
  let isInitialLoad = true;

  const unsubscribe = onSnapshot(
    q,
    (snapshot: unknown) => {
      if (isInitialLoad) {
        isInitialLoad = false;
        return;
      }

      const snapshotObj = snapshot as {
        docChanges: () => Array<{
          type: string;
          doc: { id: string; data: () => Record<string, unknown> };
        }>;
      };
      snapshotObj
        .docChanges()
        .forEach(
          (change: { type: string; doc: { id: string; data: () => Record<string, unknown> } }) => {
            const data = change.doc.data();

            if (change.type === 'removed') {
              onCharacterChange({ id: change.doc.id } as Character, 'DELETE');
              return;
            }

            if (change.type === 'modified') {
              if (data.deleted_at) {
                onCharacterChange({ id: change.doc.id } as Character, 'DELETE');
                return;
              }

              if (data.data) {
                const cloudChar = data.data as Character;
                const updated_at = data.updated_at as { toMillis?: () => number } | undefined;
                const cloudTime = cloudChar.syncTimestamp || updated_at?.toMillis?.() || 0;
                onCharacterChange({ ...cloudChar, syncTimestamp: cloudTime }, 'UPDATE');
              }
            }
          }
        );
    },
    (_error: unknown) => {
      // Handle subscription errors silently
    }
  );

  return unsubscribe;
};

/**
 * Suscribe a recursos compartidos en una fiesta via Firebase RTDB.
 * Recibe un payload con el recurso y los IDs de personaje que pueden verlo.
 * Si el snapshot no existe, llama onPayload(null).
 */
export const subscribeToResourceShare = (
  partyId: string,
  onPayload: (payload: ResourceSharePayload | null) => void
): (() => void) => {
  if (!database) {
    return () => {};
  }

  const shareRef = ref(database, `parties/${partyId}/resource-share`);

  const unsubscribe = onValue(
    shareRef,
    (snapshot: unknown) => {
      const snapshotObj = snapshot as { exists: () => boolean; val: () => unknown };
      if (snapshotObj.exists()) {
        const data = snapshotObj.val() as { resource?: CampaignResource; viewingCharacterIds?: string[] };
        // Keep viewingCharacterIds as-is from snapshot:
        // undefined if field absent, empty array if intentionally set
        onPayload({
          resource: data.resource,
          viewingCharacterIds: data.viewingCharacterIds,
        });
      } else {
        onPayload(null);
      }
    },
    (_error: unknown) => {

    }
  );

  return () => unsubscribe();
};

/**
 * Wrapper for subscribeToResourceShare for backward compatibility.
 * Convierte ResourceSharePayload | null a CampaignResource[].
 */
export const subscribeToPartyResources = (
  partyId: string,
  onResourceChange: (resources: CampaignResource[]) => void
): (() => void) => {
  return subscribeToResourceShare(partyId, (payload) => {
    onResourceChange(payload?.resource ? [payload.resource] : []);
  });
};
