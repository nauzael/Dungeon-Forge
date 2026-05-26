#!/usr/bin/env node
/**
 * Configurar CORS en Firebase Storage usando Firebase Admin SDK
 * No requiere Firebase CLI o gcloud
 * Uso: node scripts/setup-cors-admin.mjs
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const serviceAccountPath = path.join(projectRoot, 'dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json');
const corsConfigPath = path.join(projectRoot, 'cors-config.json');

console.log('🚀 Configurando CORS en Firebase Storage (usando Admin SDK)...\n');

// Verificar archivos necesarios
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: Archivo de credenciales no encontrado');
  console.error(`   ${serviceAccountPath}`);
  process.exit(1);
}

if (!fs.existsSync(corsConfigPath)) {
  console.error('❌ Error: Archivo cors-config.json no encontrado');
  console.error(`   ${corsConfigPath}`);
  process.exit(1);
}

console.log('✅ Archivos encontrados:');
console.log(`   - Service Account: dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json`);
console.log(`   - CORS Config: cors-config.json\n`);

// Leer credenciales
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
const corsConfig = JSON.parse(fs.readFileSync(corsConfigPath, 'utf-8'));

console.log('📝 CORS Configuration:');
console.log(JSON.stringify(corsConfig, null, 2));
console.log();

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'dungeon-forge-prod.firebasestorage.app'
});

const bucket = admin.storage().bucket('dungeon-forge-prod.firebasestorage.app');

async function setupCORS() {
  try {
    console.log('⏳ Configurando CORS en bucket...\n');
    
    // Usar gsutil si está disponible, sino usar Node.js directo
    await setupCORSViaGsutil(corsConfig);
    
    console.log('✅ CORS configurado exitosamente!\n');
    
    // Validar después de 2 segundos (para permitir propagación)
    console.log('⏳ Esperando propagación de cambios...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🔍 Validando configuración...\n');
    await validateCORS();
    
  } catch (error) {
    if (error.message.includes('gsutil no encontrado')) {
      console.log('⚠️  gsutil no disponible, intentando alternativa con Google Cloud APIs...\n');
      await setupCORSViaAPI(corsConfig);
    } else {
      throw error;
    }
  }
}

async function setupCORSViaGsutil(corsConfig) {
  try {
    // Escribir config temporal
    const tmpConfigPath = path.join(projectRoot, '.cors-temp.json');
    fs.writeFileSync(tmpConfigPath, JSON.stringify(corsConfig, null, 2));
    
    console.log('📤 Ejecutando: gsutil cors set .cors-temp.json gs://dungeon-forge-prod.firebasestorage.app\n');
    
    try {
      const output = execSync('gsutil -m cors set .cors-temp.json gs://dungeon-forge-prod.firebasestorage.app', {
        encoding: 'utf-8',
        stdio: 'pipe',
        cwd: projectRoot
      });
      
      console.log('Salida gsutil:');
      console.log(output);
      
      // Limpiar archivo temporal
      fs.unlinkSync(tmpConfigPath);
      
      return true;
    } catch (gsutilError) {
      // gsutil no está disponible, intentar con API
      fs.unlinkSync(tmpConfigPath);
      throw new Error('gsutil no encontrado');
    }
  } catch (error) {
    throw error;
  }
}

async function setupCORSViaAPI(corsConfig) {
  try {
    // Usar Google Cloud Storage API directamente
    const { Storage } = await import('@google-cloud/storage');
    const storage = new Storage({
      projectId: serviceAccount.project_id,
      keyFilename: serviceAccountPath
    });
    
    const bucket = storage.bucket('dungeon-forge-prod.appspot.com');
    
    console.log('📤 Configurando CORS vía Google Cloud Storage API...\n');
    
    // Convertir formato de cors-config.json a formato de GCS SDK
    const corsRules = corsConfig.map(rule => ({
      origin: rule.origin || ['*'],
      method: rule.method || ['GET', 'HEAD', 'DELETE', 'PUT', 'POST'],
      responseHeader: rule.responseHeader || ['Content-Type'],
      maxAgeSeconds: rule.maxAgeSeconds || 3600
    }));
    
    await bucket.setCorsConfiguration(corsRules);
    
    console.log('✅ CORS configurado exitosamente vía API!\n');
    
  } catch (error) {
    console.error('❌ Error configurando CORS:', error.message);
    throw error;
  }
}

async function validateCORS() {
  try {
    console.log('📋 Obteniendo configuración actual de CORS...\n');
    
    try {
      const output = execSync('gsutil cors get gs://dungeon-forge-prod.appspot.com', {
        encoding: 'utf-8',
        stdio: 'pipe',
        cwd: projectRoot
      });
      
      console.log('✅ CORS configuration actual:');
      console.log(output);
      
    } catch (gsutilError) {
      // Fallback a API
      console.log('⚠️  gsutil no disponible, validando vía API...\n');
      
      const { Storage } = await import('@google-cloud/storage');
      const storage = new Storage({
        projectId: serviceAccount.project_id,
        keyFilename: serviceAccountPath
      });
      
      const bucket = storage.bucket('dungeon-forge-prod.firebasestorage.apprage.app');
      const corsConfig = await bucket.getCorsConfiguration();
      
      if (corsConfig && corsConfig[0]) {
        console.log('✅ CORS configuration actual:');
        console.log(JSON.stringify(corsConfig, null, 2));
      } else {
        console.log('⚠️  No CORS configuration found');
      }
    }
    
    console.log('\n✅ Validación completada');
    console.log('\n📝 Próximos pasos:');
    console.log('1. Subir version.json a Firebase Storage:');
    console.log('   npm run upload:version');
    console.log('2. Validar headers CORS:');
    console.log('   npm run validate-cors\n');
    
  } catch (error) {
    console.warn('⚠️  No se pudo validar CORS:', error.message);
  }
}

// Ejecutar
setupCORS().catch(error => {
  console.error('❌ Error fatal:', error.message);
  console.error('\n📝 Solución manual:');
  console.error('1. Instalar gcloud CLI: https://cloud.google.com/sdk/docs/install');
  console.error('2. Ejecutar: gcloud auth activate-service-account --key-file=dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json');
  console.error('3. Ejecutar: gsutil -m cors set cors-config.json gs://dungeon-forge-prod.appspot.com');
  console.error('4. Validar: gsutil cors get gs://dungeon-forge-prod.appspot.com\n');
  process.exit(1);
});
