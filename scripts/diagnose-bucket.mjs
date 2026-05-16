#!/usr/bin/env node

/**
 * Diagnóstico: Verificar permisos y configuración de bucket
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://usnlhzkpukkuwbtortil.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbGhoemtwdWtrdXdidG9ydGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjg0NzcsImV4cCI6MjA4OTk0NDQ3N30.EQmHpS5esPhdi_Cd9OtYusMs58r9J4GG-0j5JC5riqc';

if (!SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_KEY no encontrada');
  process.exit(1);
}

console.log('🔍 Diagnóstico de bucket updates\n');

async function diagnose() {
  // Test with service key
  const supabaseService = createClient(SUPABASE_URL, SERVICE_KEY);
  
  console.log('📋 1. Intentando listar bucket "updates" con SERVICE_KEY...');
  const { data: buckets, error: listError } = await supabaseService
    .storage
    .listBuckets();

  if (listError) {
    console.error('   ❌ Error:', listError.message);
  } else {
    console.log('   ✅ Buckets encontrados:');
    const updatesBucket = buckets?.find(b => b.name === 'updates');
    if (updatesBucket) {
      console.log(`   ✅ Bucket "updates" EXISTE`);
      console.log(`      - ID: ${updatesBucket.id}`);
      console.log(`      - Public: ${updatesBucket.public}`);
    } else {
      console.log('   ❌ Bucket "updates" NO EXISTE');
      console.log('   Buckets disponibles:', buckets?.map(b => b.name).join(', '));
    }
  }

  // Test upload with service key
  console.log('\n📋 2. Intentando subir archivo test con SERVICE_KEY...');
  const testFile = Buffer.from('test');
  const { error: uploadError } = await supabaseService
    .storage
    .from('updates')
    .upload('test-file.txt', testFile, {
      upsert: true,
      contentType: 'text/plain'
    });

  if (uploadError) {
    console.error('   ❌ Upload error:', uploadError.message);
    console.error('   Code:', uploadError.code);
  } else {
    console.log('   ✅ Upload exitoso');
    
    // Intentar borrar el archivo de test
    const { error: deleteError } = await supabaseService
      .storage
      .from('updates')
      .remove(['test-file.txt']);
    
    if (deleteError) {
      console.log('   ⚠️  No se pudo borrar archivo de test:', deleteError.message);
    } else {
      console.log('   ✅ Archivo de test borrado');
    }
  }

  // Test with anon key for comparison
  console.log('\n📋 3. Comparación con ANON_KEY...');
  const supabaseAnon = createClient(SUPABASE_URL, ANON_KEY);
  
  const { error: anonError } = await supabaseAnon
    .storage
    .from('updates')
    .list();

  if (anonError) {
    console.error('   ❌ Error con ANON_KEY:', anonError.message);
  } else {
    console.log('   ✅ ANON_KEY puede listar');
  }
}

diagnose().catch(err => {
  console.error('❌ Error fatal:', err.message);
  process.exit(1);
});
