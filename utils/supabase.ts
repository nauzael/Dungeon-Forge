import { createClient } from '@supabase/supabase-js';

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

        // 2. Prepare character data
        const characterId = character?.id;
        if (!characterId) throw new Error("Personaje inválido.");
        const effectiveUserId = character.user_id || 'guest';
        
        // 3. Upsert including party_id
        const { error: cError } = await supabase
            .from('characters')
            .upsert({ 
                id: characterId, 
                user_id: effectiveUserId, 
                data: character,
                party_id: party.id,
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });
        
        if (cError) throw new Error(`Permisos: ${cError.message}`);
        
        return { partyId: party.id, error: null };
    } catch (e: any) {
        console.error("[Join] Error:", e.message || e);
        return { partyId: null, error: e.message || "Error desconocido" };
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

