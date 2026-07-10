## 🔍 ANÁLISIS FIREBASE & OTA - DUNGEON FORGE

### RESUMEN EJECUTIVO

Se realizó un análisis profundo de la arquitectura Firebase y el sistema OTA del proyecto Dungeon Forge. **Firebase está totalmente configurado** con credenciales de producción. El sistema OTA funciona **solo en APK** (no en web) mediante CapacitorUpdater (Capgo). Se identificó **1 bloqueador crítico** y **3 problemas potenciales**.

---

## 1️⃣ ESTADO ACTUAL DE FIREBASE

### Configuración ✅

| Componente | Estado | Ubicación |
|-----------|--------|-----------|
| **Credenciales** | ✅ Configuradas (reales) | `.env` líneas 3-9 |
| **Proyecto** | ✅ dungeon-forge-prod | Firebase Console |
| **Auth** | ✅ Google OAuth | `firebase.ts:82-127` |
| **Firestore** | ✅ Characters + Parties | `firebase.ts:40-50` |
| **Realtime DB** | ✅ Party resources | `firebase.ts:70` |
| **Storage** | ✅ OTA packages | `firebase.ts:49` |

### Inicialización de Firebase

```typescript
// firebase.ts:49-70
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  // ... más configs
};

let firebaseApp = initializeApp(firebaseConfig);
let authInstance = getAuth(firebaseApp);
let firestoreInstance = getFirestore(firebaseApp);
```

**Envoltorio Supabase:** La app expone Firebase como `supabase` para compatibilidad:

```typescript
// firebase.ts:82-127
export const supabase = {
  auth: {
    getSession: async () => { /* Firebase session */ },
    onAuthStateChange: (callback) => { /* Firebase auth state */ },
    signInWithOAuth: async (options) => { /* Firebase OAuth */ }
  },
  // ... más métodos
};
```

---

## 2️⃣ CONFIGURACIÓN OTA ACTUAL

### Arquitectura OTA

```
App.tsx (startup)
  ↓
CapacitorUpdater.notifyAppReady() [línea 205]
  ↓
checkForUpdates() [línea 210-250]
  ↓
fetch(`https://storage.googleapis.com/{BUCKET}/version.json`)
  ↓
¿Versión remota > app_version (localStorage)?
  ↓ SÍ
CapacitorUpdater.download({url, version})
  ↓
Esperar 4 segundos
  ↓
CapacitorUpdater.set({id}) → Reinicio
```

### Estructura de version.json

Generado por `scripts/build_ota.mjs`:

```json
{
  "version": "1.1.0-2026.5.13-162947",
  "url": "https://storage.googleapis.com/dungeon-forge-prod.firebasestorage.app/app-update-1.1.0-2026.5.13-162947.zip",
  "message": "Correcciones y mejoras menores en la estabilidad de Dungeon Forge."
}
```

### Script OTA (build_ota.mjs)

```typescript
// scripts/build_ota.mjs:1-100
1. Lee .env para obtener VITE_FIREBASE_STORAGE_BUCKET
2. Carga credenciales de Firebase Service Account (archivo en root)
3. Empaqueta dist/ en ZIP (nivel 9 compresión)
4. Genera version.json con metadatos
5. Sube ambos a Firebase Storage via Admin SDK
6. Hace archivos públicos (cacheControl: public, max-age=31536000)
```

**Comando:**
```bash
npm run ota "Descripción de cambios"  # build_ota.mjs es un Node.js script ESM
```

---

## 3️⃣ DIFERENCIAS WEB VS APK

### Tabla Comparativa

| Aspecto | Web | APK |
|---------|-----|-----|
| **OTA** | ❌ NO | ✅ SÍ (CapacitorUpdater) |
| **Auth Flow** | Redirect (navegador) | Popup o Native Plugin |
| **Storage** | CDN/servidor web | WebView de Capacitor |
| **Deeplinks** | N/A | ✅ Intent filters (OAuth) |
| **Config Runtime** | Vite build-time | Desde .env |
| **Actualización** | Deploy manual | OTA automático |

### Autenticación: Diferencia Crítica

**WEB (firebase.ts:228-240):**
```typescript
if (platform === 'web') {
  console.log('[OAuth] Using REDIRECT flow for web');
  await signInWithRedirect(authInstance, provider);
  // Navega fuera de la app → Google login → redirige a callback
}
```

**APK (firebase.ts:206-225):**
```typescript
if (platform === 'android') {
  console.log('[Login] Using NATIVE GOOGLE SIGN-IN for Android');
  return await signInWithGoogleNativeFirebase();
  // → GoogleSignInPlugin (nativo) → ID token → Firebase credential
}
```

---

## 4️⃣ ARCHIVOS CRÍTICOS

### Estructura de Archivos

```
├── .env                              # Firebase credentials (REAL)
│   └── VITE_FIREBASE_* vars
│
├── firebase.ts                       # Firebase init + Auth wrapper
│   ├── firebaseConfig (línea 49)
│   ├── initializeApp() (línea 70)
│   ├── supabase wrapper (línea 82)
│   └── signInWithGoogleNativeFirebase() (línea 301)
│
├── App.tsx                           # Orquestador + OTA logic
│   ├── updateAvailable state (línea 46)
│   ├── checkForUpdates() (línea 210)
│   ├── deeplink handler (línea 140)
│   └── appStateChange listener (línea 160)
│
├── capacitor.config.json            # Capacitor config
│   ├── GoogleSignIn plugin (línea 13)
│   └── webDir: "dist" (línea 3)
│
├── firestore.rules                  # Security rules
│   ├── /characters/{charId} collection
│   └── Verificación user_id == uid
│
├── android/
│   ├── app/build.gradle             # Google Play Services 21.0.0
│   ├── app/AndroidManifest.xml      # OAuth deeplink intent filter
│   └── app/src/main/java/
│       └── GoogleSignInPlugin.java  # Native Google Sign-In
│
├── docs/google-services.json        # ⚠️ INCORRECTA UBICACIÓN
│   └── Debería estar en: android/app/google-services.json
│
└── scripts/
    └── build_ota.mjs                # OTA packaging + upload
```

---

## 5️⃣ DIAGNÓSTICO - PUNTOS DE QUIEBRE

### 🔴 BLOQUEADOR CRÍTICO #1: google-services.json en ubicación incorrecta

**Problema:**
```
Ubicación actual:   docs/google-services.json
Ubicación esperada: android/app/google-services.json
```

**Impacto:**
- Android Gradle **no encuentra** el archivo durante build
- Native Google Sign-In no está configurado
- APK puede compilar pero OAuth nativo fallará en el dispositivo

**Solución:**
```bash
cp docs/google-services.json android/app/google-services.json
npx cap sync android
./gradlew clean assembleDebug
```

---

### 🟡 PROBLEMA #2: Firebase Storage CORS

**Contexto:**
App.tsx línea 172 fetches:
```typescript
const resp = await fetch(`https://storage.googleapis.com/${storageBucket}/version.json?t=${Date.now()}`);
```

**Riesgo:**
Si CORS no está configurado en Firebase Storage, el fetch falla con **CORS error** → OTA nunca se descarga.

**Verificación:**
1. Firebase Console → Storage
2. Verificar CORS rules (debería permitir browser)
3. Prueba: `curl -i https://storage.googleapis.com/{bucket}/version.json`

---

### 🟡 PROBLEMA #3: OTA solo funciona en APK

**Contexto:**
- Web: Uso de `CapacitorUpdater` no tiene sentido (está deshabilitado)
- APK: CapacitorUpdater funciona

**Implicación:**
- **Web updates** = manual deploy (redeploy a servidor/CDN)
- **APK updates** = automático (OTA)

**Pregunta:** ¿Se espera que web tenga actualizaciones automáticas?

---

### 🟡 PROBLEMA #4: Falta script restore_ota.mjs

**Contexto:**
AGENTS.md menciona:
```bash
node scripts/restore_ota.mjs 1.1.0-2026.5.13-144500 "Rollback completo"
```

**Realidad:** Script no existe en workspace.

**Impacto:**
- No hay rollback automático si OTA falla
- Si versión mala se publica, usuarios quedan atrapados

---

## 6️⃣ FLUJOS DE DATOS

### Autenticación (Secuencia Temporal)

```
┌─── WEB ─────────────────┐
│ 1. Login.tsx: "Sign in" │
│ 2. supabase.auth.signInWithOAuth()
│ 3. firebase.ts: signInWithRedirect()
│ 4. ❌ App leaves (navigate to Google)
│ 5. User grants permission
│ 6. ✅ Firebase redirects to deeplink
│ 7. App.tsx: deeplink handler
│ 8. Extract tokens from URL hash
│ 9. Firebase auth state fires
│ 10. Session stored in localStorage
└──────────────────────────┘

┌─── APK (Android) ───────────────────┐
│ 1. Login.tsx: "Sign in"              │
│ 2. supabase.auth.signInWithOAuth()   │
│ 3. firebase.ts: detecta platform='android'
│ 4. Llama signInWithGoogleNativeFirebase()
│ 5. GoogleSignInPlugin.java: native Google Sign-In UI
│ 6. User grants permission
│ 7. Plugin returns: {idToken, email, displayName}
│ 8. firebase.ts: GoogleAuthProvider.credential(idToken)
│ 9. signInWithCredential(authInstance, credential)
│ 10. Session established
│ 11. Session stored en localStorage
└──────────────────────────────────────┘
```

### OTA (Secuencia Temporal)

```
1. npm run ota "mensaje"
   ↓
2. build_ota.mjs corre
   - Carga Service Account JSON
   - Empaqueta dist/ → app-update-{version}.zip
   - Genera version.json
   - Sube ambos a Firebase Storage
   ↓
3. App.tsx (en APK/web) detecta nuevo version.json
   - checkForUpdates() cada 10 minutos O al resume
   ↓
4. Compara versiones
   - localStorage 'app_version' vs remote version
   ↓
5. Si remota > local:
   - CapacitorUpdater.download(url) [APK solo]
   - user ve popup (4s timer)
   - CapacitorUpdater.set(id)
   ↓
6. App restarts con nuevo código
```

---

## 7️⃣ RECOMENDACIONES INICIALES

### 🔴 ALTO PRIORIDAD

1. **Mover google-services.json a android/app/**
   - Comando: `cp docs/google-services.json android/app/google-services.json`
   - Verificar: Build sin errores `./gradlew assembleDebug`
   - Impacto: Fija Native Google Sign-In

2. **Verificar Firebase Storage CORS**
   - Firebase Console → Storage → CORS rules
   - Debe permitir origin de web + APK
   - Test: `curl -i https://storage.googleapis.com/{bucket}/version.json`

3. **Implementar script restore_ota.mjs**
   - Crear rollback capability
   - Permitir volver a versión anterior si OTA falla
   - Doc: AGENTS.md línea 176-191 (pero script falta)

### 🟡 MEDIA PRIORIDAD

4. **Clarificar estrategia de updates para web**
   - ¿Web usa OTA o deploy tradicional?
   - Si OTA: documentar
   - Si deploy: remover lógica OTA de web

5. **Documentar OTA en README/WIKI**
   - Cómo ejecutar: `npm run ota "mensaje"`
   - Cómo verificar: logs en APK
   - Cómo rollback: usar restore_ota.mjs

6. **Agregar error handling visible para OTA failures**
   - Mostrar toast/notificación si OTA falla
   - Permitir retry manual
   - Log detallado en debug panel

### 🟢 BAJA PRIORIDAD

7. **Agregar tests unitarios para firebase.ts + OTA logic**
   - Cubrir casos de error
   - Mock Firebase + CapacitorUpdater
   - Validar versiones

8. **Mejorar logs de OTA**
   - Mostrar estadísticas (MB descargado, tiempo)
   - Debug panel con estado OTA
   - Timeline de updates

---

## 8️⃣ MATRIZ DE DEPENDENCIAS

```
App.tsx
├─ firebase.ts (supabase wrapper)
│  ├─ Firebase SDK (Auth + Firestore + DB + Storage)
│  ├─ GoogleSignInPlugin.java (native OAuth)
│  └─ types.ts (Character, etc.)
├─ CapacitorUpdater (OTA)
│  └─ build_ota.mjs (genera updates)
├─ capacitor.config.json
├─ .env (credentials)
└─ AndroidManifest.xml (deeplinks)

build_ota.mjs
├─ firebase-admin SDK (upload)
├─ .env (credentials)
├─ dungeon-forge-prod-firebase-adminsdk-*.json (service account)
└─ dist/ (build output)
```

---

## 📊 TABLA DE CONFIGURACIÓN ACTUAL

| Configuración | Valor | Ubicación |
|---------------|-------|-----------|
| **Firebase Project** | dungeon-forge-prod | .env:4 |
| **API Key** | AIzaSyBYbp... | .env:3 |
| **Storage Bucket** | dungeon-forge-prod.firebasestorage.app | .env:6 |
| **Capacitor Updater** | @capgo/capacitor-updater@^6.0.0 | package.json |
| **Google Play Services** | 21.0.0 | android/app/build.gradle:42 |
| **Android Package** | com.tupaquete.dndcompanion | capacitor.config.json:1 |
| **OAuth Deeplink Scheme** | com.tupaquete.dndcompanion://login-callback | AndroidManifest.xml:26 |

---

## 📁 REFERENCIAS DE LÍNEAS DE CÓDIGO

**Firebase Init:**
- `firebase.ts:49-70` → Inicialización de Firebase

**OTA Logic:**
- `App.tsx:22` → Importa CapacitorUpdater
- `App.tsx:46` → Estado updateAvailable
- `App.tsx:210-250` → Lógica checkForUpdates()
- `scripts/build_ota.mjs:70-130` → Packaging + upload

**Auth:**
- `firebase.ts:82-127` → Supabase wrapper
- `firebase.ts:206-225` → Android native auth
- `firebase.ts:228-240` → Web redirect auth
- `firebase.ts:301-376` → signInWithGoogleNativeFirebase()

**Config:**
- `capacitor.config.json:13-16` → GoogleSignIn plugin
- `firestore.rules:23-43` → Security rules
- `AndroidManifest.xml:24-30` → OAuth deeplink

---

## 🎯 PRÓXIMOS PASOS SUGERIDOS

1. **Inmediato:** Mover google-services.json + compilar APK
2. **Esta semana:** Verificar CORS + documentar OTA process
3. **Esta semana:** Implementar restore_ota.mjs
4. **Luego:** Mejorar UX de OTA failures + tests

---

**Reporte Generado:** 2026-05-25 | **Archivo Completo:** `docs/plan/firebase_ota_architecture_analysis.yaml`
