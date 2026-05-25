# Plan de Migración de Paneles de Depuración a Firebase

**Plan ID:** `20260525-fix-debug-panel-firebase`  
**Estado:** ✅ LISTO PARA EJECUTAR  
**Complejidad:** Simple | **Riesgo:** Bajo  
**Tiempo Total:** ~25 minutos

---

## 📋 Resumen Ejecutivo

Dos componentes de depuración muestran incorrectamente "❌ NOT CONFIGURED" para credenciales Supabase que no existen. Necesitan actualizarse para mostrar credenciales **Firebase** en su lugar.

| Componente | Ubicación | Cambio |
|-----------|-----------|--------|
| **ConnectionDebugPanel** | `components/DMDashboard/ConnectionDebugPanel.tsx` | Mostrar Firebase Project ID, Auth Domain, API Key (parcial) |
| **AuthDebugOverlay** | `components/AuthDebugOverlay.tsx` | Mostrar status de Firebase config con colores verde/rojo |

---

## 🎯 Variables de Entorno Disponibles

Todas las variables de Firebase están configuradas en `.env`:

```env
VITE_FIREBASE_PROJECT_ID=dungeon-forge-prod
VITE_FIREBASE_AUTH_DOMAIN=dungeon-forge-prod.firebaseapp.com
VITE_FIREBASE_API_KEY=AIzaSyBYbpNyUtDIrZCi_44_q1z41MEZpkcg6h8
VITE_FIREBASE_STORAGE_BUCKET=dungeon-forge-prod.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=955477498217
VITE_FIREBASE_APP_ID=1:955477498217:web:67c6bee9f88980d12a05f8
VITE_FIREBASE_DATABASE_URL=https://dungeon-forge-prod-default-rtdb.firebaseio.com
```

---

## 📊 Plan de Ejecución por Olas

### ONDA 1: ConnectionDebugPanel.tsx (10 min)

#### Tarea 1.1: Extraer credenciales Firebase (5 min)
**Ubicación:** Líneas 18-19 (useEffect)

**Cambio:**
```typescript
// ❌ ANTES
const url = import.meta.env.VITE_SUPABASE_URL || '';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
setSupabaseUrl(url);
setSupabaseKey(key);

// ✅ DESPUÉS
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || '';
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '';
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || '';
setFirebaseProjectId(projectId);
setFirebaseAuthDomain(authDomain);
setFirebaseApiKey(apiKey);
```

**Variables de estado a añadir:**
```typescript
const [firebaseProjectId, setFirebaseProjectId] = useState<string>('');
const [firebaseAuthDomain, setFirebaseAuthDomain] = useState<string>('');
const [firebaseApiKey, setFirebaseApiKey] = useState<string>('');
```

**Remover:**
```typescript
const [supabaseUrl, setSupabaseUrl] = useState<string>('');
const [supabaseKey, setSupabaseKey] = useState<string>('');
```

---

#### Tarea 1.2: Actualizar salida de reporte diagnóstico (5 min)
**Ubicación:** Línea ~35-40 en `handleCopy()`

**Cambio:**
```typescript
// ❌ ANTES
🔐 CREDENTIALS
URL: ${supabaseUrl || '❌ NOT CONFIGURED'}
Anon Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' + ` (${supabaseKey.length} chars)` : '❌ NOT CONFIGURED'}

// ✅ DESPUÉS
🔐 FIREBASE CONFIG
Project ID: ${firebaseProjectId || '❌ NOT CONFIGURED'}
Auth Domain: ${firebaseAuthDomain || '❌ NOT CONFIGURED'}
API Key: ${firebaseApiKey ? '✓ Present (' + firebaseApiKey.length + ' chars)' : '❌ NOT CONFIGURED'}
```

**Actualizar también las notas:**
```typescript
// ❌ ANTES
- If Credentials show ❌ NOT CONFIGURED: .env was not loaded during npm run build
- If Local Mode is ✅ ACTIVADO: Data comes from localStorage, NOT Supabase

// ✅ DESPUÉS
- If Firebase Config shows ❌ NOT CONFIGURED: .env was not loaded during npm run build
- If Local Mode is ✅ ACTIVADO: Data comes from localStorage, NOT Firebase Realtime
```

---

### ONDA 2: AuthDebugOverlay.tsx (10 min)

#### Tarea 2.1: Extraer estado de configuración Firebase (5 min)
**Ubicación:** Líneas 16-19 (useState) + 23-27 (useEffect)

**Cambio:**
```typescript
// ❌ ANTES
const [supabaseConfig, setSupabaseConfig] = useState<{
  url: string | null;
  hasKey: boolean;
}>({ url: null, hasKey: false });

useEffect(() => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  setSupabaseConfig({ url: url || null, hasKey: !!key });
}, []);

// ✅ DESPUÉS
const [firebaseConfig, setFirebaseConfig] = useState<{
  projectId: string | null;
  authDomain: string | null;
  hasApiKey: boolean;
}>({ projectId: null, authDomain: null, hasApiKey: false });

useEffect(() => {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  setFirebaseConfig({ 
    projectId: projectId || null, 
    authDomain: authDomain || null, 
    hasApiKey: !!apiKey 
  });
}, []);
```

---

#### Tarea 2.2: Actualizar sección de display en render (5 min)
**Ubicación:** Líneas 96-103 (sección "Supabase Config")

**Cambio:**
```typescript
// ❌ ANTES
<div className="bg-slate-800 px-4 py-2 border-b border-slate-700 text-xs">
  <div className="space-y-1">
    <div className={supabaseConfig.url ? 'text-green-400' : 'text-red-400'}>
      URL: {supabaseConfig.url ? '✓ Set' : '✗ MISSING'}
    </div>
    <div className={supabaseConfig.hasKey ? 'text-green-400' : 'text-red-400'}>
      Key: {supabaseConfig.hasKey ? '✓ Set' : '✗ MISSING'}
    </div>
    <div className="text-slate-400 text-[10px] font-mono break-all">
      {supabaseConfig.url && supabaseConfig.url.substring(0, 40)}...
    </div>
  </div>
</div>

// ✅ DESPUÉS
<div className="bg-slate-800 px-4 py-2 border-b border-slate-700 text-xs">
  <div className="space-y-1">
    <div className="text-slate-300 font-mono text-[11px] mb-2">🔥 FIREBASE CONFIG</div>
    <div className={firebaseConfig.projectId ? 'text-green-400' : 'text-red-400'}>
      Project ID: {firebaseConfig.projectId ? '✓ ' + firebaseConfig.projectId : '✗ MISSING'}
    </div>
    <div className={firebaseConfig.authDomain ? 'text-green-400' : 'text-red-400'}>
      Auth Domain: {firebaseConfig.authDomain ? '✓ Set' : '✗ MISSING'}
    </div>
    <div className={firebaseConfig.hasApiKey ? 'text-green-400' : 'text-red-400'}>
      API Key: {firebaseConfig.hasApiKey ? '✓ Configured' : '✗ MISSING'}
    </div>
    <div className="text-slate-400 text-[10px] font-mono break-all mt-1">
      {firebaseConfig.authDomain && firebaseConfig.authDomain.substring(0, 40)}...
    </div>
  </div>
</div>
```

---

## ✅ Criterios de Aceptación

### Por Componente

**ConnectionDebugPanel.tsx:**
- [ ] No hay refs a `VITE_SUPABASE_*` en el archivo
- [ ] Estado Firebase se extrae correctamente en useEffect
- [ ] Reporte diagnóstico muestra Firebase Project ID, Auth Domain, API Key
- [ ] No hay errores de consola al abrir panel

**AuthDebugOverlay.tsx:**
- [ ] No hay refs a `VITE_SUPABASE_*` en el archivo
- [ ] Estado Firebase se actualiza correctamente
- [ ] Panel muestra Project ID (con valor), Auth Domain, API Key status
- [ ] Colores verde (✓) para credenciales presentes, rojo (✗) para ausentes
- [ ] No hay errores de consola al abrir overlay

### Integración General
- [ ] `npm run build` completa sin errores (5.5s)
- [ ] `npm run dev` inicia sin warnings relacionados a credenciales
- [ ] Ambos paneles cargan y se abren sin errores
- [ ] Información displayed es consistente en ambos paneles

---

## 🧪 Estrategia de Testing

1. **Dev Mode:**
   ```bash
   npm run dev
   # Navegar a DM Dashboard o Auth screen
   # Abrir ConnectionDebugPanel y verificar Firebase config
   # Abrir AuthDebugOverlay y verificar Firebase config
   ```

2. **Verificar:**
   - ✅ Project ID muestra: `dungeon-forge-prod`
   - ✅ Auth Domain muestra: `dungeon-forge-prod.firebaseapp.com`
   - ✅ API Key muestra: `✓ Present (40 chars)` (mascado, solo cuenta)
   - ✅ No hay "❌ NOT CONFIGURED" en ningún campo

3. **Consola del Navegador:**
   - No debe haber errores sobre credenciales
   - No debe haber warnings de variables undefined

---

## 🔄 Plan de Rollback

Si algo falla:

```bash
# Revertir ambos archivos a HEAD
git checkout HEAD -- \
  components/DMDashboard/ConnectionDebugPanel.tsx \
  components/AuthDebugOverlay.tsx

npm run dev
```

**Impacto de rollback:** CERO (solo debug panels)

---

## 📈 Impacto

| Aspecto | Impacto |
|--------|--------|
| **Código de Producción** | ✅ NINGUNO |
| **Base de Datos** | ✅ NINGUNO |
| **Estado de Usuario** | ✅ NINGUNO |
| **Performance** | ✅ NINGUNO |
| **Funcionalidad** | 🔧 Debug panels solo |
| **Seguridad** | ✅ Ningún cambio |

---

## 📝 Notas Importantes

1. **Firebase está completamente configurado** en `.env` - no hay bloqueos
2. **Ambas tareas son independientes** pero en el mismo repo, se pueden hacer en paralelo
3. **Sin deps externas** - solo cambios de texto y env var references
4. **Reversible** - un `git checkout` deshace todo si algo sale mal
5. **Debug-only scope** - esto SOLO afecta lo que ven los desarrolladores en consola

---

## 📂 Archivos del Plan

- Plan YAML completo: `plans/20260525-fix-debug-panel-firebase.yaml`
- Esta guía rápida: Este documento
- Memoria de sesión: `/memories/session/debug_panel_migration_plan.md`
