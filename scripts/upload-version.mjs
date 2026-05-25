#!/usr/bin/env node
/**
 * Subir version.json a Firebase Storage
 * Uso: node scripts/upload-version.mjs
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const serviceAccountPath = path.join(projectRoot, 'dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json');
const versionFilePath = path.join(projectRoot, 'version.json');

console.log('📤 Subiendo version.json a Firebase Storage...\n');

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'dungeon-forge-prod.firebasestorage.app'
});

const bucket = admin.storage().bucket('dungeon-forge-prod.firebasestorage.app');

async function uploadVersion() {
  try {
    if (!fs.existsSync(versionFilePath)) {
      throw new Error(`Archivo no encontrado: ${versionFilePath}`);
    }

    console.log('✅ Archivo encontrado: version.json\n');
    console.log('📋 Contenido:');
    const versionContent = fs.readFileSync(versionFilePath, 'utf-8');
    console.log(versionContent);
    console.log();

    // Upload file
    console.log('⏳ Subiendo a gs://dungeon-forge-prod.firebasestorage.app/version.json\n');
    
    const uploadFile = await bucket.upload(versionFilePath, {
      destination: 'version.json',
      metadata: {
        contentType: 'application/json',
        cacheControl: 'public, max-age=300' // 5 minutos
      }
    });

    console.log('✅ Upload completado exitosamente!\n');
    console.log('📝 Detalles:');
    console.log(`  - Bucket: dungeon-forge-prod.firebasestorage.app`);
    console.log(`  - Ruta: version.json`);
    console.log(`  - URL pública: https://storage.googleapis.com/dungeon-forge-prod.firebasestorage.app/version.json`);
    console.log(`  - Content-Type: application/json`);
    console.log(`  - Cache: 5 minutos\n`);

    console.log('📝 Próximos pasos:');
    console.log('1. Validar headers CORS:');
    console.log('   npm run validate-cors\n');
    console.log('2. Probarlo en APK:');
    console.log('   - Instalar: npm run build && cd android && ./gradlew assembleDebug');
    console.log('   - Test OTA update en WebView\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('not found')) {
      console.error('\n💡 El archivo version.json no existe.');
      console.error('   Créalo primero o ejecuta: echo "{...}" > version.json');
    }
    
    process.exit(1);
  }
}

uploadVersion().catch(error => {
  console.error('❌ Error fatal:', error.message);
  process.exit(1);
});
