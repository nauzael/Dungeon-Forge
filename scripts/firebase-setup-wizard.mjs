#!/usr/bin/env node

/**
 * Firebase Setup - Final Automated Solution
 * 
 * This script provides THREE options:
 * 1. Paste Firebase Admin SDK JSON (recommended, 2 minutes)
 * 2. Use existing test/placeholder credentials (development only)
 * 3. Manual setup instructions
 * 
 * Usage:
 *   node scripts/firebase-setup-wizard.mjs
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
const CREDENTIALS_FILE = path.join(PROJECT_ROOT, 'dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function section(title) {
  console.log('\n' + '█'.repeat(80));
  console.log(`█ ${title.padEnd(78)} █`);
  console.log('█'.repeat(80) + '\n');
}

function log(msg) {
  console.log(msg);
}

async function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function runWizard() {
  section('🚀 FIREBASE SETUP WIZARD');

  log(`Esta herramienta te ayudará a configurar Firebase en 2 minutos.

Opciones disponibles:
1. Pegar credenciales JSON desde Google Cloud Console (RECOMENDADO)
2. Usar credenciales de prueba (solo para desarrollo)
3. Ver instrucciones manuales
  `);

  const option = await prompt('\n¿Qué opción prefieres? (1/2/3): ');

  switch (option) {
    case '1':
      await setupWithJson();
      break;
    case '2':
      await setupWithTest();
      break;
    case '3':
      showManualInstructions();
      break;
    default:
      log('\n❌ Opción no válida');
      rl.close();
      process.exit(1);
  }
}

async function setupWithJson() {
  section('OPCIÓN 1: Pegar JSON desde Google Cloud');

  log(`Instrucciones rápidas:

1. Abre: https://console.cloud.google.com/iam-admin/serviceaccounts?project=dungeon-forge-prod
2. Busca: "firebase-adminsdk-fbsvc"
3. Clica en ella → Solapa "Keys" → "Add Key" → "Create new key"
4. Selecciona "JSON" → "Create"
5. Se abre un archivo JSON en tu navegador
6. Selecciona TODO el contenido (Ctrl+A)
7. Cópialo (Ctrl+C)
8. Vuelve aquí y pégalo (Ctrl+V)
9. Escribe "LISTO" al terminar

¿Ya tiene el JSON descargado?`);

  const ready = await prompt('(sí/no): ');
  if (ready.toLowerCase() !== 'sí') {
    log('\nDescarga el archivo primero y vuelve. Ejecuta nuevamente:');
    log('  node scripts/firebase-setup-wizard.mjs');
    rl.close();
    process.exit(0);
  }

  log('\n📋 Pega el JSON aquí (Ctrl+V, luego ENTER y escribe "LISTO"):\n');
  let jsonContent = '';

  const collectJson = async () => {
    const line = await prompt('');
    if (line.toUpperCase() === 'LISTO') {
      return;
    }
    jsonContent += (jsonContent ? '\n' : '') + line;
    await collectJson();
  };

  await collectJson();

  if (!jsonContent) {
    log('❌ No se ingresó contenido');
    rl.close();
    process.exit(1);
  }

  // Validate JSON
  log('\n⏳ Validando JSON...');
  try {
    const creds = JSON.parse(jsonContent);
    const required = ['type', 'project_id', 'private_key', 'client_email'];
    const missing = required.filter(f => !creds[f]);
    if (missing.length > 0) {
      log(`❌ ERROR: Campos faltantes: ${missing.join(', ')}`);
      log('Asegúrate de copiar el archivo COMPLETO sin ediciones.');
      rl.close();
      process.exit(1);
    }

    fs.writeFileSync(CREDENTIALS_FILE, jsonContent, { mode: 0o600 });
    log(`✅ Credenciales guardadas correctamente`);
    log(`   Archivo: ${path.basename(CREDENTIALS_FILE)}`);
    log(`   Tamaño: ${fs.statSync(CREDENTIALS_FILE).size} bytes`);

    await runMigration();
  } catch (e) {
    log(`❌ JSON inválido: ${e.message}`);
    rl.close();
    process.exit(1);
  }
}

async function setupWithTest() {
  section('OPCIÓN 2: Credenciales de Prueba (Dev Only)');

  log(`⚠️  ADVERTENCIA:
  - Estas credenciales NO funcionarán para producción
  - Solo para desarrollo local
  - La migración probablemente fallará
  - Para producción, usa Opción 1

¿Deseas continuar de todas formas?`);

  const confirm = await prompt('(sí/no): ');
  if (confirm.toLowerCase() !== 'sí') {
    log('\nAbortado. Usa Opción 1 para credenciales reales.');
    rl.close();
    process.exit(0);
  }

  log('\n✅ Usando archivo de prueba...');
  log('   Nota: La migración fallará, esto es esperado');

  // File already exists from setup-firebase-complete.mjs
  if (fs.existsSync(CREDENTIALS_FILE)) {
    log(`   Archivo ya existe: ${path.basename(CREDENTIALS_FILE)}`);
  }

  section('¿AHORA QUÉ?');
  log(`
Opciones:

A) Intentar migración (fallará con credenciales de prueba):
   ${'$'} node scripts/migrate-parties-to-firebase.mjs

B) Volver a ejecutar el setup con credenciales reales:
   ${'$'} node scripts/firebase-setup-wizard.mjs

C) Ver status actual:
   ${'$'} npm run dev
  `);

  rl.close();
}

async function runMigration() {
  section('INICIANDO MIGRACIÓN');

  log('Este proceso migrará tus datos de Supabase a Firebase...\n');

  try {
    const { stdout, stderr } = await execAsync(
      'node scripts/migrate-parties-to-firebase.mjs',
      { cwd: PROJECT_ROOT, encoding: 'utf-8' }
    );

    if (stdout) {
      log(stdout);
    }

    section('✅ MIGRACIÓN COMPLETADA');
    log(`\n🎉 ¡Excelente! Tus datos se han migrado a Firebase.\n`);

    log(`Próximos pasos:

1. Verifica que todo funciona:
   ${'$'} npm run build

2. Prueba la app:
   ${'$'} npm run dev

3. Crea una nueva party en la app para verificar

4. Confirma los cambios:
   ${'$'} git add .
   ${'$'} git commit -m "setup: Firebase migration complete"
   ${'$'} git push origin main
    `);

  } catch (e) {
    if (e.stderr && e.stderr.includes('Firebase Admin SDK')) {
      log('⚠️  Migración bloqueada: Credenciales de Firebase no son válidas');
      log('    Usa Opción 1 del wizard para credenciales reales');
    } else {
      log('❌ Migración fallida:');
      log(e.message.substring(0, 500));
    }
  }

  rl.close();
}

function showManualInstructions() {
  section('OPCIÓN 3: Instrucciones Manuales');

  log(`
PASO 1: Descargar credenciales
───────────────────────────────
1. Abre: https://console.cloud.google.com/iam-admin/serviceaccounts?project=dungeon-forge-prod
2. Haz clic en "firebase-adminsdk-fbsvc"
3. Ve a la solapa "Keys" (Claves)
4. Haz clic en "Add Key" (Agregar clave)
5. Selecciona "Create new key" (Crear nueva clave)
6. Elige "JSON"
7. Se descargará: "dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json"

PASO 2: Guardar en el proyecto
──────────────────────────────
- Copia el archivo descargado
- Pégalo en la raíz del proyecto:
  i:\\Apks\\Dungeon Forge\\

PASO 3: Ejecutar migración
──────────────────────────
Abre PowerShell en el proyecto y ejecuta:
  node scripts/migrate-parties-to-firebase.mjs

PASO 4: Verificar
─────────────────
  npm run dev

El archivo de credenciales NO se versionará (está en .gitignore).

TROUBLESHOOTING:
┌─
├─ ❌ "Permiso denegado" → Verifica que tienes rol "Editor" en Google Cloud
├─ ❌ "Archivo no encontrado" → Asegúrate de copiar a la carpeta correcta
├─ ❌ "JSON inválido" → No edites el archivo descargado
└─

¿Necesitas más ayuda? Abre un issue en GitHub.
  `);

  rl.close();
}

// Run wizard
runWizard().catch((e) => {
  console.error('\n❌ Error:', e.message);
  rl.close();
  process.exit(1);
});
