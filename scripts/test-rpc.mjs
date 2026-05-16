#!/usr/bin/env node

/**
 * Test simple para verificar si el RPC remove_character_from_party existe
 * y qué error devuelve
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://usnlhzkpukkuwbtortil.supabase.co';
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!ANON_KEY) {
  console.error('❌ VITE_SUPABASE_ANON_KEY not found');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, ANON_KEY);

console.log('🔍 Probando RPC remove_character_from_party...\n');

// Intenta llamar el RPC con un ID dummy
const testCharacterId = 'test-dummy-id';

console.log(`📌 Intentando: supabase.rpc('remove_character_from_party', { char_id: '${testCharacterId}' })`);

try {
  const { data, error } = await supabase.rpc('remove_character_from_party', { 
    char_id: testCharacterId 
  });

  if (error) {
    console.error('\n❌ RPC Error:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });

    if (error.code === '42883' || error.message.includes('does not exist')) {
      console.log('\n🔴 PROBLEMA ENCONTRADO:');
      console.log('   La función RPC "remove_character_from_party" NO EXISTE en Supabase');
      console.log('\n   Solución: Crear la función RPC o usar UPDATE directo');
    }
  } else {
    console.log('✅ RPC ejecutado (sin error). Resultado:', data);
  }
} catch (err) {
  console.error('❌ Exception:', err instanceof Error ? err.message : err);
}
