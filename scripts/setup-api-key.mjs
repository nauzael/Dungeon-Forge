#!/usr/bin/env node

/**
 * Scripts/setup-api-key.mjs
 * 
 * Script interactivo para configurar la nueva API key de Google de forma segura.
 * 
 * Uso:
 *   node scripts/setup-api-key.mjs
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║   Configuración de API Key de Google (Dungeon Forge)  ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  console.log('📋 Instrucciones:');
  console.log('1. Ve a: https://console.cloud.google.com/apis/credentials?project=dungeon-forge-prod');
  console.log('2. Click "Crear credenciales" → "Clave de API"');
  console.log('3. Selecciona "Apps para Android"');
  console.log('4. Click "Crear"');
  console.log('5. Copia la clave mostrada y pégala aquí\n');

  const apiKey = await prompt('📌 Pega tu nueva API key (AIzaSy...): ');
  
  if (!apiKey || !apiKey.startsWith('AIzaSy')) {
    console.error('\n❌ Error: API key inválida. Debe comenzar con "AIzaSy"');
    process.exit(1);
  }

  console.log('\n⏳ Generando google-services.json...');
  
  try {
    process.env.VITE_GOOGLE_API_KEY = apiKey;
    execSync('node scripts/generate-google-services-json.mjs', {
      cwd: projectRoot,
      stdio: 'inherit'
    });
    
    console.log('\n✅ google-services.json generados exitosamente!');
    console.log('📁 Archivos actualizado:');
    console.log('   - docs/google-services.json');
    console.log('   - android/app/google-services.json');
    
    console.log('\n🧪 Próximos pasos:');
    console.log('1. Probar que la app aún compila: npm run build');
    console.log('2. Probar build de Android: cd android && ./gradlew assembleDebug');
    console.log('3. Verificar que los nuevos archivos NOT estén en git:');
    console.log('   git status (no debería mostrar google-services.json)');
    
  } catch (error) {
    console.error('\n❌ Error al generar archivos:', error.message);
    process.exit(1);
  }
  
  rl.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
