# Plan de Implementación Técnica - Dungeon Forge
## Elementos Pendientes del Proyecto (Excluyendo Sistema XP)

**Fecha:** 2026-04-09  
**Versión:** 1.0  
**Autor:** Agent de Planificación

---

## Resumen Ejecutivo

Este documento detalla el plan de implementación técnica para todos los elementos pendientes en Dungeon Forge, excluyendo específicamente cualquier funcionalidad relacionada con el sistema de experiencia (XP). Se identificaron **8 categorías de trabajo** con **~45 tareas específicas** organizadas en fases lógicas con dependencias claras.

---

## Arquitectura General del Proyecto

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 19)                       │
├─────────────────────────────────────────────────────────────────┤
│  Components/         │  Hooks/          │  Utils/               │
│  ├─ SheetTabs        │  ├─ useLanguage  │  ├─ sheetUtils       │
│  ├─ LevelUpWizard   │  └─ useGameData   │  ├─ levelResetUtils  │
│  ├─ LevelResetModal │                   │  └─ supabase        │
│  ├─ CombatTab       │                   │                      │
│  └─ SpellsTab       │                   │                      │
├─────────────────────────────────────────────────────────────────┤
│                        DATA LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  Data/classes/      │  Data/species/   │  Data/feats/          │
│  Data/spells/       │  Data/items/     │  Data/skills/         │
├─────────────────────────────────────────────────────────────────┤
│                        BACKEND (Supabase)                       │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL          │  Realtime       │  Edge Functions      │
│  ├─ characters      │  ├─ broadcast    │  ├─ telegram-bot     │
│  ├─ parties         │  └─ presence     │  └─ (extensible)     │
│  └─ snapshots       │                  │                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## FASE 1: Correcciones Críticas de Estabilidad

### Dependencias: Ninguna (Base)

---

### Task 1.1: Manejo de Errores localStorage en App.tsx

**Descripción:** Wrapping de 6 operaciones localStorage con try/catch para prevenir crashes cuando el storage está lleno o no disponible.

**Severidad:** 🔴 CRÍTICA

**Componentes afectados:**
- `App.tsx` (líneas 38, 54, 86, 129, 146, 183)

**Requisitos técnicos:**
```typescript
// Antes (vulnerable)
const savedChar = localStorage.getItem('dungeon_forge_character');

// Después (seguro)
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn('[Storage] Error reading:', key, error);
    return null;
  }
}

function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('[Storage] Quota exceeded - clearing old data');
      // Estrategia: eliminar snapshots antiguos o personajes no usados
      cleanupOldData();
    }
    return false;
  }
}
```

**Criterios de aceptación:**
- [ ] Ninguna operación localStorage crashes la app
- [ ] Errores de QuotaExceededError son capturados y loggeados
- [ ] Fallback graceful a estado vacío si storage falla
- [ ] Tests: 3 tests unitarios para safeGetItem, safeSetItem, quotaExceeded

**Dependencias:** Ninguna

**Archivos a modificar:**
- `App.tsx` (~15 líneas)

**Riesgos:**
| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| Breaking change en storage | Alto | Bajo | Tests de regresión cubrirán el flujo |
| Performance hit | Medio | Bajo | Try/catch es síncrono y rápido |

---

### Task 1.2: Off-by-One en Spell Slots (sheetUtils.ts)

**Descripción:** Fix de error de índice en lookup de spell slots que puede causar undefined.

**Severidad:** 🔴 CRÍTICA

**Ubicación:** `utils/sheetUtils.ts` (líneas 750, 763)

**Requisitos técnicos:**
```typescript
// El array de spell slots es 0-indexed pero los niveles son 1-indexed
// ANTES (incorrecto)
const slot = spellSlots[slotLevel]; // Si slotLevel=1, busca índice 1

// DESPUÉS (correcto)
const slot = spellSlots[slotLevel - 1]; // Si slotLevel=1, busca índice 0

// Verificación
function getSpellSlotAvailable(level: number, slots: number[]): boolean {
  if (level < 1 || level > slots.length) return false;
  return slots[level - 1] > 0; // 0-indexed access
}
```

**Criterios de aceptación:**
- [ ] Spell slots de nivel 1-9 accesibles correctamente
- [ ] Sin undefined al consultar slot[0]
- [ ] Tests: 9 tests (uno por nivel de slot)

**Dependencias:** Ninguna

**Archivos a modificar:**
- `utils/sheetUtils.ts`

---

### Task 1.3: Validación Nivel Máximo (LevelUpWizard)

**Descripción:** Agregar validación para evitar nivel > 20.

**Severidad:** 🟡 MEDIA

**Ubicación:** `components/sheet/LevelUpWizard/LevelUpWizard.tsx`

**Requisitos técnicos:**
```typescript
const MAX_LEVEL = 20;

const validateLevelUp = (currentLevel: number): { valid: boolean; error?: string } => {
  if (currentLevel >= MAX_LEVEL) {
    return { 
      valid: false, 
      error: `Cannot level up: Maximum level (${MAX_LEVEL}) reached.` 
    };
  }
  return { valid: true };
};

// En handleConfirm o antes de iniciar wizard
useEffect(() => {
  if (character.level >= MAX_LEVEL) {
    setCanLevelUp(false);
    setLevelUpError(`Maximum level ${MAX_LEVEL} reached.`);
  }
}, [character.level]);
```

**Criterios de aceptación:**
- [ ] Wizard deshabilitado cuando nivel = 20
- [ ] Mensaje de error claro mostrado al usuario
- [ ] No permite iniciar wizard si ya es nivel 20

---

## FASE 2: Correcciones de Tipado y Lógica

### Dependencias: Fase 1 completada

---

### Task 2.1: Stat Cap Correcto (30 → 20)

**Descripción:** Corregir límite máximo de stats de 30 a 20.

**Severidad:** 🟡 MEDIA

**Ubicaciones:**
- `components/CreatorSteps.tsx` (líneas 133-135)
- Cualquier otro lugar que use MAX_STAT = 30

**Requisitos técnicos:**
```typescript
// En constants o al inicio del archivo
const MAX_ABILITY_SCORE = 20;
const MIN_ABILITY_SCORE = 1;

// Uso consistente
newStats[stat] = Math.min(Math.max(newValue, MIN_ABILITY_SCORE), MAX_ABILITY_SCORE);
```

**Criterios de aceptación:**
- [ ] Stats no pueden exceder 20
- [ ] ASI que llevaría stat a 21 lo cappea en 20
- [ ] D&D 2024 rules honored (30 es para racial bonuses solo)

---

### Task 2.2: Syntax Error en CombatTab.tsx

**Descripción:** Remover paréntesis extra en línea 734.

**Severidad:** 🟡 MEDIA

**Ubicación:** `components/sheet/CombatTab.tsx:734`

**Requisitos técnicos:**
```typescript
// ANTES
<div className={...)}>

// DESPUÉS
<div className={...}>
```

**Criterios de aceptación:**
- [ ] Build pasa sin errores
- [ ] No hay warnings de syntax en ese archivo

---

### Task 2.3: Type Safety - Eliminar `as any`

**Descripción:** Reemplazar casts inseguros `as any` con tipos proper.

**Severidad:** 🟡 MEDIA

**Ubicaciones identificadas:**
- `CharacterList.tsx:111` - `char.stats[stat as any]`
- `CreatorSteps.tsx:377, 415` - casts inseguros

**Requisitos técnicos:**
```typescript
// Crear tipo para stats
type StatKey = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
type Stats = Record<StatKey, number>;

// Uso correcto
const getStat = (char: Character, stat: StatKey): number => {
  return char.stats[stat] ?? 10;
};
```

---

### Task 2.4: React Hooks Dependencies

**Descripción:** Fix de useEffect dependency arrays incompletos.

**Severidad:** 🟡 MEDIA

**Requisitos técnicos:**
```typescript
// Verificar cada useEffect con eslint-plugin-react-hooks
// eslint-disable-next-line react-hooks/exhaustive-deps
// Solo si el ignore es intencional y documentado
```

---

## FASE 3: Level Reset System - Tests

### Dependencias: Fase 1 completada

---

### Task 3.1: Completar LevelResetModal Tests (5 falling)

**Descripción:** Fix de 5 tests que fallan en LevelResetModal.test.tsx.

**Severidad:** 🔴 CRÍTICA

**Tests identificados (del archivo):**
1. `should render snapshot items when provided`
2. `should show changes for selected snapshot`
3. `should call onRestore when restore button clicked`
4. `should call onClose when cancel button clicked`
5. `should display restore preview`

**Requisitos técnicos:**
```typescript
// Patrón de test que debe pasar
describe('Snapshot List', () => {
  it('should render snapshot items when provided', () => {
    const snapshots = [
      createMockSnapshot(4, Date.now() - 60000),
      createMockSnapshot(3, Date.now() - 120000),
    ];
    
    // Mock getChangesForSnapshot para retornar datos válidos
    mockGetChangesForSnapshot.mockReturnValue(createMockChanges());
    
    render(<LevelResetModal {...defaultProps} snapshots={snapshots} />);
    
    expect(screen.getByText('Level 4')).toBeTruthy();
    expect(screen.getByText('Level 3')).toBeTruthy();
  });
});
```

**Criterios de aceptación:**
- [ ] 5/5 tests de LevelResetModal pasan
- [ ] 22/22 tests de levelResetUtils pasan
- [ ] Coverage mínimo 80% en utils/

**Archivos:**
- `tests/LevelResetModal.test.tsx`
- `components/sheet/LevelResetModal.tsx`

---

### Task 3.2: Tests de Integración Level Reset

**Descripción:** Tests E2E del flujo completo level-up → reset.

**Requisitos técnicos:**
```typescript
describe('Level Reset E2E', () => {
  it('should complete level up and then reset', async () => {
    // 1. Crear personaje nivel 1
    // 2. Level up a nivel 2
    // 3. Guardar snapshot
    // 4. Resetear a nivel 1
    // 5. Verificar HP, stats, skills
  });
});
```

---

## FASE 4: Sistema de Logs

### Dependencias: Fase 1 completada

---

### Task 4.1: Logging para Level Up

**Descripción:** Agregar logs estructurados para tracking de level-ups.

**Severidad:** 🟡 MEDIA

**Requisitos técnicos:**
```typescript
// utils/logger.ts
export const LEVEL_UP_LOG_VERSION = '1.0';

interface LevelUpLogEntry {
  timestamp: number;
  characterId: string;
  fromLevel: number;
  toLevel: number;
  changes: {
    hpChange: number;
    newFeatures: string[];
    newFeats: string[];
    statsIncreased: string[];
  };
}

export function logLevelUp(entry: LevelUpLogEntry): void {
  if (import.meta.env.DEV) {
    console.log(`[LevelUp] ${entry.characterId}: Lv${entry.fromLevel} → Lv${entry.toLevel}`, entry.changes);
  }
  
  // Persistir en localStorage (opcional)
  const logs = JSON.parse(localStorage.getItem('level_up_logs') || '[]');
  logs.push(entry);
  if (logs.length > 100) logs.shift(); // Keep last 100
  localStorage.setItem('level_up_logs', JSON.stringify(logs));
}
```

**Criterios de aceptación:**
- [ ] Logs aparecen en consola durante DEV
- [ ] Logs persistidos para debugging
- [ ] Función llamada desde LevelUpWizard y SheetTabs

**Archivos a crear:**
- `utils/logger.ts`

**Archivos a modificar:**
- `components/sheet/LevelUpWizard/LevelUpWizard.tsx`
- `components/SheetTabs.tsx`

---

### Task 4.2: Logging para Errores de Storage

**Descripción:** Logs para manejo de errores de localStorage.

**Requisitos técnicos:**
```typescript
// En safeGetItem/safeSetItem
console.warn('[Storage] Error:', { key, error: error.message, quotaExceeded });
```

---

## FASE 5: Mejoras de UI/UX

### Dependencias: Fase 2 completada

---

### Task 5.1: Indicador Visual de Nivel 20

**Descripción:** UI que claramente indica cuando personaje alcanza nivel máximo.

**Severidad:** 🟢 BAJA

**Requisitos técnicos:**
```typescript
// En SheetTabs o LevelUpWizard
{character.level >= 20 && (
  <div className="bg-yellow-500/20 border border-yellow-500 rounded p-2 text-center">
    <span className="text-yellow-500 font-bold">⚠️ MAXIMUM LEVEL</span>
  </div>
)}
```

---

### Task 5.2: Modal de Confirmación Anti-Duplicación

**Descripción:** Confirmación antes de aplicar level-up accidental.

**Severidad:** 🟢 BAJA

**Requisitos técnicos:**
- Diálogo de confirmación antes de level up
- Opción de "undo" por 10 segundos post level-up
- Snapshot automático antes de level-up

---

## Resumen de Tareas por Fase

| Fase | Tareas | Complejidad | Tiempo Est. |
|------|--------|-------------|-------------|
| Fase 1: Estabilidad | 3 | Media | 1-2 horas |
| Fase 2: Tipado/Lógica | 4 | Baja | 2-3 horas |
| Fase 3: Tests | 2 | Media | 2-3 horas |
| Fase 4: Logging | 2 | Baja | 1-2 horas |
| Fase 5: UI/UX | 2 | Baja | 1-2 horas |
| **TOTAL** | **13** | - | **7-12 horas** |

---

## Dependencias Entre Módulos

```
┌──────────────────────────────────────────────────────────────┐
│                    GRAPH DE DEPENDENCIAS                      │
└──────────────────────────────────────────────────────────────┘

Task 1.1 (localStorage)                                       
    │
    ├── Task 1.2 (spell slots) ─────────────────────────────┐
    │                                                        │
    ├── Task 1.3 (level validation)                          │
    │    │                                                   │
    │    └── Task 2.1 (stat cap)                             │
    │         │                                              │
    │         └── Task 2.2 (syntax fix)                      │
    │              │                                         │
    │              └── Task 2.3 (type safety) ──────────────┤
    │                   │                                   │
    │                   └── Task 2.4 (hooks deps)            │
    │                        │                               │
    │                        └── Task 3.1 (tests) ──────────┤
    │                             │                          │
    │                             └── Task 3.2 (E2E tests)   │
    │                                  │                     │
    │                                  └── Task 4.1 (logs)    │
    │                                       │                 │
    │                                       └── Task 4.2       │
    │                                            │             │
    │                                            └── Task 5.1  │
    │                                                 │        │
    └── Task 5.2 (modal confirmation) ──────────────────────┘
```

---

## Riesgos y Mitigaciones

| ID | Riesgo | Impacto | Probabilidad | Mitigación |
|----|--------|---------|--------------|------------|
| R1 | Breaking change en localStorage API | Alto | Muy Bajo | Tests de regresión, validación gradual |
| R2 | Tests exponen bugs no relacionados | Medio | Medio | Tests en scope, no expandir sin approval |
| R3 | Performance degradation con logs | Bajo | Bajo | Logs solo en DEV, lazy loading |
| R4 | Conflictos con otros branches | Medio | Medio | PRs pequeños, review por cambios |
| R5 | Introducir nuevos bugs al fix | Alto | Medio | Tests primero, build después |

---

## Pruebas Requeridas

### Unit Tests

| Test | Archivo | Coverage Target |
|------|---------|----------------|
| safeGetItem/safeSetItem | `tests/storageUtils.test.ts` | 90% |
| Spell slot lookup | `tests/sheetUtils.test.ts` | 85% |
| Level validation | `tests/levelResetUtils.test.ts` | 90% |
| Stat capping | `tests/stats.test.ts` | 90% |

### Integration Tests

| Test | Descripción | Herramienta |
|------|-------------|-------------|
| Level Up Flow | Crear → Level Up → Verify | Vitest + Testing Library |
| Reset Flow | Level Up → Reset → Verify | Vitest + Testing Library |
| Storage Recovery | Clear storage → Recover → Verify | Manual + Vitest |

### E2E Tests (Opcional)

| Test | User Flow |
|------|-----------|
| Full Level 1-5 | Crear personaje, level up 4 veces, resetear |
| Edge Cases | Nivel 20, stats maxed, skills full |

---

## Checkpoints de Verificación

### Checkpoint 1: Después de Fase 1
```
- [ ] npm run build: PASS
- [ ] npm test: 22/22 levelResetUtils PASS
- [ ] No console.error en app startup
```

### Checkpoint 2: Después de Fase 2
```
- [ ] ESLint warnings < 50 (de 173 actuales)
- [ ] No 'as any' en componentes core
- [ ] TypeScript strict mode: PASS
```

### Checkpoint 3: Después de Fase 3
```
- [ ] npm test: 27/27 PASS (22 + 5 nuevos)
- [ ] Coverage > 80% en utils/
- [ ] LevelResetModal tests: 5/5 PASS
```

### Checkpoint 4: Final
```
- [ ] npm run build: PASS
- [ ] npm test: ALL PASS
- [ ] npm run lint: warnings < 30
- [ ] APK build: PASS
```

---

## Decisiones Arquitectónicas

### 1. Storage Strategy
- **Decisión:** Mantener localStorage como primary, Supabase como sync
- **Racional:** Offline-first para mobile, sync cuando connectivity

### 2. Logging Strategy
- **Decisión:** Logs solo en DEV mode
- **Racional:** Evitar performance hit en production

### 3. Test Strategy
- **Decisión:** Unit tests para utils, Integration para flows
- **Racional:** Coverage rápido, bugs críticos capturados

### 4. Type Safety
- **Decisión:** Reemplazar `any` progresivamente, no big bang
- **Racional:** Risk mitigation, cada fix verificable

---

## Items Excluidos (Sistema XP)

Según request del usuario, los siguientes items fueron **excluidos** explícitamente:
- Sistema de tracking de XP
- Tabla XP_THRESHOLDS
- Funciones grantXP(), addXP(), calculateLevelFromXP()
- Auto-level-up basado en XP thresholds
- XP display en UI

---

## Preguntas Abiertas

1. **Q1:** ¿Se desea mantener el flag `repeatable` en feats o es metadata no usada?
2. **Q2:** ¿Logs de level-up deben sincronizarse a Supabase o solo local?
3. **Q3:** ¿Nivel 20 debe tener estado especial visual o es suficiente con deshabilitar wizard?
4. **Q4:** ¿Tests E2E con Playwright o mantener solo Vitest?

---

## Autorización Requerida

Para proceder con la implementación, se requiere:
- [ ] Aprobación de este plan
- [ ] Priorización de fases (¿emppezar por Fase 1 o Fase 3?)
- [ ] Decisión sobre Q1-Q4

---

*Documento generado: 2026-04-09*
*Versión del agent: Planning v1.0*