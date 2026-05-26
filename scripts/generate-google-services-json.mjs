#!/usr/bin/env node

/**
 * Scripts/generate-google-services-json.mjs
 * 
 * Genera google-services.json para Android usando variables de entorno.
 * Esto es más seguro que mantener claves hardcodeadas en el repositorio.
 * 
 * Uso:
 *   node scripts/generate-google-services-json.mjs
 * 
 * Requiere variables de entorno:
 *   - VITE_GOOGLE_API_KEY: Tu API key de Google (restringida a Android apps)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Función para generar google-services.json
function generateGoogleServicesJson(apiKey) {
  return {
    project_info: {
      project_number: '955477498217',
      project_id: 'dungeon-forge-prod',
      storage_bucket: 'dungeon-forge-prod.firebasestorage.app'
    },
    client: [
      {
        client_info: {
          mobilesdk_app_id: '1:955477498217:android:f50f5c4fc5bfccf52a05f8',
          android_client_info: {
            package_name: 'com.tupaquete.dndcompanion'
          }
        },
        oauth_client: [
          {
            client_id: '955477498217-jlv0cm8dkv2l46pv2g5bqkbkff0g4kbp.apps.googleusercontent.com',
            client_type: 3
          }
        ],
        api_key: [
          {
            current_key: apiKey || 'PLACEHOLDER_API_KEY'
          }
        ],
        services: {
          appinvite_service: {
            other_platform_oauth_client: [
              {
                client_id: '955477498217-jlv0cm8dkv2l46pv2g5bqkbkff0g4kbp.apps.googleusercontent.com',
                client_type: 3
              }
            ]
          }
        }
      }
    ],
    configuration_version: '1'
  };
}

function main() {
  const apiKey = process.env.VITE_GOOGLE_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️  VITE_GOOGLE_API_KEY no está definido en variables de entorno');
    console.log('📝 Generando google-services.json con PLACEHOLDER_API_KEY');
  } else {
    console.log('✅ Usando VITE_GOOGLE_API_KEY de variables de entorno');
  }
  
  const config = generateGoogleServicesJson(apiKey);
  const json = JSON.stringify(config, null, 2);
  
  // Generar archivos
  const files = [
    path.join(projectRoot, 'docs', 'google-services.json'),
    path.join(projectRoot, 'android', 'app', 'google-services.json')
  ];
  
  for (const filePath of files) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, json);
    console.log(`✓ Generado: ${path.relative(projectRoot, filePath)}`);
  }
  
  console.log('\n📌 Recuerda:');
  console.log('1. Agregar google-services.json a .gitignore (ya hecho)');
  console.log('2. Ejecutar este script en CI/CD con VITE_GOOGLE_API_KEY');
  console.log('3. NUNCA hacer commit de google-services.json con claves reales');
}

main();
