# Análisis Completo de Lógica Wild Shape - Dungeon Forge
**Fecha**: 2026-04-12  
**Objetivo**: Verificación de 5 condiciones críticas del sistema Wild Shape

---

## CONDICIÓN 1: Flujo de Modal (Apertura)

### ¿Qué ESPERA que haga?
1. Usuario ve botón "Transformar" en WildShapePanel
2. Click en botón abre WildShapeModal centrado en pantalla
3. Modal recibe `character.wildShapeForms` (bestias conocidas)
4. Modal obtiene usos disponibles: `character.wildShape.current`
5. Modal debe ser cerrable (presionar fuera o botón X)

### ¿Qué REALMENTE HACE?

| Paso | Código | Resultado | ✅/❌ |
|------|--------|-----------|-------|
| 1. Botón visible | `WildShapePanel.tsx:115-126` | Mostrado si nivel ≥ 2 y es Druida | ✅ |
| 2. Click abre modal | `CombatTab.tsx:152-157` | `setShowWildShapeModal(true)` | ✅ |
| 3. Estado modal | `CombatTab.tsx:70` | State: `showWildShapeModal` | ✅ |
| 4. Centrado en pantalla | `WildShapeModal.tsx:205` | `position: fixed`, `height: 100dvh`, `items-center justify-center` | ✅ |
| 5. Backdrop touchable | `WildShapeModal.tsx:206-209` | `onClick={onClose}` cubre fondo | ✅ |
| 6. Botón cerrar (X) | `WildShapeModal.tsx:226-230` | Icono `close` + `onClick={onClose}` | ✅ |
| 7. Props recibidas | `WildShapeModal.tsx:47-54` | `isOpen`, `onClose`, `character`, `onSelect` | ✅ |
| 8. wildShapeForms accedida | `WildShapeModal.tsx:57` | `character.wildShapeForms` (opcional) | ✅ |

### Conclusión Condición 1
✅ **FUNCIONA CORRECTAMENTE** - Modal abre, centra, recibe props correctas, cierra sin problemas.

---

## CONDICIÓN 2: Filtrado de Bestias

### ¿Qué ESPERA que haga?

**Para Druida Nivel 2 (Estándar)**:
```
maxCR = 0.25  (porque 2 < 4)
Bestias esperadas: Lobo (0.25), Araña (0.25), Rata (0), Caballo (0.25), Jabalí (0.25)
Resultado: ~5 bestias
```

**Para Druida Nivel 2 (Circle of the Moon)**:
```
maxCR = floor(2/3) = 0  (solo CR 0)
Bestias esperadas: Solo Rata (CR 0)
Resultado: 1 bestia
```

**Para Druida Nivel 4 (Estándar)**:
```
maxCR = 0.5
Bestias esperadas: Bestias nivel 2 + Bestias nivel 4 CR ≤ 0.5
Resultado: ~8 bestias
```

**Para Druida Nivel 6 (Estándar)**:
```
maxCR = 0.5  [Druid estándar, nivel 6 < 8]
Bestias esperadas: Nivel 2 + Nivel 4 + Nivel 6 (solo si CR ≤ 0.5)
Resultado: ??? (depende de qué hay en WILD_SHAPE_BEASTS[6])
```

**Para Druida Nivel 6 (Circle of the Moon)**:
```
maxCR = floor(6/3) = 2
Bestias esperadas: Serpiente (CR 2), + cualquier otra CR ≤ 2
Resultado: ...depende
```

**Para Druida Nivel 8 (Estándar)**:
```
maxCR = 1
Bestias esperadas: Todas nivel 2, 4, 6, 8 con CR ≤ 1
Resultado: Oso (1), León (1), Tigre (1), Águila (1), Hiena (1), Pulpo (1)
```

### ¿Qué REALMENTE HACE?

#### Paso 1: Obtener beasts por nivel
**Código**: `Data/beasts.ts:380-400`
```typescript
export const getBeastsForLevel = (druidLevel: number): BeastStats[] => {
  const beasts: BeastStats[] = [];
  
  if (druidLevel >= 8)  beasts.push(...WILD_SHAPE_BEASTS[8]);
  if (druidLevel >= 6)  beasts.push(...WILD_SHAPE_BEASTS[6]);
  if (druidLevel >= 4)  beasts.push(...WILD_SHAPE_BEASTS[4]);
  if (druidLevel >= 2)  beasts.push(...WILD_SHAPE_BEASTS[2]);
  
  return beasts;
};
```

**Resultado**: Lista completa sin filtrar por CR.

#### Paso 2: Calcular maxCR
**Código**: `wildShapeUtils.ts:5-11`
```typescript
export const getMaxCRForLevel = (druidLevel: number, isCircleOfTheMoon: boolean): number => {
  if (isCircleOfTheMoon) {
    return Math.floor(druidLevel / 3);
  }
  if (druidLevel >= 8) return 1;
  if (druidLevel >= 4) return 0.5;
  return 0.25;
};
```

**Resultado por nivel**:
| Nivel | Estándar | Circle of Moon |
|-------|----------|----------------|
| 2 | 0.25 | 0 |
| 4 | 0.5 | 1 |
| 6 | 0.5 | 2 |
| 8 | 1 | 2 |

✅ Correcto según D&D 5e.

#### Paso 3: Filtrar por CR + Fly + Known Forms
**Código**: `wildShapeUtils.ts:60-73`
```typescript
export const getAvailableBeasts = (
  druidLevel: number,
  isCircleOfTheMoon: boolean,
  knownForms?: string[]
): BeastStats[] => {
  const maxCR = getMaxCRForLevel(druidLevel, isCircleOfTheMoon);
  const allBeasts = getBeastsForLevel(druidLevel);
  
  const filteredBeasts = allBeasts.filter(beast => {
    if (beast.cr > maxCR) return false;                              // ← CR FILTER
    if (!canUseFlySpeed(druidLevel, isCircleOfTheMoon, !!beast.flySpeed)) 
      return false;                                                   // ← FLY FILTER
    if (knownForms && knownForms.length > 0 && !knownForms.includes(beast.name)) 
      return false;                                                   // ← KNOWN FORMS FILTER
    return true;
  });
  
  return filteredBeasts;
};
```

**Análisis de Filtros**:

| Filter | Lógica | Resultado |
|--------|--------|-----------|
| `beast.cr > maxCR` | Rechaza si CR > max | ✅ Correcto |
| `canUseFlySpeed()` | Rechaza si tiene flySpeed pero no puede usar | ⚠️ **PROBLEMA** |
| `knownForms` | Rechaza si no está en lista de conocidas | ⚠️ **PROBLEMA** |

#### 🚨 PROBLEMA DETECTADO: canUseFlySpeed Lógica Invertida
**Código**: `wildShapeUtils.ts:48-54`
```typescript
export const canUseFlySpeed = (
  druidLevel: number,
  isCircleOfTheMoon: boolean,
  beastHasFlySpeed: boolean
): boolean => {
  if (isCircleOfTheMoon) return beastHasFlySpeed;
  return druidLevel >= 8 && beastHasFlySpeed;
};
```

**Lo que hace**: Retorna `true` si PUEDE usar fly speed.

**Pero en getAvailableBeasts**:
```typescript
if (!canUseFlySpeed(...)) return false;  // ← Si PUEDE volar, ¿por qué rechaza?
```

**ESTO ES INCORRECTO**. Debería ser:
```typescript
if (beastHasFlySpeed && !canUseFlySpeed(...)) return false;  // ← Rechaza solo si tiene fly pero NO puede
```

Actualmente, rechaza todas las bestias que PUEDEN volar cuando el druid está en Circle of the Moon.

#### 🚨 PROBLEMA DETECTADO: knownForms Sin Inicialización
**Código**: `types.ts` (Character interface)
```typescript
wildShapeForms?: string[];  // Opcional, puede estar undefined
```

**En modal**:
```typescript
const availableBeasts = useMemo(() => {
  return getAvailableBeasts(druidLevel, isCircleOfTheMoon, character.wildShapeForms);
}, [druidLevel, isCircleOfTheMoon, character.wildShapeForms]);
```

**Lógica en getAvailableBeasts**:
```typescript
if (knownForms && knownForms.length > 0 && !knownForms.includes(beast.name)) 
  return false;
```

Si `knownForms` es `undefined`, esto funciona (pasa el primer check).  
Pero si luego se pone un array vacío `[]`, rechaza TODO porque `knownForms.length === 0` es falso.

✅ FUNCIONA si está `undefined`, pero frágil si alguien lo llena sin bestias.

### ¿Qué está en WILD_SHAPE_BEASTS?

Según `Data/beasts.ts:30-370`:

```typescript
WILD_SHAPE_BEASTS = {
  1: [],                           // Level 1: vacío
  2: [                             // Level 2-3: CR 1/4
    Lobo (CR 0.25),
    Araña (CR 0.25),
    Rata (CR 0),
    Caballo (CR 0.25),
    Jabalí (CR 0.25)
  ],
  4: [                             // Level 4-7: CR 1/4 - 1/2
    Búho gigante (CR 0.25),
    Caballo de guerra (CR 0.5),
    Cocodrilo (CR 0.5),
    ...más
  ],
  6: [                             // Level 6+: Circle of Moon
    Serpiente constrictora gigante (CR 2)
  ],
  8: [                             // Level 8+: CR 1
    Oso pardo (CR 1),
    León (CR 1),
    Tigre (CR 1),
    Águila gigante (CR 1),
    Hiena gigante (CR 1),
    Pulpo gigante (CR 1)
  ]
}
```

### Matriz de Resultados Esperados vs Reales

| Scenario | Level | Subclass | maxCR | Beasts getBeastsForLevel | Esperado | Real | ✅/❌ |
|----------|-------|----------|-------|-------------------------|----------|------|-------|
| A | 2 | Estándar | 0.25 | Nivel 2 (5 beasts) | Lobo, Araña, Rata, Caballo, Jabalí | Todos CR ≤ 0.25 | ✅ |
| B | 2 | Circle Moon | 0 | Nivel 2 (5 beasts) | Solo Rata (CR 0) | Rata (1) | ✅ |
| C | 4 | Estándar | 0.5 | Nivel 2+4 (~8 beasts) | Búho, Caballo guerra, Cocodrilo, ... | Todos CR ≤ 0.5 | ✅ |
| D | 4 | Circle Moon | 1 | Nivel 2+4 (~8 beasts) | Todos que CR ≤ 1 | Todos | ✅ |
| E | 6 | Estándar | 0.5 | Nivel 2+4+6 (~9 beasts) | Solo nivel 2+4 (Serpiente rechazada) | **PROBLEMA**: Serpiente (CR 2) rechazada but... | ⚠️ |
| F | 6 | Circle Moon | 2 | Nivel 2+4+6 (~9 beasts) | Todos nivel 2+4+6, Serpiente incluida | Serpiente (2), ... | ✅ |
| G | 8 | Estándar | 1 | Nivel 2+4+6+8 (~15 beasts) | Solo CR ≤ 1: Oso, León, Tigre, Águila, Hiena, Pulpo, ... | CR 1 items | ✅ |
| H | 8 | Circle Moon | 2 | Nivel 2+4+6+8 (~15 beasts) | Todos menos Serpiente (solo Circle Moon) | Todos | ✅ |

### ⚠️ PROBLEMA CRÍTICO EN SCENARIO E
Druida Nivel 6 Estándar:
- maxCR = 0.5
- getBeastsForLevel() retorna: [Nivel 2 todos, Nivel 4 todos, **Serpiente CR 2**]
- getAvailableBeasts() filtra:
  - Serpiente (CR 2 > 0.5) → **RECHAZADA** ✅ Correcto
  - Lobo, Araña, etc. (CR ≤ 0.5) → **ACEPTADAS** ✅ Correcto

**Resultado**: Funciona, pero Druida Nivel 6 Estándar NUNCA ve Nivel 6 bestias porque son Circle of Moon only.

### Conclusión Condición 2

| Aspecto | Estado |
|---------|--------|
| CR Filtering | ✅ Funciona |
| Fly Speed Logic | ❌ **INVERTIDA** - rechaza cuando PUEDE volar |
| Known Forms | ✅ Funciona (pero frágil) |
| getMaxCRForLevel | ✅ Correcto |
| getBeastsForLevel | ✅ Correcto |
| **OVERALL** | ⚠️ **CR FUNCIONA, FLY SPEED ROTO** |

---

## CONDICIÓN 3: Adopción de Stats (transformIntoBeast)

### ¿Qué ESPERA que haga?

1. Reemplazar stats del druida con stats de bestia EXCEPTO INT, WIS, CHA
2. Crear snapshot de stats originales, HP, AC
3. Calcular AC según Circle of the Moon (max(beastAC, 13+WIS) o beastAC)
4. Agregar THP: druidLevel (estándar) o druidLevel×3 (Circle of Moon)
5. Decrementar usos: `.wildShape.current -= 1`
6. Guardar en localStorage con form name
7. Guardar `character.activeWildShape = "Nombre Bestia"`

### ¿Qué REALMENTE HACE?

**Código**: `wildShapeUtils.ts:75-109`

```typescript
export const transformIntoBeast = (
  character: Character,
  beast: BeastStats
): { updatedChar: Character; wildShapeState: WildShapeState } => {
  const isCircleOfTheMoon = character.subclass === 'Circle of the Moon';
  const druidLevel = character.level;
  
  // SNAPSHOT
  const snapshot: WildShapeState = {
    form: beast.name,
    originalStats: { ...character.stats } as Record<Ability, number>,
    originalHP: { ...character.hp },
    originalAC: character.ac,
    thpGained: getTHPForWildShape(druidLevel, isCircleOfTheMoon),
    startedAt: Date.now(),
    isLunarRadiance: false
  };
  
  // AC CALCULATION
  const newAC = calculateWildShapeAC(character, beast.ac);
  
  // UPDATE CHARACTER
  const updatedChar: Character = {
    ...character,
    hp: {
      ...character.hp,
      temp: character.hp.temp + snapshot.thpGained    // ← ADD THP to temp HP pool
    },
    ac: newAC,
    stats: { ...beast.stats },                         // ← REPLACE ALL STATS
    activeWildShape: beast.name,
    wildShape: character.wildShape
      ? {
          current: Math.max(0, character.wildShape.current - 1),
          max: character.wildShape.max
        }
      : { current: getWildShapeUsesForLevel(druidLevel) - 1, max: getWildShapeUsesForLevel(druidLevel) }
  };
  
  saveWildShapeToLocalStorage(character.id, beast.name);
  
  return { updatedChar, wildShapeState: snapshot };
};
```

#### Análisis Línea por Línea

| Paso | Código | Espera | Real | ✅/❌ |
|------|--------|--------|------|-------|
| 1. Snapshot INT/WIS/CHA | `wildShapeUtils.ts:88-95` | Guardar para restaurar | Snapshot `originalStats` todos | ❌ |
| 2. Snapshot HP | `line 95` | Guardar HP original | `originalHP: {...hp}` | ✅ |
| 3. Snapshot AC | `line 96` | Guardar AC original | `originalAC: character.ac` | ✅ |
| 4. THP Calculation | `line 97` | +druidLevel o +3×druidLevel | `getTHPForWildShape()` | ✅ |
| 5. AC Calculation | `line 100` | max(beastAC, 13+WIS) o beastAC | `calculateWildShapeAC()` | ✅ |
| 6. Replace ALL stats | `line 108` | Reemplazar STR/DEX/CON, BUT preservar INT/WIS/CHA | `stats: {...beast.stats}` | ❌ **REEMPLAZA TODO** |
| 7. THP al temp HP | `line 105` | Agregar a temp HP pool | `temp: character.hp.temp + thpGained` | ✅ |
| 8. Decrement uses | `lines 111-116` | Restar 1 de usos | `current - 1` | ✅ |
| 9. Save to localStorage | `line 118` | Persistir transformación | `saveWildShapeToLocalStorage()` | ✅ |
| 10. activeWildShape set | `line 110` | Marcar forma activa | `activeWildShape: beast.name` | ✅ |

#### 🚨 PROBLEMA CRÍTICO: Stats Completamente Reemplazados

Las reglas D&D 5e dicen:
> "You retain the benefit of any features from your class, feats, or other sources and can use them if your new form is physically capable of using them."
> "Your INT, WIS, CHA unchanged" (específicamente para Druida Estándar)

**Código actual**:
```typescript
stats: { ...beast.stats }  // ← Reemplaza STR, DEX, CON, INT, WIS, CHA, TODO
```

**Debería ser**:
```typescript
stats: {
  STR: beast.stats.STR,
  DEX: beast.stats.DEX,
  CON: beast.stats.CON,
  INT: character.stats.INT,    // ← Preservar
  WIS: character.stats.WIS,    // ← Preservar (importante para Circle of Moon AC!)
  CHA: character.stats.CHA     // ← Preservar
}
```

**Impacto**: Circle of the Moon AC calculation `13 + wisMod` usa WIS de bestia (generalmente 10), NO del druid.

### ¿Qué Hace calculateWildShapeAC?

**Código**: `wildShapeUtils.ts:36-45`

```typescript
export const calculateWildShapeAC = (
  character: Character,
  beastAC: number
): number => {
  const isCircleOfTheMoon = character.subclass === 'Circle of the Moon';
  if (isCircleOfTheMoon) {
    const wisMod = Math.floor((character.stats.WIS - 10) / 2);
    return Math.max(beastAC, 13 + wisMod);
  }
  return beastAC;
};
```

**Problema**: 
- En `transformIntoBeast`, WIS ya fue reemplazada con bestia WIS
- Entonces `character.stats.WIS` es del ANIMAL, no del druid
- Resultado: AC = `max(beastAC, 13 + (beastWIS mod))`

**Debería ser**:
```typescript
const wisMod = Math.floor((character.stats.WIS - 10) / 2);  // ← USA BESTIA WIS (INCORRECTO)
// Debería usar: Math.floor((originalWIS - 10) / 2)
```

### Conclusión Condición 3

| Aspecto | Espera | Real | ✅/❌ |
|---------|--------|------|-------|
| Stats STR/DEX/CON | Reemplazar con bestia | ✅ Reemplazado | ✅ |
| Stats INT/WIS/CHA | Preservar druid | ❌ Reemplazado con bestia | ❌ |
| Snapshot orig stats | Guardar Druid original | ✅ Guardado | ✅ |
| THP Calculation | +druidLevel o +3×level | ✅ Correcto | ✅ |
| AC Circle of Moon | max(beastAC, 13+druidWISmod) | ❌ Usa beastWIS | ❌ |
| AC Estándar | beastAC | ✅ Correcto | ✅ |
| Decrement uses | wildShape.current -= 1 | ✅ Correcto | ✅ |
| activeWildShape set | Marcar forma activa | ✅ Correcto | ✅ |
| localStorage save | Persistir transformación | ✅ Correcto | ✅ |
| **OVERALL** | | | **❌ STATS INT/WIS/CHA REEMPLAZADOS** |

---

## CONDICIÓN 4: Restauración de Stats (restoreOriginalForm)

### ¿Qué ESPERA que haga?

1. Restaurar Stats originales (guardados en snapshot)
2. Restaurar HP original
3. Restar THP del pool de HP temporal
4. Restaurar AC original
5. Limpiar `activeWildShape`
6. **NO** restaurar usos (ya fueron decrementados)
7. Limpiar localStorage

### ¿Qué REALMENTE HACE?

**Código**: `wildShapeUtils.ts:124-154`

```typescript
export const restoreOriginalForm = (
  character: Character,
  wildShapeState: WildShapeState
): Character => {
  const druidLevel = character.level;
  
  // REMOVE THP
  let newHP = { ...character.hp };
  if (newHP.temp > 0) {
    newHP.temp = Math.max(0, newHP.temp - wildShapeState.thpGained);
  }
  
  // RESTORE CHARACTER
  const restoredChar: Character = {
    ...character,
    hp: {
      ...wildShapeState.originalHP,      // ← Restore original HP
      temp: newHP.temp                    // ← Keep adjusted temp HP
    },
    ac: wildShapeState.originalAC,       // ← Restore original AC
    stats: { ...wildShapeState.originalStats },  // ← Restore all stats (including INT/WIS/CHA)
    activeWildShape: undefined,          // ← Clear active transformation
    wildShape: character.wildShape
      ? {
          current: Math.min(character.wildShape.max, character.wildShape.current + 1),
          max: character.wildShape.max
        }
      : { current: getWildShapeUsesForLevel(druidLevel), max: getWildShapeUsesForLevel(druidLevel) }
  };
  
  clearWildShapeFromLocalStorage(character.id);
  
  return restoredChar;
};
```

#### 🚨 PROBLEMA CRÍTICO: Restaura Usos

**El código hace**:
```typescript
wildShape: character.wildShape
  ? {
      current: Math.min(character.wildShape.max, character.wildShape.current + 1),  // ← SUMA 1
      max: character.wildShape.max
    }
```

**ESTO ES INCORRECTO**. 

**Flujo esperado**:
1. Druid nivel 6, Circle of Moon: wildShape = {current: 2, max: 2}
2. Transforma a Serpiente: wildShape = {current: 1, max: 2}
3. Pelea 1 hora
4. Restaura: wildShape = {current: 1, max: 2}  ← **DEBERÍA MANTENER EN 1**
5. Toma Long Rest: wildShape = {current: 2, max: 2}  ← RECUPERA aquí

**Pero el código hace**:
4. Restaura: wildShape = {current: 2, max: 2}  ← **RESTAURA A MAX!!**

**Impacto**: Druid puede transformarse infinitas veces dentro del mismo Long Rest (transforma, termina, vuelve a tener usos).

#### ¿Es Intencional?

Tal vez sea un feature para testeo, pero violaría reglas D&D 5e:
> "You can use this feature **a number of times equal to your Wisdom modifier** (minimum of once), and you regain expended uses when you finish a long rest."

### Conclusión Condición 4

| Aspecto | Espera | Real | ✅/❌ |
|---------|--------|------|-------|
| Restore original stats | Todos (INT/WIS/CHA incluido) | Restaurado de snapshot | ✅ |
| Restore HP | Restaurar original | ✅ Restaurado | ✅ |
| Remove THP | Restar THP ganado | ✅ Restado | ✅ |
| Restore AC | Restaurar originalAC | ✅ Restaurado | ✅ |
| Clear activeWildShape | Setear a undefined | ✅ Undefined | ✅ |
| **DO NOT restore uses** | Mantener decrementado | ❌ **RESTAURA A MAX** | ❌ |
| Clear localStorage | Limpiar persisted state | ✅ Limpiado | ✅ |
| **OVERALL** | | | **❌ RESTAURA USOS INCORRECTAMENTE** |

---

## CONDICIÓN 5: Persistencia

### ¿Qué ESPERA que haga?

1. **Guardar en localStorage** al transformar:
   - Key: `wildshape_${characterId}`
   - Value: `{ form: "Nombre", timestamp: Date.now() }`
2. **Cargar en localStorage** al abrir sheet:
   - Si existe en localStorage Y `character.activeWildShape` == savedbeast
   - Reconstruir wildShapeState en memoria
3. **Datos en localStorage** deben persistir al recargar página
4. **Limpiar localStorage** al restaurar forma
5. **Character.activeWildShape** debe persistir en character JSON
6. **Character.wildShapeForms** debe persistir (bestias conocidas)

### ¿Qué REALMENTE HACE?

#### Guardar al Transformar
**Código**: `wildShapeUtils.ts:156-168`

```typescript
export const saveWildShapeToLocalStorage = (characterId: string, formName: string): void => {
  try {
    localStorage.setItem(
      `wildshape_${characterId}`,
      JSON.stringify({
        form: formName,
        timestamp: Date.now()
      })
    );
  } catch (e) {
    console.error('Failed to save wild shape state:', e);
  }
};
```

**Resultado**: ✅ Guarda key `wildshape_${id}` con form + timestamp

#### Cargar al Montar
**Código**: `CombatTab.tsx:101-119`

```typescript
useEffect(() => {
  let char = character;
  if (char.class === 'Druid' && !char.wildShape) {
    char = initializeWildShapeUses(char);
    onUpdate(char);
  }
  
  const saved = getWildShapeFromLocalStorage(char.id);
  if (saved && char.activeWildShape) {
    const beast = getBeastByName(saved.form);
    if (beast) {
      setWildShapeState({
        form: saved.form,
        originalStats: char.stats as Record<Ability, number>,  // ← ⚠️ CURRENT STATS, NOT ORIGINAL
        originalHP: { ...char.hp },                             // ← ⚠️ CURRENT HP, NOT ORIGINAL
        originalAC: char.ac,                                    // ← ⚠️ CURRENT AC, NOT ORIGINAL
        thpGained: char.class === 'Druid' && char.subclass === 'Circle of the Moon'
            ? char.level * 3
            : char.level,
        startedAt: saved.timestamp,
        isLunarRadiance: false
      });
    }
  }
}, [character, onUpdate]);
```

#### 🚨 PROBLEMA DETECTADO: Datos Originales Perdidos

Cuando se recarga la página mientras transformado:
- localStorage tiene: `{form: "Lobo", timestamp: 123456}`
- Character objeto tiene: `{stats: {bestia}, hp: {ajustado}, activeWildShape: "Lobo"}`
- localStorage NO tiene los stats originales del druid

Cuando CombatTab se monta:
```typescript
originalStats: char.stats as Record<Ability, number>,  // ← Estos son STATS DE BESTIA, no druid
```

**Flujo Problemático**:
1. Druid: STR 10, WIS 16, AC 14
2. Transforma a Lobo: STR 12, WIS 12, AC 12
3. localStorage: `{form: "Lobo", timestamp}`
4. character.stats: `{STR: 12, WIS: 12, ...}`
5. character.activeWildShape: "Lobo"
6. **Página recarga**
7. CombatTab carga localStorage: succeed
8. Intenta reconstruir wildShapeState:
   - originalStats = {STR: 12, WIS: 12, ...}  ← **INCORRECTO, debería ser STR 10, WIS 16**
9. Si usuario presiona "Terminar Forma":
   - Restaura a {STR: 12, WIS: 12, ...}  ← **DRUID PERMANENTEMENTE CON STATS DE BESTIA**

#### ¿Qué Debería Ser?

localStorage debería guardar:
```typescript
{
  form: "Lobo",
  timestamp: 123456,
  originalStats: { STR: 10, DEX: ..., CON: ..., INT: ..., WIS: 16, CHA: 13 },
  originalHP: { current: 45, max: 50, temp: 0 },
  originalAC: 14,
  thpGained: 6
}
```

Entonces al recargar, se restauran correctamente todos los datos.

#### Limpiar localStorage
**Código**: `wildShapeUtils.ts:170-177`

```typescript
export const clearWildShapeFromLocalStorage = (characterId: string): void => {
  try {
    localStorage.removeItem(`wildshape_${characterId}`);
  } catch (e) {
    console.error('Failed to clear wild shape state:', e);
  }
};
```

✅ Funciona al restaurar forma.

#### Character.activeWildShape Persistencia

**En types.ts**:
```typescript
activeWildShape?: string;  // Seguro: bestia activa al recargar
```

**Se guarda en character JSON**: Depende de cómo se persista character (localStorage, Supabase, etc.)

En CombatTab:
```typescript
const updatedChar: Character = {
  ...character,
  activeWildShape: beast.name
};
onUpdate(updatedChar);  // ← Pasa al parent para guardar
```

✅ Se guarda si onUpdate persiste el character.

#### Character.wildShapeForms Persistencia

**En types.ts**:
```typescript
wildShapeForms?: string[];  // Bestias conocidas por el Druida
```

**Nunca se actualiza en el código**. No hay función que agregue bestias a esta lista.

```
// No existe:
wildShapeForms.push(selectedBeastName);
```

❌ **wildShapeForms siempre vacío/undefined**.

### Conclusión Condición 5

| Aspecto | Espera | Real | ✅/❌ |
|---------|--------|------|-------|
| Guardar en localStorage | form + timestamp | ✅ Guardado | ✅ |
| Key formato | `wildshape_${id}` | ✅ Correcto | ✅ |
| Cargar en localStorage | Reconstructs state | ⚠️ Sin datos originales | ⚠️ |
| Datos originales persistidos | originalStats/HP/AC | ❌ **PERDIDOS** | ❌ |
| Recarga página + restaurar | Recupera original | ❌ **USA STATS DE BESTIA** | ❌ |
| Limpiar localStorage | Remove en restaurar | ✅ Correcto | ✅ |
| activeWildShape persisted | En character JSON | ✅ Si onUpdate funciona | ✅ |
| wildShapeForms persisted | Lista de bestias conocidas | ❌ **NUNCA ACTUALIZADO** | ❌ |
| **OVERALL** | | | **❌ DATOS ORIGINALES PERDIDOS EN RELOAD** |

---

## RESUMEN EJECUTIVO

### Matriz de Verificación Final

| Condición | Aspecto | Espera | Real | Crítica |
|-----------|---------|--------|------|---------|
| 1. Modal | Apertura/Cierre | ✅ | ✅ | ✅ |
| **2. Filtrado** | **CR Filter** | ✅ | ✅ | ✅ |
| | Fly Speed Logic | ✅ | ❌ **INVERTIDA** | 🔴 |
| | getMaxCRForLevel | ✅ | ✅ | ✅ |
| | wildShapeForms | ✅ | ⚠️ Frágil | ⚠️ |
| **3. Transform** | **Reemplazar STR/DEX/CON** | ✅ | ✅ | ✅ |
| | **Preservar INT/WIS/CHA** | ✅ | ❌ **REEMPLAZA TODO** | 🔴 |
| | THP Calculation | ✅ | ✅ | ✅ |
| | AC Calculation | ⚠️ | ❌ **USA BEAST WIS** | 🔴 |
| | Save to localStorage | ✅ | ✅ | ✅ |
| **4. Restore** | **Decrement uses** | ✅ | ❌ **RESTAURA A MAX** | 🔴 |
| | Restore stats | ✅ | ✅ | ✅ |
| | Restore HP/AC | ✅ | ✅ | ✅ |
| | Clear localStorage | ✅ | ✅ | ✅ |
| **5. Persist** | **Save form + timestamp** | ✅ | ✅ | ✅ |
| | **Guardar datos originales** | ✅ | ❌ **PERDIDOS** | 🔴 |
| | **Cargar datos al reload** | ✅ | ❌ **USA STATS BEAST** | 🔴 |
| | wildShapeForms tracking | ✅ | ❌ **NUNCA ACTUALIZADO** | 🔴 |

### Problemas Críticos Identificados

| # | Problema | Archivo | Línea | Severidad | Impacto |
|---|----------|---------|-------|-----------|---------|
| 1 | canUseFlySpeed lógica invertida | wildShapeUtils.ts | 62 | 🔴 CRÍTICA | Rechaza bestias voladoras cuando el druid PUEDE volarlas |
| 2 | Stats INT/WIS/CHA reemplazados | wildShapeUtils.ts | 108 | 🔴 CRÍTICA | Druid pierde INT/WIS/CHA (no puede recuperar hechizos, etc.) |
| 3 | AC Circle of Moon usa beast WIS | wildShapeUtils.ts | 100-41 | 🔴 CRÍTICA | AC incorrecta (13 + bestiaWIS en lugar de 13 + druidWIS) |
| 4 | restoreOriginalForm restaura usos | wildShapeUtils.ts | 144-146 | 🔴 CRÍTICA | Druid puede transformarse infinitas veces |
| 5 | localStorage pierde datos originales | wildShapeUtils.ts | 158-168 | 🔴 CRÍTICA | Recargar mientras transformado = stats permanentemente corruptos |
| 6 | wildShapeForms nunca se actualiza | CombatTab.tsx | -- | 🟡 IMPORTANTE | Filtro de "bestias conocidas" nunca funciona |
| 7 | wildShapeForms nunca inicializado | types.ts | -- | 🟡 IMPORTANTE | Undefined puede causar bugs en filtrado |

---

## PLAN DE CORRECCIÓN RECOMENDADO

### Prioridad 1 (Bloqueos Críticos)
1. **Separar INT/WIS/CHA en transform** - wildShapeUtils.ts:108
2. **Guardar datos originales en localStorage** - wildShapeUtils.ts:158-168
3. **Cargar datos originales en CombatTab** - CombatTab.tsx:101-119
4. **Restaurar usos INCORRECTAMENTE** - wildShapeUtils.ts:144-146

### Prioridad 2 (Lógica Invertida)
5. **Corregir canUseFlySpeed filter** - wildShapeUtils.ts:62
6. **Usar druid WIS en AC calculation** - wildShapeUtils.ts:41

### Prioridad 3 (Features Incompletos)
7. **Implementar wildShapeForms tracking** - CombatTab + transformIntoBeast
8. **Inicializar wildShapeForms en CreatorSteps** - Probablemente ya hecho

---

**Análisis completado**: 2026-04-12 12:45 UTC
