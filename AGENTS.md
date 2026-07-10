# Dungeon Forge - Development Guide

## Project Overview

**Dungeon Forge** es una app de gestión de personajes D&D 5e (2024) construida con React 19, TypeScript, y Tailwind CSS. Corre en web y compila a Android/iOS via Capacitor.

## Commands

```bash
npm run dev              # Dev server (http://localhost:5173)
npm run build            # Production build → dist/
npm run preview          # Preview prod build
cd android && ./gradlew assembleDebug   # Android APK
```

## Tech Stack

| Componente | Tecnología |
|------------|------------|
| Frontend | React 19, TypeScript (strict) |
| Estilos | Tailwind CSS, Material Symbols |
| Build | Vite |
| Mobile | Capacitor 6 |
| Backend | Firebase (Auth, Firestore, Realtime DB) |
| PWA | Service Worker + manifest.json |

## Reglas Críticas

### TypeScript
- `strict: true` → sin `any`, tipos explícitos
- Interfaces para datos → exportar de `types.ts`
- `React.FC<Props>` para componentes
- `useState<T>` con genérico explícito

### React Patterns
- Componentes funcionales con hooks
- Lazy loading: `const Component = lazy(() => import('./path'))`
- Siempre retornar cleanup de `useEffect`

### Import Order
```typescript
import React, { useState } from 'react';           // 1. React
import { something } from 'library';               // 2. External
import { Character } from './types';               // 3. Types
import { MOCK_CHARACTERS } from './constants';    // 4. Constants
import CharacterList from './CharacterList';       // 5. Components
```

### Naming Conventions
- **Componentes**: PascalCase → `CharacterList.tsx`
- **Interfaces**: PascalCase → `InventoryItem`, `Character`
- **Functions/Variables**: camelCase → `handleCreateNew`
- **Files**: kebab-case → `sheetUtils.ts`

### Error Handling
```typescript
try {
  localStorage.setItem('key', JSON.stringify(data));
} catch (e) {
  console.error("Failed:", e);
}
```

### Tailwind CSS
- Dark mode: `dark:` prefix
- CSS variables: `bg-background-dark`, `text-primary`
- Mobile-first: `max-w-md container`
- Icons: `<span className="material-symbols-outlined">icon</span>`

## Data Types (types.ts)

```typescript
type ViewState = 'list' | 'create' | 'sheet' | 'dm-dashboard' | 'observer-sheet';
type SheetTab = 'combat' | 'inventory' | 'spells' | 'features' | 'notes';
type Ability = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

interface Character { id, name, level, class, species, hp, stats, inventory... }
interface InventoryItem { id, name, quantity, equipped }
interface Spell { name, level, school, range, components, duration, description }
```

## Data Organization

```
Data/
├── classes/       # 12 archivos (barbarian.ts, wizard.ts, etc.)
├── species/       # Especies D&D 5e
├── spells/        # Por nivel (cantrips.ts, level1.ts...level9.ts)
├── items.ts       # Equipment y items
├── feats.ts       # Feats
├── skills.ts     # Skill definitions
└── backgrounds.ts # Backgrounds
```

## State Management

- **Local**: `useState<T>`, `useReducer`
- **Persistence**: localStorage con debounce 300ms
- **Cloud**: Firebase (Firestore + Realtime DB)
- **Cleanup**: Siempre unsubscribe de canales

## UI Components

- Material Symbols Outlined para iconos
- Dark/light theme con CSS variables
- Sticky headers con safe-area padding
- Responsive mobile-first

## Notas Importantes

1. **No tests** → no escribir tests a menos que se agregue framework
2. **Español/English mixed** → UI en español, comentarios también
3. **Mobile-first** → target principal es mobile web (PWA)
4. **Context7** → usar para verificar APIs externas
5. **Firebase OAuth Android (known issue)** → en Capacitor, evitar `redirectTo` hacia `localhost` en login nativo; priorizar flujo popup + verificación de retorno (deeplink/resume) para prevenir pantalla en blanco o sesión incompleta tras volver de Chrome.

## Troubleshooting OAuth Android

### Incidente: "GoogleSignIn plugin is not implemented on android"

**Síntoma:** al invocar `GoogleSignIn.signInWithGoogle()` desde `utils/googleSignInNative.ts`, Capacitor responde que el plugin no está implementado en Android.

**Causa raíz principal (confirmada):** plugin nativo no registrado en `MainActivity`.
- Archivo afectado: `android/app/src/main/java/com/tupaquete/dndcompanion/MainActivity.java`
- Estado problemático: `MainActivity` extiende `BridgeActivity` sin `registerPlugin(GoogleSignInPlugin.class)`.

**Causa secundaria potencial:** métodos nativos expuestos sin `@PluginMethod`.
- Archivo a revisar: `android/app/src/main/java/com/tupaquete/dndcompanion/GoogleSignInPlugin.java`
- Métodos críticos: `signInWithGoogle(PluginCall call)` y `signOut(PluginCall call)`.

### Fix mínimo

1. Registrar el plugin en `MainActivity`.
2. Anotar cada método invocado desde JavaScript con `@PluginMethod`.
3. Ejecutar sincronización y recompilación Android (`npx cap sync android` + build debug).

### Checklist de validación rápida

- [ ] Build Android finaliza sin errores.
- [ ] `adb install -r` instala APK correctamente.
- [ ] En logs no aparece "plugin is not implemented on android".
- [ ] El selector de cuenta de Google se abre en Android.
- [ ] El flujo retorna a la app con sesión iniciada (sin pantalla en blanco).
- [ ] Sign-out nativo funciona sin errores.

## Skills Disponibles

Ubicar en `.agents/skills/`:

| Skill | Usar Para |
|-------|-----------|
| frontend-ui-engineering | UI components, diseño |
| spec-driven-development | PRD antes de código |
| planning-and-task-breakdown | Descomponer tareas |
| code-review-and-quality | QA antes de merge |
| debugging-and-error-recovery | Bugs y errores |
| performance-optimization | Optimizar rendimiento |
| context-engineering | Optimizar contexto agente |
| incremental-implementation | Cambios multi-archivo |

## Long Rest / Cloud Sync Gotchas

### 1. RTDB Broadcast Before Firestore Save Causes Rollback Loop
- Si llamás `broadcastCharacterUpdate()` (escritura RTDB) dentro de `handleCharacterUpdate`/`handleFastUpdate`, se dispara el listener `onValue` de RTDB que llama a `setCharacters()`. Eso activa el cleanup del persist effect (`clearTimeout`), cancelando el guardado pendiente a Firestore (500ms). Firestore retiene datos stale pre-rest. En el próximo sync, cloud sobreescribe local.
- **FIX:** Mover `broadcastCharacterUpdate()` al persist effect DESPUÉS de que el loop de guardado a Firestore se complete. Broadcastar `char` (el original del state), no `charWithTimestamp` (con `Date.now()` fresco) para prevenir el loop infinito save-broadcast.

### 2. Siempre Setear `syncTimestamp` Antes de `setCharacters()`
- Tanto `handleCharacterUpdate` como `handleFastUpdate` DEBEN setear `fullUpdate.syncTimestamp = Date.now()` ANTES de llamar a `setCharacters()`. Sin esto, `localChar.syncTimestamp || 0` = 0 en la comparación de timestamps del listener de Firestore, por lo que cloud siempre gana.

### 3. RTDB Broadcast Loop Prevention
- Cuando `broadcastCharacterUpdate` escribe a RTDB, el listener `onValue` se dispara de vuelta y llama a `setCharacters()`. Si el broadcast data tiene un `syncTimestamp` DIFERENTE al que está en React state, el effect de snapshot/dirty-tracking detecta un "cambio" y dispara otro persist save, creando un loop infinito.
- **FIX:** Siempre broadcastar el personaje desde React state (con su `syncTimestamp` existente), no un objeto recién creado con `Date.now()`.

### 4. `onBroadcast` en `subscribeWithRetry` es Código Muerto
- El parámetro `onBroadcast` de `subscribeWithRetry` (`utils/firebase.ts`) NUNCA es llamado por la implementación. Todos los datos de RTDB llegan a través del callback `onUpdate`. No intentar usar `onBroadcast` para lógica de dedup.

### 5. Stale Closure en Handlers Causa Data Loss con React 18 Batching
- `handleCharacterUpdate` y `handleFastUpdate` hacían spread del `activeCharacter` capturado en la closure del `useCallback` en vez del personaje vivo en `prev` (el parámetro del functional updater). Con React 18 auto-batching, dos `setCharacters(fn)` en el mismo ciclo arrancan del MISMO `activeCharacter` stale. El segundo spread UNDO el cambio del primero.
- **Ejemplo:** Cambio1: `{ ...activeCharacter, actionSurge: 0 }`. Cambio2: `{ ...activeCharacter, secondWind: 0 }`. Resultado: actionSurge vuelve a 1 (perdido).
- **FIX:** Usar `setCharacters((prev) => prev.map((c) => c.id === id ? { ...c, ...partialChar, syncTimestamp: Date.now() } : c))` — spread desde `c` (el estado vivo de `prev`), no desde `activeCharacter`.

### 6. RTDB Listener Timestamp Guard Previene Loopback Overwrite
- Hay DOS listeners RTDB activos: App.tsx (path selectivo `parties/{partyId}/characters/{characterId}`) y SheetTabs (path completo `parties/{partyId}/characters`). Ambos escriben a `setCharacters()` SIN guard de timestamp. Cuando el broadcast loopback vuelve con datos que tienen un `syncTimestamp` viejito (T1), se sobreescriben los datos locales frescos (T2).
- **FIX:** En ambos listeners, comparar `incomingTime > currentTime` antes de aplicar. Si incoming ≤ current, rechazar el update como stale/loopback.

### 7. Persist Effect: NO Generar Nuevo Date.now() Para Cloud Save
- El persist effect creaba `charWithTimestamp = { ...char, syncTimestamp: Date.now() }` para guardar a Firestore. Eso causaba que Firestore en el `onSnapshot` detectara un timestamp MÁS NUEVO que el local, actualizara el state, y disparara OTRO persist → loop infinito ("flickering" constante).
- **FIX:** Usar `char.syncTimestamp || Date.now()` en vez de siempre generar un `Date.now()` nuevo. El `syncTimestamp` ya fue seteado por `handleCharacterUpdate`/`handleFastUpdate`.

---

## 🛡️ Versiones Estables & Rollback

### Puntos de Control Registrados

| Versión | Git Tag | OTA Version | Fecha | Estado |
|---------|---------|-------------|-------|--------|
| **v1.1.0** | `v1.1.0` | `1.0.0-2026.5.13-162947` | 2026-05-13 | ✅ ACTUAL |
| **v1.1.0-prev** | `v1.1.0` | `1.0.0-2026.5.13-162745` | 2026-05-13 | ✅ ESTABLE |
| **v1.0.0** | `v1.0.0` | `1.0.0-2026.4.16-182359` | 2026-04-16 | ✅ ESTABLE |
| **v1.0.0-Beta** | `v1.0.0-beta` | `2026.4.16-123234` | 2026-04-16 | ⚠️ OBSOLETA |

### Procedimiento de Rollback a una Versión Estable

**Rollback Solo OTA a v1.1.0** (1 minuto — solo afecta lo que ven los usuarios):
```bash
node scripts/restore_ota.mjs 1.1.0-2026.5.13-144500 "Rollback a v1.1 Stable"
```

**Rollback Completo a v1.1.0** (código + OTA):
```bash
git checkout v1.1.0
node scripts/restore_ota.mjs 1.1.0-2026.5.13-144500 "Rollback completo a v1.1"
npm install
```

**Rollback a v1.0.0** (versión anterior):
```bash
git checkout v1.0.0
node scripts/restore_ota.mjs 1.0.0-2026.4.16-182359 "Rollback a v1.0 Stable"
npm install
```

**Rama Archivada v1.1** (estado exacto sellado, nunca cambia):
```bash
git checkout stable-v1.1
```

**Rama Archivada v1.0** (estado exacto sellado, nunca cambia):
```bash
git checkout stable-v1.0
```

### Long Rest Fix (2026-06-18)

**Bug:** Long Rest rollback — al descansar, los cambios (HP, slots, recursos) se revertían segundos después porque el broadcast a RTDB cancelaba el guardado pendiente a Firestore.

**Causa raíz:** `broadcastCharacterUpdate()` llamado dentro de los handlers disparaba el listener `onValue` → `setCharacters()` → cleanup del persist effect (`clearTimeout`), cancelando el Firestore save de 500ms. Cloud sobreescribía datos stale.

**Archivos tocados:**
- `App.tsx` — Moved broadcastCharacterUpdate de handlers al persist effect, después del loop de Firestore save. Broadcast ahora usa `char` (state), no `charWithTimestamp`.
- `components/sheet/RestModal.tsx` — Se agregó `syncTimestamp` antes de `setCharacters()`, se restauraron spell slots, se corrigió `preparedSpells` en Wizard (evita borrado destructivo), se agregó Arcane Recovery para Mago y pact slots para Warlock.

**Key changes:**
- Movido `broadcastCharacterUpdate()` desde `handleCharacterUpdate`/`handleFastUpdate` al persist effect, después del Firestore save loop
- Agregado `fullUpdate.syncTimestamp = Date.now()` antes de `setCharacters()` en ambos handlers
- Broadcast ahora usa `char` con su `syncTimestamp` existente para prevenir loop infinito
- RestModal: restaura spell slots por clase, corrige preparedSpells (no sobreescribe), agrega Arcane Recovery (Wizard) y pact slots (Warlock)

### Rollback Fix Ampliado — Stale Closure + RTDB Listeners (2026-06-18)

**Bug ampliado:** CUALQUIER cambio (skill, HP, curación, etc.) podía revertirse, especialmente con cambios rápidos consecutivos. Se identificaron y corrigieron 3 causas adicionales:

**Causa 1 — Stale Closure:** `handleFastUpdate` y `handleCharacterUpdate` usaban `{ ...activeCharacter, ...partialChar }` donde `activeCharacter` es capturado en la closure del `useCallback`. Con React 18 batching, dos `setCharacters(fn)` en el mismo ciclo arrancan del MISMO objeto stale. El segundo pierde los cambios del primero.

**Causa 2 — Loopback sin guard:** Dos listeners RTDB (App.tsx en path selectivo, SheetTabs en path completo) escribían a `setCharacters()` sin verificar timestamp. El broadcast de vuelta (loopback) sobreescribía datos locales frescos con datos stale.

**Causa 3 — Flickering Firestore:** El persist effect siempre creaba un nuevo `Date.now()` para guardar a Firestore, causando que el `onSnapshot` de Firestore detectara un timestamp más nuevo y actualizara el state, disparando otro persist → loop infinito.

**Archivos tocados:**
- `App.tsx` — Fix stale closure: spread desde `c` (prev) en vez de `activeCharacter`. Fix RTDB listener: timestamp guard `incoming > current`. Fix persist: usa `char.syncTimestamp` existente, no nuevo `Date.now()`.
- `components/SheetTabs.tsx` — Fix RTDB listener: timestamp guard `incoming > current` antes de llamar `onUpdate`.

> Ver `/docs/v1.0-architecture.md` para detalles completos de infraestructura, DB, y variables de entorno.
