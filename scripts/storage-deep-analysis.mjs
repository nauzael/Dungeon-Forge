#!/usr/bin/env node
/**
 * 🔍 DIAGNÓSTICO PROFUNDO - Storage Size Analysis
 * 
 * Analiza TODAS las tablas y buckets para identificar
 * exactamente qué está consumiendo espacio en Supabase
 * 
 * USO:
 * node scripts/storage-deep-analysis.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usnlhzkpukkuwbtortil.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbmxoemtwdWtrdXdidG9ydGlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM2ODQ3NywiZXhwIjoyMDg5OTQ0NDc3fQ.QNSwwJ10U4UDiQiYQBci7GUxYM15w14vGgKqJnWvhJw';

const supabase = createClient(supabaseUrl, serviceRoleKey);

console.log(`
╔════════════════════════════════════════════════════════════╗
║     🔍 ANÁLISIS PROFUNDO - Storage Size Breakdown         ║
║     Identificando qué consume espacio en Supabase          ║
╚════════════════════════════════════════════════════════════╝
`);

async function analyzeTableSize(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`   ❌ ${tableName}: ${error.message}`);
      return null;
    }

    // Ahora obtener todos los datos para calcular tamaño
    const { data: fullData, error: fullError } = await supabase
      .from(tableName)
      .select('*');

    if (fullError || !fullData) {
      console.log(`   ⚠️  ${tableName}: No se puede leer datos completos`);
      return null;
    }

    const sizeBytes = JSON.stringify(fullData).length;
    const sizeKb = sizeBytes / 1024;
    const sizeMb = sizeKb / 1024;

    return {
      tableName,
      rowCount: fullData.length,
      sizeBytes,
      sizeKb,
      sizeMb,
      avgRowSize: sizeBytes / fullData.length,
    };
  } catch (e) {
    console.error(`   Error en ${tableName}:`, e.message);
    return null;
  }
}

async function analyzeStorageBucket(bucketName) {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .list('', { limit: 10000 });

    if (error) {
      console.log(`   ❌ Bucket ${bucketName}: ${error.message}`);
      return null;
    }

    if (!data || data.length === 0) {
      return { bucketName, fileCount: 0, totalSize: 0 };
    }

    let totalSize = 0;
    for (const file of data) {
      if (file.metadata && file.metadata.size) {
        totalSize += file.metadata.size;
      }
    }

    return {
      bucketName,
      fileCount: data.length,
      totalSize,
      totalSizeKb: totalSize / 1024,
      totalSizeMb: totalSize / (1024 * 1024),
    };
  } catch (e) {
    console.log(`   ⚠️  Bucket ${bucketName} no accesible: ${e.message}`);
    return null;
  }
}

async function main() {
  try {
    // 1️⃣ ANALIZAR TABLAS
    console.log('\n1️⃣  ANÁLISIS DE TABLAS\n');

    const tables = ['characters', 'parties', 'auth.users', 'storage.objects'];
    const tableSizes = [];

    for (const tableName of tables) {
      process.stdout.write(`   Analizando ${tableName}... `);
      const result = await analyzeTableSize(tableName);
      if (result) {
        tableSizes.push(result);
        console.log(`✅ ${result.rowCount} filas, ${result.sizeMb.toFixed(2)} MB`);
      }
    }

    console.log('\n📊 RESUMEN DE TABLAS:\n');
    let totalTableSize = 0;
    tableSizes.sort((a, b) => b.sizeMb - a.sizeMb);

    for (const table of tableSizes) {
      totalTableSize += table.sizeMb;
      const bar = '█'.repeat(Math.ceil(table.sizeMb / 0.5));
      console.log(`   ${table.tableName.padEnd(20)} │ ${bar} ${table.sizeMb.toFixed(2)} MB (${table.rowCount} filas)`);
      console.log(`   ${' '.repeat(20)} └─ Promedio por fila: ${(table.avgRowSize / 1024).toFixed(2)} KB`);
    }

    console.log(`\n   📈 TOTAL TABLAS: ${totalTableSize.toFixed(2)} MB\n`);

    // 2️⃣ ANALIZAR STORAGE BUCKETS
    console.log('\n2️⃣  ANÁLISIS DE STORAGE BUCKETS\n');

    const buckets = ['characters', 'avatars', 'maps', 'campaign-resources', 'updates'];
    const bucketSizes = [];

    for (const bucketName of buckets) {
      process.stdout.write(`   Analizando bucket "${bucketName}"... `);
      const result = await analyzeStorageBucket(bucketName);
      if (result) {
        bucketSizes.push(result);
        if (result.fileCount > 0) {
          console.log(`✅ ${result.fileCount} archivos, ${result.totalSizeMb.toFixed(2)} MB`);
        } else {
          console.log(`ℹ️  Vacío`);
        }
      }
    }

    console.log('\n📊 RESUMEN DE STORAGE:\n');
    let totalStorageSize = 0;
    bucketSizes.sort((a, b) => (b.totalSizeMb || 0) - (a.totalSizeMb || 0));

    for (const bucket of bucketSizes) {
      if (bucket.totalSizeMb) {
        totalStorageSize += bucket.totalSizeMb;
        const bar = '█'.repeat(Math.ceil((bucket.totalSizeMb || 0) / 0.5));
        console.log(`   ${bucket.bucketName.padEnd(20)} │ ${bar} ${(bucket.totalSizeMb || 0).toFixed(2)} MB (${bucket.fileCount} archivos)`);
      } else {
        console.log(`   ${bucket.bucketName.padEnd(20)} │ (vacío)`);
      }
    }

    console.log(`\n   📈 TOTAL STORAGE: ${totalStorageSize.toFixed(2)} MB\n`);

    // 3️⃣ DESGLOSE DETALLADO POR USUARIO (CHARACTERS)
    console.log('\n3️⃣  DESGLOSE POR USUARIO (Characters)\n');

    const { data: characters, error: charError } = await supabase
      .from('characters')
      .select('user_id, data, deleted_at');

    if (!charError && characters) {
      const byUser = new Map();

      for (const char of characters) {
        if (!byUser.has(char.user_id)) {
          byUser.set(char.user_id, { total: 0, active: 0, deleted: 0, size: 0 });
        }

        const stats = byUser.get(char.user_id);
        stats.total++;
        if (char.deleted_at) {
          stats.deleted++;
        } else {
          stats.active++;
        }
        stats.size += JSON.stringify(char.data).length;
      }

      const userStats = Array.from(byUser.entries())
        .map(([userId, stats]) => ({
          userId: userId.substring(0, 8) + '...',
          ...stats,
          sizeMb: stats.size / (1024 * 1024),
        }))
        .sort((a, b) => b.sizeMb - a.sizeMb);

      console.log('   Usuario        │ Total │ Activos │ Eliminados │ Tamaño');
      console.log('   ' + '─'.repeat(56));
      for (const user of userStats.slice(0, 10)) {
        console.log(`   ${user.userId.padEnd(14)} │ ${String(user.total).padEnd(5)} │ ${String(user.active).padEnd(7)} │ ${String(user.deleted).padEnd(10)} │ ${user.sizeMb.toFixed(2)} MB`);
      }

      if (userStats.length > 10) {
        console.log(`   ... y ${userStats.length - 10} más usuarios`);
      }
    }

    // 4️⃣ ANÁLISIS DE SOFT-DELETED
    console.log('\n4️⃣  ANÁLISIS DE SOFT-DELETED (Personajes Eliminados)\n');

    if (!charError && characters) {
      const softDeleted = characters.filter(c => c.deleted_at);
      const softDeletedSize = softDeleted.reduce((sum, c) => sum + JSON.stringify(c.data).length, 0);

      console.log(`   Total soft-deleted: ${softDeleted.length} personajes`);
      console.log(`   Espacio ocupado: ${(softDeletedSize / (1024 * 1024)).toFixed(2)} MB`);
      console.log(`   Porcentaje del total: ${((softDeletedSize / (characters.reduce((sum, c) => sum + JSON.stringify(c.data).length, 0))) * 100).toFixed(2)}%`);
      console.log(`\n   💡 Recomendación: Ejecutar limpieza de soft-deleted >30 días`);
      console.log(`      $ node scripts/cleanup-storage.mjs <URL> <KEY> 30`);
    }

    // 5️⃣ RESUMEN FINAL
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN GENERAL');
    console.log('='.repeat(60));

    const totalUsage = totalTableSize + totalStorageSize;
    const quotaFree = 500; // MB
    const percentageUsed = (totalUsage / quotaFree) * 100;

    console.log(`
   📈 Total Usado: ${totalUsage.toFixed(2)} MB
   └─ Tablas: ${totalTableSize.toFixed(2)} MB (${((totalTableSize / totalUsage) * 100).toFixed(1)}%)
   └─ Storage: ${totalStorageSize.toFixed(2)} MB (${((totalStorageSize / totalUsage) * 100).toFixed(1)}%)

   ⚠️  Cuota Free Supabase: ${quotaFree} MB
   📊 Porcentaje usado: ${percentageUsed.toFixed(1)}%
   🔴 Espacio disponible: ${(quotaFree - totalUsage).toFixed(2)} MB

   Estado:
   ${percentageUsed > 90 ? '🚨 CRÍTICO - Almost full!' : percentageUsed > 75 ? '⚠️  WARNING - >75% used' : '✅ OK - Plenty of space'}
`);

    // 6️⃣ RECOMENDACIONES
    if (percentageUsed > 75) {
      console.log('💡 RECOMENDACIONES INMEDIATAS:\n');

      if (softDeleted && softDeleted.length > 0) {
        console.log(`   1. Purgar ${softDeleted.length} personajes soft-deleted (liberaría ${(softDeletedSize / (1024 * 1024)).toFixed(2)} MB)`);
        console.log(`      $ node scripts/cleanup-storage.mjs <URL> <KEY> 30\n`);
      }

      if (totalStorageSize > 1) {
        console.log(`   2. Revisar bucket de almacenamiento (${totalStorageSize.toFixed(2)} MB)`);
        console.log(`      └─ Eliminar imágenes/mapas no usados\n`);
      }

      console.log(`   3. Implementar política de retención:`);
      console.log(`      └─ Auto-purge de soft-deleted >30 días`);
      console.log(`      └─ Limitar tamaño de imágenes`);
      console.log(`      └─ Comprimir avatares\n`);
    }

  } catch (e) {
    console.error('❌ Error inesperado:', e);
  }
}

main();
