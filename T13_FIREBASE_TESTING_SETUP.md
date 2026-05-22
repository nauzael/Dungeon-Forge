# Firebase Testing Setup - T13

## Paso 1: Obtener Credenciales del Proyecto Testing

Una vez creado el proyecto `dungeon-forge-testing` en Google Cloud:

1. Ir a **Firebase Console**: https://console.firebase.google.com/
2. Hacer clic en "Agregar proyecto" → Seleccionar **`dungeon-forge-testing`**
3. Habilitar **Firestore Database**:
   - Modo: **Prueba**
   - Región: `nam5`
4. Habilitar **Authentication** → Google provider
5. Click ⚙️ (Engranaje) → **Configuración del proyecto**
6. Tab **"Aplicaciones"** → Click **"Crear aplicación web"**
7. **Copiar el objeto JSON** completo bajo `firebaseConfig`

## Paso 2: Actualizar .env.testing

Editar el archivo `.env.testing` en la rama `testing/t13-android`:

```bash
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_PROJECT_ID=dungeon-forge-testing
VITE_FIREBASE_AUTH_DOMAIN=dungeon-forge-testing.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=dungeon-forge-testing.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=1:...:web:...
```

## Paso 3: Configurar OAuth Callback URL

En Firebase Console (`dungeon-forge-testing`):
1. **Authentication** → **Google** → Click edit
2. Agregar **URI autorizados**:
   ```
   http://localhost:5173
   https://dungeon-forge-testing.firebaseapp.com
   dngforge://auth-callback
   ```

## Paso 4: Compilar APK para Testing

```bash
# Desde la rama testing/t13-android
npm run build  # Esto leerá .env.testing automáticamente

cd android
./gradlew assembleDebug

# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

##  Paso 5: Instalar en Emulador

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## Paso 6: Ejecutar Manual Testing Protocol

Seguir el documento:
- `ANDROID_REGRESSION_MANUAL_PROTOCOL.md`

---

**Estado Actual:**
- ✅ Rama `testing/t13-android` creada
- ✅ `.env.testing` template preparado
- ⏳ Esperando proyecto `dungeon-forge-testing` en GCP (1-2 min)
- ⏳ Esperando credenciales de Firebase
