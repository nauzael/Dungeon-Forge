# 🔒 Remedación de Seguridad: Google API Key Leak

## Status: 95% Complete ✅

### Tareas Completadas
- ✅ Identificada y documentada clave API expuesta: `AIzaSyB-AhIG1Extbl0dr1795-My7AU4KiKLAA`
- ✅ Removida clave de git history (185 commits reescritos)
- ✅ Eliminada clave en Google Cloud Console
- ✅ Archivos `google-services.json` redactados con `REDACTED_GOOGLE_API_KEY`
- ✅ `.gitignore` actualizado para bloquear futuros leaks
- ✅ Script seguro para generar `google-services.json` desde variables de entorno

### Tarea Pendiente: Crear Nueva API Key (PASO FINAL)

#### Opción 1: Crear manualmente en Google Cloud Console (Recomendado)
1. Ve a: https://console.cloud.google.com/apis/credentials?project=dungeon-forge-prod
2. Click "Crear credenciales" → "Clave de API"
3. Selecciona "Apps para Android"
4. Click "Crear"
5. Copia la nueva clave: `AIzaSy...`
6. Ejecuta en terminal:
   ```powershell
   $env:VITE_GOOGLE_API_KEY = "AIzaSy..."
   node scripts/generate-google-services-json.mjs
   ```

#### Opción 2: Usar gcloud CLI
```powershell
# Login a gcloud (si no estás autenticado)
gcloud auth login

# Crear nueva API key
$key = gcloud services api-keys create --display-name="Android DND Companion" --api-target="maps-backend.googleapis.com" --format="value(name)"

# Generar google-services.json
$env:VITE_GOOGLE_API_KEY = $key
node scripts/generate-google-services-json.mjs
```

---

## 📋 Checklist Final de Seguridad

- [ ] Nueva API key creada en Google Cloud Console
- [ ] API key restringida a: Android apps, package `com.tupaquete.dndcompanion`
- [ ] Script ejecutado: `node scripts/generate-google-services-json.mjs`
- [ ] `google-services.json` regenerados en `/docs` y `/android/app`
- [ ] Verificar que build de Android aún funciona
- [ ] `.gitignore` contiene `**/google-services.json`
- [ ] `.env.example` documentado con instrucciones

---

## 🚨 Timeline del Incidente

| Fecha | Acción |
|-------|--------|
| 2026-05-26 01:15 | GitHub Alert: Clave API expuesta en commits públicos |
| 2026-05-26 01:30 | Investigación + identificación de clave |
| 2026-05-26 01:35 | `git filter-branch`: Removida de 185 commits |
| 2026-05-26 01:38 | Clave eliminada en Google Cloud Console |
| 2026-05-26 01:45 | `.gitignore` y scripts de seguridad implementados |
| **PENDIENTE** | Nueva clave creada y `google-services.json` regenerados |

---

## 🔐 Mejor Práctica para Futuro

**Nunca hardcodear claves API directamente en archivos versionados:**

```powershell
# ❌ MAL - Google Cloud detectará esto
const apiKey = "AIzaSy..."; // Expuesto en git history

# ✅ BIEN - Usar variables de entorno
const apiKey = process.env.VITE_GOOGLE_API_KEY;

# ✅ BIEN ALTERNATIVA - Cargar de archivo .env (no versionado)
import dotenv from 'dotenv';
dotenv.config();
const apiKey = process.env.VITE_GOOGLE_API_KEY;
```

---

## 📝 Archivos Modificados en esta Remedación

1. **`.gitignore`** - Bloquea `google-services.json` y otros archivos sensibles
2. **`.env.example`** - Template con variables requeridas
3. **`scripts/generate-google-services-json.mjs`** - Script seguro para generar config
4. **`docs/google-services.json`** - Redactado (NO contiene clave real)
5. **`android/app/google-services.json`** - Redactado (NO contiene clave real)
6. **`.git`** - Historia limpia (185 commits reescritos sin clave)

---

## ✅ Verificación Final

Para verificar que todo está limpio:

```powershell
# Verificar que la clave NO está en git
git log -p --all | Select-String "AIzaSyB-AhIG1Extbl0dr1795-My7AU4KiKLAA" -ErrorAction SilentlyContinue
# Resultado esperado: (vacío)

# Verificar que google-services.json está en .gitignore
cat .gitignore | Select-String "google-services.json"
# Resultado esperado: **/google-services.json

# Verificar que .env está ignorado
cat .gitignore | Select-String ".env"
# Resultado esperado: .env, .env.local, .env.*.local
```

---

## 🎯 Próximos Pasos

1. **Crear nueva API key** (Ver sección "Tarea Pendiente" arriba)
2. **Regenerar `google-services.json`** con nuevo script
3. **Probar build de Android**: `npm run build && cd android && ./gradlew assembleDebug`
4. **Verificar que app inicia** sin errores de autenticación
5. **Limpiar credenciales viejas** en Google Cloud si quedan

---

**Contacto en caso de dudas**: Ver `README.md` o `AGENTS.md` para asistencia.
