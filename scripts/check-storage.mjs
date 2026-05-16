#!/usr/bin/env node

/**
 * Verificar tamaño total del storage en Supabase
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usnlhzkpukkuwbtortil.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbGhoemtwdWtrdXdidG9ydGlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM2ODQ3NywiZXhwIjoyMDg5OTQ0NDc3fQ.QNSwwJ10U4UDiQiYQBci7GUxYM15w14vGgKqJnWvhJw';

const supabase = createClient(supabaseUrl, serviceKey);

async function checkStorage() {
  console.log('\n🔍 Verificando almacenamiento en Supabase...\n');

  try {
    // Obtener lista de buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error('❌ Error listando buckets:', bucketsError);
      return;
    }

    let totalSize = 0;

    console.log('📦 BUCKETS:\n');
    for (const bucket of buckets || []) {
      const { data: files, error: listError } = await supabase
        .storage
        .from(bucket.name)
        .list('', { limit: 10000 });

      if (listError) {
        console.log(`⚠️  ${bucket.name}: Error listando (${listError.message})`);
        continue;
      }

      let bucketSize = 0;
      for (const file of files || []) {
        bucketSize += file.metadata?.size || 0;
      }

      totalSize += bucketSize;

      const sizeMb = bucketSize / (1024 * 1024);
      const fileCount = (files || []).length;

      console.log(`   ${bucket.name.padEnd(20)} │ ${sizeMb.toFixed(2)} MB │ ${fileCount} archivos`);

      // Mostrar detalles de bucket "updates"
      if (bucket.name === 'updates' && files && files.length > 0) {
        console.log('   ├─ Archivos en "updates":');
        files
          .filter(f => !f.name.startsWith('.'))
          .sort((a, b) => (b.metadata?.size || 0) - (a.metadata?.size || 0))
          .slice(0, 10)
          .forEach((file, idx) => {
            const fileSizeMb = (file.metadata?.size || 0) / (1024 * 1024);
            const date = new Date(file.updated_at || file.created_at || 0).toLocaleDateString('es-ES');
            console.log(`   │  ${idx + 1}. ${file.name.substring(0, 40).padEnd(40)} │ ${fileSizeMb.toFixed(2)} MB │ ${date}`);
          });
      }
    }

    console.log('\n' + '─'.repeat(80));
    console.log(`📊 TOTAL STORAGE: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`📈 Límite Free Tier: 1000 MB`);
    const usage = (totalSize / (1024 * 1024 * 10)).toFixed(1);
    console.log(`💾 Uso: ${usage}% (${(totalSize / (1024 * 1024)).toFixed(2)} / 1000 MB)\n`);

    if ((totalSize / (1024 * 1024)) > 900) {
      console.log('⚠️  ¡ALERTA! El almacenamiento está casi lleno.');
      console.log('   Ejecuta: node scripts/cleanup-updates-bucket.mjs 3\n');
    }

  } catch (err) {
    console.error('❌ Error:', err instanceof Error ? err.message : err);
  }
}

checkStorage();
