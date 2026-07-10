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
  }
};

/**
 * Crea una party en localStorage (fallback offline)
 */
export const createPartyLocal = async (userId: string, name: string) => {
  try {
    const parties = getPartiesFromStorage();
    const code = crypto.randomUUID().substring(0, 6).toUpperCase();
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

    return newParty;
  } catch (e) {
    return null;
  }
};

/**
 * Actualiza una party en localStorage (fallback offline)
 */
export const updatePartyLocal = async (partyId: string, updates: Partial<PartyLocal>) => {
  try {
    const parties = getPartiesFromStorage();
    const index = parties.findIndex((p) => p.id === partyId);

    if (index === -1) {
      return null;
    }

    const updatedParty: PartyLocal = {
      ...parties[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    parties[index] = updatedParty;
    savePartiesToStorage(parties);

    return updatedParty;
  } catch (e) {
    return null;
  }
};

/**
 * Elimina un personaje de una party en localStorage cuando RLS falla
 * Note: In this implementation, we only log the kick
 * ya que los personajes se manejan en la tabla 'characters', no en 'parties'
 */
export const kickLocal = async (partyId: string, characterId: string) => {
  try {
    // We don't modify parties here because the character is handled in the 'characters' table
    // que tiene su propio localStorage fallback
    return true;
  } catch (e) {
    return false;
  }
};

const CHARACTERS_STORAGE_KEY = 'dnd-characters';

/**
 * Remueve un personaje de su party en localStorage (sin Firestore).
 * Busca el character por ID en el array de dnd-characters y limpia
 * party_id/party_name both at root level and inside `data`.
 */
export const removeFromPartyLocal = async (characterId: string): Promise<{ error: Error | null }> => {
  try {
    const raw = localStorage.getItem(CHARACTERS_STORAGE_KEY);
    if (!raw) {
      return { error: null };
    }
    const characters: Record<string, unknown>[] = JSON.parse(raw);
    const idx = characters.findIndex((c: Record<string, unknown>) => c.id === characterId);
    if (idx === -1) {
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
    return { error: null };
  } catch (e) {
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
    return true;
  } catch (e) {
    return false;
  }
};
