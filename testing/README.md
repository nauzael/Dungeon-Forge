# 🧪 Testing & Debug Artifacts

Carpeta centralizada para todos los artefactos de testing, debugging y validación de la aplicación Dungeon Forge.

## 📁 Estructura

```
testing/
├── apk-builds/          # APK de debug compiladas para cada versión
│   └── dungeon-forge-firebase-v*.apk
│
├── screenshots/         # Capturas de pantalla organizadas por versión
│   ├── v1.3/           # OAuth popup flow testing
│   ├── v1.4/           # Fallback polling testing
│   └── v1.5/           # Resume listener improvements
│
├── logs/                # Logs capturados durante testing
│   ├── logcat-*.txt    # Android device logs
│   └── build_output.log # Build output logs
│
├── documentation/       # Documentos de testing y fixes aplicados
│   ├── FIREBASE-AUTH-FIX-v1.1.md
│   ├── FIREBASE-OAUTH-FIX-v1.2.md
│   ├── FIREBASE-POPUP-FLOW-v1.3.md
│   └── FIREBASE-TESTING-READY.md
│
└── test-scripts/        # Scripts de testing y validación
    ├── test-*.ts/.js   # Test unitarios y e2e
    └── TEST-RESULTS-*.json # Resultados de tests
```

## 🚀 Versiones Testeadas

| Versión | Focus | Status | Date |
|---------|-------|--------|------|
| v1.3 | OAuth popup flow en Capacitor | ✅ | 2026-05-21 |
| v1.4 | Fallback polling + localStorage | ⚠️ | 2026-05-22 |
| v1.5 | Resume listener + improved polling | 🔄 In Progress | 2026-05-22 |

## 📸 Screenshots por Versión

### v1.3 - OAuth Popup Flow
- `firebase-login-v1.3-after-click.png` - Estado después del click
- `firebase-login-v1.3-popup.png` - Popup abierto
- `firebase-login-v1.3-verification.png` - Pantalla de verificación
- `firebase-login-v1.3-back.png` - Regreso a la app
- `firebase-login-v1.3-final.png` - Estado final

### v1.4 - Login with Loading State
- `v1.4-test-screen.png` - Pantalla inicial
- `v1.4-after-click.png` - Estado post-click
- `v1.4-app-foreground.png` - App en foreground
- `v1.4-wait-3sec.png` - Después de esperar

### v1.5 - Resume Listener Improvements
- `v1.5-startup.png` - Startup inicial
- `v1.5-final-startup.png` - Con fixes aplicados

## 🔍 Testing Workflow

### Para instalar un APK de testing:
```bash
adb install -r testing/apk-builds/dungeon-forge-firebase-v1.5-debug.apk
```

### Para capturar nuevos logs:
```bash
adb logcat -c              # Clear logs
adb logcat > testing/logs/logcat-new.txt &
# ... run app ...
pkill logcat
```

### Para tomar screenshots durante testing:
```bash
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png testing/screenshots/v1.5/my-screenshot.png
```

## 📝 Key Issues Fixed

### v1.3 → v1.4
- ❌ `sessionStorage` error en Capacitor 
- ✅ Implementó polling fallback (500ms)

### v1.4 → v1.5
- ❌ App stuck en loading después del popup
- ✅ Agregó `resume` listener
- ✅ Mejoró detección de sesión en localStorage

## 🎯 Next Testing Steps

1. ✅ Completar OAuth en dispositivo
2. ✅ Validar navegación a CharacterList
3. ⏳ Probar creación de personaje con Firestore sync
4. ⏳ Validar party y campaign features

---

**Last Updated:** May 22, 2026  
**Testing Branch:** feature/firebase-migration  
**Main App:** Dungeon Forge v1.0
