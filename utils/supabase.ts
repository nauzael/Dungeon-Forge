import { createClient } from '@supabase/supabase-js';
import { Character, CampaignResource } from '../types';
import { compressImage, generateThumbnail, optimizeExistingImage } from './imageOptimizer';
import {
  createPartyLocal,
  updatePartyLocal,
  kickLocal,
} from './localStorage';

const TIMEOUT_MS = 15000;

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    ),
  ]);
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

console.log('[Supabase Init] URL:', supabaseUrl ? 'SET ✓' : 'MISSING ✗');
console.log('[Supabase Init] Key: ', supabaseAnonKey ? 'SET ✓' : 'MISSING ✗');
console.log('[Supabase Init] App ID: com.tupaquete.dndcompanion');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Local storage will be used as fallback.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helpers to handle character sync
export const saveCharacterToCloud = async (character: Character, userId: string) => {
  try {
    const { data, error } = await supabase.from('characters').upsert(
      {
        id: character.id,
        user_id: userId,
        data: character,
        party_id: character.party_id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) throw error;
    console.log(
      `[Sync] Success: ${character.name} updated with ${Object.keys(character.usedSlots || {}).length} used slots.`
    );
    return data;
  } catch (e) {
    console.error(`[Sync] Cloud save failed for ${character.name}:`, e instanceof Error ? e.message : e);
    return null;
  }
};

export const fetchCharactersFromCloud = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('data, deleted_at')
      .eq('user_id', userId)
      .is('deleted_at', null);

    if (error) throw error;
    return data ? data.map((item) => item.data) : [];
  } catch (e) {
    console.error('Cloud fetch failed:', e);
    return [];
  }
};

// New function: Fetch IDs of deleted characters (soft deleted) to sync deletions across devices
export const fetchDeletedCharacterIds = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('id')
      .eq('user_id', userId)
      .not('deleted_at', 'is', null);

    if (error) throw error;
    return data ? data.map((item) => item.id) : [];
  } catch (e) {
    console.error('Failed to fetch deleted character IDs:', e);
    return [];
  }
};

// Fetch COMPLETE deleted characters for recovery
export const fetchDeletedCharacters = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('id, data, deleted_at')
      .eq('user_id', userId)
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });

    if (error) throw error;
    return data ? data.map((item) => ({ 
      id: item.id,
      character: item.data as Character,
      deleted_at: item.deleted_at
    })) : [];
  } catch (e) {
    console.error('Failed to fetch deleted characters:', e);
    return [];
  }
};

// Restore a soft-deleted character
export const restoreCharacter = async (characterId: string) => {
  try {
    const { error } = await supabase
      .from('characters')
      .update({ 
        deleted_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', characterId);

    if (error) throw error;
    console.log(`[Recovery] Character ${characterId} restored successfully`);
    return true;
  } catch (e) {
    console.error(`[Recovery] Failed to restore character ${characterId}:`, e);
    return false;
  }
};

export const softDeleteCharacter = async (characterId: string) => {
  try {
    const { error } = await supabase.rpc('soft_delete_character', {
      character_id: characterId
    });
    if (error) {
      console.error('[SoftDelete] RPC failed, trying direct update:', error);
      const { error: updateError } = await supabase
        .from('characters')
        .update({ 
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', characterId);
      if (updateError) throw updateError;
    }
    console.log(`[SoftDelete] Character ${characterId} marked as deleted`);
    return true;
  } catch (e) {
    console.error(`[SoftDelete] Failed for ${characterId}:`, e);
    return false;
  }
};

export const createParty = async (userId: string, name: string) => {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  try {
    const { data, error } = await supabase
      .from('parties')
      .insert({ creator_id: userId, name, code })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (e) {
    // Check if error is RLS policy violation (code 42501)
    const isRlsError =
      (e instanceof Object && 'code' in e && e.code === '42501') ||
      (e instanceof Error && e.message.includes('new row violates'));

    if (isRlsError) {
      console.warn('[RLS] createParty blocked by RLS policy. Falling back to localStorage.');
      return await createPartyLocal(userId, name);
    }

    console.error('Failed to create party:', e instanceof Error ? e.message : e);
    return null;
  }
};

export const joinParty = async (character: Character, code: string) => {
  try {
    console.log(`[Join] Intentando unirse: ${code.trim().toUpperCase()}`);

    // 1. Find party by code
    const { data: party, error: pError } = await supabase
      .from('parties')
      .select('id, name, creator_id')
      .eq('code', code.trim().toUpperCase())
      .maybeSingle();

    if (pError) throw new Error(`Conexión: ${pError.message}`);
    if (!party) throw new Error('Mesa no encontrada con este código.');

    // 2. Prepare character data with the NEW party info
    const characterId = character?.id;
    if (!characterId) throw new Error('Personaje inválido.');

    // Ensure character only has ONE party_id and store the name for the list view
    const updatedCharacter = {
      ...character,
      party_id: party.id,
      party_name: party.name, // Helping the list view show the campaign name
    };

    const effectiveUserId = character.user_id || 'guest';

    // 3. Upsert including party_id
    const { error: cError } = await supabase.from('characters').upsert(
      {
        id: characterId,
        user_id: effectiveUserId,
        data: updatedCharacter,
        party_id: party.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (cError) throw new Error(`Permisos: ${cError.message}`);

    return { partyId: party.id, partyName: party.name, error: null };
  } catch (e) {
    console.error('[Join] Error:', e instanceof Error ? e.message : e);
    return { partyId: null, partyName: null, error: e instanceof Error ? e.message : 'Error desconocido' };
  }
};

// Realtime subscription with timeout + exponential backoff retry
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
  const TIMEOUT_MS = 5000;
  const MAX_RETRIES = 10;
  const MAX_BACKOFF_MS = 8000;
  
  let currentChannel: any = null;
  let timeoutHandle: NodeJS.Timeout | null = null;
  let retryTimeoutHandle: NodeJS.Timeout | null = null;
  let currentAttempt = 0;
  let status: 'connecting' | 'connected' | 'error' | 'reconnecting' = 'connecting';
  
  const calculateBackoff = (attempt: number): number => {
    // Exponential: 2^attempt * 1000ms, capped at 8000ms
    const baseBackoff = Math.min(Math.pow(2, attempt) * 1000, MAX_BACKOFF_MS);
    
    // Jitter: ±10% random
    const jitterPercent = 0.1;
    const jitterAmount = baseBackoff * jitterPercent;
    const randomJitter = (Math.random() - 0.5) * 2 * jitterAmount;
    
    return Math.round(baseBackoff + randomJitter);
  };
  
  const cleanup = async () => {
    if (timeoutHandle) clearTimeout(timeoutHandle);
    if (retryTimeoutHandle) clearTimeout(retryTimeoutHandle);
    if (currentChannel) {
      await currentChannel.unsubscribe();
    }
  };
  
  const attemptSubscribe = (attempt: number) => {
    currentAttempt = attempt;
    
    // Update status
    if (attempt === 0) {
      status = 'connecting';
      onStatusChange?.('connecting');
    } else {
      status = 'reconnecting';
      onStatusChange?.('reconnecting');
    }
    
    console.log(`[Realtime] Attempting to subscribe to party ${partyId} (attempt ${attempt + 1}/${MAX_RETRIES})`);
    
    const channel = supabase.channel(`party-${partyId}`);
    currentChannel = channel;
    let eventReceived = false;
    
    // Setup postgres_changes listener
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'characters',
        filter: `party_id=eq.${partyId}`,
      },
      (payload: unknown) => {
        eventReceived = true;
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
          timeoutHandle = null;
        }
        
        status = 'connected';
        onStatusChange?.('connected');
        console.log(`[Realtime] Connected to party ${partyId} (via postgres_changes)`);
        
        onUpdate(payload);
      }
    );
    
    // Setup broadcast listener
    if (onBroadcast) {
      channel.on('broadcast', { event: 'character-update' }, (payload: any) => {
        eventReceived = true;
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
          timeoutHandle = null;
        }
        
        if (status !== 'connected') {
          status = 'connected';
          onStatusChange?.('connected');
          console.log(`[Realtime] Connected to party ${partyId} (via broadcast)`);
        }
        
        console.log('[Broadcast] Received live update:', payload.payload.character.name);
        onBroadcast(payload.payload.character);
      });
    }
    
    // Subscribe to channel
    channel.subscribe();
    
    // Setup 5s timeout: if no event received within 5s, consider dead and retry
    timeoutHandle = setTimeout(() => {
      if (!eventReceived) {
        console.error(
          `[Realtime] Timeout after ${TIMEOUT_MS}ms for party ${partyId} (attempt ${attempt + 1}/${MAX_RETRIES}) - no events received`
        );
        
        channel.unsubscribe();
        
        if (attempt < MAX_RETRIES - 1) {
          status = 'error';
          onStatusChange?.('error');
          
          const backoffMs = calculateBackoff(attempt);
          console.log(
            `[Realtime] Scheduling retry in ${backoffMs}ms (exponential backoff: 2^${attempt} * 1000ms with ±10% jitter)`
          );
          
          retryTimeoutHandle = setTimeout(() => {
            attemptSubscribe(attempt + 1);
          }, backoffMs);
        } else {
          status = 'error';
          onStatusChange?.('error');
          console.error(
            `[Realtime] Max retries (${MAX_RETRIES}) reached for party ${partyId}. Escalating. Manual reconnection required.`
          );
        }
      }
    }, TIMEOUT_MS);
  };
  
  // Start first attempt
  attemptSubscribe(0);
  
  // Return subscription object with unsubscribe method
  return {
    channel: currentChannel,
    unsubscribe: cleanup,
    status,
  };
};

export const subscribeToParty = (
  partyId: string,
  onUpdate: (payload: unknown) => void,
  onBroadcast?: (payload: unknown) => void
) => {
  const channel = supabase.channel(`party-${partyId}`);

  channel.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'characters',
      filter: `party_id=eq.${partyId}`,
    },
    onUpdate
  );

  if (onBroadcast) {
    channel.on('broadcast', { event: 'character-update' }, (payload) => {
      console.log('[Broadcast] Received live update:', payload.payload.character.name);
      onBroadcast(payload.payload.character);
    });
  }

  return channel.subscribe();
};

export const broadcastCharacterUpdate = (partyId: string, character: Character) => {
  supabase.channel(`party-${partyId}`).send({
    type: 'broadcast',
    event: 'character-update',
    payload: { character },
  });
};

export const removeFromParty = async (characterId: string) => {
  try {
    const { data: char, error: fError } = await supabase
      .from('characters')
      .select('data')
      .eq('id', characterId)
      .single();

    if (fError || !char) throw new Error('Personaje no encontrado');

    // ✅ FIX: Actualizar syncTimestamp cuando se cambia party_id
    const updatedData = { ...char.data, party_id: null, syncTimestamp: Date.now() };

    const { error: uError } = await supabase
      .from('characters')
      .update({
        party_id: null,
        data: updatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', characterId);

    if (uError) throw uError;
    console.log(`[removeFromParty] Character ${characterId} kicked, syncTimestamp updated to ${updatedData.syncTimestamp}`);
    return true;
  } catch (e) {
    // Check if error is RLS policy violation (code 42501)
    const isRlsError =
      (e instanceof Object && 'code' in e && e.code === '42501') ||
      (e instanceof Error && e.message.includes('new row violates'));

    if (isRlsError) {
      console.warn('[RLS] removeFromParty blocked by RLS policy. Falling back to localStorage.');
      // Extract party_id from characterId if available, otherwise use placeholder
      // For now, we log the kick locally
      return await kickLocal('unknown-party', characterId);
    }

    console.error('Failed to remove from party:', e instanceof Error ? e.message : e);
    return false;
  }
};

export const updatePartyName = async (partyId: string, name: string) => {
  try {
    const { error } = await supabase.from('parties').update({ name }).eq('id', partyId);
    if (error) throw error;
    return true;
  } catch (e) {
    // Check if error is RLS policy violation (code 42501)
    const isRlsError =
      (e instanceof Object && 'code' in e && e.code === '42501') ||
      (e instanceof Error && e.message.includes('new row violates'));

    if (isRlsError) {
      console.warn('[RLS] updatePartyName blocked by RLS policy. Falling back to localStorage.');
      const result = await updatePartyLocal(partyId, { name });
      return result !== null;
    }

    console.error('Failed to update party name:', e instanceof Error ? e.message : e);
    return false;
  }
};

export const deleteParty = async (partyId: string, userId: string) => {
  try {
    console.log(`[Delete] Intentando eliminar mesa ${partyId} de usuario ${userId}`);

    // 1. Desvincular todos los personajes de esta mesa
    const { error: charError } = await supabase
      .from('characters')
      .update({ party_id: null })
      .eq('party_id', partyId);

    if (charError) {
      console.error('[Delete] Error al desvincular personajes:', charError);
    }

    // 2. Eliminar la mesa (solo si somos el creador)
    const { error, count } = await supabase
      .from('parties')
      .delete()
      .eq('id', partyId)
      .eq('creator_id', userId);

    if (error) {
      console.error('[Delete] Error de Supabase:', error);
      throw error;
    }

    console.log(`[Delete] Mesa eliminada. Filas afectadas: ${count}`);
    return true;
  } catch (e) {
    console.error('Failed to delete party:', e instanceof Error ? e.message : e);
    return false;
  }
};

// --- Party Resources Management ---

export const getPartyResources = async (partyId: string) => {
  try {
    const { data, error } = await supabase
      .from('party_resources')
      .select('*')
      .eq('party_id', partyId)
      .eq('is_persistent', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('Failed to fetch party resources:', e);
    return [];
  }
};

export const addPartyResource = async (resource: CampaignResource) => {
  try {
    console.log('[Atlas] addPartyResource inserting:', JSON.stringify(resource, null, 2));

    const { data, error } = await supabase.from('party_resources').insert(resource).select();

    console.log('[Atlas] Insert result data:', data);
    console.log('[Atlas] Insert result error:', error);

    if (error) {
      console.error('[Atlas] Insert error message:', error.message);
      console.error('[Atlas] Insert error details:', error.details);
      console.error('[Atlas] Insert error hint:', error.hint);
      console.error('[Atlas] Insert error code:', error.code);
      console.error('[Atlas] Insert full error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.error('[Atlas] Insert returned no data');
      throw new Error('Insert returned no data');
    }

    console.log('[Atlas] addPartyResource success:', data[0]);
    return data[0];
  } catch (e) {
    console.error('[Atlas] addPartyResource error:', e instanceof Error ? e.message : e);
    console.error('[Atlas] Full error:', JSON.stringify(e, null, 2));
    return null;
  }
};

export const deletePartyResource = async (resourceId: string) => {
  try {
    const { error } = await supabase.from('party_resources').delete().eq('id', resourceId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to delete party resource:', e);
    return false;
  }
};

export const broadcastResourceShare = (
  partyId: string,
  resource: { url: string; title: string; description?: string }
) => {
  supabase.channel(`party-${partyId}`).send({
    type: 'broadcast',
    event: 'resource-share',
    payload: { resource },
  });
};

export const broadcastResourceHide = (partyId: string) => {
  supabase.channel(`party-${partyId}`).send({
    type: 'broadcast',
    event: 'resource-hide',
    payload: {},
  });
};

export const updatePartyResourcePersistence = async (
  resourceId: string,
  is_persistent: boolean
) => {
  try {
    const { error } = await supabase
      .from('party_resources')
      .update({ is_persistent })
      .eq('id', resourceId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to update resource persistence:', e);
    return false;
  }
};

export const uploadResourceImage = async (file: File) => {
  try {
    console.log('[Atlas] Starting upload for:', file.name, file.size);

    // Run compression and thumbnail in parallel using Promise.allSettled
    // This way if thumbnail fails, compression still succeeds
    const [compressionResult, thumbnailResult] = await withTimeout(
      Promise.allSettled([compressImage(file), generateThumbnail(file)]),
      TIMEOUT_MS
    );

    console.log('[Atlas] Promise.allSettled results:', {
      compression: {
        status: compressionResult.status,
        value: compressionResult.status === 'fulfilled' ? 'OK' : compressionResult.reason,
      },
      thumbnail: {
        status: thumbnailResult.status,
        value: thumbnailResult.status === 'fulfilled' ? 'OK' : thumbnailResult.reason,
      },
    });

    const compressedFile =
      compressionResult.status === 'fulfilled' ? compressionResult.value : null;
    const thumbnailDataUrl = thumbnailResult.status === 'fulfilled' ? thumbnailResult.value : null;

    if (!compressedFile) {
      console.error('[Atlas] Compression failed:', compressionResult);
      return null;
    }

    console.log('[Atlas] Compression done, thumbnail:', thumbnailDataUrl ? 'OK' : 'FAILED');

    const fileName = `${Date.now()}.webp`;
    const filePath = `atlas/${fileName}`;

    console.log('[Atlas] Uploading to Storage:', filePath);

    const { data: uploadData, error: uploadError } = await withTimeout(
      supabase.storage.from('atlas').upload(filePath, compressedFile, {
        contentType: 'image/webp',
        upsert: false,
      }),
      TIMEOUT_MS
    );

    if (uploadError) {
      console.error('[Atlas] Storage Error:', uploadError);
      throw uploadError;
    }

    console.log('[Atlas] Upload successful');

    const { data: urlData } = supabase.storage.from('atlas').getPublicUrl(filePath);

    return {
      fullUrl: urlData.publicUrl,
      thumbnailUrl: thumbnailDataUrl,
    };
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error('[Atlas] Upload failed with exception:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    return null;
  }
};

/**
 * Actualiza el thumbnail_url de un recurso existente en la base de datos.
 */
export const updateResourceThumbnail = async (resourceId: string, thumbnailUrl: string) => {
  try {
    const { error } = await supabase
      .from('party_resources')
      .update({ thumbnail_url: thumbnailUrl })
      .eq('id', resourceId);

    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to update resource thumbnail:', e);
    return false;
  }
};

/**
 * Migra imágenes existentes: optimiza y genera thumbnail para recursos sin uno.
 * Procesa en background, no bloquea la UI.
 */
export const migrateExistingResourceImages = async (
  partyId: string
): Promise<{
  migrated: number;
  failed: number;
}> => {
  try {
    // 1. Obtener recursos sin thumbnail
    const { data: resources, error: fetchError } = await supabase
      .from('party_resources')
      .select('*')
      .eq('party_id', partyId)
      .is('thumbnail_url', null);

    if (fetchError) throw fetchError;
    if (!resources || resources.length === 0) {
      return { migrated: 0, failed: 0 };
    }

    let migrated = 0;
    let failed = 0;

    // 2. Procesar cada recurso
    for (const resource of resources) {
      try {
        const result = await optimizeExistingImage(resource.url);
        if (result && result.thumbnailDataUrl) {
          await updateResourceThumbnail(resource.id, result.thumbnailDataUrl);
          migrated++;
        } else {
          failed++;
        }
      } catch (err) {
        console.error(`Error migrating resource ${resource.id}:`, err);
        failed++;
      }
    }

    return { migrated, failed };
  } catch (e) {
    console.error('Migration failed:', e);
    return { migrated: 0, failed: 0 };
  }
};
