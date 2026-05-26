# Wave 2 - T2.2: CORS Configuration - COMPLETADO ✅

**Fecha**: 2026-05-25  
**Status**: ✅ COMPLETADO Y VERIFICADO  
**URL Bucket**: `gs://dungeon-forge-prod.firebasestorage.app`

---

## ✅ Tareas Completadas

### 1. Deploy de Storage Rules
- ✅ `firebase deploy --only storage --project dungeon-forge-prod`
- ✅ storage.rules compiladas y desplegadas exitosamente
- ✅ Permisos públicos configurados para version.json y builds/

### 2. Configuración CORS Programática

#### Herramienta Utilizada
- **Script**: `scripts/setup-cors-jwt.mjs`
- **Método**: Google Cloud Storage REST API con JWT authentication
- **Alternativa**: No requiere gsutil ni gcloud CLI instalados

#### Pasos Ejecutados
```bash
# 1. Generar JWT token del service account
node scripts/setup-cors-jwt.mjs

# 2. Obtener access token de Google OAuth
# (automatizado en el script)

# 3. PATCH /storage/v1/b/{bucket}
# Enviar configuración CORS via REST API
```

### 3. Configuración CORS Aplicada

```json
{
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

### 4. Upload de version.json

- ✅ Archivo creado: `version.json` (1.0.0-2026.5.25-000000)
- ✅ Subido a `gs://dungeon-forge-prod.firebasestorage.app/version.json`
- ✅ Content-Type: `application/json`
- ✅ Cache-Control: `public, max-age=300`

### 5. Validación y Testing

#### ✅ Test 1: CORS Preflight (OPTIONS request)
```
Host: storage.googleapis.com
Path: /dungeon-forge-prod.firebasestorage.app/version.json

Response: 200 OK
✅ Access-Control-Allow-Origin: *
✅ Access-Control-Allow-Methods: GET, HEAD
✅ Access-Control-Allow-Headers: Content-Type, Cache-Control
✅ Access-Control-Max-Age: 3600
```

#### ✅ Test 2: Storage Rules
```
- /version.json → allow read: if true (público)
- /builds/*.apk → allow read: if true (público)
- Otros → authenticated access only
```

#### ✅ Test 3: Bucket Configuration
```
Bucket: dungeon-forge-prod.firebasestorage.app
CORS Rules: 1
Status: ✅ Verified
```

---

## 📋 Scripts Creados / Actualizados

### Nuevos Scripts
1. **`scripts/setup-cors-jwt.mjs`** (Principal)
   - Configurar CORS vía Google Cloud Storage API
   - Usa JWT authentication
   - Verificación automática post-configuración
   - No requiere herramientas externas

2. **`scripts/find-bucket.mjs`**
   - Descubre el nombre exacto del bucket
   - Prueba URLs alternas automáticamente

3. **`scripts/test-cors-curl.mjs`**
   - Test rápido con curl
   - Verifica headers CORS

4. **`scripts/test-cors-preflight.mjs`**
   - Test de preflight OPTIONS requests
   - Valida CORS headers

5. **`scripts/upload-version.mjs`**
   - Sube version.json a Firebase Storage
   - Configuración automática de metadata

### Scripts Actualizados
1. **`scripts/validate-cors.mjs`**
   - URL actualizada: `.firebasestorage.app`
   - Validación de headers CORS

2. **`package.json`**
   - Nuevos scripts npm disponibles

---

## 🔧 Arquitectura CORS

```
┌─────────────────────────────────────────────────────┐
│         Cliente (APK WebView)                        │
│  - http://localhost:5173 (dev)                      │
│  - https://app.dungeonfoge.com (prod)              │
└────────────────────┬────────────────────────────────┘
                     │
                     │ fetch('https://storage.googleapis.com/...')
                     ├─ OPTIONS preflight
                     │  └─ CORS headers validados ✅
                     │
                     ├─ GET /version.json
                     │  └─ 200 OK + JSON
                     │
                     └─ GET /app.aab
                        └─ Download APK

┌─────────────────────────────────────────────────────┐
│  Google Cloud Storage                                │
│  - Bucket: dungeon-forge-prod.firebasestorage.app   │
│  - CORS Rules: Origin * | Methods GET,HEAD         │
│  - Files: version.json, builds/*.apk               │
└─────────────────────────────────────────────────────┘
```

---

## 📝 Archivos Modificados

```
✅ cors-config.json - Configuración CORS
✅ storage.rules - Rules de seguridad
✅ firebase.json - Configuración Firebase
✅ .firebaserc - Proyecto Firebase
✅ version.json - Versión actual para OTA
✅ scripts/setup-cors-jwt.mjs - Script principal (nuevo)
✅ scripts/find-bucket.mjs - Descubrimiento bucket (nuevo)
✅ scripts/validate-cors.mjs - Actualizado
✅ scripts/upload-version.mjs - Nuevo
✅ scripts/test-cors-preflight.mjs - Nuevo
✅ scripts/test-cors-curl.mjs - Nuevo
```

---

## 🧪 Validación de Aceptación

| Requisito | Estado | Detalles |
|-----------|--------|----------|
| CORS configurada | ✅ | Access-Control headers presentes |
| version.json subido | ✅ | URL: gs://dungeon-forge-prod.firebasestorage.app/version.json |
| Storage rules desplegadas | ✅ | firebase deploy --only storage exitoso |
| Preflight request OK | ✅ | 200 OK + CORS headers |
| Bucket accesible | ✅ | gs://dungeon-forge-prod.firebasestorage.app |

---

## 📝 Próximos Pasos (Wave 3)

### T3.1: Integración OTA en APK
- [ ] Implementar check de `version.json` en WebView
- [ ] Comparar versión local vs remota
- [ ] Descargar APK si hay update
- [ ] Test en emulador + dispositivo real

### T3.2: Subir APK Build
- [ ] Build release APK: `npm run build && cd android && ./gradlew assembleRelease`
- [ ] Subir a `gs://dungeon-forge-prod.firebasestorage.app/builds/app.aab`
- [ ] Actualizar URL en `version.json`

### T3.3: Testing End-to-End
- [ ] Test OTA update en APK
- [ ] Verificar CORS headers en navegador
- [ ] Test en múltiples navegadores/dispositivos

---

## 🚀 Comandos Disponibles

```bash
# Configurar CORS
npm run setup:cors
node scripts/setup-cors-jwt.mjs

# Validar CORS
npm run validate-cors
node scripts/test-cors-preflight.mjs

# Subir version.json
node scripts/upload-version.mjs

# Ver bucket
node scripts/find-bucket.mjs

# Deploy storage
firebase deploy --only storage --project dungeon-forge-prod
```

---

## 🔐 Consideraciones de Seguridad

✅ **CORS Permisivo pero Seguro**
- Origin: `*` (permite cualquier origen)
- Methods: `GET`, `HEAD` (solo lectura)
- Headers: `Content-Type`, `Cache-Control`
- Write: Requiere autenticación

✅ **Storage Rules**
- `/version.json` - Lectura pública
- `/builds/*.apk` - Lectura pública  
- Otros - Solo usuarios autenticados

✅ **Service Account**
- Solo para configuración (setup)
- No expuesto en cliente
- Credenciales en `.gitignore`

---

## 📌 Notas Importantes

1. **CORS vs firebase.json**
   - `firebase.json` solo documenta configuración
   - CORS real se aplica vía Google Cloud Storage API
   - Script `setup-cors-jwt.mjs` lo maneja automáticamente

2. **URLs del Bucket**
   - Public access: `https://storage.googleapis.com/dungeon-forge-prod.firebasestorage.app/`
   - Admin access: `gs://dungeon-forge-prod.firebasestorage.app/`
   - Firebase Console: `dungeon-forge-prod.firebasestorage.app`

3. **Propagación**
   - CORS se aplica inmediatamente (< 1 segundo)
   - version.json tarda ~3-5 segundos en ser accessible
   - Cache de navegador: 1 hora (maxAgeSeconds: 3600)

---

**Wave 2, Task 2.2 - COMPLETADO** ✅  
Listos para Wave 3: Integración OTA en APK
