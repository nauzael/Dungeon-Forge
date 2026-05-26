#!/usr/bin/env node
/**
 * Instrucciones para configurar CORS manualmente en Google Cloud Storage
 * Alternativa: configurar via Google Cloud Console UI
 * 
 * Este script proporciona pasos claros para configurar CORS
 */

import { spawn } from 'child_process';

console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                   CONFIGURACIÓN CORS - FIREBASE STORAGE                    ║
║                         Wave 2 OTA Configuration                           ║
╚════════════════════════════════════════════════════════════════════════════╝

🔧 CORS CONFIGURATION MANUAL

El almacenamiento de Firebase requires CORS ser configurado en Google Cloud 
Storage para que los clientes web/APK puedan acceder a archivos públicos.

═════════════════════════════════════════════════════════════════════════════

📍 OPCIÓN 1: Google Cloud Console UI (Recomendado)
───────────────────────────────────────────────────

1. Ir a: https://console.cloud.google.com/storage/browser
   
2. Seleccionar bucket: dungeon-forge-prod.appspot.com
   
3. Click en bucket → "CORS configuration"
   
4. Si no hay configuración, click "Add CORS configuration"
   
5. Copiar y pegar esta configuración JSON:

\`\`\`json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type", "Cache-Control"],
    "maxAgeSeconds": 3600
  }
]
\`\`\`

6. Click "Save"

═════════════════════════════════════════════════════════════════════════════

📍 OPCIÓN 2: Google Cloud CLI (gcloud)
────────────────────────────────────────

Requiere: Google Cloud SDK instalado

1. Instalar Google Cloud SDK:
   https://cloud.google.com/sdk/docs/install
   
2. Autenticarse:
   gcloud auth login
   
3. Ejecutar:
   gcloud storage buckets update gs://dungeon-forge-prod.appspot.com --cors-file=cors-config.json
   
   O manualmente:
   
   gcloud storage buckets update gs://dungeon-forge-prod.appspot.com \\
     --clear-cors && \\
   gcloud storage buckets update gs://dungeon-forge-prod.appspot.com \\
     --cors-file=cors-config.json

═════════════════════════════════════════════════════════════════════════════

📍 OPCIÓN 3: Firebase Hosting (Alternativa sin CORS)
─────────────────────────────────────────────

Si CORS es problemático, puedes servir version.json vía Firebase Hosting:

1. npm run build && npm run ota
2. firebase deploy --only hosting
3. Actualizar URL en APK a: https://dungeon-forge-prod.web.app/version.json

═════════════════════════════════════════════════════════════════════════════

🔍 VERIFICAR CORS

Después de configurar, ejecutar:

  npm run validate-cors
  
Debe mostrar: ✅ Access-Control-Allow-Origin: *

═════════════════════════════════════════════════════════════════════════════

📝 ARCHIVOS MODIFICADOS EN ESTA WAVE

✅ firebase.json - Storage rules section agregado
✅ storage.rules - Creado (reglas de seguridad)
✅ .firebaserc - Proyecto configurado
✅ cors-config.json - Configuración CORS JSON
✅ scripts/deploy-storage-cors.mjs - Script deploy
✅ scripts/validate-cors.mjs - Script validación
✅ package.json - Scripts agregados

═════════════════════════════════════════════════════════════════════════════

🎯 CHECKLIST

[ ] Storage rules desplegados (✅ completado)
[ ] CORS configurado en Google Cloud Console o CLI
[ ] version.json subido a gs://dungeon-forge-prod.appspot.com/
[ ] Validación exitosa: npm run validate-cors
[ ] APK puede descargar version.json (sin errores CORS)

═════════════════════════════════════════════════════════════════════════════
`);

// Intentar detectar si hay Google Cloud SDK instalado
const gcloud = spawn('gcloud', ['--version'], { stdio: 'pipe' });

gcloud.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Google Cloud SDK detectado\n');
    console.log('Para aplicar CORS directamente, ejecuta:\n');
    console.log('  gcloud storage buckets update gs://dungeon-forge-prod.appspot.com \\');
    console.log('    --cors-file=cors-config.json\n');
  } else {
    console.log('ℹ️  Google Cloud SDK no instalado (opcional)\n');
    console.log('Usar Google Cloud Console para configurar CORS manualmente.\n');
  }
});
