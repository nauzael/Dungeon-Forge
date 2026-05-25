# T2 ADB Validation Matrix - GoogleSignIn plugin not implemented (Android)

Plan ID: 20260522-google-signin-plugin-not-implemented
Task ID: T2_adb_validation_matrix
Fecha: 2026-05-22
Owner: gem-mobile-tester (GPT-5.3-Codex)

## Objetivo
Estandarizar una validacion ADB reproducible para confirmar que el fix elimina el error "GoogleSignIn plugin is not implemented on android" y que login/logout nativo funciona sin crash.

## Pre-check rapido
Ejecutar en PowerShell desde raiz del repo:

```powershell
Set-Location 'i:\Apks\Dungeon Forge'
adb start-server
adb devices
```

Criterio de pre-check:
- PASS: al menos un dispositivo aparece como `device`.
- FAIL: no hay dispositivo o estado `unauthorized`.

## Comandos exactos (PowerShell)

### 1) Build + sync + APK debug
```powershell
Set-Location 'i:\Apks\Dungeon Forge'
npm run build
npx cap sync android
Set-Location 'i:\Apks\Dungeon Forge\android'
.\gradlew.bat clean assembleDebug
```

### 2) Install limpio y launch
```powershell
Set-Location 'i:\Apks\Dungeon Forge'
$pkg = 'com.tupaquete.dndcompanion'
$activity = "$pkg/.MainActivity"
$apk = 'android/app/build/outputs/apk/debug/app-debug.apk'

adb uninstall $pkg
adb install -r $apk
adb logcat -c
adb shell am start -n $activity
```

### 3) Stream de logs (sesion principal)
```powershell
adb logcat -v threadtime 2>&1 | Select-String '\[GoogleSignIn\]|\[GoogleSignInNative\]|\[Firebase Auth\]|\[Login\]|not implemented|AndroidRuntime|FATAL EXCEPTION|Sign-in failed|Initialization error'
```

### 4) Filtro de exito (terminal separada)
```powershell
adb logcat -v threadtime 2>&1 | Select-String '\[GoogleSignIn\] signInWithGoogle called|\[GoogleSignIn\] Account chooser opened|\[GoogleSignIn\] Sign-in successful|\[Firebase Auth\] Native plugin returned token|\[Firebase Auth\] Credential exchange successful|\[GoogleSignIn\] Sign-out complete'
```

### 5) Filtro de fallo (terminal separada)
```powershell
adb logcat -v threadtime 2>&1 | Select-String 'GoogleSignIn plugin is not implemented on android|\[GoogleSignInNative\] Native plugin error|AndroidRuntime|FATAL EXCEPTION|Sign-in failed|\[GoogleSignIn\] Initialization error|No implementation found for method'
```

## Matriz de validacion (pass/fail)

### Escenario A - Arranque app
- Paso: instalar APK y abrir MainActivity.
- Evidencia esperada: app abre sin cierre forzado.
- PASS: no aparece `AndroidRuntime` ni `FATAL EXCEPTION` en 30s post launch.
- FAIL: crash en launch o ANR.

### Escenario B - Login nativo Google
- Paso: tap en boton Login con Google, seleccionar cuenta.
- Evidencia esperada en logs:
  - `[GoogleSignIn] signInWithGoogle called`
  - `[GoogleSignIn] Account chooser opened`
  - `[GoogleSignIn] Sign-in successful`
  - `[Firebase Auth] Credential exchange successful`
- PASS: no aparece texto literal `GoogleSignIn plugin is not implemented on android` y se observa exchange exitoso.
- FAIL: aparece "not implemented", "No implementation found for method", error nativo o crash.

### Escenario C - Sign out nativo
- Paso: ejecutar logout desde UI.
- Evidencia esperada: `[GoogleSignIn] Sign-out complete` (o equivalente de exito sin error).
- PASS: logout finaliza sin error ni crash.
- FAIL: error en plugin, cierre forzado o estado de sesion inconsistente.

## Criterio final de dictamen
- PASS GLOBAL:
  - Build/sync/install completan sin error bloqueante.
  - Login nativo abre chooser y completa credential exchange.
  - No existe ninguna ocurrencia de `plugin is not implemented`.
  - Sign out nativo funciona sin crash.
- FAIL GLOBAL: cualquier criterio anterior falla.

## Troubleshooting inmediato

### 1) Dispositivo no detectado
```powershell
adb kill-server
adb start-server
adb devices
```
Si sigue en `unauthorized`, reconectar USB y aceptar fingerprint RSA en el dispositivo.

### 2) Logs vacios o ruido excesivo
```powershell
adb logcat -c
adb shell am force-stop com.tupaquete.dndcompanion
adb shell am start -n com.tupaquete.dndcompanion/.MainActivity
```
Repetir login y mantener filtro de fallo en terminal dedicada.

### 3) Sigue saliendo "plugin is not implemented"
Acciones inmediatas:
1. Verificar que el APK instalado corresponde al ultimo build (`clean assembleDebug`).
2. Re-ejecutar `npx cap sync android` antes de compilar.
3. Reinstalar APK con `adb uninstall` + `adb install -r`.
4. Confirmar en codigo que MainActivity registra `GoogleSignInPlugin` y que metodos publicos del plugin tienen `@PluginMethod`.

### 4) Crash en login
```powershell
adb logcat -d -v threadtime 2>&1 | Select-String 'AndroidRuntime|FATAL EXCEPTION|GoogleSignIn|Firebase Auth' -Context 3,3
```
Guardar extracto de stack trace y clasificar fallo como regression o platform_specific.

### 5) Build Android falla
```powershell
Set-Location 'i:\Apks\Dungeon Forge\android'
.\gradlew.bat clean
.\gradlew.bat assembleDebug --stacktrace
```
Corregir error de compilacion antes de repetir validacion runtime.

## Evidencia minima a guardar
- Comando ejecutado + timestamp.
- Extracto de logs de exito o fallo.
- Resultado por escenario A/B/C.
- Dictamen final PASS GLOBAL o FAIL GLOBAL.
