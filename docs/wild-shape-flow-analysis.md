# Flujos: Esperado vs Real - Wild Shape System
**Dungeon Forge 2026-04-12**

---

## FLUJO 1: Transformación Normal (ESPERADO vs REAL)

### ESPERADO ✅
```
User clicks "Transformar"
         ↓
WildShapeModal opens (centered)
         ↓
getAllBeasts → filter by CR + Fly + Known Forms
         ↓
User selects "Lobo"
         ↓
transformIntoBeast(character: Druid, beast: Lobo)
         ├─ Snapshot originalStats: {STR: 10, DEX: 14, CON: 13, INT: 16, WIS: 14, CHA: 12}  ← DRUID
         ├─ Snapshot originalHP: {current: 40, max: 50, temp: 0}
         ├─ Snapshot originalAC: 14
         ├─ Calculate AC: max(12, 13 + WISmod=+2) = 15  [Circle of Moon]
         ├─ Replace stats: {STR: 12, DEX: 15, CON: 12, INT: 16, WIS: 14, CHA: 12}  ← STR/DEX/CON from Lobo, INT/WIS/CHA preserved
         ├─ Add THP: temp = 0 + 6 = 6  [3 × level untuk Circle of Moon]
         ├─ Decrement uses: wildShape {current: 2} → {current: 1}
         └─ Save to localStorage: {form: "Lobo", timestamp, originalStats, originalHP, originalAC, thpGained}
         ↓
Character is now: Lobo with Druid INT/WIS/CHA + 6 temp HP + AC 15

---

### REAL ❌
```
User clicks "Transformar"
         ↓
WildShapeModal opens (centered)  ✅
         ↓
getAllBeasts → filter by CR ✅ + Fly ❌ (invertida) + Known Forms ❌ (nunca poblada)
         ↓
Wrong beasts displayed ❌ (si Circle of Moon, no ve voladoras)
         ↓
User selects "Lobo"  (if visible)
         ↓
transformIntoBeast(character: Druid, beast: Lobo)
         ├─ Snapshot originalStats: {STR: 10, DEX: 14, CON: 13, INT: 16, WIS: 14, CHA: 12}  ✅
         ├─ Snapshot originalHP: {current: 40, max: 50, temp: 0}  ✅
         ├─ Snapshot originalAC: 14  ✅
         ├─ Calculate AC: max(12, 13 + WISmod=+1) = 13  ❌ [Usa WIS de Lobo (12) porque...]
         ├─ Replace stats: {STR: 12, DEX: 15, CON: 12, INT: 3, WIS: 12, CHA: 6}  ❌ TODO reemplazado, druid pierde INT/WIS/CHA
         ├─ Add THP: temp = 0 + 6 = 6  ✅
         ├─ Decrement uses: wildShape {current: 2} → {current: 1}  ✅
         └─ Save to localStorage: {form: "Lobo", timestamp}  ❌ (NO guarda originalStats/HP/AC)
         ↓
Character is now: Lobo {STR: 12, DEX: 15, CON: 12, INT: 3, WIS: 12, CHA: 6} + 6 temp HP + AC 13

PROBLEMA: Druid permanentemente sin INT/WIS/CHA (INT 3 como Lobo)
```

---

## FLUJO 2: Restauración (ESPERADO vs REAL)

### ESPERADO ✅
```
Character is in Lobo form (transformed)
wildShapeState = snapshot from transformation
useCount: {current: 1, max: 2}  ✅ Ya fue decrementado
         ↓
User clicks "Terminar Forma"
         ↓
restoreOriginalForm(character, wildShapeState)
         ├─ Restore stats: {STR: 10, DEX: 14, CON: 13, INT: 16, WIS: 14, CHA: 12}  ← Druid original
         ├─ Restore HP: {current: 40, max: 50}
         ├─ Restore AC: 14
         ├─ KEEP uses at 1: wildShape {current: 1, max: 2}  ← MAINTAINED, not reset
         ├─ Clear activeWildShape: undefined
         └─ Clear localStorage: remove("wildshape_${id}")
         ↓
Character back to: Druid {STR: 10, INT: 16, WIS: 14, AC: 14}
Still has: {current: 1} uses (waits for Long Rest to refill to 2)
```

### REAL ❌
```
Character is in Lobo form (transformed)
wildShapeState = snapshot (with WRONG stats)
useCount: {current: 1, max: 2}  ✅
         ↓
User clicks "Terminar Forma"
         ↓
restoreOriginalForm(character, wildShapeState)
         ├─ Restore stats: {STR: 10, DEX: 14, CON: 13, INT: 3, WIS: 12, CHA: 6}  ❌ Snapshot had WRONG stats
         ├─ Restore HP: {current: 40, max: 50}  ✅
         ├─ Restore AC: Could be 14 or wrong  ⚠️
         ├─ RESTORE uses to max: wildShape {current: 1} → {current: 2} ❌ ADDS 1 instead of keeping
         ├─ Clear activeWildShape: undefined  ✅
         └─ Clear localStorage: remove()  ✅
         ↓
Character back to: Druid {STR: 10, INT: 3, WIS: 12, CHA: 6, AC: ???}
Bonus: {current: 2} uses (REFILLED! Can use again immediately!)

PROBLEM 1: Stats still WRONG (INT: 3 from Lobo)
PROBLEM 2: Uses refilled to max (should stay at 1)
```

---

## FLUJO 3: Page Reload While Transformed (ESPERADO vs REAL)

### ESPERADO ✅
```
BEFORE RELOAD:
Character: {stats: Lobo, hp: Lobo, ac: 13, activeWildShape: "Lobo"}
localStorage: {form: "Lobo", originalStats: Druid stats, originalHP: Druid HP, originalAC: 14, ...}
         ↓
Player presses F5 (reload)
         ↓
CombatTab useEffect runs
         ├─ Load localStorage: {form: "Lobo", originalStats: DRUID, originalHP: DRUID, ...}  ✅
         ├─ Reconstruct wildShapeState with CORRECT data
         │  originalStats: {STR: 10, INT: 16, WIS: 14, CHA: 12}  ← DRUID
         │  originalHP: {current: 40, max: 50} ← DRUID
         │  originalAC: 14  ← DRUID
         └─ setWildShapeState to reconstructed state
         ↓
Page displays: "Lobo form" correctly with Druid original data preserved
         ↓
User clicks "Terminar Forma"
         ├─ Restore to Druid original stats  ✅
         ├─ Restore to Druid original HP     ✅
         └─ Druid is FINE
```

### REAL ❌
```
BEFORE RELOAD:
Character: {stats: Lobo, hp: Lobo, ac: 13, activeWildShape: "Lobo"}
localStorage: {form: "Lobo", timestamp}  ❌ Missing original data
         ↓
Player presses F5 (reload)
         ↓
CombatTab useEffect runs
         ├─ Load localStorage: {form: "Lobo", timestamp}  ⚠️
         ├─ Reconstruct wildShapeState with WRONG data
         │  originalStats: character.stats = {STR: 12, INT: 3, WIS: 12, CHA: 6}  ❌ LOBO STATS!
         │  originalHP: {...character.hp} = {current: 60, max: 70}  ❌ LOBO HP!
         │  originalAC: character.ac = 13  ❌ LOBO AC!
         └─ setWildShapeState to reconstructed state (but wrong!)
         ↓
Page displays: "Lobo form" with WRONG backup data
         ↓
User clicks "Terminar Forma"
         ├─ Restore to "original" (which is Lobo)  ❌
         ├─ Restore HP to "original" (which is Lobo)  ❌
         └─ DRUID PERMANENTLY BECOMES: {STR: 10??, INT: 3, WIS: 12, CHA: 6} + extra uses!

CATASTROPHIC: Druid is PERMANENTLY CORRUPTED
```

---

## FLUJO 4: Multiple Transformations in Same Session (ESPERADO vs REAL)

### ESPERADO ✅
```
START: wildShape {current: 2, max: 2}
         ↓
Transform 1: Wolf
└─ wildShape {current: 1, max: 2}
         ↓
Restore 1: Back to Druid
└─ wildShape {current: 1, max: 2}  ← Stays at 1
         ↓
Combat continues... (Hour passes)
         ↓
Transform 2: Hawk
└─ wildShape {current: 0, max: 2}
         ↓
Restore 2: Back to Druid
└─ wildShape {current: 0, max: 2}  ← No more uses
         ↓
Can't transform again until Long Rest
```

### REAL ❌
```
START: wildShape {current: 2, max: 2}
         ↓
Transform 1: Wolf
└─ wildShape {current: 1, max: 2}  ✅
         ↓
Restore 1: Back to Druid
└─ wildShape {current: 2, max: 2}  ❌ REFILLED TO MAX!
         ↓
Combat continues...
         ↓
Transform 2: Hawk
└─ wildShape {current: 1, max: 2}  ✅
         ↓
Restore 2: Back to Druid
└─ wildShape {current: 2, max: 2}  ❌ REFILLED AGAIN to max
         ↓
Can transform AGAIN (should be impossible)
         ↓
Transform 3: Lion (should not be possible!)
└─ wildShape {current: 1, max: 2}  ❌ Violates D&D 5e rules
```

**Player gets 3+ transformations from 2 uses. BROKEN!**

---

## FLUJO 5: Circle of the Moon AC Bug

### ESPERADO ✅
```
Druid: WIS 16 (+3 modifier)
Level 6, Circle of the Moon
         ↓
Transform to Lobo (AC 12, WIS 12)
         ├─ Calculate AC: max(beastAC, 13 + DRUID WISmod)
         └─ max(12, 13 + 3) = 16
         ↓
Result: AC 16  ✅ CORRECT
Reason: Druid's WIS is high, offsets low base AC of Lobo
```

### REAL ❌
```
Druid: WIS 16 (+3 modifier)  ← Original
Level 6, Circle of the Moon
         ↓
Transform to Lobo (AC 12, WIS 12)
         ├─ Calculate AC: max(beastAC, 13 + (LOBO WISmod = +1))
         │  [Because WIS was REPLACED with Lobo WIS, useď WIS 12]
         └─ max(12, 13 + 1) = 14
         ↓
Result: AC 14  ❌ WRONG (should be 16)
Reason: Code uses Lobo's WIS (12) instead of preserving Druid's WIS (16)

Penalty: 2 AC lower than should be (enemy has +4 to hit chance)
```

---

## COMPARISON TABLE: Stats Before/After Transform

### ESPERADO ✅
```
BEFORE TRANSFORM                    AFTER TRANSFORM
├─ STR:       10                    ├─ STR:       12 (Lobo)  ✅
├─ DEX:       14                    ├─ DEX:       15 (Lobo)  ✅
├─ CON:       13                    ├─ CON:       12 (Lobo)  ✅
├─ INT:       16 ← Druid's brains   ├─ INT:       16 ← PRESERVED  ✅
├─ WIS:       14 ← Druid's senses   ├─ WIS:       14 ← PRESERVED  ✅
├─ CHA:       12 ← Druid's charm    ├─ CHA:       12 ← PRESERVED  ✅
├─ AC:        14                    ├─ AC:        max(12, 13+2) = 15  ✅
├─ HP Current: 40                   ├─ HP Current:  40  ✅
├─ HP Max:    50                    ├─ HP Max:     50  ✅
└─ HP Temp:   0                     └─ HP Temp:    6  (+3×level for Circle of Moon)  ✅
```

### REAL ❌
```
BEFORE TRANSFORM                    AFTER TRANSFORM
├─ STR:       10                    ├─ STR:       12 (Lobo)  ✅
├─ DEX:       14                    ├─ DEX:       15 (Lobo)  ✅
├─ CON:       13                    ├─ CON:       12 (Lobo)  ✅
├─ INT:       16 ← Druid's brains   ├─ INT:       3 ← REPLACED with LOBO  ❌
├─ WIS:       14 ← Druid's senses   ├─ WIS:       12 ← REPLACED with LOBO  ❌
├─ CHA:       12 ← Druid's charm    ├─ CHA:       6 ← REPLACED with LOBO  ❌
├─ AC:        14                    ├─ AC:        max(12, 13+1) = 14  ❌ (should be 15)
├─ HP Current: 40                   ├─ HP Current:  40  ✅
├─ HP Max:    50                    ├─ HP Max:     50  ✅
└─ HP Temp:   0                     └─ HP Temp:    6  ✅

CONSEQUENCE: Druid is now INT 3 Lobo (loses wizard spells, etc.)
```

---

## SUMMARY: Flow Correctness

| Flow | Expected | Real | Issues |
|------|----------|------|--------|
| **Normal Transform** | ✅ Save snapshot, replace STR/DEX/CON, preserve INT/WIS/CHA | ❌ Replace ALL stats | INT/WIS/CHA lost |
| **Restore after Transform** | ✅ Restore original, keep uses count | ❌ Restore WRONG stats, refill uses | Stats corrupted, infinite uses |
| **Page Reload Transformed** | ✅ Load snapshot, restore correctly | ❌ Load incomplete, restore WRONG data | PERMANENT corruption |
| **Multiple Transforms** | ✅ Decrement per use, refill on Long Rest | ❌ Refill on each restore | Infinite transformations |
| **Circle of Moon AC** | ✅ max(beastAC, 13+druidWIS) | ❌ max(beastAC, 13+beastWIS) | AC 2 points too low |
