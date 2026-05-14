# 🚀 Production Deployment Checklist - Dungeon Forge

## ❌ PROBLEMA IDENTIFICADO

La app en producción (APK/iOS instalada) **NO se conecta a Supabase** porque:

1. ✅ El código está correcto
2. ✅ Las credenciales existen en Supabase project
3. ❌ **El archivo `.env` NO existe** en el repositorio
4. ❌ Por lo tanto, `npm run build` genera un APK sin credenciales incrustadas
5. ❌ App detecta credenciales vacías → fuerza `df_local_mode: true` → NO conecta a Supabase

---

## ✅ SOLUCIÓN

### Paso 1: Obtener Credenciales de Supabase

Tu proyecto Supabase es: **`usnlhzkpukkuwbtortil`**

1. Ve a: https://app.supabase.com/
2. Selecciona tu proyecto: `usnlhzkpukkuwbtortil`
3. En la barra lateral izquierda → **Settings** → **API**
4. Copia estos valores:
   - **Project URL** (es la URL base) → `https://usnlhzkpukkuwbtortil.supabase.co`
   - **Anon public key** (la primera key mostrada) → `eyJ...` (copiar todo)

### Paso 2: Crear Archivo `.env`

En la raíz del proyecto (`i:\Apks\Dungeon Forge\`), crea un archivo llamado `.env` con este contenido:

```env
# Supabase Configuration (obtener de https://app.supabase.com/)
VITE_SUPABASE_URL=https://usnlhzkpukkuwbtortil.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc... (PEGA TU ANON KEY AQUÍ)

# Optional: Telegram (si usas bot)
TELEGRAM_BOT_TOKEN=(opcional - dejar vacío si no usas)
```

**⚠️ IMPORTANTE:**
- `.env` está en `.gitignore` → NO será trackeado por git ✅ (seguro)
- Este archivo es LOCAL ONLY
- Cada developer/machine necesita su propio `.env`

### Paso 3: Rebuild APK/OTA

Una vez tengas el `.env` con credenciales correctas:

```bash
# Opción A: Rebuild producción
npm run build          # Genera /dist/ con credenciales incrustadas
npm run ota            # Crea OTA Update y lo sube a Supabase

# Opción B: Build Android APK (si prefieres distribución directa)
npm run build
cd android && ./gradlew assembleDebug
# APK estará en: android/app/build/outputs/apk/debug/
```

### Paso 4: Deploy a Usuarios

**OTA Update** (RECOMENDADO - automático):
- Usuarios abren la app
- Detectan OTA disponible en Supabase
- Se descarga automáticamente
- En próximo restart, usan versión nueva ✅

**Android APK** (si distribución directa):
- Comparte el APK con usuarios
- Ellos lo instalan manualmente

---

## 🔍 Verificación

Una vez desplegado, verifica que funciona:

1. Abre la app
2. Ve a **DM Panel**
3. Debería cargar parties desde **Supabase** (no localStorage)
4. Status debería ser **🟢 "Live"** (no "Connecting")
5. Verifica en console: debería ver `[DM] Loaded X characters from Supabase`

---

## 🛡️ Security Checklist

Antes de hacer el build:

- [ ] `.env` file creado localmente (NO en git)
- [ ] `VITE_SUPABASE_URL` = `https://usnlhzkpukkuwbtortil.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = valor real de Supabase (no placeholder)
- [ ] `.env` está en `.gitignore` ✅
- [ ] No subir `.env` a GitHub
- [ ] Si credenciales se exponen, rotar en Supabase Dashboard

---

## 📋 Troubleshooting

### App sigue diciendo "Connecting..."
- ✅ Verifica que `.env` existe en raíz del proyecto
- ✅ Verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` están seteados
- ✅ Ejecuta `npm run build` de nuevo
- ✅ Genera nuevo OTA o APK

### "RLS policy violation" error
- Esto es NORMAL si user no tiene permiso en Supabase (falta login)
- App fallback a localStorage automáticamente
- Verificar que OAuth flow funciona

### OTA no se descarga
- Verifica que `npm run ota` completó sin errores
- Espera 2-3 minutos (Supabase tarda en procesar)
- Cierra completamente la app (swipe-kill)
- Reabre la app

---

## 📞 Próximos Pasos

1. Obtén credenciales de Supabase
2. Crea `.env` file
3. Ejecuta `npm run build && npm run ota`
4. Distribuye a usuarios
5. Verifica que conecta correctamente

¿Necesitas ayuda con alguno de estos pasos?
