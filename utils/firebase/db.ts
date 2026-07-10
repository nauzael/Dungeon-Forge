import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { ref, set, remove as rtdbRemove, update as rtdbUpdate } from 'firebase/database';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { auth, firestore, database, storage, firestoreTimeout } from './init';
import { Character, CampaignResource } from '../../types';
import { createPartyLocal, removeFromPartyLocal } from '../localStorage';
import { isValidCharacter } from '../../src/utils/validators';

// Character Management
export const saveCharacterToCloud = async (
  character: Character,
  userId: string,
  retries = 2
) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (!firestore) throw new Error('Firestore not initialized');

      // CRITICAL: Strip party_id and party_name from the character before saving.
      // party_id is managed EXCLUSIVELY by joinParty() and removeFromParty().
      // If we include it here, a player who was kicked while offline would write
      // the stale party_id back to Firestore on their next save, undoing the kick.
      // Using merge: true preserves the top-level party_id already set by join/kick.
      const { party_id, party_name, ...charFields } = character as Character & {
        party_id?: string | null;
        party_name?: string | null;
      };

      const characterRef = doc(firestore, 'characters', character.id);
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

      return { data: { id: character.id }, error: null };
    } catch (e) {
      const isLastAttempt = attempt === retries;
      const isResourceExhausted = (e as Error)?.message?.includes('resource-exhausted');

      if (isLastAttempt || !isResourceExhausted) {
        return { data: null, error: e };
      }

      // Exponential backoff: 500ms, 1000ms, 2000ms...
      const backoffMs = Math.pow(2, attempt) * 500;
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
    if (!firestore) throw new Error('Firestore not initialized');

    // CRITICAL: Strip party_id/party_name — managed exclusively by joinParty/removeFromParty
    const { party_id, party_name, ...charFields } = character as Character & {
      party_id?: string | null;
      party_name?: string | null;
    };

    const characterRef = doc(firestore, 'characters', character.id);
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

    return { data: { id: character.id }, error: null };
  } catch (e) {
    // Save failed - trigger rollback
    onRollback(snapshot);
    throw e;
  }
};

export const fetchCharactersFromCloud = async (userId: string) => {
  try {
    if (!firestore) throw new Error('Firestore not initialized');

    const effectiveUserId = auth?.currentUser?.uid || userId;

    const normalizeCharacter = (raw: Record<string, unknown>, docId: string): Character | null => {
      const nested = raw.data;
      if (nested && typeof nested === 'object') {
        return nested as Character;
      }

      if (typeof nested === 'string') {
        try {
          return JSON.parse(nested) as Character;
        } catch {
        }
      }

      // Compatibility: some documents may have the character flat at the root.
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
      collection(firestore, 'characters'),
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
          return null;
        }

        return {
          ...character,
          id: character.id || doc.id,
          user_id: (character.user_id || raw.user_id || effectiveUserId) as string,
        } as Character;
      })
      .filter((c): c is Character => c !== null);

    return characters;
  } catch (e) {
    return [];
  }
};

export const fetchDeletedCharacterIds = async (userId: string) => {
  try {
    if (!firestore) throw new Error('Firestore not initialized');

    const snapshot = await getDocs(
      query(
        collection(firestore, 'characters'),
        where('user_id', '==', userId),
        where('deleted_at', '!=', null)
      )
    );

    return snapshot.docs.map((doc) => doc.id);
  } catch (e) {
    return [];
  }
};

export const fetchDeletedCharacters = async (userId: string) => {
  try {
    if (!firestore) throw new Error('Firestore not initialized');

    const snapshot = await getDocs(
      query(
        collection(firestore, 'characters'),
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
    return [];
  }
};

export const restoreCharacter = async (characterId: string) => {
  try {
    if (!firestore) throw new Error('Firestore not initialized');

    const characterRef = doc(firestore, 'characters', characterId);
    await updateDoc(characterRef, {
      deleted_at: null,
      updated_at: new Date().toISOString(),
    });

    return { error: null };
  } catch (e) {
    return { error: e };
  }
};

export const softDeleteCharacter = async (characterId: string) => {
  try {
    if (!firestore) throw new Error('Firestore not initialized');

    const characterRef = doc(firestore, 'characters', characterId);
    const now = new Date().toISOString();
    await updateDoc(characterRef, {
      deleted_at: now,
      updated_at: now,
    });

    return { error: null };
  } catch (e) {
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
  const code = crypto.randomUUID().substring(0, 6).toUpperCase();

  // Wave 10: Force local mode if no Firestore credentials
  const isLocalMode = localStorage.getItem('df_local_mode') === 'true' || !firestore;
  if (isLocalMode) {
    const result = await createPartyLocal(userId, name);
    return { data: result, error: null };
  }

  try {
    if (!firestore) throw new Error('Firestore not initialized');

    const partyRef = doc(collection(firestore, 'parties'));
    const now = new Date().toISOString();
    const partyData = {
      id: partyRef.id,
      creator_id: userId,
      dm_uid: userId, // BUG FIX #1: Add dm_uid for Firestore rules
      name,
      code,
      settings: {},
      // NOTE: members map removed — membership tracked via members/{uid} subcollection
      created_at: now, // BUG FIX #3: ISO 8601 string (not Timestamp)
      updated_at: now, // BUG FIX #3: ISO 8601 string (not Timestamp)
    };

    await setDoc(partyRef, partyData);

    // BUG FIX #4: Create party_codes/{code} document
    await createPartyCode(code, partyRef.id);

    return { data: partyData, error: null };
  } catch (e) {
    const result = await createPartyLocal(userId, name);
    return { data: result, error: null };
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
    if (!firestore) throw new Error('Firestore not initialized');

    const codeRef = doc(firestore, 'party_codes', code);
    const now = new Date().toISOString();
    await setDoc(codeRef, {
      code,
      party_id: partyId,
      created_at: now,
    });

  } catch (e) {
    throw e;
  }
};

/**
 * BUG FIX #2: joinParty must write to /parties/{partyId}/members/{userId}
 * This is required for Firestore Security Rules to verify party membership via isPartyMember() check
 */
export const joinParty = async (character: Character, code: string) => {
  try {
    const codeStr = code.trim().toUpperCase();
    if (!codeStr) throw new Error('Invalid code.');

    // Check for local mode FIRST — Firestore won't work without auth
    const isLocalMode = localStorage.getItem('df_local_mode') === 'true';
    if (isLocalMode || !firestore) {
      // Local mode: find party code in localStorage
      const localCharStr = localStorage.getItem(`df_character_${character.id}`);
      if (!localCharStr && character.id) {
        // Fallback: save to localStorage directly
        const updatedChar = {
          ...character,
          party_id: 'local-party',
          party_name: 'Local Party',
        };
        localStorage.setItem(`df_character_${character.id}`, JSON.stringify(updatedChar));
        return { partyId: 'local-party', partyName: 'Local Party', error: null };
      }
      throw new Error(isLocalMode
        ? 'Cloud parties are not available in local mode. Use the DM Dashboard to create local parties.'
        : 'Firestore not initialized.');
    }

    // Ensure Firebase Auth is resolved before making Firestore calls
    if (!auth) throw new Error('Firebase Auth no disponible.');
    await auth.authStateReady();
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      throw new Error('You must sign in with Google to join a party. Tap "Login with Google" first.');
    }

    // 1. Find party by code (10s timeout)
    const partiesSnapshot = await firestoreTimeout(
      getDocs(
        query(
          collection(firestore, 'parties'),
          where('code', '==', codeStr)
        )
      ),
      10000,
      'findPartyByCode'
    );

    if (partiesSnapshot.empty) {
      throw new Error('Party not found with this code.');
    }

    const partyDoc = partiesSnapshot.docs[0];
    const partyData = partyDoc.data() as { id: string; name: string };

    // 2. Update character with party info
    const characterId = character?.id;
    if (!characterId) throw new Error('Invalid character.');

    const updatedCharacter = {
      ...character,
      party_id: partyData.id,
      party_name: partyData.name,
    };

    // Use auth UID for Firestore operations — this is required by security rules
    const effectiveUserId = currentUid;

    // 3. Upsert character with party_id (8s timeout)
    const characterRef = doc(firestore, 'characters', characterId);
    const now = new Date().toISOString();
    await firestoreTimeout(
      setDoc(
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
      ),
      8000,
      'setDoc(character)'
    );

    // Write to /parties/{partyId}/members/{userId} subcollection (8s timeout)
    const memberRef = doc(firestore, 'parties', partyData.id, 'members', effectiveUserId);
    await firestoreTimeout(
      setDoc(
        memberRef,
        {
          user_id: effectiveUserId,
          character_id: characterId,
          joined_at: now,
        },
        { merge: true }
      ),
      8000,
      'setDoc(member)'
    );

    // NOTE: Party members map update removed.
    // Membership is tracked via the members/{uid} subcollection only.
    // Security rule isPartyMember() checks exists(subcollection) instead.

    // Broadcast to RTDB immediately so DM sees the new member in realtime
    // Full character sync is needed here (initial join — no prior RTDB state)
    try {
      await broadcastFullCharacterUpdate(partyData.id, updatedCharacter);
    } catch (e) {
      // Best-effort: RTDB broadcast failure is non-critical, the Firestore data is already saved
    }

    return { partyId: partyData.id, partyName: partyData.name, error: null };
  } catch (e) {
    return {
      partyId: null,
      partyName: null,
      error: e instanceof Error ? e.message : 'Error desconocido',
    };
  }
};

/**
 * Extract only the fields that change during gameplay (HP, resources, spell slots, toggles).
 * Excludes large static data (inventory, spells, notes, stats) to minimize RTDB bandwidth.
 * This reduces broadcast payload from ~8KB to ~300-500 bytes for common mid-game updates.
 */
export const extractVolatileFields = (character: Character): Partial<Character> => {
  const volatileKeys: (keyof Character)[] = [
    // Core combat state
    'hp', 'hitDice', 'lucky', 'inspiration', 'ac', 'init',
    // Barbarian
    'rageUses', 'rageDamage', 'isRaging', 'isRecklessAttack',
    // Bard
    'bardicInspiration', 'bardicInspirationDie', 'fontOfInspiration',
    // Cleric / Paladin
    'channelDivinity',
    // Druid
    'wildShape', 'wildShapeMax', 'activeWildShape',
    // Paladin
    'layOnHands', 'guardianBondTarget',
    // Fighter
    'actionSurge', 'secondWind', 'indomitable',
    'warMagicActive', 'eldritchStrikeActive', 'arcaneChargeActive', 'improvedWarMagicActive',
    // Monk
    'focus',
    // Ranger
    'hunterMarkUses',
    // Rogue
    'empoweredSneakAttack',
    // Sorcerer
    'sorceryPoints', 'innateSorcery',
    // Warlock
    'pactSlotLevel', 'magicalCunning', 'vestige',
    // Wizard
    'arcaneRecovery',
    // Spell tracking
    'spellSlots', 'usedSlots', 'concentrationSpell', 'activeConcentration',
    // Feature usage (generic system)
    'featureUsages',
    // Meta
    'syncTimestamp', 'lastLongRest', 'money',
  ];

  const result: Partial<Character> = {};
  for (const key of volatileKeys) {
    if (key in character) {
      (result as Record<string, unknown>)[key as string] = character[key];
    }
  }
  return result;
};

/**
 * Broadcast a partial character update to RTDB using update() (merge).
 * ~200-500 bytes vs ~8KB for full character. Use this for all mid-game updates.
 */
export const broadcastCharacterUpdate = (partyId: string, characterOrId: Partial<Character> & { id: string }, partialData?: Partial<Character>) => {
  try {
    if (!database) throw new Error('Database not initialized');

    const charId = characterOrId.id;
    const data = partialData ?? extractVolatileFields(characterOrId as Character);

    const updateRef = ref(database, `parties/${partyId}/characters/${charId}`);
    rtdbUpdate(updateRef, data as Record<string, unknown>);
  } catch (e) {
  }
};

/**
 * Full character broadcast to RTDB using set() (replace).
 * Use ONLY for initial sync after joining a party.
 * ~8KB payload — prefer broadcastCharacterUpdate for mid-game changes.
 */
export const broadcastFullCharacterUpdate = (partyId: string, character: Character) => {
  try {
    if (!database) throw new Error('Database not initialized');

    const updateRef = ref(database, `parties/${partyId}/characters/${character.id}`);
    set(updateRef, character);
  } catch (e) {
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
      return;
    }

    const nodeRef = ref(database, `parties/${partyId}/characters/${characterId}`);
    await rtdbRemove(nodeRef);
  } catch (e) {
  }
};

export const removeFromParty = async (characterId: string) => {
  const startTime = Date.now();

  // BUG FIX: Better local/offline mode detection.
  // firestoreInstance is initialized at module load and stays truthy even
  // when Firestore is unreachable, so || !firestoreInstance was useless.
  const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
  const isLocalMode = localStorage.getItem('df_local_mode') === 'true' || !firestore || isOffline;
  if (isLocalMode) {
    const result = await removeFromPartyLocal(characterId);
    if (result.error) {
      return { error: result.error };
    }
    return { error: null };
  }

  try {
    if (!firestore) {
      throw new Error('Firestore not initialized');
    }

    // CRITICAL: Get the Firebase auth UID BEFORE doing anything.
    // If user is not authenticated, abort immediately.
    if (!auth) throw new Error('Firebase Auth no disponible.');
    await auth.authStateReady();
    const authUid = auth.currentUser?.uid;
    if (!authUid) {
      throw new Error('Not authenticated — cannot leave party. Please wait for auth to load and try again.');
    }

    // 1. Read character document with 8s timeout (getDoc can hang when Firestore is unreachable)
    const characterRef = doc(firestore, 'characters', characterId);
    const charSnapshot = await firestoreTimeout(getDoc(characterRef), 8000, 'getDoc(character)');

    if (!charSnapshot.exists()) {
      throw new Error(`Character ${characterId} not found in Firestore`);
    }

    const charData = charSnapshot.data();
    const partyId = charData?.party_id;
    const userId = charData?.user_id;
    const charName = charData?.data?.name || charData?.name || 'unknown';
    const nestedData = charData?.data;

    if (!partyId) {
      // Edge case: party_id already cleared from top-level but nestedData still has it.
      // Happens if a previous Firestore write only reached nestedData but not the root field.
      const nestedPartyId = nestedData?.party_id;
      if (nestedPartyId) {
        await firestoreTimeout(updateDoc(characterRef, {
          'data.party_id': null,
          'data.party_name': null,
          updated_at: new Date().toISOString(),
          user_id: authUid,
        } as Record<string, unknown>), 8000, 'updateDoc(cleanNested)');
      }
      return { error: null };
    }

    // SAFETY CHECK: Determine if this is a player leaving or DM kicking.
    // Player: userId === authUid (character owner is the current user)
    // DM: userId !== authUid (character owner is a player, current user is the party DM)
    const isOwner = userId === authUid;
    const isDmAction = !isOwner && !!partyId;

    if (!isOwner && !isDmAction) {
      throw new Error(`This character belongs to a different account. Cannot leave party.`);
    }

    if (isDmAction) {
      // DM KICK: Verify this user is actually the party DM
      try {
        const partySnap = await getDoc(doc(firestore, 'parties', partyId));
        if (!partySnap.exists()) {
          throw new Error('Party not found');
        }
        const partyData = partySnap.data();
        if (partyData.dm_uid !== authUid) {
          throw new Error('Only the DM can kick characters from this party');
        }
      } catch (e) {
        if ((e as Error)?.message?.includes('Only the DM') || (e as Error)?.message?.includes('Party not found')) {
          throw e;
        }
        // If we can't verify, let the Firestore rule enforce it
      }
    }

    // 2. Remove RTDB entry (with 5s timeout so hang doesn't block leave)
    const rtdbStartTime = Date.now();
    if (partyId && database) {
      try {
        await firestoreTimeout(
          rtdbRemove(ref(database, `parties/${partyId}/characters/${characterId}`)),
          5000,
          'rtdbRemove'
        );
      } catch (rtdbError) {
        const elapsed = Date.now() - rtdbStartTime;
      }
    }

    // 2b. Clean up members subcollection
    // DM kicks: has write access to members subcollection
    // Player self-leave: requires allow delete rule for uid() == memberId
    if (partyId && userId) {
      try {
        const memberRef = doc(firestore, 'parties', partyId, 'members', userId);
        await deleteDoc(memberRef);
      } catch (e) {
        // Best-effort: may fail if security rules not yet deployed
      }
    }

    // 2c. [REMOVED] Party members map cleanup — field is dead.
    // Membership is tracked via subcollection only.

    // 3. Update character document to clear party_id
    const updateStartTime = Date.now();
    const now = new Date().toISOString();
    const kickTimestamp = Date.now();

    // CRITICAL: The user_id in the update payload must match the Firestore security rules.
    // - Player leaving (isOwner): use authUid → matches paths 1 and 3 (resource.data.user_id == uid())
    // - DM kick (isDmAction): use userId (player's stored user_id) → matches path 2 (resource.data.user_id == request.resource.data.user_id)
    const userIdForUpdate = isOwner ? authUid : userId;

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

    await firestoreTimeout(updateDoc(characterRef, characterUpdate), 8000, 'updateDoc(character)');

    // 4. VERIFICATION (non-fatal): Confirm the write persisted
    try {
      const verifyStart = Date.now();
      const verifySnapshot = await getDoc(characterRef);
      const verifyData = verifySnapshot.data();
      const verifyElapsed = Date.now() - verifyStart;
    } catch (verifyErr) {
    }

    const totalTime = Date.now() - startTime;

    return { error: null };
  } catch (e) {
    const totalTime = Date.now() - startTime;
    const errorCode = (e as { code?: string })?.code || 'unknown';
    const errorMsg = (e as Error)?.message || String(e);
    return { error: e };
  }
};

export const updatePartyName = async (partyId: string, name: string) => {
  try {
    if (!firestore) throw new Error('Firestore not initialized');

    const partyRef = doc(firestore, 'parties', partyId);
    const now = new Date().toISOString();
    await updateDoc(partyRef, {
      name,
      updated_at: now,
    });

    return { error: null };
  } catch (e) {
    return { error: e };
  }
};

export const deleteParty = async (partyId: string, userId: string) => {
  try {
    if (!firestore) {
      throw new Error('Firestore not initialized');
    }

    // 0. Read party doc to get the code for cleanup
    let partyCode: string | undefined;
    const partyRef = doc(firestore, 'parties', partyId);
    try {
      const partySnapshot = await getDoc(partyRef);
      partyCode = partySnapshot.data()?.code;
    } catch (readErr) {
    }

    // 1. BEST-EFFORT: Remove characters from party (may fail if rules not deployed)
    try {
      const charactersSnapshot = await getDocs(
        query(collection(firestore, 'characters'), where('party_id', '==', partyId))
      );

      const now = new Date().toISOString();
      let removedCount = 0;
      for (const charDoc of charactersSnapshot.docs) {
        try {
          await updateDoc(charDoc.ref, {
            party_id: null,
            updated_at: now,
          });
          removedCount++;
        } catch (charError) {
          // Best-effort: log but don't throw — continue with remaining characters
        }
      }
    } catch (queryErr) {
    }

    // 2. BEST-EFFORT: Delete party_codes/{code} if we have the code
    if (partyCode) {
      try {
        const codeRef = doc(firestore, 'party_codes', partyCode);
        await deleteDoc(codeRef);
      } catch (codeError) {
      }
    }

    // 3. CRITICAL: Delete the party document itself
    await deleteDoc(partyRef);

    return { error: null };
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    return { error: e };
  }
};

// Campaign Resources
export const getPartyResources = async (partyId: string) => {
  try {
    if (!firestore) throw new Error('Firestore not initialized');

    const resourcesSnapshot = await getDocs(
      query(collection(firestore, 'campaign_resources'), where('party_id', '==', partyId))
    );

    return resourcesSnapshot.docs.map((doc) => doc.data() as CampaignResource);
  } catch (e) {
    return [];
  }
};

export const addPartyResource = async (resource: CampaignResource) => {
  try {
    if (!firestore) throw new Error('Firestore not initialized');

    const resourceRef = doc(collection(firestore, 'campaign_resources'));
    const now = new Date().toISOString();
    const resourceData = {
      ...resource,
      id: resourceRef.id,
      created_at: now,
      updated_at: now,
    };

    await setDoc(resourceRef, resourceData);
    return { data: resourceData, error: null };
  } catch (e) {
    console.error('addPartyResource: Failed to save:', e instanceof Error ? e.message : String(e));
    return { data: null, error: e };
  }
};

export const deletePartyResource = async (resourceId: string) => {
  try {
    if (!firestore) throw new Error('Firestore not initialized');

    const resourceRef = doc(firestore, 'campaign_resources', resourceId);
    await deleteDoc(resourceRef);

    return { error: null };
  } catch (e) {
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

    // Omit viewingCharacterIds when:
    //   - undefined → DM revealed to ALL characters (backward compat: subscriber checks !data.viewingCharacterIds)
    //   - ['*']    → sentinel for "all" that doesn't need to be stored
    // Write normally when it's a non-empty array of specific character IDs.
    if (
      viewingCharacterIds === undefined ||
      (Array.isArray(viewingCharacterIds) && viewingCharacterIds.length === 1 && viewingCharacterIds[0] === '*')
    ) {
      set(shareRef, {
        resource,
        shared_at: new Date().toISOString(),
      });
    } else {
      set(shareRef, {
        resource,
        viewingCharacterIds,
        shared_at: new Date().toISOString(),
      });
    }

  } catch (e) {
  }
};

export const broadcastResourceHide = (partyId: string) => {
  try {
    if (!database) throw new Error('Database not initialized');

    const shareRef = ref(database, `parties/${partyId}/resource-share`);
    set(shareRef, null);

  } catch (e) {
  }
};

export const updatePartyResourcePersistence = async (partyId: string, resourceIds: string[]) => {
  try {
    if (!firestore) throw new Error('Firestore not initialized');

    const partyRef = doc(firestore, 'parties', partyId);
    await updateDoc(partyRef, {
      persistent_resources: resourceIds,
      updated_at: new Date().toISOString(),
    });

    return { error: null };
  } catch (e) {
    return { error: e };
  }
};

export const uploadResourceImage = async (
  file: File
): Promise<{ fullUrl: string; thumbnailUrl: string } | null> => {
  try {
    if (!storage) throw new Error('Firebase Storage not initialized');

    // Generate unique name to avoid collisions
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 10);
    const extension = file.name.split('.').pop() || 'png';
    const fileName = `campaign_resources/${timestamp}-${randomId}.${extension}`;

    const imageRef = storageRef(storage, fileName);
    const snapshot = await uploadBytes(imageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    // Por ahora usamos la misma URL para full y thumbnail.
    // In production, Firebase Extensions (Resize Images) can be integrated
    // to auto-generate thumbnails.
    return {
      fullUrl: downloadUrl,
      thumbnailUrl: downloadUrl,
    };
  } catch (e) {
    console.error('uploadResourceImage: Failed to upload image:', e);
    return null;
  }
};

export const migrateExistingResourceImages = async (partyId: string) => {
  try {
    return { success: true };
  } catch (e) {
    return { success: false, error: e };
  }
};

export const updateResourceThumbnail = async (resourceId: string, imageUrl: string) => {
  try {
    if (!firestore) throw new Error('Firestore not initialized');

    const resourceRef = doc(firestore, 'campaign_resources', resourceId);
    await updateDoc(resourceRef, {
      thumbnail_url: imageUrl,
      updated_at: new Date().toISOString(),
    });

    return { error: null };
  } catch (e) {
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

  // Validar todos primero
  const validCharacters = characters.filter((char) => {
    const validation = isValidCharacter(char);
    if (!validation.valid) {
      failed.push({
        character: char,
        error: new Error(validation.errors.join(', ')),
      });
      return false;
    }
    return true;
  });

  // Batch en chunks de 10
  const BATCH_SIZE = 10;
  for (let i = 0; i < validCharacters.length; i += BATCH_SIZE) {
    const chunk = validCharacters.slice(i, i + BATCH_SIZE);
    const chunkNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalChunks = Math.ceil(validCharacters.length / BATCH_SIZE);

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
        } else {
          failed.push({
            character,
            error:
              result.reason instanceof Error ? result.reason : new Error(String(result.reason)),
          });
        }
      });
    } catch (error) {
      // Error en batch, agregar todos al failed
      chunk.forEach((char) => {
        failed.push({
          character: char,
          error: error instanceof Error ? error : new Error('Unknown error during batch save'),
        });
      });
    }

    // Small delay between chunks to avoid overloading
    if (i + BATCH_SIZE < validCharacters.length) {
      const delayMs = 100;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  const totalTime = performance.now() - startTime;

  return {
    successful,
    failed,
    totalTime,
  };
}
