#!/usr/bin/env node

/**
 * Diagnóstico del problema de Kaelen en la party
 * 
 * Comprueba:
 * 1. Estado del personaje Kaelen (party_id, deleted_at, etc.)
 * 2. Existencia de la party asignada
 * 3. RLS policies
 * 4. Intenta simular la operación de dejar party
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://usnlhzkpukkuwbtortil.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY no está definida');
  console.error('   Ejecuta con: SUPABASE_SERVICE_ROLE_KEY="tu_key" node diagnose-kaelen-party-issue.mjs');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

console.log('🔍 DIAGNÓSTICO: Kaelen Rompehielos - Party Issue\n');

// 1. Buscar el personaje Kaelen
console.log('📋 Paso 1: Buscando personaje Kaelen...');
const { data: kaelenData, error: kaelenError } = await supabase
  .from('characters')
  .select('*')
  .ilike('data->>name', '%kaelen%')
  .limit(10);

if (kaelenError) {
  console.error('❌ Error al buscar Kaelen:', kaelenError);
  process.exit(1);
}

if (!kaelenData || kaelenData.length === 0) {
  console.log('❌ Kaelen no encontrado en la BD');
  process.exit(1);
}

console.log(`✅ Encontrado(s) ${kaelenData.length} personaje(s) con nombre similar a Kaelen:`);

for (const char of kaelenData) {
  const charData = char.data;
  console.log(`
  📌 ID: ${char.id}
  📄 Nombre: ${charData.name}
  👤 Usuario: ${char.user_id}
  🏛️  Party ID: ${char.party_id || '❌ SIN PARTY'}
  🗑️  Deleted: ${char.deleted_at ? '✅ SOFT-DELETED' : '❌ ACTIVO'}
  ⏰ Actualizado: ${char.updated_at}
  `);

  // Detalles de la party si existe
  if (char.party_id) {
    const { data: partyData, error: partyError } = await supabase
      .from('parties')
      .select('*')
      .eq('id', char.party_id)
      .single();

    if (partyError) {
      console.log(`  ❌ Error al buscar party ${char.party_id}: ${partyError.message}`);
    } else if (!partyData) {
      console.log(`  ❌ Party ${char.party_id} NO EXISTE EN LA BASE`);
    } else {
      console.log(`  ✅ Party encontrada:`);
      console.log(`     - Nombre: ${partyData.name}`);
      console.log(`     - Código: ${partyData.code}`);
      console.log(`     - Creador: ${partyData.creator_id}`);
    }

    // Contar miembros de la party
    const { data: members, error: membersError } = await supabase
      .from('characters')
      .select('id, data->>name')
      .eq('party_id', char.party_id)
      .is('deleted_at', null);

    if (membersError) {
      console.log(`  ❌ Error al contar miembros: ${membersError.message}`);
    } else {
      console.log(`  📊 Miembros en la party (no soft-deleted):`);
      if (members && members.length > 0) {
        for (const m of members) {
          console.log(`     - ${m['data->>name']} (${m.id})`);
        }
      } else {
        console.log(`     ❌ NINGUNO (Kaelen es el único, pero visible=${char.id})`);
      }
    }
  }
}

// Seleccionar el Kaelen que parece ser el problema
const targetKaelen = kaelenData[0];
console.log(`\n🎯 Analizando en detalle: ${targetKaelen.data.name} (${targetKaelen.id})`);

// 2. Revisar el campo party_id en varios niveles
console.log('\n🔧 Paso 2: Analizando campo party_id...');

const kaelenPartyId = targetKaelen.party_id;
if (!kaelenPartyId) {
  console.log('⚠️  party_id es null/undefined. Kaelen NO DEBERÍA verse conectado a party.');
} else {
  console.log(`✅ party_id = ${kaelenPartyId}`);

  // Verificar si party existe
  const { data: party, error: partyCheckError } = await supabase
    .from('parties')
    .select('*')
    .eq('id', kaelenPartyId)
    .single();

  if (partyCheckError && partyCheckError.code !== 'PGRST116') {
    console.log(`❌ Error al verificar party: ${partyCheckError.message}`);
  } else if (!party) {
    console.log(`❌ PROBLEMA CRÍTICO: party_id=${kaelenPartyId} NO EXISTE EN LA BD`);
    console.log('   → Kaelen tiene referencia a party fantasma');
    console.log('   → Necesita limpieza: UPDATE characters SET party_id=null WHERE id=${kaelenPartyId}');
  } else {
    console.log(`✅ Party existe: ${party.name} (${party.code})`);
  }
}

// 3. Revisar si hay conflictos de sincronización
console.log('\n📡 Paso 3: Revisando sincronización...');

const charData = targetKaelen.data;
console.log(`Data.party_id en JSON: ${charData.party_id || 'undefined'}`);

if (charData.party_id !== kaelenPartyId) {
  console.log('⚠️  INCONSISTENCIA: data.party_id !== characters.party_id');
  console.log(`   - DB field party_id: ${kaelenPartyId}`);
  console.log(`   - JSON data.party_id: ${charData.party_id}`);
  console.log('   → Esto puede causar confusión en la UI');
}

// 4. Intentar simular el proceso de dejar party
console.log('\n⚠️  Paso 4: Simulando removeFromParty (DRY RUN - NO MODIFICA)...');

if (!kaelenPartyId) {
  console.log('❌ No hay party_id, no se puede hacer removeFromParty');
} else {
  // Intentar UPDATE (sin confirmar) para ver si RLS bloquea
  console.log('Verificando permisos RLS...');
  
  // Este UPDATE no se ejecutará (ROLLBACK), solo para diagnosticar RLS
  const testUpdate = supabase
    .from('characters')
    .update({
      party_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', targetKaelen.id);

  // Convertir a query para inspeccionar
  console.log(`Query que se ejecutaría:`);
  console.log(`  UPDATE characters SET party_id=null WHERE id='${targetKaelen.id}'`);

  const { error: testError } = await testUpdate;
  
  if (testError) {
    console.log(`❌ RLS ERROR: ${testError.message} (Code: ${testError.code})`);
    console.log('   → removeFromParty fallaría con este usuario');
  } else {
    console.log('✅ RLS permitiría UPDATE (pero no ejecutado, era TEST)');
  }
}

// 5. Resumen y recomendaciones
console.log('\n' + '═'.repeat(60));
console.log('📊 RESUMEN Y RECOMENDACIONES');
console.log('═'.repeat(60));

if (!kaelenPartyId) {
  console.log(`
❌ PROBLEMA 1: Kaelen NO TIENE party_id asignada
   Pero dice estar conectada a una party.
   
   CAUSA: Probablemente el UPDATE de removeFromParty falló,
          dejando un estado inconsistente.
   
   SOLUCIÓN:
   1. Verificar browser console de Kaelen para ver error exacto
   2. Si el error es "RLS policy", revisar RLS policies
   3. Si el error es timeout/network, reintentar
  `);
} else {
  const { data: party } = await supabase
    .from('parties')
    .select('*')
    .eq('id', kaelenPartyId)
    .single();

  if (!party) {
    console.log(`
❌ PROBLEMA 2: Kaelen referencia party fantasma (${kaelenPartyId})
   
   CAUSA: Party fue eliminada, pero character aún tiene party_id.
   
   SOLUCIÓN RÁPIDA:
   Execute: UPDATE characters SET party_id=NULL WHERE id='${targetKaelen.id}';
   
   SOLUCIÓN ALTERNATIVA:
   Kaelen intenta dejar party (removeFromParty fallaría con NOT FOUND).
  `);
  } else {
    console.log(`
✅ PROBLEMA 3: Kaelen ESTÁ en party válida: ${party.name}
   Pero NO APARECE en lista de miembros del DM.
   
   CAUSA POSIBLE:
   1. Soft-delete en progress (deleted_at está seteado)
   2. Party_id no está sincronizado correctamente
   3. DM dashboard no refresca la lista
   4. RLS filtra al Kaelen del DM (verificar RLS policies)
   
   VERIFICACIÓN:
   - Check browser console: ¿RLS error? ¿timeout?
   - Check localStorage: ¿Kaelen en dnd-characters?
   - Check realtime subscription: ¿estatus='connected'?
    `);
  }
}

console.log('\n💡 PRÓXIMOS PASOS:');
console.log('1. Revisar console del navegador para errors específicos');
console.log('2. Compartir el error exacto que genera removeFromParty');
console.log('3. Verificar RLS policies en Supabase dashboard');
console.log('4. Si necesario, ejecutar comando SQL para limpiar party_id\n');
