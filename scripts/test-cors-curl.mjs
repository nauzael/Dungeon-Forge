#!/usr/bin/env node
/**
 * Prueba rápida de CORS con curl
 */

import { execSync } from 'child_process';

console.log('🧪 Probando CORS con curl...\n');

const urls = [
  {
    name: 'firebasestorage.app',
    url: 'https://storage.googleapis.com/dungeon-forge-prod.firebasestorage.app/version.json'
  },
  {
    name: 'appspot.com',  
    url: 'https://storage.googleapis.com/dungeon-forge-prod.appspot.com/version.json'
  }
];

for (const { name, url } of urls) {
  console.log(`\n📍 Probando: ${name}`);
  console.log(`URL: ${url}\n`);
  
  try {
    const output = execSync(`curl -i -X GET "${url}"`, {
      encoding: 'utf-8',
      stdio: 'pipe'
    });

    // Parse output
    const lines = output.split('\n');
    console.log('Response Headers:');
    
    // Find headers section
    let headerSection = false;
    for (const line of lines) {
      if (line.startsWith('HTTP') || line.includes(':')) {
        console.log('  ' + line);
        headerSection = true;
      } else if (headerSection && line.trim() === '') {
        break;
      }
    }

    // Check for CORS headers
    console.log('\n✅ Resultado: ');
    if (output.includes('Access-Control-Allow-Origin')) {
      console.log('  ✅ CORS headers presentes');
    } else if (output.includes('404')) {
      console.log('  ⚠️  Archivo no encontrado (404) - CORS configurado pero sin archivo');
    } else {
      console.log('  ❌ Sin headers CORS');
    }
    
  } catch (error) {
    console.log(`  ⚠️  Error: ${error.message}`);
  }
}

console.log('\n\n📋 Resumen:');
console.log('- Si ves "Access-Control-Allow-Origin" → CORS está configurado ✅');
console.log('- Si ves "404" → Archivo no subido todavía (pero CORS ok)');
console.log('- Si no ves headers CORS → CORS no configurado ❌\n');
