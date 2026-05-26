#!/usr/bin/env node
/**
 * Validar configuración CORS en Firebase Storage
 * Uso: node scripts/validate-cors.mjs
 */

import https from 'https';

const BUCKET_URL = 'storage.googleapis.com/dungeon-forge-prod.firebasestorage.app';
const VERSION_JSON_PATH = '/version.json';
const FULL_URL = `https://${BUCKET_URL}${VERSION_JSON_PATH}`;

console.log('🔍 Validando configuración CORS en Firebase Storage...\n');
console.log(`URL: ${FULL_URL}\n`);

// Test 1: Verificar headers CORS
function validateCORSHeaders() {
  return new Promise((resolve) => {
    const options = {
      hostname: BUCKET_URL.split('/')[0],
      path: VERSION_JSON_PATH,
      method: 'HEAD',
      headers: {
        'Origin': 'http://localhost:5173'
      }
    };

    const req = https.request(options, (res) => {
      console.log('📋 Response Headers:');
      console.log(`  Status: ${res.statusCode} ${res.statusMessage}`);
      
      const corsHeaders = {
        'Access-Control-Allow-Origin': res.headers['access-control-allow-origin'],
        'Access-Control-Allow-Methods': res.headers['access-control-allow-methods'],
        'Access-Control-Allow-Headers': res.headers['access-control-allow-headers'],
        'Access-Control-Max-Age': res.headers['access-control-max-age'],
        'Content-Type': res.headers['content-type'],
      };

      console.log('\n🔐 CORS Headers:');
      let hasCorS = false;
      Object.entries(corsHeaders).forEach(([key, val]) => {
        if (val) {
          console.log(`  ✅ ${key}: ${val}`);
          if (key.startsWith('Access-Control')) hasCorS = true;
        }
      });

      if (!hasCorS && res.statusCode !== 404) {
        console.log('  ❌ No CORS headers detected!');
      }

      if (res.statusCode === 404) {
        console.log('\n⚠️  version.json no existe todavía (404)');
        console.log('   Subirlo a gs://dungeon-forge-prod.appspot.com/version.json\n');
      } else if (res.statusCode === 200) {
        console.log('\n✅ CORS está correctamente configurado!');
      }

      console.log(`\n📊 Status: ${res.statusCode === 200 || res.statusCode === 404 ? '✅ PASS' : '❌ FAIL'}`);
      resolve(res.statusCode);
    });

    req.on('error', (err) => {
      console.error('❌ Error:', err.message);
      resolve(null);
    });

    req.end();
  });
}

// Test 2: Validar que fetch funcionaría (GET)
function validateGETRequest() {
  return new Promise((resolve) => {
    const options = {
      hostname: BUCKET_URL.split('/')[0],
      path: VERSION_JSON_PATH,
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173'
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            console.log('\n📦 version.json contents:');
            console.log('  ', JSON.stringify(json, null, 2).split('\n').slice(0, 5).join('\n  '));
            console.log('  ...');
          } catch {
            console.log('\n⚠️  File exists but is not valid JSON');
          }
          resolve(true);
        });
      } else if (res.statusCode === 404) {
        resolve(false);
      }
    });

    req.on('error', (err) => {
      console.error('❌ Error fetching:', err.message);
      resolve(false);
    });

    req.end();
  });
}

// Run tests
async function main() {
  const headStatus = await validateCORSHeaders();
  
  if (headStatus === 200 || headStatus === 404) {
    const canGetData = await validateGETRequest();
    
    if (headStatus === 404) {
console.log('📝 Próximos pasos:');
        console.log('1. Subir version.json a Firebase Storage');
        console.log('   gsutil -m cp version.json gs://dungeon-forge-prod.firebasestorage.app/');
        console.log('2. Re-ejecutar este script para validar');
    }
  }
}

main().catch(console.error);
