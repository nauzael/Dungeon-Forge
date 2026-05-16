#!/usr/bin/env node
/**
 * 🧹 LIMPIEZA DM DASHBOARD
 * 
 * Limpia:
 * 1. localStorage entries de iniciativa antiguas
 * 2. Parties sin actividad en >90 días (OPCIONAL)
 * 3. Personajes soft-deleted en parties
 * 
 * USO:
 * node scripts/cleanup-dm-storage.mjs <SUPABASE_URL> <SERVICE_ROLE_KEY> [cleanup-parties]
 */

import { createClient } from '@supabase/supabase-js';

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('❌ Error: Falta la URL y/o service role key');
  console.error('\nUSO:');
  console.error('  node scripts/cleanup-dm-storage.mjs <SUPABASE_URL> <SERVICE_ROLE_KEY> [cleanup-parties]');
  console.error('\nEjemplo con limpieza de parties:');
  console.error('  node scripts/cleanup-dm-storage.mjs "https://abc123.supabase.co" "sbp_xxx..." cleanup-parties');
  process.exit(1);
}

const [supabaseUrl, serviceRoleKey, cleanupPartiesFlag] = args;
const shouldCleanupParties = cleanupPartiesFlag === 'cleanup-parties';

console.log(`
╔════════════════════════════════════════════════════════════╗
║     🧹 LIMPIEZA: DM Dashboard Storage                     ║
║     Limpiando datos de iniciativa y parties antiguas       ║
╚════════════════════════════════════════════════════════════╝
`);

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  try {
    // 1️⃣ LIMPIAR SOFT-DELETED EN PARTIES
    console.log('\n1️⃣  Limpiando personajes soft-deleted en parties...\n');

    const { data: softDeletedInParties, error: sdfError } = await supabase
      .from('characters')
      .select('id, party_id, data')
      .not('party_id', 'is', null)
      .not('deleted_at', 'is', null);

    if (sdfError) {
      console.error('❌ Error:', sdfError);
    } else if (!softDeletedInParties || softDeletedInParties.length === 0) {
      console.log('✅ No hay personajes soft-deleted en parties para limpiar');
    } else {
      console.log(`📊 Encontrados ${softDeletedInParties.length} personajes soft-deleted en parties\n`);

      let deletedCount = 0;
      for (const char of softDeletedInParties) {
        const { error: delError } = await supabase
          .from('characters')
          .delete()
          .eq('id', char.id);

        if (delError) {
          console.error(`❌ Error purgando ${char.id}:`, delError);
        } else {
          console.log(`✅ Purgado: ${char.id.substring(0, 8)}...`);
          deletedCount++;
        }
      }

      console.log(`\n✅ ${deletedCount} personajes purgados`);
    }

    // 2️⃣ LIMPIAR PARTIES ABANDONADAS (OPCIONAL)
    if (shouldCleanupParties) {
      console.log('\n2️⃣  Limpiando parties sin actividad >90 días...\n');

      const { data: allParties, error: partiesError } = await supabase
        .from('parties')
        .select('id, name, created_at');

      if (partiesError) {
        console.error('❌ Error:', partiesError);
      } else if (!allParties || allParties.length === 0) {
        console.log('✅ No hay parties para analizar');
      } else {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 90);

        const oldParties = allParties.filter(p => {
          const lastUpdate = new Date(p.created_at);
          return lastUpdate < cutoffDate;
        });

        if (oldParties.length === 0) {
          console.log('✅ No hay parties sin actividad >90 días');
        } else {
          console.log(`📊 Encontradas ${oldParties.length} parties para eliminar\n`);

          let deletedParties = 0;
          for (const party of oldParties) {
            // 1. Delete members of the party (cascade delete)
            const { error: membersError } = await supabase
              .from('characters')
              .delete()
              .eq('party_id', party.id);

            if (membersError) {
              console.error(`❌ Error eliminando miembros de ${party.name}:`, membersError);
              continue;
            }

            // 2. Delete the party
            const { error: partyError } = await supabase
              .from('parties')
              .delete()
              .eq('id', party.id);

            if (partyError) {
              console.error(`❌ Error eliminando party ${party.name}:`, partyError);
            } else {
              console.log(`✅ Eliminada party: "${party.name}" (creada: ${new Date(party.created_at).toLocaleDateString()})`);
              deletedParties++;
            }
          }

          console.log(`\n✅ ${deletedParties} parties eliminadas`);
        }
      }
    } else {
      console.log('\n2️⃣  ⏭️  Omitiendo limpieza de parties (usa "cleanup-parties" para limpiar)\n');
    }

    // 3️⃣ INFORMACIÓN SOBRE localStorage
    console.log('\n3️⃣  Información sobre localStorage (DM Initiative):\n');
    console.log(`📝 NOTA: localStorage se limpia automáticamente del navegador`);
    console.log(`   Cada key: df-dm-initiative-<partyId>`);
    console.log(`   Tamaño: Generalmente <100KB por mesa`);
    console.log(`   Limpieza: Borrar manualmente en DevTools si necesario\n`);
    console.log(`   Cómo limpiar manualmente:`);
    console.log(`   1. Abre DevTools (F12)`);
    console.log(`   2. Application → Local Storage`);
    console.log(`   3. Busca keys "df-dm-initiative-"`);
    console.log(`   4. Elimina las que correspondan a mesas antiguas`);

    // 4️⃣ RESUMEN
    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ LIMPIEZA COMPLETADA');
    console.log('='.repeat(60));
    console.log(`
🎯 QUÉ SE LIMPIÓ:
   ✅ Personajes soft-deleted en parties (purgados de BD)
   ${shouldCleanupParties ? '✅' : '⏭️'} Parties sin actividad >90 días (${shouldCleanupParties ? 'eliminadas' : 'omitidas'})

💾 QUÉ HACER DESPUÉS:
   1. localStorage se limpia automáticamente
   2. Recarga la app
   3. Verifica que DM Dashboard funciona correctamente
   4. Ejecuta nuevamente en 30 días

📊 PRÓXIMOS PASOS:
   ├─ Verificar que el DM Dashboard carga bien
   ├─ Limpiar cache del navegador (Ctrl+Shift+Del)
   └─ Opcional: Ejecutar con "cleanup-parties" en 90 días
`);

  } catch (e) {
    console.error('❌ Error inesperado:', e);
  }
}

main();
