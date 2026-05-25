#!/usr/bin/env node
/**
 * Script para desplegar Storage rules y CORS configuration
 * Usa Firebase CLI
 * 
 * Uso: node scripts/deploy-storage-cors.mjs
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const projectId = 'dungeon-forge-prod';

console.log('🚀 Desplegando Storage rules y CORS configuration...\n');
console.log(`📁 Directorio: ${projectRoot}`);
console.log(`🔧 Proyecto: ${projectId}\n`);

try {
  // Cambiar al directorio del proyecto
  process.chdir(projectRoot);
  
  // Verificar que firebase.json existe
  const fs = await import('fs');
  if (!fs.existsSync('firebase.json')) {
    throw new Error('firebase.json no encontrado en ' + projectRoot);
  }
  
  if (!fs.existsSync('storage.rules')) {
    throw new Error('storage.rules no encontrado en ' + projectRoot);
  }
  
  console.log('✅ Archivos encontrados: firebase.json, storage.rules\n');
  
  // Deploy
  console.log('📤 Desplegando...\n');
  const cmd = `firebase deploy --only storage --project ${projectId}`;
  console.log(`Ejecutando: ${cmd}\n`);
  
  const output = execSync(cmd, { 
    encoding: 'utf-8',
    stdio: 'inherit'
  });
  
  console.log('\n✅ Deploy completado exitosamente!');
  console.log('\n📝 Próximos pasos:');
  console.log('1. Verificar CORS con: npm run validate-cors');
  console.log('2. Subir version.json a Firebase Storage');
  console.log('3. Probar OTA update en el APK\n');
  
} catch (error) {
  if (error.code === 'ENOENT' && error.path?.includes('firebase')) {
    console.error('❌ Firebase CLI no está instalado o no está en el PATH');
    console.error('   npm install -g firebase-tools\n');
  } else if (error.stderr?.includes('not currently active project')) {
    console.error('❌ No hay proyecto activo configurado en Firebase CLI');
    console.error('   Ejecutar: firebase login --reauth\n');
  } else {
    console.error('❌ Error durante el deploy:', error.message);
    console.error('\n📝 Solución alternativa - Deploy manual:');
    console.error('1. Ir a: https://console.firebase.google.com/project/dungeon-forge-prod/storage/rules');
    console.error('2. Copiar contenido de storage.rules al editor');
    console.error('3. Click "Publish"');
    console.error('4. Ir a Google Cloud Console → Storage → Buckets');
    console.error('5. Configurar CORS manualmente (ver CORS-CONFIGURATION-WAVE2.md)\n');
  }
  
  process.exit(1);
}
