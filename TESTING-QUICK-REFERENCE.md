# 🎯 Quick Reference - Testing Artifacts

## ⚡ Acceso Rápido

| Necesito... | Ubicación |
|------------|-----------|
| 📸 Ver screenshots | `testing/screenshots/{v1.3, v1.4, v1.5}/` |
| 📱 Instalar APK v1.5 | `testing/apk-builds/dungeon-forge-firebase-v1.5-debug.apk` |
| 📖 Leer documentación de fixes | `testing/documentation/FIREBASE-*.md` |
| 📊 Ver logs de debug | `testing/logs/logcat-*.txt` |
| 🧪 Ver scripts de testing | `testing/test-scripts/` |
| 📝 README completo | `testing/README.md` |

## 🚀 Comandos Útiles

### Instalar APK actual (v1.5)
```bash
adb install -r testing/apk-builds/dungeon-forge-firebase-v1.5-debug.apk
```

### Capturar logs durante testing
```bash
adb logcat > testing/logs/logcat-$(date +%Y%m%d-%H%M%S).txt &
```

### Tomar screenshot y guardar
```bash
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png testing/screenshots/v1.5/my-test.png
```

## 📋 Estructura Visual

```
testing/
├── 📂 apk-builds/          ← Instalar APKs aquí
│   └── dungeon-forge-firebase-v1.5-debug.apk
├── 📂 screenshots/         ← Ver screenshots
│   ├── v1.3/   (5 screenshots)
│   ├── v1.4/   (5 screenshots)
│   └── v1.5/   (2 screenshots)
├── 📂 logs/                ← Leer logs de debug
│   ├── logcat-*.txt
│   └── build_output.log
├── 📂 documentation/       ← Leer documentación
│   ├── FIREBASE-AUTH-FIX-v1.1.md
│   ├── FIREBASE-OAUTH-FIX-v1.2.md
│   └── FIREBASE-POPUP-FLOW-v1.3.md
├── 📂 test-scripts/        ← Scripts de testing
│   ├── test-*.ts/.js
│   └── TEST-RESULTS-*.json
└── 📄 README.md            ← Info completa
```

## 🎯 Testing Phases

### ✅ Completado
- [x] v1.3 - OAuth popup flow testing
- [x] v1.4 - Fallback polling testing
- [x] v1.5 - Resume listener deployment

### 🔄 En Progreso
- [ ] Completar Google OAuth en dispositivo
- [ ] Validar navegación a CharacterList
- [ ] Probar character creation con Firestore

### ⏳ Pendiente
- [ ] Party y campaign sync testing
- [ ] Merge a main branch

---

**Last Updated:** May 22, 2026 | **Status:** 🟢 Ready for manual testing
