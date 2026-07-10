# Errores Conocidos

## 🐛 Bugs Confirmados

### 1. Test Failing: LevelResetModal

**Archivo:** `tests/LevelResetModal.test.tsx` (1 test de 13 falla)
**Síntoma:** `"should display current level info"` — el test busca el texto `Current Level:` pero el componente renderiza `<strong>Level:</strong>`.
**Causa:** El test no se actualizó tras un cambio de texto en el componente.
**Status:** Bug en el test, no en producción. Fácil de corregir (actualizar string en test o componente).

### 2. Ghost Players (Resuelto — 2026-06)

**Síntoma:** Personajes expulsados de una party reaparecían al rato.
**Causa:** Race condition entre broadcast de RTDB y validación de `party_id`. El listener RTDB de la party anterior no se limpiaba antes de suscribir a la nueva.
**Fix:** 4 capas defensivas: cleanup de listener al cambiar party, validación reforzada de `party_id`, timestamp guard, y `removeFromPartyLocal` como fallback.
**Archivos:** `useSync.ts`, `useDMParty.ts`, `utils/firebase/subscriptions.ts`

### 3. Long Rest Rollback (Resuelto — 2026-06-18)

**Síntoma:** Al descansar, los cambios (HP, slots, recursos) se revertían segundos después.
**Causas raíz (3):**
- Broadcast RTDB dentro de handlers cancelaba el persist effect (Firestore save perdido)
- Stale closure: handlers usaban `activeCharacter` capturado en closure en vez del `prev` del functional updater
- Listeners RTDB sin guardia de timestamp aceptaban loopback stale
- Persist effect generaba nuevo `Date.now()` causando flickering Firestore
**Archivos:** `App.tsx`, `SheetTabs.tsx`, `RestModal.tsx`

### 4. TDZ en callback de RTDB (Resuelto)

**Síntoma:** `"Leaving..."` infinito en JoinPartyModal / error de conexión RTDB.
**Causa:** Temporal Dead Zone — el callback `onValue` se ejecutaba antes de que la variable de conectividad estuviese inicializada. Además, `joinParty` y `removeFromParty` no tenían timeout y colgaban si Firestore no respondía.
**Archivos:** `JoinPartyModal.tsx`, `utils/firebase/db.ts`

## ⚠️ Gotchas Detectados en el Código

### 5. Dos Caminos de Hooks (Root vs src/hooks/)

Hay hooks en `G:\Apks\Dungeon Forge\hooks\` (11 archivos) y hooks en `src/hooks/` (5 archivos). Los componentes importan de ambas ubicaciones. Esto puede causar duplicación lógica o confusión. No hay un estándar claro de cuándo usar una vs otra.

### 6. `as any` Casts en el Código

El audit de junio 2026 reporta **42 casts `as any`**. Son puntos donde se evade TypeScript strict. Algunos pueden ser legítimos (Firestore data shapes), otros son deuda técnica.

### 7. Vulnerabilidades de Seguridad

El audit reporta **27 vulnerabilidades** (12 altas) en dependencias. `npm audit` debería ejecutarse regularmente. El `.npmrc` tiene `ignore-scripts=true` que previene ataques de supply-chain pero también bloquea postinstall hooks legítimos.

### 8. Sin Tests para Componentes Críticos

`SheetTabs.tsx`, `RestModal.tsx`, `LevelUpWizard`, y los handlers de sync (`handleCharacterUpdate`, `handleFastUpdate`) no tienen tests unitarios. La lógica de sync (654 líneas en `useSync.ts`) solo se prueba indirectamente vía E2E.

### 9. Archivos Muy Grandes

| Archivo | Líneas | Riesgo |
|---------|--------|--------|
| `utils/sheetUtils.ts` | 1,398 | Candidato a refactor |
| `utils/firebase/db.ts` | 970 | Alto acoplamiento |
| `src/hooks/useSync.ts` | 654 | 7 effects, difícil de testear |
| `App.tsx` | 1,444 | Demasiada responsabilidad |
| `Data/compendiumData.ts` | 5,008 | Pesado, pero es data plana (bajo riesgo) |

### 10. Module Require Legacy

`useLevelSnapshots.ts` tenía `require()` en lugar de `import`. Ya corregido en commit `57fa5ab`, pero puede haber otros `require` residuales en el código.

### 11. `party_id` y `party_name` se Excluyen del Save a Firestore

En `saveCharacterToCloud`, se hace destructuring:
```typescript
const { party_id, party_name, ...charFields } = character;
```
Esto es intencional (party se maneja aparte), pero es fácil olvidarlo y preguntarse por qué no persisten.

### 12. El Listener `onBroadcast` en `subscribeWithRetry` es Código Muerto

El parámetro `onBroadcast` de `subscribeWithRetry` (subscriptions.ts) nunca es invocado por la implementación. Todos los datos RTDB llegan a través del callback `onUpdate`. No intentar usar `onBroadcast`.

## 🔧 Deuda Técnica

- **Cobertura de tests ~3%** — solo validadores y level reset tienen tests unitarios.
- **Sin CI/CD** — no hay verificación automática al hacer push.
- **Sin Docker** — entorno de desarrollo no reproducible.
- **Dos ubicaciones de hooks** (`hooks/` y `src/hooks/`) — sin regla de separación.
- **42 `as any`** repartidos por el código.
- **27 vulnerabilidades** en npm dependencies.
