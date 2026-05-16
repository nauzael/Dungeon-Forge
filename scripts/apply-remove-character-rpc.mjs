#!/usr/bin/env node

/**
 * Aplica la migración 008 para crear la función RPC remove_character_from_party
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = 'https://usnlhzkpukkuwbtortil.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY no está definida');
  console.error('Uso: SUPABASE_SERVICE_ROLE_KEY="tu_key" node apply-remove-character-rpc.mjs');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const migrationPath = join(process.cwd(), 'supabase', 'migrations', '008_create_remove_character_from_party_rpc.sql');
console.log(`📁 Leyendo migración: ${migrationPath}`);

let migrationSQL;
try {
  migrationSQL = readFileSync(migrationPath, 'utf-8');
} catch (err) {
  console.error(`❌ Error al leer archivo: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
}

console.log('📝 SQL a ejecutar:');
console.log('─'.repeat(60));
console.log(migrationSQL.substring(0, 300) + '...');
console.log('─'.repeat(60));
console.log('\n⏳ Ejecutando migración...\n');

const executeSQL = async () => {
  try {
    const { error } = await supabase.rpc('execute_sql', {
      sql: migrationSQL
    });

    if (error) {
      console.error('❌ Error ejecutando RPC execute_sql:');
      console.error(error);
      
      // Intentar con query directo si el RPC no existe
      console.log('\n⚠️  El RPC execute_sql no existe. Necesitas ejecutar el SQL manualmente en Supabase.');
      console.log('📋 Pasos:');
      console.log('1. Abre https://app.supabase.com/project/usnlhzkpukkuwbtortil/sql/new');
      console.log('2. Copia y pega el SQL del archivo: supabase/migrations/008_create_remove_character_from_party_rpc.sql');
      console.log('3. Haz click en "Run"');
      process.exit(1);
    }

    console.log('✅ Migración aplicada exitosamente!');
    console.log('\n🎉 La función RPC remove_character_from_party está lista para usar.');
  } catch (err) {
    console.error('❌ Exception:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
};

executeSQL();
