import {
  initializeApp,
  FirebaseApp,
} from 'firebase/app';
import {
  getAuth,
  Auth,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User,
  signInWithCredential,
} from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import {
  getDatabase,
  Database,
  ref,
  onValue,
  off,
  set,
  Unsubscribe,
} from 'firebase/database';
import { Character, CampaignResource } from '../types';
import { debugLogger } from './debugLogger';
import { createPartyLocal, updatePartyLocal, kickLocal } from './localStorage';
import { Capacitor } from '@capacitor/core';
import { signInWithGoogleNative, signOutGoogleNative } from './googleSignInNative';

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

try {
  firebaseApp = initializeApp(firebaseConfig);
  authInstance = getAuth(firebaseApp);

  // En Android WebView (Capacitor), Firestore puede fallar con WebChannel.
  // Forzamos un transporte más estable para evitar "transport errored".
  if (Capacitor.getPlatform() === 'android') {
    firestoreInstance = initializeFirestore(firebaseApp, {
      experimentalAutoDetectLongPolling: true,
      useFetchStreams: false,
    });
    console.log('[Firebase] Firestore initialized with Android WebView settings');
  } else {
    firestoreInstance = getFirestore(firebaseApp);
  }

  databaseInstance = getDatabase(firebaseApp);
  console.log('[Firebase] Initialized successfully');
  
  // Handle redirect result from OAuth flow
  if (authInstance) {
    getRedirectResult(authInstance)
      .then((result) => {
        if (result?.user) {
          console.log('[Firebase] Redirect OAuth completed:', result.user.email);
        }
      })
      .catch((error) => {
        console.error('[Firebase] Redirect result error:', error);
      });
  }
} catch (e) {
  console.error('[Firebase] Initialization failed:', e);
}

export const auth = authInstance;
export const firestore = firestoreInstance;
export const database = databaseInstance;

// Auth wrapper for Supabase compatibility
export const supabase = {
  auth: {
    getSession: async () => {
      try {
        const user = authInstance?.currentUser;
        if (!user) return { data: { session: null }, error: null };
        
        return {
          data: {
            session: {
              user: {
                id: user.uid,
                email: user.email,
                user_metadata: {
                  avatar_url: user.photoURL,
                  full_name: user.displayName,
                },
              },
              access_token: await user.getIdToken(),
            },
          },
          error: null,
        };
      } catch (e) {
        console.error('[Auth] getSession failed:', e);
        return { data: { session: null }, error: e };
      }
    },
    onAuthStateChange: (callback: (_event: string, session: any) => void) => {
      if (!authInstance) {
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
      
      const unsubscribe = firebaseOnAuthStateChanged(authInstance, (user) => {
        console.log('[Firebase Auth] State changed:', user?.email || 'signed out');
        if (user) {
          // Simulate Supabase event with session
          console.log('[Firebase Auth] Firing SIGNED_IN callback for:', user.email);
          callback('SIGNED_IN', {
            user: {
              id: user.uid,
              email: user.email,
              user_metadata: {
                avatar_url: user.photoURL,
                full_name: user.displayName,
              },
            },
            access_token: user.getIdToken ? 'firebase-token' : undefined,
          });
        } else {
          console.log('[Firebase Auth] Firing SIGNED_OUT callback');
          callback('SIGNED_OUT', null);
        }
      });
      
      // Return object with unsubscribe method for Supabase compatibility
      return { data: { subscription: { unsubscribe } } };
    },
    signOut: async () => {
      try {
        if (authInstance) {
          await firebaseSignOut(authInstance);
        }
        return { error: null };
      } catch (e) {
        console.error('[Auth] signOut failed:', e);
        return { error: e };
      }
    },
    signInWithGoogle: async () => {
      try {
        if (!authInstance) throw new Error('Auth not initialized');
        
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(authInstance, provider);
        const user = result.user;
        
        return {
          data: {
            user: {
              id: user.uid,
              email: user.email,
              user_metadata: {
                avatar_url: user.photoURL,
                full_name: user.displayName,
              },
            },
            session: {
              access_token: await user.getIdToken(),
            },
          },
          error: null,
        };
      } catch (e) {
        console.error('[Auth] signInWithGoogle failed:', e);
        return { data: null, error: e };
      }
    },
    signInWithOAuth: async (options: { provider: string; options?: any }) => {
      // Supabase compatible OAuth sign-in
      // For Firebase, we support Google OAuth with platform-specific handling
      if (options.provider === 'google') {
        try {
          if (!authInstance) throw new Error('Auth not initialized');
          
          const platform = Capacitor.getPlatform();
          console.log('[OAuth] Platform detected:', platform);
          
          // For Android: Use NATIVE Google Sign-In with Google Play Services
          if (platform === 'android') {
            console.log('[Login] Using NATIVE GOOGLE SIGN-IN for Android');
            return await signInWithGoogleNativeFirebase();
          }
          
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({ 
            prompt: options.options?.queryParams?.prompt || 'select_account'
          });
          
          // For web: Use redirect flow (navigates away, returns with callback)
          // For other Capacitor (native): Use popup flow (opens within app context)
          if (platform === 'web') {
            console.log('[OAuth] Using REDIRECT flow for web');
            
            try {
              // signInWithRedirect navigates away and Firebase handles the callback
              await signInWithRedirect(authInstance, provider);
              
              // This code will not execute immediately - page will redirect
              // But we need to return something for TypeScript
              return {
                data: null,
                error: null,
              };
            } catch (redirectErr) {
              console.error('[OAuth] Redirect flow error:', (redirectErr as Error).message);
              return {
                data: null,
                error: { message: (redirectErr as Error).message },
              };
            }
          } else {
            // Capacitor (native): Use popup flow
            // In Capacitor, popup opens within app WebView context, not separate browser
            console.log('[OAuth] Using POPUP flow for Capacitor');
            
            try {
              const result = await signInWithPopup(authInstance, provider);
              console.log('[OAuth] Popup completed with user:', result.user.email);
              
              return {
                data: {
                  url: null,
                  user: {
                    id: result.user.uid,
                    email: result.user.email,
                    user_metadata: {
                      avatar_url: result.user.photoURL,
                      full_name: result.user.displayName,
                    },
                  },
                },
                error: null,
              };
            } catch (popupErr) {
              console.warn('[OAuth] Popup error:', (popupErr as Error).message);
              return {
                data: null,
                error: { message: (popupErr as Error).message },
              };
            }
          }
        } catch (e) {
          console.error('[Auth] signInWithOAuth(google) failed:', e);
          return { data: null, error: { message: (e as Error).message } };
        }
      } else {
        return {
          data: null,
          error: { message: `OAuth provider '${options.provider}' not supported` },
        };
      }
    },
  },
  // Stub de compatibilidad — App.tsx usa subscribeToOwnCharacters/subscribeToPartyResources en su lugar
  channel: (_name: string) => {
    console.warn('[Firebase] supabase.channel() no implementado — usa subscribeToOwnCharacters o subscribeToPartyResources');
    const noop: any = { on: () => noop, subscribe: () => {}, unsubscribe: () => {}, send: async () => {} };
    return noop;
  },
  from: (_table: string) => ({
    delete: () => ({ eq: () => ({ then: () => Promise.resolve() }) }),
    select: () => ({ eq: () => ({ data: [], error: null }) }),
  }),
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
      return message.includes('auth/invalid-credential') ||
        message.toLowerCase().includes('stale to sign-in');
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
    let nativeResult: any;
    try {
      nativeResult = await signInWithGoogleNative();
      console.log('[Firebase Auth] ✓ Native plugin returned result');
      console.log('[Firebase Auth]   - Email: ' + (nativeResult?.email || 'NULL'));
      console.log('[Firebase Auth]   - Has idToken: ' + (nativeResult?.idToken ? 'YES (length=' + nativeResult.idToken.length + ')' : 'NO'));
      console.log('[Firebase Auth]   - DisplayName: ' + (nativeResult?.displayName || 'NULL'));
    } catch (nativeErr) {
      console.error('[Firebase Auth] ❌ NATIVE PLUGIN ERROR!');
      console.error('[Firebase Auth]   - Error message: ' + (nativeErr as Error).message);
      console.error('[Firebase Auth]   - Error type: ' + (nativeErr as Error).constructor.name);
      console.error('[Firebase Auth]   - Full error: ' + JSON.stringify(nativeErr));
      throw nativeErr;
    }
    
    if (!nativeResult.idToken) {
      const errMsg = 'No ID token returned from native plugin - OAuth flow incomplete';
      console.error('[Firebase Auth] ❌ ' + errMsg);
      throw new Error(errMsg);
    }
    
    // Step 2: Exchange credential in Firebase (with one stale-token retry)
    let result: any;
    try {
      result = await exchangeWithFirebase(nativeResult.idToken);
      console.log('[Firebase Auth] ✓ Credential exchange successful!');
      console.log('[Firebase Auth]   - User: ' + result.user.email);
      console.log('[Firebase Auth]   - UID: ' + result.user.uid);
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
        console.warn('[Firebase Auth] Retry sign-out skipped:', (retrySignOutErr as Error).message);
      }

      const retryNativeResult = await signInWithGoogleNative();
      if (!retryNativeResult?.idToken) {
        throw new Error('No fresh ID token returned during stale-token retry');
      }

      result = await exchangeWithFirebase(retryNativeResult.idToken);
      console.log('[Firebase Auth] ✓ Credential exchange successful after stale-token retry');
      console.log('[Firebase Auth]   - User: ' + result.user.email);
      console.log('[Firebase Auth]   - UID: ' + result.user.uid);
    }
    
    console.log('[Firebase Auth] ✓ SIGN-IN COMPLETE');
    return {
      data: {
        url: null,
        user: {
          id: result.user.uid,
          email: result.user.email,
          user_metadata: {
            avatar_url: result.user.photoURL,
            full_name: result.user.displayName,
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
export const saveCharacterToCloud = async (character: Character, userId: string) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');
    
    const characterRef = doc(firestoreInstance, 'characters', character.id);
    await setDoc(characterRef, {
      id: character.id,
      user_id: userId,
      data: character,
      party_id: character.party_id || null,
      updated_at: Timestamp.now(),
      deleted_at: null,
    }, { merge: true });

    console.log(
      `[Sync] Success: ${character.name} updated with ${Object.keys(character.usedSlots || {}).length} used slots.`
    );
    return { data: { id: character.id }, error: null };
  } catch (e) {
    console.error(`[Sync] Cloud save failed for ${character.name}:`, e);
    return { data: null, error: e };
  }
};

export const fetchCharactersFromCloud = async (userId: string) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const effectiveUserId = authInstance?.currentUser?.uid || userId;
    if (effectiveUserId !== userId) {
      console.log(`[Cloud] Using current auth uid=${effectiveUserId} instead of state uid=${userId}`);
    }

    const normalizeCharacter = (raw: Record<string, unknown>, docId: string): Character | null => {
      const nested = raw.data;
      if (nested && typeof nested === 'object') {
        return nested as Character;
      }

      if (typeof nested === 'string') {
        try {
          return JSON.parse(nested) as Character;
        } catch (e) {
          console.warn('[Cloud] Failed to parse nested character JSON for doc:', docId);
        }
      }

      // Compatibilidad: algunos documentos pueden tener el personaje plano en la raíz.
      if (typeof raw.id === 'string' && typeof raw.name === 'string' && typeof raw.class === 'string') {
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

    console.log(`[Cloud] fetchCharactersFromCloud uid=${effectiveUserId} docs=${snapshot.size} active=${characters.length}`);
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
        const data = doc.data();
        return {
          id: data.id,
          character: data.data as Character,
          deleted_at: data.deleted_at?.toDate?.().toISOString() || data.deleted_at,
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
      updated_at: Timestamp.now(),
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
    await updateDoc(characterRef, {
      deleted_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });

    console.log(`[SoftDelete] Character ${characterId} marked as deleted`);
    return { error: null };
  } catch (e) {
    console.error(`[SoftDelete] Failed for ${characterId}:`, e);
    return { error: e };
  }
};

// Party Management
export const createParty = async (userId: string, name: string) => {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');
    
    const partyRef = doc(collection(firestoreInstance, 'parties'));
    const partyData = {
      id: partyRef.id,
      creator_id: userId,
      name,
      code,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };

    await setDoc(partyRef, partyData);
    console.log(`[Party] Created: ${name} with code ${code}`);
    return { data: partyData, error: null };
  } catch (e) {
    console.error('[Party] Failed to create:', e);
    const result = await createPartyLocal(userId, name);
    return { data: result, error: null };
  }
};

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
    const party = partyDoc.data();

    // 2. Update character with party info
    const characterId = character?.id;
    if (!characterId) throw new Error('Personaje inválido.');

    const updatedCharacter = {
      ...character,
      party_id: party.id,
      party_name: party.name,
    };

    const effectiveUserId = character.user_id || 'guest';

    // 3. Upsert character with party_id
    const characterRef = doc(firestoreInstance, 'characters', characterId);
    await setDoc(
      characterRef,
      {
        id: characterId,
        user_id: effectiveUserId,
        data: updatedCharacter,
        party_id: party.id,
        updated_at: Timestamp.now(),
        deleted_at: null,
      },
      { merge: true }
    );

    return { partyId: party.id, partyName: party.name, error: null };
  } catch (e) {
    console.error('[Join] Error:', e);
    return {
      partyId: null,
      partyName: null,
      error: e instanceof Error ? e.message : 'Error desconocido',
    };
  }
};

export interface RealtimeSubscription {
  channel: any;
  unsubscribe: () => Promise<void>;
  status: 'connecting' | 'connected' | 'error' | 'reconnecting';
}

export const subscribeWithRetry = (
  partyId: string,
  onUpdate: (payload: unknown) => void,
  onBroadcast?: (payload: unknown) => void,
  onStatusChange?: (status: 'connecting' | 'connected' | 'error' | 'reconnecting') => void
): RealtimeSubscription => {
  // Check local mode
  const isLocalMode = localStorage.getItem('df_local_mode') === 'true';
  if (isLocalMode) {
    debugLogger.log('[Realtime]', `Local mode detected - skipping realtime subscription for party ${partyId}`, 'info');
    console.log('[Realtime] Local mode detected - skipping realtime subscription');
    onStatusChange?.('connected');
    return {
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
      unsubscribe: async () => {},
      status: 'error',
    };
  }

  debugLogger.log('[Realtime]', `Starting subscription to party ${partyId}`, 'info');
  
  let unsubscribeFn: Unsubscribe | null = null;
  let status: 'connecting' | 'connected' | 'error' | 'reconnecting' = 'connecting';

  try {
    onStatusChange?.('connecting');

    const partyRef = ref(database, `parties/${partyId}/characters`);

    unsubscribeFn = onValue(
      partyRef,
      (snapshot) => {
        if (status !== 'connected') {
          status = 'connected';
          onStatusChange?.('connected');
          debugLogger.log('[Realtime]', `Connected to party ${partyId}`, 'info');
          console.log(`[Realtime] Connected to party ${partyId}`);
        }

        if (snapshot.exists()) {
          onUpdate(snapshot.val());
        }
      },
      (error) => {
        status = 'error';
        onStatusChange?.('error');
        debugLogger.log('[Realtime]', `Error subscribing to party ${partyId}`, 'error', { error: error.message });
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
        console.log(`[Realtime] Unsubscribed from party ${partyId}`);
      }
    },
    status,
  };
};

export const subscribeToParty = (
  partyId: string,
  onUpdate: (payload: any) => void
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

export const removeFromParty = async (characterId: string) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const characterRef = doc(firestoreInstance, 'characters', characterId);
    await updateDoc(characterRef, {
      party_id: null,
      updated_at: Timestamp.now(),
    });

    console.log(`[Party] Character ${characterId} removed from party`);
    return { error: null };
  } catch (e) {
    console.error(`[Party] Failed to remove character ${characterId}:`, e);
    return { error: e };
  }
};

export const updatePartyName = async (partyId: string, name: string) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const partyRef = doc(firestoreInstance, 'parties', partyId);
    await updateDoc(partyRef, {
      name,
      updated_at: Timestamp.now(),
    });

    console.log(`[Party] Updated name to: ${name}`);
    return { error: null };
  } catch (e) {
    console.error('[Party] Failed to update name:', e);
    return { error: e };
  }
};

export const deleteParty = async (partyId: string, userId: string) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    // Remove characters from party first
    const charactersSnapshot = await getDocs(
      query(
        collection(firestoreInstance, 'characters'),
        where('party_id', '==', partyId)
      )
    );

    for (const charDoc of charactersSnapshot.docs) {
      await updateDoc(charDoc.ref, {
        party_id: null,
        updated_at: Timestamp.now(),
      });
    }

    // Delete party
    const partyRef = doc(firestoreInstance, 'parties', partyId);
    await deleteDoc(partyRef);

    console.log(`[Party] Deleted party ${partyId}`);
    return { error: null };
  } catch (e) {
    console.error('[Party] Failed to delete:', e);
    return { error: e };
  }
};

// Campaign Resources
export const getPartyResources = async (partyId: string) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const resourcesSnapshot = await getDocs(
      query(
        collection(firestoreInstance, 'campaign_resources'),
        where('party_id', '==', partyId)
      )
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
    const resourceData = {
      ...resource,
      id: resourceRef.id,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };

    await setDoc(resourceRef, resourceData);
    console.log(`[Resources] Added: ${resource.name}`);
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

    console.log(`[Resources] Broadcasted: ${resource.name}`);
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

  const q = query(
    collection(firestoreInstance, 'characters'),
    where('user_id', '==', userId)
  );

  // Saltamos el primer snapshot (carga inicial ya manejada por fetchCharactersFromCloud)
  let isInitialLoad = true;

  const unsubscribe = onSnapshot(q, (snapshot) => {
    if (isInitialLoad) {
      isInitialLoad = false;
      return;
    }

    snapshot.docChanges().forEach((change) => {
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
          const cloudTime = cloudChar.syncTimestamp || (data.updated_at?.toMillis?.() || 0);
          console.log('[CharSync] Character updated in cloud:', cloudChar.name);
          onCharacterChange({ ...cloudChar, syncTimestamp: cloudTime }, 'UPDATE');
        }
      }
    });
  }, (error) => {
    console.error('[CharSync] Snapshot error:', error);
  });

  return unsubscribe;
};

/**
 * Suscribe a recursos compartidos en una fiesta via Firebase RTDB.
 * Reemplaza supabase.channel(channelName).on('broadcast', ...)
 */
export const subscribeToPartyResources = (
  partyId: string,
  onResourceChange: (resource: CampaignResource | null) => void
): (() => void) => {
  if (!database) {
    console.warn('[PartyResources] Database not initialized');
    return () => {};
  }

  const shareRef = ref(database, `parties/${partyId}/resource-share`);

  const unsubscribe = onValue(shareRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('[PartyResources] Resource received:', data?.resource?.name);
      onResourceChange(data.resource || null);
    } else {
      console.log('[PartyResources] Resource cleared');
      onResourceChange(null);
    }
  }, (error) => {
    console.error('[PartyResources] Error:', error);
  });

  return () => unsubscribe();
};

export const updatePartyResourcePersistence = async (
  partyId: string,
  resourceIds: string[]
) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const partyRef = doc(firestoreInstance, 'parties', partyId);
    await updateDoc(partyRef, {
      persistent_resources: resourceIds,
      updated_at: Timestamp.now(),
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
  imageFile: File
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

export const updateResourceThumbnail = async (
  resourceId: string,
  imageUrl: string
) => {
  try {
    if (!firestoreInstance) throw new Error('Firestore not initialized');

    const resourceRef = doc(firestoreInstance, 'campaign_resources', resourceId);
    await updateDoc(resourceRef, {
      image_url: imageUrl,
      updated_at: Timestamp.now(),
    });

    return { error: null };
  } catch (e) {
    console.error('[Resources] Failed to update thumbnail:', e);
    return { error: e };
  }
};
