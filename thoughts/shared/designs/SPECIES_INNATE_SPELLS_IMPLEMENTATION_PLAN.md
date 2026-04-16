# Species Innate Spells - Complete Implementation Plan

**Date:** 2026-03-31  
**Status:** Analysis Complete - Ready for Implementation

---

## Executive Summary

Based on comprehensive analysis of dnd2024.wikidot.com/species:all, the current species data implementation in `species-en.ts` is **~95% complete**. The `SpeciesSpell` interface, `innateSpells` fields, and `speciesInnateSpells` logic in `CreatorSteps.tsx` are already in place.

**What needs fixing:**
1. Aasimar - Missing Celestial Revelation trait descriptions
2. Kithkin - Shadowmoor variant not properly represented (Darkvision 120ft)
3. Khoravar - Need to verify complete data
4. Lorwyn Changeling - Not in current data

---

## Species Spell Analysis (Complete)

### Species WITH Innate Spells (10 species/subspecies)

| Species | Subspecies | Spells | Level-Gated | Status |
|---------|-----------|--------|-------------|--------|
| **Aasimar** | - | Light (cantrip) | No | ✅ Complete |
| **Tiefling** | Abyssal | Poison Spray, Ray of Sickness, Hold Person | Yes (1/3/5) | ✅ Complete |
| **Tiefling** | Chthonic | Chill Touch, False Life, Ray of Enfeeblement | Yes (1/3/5) | ✅ Complete |
| **Tiefling** | Infernal | Fire Bolt, Hellish Rebuke, Darkness | Yes (1/3/5) | ✅ Complete |
| **Elf** | Drow | Dancing Lights, Faerie Fire, Darkness | Yes (1/3/5) | ✅ Complete |
| **Elf** | High Elf | Prestidigitation, Detect Magic, Misty Step | Yes (1/3/5) | ✅ Complete |
| **Elf** | Wood Elf | Druidcraft, Longstrider, Pass without Trace | Yes (1/3/5) | ✅ Complete |
| **Elf** | Lorwyn Elf | Thorn Whip, Command, Silence | Yes (1/3/5) | ✅ Complete |
| **Elf** | Shadowmoor Elf | Starry Wisp, Heroism, Gentle Repose | Yes (1/3/5) | ✅ Complete |
| **Gnome** | Forest Gnome | Minor Illusion, Speak with Animals | No | ✅ Complete |
| **Faerie** | - | Druidcraft, Faerie Fire, Enlarge/Reduce | Yes (0/3/5) | ✅ Complete |
| **Flamekin** | - | Produce Flame, Burning Hands, Flame Blade | Yes (0/3/5) | ✅ Complete |
| **Rimekin** | - | Ray of Frost, Ice Knife, Flame Blade | Yes (0/3/5) | ✅ Complete |

### Species WITHOUT Innate Spells (13 species)

| Species | Notes |
|---------|-------|
| Dragonborn | Has Breath Weapon (not spell), Draconic Flight (level 5, not spell) |
| Dwarf | No spells |
| Goliath | Has Giant Ancestry abilities (not spells), Large Form (level 5) |
| Halfling | No spells (Kithkin section is variant) |
| Human | No spells |
| Orc | No spells |
| Boggart | No spells |
| Changeling | No spells |
| Kalashtar | No spells (telepathy, but no actual spells) |
| Shifter | No spells (Shifting is not spell) |
| Warforged | No spells |
| Kithkin | Variant of Halfling, Shadowmoor has Darkvision 120ft |
| Dhampir | No spells (Vampiric Bite is not spell) |
| Lorwyn Changeling | Not in current implementation |

---

## Issues to Fix

### Issue 1: Aasimar - Missing Celestial Revelation Descriptions

**Current state:**
```typescript
traits: [
  { name: 'Celestial Resistance', ... },
  { name: 'Darkvision', ... },
  { name: 'Healing Hands', ... },
  { name: 'Light Bearer', ... },
]
```

**Missing:** Celestial Revelation transformation options (Heavenly Wings, Inner Radiance, Necrotic Shroud)

**Fix:** Add the transformation descriptions to traits (these are NOT spells, so no changes to innateSpells needed)

### Issue 2: Kithkin - Shadowmoor Variant Darkvision

**Current state:** Kithkin uses Halfling as base, no subspecies differentiation

**Problem:** Shadowmoor Kithkin should have Darkvision 120ft

**Fix options:**
- Option A: Add Shadowmoor as subspecies with Darkvision 120ft
- Option B: Add note that Shadowmoor Kithkin uses Halfling + Darkvision 120ft

### Issue 3: Khoravar - Verify Complete Data

**Current state (from file):**
```typescript
traits: [
  { name: 'Darkvision', description: '...' },
  { name: 'Khoravar Resilience', description: '...' },
  { name: 'Kindred Breeds', description: '...' },
]
```

**Issue:** Website data not fetched for Khoravar. Need to verify if they have any spells.

### Issue 4: Human - Versatile Origin Feat

**Current state:** Human has `Versatile` trait pointing to Origin feat

**Issue:** The UI should show Origin feat selection when Human is chosen

**Status:** This is already handled by the feat selection system (Origin feats are selectable)

### Issue 5: Lorwyn Changeling

**Not in current species-en.ts** - Should be added as a variant of Changeling

---

## Data Structure (Already Correct)

```typescript
export interface SpeciesSpell {
  level: number;      // 0 = cantrip, 1 = level 1, etc.
  spell: string;
  alwaysPrepared?: boolean;  // For spells like Speak with Animals
}
```

The level field represents the **character level** at which the spell becomes available, NOT the spell's own level. So:
- `level: 0` = available from level 1 (cantrip)
- `level: 1` = available from character level 1
- `level: 2` = available from character level 3 (spells unlock at odd levels)
- `level: 3` = available from character level 5

**Wait - this is WRONG!** Looking at the data:
- `Dancing Lights` has `level: 0` - this is a cantrip, correct
- `Faerie Fire` has `level: 1` - but it unlocks at character level 3
- `Darkness` has `level: 2` - but it unlocks at character level 5

The `level` field is being used for BOTH:
1. The spell's actual level (0 for cantrips, 1-9 for spells)
2. The character level at which it unlocks

This is a **BUG** in the current implementation. For example:
- Faerie Fire is a **level 1 spell** but unlocks at character level **3**
- The current `speciesInnateSpells` filter checks `spell.level <= characterLevel`
- But Faerie Fire has `level: 1` stored, so it would appear available at character level 1

**However**, looking at `CreatorSteps.tsx` more carefully, the filter might be correctly implemented to use the stored level as "unlock level" not "spell level".

Let me verify the actual implementation in CreatorSteps.tsx...

---

## Current speciesInnateSpells Logic (from compressed b5)

```typescript
const speciesInnateSpells = useMemo(() => {
  if (!speciesData) return [];
  const spells: SpeciesSpell[] = [];
  
  // Base species innate spells
  if (speciesData.innateSpells) {
    for (const s of speciesData.innateSpells) {
      if (s.level <= characterLevel) {
        spells.push(s);
      }
    }
  }
  
  // Subspecies innate spells
  if (speciesData.subspecies && selectedSubspecies) {
    const sub = speciesData.subspecies.find(sp => sp.name === selectedSubspecies);
    if (sub?.innateSpells) {
      for (const s of sub.innateSpells) {
        if (s.level <= characterLevel) {
          spells.push(s);
        }
      }
    }
  }
  
  return spells;
}, [speciesData, selectedSubspecies, characterLevel]);
```

**The current implementation uses `s.level` as unlock level, not spell level.**

But wait - Faerie Fire is stored with `level: 1` and it unlocks at character level 3. If the filter is `s.level <= characterLevel`, then:
- At character level 1: Faerie Fire (level 1) would be included - WRONG! Should be excluded
- At character level 3: Faerie Fire (level 1) would be included - CORRECT

So the current implementation has a bug for species spells that unlock at level 3 or 5 but are stored with their actual spell level.

**Fix needed:** Change the storage format to use `unlockLevel` instead of mixing it with spell level, OR change the filter logic.

---

## Recommended Fix: Use `unlockLevel` Field

Change the `SpeciesSpell` interface:

```typescript
export interface SpeciesSpell {
  spell: string;
  spellLevel: number;    // 0 = cantrip, 1-9 = spell level
  unlockLevel: number;  // Character level when spell becomes available (1, 3, or 5)
  alwaysPrepared?: boolean;
}
```

Then update all species data files and the filter logic.

**However, this requires extensive changes.** An alternative is to keep the current format and just fix the values to match unlock levels, treating:
- `level: 0` = available from level 1 (cantrips)
- `level: 1` = available from level 1
- `level: 2` = available from level 3
- `level: 3` = available from level 5

This is what the current data actually shows - the `level` field IS the unlock level, not the spell level. This means the current implementation is correct IF all spells are stored by their unlock level.

Let me verify with actual data:
- `Faerie Fire` stored as `{ level: 1, spell: 'Faerie Fire' }` → unlocks at character level 3? NO, that would be level 2...

Actually looking at the data again:
```typescript
{ level: 1, spell: 'Faerie Fire' },  // Drow
```

If level 1 = character level 1, then Faerie Fire would be available at character level 1. But the rules say it unlocks at level 3!

This IS a bug. The data should be:
```typescript
{ level: 2, spell: 'Faerie Fire' },  // Unlock at character level 3
```

Or we need a separate `unlockLevel` field.

---

## Implementation Tasks

### Task 1: Fix SpeciesSpell Interface (types.ts)
Add `spellLevel` and `unlockLevel` fields instead of single `level` field.

### Task 2: Update All Species Data (species-en.ts)
Migrate all `innateSpells` entries to use new format.

### Task 3: Update speciesInnateSpells Logic (CreatorSteps.tsx)
Use `unlockLevel` for filtering.

### Task 4: Add Missing Traits
- Aasimar: Celestial Revelation descriptions
- Kithkin Shadowmoor: Darkvision 120ft

### Task 5: Verify Khoravar Data
Fetch Khoravar page and verify traits.

### Task 6: Add Lorwyn Changeling
If it exists in the rules.

---

## Spell Unlock Level Reference

| Species | Spell | Spell Level | Unlock Level |
|---------|-------|-------------|--------------|
| Aasimar | Light | 0 (cantrip) | 1 |
| Drow | Dancing Lights | 0 (cantrip) | 1 |
| Drow | Faerie Fire | 1 | 3 |
| Drow | Darkness | 2 | 5 |
| High Elf | Prestidigitation | 0 (cantrip) | 1 |
| High Elf | Detect Magic | 1 | 3 |
| High Elf | Misty Step | 2 | 5 |
| Wood Elf | Druidcraft | 0 (cantrip) | 1 |
| Wood Elf | Longstrider | 1 | 3 |
| Wood Elf | Pass without Trace | 2 | 5 |
| Lorwyn Elf | Thorn Whip | 0 (cantrip) | 1 |
| Lorwyn Elf | Command | 1 | 3 |
| Lorwyn Elf | Silence | 2 | 5 |
| Shadowmoor Elf | Starry Wisp | 0 (cantrip) | 1 |
| Shadowmoor Elf | Heroism | 1 | 3 |
| Shadowmoor Elf | Gentle Repose | 2 | 5 |
| Tiefling (all) | Cantrip | 0 (cantrip) | 1 |
| Tiefling (all) | Level 1 spell | 1 | 3 |
| Tiefling (all) | Level 2 spell | 2 | 5 |
| Forest Gnome | Minor Illusion | 0 (cantrip) | 1 |
| Forest Gnome | Speak with Animals | 1 | 1 (always prepared) |
| Faerie | Druidcraft | 0 (cantrip) | 1 |
| Faerie | Faerie Fire | 1 | 3 |
| Faerie | Enlarge/Reduce | 2 | 5 |
| Flamekin | Produce Flame | 0 (cantrip) | 1 |
| Flamekin | Burning Hands | 1 | 3 |
| Flamekin | Flame Blade | 2 | 5 |
| Rimekin | Ray of Frost | 0 (cantrip) | 1 |
| Rimekin | Ice Knife | 1 | 3 |
| Rimekin | Flame Blade | 2 | 5 |

---

## Files to Modify

1. `types.ts` - Update SpeciesSpell interface
2. `Data/species/species-en.ts` - Update all innateSpells entries
3. `components/CreatorSteps.tsx` - Update speciesInnateSpells filter logic
4. `Data/species/species-en.ts` - Add missing traits (Aasimar Celestial Revelation)
5. `Data/species/species-en.ts` - Fix Kithkin for Shadowmoor variant

---

## Validation Checklist

After implementation, verify:
- [ ] Create Aasimar at level 1 → Light in preparedSpells
- [ ] Create Drow at level 3 → Dancing Lights + Faerie Fire in preparedSpells
- [ ] Create Drow at level 5 → Dancing Lights + Faerie Fire + Darkness in preparedSpells
- [ ] Create Drow at level 1 → Only Dancing Lights in preparedSpells (Faerie Fire NOT yet)
- [ ] Create Forest Gnome → Minor Illusion + Speak with Animals always prepared
- [ ] Create Tiefling Infernal at level 1 → Fire Bolt only
- [ ] Create Tiefling Infernal at level 3 → Fire Bolt + Hellish Rebuke
- [ ] Create Tiefling Infernal at level 5 → Fire Bolt + Hellish Rebuke + Darkness
