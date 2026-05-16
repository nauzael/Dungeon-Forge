#!/usr/bin/env node
/**
 * 🧹 LIMPIAR BUCKET UPDATES
 * 
 * Elimina archivos OTA antiguos del bucket "updates"
 * para liberar espacio en Supabase free tier
 * 
 * USO:
 * node scripts/cleanup-updates-bucket.mjs [keep-last=5]
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usnlhzkpukkuwbtortil.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbmxoemtwdWtrdXdidG9ydGlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM2ODQ3NywiZXhwIjoyMDg5OTQ0NDc3fQ.QNSwwJ10U4UDiQiYQBci7GUxYM15w14vGgKqJnWvhJw';

const supabase = createClient(supabaseUrl, serviceRoleKey);
const keepLast = parseInt(process.argv[2] || '5', 10);

console.log(`
╔════════════════════════════════════════════════════════════╗
║     🧹 LIMPIAR BUCKET UPDATES (OTA Files)                ║
║     Mantener últimas ${keepLast} versiones, eliminar el resto          ║
╚════════════════════════════════════════════════════════════╝
`);

async function main() {
  try {
    // 1️⃣ LISTAR ARCHIVOS EN UPDATES
    console.log('\n1️⃣  Listando archivos en bucket "updates"...\n');

    const { data: files, error: listError } = await supabase
      .storage
      .from('updates')
      .list('', { limit: 10000 });

    if (listError) {
      console.error('❌ Error listando archivos:', listError);
      return;
    }

    if (!files || files.length === 0) {
      console.log('✅ El bucket está vacío');
      return;
    }

    console.log(`📊 Total archivos: ${files.length}\n`);

    // Ordenar por fecha más reciente
    const sortedFiles = files
      .filter(f => !f.name.startsWith('.'))
      .sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
        const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
        return dateB - dateA;
      });

    // Analizar
    let totalSize = 0;
    let toDeleteSize = 0;
    const toDelete = [];

    console.log('   Archivo                              │ Tamaño    │ Fecha       │ Acción');
    console.log('   ' + '─'.repeat(75));

    for (let i = 0; i < sortedFiles.length; i++) {
      const file = sortedFiles[i];
      const sizeKb = (file.metadata?.size || 0) / 1024;
      const sizeMb = sizeKb / 1024;
      totalSize += (file.metadata?.size || 0);

      const fileDate = new Date(file.updated_at || file.created_at || 0)
        .toLocaleDateString('es-ES');
      
      const action = i < keepLast ? '✅ KEEP' : '❌ DELETE';
      
      if (i >= keepLast) {
        toDelete.push(file.name);
        toDeleteSize += (file.metadata?.size || 0);
      }

      const displaySize = sizeMb > 1 ? `${sizeMb.toFixed(2)} MB` : `${sizeKb.toFixed(0)} KB`;
      const fileName = file.name.substring(0, 35).padEnd(35);
      
      console.log(`   ${fileName} │ ${displaySize.padEnd(9)} │ ${fileDate} │ ${action}`);
    }

    console.log('\n   ' + '─'.repeat(75));
    console.log(`   TOTAL: ${(totalSize / (1024 * 1024)).toFixed(2)} MB (${files.length} archivos)`);
    console.log(`   A ELIMINAR: ${(toDeleteSize / (1024 * 1024)).toFixed(2)} MB (${toDelete.length} archivos)`);
    console.log(`   SERÁ RETENIDO: ${(keepLast)} archivos más recientes`);
    console.log(`   ESPACIO A LIBERAR: ${(toDeleteSize / (1024 * 1024)).toFixed(2)} MB\n`);

    if (toDelete.length === 0) {
      console.log('✅ No hay archivos para eliminar');
      return;
    }

    // 2️⃣ CONFIRMAR Y ELIMINAR
    console.log('2️⃣  Eliminando archivos...\n');

    let deletedCount = 0;
    let deletedSize = 0;

    for (const fileName of toDelete) {
      const { error: deleteError } = await supabase
        .storage
        .from('updates')
        .remove([fileName]);

      if (deleteError) {
        console.error(`❌ Error eliminando ${fileName}:`, deleteError);
      } else {
        const file = sortedFiles.find(f => f.name === fileName);
        const sizeKb = (file?.metadata?.size || 0) / 1024;
        const sizeMb = sizeKb / 1024;
        deletedSize += (file?.metadata?.size || 0);
        
        console.log(`✅ ${fileName} (${sizeMb > 1 ? sizeMb.toFixed(2) + ' MB' : sizeKb.toFixed(0) + ' KB'})`);
        deletedCount++;
      }
    }

    // 3️⃣ VERIFICAR RESULTADO
    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ LIMPIEZA COMPLETADA');
    console.log('='.repeat(60));
    console.log(`
   Archivos eliminados: ${deletedCount}/${toDelete.length}
   Espacio liberado: ${(deletedSize / (1024 * 1024)).toFixed(2)} MB
   Archivos retenidos: ${keepLast} (últimas versiones)

   💾 Nuevo estado del bucket:
   └─ Archivos: ${sortedFiles.length - deletedCount}
   └─ Tamaño: ${((totalSize - deletedSize) / (1024 * 1024)).toFixed(2)} MB


   🎯 CUOTA SUPABASE FREE:
   ├─ Límite: 500 MB
   ├─ Antes: ${(totalSize / (1024 * 1024)).toFixed(2)} MB (+644 MB OVER!)
   ├─ Después: ${((totalSize - deletedSize) / (1024 * 1024)).toFixed(2)} MB
   └─ Disponible: ${(500 - (totalSize - deletedSize) / (1024 * 1024)).toFixed(2)} MB

   ✨ Tu app sigue siendo actualizable - Los últimos ${keepLast} builds están guardados
`);

  } catch (e) {
    console.error('❌ Error inesperado:', e.message);
  }
}

main();
