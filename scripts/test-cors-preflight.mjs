#!/usr/bin/env node
/**
 * Prueba OPTIONS request para verificar CORS preflight
 */

import https from 'https';

console.log('🧪 Probando OPTIONS request (CORS preflight)...\n');

function testCORSPreflight(hostname, path, description) {
  return new Promise((resolve) => {
    console.log(`\n📍 ${description}`);
    console.log(`Host: ${hostname}`);
    console.log(`Path: ${path}\n`);

    const options = {
      hostname: hostname,
      path: path,
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    };

    const req = https.request(options, (res) => {
      console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
      console.log('\nResponse Headers:');
      
      const corsHeaders = [
        'access-control-allow-origin',
        'access-control-allow-methods',
        'access-control-allow-headers',
        'access-control-max-age',
        'access-control-allow-credentials'
      ];

      let foundCORS = false;
      corsHeaders.forEach(header => {
        const value = res.headers[header];
        if (value) {
          console.log(`  ✅ ${header}: ${value}`);
          foundCORS = true;
        }
      });

      if (!foundCORS) {
        console.log('  ❌ No CORS headers found');
      } else {
        console.log('\n✅ CORS preflight successful!');
      }

      console.log(`\nContent-Type: ${res.headers['content-type']}`);
      console.log(`Cache-Control: ${res.headers['cache-control']}`);

      resolve(foundCORS);
    });

    req.on('error', (err) => {
      console.error(`  ❌ Error: ${err.message}`);
      resolve(false);
    });

    req.end();
  });
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log('CORS Preflight Request Tests for Firebase Storage\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const results = [];

  // Test 1: firebasestorage.app
  const test1 = await testCORSPreflight(
    'storage.googleapis.com',
    '/dungeon-forge-prod.firebasestorage.app/version.json',
    'Test 1: Firebase Storage CDN (firebasestorage.app)'
  );
  results.push({ name: 'firebasestorage.app', passed: test1 });

  // Test 2: appspot.com
  const test2 = await testCORSPreflight(
    'storage.googleapis.com',
    '/dungeon-forge-prod.appspot.com/version.json',
    'Test 2: Firebase Storage CDN (appspot.com)'
  );
  results.push({ name: 'appspot.com', passed: test2 });

  // Test 3: Direct bucket endpoint
  const test3 = await testCORSPreflight(
    'dungeon-forge-prod.firebasestorage.app',
    '/version.json',
    'Test 3: Direct bucket endpoint'
  );
  results.push({ name: 'Direct bucket', passed: test3 });

  // Summary
  console.log('\n\n═══════════════════════════════════════════════════════════════');
  console.log('SUMMARY\n');
  
  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${result.name}`);
  });

  const allPass = results.every(r => r.passed);
  console.log('\n═══════════════════════════════════════════════════════════════');
  
  if (allPass) {
    console.log('\n✅ CORS está correctamente configurado!\n');
  } else {
    console.log('\n❌ CORS requiere configuración adicional.\n');
    console.log('📝 Solución:');
    console.log('1. Verificar que firebase deploy --only storage se ejecutó');
    console.log('2. Verificar que version.json existe en el bucket');
    console.log('3. Hacer commit y push de los cambios');
  }
}

main();
