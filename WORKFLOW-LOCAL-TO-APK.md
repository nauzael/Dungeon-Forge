# 🚀 Workflow Local → APK (Garantizado Sincronizado)

## El Problema (Resuelto)
Anteriormente:
- Procesos Node.js viejos se quedaban en puerto 5173
- Vite fallaba a puerto 5174
- Usuario miraba puerto 5173 (viejo, sin cambios)
- Confusión entre qué versión estaba viendo

## ✅ La Solución (Workflow Automático)

### 1. **Desarrollo Local (SIEMPRE)**

```bash
npm run dev
```

Este comando AHORA:
1. ✅ Mata automáticamente procesos Node.js en puertos 5173-5175
2. ✅ Inicia Vite limpio en http://localhost:5173
3. ✅ Muestra los cambios con HMR instant

**Lo que ves en localhost:5173 es lo que va a la APK** (misma compilación, mismo código).

### 2. **Validar Cambios en Local**

```
http://localhost:5173
→ Login con Google (misma cuenta que APK)
→ Navega a tu personaje Wizard
→ SpellsTab → "Open Grimoire"
→ Prueba: Delete spell, navbar oculta, etc.
```

### 3. **Build Pre-OTA (Verificación)**

Una vez que TODO funciona en local:

```bash
npm run build
npm run preview
```

Esto compila a `dist/` y muestra la versión **de producción** (exacta como la APK la verá).

Debe verse **IDÉNTICO** a lo que viste en `npm run dev`. Si se ve diferente, hay un problema de compilación.

### 4. **Desplegar a APK**

Cuando todo está validado en local + preview:

```bash
node scripts/build_ota.mjs
```

O directamente:

```bash
npm run ota
```

Esto:
1. Compila (`npm run build`)
2. Empaqueta a ZIP
3. Sube a Supabase
4. Genera versión OTA (ej: `v1.0.0-2026.5.13-121636`)

### 5. **En la APK**

Menú → Sincronizar (descarga OTA nueva)

---

## 📋 Comandos Disponibles

| Comando | Hace | Cuándo usar |
|---------|------|------------|
| `npm run dev` | Limpia procesos viejos + inicia dev | **Siempre** (desarrollo iterativo) |
| `npm run dev:only` | Inicia Vite directo sin limpiar | Raramente (si sabes que está limpio) |
| `npm run dev:clean` | Alias de `npm run dev` | Si prefieres nombre explícito |
| `npm run build` | Compila a `dist/` | Antes de preview/OTA |
| `npm run preview` | Visualiza build de producción | Para verificar que todo se ve igual |
| `npm run ota` | Build + OTA upload | Para desplegar a producción |

---

## 🛡️ Garantías

### ✅ Local (`npm run dev`) = APK Compilada

```
npm run dev → localhost:5173 
    ↓
    Mismo código que ve Vite
    ↓
npm run build → dist/
    ↓
    Mismo resultado (transpilación idéntica)
    ↓
npm run preview → localhost:4173
    ↓
    Visualización de producción (AKA lo que APK descarga)
```

### ✅ Datos Siempre Sincronizados

Todos los ambientes (local, preview, APK) usan **la misma Supabase**:
- Personajes = mismo Supabase
- Settings = mismo Supabase  
- OTA updates = mismo bucket de Supabase

---

## 🔧 Si Algo Sale Mal

| Síntoma | Causa | Fix |
|---------|-------|-----|
| Dev server en puerto 5174 en lugar de 5173 | Proceso viejo aún corriendo | `npm run dev` lo limpia automáticamente |
| Cambios no aparecen en local pero sí en APK | APK tiene OTA más nueva | Probar `npm run dev` (limpia cache) + Ctrl+Shift+R |
| Build de producción se ve diferente a dev | Error silencioso TypeScript | `npm run build` muestra errores, fix y retry |
| APK no descarga OTA nueva | Service Worker cacheado | En APK: Menú → "Forzar Sincronización" |

---

## 📝 Workflow Típico (Día a Día)

```bash
# 1. Inicia dev (limpia automáticamente)
npm run dev

# 2. Haces cambios en los archivos (HMR instant en navegador)
# Editas WizardGrimoireManager.tsx, SpellsTab.tsx, etc.

# 3. Verificas en http://localhost:5173
# Loguéate → Wizard → Spells → prueba cambios

# 4. Una vez validado TODO:
npm run build
npm run preview  # Verifica que se vea igual

# 5. Si preview == dev, entonces:
npm run ota      # Sube a APK

# 6. En APK: Menú → Sincronizar
```

---

## 💡 Pro Tips

- **Never** hagas `Stop-Process` en PowerShell para detener dev server. Usa **Ctrl+C** en la terminal.
- **Always** haz un `npm run preview` antes de OTA para asegurar que el build es correcto.
- **Si duda**: Los datos vienen de Supabase, así que local y APK ven siempre lo mismo (excepto la UI/código).

---

## 🎯 Resumen: Esto Nunca Vuelve a Pasar

✅ `npm run dev` limpia procesos viejos automáticamente  
✅ Vite siempre usa puerto 5173 (si está libre)  
✅ HMR configurado explícitamente para no confundirse  
✅ Workflow documentado y repetible  
✅ Comandos claros para dev → preview → OTA
