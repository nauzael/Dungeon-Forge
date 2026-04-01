import { createClient } from '@supabase/supabase-js';
import { compressImage, generateThumbnail, optimizeExistingImage } from './imageOptimizer';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Local storage will be used as fallback.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helpers to handle character sync
export const saveCharacterToCloud = async (character: any, userId: string) => {
    try {
        const { data, error } = await supabase
            .from('characters')
            .upsert({ 
                id: character.id, 
                user_id: userId, 
                data: character,
                party_id: character.party_id, // Important for DM Dashboard sync
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });
        
        if (error) throw error;
        console.log(`[Sync] Success: ${character.name} updated with ${Object.keys(character.usedSlots || {}).length} used slots.`);
        return data;
    } catch (e: any) {
        console.error(`[Sync] Cloud save failed for ${character.name}:`, e.message || e);
        return null;
    }
};

export const fetchCharactersFromCloud = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('characters')
            .select('data')
            .eq('user_id', userId);
        
        if (error) throw error;
        return data ? data.map(item => item.data) : [];
    } catch (e) {
        console.error("Cloud fetch failed:", e);
        return [];
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
        console.error("Failed to create party:", e);
        return null;
    }
};

export const joinParty = async (character: any, code: string) => {
    try {
        console.log(`[Join] Intentando unirse: ${code.trim().toUpperCase()}`);
        
        // 1. Find party by code
        const { data: party, error: pError } = await supabase
            .from('parties')
            .select('id, name, creator_id')
            .eq('code', code.trim().toUpperCase())
            .maybeSingle();
        
        if (pError) throw new Error(`Conexión: ${pError.message}`);
        if (!party) throw new Error("Mesa no encontrada con este código.");

        // 2. Prepare character data with the NEW party info
        const characterId = character?.id;
        if (!characterId) throw new Error("Personaje inválido.");
        
        // Ensure character only has ONE party_id and store the name for the list view
        const updatedCharacter = { 
            ...character, 
            party_id: party.id,
            party_name: party.name // Helping the list view show the campaign name
        };
        
        const effectiveUserId = character.user_id || 'guest';
        
        // 3. Upsert including party_id
        const { error: cError } = await supabase
            .from('characters')
            .upsert({ 
                id: characterId, 
                user_id: effectiveUserId, 
                data: updatedCharacter,
                party_id: party.id,
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });
        
        if (cError) throw new Error(`Permisos: ${cError.message}`);
        
        return { partyId: party.id, partyName: party.name, error: null };
    } catch (e: any) {
        console.error("[Join] Error:", e.message || e);
        return { partyId: null, partyName: null, error: e.message || "Error desconocido" };
    }
};

export const subscribeToParty = (partyId: string, onUpdate: (payload: any) => void, onBroadcast?: (payload: any) => void) => {
    const channel = supabase.channel(`party-${partyId}`);
    
    channel
        .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'characters', 
            filter: `party_id=eq.${partyId}` 
        }, onUpdate);

    if (onBroadcast) {
        channel.on('broadcast', { event: 'character-update' }, (payload) => {
            console.log("[Broadcast] Received live update:", payload.payload.character.name);
            onBroadcast(payload.payload.character);
        });
    }

    return channel.subscribe();
};

export const broadcastCharacterUpdate = (partyId: string, character: any) => {
    // We use a dedicated channel for broadcasting to avoid clashing with the subscription.
    // However, if we reuse the same name, we can broadcast to the same listeners.
    supabase.channel(`party-${partyId}`).send({
        type: 'broadcast',
        event: 'character-update',
        payload: { character }
    });
};

export const removeFromParty = async (characterId: string) => {
    try {
        const { data: char, error: fError } = await supabase
            .from('characters')
            .select('data')
            .eq('id', characterId)
            .single();
        
        if (fError || !char) throw new Error("Personaje no encontrado");

        const updatedData = { ...char.data, party_id: null };

        const { error: uError } = await supabase
            .from('characters')
            .update({ 
                party_id: null, 
                data: updatedData,
                updated_at: new Date().toISOString()
            })
            .eq('id', characterId);
        
        if (uError) throw uError;
        return true;
    } catch (e) {
        console.error("Failed to remove from party:", e);
        return false;
    }
};

export const updatePartyName = async (partyId: string, name: string) => {
    try {
        const { error } = await supabase
            .from('parties')
            .update({ name })
            .eq('id', partyId);
        if (error) throw error;
        return true;
    } catch (e) {
        console.error("Failed to update party name:", e);
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
            console.error("[Delete] Error al desvincular personajes:", charError);
        }

        // 2. Eliminar la mesa (solo si somos el creador)
        const { error, count } = await supabase
            .from('parties')
            .delete()
            .eq('id', partyId)
            .eq('creator_id', userId);
        
        if (error) {
            console.error("[Delete] Error de Supabase:", error);
            throw error;
        }

        console.log(`[Delete] Mesa eliminada. Filas afectadas: ${count}`);
        return true;
    } catch (e: any) {
        console.error("Failed to delete party:", e.message || e);
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
        console.error("Failed to fetch party resources:", e);
        return [];
    }
};

export const addPartyResource = async (resource: any) => {
    try {
        const { data, error } = await supabase
            .from('party_resources')
            .insert(resource)
            .select()
            .single();
        if (error) throw error;
        return data;
    } catch (e) {
        console.error("Failed to add party resource:", e);
        return null;
    }
};

export const deletePartyResource = async (resourceId: string) => {
    try {
        const { error } = await supabase
            .from('party_resources')
            .delete()
            .eq('id', resourceId);
        if (error) throw error;
        return true;
    } catch (e) {
        console.error("Failed to delete party resource:", e);
        return false;
    }
};

export const broadcastResourceShare = (partyId: string, resource: { url: string, title: string, description?: string }) => {
    supabase.channel(`party-${partyId}`).send({
        type: 'broadcast',
        event: 'resource-share',
        payload: { resource }
    });
};

export const broadcastResourceHide = (partyId: string) => {
    supabase.channel(`party-${partyId}`).send({
        type: 'broadcast',
        event: 'resource-hide',
        payload: {}
    });
};

export const updatePartyResourcePersistence = async (resourceId: string, is_persistent: boolean) => {
    try {
        const { error } = await supabase
            .from('party_resources')
            .update({ is_persistent })
            .eq('id', resourceId);
        if (error) throw error;
        return true;
    } catch (e) {
        console.error("Failed to update resource persistence:", e);
        return false;
    }
};

export const uploadResourceImage = async (file: File) => {
    try {
        // 1. Comprimir imagen
        const compressedFile = await compressImage(file);

        // 2. Generar thumbnail base64
        const thumbnailDataUrl = await generateThumbnail(file);

        // 3. Subir imagen comprimida a Storage
        const fileName = `${Date.now()}.webp`;
        const filePath = `atlas/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('atlas')
            .upload(filePath, compressedFile);

        if (uploadError) {
            console.error("Supabase Storage Error:", uploadError);
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('atlas')
            .getPublicUrl(filePath);

        // 4. Devolver both: full URL y thumbnail (base64)
        return {
            fullUrl: data.publicUrl,
            thumbnailUrl: thumbnailDataUrl
        };
    } catch (e: any) {
        console.error("Upload failed details:", e.message || e);
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
        console.error("Failed to update resource thumbnail:", e);
        return false;
    }
};

/**
 * Migra imágenes existentes: optimiza y genera thumbnail para recursos sin uno.
 * Procesa en background, no bloquea la UI.
 */
export const migrateExistingResourceImages = async (partyId: string): Promise<{
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
        console.error("Migration failed:", e);
        return { migrated: 0, failed: 0 };
    }
};

