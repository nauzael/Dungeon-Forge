# Guía de Implementación - Optimización de Sincronización

## Inicio Rápido

**Plan ID:** `sync-optimization-2026-05-25`  
**Estado:** READY FOR IMPLEMENTATION  
**Orden de ejecución:** Wave 1 → Wave 2 (parallelizable) → Wave 3 → Wave 4 → Wave 5  

---

## Wave 1: Debounce + Deduplicación

### Task 1.1: Hook useDebounce

**Archivo:** `src/utils/hooks/useDebounce.ts` (NEW)

**Requerimientos:**
- [ ] TypeScript strict, sin `any`
- [ ] 2 variantes: `useDebounce<T>()` y `useDebouncedCallback<T, R>()`
- [ ] Cleanup en unmount
- [ ] Support para async callbacks

**Código Base:**
```typescript
import { useState, useEffect, useRef, useCallback } from 'react';

// Variante 1: Debounce valores
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Variante 2: Debounce callbacks
export function useDebouncedCallback<T, R>(
  callback: (arg: T) => R | Promise<R>,
  delay: number = 500
): (arg: T) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (arg: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(arg);
      }, delay);
    },
    [callback, delay]
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}
```

**Verificación:**
- [ ] Hook compila sin errores TypeScript
- [ ] Cleanup retornado en useEffect
- [ ] Ambas variantes funcionan
- [ ] Exportadas en `utils/hooks/index.ts`

---

### Task 1.2: Aplicar Debounce a CombatTab.tsx

**Archivo:** `src/components/sheet/CombatTab.tsx` (MODIFY)

**Cambios Requeridos:**
1. Importar `useDebouncedCallback` de task-1-1
2. En `applyHpChange()`, usar debounce
3. En `applyAbilityChange()`, usar debounce
4. En `applySpellSlotChange()`, usar debounce

**Patrón:**
```typescript
// ANTES:
const applyHpChange = (newHp: number) => {
  const updated = { ...character, hp: { ...character.hp, current: newHp } };
  onUpdate(updated); // ❌ Inmediato, cada keystroke
};

// DESPUÉS:
const debouncedOnUpdate = useDebouncedCallback(onUpdate, 500);

const applyHpChange = (newHp: number) => {
  // Validación rápida
  if (isNaN(newHp) || newHp < 0) return;
  
  const updated = { ...character, hp: { ...character.hp, current: newHp } };
  debouncedOnUpdate(updated); // ✓ Debounced 500ms
};
```

**Búsqueda de handlers a modificar:**
```bash
grep -n "applyHpChange\|applyAbilityChange\|applySpellSlot" src/components/sheet/CombatTab.tsx
```

**Verificación:**
- [ ] Compila sin errores
- [ ] Cada keystroke en HP no dispara save inmediato
- [ ] 5 keystrokes → 1 save call (testeable en DevTools)
- [ ] Cleanup funciona en unmount

---

### Task 1.3: Deduplicar Listeners en App.tsx

**Archivo:** `src/App.tsx` (MODIFY)

**Cambios Requeridos:**
1. Encontrar 3 listeners de Supabase (líneas ~591-645)
2. Consolidar en single listener por character.id
3. Implementar dedup por (characterId, timestamp)

**Patrón de Dedup:**
```typescript
// ANTES:
// 3 listeners separados, cada uno hace setState
channel1.on('postgres_changes', { ... }, (payload) => {
  setCharacters(prev => [...prev]); // setState 1
});

channel2.on('postgres_changes', { ... }, (payload) => {
  setCharacters(prev => [...prev]); // setState 2
});

// DESPUÉS:
const processedUpdates = new Set<string>(); // Track (characterId, timestamp)

channel.on('postgres_changes', { ... }, (payload) => {
  const updateKey = `${payload.new.id}-${payload.new.updated_at}`;
  
  if (processedUpdates.has(updateKey)) {
    console.log('Duplicate update skipped', updateKey);
    return;
  }
  
  processedUpdates.add(updateKey);
  setCharacters(prev => prev.map(c => c.id === payload.new.id ? payload.new : c));
  
  // Cleanup old entries after 5 min
  setTimeout(() => processedUpdates.delete(updateKey), 5 * 60 * 1000);
});
```

**Verificación:**
- [ ] Single listener visible en logs
- [ ] Duplicate updates filtradas
- [ ] No memory leaks (cleanup funciona)
- [ ] Comportamiento visual sin cambios

---

## Wave 2: Validación Pre-save

### Task 2.1: Crear Validator

**Archivo:** `src/utils/validators.ts` (NEW)

**Requerimientos:**
```typescript
interface ValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

export function isValidCharacter(char: Character): ValidationResult {
  // Checks:
  // 1. ID no vacío
  if (!char.id) return { valid: false, error: 'Missing character ID' };
  
  // 2. Name no vacío
  if (!char.name || char.name.trim() === '') {
    return { valid: false, error: 'Character name required' };
  }
  
  // 3. HP válido
  if (isNaN(char.hp.current) || char.hp.current < 0) {
    return { valid: false, error: `Invalid HP: ${char.hp.current}` };
  }
  if (char.hp.current > char.hp.max) {
    return { valid: false, error: 'HP cannot exceed max HP' };
  }
  
  // 4. Ability scores [3, 20]
  for (const [ability, score] of Object.entries(char.stats || {})) {
    if (score < 3 || score > 20) {
      return { valid: false, error: `${ability} out of range: ${score}` };
    }
  }
  
  // 5. Inventory integrity
  if (char.inventory) {
    for (const item of char.inventory) {
      if (!item.id) return { valid: false, error: 'Inventory item missing ID' };
      if (item.quantity < 0) return { valid: false, error: 'Negative quantity' };
    }
  }
  
  return { valid: true };
}
```

**Verificación:**
- [ ] Valida todos los campos críticos
- [ ] Retorna error messages descriptivos
- [ ] No lanza excepciones
- [ ] Exported en utils/index.ts

---

### Task 2.2: Agregar Validación en Componentes

**Archivos:** 
- `src/components/sheet/CombatTab.tsx`
- `src/components/sheet/InventoryTab.tsx`
- `src/components/sheet/SpellsTab.tsx`

**Patrón:**
```typescript
// En cada handler (applyHpChange, addItem, etc):

const handleHpChange = (newHp: number) => {
  const updated = { ...character, hp: { ...character.hp, current: newHp } };
  
  // VALIDAR PRIMERO
  const validation = isValidCharacter(updated);
  if (!validation.valid) {
    console.error('Validation failed:', validation.error);
    showErrorToast(validation.error); // Implementar en task-3-2
    return; // ❌ NO llamar onUpdate
  }
  
  // VÁLIDO, proceder con debounce
  debouncedOnUpdate(updated);
};
```

**Verificación:**
- [ ] Validación corre antes de onUpdate
- [ ] Invalid data no se envía a servidor
- [ ] Error logged a console
- [ ] Componentes compilan

---

### Task 2.3: Validar localStorage al Cargar

**Archivo:** `src/App.tsx` (MODIFY - useEffect inicial)

**Patrón:**
```typescript
useEffect(() => {
  try {
    const stored = localStorage.getItem('dnd-characters');
    if (!stored) return;
    
    const chars = JSON.parse(stored) as Character[];
    const validated = chars.filter(char => {
      const result = isValidCharacter(char);
      if (!result.valid) {
        console.warn(`Removing invalid character ${char.id}:`, result.error);
      }
      return result.valid;
    });
    
    if (validated.length < chars.length) {
      console.warn(
        `Removed ${chars.length - validated.length} corrupted characters`
      );
      // Opcional: Guardar versión limpia
      try {
        localStorage.setItem('dnd-characters', JSON.stringify(validated));
      } catch (e) {
        console.error('Failed to save cleaned data', e);
      }
    }
    
    setCharacters(validated);
  } catch (e) {
    console.error('Failed to load characters from localStorage:', e);
    // Fallback a cloud load
    loadFromCloud();
  }
}, []);
```

**Verificación:**
- [ ] App inicia incluso si localStorage corrupto
- [ ] Errores logged
- [ ] Valid characters synced desde cloud
- [ ] Cleanup automático

---

## Wave 3: Error Handling + Rollback

### Task 3.1: Rollback en saveCharacterToCloud()

**Archivo:** `src/utils/supabase.ts` (MODIFY)

**Patrón:**
```typescript
export async function saveCharacterWithRollback(
  character: Character,
  supabase: SupabaseClient,
  onRollback: (snapshot: Character) => void
): Promise<void> {
  // Snapshot antes de send
  const snapshot = JSON.parse(JSON.stringify(character)) as Character;
  
  try {
    const { error } = await supabase
      .from('characters')
      .update(character)
      .eq('id', character.id);
    
    if (error) {
      throw new Error(`Save failed: ${error.message}`);
    }
  } catch (e) {
    // Rollback
    console.error('Save failed, rolling back:', e);
    onRollback(snapshot); // Restaurar snapshot local
    throw e; // Propagate para que error handler lo procese
  }
}
```

**Uso en App.tsx:**
```typescript
await saveCharacterWithRollback(
  character,
  supabase,
  (snapshot) => {
    setCharacters(prev =>
      prev.map(c => c.id === snapshot.id ? snapshot : c)
    );
  }
);
```

**Verificación:**
- [ ] Snapshot es deep copy
- [ ] Rollback restaura estado previo
- [ ] Error se propaga
- [ ] No data loss

---

### Task 3.2: Toast con Estado de Sincronización

**Archivo:** `src/components/SyncToast.tsx` (NEW)

**Tipos (agregar a types.ts):**
```typescript
type SyncState = 'idle' | 'syncing' | 'success' | 'error';

interface SyncStatus {
  state: SyncState;
  lastError?: string;
  characterId?: string;
  timestamp: number;
}

interface SyncContextType {
  status: SyncStatus;
  setStatus: (status: SyncStatus) => void;
  showSuccess: (message: string) => void;
  showError: (message: string, characterId?: string) => void;
}
```

**Context (src/contexts/SyncContext.tsx):**
```typescript
import React, { useState, createContext } from 'react';
import { SyncContextType, SyncStatus } from '../types';

export const SyncContext = createContext<SyncContextType | undefined>(undefined);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SyncStatus>({
    state: 'idle',
    timestamp: Date.now(),
  });

  const showSuccess = (message: string) => {
    setStatus({ state: 'success', timestamp: Date.now() });
    setTimeout(() => setStatus({ state: 'idle', timestamp: Date.now() }), 3000);
  };

  const showError = (message: string, characterId?: string) => {
    setStatus({
      state: 'error',
      lastError: message,
      characterId,
      timestamp: Date.now(),
    });
  };

  return (
    <SyncContext.Provider value={{ status, setStatus, showSuccess, showError }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSyncStatus(): SyncContextType {
  const context = React.useContext(SyncContext);
  if (!context) {
    throw new Error('useSyncStatus must be used within SyncProvider');
  }
  return context;
}
```

**Component (src/components/SyncToast.tsx):**
```typescript
import React from 'react';
import { useSyncStatus } from '../contexts/SyncContext';

export const SyncToast: React.FC = () => {
  const { status } = useSyncStatus();

  if (status.state === 'idle') return null;

  const icons = {
    syncing: '⏳',
    success: '✓',
    error: '✗',
  };

  return (
    <div
      className={`
        fixed bottom-4 right-4 px-4 py-2 rounded
        flex gap-2 items-center
        ${status.state === 'syncing' ? 'bg-blue-500' : ''}
        ${status.state === 'success' ? 'bg-green-500' : ''}
        ${status.state === 'error' ? 'bg-red-500' : ''}
        text-white
      `}
    >
      <span className="text-lg">{icons[status.state]}</span>
      <span>
        {status.state === 'syncing' && 'Guardando...'}
        {status.state === 'success' && 'Sincronizado'}
        {status.state === 'error' && `Error: ${status.lastError}`}
      </span>
    </div>
  );
};
```

**Verificación:**
- [ ] Toast aparece en estados correctos
- [ ] Auto-hide en success (3s)
- [ ] Persiste en error
- [ ] Mensaje es descriptivo

---

### Task 3.3: Integración Snapshot + Error State

**Archivo:** `src/App.tsx` (MODIFY)

En el handler principal de sync:
```typescript
const handleCharacterUpdate = async (character: Character) => {
  // Validar (task-2-2)
  const validation = isValidCharacter(character);
  if (!validation.valid) {
    showErrorToast(validation.error);
    return;
  }

  // Mostrar syncing state
  setSyncStatus({ state: 'syncing' });

  try {
    // Guardar con rollback (task-3-1)
    await saveCharacterWithRollback(
      character,
      supabase,
      (snapshot) => {
        setCharacters(prev =>
          prev.map(c => c.id === snapshot.id ? snapshot : c)
        );
      }
    );

    // Success
    setSyncStatus({ state: 'success' });
    setTimeout(() => setSyncStatus({ state: 'idle' }), 3000);
  } catch (error) {
    // Error
    const message = error instanceof Error ? error.message : 'Unknown error';
    setSyncStatus({
      state: 'error',
      lastError: message,
      characterId: character.id,
    });
    console.error('Sync error:', message);
  }
};
```

**Verificación:**
- [ ] Flow completo: validación → syncing → success/error
- [ ] Toast muestra estado correcto
- [ ] Rollback funciona on error
- [ ] No data loss

---

## Wave 4: Batching

### Task 4.1: Implementar saveBatch()

**Archivo:** `src/utils/supabase.ts` (ADD)

```typescript
interface SaveResult {
  success: boolean;
  characterId: string;
  timestamp: number;
  error?: string;
}

export async function saveBatch(
  characters: Character[],
  supabase: SupabaseClient
): Promise<SaveResult[]> {
  // Guardar snapshots para rollback
  const snapshots = new Map(
    characters.map(c => [c.id, JSON.parse(JSON.stringify(c))])
  );

  try {
    // Enviar todos en paralelo
    const results = await Promise.allSettled(
      characters.map(char =>
        supabase
          .from('characters')
          .update(char)
          .eq('id', char.id)
      )
    );

    // Procesar resultados
    const saveResults: SaveResult[] = [];
    const failures: string[] = [];

    results.forEach((result, idx) => {
      const char = characters[idx];
      if (result.status === 'fulfilled') {
        const { error } = result.value;
        if (error) {
          saveResults.push({
            success: false,
            characterId: char.id,
            timestamp: Date.now(),
            error: error.message,
          });
          failures.push(char.id);
        } else {
          saveResults.push({
            success: true,
            characterId: char.id,
            timestamp: Date.now(),
          });
        }
      } else {
        saveResults.push({
          success: false,
          characterId: char.id,
          timestamp: Date.now(),
          error: result.reason?.message,
        });
        failures.push(char.id);
      }
    });

    // Si hay failures, rollback TODOS
    if (failures.length > 0) {
      console.error(
        `Batch save failed for ${failures.length}/${characters.length} characters, rolling back all`
      );
      throw new Error(`Batch save failed: ${failures.join(', ')}`);
    }

    return saveResults;
  } catch (error) {
    // Rollback global
    console.error('Batch save error, rolling back:', error);
    throw error;
  }
}
```

**Verificación:**
- [ ] Múltiples saves → single request
- [ ] Promise.allSettled maneja partial failures
- [ ] Rollback global si alguno falla
- [ ] Results retornados correctamente

---

### Task 4.2: Integrar en App.tsx

Reemplazar calls individuales:
```typescript
// ANTES:
characters.forEach(char => {
  saveCharacterToCloud(char, supabase);
});

// DESPUÉS:
try {
  const results = await saveBatch(characters, supabase);
  const succeeded = results.filter(r => r.success).length;
  console.log(`Batch saved: ${succeeded}/${results.length} characters`);
  showSuccessToast(`Saved ${succeeded} characters`);
} catch (error) {
  showErrorToast('Batch save failed');
}
```

**Verificación:**
- [ ] Compila sin errores
- [ ] Network tab muestra single request
- [ ] Todos los caracteres se guardan
- [ ] Error handling funciona

---

## Wave 5: Testing + Documentation

### Task 5.1: E2E Testing Debounce

**Escenarios de Prueba:**

1. **Rapid HP changes**
   - Abrir character sheet
   - HP field, editar 10 veces en <1s
   - Verificar DevTools Network: 1 request (no 10)
   - ✓ PASS si 1 request

2. **Cross-tab editing**
   - CombatTab abierto
   - Editar HP
   - Simultáneamente InventoryTab: agregar item
   - Verificar Network: 1 batched request
   - ✓ PASS si 1 request con ambos cambios

3. **Error recovery**
   - Editar HP
   - Simular offline (DevTools → offline)
   - Toast muestra error
   - Habilitar online
   - Toast muestra retry
   - Click retry
   - ✓ PASS si character se sincroniza sin data loss

4. **Debounce timing**
   - Editar HP
   - Esperar 500ms
   - Verificar que request se envía exactamente a los 500ms
   - ✓ PASS si timing es preciso

---

### Task 5.2: Error Scenario Testing

1. **Invalid HP (NaN)**
   - Editar HP field, dejar vacío
   - Intentar guardar
   - Toast muestra validación error
   - No request enviado
   - ✓ PASS si rechazado sin request

2. **HP > maxHP**
   - Character con maxHP = 100
   - Intentar setear HP = 150
   - Toast muestra error
   - No request enviado
   - ✓ PASS si rechazado

3. **Network 500 error**
   - Simular server error (DevTools Network → throttle)
   - Editar character
   - Toast muestra "Error"
   - Click retry
   - Simular server recovery
   - ✓ PASS si retry funciona

4. **localStorage corruption**
   - Manually corrupt localStorage (DevTools → Application)
   - Refresh page
   - App carga limpiamente
   - Caracteres válidos cargados
   - ✓ PASS si app recovers

5. **Offline to online**
   - Offline mode (DevTools)
   - Editar character
   - Toast muestra "Error: offline"
   - Online mode
   - Toast muestra retry
   - Character sincroniza
   - ✓ PASS si sync ocurre on reconnect

---

### Task 5.3: Documentation

**Deliverables:**

1. **SYNC-OPTIMIZATION.md**
   - Explicar debounce mechanism
   - Explicar dedup logic
   - Explicar batching
   - Explicar error recovery
   - Before/after metrics
   - Screenshots

2. **Performance Report**
   - Request count: before vs after
   - Data loss incidents: before vs after
   - Battery savings estimate
   - Metrics table

3. **Architecture Diagram**
   - Flow: keystroke → debounce → validation → batch → sync
   - Error paths
   - Rollback logic

4. **Troubleshooting**
   - "Changes not syncing"
   - "Data corruption detected"
   - "Rollback stuck"

---

## 🎯 Success Criteria Checklist

### Wave 1
- [ ] useDebounce hook funciona correctamente
- [ ] CombatTab debounce implementado
- [ ] Listeners deduplicados
- [ ] 10 edits = 1 request (verificable en Network tab)

### Wave 2
- [ ] Validator rechaza NaN/Infinity
- [ ] Componentes validan antes de guardar
- [ ] localStorage validado al cargar
- [ ] Errores de validación logged

### Wave 3
- [ ] Rollback funciona on network error
- [ ] Toast muestra estado sincronización
- [ ] Error messages descriptivos
- [ ] No data loss

### Wave 4
- [ ] Multiple saves batched (1 request)
- [ ] Transactional: todo or nada
- [ ] Error handling robusto

### Wave 5
- [ ] E2E tests pasados
- [ ] Documentation completa
- [ ] Performance improvement validated

---

## 📞 Contacto

- **Plan ID:** `sync-optimization-2026-05-25`
- **Planificador:** gem-planner
- **Implementador:** gem-implementer
- **Tester:** gem-browser-tester
- **Documentación:** gem-documentation-writer

¡Listo para empezar! 🚀
