#!/usr/bin/env node
/**
 * Configurar CORS directamente en Google Cloud Storage usando REST API
 * No requiere gsutil ni gcloud
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const serviceAccountPath = path.join(projectRoot, 'dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json');
const corsConfigPath = path.join(projectRoot, 'cors-config.json');

console.log('🚀 Configurando CORS vía Google Cloud Storage REST API...\n');

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
const corsConfig = JSON.parse(fs.readFileSync(corsConfigPath, 'utf-8'));

// Initialize Firebase Admin to get access token
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const projectId = serviceAccount.project_id;
const bucketName = 'dungeon-forge-prod.firebasestorage.app';

console.log('📋 Información:');
console.log(`  Project: ${projectId}`);
console.log(`  Bucket: ${bucketName}`);
console.log(`  CORS Rules: ${JSON.stringify(corsConfig, null, 2)}\n`);

async function getAccessToken() {
  console.log('🔐 Obteniendo access token...');
  const token = await admin.app().credentials.getAccessToken();
  console.log('✅ Token obtenido\n');
  return token.access_token;
}

function configureCORSViaAPI(accessToken) {
  return new Promise((resolve, reject) => {
    const corsPayload = {
      cors: corsConfig
    };

    const options = {
      hostname: 'storage.googleapis.com',
      path: `/storage/v1/b/${bucketName}`,
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(corsPayload))
      }
    };

    console.log('📤 Enviando PATCH request a Google Cloud Storage API...\n');

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ CORS configurado exitosamente!\n');
          try {
            const response = JSON.parse(data);
            if (response.cors) {
              console.log('📋 CORS Configuration aplicada:');
              console.log(JSON.stringify(response.cors, null, 2));
            }
          } catch (e) {
            // OK if JSON parsing fails
          }
          resolve(true);
        } else {
          console.error(`❌ Error: ${res.statusCode} ${res.statusMessage}\n`);
          console.error('Response:', data);
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ Request error:', err.message);
      reject(err);
    });

    req.write(JSON.stringify(corsPayload));
    req.end();
  });
}

function verifyCORSConfiguration(accessToken) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'storage.googleapis.com',
      path: `/storage/v1/b/${bucketName}?projection=full`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    console.log('🔍 Verificando configuración...\n');

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const bucketInfo = JSON.parse(data);
            if (bucketInfo.cors) {
              console.log('✅ CORS está configurado:');
              console.log(JSON.stringify(bucketInfo.cors, null, 2));
              resolve(true);
            } else {
              console.log('⚠️  No CORS configuration found');
              resolve(false);
            }
          } catch (e) {
            console.error('Error parsing response:', e.message);
            resolve(false);
          }
        } else {
          console.error(`Error: ${res.statusCode}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.error('Request error:', err.message);
      resolve(false);
    });

    req.end();
  });
}

async function main() {
  try {
    const token = await getAccessToken();
    await configureCORSViaAPI(token);
    
    // Wait a moment for propagation
    console.log('⏳ Esperando propagación de cambios (5 segundos)...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const verified = await verifyCORSConfiguration(token);
    
    if (verified) {
      console.log('\n✅ Configuración completada y verificada!\n');
      console.log('📝 Próximos pasos:');
      console.log('1. Ejecutar: npm run test-cors\n');
    } else {
      console.log('\n⚠️  Configuración enviada pero verificación falló.\n');
      console.log('📝 Nota: Esto podría ser un problema temporal de propagación.\n');
    }

  } catch (error) {
    console.error('\n❌ Error fatal:', error.message);
    console.error('\n📝 Alternativa manual:');
    console.error('1. Instalar Google Cloud SDK: https://cloud.google.com/sdk/docs/install');
    console.error('2. gcloud auth activate-service-account --key-file=dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json');
    console.error('3. gsutil -m cors set cors-config.json gs://dungeon-forge-prod.firebasestorage.app');
    console.error('4. gsutil cors get gs://dungeon-forge-prod.firebasestorage.app\n');
    process.exit(1);
  }
}

main();
