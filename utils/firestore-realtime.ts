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
import { debugLogger } from "./debugLogger";
import { firestore, database } from "./firebase";

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
  onBroadcast?: (character: Character) => void,
  onStatusChange?: (status: "connecting" | "connected" | "error" | "reconnecting") => void
): FirestoreRealtimeSubscription => {
  const isLocalMode = localStorage.getItem("df_local_mode") === "true";
  if (isLocalMode) {
    debugLogger.log("[FirestoreRealtime]", `Local mode detected - skipping realtime subscription for party ${partyId}`, "info");
    console.log("[FirestoreRealtime] Local mode detected - skipping realtime subscription");
    onStatusChange?.("connected");
    return {
      unsubscribe: () => {
        debugLogger.log("[FirestoreRealtime]", "Local mode - no subscription to clean up", "info");
      },
      status: "connected",
    };
  }

  if (!firestore) {
    console.error("[FirestoreRealtime] Firestore not initialized");
    onStatusChange?.("error");
    return {
      unsubscribe: () => {},
      status: "error",
    };
  }

  debugLogger.log("[FirestoreRealtime]", `Starting Firestore realtime subscription to party ${partyId}`, "info");
  
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
      debugLogger.log("[FirestoreRealtime]", `Attempting to subscribe to party ${partyId} (attempt ${attempt + 1}/${MAX_RETRIES})`, "info");
    } else {
      status = "reconnecting";
      onStatusChange?.("reconnecting");
      debugLogger.log("[FirestoreRealtime]", `Reconnecting to party ${partyId} (attempt ${attempt + 1}/${MAX_RETRIES})`, "warn");
    }

    console.log(`[FirestoreRealtime] Attempting to subscribe to party ${partyId} (attempt ${attempt + 1}/${MAX_RETRIES})`);

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
              debugLogger.log("[FirestoreRealtime]", `Connected to party ${partyId}`, "info");
              console.log(`[FirestoreRealtime] Connected to party ${partyId}`);
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

              debugLogger.log("[FirestoreRealtime]", `Received update for character ${character.name}`, "info");
              console.log(`[FirestoreRealtime] Character updated: ${character.name}`);
              
              onUpdate(payload);
            } else if (change.type === "removed") {
              debugLogger.log("[FirestoreRealtime]", `Character removed: ${change.doc.id}`, "info");
              console.log(`[FirestoreRealtime] Character removed: ${change.doc.id}`);
              
              onUpdate({
                old: { id: change.doc.id },
                eventType: "DELETE",
              });
            }
          });
        },
        (error) => {
          console.error("[FirestoreRealtime] Snapshot error:", error);
          debugLogger.log("[FirestoreRealtime]", `Snapshot error: ${error.message}`, "error", { partyId });

          if (currentUnsubscribe) {
            currentUnsubscribe();
            currentUnsubscribe = null;
          }

          if (attempt < MAX_RETRIES - 1) {
            status = "error";
            onStatusChange?.("error");
            
            const backoffMs = calculateBackoff(attempt);
            console.log(`[FirestoreRealtime] Scheduling retry in ${backoffMs}ms`);
            debugLogger.log("[FirestoreRealtime]", `Scheduling retry in ${backoffMs}ms`, "warn", { attempt: attempt + 1, backoffMs });
            
            retryTimeoutHandle = setTimeout(() => {
              attemptSubscribe(attempt + 1);
            }, backoffMs);
          } else {
            status = "error";
            onStatusChange?.("error");
            console.error(
              `[FirestoreRealtime] Max retries (${MAX_RETRIES}) reached for party ${partyId}. Manual reconnection required.`
            );
            debugLogger.log("[FirestoreRealtime]", `Max retries (${MAX_RETRIES}) reached. Manual reconnection required.`, "error", { partyId });
          }
        }
      );

      debugLogger.log("[FirestoreRealtime]", `onSnapshot listener attached for party ${partyId}`, "info");
      console.log(`[FirestoreRealtime] onSnapshot listener attached for party ${partyId}`);

      timeoutHandle = setTimeout(() => {
        if (!eventReceived) {
          const timeoutMsg = `Timeout after ${TIMEOUT_MS}ms for party ${partyId} (attempt ${attempt + 1}/${MAX_RETRIES}) - no events received`;
          console.error(`[FirestoreRealtime] ${timeoutMsg}`);
          debugLogger.log("[FirestoreRealtime]", timeoutMsg, "error", { 
            partyId, 
            attempt: attempt + 1,
            totalAttempts: MAX_RETRIES,
            timeoutMs: TIMEOUT_MS 
          });

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
            console.error(
              `[FirestoreRealtime] Max retries (${MAX_RETRIES}) reached for party ${partyId}. Manual reconnection required.`
            );
          }
        }
      }, TIMEOUT_MS);

      debugLogger.log("[FirestoreRealtime]", `Timeout handler configured for ${TIMEOUT_MS}ms`, "info", { partyId });

    } catch (err: unknown) {
      const errMsg = `Error setting up listener: ${err instanceof Error ? err.message : String(err)}`;
      console.error(`[FirestoreRealtime] ${errMsg}`);
      debugLogger.log("[FirestoreRealtime]", errMsg, "error", { partyId, error: err instanceof Error ? err.message : String(err) });

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
      console.warn("[BroadcastFirestore] Database not initialized");
      return { error: new Error("Database not initialized") };
    }

    const broadcastRef = ref(database, `parties/${partyId}/broadcasts/${character.id}`);
    await set(broadcastRef, {
      character,
      timestamp: new Date().toISOString(),
    });

    console.log(`[BroadcastFirestore] Character ${character.name} broadcasted to party ${partyId}`);
    debugLogger.log("[BroadcastFirestore]", `Broadcasted character: ${character.name}`, "info");

    return { error: null };
  } catch (e: unknown) {
    console.error("[BroadcastFirestore] Failed:", e);
    debugLogger.log("[BroadcastFirestore]", `Broadcast failed: ${e instanceof Error ? e.message : String(e)}`, "error");
    return { error: e instanceof Error ? e : new Error(String(e)) };
  }
};

export const subscribeToPartyResourcesRealtime = (
  partyId: string,
  onUpdate: (resources: Record<string, unknown> | null) => void
): (() => void) => {
  if (!database) {
    console.warn("[PartyResourcesRealtime] Database not initialized");
    return () => {};
  }

  debugLogger.log("[PartyResourcesRealtime]", `Starting subscription to party resources ${partyId}`, "info");

  const resourcesRef = ref(database, `parties/${partyId}/resources`);

  const unsubscribe: Unsubscribe = onValue(
    resourcesRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("[PartyResourcesRealtime] Resources received:", Object.keys(data || {}).length);
        debugLogger.log("[PartyResourcesRealtime]", `Resources update received`, "info");
        onUpdate(data);
      } else {
        console.log("[PartyResourcesRealtime] No resources found");
        onUpdate(null);
      }
    },
    (error) => {
      console.error("[PartyResourcesRealtime] Error:", error);
      debugLogger.log("[PartyResourcesRealtime]", `Error: ${error.message}`, "error");
    }
  );

  return () => {
    debugLogger.log("[PartyResourcesRealtime]", `Unsubscribing from party resources ${partyId}`, "info");
    unsubscribe();
  };
};


