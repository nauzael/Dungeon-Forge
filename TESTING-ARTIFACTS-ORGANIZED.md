# 📂 Testing Artifacts Organization

Todos los artefactos de testing, debugging y validación han sido movidos a **`testing/`**.

## 🗂️ Estructura

```
✅ APK builds                  → testing/apk-builds/
✅ Screenshots (v1.3, v1.4, v1.5) → testing/screenshots/{version}/
✅ Debug logs (logcat, build)  → testing/logs/
✅ Firebase docs & fixes       → testing/documentation/
✅ Test scripts & results      → testing/test-scripts/
```

## 🚀 Ir a Testing

- **Ver todas las pruebas:** `testing/`
- **Ver README completo:** `testing/README.md`
- **Instalar v1.5 APK:** `adb install -r testing/apk-builds/dungeon-forge-firebase-v1.5-debug.apk`

## 📊 Últimas Versiones Probadas

| Versión | Último Status | Ubicación |
|---------|---------------|-----------|
| v1.3 | OAuth popup flow ✅ | `testing/screenshots/v1.3/` |
| v1.4 | Polling testing 🔄 | `testing/screenshots/v1.4/` |
| v1.5 | Resume listener 🔄 | `testing/screenshots/v1.5/` |

---

**✨ Raíz del proyecto está limpia. Todos los artefactos de testing están organizados en `testing/`**
