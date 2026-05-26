#!/usr/bin/env node
/**
 * Configurar CORS usando JWT token del service account
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const serviceAccountPath = path.join(projectRoot, 'dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json');
const corsConfigPath = path.join(projectRoot, 'cors-config.json');

console.log('🚀 Configurando CORS usando Google Cloud Storage API...\n');

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
const corsConfig = JSON.parse(fs.readFileSync(corsConfigPath, 'utf-8'));

const bucketName = 'dungeon-forge-prod.firebasestorage.app';

// Crear JWT token
function createJWT(serviceAccount) {
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const headerBase64 = Buffer.from(JSON.stringify(header)).toString('base64url');
  const claimBase64 = Buffer.from(JSON.stringify(claim)).toString('base64url');
  const message = `${headerBase64}.${claimBase64}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(message);
  signer.end();

  const signature = signer.sign(serviceAccount.private_key, 'base64url');
  const jwt = `${message}.${signature}`;

  return jwt;
}

// Obtener access token
function getAccessToken(jwt) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    });

    const options = {
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': params.toString().length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error(`No access token in response: ${data}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse token response: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(params.toString());
    req.end();
  });
}

// Configurar CORS
function setCORS(accessToken) {
  return new Promise((resolve, reject) => {
    const corsPayload = {
      cors: corsConfig
    };

    const payload = JSON.stringify(corsPayload);

    const options = {
      hostname: 'storage.googleapis.com',
      path: `/storage/v1/b/${bucketName}`,
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    console.log('📤 Configurando CORS en bucket...\n');

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
            if (response.cors && response.cors.length > 0) {
              console.log('📋 CORS Rules:');
              response.cors.forEach((rule, i) => {
                console.log(`\n  Rule ${i + 1}:`);
                console.log(`    Origin: ${rule.origin ? rule.origin.join(', ') : '*'}`);
                console.log(`    Methods: ${rule.method ? rule.method.join(', ') : 'N/A'}`);
                console.log(`    Headers: ${rule.responseHeader ? rule.responseHeader.join(', ') : 'N/A'}`);
                console.log(`    MaxAge: ${rule.maxAgeSeconds || 'default'}`);
              });
            }
          } catch (e) {
            // OK
          }
          resolve(true);
        } else {
          console.error(`❌ Error: ${res.statusCode} ${res.statusMessage}`);
          console.error('Response:', data);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// Verificar CORS
function getCORS(accessToken) {
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
            if (bucketInfo.cors && bucketInfo.cors.length > 0) {
              console.log('✅ CORS verificado correctamente:\n');
              bucketInfo.cors.forEach((rule, i) => {
                console.log(`  Rule ${i + 1}:`);
                console.log(`    origin: ${JSON.stringify(rule.origin)}`);
                console.log(`    method: ${JSON.stringify(rule.method)}`);
                console.log(`    responseHeader: ${JSON.stringify(rule.responseHeader)}`);
                console.log(`    maxAgeSeconds: ${rule.maxAgeSeconds}`);
              });
              resolve(true);
            } else {
              console.log('⚠️  CORS not configured');
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
    console.log('📋 Información:');
    console.log(`  Project: ${serviceAccount.project_id}`);
    console.log(`  Bucket: ${bucketName}\n`);

    console.log('🔐 Generando JWT token...');
    const jwt = createJWT(serviceAccount);
    console.log('✅ JWT generado\n');

    console.log('🔑 Obteniendo access token...');
    const accessToken = await getAccessToken(jwt);
    console.log('✅ Access token obtenido\n');

    await setCORS(accessToken);

    // Wait for propagation
    console.log('⏳ Esperando propagación (3 segundos)...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));

    const verified = await getCORS(accessToken);

    if (verified) {
      console.log('\n✅ CORS configurado y verificado exitosamente!\n');
      console.log('📝 Próximos pasos:');
      console.log('1. Ejecutar test: npm run test-cors\n');
    } else {
      console.log('\n⚠️  Configuration enviada pero verificación falló');
      console.log('   Esto podría ser un problema de propagación temporalNL\n');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
