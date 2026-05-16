#!/usr/bin/env node
/**
 * 🧹 SCRIPT DE LIMPIEZA - Purga soft-deleted characters
 * 
 * Elimina personajes marcados como soft-deleted que no se han 
 * usado en más de N días, liberando espacio en storage.
 * 
 * USO:
 * node scripts/cleanup-storage.mjs <SUPABASE_URL> <SERVICE_ROLE_KEY> [DAYS=30]
 */

import { createClient } from '@supabase/supabase-js';

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('❌ Error: Falta la URL y/o service role key');
  console.error('\nUSO:');
  console.error('  node scripts/cleanup-storage.mjs <SUPABASE_URL> <SERVICE_ROLE_KEY> [DAYS=30]');
  console.error('\nEjemplo:');
  console.error('  node scripts/cleanup-storage.mjs "https://abc123.supabase.co" "sbp_xxx..." 30');
  process.exit(1);
}

const [supabaseUrl, serviceRoleKey, daysArg] = args;
const daysOld = parseInt(daysArg || '30', 10);

console.log(`
╔════════════════════════════════════════════════════════════╗
║     🧹 LIMPIEZA DE STORAGE                                ║
║     Purgar soft-deleted characters > ${daysOld} días                 ║
╚════════════════════════════════════════════════════════════╝
`);

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  try {
    // 1️⃣ ANALIZAR ANTES DE LIMPIAR
    console.log(`\n1️⃣  Analizando soft-deleted > ${daysOld} días...\n`);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffIso = cutoffDate.toISOString();

    const { data: toDelete, error: analyzeError } = await supabase
      .from('characters')
      .select('id, user_id, data, deleted_at, pg_column_size(data) as size')
      .not('deleted_at', 'is', null)
      .lt('deleted_at', cutoffIso);

    if (analyzeError) {
      console.error('❌ Error analizando:', analyzeError);
      // Intenta sin pg_column_size
      console.log('   Reintentando sin cálculo de tamaño...');
      const { data: fallback, error: fallbackError } = await supabase
        .from('characters')
        .select('id, user_id, data, deleted_at')
        .not('deleted_at', 'is', null)
        .lt('deleted_at', cutoffIso);

      if (fallbackError) {
        console.error('❌ Error:', fallbackError);
        return;
      }

      if (!fallback || fallback.length === 0) {
        console.log(`✅ No hay personajes soft-deleted > ${daysOld} días para limpiar`);
        return;
      }

      console.log(`📊 Encontrados ${fallback.length} personajes para purgar:\n`);

      // Estimar tamaño
      let totalSize = 0;
      fallback.forEach((char, idx) => {
        const sizeEst = JSON.stringify(char.data).length / 1024;
        totalSize += sizeEst;
        console.log(`   ${idx + 1}. ID: ${char.id.substring(0, 8)}...`);
        console.log(`      Usuario: ${char.user_id}`);
        console.log(`      Eliminado: ${new Date(char.deleted_at).toLocaleDateString()}`);
        console.log(`      Tamaño estimado: ${sizeEst.toFixed(2)} KB\n`);
      });

      console.log(`📈 TOTAL A LIBERAR: ${totalSize.toFixed(2)} KB`);

      // 2️⃣ PURGAR
      console.log(`\n2️⃣  Purgando ${fallback.length} registros...\n`);

      for (const char of fallback) {
        const { error: delError } = await supabase
          .from('characters')
          .delete()
          .eq('id', char.id);

        if (delError) {
          console.error(`❌ Error borrando ${char.id}:`, delError);
        } else {
          console.log(`✅ Purgado: ${char.id.substring(0, 8)}...`);
        }
      }

      console.log(`\n${fallback.length} registros purgados exitosamente`);
      console.log(`💾 Espacio liberado: ~${totalSize.toFixed(2)} KB`);
      return;
    }

    if (!toDelete || toDelete.length === 0) {
      console.log(`✅ No hay personajes soft-deleted > ${daysOld} días para limpiar`);
      return;
    }

    // Calcular tamaño total
    let totalSizeKb = 0;
    console.log(`📊 Encontrados ${toDelete.length} personajes para purgar:\n`);

    toDelete.forEach((char, idx) => {
      const sizeKb = (JSON.stringify(char.data).length / 1024);
      totalSizeKb += sizeKb;
      console.log(`   ${idx + 1}. ID: ${char.id.substring(0, 8)}...`);
      console.log(`      Usuario: ${char.user_id}`);
      console.log(`      Eliminado: ${new Date(char.deleted_at).toLocaleDateString()}`);
      console.log(`      Tamaño: ${sizeKb.toFixed(2)} KB\n`);
    });

    console.log(`📈 TOTAL A LIBERAR: ${totalSizeKb.toFixed(2)} KB (${(totalSizeKb / 1024).toFixed(2)} MB)`);

    // 2️⃣ PURGAR
    console.log(`\n2️⃣  Purgando ${toDelete.length} registros...\n`);

    let deletedCount = 0;
    for (const char of toDelete) {
      const { error: delError } = await supabase
        .from('characters')
        .delete()
        .eq('id', char.id);

      if (delError) {
        console.error(`❌ Error borrando ${char.id}:`, delError);
      } else {
        console.log(`✅ Purgado: ${char.id.substring(0, 8)}...`);
        deletedCount++;
      }
    }

    // 3️⃣ RESUMEN
    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ LIMPIEZA COMPLETADA');
    console.log('='.repeat(60));
    console.log(`Registros purgados: ${deletedCount}/${toDelete.length}`);
    console.log(`Espacio liberado: ${totalSizeKb.toFixed(2)} KB (${(totalSizeKb / 1024).toFixed(2)} MB)`);
    console.log(`Criterio: deleted_at < ${daysOld} días (antes de ${cutoffDate.toLocaleDateString()})`);
    console.log('\n💡 Recomendación: Ejecuta nuevamente en 30 días para mantener limpio el storage');

  } catch (e) {
    console.error('❌ Error inesperado:', e);
  }
}

main();
