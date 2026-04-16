# Spell Selection Limits Design
## Fix Grimoire Spell Selection Limits for All Casters

### Date: 2026-04-01
### Status: validated

---

## Problem Statement

The grimoire UI does not correctly enforce spell selection limits. For example, a Ranger named Vermund has a maximum capacity of 2 spells at level 1, but the UI shows 4 as the limit, allowing incorrect spell selection.

---

## D&D 5e 2024 Spell Progression Rules

### Caster Types

| Type | Classes | Spell Learning |
|------|---------|----------------|
| **Full Caster** | Bard, Cleric, Druid, Sorcerer, Wizard | Spell Slots (Prepared or Known) |
| **Half Caster** | Paladin, Ranger | Spell Slots |
| **Third Caster** | Eldritch Knight, Arcane Trickster, Warrior of the Mystic Arts | Limited Spells Known |
| **Pact Caster** | Warlock | Pact Magic + Mystic Arcanum |
| **Special** | Magic Initiate feat | 1 level spell + cantrips |

### Spell Limits by Class and Level

#### CANTRIPS_KNOWN_BY_LEVEL
```
Bard:     1:2, 4:3, 10:4
Cleric:   1:3, 4:4, 10:5
Druid:    1:2, 4:3, 10:4
Sorcerer: 1:4, 4:5, 10:6
Warlock:  1:2, 4:3, 10:4
Paladin:  1:2, 4:3, 10:4
Ranger:   1:2, 4:3, 10:4
Wizard:   1:3, 4:4, 10:5
```

#### SPELLS_KNOWN_BY_LEVEL (Known Casters: Bard, Ranger, Sorcerer, Warlock)
```
Bard:     1:4,  2:5,  3:6,  4:7,  5:9,  6:10, 7:11, 8:12, 9:14, 10:15...
Druid:    1:4,  2:5,  3:6,  4:7,  5:9,  6:10, 7:11, 8:12, 9:14, 10:15...
Paladin:  1:2,  2:3,  3:4,  4:5,  5:6,  6:6,  7:7,  8:7,  9:8,  10:8...
Ranger:   1:2,  2:3,  3:4,  4:5,  5:6,  6:6,  7:7,  8:7,  9:8,  10:8...
Sorcerer: 1:2,  2:4,  3:6,  4:7,  5:9,  6:10, 7:11, 8:12, 9:14, 10:15...
Warlock:  1:2,  2:3,  3:4,  4:5,  5:6,  6:7,  7:8,  8:9,  9:10, 10:10...
```

#### MAX_SPELL_LEVEL (Highest Spell Level Available)
```
Full Caster:  1:1, 2:1, 3:2, 4:2, 5:3, 6:3, 7:4, 8:4, 9:5, 10:5...
Half Caster:  1:1, 2:1, 3:1, 4:1, 5:2, 6:2, 7:2, 8:2, 9:3, 10:3...
Pact Caster:  1:1, 2:1, 3:2, 4:2, 5:3, 6:3, 7:4, 8:4, 9:5, 10:5...
```

---

## Current Bug Analysis

### Bug Location: `SpellsTab.tsx` - `maxPreparedForActiveLevel` function

**Current Code (BUGGY):**
```javascript
// Line 215 - For Known Casters (Bard, Sorcerer, Ranger, Warlock)
if (SPELLS_KNOWN_BY_LEVEL[character.class]) {
    const totalKnown = getProgressiveValue(SPELLS_KNOWN_BY_LEVEL[character.class], character.level, 0);
    const currentTotalKnown = (character.preparedSpells || []).filter(s => SPELL_DETAILS[s]?.level !== 0).length;
    const currentOthers = currentTotalKnown - currentPreparedForActiveLevel;
    return Math.max(0, totalKnown - currentOthers + currentPreparedForActiveLevel); // BUG!
}
```

**Bug Explanation:**
For a Ranger with 4 level-1 spells selected (should be max 2):
- `totalKnown` = 2 (correct limit)
- `currentTotalKnown` = 4 (already has 4)
- `currentOthers` = 4 - 4 = 0
- Result: `2 - 0 + 4 = 6` (WRONG! Should be 2)

The formula `+ currentPreparedForActiveLevel` inflates the limit incorrectly.

---

## Corrected Design

### Formula Corrections

#### For KNOWN CASTERS (Bard, Ranger, Sorcerer, Warlock):
- The limit is **GLOBAL** (total spells known at current level)
- `maxPreparedForActiveLevel` = `totalKnown`
- The UI should show "currentAtLevel / totalKnown"

#### For PREPARED CASTERS (Cleric, Druid, Paladin, Wizard):
- The limit is based on **Spell Slots** available at that level
- `maxPreparedForActiveLevel` = `getSlots(effectiveCasterType, character.level, grimoireLevel)`
- Exception: Magic Initiate adds +1 to level 1 slots

#### For THIRD CASTERS (Eldritch Knight, Arcane Trickster):
- Follow spell-known tables similar to half casters
- `maxPreparedForActiveLevel` = based on their specific progression

#### For WARLOCK (Pact):
- Uses Pact Magic slots + Mystic Arcanum
- Slots work differently (recharge on short rest)
- Show slots per level, but limit spells by Pact Magic table

---

## Implementation Plan

### 1. Fix `maxPreparedForActiveLevel` Function

Replace the buggy formula with correct logic:

```javascript
const maxPreparedForActiveLevel = useMemo(() => {
    const grimoireLevel = activeLevel; // or use grimoireLevel

    // CASE 1: Cantrips (level 0)
    if (grimoireLevel === 0) {
        let count = 0;
        // Standard cantrips per class
        if (CANTRIPS_KNOWN_BY_LEVEL[character.class]) {
            count = getProgressiveValue(CANTRIPS_KNOWN_BY_LEVEL[character.class], character.level, 0);
        }
        // Third casters get 0 cantrips (they're not full casters)
        if (effectiveCasterType === 'third') {
            count = 0;
        }
        // Magic Initiate adds +2 cantrips from the feat's class
        if (magicInitiateType) count += 2;
        // Innate spells (species) don't count against cantrip limit
        return count;
    }

    // CASE 2: KNOWN CASTERS (Bard, Ranger, Sorcerer, Warlock)
    if (SPELLS_KNOWN_BY_LEVEL[character.class]) {
        // Return TOTAL spells known limit (not per-level remaining)
        return getProgressiveValue(SPELLS_KNOWN_BY_LEVEL[character.class], character.level, 0);
    }

    // CASE 3: THIRD CASTERS (Eldritch Knight, Arcane Trickster)
    if (effectiveCasterType === 'third') {
        // Use spells known table
        return getProgressiveValue(SPELLS_KNOWN_BY_LEVEL[character.subclass || ''], character.level, 0);
    }

    // CASE 4: PREPARED CASTERS (Cleric, Druid, Paladin, Wizard)
    // The limit is the number of spell SLOTS at this level
    const slots = getSlots(effectiveCasterType, character.level, grimoireLevel);

    // Exception: Magic Initiate adds +1 level 1 spell
    if (grimoireLevel === 1 && magicInitiateType) return slots + 1;

    // Exception: Ranger/Paladin have "Known Spells" not "Prepared"
    // But they still use slots as maximum prepared

    return slots;
}, [character.class, character.subclass, character.level, grimoireLevel, effectiveCasterType, magicInitiateType, character.preparedSpells]);
```

### 2. Fix `togglePreparedSpell` Validation

The validation should block adding when at limit:

```javascript
const togglePreparedSpell = (spellName: string) => {
    if (isReadOnly) return;
    const current = character.preparedSpells || [];
    const isPrepared = current.includes(spellName);
    const spellData = SPELL_DETAILS[spellName];
    if (!spellData) return;

    const isCantrip = spellData.level === 0;

    if (!isPrepared) {
        // BLOCK if at limit
        if (currentPreparedForActiveLevel >= maxPreparedForActiveLevel) {
            return; // Silently block - already shows limit reached
        }
        onUpdate({ ...character, preparedSpells: [...current, spellName] });
    } else {
        // Always allow removal
        onUpdate({ ...character, preparedSpells: current.filter(s => s !== spellName) });
    }
};
```

### 3. UI Display - Show Correct Limits

The grimoire should display:
- "X / Y" where Y is the correct maximum
- Progress bar that fills correctly
- Lock icon when at limit

---

## Summary of Changes

### Files to Modify:
1. **`components/sheet/SpellsTab.tsx`**

### Functions to Fix:
1. `maxPreparedForActiveLevel` - Correct formula for all caster types
2. `togglePreparedSpell` - Ensure it respects limits

### Key Fixes:
1. Known Casters: Return `totalKnown` (not inflated formula)
2. Cantrips: Return correct per-class limit
3. Third Casters: Handle separately from full casters
4. UI: Show correct "X / Y" limits

---

## Testing Checklist

- [ ] Ranger Level 1: Shows "0 / 2" for level 1 spells
- [ ] Ranger Level 1: Cannot add more than 2 spells
- [ ] Sorcerer Level 1: Shows "0 / 2" for spells, "0 / 4" for cantrips
- [ ] Wizard Level 1: Shows "2 / 2" for slots (2 level 1 slots)
- [ ] Cleric Level 1: Shows "2 / 2" for slots (2 level 1 slots)
- [ ] Warlock Level 1: Shows "1 / 1" for pact slot
- [ ] Magic Initiate: Adds +1 spell or +2 cantrips correctly
- [ ] Third Caster (Eldritch Knight): Respects spells known limit

---

## Open Questions

None - design is complete.
