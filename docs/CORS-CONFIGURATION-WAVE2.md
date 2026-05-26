# Wave 2 - CORS Configuration para Firebase Storage

**Objetivo:** Permitir que el APK pueda descargar `version.json` públicamente desde Firebase Storage.

## Cambios Realizados

### 1. ✅ firebase.json - Actualizado
Se agregó la sección `storage` con configuración CORS:
```json
"storage": {
  "rules": "storage.rules",
  "cors": [
    {
      "origin": ["*"],
      "method": ["GET", "HEAD"],
      "responseHeader": ["Content-Type", "Cache-Control"],
      "maxAgeSeconds": 3600
    }
  ]
}
```

### 2. ✅ storage.rules - Creado
Se creó el archivo `storage.rules` con reglas que permiten:
- **Lectura pública** (GET) de `/version.json` y `/builds/*.apk`
- **Escritura autenticada** (solo usuarios logueados)
- **Acceso protegido** para otros archivos

### 3. .firebaserc - Creado
Se creó `.firebaserc` con la configuración del proyecto:
```json
{
  "projects": {
    "default": "dungeon-forge-prod"
  }
}
```

## Pasos Manuales en Firebase Console

### Opción A: Desplegar via Firebase CLI (recomendado)
```bash
cd "i:\Apks\Dungeon Forge"
firebase login  # Si no está autenticado
firebase deploy --only storage --project dungeon-forge-prod
```

### Opción B: Configurar manualmente en Firebase Console

1. **Ir a Firebase Console:**
   - URL: https://console.firebase.google.com/project/dungeon-forge-prod/storage/rules
   
2. **Rules:**
   - Copiar contenido de `storage.rules` al editor de rules
   - Click "Publish"
   
3. **CORS Configuration:**
   - **Nota:** Firebase Console no tiene UI para CORS, esto se debe hacer via CLI o directamente en Cloud Storage
   - Ir a Google Cloud Console → Storage Buckets
   - Bucket: `dungeon-forge-prod.appspot.com`
   - Click en bucket → "CORS configuration"
   - Agregar configuración (ver sección CORS abajo)

### Configuración CORS (JSON)
```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type", "Cache-Control"],
    "maxAgeSeconds": 3600
  }
]
```

## Validación

### 1. Verificar que version.json existe
```bash
gsutil -m ls gs://dungeon-forge-prod.appspot.com/version.json
```

### 2. Verificar CORS Headers (cuando exista el archivo)
```bash
curl -I https://storage.googleapis.com/dungeon-forge-prod.appspot.com/version.json
```

**Esperado:**
- Status: 200 OK o 404 (pero con headers CORS)
- Headers:
  - `Access-Control-Allow-Origin: *`
  - `Access-Control-Allow-Methods: GET, HEAD`

### 3. Test en APK
El APK ahora puede hacer fetch en WebView:
```javascript
fetch('https://storage.googleapis.com/dungeon-forge-prod.appspot.com/version.json')
  .then(r => r.json())
  .then(data => console.log('OTA Version:', data))
  .catch(e => console.error('CORS Error:', e))
```

## Archivos Modificados
- ✅ `firebase.json` - Agregada sección storage + CORS
- ✅ `storage.rules` - Creado con reglas públicas para version.json
- ✅ `.firebaserc` - Creado para proyecto dungeon-forge-prod

## Estado
- [ ] Deploy realizado via `firebase deploy --only storage`
- [ ] CORS headers verificados con curl
- [ ] OTA update test completado

## Notas
- Bucket name: `dungeon-forge-prod.appspot.com` (diferente de `dungeon-forge-prod.firebasestorage.app`)
- CORS origen `["*"]` es público - revisar seguridad si es necesario
- Se recomienda hacer deploy ANTES de que el APK intente acceder a version.json
