import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import {
  ref,
  set,
  onValue,
  Unsubscribe,
} from "firebase/database";
import { Character, CampaignResource } from "../types";
import { firestore, database } from "./firebase";
import { STORAGE_KEY_LOCAL_MODE } from "../src/constants";

interface RealtimeUpdatePayload {
  new?: { id: string; data: Character };
  old?: { id: string };
  eventType: 'UPDATE' | 'DELETE';
}

export interface FirestoreRealtimeSubscription {
  unsubscribe: () => void | Promise<void>;
  status: "connecting" | "connected" | "error" | "reconnecting";
}

export const subscribeToPartyRealtime = (
  partyId: string,
  onUpdate: (payload: RealtimeUpdatePayload) => void,
  onStatusChange?: (status: "connecting" | "connected" | "error" | "reconnecting") => void
): FirestoreRealtimeSubscription => {
  const isLocalMode = localStorage.getItem(STORAGE_KEY_LOCAL_MODE) === "true";
  if (isLocalMode) {
    onStatusChange?.("connected");
    return {
      unsubscribe: () => {},
      status: "connected",
    };
  }

  if (!firestore) {
    onStatusChange?.("error");
    return {
      unsubscribe: () => {},
      status: "error",
    };
  }

  const TIMEOUT_MS = 15000;
  const MAX_RETRIES = 10;
  const MAX_BACKOFF_MS = 8000;

  let currentUnsubscribe: (() => void) | null = null;
  let timeoutHandle: NodeJS.Timeout | null = null;
  let retryTimeoutHandle: NodeJS.Timeout | null = null;
  let currentAttempt = 0;
  let status: "connecting" | "connected" | "error" | "reconnecting" = "connecting";
  let isInitialLoadComplete = false;

  const calculateBackoff = (attempt: number): number => {
    const baseBackoff = Math.min(Math.pow(2, attempt) * 1000, MAX_BACKOFF_MS);
    const jitterPercent = 0.1;
    const jitterAmount = baseBackoff * jitterPercent;
    const randomJitter = (Math.random() - 0.5) * 2 * jitterAmount;
    return Math.round(baseBackoff + randomJitter);
  };

  const cleanup = () => {
    if (timeoutHandle) clearTimeout(timeoutHandle);
    if (retryTimeoutHandle) clearTimeout(retryTimeoutHandle);
    if (currentUnsubscribe) {
      currentUnsubscribe();
    }
  };

  const attemptSubscribe = (attempt: number) => {
    currentAttempt = attempt;

    if (attempt === 0) {
      status = "connecting";
      onStatusChange?.("connecting");
    } else {
      status = "reconnecting";
      onStatusChange?.("reconnecting");
    }

    try {
      const q = query(
        collection(firestore, "characters"),
        where("party_id", "==", partyId)
      );

      let eventReceived = false;
      isInitialLoadComplete = false;

      currentUnsubscribe = onSnapshot(
        q,
        (snapshot) => {
          eventReceived = true;
          
          if (timeoutHandle) {
            clearTimeout(timeoutHandle);
            timeoutHandle = null;
          }

          if (!isInitialLoadComplete) {
            isInitialLoadComplete = true;
            if (status !== "connected") {
              status = "connected";
              onStatusChange?.("connected");
            }
          }

          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            
            if (change.type === "modified" || change.type === "added") {
              const character = data.data as Character;
              const timestamp = character.syncTimestamp || (data.updated_at?.toMillis?.() || Date.now());
              
              const payload = {
                new: {
                  id: change.doc.id,
                  data: { ...character, syncTimestamp: timestamp },
                },
                eventType: "UPDATE",
              };

              onUpdate(payload);
            } else if (change.type === "removed") {
              onUpdate({
                old: { id: change.doc.id },
                eventType: "DELETE",
              });
            }
          });
        },
        (error) => {
          if (currentUnsubscribe) {
            currentUnsubscribe();
            currentUnsubscribe = null;
          }

          if (attempt < MAX_RETRIES - 1) {
            status = "error";
            onStatusChange?.("error");
            
            const backoffMs = calculateBackoff(attempt);
            retryTimeoutHandle = setTimeout(() => {
              attemptSubscribe(attempt + 1);
            }, backoffMs);
          } else {
            status = "error";
            onStatusChange?.("error");
          }
        }
      );

      timeoutHandle = setTimeout(() => {
        if (!eventReceived) {
          if (currentUnsubscribe) {
            currentUnsubscribe();
            currentUnsubscribe = null;
          }

          if (attempt < MAX_RETRIES - 1) {
            status = "error";
            onStatusChange?.("error");
            
            const backoffMs = calculateBackoff(attempt);
            retryTimeoutHandle = setTimeout(() => {
              attemptSubscribe(attempt + 1);
            }, backoffMs);
          } else {
            status = "error";
            onStatusChange?.("error");
          }
        }
      }, TIMEOUT_MS);

    } catch (err: unknown) {

      if (attempt < MAX_RETRIES - 1) {
        const backoffMs = calculateBackoff(attempt);
        retryTimeoutHandle = setTimeout(() => {
          attemptSubscribe(attempt + 1);
        }, backoffMs);
      } else {
        status = "error";
        onStatusChange?.("error");
      }
    }
  };

  attemptSubscribe(0);

  return {
    unsubscribe: cleanup,
    status,
  };
};

export const broadcastCharacterUpdateFirestore = async (
  partyId: string,
  character: Character
): Promise<{ error: null } | { error: Error }> => {
  try {
    if (!database) {
      return { error: new Error("Database not initialized") };
    }

    const broadcastRef = ref(database, `parties/${partyId}/broadcasts/${character.id}`);
    await set(broadcastRef, {
      character,
      timestamp: new Date().toISOString(),
    });

    return { error: null };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e : new Error(String(e)) };
  }
};

export const subscribeToPartyResourcesRealtime = (
  partyId: string,
  onUpdate: (resources: Record<string, unknown> | null) => void
): (() => void) => {
  if (!database) {
    return () => {};
  }

  const resourcesRef = ref(database, `parties/${partyId}/resources`);

  const unsubscribe: Unsubscribe = onValue(
    resourcesRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        onUpdate(data);
      } else {
        onUpdate(null);
      }
    },
    (error) => {

    }
  );

  return () => {
    unsubscribe();
  };
};

