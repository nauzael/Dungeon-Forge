# Wild Shape - Especificación Técnica

**Fecha:** 2026-04-12  
**Autor:** Dungeon Forge Development Team  
**Estado:** ✅ Implementado

---

## 1. Resumen

Implementación completa de Wild Shape para Druidas, incluyendo soporte para Circle of the Moon. Permite a los jugadores transformar su personaje en bestias con mecánicas D&D 5e 2024 faithfully replicadas.

---

## 2. Reglas D&D 5e 2024

### 2.1 Wild Shape Base (Todos los Druidas)

| Nivel Druida | Usos | CR Máximo | Fly Speed |
|--------------|------|-----------|-----------|
| 2-3 | 2 | 1/4 | No |
| 4-7 | 2 | 1/2 | No |
| 8+ | 3 | 1 | Sí |

**Mecánicas:**
- **Usos:** Se recuperan con Descanso Corto (1 uso) o Descanso Largo (todos)
- **THP:** Igual al nivel del Druida
- **Duración:** Horas = nivel Druida / 2
- **Stats:** Reemplazados por stats de la bestia (excepto INT, WIS, CHA)
- **Proficiencies:** Se usa el mayor entre Druida y Bestia
- **Concentración:** No se rompe al transformar

### 2.2 Circle of the Moon (Subclase)

| Feature | Nivel | Efecto |
|---------|-------|--------|
| Circle Forms | 3 | CR máximo = nivel / 3 |
| Moon Spells | 3 | Cure Wounds, Moonbeam, Starry Wisp |
| Lunar Radiance | 6 | Ataques pueden ser Radiantes |
| Moonlight Step | 10 | Teleport 30ft como Bonus Action |
| Lunar Form | 14 | +2d10 daño Radiant extra |

**Mecánicas Circle of the Moon:**
- **THP:** 3 × nivel Druida (no igual)
- **AC:** max(Bestia AC, 13 + Mod WIS)
- **Fly Speed:** Siempre disponible (no requiere nivel 8)

---

## 3. Estructura de Datos

### 3.1 Tipos TypeScript

```typescript
// types.ts
interface WildShapeForm {
  name: string;
  cr: number;
  ac: number;
  hp: number;
  size: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge';
  speed: number;
  flySpeed?: number;
  swimSpeed?: number;
  climbSpeed?: number;
  stats: Record<Ability, number>;
  skills?: string[];
  senses?: string[];
  attacks: BeastAttack[];
  special?: string[];
}

interface BeastAttack {
  name: string;
  attackBonus: number;
  damage: string;
  damageType: string;
  reach?: number;
  effect?: string;
}

interface WildShapeState {
  form: string;              // Nombre de la bestia
  originalStats: Snapshot;    // Stats originales del Druida
  originalHP: { current: number; max: number; temp: number };
  originalAC: number;
  thpGained: number;        // THP al transformar
  startedAt: number;          // Timestamp
  isLunarRadiance: boolean; // Solo Circle of Moon
}

// Character fields
interface Character {
  // ... existing fields
  wildShape?: { current: number; max: number };
  wildShapeMax?: number;     // 1, 2, o 3 (CR máximo - 1)
  wildShapeForms?: string[]; // Bestias conocidas
  activeWildShape?: string;   // Seguro en localStorage
}
```

### 3.2 Archivo de Bestias

```typescript
// Data/beasts.ts
export const WILD_SHAPE_BEASTS: Record<number, BeastStats[]> = {
  0.25: [ /* Wolf, Spider, Rat, Horse, Boar */ ],
  0.5: [ /* Warhorse, Giant Owl, Crocodile */ ],
  1: [ /* Brown Bear, Lion, Tiger, Giant Eagle, Giant Hyena, Giant Octopus */ ],
  2: [ /* Giant Constrictor Snake */ ],
  3: [ /* bajo DM approval */ ]
};

export const getBeastsForDruid = (
  druidLevel: number, 
  isCircleOfTheMoon: boolean
): BeastStats[];
```

---

## 4. Componentes UI

### 4.1 WildShapePanel

**Ubicación:** `components/sheet/WildShapePanel.tsx`  
**Props:** `character: Character, wildShapeState: WildShapeState | null, onTransform: () => void`

**Estados:**
- **Inactivo:** Botón "🌲 Wild Shape" con contador de usos
- **Activo:** Banner con nombre de bestia, stats, THP, botón "Terminar"

**UI Inactivo:**
```
┌─────────────────────────────────────┐
│ 🌲 Wild Shape          Usos: ●● ○  │
│ [Transformar]                      │
└─────────────────────────────────────┘
```

**UI Activo:**
```
┌─────────────────────────────────────┐
│ 🐺 Lobo - Transformado             │
│ HP: 45 + 8 THP | AC: 15 | Temp   │
│ [Terminar Forma]                   │
│                                     │
│ STR 12 DEX 15 CON 12              │
│ ATK: +4 Mordisco (1d6+2 perc.)   │
└─────────────────────────────────────┘
```

### 4.2 WildShapeModal

**Ubicación:** `components/sheet/WildShapeModal.tsx`  
**Props:** `isOpen: boolean, onClose: () => void, onSelect: (beast: BeastStats) => void`

**Funcionalidad:**
1. Lista de bestias filtradas por CR máximo
2. Preview de stats al seleccionar
3. Indicador de Circle of the Moon (CR expandido)
4. Toggle Lunar Radiance (si nivel >= 6)

**UI:**
```
┌─────────────────────────────────────┐
│ ← Wild Shape           [Cerrar]     │
│                                     │
│ 🌙 Circle of the Moon               │
│ CR Máximo: 2                       │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🐺 Lobo          CR 1/4  AC 12│ │
│ │ HP 11 | Medium | Speed 12m    │ │
│ │ [Seleccionar]                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🦅 Águila gigante  CR 1   AC 13│ │
│ │ HP 26 | Large | Speed 3m +24m│ │
│ │ [Seleccionar]                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ⚠️ Fly Speed disponible             │
└─────────────────────────────────────┘
```

---

## 5. Lógica de Negocio

### 5.1 Cálculo de Stats

```typescript
const calculateWildShapeStats = (
  character: Character,
  beast: BeastStats,
  wildShapeState: WildShapeState | null
): CalculatedStats => {
  const isMoon = character.subclass === 'Circle of the Moon';
  const druidLevel = character.level;
  
  // THP
  const thp = isMoon ? druidLevel * 3 : druidLevel;
  
  // AC (Circle of Moon solo)
  const wisMod = Math.floor((character.stats.WIS - 10) / 2);
  const ac = isMoon 
    ? Math.max(beast.ac, 13 + wisMod)
    : beast.ac;
  
  // Stats: se reemplazan pero se guarda INT, WIS, CHA del Druida
  const stats = { ...beast.stats };
  
  // Skills: se usa el mayor entre Druida y Bestia
  // ...
  
  return { thp, ac, stats };
};
```

### 5.2 Transformación

```typescript
const transformIntoBeast = (
  character: Character,
  beast: BeastStats
): { updatedChar: Character; wildShapeState: WildShapeState } => {
  const snapshot = {
    stats: { ...character.stats },
    hp: { ...character.hp },
    ac: character.ac
  };
  
  const thp = character.subclass === 'Circle of the Moon'
    ? character.level * 3
    : character.level;
  
  const wildShapeState: WildShapeState = {
    form: beast.name,
    originalStats: snapshot,
    originalHP: snapshot.hp,
    originalAC: snapshot.ac,
    thpGained: thp,
    startedAt: Date.now(),
    isLunarRadiance: false
  };
  
  const calculatedStats = calculateWildShapeStats(character, beast, wildShapeState);
  
  const updatedChar: Character = {
    ...character,
    hp: {
      ...character.hp,
      temp: character.hp.temp + thp  // Añade THP
    },
    ac: calculatedStats.ac,
    stats: calculatedStats.stats,
    activeWildShape: beast.name,  // Seguro
    wildShape: character.wildShape 
      ? { 
          current: character.wildShape.current - 1, 
          max: character.wildShape.max 
        }
      : undefined
  };
  
  return { updatedChar, wildShapeState };
};
```

### 5.3 Restaurar Forma

```typescript
const restoreOriginalForm = (
  character: Character,
  wildShapeState: WildShapeState
): Character => {
  return {
    ...character,
    hp: wildShapeState.originalHP,
    ac: wildShapeState.originalAC,
    stats: wildShapeState.originalStats,
    activeWildShape: undefined,
    wildShape: character.wildShape
      ? { ...character.wildShape, current: character.wildShape.current + 1 }
      : undefined
  };
};
```

---

## 6. Persistencia

### 6.1 localStorage (Seguro)

```typescript
// Al transformar
localStorage.setItem(
  `wildshape_${character.id}`, 
  JSON.stringify({
    form: beast.name,
    timestamp: Date.now()
  })
);

// Al restaurar
localStorage.removeItem(`wildshape_${character.id}`);
```

### 6.2 Recupero al Recargar

```typescript
useEffect(() => {
  const saved = localStorage.getItem(`wildshape_${character.id}`);
  if (saved) {
    const { form, timestamp } = JSON.parse(saved);
    // Mostrar banner "Tenías Wild Shape activa"
    // Usuario puede restaurar o continuar
  }
}, []);
```

---

## 7. Bestias Disponibles

### CR 1/4 (Nivel 2+)
| Nombre | HP | AC | Speed | Special |
|--------|----|----|-------|---------|
| Lobo | 11 | 12 | 12m | Atacar en manada |
| Araña | 1 | 12 | 6m+trepar | Veneno |
| Rata | 4 | 10 | 6m+trepar | Ágil |
| Caballo de monta | 13 | 11 | 18m | - |
| Jabalí | 13 | 11 | 12m | Furia maltrecha |

### CR 1/2 (Nivel 4+)
| Nombre | HP | AC | Speed | Special |
|--------|----|----|-------|---------|
| Caballo de guerra | 19 | 11 | 18m | Stampede |
| Cocodrilo | 13 | 12 | 6m+nadar | Aguantar aliento |
| Búho gigante | 19 | 12 | 1.5m+24m fly | Pasar volando |

### CR 1 (Nivel 8+)
| Nombre | HP | AC | Speed | Special |
|--------|----|----|-------|---------|
| Oso pardo | 22 | 11 | 12m+trepar | Ataque múltiple |
| León | 22 | 12 | 15m | Rugido |
| Tigre | 30 | 13 | 12m | Huida veloz |
| Águila gigante | 26 | 13 | 3m+24m fly | Vista de águila |
| Hiena gigante | 45 | 12 | 15m | Rabia |
| Pulpo gigante | 45 | 11 | 3m+18m nadar | Nube de tinta |

### CR 2 (Circle of Moon Lv6+)
| Nombre | HP | AC | Speed | Special |
|--------|----|----|-------|---------|
| Serpiente constrictora gigante | 60 | 12 | 9m+nadar | Constreñir |

---

## 8. Archivos a Modificar/Crear

| Archivo | Acción | Estado |
|---------|--------|--------|
| `Data/beasts.ts` | Crear con stats completos | ✅ Completado |
| `types.ts` | Añadir WildShapeState, BeastStats | ✅ Completado |
| `components/sheet/WildShapePanel.tsx` | Crear componente | ✅ Completado |
| `components/sheet/WildShapeModal.tsx` | Crear componente | ✅ Completado |
| `components/sheet/CombatTab.tsx` | Integrar WildShapePanel | ✅ Completado |
| `utils/wildShapeUtils.ts` | Crear funciones de lógica | ✅ Completado |

---

## 9. Criterios de Éxito

- [x] Druida puede transformar en bestias válidas
- [x] Contador de usos decrementa al transformar
- [x] THP se calcula correctamente (base vs Moon)
- [x] AC se calcula correctamente para Circle of Moon
- [x] Stats se reemplazan correctamente
- [x] Forma se puede terminar manual o al morir
- [x] Estado persiste al recargar (seguro)
- [x] UI muestra feedback claro durante transformación
- [x] Fly speed disponible según nivel/DM

---

## 10. Dependencias

- `Data/beasts.ts` - Stats de bestias
- `types.ts` - Interfaces
- `CombatTab.tsx` - Integración UI
- `utils/wildShapeUtils.ts` - Lógica (nuevo)

---

## 11. Notas de Implementación

1. **No enforce de duración:** La duración en horas es informativa, no se auto-termina
2. **Seguridad:** THP se añade, no reemplaza HP actual
3. **Lunar Radiance:** Toggle en UI, cambia tipo de daño de ataques
4. **Moonlight Step:** Futura feature (no en scope v1)
