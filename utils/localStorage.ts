import { generateUUID } from './uuid';

interface PartyLocal {
  id: string;
  creator_id: string;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

const PARTIES_STORAGE_KEY = 'dnd-parties-local';

/**
 * Obtiene todas las parties del localStorage
 */
const getPartiesFromStorage = (): PartyLocal[] => {
  try {
    const data = localStorage.getItem(PARTIES_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('[LocalStorage] Error reading parties:', e);
    return [];
  }
};

/**
 * Guarda parties en localStorage
 */
const savePartiesToStorage = (parties: PartyLocal[]): void => {
  try {
    localStorage.setItem(PARTIES_STORAGE_KEY, JSON.stringify(parties));
  } catch (e) {
    console.error('[LocalStorage] Error saving parties:', e);
  }
};

/**
 * Crea una party en localStorage cuando RLS falla en Supabase
 */
export const createPartyLocal = async (userId: string, name: string) => {
  try {
    const parties = getPartiesFromStorage();
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const now = new Date().toISOString();

    const newParty: PartyLocal = {
      id: generateUUID(),
      creator_id: userId,
      name,
      code,
      created_at: now,
      updated_at: now,
    };

    parties.push(newParty);
    savePartiesToStorage(parties);

    console.log(`[LocalStorage] Party created locally: ${newParty.id} (${name})`);
    return newParty;
  } catch (e) {
    console.error('[LocalStorage] Failed to create party locally:', e);
    return null;
  }
};

/**
 * Actualiza una party en localStorage cuando RLS falla en Supabase
 */
export const updatePartyLocal = async (partyId: string, updates: Partial<PartyLocal>) => {
  try {
    const parties = getPartiesFromStorage();
    const index = parties.findIndex((p) => p.id === partyId);

    if (index === -1) {
      console.error('[LocalStorage] Party not found:', partyId);
      return null;
    }

    const updatedParty: PartyLocal = {
      ...parties[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    parties[index] = updatedParty;
    savePartiesToStorage(parties);

    console.log(`[LocalStorage] Party updated locally: ${partyId}`);
    return updatedParty;
  } catch (e) {
    console.error('[LocalStorage] Failed to update party locally:', e);
    return null;
  }
};

/**
 * Elimina un personaje de una party en localStorage cuando RLS falla
 * Nota: En esta implementación, solo registramos el kick en logs
 * ya que los personajes se manejan en la tabla 'characters', no en 'parties'
 */
export const kickLocal = async (partyId: string, characterId: string) => {
  try {
    console.log(`[LocalStorage] Kick recorded locally: character ${characterId} removed from party ${partyId}`);
    // No modificamos parties aquí porque el personaje se maneja en la tabla 'characters'
    // que tiene su propio localStorage fallback
    return true;
  } catch (e) {
    console.error('[LocalStorage] Failed to kick character locally:', e);
    return false;
  }
};

const CHARACTERS_STORAGE_KEY = 'dnd-characters';

/**
 * Remueve un personaje de su party en localStorage (sin Firestore).
 * Busca el character por ID en el array de dnd-characters y limpia
 * party_id/party_name tanto a nivel raíz como dentro de `data`.
 */
export const removeFromPartyLocal = async (characterId: string): Promise<{ error: Error | null }> => {
  try {
    const raw = localStorage.getItem(CHARACTERS_STORAGE_KEY);
    if (!raw) {
      console.warn(`[LocalStorage] No characters found in storage for leave-party`);
      return { error: null };
    }
    const characters: Record<string, unknown>[] = JSON.parse(raw);
    const idx = characters.findIndex((c: Record<string, unknown>) => c.id === characterId);
    if (idx === -1) {
      console.warn(`[LocalStorage] Character ${characterId} not found for leave-party`);
      return { error: null };
    }

    const char = characters[idx];
    delete char.party_id;
    delete char.party_name;
    if (char.data && typeof char.data === 'object') {
      const data = char.data as Record<string, unknown>;
      delete data.party_id;
      delete data.party_name;
    }

    characters[idx] = char;
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify(characters));
    console.log(`[LocalStorage] Character ${characterId} removed from party (local mode)`);
    return { error: null };
  } catch (e) {
    console.error('[LocalStorage] Failed to remove character from party:', e);
    return { error: e instanceof Error ? e : new Error(String(e)) };
  }
};

/**
 * Obtiene una party del localStorage por ID
 */
export const getPartyLocal = (partyId: string): PartyLocal | null => {
  try {
    const parties = getPartiesFromStorage();
    return parties.find((p) => p.id === partyId) || null;
  } catch (e) {
    console.error('[LocalStorage] Error fetching party:', e);
    return null;
  }
};

/**
 * Obtiene todas las parties del localStorage del usuario
 */
export const getPartiesLocal = (userId: string): PartyLocal[] => {
  try {
    const parties = getPartiesFromStorage();
    return parties.filter((p) => p.creator_id === userId);
  } catch (e) {
    console.error('[LocalStorage] Error fetching user parties:', e);
    return [];
  }
};

/**
 * Elimina una party del localStorage
 */
export const deletePartyLocal = (partyId: string): boolean => {
  try {
    const parties = getPartiesFromStorage();
    const filtered = parties.filter((p) => p.id !== partyId);
    savePartiesToStorage(filtered);
    console.log(`[LocalStorage] Party deleted locally: ${partyId}`);
    return true;
  } catch (e) {
    console.error('[LocalStorage] Failed to delete party locally:', e);
    return false;
  }
};
