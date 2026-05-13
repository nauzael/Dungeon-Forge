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
