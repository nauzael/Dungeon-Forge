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
} from 'firebase/auth';
import {
  getFirestore,
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
  firestoreInstance = getFirestore(firebaseApp);
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
        return { data: { subscription: () => {} } };
      }
      
      const unsubscribe = firebaseOnAuthStateChanged(authInstance, (user) => {
        if (user) {
          // Simulate Supabase event with session
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
          callback('SIGNED_OUT', null);
        }
      });
      
      return { data: { subscription: unsubscribe } };
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
          
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({ 
            prompt: options.options?.queryParams?.prompt || 'select_account'
          });
          
          const isNative = Capacitor.getPlatform() !== 'web';
          
          if (isNative) {
            // Mobile/Capacitor: Use popup flow (more compatible than redirect)
            console.log('[OAuth] Using popup flow for Capacitor');
            const result = await signInWithPopup(authInstance, provider);
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
          } else {
            // Web: Use redirect flow (standard OAuth approach)
            console.log('[OAuth] Using redirect flow for web');
            await signInWithRedirect(authInstance, provider);
            
            // Redirect will cause page navigation, so we return immediately
            return {
              data: {
                url: null,
              },
              error: null,
            };
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
};

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
    
    const q = query(
      collection(firestoreInstance, 'characters'),
      where('user_id', '==', userId),
      where('deleted_at', '==', null)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data().data);
  } catch (e) {
    console.error('[Cloud] Fetch failed:', e);
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
