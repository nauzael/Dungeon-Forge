# SPEC: Sistema de Reseteo de Niveles

## 1. Objetivo

Implementar un sistema completo de **reseteo de niveles** que permita a los usuarios retroceder a cualquier nivel previamente completado en Dungeon Forge. El sistema almacenará snapshots completos del personaje en cada level up, permitirá restaurar cualquier estado anterior, y mantendrá logs de auditoría para rastrear todos los movimientos.

### Usuarios
- Jugadores de D&D 5e que usan Dungeon Forge para gestionar sus personajes
- Necesidad: Corregir decisiones de build sin perder todo el progreso

### Criterios de Éxito
- [ ] Usuario puede ver todos los niveles disponibles para retroceder
- [ ] Cada snapshot contiene el estado completo del personaje
- [ ] Restauración restaura HP, stats, skills, feats, subclass, recursos de clase
- [ ] Confirmación obligatoria antes de cualquier reseteo
- [ ] Logs de auditoría capturan todas las operaciones
- [ ] Integridad de datos garantizada post-reset
- [ ] Tests unitarios y de integración pasan al 100%

---

## 2. Stack Tecnológico

- **Framework**: React 19 + TypeScript (strict mode)
- **Estado**: React hooks (useState, useReducer, useRef, useCallback, useMemo)
- **Estilizado**: Tailwind CSS + Material Symbols
- **Testing**: Vitest + React Testing Library
- **Persistencia**: localStorage + Supabase (futuro)

---

## 3. Comandos

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Tests
npm test

# Tests con coverage
npm test -- --coverage

# Lint
npm run lint
```

---

## 4. Estructura del Proyecto

```
src/
├── hooks/
│   └── useLevelSnapshots.ts           # Hook principal de snapshots
├── components/
│   └── sheet/
│       └── LevelResetModal.tsx         # Modal de reseteo de niveles
├── utils/
│   └── levelResetUtils.ts              # Utilidades de reseteo
├── types/
│   └── levelSnapshot.ts                # Tipos específicos del sistema
└── __tests__/
    ├── hooks/
    │   └── useLevelSnapshots.test.ts   # Tests del hook
    └── components/
        └── LevelResetModal.test.tsx    # Tests del modal
```

---

## 5. Arquitectura del Sistema

### 5.1 Tipos de Datos

```typescript
// types/levelSnapshot.ts

export interface LevelSnapshot {
  id: string;                          // UUID del snapshot
  characterId: string;                 // ID del personaje
  level: number;                       // Nivel en el momento del snapshot
  timestamp: number;                    // Unix timestamp
  snapshotData: CharacterSnapshot;       // Datos comprimidos del personaje
  metadata: SnapshotMetadata;           // Metadatos del snapshot
}

export interface CharacterSnapshot {
  level: number;
  class: string;
  subclass?: string;
  hp: { current: number; max: number; temp: number };
  stats: Record<string, number>;
  skills: string[];
  feats: string[];
  profBonus: number;
  // Recursos de clase
  hitDice?: { current: number; max: number };
  rageUses?: { current: number; max: number };
  rageDamage?: number;
  bardicInspiration?: { current: number; max: number };
  bardicInspirationDie?: number;
  channelDivinity?: { current: number; max: number };
  wildShape?: { current: number; max: number };
  wildShapeMax?: number;
  layOnHands?: { current: number; max: number };
  actionSurge?: { current: number; max: number };
  secondWind?: { current: number; max: number };
  indomitable?: { current: number; max: number };
  sneakAttackDie?: number;
  martialArtsDie?: number;
  kiMax?: number;
  extraAttacks?: number;
  pactSlotLevel?: number;
  mysticArcanum?: Record<string, string>;
  arcaneRecovery?: { uses: number };
  spellMastery?: string[];
  signatureSpells?: string[];
  metamagics?: string[];
  preparedSpells?: string[];
  innatespells?: string[];
  invocations?: string[];
  weaponMasteries?: string[];
  focus?: { current: number; max: number };
  sorceryPoints?: { current: number; max: number };
  innateSorcery?: { current: number; max: number };
  hunterMarkUses?: { current: number; max: number };
  magicalCunning?: { current: number; max: number };
  fontOfInspiration?: { current: number; max: number };
  lucky?: { current: number; max: number };
  inspiration?: { current: number; number: number };
  empoweredSneakAttack?: { dice: number };
  vestige?: { type: string; hp: { current: number; max: number }; domain: string };
  guardianBondTarget?: string;
}

export interface SnapshotMetadata {
  source: 'level_up' | 'manual';
  reason?: string;
  characterName: string;
}

export interface AuditLog {
  id: string;
  characterId: string;
  action: 'SNAPSHOT_CREATED' | 'LEVEL_RESET' | 'SNAPSHOT_DELETED';
  fromLevel: number;
  toLevel?: number;
  snapshotId?: string;
  timestamp: number;
  characterState: Partial<Character>;
}
```

### 5.2 Hook Principal: useLevelSnapshots

```typescript
// hooks/useLevelSnapshots.ts

const MAX_SNAPSHOTS = 20;  // Límite máximo de snapshots almacenados
const STORAGE_KEY = 'dungeon_forge_level_snapshots';

interface UseLevelSnapshotsReturn {
  snapshots: LevelSnapshot[];
  currentLevel: number;
  createSnapshot: (character: Character, reason?: string) => LevelSnapshot;
  restoreSnapshot: (snapshotId: string, character: Character) => Character;
  deleteSnapshot: (snapshotId: string) => void;
  canRestore: (snapshotId: string) => boolean;
  getAvailableLevels: () => number[];
  clearOldSnapshots: () => void;
  auditLog: AuditLog[];
  memoryUsage: number;
}
```

### 5.3 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SHEETTABS (Parent)                          │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ useLevelSnapshots()                                          │   │
│  │ - snapshots: LevelSnapshot[]                                │   │
│  │ - createSnapshot() → se llama en initiateLevelUp()         │   │
│  │ - restoreSnapshot() → se llama en undoLevelUp()            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                     │
│              ┌───────────────┼───────────────┐                     │
│              ▼               ▼               ▼                     │
│  ┌──────────────────┐  ┌─────────────┐  ┌──────────────────┐      │
│  │ initiateLevelUp()│  │LevelUpWizard│  │ LevelResetModal │      │
│  │ - Crea snapshot  │  │             │  │ - Lista niveles │      │
│  │ - Actualiza UI  │  │ - Modifica │  │ - Selección     │      │
│  └──────────────────┘  └─────────────┘  │ - Confirmación │      │
│                                         └──────────────────┘      │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ AUDIT LOG (localStorage)                                     │   │
│  │ - SNAPHOT_CREATED: nivel X, timestamp                       │   │
│  │ - LEVEL_RESET: nivel X → nivel Y, timestamp                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Interfaz de Usuario

### 6.1 Modal de Reseteo de Niveles

```
┌────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────┐  │
│  │ [X]                                               │  │
│  │                                                     │  │
│  │  🔄 Level Reset                                    │  │
│  │                                                     │  │
│  │  Current Level: 5                                  │  │
│  │  Available Snapshots: 4                            │  │
│  │                                                     │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │  Select a level to restore:                │   │  │
│  │  │                                             │   │  │
│  │  │  ● Level 4  ✓ (Current)  - 2 hours ago     │   │  │
│  │  │  ○ Level 3             - 1 day ago         │   │  │
│  │  │  ○ Level 2             - 3 days ago        │   │  │
│  │  │  ○ Level 1             - 1 week ago        │   │  │
│  │  │                                             │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │                                                     │  │
│  │  ⚠️ Warning:                                      │  │
│  │  Restoring to Level 3 will:                        │  │
│  │  • Set HP to 18                                    │  │
│  │  • Remove 2 prepared spells                        │  │
│  │  • Remove feat: Great Weapon Master               │  │
│  │  • Reset subclass abilities to Level 3             │  │
│  │                                                     │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │        🔄 Reset to Level 3                   │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │                                                     │  │
│  │  ┌───────────┐ ┌───────────────┐                   │  │
│  │  │  Cancel  │ │ Delete Snapshot│                   │  │
│  │  └───────────┘ └───────────────┘                   │  │
│  │                                                     │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### 6.2 Indicadores Visuales

| Estado | Color | Icono |
|--------|-------|-------|
| Nivel actual | Verde | ✓ |
| Snapshot disponible | Azul | ○ |
| Nivel sin snapshot | Gris | — |
| Seleccionado | Amarillo | ● |
| Warning | Naranja | ⚠️ |

---

## 7. Lógica de Negocio

### 7.1 Creación de Snapshot

```typescript
const createSnapshot = (character: Character, reason?: string): LevelSnapshot => {
  // 1. Validar que el personaje existe
  if (!character?.id) throw new Error('Character is required');

  // 2. Crear ID único
  const id = crypto.randomUUID();

  // 3. Comprimir datos del personaje
  const snapshotData: CharacterSnapshot = {
    level: character.level,
    class: character.class,
    // ... todos los campos relevantes
  };

  // 4. Crear snapshot
  const snapshot: LevelSnapshot = {
    id,
    characterId: character.id,
    level: character.level,
    timestamp: Date.now(),
    snapshotData,
    metadata: {
      source: 'level_up',
      reason,
      characterName: character.name,
    },
  };

  // 5. Guardar en localStorage
  const snapshots = getSnapshotsFromStorage();
  snapshots.push(snapshot);
  saveSnapshotsToStorage(snapshots);

  // 6. Log de auditoría
  addAuditLog({
    id: crypto.randomUUID(),
    characterId: character.id,
    action: 'SNAPSHOT_CREATED',
    fromLevel: character.level,
    timestamp: Date.now(),
    characterState: { level: character.level },
  });

  return snapshot;
};
```

### 7.2 Restauración de Snapshot

```typescript
const restoreSnapshot = (snapshotId: string, character: Character): Character => {
  // 1. Obtener snapshot
  const snapshots = getSnapshotsFromStorage();
  const snapshot = snapshots.find(s => s.id === snapshotId);

  if (!snapshot) throw new Error('Snapshot not found');

  // 2. Validar que es un nivel anterior
  if (snapshot.level >= character.level) {
    throw new Error('Cannot restore to same or higher level');
  }

  // 3. Crear backup del estado actual antes de restaurar
  const currentSnapshot = createSnapshot(character, 'Pre-reset backup');

  // 4. Restaurar estado
  const restoredCharacter: Character = {
    ...character,
    level: snapshot.snapshotData.level,
    hp: { ...snapshot.snapshotData.hp },
    stats: { ...snapshot.snapshotData.stats },
    skills: [...snapshot.snapshotData.skills],
    feats: [...snapshot.snapshotData.feats],
    profBonus: snapshot.snapshotData.profBonus,
    subclass: snapshot.snapshotData.subclass,
    // ... todos los campos de recursos de clase
  };

  // 5. Log de auditoría
  addAuditLog({
    id: crypto.randomUUID(),
    characterId: character.id,
    action: 'LEVEL_RESET',
    fromLevel: character.level,
    toLevel: snapshot.snapshotData.level,
    snapshotId,
    timestamp: Date.now(),
    characterState: {
      level: character.level,
      hp: character.hp,
    },
  });

  return restoredCharacter;
};
```

### 7.3 Validaciones

```typescript
const canRestore = (snapshotId: string): boolean => {
  const snapshot = getSnapshot(snapshotId);
  return snapshot?.metadata?.source === 'level_up';
};

const getAvailableLevels = (characterId: string): number[] => {
  const snapshots = getSnapshotsForCharacter(characterId);
  return snapshots.map(s => s.level).sort((a, b) => b - a);
};
```

---

## 8. Persistencia

### 8.1 localStorage Schema

```typescript
// Clave: 'dungeon_forge_level_snapshots'
interface StoredData {
  snapshots: Record<string, LevelSnapshot[]>;  // Por characterId
  auditLog: AuditLog[];
  version: string;
}
```

### 8.2 Límites de Memoria

| Recurso | Límite | Acción |
|---------|--------|--------|
| Snapshots por personaje | 20 | Eliminar más antiguos |
| Audit logs por personaje | 100 | Eliminar más antiguos |
| Tamaño total localStorage | 5MB | Warn en consola |

---

## 9. Estrategia de Testing

### 9.1 Tests Unitarios (useLevelSnapshots)

```typescript
describe('useLevelSnapshots', () => {
  // createSnapshot
  it('should create snapshot with correct data');
  it('should generate unique ID for each snapshot');
  it('should store snapshot in localStorage');
  it('should add audit log entry');

  // restoreSnapshot
  it('should restore character to snapshot level');
  it('should preserve all class-specific resources');
  it('should throw error for non-existent snapshot');
  it('should throw error for same-level restore');
  it('should create backup before restoring');

  // canRestore
  it('should return true for level_up snapshots');
  it('should return false for manual snapshots');

  // Memory management
  it('should enforce MAX_SNAPSHOTS limit');
  it('should remove oldest snapshots when limit exceeded');
});
```

### 9.2 Tests de Integración (LevelResetModal)

```typescript
describe('LevelResetModal', () => {
  // Render
  it('should display all available levels');
  it('should show current level indicator');
  it('should disable restore button when no selection');

  // Interactions
  it('should highlight selected level');
  it('should show warning when selecting level');
  it('should call onConfirm with correct character');

  // Multiple operations
  it('should update snapshot list after reset');
  it('should handle rapid reset operations');
  it('should maintain state across re-renders');
});
```

### 9.3 Tests de Consistencia de Datos

```typescript
describe('Data Consistency', () => {
  it('should preserve all 50+ character fields during restore');
  it('should handle nested objects correctly');
  it('should handle array fields correctly');
  it('should handle undefined optional fields');
  it('should maintain referential integrity');
});
```

---

## 10. Límites y Reglas

### Siempre hacer:
- Validar inputs antes de procesar
- Crear backup antes de cualquier reseteo
- Loguear todas las operaciones en auditoría
- Verificar límites de localStorage
- Limpiar snapshots antiguos

### Preguntar primero:
- Cambiar MAX_SNAPSHOTS de 20 a otro valor
- Agregar persistencia en Supabase
- Modificar la estructura de CharacterSnapshot

### Nunca hacer:
- Permitir restore sin confirmación
- Restaurar a nivel igual o superior
- Eliminar snapshots sin guardar backup
- Ignorar errores de localStorage

---

## 11. Preguntas Abiertas

1. ¿Debería el sistema crear snapshots automáticos en cada Level Up, o solo manuales?
   - **Decisión**: Automático en Level Up, manual disponible como opción

2. ¿Debe persistir los snapshots en Supabase para compartir entre dispositivos?
   - **Decisión**: Por ahora solo localStorage; Supabase en fase 2

3. ¿Cuántos snapshots máximo por personaje?
   - **Decisión inicial**: 20 (aproximadamente 2MB considerando ~100KB por snapshot)

4. ¿Debe haber límite de edad para snapshots (ej: eliminar después de 30 días)?
   - **Decisión**: No por ahora; el usuario controla explícitamente

---

## 12. Criterios de Éxito

- [ ] `npm test` pasa al 100% sin errores
- [ ] Modal se abre desde SheetTabs
- [ ] Lista muestra todos los niveles disponibles
- [ ] Restauración funciona para cualquier nivel anterior
- [ ] HP, stats, skills, feats se restauran correctamente
- [ ] Recursos de clase se restauran correctamente
- [ ] Confirmación obligatoria antes de restaurar
- [ ] Logs de auditoría se generan correctamente
- [ ] No hay pérdida de datos en múltiples operaciones
- [ ] UI es responsiva y accesible
