# Plan de Remediation: Dungeon Forge 2026-06-19

**Plan ID:** `20260619-audit-remediation`
**Objetivo:** Ejecutar las 18 acciones de la auditoría ordenadas por nivel de riesgo — de lo más seguro a lo más crítico.
**Estimación total:** ~20 horas distribuidas en 4 Tiers
**Complejidad:** MEDIA

---

## 🗺️ Mapa de Ruta

```
TIER 1 ──► TIER 2 ──► TIER 3 ──► TIER 4
Seguro    Bajo       Medio      Crítico/Aprobación
(7 tasks)  (4 tasks)  (4 tasks)  (5 tasks)
   │          │          │          │
   ▼          ▼          ▼          ▼
Checkpoint  Checkpoint  Checkpoint Checkpoint
```

**Regla de oro:** Cada Tier deja el proyecto en estado funcional. Si algo sale mal en Tier 3, el Tier 1 y 2 ya están consolidados.

---

## TIER 1 — Cambios Seguros (0 riesgo de producción)

**Esfuerzo total:** ~1.5h | **Riesgo:** 🟢 Nulo | **Bloqueante:** No | **Commit único:** ✅ Sí

Estos cambios son puramente mecánicos. No afectan lógica de negocio, no cambian output de runtime. Se pueden aplicar sin miedo y en cualquier orden (paralelizables).

### T1.1 — Eliminar `sharp` de devDependencies

| Campo | Valor |
|---|---|
| **Descripción** | `sharp` (69MB) está en devDependencies pero NUNCA se importa en el proyecto. Sobrevivió de algún experimento anterior. |
| **Archivos** | `package.json` (1 línea) |
| **Comando** | `npm uninstall sharp` |
| **Verificación** | `npm run build` pasa, `npm test` pasa |
| **Dependencias** | Ninguna |
| **Esfuerzo** | ⚡ 5 minutos |

### T1.2 — Agregar `console.error` a catch blocks vacíos

| Campo | Valor |
|---|---|
| **Descripción** | Hay catch blocks que tragan errores silenciosamente (`catch { /* ignore */ }` en App.tsx líneas ~192, ~211, y `catch { /* snapshot creation is best-effort */ }` en SheetTabs.tsx). Agregar `console.error(...)` para que los errores no desaparezcan sin dejar rastro. |
| **Archivos** | `App.tsx`, `components/SheetTabs.tsx` |
| **Verificación** | Revisar que los errores se logueen (manual), build pasa |
| **Dependencias** | Ninguna |
| **Esfuerzo** | ⚡ 15 minutos |
| **Ejemplo** | `catch { /* ignore */ }` → `catch (e) { console.error("App: failed to load session", e); }` |

### T1.3 — Eliminar código muerto (3 componentes + 1 función)

| Campo | Valor |
|---|---|
| **Descripción** | 3 archivos completos que nunca se importan + 1 función nunca llamada. Afectan bundle size y confunden a futuros devs. |
| **Archivos a ELIMINAR** | • `components/AuthDebugOverlay.tsx` (177 LOC)<br>• `components/OAuthDebugConsole.tsx` (275 LOC)<br>• `src/components/ThemeExample.tsx` (~80 LOC, duplicado)<br>• `src/hooks/useTheme.ts` (~30 LOC, hay ThemeContext) |
| **Archivos a MODIFICAR** | • `App.tsx` — eliminar función `handleBatchUpdateCharacters` (~30 LOC) |
| **Verificación** | Build pasa, grep de imports confirma que nadie los referencia |
| **⚠️ Precaución** | Antes de borrar, hacer `grep -r "AuthDebugOverlay\|OAuthDebugConsole\|ThemeExample\|useTheme" src/ components/` para confirmar zero imports |
| **Esfuerzo** | ⚡ 20 minutos |

### T1.4 — Mover `jsonc-parser` a devDependencies

| Campo | Valor |
|---|---|
| **Descripción** | `jsonc-parser` está en `dependencies` pero solo lo usan herramientas dev (`micode`, `dcp`) en scripts de build/scripts. No se bundlea en producción. |
| **Archivos** | `package.json` (mover de `dependencies` a `devDependencies`) |
| **Verificación** | Build pasa, tests pasan |
| **Dependencias** | Ninguna |
| **Esfuerzo** | ⚡ 5 minutos |

### T1.5 — Agregar `noUnusedLocals` y `noUnusedParameters` al tsconfig

| Campo | Valor |
|---|---|
| **Descripción** | Activar estas flags en `tsconfig.json` atrapa automáticamente código muerto en tiempo de compilación. Ya hay código muerto (T1.3), así que este cambio se hace DESPUÉS de limpiarlo. |
| **Archivos** | `tsconfig.json` |
| **Verificación** | `npm run build` pasa sin errores nuevos |
| **Dependencias** | T1.3 (porque el código muerto causaría errores de compilación) |
| **Esfuerzo** | ⚡ 10 minutos |
| **Config** | `"noUnusedLocals": true, "noUnusedParameters": true` |

### T1.6 — Extraer magic strings a constantes

| Campo | Valor |
|---|---|
| **Descripción** | `'df_session'` (8 ocurrencias) y `'dnd-characters'` (5 ocurrencias) en App.tsx están hardcodeados. Extraerlos a `src/constants.ts` o similar. |
| **Archivos** | • `App.tsx` — reemplazar ocurrencias<br>• Crear o modificar archivo de constantes |
| **Verificación** | Build pasa, login y carga de personajes funciona (smoke test manual) |
| **Dependencias** | Ninguna |
| **Esfuerzo** | ⏱ 20 minutos |

### T1.7 — Eliminar artefactos Supabase legacy

| Campo | Valor |
|---|---|
| **Descripción** | Los archivos de migración Supabase→Firebase ya cumplieron su propósito. Moverlos a archivo o eliminarlos del root del proyecto. |
| **Archivos** | • `MIGRATION-PLAN-SUPABASE-PARTIES-TO-FIREBASE.yaml` (~1006 LOC)<br>• `MIGRATION-SUPABASE-FIREBASE-REPORT.md`<br>• `docs/SUPABASE-FIREBASE-MIGRATION-SUMMARY.md` |
| **Acción** | Mover a `docs/migrations/` (no borrar, mantener historial) |
| **Verificación** | Build pasa (son solo docs) |
| **Dependencias** | Ninguna |
| **Esfuerzo** | ⚡ 10 minutos |

---

### ✅ CHECKPOINT TIER 1

```bash
npm run build    # debe pasar sin errores
npm test         # 116/117 pass (el fail conocido sigue igual)
git status       # revisar que solo se tocaron los archivos planeados
```

> **Si algo falla:** Revertir TODO el Tier 1 con `git checkout .` y re-evaluar. Esto es extremadamente improbable porque todos los cambios son inocuos.

---

## TIER 2 — Riesgo Bajo (validar con grep + tests)

**Esfuerzo total:** ~1.5h | **Riesgo:** 🟡 Bajo | **Bloqueante:** T1 pasa | **Commit único:** ✅ Sí

Estos cambios pueden afectar ligeramente el comportamiento en edge cases. Validar con tests existentes.

### T2.1 — Reemplazar UUID débil por `crypto.randomUUID()`

| Campo | Valor |
|---|---|
| **Descripción** | `Math.random().toString(36).substring(2, 11)` en App.tsx genera IDs predecibles con riesgo de colisión. Reemplazar con `crypto.randomUUID()` — estándar, criptográficamente seguro. |
| **Archivos** | • `App.tsx:1191` — `id: 'imp-' + Date.now() + '-' + crypto.randomUUID()`<br>• `utils/localStorage.ts:42` — códigos de party<br>• `utils/firebase.ts:509` — códigos de party |
| **⚠️ Retrocompatibilidad** | NO cambiar IDs existentes. Solo afecta a NUEVOS IDs generados desde el momento del deploy. Los IDs viejos en localStorage/Firestore siguen funcionando. |
| **Verificación** | Build pasa, importar personaje nuevo genera UUID válido |
| **Dependencias** | T1 pasa |
| **Esfuerzo** | ⚡ 10 minutos |

### T2.2 — Fijar test LevelResetModal

| Campo | Valor |
|---|---|
| **Descripción** | El test busca `'Current Level:'` pero el componente renderiza `<strong>Level:</strong>` (con HTML). El test matchea el texto plano sin considerar la etiqueta HTML. |
| **Archivos** | `tests/LevelResetModal.test.tsx` |
| **Fix** | Cambiar el matcher a algo que funcione con el renderizado real: `expect(screen.getByText(/Level:/i))` o testear con `container.innerHTML` |
| **Verificación** | `npm test` — ahora 117/117 pass |
| **Dependencias** | T1 pasa |
| **Esfuerzo** | ⚡ 10 minutos |

### T2.3 — Reducir `as any` en validators.ts

| Campo | Valor |
|---|---|
| **Descripción** | El archivo `src/utils/validators.ts` concentra la mayoría de los 42 `as any`. Son mayormente en validación de tipos dinámicos. Reducirlos con type guards y tipos más precisos sin cambiar la lógica de validación. |
| **Archivos** | `src/utils/validators.ts` |
| **Riesgo** | Que algún edge case de validación cambie de comportamiento |
| **Mitigación** | **57 tests** cubren validators. Si pasan todos, el comportamiento es idéntico. |
| **Verificación** | `npm test` (57 tests de validators deben pasar igual) |
| **Dependencias** | T1 pasa |
| **Esfuerzo** | ⏱ 45 minutos |

### T2.4 — Eliminar `onBroadcast` muerto de subscribeWithRetry

| Campo | Valor |
|---|---|
| **Descripción** | El parámetro `onBroadcast` en `subscribeWithRetry()` está documentado en AGENTS.md como "NUNCA es llamado por la implementación". Eliminar el parámetro y todos sus passthroughs en los callers. |
| **Archivos** | • `utils/firebase.ts:687` — definición de subscribeWithRetry<br>• `App.tsx:482,847` — passthrough de onBroadcast<br>• `hooks/useDMParty.ts:332` — passthrough<br>• `components/SheetTabs.tsx:153` — passthrough (si aplica)<br>• `components/DMDashboard.tsx:52` — passthrough (si aplica) |
| **Verificación** | Build pasa, tests de listener-cleanup pasan |
| **Dependencias** | T1 pasa |
| **Esfuerzo** | ⚡ 15 minutos |

---

### ✅ CHECKPOINT TIER 2

```bash
npm run build    # debe pasar
npm test         # 117/117 pass (T2.2 fija el fail)
npm run preview  # smoke test: crear personaje, ver que los IDs se generan correctamente
```

> **Si algo falla:** Revisar el diff. El riesgo más alto aquí es T2.3 (validators). Si algún test de validación falla, hay que ajustar los tipos sin cambiar semántica.

---

## TIER 3 — Riesgo Medio (requiere QA manual)

**Esfuerzo total:** ~4.5h | **Riesgo:** 🟡 Medio | **Bloqueante:** T1+T2 pasan | **Commit único:** Preferiblemente separado por tarea

Estos cambios requieren verificación manual adicional además de build+tests.

### T3.1 — Sanitizar `dangerouslySetInnerHTML` en Compendium

| Campo | Valor |
|---|---|
| **Descripción** | `Compendium.tsx` usa `dangerouslySetInnerHTML` con contenido markdown transformado a HTML. Esto es un vector XSS si algún texto contiene `<script>` o atributos peligrosos. |
| **Archivos** | `components/dm/Compendium.tsx:147,182` |
| **Opciones** | 1. **DOMPurify** — sanitizar el HTML generado antes de inyectarlo (`npm install dompurify`, `import DOMPurify from 'dompurify'`)<br>2. **Reemplazar con componente React** — si el markdown es simple (bold, italic, listas), se puede renderizar con React puro sin innerHTML |
| **Recomendación** | DOMPurify — es la solución estándar, liviana (~7KB gzip), y no requiere reescribir el renderer. |
| **Verificación** | Build pasa, navegar al Compendium y verificar que el contenido se ve idéntico |
| **⚠️ Riesgo** | DOMPurify puede ser demasiado agresivo y limpiar etiquetas válidas. Hacer diff visual del contenido antes/después. |
| **Dependencias** | T1+T2 pasan |
| **Esfuerzo** | ⏱ 60 minutos |

### T3.2 — Unificar `components/` y `src/components/`

| Campo | Valor |
|---|---|
| **Descripción** | Hay dos directorios de componentes: `components/` (58 archivos) y `src/components/` (6 archivos). Unificar todo bajo `src/components/`. |
| **Archivos** | ~64 archivos de componentes + todos los archivos que los importan |
| **Plan** | 1. Mover `components/*` → `src/components/` (resolver colisiones: `ThemeSelector.tsx` existe en ambos)<br>2. Actualizar imports en ~50-60 archivos<br>3. Eliminar `components/` vacío |
| **⚠️ Riesgo** | Cada import roto = error de módulo. Hay que ser meticuloso con los reemplazos. |
| **Verificación** | Build pasa (si build pasa, todos los imports están correctos) |
| **Dependencias** | T1+T2 pasan |
| **Esfuerzo** | ⏱ 60 minutos |

### T3.3 — Dynamic import para sub-módulos Firebase

| Campo | Valor |
|---|---|
| **Descripción** | Firebase genera un chunk de **641KB** (149KB gzip) que se carga completo al inicio. Separar los imports dinámicos para que auth, firestore y rtdb se carguen lazy según se necesiten. |
| **Archivos** | `App.tsx`, `utils/firebase.ts` |
| **Riesgo** | En redes lentas (mobile), un chunk lazy podría fallar. Agregar retry logic y fallback. |
| **Verificación** | Build pasa, `dist/` muestra chunks separados, navegar por la app y verificar que Firebase funcione |
| **Dependencias** | T1+T2 pasan |
| **Esfuerzo** | ⏱ 120 minutos |

### T3.4 — Upgrade eslint & firebase-admin

| Campo | Valor |
|---|---|
| **Descripción** | eslint 9.39 → 10.5 y firebase-admin 12 → 14. Estas dependencias de desarrollo/scripts no afectan el runtime de producción pero mejoran la seguridad. |
| **Riesgo** | eslint 10 puede tener nuevas reglas que rompan lint. firebase-admin solo se usa en scripts de build, no en producción. |
| **Verificación** | `npx eslint .` pasa, scripts de build pasan |
| **Dependencias** | T1+T2 pasan |
| **Esfuerzo** | ⏱ 30 minutos |

---

### ✅ CHECKPOINT TIER 3

```bash
npm run build               # build completo
npm test                    # todos los tests
npx eslint .                # lint con nueva versión

# Smoke test manual:
# 1. Abrir Compendium → verificar contenido se ve correcto
# 2. Navegar entre todas las vistas (list, create, sheet, DM)
# 3. Verificar que Firebase auth y sync funcionan
# 4. Revisar dist/ para verificar chunks de Firebase separados
```

> **Si algo falla:** Las tareas de Tier 3 son independientes (excepto T3.2). Se pueden revertir individualmente.

---

## TIER 4 — Refactor Mayor (⚠️ REQUIERE APROBACIÓN)

**Esfuerzo total:** ~12h | **Riesgo:** 🔴 Alto | **Bloqueante:** T1+T2+T3 pasan | **Commit:** Individual por tarea

> **❗ No comenzar sin aprobación explícita del equipo.**
> **❗ Cada tarea requiere su propio branch + PR + revisión.**
> **❗ Probar en Android físico después de T4.3 (Capacitor).**

### T4.1 — Refactor App.tsx → custom hooks

| Campo | Valor |
|---|---|
| **Descripción** | App.tsx tiene 1,444 LOC con 6+ responsabilidades. Extraer en hooks: `useAuth()`, `useCharacters()`, `useSync()`, `useOTA()`, `useTheme()`, `useImportExport()`. |
| **Riesgo** | 🔴 **Alto.** El sync pipeline (CRUD → localStorage → Firestore → RTDB → loopback guard) es frágil. React 18 batching y los closures pueden reintroducir bugs. |
| **Mitigación** | • NO cambiar la lógica — SOLO mover código<br>• Tests existentes validan el comportamiento<br>• Después del refactor: probar crear/editar/descansar personajes |
| **Plan** | 1. Extraer auth (`useAuth` cleanup a Login.tsx)<br>2. Extraer characters CRUD (`useCharacterManager`)<br>3. Extraer sync (`useFirebaseSync`)<br>4. Extraer OTA (`useOTAUpdate`)<br>5. App.tsx queda como orquestador del view state (~200 LOC) |
| **Archivos** | `App.tsx` → `src/hooks/useAuth.ts`, `src/hooks/useCharacterManager.ts`, `src/hooks/useFirebaseSync.ts`, `src/hooks/useOTAUpdate.ts` |
| **Verificación** | Build + tests + E2E + smoke test (crear/editar/descansar personajes) |
| **Esfuerzo** | ⏱ 4-6 horas |

### T4.2 — Refactor firebase.ts → módulos por dominio

| Campo | Valor |
|---|---|
| **Descripción** | `utils/firebase.ts` tiene 1,203 LOC con Firebase init, auth, Firestore CRUD, RTDB, party management. Separar en: `firebase/init.ts`, `firebase/auth.ts`, `firebase/characters.ts`, `firebase/parties.ts`, `firebase/subscriptions.ts`. |
| **Riesgo** | 🔴 **Alto.** Si los imports se rompen, la app no puede leer/escribir datos. |
| **Mitigación** | • Refactor en múltiples pasos pequeños (skill: incremental-implementation)<br>• Cada paso: mover un módulo, actualizar imports, build pasa |
| **Plan** | 1. Crear `firebase/` directory<br>2. Mover init → `firebase/init.ts`<br>3. Mover auth helpers → `firebase/auth.ts`<br>4. Mover character CRUD → `firebase/characters.ts`<br>5. Mover party management → `firebase/parties.ts`<br>6. Mover subscriptions → `firebase/subscriptions.ts`<br>7. `firebase.ts` queda como barrel export |
| **Verificación** | Build + tests + smoke test |
| **Esfuerzo** | ⏱ 2-3 horas |

### T4.3 — Upgrade Capacitor v6 → v8

| Campo | Valor |
|---|---|
| **Descripción** | Capacitor 6 tiene 7+ high vulns en la cadena de dependencias. v8 tiene breaking changes en plugin API. |
| **Riesgo** | 🔴 **Alto.** El plugin nativo de Google Sign-In (`GoogleSignInPlugin.java`) tuvo issues en el pasado. Breaking changes en la API de plugins nativos pueden romper login en Android. |
| **Mitigación** | • Branch dedicado: `feature/capacitor-v8`<br>• Probar APK en Android físico<br>• Verificar login OAuth funciona<br>• Rollback plan: `git revert`<br>• Leer changelog: https://capacitorjs.com/docs/updating |
| **Verificación** | Build Android exitoso, `adb install`, login Google funciona |
| **Esfuerzo** | ⏱ 4-8 horas |

### T4.4 — Upgrade Vite 5→8 + tailwindcss 3→4 + TypeScript 5→6

| Campo | Valor |
|---|---|
| **Descripción** | Tres upgrades major juntos porque tailwindcss 4 cambia la configuración radicalmente (JS→CSS), Vite 8 cambia Rollup API, y TS6 es más estricto. Hacerlos en secuencia. |
| **Riesgo** | 🔴 **Alto.** 3 majors simultáneos pueden tener interacciones impredecibles. |
| **Plan** | 1. Vite 5→8 (actualizar vite.config.ts, plugins)<br>2. tailwindcss 3→4 (migrar tailwind.config.js a CSS nativo, actualizar clases si es necesario)<br>3. TypeScript 5→6 (resolver nuevos errores strict) |
| **Verificación** | Build pasa, estilos visualmente idénticos (diff screenshot), tests pasan |
| **Esfuerzo** | ⏱ 4-6 horas |

### T4.5 — Agregar cobertura de tests (target 20%)

| Campo | Valor |
|---|---|
| **Descripción** | Cobertura actual ~3% (1,205 LOC test / 39,300 LOC source). Target: 20%. Priorizar: validators (ya tiene 57 tests), firebase utils, componentes core (SheetTabs, CharacterList), hooks nuevos de T4.1. |
| **Riesgo** | 🟡 Bajo. Agregar tests no cambia código de producción. Pero tests mal escritos pueden dar falsos positivos. |
| **Verificación** | `npx vitest --coverage` — coverage report supera 20% |
| **Esfuerzo** | ⏱ 8-16 horas |

---

### ✅ CHECKPOINT TIER 4

```bash
npm run build                   # build exitoso
npm test                        # todos los tests pasan
npx vitest --coverage           # coverage ≥ 20%

# Pruebas en Android:
cd android && ./gradlew assembleDebug   # APK compila
adb install -r app/build/outputs/apk/debug/app-debug.apk

# Smoke test completo:
# 1. Login con Google
# 2. Crear personaje nuevo
# 3. Editar stats, HP, inventory
# 4. Long Rest (verificar que no hay rollback)
# 5. Sync offline/online
# 6. Party features
```

---

## 📊 Resumen de Esfuerzo

| Tier | Tasks | Esfuerzo | Riesgo | Depende de |
|------|-------|----------|--------|------------|
| **Tier 1 — Seguro** | 7 | ~1.5h | 🟢 Nulo | — |
| **Tier 2 — Bajo** | 4 | ~1.5h | 🟡 Bajo | Tier 1 |
| **Tier 3 — Medio** | 4 | ~4.5h | 🟡 Medio | Tier 1+2 |
| **Tier 4 — Crítico** | 5 | ~12h | 🔴 Alto | Tier 1+2+3 |
| **Total** | **20** | **~20h** | — | — |

## 🎯 Línea de Tiempo Recomendada

```
Día 1  │██████████████████████████████│  Tier 1 (1.5h) + Tier 2 (1.5h)
       │                              │  → Checkpoint. Build + tests verdes.
       │                              │
Día 2  │██████████████████████████████│  Tier 3 (4.5h)
       │                              │  → Checkpoint con smoke test.
       │                              │
Día 3  │██████████████████████████████│  Tier 4.1 (App.tsx refactor) + T4.2 (firebase.ts)
       │                              │  → Checkpoint con smoke test.
       │                              │
Día 4  │██████████████████████████████│  Tier 4.3 (Capacitor v8) + T4.4 (Vite+tailwind+TS)
       │                              │  → Probar APK en Android físico.
       │                              │
Día 5+ │██████████████████████████████│  T4.5 (test coverage)
       │                              │  → Release.
```

## ⚠️ Riesgos y Mitigaciones

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|-------------|------------|
| Refactor App.tsx reintroduce stale closure bug | 🔴 Alto | 🟡 Media | Tests existentes + smoke test post-refactor |
| Capacitor v8 rompe OAuth nativo | 🔴 Alto | 🟡 Media | Probar en Android físico, rollback plan |
| Unificación de components rompe imports | 🟡 Medio | 🟡 Media | Build detecta imports rotos inmediatamente |
| DOMPurify sanitiza contenido válido | 🟡 Medio | 🟢 Baja | Diff visual del Compendium antes/después |
| Tailwind 4 cambia estilos visualmente | 🟡 Medio | 🟡 Media | Screenshot diff, revisar dark mode y responsive |
| Flickering de sync post-refactor | 🔴 Alto | 🟢 Baja | Timestamp guard ya existe, tests de listener-cleanup |

## 📁 Archivos del Plan

```
docs/plan/20260619-audit-remediation/
├── plan.yaml              # Plan ejecutable para gem-team
├── context_envelope.json  # Snapshot de contexto para agentes
└── README.md              # Este documento
```

---

> **Siguiente paso:** ¿Aprobás empezar con **Tier 1** (cambios seguros)? Son 7 tareas que no pueden romper nada — ~1.5h y dejamos el proyecto más limpio.
