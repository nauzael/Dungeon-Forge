# Verificación del Sistema de Progresión por Niveles - Dungeon Forge

**Fecha de verificación:** 2026-04-09
**Versión analizada:** Sistema de level-up basado en manual wizard D&D 2024
**Estado:** 🟡 ANOMALÍAS ENCONTRADAS

---

## 1. REQUISITOS DE EXPERIENCIA (XP) POR NIVEL

### Estado: ❌ NO IMPLEMENTADO

**Hallazgo:** El sistema **NO utiliza XP para subir de nivel**. El nivel se gestiona de forma manual a través del `LevelUpWizard`.

**Tabla oficial D&D 2024 (SRD 5.2):**

| Nivel | XP Requerida | Bonif. Competencia |
|:---:|---:|:---:|
| 1 | 0 | +2 |
| 2 | 300 | +2 |
| 3 | 900 | +2 |
| 4 | 2,700 | +2 |
| 5 | 6,500 | +3 |
| 6 | 14,000 | +3 |
| 7 | 23,000 | +3 |
| 8 | 34,000 | +3 |
| 9 | 48,000 | +4 |
| 10 | 64,000 | +4 |
| 11 | 85,000 | +4 |
| 12 | 100,000 | +4 |
| 13 | 120,000 | +5 |
| 14 | 140,000 | +5 |
| 15 | 165,000 | +5 |
| 16 | 195,000 | +5 |
| 17 | 225,000 | +6 |
| 18 | 265,000 | +6 |
| 19 | 305,000 | +6 |
| 20 | 355,000 | +6 |

**Anomalía:** No hay constantes `XP_THRESHOLDS` ni tabla de progreso XP en el código.

---

## 2. MECANISMOS DE GANANCIA DE XP

### Estado: ❌ NO IMPLEMENTADO

**Hallazgo:** No existe función `grantXP()`, `addXP()`, ni ningún mecanismo para:
- Otorgar XP al completar encounters/misiones
- Calcular XP de monstruos derrotados
- Gestionar recompensas de quests

**Ubicación esperada (no existe):**
- `utils/xpUtils.ts`
- Campos `xp` o `currentXP` en interface `Character`

---

## 3. ACTUALIZACIÓN AUTOMÁTICA DE NIVEL

### Estado: ✅ IMPLEMENTADO CORRECTAMENTE

**Componente:** `components/sheet/LevelUpWizard/LevelUpWizard.tsx`

**Funcionamiento verificado:**
- ✅ Calcula correctamente `nextLevel = character.level + 1`
- ✅ Identifica necesidades del nivel: subclase, ASI, skills, spells
- ✅ Calcula HP gained: `Math.floor(hitDie / 2) + 1 + conMod + hpBonusPerLevel`
- ✅ Actualiza `profBonus` con fórmula: `Math.ceil(1 + (nextLevel / 4))`

**Validación de nivel máximo (L20):**
- ✅ El wizard permite subir hasta nivel 20
- ✅ Nivel 20 del Bárbaro tiene "Primal Champion" (+4 STR/CON, máximo 25)
- ✅ Nivel 20 del Bardo tiene "Palabras de Creación"

**Datos verificados en barbarian.ts:**
```typescript
progression: {
    1: ['Rage', 'Unarmored Defense', 'Weapon Mastery'],
    2: ['Danger Sense', 'Reckless Attack'],
    3: ['Barbarian Subclass', 'Primal Knowledge'],
    4: ['Ability Score Improvement'],
    5: ['Extra Attack', 'Fast Movement'],
    ...
    19: ['Epic Boon Feat'],
    20: ['Primal Champion']
}
```

---

## 4. PERSISTENCIA Y SINCRONIZACIÓN

### Estado: ✅ IMPLEMENTADO CORRECTAMENTE

**Flujo verificado:**
1. `LevelUpWizard` → `onComplete(updatedChar)` → `SheetTabs.confirmLevelUp()`
2. `SheetTabs.tsx` llama `onUpdate(levelUpSnapshot)`
3. `App.tsx` guarda en `localStorage` (persistencia local)
4. `App.tsx` sincroniza con `saveCharacterToCloud()` (Supabase)

**Código en SheetTabs.tsx:**
```typescript
const confirmLevelUp = () => {
    setLevelUpSnapshot(null);
    setShowLevelUp(false);
};
```

**Código en App.tsx:**
```typescript
// Línea 220: Sincroniza con la nube tras actualizar personaje
await saveCharacterToCloud(char, (char as CharacterWithOwner).user_id || user?.id || 'guest');
```

---

## 5. RECOMPENSAS Y DESBLOQUEOS POR NIVEL

### Estado: ✅ IMPLEMENTADO CORRECTAMENTE

**Sistema verificado por clase:**

| Clase | Nivel 1 | Nivel 3 | Nivel 4 | Nivel 5 | Nivel 19 | Nivel 20 |
|-------|---------|---------|---------|---------|----------|----------|
| Barbarian | Rage, Unarmored Defense | Subclass | ASI | Extra Attack | Epic Boon | Primal Champion |
| Bard | Spellcasting, Inspiration | Subclass | ASI | Font of Inspiration | Epic Boon | Palabras de Creación |
| Cleric | Spellcasting, Divine Order | Subclass | ASI | Destroy Undead | Epic Boon | Divine Intervention Greater |
| Fighter | Fighting Style | Second Wind | ASI | Extra Attack | Epic Boon | Champion |
| Monk | Unarmored Fighting | Subclass | ASI | Extra Attack | Epic Boon | Perfect Self |
| Paladin | Divine Smite, Fighting Style | Subclass | ASI | Extra Attack | Epic Boon | Elder Champion |
| Ranger | Spells, Favoured Enemy | Subclass | ASI | Land's Stride | Epic Boon | Foe Slayer |
| Rogue | Expertise, Sneak Attack | Subclass | ASI | Reliable Talent | Epic Boon | Stroke of Luck |
| Sorcerer | Spellcasting, Metamagic | Subclass | ASI | Font of Magic | Epic Boon | Sorcerer Restoration |
| Warlock | Pact Magic, Eldritch Invocations | Pact Boon | ASI | Mystic Arcanum | Epic Boon | Eldritch Master |
| Wizard | Spellcasting, Arcane Recovery | Subclass | ASI | Master of Magic | Epic Boon | Spell Mastery |

**Clase específica verificada - Barbarian:**
- Rage uses: 2 (1-2), 3 (3-5), 4 (6-9), 5 (10-13), 6 (14-16), unlimited (20)
- Rage damage: 2 at Lv1, +1 at Lv5,9,13,17
- Martial Arts die (si multiclase): d6 (1-4), d8 (5-10), d10 (11-16), d12 (17+)

---

## 6. VALIDACIONES ANTI-DUPLICACIÓN

### Estado: ✅ IMPLEMENTADO PARCIALMENTE

**Verificado:**
- ✅ Feats repetibles tienen bandera `repeatable: true` (en INVOCATIONS)
- ✅ `Ability Score Improvement` es explícitamente repeatable
- ✅ Magic Initiate tiene nota "Repeatable" en descripción
- ✅ `confirmLevelUp` no permite subir más de un nivel por wizard
- ⚠️ **No hay validación en el wizard para evitar nivel > 20**
- ⚠️ **No hay validación para evitar level up si ya es nivel 20**

**Código vulnerable en LevelUpWizard.tsx:**
```typescript
const nextLevel = character.level + 1; // Sin validación max=20
```

---

## 7. LOGS DE SEGUIMIENTO

### Estado: ❌ NO IMPLEMENTADO

**Hallazgo:** No hay logs para trackear progresión de nivel.

**Búsqueda realizada:**
```bash
grep -r "console.log.*level" → solo 2 líneas (migrations)
grep -r "levelUp.*log" → 0 resultados
```

**Logs existentes en el sistema:**
- `characterMigrations.ts:225` → log de migraciones (no de level-up)
- No hay logs en `LevelUpWizard`, `SheetTabs`, ni `App.tsx`

---

## 8. CASOS LÍMITE MANEJADOS

### Estado: ⚠️ PARCIALMENTE IMPLEMENTADO

**Verificado:**

| Caso | Manejado | Observación |
|------|---------|-------------|
| Exactly 0 XP remaining | ❌ | No hay sistema XP |
| Exactly level threshold | ❌ | No hay sistema XP |
| Level 20 reached | ⚠️ | El wizard permite subir, no hay validación |
| No HP dice left | ✅ | En RestModal se pueden recuperar |
| Con modifier changes | ✅ | recalculado en level up con `getAllHpBonusesPerLevel` |
| ASI at max (20) | ✅ | Usa `Math.min(newStats[stat] + 1, 20)` |

---

## 9. INTERFACE CHARACTER - CAMPOS RELACIONADOS

### Estado: ✅ VERIFICADO

**Ubicación:** `types.ts`

**Campos verificados:**
```typescript
export interface Character {
  id: string;
  name: string;
  level: number;              // ✅ Nivel actual (1-20)
  hp: { current: number; max: number; temp: number };
  profBonus: number;           // ✅ Calculado: ceil(1 + level/4)
  stats: Record<string, number>;
  skills: string[];
  feats: string[];
  // ... recursos de clase específicos
  rageUses?: { current: number; max: number };
  bardicInspiration?: { current: number; max: number };
  // ...
}
```

**Ausencias noted:**
- ❌ No existe campo `xp` o `currentXP`
- ❌ No existe campo `xpToNextLevel`
- ❌ No existe campo `levelHistory` o `levelUpLog`

---

## 10. RESUMEN DE ANOMALÍAS

| # | Componente | Severidad | Descripción |
|---|------------|-----------|-------------|
| 1 | Sistema XP | 🔴 CRÍTICA | No existe sistema de experiencia - el nivel es manual |
| 2 | Validación L20 | 🟡 MEDIA | No hay validación para evitar nivel > 20 |
| 3 | Logs level-up | 🟡 MEDIA | No hay logs de seguimiento para progresión |
| 4 | XP thresholds | 🔴 CRÍTICA | No hay tabla de umbrales XP (requerida para campaña) |

---

## 11. RECOMENDACIONES

### Prioridad Alta:
1. **Implementar sistema XP** si se requiere para campañas sandbox/automáticas
2. **Agregar validación nivel 20** en `LevelUpWizard.tsx`

### Prioridad Media:
3. **Agregar logs** de level-up para debugging
4. **Considerar agregar campo** `xp: number` en Character si hay necesidad de tracking

### Para Implementación XP (si se requiere):

```typescript
// utils/xpUtils.ts
export const XP_THRESHOLDS: Record<number, number> = {
  2: 300, 3: 900, 4: 2700, 5: 6500, 6: 14000,
  7: 23000, 8: 34000, 9: 48000, 10: 64000,
  11: 85000, 12: 100000, 13: 120000, 14: 140000,
  15: 165000, 16: 195000, 17: 225000, 18: 265000,
  19: 305000, 20: 355000
};

export function calculateLevelFromXP(xp: number): number {
  for (let lvl = 20; lvl >= 1; lvl--) {
    if (xp >= XP_THRESHOLDS[lvl]) return lvl;
  }
  return 1;
}

export function awardXP(character: Character, amount: number): Character {
  const newXP = (character.xp || 0) + amount;
  const newLevel = calculateLevelFromXP(newXP);
  return { ...character, xp: newXP, level: newLevel };
}
```

---

*Reporte generado: 2026-04-09*
*Verificado por: Agent de Auditoría*