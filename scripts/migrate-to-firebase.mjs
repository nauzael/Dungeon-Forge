#!/usr/bin/env node
/**
 * ============================================================
 * MIGRACIÓN: Supabase → Firebase Firestore
 * ============================================================
 *
 * REQUISITOS:
 *   1. Supabase Service Role Key (NO la anon key — necesitas bypass de RLS)
 *      → Supabase Dashboard → Project Settings → API → service_role
 *
 *   2. Firebase Service Account JSON
 *      → Firebase Console → Configuración del proyecto → Cuentas de servicio
 *      → "Generar nueva clave privada" → guarda como service-account.json
 *
 * USO:
 *   # Modo 1: Un solo usuario (todos los personajes van a tu Firebase UID)
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_KEY=eyJhbGci... \
 *   FIREBASE_SERVICE_ACCOUNT=./service-account.json \
 *   FIREBASE_USER_ID=tu-firebase-uid \
 *   node scripts/migrate-to-firebase.mjs
 *
 *   # Modo 2: Multi-usuario (mapea por email automáticamente)
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_KEY=eyJhbGci... \
 *   FIREBASE_SERVICE_ACCOUNT=./service-account.json \
 *   node scripts/migrate-to-firebase.mjs
 *
 *   # Dry-run (solo lee, no escribe en Firestore)
 *   DRY_RUN=true SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/migrate-to-firebase.mjs
 *
 * VARIABLES DE ENTORNO:
 *   SUPABASE_URL             URL del proyecto Supabase (requerido)
 *   SUPABASE_SERVICE_KEY     Service role key de Supabase (requerido)
 *   FIREBASE_SERVICE_ACCOUNT Ruta al service-account.json (default: ./service-account.json)
 *   FIREBASE_USER_ID         UID de Firebase del usuario destino (modo 1: un usuario)
 *   DRY_RUN                  Si es "true", solo lee y muestra datos, no escribe
 *   INCLUDE_DELETED          Si es "true", migra también personajes con deleted_at
 * ============================================================
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';

// ──────────────────────────────────────────────
// Configuración desde variables de entorno
// ──────────────────────────────────────────────
const SUPABASE_URL          = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY;
const SERVICE_ACCOUNT_PATH  = process.env.FIREBASE_SERVICE_ACCOUNT || './service-account.json';
const FIREBASE_USER_ID      = process.env.FIREBASE_USER_ID;
const DRY_RUN               = process.env.DRY_RUN === 'true';
const INCLUDE_DELETED       = process.env.INCLUDE_DELETED === 'true';

const PAGE_SIZE  = 1000;
const BATCH_SIZE = 400; // Firestore límite de batch es 500, usamos 400 por seguridad

// ──────────────────────────────────────────────
// Validación inicial
// ──────────────────────────────────────────────
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('\n❌ Faltan credenciales de Supabase.');
  console.error('   Provee: SUPABASE_URL y SUPABASE_SERVICE_KEY\n');
  process.exit(1);
}

if (!DRY_RUN && !existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error(`\n❌ No se encontró el service account de Firebase en: ${SERVICE_ACCOUNT_PATH}`);
  console.error('   Descárgalo desde: Firebase Console → Configuración del proyecto → Cuentas de servicio');
  console.error('   O corre con DRY_RUN=true para solo ver qué se migraría.\n');
  process.exit(1);
}

// ──────────────────────────────────────────────
// Inicializar Supabase (service role → bypass RLS)
// ──────────────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ──────────────────────────────────────────────
// Inicializar Firebase Admin (solo si no es dry-run)
// ──────────────────────────────────────────────
let db = null;
let adminFirestore = null;

if (!DRY_RUN) {
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
  } catch (e) {
    console.error(`\n❌ No se pudo leer ${SERVICE_ACCOUNT_PATH}: ${e.message}\n`);
    process.exit(1);
  }

  // Importación dinámica para evitar error si no está instalado
  try {
    const { default: admin } = await import('firebase-admin');
    adminFirestore = admin;

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    db = admin.firestore();
    console.log('✅ Firebase Admin inicializado\n');
  } catch (e) {
    console.error('\n❌ No se pudo cargar firebase-admin.');
    console.error('   Instálalo con: npm install -D firebase-admin');
    console.error('   O corre con DRY_RUN=true para solo ver qué se migraría.\n');
    process.exit(1);
  }
}

// ──────────────────────────────────────────────
// Leer todos los personajes de Supabase
// ──────────────────────────────────────────────
async function readSupabaseCharacters() {
  console.log('📖 Leyendo personajes de Supabase...');

  let allCharacters = [];
  let page = 0;

  while (true) {
    let query = supabase
      .from('characters')
      .select('id, user_id, data, party_id, updated_at, deleted_at')
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (!INCLUDE_DELETED) {
      query = query.is('deleted_at', null);
    }

    const { data, error } = await query;

    if (error) {
      console.error('\n❌ Error leyendo de Supabase:', error.message);
      if (error.message.includes('permission') || error.message.includes('policy')) {
        console.error('   Asegúrate de usar la SERVICE ROLE KEY, no la anon key.\n');
      }
      process.exit(1);
    }

    if (!data || data.length === 0) break;

    allCharacters = allCharacters.concat(data);
    console.log(`   Página ${page + 1}: ${data.length} personajes`);

    if (data.length < PAGE_SIZE) break;
    page++;
  }

  return allCharacters;
}

// ──────────────────────────────────────────────
// Construir mapeo Supabase UID → Firebase UID
// ──────────────────────────────────────────────
async function buildUserMapping(characters) {
  const supabaseUids = [...new Set(characters.map(c => c.user_id))];

  if (FIREBASE_USER_ID) {
    // Modo 1: Un solo usuario — todos los personajes van a este Firebase UID
    console.log(`👤 Modo un usuario: ${supabaseUids.length} UID(s) de Supabase → Firebase UID: ${FIREBASE_USER_ID}`);
    const mapping = {};
    supabaseUids.forEach(uid => { mapping[uid] = FIREBASE_USER_ID; });
    return mapping;
  }

  // Modo 2: Multi-usuario — intentar mapear por email
  console.log(`👥 Modo multi-usuario: mapeando ${supabaseUids.length} usuario(s) por email...`);
  const mapping = {};

  for (const supabaseUid of supabaseUids) {
    try {
      // Obtener email del usuario en Supabase Auth Admin
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(supabaseUid);

      if (userError || !userData?.user?.email) {
        console.warn(`  ⚠️  No se encontró email para Supabase UID ${supabaseUid} — sus personajes serán omitidos`);
        continue;
      }

      const email = userData.user.email;

      if (DRY_RUN) {
        console.log(`  ℹ️  ${email} (Supabase: ${supabaseUid}) → [dry-run, no se busca en Firebase]`);
        mapping[supabaseUid] = `dry-run-uid-for-${email}`;
        continue;
      }

      // Buscar usuario en Firebase por email
      try {
        const firebaseUser = await adminFirestore.auth().getUserByEmail(email);
        mapping[supabaseUid] = firebaseUser.uid;
        console.log(`  ✅ ${email}: ${supabaseUid} → ${firebaseUser.uid}`);
      } catch (e) {
        console.warn(`  ⚠️  No existe usuario Firebase con email ${email} — creando cuenta automáticamente...`);
        try {
          const newUser = await adminFirestore.auth().createUser({
            email: email,
            emailVerified: true,
          });
          mapping[supabaseUid] = newUser.uid;
          console.log(`  ➕ Creado nuevo usuario Firebase para ${email}: ${supabaseUid} → ${newUser.uid}`);
        } catch (createErr) {
          console.error(`  ❌ Error creando usuario Firebase para ${email}: ${createErr.message}`);
        }
      }
    } catch (e) {
      console.warn(`  ⚠️  Error procesando UID ${supabaseUid}: ${e.message}`);
    }
  }

  return mapping;
}

// ──────────────────────────────────────────────
// Escribir personajes en Firestore
// ──────────────────────────────────────────────
async function writeToFirestore(characters, userMapping) {
  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN — Personajes que se migrarían:\n');
    let count = 0;
    for (const char of characters) {
      const firebaseUid = userMapping[char.user_id];
      if (!firebaseUid) continue;
      const charData = typeof char.data === 'string' ? JSON.parse(char.data) : char.data;
      console.log(`  • "${charData?.name || char.id}" (${charData?.class || '?'} nivel ${charData?.level || '?'}) → Firebase UID: ${firebaseUid}`);
      count++;
    }
    console.log(`\n  Total a migrar: ${count} personajes`);
    return { migrated: count, skipped: characters.length - count, errors: 0 };
  }

  let migrated = 0;
  let skipped  = 0;
  let errors   = 0;

  let batch      = db.batch();
  let batchCount = 0;

  for (const char of characters) {
    const firebaseUid = userMapping[char.user_id];

    if (!firebaseUid) {
      const charName = (typeof char.data === 'object' ? char.data?.name : JSON.parse(char.data || '{}')?.name) || char.id;
      console.warn(`  ⚠️  Omitiendo "${charName}" — sin mapeo de usuario`);
      skipped++;
      continue;
    }

    try {
      const charData = typeof char.data === 'string' ? JSON.parse(char.data) : char.data;

      // Si tiene una imagen base64 demasiado grande, la removemos para no superar el límite de Firestore (1MB)
      if (charData && typeof charData.imageUrl === 'string' && charData.imageUrl.startsWith('data:') && charData.imageUrl.length > 200 * 1024) {
        console.warn(`  ⚠️  Removiendo imageUrl base64 gigante de "${charData.name || char.id}" (${(charData.imageUrl.length / 1024 / 1024).toFixed(2)} MB) para cumplir el límite de Firestore`);
        charData.imageUrl = null;
      }

      const docRef = db.collection('characters').doc(char.id);
      batch.set(docRef, {
        id: char.id,
        user_id: firebaseUid,
        data: charData,
        party_id: char.party_id || null,
        updated_at: adminFirestore.firestore.Timestamp.fromDate(new Date(char.updated_at || Date.now())),
        deleted_at: char.deleted_at ? adminFirestore.firestore.Timestamp.fromDate(new Date(char.deleted_at)) : null,
      }, { merge: true });

      batchCount++;

      if (batchCount >= BATCH_SIZE) {
        await batch.commit();
        migrated += batchCount;
        console.log(`  💾 Lote de ${batchCount} personajes guardado en Firestore`);
        batch      = db.batch();
        batchCount = 0;
      }
    } catch (e) {
      console.error(`  ❌ Error procesando personaje ${char.id}: ${e.message}`);
      errors++;
    }
  }

  // Commit del lote final
  if (batchCount > 0) {
    await batch.commit();
    migrated += batchCount;
    console.log(`  💾 Lote final de ${batchCount} personajes guardado`);
  }

  return { migrated, skipped, errors };
}

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────
async function main() {
  const mode = DRY_RUN ? '(DRY RUN — no se escribirá nada)' : '';
  console.log(`\n🚀 Migración Supabase → Firebase Firestore ${mode}\n${'─'.repeat(50)}\n`);

  // 1. Leer de Supabase
  const characters = await readSupabaseCharacters();
  console.log(`\n✅ Total leídos: ${characters.length} personajes\n`);

  if (characters.length === 0) {
    console.log('No hay personajes para migrar. Saliendo.');
    return;
  }

  // 2. Mapeo de usuarios
  const userMapping = await buildUserMapping(characters);

  const mappedCount = Object.keys(userMapping).length;
  if (mappedCount === 0) {
    console.error('\n❌ No se pudo mapear ningún usuario. Abortando.');
    console.error('   Usa FIREBASE_USER_ID=tu-uid para el modo un usuario.');
    process.exit(1);
  }

  // 3. Escribir en Firestore
  console.log('\n📤 Escribiendo en Firebase Firestore...');
  const { migrated, skipped, errors } = await writeToFirestore(characters, userMapping);

  // 4. Resumen
  console.log('\n' + '─'.repeat(50));
  console.log('📊 Resumen de migración:');
  console.log(`   ✅ Migrados:  ${migrated}`);
  console.log(`   ⏭️  Omitidos:  ${skipped}`);
  console.log(`   ❌ Errores:   ${errors}`);

  if (!DRY_RUN && migrated > 0) {
    console.log('\n🎉 ¡Migración completada! Verifica los datos en:');
    console.log('   https://console.firebase.google.com/project/dungeon-forge-prod/firestore/data/characters\n');
  }
}

main().catch(e => {
  console.error('\n❌ Error fatal:', e.message || e);
  process.exit(1);
});
