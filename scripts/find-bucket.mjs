#!/usr/bin/env node
/**
 * Encontrar buckets disponibles en Firebase Storage
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const serviceAccountPath = path.join(projectRoot, 'dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json');

console.log('🔍 Buscando buckets en Firebase Storage...\n');

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const storage = admin.storage();

async function findBuckets() {
  try {
    // Listar todos los buckets
    const [buckets] = await admin.app().storage().bucket().getMetadata();
    
    console.log('Buckets encontrados:');
    console.log('  - ', buckets);
    
  } catch (error) {
    console.log('⚠️  No se pudieron listar buckets con ese método');
    console.log('\n📝 Buckets probables:');
    console.log('  1. gs://dungeon-forge-prod.appspot.com');
    console.log('  2. gs://dungeon-forge-prod.firebasestorage.app');
    console.log('  3. gs://dungeon-forge-prod (solo nombre)');
    
    // Intentar uno por uno
    await testBucketUrls();
  }
}

async function testBucketUrls() {
  const urls = [
    'dungeon-forge-prod.appspot.com',
    'dungeon-forge-prod.firebasestorage.app',
    'dungeon-forge-prod'
  ];
  
  console.log('\n⏳ Probando URLs...\n');
  
  for (const url of urls) {
    try {
      console.log(`🧪 Probando: gs://${url}`);
      const bucket = admin.storage().bucket(url);
      const [exists] = await bucket.exists();
      
      if (exists) {
        console.log(`✅ ENCONTRADO! El bucket es: gs://${url}`);
        console.log(`\n📝 Usa este comando para configurar CORS:`);
        console.log(`   gsutil -m cors set cors-config.json gs://${url}`);
        return;
      }
    } catch (error) {
      console.log(`   ❌ No encontrado`);
    }
  }
  
  console.log('\n❌ Ningún bucket encontrado');
  console.log('\n💡 Alternativas:');
  console.log('1. Ir a: https://console.firebase.google.com/project/dungeon-forge-prod/storage/buckets');
  console.log('2. Verificar el nombre exacto del bucket');
  console.log('3. Luego usar: gsutil -m cors set cors-config.json gs://NOMBRE_EXACTO');
}

findBuckets().catch(error => {
  console.error('Error:', error.message);
});
