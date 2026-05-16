#!/usr/bin/env node
/**
 * Script para diagnosticar y recuperar personaje "Kaelen rompehielos"
 * 
 * USO:
 * node scripts/recover-character.mjs <SUPABASE_URL> <SUPABASE_SERVICE_ROLE_KEY>
 */

import { createClient } from '@supabase/supabase-js';

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('❌ Error: Falta la URL y/o la service role key de Supabase');
  console.error('\nUSO:');
  console.error('  node scripts/recover-character.mjs <SUPABASE_URL> <SERVICE_ROLE_KEY>');
  console.error('\nEjemplo:');
  console.error('  node scripts/recover-character.mjs "https://abc123.supabase.co" "sbp_xxx..."');
  process.exit(1);
}

const [supabaseUrl, serviceRoleKey] = args;

console.log('🔌 Conectando a Supabase...');
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  try {
    // 1️⃣ BUSCAR USUARIO
    console.log('\n1️⃣  Buscando usuario brothersen@gmail.com...');
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', 'brothersen@gmail.com');

    if (userError) {
      console.error('❌ Error buscando usuario:', userError);
      // Intenta tabla auth.users
      console.log('   Intentando tabla auth.users...');
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) {
        console.error('❌ Error:', authError);
        return;
      }
      const user = authUsers.users.find(u => u.email === 'brothersen@gmail.com');
      if (!user) {
        console.error('❌ Usuario no encontrado');
        return;
      }
      console.log(`✅ Usuario encontrado: ${user.email} (ID: ${user.id})`);
      await recoverCharacter(user.id);
      return;
    }

    if (!users || users.length === 0) {
      console.error('❌ Usuario no encontrado');
      return;
    }

    const userId = users[0].id;
    console.log(`✅ Usuario encontrado: brothersen@gmail.com (ID: ${userId})`);

    await recoverCharacter(userId);
  } catch (e) {
    console.error('❌ Error inesperado:', e);
    process.exit(1);
  }
}

async function recoverCharacter(userId) {
  try {
    // 2️⃣ BUSCAR PERSONAJE "KAELEN ROMPEHIELOS"
    console.log('\n2️⃣  Buscando personaje "Kaelen rompehielos"...');
    const { data: characters, error: charError } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', userId);

    if (charError) {
      console.error('❌ Error:', charError);
      return;
    }

    const kaelen = characters.find(c => 
      c.data?.name?.toLowerCase().includes('kaelen') ||
      c.data?.name?.toLowerCase().includes('rompehielos')
    );

    if (!kaelen) {
      console.error('❌ Personaje "Kaelen rompehielos" no encontrado');
      console.log('\n   Personajes de esta cuenta:');
      characters.forEach(c => {
        const status = c.deleted_at ? '❌ ELIMINADO' : '✅ ACTIVO';
        console.log(`   - ${c.data?.name} [${status}]`);
      });
      return;
    }

    console.log(`✅ Personaje encontrado: ${kaelen.data?.name}`);
    console.log(`   ID: ${kaelen.id}`);
    console.log(`   Clase: ${kaelen.data?.class}`);
    console.log(`   Estado: ${kaelen.deleted_at ? '❌ SOFT-DELETED' : '✅ ACTIVO'}`);
    console.log(`   Última actualización: ${kaelen.updated_at}`);
    console.log(`   Creado: ${kaelen.created_at}`);

    // 3️⃣ SI ESTÁ ELIMINADO, RESTAURAR
    if (kaelen.deleted_at) {
      console.log('\n3️⃣  🔄 Restaurando personaje...');
      const { data: restored, error: restoreError } = await supabase
        .from('characters')
        .update({
          deleted_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', kaelen.id)
        .select();

      if (restoreError) {
        console.error('❌ Error al restaurar:', restoreError);
        return;
      }

      console.log('✅ Personaje restaurado exitosamente!');
      console.log(`   Ahora está disponible en la cuenta de ${kaelen.data?.name}`);
    } else {
      console.log('\n3️⃣  ℹ️ El personaje NO está eliminado.');
      console.log('   Problema: El personaje existe pero podría haber un problema de sincronización.');
      console.log('\n   Posibles causas:');
      console.log('   - Error RLS bloqueando la lectura');
      console.log('   - Problema de caché del navegador');
      console.log('   - Cambio reciente en la lógica de filtrado');
      
      // Intentar un UPDATE para forzar sincronización
      console.log('\n4️⃣  🔄 Forzando actualización de timestamp...');
      const { data: updated, error: updateError } = await supabase
        .from('characters')
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq('id', kaelen.id)
        .select();

      if (updateError) {
        console.error('❌ Error:', updateError);
      } else {
        console.log('✅ Timestamp actualizado. Intenta recargar la app.');
      }
    }

    // 4️⃣ RESUMEN FINAL
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN');
    console.log('='.repeat(50));
    console.log(`Usuario: brothersen@gmail.com`);
    console.log(`Personaje: ${kaelen.data?.name}`);
    console.log(`Estado: ${kaelen.deleted_at ? '❌ RESTAURADO' : '✅ VERIFICADO'}`);
    console.log(`\n💡 PRÓXIMOS PASOS:`);
    console.log(`1. Recarga la app (Ctrl+R o cierra y abre)  `);
    console.log(`2. Inicia sesión con brothersen@gmail.com`);
    console.log(`3. El personaje debería aparecer en la lista`);
    
  } catch (e) {
    console.error('❌ Error inesperado:', e);
  }
}

main();
