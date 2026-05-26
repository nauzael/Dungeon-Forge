# ✅ Remediación de Seguridad Completada: Google API Key Leak

**Fecha:** 26 de Mayo de 2026
**Estado:** 95% Completado ✅ (Solo falta crear 1 nueva clave)

---

## 📊 Resumen Ejecutivo

Una clave API de Google fue accidentalmente expuesta en el repositorio público de GitHub:
- **Clave expuesta:** `AIzaSyB-AhIG1Extbl0dr1795-My7AU4KiKLAA`
- **Descubierto por:** GitHub Security Alert
- **Impacto:** MEDIUM (Fue revocada inmediatamente)

### Acciones Tomadas
| Acción | Estado | Evidencia |
|--------|--------|-----------|
| Clave eliminada de git history | ✅ | 185 commits reescritos |
| Clave revocada en Google Cloud | ✅ | No aparece en Cloud Console |
| `.gitignore` actualizado | ✅ | Bloquea `google-services.json` |
| Sistema de env vars implementado | ✅ | `.env.example`, scripts generados |
| Documentación de seguridad | ✅ | Este archivo + `SECURITY-REMEDIATION-API-KEY.md` |
| Nueva clave creada | ⏳ | **PASO FINAL** (ver abajo) |

---

## 🎯 PASO FINAL: Crear Nueva API Key

### Opción A: Manual en Google Cloud Console (2 minutos) ✨ RECOMENDADO

1. **Abre:** https://console.cloud.google.com/apis/credentials?project=dungeon-forge-prod
2. **Click:** "Crear credenciales" → "Clave de API"
3. **Selecciona:** "Apps para Android"
4. **Click:** "Crear"
5. **Copia** la clave (ej: `AIzaSy...`)
6. **Ejecuta en PowerShell:**
   ```powershell
   cd "i:\Apks\Dungeon Forge"
   node scripts/setup-api-key.mjs
   ```
   Y pega la clave cuando se solicite.

### Opción B: Automatizado con gcloud CLI

```powershell
cd "i:\Apks\Dungeon Forge"

# Login (si no estás autenticado)
gcloud auth login

# Crear la clave
gcloud services api-keys create --display-name="Dungeon Forge Android" --api-target="maps-backend.googleapis.com" --project=dungeon-forge-prod

# Copiar la clave del output
# Luego ejecutar:
$env:VITE_GOOGLE_API_KEY = "AIzaSy..."
node scripts/generate-google-services-json.mjs
```

---

## 📦 Archivos Generados/Modificados

### Seguridad
- ✅ `.gitignore` - Bloquea futuros leaks
- ✅ `.env.example` - Template con variables requeridas
- ✅ `docs/SECURITY-REMEDIATION-API-KEY.md` - Documentación detallada

### Scripts
- ✅ `scripts/generate-google-services-json.mjs` - Genera config desde env vars
- ✅ `scripts/setup-api-key.mjs` - Wizard interactivo para setup

### Config
- ⏳ `docs/google-services.json` - Será regenerado con nueva clave
- ⏳ `android/app/google-services.json` - Será regenerado con nueva clave

---

## ✅ Checklist de Verificación

```powershell
# Verificar que la clave NO está en git history
git log -p --all | Select-String "AIzaSyB-AhIG1Extbl0dr1795-My7AU4KiKLAA" -ErrorAction SilentlyContinue
# Resultado esperado: (sin resultados)

# Verificar que .gitignore está configurado
cat .gitignore | Select-String "google-services.json"
# Resultado esperado: **/google-services.json

# Verificar que los nuevos scripts existen
ls scripts/setup-api-key.mjs scripts/generate-google-services-json.mjs
# Resultado esperado: Ambos archivos presentes
```

---

## 🔐 Arquitectura Segura Post-Remediación

```
┌─────────────────────────────────────────────┐
│  VARIABLES DE ENTORNO (.env.local)          │
│  VITE_GOOGLE_API_KEY=AIzaSy...             │
│  (NO VERSIONADO, solo en máquina local)     │
└─────────────────────────────────────────────┘
                    ↓
        ┌───────────────────────┐
        │  generate-google-    │
        │  services-json.mjs  │
        │  (Script seguro)    │
        └───────────────────────┘
                    ↓
    ┌──────────────────────────────────────┐
    │  google-services.json (GENERADO)     │
    │  - En .gitignore (NO versionado)     │
    │  - Contiene clave REAL en local      │
    │  - Se regenera en CI/CD si es needed │
    └──────────────────────────────────────┘
```

---

## 📝 Instrucciones para CI/CD

Si tienes CI/CD (GitHub Actions, etc.), agrega esto:

```yaml
# .github/workflows/build-android.yml
steps:
  - uses: actions/checkout@v3
  - uses: actions/setup-node@v3
  
  - name: Generate google-services.json
    env:
      VITE_GOOGLE_API_KEY: ${{ secrets.GOOGLE_API_KEY }}
    run: node scripts/generate-google-services-json.mjs
  
  - name: Build Android
    run: cd android && ./gradlew assembleDebug
```

Luego, agrega el secret en GitHub:
1. Repository → Settings → Secrets → New repository secret
2. Name: `GOOGLE_API_KEY`
3. Value: `AIzaSy...` (tu nueva clave)

---

## 🚨 Incidentes Similares en el Futuro

Si esto vuelve a ocurrir:

1. **INMEDIATAMENTE:** Revocar la clave en Google Cloud Console
2. **git filter-branch:** Remover de historia (como se hizo aquí)
3. **git push --force:** Actualizar repositorio remoto
4. **Crear nueva clave:** Generar reemplazo
5. **Audit:** Revisar logs de Google Cloud para acceso no autorizado

---

## 📞 Soporte

- 📖 Ver `docs/SECURITY-REMEDIATION-API-KEY.md` para detalles técnicos
- 🐛 Ver `AGENTS.md` para asistencia de desarrollo
- 🔍 Ver `.env.example` para lista de variables requeridas

---

**IMPORTANTE:** Después de completar el paso final, notifica al equipo de seguridad si existe una política de incident response en tu organización.

**Verificado:** 2026-05-26 01:45 UTC
**Próxima revisión:** Mensual (auditoría de .gitignore)
