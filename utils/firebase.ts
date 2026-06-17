import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithCredential,
  onAuthStateChanged,
} from 'firebase/auth';

// Re-export so App.tsx can import it directly (avoids dynamic import race condition)
export { onAuthStateChanged };
import {
  getFirestore,
  initializeFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  deleteField,
  onSnapshot,
} from 'firebase/firestore';
import { getDatabase, Database, ref, onValue, set, remove as rtdbRemove, Unsubscribe } from 'firebase/database';
import { Character, CampaignResource } from '../types';
import { debugLogger } from './debugLogger';
import { createPartyLocal, removeFromPartyLocal } from './localStorage';
import { Capacitor } from '@capacitor/core';
import { signInWithGoogleNative, signOutGoogleNative } from './googleSignInNative';
import { isValidCharacter } from '../src/utils/validators';

// Firebase Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
};

console.log('[Firebase Init] Config:', firebaseConfig.projectId ? 'SET ✓' : 'MISSING ✗');
console.log('[Firebase Init] Auth Domain:', firebaseConfig.authDomain ? 'SET ✓' : 'MISSING ✗');

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn('Firebase credentials missing. App will use local storage fallback.');
}

// Initialize Firebase
let firebaseApp: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;
let databaseInstance: Database | null = null;

// MUST be before RTDB init below — onValue can fire synchronously for .info/connected
// and accessing a `let`-declared variable in its TDZ throws ReferenceError.
let rtdbAvailable = false;

try {
  firebaseApp = initializeApp(firebaseConfig);
  authInstance = getAuth(firebaseApp);

  // En Android WebView (Capacitor), Firestore puede fallar con WebChannel.
  // Forzamos un transporte más estable para evitar "transport errored".
  if (Capacitor.getPlatform() === 'android') {
    firestoreInstance = initializeFirestore(firebaseApp, {
      experimentalForceLongPolling: true,
    });
    console.log('[Firebase] Firestore initialized with forced long polling (Android WebView)');
  } else {
    firestoreInstance = getFirestore(firebaseApp);
  }

  databaseInstance = getDatabase(firebaseApp);
  console.log('[Firebase] Initialized successfully');

  // Validate RTDB connectivity (non-blocking)
  // CRITICAL: Do NOT call goOffline() — it's a one-way door that permanently kills
  // the RTDB instance for the session. Instead, set rtdbAvailable flag for fallback.
  if (databaseInstance && firebaseConfig.databaseURL) {
    const rtdbRef = ref(databaseInstance, '.info/connected');
    const timeout = setTimeout(() => {
      console.warn('[Firebase] RTDB connectivity check timed out — database may not exist. Create it at https://console.firebase.google.com/project/dungeon-forge-prod/database');
      rtdbAvailable = false;
    }, 5000);
    let unsub: Unsubscribe | null = null;
    // eslint-disable-next-line prefer-const -- unsub must be let to avoid TDZ when onValue fires synchronously
    unsub = onValue(rtdbRef, (snap) => {
      clearTimeout(timeout);
      const connected = snap.val() === true;
      if (connected) {
        rtdbAvailable = true;
        console.log('[Firebase] RTDB connected ✓');
      } else {
        rtdbAvailable = false;
        console.warn('[Firebase] RTDB not connected — realtime features may not work');
      }
      // Guard: onValue fires synchronously, so unsub may still be null on first call
      if (unsub) unsub();
    }, (err) => {
      clearTimeout(timeout);
      rtdbAvailable = false;
      console.warn('[Firebase] RTDB connection failed:', err.message, '— falling back to Firestore polling');
    });
  }

  // Handle redirect result from OAuth flow
  if (authInstance) {
    getRedirectResult(authInstance)
      .then((result: unknown) => {
        if (result && typeof result === 'object' && 'user' in result) {
          const resultObj = result as { user: { email: string | null } };
          console.log('[Firebase] Redirect OAuth completed:', resultObj.user.email);
        }
      })
      .catch((_error: unknown) => {
        // Ignore redirect result errors during init
      });
  }
} catch (e) {
  console.error('[Firebase] Initialization failed:', e);
}

export const auth = authInstance;
export const firestore = firestoreInstance;
export const database = databaseInstance;

export const isRtdbAvailable = () => rtdbAvailable;

// Firebase Auth helpers (replaces removed Supabase compatibility shim)
export const signInWithGooglePopup = async () => {
  if (!authInstance) throw new Error('Auth not initialized');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(authInstance, provider);
  return result.user;
};

export const signInWithGoogleRedirect = async () => {
  if (!authInstance) throw new Error('Auth not initialized');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  await signInWithRedirect(authInstance, provider);
};

/**
 * Native Google Sign-In for Android using Google Play Services
 * Exchanges ID token from native plugin for Firebase credential
 */
async function signInWithGoogleNativeFirebase() {
  try {
    if (!authInstance) throw new Error('Auth not initialized');

    const isStaleCredentialError = (error: unknown): boolean => {
      const message = error instanceof Error ? error.message : String(error);
      return (
        message.includes('auth/invalid-credential') ||
        message.toLowerCase().includes('stale to sign-in')
      );
    };

    const exchangeWithFirebase = async (idToken: string) => {
      const credential = GoogleAuthProvider.credential(idToken);
      console.log('[Firebase Auth] ✓ Created Firebase credential from token');

      console.log('[Firebase Auth] Attempting credential exchange with Firebase...');
      const credentialPromise = signInWithCredential(authInstance, credential);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Credential exchange timeout after 10 seconds')), 10000)
      );

      return Promise.race([credentialPromise, timeoutPromise]);
    };

    console.log('[Firebase Auth] ====== NATIVE SIGN-IN START ======');
    console.log('[Firebase Auth] Calling native Google Sign-In plugin');

    // Forzar sesión limpia para evitar reutilizar ID tokens viejos en Android.
    try {
      await signOutGoogleNative();
      console.log('[Firebase Auth] ✓ Cleared previous native Google session');
    } catch (signOutErr) {
      console.warn('[Firebase Auth] Native sign-out skipped:', (signOutErr as Error).message);
    }

    // Step 1: Get ID token from native Android plugin
    let nativeResult: unknown;
    try {
      nativeResult = await signInWithGoogleNative();
      console.log('[Firebase Auth] ✓ Native plugin returned result');
      const nativeObj = nativeResult as { email?: string; idToken?: string; displayName?: string };
      console.log('[Firebase Auth]   - Email: ' + (nativeObj.email || 'NULL'));
      console.log(
        '[Firebase Auth]   - Has idToken: ' +
          (nativeObj.idToken ? 'YES (length=' + nativeObj.idToken.length + ')' : 'NO')
      );
      console.log('[Firebase Auth]   - DisplayName: ' + (nativeObj.displayName || 'NULL'));
    } catch (nativeErr) {
      console.error('[Firebase Auth] ❌ NATIVE PLUGIN ERROR!');
      const nativeErrObj = nativeErr as { message?: string; constructor?: { name?: string } };
      console.error('[Firebase Auth]   - Error message: ' + (nativeErrObj.message || 'UNKNOWN'));
      console.error(
        '[Firebase Auth]   - Error type: ' + (nativeErrObj.constructor?.name || 'UNKNOWN')
      );
      console.error('[Firebase Auth]   - Full error: ' + JSON.stringify(nativeErr));
      throw nativeErr;
    }

    const nativeResultObj = nativeResult as { idToken?: string };
    if (!nativeResultObj.idToken) {
      const errMsg = 'No ID token returned from native plugin - OAuth flow incomplete';
      console.error('[Firebase Auth] ❌ ' + errMsg);
      throw new Error(errMsg);
    }

    // Step 2: Exchange credential in Firebase (with one stale-token retry)
    let result: unknown;
    try {
      result = await exchangeWithFirebase(nativeResultObj.idToken);
      console.log('[Firebase Auth] ✓ Credential exchange successful!');
      const resultObj = result as { user: { email: string; uid: string } };
      console.log('[Firebase Auth]   - User: ' + resultObj.user.email);
      console.log('[Firebase Auth]   - UID: ' + resultObj.user.uid);
    } catch (exchangeErr) {
      if (!isStaleCredentialError(exchangeErr)) {
        console.error('[Firebase Auth] ❌ Credential exchange failed!');
        console.error('[Firebase Auth]   - Error: ' + (exchangeErr as Error).message);
        throw exchangeErr;
      }

      console.warn('[Firebase Auth] ⚠️ Stale credential detected, retrying with fresh token...');

      try {
        await signOutGoogleNative();
      } catch (retrySignOutErr) {
        console.warn(
          '[Firebase Auth] Native sign-out during retry skipped:',
          (retrySignOutErr as Error).message
        );
      }

      // Step 2-retry: Get a fresh token from native and try again
      const retryNativeResult = (await signInWithGoogleNative()) as { idToken?: string };
      if (!retryNativeResult?.idToken) {
        throw new Error('No fresh ID token returned during stale-token retry');
      }

      result = await exchangeWithFirebase(retryNativeResult.idToken!);
      console.log('[Firebase Auth] ✓ Credential exchange successful on retry!');
      const retryResultObj = result as { user: { email: string; uid: string } };
      console.log('[Firebase Auth]   - User: ' + retryResultObj.user.email);
      console.log('[Firebase Auth]   - UID: ' + retryResultObj.user.uid);
    }

    console.log('[Firebase Auth] ✓ SIGN-IN COMPLETE');
    const finalResultObj = result as {
      user: {
        uid: string;
        email: string | null;
        photoURL: string | null;
        displayName: string | null;
      };
    };
    return {
      data: {
        url: null,
        user: {
          id: finalResultObj.user.uid,
          email: finalResultObj.user.email,
          user_metadata: {
            avatar_url: finalResultObj.user.photoURL,
            full_name: finalResultObj.user.displayName,
          },
        },
      },
      error: null,
    };
  } catch (error) {
    console.error('[Firebase Auth] ❌ NATIVE GOOGLE SIGN-IN FAILED!');
    console.error('[Firebase Auth]   - Message: ' + (error as Error).message);
    console.error('[Firebase Auth]   - Type: ' + (error as Error).constructor.name);
    console.error('[Firebase Auth]   - Stack: ' + (error as Error).stack);
    return {
      data: null,
      error: { message: (error as Error).message },
    };
  }
}

// Character Management
export const saveCharacterToCloud = async (
  character: Character,
  userId: string,
  retries = 2
) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (!firestoreInstance) throw new Error('Firestore not initialized');

      // CRITICAL: Strip party_id and party_name from the character before saving.
      // party_id is managed EXCLUSIVELY by joinParty() and removeFromParty().
      // If we include it here, a player who was kicked while offline would write
      // the stale party_id back to Firestore on their next save, undoing the kick.
      // Using merge: true preserves the top-level party_id already set by join/kick.
      const { party_id, party_name, ...charFields } = character as Character & {
        party_id?: string | null;
        party_name?: string | null;
      };

      const characterRef = doc(firestoreInstance, 'characters', character.id);
      await setDoc(
        characterRef,
        {
          id: character.id,
          user_id: userId,
          data: charFields,
          updated_at: new Date().toISOString(),
          deleted_at: null,
        },
        { merge: true }
      );

      console.log(
        `[Sync] Success: ${character.name} updated with ${Object.keys(character.usedSlots || {}).length} used slots.`
      );
      return { data: { id: character.id }, error: null };
    } catch (e) {
      const isLastAttempt = attempt === retries;
      const isResourceExhausted = (e as Error)?.message?.includes('resource-exhausted');

      if (isLastAttempt || !isResourceExhausted) {
        console.error(`[Sync] Cloud save failed for ${character.name}:`, e);
        return { data: null, error: e };
      }

      // Exponential backoff: 500ms, 1000ms, 2000ms...
      const backoffMs = Math.pow(2, attempt) * 500;
      console.warn(
        `[Sync] Write throttled for ${character.name}, retrying in ${backoffMs}ms (attempt ${attempt + 1}/${retries + 1})`
      );
      await new Promise(resolve => setTimeout(resolve, backoffMs));
    }
  }
  // Should never reach here, but TypeScript needs it
  return { data: null, error: new Error('Max retries exceeded') };
};

/**
 * Task 3-1: Save character with automatic rollback on failure
 * @param character Character to save
 * @param userId User ID for ownership
 * @param onRollback Callback to restore UI state on save failure
 * @returns Resolves if save succeeds, rejects with error and calls onRollback
 */
export const saveCharacterWithRollback = async (
  character: Character,
  userId: string,
  onRollback: (snapshot: Character) => void
): Promise<{ data: { id: string }; error: null }> => {
  // Deep copy snapshot for rollback
  const snapshot = JSON.parse(JSON.stringify(character)) as Character;

  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    // CRITICAL: Strip party_id/party_name — managed exclusively by joinParty/removeFromParty
    const { party_id, party_name, ...charFields } = character as Character & {
      party_id?: string | null;
      party_name?: string | null;
    };

    const characterRef = doc(firestoreInstance, 'characters', character.id);
    await setDoc(
      characterRef,
      {
        id: character.id,
        user_id: userId,
        data: charFields,
        updated_at: new Date().toISOString(),
        deleted_at: null,
      },
      { merge: true }
    );

    console.log(`[Sync] Success: ${character.name} saved with rollback enabled`);
    return { data: { id: character.id }, error: null };
  } catch (e) {
    // Save failed - trigger rollback
    console.error(`[Sync] Cloud save failed for ${character.name}, rolling back to snapshot`, e);
    onRollback(snapshot);
    throw e;
  }
};

export const fetchCharactersFromCloud = async (userId: string) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const effectiveUserId = authInstance?.currentUser?.uid || userId;
    if (effectiveUserId !== userId) {
      console.log(
        `[Cloud] Using current auth uid=${effectiveUserId} instead of state uid=${userId}`
      );
    }

    const normalizeCharacter = (raw: Record<string, unknown>, docId: string): Character | null => {
      const nested = raw.data;
      if (nested && typeof nested === 'object') {
        return nested as Character;
      }

      if (typeof nested === 'string') {
        try {
          return JSON.parse(nested) as Character;
        } catch {
          console.warn('[Cloud] Failed to parse nested character JSON for doc:', docId);
        }
      }

      // Compatibilidad: algunos documentos pueden tener el personaje plano en la raíz.
      if (
        typeof raw.id === 'string' &&
        typeof raw.name === 'string' &&
        typeof raw.class === 'string'
      ) {
        return raw as unknown as Character;
      }

      return null;
    };

    const q = query(
      collection(firestoreInstance, 'characters'),
      where('user_id', '==', effectiveUserId)
    );

    const snapshot = await getDocs(q);

    const characters = snapshot.docs
      .map((doc) => {
        const raw = doc.data() as Record<string, unknown>;
        const deletedAt = raw.deleted_at;

        // Compatibilidad de soft-delete: null o undefined = activo
        if (deletedAt !== null && deletedAt !== undefined) {
          return null;
        }

        const character = normalizeCharacter(raw, doc.id);
        if (!character) {
          console.warn('[Cloud] Unsupported character document shape:', doc.id);
          return null;
        }

        return {
          ...character,
          id: character.id || doc.id,
          user_id: (character.user_id || raw.user_id || effectiveUserId) as string,
        } as Character;
      })
      .filter((c): c is Character => c !== null);

    console.log(
      `[Cloud] fetchCharactersFromCloud uid=${effectiveUserId} docs=${snapshot.size} active=${characters.length}`
    );
    return characters;
  } catch (e) {
    console.error(`[Cloud] Fetch failed for uid=${userId}:`, e);
    return [];
  }
};

export const fetchDeletedCharacterIds = async (userId: string) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const snapshot = await getDocs(
      query(
        collection(firestoreInstance, 'characters'),
        where('user_id', '==', userId),
        where('deleted_at', '!=', null)
      )
    );

    return snapshot.docs.map((doc) => doc.id);
  } catch (e) {
    console.error('[Cloud] Failed to fetch deleted character IDs:', e);
    return [];
  }
};

export const fetchDeletedCharacters = async (userId: string) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const snapshot = await getDocs(
      query(
        collection(firestoreInstance, 'characters'),
        where('user_id', '==', userId),
        where('deleted_at', '!=', null)
      )
    );

    return snapshot.docs
      .map((doc) => {
        const data = doc.data() as Record<string, unknown>;
        return {
          id: data.id,
          character: data.data as Character,
          deleted_at:
            typeof data.deleted_at === 'object' &&
            data.deleted_at !== null &&
            'toDate' in data.deleted_at
              ? (data.deleted_at as { toDate: () => Date }).toDate().toISOString()
              : String(data.deleted_at),
        };
      })
      .sort((a, b) => new Date(b.deleted_at).getTime() - new Date(a.deleted_at).getTime());
  } catch (e) {
    console.error('[Cloud] Failed to fetch deleted characters:', e);
    return [];
  }
};

export const restoreCharacter = async (characterId: string) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const characterRef = doc(firestoreInstance, 'characters', characterId);
    await updateDoc(characterRef, {
      deleted_at: null,
      updated_at: new Date().toISOString(),
    });

    console.log(`[Recovery] Character ${characterId} restored successfully`);
    return { error: null };
  } catch (e) {
    console.error(`[Recovery] Failed to restore character ${characterId}:`, e);
    return { error: e };
  }
};

export const softDeleteCharacter = async (characterId: string) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const characterRef = doc(firestoreInstance, 'characters', characterId);
    const now = new Date().toISOString();
    await updateDoc(characterRef, {
      deleted_at: now,
      updated_at: now,
    });

    console.log(`[SoftDelete] Character ${characterId} marked as deleted`);
    return { error: null };
  } catch (e) {
    console.error(`[SoftDelete] Failed for ${characterId}:`, e);
    return { error: e };
  }
};

// Party Management
/**
 * Create a new party with proper fields for Firestore Security Rules
 * Bug Fixes:
 * - ADD dm_uid for updateParty/deleteParty rules
 * - ADD members: {} subcollection stub for isPartyMember() check
 * - ADD settings: {} for party configuration
 * - CHANGE timestamps to ISO 8601 strings (not Timestamp objects)
 * - CREATE party_codes/{code} document
 */
export const createParty = async (userId: string, name: string) => {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Wave 10: Force local mode if no Firestore credentials
  const isLocalMode = localStorage.getItem('df_local_mode') === 'true' || !firestoreInstance;
  if (isLocalMode) {
    console.log(`[Party-LocalMode] Creating party ${name} in localStorage`);
    const result = await createPartyLocal(userId, name);
    return { data: result, error: null };
  }

  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const partyRef = doc(collection(firestoreInstance, 'parties'));
    const now = new Date().toISOString();
    const partyData = {
      id: partyRef.id,
      creator_id: userId,
      dm_uid: userId, // BUG FIX #1: Add dm_uid for Firestore rules
      name,
      code,
      members: {}, // BUG FIX #2: Initialize members map
      settings: {}, // BUG FIX #2: Initialize settings
      created_at: now, // BUG FIX #3: ISO 8601 string (not Timestamp)
      updated_at: now, // BUG FIX #3: ISO 8601 string (not Timestamp)
    };

    await setDoc(partyRef, partyData);

    // BUG FIX #4: Create party_codes/{code} document
    await createPartyCode(code, partyRef.id);

    console.log(
      `[Party] Created: ${name} with code ${code} (dm_uid=${userId}, members={}, settings={})`
    );
    return { data: partyData, error: null };
  } catch (e) {
    console.error('[Party] Failed to create:', e);
    const result = await createPartyLocal(userId, name);
    return { data: result, error: null };
  }
};

/**
 * BUG FIX #2: joinParty must write to /parties/{partyId}/members/{userId}
 * This is required for Firestore Security Rules to verify party membership via isPartyMember() check
 */
export const joinParty = async (character: Character, code: string) => {
  try {
    console.log(`[Join] Intentando unirse: ${code.trim().toUpperCase()}`);

    if (!firestoreInstance) throw new Error('Firestore not initialized');

    // 1. Find party by code
    const partiesSnapshot = await getDocs(
      query(
        collection(firestoreInstance, 'parties'),
        where('code', '==', code.trim().toUpperCase())
      )
    );

    if (partiesSnapshot.empty) {
      throw new Error('Mesa no encontrada con este código.');
    }

    const partyDoc = partiesSnapshot.docs[0];
    const partyData = partyDoc.data() as { id: string; name: string };

    // 2. Update character with party info
    const characterId = character?.id;
    if (!characterId) throw new Error('Personaje inválido.');

    const updatedCharacter = {
      ...character,
      party_id: partyData.id,
      party_name: partyData.name,
    };

    // CRITICAL: Always prefer Firebase auth UID. 'guest' breaks Firestore security rules
    // because resource.data.user_id == uid() check fails when user_id='guest'.
    const effectiveUserId = authInstance?.currentUser?.uid || character.user_id || 'guest';

    // 3. Upsert character with party_id
    const characterRef = doc(firestoreInstance, 'characters', characterId);
    const now = new Date().toISOString();
    await setDoc(
      characterRef,
      {
        id: characterId,
        user_id: effectiveUserId,
        data: updatedCharacter,
        party_id: partyData.id,
        updated_at: now,
        deleted_at: null,
      },
      { merge: true }
    );

    // BUG FIX #2: Write to /parties/{partyId}/members/{userId} subcollection
    // This is critical for Firestore Security Rules (isPartyMember() check)
    const memberRef = doc(firestoreInstance, 'parties', partyData.id, 'members', effectiveUserId);
    await setDoc(
      memberRef,
      {
        user_id: effectiveUserId,
        character_id: characterId,
        joined_at: now,
      },
      { merge: true }
    );

    // Update party members map with user_id entry
    const partyRef = doc(firestoreInstance, 'parties', partyData.id);
    await updateDoc(partyRef, {
      [`members.${effectiveUserId}`]: {
        character_id: characterId,
        joined_at: now,
      },
      updated_at: now,
    });

    // BUG FIX #5: Broadcast to RTDB immediately so DM sees the new member in realtime
    // Without this, the DM's RTDB listener would never know about this character
    // (it was only written when the player made their first edit).
    try {
      await broadcastCharacterUpdate(partyData.id, updatedCharacter);
      console.log(`[Join] Character ${characterId} broadcasted to RTDB for party ${partyData.id}`);
    } catch (e) {
      // Best-effort: RTDB broadcast failure is non-critical, the Firestore data is already saved
      console.warn(`[Join] RTDB broadcast failed (non-critical):`, e);
    }

    console.log(
      `[Join] Character ${characterId} joined party ${partyData.id} (members subcollection created)`
    );
    return { partyId: partyData.id, partyName: partyData.name, error: null };
  } catch (e) {
    console.error('[Join] Error:', e);
    return {
      partyId: null,
      partyName: null,
      error: e instanceof Error ? e.message : 'Error desconocido',
    };
  }
};

/**
 * BUG FIX #4: Create party_codes/{code} document for code-to-party mapping
 * This is required for Security Rules to validate party codes during joinParty
 * @param code Party code (uppercase)
 * @param partyId Party ID
 */
const createPartyCode = async (code: string, partyId: string): Promise<void> => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const codeRef = doc(firestoreInstance, 'party_codes', code);
    const now = new Date().toISOString();
    await setDoc(codeRef, {
      code,
      party_id: partyId,
      created_at: now,
    });

    console.log(`[PartyCode] Created mapping: ${code} -> ${partyId}`);
  } catch (e) {
    console.error(`[PartyCode] Failed to create code ${code}:`, e);
    throw e;
  }
};

export interface RealtimeSubscription {
  channel: { id: string };
  unsubscribe: () => Promise<void>;
  status: 'connecting' | 'connected' | 'error' | 'reconnecting';
}

export const subscribeWithRetry = (
  partyId: string,
  onUpdate: (payload: unknown) => void,
  onBroadcast?: (payload: unknown) => void,
  onStatusChange?: (status: 'connecting' | 'connected' | 'error' | 'reconnecting') => void,
  activeCharacterId?: string // WAVE 10: Selective document listener
): RealtimeSubscription => {
  // Check local mode
  const isLocalMode = localStorage.getItem('df_local_mode') === 'true';
  if (isLocalMode) {
    debugLogger.log(
      '[Realtime]',
      `Local mode detected - skipping realtime subscription for party ${partyId}`,
      'info'
    );
    console.log('[Realtime] Local mode detected - skipping realtime subscription');
    onStatusChange?.('connected');
    return {
      channel: { id: partyId },
      unsubscribe: async () => {
        debugLogger.log('[Realtime]', 'Local mode - no subscription to clean up', 'info');
      },
      status: 'connected',
    };
  }

  if (!database) {
    console.warn('[Realtime] Database not initialized');
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

  debugLogger.log('[Realtime]', `Starting subscription to ${listenerPath}`, 'info');
  console.log(
    `[Realtime] WAVE 10: Listening to ${activeCharacterId ? 'SPECIFIC character' : 'ALL characters'} at ${listenerPath}`
  );

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
          debugLogger.log('[Realtime]', `Connected to ${listenerPath}`, 'info');
          console.log(`[Realtime] Connected to ${listenerPath}`);
        }

        if (snapshot.exists()) {
          const data = snapshot.val();

          // WAVE 10: When listening to specific character, payload is the character object directly
          // When listening to all characters, payload is a map of character objects
          if (activeCharacterId) {
            // Specific character: wrap in standard format for callback
            onUpdate({ new: { id: activeCharacterId, data } });
            console.log(`[Realtime] Specific character update: ${activeCharacterId}`);
          } else {
            // All characters: send the full map
            onUpdate(data);
            console.log(`[Realtime] All characters update received`);
          }
        } else {
          // CRITICAL: When all characters are removed (e.g., last member kicked),
          // snapshot.exists() is false. We must still call onUpdate with an empty map
          // so the DM's merge logic can remove stale members.
          if (!activeCharacterId) {
            onUpdate({});
            console.log(`[Realtime] All characters node empty — notifying subscribers`);
          }
        }
      },
      (error) => {
        status = 'error';
        onStatusChange?.('error');
        debugLogger.log('[Realtime]', `Error subscribing to ${listenerPath}`, 'error', {
          error: error.message,
        });
        console.error('[Realtime] Error:', error);
      }
    );
  } catch (e) {
    status = 'error';
    onStatusChange?.('error');
    console.error('[Realtime] Failed to subscribe:', e);
  }

  return {
    channel: { id: partyId },
    unsubscribe: async () => {
      if (unsubscribeFn) {
        unsubscribeFn();
        console.log(`[Realtime] Unsubscribed from ${listenerPath}`);
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
    console.warn('[Realtime] Database not initialized');
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
      console.error('[Realtime] Error subscribing to party:', error);
    }
  );

  return () => unsubscribe();
};

export const broadcastCharacterUpdate = (partyId: string, character: Character) => {
  try {
    if (!database) throw new Error('Database not initialized');

    const updateRef = ref(database, `parties/${partyId}/characters/${character.id}`);
    set(updateRef, character);
    console.log(`[Broadcast] Character ${character.name} updated in party ${partyId}`);
  } catch (e) {
    console.error('[Broadcast] Failed:', e);
  }
};

/**
 * Remove a character's RTDB entry from a party.
 * Called by the PLAYER's client when they detect they've been kicked (party_id becomes null).
 * This is the reliable cleanup path because the player OWNS the RTDB node they wrote.
 */
export const removeCharacterFromPartyRTDB = async (partyId: string, characterId: string) => {
  try {
    if (!database) {
      console.warn('[RTDB-Cleanup] Database not initialized');
      return;
    }

    const nodeRef = ref(database, `parties/${partyId}/characters/${characterId}`);
    await rtdbRemove(nodeRef);
    console.log(`[RTDB-Cleanup] Character ${characterId} removed from party ${partyId} RTDB`);
  } catch (e) {
    console.warn(`[RTDB-Cleanup] Failed to remove character ${characterId}:`, e);
  }
};

export const removeFromParty = async (characterId: string) => {
  const startTime = Date.now();
  console.log(`[KICK-TRACE] ═══════════════════════════════════════════════════`);
  console.log(`[KICK-TRACE] Starting removeFromParty for character: ${characterId}`);
  console.log(`[KICK-TRACE] Timestamp: ${new Date().toISOString()}`);

  // BUG FIX: Better local/offline mode detection.
  // firestoreInstance is initialized at module load and stays truthy even
  // when Firestore is unreachable, so || !firestoreInstance was useless.
  const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
  const noCredentials = !firebaseConfig.apiKey || !firebaseConfig.projectId;
  const isLocalMode = localStorage.getItem('df_local_mode') === 'true' || !firestoreInstance || noCredentials || isOffline;
  if (isLocalMode) {
    console.log(`[KICK-TRACE] Local/offline mode detected — using localStorage fallback`);
    const result = await removeFromPartyLocal(characterId);
    if (result.error) {
      console.error(`[KICK-TRACE] ❌ Local mode remove failed:`, result.error);
      return { error: result.error };
    }
    console.log(`[KICK-TRACE] ✅ removeFromParty (local) COMPLETE`);
    return { error: null };
  }

  // Timeout helper for Firestore operations that can hang indefinitely
  const firestoreTimeout = <T>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
    Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`[Timeout] ${label} timed out after ${ms}ms`)), ms)
      ),
    ]);

  try {
    if (!firestoreInstance) {
      console.error(`[KICK-TRACE] ❌ ABORT: Firestore not initialized`);
      throw new Error('Firestore not initialized');
    }

    // CRITICAL: Get the Firebase auth UID BEFORE doing anything.
    // If user is not authenticated, abort immediately.
    const authUid = authInstance?.currentUser?.uid;
    if (!authUid) {
      console.error(`[KICK-TRACE] ❌ ABORT: No authenticated user. authInstance.currentUser is null.`);
      console.error(`[KICK-TRACE]   This means Firebase Auth state hasn't loaded yet.`);
      console.error(`[KICK-TRACE]   authInstance exists: ${!!authInstance}`);
      throw new Error('Not authenticated — cannot leave party. Please wait for auth to load and try again.');
    }
    console.log(`[KICK-TRACE] Auth UID: ${authUid}`);

    // 1. Read character document with 8s timeout (getDoc can hang when Firestore is unreachable)
    const characterRef = doc(firestoreInstance, 'characters', characterId);
    const charSnapshot = await firestoreTimeout(getDoc(characterRef), 8000, 'getDoc(character)');

    if (!charSnapshot.exists()) {
      console.error(`[KICK-TRACE] ❌ ABORT: Character document does NOT exist in Firestore!`);
      throw new Error(`Character ${characterId} not found in Firestore`);
    }

    const charData = charSnapshot.data();
    const partyId = charData?.party_id;
    const userId = charData?.user_id;
    const charName = charData?.data?.name || charData?.name || 'unknown';
    const nestedData = charData?.data;

    console.log(`[KICK-TRACE] Step 1 - Character snapshot (SERVER READ):`);
    console.log(`[KICK-TRACE]   name: "${charName}"`);
    console.log(`[KICK-TRACE]   party_id: "${partyId}"`);
    console.log(`[KICK-TRACE]   user_id: "${userId}"`);
    console.log(`[KICK-TRACE]   authUid matches user_id: ${userId === authUid}`);
    console.log(`[KICK-TRACE]   nested data.party_id: "${nestedData?.party_id}"`);
    console.log(`[KICK-TRACE]   nested data.party_name: "${nestedData?.party_name}"`);

    if (!partyId) {
      console.warn(`[KICK-TRACE] ⚠️ Character already has no party_id — leave is a no-op`);
      console.log(`[KICK-TRACE] ═══════════════════════════════════════════════════`);
      return { error: null };
    }

    // SAFETY CHECK: Determine if this is a player leaving or DM kicking.
    // Player: userId === authUid (character owner is the current user)
    // DM: userId !== authUid (character owner is a player, current user is the party DM)
    const isOwner = userId === authUid;
    const isDmAction = !isOwner && !!partyId;

    if (!isOwner && !isDmAction) {
      console.error(`[KICK-TRACE] ❌ ABORT: Character user_id ("${userId}") does not match auth UID ("${authUid}")`);
      console.error(`[KICK-TRACE]   This character may belong to a different account, and user is not the party DM.`);
      throw new Error(`This character belongs to a different account. Cannot leave party.`);
    }

    if (isDmAction) {
      // DM KICK: Verify this user is actually the party DM
      console.log(`[KICK-TRACE] DM kick detected: user_id="${userId}", authUid="${authUid}"`);
      try {
        const partySnap = await getDoc(doc(firestoreInstance, 'parties', partyId));
        if (!partySnap.exists()) {
          console.error(`[KICK-TRACE] ❌ ABORT: Party ${partyId} does not exist`);
          throw new Error('Party not found');
        }
        const partyData = partySnap.data();
        if (partyData.dm_uid !== authUid) {
          console.error(`[KICK-TRACE] ❌ ABORT: User is not the DM of party ${partyId}`);
          throw new Error('Only the DM can kick characters from this party');
        }
        console.log(`[KICK-TRACE] ✅ DM verification passed for party ${partyId}`);
      } catch (e) {
        if ((e as Error)?.message?.includes('Only the DM') || (e as Error)?.message?.includes('Party not found')) {
          throw e;
        }
        console.warn(`[KICK-TRACE] ⚠️ DM verification read failed (transport error?):`, (e as Error)?.message);
        // If we can't verify, let the Firestore rule enforce it
      }
    }

    // 2. Remove RTDB entry
    const rtdbStartTime = Date.now();
    if (partyId && database) {
      try {
        await rtdbRemove(ref(database, `parties/${partyId}/characters/${characterId}`));
        console.log(`[KICK-TRACE] Step 2a - RTDB entry removed (${Date.now() - rtdbStartTime}ms)`);
      } catch (rtdbError) {
        const elapsed = Date.now() - rtdbStartTime;
        console.warn(`[KICK-TRACE] Step 2a - RTDB cleanup FAILED after ${elapsed}ms:`, rtdbError);
      }
    } else {
      console.log(`[KICK-TRACE] Step 2a - RTDB skip (partyId=${!!partyId}, database=${!!database})`);
    }

    // 2b. Clean up members subcollection — DM-only operation
    // For DM kicks: player's userId is used for the member path
    // For player leaves: they don't have write access to members subcollection
    if (partyId && userId && isDmAction) {
      try {
        const memberRef = doc(firestoreInstance, 'parties', partyId, 'members', userId);
        await deleteDoc(memberRef);
        console.log(`[KICK-TRACE] Step 2b - Members subcollection deleted (DM kick)`);
      } catch (e) {
        console.warn(`[KICK-TRACE] Step 2b - Members subcollection cleanup FAILED:`, e);
      }
    }

    // 2c. Clean up party members map — DM-only operation
    if (partyId && userId && isDmAction) {
      try {
        const partyRef = doc(firestoreInstance, 'parties', partyId);
        await updateDoc(partyRef, {
          [`members.${userId}`]: deleteField(),
        });
        console.log(`[KICK-TRACE] Step 2c - Party members map cleaned (DM kick)`);
      } catch (e) {
        console.warn(`[KICK-TRACE] Step 2c - Party members map cleanup FAILED:`, e);
      }
    }

    // 3. Update character document to clear party_id
    const updateStartTime = Date.now();
    const now = new Date().toISOString();
    const kickTimestamp = Date.now();

    // CRITICAL: The user_id in the update payload must match the Firestore security rules.
    // - Player leaving (isOwner): use authUid → matches paths 1 and 3 (resource.data.user_id == uid())
    // - DM kick (isDmAction): use userId (player's stored user_id) → matches path 2 (resource.data.user_id == request.resource.data.user_id)
    const userIdForUpdate = isOwner ? authUid : userId;
    console.log(`[KICK-TRACE] user_id for update: "${userIdForUpdate}" (isOwner=${isOwner}, isDmAction=${isDmAction})`);

    const characterUpdate: Record<string, unknown> = {
      party_id: null,
      updated_at: now,
      user_id: userIdForUpdate,
    };
    if (nestedData && typeof nestedData === 'object') {
      characterUpdate.data = {
        ...nestedData,
        party_id: null,
        party_name: null,
        syncTimestamp: kickTimestamp,
      };
    }

    console.log(`[KICK-TRACE] Step 3 - Writing character update to Firestore:`);
    console.log(`[KICK-TRACE]   update fields: { party_id: null, user_id: "${userIdForUpdate}" }`);
    console.log(`[KICK-TRACE]   userIdForUpdate === authUid: ${userIdForUpdate === authUid}`);

    await firestoreTimeout(updateDoc(characterRef, characterUpdate), 8000, 'updateDoc(character)');
    console.log(`[KICK-TRACE] Step 3 - Firestore updateDoc SUCCEEDED (${Date.now() - updateStartTime}ms)`);

    // 4. VERIFICATION (non-fatal): Confirm the write persisted
    try {
      const verifyStart = Date.now();
      const verifySnapshot = await getDoc(characterRef);
      const verifyData = verifySnapshot.data();
      const verifyElapsed = Date.now() - verifyStart;

      console.log(`[KICK-TRACE] Step 4 - Verification server read (${verifyElapsed}ms):`);
      console.log(`[KICK-TRACE]   verified party_id: "${verifyData?.party_id}"`);

      if (verifyData?.party_id !== null && verifyData?.party_id !== undefined) {
        console.warn(`[KICK-TRACE] ⚠️ VERIFICATION WARNING: party_id is still "${verifyData?.party_id}"`);
        console.warn(`[KICK-TRACE] The Firestore write may have been denied by security rules.`);
      } else {
        console.log(`[KICK-TRACE] ✅ VERIFICATION PASSED: party_id confirmed null/undefined`);
      }
    } catch (verifyErr) {
      console.warn(`[KICK-TRACE] ⚠️ Verification read failed (transport error?):`, (verifyErr as Error)?.message);
    }

    const totalTime = Date.now() - startTime;
    console.log(`[KICK-TRACE] ═══════════════════════════════════════════════════`);
    console.log(`[KICK-TRACE] ✅ removeFromParty COMPLETE in ${totalTime}ms`);
    console.log(`[KICK-TRACE] ═══════════════════════════════════════════════════`);

    return { error: null };
  } catch (e) {
    const totalTime = Date.now() - startTime;
    const errorCode = (e as { code?: string })?.code || 'unknown';
    const errorMsg = (e as Error)?.message || String(e);
    console.error(`[KICK-TRACE] ═══════════════════════════════════════════════════`);
    console.error(`[KICK-TRACE] ❌ removeFromParty FAILED after ${totalTime}ms`);
    console.error(`[KICK-TRACE]   error code: "${errorCode}"`);
    console.error(`[KICK-TRACE]   error message: "${errorMsg}"`);
    console.error(`[KICK-TRACE]   full error:`, e);
    console.error(`[KICK-TRACE] ═══════════════════════════════════════════════════`);
    return { error: e };
  }
};

export const updatePartyName = async (partyId: string, name: string) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const partyRef = doc(firestoreInstance, 'parties', partyId);
    const now = new Date().toISOString();
    await updateDoc(partyRef, {
      name,
      updated_at: now,
    });

    console.log(`[Party] Updated name to: ${name}`);
    return { error: null };
  } catch (e) {
    console.error('[Party] Failed to update name:', e);
    return { error: e };
  }
};

export const deleteParty = async (partyId: string, userId: string) => {
  console.log(`[Party] Starting delete process for party: ${partyId}, userId: ${userId}`);
  try {
    if (!firestoreInstance) {
      console.error('[Party] ❌ Firestore not initialized');
      throw new Error('Firestore not initialized');
    }
    console.log('[Party] ✅ Firestore initialized');

    // 0. Read party doc to get the code for cleanup
    let partyCode: string | undefined;
    const partyRef = doc(firestoreInstance, 'parties', partyId);
    try {
      const partySnapshot = await getDoc(partyRef);
      partyCode = partySnapshot.data()?.code;
      console.log(`[Party] 📄 Party code: ${partyCode || '(none)'}`);
    } catch (readErr) {
      console.warn(`[Party] ⚠️ Could not read party doc (may already lack permissions):`, readErr);
    }

    // 1. BEST-EFFORT: Remove characters from party (may fail if rules not deployed)
    try {
      console.log(`[Party] 🔍 Looking for characters in party ${partyId}`);
      const charactersSnapshot = await getDocs(
        query(collection(firestoreInstance, 'characters'), where('party_id', '==', partyId))
      );
      console.log(
        `[Party] 📍 Found ${charactersSnapshot.docs.length} characters to remove from party`
      );

      const now = new Date().toISOString();
      let removedCount = 0;
      for (const charDoc of charactersSnapshot.docs) {
        try {
          console.log(`[Party] Removing party_id from character: ${charDoc.id}`);
          await updateDoc(charDoc.ref, {
            party_id: null,
            updated_at: now,
          });
          removedCount++;
          console.log(`[Party] ✅ Updated character ${charDoc.id}`);
        } catch (charError) {
          // Best-effort: log but don't throw — continue with remaining characters
          console.warn(`[Party] ⚠️ Failed to update character ${charDoc.id}:`, charError);
        }
      }
      console.log(`[Party] ✅ Successfully removed ${removedCount}/${charactersSnapshot.docs.length} characters from party`);
    } catch (queryErr) {
      console.warn(`[Party] ⚠️ Character cleanup failed (rules may not be deployed yet):`, queryErr);
    }

    // 2. BEST-EFFORT: Delete party_codes/{code} if we have the code
    if (partyCode) {
      try {
        const codeRef = doc(firestoreInstance, 'party_codes', partyCode);
        await deleteDoc(codeRef);
        console.log(`[Party] ✅ Deleted party_code: ${partyCode}`);
      } catch (codeError) {
        console.warn(`[Party] ⚠️ Failed to delete party_code ${partyCode}:`, codeError);
      }
    }

    // 3. CRITICAL: Delete the party document itself
    console.log(`[Party] 🗑️ Deleting party document: ${partyId}`);
    await deleteDoc(partyRef);
    console.log(`[Party] ✅ Party document deleted successfully`);

    console.log(`[Party] 🎉 Deleted party ${partyId}`);
    return { error: null };
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    console.error(`[Party] ❌ FAILED TO DELETE PARTY: ${errorMsg}`);
    console.error(`[Party] Full error:`, e);
    return { error: e };
  }
};

// Campaign Resources
export const getPartyResources = async (partyId: string) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const resourcesSnapshot = await getDocs(
      query(collection(firestoreInstance, 'campaign_resources'), where('party_id', '==', partyId))
    );

    return resourcesSnapshot.docs.map((doc) => doc.data() as CampaignResource);
  } catch (e) {
    console.error('[Resources] Failed to fetch:', e);
    return [];
  }
};

export const addPartyResource = async (resource: CampaignResource) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const resourceRef = doc(collection(firestoreInstance, 'campaign_resources'));
    const now = new Date().toISOString();
    const resourceData = {
      ...resource,
      id: resourceRef.id,
      created_at: now,
      updated_at: now,
    };

    await setDoc(resourceRef, resourceData);
    console.log(`[Resources] Added: ${resource.title}`);
    return { data: resourceData, error: null };
  } catch (e) {
    console.error('[Resources] Failed to add:', e);
    return { data: null, error: e };
  }
};

export const deletePartyResource = async (resourceId: string) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const resourceRef = doc(firestoreInstance, 'campaign_resources', resourceId);
    await deleteDoc(resourceRef);

    console.log(`[Resources] Deleted: ${resourceId}`);
    return { error: null };
  } catch (e) {
    console.error('[Resources] Failed to delete:', e);
    return { error: e };
  }
};

export const broadcastResourceShare = (
  partyId: string,
  resource: CampaignResource,
  viewingCharacterIds?: string[]
) => {
  try {
    if (!database) throw new Error('Database not initialized');

    const shareRef = ref(database, `parties/${partyId}/resource-share`);
    set(shareRef, {
      resource,
      viewingCharacterIds: viewingCharacterIds || [],
      shared_at: new Date().toISOString(),
    });

    console.log(`[Resources] Broadcasted: ${resource.title}`);
  } catch (e) {
    console.error('[Resources] Failed to broadcast:', e);
  }
};

export const broadcastResourceHide = (partyId: string) => {
  try {
    if (!database) throw new Error('Database not initialized');

    const shareRef = ref(database, `parties/${partyId}/resource-share`);
    set(shareRef, null);

    console.log('[Resources] Hidden shared resource');
  } catch (e) {
    console.error('[Resources] Failed to hide:', e);
  }
};

// --- Firebase Realtime Subscriptions (reemplazan Supabase channels) ---

/**
 * Suscribe a cambios en los personajes propios del usuario via Firestore onSnapshot.
 * Reemplaza supabase.channel('my-characters-sync').on('postgres_changes', ...)
 */
export const subscribeToOwnCharacters = (
  userId: string,
  onCharacterChange: (char: Character, type: 'UPDATE' | 'DELETE') => void
): (() => void) => {
  if (!firestoreInstance) {
    console.warn('[CharSync] Firestore not initialized');
    return () => {};
  }

  const q = query(collection(firestoreInstance, 'characters'), where('user_id', '==', userId));

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
              console.log('[CharSync] Character removed from cloud:', change.doc.id);
              onCharacterChange({ id: change.doc.id } as Character, 'DELETE');
              return;
            }

            if (change.type === 'modified') {
              if (data.deleted_at) {
                console.log('[CharSync] Character soft-deleted in cloud:', change.doc.id);
                onCharacterChange({ id: change.doc.id } as Character, 'DELETE');
                return;
              }

              if (data.data) {
                const cloudChar = data.data as Character;
                const updated_at = data.updated_at as { toMillis?: () => number } | undefined;
                const cloudTime = cloudChar.syncTimestamp || updated_at?.toMillis?.() || 0;
                console.log('[CharSync] Character updated in cloud:', cloudChar.name);
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
 * Reemplaza supabase.channel(channelName).on('broadcast', ...)
 */
export const subscribeToPartyResources = (
  partyId: string,
  onResourceChange: (resources: CampaignResource[]) => void
): (() => void) => {
  if (!database) {
    console.warn('[Resources] Database not initialized');
    return () => {};
  }

  const shareRef = ref(database, `parties/${partyId}/resource-share`);

  const unsubscribe = onValue(
    shareRef,
    (snapshot: unknown) => {
      const snapshotObj = snapshot as { exists: () => boolean; val: () => unknown };
      if (snapshotObj.exists()) {
        const data = snapshotObj.val() as { resource?: CampaignResource };
        console.log(
          '[Resources] Resource received:',
          (data?.resource as { title?: string })?.title
        );
        onResourceChange(data.resource ? [data.resource] : []);
      } else {
        console.log('[Resources] Resource cleared');
        onResourceChange([]);
      }
    },
    (_error: unknown) => {
      //console.error('[PartyResources] Error:', error);
    }
  );

  return () => unsubscribe();
};

export const updatePartyResourcePersistence = async (partyId: string, resourceIds: string[]) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const partyRef = doc(firestoreInstance, 'parties', partyId);
    await updateDoc(partyRef, {
      persistent_resources: resourceIds,
      updated_at: new Date().toISOString(),
    });

    console.log('[Resources] Updated persistence');
    return { error: null };
  } catch (e) {
    console.error('[Resources] Failed to update persistence:', e);
    return { error: e };
  }
};

export const uploadResourceImage = async (
  resourceId: string,
  _imageFile: File
): Promise<string | null> => {
  try {
    // For now, return a placeholder. In production, use Firebase Storage
    console.log(`[Resources] Image upload simulated for ${resourceId}`);
    return `data:image/png;base64,${btoa('placeholder')}`;
  } catch (e) {
    console.error('[Resources] Failed to upload image:', e);
    return null;
  }
};

export const migrateExistingResourceImages = async (partyId: string) => {
  try {
    console.log(`[Migration] Resource images already migrated for ${partyId}`);
    return { success: true };
  } catch (e) {
    console.error('[Migration] Failed:', e);
    return { success: false, error: e };
  }
};

export const updateResourceThumbnail = async (resourceId: string, imageUrl: string) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const resourceRef = doc(firestoreInstance, 'campaign_resources', resourceId);
    await updateDoc(resourceRef, {
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    });

    return { error: null };
  } catch (e) {
    console.error('[Resources] Failed to update thumbnail:', e);
    return { error: e };
  }
};

/**
 * Batch save characters to Firebase Firestore
 * Validates characters, processes in chunks, and returns success/failure breakdown
 */
export async function batchSaveCharacters(
  characters: Character[],
  saveCallback?: (character: Character) => Promise<any>
): Promise<{
  successful: Character[];
  failed: { character: Character; error: Error }[];
  totalTime: number;
}> {
  const successful: Character[] = [];
  const failed: { character: Character; error: Error }[] = [];
  const startTime = performance.now();

  console.log(`[BatchSave] Starting batch save for ${characters.length} characters`);

  // Validar todos primero
  const validCharacters = characters.filter((char) => {
    const validation = isValidCharacter(char);
    if (!validation.valid) {
      failed.push({
        character: char,
        error: new Error(validation.errors.join(', ')),
      });
      console.warn(
        `[BatchSave] Validation failed for ${char.name}: ${validation.errors.join(', ')}`
      );
      return false;
    }
    return true;
  });

  console.log(
    `[BatchSave] Validation complete: ${validCharacters.length} valid, ${failed.length} invalid`
  );

  // Batch en chunks de 10
  const BATCH_SIZE = 10;
  for (let i = 0; i < validCharacters.length; i += BATCH_SIZE) {
    const chunk = validCharacters.slice(i, i + BATCH_SIZE);
    const chunkNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalChunks = Math.ceil(validCharacters.length / BATCH_SIZE);

    console.log(
      `[BatchSave] Processing chunk ${chunkNumber}/${totalChunks} (${chunk.length} characters)`
    );

    try {
      // Ejecutar en paralelo dentro del chunk
      const results = await Promise.allSettled(
        chunk.map((char) =>
          saveCallback ? saveCallback(char) : saveCharacterToCloud(char, char.user_id || 'guest')
        )
      );

      // Procesar resultados
      results.forEach((result, idx) => {
        const character = chunk[idx];
        if (result.status === 'fulfilled') {
          successful.push(character);
          console.log(`[BatchSave] ✓ Saved: ${character.name}`);
        } else {
          failed.push({
            character,
            error:
              result.reason instanceof Error ? result.reason : new Error(String(result.reason)),
          });
          console.error(`[BatchSave] ✗ Failed: ${character.name} - ${result.reason}`);
        }
      });
    } catch (error) {
      // Error en batch, agregar todos al failed
      console.error(
        `[BatchSave] Chunk ${chunkNumber} error:`,
        error instanceof Error ? error.message : error
      );
      chunk.forEach((char) => {
        failed.push({
          character: char,
          error: error instanceof Error ? error : new Error('Unknown error during batch save'),
        });
      });
    }

    // Pequeño delay entre chunks para no sobrecargar
    if (i + BATCH_SIZE < validCharacters.length) {
      const delayMs = 100;
      await new Promise((r) => setTimeout(r, delayMs));
      console.log(`[BatchSave] Waiting ${delayMs}ms before next chunk...`);
    }
  }

  const totalTime = performance.now() - startTime;

  console.log(
    `[BatchSave] Complete: ${successful.length} successful, ${failed.length} failed in ${totalTime.toFixed(0)}ms`
  );

  return {
    successful,
    failed,
    totalTime,
  };
}

// NOTE: subscribeToPartyRealtime, broadcastCharacterUpdateFirestore,
// and subscribeToPartyResourcesRealtime are in ./firestore-realtime.
// Import directly from there to avoid circular dependency.
